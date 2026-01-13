# Copilot Instructions for michaelcrowe-3d

## Project Overview
This is a **Next.js 16 (App Router)** application running **React 19** and **Tailwind CSS v4**. It features high-end 3D graphics (Three.js/R3F), AI Avatars (Simli/ElevenLabs), and functions as an **MCP (Model Context Protocol) Host** via dedicated API routes.

## Critical Architecture

### 1. MCP Server Endpoints (`src/app/api/mcp`)
The application exposes tools to AI agents via the **Model Context Protocol (MCP)** over HTTP.
- **Location**: `src/app/api/mcp/[service]/route.ts`.
- **Protocol**: Implements JSON-RPC 2.0. Handles `initialize`, `list_tools`, and `call_tool`.
- **Pattern**:
  - Define `TOOLS` array with schemas.
  - Implement a `POST` handler that switches on `body.method`.
  - Return standardized JSON-RPC responses.
  - *Example*: See `src/app/api/mcp/stripe/route.ts` for a complete implementation.

### 2. Service Clients & Lazy Initialization
Services like Supabase and Stripe must be lazily initialized to prevent build-time errors when environment variables are missing.
- **Pattern**: Use a getter function (`getSupabase()`, `getStripe()`) with a singleton variable.
- **Do Not**: Instantiate clients globally at the top level of a file.
- **Reference**: `src/lib/supabase.ts`, `src/app/api/mcp/stripe/route.ts`.

### 3. Database & Auth
- **Auth**: Clerk (`@clerk/nextjs`) handles frontend auth. Uses helper functions like `getAuthUserId` in API routes.
- **Data**: Supabase is used primarily for conversation storage/memory.
- **Pattern**: Access via `src/lib/supabase.ts`. Use exported helpers (e.g., `storeConversation`) instead of raw queries in components.

### 4. 3D & Avatar System
- **Three.js**: Scenes reside in `src/components/three`. Use `@react-three/fiber` for the canvas. Use `leva` for debug controls.
- **Avatars**: Simli and ElevenLabs integrations are in `src/components/avatar`.
  - **State**: Avatar state (idle/speaking) is event-driven via listeners on the widgets (`SimliAvatar.tsx`).

## Development Workflow

### Environment & Scripts
- **Strict Env Checks**: Creating service clients (`getXXX()`) throws errors if keys are missing. Ensure `.env.local` is populated.
- **Setup Scripts**: Use `scripts/` for initialization tasks (e.g., `node scripts/setup-stripe-products.mjs`).
- **Build**: `npm run dev` for development.

### Coding Standards
- **Imports**: Use `@/` aliases for `src` (e.g., `import { ... } from '@/lib/supabase'`).
- **Styling**: Tailwind v4 syntax. Use `framer-motion` for complex animations (e.g., `HolographicCard`).
- **Types**: Define shared interfaces in `src/lib/*.ts` matching the data source (Supabase/Stripe types), not inline in components.
- **Error Handling**: API routes should return structured JSON errors with appropriate HTTP status codes (e.g. 401, 402).
- **Route Handlers**: Use standard Next.js 16 convention. Chat/Streaming routes often use `export const runtime = 'edge'`.

### AI & API Patterns
- **Direct Fetch**: For Azure OpenAI, prefer direct `fetch` calls over SDK wrappers when standard control is needed (see `src/app/api/chat/route.ts`).

