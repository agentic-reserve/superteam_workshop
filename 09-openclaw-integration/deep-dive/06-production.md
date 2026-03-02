# Production Deployment Deep Dive

## Overview

This guide covers everything you need to deploy and scale OpenClaw in production environments.

## Security Best Practices

### 1. Authentication & Authorization

```json
{
  "gateway": {
    "auth": {
      "enabled": true,
      "type": "bearer",
      "tokens": {
        "admin": "secure-admin-token",
        "deploy": "secure-deploy-token",
        "monitor": "secure-monitor-token"
      }
    }
  }
}
```

**Token Management:**

```bash
# Generate secure tokens
openssl rand -hex 32

# Store in environment
export OPENCLAW_ADMIN_TOKEN="..."
export OPENCLAW_DEPLOY_TOKEN="..."

# Use in requests
curl -H "Authorization: Bearer $OPENCLAW_DEPLOY_TOKEN" \
  http://gateway/webhook/deploy
```

### 2. Network Security

```json
{
  "gateway": {
    "network": {
      "allowedIPs": [
        "10.0.0.0/8",
        "192.168.1.0/24"
      ],
      "cors": {
        "enabled": true,
        "origins": ["https://your-domain.com"]
      },
      "rateLimit": {
        "enabled": true,
        "maxRequests": 100,
        "window": 60000
      }
    }
  }
}
```

### 3. Secrets Management

```bash
# Use environment variables
export SLACK_TOKEN="xoxb-..."
export DISCORD_TOKEN="..."
export HELIUS_API_KEY="..."
export SOLANA_PRIVATE_KEY="..."

# Or use secrets manager
openclaw secrets set SLACK_TOKEN --from-env
openclaw secrets set DISCORD_TOKEN --from-file token.txt
```

### 4. Webhook Security

```typescript
// Verify webhook signatures
const crypto = require('crypto');

const verifyWebhook = (req, secret) => {
  const signature = req.headers['x-signature'];
  const timestamp = req.headers['x-timestamp'];
  const body = JSON.stringify(req.body);
  
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${body}`)
    .digest('hex');
  
  return signature === expected;
};

// Use in webhook handler
module.exports = async (req, res, openclaw) => {
  if (!verifyWebhook(req, process.env.WEBHOOK_SECRET)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Process webhook
};
```

## Scaling Strategies

### 1. Horizontal Scaling

```yaml
# docker-compose.yml
version: '3.8'

services:
  gateway-1:
    image: openclaw/gateway
    environment:
      - NODE_ID=gateway-1
      - REDIS_URL=redis://redis:6379
    ports:
      - "3001:3000"
  
  gateway-2:
    image: openclaw/gateway
    environment:
      - NODE_ID=gateway-2
      - REDIS_URL=redis://redis:6379
    ports:
      - "3002:3000"
  
  gateway-3:
    image: openclaw/gateway
    environment:
      - NODE_ID=gateway-3
      - REDIS_URL=redis://redis:6379
    ports:
      - "3003:3000"
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

**Load Balancer Config:**

```nginx
# nginx.conf
upstream openclaw {
  least_conn;
  server gateway-1:3000;
  server gateway-2:3000;
  server gateway-3:3000;
}

server {
  listen 80;
  
  location / {
    proxy_pass http://openclaw;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

### 2. Vertical Scaling

```json
{
  "gateway": {
    "workers": 4,
    "memory": {
      "max": "4GB",
      "cache": "1GB"
    },
    "concurrency": {
      "maxAgents": 10,
      "maxTools": 20
    }
  }
}
```

### 3. Database Scaling

```json
{
  "database": {
    "type": "postgresql",
    "connection": {
      "host": "db.example.com",
      "port": 5432,
      "database": "openclaw",
      "pool": {
        "min": 2,
        "max": 10
      }
    }
  }
}
```

## Monitoring & Observability

### 1. Metrics

```typescript
// Prometheus metrics
const prometheus = require('prom-client');

const metrics = {
  requests: new prometheus.Counter({
    name: 'openclaw_requests_total',
    help: 'Total requests',
    labelNames: ['agent', 'channel', 'status']
  }),
  
  latency: new prometheus.Histogram({
    name: 'openclaw_request_duration_seconds',
    help: 'Request duration',
    labelNames: ['agent', 'tool']
  }),
  
  activeAgents: new prometheus.Gauge({
    name: 'openclaw_active_agents',
    help: 'Number of active agents'
  })
};

// Expose metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(await prometheus.register.metrics());
});
```

### 2. Logging

```json
{
  "logging": {
    "level": "info",
    "format": "json",
    "outputs": [
      {
        "type": "file",
        "path": "/var/log/openclaw/gateway.log",
        "rotation": {
          "maxSize": "100MB",
          "maxFiles": 10
        }
      },
      {
        "type": "elasticsearch",
        "url": "http://elasticsearch:9200",
        "index": "openclaw-logs"
      }
    ]
  }
}
```

### 3. Tracing

```typescript
// OpenTelemetry tracing
const { trace } = require('@opentelemetry/api');

