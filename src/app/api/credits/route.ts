import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserCredits, canStartSession } from '@/lib/credits';

export const runtime = 'nodejs'; // Need Node.js for Supabase

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const credits = await getUserCredits(userId);
  const sessionStatus = await canStartSession(userId);

  if (!credits) {
    return NextResponse.json({
      balanceMinutes: 3, // Default free tier
      subscriptionTier: null,
      subscriptionMinutesRemaining: 0,
      canStartSession: true,
      availableMinutes: 3,
      source: 'credits',
    });
  }

  return NextResponse.json({
    balanceMinutes: credits.balance_minutes,
    subscriptionTier: credits.subscription_tier,
    subscriptionMinutesRemaining: credits.subscription_minutes_remaining,
    subscriptionResetDate: credits.subscription_reset_date,
    canStartSession: sessionStatus.canStart,
    availableMinutes: sessionStatus.availableMinutes,
    source: sessionStatus.source,
  });
}
