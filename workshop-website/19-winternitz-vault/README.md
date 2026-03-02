# Solana Winternitz Vault - Quantum-Resistant Security

> Quantum-resistant lamports vault menggunakan Winternitz One-Time Signatures (WOTS) dengan 224-bit preimage resistance

## Apa itu Winternitz Vault?

**Solana Winternitz Vault** adalah quantum-resistant vault yang menggunakan **Winternitz One-Time Signatures (WOTS)** untuk protect lamports dari quantum computing attacks. Berbeda dengan Ed25519 signatures yang vulnerable terhadap quantum computers, WOTS tetap secure bahkan dengan Grover's algorithm.

### Kenapa Perlu Quantum Resistance?

```
Traditional Cryptography (Ed25519):
- Secure against classical computers ✅
- Vulnerable to quantum computers ❌
- Shor's algorithm can break in polynomial time

Winternitz Signatures (WOTS):
- Secure against classical computers ✅
- Resistant to quantum computers ✅
- Grover's algorithm only reduces security by half
```

**Quantum Threats:**
- 🔴 **Shor's Algorithm** - Breaks RSA, ECC (Ed25519) in polynomial time
- 🟡 **Grover's Algorithm** - Reduces hash security by half (256-bit → 128-bit)
- 🟢 **WOTS** - Remains secure with proper parameter choices

## Security Guarantees

### Hash Security

**Truncated Keccak256 (224-bit):**
- **Preimage Resistance**: 224-bit (quantum: 112-bit)
- **Collision Resistance**: 112-bit (quantum: 56-bit)

**Public Key Merkle Root (256-bit):**
- **Preimage Resistance**: 256-bit (quantum: 128-bit)
- **Collision Resistance**: 128-bit (quantum: 64-bit)

### Why Keccak over SHA256?

```rust
// Keccak advantages:
// 1. More resistant to length-extension attacks
// 2. Better performance in truncated scenarios
// 3. Designed for quantum resistance

// SHA256 (vulnerable to length-extension)
let hash1 = sha256(message);
let hash2 = sha256(hash1 || extra_data); // Predictable!

// Keccak256 (resistant)
let hash1 = keccak256(message);
let hash2 = keccak256(hash1 || extra_data); // Unpredictable!
```

## How It Works

### 1. Winternitz One-Time Signatures

**Key Generation:**
```rust
// Generate private key (random values)
let private_key: Vec<[u8; 32]> = (0..67)
    .map(|_| random_bytes())
    .collect();

// Generate public key (hash chain)
let public_key: Vec<[u8; 28]> = private_key
    .iter()
    .map(|sk| {
        let mut hash = keccak256(sk);
        // Hash 256 times
        for _ in 0..256 {
            hash = keccak256(&hash);
        }
        truncate_to_224_bits(hash)
    })
    .collect();

// Compute merkle root
let merkle_root = compute_merkle_root(&public_key);
```

**Signing:**
```rust
// Message to sign
let message = [amount, split_pubkey, refund_pubkey];
let message_hash = keccak256(&message);

// Sign each chunk
let signature: Vec<[u8; 28]> = private_key
    .iter()
    .enumerate()
    .map(|(i, sk)| {
        let chunk = message_hash[i];
        let iterations = 256 - chunk as usize;
        
        let mut hash = keccak256(sk);
        for _ in 0..iterations {
            hash = keccak256(&hash);
        }
        truncate_to_224_bits(hash)
    })
    .collect();
```

**Verification:**
```rust
// Recover public key from signature
let recovered_pubkey: Vec<[u8; 28]> = signature
    .iter()
    .enumerate()
    .map(|(i, sig)| {
        let chunk = message_hash[i];
        let remaining = chunk as usize;
        
        let mut hash = *sig;
        for _ in 0..remaining {
            hash = keccak256(&hash);
        }
        truncate_to_224_bits(hash)
    })
    .collect();

// Verify merkle root matches PDA seed
let recovered_root = compute_merkle_root(&recovered_pubkey);
assert_eq!(recovered_root, vault_pda_seed);
```

