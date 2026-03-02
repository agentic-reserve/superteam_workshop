# Helius: Solana Developer Platform

> RPCs, APIs, dan developer tools untuk building on Solana

## Apa itu Helius?

Helius adalah developer platform terlengkap untuk Solana. Menyediakan:
- **Fast RPC nodes** dengan staked connections
- **Comprehensive APIs** untuk NFTs, tokens, transactions
- **Real-time streaming** via WebSockets dan gRPC
- **Developer tools** untuk monitoring dan analytics

## Quick Start

### 1. Sign Up & Get API Key

```bash
# Visit dashboard
https://dashboard.helius.dev

# Or use CLI for programmatic signup (AI agents)
npm install -g helius-cli
helius keygen
# Fund wallet with 1 USDC + 0.001 SOL
helius signup --json
```

### 2. RPC Endpoints

```typescript
// Mainnet
const connection = new Connection(
  "https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY"
);

// Devnet
const devConnection = new Connection(
  "https://devnet.helius-rpc.com/?api-key=YOUR_API_KEY"
);

// WebSocket
const ws = new WebSocket(
  "wss://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY"
);
```

## Core APIs

### 1. DAS API (Digital Asset Standard)

Unified interface untuk semua Solana digital assets: NFTs, compressed NFTs, fungible tokens.

**Get Wallet's NFTs & Tokens:**
```typescript
const response = await fetch(
  `https://mainnet.helius-rpc.com/?api-key=${API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "1",
      method: "getAssetsByOwner",
      params: {
        ownerAddress: "86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY",
        page: 1,
        limit: 100,
        displayOptions: {
          showFungible: true, // Include tokens
        },
      },
    }),
  }
);

const { result } = await response.json();
console.log("Assets:", result.items);
```

**Search NFTs by Collection:**
```typescript
const response = await fetch(
  `https://mainnet.helius-rpc.com/?api-key=${API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "1",
      method: "searchAssets",
      params: {
        grouping: ["collection", "COLLECTION_ADDRESS"],
        page: 1,
        limit: 100,
      },
    }),
  }
);
```

### 2. Enhanced Transactions API

Parsed, human-readable transaction data dengan automatic labeling.

```typescript
const response = await fetch(
  `https://api.helius.xyz/v0/addresses/${WALLET_ADDRESS}/transactions?api-key=${API_KEY}`
);

const transactions = await response.json();

// Each transaction includes:
// - type: "SWAP", "NFT_SALE", "TRANSFER", etc.
// - description: Human-readable description
// - tokenTransfers: All token movements
// - nativeTransfers: SOL transfers
// - accountData: Involved accounts
```

### 3. Priority Fee API

Optimal priority fee estimation untuk transaction landing.

```typescript
const response = await fetch(
  `https://mainnet.helius-rpc.com/?api-key=${API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "1",
      method: "getPriorityFeeEstimate",
      params: [
        {
          accountKeys: ["JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"],
          options: {
            recommended: true,
          },
        },
      ],
    }),
  }
);

const { result } = await response.json();
const priorityFee = result.priorityFeeEstimate;

// Add to transaction
transaction.add(
  ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: priorityFee,
  })
);
```

### 4. Webhooks

Real-time HTTP POST notifications untuk blockchain events.

**Create Webhook:**
```typescript
const response = await fetch(
  `https://api.helius.xyz/v0/webhooks?api-key=${API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      webhookURL: "https://your-server.com/webhook",
      transactionTypes: ["NFT_SALE", "SWAP"],
      accountAddresses: ["YOUR_WALLET_ADDRESS"],
      webhookType: "enhanced",
    }),
  }
);
```

**Receive Webhook:**
```typescript
// Express.js example
app.post("/webhook", (req, res) => {
  const events = req.body;
  
  events.forEach((event) => {
    console.log("Type:", event.type);
    console.log("Description:", event.description);
    console.log("Signature:", event.signature);
    
    // Process event
    if (event.type === "NFT_SALE") {
      notifyUser(`NFT sold for ${event.nativeTransfers[0].amount} SOL`);
    }
  });
  
  res.sendStatus(200);
});
```

### 5. Helius Sender

Ultra low latency transaction submission service.

```typescript
import { Connection } from "@solana/web3.js";

// Use Helius Sender endpoint
const connection = new Connection(
  "https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY"
);

// Transactions automatically routed through:
// 1. Staked connections (via Solana's largest validator)
// 2. Jito bundles (for MEV protection)

const signature = await connection.sendTransaction(transaction, [payer], {
  skipPreflight: false,
  preflightCommitment: "confirmed",
});
```

### 6. WebSockets (Enhanced)

Real-time streaming dengan advanced filtering.

```typescript
const ws = new WebSocket(
  `wss://mainnet.helius-rpc.com/?api-key=${API_KEY}`
);

