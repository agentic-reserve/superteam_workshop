# OpenClaw Integration - Multi-Platform AI Agent

## What is OpenClaw?

OpenClaw is an open-source AI agent platform that enables you to run AI agents across multiple platforms (Slack, Discord, Telegram, WhatsApp, etc.) with a unified interface.

**Powered by Ollama**: OpenClaw integrates seamlessly with Ollama, allowing you to use both local and cloud models for your Solana development workflow.

**Key Features:**
- Multi-channel support (20+ platforms)
- Gateway architecture (local or remote)
- Skills system (similar to Kiro)
- Automation (cron jobs, webhooks, hooks)
- Browser automation
- Voice and audio support
- Multi-agent routing
- **Ollama integration** - Local and cloud models

## Why OpenClaw for Solana Development?

OpenClaw can enhance your Solana development workflow by:
- **Multi-platform notifications** - Get deployment alerts on Slack/Discord
- **Automated monitoring** - Track program interactions via webhooks
- **Team collaboration** - Share agent across team channels
- **Voice commands** - Deploy or check status via voice
- **Browser automation** - Test dApp UIs automatically

## Architecture

```
┌─────────────────────────────────────┐
│         OpenClaw Gateway            │
│  - Agent runtime                    │
│  - Skills management                │
│  - Tool execution                   │
│  - Session management               │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         Channels                    │
│  - Slack, Discord, Telegram         │
│  - WhatsApp, Signal, Matrix         │
│  - IRC, Teams, etc.                 │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         Your Solana dApp            │
│  - Deployment notifications         │
│  - Transaction monitoring           │
│  - Error alerts                     │
└─────────────────────────────────────┘
```

## Quick Start

**Easiest way: Use Ollama** (5 minutes)

```bash
# Install Ollama
curl -fsSL https://ollama.com/download/install.sh | sh

# Launch OpenClaw (handles everything automatically)
ollama launch openclaw

# Choose your model:
# - gpt-oss:120b-cloud (recommended for Solana)
# - kimi-k2.5:cloud (multimodal)
# - glm-4.7-flash (local, requires GPU)
```

See [OLLAMA-SETUP.md](./OLLAMA-SETUP.md) for detailed Ollama integration guide.

**Want to get started in 15 minutes?** Follow the [Quick Start Guide](./QUICK-START.md)!

**Want to master OpenClaw?** Follow the [Deep Dive Series](./DEEP-DIVE.md) (2.5 hours)

### Manual Setup

### 1. Install OpenClaw

```bash
# Via installer (recommended)
curl -fsSL https://openclaw.ai/install.sh | bash

# Or via npm
npm install -g openclaw

# Verify installation
openclaw --version
```

### 2. Setup Gateway

```bash
# Initialize OpenClaw
openclaw setup

# Start gateway
openclaw daemon start

# Check status
openclaw status
```

### 3. Connect Channels

```bash
# Connect to Slack
openclaw channels add slack

# Connect to Discord
openclaw channels add discord

# Connect to Telegram
openclaw channels add telegram

# List connected channels
openclaw channels list
```

**Detailed setup**: See [QUICK-START.md](./QUICK-START.md) for step-by-step instructions.

## Solana Development Use Cases

### 1. Deployment Notifications

Get notified when your program deploys:

```bash
# Create webhook for deployment
openclaw webhooks create \
  --name "solana-deploy" \
  --url "https://your-ci.com/webhook" \
  --channel "#deployments"
```

**In your CI/CD:**
```bash
# After successful deployment
curl -X POST https://your-gateway/webhook/solana-deploy \
  -d '{
    "program": "GuestBooK11111111111111111111111111111111",
    "network": "mainnet",
    "status": "deployed"
  }'
```

### 2. Transaction Monitoring

Monitor program transactions via Helius webhooks:

```typescript
// Helius webhook → OpenClaw
const webhook = await helius.webhooks.createWebhook({
  webhookURL: "https://your-gateway/webhook/tx-monitor",
  accountAddresses: [programId],
  webhookType: "enhanced",
});

// OpenClaw forwards to Slack/Discord
// "🔔 New transaction on GuestBook program"
```

### 3. Error Alerts

Get alerted on program errors:

```bash
# Create cron job to check logs
openclaw cron create \
  --name "check-program-errors" \
  --schedule "*/5 * * * *" \
  --command "solana logs <PROGRAM_ID> | grep ERROR"
```

### 4. Team Commands

Create slash commands for team:

```bash
# /deploy-devnet - Deploy to devnet
# /check-balance - Check program balance
# /get-logs - Get recent logs
# /run-tests - Run test suite

openclaw slash-commands add deploy-devnet \
  --command "cd /path/to/project && anchor deploy --provider.cluster devnet"
```

### 5. Voice Deployment

Deploy via voice command:

```bash
# Enable voice wake
openclaw voicewake enable

# Say: "Hey OpenClaw, deploy to devnet"
# Agent executes: anchor deploy --provider.cluster devnet
```

## Integration with Workshop Skills

OpenClaw can use the same skills as Kiro:

### 1. Copy Skills to OpenClaw

```bash
# Copy Solana skills
cp -r .agents/skills/solana-dev ~/.openclaw/skills/
cp -r .agents/skills/helius ~/.openclaw/skills/
cp -r .agents/skills/integrating-jupiter ~/.openclaw/skills/

# Reload skills
openclaw skills reload
```

### 2. Configure Agent

Create `~/.openclaw/AGENTS.md`:

