# Module 12: Build Modular AI Agents with OpenRouter

## Overview

Learn to build production-ready AI agents using OpenRouter SDK dengan akses ke 300+ language models. Module ini mengajarkan cara membuat modular agent architecture yang bisa digunakan di berbagai platform (CLI, HTTP API, Discord, Telegram).

## Kenapa OpenRouter?

- **300+ Models**: Akses unified ke semua major LLMs (GPT-4, Claude, Gemini, Llama, dll)
- **Auto Model Selection**: `openrouter/auto` memilih model terbaik untuk request kamu
- **Cost Optimization**: Compare pricing dan pilih model paling cost-effective
- **No Vendor Lock-in**: Switch models tanpa ubah code
- **Embeddings Support**: Multi-modal embeddings (text + image)

## Architecture

```
┌─────────────────────────────────────────────────────┐
│ Your Application                                    │
├─────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│ │ Ink TUI     │ │ HTTP API    │ │ Discord     │   │
│ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘   │
│        │               │               │           │
│        └───────────────┼───────────────┘           │
│                        ▼                            │
│            ┌───────────────────────┐                │
│            │ Agent Core            │                │
│            │ (hooks & lifecycle)   │                │
│            └───────────┬───────────┘                │
│                        ▼                            │
│            ┌───────────────────────┐                │
│            │ OpenRouter SDK        │                │
│            └───────────────────────┘                │
└─────────────────────────────────────────────────────┘
```

## Prerequisites

1. Get OpenRouter API key: https://openrouter.ai/settings/keys
2. Node.js 18+ installed
3. Basic TypeScript knowledge

⚠️ **Security**: Never commit API keys. Use environment variables.

## Quick Start

### Step 1: Project Setup

```bash
mkdir my-agent && cd my-agent
npm init -y
npm pkg set type="module"
```

### Step 2: Install Dependencies

```bash
# Core dependencies
npm install @openrouter/sdk zod eventemitter3

# Optional: for TUI
npm install ink react

# Dev dependencies
npm install -D typescript @types/react tsx
```

### Step 3: Create tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
```

### Step 4: Add Scripts

```json
{
  "scripts": {
    "start": "tsx src/cli.tsx",
    "start:headless": "tsx src/headless.ts",
    "dev": "tsx watch src/cli.tsx"
  }
}
```

## File Structure

```
src/
├── agent.ts       # Standalone agent core with hooks
├── tools.ts       # Tool definitions
├── embeddings.ts  # Embeddings utilities
├── cli.tsx        # Ink TUI (optional interface)
└── headless.ts    # Headless usage example
```

## Core Concepts

### 1. Items-Based Streaming

OpenRouter uses **items-based streaming** - items are emitted multiple times with the same ID but progressively updated content. Replace items by their ID, don't accumulate chunks.

**Traditional (accumulation required):**
```typescript
let text = '';
for await (const chunk of result.getTextStream()) {
  text += chunk; // Manual accumulation
  updateUI(text);
}
```

**Items (complete replacement):**
```typescript
const items = new Map<string, StreamableOutputItem>();
for await (const item of result.getItemsStream()) {
  items.set(item.id, item); // Replace by ID
  updateUI(items);
}
```

Benefits:
- No manual chunk management - each item is complete
- Handles concurrent outputs - function calls and messages can stream in parallel
- Full TypeScript inference for all item types
- Natural Map-based state works perfectly with React/UI frameworks

### 2. Agent Events (Hooks)

The agent emits events for extensibility:

| Event | Payload | Description |
|-------|---------|-------------|
| `message:user` | Message | User message added |
| `message:assistant` | Message | Assistant response complete |
| `item:update` | StreamableOutputItem | Item emitted (replace by ID) |
| `stream:start` | - | Streaming started |
| `stream:delta` | (delta, accumulated) | New text chunk |
| `stream:end` | fullText | Streaming complete |
| `tool:call` | (name, args) | Tool being called |
| `tool:result` | (name, result) | Tool returned result |
| `reasoning:update` | text | Extended thinking content |
| `thinking:start` | - | Agent processing |
| `thinking:end` | - | Agent done processing |
| `error` | Error | Error occurred |

### 3. Item Types

| Type | Purpose |
|------|---------|
| `message` | Assistant text responses |
| `function_call` | Tool invocations with streaming arguments |
| `function_call_output` | Results from executed tools |
| `reasoning` | Extended thinking content |
| `web_search_call` | Web search operations |
| `file_search_call` | File search operations |
| `image_generation_call` | Image generation operations |

## Building the Agent

See the examples folder for complete implementations:
- `agent.ts` - Core agent with hooks
- `tools.ts` - Tool definitions
- `embeddings.ts` - Multi-modal embeddings
- `cli.tsx` - Terminal UI
- `headless.ts` - Programmatic usage

## Discovering Models

**Don't hardcode model IDs** - they change frequently. Use the models API:

```typescript
interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  context_length: number;
  pricing: {
    prompt: string;
    completion: string;
  };
  top_provider?: {
    is_moderated: boolean;
  };
}

