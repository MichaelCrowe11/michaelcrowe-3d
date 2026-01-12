# Design Prompt Library

This document contains AI image generation prompts for creating consistent brand assets for michaelcrowe.ai / Crowe Logic. Use these prompts with tools like Midjourney, DALL-E, or Stable Diffusion to generate cohesive visual elements.

---

## A. Core Style Prompt (Space/Orbit Brand System)

### Base Prompt

```
Dark cosmic UI background, soft starfield with subtle bokeh planets, thin orbital lines like a solar system diagram, modern tech aesthetic, premium consulting vibe, minimal clutter, high negative space, gentle glow, cinematic lighting, 4k, no text, no logos
```

### Variants

**More Minimal**
```
Dark cosmic UI background, soft starfield with subtle bokeh planets, thin orbital lines like a solar system diagram, modern tech aesthetic, premium consulting vibe, more minimal, fewer planets, softer orbits, high negative space, gentle glow, cinematic lighting, 4k, no text, no logos
```

**Higher Contrast**
```
Dark cosmic UI background, soft starfield with subtle bokeh planets, thin orbital lines like a solar system diagram, modern tech aesthetic, premium consulting vibe, higher contrast, sharper orbit lines, less bokeh, minimal clutter, high negative space, gentle glow, cinematic lighting, 4k, no text, no logos
```

**With Accent Glow**
```
Dark cosmic UI background, soft starfield with subtle bokeh planets, thin orbital lines like a solar system diagram, modern tech aesthetic, premium consulting vibe, minimal clutter, high negative space, slight green accent glow, restrained, cinematic lighting, 4k, no text, no logos
```

---

## B. Service Card Icon Set (Cohesive Look)

### Prompt

```
Minimal line icon set, thin stroke, rounded terminals, sci-fi clean, consistent stroke weight, monochrome on dark background, 3 icons: (lab flask), (mycelium/fungal network), (molecular model), no text, SVG style, crisp edges
```

### Usage Notes

- Use for service cards, feature highlights, and category indicators
- Maintain consistent stroke weight across all icons
- Keep icons simple enough to be recognizable at small sizes (24px+)
- Colors should be applied programmatically in code, not in the generated images

---

## C. App Icon Prompt (Very Important)

### Prompt

```
App icon, dark background, simplified mycelium network forming a subtle letter C or delta symbol, premium biotech aesthetic, minimal geometry, high recognizability at small sizes, flat + slight glow, no text, iOS icon proportions
```

### Usage Notes

- Critical for App Store presence
- Must be recognizable at 60x60px (smallest size on iOS)
- Test visibility in both light and dark mode contexts
- Export at 1024x1024px for App Store submission
- Ensure sufficient contrast from background

---

## D. App Store Screenshot Prompt (Marketing Panels)

### Prompt

```
iOS App Store screenshot layout, dark premium UI, headline space at top, 3 feature panels: "Voice-first deep dives", "Pay per minute", "Transcripts + follow-ups", clean typography placeholders only, strong contrast, modern spacing, cinematic background, no real brand names
```

### Usage Notes

- Generate base layouts, then add real copy in design tools
- Required sizes:
  - 6.7" display (iPhone 14 Pro Max, 15 Pro Max): 1290 x 2796 pixels
  - 6.5" display (iPhone 11 Pro Max, XS Max): 1242 x 2688 pixels
  - 5.5" display (iPhone 8 Plus): 1242 x 2208 pixels
- First 3 screenshots are most critical (shown in search results)
- Highlight key value propositions:
  1. Voice-first expert consultation
  2. Pay-per-minute pricing (fairness)
  3. Transcript delivery (value retention)

---

## E. Voice Mode "Live Meter" UI Concept Prompt

### Prompt

```
Mobile voice call interface on dark premium background, large waveform, timer, "free minutes remaining", live cost counter, transcript indicator, big red end button, minimal controls, Apple-like spacing, high legibility
```

### Usage Notes