ws.on("open", () => {
  // Subscribe to account changes
  ws.send(
    JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "transactionSubscribe",
      params: [
        {
          accountInclude: ["WALLET_ADDRESS"],
          accountRequired: ["WALLET_ADDRESS"],
        },
        {
          commitment: "confirmed",
          encoding: "jsonParsed",
          transactionDetails: "full",
          showRewards: false,
          maxSupportedTransactionVersion: 0,
        },
      ],
    })
  );
});

ws.on("message", (data) => {
  const message = JSON.parse(data);
  console.log("Transaction:", message);
});
```

## Common Use Cases

### Trading Bot

```typescript
// 1. Get priority fee
const feeEstimate = await getPriorityFeeEstimate(accounts);

// 2. Build transaction with priority fee
transaction.add(
  ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: feeEstimate,
  })
);

// 3. Send via Helius Sender (staked + Jito)
const sig = await connection.sendTransaction(tx, [payer]);

// 4. Monitor with LaserStream for real-time updates
```

### Wallet App

```typescript
// Get all assets (NFTs + tokens)
const assets = await getAssetsByOwner(walletAddress, {
  showFungible: true,
});

// Get transaction history with token accounts
const history = await fetch(
  `https://api.helius.xyz/v0/addresses/${walletAddress}/transactions?api-key=${API_KEY}`
);

// Subscribe to real-time updates
ws.send(
  JSON.stringify({
    method: "transactionSubscribe",
    params: [{ accountInclude: [walletAddress] }],
  })
);
```

### NFT Marketplace

```typescript
// Search NFTs by collection
const nfts = await searchAssets({
  grouping: ["collection", collectionAddress],
  page: 1,
  limit: 100,
});

// Track sales with webhooks
await createWebhook({
  webhookURL: "https://your-api.com/webhook",
  transactionTypes: ["NFT_SALE", "NFT_LISTING"],
  accountAddresses: [collectionAddress],
});
```

### Token Launcher

```typescript
// 1. Create token with Token Extensions
const mint = await createMint(connection, payer, authority, null, 9);

// 2. Send via Helius Sender for fast landing
const sig = await connection.sendTransaction(createTx, [payer]);

// 3. Monitor with webhook
await createWebhook({
  webhookURL: "https://your-api.com/webhook",
  accountAddresses: [mint.toBase58()],
  transactionTypes: ["TRANSFER"],
});
```

## API Comparison

| Need | Use This | NOT This | Why |
|------|----------|----------|-----|
| Get wallet NFTs/tokens | `getAssetsByOwner` (DAS) | `getTokenAccountsByOwner` | DAS returns metadata, not just raw accounts |
| Complete tx history | `getTransactionsForAddress` | `getSignaturesForAddress` | Includes token accounts |
| cNFT history | `getSignaturesForAsset` (DAS) | `getSignaturesForAddress` | Works for compressed NFTs |
| Real-time data | LaserStream gRPC | Polling | Lower latency, efficient |
| Send transactions | Helius Sender | Standard `sendTransaction` | Dual routes (staked + Jito) |
| Priority fees | `getPriorityFeeEstimate` | `getRecentPrioritizationFees` | No manual calculation |
| Search NFTs | `searchAssets` (DAS) | `getProgramAccounts` | Faster, indexed |

## Key Concepts

| Term | Definition |
|------|------------|
| **DAS** | Digital Asset Standard - unified API for all Solana assets |
| **cNFT** | Compressed NFT - 1000x cheaper to mint |
| **Helius Sender** | Transaction service with staked connections + Jito |
| **LaserStream** | Managed gRPC streaming with historical replay |
| **Priority Fee** | Additional fee to prioritize transaction inclusion |
| **Staked Connections** | Direct validator connections via stake-weighted routing |

## SDKs

### Node.js SDK

```bash
npm install helius-sdk
```

```typescript
import { Helius } from "helius-sdk";

const helius = new Helius("YOUR_API_KEY");

// Get assets
const assets = await helius.rpc.getAssetsByOwner({
  ownerAddress: "86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY",
  page: 1,
});

// Get transaction history
const transactions = await helius.rpc.getTransactionsForAddress({
  address: "86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY",
});

// Create webhook
const webhook = await helius.createWebhook({
  webhookURL: "https://your-server.com/webhook",
  transactionTypes: ["SWAP"],
  accountAddresses: ["YOUR_ADDRESS"],
});
```

### Rust SDK

```bash
cargo add helius
```

```rust
use helius::Helius;
use helius::types::*;

