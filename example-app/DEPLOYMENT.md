# Deployment Guide - Token Balance Checker + Guestbook

Quick deployment guide for the example app.

## Prerequisites

- [ ] Vercel account
- [ ] Railway account (optional, for backend)
- [ ] Helius API key (production)
- [ ] Solana wallet with SOL for program deployment

## Quick Deploy

### 1. Deploy Frontend to Vercel (5 minutes)

```bash
# Install Vercel CLI
npm i -g vercel

# Build and test locally
npm run build

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_HELIUS_API_KEY
vercel env add NEXT_PUBLIC_RPC_URL
vercel env add NEXT_PUBLIC_PROGRAM_ID

# Deploy to production
vercel --prod
```

### 2. Deploy Program to Solana (10 minutes)

**Anchor Program:**
```bash
# Configure for mainnet
solana config set --url mainnet-beta

# Check balance (need ~2 SOL for deployment)
solana balance

# Deploy
anchor deploy --provider.cluster mainnet

# Note the program ID
# Update in frontend: NEXT_PUBLIC_PROGRAM_ID
```

**Pinocchio Program (optional):**
```bash
cd programs/guestbook-pinocchio
cargo build-sbf --release

solana program deploy \
  target/deploy/guestbook_pinocchio.so \
  --program-id <PROGRAM_ID>
```

### 3. Update Frontend with Program ID

```bash
# Update environment variable
vercel env add NEXT_PUBLIC_PROGRAM_ID production

# Redeploy
vercel --prod
```

### 4. Verify Deployment

```bash
# Check frontend
curl https://your-app.vercel.app

# Check program
solana program show <PROGRAM_ID>

# Test transaction
# Open app, connect wallet, create guestbook entry
```

## Environment Variables

### Production (.env.production)

```bash
# Helius (production key)
NEXT_PUBLIC_HELIUS_API_KEY=your_production_key

# Jupiter (optional, for swap features)
NEXT_PUBLIC_JUPITER_API_KEY=your_jupiter_key

# RPC (mainnet)
NEXT_PUBLIC_RPC_URL=https://mainnet.helius-rpc.com/?api-key=your_key

# Network
NEXT_PUBLIC_NETWORK=mainnet-beta

# Program ID (after deployment)
NEXT_PUBLIC_PROGRAM_ID=GuestBooK11111111111111111111111111111111
```

## Optional: Backend API (Railway)

If you need backend services:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up

# Add database (if needed)
railway add --database postgres

# Set environment variables
railway variables set HELIUS_API_KEY=your_key
railway variables set DATABASE_URL=postgresql://...
```

## Monitoring

### Vercel Analytics

```typescript
// Already configured in app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
```

### Helius Webhooks

```typescript
// Monitor program interactions
const webhook = await helius.webhooks.createWebhook({
  webhookURL: "https://your-api.railway.app/webhook",
  accountAddresses: [programId],
  webhookType: "enhanced",
});
```

## Rollback

### Frontend
```bash
vercel rollback
```

### Program
```bash
# Upgrade to previous version
solana program deploy --program-id <PROGRAM_ID> backup/previous.so
```

## Cost Estimate

### Vercel (Frontend)
- Hobby: Free (100GB bandwidth)
- Pro: $20/month (1TB bandwidth)

### Railway (Backend - optional)
- Hobby: $5/month
- Developer: $20/month

### Solana (Program)
- Deployment: ~1-2 SOL one-time
- Rent: Minimal (program accounts)
- Transactions: User pays

## Troubleshooting

### Build Fails
```bash
# Check locally
npm run build
npm run lint
npm run type-check
```

### Program Deployment Fails
```bash
# Check balance
solana balance

# Check program size
ls -lh target/deploy/*.so

# Increase compute budget if needed
solana program deploy --max-len 200000
```

### Environment Variables Not Working
```bash
# List variables
vercel env ls

# Pull to local
vercel env pull

# Verify in code
console.log(process.env.NEXT_PUBLIC_HELIUS_API_KEY)
```

## Next Steps

1. ✅ Deploy to production
2. 📊 Monitor metrics
3. 🔧 Optimize performance
4. 🚀 Add more features
5. 📈 Scale as needed