async function fetchModels(): Promise<OpenRouterModel[]> {
  const res = await fetch('https://openrouter.ai/api/v1/models');
  const data = await res.json();
  return data.data;
}

// Find models by criteria
async function findModels(filter: {
  author?: string;        // e.g., 'anthropic', 'openai', 'google'
  minContext?: number;    // e.g., 100000 for 100k context
  maxPromptPrice?: number; // e.g., 0.001 for cheap models
}): Promise<OpenRouterModel[]> {
  const models = await fetchModels();
  return models.filter((m) => {
    if (filter.author && !m.id.startsWith(filter.author + '/')) return false;
    if (filter.minContext && m.context_length < filter.minContext) return false;
    if (filter.maxPromptPrice) {
      const price = parseFloat(m.pricing.prompt);
      if (price > filter.maxPromptPrice) return false;
    }
    return true;
  });
}

// Example: Get latest Claude models
const claudeModels = await findModels({ author: 'anthropic' });

// Example: Get models with 100k+ context
const longContextModels = await findModels({ minContext: 100000 });

// Example: Get cheap models
const cheapModels = await findModels({ maxPromptPrice: 0.0005 });
```

### Using openrouter/auto

For simplicity, use `openrouter/auto` which automatically selects the best available model:

```typescript
const agent = createAgent({
  apiKey: process.env.OPENROUTER_API_KEY!,
  model: 'openrouter/auto', // Auto-selects best model
});
```

## Multi-Modal Embeddings

OpenRouter supports multi-modal embeddings (text + image):

```typescript
async function getMultiModalEmbedding(
  text: string,
  imageUrl: string
): Promise<number[]> {
  const response = await fetch('https://openrouter.ai/api/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://your-site.com',
      'X-OpenRouter-Title': 'Your App Name',
    },
    body: JSON.stringify({
      model: 'nvidia/llama-nemotron-embed-vl-1b-v2:free',
      input: [{
        content: [
          { type: 'text', text },
          { type: 'image_url', image_url: { url: imageUrl } }
        ]
      }],
      encoding_format: 'float'
    })
  });

  const data = await response.json();
  return data.data[0].embedding;
}

// Example usage
const embedding = await getMultiModalEmbedding(
  'What is in this image?',
  'https://example.com/image.jpg'
);

console.log('Embedding dimensions:', embedding.length);
console.log('First 5 values:', embedding.slice(0, 5));
```

## Use Cases

### 1. HTTP API Server

```typescript
import express from 'express';
import { createAgent } from './agent.js';

const app = express();
app.use(express.json());

const sessions = new Map<string, Agent>();

app.post('/chat', async (req, res) => {
  const { sessionId, message } = req.body;
  
  let agent = sessions.get(sessionId);
  if (!agent) {
    agent = createAgent({
      apiKey: process.env.OPENROUTER_API_KEY!
    });
    sessions.set(sessionId, agent);
  }

  const response = await agent.sendSync(message);
  res.json({ response, history: agent.getMessages() });
});

app.listen(3000);
```

### 2. Discord Bot

```typescript
import { Client, GatewayIntentBits } from 'discord.js';
import { createAgent } from './agent.js';

const discord = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const agents = new Map<string, Agent>();

discord.on('messageCreate', async (msg) => {
  if (msg.author.bot) return;

  let agent = agents.get(msg.channelId);
  if (!agent) {
    agent = createAgent({
      apiKey: process.env.OPENROUTER_API_KEY!
    });
    agents.set(msg.channelId, agent);
  }

  const response = await agent.sendSync(msg.content);
  await msg.reply(response);
});

discord.login(process.env.DISCORD_TOKEN);
```

### 3. Telegram Bot

```typescript
import TelegramBot from 'node-telegram-bot-api';
import { createAgent } from './agent.js';

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN!, { polling: true });
const agents = new Map<number, Agent>();

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  
  let agent = agents.get(chatId);
  if (!agent) {
    agent = createAgent({
      apiKey: process.env.OPENROUTER_API_KEY!
    });
    agents.set(chatId, agent);
  }

  const response = await agent.sendSync(msg.text!);
  bot.sendMessage(chatId, response);
});
```

### 4. Custom Hooks for Analytics

```typescript
const agent = createAgent({
  apiKey: process.env.OPENROUTER_API_KEY!
});

