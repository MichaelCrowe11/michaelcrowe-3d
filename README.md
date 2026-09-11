# michaelcrowe-3d

The Next.js source for Michael Crowe's personal site, with React Three Fiber scenes, a chat route, voice agent screens, and Stripe checkout routes.

## Status

working

The app installs from the lockfile, builds, and serves. The deployed copy at `https://michaelcrowe-3d.vercel.app/` and the production domain it serves (the repository's homepage field) returned the same page title as our local build on 2026-09-10. Most server routes need third-party keys that are not in the repository; without them they return errors, as shown below.

## Install and first run

We ran these commands on 2026-09-10 in a fresh clone with Node v26.5.0 and npm 11.17.0.

```
git clone https://github.com/MichaelCrowe11/michaelcrowe-3d.git
cd michaelcrowe-3d
npm ci
```

Output (last line):

```
added 627 packages in 11s
```

```
npm run build
```

Output (check-mark glyphs and a Node deprecation warning omitted; the route table is as printed):

```
> michaelcrowe-3d@0.1.0 build
> next build
Next.js 16.1.1 (Turbopack)
  Creating an optimized production build ...
Compiled successfully in 5.0s
  Running TypeScript ...
  Collecting page data using 13 workers ...
Using edge runtime on a page currently disables static generation for that page
NEXT_PUBLIC_CROWELOGIC_CLI_API_URL is not set
Generating static pages using 13 workers (32/32) in 201.5ms
  Finalizing page optimization ...
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /admin/mcp-tester
├ ƒ /api/admin/sales
├ ƒ /api/agents/[id]/session
├ ƒ /api/agents/sales-director/session
├ ƒ /api/auth/register
├ ƒ /api/chat
├ ƒ /api/credits
├ ƒ /api/elevenlabs/context
├ ƒ /api/elevenlabs/tools
├ ƒ /api/elevenlabs/webhook
├ ƒ /api/mcp/calendar
├ ƒ /api/mcp/crm
├ ƒ /api/mcp/email
├ ƒ /api/mcp/ibm-quantum
├ ƒ /api/mcp/research
├ ƒ /api/mcp/stripe
├ ƒ /api/ollama/chat
├ ƒ /api/ollama/models
├ ƒ /api/speak
├ ƒ /api/stripe/checkout
├ ƒ /api/stripe/portal
├ ƒ /api/stripe/webhook
├ ƒ /api/usage
├ ○ /products/consulting
├ ○ /products/dataset
├ ○ /products/masterclass
├ ○ /studio
├ ○ /studio/deep-consulting
├ ○ /studio/doomscroll
├ ○ /studio/parallel-synth
├ ƒ /studio/session/[id]
└ ○ /workspace
ƒ Proxy (Middleware)
○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

Serve the build and probe it:

```
npm run start -- -p 3123
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3123/
curl -s http://localhost:3123/ | grep -o "<title>[^<]*</title>"
```

Output:

```
200
<title>Michael Crowe | Where real-world biology meets computation</title>
```

```
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' \
  http://localhost:3123/api/mcp/stripe
```

Output:

```
{"jsonrpc":"2.0","id":1,"result":{"protocolVersion":"2024-11-05","capabilities":{"tools":{}},"serverInfo":{"name":"stripe-mcp","version":"1.0.0"}}}
```

The same route answered `tools/list` with 15 tool definitions. Without Stripe keys, calling them fails.

```
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"hi"}]}' http://localhost:3123/api/chat
```

Output, with the server log line that explains it:

```
{"error":"Failed to process chat request"}
Chat API error: Error: ANTHROPIC_API_KEY not set
```

```
npm run lint
```

Output (last line):

```
125 problems (81 errors, 44 warnings)
```

```
npm run test:agents
```

Prints the seven agent ids from `src/config/agentInterfaces.ts` and instructions. It runs no tests. Its output contains emoji and is not reproduced here.

Steps we did not run: `npm run dev`, sign-in through Clerk, any ElevenLabs voice session or Simli avatar, any Stripe checkout or webhook, Supabase reads or writes, MCP `tools/call` with credentials, the Python service in `services/crowe-logic-cli-api`, and `/api/ollama/chat`. `/api/ollama/models` on our machine returned the model list from the Ollama already running there; that list is not part of the repository.

## What runs today

Each item names its source.

- Home page composed of Hero, Story, Services, Portfolio, Products, Contact, and Footer sections, with two React Three Fiber scenes (`IntroScene`, `BioComputeField`) loaded client-side. Source: `src/app/page.tsx`, `src/components/sections/`.
- Nine React Three Fiber components: `Scene`, `IntroScene`, `BigBang`, `NeuralNetwork`, `FloatingOrbs`, `InfiniteOrbs`, `BioComputeField`, `AudioReactive`, and the `LiquidOrbButton`. Source: `src/components/three/`, `src/components/conversation/LiquidOrbButton.tsx`.
- Pages under `/studio` (index, `deep-consulting`, `doomscroll`, `parallel-synth`, `session/[id]`), `/workspace`, `/products/{consulting,dataset,masterclass}`, and `/admin/mcp-tester`. All returned 200 locally where we checked (`/`, `/studio`, `/workspace`).
- `/api/chat` streams a reply from the Anthropic Messages API (model from `ANTHROPIC_MODEL`, default `claude-haiku-4-5`) or, with `CHAT_PROVIDER=cloudflare`, from Cloudflare's chat completions endpoint. The system prompt is inline in the route. Source: `src/app/api/chat/route.ts`.
- JSON-RPC 2.0 routes under `/api/mcp/{stripe,crm,calendar,email,ibm-quantum,research}` that handle `initialize`, `tools/list`, and `tools/call`. The Stripe route defines 15 tools (products, payment links, checkout sessions, promo codes, customers, receipts, booking link, inventory, sales stats). Source: `src/app/api/mcp/*/route.ts`.
- Seven voice agent definitions with ElevenLabs agent ids read from environment variables and minute packages priced in code. Voice sessions use `@elevenlabs/react`; an optional Simli avatar listens for the ElevenLabs DOM events. Source: `src/config/agents.ts`, `src/components/agents/`, `src/components/avatar/SimliAvatar.tsx`.
- Stripe checkout, billing portal, and webhook routes; credit and usage routes; a Supabase schema with `user_credits`, `usage_records`, and `conversations` tables. Source: `src/app/api/stripe/`, `src/app/api/credits/route.ts`, `src/lib/stripe.ts`, `supabase/schema.sql`, `supabase-schema.sql`.
- Optional Clerk sign-in. The middleware in `src/proxy.ts` only loads Clerk when `CLERK_SECRET_KEY` is set; otherwise every request passes through.
- `/api/ollama/models` and `/api/ollama/chat` proxy a local Ollama at `OLLAMA_BASE_URL` (default `http://localhost:11434`). Source: `src/app/api/ollama/`.
- A service worker and web manifest. Source: `public/sw.js`, `public/manifest.json`, `src/components/PWARegistration.tsx`.
- A small FastAPI wrapper that runs the `crowelogic` CLI, called through `NEXT_PUBLIC_CROWELOGIC_CLI_API_URL`. Not run. Source: `services/crowe-logic-cli-api/`, `src/lib/croweLogicCli.ts`.
- `vercel.json` rewrites `/api/mcp/*`, `/api/stripe/*`, `/api/credits/*`, `/api/checkout`, and `/api/webhooks/*` to `michaelcrowe-agents.vercel.app` in production. That host returned HTTP 402 on 2026-09-10, so those routes behave differently on the deployed site than in the local run above.

## Limits

This is one person's site. It is not a library and has no public API contract.

Some copy in the source is out of date. `src/components/sections/Hero.tsx` says "I run a commercial farm" and `src/components/sections/Story.tsx` and the chat prompt in `src/app/api/chat/route.ts` describe "the working farm". Southwest Mushrooms, which Michael founded, closed its farm in February 2025. Those lines were not changed in this pass; only this README was.

The Story section and the chat prompt carry figures about the farm, the channel, telemetry, and publications. We did not verify them here and do not repeat them.

Prices for the three product cards and the per-minute voice packages are hard-coded in `src/components/sections/Products.tsx` and `src/config/agents.ts` (listed in code). We did not verify that any checkout completes. The consulting card's feature list names a third-party model and "Custom Models"; we did not verify what is delivered.

`npm run lint` reports 81 errors. There are no automated tests; `test:agents` prints a list.

The repository carries committed clutter: 100 binary `.djcache` files under `config/cache/` (5.2 MB), four zero-byte files at the root (`Build`, `next`, `michaelcrowe-3d@0.1.0`, and one whose name is a terminal escape sequence), and `package.json.example`. None of it is used by the build.

No secrets are committed. `.env.example` lists empty keys for Clerk, ElevenLabs, Stripe, Supabase, Google Calendar, HubSpot, IBM Quantum, and SendGrid; `docs/STRIPE_SETUP.md` shows a placeholder webhook secret.

The previous GitHub description named a specific third-party model. The code reads the model name from `ANTHROPIC_MODEL` and defaults to `claude-haiku-4-5`.

## License and contact

No `LICENSE` file. `package.json` is marked `private` and has no license field, so all rights are reserved by default.

Contact: michael@crowelogic.com
