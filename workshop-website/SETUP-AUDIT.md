# Quick Setup: AI Security Auditor

Setup AI Security Auditor dalam 5 menit.

## Step 1: Install Dependencies

```bash
cd workshop-website
npm install
```

## Step 2: Get OpenRouter API Key

1. Visit https://openrouter.ai/keys
2. Sign up (gratis untuk testing)
3. Create new API key
4. Copy API key

## Step 3: Configure Environment

```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local
nano .env.local
```

Add your API key:

```env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Step 4: Run Development Server

```bash
npm run dev
```

## Step 5: Test Audit Feature

1. Open http://localhost:3000/audit
2. Paste sample code:

```rust
use anchor_lang::prelude::*;

#[program]
pub mod vulnerable {
    use super::*;
    
    pub fn transfer(ctx: Context<Transfer>, amount: u64) -> Result<()> {
        // Vulnerable: no overflow check!
        ctx.accounts.from.balance = ctx.accounts.from.balance - amount;
        ctx.accounts.to.balance = ctx.accounts.to.balance + amount;
        Ok(())
    }
}
```

3. Click "Run Security Audit"
4. Review hasil audit

## Features Available

✅ Security vulnerability detection  
✅ Performance optimization suggestions  
✅ Best practices recommendations  
✅ Multi-language support (Rust, TypeScript)  
✅ Integration dengan Trident, Vipers, cargo-audit, cargo-geiger, checked-math  
✅ Real-time AI analysis dengan OpenRouter  

## OpenRouter Credits

- Free tier: $5 credits untuk testing
- Pay-as-you-go: ~$0.003 per audit
- Models: Claude 3.5 Sonnet, GPT-4, Gemini Pro

## Troubleshooting

### "OpenRouter API error"
- Check API key valid
- Verify internet connection
- Check OpenRouter status

### "Failed to perform audit"
- Verify code syntax
- Check API rate limits
- Try again in a few seconds

## Next Steps

1. Read full documentation: `AUDIT-FEATURE.md`
2. Try different check types
3. Test dengan your own code
4. Integrate ke CI/CD pipeline

## Support

- Discord: [Superteam Indonesia](https://discord.gg/superteam)
- GitHub Issues: Report bugs
- Documentation: Full guide in `AUDIT-FEATURE.md`
