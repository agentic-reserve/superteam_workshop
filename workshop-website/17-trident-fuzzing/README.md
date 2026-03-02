# Trident - Fuzzing Framework untuk Solana Programs

> The first and only manually-guided fuzzing framework for Solana programs, processing up to 12,000 tx/s

## Apa itu Trident?

**Trident** adalah fuzzing framework yang dikembangkan oleh **Ackee Blockchain Security** untuk menemukan bugs dan vulnerabilities di Solana programs sebelum production. Trident menggunakan **stateful fuzzing** untuk generate ribuan test cases secara otomatis dan menemukan edge cases yang terlewat oleh unit tests.

### Kenapa Perlu Fuzzing?

```rust
// Unit test hanya test happy path
#[test]
fn test_transfer() {
    transfer(100); // ✅ Works
}

// Fuzzing test edge cases
#[fuzz]
fn fuzz_transfer(amount: u64) {
    transfer(amount);
    // Fuzzer akan test:
    // - amount = 0
    // - amount = u64::MAX (overflow!)
    // - amount = random values
}
```

**Problems yang ditemukan Trident:**
- 🔴 Integer overflows
- 🔴 Missing access controls
- 🔴 Account confusion
- 🔴 Reentrancy issues
- 🔴 State inconsistencies
- 🔴 Edge cases di complex flows

## Features

### 1. Manually-Guided Fuzzing

Define custom strategies untuk explore specific code paths:

```rust
#[flow]
fn attack_sequence(&mut self) {
    // Step 1: Initialize
    self.initialize();
    
    // Step 2: Deposit large amount
    self.deposit(u64::MAX - 1000);
    
    // Step 3: Try to withdraw more (should fail!)
    self.withdraw(u64::MAX);
}
```

### 2. Stateful Fuzzing

Inputs generated based on account state changes:

```rust
#[derive(Arbitrary)]
pub struct FuzzAccounts {
    pub user: AccountId,
    pub vault: AccountId,
    pub balance: u64, // State tracked!
}

#[flow]
fn deposit_withdraw(&mut self) {
    let amount = self.fuzz_accounts.balance / 2;
    self.deposit(amount);
    self.withdraw(amount);
    // Fuzzer ensures balance consistency
}
```

### 3. Property-Based Testing

Compare states before and after execution:

```rust
#[invariant]
fn check_total_supply(&self) {
    let total_deposited = self.get_total_deposits();
    let total_withdrawn = self.get_total_withdrawals();
    
    assert!(
        total_deposited >= total_withdrawn,
        "Withdrawn more than deposited!"
    );
}
```

### 4. Flow-Based Sequences

Combine multiple instructions into realistic patterns:

```rust
#[init]
fn start(&mut self) {
    self.initialize();
}

#[flow]
fn normal_user_flow(&mut self) {
    self.deposit(1000);
    self.stake(500);
    self.unstake(250);
    self.withdraw(750);
}

#[flow]
fn attacker_flow(&mut self) {
    self.deposit(u64::MAX);
    self.exploit_reentrancy();
}
```

## Installation

### Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Anchor (if using Anchor)
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

### Install Trident

```bash
# Latest version: 0.11.1
cargo install trident-cli

# Verify installation
trident --version
```

## Quick Start

### 1. Initialize Trident in Your Project

```bash
# Navigate to your Anchor project
cd my-solana-program

# Initialize Trident
trident init

# This creates:
# - trident-tests/
#   - fuzz_tests/
#     - fuzz_0/
#       - test_fuzz.rs
#   - Cargo.toml
```

### 2. Write Your First Fuzz Test

