# OpenClaw Architecture Deep Dive

## Overview

OpenClaw is a distributed AI agent platform with a gateway-based architecture that enables multi-channel communication and tool execution.

## Core Components

### 1. Gateway

The gateway is the central runtime that manages:
- Agent execution
- Tool invocation
- Session management
- Channel connections
- Memory and context

```
┌─────────────────────────────────────┐
│         Gateway Process             │
│                                     │
│  ┌──────────────────────────────┐  │
│  │   Agent Runtime              │  │
│  │   - Model inference          │  │
│  │   - Tool execution           │  │
│  │   - Context management       │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │   Channel Adapters           │  │
│  │   - Slack, Discord, etc      │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │   Tool Registry              │  │
│  │   - Exec, Browser, Web       │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Key Features:**
- Runs as daemon process
- HTTP/WebSocket API
- Local or remote deployment
- Multi-agent support
- Session isolation

### 2. Channels

Channels connect the gateway to external platforms:

```typescript
interface Channel {
  id: string;
  type: 'slack' | 'discord' | 'telegram' | ...;
  config: ChannelConfig;
  adapter: ChannelAdapter;
}
```

**Supported Channels:**
- Slack, Discord, Telegram
- WhatsApp, Signal, Matrix
- IRC, Teams, Google Chat
- iMessage (via BlueBubbles)
- And 20+ more

### 3. Agent Runtime

The agent runtime executes AI models and manages context:

```typescript
interface AgentRuntime {
  model: ModelProvider;
  tools: Tool[];
  skills: Skill[];
  memory: Memory;
  session: Session;
}
```

**Execution Flow:**
```
User Message
    ↓
Channel Adapter
    ↓
Gateway Router
    ↓
Agent Runtime
    ↓
Model Inference
    ↓
Tool Execution
    ↓
Response
    ↓
Channel Adapter
    ↓
User
```

### 4. Tools

Tools extend agent capabilities:

```typescript
interface Tool {
  name: string;
  description: string;
  parameters: Schema;
  execute: (params: any) => Promise<any>;
}
```

**Built-in Tools:**
- `exec` - Execute shell commands
- `browser` - Browser automation
- `web` - Web scraping
- `file` - File operations
- `agent_send` - Multi-agent communication

### 5. Skills

Skills provide specialized knowledge:

```typescript
interface Skill {
  name: string;
  description: string;
  triggers: string[];
  content: string;
}
```

**Skill Loading:**
```
~/.openclaw/skills/
├── solana-dev/
│   └── SKILL.md
├── helius/
│   └── SKILL.md
└── integrating-jupiter/
    └── SKILL.md
```

## Data Flow

### Message Processing

```
1. User sends message to Slack
2. Slack webhook → Gateway
3. Gateway routes to agent
4. Agent loads context + skills
5. Model generates response
6. Tools executed if needed
7. Response sent back to Slack
```

### Session Management

```typescript
interface Session {
  id: string;
  channel: string;
  user: string;
  context: Message[];
  memory: Memory;
  metadata: Record<string, any>;
}
```

**Session Lifecycle:**
- Created on first message
- Persisted to disk
- Pruned after inactivity
- Compacted to save tokens

## Configuration

### Gateway Config

`~/.openclaw/openclaw.json`:

```json
{
  "gateway": {
    "port": 3000,
    "host": "localhost",
    "auth": {
      "enabled": true,
      "token": "secret"
    }
  },
  "agents": {
    "default": {
      "model": "claude-3-5-sonnet-20241022",
      "provider": "anthropic",
      "skills": ["solana-dev"],
      "tools": ["exec", "browser"]
    }
  }
}
```

## Deployment Models

### 1. Local Gateway

```bash
# Run on your machine
openclaw daemon start

# Access locally
curl http://localhost:3000/health
```

**Pros:**
- Full control
- No network latency
- Free

**Cons:**
- Must keep machine running
- No remote access (without VPN)

### 2. Remote Gateway

```bash
# Deploy to VPS
ssh user@server
openclaw daemon start

# Access remotely
curl https://your-server.com/health
```

**Pros:**
- Always available
- Remote access
- Team sharing

**Cons:**
- Hosting costs
- Network latency

### 3. Hybrid

```bash
# Local gateway for development
openclaw daemon start --port 3000

# Remote gateway for production
ssh prod-server
openclaw daemon start --port 3000
```

## Next: Channels Deep Dive

See `02-channels.md` for detailed channel configuration.
