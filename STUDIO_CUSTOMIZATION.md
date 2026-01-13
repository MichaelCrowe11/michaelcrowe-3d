# Crowe Logic Studio - Customization Guide

This document explains how to customize the design tokens, background elements, and module cards in Crowe Logic Studio.

## Design System Overview

Crowe Logic Studio uses a **Cosmic Glass Console** aesthetic with:
- Deep black "space" background
- Starfield + orbit rings + floating glossy blobs
- Neon accents (cyan/teal + violet/magenta)
- Glassmorphism with frosted panels, soft blur, and gentle edge bloom

## Where to Edit

### 1. Design Tokens (Colors & Effects)

**File:** `src/app/globals.css`

```css
:root {
  /* Core background colors */
  --bg: #030303;
  --bg-elevated: #0a0a0a;
  
  /* Glass panel colors */
  --panel: rgba(255, 255, 255, 0.03);
  --panel-hover: rgba(255, 255, 255, 0.05);
  --panel-border: rgba(255, 255, 255, 0.08);
  --panel-border-hover: rgba(255, 255, 255, 0.15);
  
  /* Text colors */
  --text: #ededed;
  --text-muted: rgba(255, 255, 255, 0.7);
  --text-subtle: rgba(255, 255, 255, 0.5);
  
  /* Neon accent colors */
  --cyan: #22d3ee;
  --violet: #8b5cf6;
  --magenta: #d946ef;
  --emerald: #10b981;
  
  /* Glow effects */
  --glow-cyan: 0 0 20px rgba(34, 211, 238, 0.3);
  --glow-violet: 0 0 20px rgba(139, 92, 246, 0.3);
}
```

**To customize:**
- Change `--cyan`, `--violet`, etc. to adjust accent colors
- Modify `--panel` values to make glass more/less opaque
- Adjust `--glow-*` values to increase/decrease glow intensity

### 2. Background Elements

#### OrbitBackground (Starfield + Orbit Rings)

**File:** `src/components/studio/OrbitBackground.tsx`

Key customizations:
```typescript
// Number of stars
for (let i = 0; i < 200; i++) { // Change 200 to more/fewer stars
  
// Orbit ring configuration
const rings = [
  { radius: 300, speed: 0.0003, color: 'rgba(34, 211, 238, 0.15)' },
  { radius: 450, speed: 0.0002, color: 'rgba(139, 92, 246, 0.1)' },
  // Add more rings or change properties
];
```

#### FloatingBlobs

**File:** `src/components/studio/FloatingBlobs.tsx`

Key customizations:
```typescript
// Number of blobs (default 3)
<FloatingBlobs count={3} />

// Blob gradients
const gradients = [
  'from-cyan-500/20 to-emerald-500/10',
  'from-violet-500/20 to-magenta-500/10',
  'from-emerald-500/20 to-cyan-500/10',
];

// Animation duration (20-30 seconds)
duration: 20 + Math.random() * 10
```

### 3. Module Cards

**File:** `src/components/studio/StudioHero.tsx`

To add a new module card:
```typescript
const modules = [
  {
    title: 'Your Module Name',
    description: 'Brief description of what this module does',
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {/* Your SVG path here */}
      </svg>
    ),
    freeTier: '3 min free', // Free tier info
    price: '$0.75/min', // Pricing
    href: '/studio/your-module', // Route
    accentColor: 'cyan', // Color theme
  },
  // ... other modules
];
```

Available accent colors: `cyan`, `violet`, `emerald`, `amber`

### 4. Branding

#### Brand Pill (Top-left)

**Files:**
- Homepage: `src/components/studio/StudioHero.tsx`
- Studio pages: Individual page files

```tsx
<div className="fixed top-6 left-6 z-20 flex items-center gap-3 px-3 py-2 glass-button rounded-full">
  <div className="w-10 h-10 rounded-full overflow-hidden">
    <img src="/crowe-avatar.png" alt="Crowe Logic" />
  </div>
  <div>
    <div className="text-sm font-bold text-white">MichaelCrowe.ai</div>
    <div className="text-[10px] text-cyan-400">AI CONSULTANT</div>
  </div>
</div>
```

To customize:
- Replace `/crowe-avatar.png` with your avatar image
- Change `MichaelCrowe.ai` to your domain
- Modify `AI CONSULTANT` label text

### 5. Animation & Motion

#### Disable Animations (Accessibility)

Animations automatically respect `prefers-reduced-motion`. To adjust:

**File:** `src/app/globals.css`

```css
@media (prefers-reduced-motion: reduce) {
  .animate-float,
  .animate-float-slow,
  .animate-pulse-glow,
  .animate-shimmer,
  .animate-orbit {
    animation: none;
  }
}
```

#### Adjust Animation Speeds

**Blob float speed:**
- File: `src/components/studio/FloatingBlobs.tsx`
- Change `duration: 20 + Math.random() * 10` (seconds)

**Orbit rotation speed:**
- File: `src/components/studio/OrbitBackground.tsx`
- Change `speed` values in `rings` array

### 6. Glass Effects

To adjust glassmorphism strength:

**File:** `src/app/globals.css`

```css
.glass-card {
  background: var(--panel); /* Opacity */
  backdrop-filter: blur(20px); /* Blur amount */
  border: 1px solid var(--panel-border); /* Border opacity */
}
```

Increase blur for more frosted effect, decrease for more transparent.

### 7. Typography

**File:** `src/app/layout.tsx`

Current fonts:
- Sans: Inter (body text)
- Display: Space Grotesk (headlines)

To change fonts, modify the imports:
```typescript
import { Inter, Space_Grotesk } from "next/font/google";
```

## Component Usage Examples

### GlowButton

```tsx
import { GlowButton } from '@/components/studio/GlowButton';

<GlowButton variant="primary" size="lg" onClick={handleClick}>
  Button Text
</GlowButton>
```

Variants: `primary`, `secondary`, `ghost`
Sizes: `sm`, `md`, `lg`

### PillTag

```tsx
import { PillTag } from '@/components/studio/PillTag';

<PillTag variant="cyan">3 min free</PillTag>
```

Variants: `cyan`, `violet`, `emerald`, `amber`

### StatusOrb

```tsx
import { StatusOrb } from '@/components/studio/StatusOrb';

<StatusOrb status="listening" />
```

States: `ready`, `connecting`, `listening`

### Toast

```tsx
import { Toast } from '@/components/studio/Toast';

<Toast 
  message="Failed to start session. Please try again." 
  type="error" 
/>
```

Types: `error`, `success`, `info`

## Performance Tips

1. **Reduce blob count** on mobile: Check viewport size and conditionally render fewer blobs
2. **Lower star count** for better performance: Change from 200 to 100-150 stars
3. **Disable animations** on low-end devices: Use `prefers-reduced-motion` media query

## Troubleshooting

### Blobs not visible
- Check z-index (should be 0 or above for blobs)
- Verify opacity values in gradient classes
- Ensure blur is not too high

### Glass effect not working
- Check `backdrop-filter` browser support
- Verify `-webkit-backdrop-filter` is included
- Ensure there's content behind the glass element

### Animations stuttering
- Reduce number of animated elements
- Use CSS transforms instead of layout properties
- Enable GPU acceleration with `will-change: transform`

## Further Customization

All Studio components are located in:
```
src/components/studio/
```

Routes are in:
```
src/app/studio/
```

Feel free to modify any component to match your brand aesthetic while maintaining the cosmic glass console language.