### 2. Program-Derived Address (PDA)

```rust
// Vault PDA derived from public key merkle root
let (vault_pda, bump) = Pubkey::find_program_address(
    &[b"vault", &merkle_root],
    &program_id
);

// This ensures:
// 1. Only owner of private key can sign
// 2. Quantum-resistant address derivation
// 3. No need to store public key on-chain
```

## Installation & Setup

### Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

### Clone Repository

```bash
git clone https://github.com/blueshift-gg/solana-winternitz-vault.git
cd solana-winternitz-vault

# Build program
anchor build

# Run tests
anchor test
```

## Usage Examples

### Example 1: Open Vault

```rust
use solana_winternitz_vault::*;

// Generate Winternitz keypair
let (private_key, public_key) = generate_winternitz_keypair();

// Compute merkle root
let merkle_root = compute_merkle_root(&public_key);

// Derive vault PDA
let (vault_pda, bump) = Pubkey::find_program_address(
    &[b"vault", &merkle_root],
    &program_id
);

// Open vault with initial deposit
let ix = open_vault(
    &program_id,
    &payer.pubkey(),
    &vault_pda,
    merkle_root,
    1_000_000_000, // 1 SOL
);

// Send transaction
let tx = Transaction::new_signed_with_payer(
    &[ix],
    Some(&payer.pubkey()),
    &[&payer],
    recent_blockhash,
);
connection.send_and_confirm_transaction(&tx)?;

println!("✅ Vault opened: {}", vault_pda);
println!("💰 Balance: 1 SOL");
```

### Example 2: Split Vault

```rust
// Generate new vaults for split
let (split_private, split_public) = generate_winternitz_keypair();
let split_root = compute_merkle_root(&split_public);
let (split_vault, _) = Pubkey::find_program_address(
    &[b"vault", &split_root],
    &program_id
);

let (refund_private, refund_public) = generate_winternitz_keypair();
let refund_root = compute_merkle_root(&refund_public);
let (refund_vault, _) = Pubkey::find_program_address(
    &[b"vault", &refund_root],
    &program_id
);

// Amount to split
let split_amount = 600_000_000; // 0.6 SOL

// Create message to sign
let message = create_split_message(
    split_amount,
    &split_vault,
    &refund_vault,
);

// Sign with original vault's private key
let signature = sign_winternitz(&private_key, &message);

// Split vault instruction
let ix = split_vault(
    &program_id,
    &vault_pda,
    &split_vault,
    &refund_vault,
    signature,
    split_amount,
);

// Send transaction
let tx = Transaction::new_signed_with_payer(
    &[ix],
    Some(&payer.pubkey()),
    &[&payer],
    recent_blockhash,
);
connection.send_and_confirm_transaction(&tx)?;

println!("✅ Vault split:");
println!("   Split vault: {} (0.6 SOL)", split_vault);
println!("   Refund vault: {} (0.4 SOL)", refund_vault);
```

### Example 3: Close Vault

```rust
// Refund account (can be any account)
let refund_account = Keypair::new().pubkey();

// Create message to sign
let message = create_close_message(&refund_account);

// Sign with vault's private key
let signature = sign_winternitz(&private_key, &message);

// Close vault instruction
let ix = close_vault(
    &program_id,
    &vault_pda,
    &refund_account,
    signature,
);

// Send transaction
let tx = Transaction::new_signed_with_payer(
    &[ix],
    Some(&payer.pubkey()),
    &[&payer],
    recent_blockhash,
);
connection.send_and_confirm_transaction(&tx)?;

println!("✅ Vault closed");
println!("💰 Refunded to: {}", refund_account);
```

## Complete Workflow Example

