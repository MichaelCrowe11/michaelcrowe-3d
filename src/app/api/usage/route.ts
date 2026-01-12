import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { deductCredits, getUsageHistory } from '@/lib/credits';

export const runtime = 'nodejs';

// Record usage after a conversation ends
export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const { agentId, durationSeconds } = await request.json();

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
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const history = await getUsageHistory(userId);

  return NextResponse.json({ history });
}
