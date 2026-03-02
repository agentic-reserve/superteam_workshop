# OpenClaw Quick Start - 15 Minutes

Get OpenClaw running with your Solana development workflow in 15 minutes.

## Prerequisites

- [ ] Completed main workshop (01-08)
- [ ] Have Slack or Discord account
- [ ] Example app running locally

## Step 1: Install OpenClaw (2 minutes)

```bash
# Install via installer (recommended)
curl -fsSL https://openclaw.ai/install.sh | bash

# Or via npm
npm install -g openclaw

# Verify installation
openclaw --version
```

## Step 2: Setup Gateway (3 minutes)

```bash
# Initialize OpenClaw
openclaw setup

# Follow prompts:
# - Choose model: claude-3-5-sonnet-20241022
# - Set API key: your-anthropic-key
# - Gateway port: 3000 (default)

# Start gateway
openclaw daemon start

# Verify gateway is running
openclaw status
```

## Step 3: Connect Slack (5 minutes)

### Create Slack App

1. Go to https://api.slack.com/apps
2. Click "Create New App" → "From scratch"
3. Name: "Solana Dev Bot"
4. Choose your workspace

### Configure Bot

1. Go to "OAuth & Permissions"
2. Add Bot Token Scopes:
   - `chat:write`
   - `channels:read`
   - `groups:read`
   - `reactions:read`
   - `reactions:write`
3. Click "Install to Workspace"
4. Copy "Bot User OAuth Token" (starts with `xoxb-`)

### Connect to OpenClaw

```bash
# Add Slack channel
openclaw channels add slack

# Paste bot token when prompted
# Token: xoxb-your-token-here

# Verify connection
openclaw channels list
```

### Invite Bot to Channel

In Slack:
```
/invite @Solana Dev Bot
```

## Step 4: Copy Workshop Skills (2 minutes)

```bash
# Copy Solana skills to OpenClaw
cp -r .agents/skills/solana-dev ~/.openclaw/skills/
cp -r .agents/skills/helius ~/.openclaw/skills/
cp -r .agents/skills/integrating-jupiter ~/.openclaw/skills/

# Reload skills
openclaw skills reload

# Verify skills loaded
openclaw skills list
```

## Step 5: Create First Webhook (3 minutes)

```bash
# Create deployment webhook
openclaw webhooks create \
  --name "deployment" \
  --path "/webhook/deploy" \
  --channel "#general"

# Test webhook
curl -X POST http://localhost:3000/webhook/deploy \
  -H "Content-Type: application/json" \
  -d '{
    "program": "guestbook",
    "network": "devnet",
    "status": "deployed"
  }'
```

Check Slack - you should see a message!

## Step 6: Test Agent (2 minutes)

In Slack, send a message:
```
@Solana Dev Bot help me deploy a program to devnet
```

The agent should respond with deployment instructions using the `solana-dev` skill!

## What You Just Built

✅ OpenClaw gateway running locally
✅ Connected to Slack
✅ Workshop skills available
✅ Webhook for deployment notifications
✅ AI agent with Solana expertise

## Next Steps

### Quick Wins (10 minutes each)

1. **Add Discord** (if you use it)
```bash
openclaw channels add discord
```

2. **Create Monitoring Cron**
```bash
openclaw cron create \
  --name "check-balance" \
  --schedule "0 * * * *" \
  --command "solana balance YOUR_PROGRAM_ID" \
  --channel "#general"
```

3. **Setup Helius Webhook**
```bash
# In your Helius dashboard, create webhook:
# URL: http://your-gateway-url/webhook/transactions
# Accounts: [YOUR_PROGRAM_ID]
```

### Deep Dive (2.5 hours)

Ready to master OpenClaw? Follow the deep dive series:

1. [Architecture](./deep-dive/01-architecture.md) - 15 min
2. [Channels](./deep-dive/02-channels.md) - 20 min
3. [Automation](./deep-dive/03-automation.md) - 25 min
4. [Solana Workflows](./deep-dive/04-solana-workflows.md) - 30 min
5. [Advanced Features](./deep-dive/05-advanced.md) - 25 min
6. [Production](./deep-dive/06-production.md) - 20 min

### Example Workflows

Check out complete examples:
- [Deployment Pipeline](./examples/deployment-pipeline.md)
- More examples coming soon!

## Troubleshooting

### Gateway won't start
```bash
# Check if port is in use
lsof -i :3000

# Try different port
openclaw daemon start --port 3001
```

### Slack not connecting
```bash
# Verify token
curl -H "Authorization: Bearer xoxb-..." \
  https://slack.com/api/auth.test

# Check bot is in channel
/invite @Solana Dev Bot
```

### Skills not loading
```bash
# Check skills directory
ls -la ~/.openclaw/skills/

# Reload skills
openclaw skills reload
```

For more help, see [Troubleshooting Guide](./troubleshooting.md)

## Common Commands

```bash
# Gateway
openclaw daemon start
openclaw daemon stop
openclaw status

# Channels
openclaw channels list
openclaw channels test slack

# Webhooks
openclaw webhooks list
openclaw webhooks test deployment

# Skills
openclaw skills list
openclaw skills reload

# Logs
openclaw logs --tail 50
openclaw logs --follow
```

## Configuration Files

```
~/.openclaw/
├── openclaw.json          # Main config
├── AGENTS.md              # Agent instructions (optional)
├── skills/                # Skills directory
│   ├── solana-dev/
│   ├── helius/
│   └── integrating-jupiter/
└── webhooks/              # Custom webhook handlers
```

## Resources

- [Main README](./README.md) - Overview and use cases
- [Deep Dive Index](./DEEP-DIVE.md) - Complete guide
- [Troubleshooting](./troubleshooting.md) - Common issues
- [OpenClaw Docs](https://docs.openclaw.ai) - Official docs

## Support

Need help?
- Check [Troubleshooting Guide](./troubleshooting.md)
- Ask in workshop Discord: #openclaw-help
- OpenClaw Discord: https://discord.gg/openclaw
- GitHub Issues: https://github.com/openclaw/openclaw/issues

---

**Congratulations!** 🎉 You now have a multi-platform AI agent for Solana development.

**Next**: Try the [Deployment Pipeline Example](./examples/deployment-pipeline.md) to see OpenClaw in action!
