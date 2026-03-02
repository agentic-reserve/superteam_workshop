# How to Index Solana Data

> Build, backfill, dan maintain Solana indexes untuk production applications

## Why Index Solana Data?

Solana blockchain menyimpan data secara sequential dan append-only. Bagus untuk integrity dan throughput, tapi sangat lambat untuk querying historical data.

### Real-World Problems

**Wallet Example:**
Query `getTokenAccountsByOwner` + `getTokenAccountBalance` untuk setiap token terlalu lambat. Wallet apps butuh instant response.

**Trading Example:**
Backtest trading algorithms butuh semua trading activity di specific pair (SOL-USDC). Direct blockchain query tidak praktis.

**PnL Calculation:**
Untuk calculate trader's profit/loss, kamu perlu:
- Find semua transactions dalam timeframe
- Filter swap transactions (buy/sell)
- Determine fees untuk setiap swap
- Get historical price data
- Aggregate total PnL

Semua ini real-time? Impossible. Dengan index, jadi single API call.

## What is Indexing?

Indexing = query data dari Solana → store di database (PostgreSQL, ClickHouse) → serve customer requests tanpa query blockchain directly.

### Indexer Workflow

1. **Backfill historical data** - Query semua historical data
2. **Stream new data** - Process new blocks real-time
3. **Parse and transform** - Extract relevant data
4. **Store in database** - Update index dengan new data

## Step 1: Get Historical Data

### Method 1: getTransactionsForAddress (Recommended)

```typescript
const response = await fetch(
  `https://mainnet.helius-rpc.com/?api-key=${API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "1",
      method: "getTransactionsForAddress",
      params: [
        "WALLET_ADDRESS",
        {
          transactionDetails: "full",
          sortOrder: "asc", // Chronological order
          limit: 100,
          filters: {
            blockTime: {
              gte: 1735689600, // Start time
              lte: 1738368000, // End time
            },
            status: "succeeded",
            tokenAccounts: "balanceChanged",
          },
        },
      ],
    }),
  }
);

const { result } = await response.json();

// Process and store in database
for (const tx of result.data) {
  await db.insertTransaction({
    signature: tx.transaction.signatures[0],
    slot: tx.slot,
    blockTime: tx.blockTime,
    // ... extract relevant data
  });
}

// Paginate for more data
if (result.paginationToken) {
  // Fetch next page with paginationToken
}
```

**Benefits:**
- ✅ Single call untuk full transaction details
- ✅ Time-based filtering
- ✅ Includes token account transactions
- ✅ Reverse search (chronological order)
- ✅ Efficient pagination

### Method 2: getSignaturesForAddress + getTransaction

```typescript
// Step 1: Get signatures
let before = null;
const allSignatures = [];

while (true) {
  const signatures = await connection.getSignaturesForAddress(
    address,
    { before, limit: 1000 }
  );
  
  if (signatures.length === 0) break;
  
  allSignatures.push(...signatures);
  before = signatures[signatures.length - 1].signature;
}

// Step 2: Get full transactions (1 call per signature!)
const transactions = await Promise.all(
  allSignatures.map(sig => 
    connection.getTransaction(sig.signature, {
      maxSupportedTransactionVersion: 0,
    })
  )
);
```

**Downsides:**
- ❌ Must start from newest (can't go chronological)
- ❌ One additional RPC call per transaction
- ❌ Doesn't include token account transactions
- ❌ More complex retry logic needed

### Method 3: getBlock

Untuk programs dengan high transaction volume (Pump.fun, Jupiter, Token program):

```typescript
// Convert time range to slots
const startSlot = await getSlotFromTime(startTime);
const endSlot = await getSlotFromTime(endTime);

