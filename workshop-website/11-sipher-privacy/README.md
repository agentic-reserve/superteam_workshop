# Module 11: Sipher - Privacy-as-a-Skill for Multi-Chain Agents

## Overview

Sipher adalah REST API dan OpenClaw skill yang memberikan autonomous agents kemampuan privacy across 17 blockchain chains. Dengan Sipher, agent kamu bisa melakukan transaksi dengan stealth addresses, hidden amounts, dan compliance viewing keys.

## Kenapa Privacy Penting untuk Agents?

Setiap transaksi agent adalah public broadcast. MEV bots, competitors, dan surveillance actors bisa melihat semua:

- ❌ Sender address exposed → targeted phishing
- ❌ Recipient known → front-running, sandwich attacks  
- ❌ Amount visible → MEV extraction
- ❌ Pattern analysis → trading strategy leaked
- ❌ Counterparty graph → competitive intelligence

Dengan Sipher:

- ✅ Stealth address → unlinkable sender
- ✅ One-time address → no recipient reuse
- ✅ Hidden amount → Pedersen commitment
- ✅ Compliance → selective disclosure via viewing keys
- ✅ On-chain proof → verifiable without revealing data

## Key Features

### 1. Stealth Addresses (17 Chains)
Generate unlinkable addresses untuk private payments:
- Solana, NEAR, Aptos, Sui (Ed25519)
- Ethereum, Polygon, Arbitrum, Optimism, Base (secp256k1)
- Cosmos, Osmosis, Injective, Celestia, Sei, dYdX (secp256k1)
- Bitcoin, Zcash (secp256k1)

### 2. Pedersen Commitments
Hide transaction amounts dengan homomorphic encryption:
- Create commitments (hide values)
- Verify commitments (prove validity)
- Add/subtract commitments (without revealing amounts)

### 3. Viewing Keys
Compliance-friendly selective disclosure:
- BIP32 hierarchical key derivation
- XChaCha20-Poly1305 encryption
- Auditor-specific viewing keys
- Selective transaction disclosure

### 4. Shielded Transfers
Build private transactions untuk Solana:
- SOL and SPL token support
- Unsigned transaction building
- On-chain Anchor program integration
- Pedersen commitment embedding

## Quick Start

### 1. Generate Stealth Meta-Address

```bash
curl -X POST https://sipher.sip-protocol.org/v1/stealth/generate \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-key" \
  -d '{"chain": "solana"}'
```

Response:
```json
{
  "success": true,
  "data": {
    "metaAddress": {
      "spendingKey": "base58_spending_public_key",
      "viewingKey": "base58_viewing_public_key",
      "chain": "solana"
    }
  }
}
```

### 2. Derive One-Time Stealth Address

```bash
curl -X POST https://sipher.sip-protocol.org/v1/stealth/derive \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-key" \
  -d '{
    "recipientMetaAddress": {
      "spendingKey": "...",
      "viewingKey": "...",
      "chain": "solana"
    }
  }'
```

### 3. Build Shielded Transfer

```bash
curl -X POST https://sipher.sip-protocol.org/v1/transfer/shield \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-key" \
  -d '{
    "senderAddress": "YourSolanaAddress",
    "recipientMetaAddress": {
      "spendingKey": "...",
      "viewingKey": "...",
      "chain": "solana"
    },
    "amount": "1000000000",
    "mint": "So11111111111111111111111111111111111111112"
  }'
```

## Architecture

```
Agent (Claude, LangChain, CrewAI, OpenClaw)
    │
    ▼  REST API
┌──────────────────────────────────────┐
│         Sipher API                   │
│  71 endpoints │ Tiered rate limiting │
│                                      │
│  ┌──────────┐ ┌──────────┐          │
│  │  Auth    │ │  Rate    │          │
│  │ (tiered) │ │  Limit   │          │
│  └────┬─────┘ └────┬─────┘          │
└───────┼────────────┼─────────────────┘
        │            │
        ▼            ▼
┌──────────────┐ ┌───────────────────┐
│ @sip-protocol│ │  Solana Mainnet   │
│ /sdk v0.7.4  │ │                   │
│              │ │  Program:         │
│ • Ed25519    │ │  S1PMFs...9at     │
│ • secp256k1  │ │                   │
│ • Pedersen   │ │  Config PDA:      │
│ • XChaCha20  │ │  BVawZk...WZwZ    │
│ • BIP32      │ │                   │
│ • Anchor     │ │  Helius DAS       │
└──────────────┘ └───────────────────┘
```