```rust
use solana_winternitz_vault::*;

async fn quantum_resistant_workflow() -> Result<()> {
    // 1. Open initial vault with 10 SOL
    let (vault1_sk, vault1_pk) = generate_winternitz_keypair();
    let vault1_root = compute_merkle_root(&vault1_pk);
    let (vault1_pda, _) = derive_vault_pda(&vault1_root);
    
    open_vault(&vault1_pda, 10_000_000_000).await?;
    println!("✅ Vault 1 opened: 10 SOL");
    
    // 2. Split into two vaults (6 SOL + 4 SOL)
    let (vault2_sk, vault2_pk) = generate_winternitz_keypair();
    let vault2_root = compute_merkle_root(&vault2_pk);
    let (vault2_pda, _) = derive_vault_pda(&vault2_root);
    
    let (vault3_sk, vault3_pk) = generate_winternitz_keypair();
    let vault3_root = compute_merkle_root(&vault3_pk);
    let (vault3_pda, _) = derive_vault_pda(&vault3_root);
    
    let message = create_split_message(
        6_000_000_000,
        &vault2_pda,
        &vault3_pda,
    );
    let signature = sign_winternitz(&vault1_sk, &message);
    
    split_vault(
        &vault1_pda,
        &vault2_pda,
        &vault3_pda,
        signature,
        6_000_000_000,
    ).await?;
    
    println!("✅ Vault 1 split:");
    println!("   Vault 2: 6 SOL");
    println!("   Vault 3: 4 SOL");
    
    // 3. Close vault 2 and refund to regular account
    let refund_account = Keypair::new().pubkey();
    let message = create_close_message(&refund_account);
    let signature = sign_winternitz(&vault2_sk, &message);
    
    close_vault(&vault2_pda, &refund_account, signature).await?;
    println!("✅ Vault 2 closed, refunded 6 SOL");
    
    // 4. Vault 3 still has 4 SOL (quantum-resistant!)
    println!("✅ Vault 3 remains: 4 SOL (quantum-safe)");
    
    Ok(())
}
```

## Security Best Practices

### 1. Never Reuse Signatures

```rust
// ❌ WRONG: Reusing signature
let sig = sign_winternitz(&private_key, &message1);
send_transaction(sig); // First use
send_transaction(sig); // DANGEROUS! Reveals more of private key

// ✅ CORRECT: Always generate new vault after signing
let sig = sign_winternitz(&private_key, &message);
send_transaction(sig);
// Now open new vault with new keypair
let (new_sk, new_pk) = generate_winternitz_keypair();
```

**Why?** Each signature reveals ~50% of your private key. Reusing signatures exponentially reduces security.

### 2. Secure Key Storage

```rust
// Store private keys securely
use keyring::Entry;

// Save to system keyring
let entry = Entry::new("solana-winternitz", "vault1")?;
entry.set_password(&serialize_private_key(&private_key))?;

// Retrieve when needed
let stored_key = entry.get_password()?;
let private_key = deserialize_private_key(&stored_key)?;

// Clear from memory after use
private_key.zeroize();
```

### 3. Verify Before Signing

```rust
// Always verify transaction details before signing
fn verify_and_sign(
    private_key: &PrivateKey,
    split_amount: u64,
    split_vault: &Pubkey,
    refund_vault: &Pubkey,
) -> Result<Signature> {
    // Verify amounts
    assert!(split_amount > 0, "Split amount must be positive");
    assert!(split_amount < 1_000_000_000_000, "Amount too large");
    
    // Verify addresses
    assert_ne!(split_vault, refund_vault, "Vaults must be different");
    
    // Create and sign message
    let message = create_split_message(split_amount, split_vault, refund_vault);
    Ok(sign_winternitz(private_key, &message))
}
```

### 4. Protect Update Authority

```rust
// Use Winternitz signature for program update authority
let (authority_sk, authority_pk) = generate_winternitz_keypair();
let authority_root = compute_merkle_root(&authority_pk);
let (authority_pda, _) = derive_authority_pda(&authority_root);

// Set as program update authority
solana program set-upgrade-authority \
    <PROGRAM_ID> \
    --new-upgrade-authority <AUTHORITY_PDA>
```

