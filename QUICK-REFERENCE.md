# Quick Reference - Cheat Sheet

## 🚀 Quick Commands

### Ollama + OpenClaw (Fastest Start)
```bash
# Install Ollama
curl -fsSL https://ollama.com/download/install.sh | sh

# Launch OpenClaw
ollama launch openclaw

# Choose model: gpt-oss:120b-cloud
```

### Solana Setup
```bash
# Install Solana
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# Verify
solana --version
anchor --version
```

### Project Setup
```bash
# Create Kiro directories
mkdir -p .kiro/{steering,hooks,specs,settings}

# Initialize Anchor project
anchor init my-project
cd my-project

# Install dependencies
npm install
```

---

## 💡 Skills Activation

### Automatic Activation (mention keywords)
```
"Build a Solana dApp"           → solana-dev
"Use @solana/kit"               → solana-kit
"Setup Helius RPC"              → helius
"Create AI agent"               → solana-agent-kit
"Optimize compute units"        → pinocchio-development
"Deploy to Railway"             → use-railway
"Integrate Jupiter swap"        → integrating-jupiter
```

### Manual Activation
```
"Activate solana-dev skill"
"Activate helius skill"
"Activate integrating-jupiter skill"
```

### Available Skills
1. **solana-dev** - End-to-end Solana development
2. **solana-kit** - Modern JavaScript SDK
3. **helius** - RPC and API infrastructure
4. **solana-agent-kit** - AI agents for blockchain
5. **pinocchio-development** - High-performance programs
6. **use-railway** - Infrastructure deployment
7. **integrating-jupiter** - DeFi operations
8. **install-wallet-ui-react-native** - Mobile wallets

---

## 📋 Specs Template

```markdown
# Spec: [Feature Name]

## Requirements
- User story 1
- User story 2
- Technical requirement

## Design
### Program Architecture
- Account structures
- Instructions
- CPIs

### Frontend Architecture
- Wallet connection
- Transaction building
- State management

## Tasks
### Task 1: Program Development
- [ ] Define accounts
- [ ] Implement instructions
- [ ] Add security checks
- [ ] Write tests

### Task 2: Frontend
- [ ] Wallet connection
- [ ] Transaction UI
- [ ] Error handling

## File References
- IDL: #[[file:target/idl/program.json]]
- Types: #[[file:src/generated/index.ts]]
```

---

## 🪝 Common Hooks

### Auto-Test Anchor Program
```json
{
  "name": "Test Anchor Program",
  "version": "1.0.0",
  "when": {
    "type": "fileEdited",
    "patterns": ["programs/**/*.rs"]
  },
  "then": {
    "type": "runCommand",
    "command": "anchor test"
  }
}
```

### Security Review Before Deploy
```json
{
  "name": "Security Review",
  "version": "1.0.0",
  "when": {
    "type": "preToolUse",
    "toolTypes": ["write"]
  },
  "then": {
    "type": "askAgent",
    "prompt": "Review for security issues"
  }
}
```

### Auto-Generate Client
```json
{
  "name": "Generate Client",
  "version": "1.0.0",
  "when": {
    "type": "fileEdited",
    "patterns": ["target/idl/*.json"]
  },
  "then": {
    "type": "runCommand",
    "command": "npm run codegen"
  }
}
```

### Lint Frontend
```json
{
  "name": "Lint Frontend",
  "version": "1.0.0",
  "when": {
    "type": "fileEdited",
    "patterns": ["src/**/*.{ts,tsx}"]
  },
  "then": {
    "type": "runCommand",
    "command": "npm run lint:fix"
  }
}
```

---

## 🎯 Steering Examples

### Always Included (Security)
```markdown
# Solana Security Best Practices

## Transaction Building
- Verify all signers
- Check account ownership
- Use checked arithmetic
- Validate PDA derivation

## Program Development
- Prevent reentrancy
- Handle integer overflow
- Validate all inputs
- Use proper error codes
```

