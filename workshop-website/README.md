# Solana Workshop Website

Website untuk workshop "Optimizing Solana Fullstack Development dengan Kiro, OpenClaw, dan Ollama".

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Material Symbols (Google Fonts)
- **Language**: TypeScript

## Color Palette

```css
--dark-bg: #222831        /* Background utama */
--dark-card: #393E46      /* Card background */
--dark-lighter: #3A4750   /* Border & divider */
--primary: #00ADB5        /* Primary accent (cyan) */
--primary-accent: #D65A31 /* Secondary accent (orange) */
--dark-text: #EEEEEE      /* Text color */
--primary-dark: #303841   /* Dark primary */
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm atau yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
workshop-website/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout dengan Navigation & Footer
│   │   ├── page.tsx            # Homepage
│   │   ├── modules/
│   │   │   └── page.tsx        # All modules page
│   │   ├── quick-start/
│   │   │   └── page.tsx        # Quick start guide
│   │   └── quick-reference/
│   │       └── page.tsx        # Quick reference cheat sheet
│   └── components/
│       ├── Navigation.tsx      # Top navigation bar
│       ├── Footer.tsx          # Footer dengan links
│       └── MaterialIcon.tsx    # Material Icons helper
├── public/
│   ├── Logo-White.png          # Superteam logo
│   ├── LogoHorizontal-White.png
│   └── LogoWhiteVar1.png
└── tailwind.config.ts          # Tailwind configuration
```

## Features

### Pages

1. **Homepage** (`/`)
   - Hero section dengan CTA
   - Stats showcase
   - Features overview
   - Learning paths
   - Tech stack
   - CTA section

2. **Modules** (`/modules`)
   - Grid of all 10 workshop modules
   - Module details (duration, level, topics)
   - Learning path recommendations

3. **Quick Start** (`/quick-start`)
   - 5-step quick start guide
   - Prerequisites checklist
   - Command examples
   - Next steps

4. **Quick Reference** (`/quick-reference`)
   - Cheat sheet untuk common commands
   - Kiro, Solana CLI, Anchor, OpenClaw, Ollama
   - Hook examples
   - Pro tips

### Components

- **Navigation**: Responsive navbar dengan mobile menu
- **Footer**: Links ke resources dan social media
- **MaterialIcon**: Helper component untuk Material Symbols
- **WalletConnect**: Solana wallet integration (Phantom, Solflare)
- **AI Assistant**: Interactive chat dengan Ollama untuk development help
- **Animations**: Smooth scroll animations dengan Anime.js
- **Brand Logos**: Dynamic logo loading dengan Brandfetch API

## AI Assistant

Website includes an AI Assistant powered by Ollama that can help with:
- Solana development questions
- Kiro, OpenClaw, and Ollama usage
- Code examples and best practices
- Troubleshooting and debugging

### Setup Ollama

See [OLLAMA-SETUP.md](./OLLAMA-SETUP.md) for detailed setup instructions.

**Quick Start:**
```bash
# Install Ollama
brew install ollama  # macOS
# or visit ollama.com/download

# Start service
ollama serve

# Pull model
ollama pull gpt-oss:120b-cloud

# Start dev server
npm run dev
```

The AI Assistant will appear as a floating button in the bottom-right corner.

## Customization

### Adding New Pages

1. Create new folder di `src/app/`
2. Add `page.tsx` file
3. Export default React component
4. Update Navigation links jika perlu

### Changing Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  'dark-bg': '#222831',
  'dark-card': '#393E46',
  // ... etc
}
```

### Adding Material Icons

```tsx
import MaterialIcon from '@/components/MaterialIcon';

<MaterialIcon icon="rocket_launch" size={24} className="text-primary" />
```

Browse icons: https://fonts.google.com/icons

## Development Tips

- Use `className="card"` untuk consistent card styling
- Use `className="btn-primary"` atau `btn-secondary` untuk buttons
- Material Icons loaded dari Google Fonts (no package needed)
- Dark theme optimized untuk readability

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

```bash
# Build
npm run build

# Output di .next/ folder
# Deploy .next/ folder ke hosting platform
```

## License

MIT

## Credits

- Workshop content by [Your Name]
- Built with Next.js & Tailwind CSS
- Icons by Google Material Symbols
- Logos by Superteam
