# Advanced Features Deep Dive

## Overview

This guide covers advanced OpenClaw features for power users and complex workflows.

## Browser Automation

### Setup

```bash
# Enable browser tool
openclaw tools enable browser

# Install browser dependencies
openclaw browser install
```

### Basic Usage

```typescript
// Test dApp UI automatically
const result = await openclaw.browser({
  url: 'http://localhost:3000',
  actions: [
    { type: 'click', selector: '#connect-wallet' },
    { type: 'wait', duration: 2000 },
    { type: 'screenshot', path: 'wallet-connected.png' },
    { type: 'click', selector: '#send-transaction' },
    { type: 'wait', selector: '.transaction-success' },
    { type: 'screenshot', path: 'transaction-complete.png' }
  ]
});
```

### Solana dApp Testing

```typescript
// Automated UI testing workflow
const testWorkflow = {
  name: 'dapp-ui-test',
  steps: [
    {
      name: 'Connect Wallet',
      actions: [
        { type: 'goto', url: 'http://localhost:3000' },
        { type: 'click', selector: '[data-testid="connect-wallet"]' },
        { type: 'click', selector: '[data-testid="phantom-wallet"]' },
        { type: 'wait', selector: '.wallet-connected' }
      ],
      verify: { selector: '.wallet-address', exists: true }
    },
    {
      name: 'Check Balance',
      actions: [
        { type: 'click', selector: '[data-testid="check-balance"]' },
        { type: 'wait', selector: '.balance-display' }
      ],
      verify: { selector: '.balance-display', contains: 'SOL' }
    },
    {
      name: 'Send Transaction',
      actions: [
        { type: 'type', selector: '#amount', text: '0.1' },
        { type: 'type', selector: '#recipient', text: 'RECIPIENT_ADDRESS' },
        { type: 'click', selector: '#send-button' },
        { type: 'wait', selector: '.transaction-signature' }
      ],
      verify: { selector: '.transaction-success', exists: true }
    }
  ]
};

// Run test via OpenClaw
await openclaw.runBrowserTest(testWorkflow);
```

### Scheduled UI Tests

```bash
# Run UI tests every hour
openclaw cron create \
  --name "ui-tests" \
  --schedule "0 * * * *" \
  --command "openclaw browser run dapp-ui-test" \
  --channel "#test-results"
```

### Visual Regression Testing

```typescript
// Compare screenshots
const regression = await openclaw.browser({
  url: 'http://localhost:3000',
  actions: [
    { type: 'screenshot', path: 'current.png' },
    { 
      type: 'compare', 
      baseline: 'baseline.png',
      current: 'current.png',
      threshold: 0.1 
    }
  ]
});

if (regression.diff > 0.1) {
  await openclaw.sendMessage({
    channel: '#alerts',
    message: '⚠️ Visual regression detected!',
    attachments: [regression.diffImage]
  });
}
```

## Multi-Agent Orchestration

### Agent Roles

```json
{
  "agents": {
    "deploy-agent": {
      "model": "claude-3-5-sonnet-20241022",
      "role": "deployment",
      "skills": ["solana-dev"],
      "tools": ["exec"],
      "channels": ["slack:#deployments"]
    },
    "monitor-agent": {
      "model": "gpt-4-turbo",
      "role": "monitoring",
      "skills": ["helius"],
      "tools": ["web", "browser"],
      "channels": ["discord:monitoring"]
    },
    "support-agent": {
      "model": "claude-3-5-sonnet-20241022",
      "role": "support",
      "skills": ["solana-dev", "helius", "integrating-jupiter"],
      "tools": ["exec", "web", "browser"],
      "channels": ["slack:#support", "discord:support"]
    },
    "security-agent": {
      "model": "gpt-4-turbo",
      "role": "security",
      "skills": ["solana-dev"],
      "tools": ["exec", "web"],
      "channels": ["slack:#security"]
    }
  }
}
```

### Agent Communication

```typescript
// Deploy agent → Monitor agent
await openclaw.agentSend({
  from: 'deploy-agent',
  to: 'monitor-agent',
  message: 'Deployment complete. Start monitoring program: GuestBooK...'
});

// Monitor agent → Security agent
await openclaw.agentSend({
  from: 'monitor-agent',
  to: 'security-agent',
  message: 'Suspicious transaction detected: signature 5j7s...'
});
```

### Workflow Orchestration

```typescript
// Complex deployment workflow
const deploymentWorkflow = {
  name: 'mainnet-deployment',
  agents: ['deploy-agent', 'monitor-agent', 'security-agent'],
  steps: [
    {
      agent: 'security-agent',
      task: 'audit-code',
      input: { program: 'guestbook' }
    },
    {
      agent: 'deploy-agent',
      task: 'deploy-devnet',
      dependsOn: ['audit-code'],
      input: { program: 'guestbook' }
    },
    {
      agent: 'monitor-agent',
      task: 'monitor-devnet',
      dependsOn: ['deploy-devnet'],
      duration: 3600 // 1 hour
    },
    {
      agent: 'deploy-agent',
      task: 'deploy-mainnet',
      dependsOn: ['monitor-devnet'],
      requiresApproval: true
    },
    {
      agent: 'monitor-agent',
      task: 'monitor-mainnet',
      dependsOn: ['deploy-mainnet'],
      continuous: true
    }
  ]
};

// Execute workflow
await openclaw.executeWorkflow(deploymentWorkflow);
```

