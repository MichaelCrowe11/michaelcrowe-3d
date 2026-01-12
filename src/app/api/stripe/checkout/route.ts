import { NextRequest, NextResponse } from 'next/server';
import {
  getStripe,
  PRODUCTS,
  type PackageId,
  type SubscriptionId,
} from '@/lib/stripe';

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
    const { type, productId, email, promoCode } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email required' },
        { status: 400 }
      );
    }

    const clerkUserId = await getAuthUserId();
    const userId = clerkUserId || `email_${Buffer.from(email).toString('base64').slice(0, 20)}`;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://michaelcrowe.ai';
    const successUrl = `${baseUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}?canceled=true`;

    // Validate promo code if provided
    let promotionCodeId: string | undefined;
    if (promoCode) {
      try {
        const promoCodes = await stripe.promotionCodes.list({
          code: promoCode,
          active: true,
          limit: 1,
        });
        if (promoCodes.data.length > 0) {
          promotionCodeId = promoCodes.data[0].id;
        } else {
          return NextResponse.json(
            { error: 'Invalid promo code' },
            { status: 400 }
          );
        }
      } catch {
        return NextResponse.json(
          { error: 'Failed to validate promo code' },
          { status: 400 }
        );
      }
    }

    let session;

    if (type === 'package') {
      const pkg = PRODUCTS.packages[productId as PackageId];
      if (!pkg) {
        return NextResponse.json(
          { error: 'Invalid package' },
          { status: 400 }
        );
      }

      if (!pkg.priceId) {
        return NextResponse.json(
          { error: `Price ID not configured for package: ${productId}` },
          { status: 500 }
        );
      }

      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        customer_email: email,
        line_items: [{ price: pkg.priceId, quantity: 1 }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        allow_promotion_codes: !promotionCodeId, // Allow UI input if no code provided
        discounts: promotionCodeId ? [{ promotion_code: promotionCodeId }] : undefined,
        metadata: {
          userId,
          type: 'package',
          packageId: productId,
          minutes: pkg.minutes.toString(),
        },
      });
    } else if (type === 'subscription') {
      const sub = PRODUCTS.subscriptions[productId as SubscriptionId];
      if (!sub) {
        return NextResponse.json(
          { error: 'Invalid subscription' },
          { status: 400 }
        );
      }

      if (!sub.priceId) {
        return NextResponse.json(
          { error: `Price ID not configured for subscription: ${productId}` },
          { status: 500 }
        );
      }

      session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        customer_email: email,
        line_items: [{ price: sub.priceId, quantity: 1 }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        allow_promotion_codes: !promotionCodeId,
        discounts: promotionCodeId ? [{ promotion_code: promotionCodeId }] : undefined,
        metadata: {
          userId,
          type: 'subscription',
          subscriptionId: productId,
          monthlyMinutes: sub.monthlyMinutes.toString(),
        },
      });
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

// Validate promo code endpoint
export async function PUT(request: NextRequest) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payments not configured' },
        { status: 500 }
      );
    }

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Promo code required' },
        { status: 400 }
      );
    }

    const promoCodes = await stripe.promotionCodes.list({
      code,
      active: true,
      limit: 1,
    });

    if (promoCodes.data.length === 0) {
      return NextResponse.json({ valid: false });
    }

    const promoCodeData = promoCodes.data[0];
    // Get coupon details - expand the coupon in a separate call
    const expandedPromo = await stripe.promotionCodes.retrieve(promoCodeData.id, {
      expand: ['coupon'],
    }) as unknown as {
      id: string;
      code: string;
      coupon: {
        percent_off: number | null;
        amount_off: number | null;
        currency: string | null;
      };
    };

    return NextResponse.json({
      valid: true,
      discount: {
        id: expandedPromo.id,
        code: expandedPromo.code,
        percentOff: expandedPromo.coupon.percent_off,
        amountOff: expandedPromo.coupon.amount_off ? expandedPromo.coupon.amount_off / 100 : null,
        currency: expandedPromo.coupon.currency,
      },
    });
  } catch (error) {
    console.error('Promo validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate code' },
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
