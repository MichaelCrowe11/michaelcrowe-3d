import { NextRequest } from 'next/server';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, model = 'llama3.2', stream = true } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const ollamaResponse = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        stream,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: 2048,
        },
      }),
    });

    if (!ollamaResponse.ok) {
      const error = await ollamaResponse.text();
      return new Response(
        JSON.stringify({ error: `Ollama error: ${error}` }),
        { status: ollamaResponse.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (stream) {
      // Stream the response
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();

      const transformStream = new TransformStream({
        async transform(chunk, controller) {
          const text = decoder.decode(chunk);
          const lines = text.split('\n').filter(line => line.trim());

          for (const line of lines) {
            try {
              const json = JSON.parse(line);
              if (json.message?.content) {
                // Format as SSE
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ content: json.message.content, done: json.done })}\n\n`)
                );
              }
              if (json.done) {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              }
            } catch {
              // Skip malformed JSON
            }
          }
        },
      });

      return new Response(
        ollamaResponse.body?.pipeThrough(transformStream),
        {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        }
      );
    } else {
      // Non-streaming response
      const data = await ollamaResponse.json();
      return new Response(
        JSON.stringify({
          content: data.message?.content || '',
          model: data.model,
          done: true,
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Ollama chat error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to connect to Ollama. Make sure Ollama is running.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({ status: 'ok', endpoint: 'ollama-chat' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
