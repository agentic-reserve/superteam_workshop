# MagicBlock: Ephemeral Rollups untuk Solana

> High-performance Solana execution dengan sub-10ms latency dan gasless transactions

## Apa itu MagicBlock?

MagicBlock Ephemeral Rollups (ER) adalah specialized SVM runtime yang meningkatkan performa Solana untuk aplikasi real-time seperti games, trading bots, dan interactive dApps.

### Keunggulan Utama

- **Sub-10ms latency** (vs ~400ms di base Solana)
- **Gasless transactions** untuk UX yang seamless
- **Full composability** dengan existing Solana programs
- **Horizontal scaling** via on-demand rollups

## Kapan Menggunakan MagicBlock?

Gunakan MagicBlock untuk:
- 🎮 **Real-time games** - Multiplayer games yang butuh response cepat
- 📈 **High-frequency trading** - Trading bots dengan latency rendah
- 🎨 **Interactive NFTs** - NFTs yang berubah berdasarkan user interaction
- 💬 **Chat applications** - Messaging apps on-chain
- 🎲 **Gambling/Casino** - Games yang butuh fast randomness

## Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│                      Your Application                        │
├─────────────────────────────────────────────────────────────┤
│  Base Layer (Solana)          │  Ephemeral Rollup (ER)      │
│  - Initialize accounts        │  - Execute operations       │
│  - Delegate accounts          │  - Process at ~10-50ms      │
│  - Final state commits        │  - Zero gas fees            │
│  - ~400ms finality            │  - Commit state to Solana   │
└─────────────────────────────────────────────────────────────┘
```

### Flow Lifecycle

1. **Initialize** - Buat accounts di Solana base layer
2. **Delegate** - Transfer ownership ke delegation program
3. **Execute** - Jalankan fast operations di Ephemeral Rollup
4. **Commit** - Sync state kembali ke base layer
5. **Undelegate** - Return ownership ke program kamu

## Quick Start

### Prerequisites

```bash
# Required versions
Solana: 2.3.13
Rust: 1.85.0
Anchor: 0.32.1
Node: 24.10.0

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor anchor-cli
```

### 1. Setup Rust Program

**Cargo.toml:**
```toml
[dependencies]
anchor-lang = "0.32.1"
ephemeral-rollups-sdk = { 
  version = "0.6.5", 
  features = ["anchor", "disable-realloc"] 
}
```

**lib.rs:**
```rust
use anchor_lang::prelude::*;
use ephemeral_rollups_sdk::anchor::{delegate_account, ephemeral};
use ephemeral_rollups_sdk::cpi::DelegationProgram;

declare_id!("YourProgramId111111111111111111111111111111");

#[ephemeral]  // Enable ER support
#[program]
pub mod my_game {
    use super::*;

    // Initialize on base layer
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.game.score = 0;
        ctx.accounts.game.player = ctx.accounts.payer.key();
        Ok(())
    }

    // Delegate to ER
    #[delegate]  // Auto-injects delegation accounts
    pub fn delegate(ctx: Context<Delegate>) -> Result<()> {
        Ok(())
    }

    // Fast operations on ER
    pub fn increment_score(ctx: Context<Update>) -> Result<()> {
        ctx.accounts.game.score += 1;
        Ok(())
    }

    // Commit and undelegate
    #[commit]  // Auto-injects commit accounts
    pub fn undelegate(ctx: Context<Undelegate>) -> Result<()> {
        Ok(())
    }
}

#[account]
pub struct GameState {
    pub player: Pubkey,
    pub score: u64,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = payer, space = 8 + 32 + 8)]
    pub game: Account<'info, GameState>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Delegate<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: Will be delegated
    #[account(mut, del)]  // 'del' marks for delegation
    pub game: AccountInfo<'info>,
    pub delegation_program: Program<'info, DelegationProgram>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub game: Account<'info, GameState>,
}

#[derive(Accounts)]
pub struct Undelegate<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: Will be undelegated
    #[account(mut)]
    pub game: AccountInfo<'info>,
    /// CHECK: Magic context
    pub magic_context: AccountInfo<'info>,
    /// CHECK: Magic program
    pub magic_program: AccountInfo<'info>,
}
```

### 2. Setup TypeScript Client

```typescript
import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { DELEGATION_PROGRAM_ID } from "@magicblock-labs/ephemeral-rollups-sdk";

