---
inclusion: fileMatch
fileMatchPattern: 'programs/**/*.rs'
---

# Anchor Program Security Guidelines

This steering is automatically included when working on Anchor programs.

## Account Validation

### Always Verify Signers
```rust
// Good - explicit signer check
#[account(mut)]
pub authority: Signer<'info>,

// Bad - no signer verification
pub authority: AccountInfo<'info>,
```

### Use has_one Constraint
```rust
// Good - verify ownership
#[account(
    mut,
    has_one = authority
)]
pub entry: Account<'info, GuestbookEntry>,
```

### Validate PDAs
```rust
// Good - use seeds and bump
#[account(
    seeds = [b"entry", author.key().as_ref()],
    bump = entry.bump
)]
pub entry: Account<'info, GuestbookEntry>,
```

## Data Validation

### Check Input Lengths
```rust
// Good - validate before processing
require!(message.len() <= 280, GuestbookError::MessageTooLong);
require!(!message.is_empty(), GuestbookError::MessageEmpty);
```

### Use Checked Arithmetic
```rust
// Good - checked operations
let result = amount.checked_add(fee)
    .ok_or(ErrorCode::Overflow)?;

// Bad - can overflow
let result = amount + fee;
```

## Account Space

### Use InitSpace Derive
```rust
// Good - automatic space calculation
#[account]
#[derive(InitSpace)]
pub struct GuestbookEntry {
    pub author: Pubkey,
    #[max_len(280)]
    pub message: String,
    pub timestamp: i64,
}
```

### Proper Space Allocation
```rust
// Good - correct space calculation
space = 8 + GuestbookEntry::INIT_SPACE

// 8 bytes for discriminator
// + calculated space for struct
```

## Error Handling

### Define Custom Errors
```rust
#[error_code]
pub enum GuestbookError {
    #[msg("Message is too long")]
    MessageTooLong,
    #[msg("Unauthorized access")]
    Unauthorized,
}
```

### Use require! Macro
```rust
// Good - clear error handling
require!(
    ctx.accounts.authority.key() == expected_authority,
    GuestbookError::Unauthorized
);
```

## Close Accounts Safely

### Use close Constraint
```rust
// Good - proper account closure
#[account(
    mut,
    close = authority  // Rent goes back to authority
)]
pub entry: Account<'info, GuestbookEntry>,
```

## Testing

### Test All Paths
- Happy path
- Error cases
- Edge cases
- Unauthorized access

### Use LiteSVM for Fast Tests
```rust
#[test]
fn test_with_litesvm() {
    let mut svm = LiteSVM::new();
    // Fast in-process testing
}
```
