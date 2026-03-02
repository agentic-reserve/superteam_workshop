# Channels Deep Dive

## Overview

Channels connect OpenClaw to external platforms. Each channel has an adapter that handles platform-specific protocols.

## Channel Architecture

```
┌─────────────────────────────────────┐
│         External Platform           │
│  (Slack, Discord, Telegram, etc)   │
└─────────────────────────────────────┘
              ↓ Webhook/WebSocket
┌─────────────────────────────────────┐
│         Channel Adapter             │
│  - Protocol translation             │
│  - Message formatting               │
│  - Event handling                   │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         Gateway Router              │
│  - Route to agent                   │
│  - Session management               │
└─────────────────────────────────────┘
```

## Slack Integration

### Setup

```bash
# Add Slack channel
openclaw channels add slack

# Follow prompts:
# 1. Create Slack app at api.slack.com
# 2. Add bot token scopes
# 3. Install app to workspace
# 4. Copy bot token
```

### Configuration

```json
{
  "channels": {
    "slack": {
      "token": "xoxb-your-bot-token",
      "signingSecret": "your-signing-secret",
      "channels": ["#deployments", "#dev-updates"],
      "features": {
        "reactions": true,
        "threads": true,
        "mentions": true
      }
    }
  }
}
```

### Usage

```bash
# In Slack:
@openclaw deploy to devnet

# Agent responds:
# ✅ Deploying to devnet...
# Program ID: GuestBooK11111111111111111111111111111111
# Signature: 5j7s...
```

### Slash Commands

```bash
# Create slash command
openclaw slash-commands add deploy-devnet \
  --command "anchor deploy --provider.cluster devnet" \
  --description "Deploy program to devnet"

# Use in Slack:
/deploy-devnet
```

## Discord Integration

### Setup

```bash
# Add Discord channel
openclaw channels add discord

# Follow prompts:
# 1. Create Discord app
# 2. Add bot to server
# 3. Copy bot token
```

### Configuration

```json
{
  "channels": {
    "discord": {
      "token": "your-bot-token",
      "guilds": ["guild-id"],
      "channels": ["deployments", "dev-updates"],
      "features": {
        "embeds": true,
        "reactions": true
      }
    }
  }
}
```

### Rich Embeds

```typescript
// Send rich embed to Discord
await openclaw.sendMessage({
  channel: 'discord:deployments',
  embed: {
    title: '🚀 Deployment Complete',
    description: 'Program deployed to mainnet',
    fields: [
      { name: 'Program ID', value: 'GuestBooK...' },
      { name: 'Network', value: 'mainnet-beta' },
      { name: 'Signature', value: '5j7s...' }
    ],
    color: 0x00ff00
  }
});
```

## Telegram Integration

### Setup

```bash
# Add Telegram channel
openclaw channels add telegram

# Follow prompts:
# 1. Create bot via @BotFather
# 2. Copy bot token
# 3. Add bot to group
```

### Configuration

```json
{
  "channels": {
    "telegram": {
      "token": "your-bot-token",
      "chats": ["chat-id-1", "chat-id-2"],
      "features": {
        "inline": true,
        "commands": true
      }
    }
  }
}
```

### Bot Commands

```bash
# In Telegram:
/deploy devnet
/status
/logs
/help
```

## WhatsApp Integration

### Setup (via WhatsApp Web)

```bash
# Add WhatsApp channel
openclaw channels add whatsapp

# Scan QR code with WhatsApp
openclaw qr whatsapp
```

### Configuration

```json
{
  "channels": {
    "whatsapp": {
      "session": "whatsapp-session",
      "contacts": ["+1234567890"],
      "groups": ["group-id"]
    }
  }
}
```

## Channel Routing

Route messages to specific agents:

```json
{
  "routing": {
    "slack:#deployments": "solana-deploy-agent",
    "discord:dev-updates": "solana-dev-agent",
    "telegram:*": "default-agent"
  }
}
```

## Broadcast Groups

Send to multiple channels:

```json
{
  "broadcastGroups": {
    "all-devs": [
      "slack:#dev-updates",
      "discord:dev-updates",
      "telegram:dev-chat"
    ]
  }
}
```

Usage:
```bash
openclaw message --group all-devs "Deployment complete!"
```

## Channel Features

### Reactions

```typescript
// Add reaction to message
await openclaw.addReaction({
  channel: 'slack:#deployments',
  messageId: 'msg-id',
  reaction: '✅'
});
```

### Threads

```typescript
// Reply in thread
await openclaw.sendMessage({
  channel: 'slack:#deployments',
  threadId: 'thread-id',
  message: 'Deployment logs attached'
});
```

### Mentions

```typescript
// Mention user
await openclaw.sendMessage({
  channel: 'slack:#deployments',
  message: '<@user-id> deployment complete'
});
```

## Next: Automation Deep Dive

See `03-automation.md` for webhooks, cron jobs, and hooks.