// CRITICAL: Separate connections!
const baseConnection = new Connection("https://api.devnet.solana.com");
const erConnection = new Connection("https://devnet.magicblock.app");

// Create providers
const baseProvider = new AnchorProvider(baseConnection, wallet, {
  commitment: "confirmed",
});

const erProvider = new AnchorProvider(erConnection, wallet, {
  commitment: "confirmed",
  skipPreflight: true,  // Required for ER!
});

// Load programs
const baseProgram = new Program(idl, baseProvider);
const erProgram = new Program(idl, erProvider);

// Check if account is delegated
async function isDelegated(pubkey: PublicKey): Promise<boolean> {
  const info = await baseConnection.getAccountInfo(pubkey);
  return info?.owner.equals(DELEGATION_PROGRAM_ID) ?? false;
}
```

### 3. Complete Flow Example

```typescript
// 1. Initialize on base layer
const [gamePda] = PublicKey.findProgramAddressSync(
  [Buffer.from("game"), wallet.publicKey.toBuffer()],
  programId
);

await baseProgram.methods
  .initialize()
  .accounts({
    game: gamePda,
    payer: wallet.publicKey,
  })
  .rpc();

console.log("✅ Game initialized on base layer");

// 2. Delegate to ER
await baseProgram.methods
  .delegate()
  .accounts({
    game: gamePda,
    payer: wallet.publicKey,
  })
  .rpc();

// Wait for delegation to propagate
await new Promise(r => setTimeout(r, 3000));

if (await isDelegated(gamePda)) {
  console.log("✅ Game delegated to ER");
}

// 3. Fast operations on ER
for (let i = 0; i < 10; i++) {
  await erProgram.methods
    .incrementScore()
    .accounts({ game: gamePda })
    .rpc({ skipPreflight: true });
  
  console.log(`⚡ Score incremented (${i + 1}/10)`);
}

// 4. Undelegate and commit
await erProgram.methods
  .undelegate()
  .accounts({
    game: gamePda,
    payer: wallet.publicKey,
  })
  .rpc({ skipPreflight: true });

// Wait for state to sync
await new Promise(r => setTimeout(r, 5000));

// 5. Read final state from base layer
const gameState = await baseProgram.account.gameState.fetch(gamePda);
console.log("🎮 Final score:", gameState.score.toString());
```

## Key Concepts

### Delegation

Delegation mentransfer PDA ownership ke delegation program, memungkinkan Ephemeral Validator untuk process transactions.

**Penting:**
- Hanya PDA yang bisa di-delegate
- Account harus exist sebelum delegation
- Delegation bisa di-set expiry time

### Commit

Commit mengupdate PDA state dari ER ke base layer tanpa undelegate. Berguna untuk periodic snapshots.

```rust
use ephemeral_rollups_sdk::anchor::commit_accounts;

pub fn commit(ctx: Context<Commit>) -> Result<()> {
    commit_accounts(
        &ctx.accounts.payer,
        vec![&ctx.accounts.game.to_account_info()],
        &ctx.accounts.magic_context,
        &ctx.accounts.magic_program,
    )?;
    Ok(())
}
```

### Undelegation

Undelegation mengembalikan PDA ownership ke program kamu sambil commit final state.

## ER Validators (Devnet)

| Region | Endpoint |
|--------|----------|
| Asia | `https://devnet-asia.magicblock.app` |
| EU | `https://devnet-eu.magicblock.app` |
| US | `https://devnet-us.magicblock.app` |
| **Router** (auto-select) | `https://devnet-router.magicblock.app` |

**Recommendation:** Gunakan router untuk auto-failover.

## Critical Rules

### ✅ DO:
- Maintain separate connections untuk base layer dan ER
- Use `skipPreflight: true` untuk semua ER transactions
- Verify delegation status sebelum send ke ER
- Use `AccountInfo` untuk delegated accounts di Rust
- Match PDA seeds exactly antara Rust dan TypeScript

