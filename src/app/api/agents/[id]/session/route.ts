import { NextRequest, NextResponse } from 'next/server';
import { getAgent } from '@/config/agents';
import { canStartSession } from '@/lib/credits';

export const runtime = 'nodejs';

// Safe auth helper - returns null if Clerk isn't configured
async function getAuthUserId(): Promise<string | null> {
  try {
    if (!process.env.CLERK_SECRET_KEY) {
      return null;
    }
    const { auth } = await import('@clerk/nextjs/server');
    const { userId } = await auth();
    return userId;
  } catch {
    return null;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Get user ID from body, query, or auth
  let userId: string | null = null;

  try {
    const body = await request.json().catch(() => ({}));
    const email = body.email;

    if (email) {
      userId = `email_${Buffer.from(email).toString('base64').slice(0, 20)}`;
    }
  } catch {
    // No body, that's fine
  }

  // Try Clerk auth if no email provided
  if (!userId) {
    userId = await getAuthUserId();
  }

  // For demo/testing, allow without auth but with limited functionality
  const isDemo = !userId;
  if (isDemo) {
    // Generate a temporary demo user ID
    userId = `demo_${Date.now()}`;
  }

  // Check if user has credits (skip for demo users)
  if (!isDemo) {
    const creditStatus = await canStartSession(userId);
    if (!creditStatus.canStart) {
      return NextResponse.json(
        { error: 'Insufficient credits', requiresPayment: true },
        { status: 402 }
      );
    }
  }

  // Get agent config
  const agent = getAgent(id);
  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  }

  if (!agent.elevenLabsAgentId) {
    return NextResponse.json(
      { error: 'Agent not configured' },
      { status: 500 }
    );
  }

  // Get signed URL from ElevenLabs
  const apiKey = process.env.ELEVEN_LABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'ElevenLabs API key not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agent.elevenLabsAgentId}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': apiKey,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs error:', errorText);
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      signedUrl: data.signed_url,
      agentId: agent.id,
      agentName: agent.name,
      isDemo,
    });
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
