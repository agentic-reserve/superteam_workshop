# Example: Token Swap UI Iteration

Real-world example of the Generate → Experience → Critique → Regenerate loop.

## Initial Prompt (60 seconds)

```
You: "Build a token swap interface for Solana mobile.
      - Use @solana/kit for transactions
      - Helius for token data and priority fees
      - Modern glassmorphism design
      - Bottom sheet for token selection
      - Large touch targets for mobile"
```

**Kiro Response:**
```
[Activates: solana-kit, helius, vercel-react-best-practices]

Creating:
- SwapInterface.tsx (main component)
- TokenSelector.tsx (bottom sheet)
- useSwap.ts (transaction logic)
- useTokenPrice.ts (real-time pricing)
```

## Generated Code (Initial)

```typescript
// SwapInterface.tsx (simplified)
export function SwapInterface() {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6">
      <TokenInput label="From" />
      <SwapButton />
      <TokenInput label="To" />
      <PriceDisplay />
      <SlippageSettings />
      <ExecuteSwapButton />
    </div>
  );
}
```

## Experience Phase (Test on Mobile)

**Observations:**
- ✅ Glassmorphism looks great
- ✅ Backdrop blur works well
- ❌ Token selector hard to tap
- ❌ Swap button too small
- ❌ Price updates too slow
- ⚠️ No loading states

## Critique Prompt (30 seconds)

```
You: "Review this screenshot and SwapInterface.tsx.

Issues:
1. Token selector buttons are too small (currently 36px)
2. Swap button needs to be more prominent
3. Add loading skeleton for price
4. Increase all touch targets to minimum 48px

Keep the glassmorphism aesthetic."
```

**Kiro Response:**
```
Analyzing screenshot and component...

Changes:
1. TokenSelector buttons: 36px → 56px
2. SwapButton: Added gradient, increased size
3. PriceDisplay: Added skeleton loader
4. All interactive elements: minimum 48px
5. Added haptic feedback on tap
```

## Regenerated Code

```typescript
// SwapInterface.tsx (improved)
export function SwapInterface() {
  const { loading } = useSwap();
  
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6">
      {/* Larger touch targets */}
      <TokenInput 
        label="From" 
        buttonSize="56px"  // Increased
        onTap={hapticFeedback}
      />
      
      {/* More prominent swap button */}
      <SwapButton 
        className="bg-gradient-to-r from-purple-500 to-blue-500"
        size="lg"  // 48px minimum
      />
      
      <TokenInput 
        label="To" 
        buttonSize="56px"
        onTap={hapticFeedback}
      />
      
      {/* Loading skeleton */}
      {loading ? (
        <PriceSkeleton />
      ) : (
        <PriceDisplay />
      )}
      
      <SlippageSettings />
      
      {/* Larger execute button */}
      <ExecuteSwapButton 
        size="xl"  // 56px height
        className="w-full"
      />
    </div>
  );
}
```

## Branch Exploration (2 minutes)

### Branch A: Keep Current Design
```
Current glassmorphism with improvements
```

### Branch B: Try Solid Backgrounds
```
You: "Same component but with solid backgrounds instead of glass"

Kiro: → Removes backdrop-blur
      → Adds solid colors
      → Adjusts contrast
```

### Branch C: Bottom Sheet Variant
```
You: "Move token selector to bottom sheet like Uniswap"

Kiro: → Creates BottomSheet component
      → Adds slide-up animation
      → Improves mobile UX
```

## Final Composition (1 minute)

```
You: "Take the glassmorphism from Branch A,
      the bottom sheet from Branch C,
      and the prominent swap button from Branch B"

Kiro: → Merges best parts
      → Ensures consistency
      → Tests on mobile
```

## Final Result

```typescript
export function SwapInterface() {
  const [showTokenSelector, setShowTokenSelector] = useState(false);
  const { loading, swap } = useSwap();
  
  return (
    <>
      {/* Glassmorphism container (Branch A) */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6">
        
        {/* Large touch targets */}
        <TokenButton 
          onClick={() => setShowTokenSelector(true)}
          size="56px"
        />
        
        {/* Prominent swap button (Branch B) */}
        <SwapButton 
          className="bg-gradient-to-r from-purple-500 to-blue-500 
                     shadow-lg shadow-purple-500/50"
          size="lg"
        />
        
        <TokenButton 
          onClick={() => setShowTokenSelector(true)}
          size="56px"
        />
        
        {loading ? <PriceSkeleton /> : <PriceDisplay />}
        
        <ExecuteSwapButton 
          onClick={swap}
          size="xl"
          className="w-full"
        />
      </div>
      
      {/* Bottom sheet (Branch C) */}
      <BottomSheet 
        open={showTokenSelector}
        onClose={() => setShowTokenSelector(false)}
      >
        <TokenList />
      </BottomSheet>
    </>
  );
}
```

## Metrics

**Time Breakdown:**
- Initial generation: 60 seconds
- First iteration: 30 seconds
- Branch exploration: 2 minutes
- Final composition: 1 minute
- **Total: ~4 minutes**

**Traditional Approach:**
- Design in Figma: 4 hours
- Implement: 8 hours
- Revisions: 2 hours
- **Total: 14 hours**

**Improvement: 210x faster**

## Key Takeaways

1. **Start with a good prompt** - Be specific about requirements
2. **Experience before critiquing** - Test on actual device
3. **Screenshot + component ref** - Precise feedback
4. **Branch freely** - Don't perfect one design
5. **Compose the best parts** - Design as remix

## Next Iteration

If you wanted to continue:

```
You: "Add animation when swapping tokens"
You: "Show transaction history below"
You: "Add dark mode toggle"
You: "Optimize for tablet layout"
```

Each iteration: 30-60 seconds.

**The handoff is dead. Long live the riff.**
