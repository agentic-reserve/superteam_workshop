# OpenClaw Architecture Diagram

## Complete System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL PLATFORMS                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  Slack   │  │ Discord  │  │ Telegram │  │ WhatsApp │  + 16 more│
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────────────────────────────────────────────────────┘
                              ↓ ↑
                    Webhooks / WebSockets / APIs
                              ↓ ↑
┌─────────────────────────────────────────────────────────────────────┐
│                      CHANNEL ADAPTERS                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Protocol Translation │ Message Formatting │ Event Handling  │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              ↓ ↑
┌─────────────────────────────────────────────────────────────────────┐
│                      OPENCLAW GATEWAY                               │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                    AGENT RUNTIME                           │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │   │
│  │  │   Deploy     │  │   Monitor    │  │   Support    │    │   │
│  │  │   Agent      │  │   Agent      │  │   Agent      │    │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │   │
│  │                                                            │   │
│  │  Model: Claude 3.5 Sonnet / GPT-4 Turbo                  │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                    SKILLS MANAGER                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │   │
│  │  │  solana-dev  │  │   helius     │  │   jupiter    │    │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │   │
│  │  + All workshop skills available                          │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                    TOOLS REGISTRY                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │   │
│  │  │    exec      │  │   browser    │  │     web      │    │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │   │
│  │  ┌──────────────┐  ┌──────────────┐                      │   │
│  │  │    file      │  │  agent_send  │  + Custom tools      │   │
│  │  └──────────────┘  └──────────────┘                      │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                    AUTOMATION                              │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │   │
│  │  │  Webhooks    │  │  Cron Jobs   │  │    Hooks     │    │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                    MEMORY & CONTEXT                        │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │   │
│  │  │   Sessions   │  │    Cache     │  │   Storage    │    │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │   │
│  └────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                              ↓ ↑
                    RPC Calls / API Requests
                              ↓ ↑
┌─────────────────────────────────────────────────────────────────────┐
│                    SOLANA INFRASTRUCTURE                            │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Helius RPC │ DAS API │ Webhooks │ Enhanced Transactions    │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              ↓ ↑
┌─────────────────────────────────────────────────────────────────────┐
│                    YOUR SOLANA APPLICATION                          │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Programs │ Frontend │ Backend │ Database                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Examples

### 1. Deployment Notification Flow

```
GitHub Push
    ↓
GitHub Actions (CI/CD)
    ↓
Build & Test Program
    ↓
Deploy to Devnet
    ↓
HTTP POST to OpenClaw Webhook
    ↓
OpenClaw Gateway receives webhook
    ↓
Routes to Deploy Agent
    ↓
Agent formats message
    ↓
Sends to Slack Channel Adapter
    ↓
Slack API
    ↓
Team sees notification in Slack
    ↓
Team member reacts with ✅
    ↓
Slack sends reaction event to OpenClaw
    ↓
OpenClaw Hook triggers
    ↓
Executes deploy-mainnet.sh
    ↓
Deploys to Mainnet
    ↓
Sends success notification
```

### 2. Transaction Monitoring Flow

```
Solana Transaction occurs
    ↓
Helius detects transaction
    ↓
Helius Webhook fires
    ↓
HTTP POST to OpenClaw
    ↓
OpenClaw Gateway receives webhook
    ↓
Routes to Monitor Agent
    ↓
Agent analyzes transaction
    ↓
If important: Alert to Slack
    ↓
If normal: Log to Discord
    ↓
Team sees real-time updates
```

### 3. Voice Command Flow

```
User says: "Hey OpenClaw, deploy to devnet"
    ↓
Voice Wake detects command
    ↓
Speech-to-text conversion
    ↓
OpenClaw Gateway receives text
    ↓
Routes to Deploy Agent
    ↓
Agent activates solana-dev skill
    ↓
Executes: anchor deploy --provider.cluster devnet
    ↓
Captures output
    ↓
Sends result via voice
    ↓
User hears: "Deployed successfully"
```

### 4. Error Monitoring Flow

```
Cron Job triggers (every 5 minutes)
    ↓
Executes: check-program-health.sh
    ↓
Script checks program logs
    ↓
Finds errors
    ↓
HTTP POST to OpenClaw
    ↓
OpenClaw Gateway receives health data
    ↓
Routes to Monitor Agent
    ↓
Agent evaluates severity
    ↓
If critical: Alert to #alerts + mention @devops
    ↓
If warning: Log to #monitoring
    ↓
Team responds to alert
```

## Component Interactions

