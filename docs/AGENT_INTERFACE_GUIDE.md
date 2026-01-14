# Custom Agent Interface Development Guide

This guide explains how to create and customize agent-specific interfaces in the MichaelCrowe.ai application.

## Architecture Overview

The custom agent interface system consists of three main parts:

1. **Configuration Layer** (`src/config/agentInterfaces.ts`)
2. **Component Layer** (`src/components/agents/interfaces/`)
3. **Integration Layer** (main app pages)

## Creating a New Agent Interface

### Step 1: Define Agent Configuration

Add your agent configuration to `src/config/agentInterfaces.ts`:

```typescript
export const agentInterfaceConfigs: Record<string, AgentInterfaceConfig> = {
  'your-agent-id': {
    id: 'your-agent-id',
    theme: {
      primaryColor: '#22d3ee',      // Main accent color
      secondaryColor: '#10b981',     // Secondary accent color
      accentGradient: 'from-cyan-400 to-emerald-500',
      glowColor: 'rgba(34, 211, 238, 0.5)',
      orbGradient: 'from-cyan-400/70 to-emerald-500/50',
      pulseColor: 'rgba(34, 211, 238, 0.3)',
    },
    suggestedTopics: [
      'Topic 1',
      'Topic 2',
      'Topic 3',
      'Topic 4',
      'Topic 5',
      'Topic 6',
    ],
    welcomeMessage: 'Your custom welcome message',
    orbStyle: 'animated',  // standard | animated | pulsing | morphing
    backgroundStyle: 'default',  // default | cultivation | scientific | corporate | molecular
    customFeatures: {
      showVisualizer: true,
      showTranscript: false,
      enableRealTimeData: false,
    },
  },
  // ... other agents
};
```

### Step 2: Register Agent in agents.ts

Make sure your agent is registered in `src/config/agents.ts`:

```typescript
export const agents: Agent[] = [
  {
    id: 'your-agent-id',
    elevenLabsAgentId: process.env.NEXT_PUBLIC_ELEVEN_LABS_YOUR_AGENT!,
    name: 'Your Agent Name',
    tagline: 'Short description',
    description: 'Detailed description of capabilities',
    category: 'custom',
    icon: 'Sparkles',
    color: 'cyan',
    pricing: {
      perMinute: 0.50,
      packages: [
        { minutes: 60, price: 25, savings: '17%' },
        { minutes: 300, price: 100, savings: '33%' },
      ],
    },
    freeTierMinutes: 5,
    isActive: true,
  },
];
```

### Step 3: Test Your Agent

Run the development server and test:

```bash
npm run dev
```

Or use the agent testing utility:

```bash
npm run test:agents
```

## Customization Options

### Theme Colors

Choose colors that represent your agent's personality:

```typescript
theme: {
  primaryColor: '#22d3ee',      // Main UI elements
  secondaryColor: '#10b981',     // Complementary color
  accentGradient: 'from-cyan-400 to-emerald-500',  // Tailwind gradient classes
  glowColor: 'rgba(34, 211, 238, 0.5)',  // Orb glow effect
  orbGradient: 'from-cyan-400/70 to-emerald-500/50',  // Orb fill gradient
  pulseColor: 'rgba(34, 211, 238, 0.3)',  // Pulse ring color
}
```

### Orb Animation Styles

Choose from four animation styles:

1. **standard**: Simple scale animation when speaking
2. **animated**: Scale + rotation animation
3. **pulsing**: Aggressive pulsing effect
4. **morphing**: Border radius morphing + scale (organic feel)

```typescript
orbStyle: 'morphing'
```

### Background Styles

Pre-configured background themes (future extension point):

- `default`: Standard dark space background
- `cultivation`: Green/organic theme
- `scientific`: Blue/technical theme
- `corporate`: Professional/clean theme
- `molecular`: Particle-based theme

### Suggested Topics

Provide 4-6 contextual topics that users can speak about:

