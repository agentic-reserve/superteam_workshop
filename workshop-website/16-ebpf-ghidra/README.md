# Solana eBPF Decompilation dengan Ghidra

> Reverse engineering dan security analysis untuk Solana programs menggunakan Ghidra

## Apa itu Solana eBPF?

Solana programs (smart contracts) di-compile ke **eBPF bytecode** (extended Berkeley Packet Filter) sebelum di-deploy ke blockchain. eBPF adalah instruction set yang dijalankan oleh Solana Virtual Machine (SVM).

### Kenapa Perlu Decompile?

- 🔍 **Security Auditing** - Analyze deployed programs untuk vulnerabilities
- 🕵️ **Reverse Engineering** - Understand bagaimana program bekerja tanpa source code
- 🐛 **Bug Investigation** - Debug issues di production programs
- 📚 **Learning** - Study implementation dari successful programs
- ⚖️ **Verification** - Verify deployed bytecode matches claimed source code

## Apa itu Ghidra?

**Ghidra** adalah free and open-source reverse engineering tool yang dikembangkan oleh NSA (National Security Agency U.S). Ghidra bisa:
- Disassemble binary code
- Decompile ke pseudo-C code
- Analyze program structure
- Find vulnerabilities

## Setup Ghidra untuk Solana eBPF

### Prerequisites

```bash
# Install Java (required for Ghidra)
# macOS
brew install openjdk@17

# Ubuntu/Debian
sudo apt install openjdk-17-jdk

# Verify installation
java -version
```

### 1. Download Ghidra

```bash
# Download Ghidra 11.0.3
wget https://github.com/NationalSecurityAgency/ghidra/releases/download/Ghidra_11.0.3_build/ghidra_11.0.3_PUBLIC_20240410.zip

# Extract
unzip ghidra_11.0.3_PUBLIC_20240410.zip
cd ghidra_11.0.3_PUBLIC

# Run Ghidra
./ghidraRun
```

### 2. Install Solana eBPF Extension

```bash
# Clone the extension
git clone https://github.com/blastrock/Solana-eBPF-for-Ghidra.git
cd Solana-eBPF-for-Ghidra

# Build extension (requires Gradle)
export GHIDRA_INSTALL_DIR=/path/to/ghidra_11.0.3_PUBLIC
gradle

# Extension will be built in dist/
```

### 3. Install Extension in Ghidra

1. Open Ghidra
2. Go to `File → Install Extensions...`
3. Click the `+` (plus) button
4. Select the `.zip` file from `dist/` folder
5. Restart Ghidra

## Getting Solana Program Binaries

### Method 1: Download from Blockchain

```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Download deployed program
solana program dump <PROGRAM_ID> program.so

# Example: Download Token program
solana program dump TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA token_program.so
```

### Method 2: From Local Build

```bash
# Build your Anchor program
anchor build

# Program binary location
ls -la target/deploy/*.so

# Example
cp target/deploy/my_program.so ~/analysis/
```

### Method 3: Extract from Transaction

```typescript
// Get program data from transaction
const tx = await connection.getTransaction(signature, {
  maxSupportedTransactionVersion: 0,
});

// Program data is in accountData
const programData = tx.meta.loadedAddresses;
```

## Analyzing Solana Programs in Ghidra

### Step 1: Import Program

1. Create new project: `File → New Project`
2. Import file: `File → Import File`
3. Select your `.so` file
4. Choose format: **ELF** (Solana programs are ELF format)
5. Select language: **eBPF:LE:64:Solana** (from extension)
6. Click OK

### Step 2: Analyze Program

1. When prompted, click **Yes** to analyze
2. Select analysis options:
   - ✅ Decompiler Parameter ID
   - ✅ Function Start Search
   - ✅ Stack
   - ✅ Reference
3. Click **Analyze**
4. Wait for analysis to complete

### Step 3: Navigate Decompiled Code

