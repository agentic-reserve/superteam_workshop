# Automation Deep Dive

## Overview

OpenClaw provides three automation mechanisms:
1. **Webhooks** - HTTP endpoints for external events
2. **Cron Jobs** - Scheduled tasks
3. **Hooks** - Event-driven automation

## Webhooks

### Creating Webhooks

```bash
# Create webhook
openclaw webhooks create \
  --name "solana-deploy" \
  --path "/webhook/deploy" \
  --channel "#deployments"

# List webhooks
openclaw webhooks list

# Test webhook
curl -X POST http://localhost:3000/webhook/deploy \
  -H "Content-Type: application/json" \
  -d '{"program": "GuestBooK...", "status": "deployed"}'
```

### Webhook Configuration

```json
{
  "webhooks": {
    "solana-deploy": {
      "path": "/webhook/deploy",
      "method": "POST",
      "auth": {
        "type": "bearer",
        "token": "secret"
      },
      "channels": ["slack:#deployments"],
      "template": "🚀 Deployed {{program}} to {{network}}"
    }
  }
}
```

### Helius Integration

```typescript
// Create Helius webhook → OpenClaw
const webhook = await helius.webhooks.createWebhook({
  webhookURL: "https://your-gateway.com/webhook/transactions",
  accountAddresses: [programId],
  webhookType: "enhanced",
});

// OpenClaw webhook handler
{
  "webhooks": {
    "transactions": {
      "path": "/webhook/transactions",
      "channels": ["slack:#transactions"],
      "template": `
🔔 New Transaction
Type: {{type}}
Signature: {{signature}}
Fee: {{fee}} SOL
      `
    }
  }
}
```

### CI/CD Integration

```yaml
# .github/workflows/deploy.yml
- name: Notify OpenClaw
  run: |
    curl -X POST ${{ secrets.OPENCLAW_WEBHOOK }} \
      -H "Authorization: Bearer ${{ secrets.OPENCLAW_TOKEN }}" \
      -d '{
        "program": "${{ env.PROGRAM_ID }}",
        "network": "mainnet",
        "commit": "${{ github.sha }}",
        "status": "deployed"
      }'
```

## Cron Jobs

### Creating Cron Jobs

```bash
# Create cron job
openclaw cron create \
  --name "daily-build" \
  --schedule "0 9 * * *" \
  --command "cd /path/to/project && anchor build && anchor test" \
  --channel "#dev-updates"

# List cron jobs
openclaw cron list

# Delete cron job
openclaw cron delete daily-build
```

### Cron Schedule Format

```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6)
│ │ │ │ │
* * * * *
```

**Examples:**
```bash
# Every 5 minutes
*/5 * * * *

# Every hour
0 * * * *

# Every day at 9 AM
0 9 * * *

# Every Monday at 9 AM
0 9 * * 1

# First day of month
0 0 1 * *
```

### Solana Monitoring Examples

```bash
# Check program balance every hour
openclaw cron create \
  --name "check-balance" \
  --schedule "0 * * * *" \
  --command "solana balance <PROGRAM_ID>" \
  --channel "#monitoring"

# Check for errors every 5 minutes
openclaw cron create \
  --name "check-errors" \
  --schedule "*/5 * * * *" \
  --command "solana logs <PROGRAM_ID> | grep ERROR" \
  --channel "#alerts"

# Daily test suite
openclaw cron create \
  --name "daily-tests" \
  --schedule "0 9 * * *" \
  --command "cd /path/to/project && anchor test" \
  --channel "#test-results"

# Weekly deployment report
openclaw cron create \
  --name "weekly-report" \
  --schedule "0 9 * * 1" \
  --command "generate-deployment-report.sh" \
  --channel "#reports"
```

## Hooks

### Hook Types

1. **Pre-execution hooks** - Run before command
2. **Post-execution hooks** - Run after command
3. **Event hooks** - Trigger on events

### Creating Hooks

```bash
# Create hook
openclaw hooks create \
  --name "pre-deploy" \
  --event "before:exec" \
  --filter "anchor deploy" \
  --command "echo 'Deploying...'" \
  --channel "#deployments"
```

### Hook Configuration

```json
{
  "hooks": {
    "pre-deploy": {
      "event": "before:exec",
      "filter": "anchor deploy",
      "actions": [
        {
          "type": "notify",
          "channel": "#deployments",
          "message": "🚀 Starting deployment..."
        },
        {
          "type": "exec",
          "command": "git rev-parse HEAD"
        }
      ]
    },
    "post-deploy": {
      "event": "after:exec",
      "filter": "anchor deploy",
      "actions": [
        {
          "type": "notify",
          "channel": "#deployments",
          "message": "✅ Deployment complete"
        },
        {
          "type": "webhook",
          "url": "https://api.example.com/notify"
        }
      ]
    }
  }
}
```

### Event Types

```typescript
type HookEvent =
  | 'before:exec'      // Before command execution
  | 'after:exec'       // After command execution
  | 'on:error'         // On command error
  | 'on:message'       // On new message
  | 'on:mention'       // On bot mention
  | 'on:reaction'      // On reaction added
  | 'on:join'          // On user join
  | 'on:leave';        // On user leave
```

## Heartbeat Monitoring

Monitor gateway health:

```bash
# Enable heartbeat
openclaw heartbeat enable \
  --interval 60 \
  --channel "#monitoring"

# Configure heartbeat
{
  "heartbeat": {
    "enabled": true,
    "interval": 60,
    "channels": ["#monitoring"],
    "checks": [
      "gateway",
      "channels",
      "tools",
      "memory"
    ]
  }
}
```

## Polling

Poll external APIs:

```bash
# Create poll
openclaw poll create \
  --name "check-rpc" \
  --url "https://api.mainnet-beta.solana.com" \
  --interval 300 \
  --channel "#monitoring"
```

## Next: Tools Deep Dive

See `04-tools.md` for detailed tool configuration.
