# Security Guidelines for Token Balance Checker

## Frontend Security

### Never Expose Sensitive Data
- API keys harus di environment variables
- Never log private keys atau sensitive data
- Validate all user inputs

### RPC Security
- Always use HTTPS endpoints
- Rate limit requests
- Handle errors gracefully
- Don't expose API keys in client code

### Wallet Connection
- Verify wallet signatures
- Check connected network
- Handle disconnection properly
- Show clear connection status

## Data Validation

### Address Validation
```typescript
// Always validate addresses
if (!address || address.length !== 44) {
  throw new Error("Invalid address");
}
```

### Balance Checks
```typescript
// Check for valid balance
if (balance === null || balance < 0) {
  throw new Error("Invalid balance");
}
```

## Error Handling

### Network Errors
- Implement retry logic
- Show user-friendly messages
- Log errors for debugging
- Fallback to alternative RPC if needed

### Wallet Errors
- Handle connection failures
- Show clear error messages
- Allow retry attempts
- Don't expose technical details to users
