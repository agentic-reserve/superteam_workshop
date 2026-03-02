# Solana Development Quick Start

## Minimal Setup (10 menit)

### 1. Create Directory Structure
```bash
mkdir -p .kiro/{steering,hooks,skills,specs,settings}
```

### 2. Add Solana Security Steering
Create `.kiro/steering/solana-security.md`:
```markdown
# Solana Security

- Always verify signers
- Check account ownership
- Use checked arithmetic
- Validate PDA derivation
- Simulate before sending
- Use priority fees
```

### 3. Add Auto-Test Hook
Create `.kiro/hooks/anchor-test.json`:
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

### 4. Setup Helius RPC
Create `.env.local`:
```bash
HELIUS_API_KEY=your_key_here
NEXT_PUBLIC_RPC_URL=https://mainnet.helius-rpc.com/?api-key=your_key
```

### 5. Test Setup
```bash
# Edit a program file
# Save it
# Hook should trigger anchor test
# Steering should guide security decisions
```

## Full Solana Stack Setup

### Install Dependencies

```bash
# Anchor (program development)
cargo install --git https://github.com/coral-xyz/anchor avm --locked
avm install latest
avm use latest

# Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Node packages
npm install @solana/kit @solana/react-hooks helius-sdk
```

### Project Structure

```
solana-dapp/
├── programs/              # Anchor programs
│   └── my_program/
│       └── src/
│           └── lib.rs
├── tests/                 # Anchor tests
│   └── my_program.ts
├── app/                   # Next.js frontend
│   ├── page.tsx
│   └── layout.tsx
├── .kiro/
│   ├── steering/          # Best practices
│   ├── hooks/             # Automation
│   ├── specs/             # Feature specs
│   └── settings/
│       └── mcp.json       # MCP config
├── Anchor.toml
└── package.json
```

### Essential Hooks

1. **anchor-test.json** - Test on save
2. **codegen-after-idl.json** - Generate client
3. **security-review.json** - Review before write
4. **lint-frontend.json** - Lint React/TS files

### Essential Steering

1. **solana-security.md** - Security patterns (always)
2. **solana-patterns.md** - Code patterns (conditional)
3. **transaction-building.md** - Transaction best practices

### Skills to Activate

- `solana-dev` - Overall Solana development
- `solana-kit` - @solana/kit SDK usage
- `helius` - RPC and infrastructure
- `solana-agent-kit` - AI agent development (if needed)

## Verification Checklist

- [ ] Anchor installed dan working
- [ ] Solana CLI configured
- [ ] Helius API key setup
- [ ] Hooks created dan tested
- [ ] Steering files in place
- [ ] Skills available
- [ ] Can build program: `anchor build`
- [ ] Can run tests: `anchor test`
- [ ] Can start frontend: `npm run dev`

## Daily Workflow

### Morning
1. Check Helius RPC status
2. Pull latest code
3. Review active specs
4. Plan today's tasks

### Development
1. Work on spec tasks
2. Hooks auto-test changes
3. Skills guide implementation
4. Steering ensures quality
5. Commit frequently

### Before Deploy
1. Run full test suite
2. Security review
3. Test on devnet
4. Verify transactions
5. Deploy to mainnet

## Common Commands

```bash
# Anchor
anchor build              # Build program
anchor test               # Run tests
anchor deploy             # Deploy program
anchor idl init           # Initialize IDL

# Solana CLI
solana balance            # Check balance
solana airdrop 2          # Get devnet SOL
solana program deploy     # Deploy program
solana logs               # View logs

# Frontend
npm run dev               # Start dev server
npm run build             # Build for production
npm run lint              # Lint code
npm run type-check        # TypeScript check
```

## Troubleshooting

### Anchor Build Fails
```bash
# Clean and rebuild
anchor clean
anchor build
```

### RPC Connection Issues
```bash
# Check Helius status
curl https://mainnet.helius-rpc.com/?api-key=YOUR_KEY

# Try different endpoint
# Devnet: https://devnet.helius-rpc.com
```

### Hook Not Triggering
- Check JSON syntax
- Verify file patterns
- Test command manually
- Check Kiro Hook UI

### Skill Not Activating
- Use specific keywords
- Try manual activation: "Activate solana-dev skill"
- Check skill availability

## Next Steps

1. Create your first spec
2. Build a simple program
3. Add more hooks
4. Customize steering
5. Explore MCP integration

## Resources

- Solana Docs: https://docs.solana.com
- Anchor Book: https://book.anchor-lang.com
- Helius Docs: https://docs.helius.dev
- @solana/kit: https://solanakit.com
