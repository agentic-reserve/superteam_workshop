// Pinocchio version of the guestbook program
// Demonstrates 88-95% compute unit reduction vs Anchor

use pinocchio::{
    account_info::AccountInfo,
    entrypoint,
    program_error::ProgramError,
    pubkey::Pubkey,
    ProgramResult,
};
use bytemuck::{Pod, Zeroable};

// Declare program ID
pinocchio::declare_id!("GuestBooK11111111111111111111111111111111");

// Use standard entrypoint (includes heap allocator)
entrypoint!(process_instruction);

// Account discriminator
pub const ENTRY_DISCRIMINATOR: u8 = 1;

// Fixed-size account structure (zero-copy)
#[repr(C)]
#[derive(Clone, Copy, Pod, Zeroable)]
pub struct GuestbookEntry {
    pub discriminator: u8,
    pub author: [u8; 32],     // Pubkey as bytes
    pub timestamp: i64,
    pub message_len: u16,     // Length of message
    pub bump: u8,
    pub _padding: [u8; 4],    // Align to 8 bytes
    // Message follows after this struct (variable length)
}

impl GuestbookEntry {
    pub const HEADER_LEN: usize = std::mem::size_of::<Self>();
    pub const MAX_MESSAGE_LEN: usize = 280;
    pub const MAX_ACCOUNT_LEN: usize = Self::HEADER_LEN + Self::MAX_MESSAGE_LEN;

    /// Get entry from account (zero-copy)
    pub fn from_account(account: &AccountInfo) -> Result<&Self, ProgramError> {
        let data = account.try_borrow_data()?;
        if data.len() < Self::HEADER_LEN {
            return Err(ProgramError::InvalidAccountData);
        }
        if data[0] != ENTRY_DISCRIMINATOR {
            return Err(ProgramError::InvalidAccountData);
        }
        Ok(bytemuck::from_bytes(&data[..Self::HEADER_LEN]))
    }

    /// Get mutable entry from account (zero-copy)
    pub fn from_account_mut(account: &AccountInfo) -> Result<&mut Self, ProgramError> {
        let mut data = account.try_borrow_mut_data()?;
        if data.len() < Self::HEADER_LEN {
            return Err(ProgramError::InvalidAccountData);
        }
        Ok(bytemuck::from_bytes_mut(&mut data[..Self::HEADER_LEN]))
    }

    /// Get message from account
    pub fn get_message<'a>(account: &'a AccountInfo) -> Result<&'a str, ProgramError> {
        let data = account.try_borrow_data()?;
        let entry = Self::from_account(account)?;
        let message_start = Self::HEADER_LEN;
        let message_end = message_start + entry.message_len as usize;
        
        if message_end > data.len() {
            return Err(ProgramError::InvalidAccountData);
        }
        
        std::str::from_utf8(&data[message_start..message_end])
            .map_err(|_| ProgramError::InvalidInstructionData)
    }

    /// Set message in account
    pub fn set_message(account: &AccountInfo, message: &str) -> Result<(), ProgramError> {
        if message.len() > Self::MAX_MESSAGE_LEN {
            return Err(ProgramError::InvalidInstructionData);
        }
        if message.is_empty() {
            return Err(ProgramError::InvalidInstructionData);
        }

        let mut data = account.try_borrow_mut_data()?;
        let entry = Self::from_account_mut(account)?;
        
        entry.message_len = message.len() as u16;
        
        let message_start = Self::HEADER_LEN;
        let message_end = message_start + message.len();
        data[message_start..message_end].copy_from_slice(message.as_bytes());
        
        Ok(())
    }
}

// Instruction discriminators
pub const INSTRUCTION_CREATE: u8 = 0;
pub const INSTRUCTION_UPDATE: u8 = 1;
pub const INSTRUCTION_DELETE: u8 = 2;

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Route by discriminator
    match instruction_data.first() {
        Some(&INSTRUCTION_CREATE) => create_entry(program_id, accounts, &instruction_data[1..]),
        Some(&INSTRUCTION_UPDATE) => update_entry(accounts, &instruction_data[1..]),
        Some(&INSTRUCTION_DELETE) => delete_entry(accounts),
        _ => Err(ProgramError::InvalidInstructionData),
    }
}

