# Spec: NFT Collection Launch

## Requirements

### Collection Details
- Name: [Collection Name]
- Size: [Number] NFTs
- Mint Type: Standard / Compressed (cNFT)
- Royalties: [%]

### Traits & Rarity
- Trait categories: [List]
- Rarity distribution: Common/Rare/Legendary
- Generative or 1/1s

### Marketplace
- [ ] Magic Eden
- [ ] Tensor
- [ ] Custom marketplace

## Design

### Tech Stack
- **Metaplex**: Core / Bubblegum (for cNFTs)
- **Storage**: Arweave / IPFS
- **SDK**: @solana/kit + Metaplex SDK
- **RPC**: Helius (with DAS API)

### Collection Structure
```typescript
{
  name: "Collection Name",
  symbol: "SYMBOL",
  description: "...",
  image: "https://arweave.net/...",
  attributes: [
    { trait_type: "Background", value: "Blue" },
    { trait_type: "Eyes", value: "Laser" }
  ]
}
```

## Implementation Tasks

### Task 1: Asset Preparation
- [ ] Generate/prepare artwork
- [ ] Create metadata JSON files
- [ ] Upload to Arweave/IPFS
- [ ] Verify all assets

### Task 2: Collection Setup
- [ ] Create collection NFT
- [ ] Set collection metadata
- [ ] Configure royalties
- [ ] Verify collection

### Task 3: Minting Program
- [ ] Setup mint authority
- [ ] Create minting logic
- [ ] Add whitelist (if needed)
- [ ] Test minting flow

### Task 4: Marketplace Integration
- [ ] List on Magic Eden
- [ ] Configure Tensor
- [ ] Setup royalty enforcement

### Task 5: Mint Website
- [ ] Wallet connection
- [ ] Mint interface
- [ ] Rarity display
- [ ] Transaction status

## Security Checklist
- [ ] Update authority secured
- [ ] Royalty enforcement verified
- [ ] Metadata immutable
- [ ] Mint authority revoked after mint