## Custom Tools

### Creating Custom Tools

```typescript
// ~/.openclaw/tools/solana-balance.js
module.exports = {
  name: 'solana_balance',
  description: 'Get SOL balance for an address',
  parameters: {
    type: 'object',
    properties: {
      address: {
        type: 'string',
        description: 'Solana address'
      }
    },
    required: ['address']
  },
  execute: async (params) => {
    const { Connection, PublicKey } = require('@solana/web3.js');
    const connection = new Connection('https://api.mainnet-beta.solana.com');
    
    const balance = await connection.getBalance(
      new PublicKey(params.address)
    );
    
    return {
      address: params.address,
      balance: balance / 1e9,
      lamports: balance
    };
  }
};
```

### Using Custom Tools

```bash
# Register tool
openclaw tools register solana-balance.js

# Use in agent
{
  "agents": {
    "default": {
      "tools": ["exec", "web", "solana_balance"]
    }
  }
}
```

### Tool Composition

```typescript
// Compose multiple tools
const checkProgramHealth = async (programId) => {
  // 1. Check balance
  const balance = await openclaw.tool('solana_balance', {
    address: programId
  });
  
  // 2. Check recent transactions
  const txs = await openclaw.tool('helius_transactions', {
    address: programId,
    limit: 10
  });
  
  // 3. Check for errors
  const logs = await openclaw.tool('exec', {
    command: `solana logs ${programId} --limit 100 | grep ERROR`
  });
  
  // 4. Generate report
  return {
    balance: balance.balance,
    recentTxCount: txs.length,
    errors: logs.split('\n').length,
    status: logs.length === 0 ? 'healthy' : 'unhealthy'
  };
};
```

## Memory Management

### Context Windows

```json
{
  "agents": {
    "default": {
      "memory": {
        "type": "sliding-window",
        "maxMessages": 50,
        "maxTokens": 100000
      }
    }
  }
}
```

### Persistent Memory

```typescript
// Store important information
await openclaw.memory.store({
  key: 'program-id',
  value: 'GuestBooK11111111111111111111111111111111',
  scope: 'global'
});

// Retrieve later
const programId = await openclaw.memory.get('program-id');
```

### Memory Compaction

```typescript
// Automatically compact old messages
{
  "memory": {
    "compaction": {
      "enabled": true,
      "threshold": 100,
      "strategy": "summarize"
    }
  }
}
```

## Context Optimization

### Selective Context Loading

```typescript
// Load only relevant context
const context = await openclaw.context.load({
  skills: ['solana-dev'],
  memory: { last: 10 },
  files: ['program.rs', 'client.ts']
});
```

### Context Caching

```json
{
  "context": {
    "cache": {
      "enabled": true,
      "ttl": 3600,
      "maxSize": 10485760
    }
  }
}
```

## Agent Routing

### Rule-Based Routing

```json
{
  "routing": {
    "rules": [
      {
        "condition": "message.contains('deploy')",
        "agent": "deploy-agent"
      },
      {
        "condition": "message.contains('error') || message.contains('bug')",
        "agent": "support-agent"
      },
      {
        "condition": "message.contains('security') || message.contains('audit')",
        "agent": "security-agent"
      },
      {
        "condition": "channel === 'slack:#monitoring'",
        "agent": "monitor-agent"
      }
    ],
    "default": "default-agent"
  }
}
```

### Intent-Based Routing

```typescript
// Use LLM to determine intent
const router = async (message) => {
  const intent = await openclaw.classifyIntent(message);
  
  const agentMap = {
    'deployment': 'deploy-agent',
    'monitoring': 'monitor-agent',
    'support': 'support-agent',
    'security': 'security-agent'
  };
  
  return agentMap[intent] || 'default-agent';
};
```

## Advanced Webhooks

### Webhook Middleware

```typescript
// ~/.openclaw/webhooks/middleware/auth.js
module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token || token !== process.env.WEBHOOK_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};
```

### Webhook Transformers

```typescript
// Transform Helius webhook to OpenClaw format
module.exports = {
  transform: (helixData) => ({
    type: 'transaction',
    program: helixData.accountData[0].account,
    signature: helixData.signature,
    timestamp: helixData.timestamp,
    fee: helixData.fee,
    status: helixData.err ? 'failed' : 'success'
  })
};
```

## Performance Optimization

### Parallel Execution

```typescript
// Execute multiple tasks in parallel
const results = await Promise.all([
  openclaw.tool('solana_balance', { address: addr1 }),
  openclaw.tool('solana_balance', { address: addr2 }),
  openclaw.tool('helius_transactions', { address: programId })
]);
```

### Caching Strategies

```typescript
// Cache expensive operations
const cache = new Map();

const getCachedBalance = async (address) => {
  if (cache.has(address)) {
    const { value, timestamp } = cache.get(address);
    if (Date.now() - timestamp < 60000) { // 1 minute
      return value;
    }
  }
  
  const balance = await openclaw.tool('solana_balance', { address });
  cache.set(address, { value: balance, timestamp: Date.now() });
  return balance;
};
```

### Rate Limiting

```json
{
  "rateLimit": {
    "enabled": true,
    "maxRequests": 100,
    "window": 60000,
    "strategy": "sliding-window"
  }
}
```

## Next: Production Deployment

See [06-production.md](./06-production.md) for production best practices.