```rust
// trident-tests/fuzz_tests/fuzz_0/test_fuzz.rs

use trident_client::fuzzing::*;

#[derive(Arbitrary, Debug)]
pub struct FuzzAccounts {
    pub user: AccountId,
    pub vault: AccountId,
    pub token_account: AccountId,
}

#[derive(Arbitrary, Debug)]
pub struct InitializeData {
    pub admin: AccountId,
}

#[derive(Arbitrary, Debug)]
pub struct DepositData {
    pub amount: u64,
}

pub struct MyFuzzTest {
    trident: TridentClient,
    fuzz_accounts: FuzzAccounts,
}

impl FuzzTestExecutor<FuzzAccounts> for MyFuzzTest {
    #[init]
    fn start(&mut self) {
        // Build Initialize Transaction
        let mut tx = InitializeTransaction::build(
            &mut self.trident,
            &mut self.fuzz_accounts
        );

        // Execute Initialize Transaction
        self.trident.execute_transaction(
            &mut tx,
            Some("Initialize")
        );
    }

    #[flow]
    fn deposit_flow(&mut self) {
        // Build Deposit Transaction
        let mut tx = DepositTransaction::build(
            &mut self.trident,
            &mut self.fuzz_accounts
        );

        // Execute Deposit Transaction
        self.trident.execute_transaction(
            &mut tx,
            Some("Deposit")
        );
    }

    #[flow]
    fn withdraw_flow(&mut self) {
        // Build Withdraw Transaction
        let mut tx = WithdrawTransaction::build(
            &mut self.trident,
            &mut self.fuzz_accounts
        );

        // Execute Withdraw Transaction
        self.trident.execute_transaction(
            &mut tx,
            Some("Withdraw")
        );
    }

    #[invariant]
    fn check_balance_consistency(&self) {
        let vault = self.trident.get_account::<Vault>(
            &self.fuzz_accounts.vault
        );
        
        assert!(
            vault.total_deposited >= vault.total_withdrawn,
            "Balance inconsistency detected!"
        );
    }
}
```

### 3. Run Fuzzing Campaign

```bash
# Run fuzz test
trident fuzz run fuzz_0

# Run with custom iterations
trident fuzz run fuzz_0 --iterations 10000

# Run with specific seed (for reproducibility)
trident fuzz run fuzz_0 --seed 12345
```

## Advanced Usage

### Custom Account Strategies

```rust
#[derive(Arbitrary, Debug)]
pub struct FuzzAccounts {
    #[arbitrary(with = valid_user_strategy)]
    pub user: AccountId,
    
    #[arbitrary(with = valid_vault_strategy)]
    pub vault: AccountId,
}

fn valid_user_strategy() -> impl Strategy<Value = AccountId> {
    // Only generate valid user accounts
    (0..100u8).prop_map(|i| AccountId::new(i))
}

fn valid_vault_strategy() -> impl Strategy<Value = AccountId> {
    // Only generate initialized vaults
    (0..10u8).prop_map(|i| AccountId::new(i))
}
```

### Complex Flow Sequences

```rust
#[flow]
fn realistic_defi_flow(&mut self) {
    // 1. User deposits collateral
    let collateral = self.generate_amount(1000, 10000);
    self.deposit_collateral(collateral);
    
    // 2. User borrows against collateral
    let borrow_amount = collateral / 2;
    self.borrow(borrow_amount);
    
    // 3. Price changes (simulate oracle update)
    self.update_price(0.8); // 20% drop
    
    // 4. Check if liquidation is possible
    if self.is_undercollateralized() {
        self.liquidate();
    }
    
    // 5. User repays loan
    self.repay(borrow_amount);
    
    // 6. User withdraws collateral
    self.withdraw_collateral(collateral);
}
```

### Multiple Invariants

```rust
#[invariant]
fn check_total_supply(&self) {
    let total = self.get_total_supply();
    assert!(total <= MAX_SUPPLY, "Total supply exceeded!");
}

#[invariant]
fn check_no_negative_balances(&self) {
    for account in self.get_all_accounts() {
        assert!(account.balance >= 0, "Negative balance!");
    }
}

#[invariant]
fn check_admin_privileges(&self) {
    let admin = self.get_admin();
    assert!(admin.is_valid(), "Admin account corrupted!");
}

#[invariant]
fn check_vault_solvency(&self) {
    let assets = self.get_total_assets();
    let liabilities = self.get_total_liabilities();
    assert!(assets >= liabilities, "Vault insolvent!");
}
```

