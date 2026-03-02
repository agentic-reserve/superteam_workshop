# Modern Design-to-Code Workflow

## The Paradigm Shift

**The Old Way:**
```
Designer → Figma → Spec → Developer → "That's not what I meant" → Repeat
```

**The New Way:**
```
Idea → Generate → Experience → Critique → Regenerate → Ship
```

The gap between "I know what I want" and "I have it" went from weeks to **minutes**.

## The Collapse of Traditional Handoff

### Before
- 60 hours: Design in Figma
- 40 hours: Write specs
- 80 hours: Implement
- 20 hours: Revisions
- **Total: 200 hours**

### Now with Kiro + Skills
- 60 seconds: Prompt → working UI
- 30 seconds: Screenshot → revised UI
- ∞ iterations: HTML prototype → React/Expo
- **Total: Minutes to hours**

## Design Is Jazz Now

> "Coltrane didn't compose note by note. He improvised within constraints."

Your constraints are:
- **Skills** you have installed
- **Component libraries** in your codebase
- **Design systems** as file systems
- **Context** from your project

## The Feedback Loop

The only workflow you need:

### 1. Generate
```
You: "Build a token swap interface with glassmorphism design"
Kiro: [Activates solana-kit + vercel-react-best-practices]
      → Generates working prototype
```

### 2. Experience
- Click through it
- Feel the interactions
- Test on mobile
- Check performance

### 3. Inspect
- Screenshot the result
- Review component structure
- Check accessibility
- Measure performance

### 4. Critique
```
You: "This isn't right. The swap button should be more prominent.
      Review this component and screenshot, edit to match."
      
Kiro: [Analyzes screenshot + component]
      → Regenerates with improvements
```

### 5. Regenerate
- Iterate until it feels right
- Branch into variants
- Mix and match best parts

## Prototypes Can Be Anything

The format doesn't matter:

✅ HTML page with mock data
✅ Somebody else's website (screenshot)
✅ React artifact
✅ Figma prototype
✅ Variant screens
✅ Annotated screenshot

**Can you experience the app?** If yes, you have enough to iterate.

## The Critique Prompt

The most powerful sentence in your toolkit:

```
"This is not quite right. Review this HTML component and this 
screenshot, and edit it to match more closely."
```

**Formula:**
```
Screenshot + Component ref + Natural language = Precise iteration
```

## Branching, Not Perfecting

Don't iterate on one thing. **Branch into many.**

### Example: Token Swap UI

**Branch 1:** Tailwind + shadcn/ui
```
You: "Build swap UI with shadcn components"
```

**Branch 2:** Chakra UI
```
You: "Same swap UI but with Chakra UI"
```

**Branch 3:** Custom glassmorphism
```
You: "Same swap but with glassmorphism and gradient borders"
```

**Result:** Take the best parts from each:
- Nav from Branch 1
- Cards from Branch 2
- Palette from Branch 3

**Design as remix.**

## Skills Are Instrumental

Installing a skill is a **design decision**.

The skills you install determine the quality ceiling of what your agent produces.

### For Solana dApps

**Essential Skills:**
- `solana-dev` - Architecture patterns
- `solana-kit` - Transaction UX
- `helius` - Real-time data
- `vercel-react-best-practices` - Performance

**Optional Skills:**
- `solana-agent-kit` - AI features
- `pinocchio-development` - Performance optimization
- `web-design-guidelines` - Accessibility

## Your Toolkit for Solana Mobile

| Stage | Tool | What it does | Use with Kiro |
|-------|------|--------------|---------------|
| **Explore** | Variant | Endless design variations | Screenshot → Kiro |
| **Generate** | Kiro + Skills | Prompt → Solana dApp | Direct integration |
| **Generate** | Claude Artifacts | Interactive prototypes | Import to Kiro |
| **Critique** | Agentation | Click → structured feedback | Feed to Kiro |
| **Branch** | Git branches | UI variations | Kiro per branch |
| **Build** | Expo Skills | Correct Expo code | Install in Kiro |
| **Test** | Helius | Real blockchain data | Via helius skill |