### Conditional (File Match)
```markdown
---
inclusion: fileMatch
fileMatchPattern: 'programs/**/*.rs'
---

# Anchor Program Guidelines

- Use #[account] macro properly
- Implement proper constraints
- Add security checks
- Write comprehensive tests
```

### Manual Activation
```markdown
---
inclusion: manual
---

# Deployment Checklist

- [ ] Tests passing
- [ ] Security audit done
- [ ] Devnet tested
- [ ] Mainnet ready
```

---

## 🔧 MCP Configuration

### Basic Setup
```json
{
  "mcpServers": {
    "aws-docs": {
      "command": "uvx",
      "args": ["awslabs.aws-documentation-mcp-server@latest"],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

### Location
- User: `~/.kiro/settings/mcp.json`
- Workspace: `.kiro/settings/mcp.json`

---

## 🌐 OpenClaw Commands

### Gateway Management
```bash
# Start gateway
openclaw daemon start

# Stop gateway
openclaw daemon stop

# Check status
openclaw status

# View logs
openclaw logs --tail 50
openclaw logs --follow
```

### Channels
```bash
# Add channel
openclaw channels add slack
openclaw channels add discord

# List channels
openclaw channels list

# Test channel
openclaw channels test slack
```

### Webhooks
```bash
# Create webhook
openclaw webhooks create \
  --name "deployment" \
  --path "/webhook/deploy" \
  --channel "#deployments"

# List webhooks
openclaw webhooks list

# Test webhook
curl -X POST http://localhost:3000/webhook/deploy \
  -d '{"program": "test", "status": "deployed"}'
```

### Cron Jobs
```bash
# Create cron
openclaw cron create \
  --name "check-balance" \
  --schedule "0 * * * *" \
  --command "solana balance PROGRAM_ID" \
  --channel "#monitoring"

# List cron jobs
openclaw cron list