## Real-World Example: Token Vault

```rust
// Program: Token Vault with deposit/withdraw

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

#[program]
pub mod token_vault {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.authority = ctx.accounts.authority.key();
        vault.total_deposited = 0;
        vault.total_withdrawn = 0;
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        // Transfer tokens to vault
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.user_token.to_account_info(),
                    to: ctx.accounts.vault_token.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            amount,
        )?;

        // Update state
        let vault = &mut ctx.accounts.vault;
        vault.total_deposited = vault.total_deposited
            .checked_add(amount)
            .ok_or(ErrorCode::Overflow)?;

        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let vault = &ctx.accounts.vault;

        // Check sufficient balance
        require!(
            vault.total_deposited >= vault.total_withdrawn + amount,
            ErrorCode::InsufficientBalance
        );

        // Transfer tokens from vault
        let seeds = &[
            b"vault".as_ref(),
            &[ctx.accounts.vault.bump],
        ];
        let signer = &[&seeds[..]];

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault_token.to_account_info(),
                    to: ctx.accounts.user_token.to_account_info(),
                    authority: vault.to_account_info(),
                },
                signer,
            ),
            amount,
        )?;

        // Update state
        let vault = &mut ctx.accounts.vault;
        vault.total_withdrawn = vault.total_withdrawn
            .checked_add(amount)
            .ok_or(ErrorCode::Overflow)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Vault::LEN,
        seeds = [b"vault"],
        bump
    )]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub user_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_token: Account<'info, TokenAccount>,
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub user_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_token: Account<'info, TokenAccount>,
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Vault {
    pub authority: Pubkey,
    pub total_deposited: u64,
    pub total_withdrawn: u64,
    pub bump: u8,
}

impl Vault {
    pub const LEN: usize = 32 + 8 + 8 + 1;
}

#[error_code]
pub enum ErrorCode {
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Insufficient balance")]
    InsufficientBalance,
}
```

### Fuzz Test for Token Vault

```rust
// trident-tests/fuzz_tests/fuzz_0/test_fuzz.rs

use trident_client::fuzzing::*;

#[derive(Arbitrary, Debug)]
pub struct FuzzAccounts {
    pub user: AccountId,
    pub vault: AccountId,
    pub user_token: AccountId,
    pub vault_token: AccountId,
}

pub struct VaultFuzzTest {
    trident: TridentClient,
    fuzz_accounts: FuzzAccounts,
}

impl FuzzTestExecutor<FuzzAccounts> for VaultFuzzTest {
    #[init]
    fn start(&mut self) {
        let mut tx = InitializeTransaction::build(
            &mut self.trident,
            &mut self.fuzz_accounts
        );
        self.trident.execute_transaction(&mut tx, Some("Initialize"));
    }

    #[flow]
    fn deposit_flow(&mut self) {
        let mut tx = DepositTransaction::build(
            &mut self.trident,
            &mut self.fuzz_accounts
        );
        self.trident.execute_transaction(&mut tx, Some("Deposit"));
    }

    #[flow]
    fn withdraw_flow(&mut self) {
        let mut tx = WithdrawTransaction::build(
            &mut self.trident,
            &mut self.fuzz_accounts
        );
        self.trident.execute_transaction(&mut tx, Some("Withdraw"));
    }

    #[flow]
    fn deposit_withdraw_sequence(&mut self) {
        // Deposit
        let mut deposit_tx = DepositTransaction::build(
            &mut self.trident,
            &mut self.fuzz_accounts
        );
        self.trident.execute_transaction(&mut deposit_tx, Some("Deposit"));

        // Immediately withdraw
        let mut withdraw_tx = WithdrawTransaction::build(
            &mut self.trident,
            &mut self.fuzz_accounts
        );
        self.trident.execute_transaction(&mut withdraw_tx, Some("Withdraw"));
    }

    #[invariant]
    fn check_vault_balance(&self) {
        let vault = self.trident.get_account::<Vault>(
            &self.fuzz_accounts.vault
        );
        
        // Total deposited should always be >= total withdrawn
        assert!(
            vault.total_deposited >= vault.total_withdrawn,
            "Vault balance inconsistency: deposited={}, withdrawn={}",
            vault.total_deposited,
            vault.total_withdrawn
        );
    }

    #[invariant]
    fn check_no_overflow(&self) {
        let vault = self.trident.get_account::<Vault>(
            &self.fuzz_accounts.vault
        );
        
        // Check for overflow
        assert!(
            vault.total_deposited <= u64::MAX,
            "Total deposited overflow!"
        );
        assert!(
            vault.total_withdrawn <= u64::MAX,
            "Total withdrawn overflow!"
        );
    }

    #[invariant]
    fn check_token_balance_matches(&self) {
        let vault = self.trident.get_account::<Vault>(
            &self.fuzz_accounts.vault
        );
        let vault_token = self.trident.get_account::<TokenAccount>(
            &self.fuzz_accounts.vault_token
        );
        
        let expected_balance = vault.total_deposited - vault.total_withdrawn;
        
        assert_eq!(
            vault_token.amount,
            expected_balance,
            "Token balance mismatch: expected={}, actual={}",
            expected_balance,
            vault_token.amount
        );
    }
}
```

