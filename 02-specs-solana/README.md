# Specs - Structured Solana dApp Development

## Apa itu Specs?

Specs adalah cara terstruktur untuk build dan document Solana features dengan Kiro. Specs memformalisasi proses design dan implementation dengan iterasi pada requirements, design, dan implementation tasks.

## Keuntungan untuk Solana Development

- **Complex Features**: NFT marketplace, DeFi protocols, staking systems
- **Incremental Development**: Build program → test → UI → integrate
- **Documentation**: Auto-document architecture decisions
- **File References**: Link to IDL, OpenAPI specs dengan `#[[file:nama_file]]`
- **Team Collaboration**: Clear requirements dan progress tracking

## Solana-Specific Use Cases

### 1. Token Launch Spec
- Requirements: Tokenomics, distribution, vesting
- Design: Token-2022 extensions, metadata
- Tasks: Deploy token → create pool → add liquidity → UI

### 2. NFT Collection Spec
- Requirements: Collection size, traits, rarity
- Design: Metaplex setup, metadata structure
- Tasks: Upload assets → create collection → mint NFTs → marketplace listing

### 3. DeFi Protocol Spec
- Requirements: AMM type, fee structure, security
- Design: Program architecture, account structure
- Tasks: Write program → test → audit → deploy → UI

### 4. Staking Platform Spec
- Requirements: Rewards calculation, lock periods
- Design: Stake account structure, reward distribution
- Tasks: Program → testing → UI → monitoring

## Spec Structure untuk Solana

```markdown
# Spec: [Feature Name]

## Requirements
- User stories
- Technical requirements
- Security requirements
- Performance targets

## Design

### Program Architecture
- Account structures
- Instructions
- CPIs (Cross-Program Invocations)

### Frontend Architecture
- Wallet connection
- Transaction building
- State management

### Infrastructure
- RPC provider (Helius)
- Indexing (DAS API)
- Monitoring (webhooks)

## Implementation Tasks

### Task 1: Program Development
- [ ] Define account structures
- [ ] Implement instructions
- [ ] Add security checks
- [ ] Write tests (LiteSVM)

### Task 2: Client SDK
- [ ] Generate client from IDL (Codama)
- [ ] Create transaction builders
- [ ] Add error handling

### Task 3: Frontend
- [ ] Wallet connection
- [ ] Transaction UI
- [ ] State management
- [ ] Error handling

### Task 4: Testing & Deployment
- [ ] Unit tests (Mollusk)
- [ ] Integration tests (Surfpool)
- [ ] Devnet deployment
- [ ] Mainnet deployment

## File References
- Program IDL: #[[file:target/idl/program.json]]
- Client types: #[[file:src/generated/index.ts]]
- API spec: #[[file:docs/api.yaml]]

## Security Checklist
- [ ] Signer verification
- [ ] Account ownership checks
- [ ] Integer overflow protection
- [ ] Reentrancy guards
- [ ] PDA derivation validation
```

## Example: Token Swap dApp Spec

Lihat file: `example-swap-dapp-spec.md`

## Workflow dengan Skills

Specs bekerja sangat baik dengan Skills:

```
1. Create spec untuk feature
2. Kiro activates relevant skills (solana-dev, helius, solana-kit)
3. Skills guide implementation di setiap task
4. Hooks auto-test setelah setiap task
5. Steering ensure security best practices
```

## Best Practices

1. **Start Small** - Begin dengan simple spec, expand gradually
2. **Reference Files** - Link to IDL, configs, docs
3. **Security First** - Include security checklist di setiap spec
4. **Test Early** - Add testing tasks early in spec
5. **Iterate** - Update spec as requirements evolve

## Spec Templates

Folder `templates/` berisi ready-to-use specs:
- `token-deployment-spec.md` - SPL token launch
- `nft-collection-spec.md` - NFT collection creation
- `defi-protocol-spec.md` - AMM/lending protocol
- `staking-platform-spec.md` - Staking system
