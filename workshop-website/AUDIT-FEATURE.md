# AI Security Auditor

AI-powered security audit feature untuk Solana smart contracts menggunakan OpenRouter dan security tools terbaik.

## Features

### 1. Multi-Language Support
- **Rust**: Anchor programs, native Solana programs
- **TypeScript**: Client-side code, SDK integration

### 2. Check Types
- **Security**: Vulnerability scanning, exploit detection
- **Performance**: Compute unit optimization, efficiency analysis
- **Best Practices**: Code quality, patterns, documentation
- **Full Audit**: Comprehensive analysis covering all aspects

### 3. Security Tools Integration

#### Trident Fuzzing Framework
- Manually-guided fuzzing untuk Solana programs
- Processing up to 12,000 tx/s
- Stateful fuzzing dengan property-based testing
- Flow-based sequence control
- **Checks**: Overflow, underflow, missing constraints, edge cases

#### Vipers Validation Library
- Assorted checks untuk safer Solana programs
- Account struct validation
- Invariant checking
- Excessive safety checks (Solana's fee model allows this)

#### cargo-audit
- Scan Cargo.lock untuk known vulnerabilities
- Check dependencies untuk security advisories
- CVE database integration

#### cargo-geiger
- Detect unsafe Rust code usage
- Identify potential memory safety issues
- Measure unsafe code coverage

#### checked-math
- Verify proper overflow/underflow handling
- Ensure checked arithmetic operations
- Prevent silent integer overflow bugs

## Setup

### 1. Install Dependencies

```bash
cd workshop-website
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` dan tambahkan OpenRouter API key:

```env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Get OpenRouter API Key

1. Visit https://openrouter.ai/keys
2. Sign up atau login
3. Create new API key
4. Copy key ke `.env.local`

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000/audit

## Usage

### Basic Audit

1. Navigate to `/audit` page
2. Select language (Rust/TypeScript)
3. Select check type (Security/Performance/Best Practices/Full)
4. Paste your code
5. Click "Run Security Audit"

### Example: Audit Anchor Program

```rust
use anchor_lang::prelude::*;

#[program]
pub mod my_program {
    use super::*;
    
    pub fn transfer(ctx: Context<Transfer>, amount: u64) -> Result<()> {
        // Missing overflow check!
        ctx.accounts.from.balance = ctx.accounts.from.balance - amount;
        ctx.accounts.to.balance = ctx.accounts.to.balance + amount;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Transfer<'info> {
    #[account(mut)]
    pub from: Account<'info, TokenAccount>,
    #[account(mut)]
    pub to: Account<'info, TokenAccount>,
}
```

AI akan detect:
- ❌ Integer overflow/underflow vulnerability
- ❌ Missing checked arithmetic
- ❌ No signer validation
- ❌ No owner checks

### Example: Secure Version

```rust
use anchor_lang::prelude::*;

#[program]
pub mod my_program {
    use super::*;
    
    pub fn transfer(ctx: Context<Transfer>, amount: u64) -> Result<()> {
        // ✅ Checked arithmetic
        ctx.accounts.from.balance = ctx.accounts.from.balance
            .checked_sub(amount)
            .ok_or(ErrorCode::InsufficientBalance)?;
            
        ctx.accounts.to.balance = ctx.accounts.to.balance
            .checked_add(amount)
            .ok_or(ErrorCode::Overflow)?;
            
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Transfer<'info> {
    #[account(mut, has_one = authority)]
    pub from: Account<'info, TokenAccount>,
    #[account(mut)]
    pub to: Account<'info, TokenAccount>,
    pub authority: Signer<'info>, // ✅ Signer check
}

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient balance")]
    InsufficientBalance,
    #[msg("Overflow")]
    Overflow,
}
```

## API Reference

### POST /api/audit

Audit code dengan AI-powered security analysis.

**Request Body:**
```json
{
  "code": "string",
  "language": "rust" | "typescript",
  "checkType": "security" | "performance" | "best-practices" | "full"
}
```

**Response:**
```json
{
  "severity": "critical" | "high" | "medium" | "low" | "info",
  "summary": "Brief overview of findings",
  "checks": [
    {
      "tool": "Trident | Vipers | cargo-audit | cargo-geiger | checked-math",
      "status": "pass" | "warning" | "error",
      "message": "Finding description",
      "details": ["detail 1", "detail 2"],
      "recommendation": "How to fix"
    }
  ],
  "score": 0-100,
  "recommendations": ["recommendation 1", "recommendation 2"],
  "language": "rust" | "typescript",
  "checkType": "security" | "performance" | "best-practices" | "full",
  "timestamp": "ISO 8601 timestamp"
}
```

## Security Checks

### Common Vulnerabilities Detected

1. **Integer Overflow/Underflow**
   - Missing checked arithmetic
   - Unsafe math operations
   - Potential wrap-around bugs

2. **Missing Access Controls**
   - No signer checks
   - Missing owner validation
   - Unauthorized account access

3. **Account Validation Issues**
   - Unvalidated account inputs
   - Missing account type checks
   - Incorrect PDA derivation

4. **Reentrancy Vulnerabilities**
   - State changes after external calls
   - Missing reentrancy guards
   - Unsafe CPI patterns

5. **Unsafe Code Patterns**
   - Unsafe Rust blocks
   - Raw pointer usage
   - Memory safety issues

6. **Dependency Vulnerabilities**
   - Known CVEs in dependencies
   - Outdated crate versions
   - Security advisories

## Best Practices

### Before Deployment

- ✅ Run full security audit
- ✅ Test dengan Trident fuzzing
- ✅ Check all dependencies dengan cargo-audit
- ✅ Review unsafe code blocks dengan cargo-geiger
- ✅ Verify checked arithmetic dengan checked-math
- ✅ Add comprehensive test coverage
- ✅ Document security assumptions

### During Development

- ✅ Use checked arithmetic operations
- ✅ Validate all account inputs
- ✅ Add proper access controls
- ✅ Implement error handling
- ✅ Write property-based tests
- ✅ Follow Anchor best practices
- ✅ Regular security audits

### Code Review Checklist

- [ ] All math operations use checked arithmetic
- [ ] Signer checks on all privileged operations
- [ ] Owner validation on account modifications
- [ ] PDA derivation properly validated
- [ ] No unsafe code without justification
- [ ] All dependencies up to date
- [ ] Comprehensive error handling
- [ ] Test coverage > 80%

## Integration with Workshop Skills

Audit feature menggunakan security skills dari workshop:

### vulnhunter Skill
- Vulnerability detection patterns
- Exploit identification
- Security best practices

### zz-code-recon Skill
- Code analysis patterns
- Architecture review
- Security assessment

## OpenRouter Models

Default model: `anthropic/claude-3.5-sonnet`

Alternative models:
- `openai/gpt-4-turbo`
- `google/gemini-pro-1.5`
- `meta-llama/llama-3.1-70b-instruct`

Untuk ganti model, edit `src/app/api/audit/route.ts`:

```typescript
body: JSON.stringify({
  model: 'anthropic/claude-3.5-sonnet', // Change this
  // ...
})
```

## Troubleshooting

### Error: "OpenRouter API error"

1. Check API key di `.env.local`
2. Verify API key valid di https://openrouter.ai/keys
3. Check API rate limits

### Error: "Failed to perform audit"

1. Check code syntax valid
2. Verify network connection
3. Check OpenRouter service status

### Low Audit Score

1. Review security checks
2. Follow recommendations
3. Implement suggested fixes
4. Re-run audit

## Resources

- [Trident Documentation](https://ackee.xyz/trident/docs/latest/)
- [Vipers GitHub](https://github.com/saber-hq/vipers)
- [cargo-audit](https://docs.rs/cargo-audit/)
- [cargo-geiger](https://crates.io/crates/cargo-geiger)
- [checked-math](https://github.com/blockworks-foundation/checked-math)
- [OpenRouter API](https://openrouter.ai/docs)
- [Solana Security Best Practices](https://docs.solana.com/developing/programming-model/security)

## Contributing

Untuk improve audit feature:

1. Add new security patterns
2. Improve AI prompts
3. Add more tools integration
4. Enhance UI/UX
5. Add more examples

## License

MIT License - See LICENSE file for details
