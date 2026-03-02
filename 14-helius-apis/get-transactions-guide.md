# getTransactionsForAddress: Complete Guide

> Query Solana transaction history dengan advanced filtering, bidirectional sorting, dan efficient pagination

## Overview

`getTransactionsForAddress` adalah Helius-exclusive RPC method yang provides powerful transaction history queries. Method ini hanya available di Helius RPC nodes (bukan standard Solana RPC).

**Requirements:**
- Developer plan atau higher
- Cost: 100 credits per request
- Returns: 100 full transactions atau 1,000 signatures

## Key Features

### 1. Flexible Sorting
Sort chronologically (oldest first) atau reverse (newest first) - perfect untuk historical replay atau analytics.

### 2. Advanced Filtering
Filter by time ranges, slots, signatures, dan transaction status untuk precise queries.

### 3. Full Transaction Data
Get complete transaction details dalam one call - no need untuk additional `getTransaction` calls.

### 4. Token Accounts Support
Include transactions untuk associated token accounts (ATAs) - native RPC methods tidak support ini.

## Why Use This Instead of getSignaturesForAddress?

### Problem 1: Multiple API Calls

**Old Way (getSignaturesForAddress):**
```typescript
// Step 1: Get signatures (1 call)
const signatures = await connection.getSignaturesForAddress(address, { limit: 100 });

// Step 2: Get full transactions (100 additional calls!)
const transactions = await Promise.all(
  signatures.map(sig => connection.getTransaction(sig.signature))
);
```

**New Way (getTransactionsForAddress):**
```typescript
// One call gets everything
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
        address,
        {
          transactionDetails: "full",
          limit: 100,
        },
      ],
    }),
  }
);
```

### Problem 2: Token Account History

**Old Way - Query Every Token Account:**
```typescript
// Step 1: Get all token accounts
const tokenAccounts = await connection.getTokenAccountsByOwner(
  new PublicKey(walletAddress),
  { programId: TOKEN_PROGRAM_ID }
);

// Step 2: Fetch signatures for wallet
const walletSignatures = await connection.getSignaturesForAddress(
  new PublicKey(walletAddress),
  { limit: 1000 }
);

// Step 3: Fetch signatures for EVERY token account (painful!)
const tokenAccountSignatures = await Promise.all(
  tokenAccounts.value.map(async (account) => {
    return connection.getSignaturesForAddress(account.pubkey, { limit: 1000 });
  })
);

// Step 4: Merge all results
const allSignatures = [...walletSignatures, ...tokenAccountSignatures.flat()];

// Step 5: Deduplicate
const seen = new Set();
const uniqueSignatures = allSignatures.filter((sig) => {
  if (seen.has(sig.signature)) return false;
  seen.add(sig.signature);
  return true;
});

// Step 6: Sort chronologically
const sortedSignatures = uniqueSignatures.sort((a, b) => a.slot - b.slot);
```

**New Way - One Parameter:**
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
        walletAddress,
        {
          filters: {
            tokenAccounts: "all", // That's it!
          },
          sortOrder: "asc",
          limit: 100,
        },
      ],
    }),
  }
);
```

## Quick Start

### Basic Query

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
        "YOUR_ADDRESS_HERE",
        {
          transactionDetails: "full",
          sortOrder: "desc", // Newest first
          limit: 100,
        },
      ],
    }),
  }
);

const { result } = await response.json();
console.log("Transactions:", result.data);
```

### With Filters

```typescript
// Get successful transactions in January 2025
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
        "YOUR_ADDRESS_HERE",
        {
          transactionDetails: "full",
          sortOrder: "asc", // Chronological order
          limit: 100,
          filters: {
            blockTime: {
              gte: 1735689600, // Jan 1, 2025
              lte: 1738368000, // Jan 31, 2025
            },
            status: "succeeded",
            tokenAccounts: "balanceChanged",
          },
        },
      ],
    }),
  }
);
```

## Parameters

### Required Parameters

**address** (string)
- Base-58 encoded public key
- The account to query transaction history for

### Optional Parameters

**transactionDetails** (string, default: "signatures")
- `"signatures"`: Basic signature info (faster, up to 1000 results)
- `"full"`: Complete transaction data (up to 100 results)

**sortOrder** (string, default: "desc")
- `"desc"`: Newest first (default)
- `"asc"`: Oldest first (chronological)

**limit** (number)
- Up to 1000 when `transactionDetails: "signatures"`
- Up to 100 when `transactionDetails: "full"`

**paginationToken** (string)
- Token from previous response
- Format: `"slot:position"`