```markdown
# Solana Development Agent

You are a Solana development assistant with expertise in:
- Anchor program development
- @solana/kit SDK
- Helius RPC and APIs
- Jupiter integration
- Deployment and monitoring

## Available Skills

- solana-dev: End-to-end Solana development
- helius: RPC and API infrastructure
- integrating-jupiter: DeFi operations

## Commands

- /deploy-devnet: Deploy program to devnet
- /deploy-mainnet: Deploy program to mainnet
- /check-status: Check program status
- /get-logs: Get recent program logs
- /run-tests: Run test suite
```

### 3. Test Integration

```bash
# Send message to agent
openclaw message "Deploy guestbook program to devnet"

# Agent activates solana-dev skill
# Executes: anchor deploy --provider.cluster devnet
# Sends result to channel
```

## Automation Examples

### Example 1: Daily Build Check

```bash
# Create cron job
openclaw cron create \
  --name "daily-build" \
  --schedule "0 9 * * *" \
  --command "cd /path/to/project && anchor build && anchor test" \
  --channel "#dev-updates"
```

### Example 2: Transaction Monitor

```typescript
// webhook-handler.ts
import { OpenClawClient } from 'openclaw-sdk';

const client = new OpenClawClient({
  gatewayUrl: 'http://localhost:3000',
});

// Helius webhook handler
app.post('/webhook/transactions', async (req, res) => {
  const tx = req.body;
  
  await client.sendMessage({
    channel: '#transactions',
    message: `
🔔 New Transaction
Program: ${tx.accountData[0].account}
Type: ${tx.type}
Signature: ${tx.signature}
    `,
  });
  
  res.sendStatus(200);
});
```

### Example 3: Deployment Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy with OpenClaw

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build program
        run: anchor build
      
      - name: Deploy to devnet
        run: anchor deploy --provider.cluster devnet
      
      - name: Notify OpenClaw
        run: |
          curl -X POST ${{ secrets.OPENCLAW_WEBHOOK }} \
            -d '{
              "message": "✅ Deployed to devnet",
              "program": "${{ env.PROGRAM_ID }}",
              "commit": "${{ github.sha }}"
            }'
```

## Configuration

### Gateway Config

`~/.openclaw/openclaw.json`:

```json
{
  "gateway": {
    "port": 3000,
    "host": "localhost"
  },
  "agents": {
    "solana-dev": {
      "model": "claude-3-5-sonnet-20241022",
      "skills": [
        "solana-dev",
        "helius",
        "integrating-jupiter"
      ],
      "tools": [
        "exec",
        "browser",
        "web"
      ]
    }
  },
  "channels": {
    "slack": {
      "token": "xoxb-...",
      "channels": ["#deployments", "#dev-updates"]
    },
    "discord": {
      "token": "...",
      "channels": ["deployments", "dev-updates"]
    }
  }
}
```

## Best Practices

### 1. Security

- Use environment variables for tokens
- Restrict webhook access
- Enable authentication on gateway
- Use HTTPS for remote gateway

### 2. Monitoring

- Set up health checks
- Monitor gateway logs
- Track API usage
- Alert on failures

### 3. Team Collaboration

- Create dedicated channels
- Document slash commands
- Share agent configuration
- Version control AGENTS.md

### 4. Development Workflow

- Use separate agents for dev/prod
- Test on devnet first
- Automate repetitive tasks
- Log all deployments

## Troubleshooting

### Gateway Not Starting

```bash
# Check logs
openclaw logs

# Check status
openclaw status

# Restart gateway
openclaw daemon restart
```

### Skills Not Loading

```bash
# List skills
openclaw skills list

# Reload skills
openclaw skills reload

# Check skill format
cat ~/.openclaw/skills/solana-dev/SKILL.md
```

### Webhooks Not Working

```bash
# List webhooks
openclaw webhooks list

# Test webhook
curl -X POST http://localhost:3000/webhook/test \
  -d '{"test": "message"}'

# Check webhook logs
openclaw logs --filter webhook
```

## 📚 Complete Documentation

This module includes comprehensive documentation:

- **[INDEX.md](./INDEX.md)** - Complete documentation index and navigation
- **[QUICK-START.md](./QUICK-START.md)** - 15-minute setup guide
- **[DEEP-DIVE.md](./DEEP-DIVE.md)** - 2.5-hour complete learning path
- **[ARCHITECTURE-DIAGRAM.md](./ARCHITECTURE-DIAGRAM.md)** - Visual system overview
- **[troubleshooting.md](./troubleshooting.md)** - Common issues and solutions
- **[examples/](./examples/)** - Complete workflow examples

**Not sure where to start?** Check [INDEX.md](./INDEX.md) for guided navigation!

## Resources

- OpenClaw Docs: https://docs.openclaw.ai
- Skills Guide: https://docs.openclaw.ai/tools/skills.md
- Automation: https://docs.openclaw.ai/automation/
- Channels: https://docs.openclaw.ai/channels/
- Gateway: https://docs.openclaw.ai/gateway/
- Workshop Discord: #openclaw-help
- OpenClaw Discord: https://discord.gg/openclaw

## Next Steps

### Quick Start (15 minutes)
1. Follow [QUICK-START.md](./QUICK-START.md)
2. Install OpenClaw
3. Connect one channel
4. Test first webhook

### Deep Dive (2.5 hours)
1. Read [DEEP-DIVE.md](./DEEP-DIVE.md)
2. Complete all 6 modules
3. Build deployment pipeline
4. Deploy to production

### Integration Checklist

- [ ] OpenClaw installed
- [ ] Gateway running
- [ ] Channels connected (Slack/Discord)
- [ ] Workshop skills copied
- [ ] Agent configured
- [ ] First webhook created
- [ ] Deployment automation setup
- [ ] Monitoring enabled
- [ ] Team onboarded

**Ready to start?** → [QUICK-START.md](./QUICK-START.md)

**Need navigation help?** → [INDEX.md](./INDEX.md)
