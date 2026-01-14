# ElevenLabs Forked Repositories Configuration

This document explains how to use custom forked versions of ElevenLabs packages instead of the standard npm packages.

## Overview

The application now supports custom agent interfaces and can use forked ElevenLabs packages for enhanced customization and development optimization.

## Using Forked Repositories

### Option 1: GitHub URLs in package.json

Replace the standard npm packages with GitHub repository URLs:

```json
{
  "dependencies": {
    "@elevenlabs/client": "github:YourUsername/elevenlabs-client#branch-or-tag",
    "@elevenlabs/react": "github:YourUsername/elevenlabs-react#branch-or-tag"
  }
}
```

### Option 2: Local Development with npm link

For local development of forked packages:

```bash
# In the forked package directory
cd /path/to/your/elevenlabs-client-fork
npm link

# In this project directory
cd /path/to/michaelcrowe-3d
npm link @elevenlabs/client
```

### Option 3: Git Submodules

Add forked repositories as git submodules:

```bash
git submodule add https://github.com/YourUsername/elevenlabs-client.git vendor/elevenlabs-client
git submodule add https://github.com/YourUsername/elevenlabs-react.git vendor/elevenlabs-react
```

Then reference them in package.json:

```json
{
  "dependencies": {
    "@elevenlabs/client": "file:./vendor/elevenlabs-client",
    "@elevenlabs/react": "file:./vendor/elevenlabs-react"
  }
}
```

## Custom Agent Interfaces

The application now includes custom interfaces for each agent type:

### Configuration

Agent-specific configurations are defined in `src/config/agentInterfaces.ts`:

- **Theme customization**: Colors, gradients, and glow effects
- **Suggested topics**: Agent-specific conversation starters
- **Orb styles**: Different animation styles (standard, animated, pulsing, morphing)
- **Background styles**: Custom backgrounds per agent type
- **Custom features**: Toggle visualizers, transcripts, and real-time data

### Components

New custom interface components in `src/components/agents/interfaces/`:

1. **CustomVoiceConversation.tsx**: Main conversation interface with agent-specific theming
2. **CustomStatusOrb.tsx**: Animated status orb with multiple style options
3. **CustomSuggestedTopics.tsx**: Dynamic topic suggestions per agent

### Usage

The custom interfaces are automatically applied based on the agent ID:

```typescript
import { CustomVoiceConversation } from '@/components/agents/interfaces/CustomVoiceConversation';

<CustomVoiceConversation agent={selectedAgent} onEnd={handleEnd} />
```

## Development Optimizations

### Type Safety

All agent interfaces are fully typed with TypeScript interfaces:

- `AgentInterfaceTheme`: Color and visual theme configuration
- `AgentInterfaceConfig`: Complete agent interface configuration
- Helper functions: `getAgentInterfaceConfig()`, `getAgentTheme()`

### Hot Reload

Agent configurations can be modified in `src/config/agentInterfaces.ts` and will hot-reload during development.

### Component Reusability

The new architecture separates concerns:

- **Configuration**: Centralized in `agentInterfaces.ts`
- **Presentation**: Reusable UI components
- **Logic**: Shared conversation management

### Testing Individual Agents

To test a specific agent interface:

1. Navigate to the agent selector
2. Select the agent you want to test
3. The custom interface will load with agent-specific theming

## Switching to Forked Packages

### Step 1: Fork the ElevenLabs Packages

1. Fork `elevenlabs/elevenlabs-js` (contains both client and react)
2. Make your custom modifications
3. Push to your fork

### Step 2: Update package.json

```json
{
  "dependencies": {
    "@elevenlabs/client": "github:YourUsername/elevenlabs-js#main",
    "@elevenlabs/react": "github:YourUsername/elevenlabs-js#main"
  }
}
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Verify

```bash
npm list @elevenlabs/client
npm list @elevenlabs/react
```

## Troubleshooting

### Issue: Fork not updating

**Solution**: Clear npm cache and reinstall
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: Type definitions missing

**Solution**: Ensure your fork includes TypeScript definitions or add them locally

### Issue: Build errors with forked packages

**Solution**: Check that your fork is compatible with the version requirements in package.json

## Additional Resources

- [npm package.json documentation](https://docs.npmjs.com/cli/v9/configuring-npm/package-json)
- [Using git dependencies](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#git-urls-as-dependencies)
- [ElevenLabs API documentation](https://elevenlabs.io/docs)

## Next Steps

1. Create your forks of ElevenLabs packages
2. Update `package.json` with your fork URLs
3. Run `npm install`
4. Test each agent interface
5. Customize further as needed
