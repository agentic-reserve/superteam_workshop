use anchor_lang::prelude::*;

declare_id!("GuestBooK11111111111111111111111111111111");

#[program]
pub mod guestbook {
    use super::*;

    /// Initialize a new guestbook entry
    pub fn create_entry(ctx: Context<CreateEntry>, message: String) -> Result<()> {
        // Validate message length
        require!(message.len() <= 280, GuestbookError::MessageTooLong);
        require!(!message.is_empty(), GuestbookError::MessageEmpty);

        let entry = &mut ctx.accounts.entry;
        let clock = Clock::get()?;

        entry.author = ctx.accounts.author.key();
        entry.message = message;
        entry.timestamp = clock.unix_timestamp;
        entry.bump = ctx.bumps.entry;

        msg!("New guestbook entry created by: {}", entry.author);
        msg!("Message: {}", entry.message);

        Ok(())
    }

    /// Update an existing guestbook entry
    pub fn update_entry(ctx: Context<UpdateEntry>, new_message: String) -> Result<()> {
        // Validate message length
        require!(new_message.len() <= 280, GuestbookError::MessageTooLong);
        require!(!new_message.is_empty(), GuestbookError::MessageEmpty);

        let entry = &mut ctx.accounts.entry;
        let clock = Clock::get()?;

        entry.message = new_message;
        entry.timestamp = clock.unix_timestamp;

        msg!("Entry updated by: {}", entry.author);

        Ok(())
    }

    /// Delete a guestbook entry
    pub fn delete_entry(_ctx: Context<DeleteEntry>) -> Result<()> {
        msg!("Entry deleted");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateEntry<'info> {
    #[account(
        init,
        payer = author,
        space = 8 + GuestbookEntry::INIT_SPACE,
        seeds = [b"entry", author.key().as_ref()],
        bump
    )]
    pub entry: Account<'info, GuestbookEntry>,
    
    #[account(mut)]
    pub author: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateEntry<'info> {
    #[account(
        mut,
        seeds = [b"entry", author.key().as_ref()],
        bump = entry.bump,
        has_one = author
    )]
    pub entry: Account<'info, GuestbookEntry>,
    
    pub author: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeleteEntry<'info> {
    #[account(
        mut,
        seeds = [b"entry", author.key().as_ref()],
        bump = entry.bump,
        has_one = author,
        close = author
    )]
    pub entry: Account<'info, GuestbookEntry>,
    
    #[account(mut)]
    pub author: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct GuestbookEntry {
    pub author: Pubkey,      // 32 bytes
    #[max_len(280)]
    pub message: String,     // 4 + 280 bytes
    pub timestamp: i64,      // 8 bytes
    pub bump: u8,            // 1 byte
}

#[error_code]
pub enum GuestbookError {
    #[msg("Message is too long. Maximum 280 characters.")]
    MessageTooLong,
    #[msg("Message cannot be empty.")]
    MessageEmpty,
}
