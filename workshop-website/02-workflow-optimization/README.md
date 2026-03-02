# Workflow Optimization untuk Solana Development

## Kombinasi Fitur untuk Maximum Productivity

### Setup Ideal
1. **Skills** untuk Solana expertise (solana-dev, helius, solana-kit)
2. **Hooks** untuk automation (test, lint, security review)
3. **Specs** untuk complex features (NFT marketplace, DeFi protocol)
4. **Steering** untuk best practices (security, performance)
5. **MCP** untuk custom tools (blockchain indexing, monitoring)

## Workflow Examples

### Building a Token Swap dApp
```
1. Create spec: "Token Swap dApp"
   → Structured development plan
   
2. Skills activate automatically:
   - solana-kit (transaction building)
   - helius (RPC + priority fees)
   - vercel-react-best-practices (UI optimization)
   
3. Hooks handle automation:
   - Lint on save
   - Type check on save
   - Test after changes
   
4. Steering guides decisions:
   - Security best practices
   - Transaction patterns
   - Error handling
   
5. Complete tasks incrementally:
   Task 1: Wallet connection → Test → ✓
   Task 2: Jupiter integration → Test → ✓
   Task 3: UI components → Test → ✓
```

### Developing Anchor Program
```
1. Create spec: "Staking Program"
   → Define accounts, instructions, tests
   
2. Skills guide implementation:
   - solana-dev (program patterns)
   - Security checklist
   
3. Hooks auto-test:
   - Save program file → anchor test
   - IDL changes → generate client
   - Complete task → integration test
   
4. Steering ensures quality:
   - Signer verification
   - Account ownership checks
   - Integer overflow protection
```

### Creating AI Trading Agent
```
1. Activate solana-agent-kit skill
   → Learn agent architecture
   
2. Create spec: "Jupiter Trading Agent"
   → Define strategy, risk limits
   
3. Implement with guidance:
   - Token plugin (balance checks)
   - DeFi plugin (Jupiter swaps)
   - Helius webhooks (monitoring)
   
4. Hooks for safety:
   - Review before trade execution
   - Test with devnet first
   - Monitor transaction success
```

## Daily Workflow

### Morning Setup (5 min)
```bash
# 1. Check active specs
# 2. Review hook configurations
# 3. Verify RPC connections (Helius)
# 4. Update dependencies if needed
```

### During Development
```
1. Work on spec tasks incrementally
2. Let hooks handle testing automatically
3. Skills activate as needed
4. Steering guides best practices
5. Commit progress frequently
```

### Before Deployment
```
1. Run security review hook
2. Test on devnet thoroughly
3. Verify all transactions
4. Check compute units
5. Deploy with monitoring
```

## Automation Ideas

### Development Phase
1. **Auto-test Anchor programs** (Hook: fileEdited)
2. **Generate TS client from IDL** (Hook: IDL change)
3. **Lint frontend code** (Hook: fileEdited)
4. **Type check on save** (Hook: fileEdited)
5. **Security review** (Hook: preToolUse)

### Testing Phase
6. **Run unit tests** (Hook: postTaskExecution)
7. **Integration tests** (Hook: manual trigger)
8. **Simulate transactions** (Steering: always check)
9. **Check compute units** (Helius API)

### Deployment Phase
10. **Build verification** (Hook: userTriggered)
11. **Devnet deployment** (Spec task)
12. **Mainnet deployment** (Manual with review)
13. **Monitor transactions** (Helius webhooks)

## Productivity Tips

### Use Skills Proactively
```
"Build swap UI" → solana-kit activates
"Setup RPC" → helius activates
"Optimize React" → vercel-react-best-practices activates
```

### Leverage Specs for Complex Features
```
NFT Marketplace:
- Task 1: Metaplex integration
- Task 2: Listing functionality
- Task 3: Bidding system
- Task 4: Royalty distribution
```

### Let Hooks Handle Repetition
```
Save file → Auto-test → Auto-lint → Type check
Complete task → Integration test → Security review
```

### Steering for Consistency
```
Always included:
- Solana security patterns
- Transaction best practices
- Error handling guidelines

Conditional:
- API guidelines (when editing API files)
- Testing patterns (when editing tests)
```

## Performance Metrics

Track your productivity:
- Tasks completed per day
- Test success rate
- Deployment frequency
- Bug fix time
- Code review time (reduced by hooks)

## Common Patterns

### Pattern 1: Rapid Prototyping
```
1. Create minimal spec
2. Activate relevant skills
3. Build with AI assistance
4. Hooks auto-test
5. Iterate quickly
```

### Pattern 2: Production Development
```
1. Detailed spec with security
2. Skills guide implementation
3. Hooks enforce quality
4. Steering ensures best practices
5. Deploy with confidence
```

### Pattern 3: Maintenance & Refactoring
```
1. Spec for refactoring plan
2. Skills provide patterns
3. Hooks verify no regressions
4. Steering maintains consistency
```

## Troubleshooting

### Hooks Not Working
- Check JSON syntax
- Verify file patterns
- Test with simple command first

### Skills Not Activating
- Use specific keywords
- Try manual activation
- Check skill availability

### Specs Too Complex
- Break into smaller specs
- Focus on one feature at a time
- Use file references

## Next Level

### Custom MCP Tools
Create custom tools untuk:
- Blockchain indexing
- Transaction monitoring
- Performance analytics
- Custom RPC methods

### Custom Skills
Build skills untuk:
- Your specific program patterns
- Team coding standards
- Domain-specific knowledge

### Advanced Hooks
Create hooks untuk:
- Multi-step workflows
- Conditional execution
- Cross-tool coordination