## Performance Considerations

### Compute Units

```rust
// Typical compute unit usage:
// - Open Vault: ~50,000 CU
// - Split Vault: ~200,000 CU (signature verification)
// - Close Vault: ~200,000 CU (signature verification)

// Request additional compute units if needed
let compute_budget_ix = ComputeBudgetInstruction::set_compute_unit_limit(300_000);

let tx = Transaction::new_signed_with_payer(
    &[compute_budget_ix, split_vault_ix],
    Some(&payer.pubkey()),
    &[&payer],
    recent_blockhash,
);
```

### Transaction Size

```rust
// Winternitz signature size: ~1.8 KB
// This fits within Solana's 1232 byte transaction limit
// by using multiple instructions if needed

// For large signatures, split into multiple transactions:
let sig_chunks = signature.chunks(800);
for (i, chunk) in sig_chunks.enumerate() {
    let ix = submit_signature_chunk(i, chunk);
    send_transaction(ix).await?;
}

// Final instruction to execute
let ix = execute_with_signature();
send_transaction(ix).await?;
```

## Testing

### Run Tests

```bash
# Run all tests
anchor test

# Run specific test
anchor test -- --test open_vault

# Run with logs
anchor test -- --nocapture
```

### Test Coverage

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_open_vault() {
        // Test vault creation
        let (sk, pk) = generate_winternitz_keypair();
        let root = compute_merkle_root(&pk);
        let (vault, _) = derive_vault_pda(&root);
        
        let result = open_vault(&vault, 1_000_000_000).await;
        assert!(result.is_ok());
        
        let balance = get_balance(&vault).await?;
        assert_eq!(balance, 1_000_000_000);
    }

    #[tokio::test]
    async fn test_split_vault() {
        // Test vault splitting
        let (vault1_sk, vault1_pk) = generate_winternitz_keypair();
        let vault1_root = compute_merkle_root(&vault1_pk);
        let (vault1, _) = derive_vault_pda(&vault1_root);
        
        open_vault(&vault1, 1_000_000_000).await?;
        
        let (vault2_sk, vault2_pk) = generate_winternitz_keypair();
        let vault2_root = compute_merkle_root(&vault2_pk);
        let (vault2, _) = derive_vault_pda(&vault2_root);
        
        let (vault3_sk, vault3_pk) = generate_winternitz_keypair();
        let vault3_root = compute_merkle_root(&vault3_pk);
        let (vault3, _) = derive_vault_pda(&vault3_root);
        
        let message = create_split_message(600_000_000, &vault2, &vault3);
        let sig = sign_winternitz(&vault1_sk, &message);
        
        let result = split_vault(&vault1, &vault2, &vault3, sig, 600_000_000).await;
        assert!(result.is_ok());
        
        let balance2 = get_balance(&vault2).await?;
        let balance3 = get_balance(&vault3).await?;
        assert_eq!(balance2, 600_000_000);
        assert_eq!(balance3, 400_000_000);
    }

    #[tokio::test]
    async fn test_close_vault() {
        // Test vault closure
        let (sk, pk) = generate_winternitz_keypair();
        let root = compute_merkle_root(&pk);
        let (vault, _) = derive_vault_pda(&root);
        
        open_vault(&vault, 1_000_000_000).await?;
        
        let refund = Keypair::new().pubkey();
        let message = create_close_message(&refund);
        let sig = sign_winternitz(&sk, &message);
        
        let result = close_vault(&vault, &refund, sig).await;
        assert!(result.is_ok());
        
        let balance = get_balance(&refund).await?;
        assert_eq!(balance, 1_000_000_000);
    }

    #[tokio::test]
    async fn test_signature_verification() {
        // Test signature verification
        let (sk, pk) = generate_winternitz_keypair();
        let message = b"test message";
        
        let sig = sign_winternitz(&sk, message);
        let recovered_pk = recover_public_key(&sig, message);
        
        assert_eq!(pk, recovered_pk);
    }

    #[tokio::test]
    async fn test_replay_protection() {
        // Test replay attack prevention
        let (sk, pk) = generate_winternitz_keypair();
        let root = compute_merkle_root(&pk);
        let (vault, _) = derive_vault_pda(&root);
        
        open_vault(&vault, 1_000_000_000).await?;
        
        let refund = Keypair::new().pubkey();
        let message = create_close_message(&refund);
        let sig = sign_winternitz(&sk, &message);
        
        // First close should succeed
        close_vault(&vault, &refund, sig.clone()).await?;
        
        // Second close with same signature should fail
        let result = close_vault(&vault, &refund, sig).await;
        assert!(result.is_err());
    }
}
```

## Comparison with Traditional Wallets

| Feature | Ed25519 Wallet | Winternitz Vault |
|---------|----------------|------------------|
| **Quantum Resistance** | ❌ Vulnerable | ✅ Resistant |
| **Signature Size** | 64 bytes | ~1.8 KB |
| **Verification Speed** | Fast | Moderate |
| **Key Reuse** | ✅ Safe | ❌ Dangerous |
| **Compute Units** | ~2,000 | ~200,000 |
| **Use Case** | General purpose | High-value, long-term storage |

## Future Improvements

### 1. SPHINCS+ Integration

```rust
// SPHINCS+ offers better signature size
// and allows multiple signatures per key
use sphincs_plus::*;