## Workflow Example: Token Swap dApp

### Step 1: Generate Initial Prototype
```
You: "Build a Solana token swap interface for mobile.
      Use @solana/kit for transactions, Helius for data.
      Modern glassmorphism design with gradient accents."

Kiro: [Activates: solana-kit, helius, vercel-react-best-practices]
      → Generates SwapInterface.tsx
      → Generates useSwap.ts hook
      → Generates mobile-responsive layout
```

### Step 2: Experience
- Open on mobile simulator
- Test swap flow
- Check loading states
- Verify error handling

### Step 3: Inspect & Screenshot
- Take screenshots of key screens
- Note what feels off
- Check component structure

### Step 4: Critique
```
You: "The token selector is hard to tap on mobile.
      Review this screenshot and TokenSelect.tsx.
      Make touch targets larger, add haptic feedback."

Kiro: → Analyzes screenshot
      → Reviews component
      → Increases button size to 48px
      → Adds haptic feedback
      → Improves spacing
```

### Step 5: Branch & Remix
```
Branch A: Keep glassmorphism
Branch B: Try solid backgrounds
Branch C: Experiment with bottom sheet

Final: Take glassmorphism from A, bottom sheet from C
```

## Live Demo Workflow

### Scenario: Building NFT Marketplace

**1. Initial Prompt (60 seconds)**
```
"Build an NFT marketplace for Solana mobile.
 Grid view, filter by collection, buy with SOL.
 Use Helius DAS API for NFT data."
```

**2. First Iteration (30 seconds)**
```
Screenshot → "Cards too small for mobile, increase size"
```

**3. Branch Exploration (2 minutes)**
```
- Try list view
- Try masonry layout
- Try horizontal scroll
```

**4. Final Composition (1 minute)**
```
"Use masonry layout from Branch 2,
 filter UI from Branch 1,
 buy button from Branch 3"
```

**Total Time: ~4 minutes** from idea to working prototype

## Your Pitch Is Your Demo

Three questions your pitch must answer:

### 1. What does this do?
**One sentence.**
```
"A mobile-first token swap that uses AI to find the best routes."
```

### 2. Why Solana mobile?
**Why now, why here.**
```
"Solana's speed enables instant swaps on mobile.
 Mobile Wallet Adapter makes UX seamless."
```

### 3. Watch this.
**Live demo or walkthrough.**
```
[Open app on phone]
[Connect wallet - 2 taps]
[Swap tokens - 3 taps]
[Confirmed in 400ms]
```

**Problem. Context. Proof. That's it.**

## Best Practices

### Do's ✅
- Generate multiple variants
- Branch freely
- Screenshot everything
- Critique with context
- Mix and match best parts
- Ship fast, iterate faster

### Don'ts ❌
- Don't perfect one design
- Don't skip the experience step
- Don't ignore mobile testing
- Don't forget accessibility
- Don't over-specify upfront

## The Handoff Is Dead

**Old paradigm:**
- Designer makes it pretty
- Developer makes it work
- Handoff in between

**New paradigm:**
- You generate variants
- You experience them
- You ship the best one
- **No handoff needed**

## Long Live The Riff

Design is improvisation within constraints.

Your constraints:
- Solana blockchain capabilities
- Mobile device limitations
- User expectations
- Your installed skills

Your freedom:
- Infinite variants
- Instant iteration
- Real-time feedback
- Ship when it feels right

---

**The handoff is dead. Long live the riff.**

## Resources

- Variant: https://variant.com/community
- Agentation: https://agentation.dev
- Skills.sh: https://skills.sh/trending
- Expo Skills: https://skills.sh/expo/skills

## Next Steps

1. Install relevant skills
2. Generate your first variant
3. Experience it on mobile
4. Critique with screenshots
5. Branch and explore
6. Ship the best remix