**Main Views:**
- **Listing** (left) - Assembly code
- **Decompiler** (right) - Pseudo-C code
- **Symbol Tree** (left panel) - Functions and data
- **Function Graph** - Visual control flow

**Keyboard Shortcuts:**
- `G` - Go to address
- `L` - Rename label
- `Ctrl+E` - Edit function signature
- `;` - Add comment
- `Ctrl+Shift+G` - Find references

## Understanding Solana eBPF Instructions

### Common Instructions

```assembly
; Load/Store
r1 = *(u64 *)(r10 - 8)    ; Load 8 bytes from stack
*(u64 *)(r10 - 8) = r1    ; Store 8 bytes to stack

; Arithmetic
r0 += r1                   ; Add
r0 -= r1                   ; Subtract
r0 *= r1                   ; Multiply
r0 /= r1                   ; Divide

; Comparison
if r0 == r1 goto +5        ; Conditional jump
if r0 > r1 goto +3         ; Greater than

; Function calls
call 0x1234                ; Call function
exit                       ; Return from function

; Solana-specific
call sol_log_              ; Log message
call sol_invoke_signed_    ; CPI call
```

### Register Convention

| Register | Purpose |
|----------|---------|
| r0 | Return value |
| r1-r5 | Function arguments |
| r6-r9 | Callee-saved registers |
| r10 | Stack pointer (read-only) |

## Practical Examples

### Example 1: Find Entry Point

```c
// Decompiled entry point function
uint64_t entrypoint(uint64_t param_1) {
    uint64_t accounts;
    uint64_t instruction_data;
    uint64_t program_id;
    
    // Parse input parameters
    accounts = *(uint64_t *)(param_1 + 0x08);
    instruction_data = *(uint64_t *)(param_1 + 0x10);
    program_id = *(uint64_t *)(param_1 + 0x18);
    
    // Dispatch to instruction handler
    return process_instruction(program_id, accounts, instruction_data);
}
```

### Example 2: Identify Account Validation

```c
// Decompiled account validation
uint64_t validate_account(uint64_t account_info) {
    uint64_t owner;
    uint64_t is_signer;
    
    // Check if account is signer
    is_signer = *(uint8_t *)(account_info + 0x10);
    if (is_signer == 0) {
        sol_log_("Error: Account must be signer");
        return 1; // Error
    }
    
    // Check account owner
    owner = *(uint64_t *)(account_info + 0x20);
    if (owner != EXPECTED_PROGRAM_ID) {
        sol_log_("Error: Invalid account owner");
        return 1; // Error
    }
    
    return 0; // Success
}
```

### Example 3: Find CPI Calls

```c
// Decompiled Cross-Program Invocation
uint64_t transfer_tokens(uint64_t from, uint64_t to, uint64_t amount) {
    uint64_t instruction_data[3];
    uint64_t accounts[3];
    uint64_t result;
    
    // Build instruction
    instruction_data[0] = 3; // Transfer instruction
    instruction_data[1] = amount;
    
    // Setup accounts
    accounts[0] = from;
    accounts[1] = to;
    accounts[2] = authority;
    
    // Invoke Token program
    result = sol_invoke_signed_(
        TOKEN_PROGRAM_ID,
        instruction_data,
        accounts,
        3,
        signer_seeds
    );
    
    return result;
}
```

## Security Analysis Checklist

### 1. Access Control

```c
// Look for missing signer checks
if (is_signer == 0) {
    return ERROR_MISSING_SIGNER;
}

// Look for missing owner checks
if (account_owner != program_id) {
    return ERROR_INVALID_OWNER;
}
```

### 2. Integer Overflow

```c
// Unsafe addition (vulnerable)
balance = balance + amount;

// Safe addition (protected)
if (balance > MAX_U64 - amount) {
    return ERROR_OVERFLOW;
}
balance = balance + amount;
```

### 3. Reentrancy

