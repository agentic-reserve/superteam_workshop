# Deployment - Ship Your Solana dApp

## Overview

Deploy your fullstack Solana dApp to production with Railway (backend/API) and Vercel (frontend).

## Architecture

```
┌─────────────────────────────────────────┐
│         Vercel (Frontend)               │
│  - Next.js app                          │
│  - Static assets                        │
│  - Edge functions                       │
│  - CDN distribution                     │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│         Railway (Backend)               │
│  - API server (optional)                │
│  - Database (Postgres)                  │
│  - Redis cache                          │
│  - Background jobs                      │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│         Solana Network                  │
│  - Deployed programs                    │
│  - Helius RPC                           │
│  - On-chain data                        │
└─────────────────────────────────────────┘
```

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account
- GitHub repository
- Environment variables ready

### Step 1: Prepare for Deployment

```bash
# Test production build locally
cd example-app
npm run build

# Check for errors
npm run lint
npm run type-check
```

### Step 2: Configure Environment Variables

Create `.env.production`:
```bash
NEXT_PUBLIC_HELIUS_API_KEY=your_production_key
NEXT_PUBLIC_RPC_URL=https://mainnet.helius-rpc.com/?api-key=your_key
NEXT_PUBLIC_NETWORK=mainnet-beta
NEXT_PUBLIC_PROGRAM_ID=your_deployed_program_id
```

### Step 3: Deploy to Vercel

**Option A: Via CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Option B: Via GitHub Integration**
1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy automatically on push

### Step 4: Configure Custom Domain

```bash
# Add domain via CLI
vercel domains add yourdomain.com

# Or via Vercel dashboard
# Settings → Domains → Add Domain
```

## Backend Deployment (Railway)

### Prerequisites
- Railway account
- Railway CLI installed
- Database requirements identified

### Step 1: Install Railway CLI

```bash
# Install via npm
npm i -g @railway/cli

# Or via brew (macOS)
brew install railway

# Login
railway login
```

### Step 2: Initialize Railway Project

```bash
# Create new project
railway init

# Link to existing project
railway link
```

### Step 3: Deploy API Server (if needed)

Create `railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

Deploy:
```bash
railway up
```

### Step 4: Provision Database

**Postgres (for indexing, caching):**
```bash
# Add Postgres service
railway add --database postgres

# Get connection string
railway variables

# Use in your app
DATABASE_URL=postgresql://...
```

**Redis (for caching):**
```bash
# Add Redis service
railway add --database redis

# Get connection string
REDIS_URL=redis://...
```

### Step 5: Configure Environment Variables

```bash
# Set variables
railway variables set HELIUS_API_KEY=your_key
railway variables set RPC_URL=https://mainnet.helius-rpc.com
railway variables set DATABASE_URL=postgresql://...

# Or via Railway dashboard
# Project → Variables → Add Variable
```

### Step 6: Setup Custom Domain

```bash
# Add domain
railway domain

# Configure DNS
# Add CNAME record pointing to Railway
```

## Program Deployment (Solana)

### Devnet Deployment

```bash
# Configure for devnet
solana config set --url devnet

# Get devnet SOL
solana airdrop 2

# Deploy Anchor program
anchor deploy --provider.cluster devnet

# Or deploy Pinocchio program
cd programs/guestbook-pinocchio
cargo build-sbf
solana program deploy target/deploy/guestbook_pinocchio.so
```

### Mainnet Deployment

```bash
# Configure for mainnet
solana config set --url mainnet-beta

# Check balance (need SOL for deployment)
solana balance

# Deploy program
anchor deploy --provider.cluster mainnet

# Verify deployment
solana program show <PROGRAM_ID>
```

### Program Upgrade

```bash
# Build new version
anchor build

# Upgrade program
anchor upgrade target/deploy/guestbook.so --program-id <PROGRAM_ID>

# Or with Pinocchio
solana program deploy --program-id <PROGRAM_ID> target/deploy/guestbook_pinocchio.so
```

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Production build successful
- [ ] Environment variables configured
- [ ] Program deployed to devnet
- [ ] Tested on devnet thoroughly
- [ ] Security audit completed
- [ ] Performance benchmarks met

### Frontend Deployment
- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Analytics configured
- [ ] Error tracking setup (Sentry)

### Backend Deployment (if applicable)
- [ ] Railway project created
- [ ] Database provisioned
- [ ] Environment variables set
- [ ] Health check endpoint working
- [ ] Monitoring configured
- [ ] Backup strategy in place

### Program Deployment
- [ ] Program deployed to mainnet
- [ ] Program ID updated in frontend
- [ ] IDL uploaded/accessible
- [ ] Upgrade authority secured
- [ ] Emergency procedures documented

### Post-Deployment
- [ ] Smoke tests on production
- [ ] Monitor error rates
- [ ] Check transaction success rate
- [ ] Verify RPC performance
- [ ] Monitor compute unit usage
- [ ] Set up alerts

## Monitoring & Maintenance

### Frontend Monitoring

**Vercel Analytics:**
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Error Tracking (Sentry):**
```bash
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard@latest -i nextjs
```

### Backend Monitoring

**Railway Metrics:**
- CPU usage
- Memory usage
- Network traffic
- Response times

**Custom Metrics:**
```typescript
// Track RPC calls
const rpcCallCounter = new Counter({
  name: 'rpc_calls_total',
  help: 'Total RPC calls',
});

// Track transaction success
const txSuccessRate = new Gauge({
  name: 'transaction_success_rate',
  help: 'Transaction success rate',
});
```

### Program Monitoring

**Helius Webhooks:**
```typescript
// Monitor program interactions
const webhook = await helius.webhooks.createWebhook({
  webhookURL: "https://your-api.railway.app/webhook",
  accountAddresses: [programId],
  webhookType: "enhanced",
});
```

**Transaction Monitoring:**
- Success rate
- Average confirmation time
- Compute unit usage
- Error patterns

## Rollback Procedures

### Frontend Rollback

```bash
# Via Vercel CLI
vercel rollback

# Or via dashboard
# Deployments → Previous deployment → Promote to Production
```

### Backend Rollback

```bash
# Via Railway CLI
railway rollback

# Or redeploy previous version
git checkout <previous-commit>
railway up
```

### Program Rollback

```bash
# Upgrade to previous version
solana program deploy --program-id <PROGRAM_ID> backup/previous_version.so

# Or close program and redeploy
solana program close <PROGRAM_ID>
```

## Cost Optimization

### Vercel
- Use Edge Functions for dynamic content
- Optimize images with next/image
- Enable caching headers
- Use ISR for static content

### Railway
- Right-size your services
- Use sleep mode for dev environments
- Optimize database queries
- Implement caching (Redis)

### Solana
- Optimize compute units (use Pinocchio)
- Batch transactions when possible
- Use priority fees strategically
- Close unused accounts

## CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run lint

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: api
```

## Troubleshooting

### Common Issues

**Build Fails:**
```bash
# Check logs
vercel logs
railway logs

# Test locally
npm run build
```

**Environment Variables Not Working:**
```bash
# Verify variables
vercel env ls
railway variables

# Restart service
railway restart
```

**Program Deployment Fails:**
```bash
# Check balance
solana balance

# Verify program size
ls -lh target/deploy/*.so

# Check for errors
solana program deploy --verbose
```

## Resources

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Solana Deployment: https://docs.solana.com/cli/deploy-a-program
- Helius Monitoring: https://docs.helius.dev/webhooks

## Next Steps

1. Deploy to staging first
2. Test thoroughly
3. Monitor metrics
4. Optimize performance
5. Scale as needed
