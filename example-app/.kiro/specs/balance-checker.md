# Spec: Token Balance Checker

## Requirements

### User Stories
- User dapat connect wallet (Phantom, Solflare, dll)
- User dapat see SOL balance
- User dapat see all SPL token balances
- User dapat see token metadata (name, symbol, image)
- Real-time balance updates

### Technical Requirements
- Support Wallet Standard (multi-wallet)
- Use Helius DAS API untuk token data
- Real-time updates via polling
- Mobile-responsive UI
- Fast loading dengan proper loading states

## Design

### Tech Stack
- **Frontend**: Next.js 14 + TypeScript
- **Solana SDK**: @solana/kit
- **UI Hooks**: @solana/react-hooks
- **RPC**: Helius (mainnet)
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
│  │  Balance Display             │  │
│  │  - SOL balance               │  │
│  │  - Token list                │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         Helius RPC + DAS            │
│  - getBalance                       │
│  - getAssetsByOwner                 │
└─────────────────────────────────────┘
```

## Implementation Tasks

### Task 1: Project Setup ✓
- [x] Create Next.js project
- [x] Install dependencies
- [x] Setup environment variables
- [x] Configure Tailwind CSS
- [x] Setup TypeScript

### Task 2: Wallet Connection ✓
- [x] Create WalletProvider
- [x] Implement WalletButton component
- [x] Handle connection states
- [x] Add disconnect functionality

### Task 3: Balance Fetching ✓
- [x] Create useBalance hook
- [x] Fetch SOL balance via RPC
- [x] Add polling for updates
- [x] Handle errors

### Task 4: Token List ✓
- [x] Create useTokens hook
- [x] Fetch tokens via Helius DAS API
- [x] Parse token metadata
- [x] Display token cards

### Task 5: UI Components ✓
- [x] BalanceDisplay component
- [x] TokenList component
- [x] TokenCard component
- [x] Loading states
- [x] Error states

### Task 6: Kiro Integration ✓
- [x] Add security steering
- [x] Create lint hook
- [x] Create type-check hook
- [x] Document workflow

## Security Checklist
- [x] API keys in environment variables
- [x] Input validation
- [x] Error handling
- [x] No sensitive data exposure
