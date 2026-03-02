# Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

### Build Status
- ✅ Production build successful (`npm run build`)
- ✅ No TypeScript errors
- ✅ All dependencies installed
- ⚠️ Minor warning: pino-pretty (non-critical, optional logging dependency)

### Environment Variables Required

Set these in Vercel Dashboard → Project Settings → Environment Variables:

1. **OPENROUTER_API_KEY** (Required for AI Audit feature)
   - Get from: https://openrouter.ai/keys
   - Used by: `/api/audit` endpoint
   - Example: `sk-or-v1-...`

2. **NEXT_PUBLIC_SITE_URL** (Optional)
   - Your production URL
   - Used for: OpenRouter rankings
   - Example: `https://your-site.vercel.app`

3. **OLLAMA_API_URL** (Optional - for local development only)
   - Not needed in production if using hosted Ollama
   - Default: `http://localhost:11434`

### Features Status

| Feature | Status | Notes |
|---------|--------|-------|
| Homepage with ColorBends | ✅ | WebGL animation working |
| Module System (12 modules) | ✅ | Dynamic routing + markdown |
| Wallet Connect | ✅ | Solana wallet adapter |
| AI Assistant (Ollama) | ✅ | Requires Ollama setup |
| AI Security Auditor | ✅ | Requires OpenRouter API key |
| Progress Tracking | ✅ | localStorage-based |
| Achievement System | ✅ | CSS animations only |
| Dashboard | ✅ | Analytics + progress |

## 🚀 Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### 2. Import to Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Framework Preset: Next.js (auto-detected)
4. Root Directory: `workshop-website`
5. Build Command: `npm run build` (default)
6. Output Directory: `.next` (default)

### 3. Configure Environment Variables
In Vercel Dashboard:
- Add `OPENROUTER_API_KEY` (required)
- Add `NEXT_PUBLIC_SITE_URL` (optional)
- Skip `OLLAMA_API_URL` for production

### 4. Deploy
Click "Deploy" and wait for build to complete (~2-3 minutes)

## 🔧 Post-Deployment Configuration

### Ollama Setup (Optional)
If you want the AI Assistant to work in production:
1. Host Ollama on a server (Railway, DigitalOcean, etc.)
2. Update `OLLAMA_API_URL` environment variable
3. Ensure CORS is configured on Ollama server

### Domain Setup
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update `NEXT_PUBLIC_SITE_URL` to match

## 🧪 Testing Production Build Locally

```bash
cd workshop-website
npm run build
npm run start
```

Visit http://localhost:3000 to test production build

## 📊 Performance Optimization

Current bundle sizes:
- Homepage: 326 KB (includes Three.js for ColorBends)
- Module pages: ~95 KB
- Dashboard: 98 KB
- Audit page: 89.5 KB

All pages are statically generated (SSG) except API routes.

## 🐛 Known Issues

1. **pino-pretty warning**: Non-critical, optional dependency for wallet adapter logging
2. **Ollama in production**: Requires separate hosting, not included in Vercel deployment
3. **ColorBends performance**: May be heavy on mobile devices (consider disabling on mobile)

## 🎯 Recommended Vercel Settings

- **Node.js Version**: 18.x or higher
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Framework**: Next.js

## 📝 Notes

- All static assets are in `/public` directory
- Markdown content is in module folders (01-skills-solana, etc.)
- Progress tracking uses localStorage (client-side only)
- AI features require API keys to function

## ✅ Ready for Deployment!

Your website is production-ready and can be deployed to Vercel now.
