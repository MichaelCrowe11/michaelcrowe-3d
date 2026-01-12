import { NextRequest, NextResponse } from 'next/server';
import { getStripe, createPortalSession, getOrCreateCustomer } from '@/lib/stripe';

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

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payments not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, customerId } = body;

    if (!email && !customerId) {
      return NextResponse.json(
        { error: 'Email or customer ID required' },
        { status: 400 }
      );
    }

    const clerkUserId = await getAuthUserId();
    const userId = clerkUserId || `email_${Buffer.from(email).toString('base64').slice(0, 20)}`;

    let stripeCustomerId = customerId;

    // If no customer ID provided, look up by email
    if (!stripeCustomerId && email) {
      const customer = await getOrCreateCustomer(stripe, userId, email);
      stripeCustomerId = customer.id;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://michaelcrowe.ai';
    const returnUrl = `${baseUrl}/account`;

    const session = await createPortalSession(stripe, stripeCustomerId, returnUrl);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Portal session error:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