# Run manually
openclaw cron run check-balance
```

### Skills
```bash
# Copy workshop skills
cp -r .agents/skills/* ~/.openclaw/skills/

# Reload skills
openclaw skills reload

# List skills
openclaw skills list
```

---

## 📦 Environment Variables

### Helius
```bash
export HELIUS_API_KEY="your_key_here"
```

### Ollama
```bash
export OLLAMA_HOST="http://localhost:11434"
export OLLAMA_NUM_CTX=65536
export OLLAMA_API_KEY="your_key_here"
export OLLAMA_KEEP_ALIVE=5m
```

### OpenClaw
```bash
export OPENCLAW_WEBHOOK="http://localhost:3000/webhook"
export OPENCLAW_TOKEN="your_token_here"
```

### Solana
```bash
export ANCHOR_WALLET="~/.config/solana/id.json"
export ANCHOR_PROVIDER_URL="https://api.devnet.solana.com"
```

---

## 🎨 Example App Commands

### Setup
```bash
cd example-app
npm install
cp .env.example .env
# Edit .env with your keys
```

### Development
```bash
# Start dev server
npm run dev

# Build program
anchor build

# Test program
anchor test

# Deploy to devnet
anchor deploy --provider.cluster devnet
```

### Deployment
```bash
# Deploy frontend (Vercel)
vercel deploy

# Deploy backend (Railway)
railway up

# Deploy program (mainnet)
anchor deploy --provider.cluster mainnet
```

---

## 🔍 Troubleshooting

### Ollama Issues
```bash
# Check if running
curl http://localhost:11434/api/tags

# Restart
pkill ollama
ollama serve

# Pull model
ollama pull gpt-oss:120b-cloud
```

### OpenClaw Issues
```bash
# Check status
openclaw status

# Restart gateway
openclaw daemon restart

# Clear cache
openclaw cache clear

# Check logs
openclaw logs --tail 100
```

### Anchor Issues
```bash
# Clean build
anchor clean
anchor build

# Update dependencies
cargo update

# Check version
anchor --version
```

### Solana Issues
```bash
# Check connection
solana cluster-version

# Check balance
solana balance

# Airdrop (devnet)
solana airdrop 2

# Check config
solana config get
```

---

## 📊 Performance Tips

### Compute Units Optimization
```rust
// Use Pinocchio for 88-95% CU reduction
use pinocchio::*;

// Zero-copy data access
#[account]
pub struct MyAccount {
    pub data: [u8; 1000],
}
```

### Transaction Building
```typescript
// Use @solana/kit pipe
import { pipe } from '@solana/kit';

const tx = pipe(
  createTransaction(),
  addInstruction(instruction),
  setComputeBudget(200_000),
  setPriorityFee(priorityFee)
);
```

### RPC Optimization
```typescript
// Use Helius for better performance
const connection = new Connection(
  `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`
);

// Batch requests
const accounts = await connection.getMultipleAccountsInfo([...]);
```

---

## 🎯 Common Workflows

### Build Token Swap dApp
```
1. Setup environment (30 min)
2. Activate skills: solana-dev, helius, integrating-jupiter
3. Create spec for swap feature
4. Build UI with @solana/kit
5. Integrate Jupiter swap
6. Test on devnet
7. Deploy to production
```

### Setup Team Collaboration
```
1. Install Ollama + OpenClaw (5 min)
2. Connect Slack/Discord (10 min)
3. Copy workshop skills (2 min)
4. Create team steering (10 min)
5. Setup deployment webhooks (15 min)
6. Configure monitoring (15 min)
```

### Deploy to Production
```
1. Test on devnet
2. Security audit
3. Deploy program to mainnet
4. Deploy frontend to Vercel
5. Deploy backend to Railway
6. Setup monitoring with OpenClaw
7. Configure alerts
```

---

## 📚 Quick Links

### Documentation
- [Workshop Index](./WORKSHOP-INDEX.md)
- [Main README](./README.md)
- [Workshop Guide](./WORKSHOP-GUIDE.md)
- [Presentation Script](./PRESENTATION-SCRIPT.md)

### Modules
- [Skills](./01-skills-solana/README.md)
- [Specs](./02-specs-solana/README.md)
- [Hooks](./02-hooks/README.md)
- [Steering](./03-steering/README.md)
- [MCP](./04-mcp/README.md)
- [Setup](./06-complete-setup/README.md)
- [Modern Workflow](./07-modern-workflow/README.md)
- [Deployment](./08-deployment/README.md)
- [OpenClaw](./09-openclaw-integration/README.md)

### External
- [Solana Docs](https://docs.solana.com)
- [Anchor Book](https://book.anchor-lang.com)
- [Helius Docs](https://docs.helius.dev)
- [@solana/kit](https://solanakit.com)
- [Ollama Docs](https://docs.ollama.com)
- [OpenClaw Docs](https://docs.openclaw.ai)

---

## 💡 Pro Tips

1. **Start Small** - Begin with simple features, expand gradually
2. **Use Skills** - Let AI guide you with specialized knowledge
3. **Automate Early** - Setup hooks from the beginning
4. **Test Often** - Use LiteSVM for fast unit tests
5. **Security First** - Always review before deployment
6. **Team Collaboration** - Use OpenClaw for team workflows
7. **Iterate Fast** - Use modern workflow for rapid iteration
8. **Monitor Always** - Setup monitoring from day one

---

## 🎉 Quick Start Checklist

- [ ] Install Solana CLI
- [ ] Install Anchor
- [ ] Setup Helius account
- [ ] Install Ollama
- [ ] Launch OpenClaw
- [ ] Copy workshop skills
- [ ] Create first spec
- [ ] Setup first hook
- [ ] Build example app
- [ ] Deploy to devnet

**Time: 2 hours** → You're ready to build! 🚀

---

**Need more details?** Check [WORKSHOP-INDEX.md](./WORKSHOP-INDEX.md) for complete navigation.