### Run Fuzzing

```bash
# Run with 100,000 iterations
trident fuzz run fuzz_0 --iterations 100000

# Output:
# Running fuzzer...
# Iteration 1000: ✓ All invariants passed
# Iteration 2000: ✓ All invariants passed
# ...
# Iteration 45678: ✗ INVARIANT FAILED!
#
# Failed invariant: check_vault_balance
# Vault balance inconsistency: deposited=1000, withdrawn=1001
#
# Failing sequence:
# 1. Initialize
# 2. Deposit(amount=1000)
# 3. Withdraw(amount=1001) <- Should have failed!
#
# Bug found: Missing balance check in withdraw!
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/fuzz.yml
name: Fuzz Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  fuzz:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Rust
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
          
      - name: Install Solana
        run: |
          sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
          echo "$HOME/.local/share/solana/install/active_release/bin" >> $GITHUB_PATH
          
      - name: Install Trident
        run: cargo install trident-cli
        
      - name: Build program
        run: anchor build
        
      - name: Run fuzz tests
        run: |
          cd trident-tests
          trident fuzz run fuzz_0 --iterations 10000
```

## Best Practices

### 1. Start Simple

```rust
// ❌ Don't start with complex flows
#[flow]
fn complex_flow(&mut self) {
    self.step1();
    self.step2();
    self.step3();
    // ... 20 more steps
}

// ✅ Start with basic operations
#[flow]
fn deposit(&mut self) {
    self.deposit(100);
}

#[flow]
fn withdraw(&mut self) {
    self.withdraw(50);
}
```

### 2. Use Meaningful Invariants

```rust
// ❌ Weak invariant
#[invariant]
fn check_something(&self) {
    assert!(true); // Always passes!
}

// ✅ Strong invariant
#[invariant]
fn check_total_supply_cap(&self) {
    let total = self.get_total_supply();
    assert!(
        total <= MAX_SUPPLY,
        "Total supply {} exceeds cap {}",
        total,
        MAX_SUPPLY
    );
}
```

### 3. Test Edge Cases

```rust
#[derive(Arbitrary, Debug)]
pub struct DepositData {
    #[arbitrary(with = edge_case_amounts)]
    pub amount: u64,
}

fn edge_case_amounts() -> impl Strategy<Value = u64> {
    prop_oneof![
        Just(0),              // Zero
        Just(1),              // Minimum
        Just(u64::MAX),       // Maximum
        Just(u64::MAX - 1),   // Near maximum
        (1..1000u64),         // Small amounts
        (1_000_000..u64::MAX) // Large amounts
    ]
}
```

