# OpenClaw Troubleshooting Guide

## Common Issues

### Gateway Issues

#### Gateway Won't Start

**Symptoms:**
```bash
$ openclaw daemon start
Error: Failed to start gateway
```

**Solutions:**

1. Check if port is already in use:
```bash
lsof -i :3000
# Kill existing process
kill -9 <PID>
```

2. Check configuration:
```bash
openclaw config validate
```

3. Check logs:
```bash
openclaw logs --tail 100
```

4. Reset gateway:
```bash
openclaw daemon stop
rm -rf ~/.openclaw/data/gateway.pid
openclaw daemon start
```

#### Gateway Crashes Frequently

**Symptoms:**
- Gateway stops unexpectedly
- "Connection refused" errors
- Webhook timeouts

**Solutions:**

1. Check memory usage:
```bash
ps aux | grep openclaw
# If memory > 2GB, increase limit
```

2. Enable debug logging:
```json
{
  "logging": {
    "level": "debug"
  }
}
```

3. Check for memory leaks:
```bash
# Monitor memory over time
watch -n 5 'ps aux | grep openclaw'
```

4. Restart with clean state:
```bash
openclaw daemon stop
openclaw cache clear
openclaw daemon start
```

### Channel Issues

#### Slack Not Connecting

**Symptoms:**
- Messages not appearing in Slack
- "Channel not found" errors
- Bot not responding

**Solutions:**

1. Verify bot token:
```bash
# Test token
curl -H "Authorization: Bearer xoxb-..." \
  https://slack.com/api/auth.test
```

2. Check bot permissions:
- Go to api.slack.com/apps
- Select your app
- OAuth & Permissions
- Verify scopes: `chat:write`, `channels:read`, `groups:read`

3. Reinstall bot:
```bash
openclaw channels remove slack
openclaw channels add slack
```

4. Check channel membership:
```bash
# Invite bot to channel
/invite @openclaw
```

#### Discord Messages Not Sending

**Symptoms:**
- Bot online but not responding
- "Missing permissions" errors

**Solutions:**

1. Check bot permissions:
- Server Settings → Roles
- Find bot role
- Enable: Send Messages, Read Messages, Embed Links

2. Verify token:
```bash
# Test token
curl -H "Authorization: Bot YOUR_TOKEN" \
  https://discord.com/api/v10/users/@me
```

3. Check channel ID:
```bash
# Enable Developer Mode in Discord
# Right-click channel → Copy ID
```

4. Reconnect:
```bash
openclaw channels remove discord
openclaw channels add discord
```

### Webhook Issues

#### Webhooks Not Triggering

**Symptoms:**
- External service sends webhook
- No message in channel
- No logs

**Solutions:**

1. Test webhook manually:
```bash
curl -X POST http://localhost:3000/webhook/test \
  -H "Content-Type: application/json" \
  -d '{"test": "message"}'
```

2. Check webhook configuration:
```bash
openclaw webhooks list
openclaw webhooks show <webhook-name>
```

3. Check logs:
```bash
openclaw logs --filter webhook
```

4. Verify authentication:
```bash
# If webhook requires auth
curl -X POST http://localhost:3000/webhook/test \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"test": "message"}'
```

#### Webhook Timeouts

**Symptoms:**
- Webhook takes too long
- "Gateway timeout" errors
- External service retries

**Solutions:**

1. Increase timeout:
```json
{
  "webhooks": {
    "timeout": 30000
  }
}
```

2. Make webhook async:
```javascript
module.exports = async (req, res, openclaw) => {
  // Respond immediately
  res.sendStatus(200);
  
  // Process async
  setImmediate(async () => {
    await openclaw.sendMessage({
      channel: 'slack:#deployments',
      message: 'Processing...'
    });
  });
};
```

3. Use queue:
```javascript
const queue = require('bull');
const webhookQueue = new queue('webhooks');

module.exports = async (req, res, openclaw) => {
  await webhookQueue.add(req.body);
  res.sendStatus(200);
};
```

### Skill Issues

#### Skills Not Loading

**Symptoms:**
- Agent doesn't use skills
- "Skill not found" errors

**Solutions:**

1. Check skill location:
```bash
ls -la ~/.openclaw/skills/
```

2. Verify skill format:
```bash
cat ~/.openclaw/skills/solana-dev/SKILL.md
# Should have proper frontmatter
```

3. Reload skills:
```bash
openclaw skills reload
```

4. Check agent configuration:
```json
{
  "agents": {
    "default": {
      "skills": ["solana-dev", "helius"]
    }
  }
}
```

#### Skills Not Activating

**Symptoms:**
- Skill loaded but not used
- Agent doesn't have skill knowledge

**Solutions:**

1. Check skill triggers:
```markdown
---
name: solana-dev
triggers: ["solana", "anchor", "program"]
---
```

2. Explicitly mention trigger words:
```
User: "Help me with Solana program development"
```

3. Force skill activation:
```json
{
  "agents": {
    "default": {
      "skills": ["solana-dev"],
      "alwaysActive": true
    }
  }
}
```

### Performance Issues

#### Slow Response Times

**Symptoms:**
- Agent takes > 10 seconds to respond
- Webhook timeouts
- Channel delays

**Solutions:**

1. Enable caching:
```json
{
  "cache": {
    "enabled": true,
    "ttl": 300
  }
}
```

2. Reduce context size:
```json
{
  "agents": {
    "default": {
      "memory": {
        "maxMessages": 20,
        "maxTokens": 50000
      }
    }
  }
}
```

