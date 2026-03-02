# Hooks - Automation untuk Solana Development

## Apa itu Hooks?

Hooks memungkinkan Kiro untuk execute actions secara otomatis berdasarkan events di IDE. Untuk Solana development, ini sangat powerful untuk maintain code quality, security, dan testing.

## Event Types

### File Events
- `fileEdited` - Saat file di-save (auto-lint, auto-test)
- `fileCreated` - Saat file baru dibuat (template injection)
- `fileDeleted` - Saat file dihapus (cleanup)

### Agent Events
- `promptSubmit` - Saat message dikirim ke agent
- `agentStop` - Saat agent execution selesai
- `preToolUse` - Sebelum tool dijalankan (security checks)
- `postToolUse` - Setelah tool dijalankan (verification)

### Task Events
- `preTaskExecution` - Sebelum spec task dimulai (setup)
- `postTaskExecution` - Setelah spec task selesai (testing)

### Manual
- `userTriggered` - User manually trigger (deploy, build)

## Action Types

### askAgent
Kirim message ke agent untuk reminder atau review
```json
{
  "type": "askAgent",
  "prompt": "Review this Anchor program for security issues"
}
```

### runCommand
Execute shell command
```json
{
  "type": "runCommand",
  "command": "anchor test"
}
```

## Solana-Specific Use Cases

### 1. Auto-Test Anchor Programs
Run tests setiap kali program file di-save

```json
{
  "name": "Test Anchor Program",
  "version": "1.0.0",
  "when": {
    "type": "fileEdited",
    "patterns": ["programs/**/*.rs"]
  },
  "then": {
    "type": "runCommand",
    "command": "anchor test"
  }
}
```

### 2. Security Review Before Deploy
Review program sebelum deployment

```json
{
  "name": "Security Review",
  "version": "1.0.0",
  "when": {
    "type": "preToolUse",
    "toolTypes": ["write"]
  },
  "then": {
    "type": "askAgent",
    "prompt": "Review this Solana program for: 1) Signer verification 2) Account ownership checks 3) Integer overflow 4) Reentrancy guards 5) PDA validation"
  }
}
```

### 3. Auto-Generate Client After IDL Change
Generate TypeScript client saat IDL berubah

```json
{
  "name": "Generate Client",
  "version": "1.0.0",
  "when": {
    "type": "fileEdited",
    "patterns": ["target/idl/*.json"]
  },
  "then": {
    "type": "runCommand",
    "command": "npm run codegen"
  }
}
```

### 4. Lint Frontend Code
Auto-lint React/Next.js files

```json
{
  "name": "Lint Frontend",
  "version": "1.0.0",
  "when": {
    "type": "fileEdited",
    "patterns": ["src/**/*.{ts,tsx}"]
  },
  "then": {
    "type": "runCommand",
    "command": "npm run lint:fix"
  }
}
```

### 5. Test After Spec Task
Run integration tests setelah complete spec task

```json
{
  "name": "Integration Test",
  "version": "1.0.0",
  "when": {
    "type": "postTaskExecution"
  },
  "then": {
    "type": "runCommand",
    "command": "npm run test:integration"
  }
}
```

### 6. Build Verification
Verify build sebelum commit

```json
{
  "name": "Build Check",
  "version": "1.0.0",
  "when": {
    "type": "userTriggered"
  },
  "then": {
    "type": "runCommand",
    "command": "anchor build && npm run build"
  }
}
```

### 7. Transaction Review
Review transaction building code

```json
{
  "name": "Review Transaction",
  "version": "1.0.0",
  "when": {
    "type": "fileEdited",
    "patterns": ["**/transactions/*.ts"]
  },
  "then": {
    "type": "askAgent",
    "prompt": "Review this transaction code for: 1) Proper fee payer 2) Recent blockhash 3) Compute budget 4) Signer verification 5) Error handling"
  }
}
```

## Cara Setup

### Via Command Palette
1. Open Command Palette (Cmd+Shift+P)
2. Search "Open Kiro Hook UI"
3. Create new hook dengan visual builder

### Via Explorer View
1. Open "Agent Hooks" section di sidebar
2. Click "+" untuk create new hook
3. Configure event dan action

### Manual Edit
Create JSON file di `.kiro/hooks/`

## Best Practices untuk Solana

1. **Test Early, Test Often**
   - Hook untuk auto-test setiap file change
   - Separate hooks untuk unit vs integration tests

2. **Security First**
   - Always review before write operations
   - Check security patterns di program code
   - Verify transaction parameters

3. **Fast Feedback**
   - Use LiteSVM untuk fast unit tests
   - Lint immediately on save
   - Show errors in real-time

4. **Deployment Safety**
   - Review before deploy to devnet
   - Double-check before mainnet
   - Verify program upgrades

5. **Code Quality**
   - Auto-format Rust code
   - Lint TypeScript/React
   - Check for common mistakes

## Example Workflow

```
1. Edit Anchor program (programs/my_program/src/lib.rs)
   → Hook triggers: anchor test
   
2. Tests pass, update IDL
   → Hook triggers: codegen (generate TS client)
   
3. Edit frontend component (src/components/Swap.tsx)
   → Hook triggers: lint + type check
   
4. Complete spec task
   → Hook triggers: integration tests
   
5. Ready to deploy
   → Manual hook: security review + build verification
```

## Monitoring Hooks

- View active hooks di "Agent Hooks" panel
- Check hook execution logs
- Disable hooks temporarily jika needed
- Update hooks as workflow evolves

