# Skill Locations and References

This document provides direct paths to all skills used in the workshop.

## Workshop Skills

All skills are located in `.agents/skills/` directory:

```
.agents/skills/
├── solana-dev/              # End-to-end Solana development
├── solana-kit/              # @solana/kit SDK
├── helius/                  # Helius RPC and APIs
├── solana-agent-kit/        # AI agents for blockchain
├── pinocchio-development/   # High-performance programs
├── use-railway/             # Railway deployment
├── integrating-jupiter/     # Jupiter DeFi APIs
└── vercel-react-best-practices/  # React optimization
```

## Skill Details

### 1. solana-dev

**Location**: `/Users/0xbt/developer/lesson_workshop/.agents/skills/solana-dev/`

**Main File**: `SKILL.md`

**Topics Covered:**
- Frontend (framework-kit)
- SDK (@solana/kit)
- Programs (Anchor/Pinocchio)
- Testing (LiteSVM, Mollusk, Surfpool)
- Security checklist

**Sub-documents:**
- `frontend-framework-kit.md`
- `kit-web3-interop.md`
- `programs-anchor.md`
- `programs-pinocchio.md`
- `testing.md`
- `idl-codegen.md`
- `security.md`
- `compatibility-matrix.md`
- `common-errors.md`

### 2. solana-kit

**Location**: `.agents/skills/solana-kit/`

**Topics:**
- RPC connections
- Transaction building with pipe
- Signers and signing
- Account fetching
- Performance (10x faster crypto)

### 3. helius

**Location**: `/Users/0xbt/developer/lesson_workshop/.agents/skills/helius/`

**Main File**: `SKILL.md`

**Topics Covered:**
- RPC Infrastructure (99.99% uptime)
- DAS API (NFT/token data)
- Enhanced Transactions
- Priority Fee API
- Webhooks
- ZK Compression
- LaserStream (gRPC)

**Sub-documents:**
- `rpc-methods.md`
- `das-api.md`
- `enhanced-apis.md`
- `webhooks.md`
- `zk-compression.md`
- `sdk-reference.md`

### 4. solana-agent-kit

**Location**: `.agents/skills/solana-agent-kit/`

**Topics:**
- 60+ blockchain actions
- Token deployment, NFT minting
- DeFi operations (Jupiter, Raydium)
- LangChain/Vercel AI integration
- MCP server for Claude
- Autonomous mode

### 5. pinocchio-development

**Location**: `.agents/skills/pinocchio-development/`

**Topics:**
- 88-95% CU reduction
- Zero-copy data access
- Zero dependencies
- CPI helpers
- Optimization techniques

### 6. use-railway

**Location**: `.agents/skills/use-railway/`

**Topics:**
- Create projects and services
- Deploy code
- Provision databases
- Configure environments
- Manage domains
- Troubleshoot deployments

### 7. integrating-jupiter

**Location**: `.agents/skills/integrating-jupiter/`

**Topics:**
- Ultra Swap (best routes)
- Lend (earn, borrow)
- Trigger (limit orders)
- Recurring (DCA)
- Tokens API
- Price API
- Portfolio API

### 8. vercel-react-best-practices

**Location**: `.agents/skills/vercel-react-best-practices/`

**Topics:**
- Component patterns
- Data fetching
- Bundle optimization
- Performance best practices

## Using Skills in OpenClaw

To use these skills with OpenClaw:

```bash
# Copy skills to OpenClaw
cp -r .agents/skills/solana-dev ~/.openclaw/skills/
cp -r .agents/skills/helius ~/.openclaw/skills/
cp -r .agents/skills/integrating-jupiter ~/.openclaw/skills/

# Reload skills
openclaw skills reload

# List available skills
openclaw skills list
```

## Skill Activation

Skills activate automatically when you mention keywords:

| Skill | Keywords |
|-------|----------|
| solana-dev | solana, dapp, wallet, anchor, program |
| solana-kit | @solana/kit, rpc, transaction, signer |
| helius | helius, rpc, das, webhook, priority fee |
| solana-agent-kit | ai agent, autonomous, blockchain automation |
| pinocchio-development | pinocchio, high performance, compute units |
| use-railway | railway, deploy, hosting, infrastructure |
| integrating-jupiter | jupiter, swap, jup-ag, limit order, dca |

## Skill Documentation URLs

- **OpenClaw Docs**: https://docs.openclaw.ai
- **Solana Docs**: https://docs.solana.com
- **Helius Docs**: https://docs.helius.dev
- **Jupiter Docs**: https://dev.jup.ag
- **Railway Docs**: https://docs.railway.app
- **@solana/kit**: https://solanakit.com

## Creating Custom Skills

See `09-openclaw-integration/README.md` for guide on:
- Creating custom skills
- Skill manifest format
- Integration with OpenClaw
- Team collaboration

## Skill Updates

Skills are maintained in their respective repositories:
- Check for updates regularly
- Use `npx skills update` to update all skills
- Review changelogs before updating

## Next Steps

1. Explore skill documentation
2. Try activating skills in conversation
3. Create custom skills for your workflow
4. Share skills with team via OpenClaw