### 4. Run Long Campaigns

```bash
# Short test (development)
trident fuzz run fuzz_0 --iterations 1000

# Medium test (CI)
trident fuzz run fuzz_0 --iterations 10000

# Long test (pre-audit)
trident fuzz run fuzz_0 --iterations 1000000
```

## Troubleshooting

### Common Issues

**1. Fuzzer finds too many false positives**

```rust
// Add preconditions to flows
#[flow]
fn withdraw(&mut self) {
    // Only withdraw if balance > 0
    if self.get_balance() == 0 {
        return;
    }
    
    let mut tx = WithdrawTransaction::build(...);
    self.trident.execute_transaction(&mut tx, Some("Withdraw"));
}
```

**2. Fuzzer is too slow**

```bash
# Use fewer iterations during development
trident fuzz run fuzz_0 --iterations 100

# Or reduce account complexity
#[derive(Arbitrary, Debug)]
pub struct FuzzAccounts {
    // Fewer accounts = faster fuzzing
    pub user: AccountId,
    pub vault: AccountId,
}
```

**3. Can't reproduce bug**

```bash
# Use seed from failing run
trident fuzz run fuzz_0 --seed 12345

# Seed is printed when bug is found:
# Bug found with seed: 12345
```

## Performance Tips

### 1. Use TridentSVM

```rust
// Faster execution with Solana SVM
use trident_client::svm::TridentSVM;

pub struct MyFuzzTest {
    trident: TridentSVM, // Instead of TridentClient
    fuzz_accounts: FuzzAccounts,
}
```

### 2. Parallel Fuzzing

```bash
# Run multiple fuzzing instances
trident fuzz run fuzz_0 --jobs 4
```

### 3. Optimize Account Generation

```rust
// Cache account creation
#[derive(Arbitrary, Debug)]
pub struct FuzzAccounts {
    #[arbitrary(with = cached_accounts)]
    pub accounts: Vec<AccountId>,
}

fn cached_accounts() -> impl Strategy<Value = Vec<AccountId>> {
    // Reuse same accounts across iterations
    Just(vec![
        AccountId::new(0),
        AccountId::new(1),
        AccountId::new(2),
    ])
}
```

## Resources

- **Website**: https://usetrident.xyz/
- **Documentation**: https://ackee.xyz/trident/docs/latest/
- **GitHub**: https://github.com/Ackee-Blockchain/trident
- **Discord**: https://discord.gg/JhTVXUvaEr
- **Twitter**: https://twitter.com/TridentSolana
- **Examples**: https://ackee.xyz/trident/docs/latest/trident-examples/

## Success Stories

### Kamino Finance

Trident helped secure Kamino, one of the largest DeFi protocols on Solana:
- Found 3 critical bugs before mainnet launch
- Prevented potential $10M+ exploit
- Granted by Solana Foundation

### MetaDAO - Real-World Case Study

**MetaDAO** adalah governance protocol untuk unruggable capital formation dan market-driven governance. Mereka menggunakan Trident untuk secure multiple programs:

**Programs yang di-fuzz:**
- `futarchy` - Market-based governance
- `conditional_vault` - Conditional token vaults
- `autocrat` - Automated governance
- `amm` - Automated market maker
- `launchpad` - Token launch platform

**Repository:** https://github.com/Ackee-Blockchain/metadao-programs-fuzzing

**Setup MetaDAO Fuzzing:**

```bash
# Clone repository
git clone https://github.com/Ackee-Blockchain/metadao-programs-fuzzing.git
cd metadao-programs-fuzzing

# Install dependencies
yarn install
cd sdk && yarn install && yarn build-local && cd ..

# Build programs
anchor build

# Run fuzz tests
anchor test
```

**Example Fuzz Test Structure:**