// Log all events
agent.on('message:user', (msg) => {
  saveToDatabase('user', msg.content);
});

agent.on('message:assistant', (msg) => {
  saveToDatabase('assistant', msg.content);
  sendWebhook('new_message', msg);
});

agent.on('tool:call', (name, args) => {
  analytics.track('tool_used', { name, args });
});

agent.on('error', (err) => {
  errorReporting.capture(err);
});
```

## Agent API Reference

### Constructor Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| apiKey | string | required | OpenRouter API key |
| model | string | 'openrouter/auto' | Model to use |
| instructions | string | 'You are a helpful assistant.' | System prompt |
| tools | Tool[] | [] | Available tools |
| maxSteps | number | 5 | Max agentic loop iterations |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `send(content)` | Promise<string> | Send message with streaming |
| `sendSync(content)` | Promise<string> | Send message without streaming |
| `getMessages()` | Message[] | Get conversation history |
| `clearHistory()` | void | Clear conversation |
| `setInstructions(text)` | void | Update system prompt |
| `addTool(tool)` | void | Add tool at runtime |

## Best Practices

1. **Use openrouter/auto** for automatic model selection
2. **Fetch models dynamically** - don't hardcode model IDs
3. **Implement proper error handling** - network issues, rate limits
4. **Use items-based streaming** - replace by ID, don't accumulate
5. **Store API keys securely** - use environment variables
6. **Implement session management** - one agent per user/channel
7. **Add custom hooks** - for logging, analytics, webhooks
8. **Test with different models** - compare quality and cost
9. **Monitor usage** - track costs and performance
10. **Implement rate limiting** - protect your API key

## Cost Optimization

```typescript
// Get cheapest models
const cheapModels = await findModels({
  maxPromptPrice: 0.0001 // $0.0001 per token
});

// Use for simple tasks
const simpleAgent = createAgent({
  apiKey: process.env.OPENROUTER_API_KEY!,
  model: cheapModels[0].id
});

// Use expensive models only when needed
const complexAgent = createAgent({
  apiKey: process.env.OPENROUTER_API_KEY!,
  model: 'anthropic/claude-3.5-sonnet'
});
```

## Troubleshooting

### Common Issues

**API Key Invalid:**
```
Error: Unauthorized
```
Solution: Check API key at https://openrouter.ai/settings/keys

**Rate Limit Exceeded:**
```
Error: 429 Too Many Requests
```
Solution: Implement exponential backoff or upgrade plan

**Model Not Found:**
```
Error: Model not found
```
Solution: Use models API to get current model IDs

**Streaming Timeout:**
```
Error: Request timeout
```
Solution: Increase timeout or use smaller models

## Resources

- **OpenRouter Docs**: https://openrouter.ai/docs
- **Models API**: https://openrouter.ai/api/v1/models
- **Browse Models**: https://openrouter.ai/models
- **Get API Key**: https://openrouter.ai/settings/keys
- **Ink Docs**: https://github.com/vadimdemedes/ink
- **SDK GitHub**: https://github.com/openrouter/openrouter-sdk

## Hands-On Exercises

### Exercise 1: Basic Agent

1. Create agent dengan openrouter/auto
2. Add custom tools (calculator, time)
3. Test dengan berbagai queries
4. Monitor tool usage dengan hooks

### Exercise 2: Multi-Platform Agent

1. Build HTTP API server
2. Add Discord bot integration
3. Implement session management
4. Add analytics tracking

### Exercise 3: Cost Optimization

1. Fetch available models
2. Compare pricing
3. Implement model selection logic
4. Test quality vs cost tradeoffs

### Exercise 4: Multi-Modal Embeddings

1. Setup embeddings endpoint
2. Process text + image inputs
3. Store embeddings in vector DB
4. Implement semantic search

## Summary

OpenRouter SDK provides:
- ✅ Unified access to 300+ models
- ✅ Items-based streaming for better UX
- ✅ Extensible hooks for custom logic
- ✅ Multi-modal embeddings support
- ✅ Cost optimization tools
- ✅ Platform-agnostic architecture

Build once, deploy anywhere - CLI, HTTP, Discord, Telegram, atau platform lainnya.
