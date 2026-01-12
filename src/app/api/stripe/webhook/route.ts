import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe, PRODUCTS } from '@/lib/stripe';
import { addCredits, updateSubscription } from '@/lib/credits';

export const runtime = 'nodejs'; // Webhooks need Node.js for raw body

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 500 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('Stripe webhook secret not configured');
    return NextResponse.json(
      { error: 'Webhook not configured' },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCanceled(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.warn('Payment failed for invoice:', invoice.id);
        // Could send notification to user
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const { metadata } = session;
  if (!metadata) return;

  const userId = metadata.userId;
  const type = metadata.type;

  if (!userId) {
    console.error('No userId in checkout metadata');
    return;
  }

  if (type === 'package') {
    // Add credits for package purchase
    const minutes = parseInt(metadata.minutes || '0', 10);
    if (minutes > 0) {
      const success = await addCredits(userId, minutes);
      console.log(`Added ${minutes} credits for user ${userId}: ${success}`);
    }
  }

  // Subscription handling is done via subscription events
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const metadata = subscription.metadata;
  const userId = metadata?.userId;

  if (!userId) {
    console.error('No userId in subscription metadata');
    return;
  }

  // Get subscription tier from price
  const priceId = subscription.items.data[0]?.price.id;
  let tier = 'basic';
  let monthlyMinutes = 60;

  // Match price ID to subscription tier
  for (const [key, sub] of Object.entries(PRODUCTS.subscriptions)) {
    if (sub.priceId === priceId) {
      tier = key;
      monthlyMinutes = sub.monthlyMinutes;
      break;
    }
  }

  if (subscription.status === 'active') {
    await updateSubscription(userId, tier, monthlyMinutes, customerId);
    console.log(`Updated subscription for user ${userId}: ${tier}`);
  }
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const metadata = subscription.metadata;
  const userId = metadata?.userId;

  if (!userId) {
    console.error('No userId in subscription metadata');
    return;
  }

  // Clear subscription but keep credits
  await updateSubscription(userId, '', 0, subscription.customer as string);
  console.log(`Canceled subscription for user ${userId}`);
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // For recurring subscriptions, reset monthly minutes
  const subscriptionId = (invoice as { subscription?: string | null }).subscription;
  if (subscriptionId && invoice.billing_reason === 'subscription_cycle') {
    const stripe = getStripe();
    if (!stripe) return;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const metadata = subscription.metadata;
    const userId = metadata?.userId;

    if (userId) {
      const priceId = subscription.items.data[0]?.price.id;
      let monthlyMinutes = 60;

      for (const sub of Object.values(PRODUCTS.subscriptions)) {
        if (sub.priceId === priceId) {
          monthlyMinutes = sub.monthlyMinutes;
          break;
        }
      }

      await updateSubscription(
        userId,
        subscription.metadata?.subscriptionId || 'basic',
        monthlyMinutes,
        subscription.customer as string
      );

      console.log(`Reset monthly minutes for user ${userId}: ${monthlyMinutes}`);
    }
  }
}