```rust
// Fuzzing conditional vault
#[derive(Arbitrary, Debug)]
pub struct ConditionalVaultAccounts {
    pub vault: AccountId,
    pub conditional_token_mint: AccountId,
    pub underlying_token_mint: AccountId,
    pub user: AccountId,
}

#[init]
fn initialize_vault(&mut self) {
    // Initialize conditional vault
    let mut tx = InitializeVaultTransaction::build(
        &mut self.trident,
        &mut self.fuzz_accounts
    );
    self.trident.execute_transaction(&mut tx, Some("InitVault"));
}

#[flow]
fn mint_conditional_tokens(&mut self) {
    // Mint conditional tokens based on underlying
    let mut tx = MintConditionalTransaction::build(
        &mut self.trident,
        &mut self.fuzz_accounts
    );
    self.trident.execute_transaction(&mut tx, Some("MintConditional"));
}

#[flow]
fn redeem_conditional_tokens(&mut self) {
    // Redeem conditional tokens for underlying
    let mut tx = RedeemConditionalTransaction::build(
        &mut self.trident,
        &mut self.fuzz_accounts
    );
    self.trident.execute_transaction(&mut tx, Some("RedeemConditional"));
}

#[invariant]
fn check_vault_solvency(&self) {
    let vault = self.trident.get_account::<ConditionalVault>(
        &self.fuzz_accounts.vault
    );
    
    // Total conditional tokens should match underlying locked
    assert_eq!(
        vault.conditional_tokens_minted,
        vault.underlying_tokens_locked,
        "Vault solvency violated!"
    );
}
```

**Key Learnings dari MetaDAO:**

1. **Multiple Program Fuzzing** - Fuzz interactions between programs (futarchy + vault + AMM)
2. **Complex State Machines** - Governance proposals have multiple states to test
3. **Economic Invariants** - Market prices, liquidity, and token supplies must remain consistent
4. **CI Integration** - Automated fuzzing on every PR

**Results:**
- ✅ Found edge cases in conditional token redemption
- ✅ Discovered state inconsistencies in governance flows
- ✅ Prevented potential economic exploits
- ✅ Improved overall code quality

### Other Projects

- **Lido** - Liquid staking protocol
- **Safe** - Multi-sig wallet
- **Axelar** - Cross-chain bridge

## Comparison with Other Tools

| Feature | Trident | Unit Tests | Integration Tests |
|---------|---------|------------|-------------------|
| **Speed** | 12,000 tx/s | Fast | Slow |
| **Coverage** | Automatic | Manual | Manual |
| **Edge Cases** | Finds automatically | Must write manually | Must write manually |
| **State Tracking** | Built-in | Manual | Manual |
| **CI Integration** | ✅ | ✅ | ✅ |
| **Learning Curve** | Medium | Easy | Easy |

## Hands-On Exercise: Fuzz Your Own Program

### Exercise 1: Simple Counter Program

Create a counter program and fuzz it:

```rust
// programs/counter/src/lib.rs
use anchor_lang::prelude::*;

#[program]
pub mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        counter.authority = ctx.accounts.authority.key();
        Ok(())
    }

    pub fn increment(ctx: Context<Update>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = counter.count
            .checked_add(1)
            .ok_or(ErrorCode::Overflow)?;
        Ok(())
    }

    pub fn decrement(ctx: Context<Update>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = counter.count
            .checked_sub(1)
            .ok_or(ErrorCode::Underflow)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + Counter::LEN)]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut, has_one = authority)]
    pub counter: Account<'info, Counter>,
    pub authority: Signer<'info>,
}

#[account]
pub struct Counter {
    pub count: u64,
    pub authority: Pubkey,
}

impl Counter {
    pub const LEN: usize = 8 + 32;
}

#[error_code]
pub enum ErrorCode {
    #[msg("Overflow")]
    Overflow,
    #[msg("Underflow")]
    Underflow,
}
```

**Fuzz Test:**

