# How to Activate Skills

## Automatic Activation

Skills activate automatically when you mention keywords in your conversation with Kiro.

### Example 1: Building a dApp
```
You: "I want to build a Solana dApp with wallet connection"

Kiro automatically activates:
- solana-dev skill
- Provides framework-kit guidance
- Shows wallet connection patterns
```

### Example 2: Using Helius
```
You: "How do I setup Helius webhooks for NFT sales?"

Kiro automatically activates:
- helius skill
- Shows webhook configuration
- Provides example code
```

### Example 3: Transaction Building
```
You: "Build a swap transaction with @solana/kit"

Kiro automatically activates:
- solana-kit skill
- Shows pipe pattern
- Demonstrates transaction building
```

### Example 4: AI Agent
```
You: "Create an AI agent that can swap tokens automatically"

Kiro automatically activates:
- solana-agent-kit skill
- Shows agent setup
- Demonstrates Jupiter integration
```

## Manual Activation

You can also manually activate skills:

```
You: "Activate solana-dev skill"
Kiro: [Loads complete Solana development documentation]

You: "Activate helius skill"
Kiro: [Loads Helius infrastructure guide]
```

## Combining Multiple Skills

Multiple skills can be active simultaneously:

```
You: "Build a Next.js dApp using Helius RPC with @solana/kit and optimize performance"

Kiro activates:
- solana-kit (SDK usage)
- helius (RPC infrastructure)
- vercel-react-best-practices (optimization)
- solana-dev (overall architecture)
```

## Skill Keywords Reference

### solana-dev
- "solana"
- "dapp"
- "wallet connection"
- "anchor"
- "program"
- "transaction"

### solana-kit
- "@solana/kit"
- "rpc"
- "transaction building"
- "signer"
- "pipe"

### helius
- "helius"
- "rpc"
- "das api"
- "webhook"
- "priority fee"
- "compression"

### solana-agent-kit
- "ai agent"
- "autonomous"
- "blockchain automation"
- "agent kit"

### vercel-react-best-practices
- "react"
- "nextjs"
- "performance"
- "optimization"

## Best Practices

1. **Be Specific**: Use exact keywords for better activation
   - Good: "Use @solana/kit to build transaction"
   - Less specific: "Build a transaction"

2. **One Focus at a Time**: Start with one skill, then expand
   - First: "Setup Helius RPC"
   - Then: "Build transaction with @solana/kit"

3. **Trust the Skill**: Skills contain battle-tested patterns
   - Don't fight the recommendations
   - Follow the examples provided

4. **Combine with Other Features**: Use skills with specs and hooks
   - Create spec → Skills guide implementation
   - Hooks auto-test → Skills ensure quality

## Troubleshooting

### Skill Not Activating?
- Use more specific keywords
- Try manual activation
- Check if skill is available in `.agents/skills/`

### Wrong Skill Activated?
- Be more specific with keywords
- Manually activate the correct skill
- Provide more context in your request

### Multiple Skills Conflicting?
- Focus on one aspect at a time
- Manually deactivate by starting new conversation
- Be explicit about which approach to use
