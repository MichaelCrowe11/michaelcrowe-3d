import { NextRequest } from 'next/server';

export const runtime = 'edge';

const SYSTEM_PROMPT = `You are the AI assistant for michaelcrowe.ai, the personal website of Michael Crowe - an AI consultant, drug discovery specialist, and founder of Southwest Mushrooms.

Your role is to help visitors learn about:
1. AI Consulting Services - Claude 4.5 Opus integration, custom model fine-tuning, enterprise AI deployment
2. Drug Discovery AI - Validated novel drug targets, ChEMBL integration, ML pipelines for pharmaceutical research
3. Premium Datasets - 634K+ cultivation ML frames, 500+ validated drug targets
4. The Mushroom Cultivator's Masterclass - 28 chapters, 640+ pages of expert cultivation guidance

Be concise, professional, and helpful. Guide interested visitors to contact michael@crowelogic.com for consulting inquiries.

Key facts about Michael:
- 10+ years in mushroom cultivation at commercial scale
- <2% contamination rate in production
- Pioneer in applying AI/ML to both drug discovery and cultivation science
- Based in Phoenix, Arizona`;

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