### ❌ DON'T:
- Send delegated account operations ke base layer
- Mix base layer dan ER operations dalam single transaction
- Assume account ownership tanpa checking
- Skip commitment verification sebelum base layer reads

## Advanced Features

### VRF (Verifiable Random Function)

Untuk games yang butuh provably fair randomness:

```rust
use ephemeral_vrf_sdk::anchor::{vrf, VrfResult};

#[vrf]
#[ephemeral]
#[program]
pub mod dice_game {
    pub fn roll_dice(ctx: Context<RollDice>) -> Result<()> {
        // Request randomness
        Ok(())
    }

    // Callback receives random result
    pub fn roll_dice_callback(
        ctx: Context<DiceCallback>, 
        result: VrfResult
    ) -> Result<()> {
        let randomness = result.randomness; // [u8; 32]
        let dice_roll = (randomness[0] % 6) + 1;
        ctx.accounts.game.last_roll = dice_roll;
        Ok(())
    }
}
```

### Crank (Scheduled Tasks)

Untuk automated game loops atau periodic updates:

```rust
use ephemeral_rollups_sdk::cpi::schedule_crank_instruction;

pub fn start_game_loop(ctx: Context<StartLoop>) -> Result<()> {
    schedule_crank_instruction(
        &ctx.accounts.payer,
        &ctx.accounts.game.to_account_info(),
        &ctx.accounts.magic_program,
        "game_tick",  // Function to call
        100,  // Every 100ms
    )?;
    Ok(())
}

pub fn game_tick(ctx: Context<GameTick>) -> Result<()> {
    // Called automatically every 100ms
    ctx.accounts.game.tick_count += 1;
    Ok(())
}
```

## Common Patterns

### Game Session Management

```typescript
class GameSession {
  async start(playerPda: PublicKey) {
    // Initialize if needed
    const exists = await this.accountExists(playerPda);
    if (!exists) {
      await this.initializePlayer(playerPda);
    }

    // Delegate to ER
    await this.delegate(playerPda);
    console.log("🎮 Session started");
  }

  async end(playerPda: PublicKey) {
    // Undelegate and commit
    await this.undelegate(playerPda);
    console.log("👋 Session ended");
  }
}
```

### Optimistic Updates

```typescript
// Show update immediately, rollback on failure
async function optimisticUpdate(action: () => Promise<void>) {
  // Apply locally
  updateUIOptimistically();

  try {
    await action();
    // Confirm update
  } catch (error) {
    // Rollback
    revertUIUpdate();
    showError("Transaction failed");
  }
}
```

## Troubleshooting

### Account Not Delegating

**Problem:** `isDelegated()` returns false after delegation

**Solution:**
```typescript
// Wait for propagation (1-3 seconds)
await program.methods.delegate().rpc();
await new Promise(r => setTimeout(r, 3000));
const delegated = await isDelegated(accountPda);
```

### Transaction Timeout on ER

**Problem:** ER transactions hang

**Solution:**
```typescript
// Always use skipPreflight
await erProgram.methods.action().rpc({
  skipPreflight: true,  // Required!
});
```

### State Mismatch

**Problem:** ER state differs from base layer

**Solution:**
```typescript
// Wait for finalization after undelegate
await undelegate(accountPda);
await new Promise(r => setTimeout(r, 5000));
const state = await baseProgram.account.state.fetch(accountPda);
```

## Resources

- **Documentation**: https://docs.magicblock.gg
- **GitHub**: https://github.com/magicblock-labs
- **Examples**: https://github.com/magicblock-labs/magicblock-engine-examples
- **Discord**: Join untuk testnet access dan support
- **BOLT Framework**: https://book.boltengine.gg (untuk fully on-chain games)

## Next Steps

1. ✅ Build simple counter dengan delegation
2. ✅ Add VRF untuk randomness
3. ✅ Implement crank untuk automation
4. ✅ Build multiplayer game dengan real-time sync
5. ✅ Deploy ke mainnet

MagicBlock membuka possibilities baru untuk Solana applications yang sebelumnya impossible karena latency constraints. Perfect untuk games, trading, dan any real-time interactive dApps! 🚀
