import { NextRequest, NextResponse } from 'next/server';
import { getUserCredits, canStartSession } from '@/lib/credits';

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

export async function GET(request: NextRequest) {
  // Get userId from query param or auth
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

  const credits = await getUserCredits(userId);
  const sessionStatus = await canStartSession(userId);

  if (!credits) {
    return NextResponse.json({
      balanceMinutes: 3,
      subscriptionTier: null,
      subscriptionMinutesRemaining: 0,
      subscriptionResetDate: null,
      canStart: true,
      availableMinutes: 3,
      source: 'credits',
    });
  }

  return NextResponse.json({
    balanceMinutes: credits.balance_minutes,
    subscriptionTier: credits.subscription_tier,
    subscriptionMinutesRemaining: credits.subscription_minutes_remaining,
    subscriptionResetDate: credits.subscription_reset_date,
    canStart: sessionStatus.canStart,
    availableMinutes: sessionStatus.availableMinutes,
    source: sessionStatus.source,
  });
}