3. Use faster model:
```json
{
  "agents": {
    "default": {
      "model": "gpt-3.5-turbo"
    }
  }
}
```

4. Optimize skills:
```bash
# Remove unused skills
openclaw skills remove unused-skill
```

#### High Memory Usage

**Symptoms:**
- Gateway using > 2GB RAM
- System slowdown
- OOM errors

**Solutions:**

1. Clear cache:
```bash
openclaw cache clear
```

2. Compact sessions:
```bash
openclaw sessions compact
```

3. Limit memory:
```json
{
  "gateway": {
    "memory": {
      "max": "1GB"
    }
  }
}
```

4. Restart gateway:
```bash
openclaw daemon restart
```

### Authentication Issues

#### Unauthorized Errors

**Symptoms:**
- "401 Unauthorized" errors
- Webhooks rejected
- API calls fail

**Solutions:**

1. Check token:
```bash
echo $OPENCLAW_TOKEN
```

2. Verify token in config:
```json
{
  "gateway": {
    "auth": {
      "enabled": true,
      "token": "your-token-here"
    }
  }
}
```

3. Use correct header:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/webhook/test
```

4. Regenerate token:
```bash
openclaw auth regenerate
```

### Cron Job Issues

#### Cron Jobs Not Running

**Symptoms:**
- Scheduled tasks don't execute
- No logs for cron jobs

**Solutions:**

1. Check cron status:
```bash
openclaw cron list
openclaw cron status <job-name>
```

2. Verify schedule:
```bash
# Test schedule
openclaw cron test <job-name>
```

3. Check logs:
```bash
openclaw logs --filter cron
```

4. Manually trigger:
```bash
openclaw cron run <job-name>
```

#### Cron Jobs Failing

**Symptoms:**
- Cron job runs but fails
- Error in logs

**Solutions:**

1. Check command:
```bash
# Test command manually
bash -c "your-command-here"
```

2. Check permissions:
```bash
# Ensure script is executable
chmod +x script.sh
```

3. Check environment:
```bash
# Cron jobs may not have full environment
# Add to cron command:
export PATH=/usr/local/bin:$PATH
```

4. Add error handling:
```bash
#!/bin/bash
set -e  # Exit on error

your-command || {
  echo "Command failed"
  exit 1
}
```

## Debugging Tips

### Enable Debug Logging

```json
{
  "logging": {
    "level": "debug",
    "outputs": [
      {
        "type": "file",
        "path": "/var/log/openclaw/debug.log"
      }
    ]
  }
}
```

### Monitor Gateway

```bash
# Watch logs in real-time
openclaw logs --follow

# Filter by type
openclaw logs --filter webhook
openclaw logs --filter agent
openclaw logs --filter error
```

### Test Components

```bash
# Test gateway
curl http://localhost:3000/health

# Test channel
openclaw channels test slack

# Test webhook
curl -X POST http://localhost:3000/webhook/test

# Test agent
openclaw message "test message"
```

### Check Resources

```bash
# CPU usage
top -p $(pgrep openclaw)

# Memory usage
ps aux | grep openclaw

# Disk usage
du -sh ~/.openclaw

# Network connections
netstat -an | grep 3000
```

## Getting Help

### Before Asking for Help

1. Check logs:
```bash
openclaw logs --tail 100
```

2. Check configuration:
```bash
openclaw config show
```

3. Check status:
```bash
openclaw status
```

4. Try restarting:
```bash
openclaw daemon restart
```

### Where to Get Help

1. **Documentation**: https://docs.openclaw.ai
2. **GitHub Issues**: https://github.com/openclaw/openclaw/issues
3. **Discord**: https://discord.gg/openclaw
4. **Workshop Discord**: Ask in #openclaw-help

### What to Include

When asking for help, include:

1. OpenClaw version:
```bash
openclaw --version
```

2. Configuration (sanitized):
```bash
openclaw config show --sanitize
```

3. Logs:
```bash
openclaw logs --tail 50
```

4. Steps to reproduce
5. Expected vs actual behavior

## Quick Fixes

### Reset Everything

```bash
# Stop gateway
openclaw daemon stop

# Backup configuration
cp -r ~/.openclaw ~/.openclaw.backup

# Clear data
rm -rf ~/.openclaw/data
rm -rf ~/.openclaw/cache

# Restart
openclaw daemon start
```

### Fresh Install

```bash
# Uninstall
npm uninstall -g openclaw

# Remove data
rm -rf ~/.openclaw

# Reinstall
curl -fsSL https://openclaw.ai/install.sh | bash

# Restore configuration
cp ~/.openclaw.backup/openclaw.json ~/.openclaw/
```

## Prevention

### Regular Maintenance

```bash
# Weekly
openclaw cache clear
openclaw sessions compact

# Monthly
openclaw backup create
openclaw logs rotate

# Quarterly
openclaw update
```

### Monitoring

```bash
# Setup health checks
openclaw heartbeat enable

# Setup alerts
openclaw alerts create \
  --name "gateway-down" \
  --condition "gateway.status != 'running'" \
  --channel "#alerts"
```

### Best Practices

1. Keep OpenClaw updated
2. Monitor resource usage
3. Regular backups
4. Test webhooks before production
5. Use staging environment
6. Document custom configurations
7. Review logs regularly

---

**Still having issues?** Join our Discord or open a GitHub issue with detailed information.
