# Workshop Index - Complete Navigation Guide

## 🎯 Quick Navigation

**Baru mulai?** → [Complete Setup](#module-7-complete-setup)
**Butuh cheat sheet?** → [QUICK-REFERENCE.md](./QUICK-REFERENCE.md)
**Mau presentasi?** → [PRESENTATION-SCRIPT.md](./PRESENTATION-SCRIPT.md)

---

## 📚 All Modules

### Module 1: Skills - Solana Development Expertise
**Folder**: `01-skills-solana/`
**Duration**: 30-45 minutes
**Level**: Beginner
**Prerequisites**: None

**What You'll Learn:**
- Activate Solana development skills on-demand
- Use 8 specialized skills (solana-dev, helius, jupiter, etc.)
- Automatic vs manual skill activation
- Combine multiple skills

**Key Files:**
- `README.md` - Main guide
- `skill-locations.md` - Where skills are installed
- `pinocchio-overview.md` - High-performance programs
- `examples/` - Activation examples

**Skills Available:**
1. solana-dev - End-to-end development
2. solana-kit - Modern JavaScript SDK
3. helius - RPC and API infrastructure
4. solana-agent-kit - AI agents for blockchain
5. pinocchio-development - High-performance programs
6. use-railway - Infrastructure deployment
7. integrating-jupiter - DeFi operations
8. install-wallet-ui-react-native - Mobile wallets

**Next Steps:** → [Module 2: Specs](#module-2-specs)

---

### Module 2: Specs - Structured Feature Development
**Folder**: `02-specs-solana/`
**Duration**: 45-60 minutes
**Level**: Beginner to Intermediate
**Prerequisites**: Module 1 (Skills)

**What You'll Learn:**
- Create structured development specs
- Break complex features into tasks
- Document architecture decisions
- Reference external files (IDL, OpenAPI)

**Key Files:**
- `README.md` - Specs guide
- `example-swap-dapp-spec.md` - Complete example
- `templates/` - Ready-to-use templates

**Use Cases:**
- Token launch
- NFT collection
- DeFi protocol
- Staking platform

**Next Steps:** → [Module 3: Hooks](#module-3-hooks)

---

### Module 3: Hooks - Automation & Testing
**Folder**: `02-hooks/`
**Duration**: 30-45 minutes
**Level**: Intermediate
**Prerequisites**: Module 1 (Skills)

**What You'll Learn:**
- Automate repetitive tasks
- Auto-test on file save
- Security reviews before deployment
- Generate code from IDL

**Key Files:**
- `README.md` - Hooks guide
- `examples/` - Hook examples

**Event Types:**
- File events (edited, created, deleted)
- Agent events (prompt, tool use)
- Task events (pre/post execution)
- Manual triggers

**Next Steps:** → [Module 4: Workflow Optimization](#module-4-workflow-optimization)

---

### Module 4: Workflow Optimization
**Folder**: `02-workflow-optimization/`
**Duration**: 45-60 minutes
**Level**: Intermediate to Advanced
**Prerequisites**: Modules 1-3

**What You'll Learn:**
- Combine Skills, Specs, Hooks, Steering
- Optimize daily workflows
- Testing strategies
- Deployment patterns

**Key Files:**
- `README.md` - Workflow guide

**Topics:**
- Development workflows
- Testing strategies
- Deployment patterns
- Daily routines

**Next Steps:** → [Module 5: Steering](#module-5-steering)

---

### Module 5: Steering - Best Practices & Guidelines
**Folder**: `03-steering/`
**Duration**: 20-30 minutes
**Level**: Beginner
**Prerequisites**: None

**What You'll Learn:**
- Add context and guidelines for AI
- Always-included vs conditional steering
- File references
- Team standards

**Key Files:**
- `README.md` - Steering guide
- `examples/` - Steering examples

**Use Cases:**
- Team coding standards
- Project context
- Workflow instructions
- API references
- Security guidelines

**Next Steps:** → [Module 6: MCP](#module-6-mcp)

---

### Module 6: MCP - External Tool Integration
**Folder**: `04-mcp/`
**Duration**: 30-45 minutes
**Level**: Intermediate to Advanced
**Prerequisites**: None

**What You'll Learn:**
- Extend Kiro with external tools
- Configure MCP servers
- Database access
- Cloud services integration

**Key Files:**
- `README.md` - MCP guide
- `example-mcp-config.json` - Configuration example

**Popular Servers:**
- AWS Documentation
- Database access
- File system operations
- Web APIs

**Next Steps:** → [Module 7: Complete Setup](#module-7-complete-setup)

---

### Module 7: Complete Setup
**Folder**: `06-complete-setup/`
**Duration**: 30-45 minutes
**Level**: Beginner
**Prerequisites**: None

**What You'll Learn:**
- Install Solana toolchain
- Configure Helius RPC
- Setup Kiro features
- Verify installation

**Key Files:**
- `README.md` - Setup overview
- `solana-quick-start.md` - Quick start guide
- `quick-start-checklist.md` - Verification checklist

**Steps:**
1. Install Solana CLI
2. Install Anchor
3. Setup Helius account
4. Configure Kiro
5. Verify everything works

**Next Steps:** → [Module 1: Skills](#module-1-skills) or [Example App](#example-application)

---

### Module 8: Modern Design-to-Code Workflow
**Folder**: `07-modern-workflow/`
**Duration**: 30-45 minutes
**Level**: Intermediate
**Prerequisites**: Module 1 (Skills)

**What You'll Learn:**
- New development paradigm
- Generate → Experience → Critique → Regenerate
- Design as jazz (improvisation)
- Branching, not perfecting
- 210x speed improvement

**Key Files:**
- `README.md` - Workflow guide
- `examples/swap-ui-iteration.md` - Real example

**Key Concepts:**
- The handoff is dead
- Design as exploration
- Rapid iteration
- Skills as design decisions

**Next Steps:** → [Module 9: Deployment](#module-9-deployment)

---

### Module 9: Deployment
**Folder**: `08-deployment/`
**Duration**: 60-90 minutes
**Level**: Intermediate to Advanced
**Prerequisites**: Modules 1-7

**What You'll Learn:**
- Deploy frontend (Vercel)
- Deploy backend (Railway)
- Deploy programs (Solana mainnet)
- Setup monitoring
- CI/CD pipelines

**Key Files:**
- `README.md` - Deployment guide

**Topics:**
- Frontend deployment
- Backend deployment
- Program deployment
- Monitoring and maintenance
- CI/CD automation

**Next Steps:** → [Module 10: OpenClaw](#module-10-openclaw-integration)

---

### Module 10: OpenClaw Integration
**Folder**: `09-openclaw-integration/`
**Duration**: 2.5 hours (deep dive) or 15 minutes (quick start)
**Level**: Intermediate to Advanced
**Prerequisites**: Modules 1-9

**What You'll Learn:**
- Multi-platform AI agent
- Team collaboration
- Automated monitoring
- Voice commands
- Ollama integration (local/cloud models)

**Key Files:**
- `README.md` - Overview
- `QUICK-START.md` - 15-minute setup
- `OLLAMA-SETUP.md` - Ollama integration
- `DEEP-DIVE.md` - Complete guide (2.5 hours)
- `INDEX.md` - Navigation
- `troubleshooting.md` - Common issues
- `deep-dive/` - 6 detailed modules
- `examples/` - Complete workflows

**Quick Start (5 minutes with Ollama):**
```bash
curl -fsSL https://ollama.com/download/install.sh | sh
ollama launch openclaw
# Choose: gpt-oss:120b-cloud
```

**Deep Dive Modules:**
1. Architecture (15 min)
2. Channels (20 min)
3. Automation (25 min)
4. Solana Workflows (30 min)
5. Advanced Features (25 min)
6. Production (20 min)

**Next Steps:** → [Example App](#example-application)

---

## 🎨 Example Application

**Folder**: `example-app/`
**Duration**: 1-2 hours
**Level**: Intermediate
**Prerequisites**: Modules 1, 7

**What You'll Build:**
Token Balance Checker + Guestbook dApp

**Features:**
- Multi-wallet connection
- SOL balance display
- SPL token list with metadata
- Guestbook (on-chain messages)
- Real-time updates via Helius

**Tech Stack:**
- Frontend: Next.js + @solana/kit
- Smart Contracts: Anchor + Pinocchio
- Infrastructure: Helius RPC + DAS API
- AI: Kiro features integrated

**Key Files:**
- `README.md` - App overview
- `SETUP.md` - Setup instructions
- `PROGRAM-SETUP.md` - Smart contract setup
- `PINOCCHIO-COMPARISON.md` - Performance comparison
- `DEPLOYMENT.md` - Deployment guide

**Pinocchio Benefits:**
- 88-95% compute unit reduction
- Zero-copy data access
- Zero dependencies

---

## 📖 Learning Paths

### Path 1: Quick Start (2 hours)
**Goal**: Get up and running fast

1. [Module 7: Complete Setup](#module-7-complete-setup) - 30 min
2. [Module 1: Skills](#module-1-skills) - 30 min
3. [Example App](#example-application) - 1 hour

**Result**: Working dApp with AI assistance

---

### Path 2: Comprehensive (7 hours)
**Goal**: Master all features

1. [Module 7: Complete Setup](#module-7-complete-setup) - 30 min
2. [Module 1: Skills](#module-1-skills) - 45 min
3. [Module 2: Specs](#module-2-specs) - 60 min
4. [Module 3: Hooks](#module-3-hooks) - 45 min
5. [Module 5: Steering](#module-5-steering) - 30 min
6. [Module 4: Workflow Optimization](#module-4-workflow-optimization) - 60 min
7. [Module 8: Modern Workflow](#module-8-modern-design-to-code-workflow) - 45 min
8. [Module 9: Deployment](#module-9-deployment) - 90 min
9. [Example App](#example-application) - 120 min

**Result**: Complete mastery of Kiro + Solana development

---

### Path 3: Team Setup (4 hours)
**Goal**: Setup for team collaboration

1. [Module 7: Complete Setup](#module-7-complete-setup) - 30 min
2. [Module 1: Skills](#module-1-skills) - 30 min
3. [Module 5: Steering](#module-5-steering) - 30 min
4. [Module 10: OpenClaw](#module-10-openclaw-integration) - 150 min
5. Team onboarding - 30 min

**Result**: Team-ready development environment

---

### Path 4: Production Deployment (3 hours)
**Goal**: Deploy to production

1. [Module 7: Complete Setup](#module-7-complete-setup) - 30 min
2. [Module 9: Deployment](#module-9-deployment) - 90 min
3. [Module 10: OpenClaw](#module-10-openclaw-integration) - 60 min

**Result**: Production-ready deployment pipeline

---

## 🎯 By Use Case

### Use Case: Build Token Swap dApp
**Modules**: 1, 2, 7, 8, 9
**Duration**: 4 hours

1. Setup environment (Module 7)
2. Activate skills (Module 1)
3. Create spec (Module 2)
4. Build with modern workflow (Module 8)
5. Deploy (Module 9)

---

### Use Case: Setup Team Collaboration
**Modules**: 1, 5, 10
**Duration**: 3 hours

1. Activate skills (Module 1)
2. Create team steering (Module 5)
3. Setup OpenClaw (Module 10)

---

### Use Case: Automate Testing
**Modules**: 1, 3, 4
**Duration**: 2 hours

1. Activate skills (Module 1)
2. Create hooks (Module 3)
3. Optimize workflow (Module 4)

---

### Use Case: Deploy to Production
**Modules**: 7, 9, 10
**Duration**: 3 hours

1. Complete setup (Module 7)
2. Deploy infrastructure (Module 9)
3. Setup monitoring (Module 10)

---

## 📊 Module Dependencies

```
Module 7 (Setup)
    ↓
Module 1 (Skills) ←─────────┐
    ↓                       │
Module 2 (Specs)            │
    ↓                       │
Module 3 (Hooks)            │
    ↓                       │
Module 5 (Steering)         │
    ↓                       │
Module 4 (Workflow) ────────┘
    ↓
Module 8 (Modern Workflow)
    ↓
Module 9 (Deployment)
    ↓
Module 10 (OpenClaw)

Module 6 (MCP) - Independent, can be done anytime
Example App - Can be done after Module 1 + 7
```

---

## 🎓 Difficulty Levels

### Beginner
- Module 7: Complete Setup
- Module 1: Skills
- Module 5: Steering
- Example App (basic features)

### Intermediate
- Module 2: Specs
- Module 3: Hooks
- Module 4: Workflow Optimization
- Module 8: Modern Workflow
- Module 9: Deployment
- Example App (full features)

### Advanced
- Module 6: MCP
- Module 10: OpenClaw (deep dive)
- Custom skills creation
- Production optimization

---

## 📝 Additional Resources

### Documentation
- [Main README](./README.md) - Workshop overview
- [Workshop Guide](./WORKSHOP-GUIDE.md) - Instructor guide
- [Presentation Script](./PRESENTATION-SCRIPT.md) - Presentation materials
- [Quick Reference](./QUICK-REFERENCE.md) - Cheat sheet
- [Structure Review](./WORKSHOP-STRUCTURE-REVIEW.md) - Quality assessment

### External Links
- [Solana Docs](https://docs.solana.com)
- [Anchor Book](https://book.anchor-lang.com)
- [Helius Docs](https://docs.helius.dev)
- [@solana/kit](https://solanakit.com)
- [Ollama Docs](https://docs.ollama.com)
- [OpenClaw Docs](https://docs.openclaw.ai)

---

## 🚀 Getting Started

**First Time Here?**

1. Read [Main README](./README.md) (10 min)
2. Follow [Complete Setup](./06-complete-setup/solana-quick-start.md) (30 min)
3. Try [Example App](./example-app/README.md) (1 hour)
4. Explore modules based on your needs

**Have Questions?**

- Check module READMEs
- Review [Quick Reference](./QUICK-REFERENCE.md)
- See [Troubleshooting](./09-openclaw-integration/troubleshooting.md)

---

## 🎉 Ready to Start?

Choose your path:
- **Quick Start** → [Module 7: Complete Setup](#module-7-complete-setup)
- **Comprehensive** → [Module 7](#module-7-complete-setup) → [Module 1](#module-1-skills)
- **Team Setup** → [Module 10: OpenClaw](#module-10-openclaw-integration)
- **Just Explore** → [Example App](#example-application)

Happy coding! 🚀