**commitment** (string, default: "finalized")
- `"finalized"` or `"confirmed"`
- `"processed"` is NOT supported

**encoding** (string)
- Only applies when `transactionDetails: "full"`
- Options: `"json"`, `"jsonParsed"`, `"base64"`, `"base58"`

**maxSupportedTransactionVersion** (number)
- Set to `0` to include versioned transactions
- Omit to only return legacy transactions

## Filters

### Comparison Operators

Use these operators untuk precise control over data range:

| Operator | Description | Example |
|----------|-------------|---------|
| `gte` | Greater than or equal | `slot: { gte: 100 }` |
| `gt` | Greater than | `blockTime: { gt: 1641081600 }` |
| `lte` | Less than or equal | `slot: { lte: 2000 }` |
| `lt` | Less than | `blockTime: { lt: 1641168000 }` |
| `eq` | Equal (blockTime only) | `blockTime: { eq: 1641081600 }` |

### Filter Types

**1. Slot Filter**
```typescript
"filters": {
  "slot": {
    "gte": 1000,
    "lte": 2000
  }
}
```

**2. BlockTime Filter**
```typescript
"filters": {
  "blockTime": {
    "gte": 1640995200, // Unix timestamp
    "lte": 1641081600
  }
}
```

**3. Signature Filter**
```typescript
"filters": {
  "signature": {
    "lt": "SIGNATURE_STRING"
  }
}
```

**4. Status Filter**
```typescript
"filters": {
  "status": "succeeded" // or "failed" or "any"
}
```

**5. Token Accounts Filter**
```typescript
"filters": {
  "tokenAccounts": "balanceChanged" // or "none" or "all"
}
```

### Token Accounts Filter Explained

**`none` (default)**
- Only transactions yang directly reference wallet address
- Use untuk direct wallet interactions only

**`balanceChanged` (recommended)**
- Transactions yang reference wallet OR modify token account balance
- Filters out spam dan unrelated operations
- Clean view of meaningful wallet activity

**`all`**
- All transactions yang reference wallet OR any token account owned by wallet
- Most comprehensive, tapi includes spam

**Important:** Token accounts filter tidak support transactions sebelum December 2022 (slot 111,491,819). Untuk legacy transactions, gunakan workaround di bawah.

## Common Use Cases

### 1. Token Launch Analysis

Find mint creation transaction:

```typescript
const response = await fetch(heliusRpc, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    jsonrpc: "2.0",
    id: "find-mint",
    method: "getTransactionsForAddress",
    params: [
      MINT_ADDRESS,
      {
        encoding: "jsonParsed",
        maxSupportedTransactionVersion: 0,
        sortOrder: "asc", // Chronological from beginning
        limit: 10,
        transactionDetails: "full",
      },
    ],
  }),
});

const { result } = await response.json();
const firstTx = result.data[0];
console.log("Token created at:", new Date(firstTx.blockTime * 1000));
console.log("Creator:", firstTx.transaction.message.accountKeys[0]);
```

### 2. Wallet Funding History

Find who funded a wallet:

```typescript
const response = await fetch(heliusRpc, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    jsonrpc: "2.0",
    id: "funding",
    method: "getTransactionsForAddress",
    params: [
      TARGET_WALLET,
      {
        transactionDetails: "full",
        sortOrder: "asc", // Oldest first
        limit: 10,
      },
    ],
  }),
});

const { result } = await response.json();

// Analyze balance changes
result.data.forEach((tx) => {
  const balanceChanges = tx.meta.preBalances.map(
    (pre, index) => tx.meta.postBalances[index] - pre
  );

  balanceChanges.forEach((change, index) => {
    if (change > 0) {
      const sender = tx.transaction.message.accountKeys[index];
      console.log(`Received ${change / 1e9} SOL from ${sender}`);
    }
  });
});
```

### 3. Monthly Transaction Report

Generate analytics untuk specific time period:

```typescript
const startTime = Math.floor(new Date("2025-01-01").getTime() / 1000);
const endTime = Math.floor(new Date("2025-02-01").getTime() / 1000);

const response = await fetch(heliusRpc, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    jsonrpc: "2.0",
    id: "monthly-report",
    method: "getTransactionsForAddress",
    params: [
      WALLET_ADDRESS,
      {
        transactionDetails: "signatures",
        filters: {
          blockTime: {
            gte: startTime,
            lt: endTime,
          },
          status: "succeeded",
        },
        limit: 1000,
      },
    ],
  }),
});

const { result } = await response.json();

// Calculate daily stats
const dailyStats = {};
result.data.forEach((tx) => {
  const date = new Date(tx.blockTime * 1000).toISOString().split("T")[0];
  dailyStats[date] = (dailyStats[date] || 0) + 1;
});

console.log("Daily Transaction Counts:", dailyStats);
```

