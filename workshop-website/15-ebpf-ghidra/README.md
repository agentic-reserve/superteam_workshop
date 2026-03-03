# Module 15: Solana eBPF Decompilation dengan Ghidra

## Deskripsi
Pelajari cara melakukan reverse engineering dan security analysis pada Solana programs menggunakan Ghidra. Module ini mengajarkan teknik decompilation eBPF bytecode untuk audit keamanan dan analisis program.

## Tujuan Pembelajaran
- Memahami arsitektur Solana eBPF
- Setup dan konfigurasi Ghidra untuk Solana
- Decompile dan analyze program binaries
- Identify security vulnerabilities
- Perform security audits

## Prerequisites
- Pemahaman dasar Solana programs
- Familiar dengan assembly/low-level programming
- Java Runtime Environment (untuk Ghidra)

## Durasi
2 jam

---

## 1. Pengenalan Solana eBPF

### Apa itu eBPF?
Extended Berkeley Packet Filter (eBPF) adalah virtual machine yang digunakan Solana untuk menjalankan on-chain programs. Solana menggunakan modified version dari eBPF yang disesuaikan untuk blockchain environment.

### Kenapa Decompilation Penting?
- **Security Auditing**: Verify program behavior tanpa source code
- **Vulnerability Research**: Find bugs dan exploits
- **Program Analysis**: Understand third-party programs
- **Forensics**: Investigate suspicious on-chain activity

### Solana eBPF Architecture
```
┌─────────────────────────────────────┐
│     Solana Program (.so file)       │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   eBPF Bytecode Instructions  │ │
│  │   - 64-bit registers (r0-r10) │ │
│  │   - Stack operations          │ │
│  │   - Memory access             │ │
│  │   - Function calls            │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   Relocations & Symbols       │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 2. Setup Ghidra untuk Solana

### Install Ghidra
1. Download Ghidra 11.0.3 dari [ghidra-sre.org](https://ghidra-sre.org/)
2. Extract archive
3. Pastikan Java 17+ terinstall

```bash
# Check Java version
java -version

# Extract Ghidra
unzip ghidra_11.0.3_PUBLIC_*.zip
cd ghidra_11.0.3_PUBLIC
```

### Install Solana eBPF Extension

**Option 1: Download Release**
```bash
# Download dari GitHub
wget https://github.com/blastrock/Solana-eBPF-for-Ghidra/releases/latest/download/ghidra_solana_ebpf.zip

# Install di Ghidra:
# File → Install Extensions... → Add Extension → Select ZIP
```

**Option 2: Build dari Source**
```bash
# Clone repository
git clone https://github.com/blastrock/Solana-eBPF-for-Ghidra.git
cd Solana-eBPF-for-Ghidra

# Build dengan Gradle
export GHIDRA_INSTALL_DIR=/path/to/ghidra_11.0.3_PUBLIC
gradle

# Install extension:
# File → Install Extensions... → Add Extension → Select built ZIP
```

### Verify Installation
1. Restart Ghidra
2. Check: File → Install Extensions
3. Pastikan "Solana eBPF" muncul dan enabled

---

## 3. Download Program Binary dari Blockchain

### Menggunakan Solana CLI

```bash
# Get program account info
solana program show <PROGRAM_ID>

# Download program binary
solana program dump <PROGRAM_ID> program.so

# Example: Download Token Program
solana program dump TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA token_program.so
```

### Menggunakan RPC API

```typescript
// download-program.ts
import { Connection, PublicKey } from '@solana/web3.js';
import fs from 'fs';

async function downloadProgram(programId: string) {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const pubkey = new PublicKey(programId);
  
  // Get program account
  const accountInfo = await connection.getAccountInfo(pubkey);
  
  if (!accountInfo) {
    throw new Error('Program not found');
  }
  
  // Save binary
  fs.writeFileSync('program.so', accountInfo.data);
  console.log(`Downloaded ${accountInfo.data.length} bytes`);
}