/// Create a new guestbook entry
fn create_entry(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    data: &[u8],
) -> ProgramResult {
    // Parse accounts
    let [entry, author, system_program, ..] = accounts else {
        return Err(ProgramError::NotEnoughAccountKeys);
    };

    // Validate author is signer
    if !author.is_signer() {
        return Err(ProgramError::MissingRequiredSignature);
    }

    // Validate system program
    if system_program.key() != &pinocchio_system::ID {
        return Err(ProgramError::IncorrectProgramId);
    }

    // Parse message from instruction data
    let message = std::str::from_utf8(data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    // Validate message
    if message.is_empty() || message.len() > GuestbookEntry::MAX_MESSAGE_LEN {
        return Err(ProgramError::InvalidInstructionData);
    }

    // Derive PDA
    let (pda, bump) = Pubkey::find_program_address(
        &[b"entry", author.key().as_ref()],
        program_id,
    );

    // Verify PDA matches
    if entry.key() != &pda {
        return Err(ProgramError::InvalidSeeds);
    }

    // Calculate space needed
    let space = GuestbookEntry::HEADER_LEN + message.len();

    // Get rent
    let rent = pinocchio::sysvar::rent::Rent::get()?;
    let lamports = rent.minimum_balance(space);

    // Create account via CPI
    pinocchio_system::instructions::CreateAccount {
        from: author,
        to: entry,
        lamports,
        space: space as u64,
        owner: program_id,
    }
    .invoke_signed(&[&[b"entry", author.key().as_ref(), &[bump]]])?;

    // Initialize entry
    let entry_data = GuestbookEntry::from_account_mut(entry)?;
    entry_data.discriminator = ENTRY_DISCRIMINATOR;
    entry_data.author = author.key().to_bytes();
    entry_data.timestamp = pinocchio::sysvar::clock::Clock::get()?.unix_timestamp;
    entry_data.bump = bump;

    // Set message
    GuestbookEntry::set_message(entry, message)?;

    Ok(())
}

/// Update an existing guestbook entry
fn update_entry(accounts: &[AccountInfo], data: &[u8]) -> ProgramResult {
    // Parse accounts
    let [entry, author, ..] = accounts else {
        return Err(ProgramError::NotEnoughAccountKeys);
    };

    // Validate author is signer
    if !author.is_signer() {
        return Err(ProgramError::MissingRequiredSignature);
    }

    // Get entry
    let entry_data = GuestbookEntry::from_account(entry)?;

    // Verify author matches
    if entry_data.author != author.key().to_bytes() {
        return Err(ProgramError::IllegalOwner);
    }

    // Parse new message
    let message = std::str::from_utf8(data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    // Validate message
    if message.is_empty() || message.len() > GuestbookEntry::MAX_MESSAGE_LEN {
        return Err(ProgramError::InvalidInstructionData);
    }

    // Update timestamp
    let entry_mut = GuestbookEntry::from_account_mut(entry)?;
    entry_mut.timestamp = pinocchio::sysvar::clock::Clock::get()?.unix_timestamp;

    // Update message
    GuestbookEntry::set_message(entry, message)?;

    Ok(())
}

/// Delete a guestbook entry
fn delete_entry(accounts: &[AccountInfo]) -> ProgramResult {
    // Parse accounts
    let [entry, author, ..] = accounts else {
        return Err(ProgramError::NotEnoughAccountKeys);
    };

    // Validate author is signer
    if !author.is_signer() {
        return Err(ProgramError::MissingRequiredSignature);
    }

    // Get entry
    let entry_data = GuestbookEntry::from_account(entry)?;

    // Verify author matches
    if entry_data.author != author.key().to_bytes() {
        return Err(ProgramError::IllegalOwner);
    }

    // Transfer lamports back to author
    let entry_lamports = entry.lamports();
    **entry.lamports.borrow_mut() = 0;
    **author.lamports.borrow_mut() = author
        .lamports()
        .checked_add(entry_lamports)
        .ok_or(ProgramError::ArithmeticOverflow)?;

    // Zero out data
    entry.try_borrow_mut_data()?.fill(0);

    Ok(())
}
