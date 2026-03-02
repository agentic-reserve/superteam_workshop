# Solana Security Best Practices

## Program Security

### Signer Verification
Always verify signers before executing privileged operations:
```rust
// Good
if !ctx.accounts.authority.is_signer {
    return Err(ProgramError::MissingRequiredSignature);
}

// Bad - no verification
```

### Account Ownership
Verify account ownership before accessing data:
```rust
// Good
if ctx.accounts.token_account.owner != ctx.accounts.authority.key() {
    return Err(ErrorCode::InvalidOwner);
}
```

### Integer Overflow
Use checked arithmetic:
```rust
// Good
let result = amount.checked_add(fee)
    .ok_or(ErrorCode::Overflow)?;

// Bad
let result = amount + fee; // Can overflow
```

### PDA Validation
Always validate PDA derivation:
```rust
// Good
let (pda, bump) = Pubkey::find_program_address(seeds, program_id);
if pda != *ctx.accounts.pda.key {
    return Err(ErrorCode::InvalidPDA);
}
```

### Reentrancy Guards
Protect against reentrancy attacks:
```rust
// Update state BEFORE external calls
account.balance = new_balance;
invoke_signed(/* CPI call */)?;
```

## Transaction Security

### Always Simulate First
```typescript
// Simulate before sending
const simulation = await rpc.simulateTransaction(tx).send();
if (simulation.value.err) {
    throw new Error("Simulation failed");
}
```

### Use Priority Fees
```typescript
// Get priority fee from Helius
const { priorityFeeEstimate } = await helius.getPriorityFeeEstimate({
    accountKeys: [payer.address],
});
```

### Set Compute Budget
```typescript
// Always set compute units
const computeIx = getSetComputeUnitLimitInstruction({ 
    units: 200_000 
});
```

### Verify Signers
```typescript
// Check all required signers present
if (!transaction.signatures.every(sig => sig.signature)) {
    throw new Error("Missing signatures");
}
```

## Frontend Security

### Never Expose Private Keys
```typescript
// Good - use environment variables
const privateKey = process.env.PRIVATE_KEY;

// Bad - hardcoded
const privateKey = "base58_key_here";
```

### Validate User Input
```typescript
// Always validate amounts
if (amount <= 0 || amount > maxAmount) {
    throw new Error("Invalid amount");
}
```

### Check Token Accounts
```typescript
// Verify token account exists and is correct
const account = await fetchEncodedAccount(rpc, tokenAccount);
assertAccountExists(account);
```
