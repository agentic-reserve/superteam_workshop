# Pinocchio - High-Performance Solana Programs

## What is Pinocchio?

Pinocchio is Anza's zero-dependency, zero-copy framework for building blazing-fast Solana programs. It delivers **88-95% compute unit reduction** and **40% smaller binaries** compared to traditional approaches.

## Performance Comparison

| Metric | Anchor | Pinocchio | Improvement |
|--------|--------|-----------|-------------|
| Token Transfer CU | ~6,000 | ~600-800 | **88-95% reduction** |
| Memo Program CU | ~650 | ~108 | **83% reduction** |
| Binary Size | Large | Small | **40% smaller** |
| Dependencies | Many | Zero* | Minimal footprint |

*Only Solana SDK types for on-chain execution

## When to Use Pinocchio

### ✅ Use Pinocchio When:
- Building high-throughput programs (DEXs, orderbooks, games)
- Compute units are a bottleneck
- Binary size matters (deployment costs)
- Need maximum control over memory
- Building infrastructure (tokens, vaults, escrows)

### ⚠️ Consider Anchor Instead When:
- Rapid prototyping / MVPs
- Team unfamiliar with low-level Rust
- Complex account relationships
- Need extensive ecosystem tooling
- Audit timeline is tight

## Key Features

### Zero-Copy Data Access
```rust
// No deserialization overhead
let vault: &Vault = bytemuck::from_bytes(&data);
```

### Zero Dependencies
```toml
[dependencies]
pinocchio = "0.10"
pinocchio-system = "0.4"
pinocchio-token = "0.4"
bytemuck = { version = "1.14", features = ["derive"] }
```

### Flexible Entrypoints
```rust
// Standard (most cases)
entrypoint!(process_instruction);

// Lazy (single instruction)
lazy_entrypoint!(process_instruction);

// No allocator (maximum optimization)
no_allocator!();
```

## Basic Example

```rust
use pinocchio::{
    account_info::AccountInfo,
    entrypoint,
    program_error::ProgramError,
    pubkey::Pubkey,
    ProgramResult,
};
use bytemuck::{Pod, Zeroable};

entrypoint!(process_instruction);

#[repr(C)]
#[derive(Clone, Copy, Pod, Zeroable)]
pub struct Counter {
    pub discriminator: u8,
    pub count: u64,
    pub _padding: [u8; 7],
}

pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    _data: &[u8],
) -> ProgramResult {
    let counter_account = &accounts[0];
    let counter: &mut Counter = bytemuck::from_bytes_mut(
        &mut counter_account.try_borrow_mut_data()?
    );
    
    counter.count = counter.count.checked_add(1)
        .ok_or(ProgramError::InvalidAccountData)?;
    
    Ok(())
}
```

## Activation

Pinocchio skill activates when you mention:
- "pinocchio"
- "high performance"
- "compute units"
- "zero copy"
- "optimization"

## Example Usage

```
You: "Build a high-performance counter program with Pinocchio"
Kiro: [Activates pinocchio-development skill]
      → Provides zero-copy patterns
      → Shows CPI helpers
      → Demonstrates optimization techniques

You: "How can I reduce compute units in my program?"
Kiro: [Activates pinocchio-development skill]
      → Suggests Pinocchio migration
      → Shows benchmarks
      → Provides optimization checklist
```

## Resources

- Skill Location: `.agents/skills/pinocchio-development/`
- Official Docs: [Pinocchio GitHub](https://github.com/febo/pinocchio)
- CPI Helpers: `pinocchio-system`, `pinocchio-token`
- IDL Generation: Use Shank

## Comparison with Anchor

| Feature | Anchor | Pinocchio |
|---------|--------|-----------|
| Learning Curve | Easy | Moderate |
| Development Speed | Fast | Medium |
| Runtime Performance | Good | Excellent |
| Binary Size | Large | Small |
| Ecosystem | Mature | Growing |
| Audit Support | Extensive | Limited |

## Next Steps

1. Activate pinocchio-development skill
2. Review example programs
3. Benchmark your use case
4. Consider migration from Anchor
5. Optimize for production

## Notes

- Pinocchio is **unaudited** - use with caution
- Version 0.10.x is current
- Maintained by Anza (Solana Agave team)
- SDK v3 will improve Anchor/Pinocchio interop