## Cryptographic Primitives

Semua operasi menggunakan production-grade libraries:

| Primitive | Library | Purpose |
|-----------|---------|---------|
| Ed25519 Stealth | @noble/curves | Solana, NEAR, Move stealth addresses |
| secp256k1 Stealth | @noble/curves | EVM, Cosmos, Bitcoin stealth |
| Pedersen Commitments | @sip-protocol/sdk | Homomorphic hidden amounts |
| XChaCha20-Poly1305 | @noble/ciphers | Viewing key encryption |
| SHA-256 | @noble/hashes | Key hashing, view tags |
| BIP32/BIP39 | @scure/bip32 | Hierarchical key derivation |

## API Endpoints (71 Total)

### Core Privacy (19 endpoints)
- **Stealth**: generate, derive, check, batch
- **Transfer**: shield, claim, private
- **Scan**: payments, batch, assets
- **Commitment**: create, verify, add, subtract, batch
- **Viewing Key**: generate, derive, verify, disclose, decrypt

### Advanced Features (52 endpoints)
- **Proofs**: Range proofs, funding proofs, validity proofs
- **Backends**: Privacy backend comparison (SIPNative, Arcium MPC, Inco FHE)
- **Governance**: Encrypted voting with homomorphic tally
- **Compliance**: Selective disclosure, audit reports
- **Sessions**: Agent session management
- **Billing**: Usage tracking, subscriptions

## Multi-Chain Support

| Chain Family | Chains | Curve | Key Size |
|--------------|--------|-------|----------|
| Solana | solana | ed25519 | 32 bytes |
| NEAR | near | ed25519 | 32 bytes |
| Move | aptos, sui | ed25519 | 32 bytes |
| EVM | ethereum, polygon, arbitrum, optimism, base | secp256k1 | 33 bytes |
| Cosmos | cosmos, osmosis, injective, celestia, sei, dydx | secp256k1 | 33 bytes |
| Bitcoin | bitcoin, zcash | secp256k1 | 33 bytes |

## Agent Workflow

Complete privacy flow:

```
1. Generate stealth meta-address     POST /v1/stealth/generate
        │
2. Share meta-address with sender    (off-chain)
        │
3. Derive one-time stealth address   POST /v1/stealth/derive
        │
4. Build shielded transfer           POST /v1/transfer/shield
        │
5. Sign + submit transaction         (Solana)
        │
6. Scan for incoming payments        POST /v1/scan/payments
        │
7. Claim to real wallet              POST /v1/transfer/claim
        │
8. Selective disclosure (if needed)  POST /v1/viewing-key/disclose
        │
9. Auditor decrypts                  POST /v1/viewing-key/decrypt
```

## Trust Model

| Endpoint | Server Sees | Server Does NOT See | Trust Level |
|----------|-------------|---------------------|-------------|
| /stealth/generate | chain param | Keys (generated & returned) | Low |
| /stealth/derive | Meta-address public keys | Recipient private keys | Low |
| /transfer/shield | Sender, meta-address, amount | Recipient private keys | Medium |
| /transfer/claim | Spending + viewing keys | — | Critical |
| /viewing-key/disclose | Viewing key + plaintext | — | High |

**Mitigations:**
- Stateless server (no key persistence)
- Audit log redaction (all private keys marked `[REDACTED]`)
- Zero-trust alternative: Use `@sip-protocol/sdk` directly
- Production agents should derive stealth keys client-side

## On-Chain Program

Sipher operations backed by deployed Solana Anchor program:

- **Program ID**: `S1PMFspo4W6BYKHWkHNF7kZ3fnqibEXg3LQjxepS9at`
- **Config PDA**: `BVawZkppFewygA5nxdrLma4ThKx8Th7bW4KTCkcWTZwZ`
- **Network**: Solana Mainnet-Beta
- **Features**: Transfer records (PDA), Pedersen commitments, viewing key hashes

## Integration Examples

### TypeScript SDK

