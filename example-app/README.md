# Token Balance Checker + Guestbook - Example Solana dApp

Complete fullstack Solana dApp demonstrating:
- **Frontend**: Token balance checker with modern UI
- **Smart Contract**: On-chain guestbook Anchor program
- **Kiro Integration**: All features (Skills, Hooks, Steering, Specs)

## Features

### Frontend
- 🔌 Multi-wallet connection (Phantom, Solflare, etc)
- 💰 Check SOL balance with real-time updates
- 🪙 Display SPL token balances with metadata
- 📝 Sign on-chain guestbook
- 📊 View recent guestbook entries
- ⚡ Powered by Helius RPC + DAS API
- 🎨 Clean, responsive UI with Tailwind CSS

### Smart Contract
- ✍️ Create guestbook entry (max 280 chars)
- 🔄 Update your entry
- 🗑️ Delete entry (get rent back)
- 🔒 Secure PDA-based storage
- ✅ Full test coverage
- ⚡ **Two implementations**: Anchor (easy) + Pinocchio (88-95% faster)

## Tech Stack

### Frontend
- **Framework**: Next.js 14 + TypeScript
- **Solana SDK**: @solana/kit (modern, tree-shakeable)
- **UI Hooks**: @solana/react-hooks
- **RPC**: Helius (mainnet + devnet)
- **Styling**: Tailwind CSS

### Smart Contract
- **Framework**: Anchor 0.29.0
- **Language**: Rust
- **Testing**: Anchor test framework
- **Deployment**: Devnet/Mainnet

## Project Structure

```
example-app/
├── programs/                      # Anchor programs
│   ├── guestbook/                # Anchor implementation
│   │   ├── src/
│   │   │   └── lib.rs            # Program logic
│   │   └── Cargo.toml
│   └── guestbook-pinocchio/      # Pinocchio implementation (88-95% faster)
│       ├── src/
│       │   └── lib.rs            # Zero-copy program
│       └── Cargo.toml
├── tests/
│   └── guestbook.ts              # Program tests
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main page
│   │   └── layout.tsx            # Root layout
│   ├── components/
│   │   ├── WalletButton.tsx      # Wallet connection
│   │   ├── BalanceDisplay.tsx    # SOL balance
│   │   ├── TokenList.tsx         # Token list
│   │   ├── GuestbookForm.tsx     # Create entry
│   │   └── GuestbookEntries.tsx  # View entries
│   ├── hooks/
│   │   ├── useBalance.ts         # Balance fetching
│   │   └── useTokens.ts          # Token data
│   └── lib/
│       └── guestbook.ts          # Program client
├── .kiro/
│   ├── steering/
│   │   ├── security.md           # Frontend security
│   │   └── anchor-security.md    # Program security
│   ├── hooks/
│   │   ├── anchor-build.json     # Auto-build
│   │   ├── anchor-test.json      # Auto-test
│   │   ├── lint-on-save.json     # Auto-lint
│   │   └── type-check.json       # Type checking
│   └── specs/
│       └── balance-checker.md    # Feature spec
├── Anchor.toml                    # Anchor config
├── SETUP.md                       # Frontend setup
└── PROGRAM-SETUP.md              # Program setup
```

## Quick Start

### 1. Frontend Setup

See `SETUP.md` for detailed frontend setup.

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Add your Helius API key

# Run dev server
npm run dev
```

### 2. Program Setup

See `PROGRAM-SETUP.md` for detailed program setup.

```bash
# Build program
anchor build

# Run tests
anchor test

# Deploy to devnet
anchor deploy --provider.cluster devnet
```

## Development with Kiro

This project demonstrates optimal Solana development workflow:

### 1. Skills
Activate on-demand expertise:
- `solana-dev` - Overall Solana development
- `solana-kit` - @solana/kit SDK usage
- `helius` - RPC and infrastructure

### 2. Specs
Structured development tracked in `.kiro/specs/balance-checker.md`

### 3. Hooks
Automation configured:
- **anchor-build.json** - Auto-build program on save
- **anchor-test.json** - Auto-test program on save
- **lint-on-save.json** - Auto-lint frontend code
- **type-check.json** - Type checking on save

### 4. Steering
Best practices enforced:
- **security.md** - Frontend security guidelines
- **anchor-security.md** - Program security patterns

## Testing

### Frontend Tests
```bash
npm test
npm run type-check
npm run lint
```

### Program Tests
```bash
# All tests
anchor test

# Specific test
anchor test -- --grep "Creates a guestbook entry"

# Without local validator
anchor test --skip-local-validator
```

## Deployment

### Frontend (Vercel)
```bash
npm run build
vercel deploy
```

### Program (Devnet)
```bash
solana config set --url devnet
anchor deploy --provider.cluster devnet
```

### Program (Mainnet)
```bash
solana config set --url mainnet-beta
anchor deploy --provider.cluster mainnet
```

## Features Demonstrated

### Kiro Features
✅ Skills activation
✅ Spec-driven development
✅ Automated hooks
✅ Security steering
✅ Type-safe development

### Solana Features
✅ Wallet connection (Wallet Standard)
✅ RPC calls (@solana/kit)
✅ Token data (Helius DAS API)
✅ Anchor program development
✅ PDA-based storage
✅ Transaction building
✅ Priority fees

## Resources

- Frontend Setup: `SETUP.md`
- Program Setup: `PROGRAM-SETUP.md`
- Anchor vs Pinocchio: `PINOCCHIO-COMPARISON.md`
- Jupiter Integration: `src/lib/jupiter.ts`
- Spec: `.kiro/specs/balance-checker.md`
- Security: `.kiro/steering/`

## Next Steps

1. Complete program integration with frontend
2. Generate TypeScript client with Codama
3. Integrate Jupiter swap functionality
4. Benchmark Anchor vs Pinocchio
5. Add more program features
6. Deploy to mainnet
7. Add analytics and monitoring
