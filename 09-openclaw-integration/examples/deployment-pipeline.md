# Complete Deployment Pipeline Example

## Overview

This example shows a complete end-to-end deployment pipeline using OpenClaw for the Guestbook program.

## Architecture

```
GitHub Push → CI/CD → Build → Test → Deploy Devnet → Notify Team → 
Approval → Deploy Mainnet → Monitor → Alert on Issues
```

## Setup

### 1. OpenClaw Configuration

```bash
# Create webhooks
openclaw webhooks create \
  --name "ci-started" \
  --path "/webhook/ci/started" \
  --channel "#deployments"

openclaw webhooks create \
  --name "ci-success" \
  --path "/webhook/ci/success" \
  --channel "#deployments"

openclaw webhooks create \
  --name "ci-failure" \
  --path "/webhook/ci/failure" \
  --channel "#alerts"

# Create approval hook
openclaw hooks create \
  --name "approve-mainnet" \
  --event "on:reaction" \
  --filter "✅" \
  --command "deploy-mainnet.sh"

# Create monitoring cron
openclaw cron create \
  --name "monitor-program" \
  --schedule "*/5 * * * *" \
  --command "check-program-health.sh" \
  --channel "#monitoring"
```

### 2. GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy Guestbook

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  PROGRAM_NAME: guestbook
  OPENCLAW_WEBHOOK: ${{ secrets.OPENCLAW_WEBHOOK_URL }}
  OPENCLAW_TOKEN: ${{ secrets.OPENCLAW_TOKEN }}

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Solana
        uses: metaplex-foundation/actions/install-solana@v1
        with:
          version: 1.18.0
      
      - name: Setup Anchor
        uses: metaplex-foundation/actions/install-anchor@v1
        with:
          version: 0.30.0
      
      - name: Notify CI Started
        run: |
          curl -X POST $OPENCLAW_WEBHOOK/ci/started \
            -H "Authorization: Bearer $OPENCLAW_TOKEN" \
            -H "Content-Type: application/json" \
            -d '{
              "program": "${{ env.PROGRAM_NAME }}",
              "commit": "${{ github.sha }}",
              "author": "${{ github.actor }}",
              "branch": "${{ github.ref_name }}"
            }'
      
      - name: Build Program
        run: |
          cd programs/${{ env.PROGRAM_NAME }}
          anchor build
      
      - name: Run Tests
        run: |
          cd programs/${{ env.PROGRAM_NAME }}
          anchor test
      
      - name: Upload Artifacts
        uses: actions/upload-artifact@v3
        with:
          name: program-artifacts
          path: |
            target/deploy/*.so
            target/idl/*.json
      
      - name: Notify Build Success
        if: success()
        run: |
          curl -X POST $OPENCLAW_WEBHOOK/ci/success \
            -H "Authorization: Bearer $OPENCLAW_TOKEN" \
            -H "Content-Type: application/json" \
            -d '{
              "program": "${{ env.PROGRAM_NAME }}",
              "commit": "${{ github.sha }}",
              "stage": "build",
              "artifacts": ["program.so", "idl.json"]
            }'
      
      - name: Notify Build Failure
        if: failure()
        run: |
          curl -X POST $OPENCLAW_WEBHOOK/ci/failure \
            -H "Authorization: Bearer $OPENCLAW_TOKEN" \
            -H "Content-Type: application/json" \
            -d '{
              "program": "${{ env.PROGRAM_NAME }}",
              "commit": "${{ github.sha }}",
              "stage": "build",
              "error": "Build or tests failed"
            }'

  deploy-devnet:
    needs: build-and-test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Solana
        uses: metaplex-foundation/actions/install-solana@v1
      
      - name: Setup Anchor
        uses: metaplex-foundation/actions/install-anchor@v1
      
      - name: Download Artifacts
        uses: actions/download-artifact@v3
        with:
          name: program-artifacts
      
      - name: Deploy to Devnet
        env:
          ANCHOR_WALLET: ${{ secrets.DEVNET_WALLET }}
        run: |
          cd programs/${{ env.PROGRAM_NAME }}
          anchor deploy --provider.cluster devnet
          echo "PROGRAM_ID=$(solana address -k target/deploy/${{ env.PROGRAM_NAME }}-keypair.json)" >> $GITHUB_ENV
      
      - name: Notify Devnet Deployment
        run: |
          curl -X POST $OPENCLAW_WEBHOOK/ci/success \
            -H "Authorization: Bearer $OPENCLAW_TOKEN" \
            -H "Content-Type: application/json" \
            -d '{
              "program": "${{ env.PROGRAM_NAME }}",
              "programId": "${{ env.PROGRAM_ID }}",
              "network": "devnet",
              "commit": "${{ github.sha }}",
              "stage": "deploy",
              "message": "✅ Deployed to devnet. React with ✅ to deploy to mainnet."
            }'

  deploy-mainnet:
    needs: deploy-devnet
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Solana
        uses: metaplex-foundation/actions/install-solana@v1
      
      - name: Setup Anchor
        uses: metaplex-foundation/actions/install-anchor@v1
      
      - name: Download Artifacts
        uses: actions/download-artifact@v3
        with:
          name: program-artifacts
      
      - name: Deploy to Mainnet
        env:
          ANCHOR_WALLET: ${{ secrets.MAINNET_WALLET }}
        run: |
          cd programs/${{ env.PROGRAM_NAME }}
          anchor deploy --provider.cluster mainnet
          echo "PROGRAM_ID=$(solana address -k target/deploy/${{ env.PROGRAM_NAME }}-keypair.json)" >> $GITHUB_ENV
      
      - name: Notify Mainnet Deployment
        run: |
          curl -X POST $OPENCLAW_WEBHOOK/ci/success \
            -H "Authorization: Bearer $OPENCLAW_TOKEN" \
            -H "Content-Type: application/json" \
            -d '{
              "program": "${{ env.PROGRAM_NAME }}",
              "programId": "${{ env.PROGRAM_ID }}",
              "network": "mainnet-beta",
              "commit": "${{ github.sha }}",
              "stage": "deploy",
              "message": "🚀 Deployed to mainnet!"
            }'
      
      - name: Setup Helius Monitoring
        env:
          HELIUS_API_KEY: ${{ secrets.HELIUS_API_KEY }}
        run: |
          curl -X POST "https://api.helius.xyz/v0/webhooks?api-key=$HELIUS_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{
              "webhookURL": "${{ env.OPENCLAW_WEBHOOK }}/helius/transactions",
              "accountAddresses": ["${{ env.PROGRAM_ID }}"],
              "webhookType": "enhanced",
              "transactionTypes": ["ANY"]
            }'
```

### 3. Monitoring Scripts

**check-program-health.sh:**

```bash
#!/bin/bash

PROGRAM_ID="GuestBooK11111111111111111111111111111111"
OPENCLAW_WEBHOOK="http://localhost:3000/webhook/health"

# Check balance
BALANCE=$(solana balance $PROGRAM_ID | awk '{print $1}')

# Check recent transactions
TX_COUNT=$(solana transaction-history $PROGRAM_ID --limit 100 | wc -l)

# Check for errors
ERRORS=$(solana logs $PROGRAM_ID --limit 100 | grep -i error | wc -l)

# Calculate health score
HEALTH="healthy"
if [ "$ERRORS" -gt 5 ]; then
  HEALTH="unhealthy"
elif [ "$ERRORS" -gt 0 ]; then
  HEALTH="warning"
fi

# Send to OpenClaw
curl -X POST $OPENCLAW_WEBHOOK \
  -H "Content-Type: application/json" \
  -d "{
    \"program\": \"$PROGRAM_ID\",
    \"balance\": $BALANCE,
    \"recentTransactions\": $TX_COUNT,
    \"errors\": $ERRORS,
    \"health\": \"$HEALTH\",
    \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"
  }"
```

**deploy-mainnet.sh:**

```bash
#!/bin/bash

# This script is triggered by OpenClaw approval hook

PROGRAM_NAME="guestbook"
PROGRAM_DIR="/path/to/project/programs/$PROGRAM_NAME"

cd $PROGRAM_DIR

# Deploy to mainnet
anchor deploy --provider.cluster mainnet

# Get program ID
PROGRAM_ID=$(solana address -k target/deploy/$PROGRAM_NAME-keypair.json)

# Notify OpenClaw
curl -X POST http://localhost:3000/webhook/ci/success \
  -H "Content-Type: application/json" \
  -d "{
    \"program\": \"$PROGRAM_NAME\",
    \"programId\": \"$PROGRAM_ID\",
    \"network\": \"mainnet-beta\",
    \"stage\": \"deploy\",
    \"message\": \"🚀 Deployed to mainnet!\"
  }"
```

### 4. OpenClaw Webhook Handlers

**~/.openclaw/webhooks/ci-started.js:**

```javascript
module.exports = async (req, res, openclaw) => {
  const { program, commit, author, branch } = req.body;
  
  await openclaw.sendMessage({
    channel: 'slack:#deployments',
    message: `
🔨 CI Started
Program: ${program}
Author: ${author}
Branch: ${branch}
Commit: ${commit.substring(0, 7)}
    `
  });
  
  res.sendStatus(200);
};
```

**~/.openclaw/webhooks/ci-success.js:**

```javascript
module.exports = async (req, res, openclaw) => {
  const { program, programId, network, stage, message } = req.body;
  
  if (stage === 'deploy' && network === 'devnet') {
    // Send approval request
    const msg = await openclaw.sendMessage({
      channel: 'slack:#deployments',
      message: `
✅ Deployed to Devnet
Program: ${program}
Program ID: ${programId}
Network: ${network}

React with ✅ to deploy to mainnet
      `
    });
    
    // Store message ID for approval hook
    await openclaw.memory.store({
      key: `approval-${program}`,
      value: { messageId: msg.id, programId }
    });
  } else if (stage === 'deploy' && network === 'mainnet-beta') {
    await openclaw.sendMessage({
      channel: 'slack:#deployments',
      message: `
🚀 Deployed to Mainnet!
Program: ${program}
Program ID: ${programId}
Network: ${network}

Monitoring enabled ✓
      `
    });
  }
  
  res.sendStatus(200);
};
```

**~/.openclaw/webhooks/ci-failure.js:**

```javascript
module.exports = async (req, res, openclaw) => {
  const { program, commit, stage, error } = req.body;
  
  await openclaw.sendMessage({
    channel: 'slack:#alerts',
    message: `
❌ CI Failed
Program: ${program}
Stage: ${stage}
Commit: ${commit.substring(0, 7)}
Error: ${error}

@devops please investigate
    `
  });
  
  res.sendStatus(200);
};
```

**~/.openclaw/webhooks/health.js:**

```javascript
module.exports = async (req, res, openclaw) => {
  const { program, balance, recentTransactions, errors, health } = req.body;
  
  if (health === 'unhealthy') {
    await openclaw.sendMessage({
      channel: 'slack:#alerts',
      message: `
🚨 Program Health Alert
Program: ${program}
Balance: ${balance} SOL
Recent Transactions: ${recentTransactions}
Errors: ${errors}
Status: ${health}

@devops immediate attention required!
      `
    });
  } else if (health === 'warning') {
    await openclaw.sendMessage({
      channel: 'slack:#monitoring',
      message: `
⚠️ Program Health Warning
Program: ${program}
Errors: ${errors}
Status: ${health}
      `
    });
  }
  
  res.sendStatus(200);
};
```

## Usage

### 1. Initial Setup

```bash
# Install OpenClaw
curl -fsSL https://openclaw.ai/install.sh | bash

# Start gateway
openclaw daemon start

# Connect Slack
openclaw channels add slack

# Setup webhooks
./setup-webhooks.sh
```

### 2. Deploy Workflow

```bash
# 1. Push to GitHub
git push origin main

# 2. CI runs automatically
# - Build program
# - Run tests
# - Deploy to devnet
# - Notify team

# 3. Approve mainnet deployment
# React with ✅ in Slack

# 4. Mainnet deployment
# - Deploys to mainnet
# - Sets up monitoring
# - Notifies team

# 5. Continuous monitoring
# - Health checks every 5 minutes
# - Transaction monitoring via Helius
# - Error alerts
```

### 3. Team Commands

```bash
# In Slack:
/check-status          # Check program status
/get-logs              # Get recent logs
/deploy-devnet         # Manual devnet deploy
/run-tests             # Run test suite
```

## Results

- **Deployment time**: 5-10 minutes (automated)
- **Team visibility**: Real-time notifications
- **Error detection**: < 5 minutes
- **Approval workflow**: 1-click approval
- **Monitoring**: Continuous, automated

## Next Steps

1. Customize webhook handlers
2. Add more monitoring checks
3. Integrate with other tools
4. Setup alerting rules
5. Create dashboards
