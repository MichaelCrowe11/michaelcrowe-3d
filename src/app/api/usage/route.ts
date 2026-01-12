import { NextRequest, NextResponse } from 'next/server';
import { deductCredits, getUsageHistory } from '@/lib/credits';

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

// Record usage after a conversation ends
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, durationSeconds, userId: bodyUserId } = body;

    // Get user ID from body, query, or auth
    const clerkUserId = await getAuthUserId();
    const userId = bodyUserId || clerkUserId;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    if (!agentId || typeof durationSeconds !== 'number') {
      return NextResponse.json(
        { error: 'Missing agentId or durationSeconds' },
        { status: 400 }
      );
    }

    const result = await deductCredits(userId, agentId, durationSeconds);

    return NextResponse.json({
      success: result.success,
      billingType: result.billingType,
      minutesCharged: Math.ceil(durationSeconds / 60),
    });
  } catch (error) {
    console.error('Usage tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to record usage' },
      { status: 500 }
    );
  }
}

// Get usage history
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const queryUserId = searchParams.get('userId');
  const clerkUserId = await getAuthUserId();

  const userId = queryUserId || clerkUserId;

  if (!userId) {
    return NextResponse.json(
      { error: 'User ID required' },
      { status: 400 }
    );
  }

  const history = await getUsageHistory(userId);

  return NextResponse.json({ history });
}