const tracer = trace.getTracer('openclaw');

const executeAgent = async (message) => {
  const span = tracer.startSpan('agent.execute');
  
  try {
    span.setAttribute('agent.id', agentId);
    span.setAttribute('message.length', message.length);
    
    const result = await agent.execute(message);
    
    span.setStatus({ code: SpanStatusCode.OK });
    return result;
  } catch (error) {
    span.setStatus({ 
      code: SpanStatusCode.ERROR,
      message: error.message 
    });
    throw error;
  } finally {
    span.end();
  }
};
```

### 4. Health Checks

```typescript
// Health check endpoint
app.get('/health', async (req, res) => {
  const checks = {
    gateway: await checkGateway(),
    database: await checkDatabase(),
    redis: await checkRedis(),
    channels: await checkChannels(),
    agents: await checkAgents()
  };
  
  const healthy = Object.values(checks).every(c => c.status === 'ok');
  
  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'healthy' : 'unhealthy',
    checks,
    timestamp: new Date().toISOString()
  });
});
```

## Cost Optimization

### 1. Model Selection

```json
{
  "agents": {
    "deploy-agent": {
      "model": "claude-3-5-sonnet-20241022",
      "fallback": "gpt-4-turbo"
    },
    "monitor-agent": {
      "model": "gpt-3.5-turbo",
      "costLimit": {
        "daily": 10.00,
        "monthly": 300.00
      }
    }
  }
}
```

### 2. Caching

```json
{
  "cache": {
    "enabled": true,
    "ttl": {
      "skills": 3600,
      "context": 300,
      "tools": 60
    },
    "storage": "redis"
  }
}
```

### 3. Request Batching

```typescript
// Batch similar requests
const batcher = new RequestBatcher({
  maxBatchSize: 10,
  maxWaitTime: 1000
});

const getBalances = async (addresses) => {
  return batcher.batch(addresses, async (batch) => {
    // Single RPC call for multiple addresses
    return connection.getMultipleAccountsInfo(batch);
  });
};
```

### 4. Resource Limits

```json
{
  "limits": {
    "maxTokensPerRequest": 4000,
    "maxRequestsPerMinute": 60,
    "maxConcurrentAgents": 5,
    "maxMemoryPerAgent": "512MB"
  }
}
```

## Disaster Recovery

### 1. Backup Strategy

```bash
# Backup configuration
openclaw backup create --output backup-$(date +%Y%m%d).tar.gz

# Backup includes:
# - openclaw.json
# - AGENTS.md
# - Skills
# - Webhooks
# - Cron jobs
# - Sessions (optional)

# Automated backups
openclaw cron create \
  --name "daily-backup" \
  --schedule "0 2 * * *" \
  --command "openclaw backup create --output /backups/backup-$(date +%Y%m%d).tar.gz"
```

### 2. Restore Procedure

```bash
# Restore from backup
openclaw backup restore --input backup-20260302.tar.gz

