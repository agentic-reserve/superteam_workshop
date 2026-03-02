# Complete Setup Guide untuk Solana Development

## Overview

Setup lengkap untuk optimize Solana fullstack development dengan Kiro features.

## Prerequisites

- Node.js 18+ dan npm/pnpm
- Rust dan Cargo
- Git
- Code editor (VS Code recommended)

## Step-by-Step Setup

### 1. Install Solana Toolchain

```bash
# Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked
avm install latest
avm use latest

# Verify installation
solana --version
anchor --version
```

### 2. Setup Helius Account

1. Visit [dashboard.helius.dev](https://dashboard.helius.dev)
2. Create account
3. Generate API key
4. Save key securely

### 3. Create Project Structure

```bash
# Create Kiro directories
mkdir -p .kiro/{steering,hooks,skills,specs,settings}

# Create environment file
touch .env.local
```

### 4. Configure Environment

Add to `.env.local`:
```bash
HELIUS_API_KEY=your_key_here
NEXT_PUBLIC_RPC_URL=https://mainnet.helius-rpc.com/?api-key=your_key
NEXT_PUBLIC_DEVNET_RPC_URL=https://devnet.helius-rpc.com/?api-key=your_key
```

### 5. Setup Steering Files

Create essential steering files:

**`.kiro/steering/solana-security.md`** (always active)
```markdown
# Solana Security

- Verify all signers
- Check account ownership
- Use checked arithmetic
- Validate PDA derivation
- Simulate transactions
- Use priority fees
```

**`.kiro/steering/solana-patterns.md`** (conditional)
```markdown
---
inclusion: fileMatch
fileMatchPattern: '**/*.{rs,ts,tsx}'
---

# Solana Patterns

- Use @solana/kit pipe for transactions
- Handle errors explicitly
- Cache token metadata
- Batch operations
```

### 6. Setup Hooks

Create automation hooks:

**`.kiro/hooks/anchor-test.json`**
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

**`.kiro/hooks/codegen-after-idl.json`**
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

**`.kiro/hooks/security-review.json`**
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
    "prompt": "Review for: 1) Signer verification 2) Account ownership 3) Integer overflow 4) Reentrancy 5) PDA validation"
  }
}
```

### 7. Install Dependencies

```bash
# Solana packages
npm install @solana/kit @solana/react-hooks

# Helius SDK
npm install helius-sdk

# Program packages
npm install @solana-program/system @solana-program/token

# Development
npm install -D typescript @types/node
```

### 8. Verify Setup

```bash
# Test Anchor
anchor init test-project
cd test-project
anchor build
anchor test

# Test Helius connection
curl https://mainnet.helius-rpc.com/?api-key=YOUR_KEY

# Test hooks
# Edit a .rs file and save → should trigger anchor test
```

## Project Templates

### Anchor Program Template

```bash
anchor init my-program
cd my-program
anchor build
anchor test
```

### Next.js Frontend Template

```bash
npx create-next-app@latest my-dapp --typescript --tailwind --app
cd my-dapp
npm install @solana/kit @solana/react-hooks helius-sdk
```

## Skills Available

Skills akan automatically activate saat Anda mention keywords:

- **solana-dev**: "build dapp", "anchor program"
- **solana-kit**: "@solana/kit", "transaction"
- **helius**: "helius", "rpc", "webhook"
- **solana-agent-kit**: "ai agent", "autonomous"

## Workflow Integration

### Development Flow
```
1. Create spec untuk feature
2. Skills activate automatically
3. Hooks handle testing
4. Steering guides decisions
5. Iterate quickly
```

### Testing Flow
```
1. Edit program → Hook runs anchor test
2. Update IDL → Hook generates client
3. Complete task → Hook runs integration tests
```

### Deployment Flow
```
1. Security review (Hook)
2. Build verification
3. Devnet deployment
4. Testing on devnet
5. Mainnet deployment
```

## Troubleshooting

### Anchor Issues
```bash
# Clean build
anchor clean && anchor build

# Update Anchor
avm update
```

### RPC Issues
```bash
# Test connection
curl -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}' \
  https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
```

### Hook Issues
- Check JSON syntax
- Verify file patterns
- Test command manually
- View logs in Kiro Hook UI

## Next Steps

1. ✅ Complete setup
2. 📖 Read Skills documentation
3. 📝 Create first spec
4. 🔨 Build simple program
5. 🚀 Deploy to devnet

## Resources

- Quick Start: `solana-quick-start.md`
- Example Spec: `../02-specs-solana/example-swap-dapp-spec.md`
- Hook Examples: `../02-hooks/examples/`
- Skills: `../01-skills-solana/README.md`