### 4. Liquidity Pool Creation

Find pool creation transaction:

```typescript
const response = await fetch(heliusRpc, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    jsonrpc: "2.0",
    id: "pool-creation",
    method: "getTransactionsForAddress",
    params: [
      POOL_ADDRESS, // Raydium/Meteora pool address
      {
        transactionDetails: "full",
        sortOrder: "asc", // First transaction is usually creation
        limit: 1,
      },
    ],
  }),
});

const { result } = await response.json();
const creationTx = result.data[0];
console.log("Pool created:", creationTx);
```

## Pagination

### Basic Pagination

```typescript
let paginationToken = null;
let allTransactions = [];

do {
  const params = [
    ADDRESS,
    {
      transactionDetails: "signatures",
      limit: 1000,
      ...(paginationToken && { paginationToken }),
    },
  ];

  const response = await fetch(heliusRpc, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "1",
      method: "getTransactionsForAddress",
      params,
    }),
  });

  const { result } = await response.json();
  allTransactions.push(...result.data);
  paginationToken = result.paginationToken;

  console.log(
    `Fetched ${result.data.length} transactions, total: ${allTransactions.length}`
  );
} while (paginationToken);

console.log("Total transactions:", allTransactions.length);
```

### Multiple Addresses

Query multiple addresses dan merge results:

```typescript
const addresses = ["Address1...", "Address2...", "Address3..."];

// Query all addresses in parallel
const results = await Promise.all(
  addresses.map((address) =>
    fetch(heliusRpc, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        method: "getTransactionsForAddress",
        params: [
          address,
          {
            sortOrder: "desc",
            filters: { slot: { gt: 250000000 } },
          },
        ],
      }),
    }).then((r) => r.json())
  )
);

// Merge and sort by slot
const allTransactions = results
  .flatMap((r) => r.result.data)
  .sort((a, b) => b.slot - a.slot);

console.log("Combined transactions:", allTransactions.length);
```

**Note:** Each address query counts as separate API request (100 credits per address).

## Response Format

### Signatures Response

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "result": {
    "data": [
      {
        "signature": "5h6xBEauJ3PK6SWCZ1PGjBvj8vDdWG3KpwATGy1ARAXFSDwt8GFXM7W5Ncn16wmqokgpiKRLuS83KUxyZyv2sUYv",
        "slot": 1054,
        "transactionIndex": 42,
        "err": null,
        "memo": null,
        "blockTime": 1641038400,
        "confirmationStatus": "finalized"
      }
    ],
    "paginationToken": "1055:5"
  }
}
```

### Full Transaction Response

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "result": {
    "data": [
      {
        "slot": 1054,
        "transactionIndex": 42,
        "blockTime": 1641038400,
        "transaction": {
          "signatures": ["5h6xBEauJ3PK6SWCZ1PGjBvj8vDdWG3KpwATGy1ARAXFSDwt8GFXM7W5Ncn16wmqokgpiKRLuS83KUxyZyv2sUYv"],
          "message": {
            "accountKeys": ["...", "..."],
            "instructions": []
          }
        },
        "meta": {
          "fee": 5000,
          "preBalances": [1000000, 2000000],
          "postBalances": [999995000, 2000000]
        }
      }
    ],
    "paginationToken": "1055:5"
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `signature` | string | Transaction signature (signatures mode only) |
| `slot` | number | Slot containing the block |
| `transactionIndex` | number | Zero-based index within block (exclusive to this method) |
| `blockTime` | number \| null | Unix timestamp |
| `err` | object \| null | Error if failed (signatures mode only) |
| `memo` | string \| null | Transaction memo (signatures mode only) |
| `confirmationStatus` | string | Confirmation status (signatures mode only) |
| `transaction` | object | Full transaction data (full mode only) |
| `meta` | object | Transaction metadata (full mode only) |
| `paginationToken` | string \| null | Token for next page |

**Note:** `transactionIndex` field is exclusive to `getTransactionsForAddress`. Other methods seperti `getSignaturesForAddress` dan `getTransaction` tidak include field ini.

## Best Practices

### Performance

1. **Use signatures mode when possible:**
```typescript
// Faster - only get signatures
transactionDetails: "signatures"

// Slower - full transaction data
transactionDetails: "full"
```

2. **Implement reasonable page sizes:**
```typescript
// Good for signatures
limit: 1000

