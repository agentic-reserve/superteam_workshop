# Spec: Token Swap dApp

## Requirements

### User Stories
- User dapat connect wallet (Phantom, Solflare, dll)
- User dapat swap SOL ↔ SPL tokens via Jupiter
- User dapat see real-time price dan slippage
- User dapat set custom slippage tolerance
- User dapat see transaction history

### Technical Requirements
- Support Wallet Standard (multi-wallet)
- Use Jupiter Aggregator untuk best rates
- Real-time price updates via Helius
- Transaction confirmation dengan retry logic
- Mobile-responsive UI

### Security Requirements
- Verify all signers
- Validate token accounts
- Check slippage limits
- Simulate before send
- Handle errors gracefully

### Performance Targets
- < 2s untuk price quote
- < 5s untuk transaction confirmation
- < 100ms UI response time
- Support 100+ tokens

## Design

### Tech Stack
- **Frontend**: Next.js 14 + TypeScript
- **Solana SDK**: @solana/kit
- **UI Hooks**: @solana/react-hooks
- **RPC**: Helius (mainnet + devnet)
- **Swap**: Jupiter Aggregator V6
- **Styling**: Tailwind CSS

### Architecture

```
┌─────────────────────────────────────┐
│         Next.js Frontend            │
│  ┌──────────────────────────────┐  │
│  │  Wallet Connection           │  │
│  │  (@solana/react-hooks)       │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │  Swap Interface              │  │
│  │  - Token selection           │  │
│  │  - Amount input              │  │
│  │  - Price display             │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │  Transaction Builder         │  │
│  │  (@solana/kit)               │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         Helius RPC                  │
│  - Transaction sending              │
│  - Priority fees                    │
│  - Account fetching                 │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Jupiter Aggregator             │
│  - Route calculation                │
│  - Best price discovery             │
│  - Swap execution                   │
└─────────────────────────────────────┘
```

### File Structure
```
swap-dapp/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main swap page
│   │   └── layout.tsx            # Root layout with providers
│   ├── components/
│   │   ├── WalletButton.tsx      # Wallet connection
│   │   ├── SwapInterface.tsx     # Main swap UI
│   │   ├── TokenSelect.tsx       # Token picker
│   │   └── TransactionStatus.tsx # Tx confirmation
│   ├── hooks/
│   │   ├── useSwap.ts            # Swap logic
│   │   ├── useTokenPrice.ts      # Price fetching
│   │   └── useTokenBalance.ts    # Balance checking
│   ├── lib/
│   │   ├── helius.ts             # Helius client
│   │   ├── jupiter.ts            # Jupiter integration
│   │   └── solana.ts             # @solana/kit setup
│   └── types/
│       └── index.ts              # TypeScript types
├── .env.local
└── package.json
```

## Implementation Tasks

### Task 1: Project Setup
- [x] Create Next.js project
- [ ] Install dependencies (@solana/kit, @solana/react-hooks, helius-sdk)
- [ ] Setup environment variables (Helius API key)
- [ ] Configure Tailwind CSS
- [ ] Setup TypeScript strict mode

### Task 2: Wallet Connection
- [ ] Create WalletProvider dengan @solana/react-hooks
- [ ] Implement WalletButton component
- [ ] Add wallet adapter for Phantom, Solflare
- [ ] Handle wallet connection states
- [ ] Add disconnect functionality

### Task 3: Helius Integration
- [ ] Setup Helius RPC client
- [ ] Create helper untuk fetch token balances
- [ ] Implement priority fee estimation
- [ ] Add transaction sending dengan retry
- [ ] Setup error handling

### Task 4: Jupiter Integration
- [ ] Create Jupiter client
- [ ] Implement quote fetching
- [ ] Build swap transaction
- [ ] Add slippage configuration
- [ ] Handle route calculation

### Task 5: Swap Interface
- [ ] Create token selection component
- [ ] Add amount input dengan validation
- [ ] Display price impact dan fees
- [ ] Show route information
- [ ] Add swap button dengan loading states

### Task 6: Transaction Execution
- [ ] Build transaction dengan @solana/kit pipe
- [ ] Add compute budget instructions
- [ ] Sign transaction
- [ ] Send via Helius dengan priority fee
- [ ] Confirm dan show status

### Task 7: Testing
- [ ] Unit tests untuk hooks
- [ ] Integration tests untuk swap flow
- [ ] Test error scenarios
- [ ] Test dengan different wallets
- [ ] Performance testing

### Task 8: Deployment
- [ ] Deploy to Vercel
- [ ] Setup environment variables
- [ ] Configure custom domain
- [ ] Add monitoring (Sentry)
- [ ] Setup analytics

## File References

Environment config: #[[file:.env.local]]
```env
NEXT_PUBLIC_HELIUS_API_KEY=your_key_here
NEXT_PUBLIC_RPC_URL=https://mainnet.helius-rpc.com/?api-key=your_key
```

Package dependencies: #[[file:package.json]]
```json
{
  "dependencies": {
    "@solana/kit": "latest",
    "@solana/react-hooks": "latest",
    "helius-sdk": "latest",
    "next": "14.x",
    "react": "18.x"
  }
}
```

## Security Checklist

- [ ] Validate all user inputs
- [ ] Check token account ownership
- [ ] Verify transaction signers
- [ ] Simulate transaction before sending
- [ ] Set maximum slippage limits
- [ ] Handle insufficient balance errors
- [ ] Protect against front-running (use priority fees)
- [ ] Never expose private keys
- [ ] Validate token mint addresses
- [ ] Check for token account existence

## Performance Optimizations

- [ ] Cache token metadata
- [ ] Debounce price updates
- [ ] Lazy load token lists
- [ ] Optimize bundle size (tree-shaking)
- [ ] Use React.memo untuk expensive components
- [ ] Implement virtual scrolling untuk token list
- [ ] Prefetch common routes

## Monitoring & Analytics

- [ ] Track swap success rate
- [ ] Monitor transaction confirmation time
- [ ] Log error rates
- [ ] Track user wallet connections
- [ ] Monitor RPC performance
- [ ] Alert on failed transactions

## Future Enhancements

- [ ] Add limit orders
- [ ] Support multiple DEXs
- [ ] Add portfolio tracking
- [ ] Implement transaction history
- [ ] Add price alerts
- [ ] Support cross-chain swaps