#[tokio::main]
async fn main() {
    let api_key = "YOUR_API_KEY";
    let helius = Helius::new(api_key, Cluster::MainnetBeta).unwrap();

    // Get assets
    let request = GetAssetsByOwner {
        owner_address: "86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY".to_string(),
        page: Some(1),
        limit: Some(100),
        ..Default::default()
    };
    
    let response = helius.rpc().get_assets_by_owner(request).await.unwrap();
    println!("Assets: {:?}", response.items);
}
```

## Best Practices

### 1. Use Staked Connections

Semua paid plans include staked connections by default. Transactions automatically routed through Solana's largest validator.

### 2. Implement Priority Fees

```typescript
// Always get fresh priority fee estimate
const fee = await getPriorityFeeEstimate(accountKeys);

// Add to transaction
transaction.add(
  ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: fee,
  })
);
```

### 3. Handle Webhooks Properly

```typescript
// Verify webhook signature (recommended)
const crypto = require("crypto");

function verifyWebhook(payload, signature, secret) {
  const hash = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(payload))
    .digest("hex");
  
  return hash === signature;
}

app.post("/webhook", (req, res) => {
  const signature = req.headers["x-helius-signature"];
  
  if (!verifyWebhook(req.body, signature, WEBHOOK_SECRET)) {
    return res.status(401).send("Invalid signature");
  }
  
  // Process webhook
  res.sendStatus(200);
});
```

### 4. Use Commitment Levels Wisely

| Commitment | Speed | Finality | Use Case |
|------------|-------|----------|----------|
| `processed` | Fastest | May revert | UI updates |
| `confirmed` | Fast | ~99.9% final | Most operations |
| `finalized` | Slowest | 100% final | Critical operations |

## Pricing

- **Free Tier**: 100K credits/month
- **Developer**: $49/month - 1M credits
- **Professional**: $249/month - 10M credits
- **Business**: $999/month - 50M credits
- **Enterprise**: Custom pricing

**Credits Usage:**
- Standard RPC call: 1 credit
- DAS API call: 100 credits
- Enhanced transaction: 100 credits
- Webhook delivery: 1 credit

## Advanced Topics

### Indexing Solana Data

Untuk production applications yang butuh query historical data dengan cepat, kamu perlu build custom indexes. Pelajari cara backfill, stream, dan maintain Solana indexes:

📖 **[Complete Indexing Guide](./indexing-guide.md)** - Build production-ready Solana indexes dengan Helius

Topics covered:
- Why index Solana data (wallet, trading, PnL examples)
- Three methods untuk get historical data
- Database storage (PostgreSQL, ClickHouse)
- Real-time streaming dengan LaserStream
- Complete working examples
- Best practices untuk performance dan reliability

## Resources

- **Dashboard**: https://dashboard.helius.dev
- **Documentation**: https://docs.helius.dev
- **Status**: https://helius.statuspage.io
- **Discord**: https://discord.com/invite/6GXdee3gBj
- **GitHub**: https://github.com/helius-labs

## Troubleshooting

### Rate Limits

```typescript
// Handle rate limit errors
try {
  const response = await fetch(rpcUrl, options);
  
  if (response.status === 429) {
    // Rate limited - wait and retry
    await new Promise(r => setTimeout(r, 1000));
    return retry();
  }
} catch (error) {
  console.error("Request failed:", error);
}
```

### Blockhash Errors

```typescript
// Get fresh blockhash
const { blockhash, lastValidBlockHeight } = 
  await connection.getLatestBlockhash("finalized");

transaction.recentBlockhash = blockhash;
transaction.lastValidBlockHeight = lastValidBlockHeight;

// Send immediately
await connection.sendTransaction(transaction, [payer]);
```

### Transaction Not Landing

```typescript
// 1. Use priority fees
const fee = await getPriorityFeeEstimate(accounts);
transaction.add(
  ComputeBudgetProgram.setComputeUnitPrice({ microLamports: fee })
);

// 2. Use Helius Sender (automatic)
const sig = await connection.sendTransaction(tx, [payer]);

// 3. Confirm with proper commitment
await connection.confirmTransaction({
  signature: sig,
  blockhash,
  lastValidBlockHeight,
}, "confirmed");
```

## Next Steps

1. ✅ Sign up di https://dashboard.helius.dev
2. ✅ Get API key
3. ✅ Install SDK (`npm install helius-sdk`)
4. ✅ Build wallet viewer dengan DAS API
5. ✅ Add webhooks untuk real-time notifications
6. ✅ Implement priority fees untuk better landing rates
7. ✅ Use Helius Sender untuk production

Helius adalah must-have infrastructure untuk serious Solana development. Fast, reliable, dan comprehensive APIs yang trusted by leading Solana projects! 🚀