// Fetch blocks sequentially
for (let slot = startSlot; slot <= endSlot; slot++) {
  const block = await connection.getBlock(slot, {
    maxSupportedTransactionVersion: 0,
  });
  
  if (!block) continue;
  
  // Filter relevant transactions
  for (const tx of block.transactions) {
    if (isRelevantTransaction(tx)) {
      await storeTransaction(tx);
    }
  }
}
```

**Use When:**
- High percentage of block transactions are relevant
- Indexing popular programs
- Address-based filtering tidak cukup

## Step 2: Store in Database

### Option 1: PostgreSQL (Recommended)

**Create Table:**
```sql
CREATE TABLE token_transfers (
  id BIGSERIAL PRIMARY KEY,
  slot BIGINT NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  signature BYTEA NOT NULL UNIQUE,
  token_mint BYTEA NOT NULL,
  source_address BYTEA NOT NULL,
  destination_address BYTEA NOT NULL,
  amount BIGINT NOT NULL,
  decimals SMALLINT NOT NULL,
  program_id BYTEA
);

-- Add indexes
CREATE INDEX idx_source_address ON token_transfers (source_address);
CREATE INDEX idx_destination_address ON token_transfers (destination_address);
CREATE INDEX idx_token_mint ON token_transfers (token_mint);
CREATE INDEX idx_timestamp ON token_transfers (timestamp);

-- Partial index for high-value transfers
CREATE INDEX idx_large_transfers 
ON token_transfers(amount) 
WHERE amount > 1000000;
```

**Insert Data:**
```typescript
// Bulk insert for performance
const values = transactions.map(tx => ({
  slot: tx.slot,
  timestamp: new Date(tx.blockTime * 1000),
  signature: Buffer.from(bs58.decode(tx.signature)),
  token_mint: Buffer.from(bs58.decode(tx.mint)),
  source_address: Buffer.from(bs58.decode(tx.source)),
  destination_address: Buffer.from(bs58.decode(tx.destination)),
  amount: tx.amount,
  decimals: tx.decimals,
}));

await db.insertMany('token_transfers', values);
```

### Option 2: ClickHouse (For Billions of Transactions)

**Create Table:**
```sql
CREATE TABLE token_transfers (
  block_time DateTime,
  slot UInt64,
  signature FixedString(64),
  token_mint FixedString(32),
  source_address FixedString(32),
  destination_address FixedString(32),
  amount UInt64,
  decimals UInt8,
  date Date DEFAULT toDate(block_time)
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (token_mint, date)
SETTINGS index_granularity = 8192;
```

**Query Example:**
```sql
SELECT 
  date,
  signature,
  source_address,
  destination_address,
  amount
FROM token_transfers
WHERE token_mint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
  AND block_time BETWEEN '2025-01-01' AND '2025-01-31'
ORDER BY block_time DESC
LIMIT 1000;
```

### Use Indexing Frameworks

**Carbon Framework:**
```typescript
import { Carbon } from "@sevenlabs/carbon";

const carbon = new Carbon({
  rpcUrl: "https://mainnet.helius-rpc.com/?api-key=YOUR_KEY",
  database: {
    type: "postgres",
    url: process.env.DATABASE_URL,
  },
});

// Define what to index
carbon.index({
  program: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  accounts: ["transfer"],
  handler: async (tx, account) => {
    await db.insertTransfer({
      signature: tx.signature,
      from: account.source,
      to: account.destination,
      amount: account.amount,
    });
  },
});

// Start indexing
await carbon.start();
```

## Step 3: Keep Index Updated

### Method 1: LaserStream gRPC (Recommended)

```typescript
import { LaserStreamClient } from "@helius-labs/laserstream";

const client = new LaserStreamClient({
  apiKey: "YOUR_API_KEY",
  network: "mainnet",
});

// Subscribe to token transfers
await client.subscribe({
  transactions: {
    transfers: {
      vote: false,
      failed: false,
      accountsInclude: [
        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
      ],
    },
  },
  commitment: "confirmed",
});

// Handle incoming transactions
client.on("transaction", async (tx) => {
  // Parse and store in database
  await processAndStoreTransaction(tx);
});

// Auto-reconnect and replay on disconnect
client.on("reconnect", () => {
  console.log("Reconnected, replaying missed transactions");
});
```

**Benefits:**
- ✅ 24-hour historical replay
- ✅ Automatic reconnection
- ✅ Node failover
- ✅ Ultra-low latency

### Method 2: Enhanced WebSockets

```typescript
const ws = new WebSocket(
  `wss://mainnet.helius-rpc.com/?api-key=${API_KEY}`
);

ws.on("open", () => {
  ws.send(
    JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "transactionSubscribe",
      params: [
        {
          failed: false,
          accountInclude: [
            "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          ],
        },
        {
          commitment: "confirmed",
          encoding: "jsonParsed",
          transactionDetails: "full",
          maxSupportedTransactionVersion: 0,
        },
      ],
    })
  );
});

