# OpenRouter Agent Quick Start

## 5-Minute Setup

### 1. Get API Key

Visit https://openrouter.ai/settings/keys and create an API key.

### 2. Create Project

```bash
mkdir my-agent && cd my-agent
npm init -y
npm pkg set type="module"
npm install @openrouter/sdk zod eventemitter3
npm install -D typescript tsx
```

### 3. Create agent.ts

```typescript
import { OpenRouter } from '@openrouter/sdk';

const client = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!
});

async function chat(message: string) {
  const result = client.callModel({
    model: 'openrouter/auto',
    input: [{ role: 'user', content: message }]
  });

  for await (const item of result.getItemsStream()) {
    if (item.type === 'message') {
      const text = item.content?.find(c => c.type === 'output_text');
      if (text && 'text' in text) {
        process.stdout.write(text.text);
      }
    }
  }
  console.log('\n');
}

// Test it
chat('Hello! What can you help me with?');
```

### 4. Run

```bash
OPENROUTER_API_KEY=sk-or-... tsx agent.ts
```

## Next Steps

1. Add tools (calculator, weather, etc)
2. Implement conversation history
3. Add event hooks for logging
4. Build HTTP API or Discord bot
5. Explore multi-modal embeddings

See the full examples in the `examples/` folder!
