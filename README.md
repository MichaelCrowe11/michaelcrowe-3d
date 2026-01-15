This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- **Next.js 16** with App Router
- **React 19** with advanced features
- **Tailwind CSS v4** for styling
- **Three.js/R3F** for 3D graphics
- **AI Avatars** with Simli and ElevenLabs
- **MCP (Model Context Protocol)** host via API routes
- **Custom Agent Interfaces** with unique theming per agent

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Custom Agent Interfaces

This application features custom interfaces for each AI agent with unique:

- **Themes**: Agent-specific colors, gradients, and visual effects
- **Suggested Topics**: Contextual conversation starters per agent
- **Orb Animations**: Multiple animation styles (standard, animated, pulsing, morphing)
- **Background Styles**: Custom environments per agent type

### Available Agents

1. **Cultivation Intelligence** - Commercial mushroom cultivation mastery
2. **Sales Director** - Automated CRM & lead qualification
3. **AI Strategy Advisor** - Enterprise AI implementation
4. **Extraction & Formulation** - Natural product extraction science
5. **Mycology Research** - Fungal biology & bioactive compounds
6. **Computational Chemist** - Molecular modeling & quantum chemistry
7. **Drug Discovery Specialist** - Target to clinic pathway

### Testing Agent Interfaces

```bash
npm run test:agents
```

This utility script helps you preview and test agent-specific interfaces during development.

### Customizing Agent Interfaces

Edit `src/config/agentInterfaces.ts` to customize:

- Theme colors and gradients
- Suggested conversation topics
- Animation styles
- Custom features (visualizers, transcripts, etc.)

Changes hot-reload automatically during development.

## Using Forked ElevenLabs Packages

See [docs/ELEVENLABS_FORKS.md](docs/ELEVENLABS_FORKS.md) for detailed instructions on using custom forked versions of ElevenLabs packages for enhanced customization.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