```rust
// trident-tests/fuzz_tests/fuzz_0/test_fuzz.rs
use trident_client::fuzzing::*;

#[derive(Arbitrary, Debug)]
pub struct FuzzAccounts {
    pub counter: AccountId,
    pub authority: AccountId,
}

pub struct CounterFuzzTest {
    trident: TridentClient,
    fuzz_accounts: FuzzAccounts,
}

impl FuzzTestExecutor<FuzzAccounts> for CounterFuzzTest {
    #[init]
    fn start(&mut self) {
        let mut tx = InitializeTransaction::build(
            &mut self.trident,
            &mut self.fuzz_accounts
        );
        self.trident.execute_transaction(&mut tx, Some("Initialize"));
    }

    #[flow]
    fn increment(&mut self) {
        let mut tx = IncrementTransaction::build(
            &mut self.trident,
            &mut self.fuzz_accounts
        );
        self.trident.execute_transaction(&mut tx, Some("Increment"));
    }

    #[flow]
    fn decrement(&mut self) {
        let mut tx = DecrementTransaction::build(
            &mut self.trident,
            &mut self.fuzz_accounts
        );
        self.trident.execute_transaction(&mut tx, Some("Decrement"));
    }

    #[invariant]
    fn check_no_overflow(&self) {
        let counter = self.trident.get_account::<Counter>(
            &self.fuzz_accounts.counter
        );
        assert!(counter.count <= u64::MAX, "Counter overflow!");
    }

    #[invariant]
    fn check_no_underflow(&self) {
        let counter = self.trident.get_account::<Counter>(
            &self.fuzz_accounts.counter
        );
        assert!(counter.count >= 0, "Counter underflow!");
    }
}
```

**Run it:**

```bash
trident fuzz run fuzz_0 --iterations 10000
```

**Expected Result:** Fuzzer should NOT find any bugs because we used `checked_add` and `checked_sub`.

**Challenge:** Remove the `checked_add` and use regular `+` operator. Run fuzzer again and see it find the overflow bug!

### Exercise 2: Add Your Own Invariants

Think about what properties your program should ALWAYS maintain:

```rust
// Example invariants for different program types

// Token program
#[invariant]
fn total_supply_matches_balances(&self) {
    let total_supply = self.get_total_supply();
    let sum_of_balances = self.get_all_balances().sum();
    assert_eq!(total_supply, sum_of_balances);
}

// Lending protocol
#[invariant]
fn collateral_exceeds_debt(&self) {
    let collateral_value = self.get_total_collateral_value();
    let debt_value = self.get_total_debt_value();
    assert!(collateral_value >= debt_value);
}

// Staking program
#[invariant]
fn rewards_dont_exceed_pool(&self) {
    let total_rewards_distributed = self.get_total_rewards();
    let reward_pool_balance = self.get_reward_pool_balance();
    assert!(total_rewards_distributed <= reward_pool_balance);
}

// Governance
#[invariant]
fn vote_count_matches_voters(&self) {
    let total_votes = self.get_total_votes();
    let unique_voters = self.get_unique_voters().len();
    assert!(total_votes >= unique_voters);
}
```

## Comparison with Other Tools

| Feature | Trident | Unit Tests | Integration Tests |
|---------|---------|------------|-------------------|
| **Speed** | 12,000 tx/s | Fast | Slow |
| **Coverage** | Automatic | Manual | Manual |
| **Edge Cases** | Finds automatically | Must write manually | Must write manually |
| **State Tracking** | Built-in | Manual | Manual |
| **CI Integration** | ✅ | ✅ | ✅ |
| **Learning Curve** | Medium | Easy | Easy |

## Conclusion

Trident adalah essential tool untuk Solana security:

✅ **Before Audit** - Find bugs early, save audit costs
✅ **During Development** - Catch issues as you code
✅ **In Production** - Regression testing for updates
✅ **For Research** - Explore attack vectors

**Next Steps:**
1. Install Trident: `cargo install trident-cli`
2. Initialize in your project: `trident init`
3. Write your first fuzz test
4. Run fuzzing campaign: `trident fuzz run fuzz_0`
5. Fix bugs found by fuzzer
6. Integrate into CI/CD

---

Trident + Solana = Secure Programs! 🔱🔐