```c
// Check for state updates after CPI
balance -= amount;           // ✅ Update state first
result = sol_invoke_(...);   // Then make CPI

// vs

result = sol_invoke_(...);   // ❌ CPI first
balance -= amount;           // State update after (vulnerable)
```

### 4. Account Confusion

```c
// Verify account relationships
if (token_account.owner != user_wallet) {
    return ERROR_ACCOUNT_MISMATCH;
}

if (token_account.mint != expected_mint) {
    return ERROR_WRONG_MINT;
}
```

## Advanced Techniques

### Script Analysis with Ghidra Python

```python
# Ghidra Python script to find all CPI calls
from ghidra.program.model.symbol import *

# Get current program
program = getCurrentProgram()
listing = program.getListing()

# Find all calls to sol_invoke_signed_
for func in program.getFunctionManager().getFunctions(True):
    for ref in func.getBody().getAddresses(True):
        instr = listing.getInstructionAt(ref)
        if instr and "call" in instr.getMnemonicString():
            target = instr.getOpObjects(0)[0]
            if "sol_invoke" in str(target):
                print(f"CPI found at {ref}: {instr}")
```

### Export Decompiled Code

```bash
# Export to C file
File → Export Program → C/C++

# Export to HTML (with syntax highlighting)
File → Export Program → HTML
```

## Known Limitations

### Current Issues

1. **Function Parameters** - Functions dengan >5 parameters tidak fully decompiled
2. **Relocations** - Rebasing after import bisa mess up relocations
3. **Complex Macros** - Anchor macros tidak fully reconstructed

### Workarounds

```bash
# Specify base address during import
# Import Options → Base Address → 0x100000000

# For complex programs, use multiple analysis passes
# Analysis → Auto Analyze → Run multiple times
```

## Tools Comparison

| Tool | Pros | Cons |
|------|------|------|
| **Ghidra** | Free, powerful, extensible | Steep learning curve |
| **IDA Pro** | Industry standard, excellent | Expensive ($$$) |
| **Binary Ninja** | Modern UI, good API | Paid, no Solana support yet |
| **objdump** | Simple, built-in | No decompilation |

## Use Cases

### 1. Security Audit

```bash
# Audit deployed program
solana program dump PROGRAM_ID program.so

# Analyze in Ghidra
# Look for:
# - Missing access controls
# - Integer overflows
# - Reentrancy issues
# - Account confusion
```

### 2. Verify Deployment

```bash
# Compare local build with deployed
anchor build
solana program dump PROGRAM_ID deployed.so

# Compare binaries
diff target/deploy/program.so deployed.so

# If different, analyze in Ghidra to find changes
```

### 3. Learn from Others

```bash
# Download successful program
solana program dump JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4 jupiter.so

# Analyze implementation
# Study patterns and techniques
```

## Resources

- **Ghidra Download**: https://ghidra-sre.org/
- **Solana eBPF Extension**: https://github.com/blastrock/Solana-eBPF-for-Ghidra
- **Solana rBPF**: https://github.com/solana-labs/rbpf
- **Ghidra Documentation**: https://ghidra.re/courses/
- **eBPF Specification**: https://www.kernel.org/doc/html/latest/bpf/

## Best Practices

1. **Always verify** - Cross-reference dengan source code jika available
2. **Document findings** - Add comments dan labels di Ghidra
3. **Save project** - Ghidra analysis takes time, save your work
4. **Use scripts** - Automate repetitive analysis tasks
5. **Stay updated** - Keep Ghidra dan extension up-to-date

## Security Warning

⚠️ **Disclaimer**: Reverse engineering harus dilakukan secara ethical dan legal. Hanya analyze programs yang:
- Kamu develop sendiri
- Open source
- Kamu punya permission untuk audit

Jangan gunakan untuk malicious purposes atau violate terms of service.

---

Ghidra + Solana eBPF extension adalah powerful combination untuk security research dan program analysis di Solana ecosystem! 🔍🔐
