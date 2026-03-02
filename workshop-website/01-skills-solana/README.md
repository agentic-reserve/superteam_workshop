# Skills - Solana Development Expertise

## Apa itu Skills?

Skills memberikan Kiro specialized knowledge untuk Solana development. Saat Anda mention keywords tertentu, Kiro akan automatically activate relevant skill dan load full instructions.

## Available Solana Skills

### 1. solana-dev
**Keywords**: solana, dapp, wallet, transaction, anchor, program

End-to-end Solana development playbook. Covers:
- UI dengan framework-kit (@solana/client + @solana/react-hooks)
- SDK dengan @solana/kit
- Wallet connection (Wallet Standard)
- Anchor/Pinocchio programs
- Testing (LiteSVM, Mollusk, Surfpool)
- Security checklist

**Activate**: Mention "solana development" atau "build dapp"

### 2. solana-kit
**Keywords**: @solana/kit, rpc, transaction, signer, kit

Modern JavaScript SDK untuk Solana. Covers:
- RPC connections
- Transaction building dengan pipe
- Signers dan signing
- Account fetching
- Tree-shakeable, zero dependencies
- 10x faster crypto

**Activate**: Mention "@solana/kit" atau "transaction building"

### 3. helius
**Keywords**: helius, rpc, das, webhook, priority fee, compression

Helius infrastructure dan APIs. Covers:
- RPC nodes (99.99% uptime)
- DAS API (NFT/token data)
- Enhanced Transactions
- Priority Fee API
- Webhooks
- ZK Compression
- LaserStream (gRPC)

**Activate**: Mention "helius" atau "rpc infrastructure"

### 4. solana-agent-kit
**Keywords**: ai agent, autonomous, blockchain automation, agent kit

AI agents untuk Solana blockchain. Covers:
- 60+ blockchain actions
- Token deployment, NFT minting
- DeFi operations (Jupiter, Raydium)
- LangChain/Vercel AI integration
- MCP server untuk Claude
- Autonomous mode

**Activate**: Mention "ai agent" atau "autonomous blockchain"

### 5. pinocchio-development
**Keywords**: pinocchio, high performance, compute units, zero copy, optimization

High-performance Solana programs. Covers:
- 88-95% CU reduction
- Zero-copy data access
- Zero dependencies
- CPI helpers
- Optimization techniques

**Activate**: Mention "pinocchio" atau "optimize compute units"

### 6. use-railway
**Keywords**: railway, deploy, deployment, infrastructure, hosting

Deploy and manage infrastructure on Railway. Covers:
- Create projects and services
- Deploy code (frontend + backend)
- Provision databases (Postgres, Redis, MongoDB)
- Configure environments and variables
- Manage domains
- Troubleshoot build failures
- Monitor status and metrics

**Activate**: Mention "railway" atau "deploy" atau "hosting"

### 7. integrating-jupiter
**Keywords**: jupiter, swap, jup-ag, ultra swap, limit order, dca, recurring

Integrate Jupiter APIs for DeFi operations. Covers:
- Ultra Swap (best routes, gasless swaps)
- Lend (earn, borrow, liquidation)
- Trigger (limit orders, price conditions)
- Recurring (DCA, scheduled swaps)
- Tokens API (metadata, verification)
- Price API (real-time pricing)
- Portfolio API (positions, holdings)
- Prediction Markets (beta)

**Activate**: Mention "jupiter" atau "swap" atau "jup-ag"

### 8. install-wallet-ui-react-native
**Keywords**: wallet ui, react native, mobile wallet, expo

Setup Wallet UI di React Native/Expo. Covers:
- @solana/kit vs legacy web3.js
- Wallet adapter setup
- Mobile wallet integration

**Activate**: Mention "mobile wallet" atau "react native"

### 6. vercel-react-best-practices
**Keywords**: react, nextjs, performance, optimization, vercel

React/Next.js performance optimization. Covers:
- Component patterns
- Data fetching
- Bundle optimization
- Performance best practices

**Activate**: Mention "react performance" atau "nextjs optimization"

## Cara Menggunakan Skills

### Automatic Activation
Skills akan automatically activate saat Anda mention keywords:

```
You: "I need to build a Solana dApp with wallet connection"
Kiro: [Activates solana-dev skill] → Provides framework-kit guidance

You: "How do I use Helius webhooks?"
Kiro: [Activates helius skill] → Shows webhook setup

You: "Create an AI agent that can swap tokens"
Kiro: [Activates solana-agent-kit skill] → Guides agent creation
```

### Manual Activation
Anda juga bisa manually activate skill:

```
You: "Activate solana-kit skill"
Kiro: [Loads @solana/kit documentation and examples]
```

### Combining Skills
Multiple skills bisa active sekaligus:

```
You: "Build a Next.js dApp using Helius RPC with @solana/kit"
Kiro: [Activates: solana-kit, helius, vercel-react-best-practices]
```

## Best Practices

1. **Be Specific** - Mention specific keywords untuk activate right skill
2. **One Task at a Time** - Focus pada satu aspect dulu
3. **Trust the Skill** - Skills contain battle-tested patterns
4. **Combine with Other Features** - Use skills dengan specs, hooks, steering

## Example Workflows

### Building a Token Swap dApp

```
1. "Activate solana-dev skill" → Get overall architecture
2. "Setup Helius RPC" → helius skill provides config
3. "Build swap UI with @solana/kit" → solana-kit shows transaction building
4. "Optimize React components" → vercel-react-best-practices guides optimization
```

### Creating an AI Trading Agent

```
1. "Activate solana-agent-kit skill" → Learn agent architecture
2. "Setup Jupiter swap action" → Get DeFi integration
3. "Add Helius webhooks for monitoring" → Real-time event tracking
4. "Deploy autonomous mode" → Hands-off execution
```

### Mobile Wallet Integration

```
1. "Activate install-wallet-ui-react-native skill" → Mobile setup
2. "Use @solana/kit for transactions" → Modern SDK patterns
3. "Connect to Helius RPC" → Production infrastructure
```

## Skill Locations

Skills disimpan di: `/Users/0xbt/developer/lesson_workshop/.agents/skills/`

Anda bisa explore skill files untuk deep dive:
- `solana-dev/SKILL.md` - Main Solana development guide
- `solana-kit/SKILL.md` - @solana/kit complete reference
- `helius/SKILL.md` - Helius infrastructure guide
- `solana-agent-kit/SKILL.md` - AI agent development

## Next Steps

- Explore each skill's documentation
- Try activating skills dalam conversation
- Combine skills untuk complex projects
- Create custom skills untuk your specific needs