# Verify restoration
openclaw status
openclaw channels list
openclaw webhooks list
```

### 3. High Availability

```yaml
# Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: openclaw-gateway
spec:
  replicas: 3
  selector:
    matchLabels:
      app: openclaw-gateway
  template:
    metadata:
      labels:
        app: openclaw-gateway
    spec:
      containers:
      - name: gateway
        image: openclaw/gateway:latest
        env:
        - name: REDIS_URL
          value: redis://redis:6379
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### 4. Failover

```json
{
  "failover": {
    "enabled": true,
    "strategy": "active-passive",
    "healthCheck": {
      "interval": 10000,
      "timeout": 5000,
      "retries": 3
    },
    "backup": {
      "url": "https://backup-gateway.example.com",
      "syncInterval": 60000
    }
  }
}
```

## Team Onboarding

### 1. Documentation

```markdown
# Team OpenClaw Guide

## Quick Start

1. Join Slack workspace
2. Add OpenClaw bot to channels
3. Test with: @openclaw help
4. Read slash commands: /help

## Common Commands

- `/deploy-devnet` - Deploy to devnet
- `/check-status` - Check program status
- `/get-logs` - Get recent logs
- `/run-tests` - Run test suite

## Workflows

### Deployment
1. Create PR
2. Tests run automatically
3. Merge to main
4. OpenClaw deploys to devnet
5. React with ✅ to deploy to mainnet

### Monitoring
- Errors posted to #alerts
- Transactions in #transactions
- Daily reports in #reports

## Support

- Ask in #openclaw-help
- Tag @devops for urgent issues
```

### 2. Training

```bash
# Create training environment
openclaw env create training \
  --channels "slack:#training" \
  --agents "training-agent" \
  --sandbox true

# Training exercises
1. Send message to agent
2. Create slash command
3. Setup webhook
4. Create cron job
5. Test deployment workflow
```

### 3. Access Control

```json
{
  "access": {
    "roles": {
      "admin": {
        "permissions": ["*"]
      },
      "developer": {
        "permissions": [
          "deploy:devnet",
          "logs:read",
          "status:read"
        ]
      },
      "viewer": {
        "permissions": [
          "status:read",
          "logs:read"
        ]
      }
    },
    "users": {
      "alice@example.com": "admin",
      "bob@example.com": "developer",
      "charlie@example.com": "viewer"
    }
  }
}
```

## Deployment Checklist

### Pre-Production

- [ ] Security audit completed
- [ ] Load testing passed
- [ ] Backup strategy implemented
- [ ] Monitoring configured
- [ ] Documentation written
- [ ] Team trained

### Production

- [ ] Gateway deployed
- [ ] Channels connected
- [ ] Webhooks configured
- [ ] Cron jobs setup
- [ ] Health checks passing
- [ ] Metrics collecting
- [ ] Logs aggregating
- [ ] Alerts configured

### Post-Production

- [ ] Monitor for 24 hours
- [ ] Review metrics
- [ ] Optimize performance
- [ ] Update documentation
- [ ] Gather team feedback
- [ ] Plan improvements

## Troubleshooting

### Gateway Not Responding

```bash
# Check status
openclaw status

# Check logs
openclaw logs --tail 100

# Restart gateway
openclaw daemon restart

# Check resources
top -p $(pgrep openclaw)
```

### High Latency

```bash
# Check metrics
curl http://localhost:3000/metrics | grep latency

# Check database
psql -c "SELECT * FROM pg_stat_activity;"

# Check Redis
redis-cli INFO stats

# Optimize
- Enable caching
- Reduce context size
- Use faster model
- Scale horizontally
```

### Memory Leaks

```bash
# Monitor memory
watch -n 1 'ps aux | grep openclaw'

# Heap dump
node --inspect openclaw
# Chrome DevTools → Memory → Take heap snapshot

# Fix
- Clear old sessions
- Compact memory
- Restart gateway
```

## Resources

- [OpenClaw Docs](https://docs.openclaw.ai)
- [Production Guide](https://docs.openclaw.ai/production)
- [Security Best Practices](https://docs.openclaw.ai/security)
- [Scaling Guide](https://docs.openclaw.ai/scaling)

---

**Congratulations!** You've completed the OpenClaw deep dive. You're now ready to deploy production-grade AI agents for your Solana development workflow.
