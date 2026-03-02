# Anchor Program Setup Guide

## Prerequisites

- Anchor CLI installed (`avm install latest`)
- Solana CLI installed
- Rust toolchain

## Program Overview

**Guestbook Program** - Simple on-chain guestbook where users can:
- Create a guestbook entry (max 280 characters)
- Update their entry
- Delete their entry

Each user can have one entry (PDA derived from their wallet address).

## Program Structure

```
programs/guestbook/
├── src/
│   └── lib.rs              # Main program logic
├── Cargo.toml              # Rust dependencies
└── Xargo.toml              # Build configuration
```

## Build & Test

### 1. Build the Program

```bash
anchor build
```

This will:
- Compile the Rust program
- Generate the IDL (Interface Definition Language)
- Create the program binary

### 2. Run Tests

```bash
# Run all tests
anchor test

# Run tests without starting local validator
anchor test --skip-local-validator

# Run specific test
anchor test -- --grep "Creates a guestbook entry"
```

### 3. Deploy to Devnet

```bash
# Configure Solana CLI for devnet
solana config set --url devnet

# Get some devnet SOL
solana airdrop 2

# Deploy program
anchor deploy --provider.cluster devnet
```

### 4. Deploy to Mainnet

```bash
# Configure for mainnet
solana config set --url mainnet-beta

# Deploy (requires SOL for deployment)
anchor deploy --provider.cluster mainnet
```

## Program Instructions

### 1. Create Entry

Creates a new guestbook entry for the user.

```rust
pub fn create_entry(ctx: Context<CreateEntry>, message: String) -> Result<()>
```

**Accounts:**
- `entry` - PDA for the guestbook entry (writable, init)
- `author` - User's wallet (signer, writable, pays for account)
- `system_program` - System program

**Validation:**
- Message length: 1-280 characters
- Entry must not exist yet

### 2. Update Entry

Updates an existing guestbook entry.

```rust
pub fn update_entry(ctx: Context<UpdateEntry>, new_message: String) -> Result<()>
```

**Accounts:**
- `entry` - PDA for the guestbook entry (writable)
- `author` - User's wallet (signer, must match entry author)

**Validation:**
- Message length: 1-280 characters
- User must be the entry author

### 3. Delete Entry

Deletes a guestbook entry and returns rent to the author.

```rust
pub fn delete_entry(_ctx: Context<DeleteEntry>) -> Result<()>
```

**Accounts:**
- `entry` - PDA for the guestbook entry (writable, close)
- `author` - User's wallet (signer, receives rent refund)

## Account Structure

```rust
pub struct GuestbookEntry {
    pub author: Pubkey,      // 32 bytes - Entry author
    pub message: String,     // 4 + 280 bytes - Message content
    pub timestamp: i64,      // 8 bytes - Unix timestamp
    pub bump: u8,            // 1 byte - PDA bump seed
}
```

**Total Space:** 8 (discriminator) + 325 (data) = 333 bytes

## PDA Derivation

Entry PDA is derived from:
- Seeds: `["entry", author_pubkey]`
- Program ID: Guestbook program

```rust
let (entry_pda, bump) = Pubkey::find_program_address(
    &[b"entry", author.key().as_ref()],
    program_id
);
```

## Error Codes

```rust
pub enum GuestbookError {
    MessageTooLong,  // 6000: Message exceeds 280 characters
    MessageEmpty,    // 6001: Message is empty
}
```

## Security Features

✅ Signer verification (only author can update/delete)
✅ PDA validation (seeds + bump)
✅ Input validation (message length)
✅ Account ownership checks (has_one constraint)
✅ Proper account closure (rent refund)

## Testing with Kiro

### Hooks Configured

1. **anchor-build.json** - Auto-build on save
2. **anchor-test.json** - Auto-test on save

### Steering Active

- **anchor-security.md** - Security guidelines for Anchor programs

## Integration with Frontend

See `src/lib/guestbook.ts` for client integration:

```typescript
// Create entry
await createEntry(signer, "Hello, Solana!");

// Fetch entry
const entry = await fetchEntry(authorAddress);

// Update entry
await updateEntry(signer, "Updated message");

// Delete entry
await deleteEntry(signer);
```

## Troubleshooting

### Build Fails

```bash
# Clean and rebuild
anchor clean
anchor build
```

### Tests Fail

```bash
# Check Solana version
solana --version

# Update Anchor
avm update

# Run with verbose output
anchor test -- --nocapture
```

### Deployment Issues

```bash
# Check balance
solana balance

# Check program size
ls -lh target/deploy/guestbook.so

# Verify program ID matches
anchor keys list
```

## Next Steps

1. Generate TypeScript client with Codama
2. Integrate with frontend components
3. Add more features (likes, comments, etc)
4. Deploy to mainnet

## Resources

- [Anchor Book](https://book.anchor-lang.com)
- [Solana Cookbook](https://solanacookbook.com)
- [Anchor Examples](https://github.com/coral-xyz/anchor/tree/master/tests)
