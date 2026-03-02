# Spec: SPL Token Deployment

## Requirements

### Token Details
- Name: [Token Name]
- Symbol: [SYMBOL]
- Decimals: 9
- Total Supply: [Amount]
- Token Standard: Token-2022 (with extensions)

### Extensions
- [ ] Transfer fees
- [ ] Metadata pointer
- [ ] Permanent delegate
- [ ] Interest-bearing
- [ ] Default account state

### Distribution
- Treasury: [%]
- Team: [%] (vesting schedule)
- Community: [%]
- Liquidity: [%]

## Design

### Tech Stack
- **SDK**: @solana/kit
- **Program**: @solana-program/token-2022
- **RPC**: Helius
- **Frontend**: Next.js + @solana/react-hooks

### Token Configuration
```typescript
{
  name: "Token Name",
  symbol: "SYMBOL",
  decimals: 9,
  supply: 1_000_000_000,
  extensions: {
    transferFee: {
      feeBasisPoints: 100, // 1%
      maxFee: 1_000_000
    }
  }
}
```

## Implementation Tasks

### Task 1: Setup Project
- [ ] Install dependencies
- [ ] Configure Helius RPC
- [ ] Setup wallet

### Task 2: Deploy Token
- [ ] Create mint account
- [ ] Initialize token with extensions
- [ ] Mint initial supply
- [ ] Create metadata

### Task 3: Distribution
- [ ] Create token accounts
- [ ] Distribute to treasury
- [ ] Setup vesting for team
- [ ] Allocate for liquidity

### Task 4: Liquidity Pool
- [ ] Create Raydium CPMM pool
- [ ] Add initial liquidity
- [ ] Set pool parameters

### Task 5: Frontend
- [ ] Token info display
- [ ] Transfer interface
- [ ] Balance checking

## Security Checklist
- [ ] Mint authority properly set
- [ ] Freeze authority configured
- [ ] Metadata immutable
- [ ] Vesting contracts audited