let (sk, pk) = sphincs_generate_keypair();
let sig = sphincs_sign(&sk, message);
let valid = sphincs_verify(&pk, message, &sig);
```

### 2. Multisig Support

```rust
// Require multiple Winternitz signatures
struct MultisigVault {
    threshold: u8,
    signers: Vec<[u8; 32]>, // Merkle roots
}

// Require 2-of-3 signatures to spend
let multisig = MultisigVault {
    threshold: 2,
    signers: vec![root1, root2, root3],
};
```

### 3. Time-Locked Vaults

```rust
// Add time lock to vault
struct TimeLockedVault {
    unlock_time: i64,
    merkle_root: [u8; 32],
}

// Can only spend after unlock_time
assert!(Clock::get()?.unix_timestamp >= vault.unlock_time);
```

## Resources

- **GitHub**: https://github.com/blueshift-gg/solana-winternitz-vault
- **Winternitz OTS Paper**: https://eprint.iacr.org/2011/191.pdf
- **Post-Quantum Cryptography**: https://csrc.nist.gov/projects/post-quantum-cryptography
- **Grover's Algorithm**: https://en.wikipedia.org/wiki/Grover%27s_algorithm
- **Keccak**: https://keccak.team/keccak.html

## Disclaimer

⚠️ **Use at your own risk!**

This is experimental cryptography. While Winternitz signatures are theoretically quantum-resistant, this implementation:
- Has not been formally audited
- May have implementation bugs
- Should not be used for production without thorough review

The author is "a pretty good dev larping as a cryptographer" - proceed with caution!

## Conclusion

Winternitz Vault provides quantum-resistant security untuk Solana:

✅ **Quantum-Resistant** - Safe against Shor's and Grover's algorithms
✅ **Hash-Based** - Uses proven cryptographic primitives
✅ **PDA Integration** - Leverages Solana's native features
✅ **Future-Proof** - Protects against quantum computing threats

**When to use:**
- Long-term value storage (years to decades)
- High-value accounts (>$1M)
- Institutional custody
- Future-proofing against quantum computers

**When NOT to use:**
- Frequent transactions (signature size overhead)
- Low-value accounts (compute cost)
- Applications requiring key reuse

---

Prepare for the quantum future! 🔐🚀
