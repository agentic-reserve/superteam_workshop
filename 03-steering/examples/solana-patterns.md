---
inclusion: fileMatch
fileMatchPattern: '**/{programs,src}/**/*.{rs,ts,tsx}'
---

# Solana Development Patterns

This steering is automatically included when working on Solana code.

## Transaction Building Pattern

Always use this pattern dengan @solana/kit:

```typescript
import { pipe } from "@solana/kit";

const tx = pipe(
  createTransactionMessage({ version: 0 }),
  (tx) => setTransactionMessageFeePayer(payer.address, tx),
  (tx) => setTransactionMessageLifetimeUsingBlockhash(blockhash, tx),
  (tx) => prependTransactionMessageInstructions(computeBudgetIxs, tx),
  (tx) => appendTransactionMessageInstruction(mainInstruction, tx),
);
```

## Error Handling

### Anchor Programs
```rust
#[error_code]
pub enum ErrorCode {
    #[msg("Invalid authority")]
    InvalidAuthority,
    #[msg("Insufficient funds")]
    InsufficientFunds,
}
```

### Frontend
```typescript
try {
  await sendAndConfirm(tx);
} catch (error) {
  if (isSolanaError(error)) {
    // Handle Solana-specific errors
  }
  throw error;
}
```

## Account Structure

### Anchor
```rust
#[account]
pub struct UserAccount {
    pub authority: Pubkey,
    pub balance: u64,
    pub bump: u8,
}
```

### Size Calculation
```rust
// 8 (discriminator) + 32 (pubkey) + 8 (u64) + 1 (u8)
const ACCOUNT_SIZE: usize = 8 + 32 + 8 + 1;
```

## Testing Pattern

### LiteSVM (Fast Unit Tests)
```rust
#[test]
fn test_initialize() {
    let mut svm = LiteSVM::new();
    // Test logic
}
```

### Anchor Tests
```typescript
it("initializes account", async () => {
  const tx = await program.methods
    .initialize()
    .accounts({ /* accounts */ })
    .rpc();
  
  // Assertions
});
```

## Performance

- Use compute budget instructions
- Minimize account data size
- Batch operations when possible
- Use lookup tables for large transactions
- Cache frequently accessed data
