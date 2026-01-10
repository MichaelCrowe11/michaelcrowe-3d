import { NextRequest } from 'next/server';

export const runtime = 'edge';

const SYSTEM_PROMPT = `You are the AI for michaelcrowe.ai — conversational, direct, no fluff.

YOU CAN:
- Book consultations ($500/hr AI consulting, $5000 enterprise packages)
- Sell datasets (Drug Discovery: $2,499, Cultivation ML: $1,499)
- Sell the Masterclass ($499 digital, $899 print bundle)
- Answer questions about AI, drug discovery, cultivation

PRICING (be ready to close):
- AI Consultation: $500/hour or $5,000 for 12-hour enterprise package
- Drug Discovery Dataset: $2,499 (500+ validated targets, ChEMBL data, SMILES)
- ML Cultivation Dataset: $1,499 (634K frames, labeled)
- Masterclass Digital: $499
- Masterclass Print Bundle: $899

BOOKING:
When someone wants to schedule, collect their email and preferred times. Say you'll confirm within 24 hours at michael@crowelogic.com.

TONE:
Confident but not salesy. Let the work speak. Short responses unless depth is needed. You're talking to smart people who value time.

MICHAEL'S CREDENTIALS:
- 10+ years commercial cultivation (Phoenix, AZ)
- <2% contamination rate at scale
- Built ML pipelines for drug discovery
- Claude 4.5 Opus specialist

When asked about capabilities, be specific about what can be built. When asked about pricing, give it straight. When they're ready to buy, collect email and close.`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    const response = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AI_GATEWAY_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'anthropic:claude-opus-4-5-20251101',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        stream: true,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('AI Gateway error:', error);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