// Good for full transactions
limit: 100
```

3. **Filter by time ranges:**
```typescript
filters: {
  blockTime: {
    gte: startTime,
    lte: endTime
  }
}
```

### Filtering Strategy

1. **Start broad, narrow down:**
```typescript
// First: Get all transactions
// Then: Filter by status
// Finally: Filter by time range
```

2. **Combine filters for precision:**
```typescript
filters: {
  blockTime: { gte: startTime, lte: endTime },
  status: "succeeded",
  tokenAccounts: "balanceChanged"
}
```

### Error Handling

```typescript
async function fetchWithRetry(params, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(heliusRpc, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "1",
          method: "getTransactionsForAddress",
          params,
        }),
      });

      if (response.status === 429) {
        // Rate limited - wait and retry
        await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
        continue;
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      return data.result;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
}
```

## Limitations & Workarounds

### Unsupported Addresses

Some system addresses have limited support:

**Routed to old archival:**
- Stake Program
- Stake Config
- Sysvar Owner
- Address Lookup Table
- BPF Loader Upgradeable

**Slot-scan fallback (max 100 slots):**
- System Program
- Compute Budget
- Memo Program
- Vote Program

**Not indexed (returns empty):**
- BPF Loader (deprecated)
- Config Program
- Ed25519 Program
- Feature Program
- Native Loader
- Various Sysvars

### Historical Token Accounts (Pre-December 2022)

Token accounts filter tidak work untuk transactions sebelum slot 111,491,819. Workaround:

```typescript
const OWNER_CUTOFF_SLOT = 111_491_819;

// Discover historical token accounts by parsing instructions
async function discoverHistoricalTokenAccounts(address) {
  const tokenAccounts = new Set();
  let paginationToken = null;

  do {
    const result = await rpcCall("getTransactionsForAddress", [
      address,
      {
        transactionDetails: "full",
        encoding: "jsonParsed",
        maxSupportedTransactionVersion: 0,
        sortOrder: "asc",
        limit: 100,
        filters: { slot: { lt: OWNER_CUTOFF_SLOT } },
        ...(paginationToken && { paginationToken }),
      },
    ]);

    if (!result?.data?.length) break;

    for (const entry of result.data) {
      const allInstructions = [
        ...(entry.transaction.message?.instructions ?? []),
        ...(entry.meta.innerInstructions ?? []).flatMap(
          (inner) => inner.instructions ?? []
        ),
      ];

      for (const ix of allInstructions) {
        // Check for token account creation
        if (ix.program === "spl-associated-token-account") {
          if (
            ix.parsed?.type === "create" &&
            ix.parsed.info?.wallet === address &&
            ix.parsed.info?.account
          ) {
            tokenAccounts.add(ix.parsed.info.account);
          }
        }

        // Check for token account initialization
        if (ix.program === "spl-token" || ix.program === "spl-token-2022") {
          const type = ix.parsed?.type;
          const info = ix.parsed?.info;

          if (
            (type === "initializeAccount" ||
              type === "initializeAccount2" ||
              type === "initializeAccount3") &&
            info?.owner === address &&
            info?.account
          ) {
            tokenAccounts.add(info.account);
          }
        }
      }
    }

    paginationToken = result.paginationToken;
  } while (paginationToken);

  return Array.from(tokenAccounts);
}

// Then query each discovered account
const historicalAccounts = await discoverHistoricalTokenAccounts(address);
const results = await Promise.all([
  fetchAllSignatures(address, { tokenAccounts: "all" }),
  ...historicalAccounts.map((addr) => fetchAllSignatures(addr)),
]);

// Merge and deduplicate
const seen = new Set();
const merged = [];
for (const batch of results) {
  for (const tx of batch) {
    if (!seen.has(tx.signature)) {
      seen.add(tx.signature);
      merged.push(tx);
    }
  }
}
```

## Network Support

| Network | Supported | Retention Period |
|---------|-----------|------------------|
| Mainnet | ✅ Yes | Unlimited |
| Devnet | ✅ Yes | 2 weeks |
| Testnet | ❌ No | N/A |

## Cost & Credits

- **Cost:** 100 credits per request
- **Returns:** 100 full transactions OR 1,000 signatures
- **Plan Required:** Developer plan atau higher

## Resources

- **API Reference:** https://docs.helius.dev/api-reference/rpc/http/gettransactionsforaddress
- **Dashboard:** https://dashboard.helius.dev
- **Discord:** https://discord.com/invite/6GXdee3gBj

Method ini adalah game-changer untuk querying Solana transaction history. Dengan advanced filtering, flexible sorting, dan token accounts support, kamu bisa build powerful analytics dan indexing systems dengan ease! 🚀