// Usage
downloadProgram('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
```

### Verify Binary

```bash
# Check file type
file program.so

# Expected output:
# program.so: ELF 64-bit LSB shared object, eBPF

# Check size
ls -lh program.so

# Inspect with readelf
readelf -h program.so
```

---

## 4. Import dan Analyze di Ghidra

### Create New Project

1. Launch Ghidra
2. File → New Project
3. Non-Shared Project
4. Name: "SolanaAudit"

### Import Program Binary

1. File → Import File
2. Select `program.so`
3. Format: **ELF** (auto-detected)
4. Language: **eBPF:LE:64:Solana** (pilih Solana variant)
5. Options:
   - Base Address: `0x100000000` (recommended)
   - Load External Libraries: No

### Auto-Analysis

1. Double-click imported file
2. Analyze dialog muncul
3. Enable analyzers:
   - ✅ ASCII Strings
   - ✅ Data Reference
   - ✅ Function Start Search
   - ✅ Stack
   - ✅ Decompiler Parameter ID
4. Click "Analyze"

### Navigation Interface

```
┌─────────────────────────────────────────────────────┐
│  Program Trees  │  Symbol Tree  │  Data Type Manager│
├─────────────────┼───────────────┴───────────────────┤
│                 │                                    │
│  Function List  │     Listing (Disassembly)         │
│                 │                                    │
│  - entrypoint   │  100000000  mov r1, r10           │
│  - process_inst │  100000004  add r1, -0x8          │
│  - validate_acc │  100000008  call 0x10000100       │
│                 │                                    │
├─────────────────┼────────────────────────────────────┤
│                 │                                    │
│  Decompiler     │     Console / Script Manager      │
│                 │                                    │
└─────────────────┴────────────────────────────────────┘
```

---

## 5. Decompilation dan Analysis

### Find Entry Point

```c
// Typical Solana program entry point
uint64_t entrypoint(uint8_t *input) {
  // Parse instruction data
  SolAccountInfo *accounts;
  uint8_t *instruction_data;
  uint64_t num_accounts;
  
  // Deserialize input
  if (!sol_deserialize(input, &accounts, &num_accounts, &instruction_data)) {
    return ERROR_INVALID_INSTRUCTION_DATA;
  }
  
  // Process instruction
  return process_instruction(accounts, num_accounts, instruction_data);
}
```

### Identify Key Functions

**Look for common patterns:**

1. **Account Validation**
```c
bool validate_account(SolAccountInfo *account, SolPubkey *expected_owner) {
  // Check owner
  if (!SolPubkey_same(account->owner, expected_owner)) {
    return false;
  }
  
  // Check signer
  if (!account->is_signer) {
    return false;
  }
  
  return true;
}
```

2. **Data Deserialization**
```c
void deserialize_instruction(uint8_t *data, Instruction *inst) {
  inst->discriminator = data[0];
  inst->amount = *(uint64_t *)(data + 1);
  inst->recipient = (SolPubkey *)(data + 9);
}
```

3. **CPI (Cross-Program Invocation)**
```c
uint64_t invoke_token_transfer(
  SolAccountInfo *token_program,
  SolAccountInfo *from,
  SolAccountInfo *to,
  uint64_t amount
) {
  // Build instruction
  uint8_t instruction_data[9];
  instruction_data[0] = 3; // Transfer discriminator
  *(uint64_t *)(instruction_data + 1) = amount;
  
  // Invoke
  return sol_invoke(token_program, instruction_data, 9, accounts, num_accounts);
}
```

### Rename Functions dan Variables

1. Right-click function → Rename (L key)
2. Add comments (; key)
3. Retype variables (Ctrl+L)

```c
// Before
undefined8 FUN_100000420(longlong param_1, longlong param_2) {
  longlong lVar1;
  lVar1 = *(longlong *)(param_1 + 0x10);
  if (lVar1 != 0x1234567890abcdef) {
    return 1;
  }
  return 0;
}

// After renaming
uint64_t validate_program_id(SolAccountInfo *account, SolPubkey *expected_id) {
  SolPubkey *program_id;
  program_id = account->owner;
  if (!SolPubkey_same(program_id, expected_id)) {
    return ERROR_INVALID_OWNER;
  }
  return SUCCESS;
}
```

---

## 6. Security Analysis

### Common Vulnerabilities

#### 1. Missing Signer Check
```c
// VULNERABLE
uint64_t transfer(SolAccountInfo *from, SolAccountInfo *to, uint64_t amount) {
  // ❌ No signer check!
  deduct_balance(from, amount);
  add_balance(to, amount);
  return SUCCESS;
}

// SECURE
uint64_t transfer(SolAccountInfo *from, SolAccountInfo *to, uint64_t amount) {
  // ✅ Verify signer
  if (!from->is_signer) {
    return ERROR_MISSING_REQUIRED_SIGNATURE;
  }
  deduct_balance(from, amount);
  add_balance(to, amount);
  return SUCCESS;
}
```

#### 2. Missing Owner Check
```c
// VULNERABLE
uint64_t process_account(SolAccountInfo *account) {
  // ❌ No owner verification
  AccountData *data = (AccountData *)account->data;
  data->balance += 1000;
  return SUCCESS;
}

// SECURE
uint64_t process_account(SolAccountInfo *account, SolPubkey *program_id) {
  // ✅ Verify owner
  if (!SolPubkey_same(account->owner, program_id)) {
    return ERROR_INVALID_ACCOUNT_OWNER;
  }
  AccountData *data = (AccountData *)account->data;
  data->balance += 1000;
  return SUCCESS;
}
```

#### 3. Integer Overflow
```c
// VULNERABLE
uint64_t add_tokens(uint64_t balance, uint64_t amount) {
  // ❌ Can overflow
  return balance + amount;
}

// SECURE
uint64_t add_tokens(uint64_t balance, uint64_t amount) {
  // ✅ Check overflow
  if (balance > UINT64_MAX - amount) {
    return ERROR_OVERFLOW;
  }
  return balance + amount;
}
```

#### 4. Reentrancy via CPI
```c
// VULNERABLE
uint64_t withdraw(SolAccountInfo *vault, SolAccountInfo *user, uint64_t amount) {
  // ❌ External call before state update
  invoke_transfer(vault, user, amount);
  vault_data->balance -= amount; // State update after CPI!
  return SUCCESS;
}

// SECURE
uint64_t withdraw(SolAccountInfo *vault, SolAccountInfo *user, uint64_t amount) {
  // ✅ State update before external call
  vault_data->balance -= amount;
  invoke_transfer(vault, user, amount);
  return SUCCESS;
}
```

### Security Checklist

```markdown
## Account Validation
- [ ] All accounts have owner checks
- [ ] Signer requirements verified
- [ ] Writable permissions checked
- [ ] PDA derivation validated

## Arithmetic Operations
- [ ] No integer overflows
- [ ] No integer underflows
- [ ] Division by zero checks
- [ ] Proper type casting

## Access Control
- [ ] Authority checks present
- [ ] Admin functions protected
- [ ] User permissions validated

## CPI Security
- [ ] State updates before CPIs
- [ ] Program IDs verified
- [ ] Account ownership checked after CPI

## Data Handling
- [ ] Input validation
- [ ] Buffer overflow protection
- [ ] Proper deserialization
- [ ] Size checks
```

---

## 7. Advanced Techniques

### Ghidra Scripting dengan Python

```python
# find_missing_signer_checks.py
# Ghidra script to find functions without signer checks

from ghidra.program.model.symbol import *
from ghidra.program.model.listing import *

def find_signer_checks():
    fm = currentProgram.getFunctionManager()
    functions = fm.getFunctions(True)
    
    vulnerable = []
    
    for func in functions:
        has_signer_check = False
        
        # Check for is_signer field access
        instructions = currentProgram.getListing().getInstructions(func.getBody(), True)
        for instr in instructions:
            # Look for offset 0x18 (is_signer field in SolAccountInfo)
            if "0x18" in str(instr):
                has_signer_check = True
                break
        
        if not has_signer_check:
            vulnerable.append(func.getName())
    
    print("Functions without signer checks:")
    for name in vulnerable:
        print(f"  - {name}")

find_signer_checks()
```

### Export Decompiled Code

```python
# export_decompiled.py
from ghidra.app.decompiler import DecompInterface

def export_all_functions():
    decompiler = DecompInterface()
    decompiler.openProgram(currentProgram)
    
    fm = currentProgram.getFunctionManager()
    functions = fm.getFunctions(True)
    
    output = open("/tmp/decompiled.c", "w")
    
    for func in functions:
        result = decompiler.decompileFunction(func, 30, monitor)
        if result.decompileCompleted():
            output.write(f"\n// {func.getName()}\n")
            output.write(result.getDecompiledFunction().getC())
            output.write("\n\n")
    
    output.close()
    print("Exported to /tmp/decompiled.c")

export_all_functions()
```

### Compare Program Versions

```bash
# Download different versions
solana program dump <PROGRAM_ID> --url mainnet-beta program_v1.so
solana program dump <PROGRAM_ID> --url devnet program_v2.so

# Use Ghidra's Version Tracking
# Tools → Version Tracking → Create Session
# Compare functions and identify changes
```

---

## 8. Practical Example: Audit Token Program

### Step 1: Download Program
```bash
solana program dump TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA spl_token.so
```

### Step 2: Import ke Ghidra
- Language: eBPF:LE:64:Solana
- Base Address: 0x100000000

### Step 3: Find Transfer Function

Look for instruction discriminator `3` (Transfer):

```c
uint64_t process_transfer(
  SolAccountInfo *source,
  SolAccountInfo *destination,
  SolAccountInfo *authority,
  uint64_t amount
) {
  // Verify authority is signer
  if (!authority->is_signer) {
    return ERROR_MISSING_REQUIRED_SIGNATURE;
  }
  
  // Verify source account owner
  if (!SolPubkey_same(source->owner, &TOKEN_PROGRAM_ID)) {
    return ERROR_INVALID_ACCOUNT_OWNER;
  }
  
  // Deserialize account data
  TokenAccount *src_account = (TokenAccount *)source->data;
  TokenAccount *dst_account = (TokenAccount *)destination->data;
  
  // Check sufficient balance
  if (src_account->amount < amount) {
    return ERROR_INSUFFICIENT_FUNDS;
  }
  
  // Perform transfer (with overflow check)
  src_account->amount -= amount;
  if (dst_account->amount > UINT64_MAX - amount) {
    return ERROR_OVERFLOW;
  }
  dst_account->amount += amount;
  
  return SUCCESS;
}
```

### Step 4: Verify Security Properties

✅ Signer check present
✅ Owner verification
✅ Balance check
✅ Overflow protection
✅ State updates atomic

---

## 9. Tools dan Resources

### Essential Tools
- **Ghidra**: Main decompiler
- **Solana CLI**: Download programs
- **readelf**: Inspect ELF headers
- **objdump**: Disassemble binaries
- **Binary Ninja**: Alternative decompiler

### Useful Resources
- [Solana eBPF for Ghidra](https://github.com/blastrock/Solana-eBPF-for-Ghidra)
- [Solana RBPF](https://github.com/solana-labs/rbpf)
- [eBPF Instruction Set](https://www.kernel.org/doc/html/latest/bpf/instruction-set.html)
- [Ghidra Documentation](https://ghidra-sre.org/docs/)

### Community
- [Solana Security Discord](https://discord.gg/solana)
- [Ghidra Slack](https://ghidra-sre.org/community/)

---

## 10. Exercises

### Exercise 1: Basic Analysis
Download dan analyze program sederhana:
```bash
solana program dump 11111111111111111111111111111111 system_program.so
```

Tasks:
1. Import ke Ghidra
2. Find entry point
3. Identify 3 main functions
4. Document function purposes

### Exercise 2: Security Audit
Analyze program untuk vulnerabilities:
1. Check for missing signer checks
2. Find potential integer overflows
3. Verify owner checks
4. Document findings

### Exercise 3: Advanced Scripting
Write Ghidra script untuk:
1. Find all CPI calls
2. List functions with external calls
3. Generate call graph
4. Export report

---

## Troubleshooting

### Issue: Decompilation Failed
```
Solution:
1. Check base address (try 0x100000000)
2. Verify correct language (eBPF:LE:64:Solana)
3. Re-run auto-analysis
4. Update Ghidra extension
```

### Issue: Missing Functions
```
Solution:
1. Analysis → Auto Analyze
2. Enable "Function Start Search"
3. Manually create functions (F key)
4. Check for stripped symbols
```

### Issue: Incorrect Relocations
```
Solution:
1. Specify base address during import
2. Don't rebase after import
3. Check relocation table with readelf
```

---

## Summary

Kamu sekarang bisa:
- ✅ Setup Ghidra untuk Solana eBPF
- ✅ Download program binaries dari blockchain
- ✅ Decompile dan analyze programs
- ✅ Identify security vulnerabilities
- ✅ Perform security audits
- ✅ Use Ghidra scripting untuk automation

Reverse engineering adalah skill penting untuk security researchers dan auditors. Practice dengan real programs untuk improve your skills!

---

## Next Steps
- Module 16: Solana Mobile Development
- Practice dengan bug bounty programs
- Join security audit competitions
- Contribute to open source security tools

Happy Hacking! 🔍🛡️
