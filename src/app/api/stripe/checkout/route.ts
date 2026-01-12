import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  getStripe,
  createPackageCheckout,
  createSubscriptionCheckout,
  PRODUCTS,
  type PackageId,
  type SubscriptionId,
} from '@/lib/stripe';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payments not configured' },
        { status: 500 }
      );
    }

    // Get authenticated user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, productId, email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email required' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://michaelcrowe.ai';
    const successUrl = `${baseUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}?canceled=true`;

    let session;

    if (type === 'package') {
      if (!PRODUCTS.packages[productId as PackageId]) {
        return NextResponse.json(
          { error: 'Invalid package' },
          { status: 400 }
        );
      }

      session = await createPackageCheckout(
        stripe,
        productId as PackageId,
        userId,
        email,
        successUrl,
        cancelUrl
      );
    } else if (type === 'subscription') {
      if (!PRODUCTS.subscriptions[productId as SubscriptionId]) {
        return NextResponse.json(
          { error: 'Invalid subscription' },
          { status: 400 }
        );
      }

      session = await createSubscriptionCheckout(
        stripe,
        productId as SubscriptionId,
        userId,
        email,
        successUrl,
        cancelUrl
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid checkout type' },
        { status: 400 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Checkout failed' },
      { status: 500 }
    );
  }
}

// Get available products
export async function GET() {
  return NextResponse.json({
    packages: Object.entries(PRODUCTS.packages).map(([key, pkg]) => ({
      id: key,
      name: pkg.name,
      minutes: pkg.minutes,
      price: pkg.price,
      savings: 'savings' in pkg ? pkg.savings : undefined,
    })),
    subscriptions: Object.entries(PRODUCTS.subscriptions).map(([key, sub]) => ({
      id: key,
      name: sub.name,
      monthlyMinutes: sub.monthlyMinutes,
      price: sub.price,
      savings: 'savings' in sub ? sub.savings : undefined,
    })),
  });
}
