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
- **Rule**: **Never** instantiate clients globally at the top level of a file. always wrap in a accessor function.
- **Reference**: `src/lib/supabase.ts`, `src/app/api/mcp/stripe/route.ts`.

### 3. State Management (Zustand)
- **Store**: `src/stores/sessionStore.ts` manages the active agent session, connection status, and conversation timer.
- **Usage**: Use `useSessionStore` hook in client components to track conversation state (`isInConversation`, `selectedAgent`).

### 4. 3D & Avatar System
- **Three.js**: Scenes in `src/components/three`. Use `@react-three/fiber`.
- **Avatar Integration**:
  - **Simli/ElevenLabs**: `SimliAvatar.tsx` listens for custom DOM events: `elevenlabs-convai:agent-response`, `elevenlabs-convai:user-transcript`, `elevenlabs-convai:conversation-ended`.
  - **Voice**: `VoiceConversation.tsx` uses `@elevenlabs/react` hook `useConversation` to manage connection and status.

## Development Patterns

### Authentication & User Identity
- **Clerk**: Auth is handled by `@clerk/nextjs` but is often conditional.
- **Pattern**: Use `getAuthUserId()` helper in API routes which gracefully handles missing Clerk keys or unauthenticated requests (falling back to demo IDs if appropriate).
- **Reference**: `src/app/api/agents/[id]/session/route.ts`.

### Configuration & Types
- **Agents**: All agent metadata (IDs, prices, ElevenLabs IDs) is strictly typed in `src/config/agents.ts`.
- **Environment**: Access environment variables via `process.env`. Ensure `.env.local` is present for local dev.

### Routing & Runtime
- **Runtime**: Be explicit about runtime. Chat/Streaming routes often benefit from `export const runtime = 'edge'`, while database/heavy routes should be `nodejs`.
- **API Structure**:
  - `src/app/api/agents/[id]/session`: Agent connection tokens.
  - `src/app/api/mcp/*`: MCP endpoints.
  
## Coding Standards
- **Style**: Tailwind CSS v4. Use `clsx` or `cn` helper if available for class conditional merging.
- **Animation**: `framer-motion` for UI transitions; `@react-spring` or R3F built-ins for 3D.
- **Imports**: Use `@/` aliases (e.g., `import { agents } from '@/config/agents'`).
- **Error Handling**: API routes return structured JSON. 

