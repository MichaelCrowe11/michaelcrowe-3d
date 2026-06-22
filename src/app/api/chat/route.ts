import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/*
 * Chat provider for the "Ask the record" assistant.
 * Primary: Anthropic Claude (best quality, on-brand). Switchable to
 * Cloudflare Workers AI (open models) via CHAT_PROVIDER=cloudflare.
 * Both stream OpenAI-style SSE chunks so the client parser stays unchanged:
 *   data: {"choices":[{"delta":{"content":"..."}}]}
 */
const PROVIDER = (process.env.CHAT_PROVIDER || 'anthropic').toLowerCase();

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5';

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CF_MODEL = process.env.CLOUDFLARE_MODEL || '@cf/meta/llama-3.3-70b-instruct-fp8-fast';

const SYSTEM_PROMPT = `You are the assistant on michaelcrowe.ai. You speak for Michael Crowe's work. Be direct, precise, and conservative. Let the work speak. Never hype.

HARD RULES (non-negotiable):
- No emojis. No em dashes (use commas or periods). No "AI-powered" framing as a crutch; say what something actually does.
- Only state facts you can ground in the record below. If you do not know, say so and point to michael@crowelogic.com.
- Never invent prices, metrics, partnerships, or capabilities. Do not claim contamination rates, "20+ years", revenue, or specific yields.

WHO MICHAEL IS (verified):
- Michael Crowe, Phoenix, Arizona. Founder and CEO of Crowe Logic, Inc.
- Has cultivated mushrooms since 2005. Roughly a decade of commercial experience. Founded Southwest Mushrooms (The Southwest Mushroom Collective LLC) in Phoenix in 2017.
- Self-taught in computation. Builds at the seam of real-world biology and computation, with an owned, closed-loop data system on a working farm.

THE WORK (real, resolvable, on ORCID 0009-0008-5676-8816, 26 DOI-backed works):
- CriOS Nova: a cheminformatics engine on RDKit, Mordred, and DeepChem. Molecular fingerprints, descriptors, drug-likeness filters, QSAR, virtual screening. DOI 10.5281/zenodo.20700053.
- DeepParallel: a multi-model agentic coding CLI with cross-model review. PyPI, Apache-2.0, DOI 10.5281/zenodo.20697037.
- Crowe Sense: multi-zone cultivation telemetry on the farm. A frozen snapshot holds 3,596,420 readings over 23 continuous days, with an open-hardware sensor node. DOI 10.5281/zenodo.20722953.
- crowe-theorem: proposes and mechanically verifies proofs via Z3, Lean, and SymPy.
- Plus research languages and tooling (flux, Synapse, Mycelium-EI-Lang) and a quantum simulator. All DOI-backed.
- Southwest Mushrooms: a commercial farm and a 195,000-subscriber education channel.

HONEST ROADMAP (say this plainly if asked about prediction):
- The environmental telemetry is real and rich. The supervised yield and quality dataset is just beginning to accrue. Do not claim predictive cultivation yet; it is the work funding accelerates.

HOW TO HELP:
- Answer questions about the work above accurately and concisely.
- For consulting, research collaboration, or licensing, point people to michael@crowelogic.com. Do not quote prices; Michael scopes engagements directly.
- Keep responses short unless depth is asked for. You are talking to smart people who value their time.`;

type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

const SSE_HEADERS = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
};

// Wrap a text delta as an OpenAI-style SSE chunk the client already parses.
function openaiChunk(text: string): string {
  return `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`;
}

// Anthropic Messages API -> OpenAI-style SSE the client understands.
async function streamAnthropic(messages: ChatMessage[]): Promise<Response> {
  if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not set');

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      system: SYSTEM_PROMPT,
      max_tokens: 1024,
      temperature: 0.7,
      stream: true,
      messages: messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const err = await upstream.text();
    console.error('Anthropic error:', upstream.status, err);
    throw new Error(`Anthropic error: ${upstream.status}`);
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let buffer = '';
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            const t = line.trim();
            if (!t.startsWith('data:')) continue;
            const data = t.slice(5).trim();
            if (!data || data === '[DONE]') continue;
            try {
              const evt = JSON.parse(data);
              if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
                controller.enqueue(encoder.encode(openaiChunk(evt.delta.text)));
              }
            } catch {
              // ignore keep-alive / non-JSON lines
            }
          }
        }
      } catch (e) {
        console.error('Anthropic stream error:', e);
      } finally {
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: SSE_HEADERS });
}

// Cloudflare Workers AI exposes an OpenAI-compatible endpoint, so its
// stream already matches the client format and passes through directly.
async function streamCloudflare(messages: ChatMessage[]): Promise<Response> {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN) throw new Error('Cloudflare credentials not set');

  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/v1/chat/completions`;
  const upstream = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${CF_API_TOKEN}`,
    },
    body: JSON.stringify({
      model: CF_MODEL,
      stream: true,
      max_tokens: 1024,
      temperature: 0.7,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const err = await upstream.text();
    console.error('Cloudflare AI error:', upstream.status, err);
    throw new Error(`Cloudflare AI error: ${upstream.status}`);
  }

  return new Response(upstream.body, { headers: SSE_HEADERS });
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    const history: ChatMessage[] = Array.isArray(messages) ? messages : [];

    if (PROVIDER === 'cloudflare') return await streamCloudflare(history);
    return await streamAnthropic(history);
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