ws.on("message", async (data) => {
  const message = JSON.parse(data);
  if (message.method === "transactionNotification") {
    await processTransaction(message.params.result);
  }
});

// Handle disconnections manually
ws.on("close", () => {
  console.log("Disconnected, need to backfill gap");
  // Implement gap detection and backfill
});
```

**Trade-offs:**
- ⚠️ No automatic replay
- ⚠️ Need manual gap detection
- ⚠️ Slower than LaserStream
- ✅ Lower cost

## Complete Indexing Example

```typescript
import { LaserStreamClient } from "@helius-labs/laserstream";
import { Pool } from "pg";

const db = new Pool({ connectionString: process.env.DATABASE_URL });
const heliusRpc = "https://mainnet.helius-rpc.com/?api-key=YOUR_KEY";

// Step 1: Backfill historical data
async function backfillHistory(address: string) {
  let paginationToken = null;
  let totalProcessed = 0;

  do {
    const response = await fetch(heliusRpc, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        method: "getTransactionsForAddress",
        params: [
          address,
          {
            transactionDetails: "full",
            sortOrder: "asc",
            limit: 100,
            filters: { status: "succeeded" },
            ...(paginationToken && { paginationToken }),
          },
        ],
      }),
    });

    const { result } = await response.json();

    // Bulk insert
    await insertTransactions(result.data);
    
    totalProcessed += result.data.length;
    paginationToken = result.paginationToken;
    
    console.log(`Processed ${totalProcessed} transactions`);
  } while (paginationToken);
}

// Step 2: Stream real-time updates
async function streamUpdates() {
  const client = new LaserStreamClient({
    apiKey: "YOUR_API_KEY",
    network: "mainnet",
  });

  await client.subscribe({
    transactions: {
      transfers: {
        vote: false,
        failed: false,
        accountsInclude: ["YOUR_PROGRAM_ID"],
      },
    },
    commitment: "confirmed",
  });

  client.on("transaction", async (tx) => {
    await insertTransaction(tx);
  });
}

// Step 3: Helper functions
async function insertTransactions(transactions: any[]) {
  const query = `
    INSERT INTO token_transfers 
    (slot, timestamp, signature, token_mint, source_address, destination_address, amount, decimals)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (signature) DO NOTHING
  `;

  for (const tx of transactions) {
    const parsed = parseTransaction(tx);
    await db.query(query, [
      parsed.slot,
      new Date(parsed.blockTime * 1000),
      parsed.signature,
      parsed.mint,
      parsed.source,
      parsed.destination,
      parsed.amount,
      parsed.decimals,
    ]);
  }
}

// Run indexer
async function main() {
  console.log("Starting backfill...");
  await backfillHistory("YOUR_ADDRESS");
  
  console.log("Starting real-time stream...");
  await streamUpdates();
}

main();
```

## Best Practices

### Performance
- Use bulk inserts (batch 100-1000 records)
- Add indexes on frequently queried columns
- Use prepared statements
- Consider connection pooling

### Reliability
- Implement retry logic with exponential backoff
- Monitor for gaps in data
- Use LaserStream for automatic replay
- Log all errors for debugging

### Monitoring
- Track indexing lag (current slot vs indexed slot)
- Monitor database size and query performance
- Alert on indexing failures
- Track API credit usage

### Cost Optimization
- Use `transactionDetails: "signatures"` when possible
- Filter aggressively to reduce data volume
- Cache frequently accessed data
- Use LaserStream instead of polling

## Resources

- **getTransactionsForAddress Docs**: https://docs.helius.dev/rpc/gettransactionsforaddress
- **LaserStream Guide**: https://docs.helius.dev/laserstream
- **Carbon Framework**: https://github.com/sevenlabs-hq/carbon
- **Helius Dashboard**: https://dashboard.helius.dev

Building robust Solana indexes is now easier than ever dengan Helius's state-of-the-art archival system dan LaserStream! 🚀
