# Setup Guide - Token Balance Checker

## Prerequisites

- Node.js 18+ installed
- npm or pnpm
- Helius API key (free tier available)

## Step 1: Get Helius API Key

1. Visit [dashboard.helius.dev](https://dashboard.helius.dev)
2. Create account or sign in
3. Click "Create API Key"
4. Copy your API key

## Step 2: Install Dependencies

```bash
cd example-app
npm install
```

## Step 3: Configure Environment

```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local and add your Helius API key
NEXT_PUBLIC_HELIUS_API_KEY=your_key_here
NEXT_PUBLIC_RPC_URL=https://mainnet.helius-rpc.com/?api-key=your_key_here
```

## Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 5: Test the App

1. Click "Connect Wallet"
2. Select your wallet (Phantom, Solflare, etc)
3. Approve connection
4. View your SOL balance and tokens

## Kiro Features Demonstrated

### 1. Skills
This app was built with guidance from:
- `solana-kit` skill - Transaction and RPC patterns
- `helius` skill - DAS API integration

### 2. Hooks
Auto-configured hooks:
- `lint-on-save.json` - Auto-lint TypeScript files
- `type-check.json` - Type checking on save

### 3. Steering
Security guidelines in `.kiro/steering/security.md`

### 4. Spec
Development tracked in `.kiro/specs/balance-checker.md`

## Development Workflow

### With Kiro
```
1. Edit component → Hooks auto-lint and type-check
2. Steering ensures security patterns
3. Skills provide guidance
4. Spec tracks progress
```

### Manual Commands
```bash
# Lint
npm run lint

# Type check
npm run type-check

# Build
npm run build

# Test
npm test
```

## Troubleshooting

### Wallet Not Connecting
- Make sure you have a Solana wallet installed
- Try refreshing the page
- Check browser console for errors

### Balance Not Loading
- Verify Helius API key is correct
- Check network connection
- Try switching to devnet

### Hooks Not Working
- Verify hook JSON files are valid
- Check file patterns match
- View Kiro Hook UI for status

## Next Steps

1. Customize the UI
2. Add more features (transfer, swap)
3. Deploy to Vercel
4. Add analytics

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [@solana/kit Docs](https://solanakit.com)
- [Helius Docs](https://docs.helius.dev)
- [Tailwind CSS](https://tailwindcss.com)