- Use as inspiration for implementing the real UI component
- Key elements to include:
  - **Timer**: Large, prominent display (MM:SS format)
  - **Cost Meter**: Live cost calculation based on elapsed time
  - **Free Minutes**: Countdown of remaining free tier minutes
  - **Waveform**: Visual feedback that agent is listening/speaking
  - **End Button**: Large, unmissable red button
  - **Transcript Toggle**: Indicator that transcript is being captured
- Ensure all text is at least 16px for legibility
- Use strong contrast ratios (WCAG AA minimum)

---

## F. Feature Illustration Prompts

### Computational Chemistry Visualization

```
Abstract molecular visualization, DFT orbital clouds, quantum chemistry aesthetic, glowing electron density maps, dark background with cyan and emerald gradient accents, scientific but beautiful, modern rendering, no text, 4k
```

### Mushroom Cultivation Science

```
Abstract mycelium network visualization, fungal hyphae branching patterns, organic growth system, dark background with purple and amber gradient accents, microscopic beauty, modern scientific illustration, no text, 4k
```

### AI Strategy Consulting

```
Abstract neural network visualization, connected nodes forming strategic patterns, data flow visualization, dark background with cyan gradient accents, modern tech aesthetic, clean and professional, no text, 4k
```

---

## G. Marketing & Social Media Variants

### Twitter/X Card (1200x630)

```
Dark cosmic background, Crowe Logic brand aesthetic, soft starfield, thin orbital lines, feature highlight in center, premium consulting vibe, space for text overlay at bottom third, modern tech aesthetic, 1200x630 aspect ratio
```

### LinkedIn Banner (1584x396)

```
Dark cosmic professional background, soft starfield with subtle bokeh, thin orbital lines, michaelcrowe.ai branding space, premium consulting aesthetic, space for profile photo, modern tech vibe, wide banner format, minimal
```

### Open Graph Preview

```
Dark premium background, Crowe Logic aesthetic, soft cosmic elements, orbital lines, space for large headline text, voice interface visualization, modern consulting brand, 1200x630 aspect ratio, high contrast for social previews
```

---

## Color Palette Reference

When applying colors to generated assets or implementing in code:

### Primary Colors
- **Cyan**: `#22d3ee` (cyan-400)
- **Emerald**: `#34d399` (emerald-400)

### Accent Colors
- **Purple**: `#a855f7` (purple-500) - Cultivation
- **Amber**: `#fbbf24` (amber-400) - Extraction
- **Rose**: `#fb7185` (rose-400) - Research
- **Indigo**: `#818cf8` (indigo-400) - Computational

### Neutral Grays
- **Background**: `#030303`
- **Card Background**: `rgba(255, 255, 255, 0.05)`
- **Border**: `rgba(255, 255, 255, 0.1)`
- **Text Primary**: `rgba(255, 255, 255, 0.9)`
- **Text Secondary**: `rgba(255, 255, 255, 0.5)`
- **Text Tertiary**: `rgba(255, 255, 255, 0.3)`

---

## Tips for Consistent Generation

1. **Maintain Style Anchors**: Always include "dark cosmic", "premium consulting", and "modern tech aesthetic" in prompts
2. **Avoid Text in Generated Images**: Add text programmatically for flexibility and localization
3. **Test at Multiple Sizes**: Verify assets work at both large (hero) and small (icon) sizes
4. **Consistent Lighting**: Keep "cinematic lighting" and "gentle glow" for brand consistency
5. **Negative Space**: Always emphasize "high negative space" and "minimal clutter"
6. **Export Settings**: Use 4K (3840x2160) for backgrounds, 1024x1024 for icons, exact App Store specs for screenshots

---

## Prompt Iteration Examples

If results aren't matching the brand:

**Too busy/cluttered**
→ Add: "more minimal, reduce visual elements, increase negative space"

**Not premium enough**
→ Add: "luxury consulting aesthetic, higher production value, cinematic quality"

**Wrong mood/tone**
→ Add: "professional consulting environment, enterprise-grade quality, trustworthy"

**Colors too vibrant**
→ Add: "muted accent colors, restrained palette, sophisticated tones"

---

## Version History

- **v1.0** (2026-01-12): Initial design prompt library created
