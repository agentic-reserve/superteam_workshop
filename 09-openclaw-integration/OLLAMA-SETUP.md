# Using Ollama with OpenClaw

## Overview

Ollama provides an easy way to run local AI models and cloud models with OpenClaw. This guide shows you how to use Ollama for your Solana development workflow.

## Why Ollama + OpenClaw?

- **Local models**: Run AI models on your own hardware (privacy, no API costs)
- **Cloud models**: Access powerful models without GPU requirements
- **Easy setup**: `ollama launch openclaw` handles everything
- **Model flexibility**: Switch between local and cloud models easily
- **Same workflow**: All workshop skills work with Ollama models

## Quick Start (5 minutes)

### 1. Install Ollama

**macOS/Linux:**
```bash
curl -fsSL https://ollama.com/download/install.sh | sh
```

**Windows:**
Download from [ollama.com/download](https://ollama.com/download)

**Verify installation:**
```bash
ollama --version
```

### 2. Launch OpenClaw with Ollama

```bash
# Launch OpenClaw (installs if needed)
ollama launch openclaw
```

This command:
1. Installs OpenClaw if not present
2. Shows security notice about tool access
3. Lets you pick a model (local or cloud)
4. Configures Ollama as the provider
5. Starts the gateway and TUI

### 3. Choose Your Model

**For Solana Development, we recommend:**

**Cloud Models** (no GPU required):
- `gpt-oss:120b-cloud` - Best for complex Solana workflows
- `kimi-k2.5:cloud` - Multimodal reasoning with subagents
- `minimax-m2.5:cloud` - Fast coding and productivity

**Local Models** (requires ~25GB VRAM):
- `glm-4.7-flash` - Reasoning and code generation locally

## Detailed Setup

### Using Cloud Models

Cloud models run on Ollama's servers, no GPU needed.

**1. Sign in to Ollama:**
```bash
ollama signin
```

**2. Pull a cloud model:**
```bash
ollama pull gpt-oss:120b-cloud
```

**3. Configure OpenClaw:**
```bash
ollama launch openclaw --model gpt-oss:120b-cloud
```

**4. Test the model:**
```bash
# In OpenClaw TUI or via API
curl http://localhost:11434/api/chat -d '{
  "model": "gpt-oss:120b-cloud",
  "messages": [
    {
      "role": "user",
      "content": "Help me deploy a Solana program to devnet"
    }
  ]
}'
```

### Using Local Models

Local models run on your hardware, providing privacy and no API costs.

**Requirements:**
- GPU with 25GB+ VRAM (for glm-4.7-flash)
- Or CPU-only (slower but works)

**1. Pull a local model:**
```bash
ollama pull glm-4.7-flash
```

**2. Configure OpenClaw:**
```bash
ollama launch openclaw --model glm-4.7-flash
```

**3. Increase context length (recommended):**

OpenClaw needs a large context window (64k+ tokens).

Create `~/.ollama/config.json`:
```json
{
  "models": {
    "glm-4.7-flash": {
      "num_ctx": 65536
    }
  }
}
```

Or set via environment:
```bash
export OLLAMA_NUM_CTX=65536
ollama serve
```

## Integration with Workshop

### Copy Workshop Skills

```bash
# Copy Solana skills to OpenClaw
cp -r .agents/skills/solana-dev ~/.openclaw/skills/
cp -r .agents/skills/helius ~/.openclaw/skills/
cp -r .agents/skills/integrating-jupiter ~/.openclaw/skills/

# Reload skills
openclaw skills reload
```

### Configure Agent

Create `~/.openclaw/AGENTS.md`:

```markdown
# Solana Development Agent

You are a Solana development assistant powered by Ollama.

## Available Skills

- solana-dev: End-to-end Solana development
- helius: RPC and API infrastructure  
- integrating-jupiter: DeFi operations

## Model

Using: gpt-oss:120b-cloud (or your chosen model)

## Commands

- /deploy-devnet: Deploy program to devnet
- /deploy-mainnet: Deploy program to mainnet
- /check-status: Check program status
- /get-logs: Get recent program logs
```

### Test Integration

**Via OpenClaw TUI:**
```bash
ollama launch openclaw
# Type: "Help me deploy a Solana program"
```

**Via API:**
```bash
curl http://localhost:11434/api/chat -d '{
  "model": "gpt-oss:120b-cloud",
  "messages": [
    {
      "role": "user",
      "content": "Explain how to use Anchor for Solana programs"
    }
  ]
}'
```

## Model Recommendations

### For Solana Development

| Use Case | Recommended Model | Why |
|----------|------------------|-----|
| Complex workflows | `gpt-oss:120b-cloud` | Best reasoning, large context |
| Fast iteration | `minimax-m2.5:cloud` | Quick responses, efficient |
| Local privacy | `glm-4.7-flash` | Runs locally, good performance |
| Multimodal | `kimi-k2.5:cloud` | Handles images, subagents |

### Context Length Requirements

OpenClaw needs large context for:
- Multiple skills loaded
- Long conversation history
- Code analysis
- Documentation reference

**Minimum**: 32k tokens
**Recommended**: 64k tokens
**Optimal**: 128k tokens

## Configuration

### Change Model Without Restarting

```bash
# Configure only (no launch)
ollama launch openclaw --config

# Or specify model directly
ollama launch openclaw --model kimi-k2.5:cloud
```

Gateway restarts automatically with new model.

### Environment Variables

```bash
# Ollama host
export OLLAMA_HOST=http://localhost:11434

# Context length
export OLLAMA_NUM_CTX=65536

# API key (for cloud models)
export OLLAMA_API_KEY=your_key_here

# Keep models in memory
export OLLAMA_KEEP_ALIVE=5m
```

### OpenClaw Configuration

`~/.openclaw/openclaw.json`:

```json
{
  "gateway": {
    "port": 3000,
    "host": "localhost"
  },
  "agents": {
    "solana-dev": {
      "model": "gpt-oss:120b-cloud",
      "provider": "ollama",
      "skills": [
        "solana-dev",
        "helius",
        "integrating-jupiter"
      ],
      "tools": [
        "exec",
        "browser",
        "web"
      ],
      "context": {
        "num_ctx": 65536
      }
    }
  }
}
```

## Deployment Workflow Example

### 1. Setup Webhook

```bash
# Create deployment webhook
openclaw webhooks create \
  --name "deployment" \
  --path "/webhook/deploy" \
  --channel "#deployments"
```

### 2. GitHub Actions Integration

```yaml
# .github/workflows/deploy.yml
- name: Notify OpenClaw
  run: |
    curl -X POST http://localhost:3000/webhook/deploy \
      -d '{
        "program": "guestbook",
        "network": "devnet",
        "status": "deployed"
      }'
```

### 3. OpenClaw Processes with Ollama

```javascript
// ~/.openclaw/webhooks/deployment.js
module.exports = async (req, res, openclaw) => {
  const { program, network, status } = req.body;
  
  // OpenClaw uses Ollama model to generate response
  await openclaw.sendMessage({
    channel: 'slack:#deployments',
    message: `
🚀 Deployment Complete
Program: ${program}
Network: ${network}
Status: ${status}

Model: ${process.env.OLLAMA_MODEL || 'gpt-oss:120b-cloud'}
    `
  });
  
  res.sendStatus(200);
};
```

## Performance Optimization

### Local Models

**1. Use GPU acceleration:**
```bash
# NVIDIA
docker run -d --gpus=all \
  -v ollama:/root/.ollama \
  -p 11434:11434 \
  ollama/ollama

# AMD
docker run -d --device /dev/kfd --device /dev/dri \
  -v ollama:/root/.ollama \
  -p 11434:11434 \
  ollama/ollama:rocm
```

**2. Optimize context length:**
```bash
# Balance between context and speed
export OLLAMA_NUM_CTX=32768  # Faster
export OLLAMA_NUM_CTX=65536  # Balanced
export OLLAMA_NUM_CTX=131072 # Maximum context
```

**3. Keep model in memory:**
```bash
# Keep loaded for 10 minutes
export OLLAMA_KEEP_ALIVE=10m
```

### Cloud Models

**1. Use API key for direct access:**
```bash
export OLLAMA_API_KEY=your_key_here
```

**2. Monitor usage:**
```bash
# Check cloud usage
curl https://ollama.com/api/usage \
  -H "Authorization: Bearer $OLLAMA_API_KEY"
```

## Troubleshooting

### Model Not Loading

```bash
# Check if model is pulled
ollama list

# Pull model if missing
ollama pull gpt-oss:120b-cloud

# Check Ollama is running
ollama serve
```

### Context Length Issues

```bash
# Increase context length
export OLLAMA_NUM_CTX=65536

# Restart Ollama
pkill ollama
ollama serve
```

### OpenClaw Not Connecting

```bash
# Check Ollama is running
curl http://localhost:11434/api/tags

# Check OpenClaw gateway
openclaw status

# Restart gateway
openclaw gateway restart
```

### Performance Issues

```bash
# Check GPU usage
nvidia-smi

# Use smaller model
ollama launch openclaw --model minimax-m2.5:cloud

# Reduce context length
export OLLAMA_NUM_CTX=32768
```

## Cost Comparison

### Cloud Models

| Model | Cost per 1M tokens | Best for |
|-------|-------------------|----------|
| gpt-oss:120b-cloud | ~$2-5 | Complex reasoning |
| minimax-m2.5:cloud | ~$1-3 | Fast iteration |
| kimi-k2.5:cloud | ~$3-6 | Multimodal tasks |

### Local Models

| Model | VRAM Required | Cost |
|-------|--------------|------|
| glm-4.7-flash | ~25GB | $0 (hardware only) |
| qwen3-coder | ~16GB | $0 (hardware only) |

**Recommendation**: Start with cloud models for development, switch to local for production if privacy/cost is a concern.

## Advanced Usage

### Multi-Model Setup

Use different models for different tasks:

```json
{
  "agents": {
    "deploy-agent": {
      "model": "gpt-oss:120b-cloud",
      "skills": ["solana-dev"]
    },
    "monitor-agent": {
      "model": "minimax-m2.5:cloud",
      "skills": ["helius"]
    },
    "support-agent": {
      "model": "glm-4.7-flash",
      "skills": ["solana-dev", "helius"]
    }
  }
}
```

### Custom Model Parameters

```bash
# Create custom model with specific parameters
ollama create solana-dev-model -f Modelfile
```

**Modelfile:**
```dockerfile
FROM gpt-oss:120b-cloud

PARAMETER temperature 0.7
PARAMETER num_ctx 65536
PARAMETER top_p 0.9

SYSTEM """
You are a Solana development expert specializing in:
- Anchor program development
- @solana/kit SDK
- Helius infrastructure
- Jupiter integration
"""
```

### API Integration

**Python:**
```python
from ollama import Client

client = Client(host='http://localhost:11434')

response = client.chat(
    model='gpt-oss:120b-cloud',
    messages=[
        {
            'role': 'user',
            'content': 'Help me deploy a Solana program'
        }
    ]
)

print(response['message']['content'])
```

**JavaScript:**
```javascript
import { Ollama } from 'ollama';

const ollama = new Ollama();

const response = await ollama.chat({
  model: 'gpt-oss:120b-cloud',
  messages: [
    {
      role: 'user',
      content: 'Help me deploy a Solana program'
    }
  ]
});

console.log(response.message.content);
```

## Resources

- [Ollama Documentation](https://docs.ollama.com)
- [Ollama Models](https://ollama.com/library)
- [OpenClaw Integration](https://docs.ollama.com/integrations/openclaw)
- [Cloud Models](https://ollama.com/search?c=cloud)
- [Context Length Guide](https://docs.ollama.com/context-length)

## Next Steps

1. **Install Ollama**: Follow quick start above
2. **Choose Model**: Cloud for ease, local for privacy
3. **Copy Skills**: Integrate workshop skills
4. **Test Workflow**: Deploy a program with automation
5. **Optimize**: Adjust context length and model based on needs

---

**Ready to start?** Run `ollama launch openclaw` and choose your model!

**Need help?** Check [troubleshooting.md](./troubleshooting.md) or [INDEX.md](./INDEX.md)