```typescript
suggestedTopics: [
  'Short topic name',
  'Another topic',
  'Third topic',
  'Fourth topic',
]
```

Tips:
- Keep topics under 20 characters
- Use action-oriented language
- Represent core agent capabilities
- Order by importance

### Custom Features

Enable/disable experimental features:

```typescript
customFeatures: {
  showVisualizer: true,      // Audio waveform visualizer
  showTranscript: false,     // Real-time transcript overlay
  enableRealTimeData: false, // Live data feeds during conversation
}
```

## Component Customization

### Extending CustomVoiceConversation

To add custom behavior for a specific agent:

```typescript
// In CustomVoiceConversation.tsx
const agentId = agent.id;

if (agentId === 'your-agent-id') {
  // Custom logic here
}
```

### Creating Agent-Specific Components

Create a dedicated component for complex customizations:

```typescript
// src/components/agents/interfaces/YourAgentInterface.tsx
'use client';

import { CustomVoiceConversation } from './CustomVoiceConversation';

export function YourAgentInterface({ agent, onEnd }) {
  // Custom pre-processing
  
  return (
    <>
      {/* Custom UI elements */}
      <CustomVoiceConversation agent={agent} onEnd={onEnd} />
    </>
  );
}
```

## Advanced: Custom Orb Animations

Add new animation styles in `CustomStatusOrb.tsx`:

```typescript
const getOrbAnimation = () => {
  switch (orbStyle) {
    case 'your-custom-style':
      return isSpeaking ? { 
        scale: [1, 1.2, 0.9, 1.1, 1],
        rotate: [0, 90, 180, 270, 360],
      } : {};
    // ... other cases
  }
};
```

## Performance Considerations

### Heavy Animations

If animations cause performance issues on low-end devices:

```typescript
// Check device capability
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  // Enable full animations
} else {
  // Use simple animations
}
```

### Large Suggested Topics Lists

Keep suggested topics to 6 or fewer for better mobile UX:

```typescript
suggestedTopics: topics.slice(0, 6)  // Limit to 6 topics
```

## Testing Checklist

When creating a new agent interface:

- [ ] Theme colors display correctly
- [ ] Orb animation works smoothly
- [ ] Suggested topics render properly
- [ ] Mobile responsive design
- [ ] Color contrast meets accessibility standards
- [ ] Works with reduced motion preferences
- [ ] Consistent with other agents
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Graceful error handling

## Debugging Tips

### Theme Not Applying

Check that:
1. Agent ID in `agentInterfaces.ts` matches `agents.ts`
2. Theme colors are valid CSS values
3. Component is importing the config correctly

### Orb Not Animating

Verify:
1. `orbStyle` is one of the valid options
2. `isSpeaking` state is updating
3. Framer Motion is installed and working

### Colors Look Wrong

Ensure:
1. Using CSS color format (hex, rgb, rgba)
2. Tailwind gradients use valid color names
3. Alpha channels are between 0 and 1

## Best Practices

1. **Consistent Theming**: Use colors that work well together
2. **Performance**: Test animations on slower devices
3. **Accessibility**: Ensure sufficient color contrast
4. **Mobile First**: Design for small screens first
5. **User Testing**: Get feedback on suggested topics
6. **Documentation**: Comment complex customizations
7. **Type Safety**: Use TypeScript interfaces
8. **Error Handling**: Gracefully handle missing config

## Examples

See existing agent configurations for reference:

- **Cultivation**: Organic, morphing orb with purple/green theme
- **Sales Director**: Professional, pulsing orb with emerald/cyan theme
- **AI Strategy**: Tech-focused, animated orb with cyan/violet theme
- **Extraction**: Scientific, standard orb with amber/pink theme

## Further Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [ElevenLabs API Docs](https://elevenlabs.io/docs)

## Support

For questions or issues:
1. Check existing agent configurations
2. Review component implementations
3. Test with `npm run test:agents`
4. Check browser console for errors