```typescript
import { SipherClient } from '@sip-protocol/sipher-client';

const client = new SipherClient({
  apiKey: process.env.SIPHER_API_KEY,
  baseUrl: 'https://sipher.sip-protocol.org'
});

// Generate stealth meta-address
const metaAddress = await client.stealth.generate({ chain: 'solana' });

// Derive one-time address
const stealthAddress = await client.stealth.derive({
  recipientMetaAddress: metaAddress.data.metaAddress
});

// Build shielded transfer
const transfer = await client.transfer.shield({
  senderAddress: 'YourAddress',
  recipientMetaAddress: metaAddress.data.metaAddress,
  amount: '1000000000',
  mint: 'So11111111111111111111111111111111111111112'
});
```

### LangChain Tool

```typescript
import { StructuredTool } from 'langchain/tools';
import { z } from 'zod';

class SipherStealthGenerate extends StructuredTool {
  name = 'sipher_stealth_generate';
  description = 'Generate a stealth meta-address for private payments';
  schema = z.object({ chain: z.string().optional() });

  async _call({ chain }: { chain?: string }) {
    const res = await fetch('https://sipher.sip-protocol.org/v1/stealth/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.SIPHER_KEY!
      },
      body: JSON.stringify({ chain: chain || 'solana' })
    });
    return JSON.stringify((await res.json()).data.metaAddress);
  }
}
```

### OpenClaw Skill

Sipher provides OpenClaw-compatible skill file:

```bash
curl https://sipher.sip-protocol.org/skill.md
```

## Rate Limits & Pricing

| Tier | Requests/Hour | Daily Quota | Features |
|------|---------------|-------------|----------|
| Free | 100 | 1,000 ops | Basic endpoints |
| Pro | 10,000 | 100,000 ops | All endpoints + sessions |
| Enterprise | 100,000 | Unlimited | All + compliance + priority |

## Live Demo

Test all features without API key:

```bash
curl https://sipher.sip-protocol.org/v1/demo | jq '.data.summary'
```

Returns:
- 25 completed steps
- 35 endpoints exercised
- 37 cryptographic operations
- Real crypto (no mocks)

## Resources

- **Live API**: https://sipher.sip-protocol.org/
- **API Docs**: https://sipher.sip-protocol.org/docs
- **Skill File**: https://sipher.sip-protocol.org/skill.md
- **GitHub**: https://github.com/sip-protocol/sipher
- **SDK**: https://github.com/sip-protocol/sdk
- **Program**: [S1PMFspo4W6BYKHWkHNF7kZ3fnqibEXg3LQjxepS9at](https://solscan.io/account/S1PMFspo4W6BYKHWkHNF7kZ3fnqibEXg3LQjxepS9at)

## Next Steps

1. Get API key dari Sipher dashboard
2. Test dengan live demo endpoint
3. Integrate ke agent workflow kamu
4. Explore advanced features (governance, compliance)
5. Deploy production dengan enterprise tier

## Security Best Practices

1. **Never log private keys** - Use audit log redaction
2. **Derive keys client-side** - For maximum security
3. **Use viewing keys** - For compliance without exposing all data
4. **Rotate API keys** - Regularly update credentials
5. **Monitor usage** - Track quota and detect anomalies
6. **Test on devnet** - Before mainnet deployment

## Troubleshooting

### Common Issues

**Rate limit exceeded:**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 3600 seconds."
  }
}
```
Solution: Upgrade tier atau wait for reset

**Invalid API key:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key"
  }
}
```
Solution: Check `X-API-Key` header

**Chain not supported:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Unsupported chain"
  }
}
```
Solution: Use one of 17 supported chains

## Hands-On Exercise

### Exercise 1: Private Payment Flow

1. Generate stealth meta-address untuk recipient
2. Derive one-time stealth address
3. Build shielded transfer
4. Scan for incoming payments
5. Claim to real wallet

### Exercise 2: Compliance Workflow

1. Generate viewing key hierarchy
2. Encrypt transaction data
3. Disclose to auditor
4. Auditor decrypts with viewing key

### Exercise 3: Multi-Chain Stealth

1. Generate stealth addresses untuk 3 chains (Solana, Ethereum, NEAR)
2. Compare key formats
3. Test derivation untuk each chain

## Summary

Sipher memberikan privacy primitives untuk autonomous agents:
- ✅ 17-chain stealth addresses
- ✅ Homomorphic commitments
- ✅ Compliance viewing keys
- ✅ Production-grade crypto
- ✅ REST API + 4 SDKs
- ✅ On-chain Solana program

Privacy bukan optional untuk production agents - it's essential untuk competitive advantage dan user protection.
