# Ollama Setup for AI Assistant

The AI Assistant feature requires Ollama to be running locally or configured for cloud access.

## Option 1: Local Setup (Recommended for Development)

### 1. Install Ollama

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Windows:**
Download from [ollama.com/download](https://ollama.com/download)

### 2. Start Ollama Service

```bash
ollama serve
```

### 3. Pull the Model

```bash
ollama pull gpt-oss:120b-cloud
```

### 4. Test the Model

```bash
ollama run gpt-oss:120b-cloud
```

## Option 2: Cloud Setup (No GPU Required)

### 1. Sign in to Ollama

```bash
ollama signin
```

This will open a browser to create/login to your Ollama account.

### 2. Pull Cloud Model

```bash
ollama pull gpt-oss:120b-cloud
```

### 3. Run the Model

```bash
ollama run gpt-oss:120b-cloud
```

Cloud models automatically offload to Ollama's cloud service, so no powerful GPU is needed!

## Option 3: Direct Cloud API Access

For production deployments, you can use Ollama's cloud API directly.

### 1. Create API Key

Visit [ollama.com/settings/keys](https://ollama.com/settings/keys) and create an API key.

### 2. Set Environment Variable

```bash
export OLLAMA_API_KEY=your_api_key
```

### 3. Update API Route

Modify `src/app/api/chat/route.ts` to use cloud API:

```typescript
import { Ollama } from 'ollama';

const client = new Ollama({
  host: 'https://ollama.com',
  headers: {
    'Authorization': `Bearer ${process.env.OLLAMA_API_KEY}`
  }
});

const response = await client.chat({
  model: 'gpt-oss:120b',
  messages: messages,
});
```

## Troubleshooting

### "Connection refused" Error

Make sure Ollama service is running:
```bash
ollama serve
```

### "Model not found" Error

Pull the model first:
```bash
ollama pull gpt-oss:120b-cloud
```

### Slow Response Times

- For local: Ensure you have sufficient RAM (16GB+ recommended)
- For cloud: Check your internet connection
- Consider using a smaller model for faster responses:
  ```bash
  ollama pull glm-4.7-flash
  ```

## Alternative Models

You can use different models by updating the API route:

**Fast & Lightweight (Local):**
```bash
ollama pull glm-4.7-flash
```

**Balanced (Cloud):**
```bash
ollama pull gpt-oss:120b-cloud
```

**Multimodal (Cloud):**
```bash
ollama pull kimi-k2.5:cloud
```

## Development vs Production

**Development:**
- Use local Ollama with `gpt-oss:120b-cloud`
- Fast iteration, no API costs
- Requires Ollama service running

**Production:**
- Use Ollama Cloud API with API key
- No local setup required
- Pay-per-use pricing
- Better scalability

## Resources

- [Ollama Documentation](https://docs.ollama.com)
- [Ollama Cloud Models](https://ollama.com/search?c=cloud)
- [Ollama API Reference](https://docs.ollama.com/api)
- [Ollama GitHub](https://github.com/ollama/ollama)
