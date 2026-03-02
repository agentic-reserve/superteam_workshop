# Solana Workflows with OpenClaw

## Complete Workflow Examples

### 1. Deployment Pipeline

```yaml
# Complete deployment workflow
name: Solana Deployment Pipeline

# Trigger: Git push to main
on:
  push:
    branches: [main]

# Steps:
1. Build program
2. Run tests
3. Deploy to devnet
4. Notify team (OpenClaw)
5. Wait for approval
6. Deploy to mainnet
7. Monitor transactions
```

**Implementation:**

```bash
# 1. Create deployment webhook
openclaw webhooks create \
  --name "deployment-pipeline" \
  --path "/webhook/deploy" \
  --channel "#deployments"

# 2. Create approval hook
openclaw hooks create \
  --name "approve-mainnet" \
  --event "on:reaction" \
  --filter "✅" \
  --command "deploy-mainnet.sh"

# 3. Create monitoring cron
openclaw cron create \
  --name "monitor-transactions" \
  --schedule "*/5 * * * *" \
  --command "check-program-transactions.sh" \
  --channel "#monitoring"
```

**GitHub Actions:**

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-devnet:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build
        run: anchor build
      
      - name: Test
        run: anchor test
      
      - name: Deploy to Devnet
        run: anchor deploy --provider.cluster devnet
      
      - name: Notify OpenClaw
        run: |
          curl -X POST ${{ secrets.OPENCLAW_WEBHOOK }}/deploy \
            -d '{
              "stage": "devnet",
              "program": "${{ env.PROGRAM_ID }}",
              "commit": "${{ github.sha }}",
              "status": "success"
            }'
  
  deploy-mainnet:
    needs: deploy-devnet
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to Mainnet
        run: anchor deploy --provider.cluster mainnet
      
      - name: Notify Success
        run: |
          curl -X POST ${{ secrets.OPENCLAW_WEBHOOK }}/deploy \
            -d '{
              "stage": "mainnet",
              "program": "${{ env.PROGRAM_ID }}",
              "status": "success"
            }'
```

### 2. Transaction Monitoring

```typescript
// Helius webhook → OpenClaw → Slack/Discord

// 1. Create Helius webhook
const webhook = await helius.webhooks.createWebhook({
  webhookURL: "https://your-gateway.com/webhook/transactions",
  accountAddresses: [programId],
  webhookType: "enhanced",
  transactionTypes: ["SWAP", "TRANSFER", "NFT_SALE"],
});

// 2. OpenClaw webhook handler
// ~/.openclaw/webhooks/transactions.js
module.exports = async (req, res, openclaw) => {
  const tx = req.body;
  
  // Filter important transactions
  if (tx.nativeTransfers.some(t => t.amount > 1_000_000_000)) {
    await openclaw.sendMessage({
      channel: 'slack:#alerts',
      message: `
🚨 Large Transaction Alert
Type: ${tx.type}
Amount: ${tx.nativeTransfers[0].amount / 1e9} SOL
Signature: ${tx.signature}
      `
    });
  }
  
  // Log all transactions
  await openclaw.sendMessage({
    channel: 'discord:transactions',
    embed: {
      title: 'New Transaction',
      fields: [
        { name: 'Type', value: tx.type },
        { name: 'Fee', value: `${tx.fee / 1e9} SOL` },
        { name: 'Signature', value: tx.signature }
      ]
    }
  });
  
  res.sendStatus(200);
};
```

### 3. Error Monitoring

```bash
# Create error monitoring cron
openclaw cron create \
  --name "error-monitor" \
  --schedule "*/5 * * * *" \
  --command "check-errors.sh" \
  --channel "#alerts"
```

**check-errors.sh:**

```bash
#!/bin/bash

# Check program logs for errors
ERRORS=$(solana logs $PROGRAM_ID --limit 100 | grep -i error)

if [ ! -z "$ERRORS" ]; then
  # Send to OpenClaw
  curl -X POST http://localhost:3000/webhook/errors \
    -d "{
      \"program\": \"$PROGRAM_ID\",
      \"errors\": \"$ERRORS\",
      \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"
    }"
fi
```

### 4. Performance Monitoring

```bash
# Monitor compute units
openclaw cron create \
  --name "cu-monitor" \
  --schedule "0 * * * *" \
  --command "analyze-compute-units.sh" \
  --channel "#performance"
```

**analyze-compute-units.sh:**

```bash
#!/bin/bash

# Get recent transactions
SIGNATURES=$(solana transaction-history $PROGRAM_ID --limit 100)

# Analyze compute units
TOTAL_CU=0
COUNT=0

for SIG in $SIGNATURES; do
  CU=$(solana confirm $SIG -v | grep "Compute Units" | awk '{print $3}')
  TOTAL_CU=$((TOTAL_CU + CU))
  COUNT=$((COUNT + 1))
done

AVG_CU=$((TOTAL_CU / COUNT))

# Send report
curl -X POST http://localhost:3000/webhook/performance \
  -d "{
    \"average_cu\": $AVG_CU,
    \"total_transactions\": $COUNT,
    \"period\": \"1 hour\"
  }"
```

### 5. Team Commands

```bash
# Create slash commands for team

# /deploy-devnet
openclaw slash-commands add deploy-devnet \
  --command "cd /path/to/project && anchor deploy --provider.cluster devnet" \
  --description "Deploy to devnet"

# /deploy-mainnet (requires approval)
openclaw slash-commands add deploy-mainnet \
  --command "deploy-with-approval.sh" \
  --description "Deploy to mainnet (requires approval)"

# /check-status
openclaw slash-commands add check-status \
  --command "solana program show $PROGRAM_ID" \
  --description "Check program status"

# /get-logs
openclaw slash-commands add get-logs \
  --command "solana logs $PROGRAM_ID --limit 50" \
  --description "Get recent logs"

# /run-tests
openclaw slash-commands add run-tests \
  --command "cd /path/to/project && anchor test" \
  --description "Run test suite"
```

### 6. Voice Commands

```bash
# Enable voice wake
openclaw voicewake enable

# Configure voice commands
{
  "voiceCommands": {
    "deploy to devnet": "anchor deploy --provider.cluster devnet",
    "check status": "solana program show $PROGRAM_ID",
    "get logs": "solana logs $PROGRAM_ID",
    "run tests": "anchor test"
  }
}
```

**Usage:**
```
You: "Hey OpenClaw, deploy to devnet"
OpenClaw: "Deploying to devnet..."
OpenClaw: "✅ Deployed! Program ID: GuestBooK..."
```

### 7. Multi-Agent Workflow

```json
{
  "agents": {
    "deploy-agent": {
      "model": "claude-3-5-sonnet-20241022",
      "skills": ["solana-dev"],
      "tools": ["exec"],
      "channels": ["slack:#deployments"]
    },
    "monitor-agent": {
      "model": "gpt-4-turbo",
      "skills": ["helius"],
      "tools": ["web"],
      "channels": ["discord:monitoring"]
    },
    "support-agent": {
      "model": "claude-3-5-sonnet-20241022",
      "skills": ["solana-dev", "helius"],
      "tools": ["exec", "browser"],
      "channels": ["slack:#support"]
    }
  }
}
```

## Next: Advanced Features

See `05-advanced.md` for browser automation, multi-agent, and more.