### Agent → Skills

```
User: "Help me deploy a program"
    ↓
Agent receives message
    ↓
Detects keywords: "deploy", "program"
    ↓
Activates solana-dev skill
    ↓
Loads skill content into context
    ↓
Generates response with skill knowledge
    ↓
Returns deployment instructions
```

### Agent → Tools

```
Agent needs to execute command
    ↓
Calls exec tool
    ↓
Tool executes: anchor build
    ↓
Captures stdout/stderr
    ↓
Returns result to agent
    ↓
Agent formats output
    ↓
Sends to channel
```

### Multi-Agent Orchestration

```
User: "Deploy and monitor"
    ↓
Gateway routes to Deploy Agent
    ↓
Deploy Agent: Deploys program
    ↓
Deploy Agent → Monitor Agent: "Start monitoring PROGRAM_ID"
    ↓
Monitor Agent: Sets up monitoring
    ↓
Monitor Agent → Security Agent: "Audit transactions"
    ↓
Security Agent: Analyzes transactions
    ↓
All agents report back to user
```

## Scaling Architecture

### Horizontal Scaling

```
┌─────────────────────────────────────────────────────────────┐
│                      LOAD BALANCER (Nginx)                  │
└─────────────────────────────────────────────────────────────┘
                    ↓           ↓           ↓
        ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
        │  Gateway 1    │ │  Gateway 2    │ │  Gateway 3    │
        └───────────────┘ └───────────────┘ └───────────────┘
                    ↓           ↓           ↓
        ┌───────────────────────────────────────────────────┐
        │              Redis (Shared State)                 │
        └───────────────────────────────────────────────────┘
                              ↓
        ┌───────────────────────────────────────────────────┐
        │         PostgreSQL (Persistent Storage)           │
        └───────────────────────────────────────────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: Network Security                                  │
│  - IP Whitelist                                             │
│  - Rate Limiting                                            │
│  - CORS                                                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 2: Authentication                                    │
│  - Bearer Tokens                                            │
│  - API Keys                                                 │
│  - OAuth                                                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 3: Authorization                                     │
│  - Role-Based Access Control                                │
│  - Permission Checks                                        │
│  - Resource Limits                                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 4: Webhook Security                                  │
│  - Signature Verification                                   │
│  - Timestamp Validation                                     │
│  - Replay Protection                                        │
└─────────────────────────────────────────────────────────────┘
```

## Monitoring Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    OBSERVABILITY                            │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Prometheus  │  │ Elasticsearch│  │ OpenTelemetry│     │
│  │  (Metrics)   │  │    (Logs)    │  │   (Traces)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         ↓                  ↓                  ↓            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    Grafana                           │  │
│  │              (Unified Dashboard)                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Workshop Integration

```
┌─────────────────────────────────────────────────────────────┐
│                    WORKSHOP MODULES                         │
│                                                             │
│  01-skills-solana ──────────┐                              │
│  02-specs-solana ───────────┤                              │
│  02-hooks ──────────────────┤                              │
│  03-steering ───────────────┼──→ OpenClaw Gateway          │
│  04-mcp ────────────────────┤                              │
│  08-deployment ─────────────┤                              │
│  example-app ───────────────┘                              │
│                                                             │
│  All skills, hooks, and configurations                      │
│  work seamlessly with OpenClaw                              │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Topology

### Development

```
┌─────────────────────────────────────────────────────────────┐
│  Developer Machine                                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  OpenClaw Gateway (localhost:3000)                   │   │
│  │  - Local skills                                      │   │
│  │  - Test webhooks                                     │   │
│  │  - Development channels                              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Production

```
┌─────────────────────────────────────────────────────────────┐
│  Cloud Infrastructure (AWS/GCP/Azure)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Load Balancer                                       │   │
│  └──────────────────────────────────────────────────────┘   │
│         ↓           ↓           ↓                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │Gateway 1 │ │Gateway 2 │ │Gateway 3 │                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
│         ↓           ↓           ↓                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Redis Cluster (Shared State)                       │   │
│  └──────────────────────────────────────────────────────┘   │
│         ↓                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  PostgreSQL (Persistent Storage)                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

**Legend:**
- `↓` : Data flow direction
- `→` : Integration/connection
- `┌─┐` : Component boundary
- `│ │` : Container/grouping

**See Also:**
- [Architecture Deep Dive](./deep-dive/01-architecture.md)
- [Production Deployment](./deep-dive/06-production.md)
- [Quick Start](./QUICK-START.md)
