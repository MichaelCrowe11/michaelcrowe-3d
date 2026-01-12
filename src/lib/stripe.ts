import Stripe from 'stripe';

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export function getStripe(): Stripe | null {
  if (!stripeSecretKey) {
    console.warn('Stripe not configured - payment features disabled');
    return null;
  }
  return new Stripe(stripeSecretKey, {
    apiVersion: '2025-12-15.clover',
  });
}

// Product configuration
export const PRODUCTS = {
  // Minute packages (one-time purchases)
  packages: {
    starter: {
      id: 'pkg_starter',
      name: 'Starter Pack',
      minutes: 30,
      price: 15,
      priceId: process.env.STRIPE_PRICE_STARTER_PACK,
    },
    pro: {
      id: 'pkg_pro',
      name: 'Pro Pack',
      minutes: 120,
      price: 50,
      savings: '17%',
      priceId: process.env.STRIPE_PRICE_PRO_PACK,
    },
    enterprise: {
      id: 'pkg_enterprise',
      name: 'Enterprise Pack',
      minutes: 500,
      price: 175,
      savings: '30%',
      priceId: process.env.STRIPE_PRICE_ENTERPRISE_PACK,
    },
  },
  // Subscription plans
  subscriptions: {
    basic: {
      id: 'sub_basic',
      name: 'Basic',
      monthlyMinutes: 60,
      price: 29,
      priceId: process.env.STRIPE_PRICE_BASIC_SUB,
    },
    professional: {
      id: 'sub_professional',
      name: 'Professional',
      monthlyMinutes: 200,
      price: 79,
      savings: '34%',
      priceId: process.env.STRIPE_PRICE_PROFESSIONAL_SUB,
    },
    unlimited: {
      id: 'sub_unlimited',
      name: 'Unlimited',
      monthlyMinutes: -1, // unlimited
      price: 199,
      priceId: process.env.STRIPE_PRICE_UNLIMITED_SUB,
    },
  },
} as const;

export type PackageId = keyof typeof PRODUCTS.packages;
export type SubscriptionId = keyof typeof PRODUCTS.subscriptions;

// Create checkout session for package purchase
export async function createPackageCheckout(
  stripe: Stripe,
  packageId: PackageId,
  userId: string,
  userEmail: string,
  successUrl: string,
  cancelUrl: string
) {
  const pkg = PRODUCTS.packages[packageId];
  if (!pkg.priceId) {
    throw new Error(`Price ID not configured for package: ${packageId}`);
  }

  return stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: userEmail,
    line_items: [
      {
        price: pkg.priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      type: 'package',
      packageId,
      minutes: pkg.minutes.toString(),
    },
  });
}

// Create checkout session for subscription
export async function createSubscriptionCheckout(
  stripe: Stripe,
  subscriptionId: SubscriptionId,
  userId: string,
  userEmail: string,
  successUrl: string,
  cancelUrl: string
) {
  const sub = PRODUCTS.subscriptions[subscriptionId];
  if (!sub.priceId) {
    throw new Error(`Price ID not configured for subscription: ${subscriptionId}`);
  }

  return stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: userEmail,
    line_items: [
      {
        price: sub.priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      type: 'subscription',
      subscriptionId,
      monthlyMinutes: sub.monthlyMinutes.toString(),
    },
  });
}

// Get or create Stripe customer
export async function getOrCreateCustomer(
  stripe: Stripe,
  userId: string,
  email: string,
  name?: string
): Promise<Stripe.Customer> {
  // Search for existing customer by metadata
  const customers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (customers.data.length > 0) {
    return customers.data[0];
  }

  // Create new customer
  return stripe.customers.create({
    email,
    name,
    metadata: {
      userId,
    },
  });
}

// Create billing portal session
export async function createPortalSession(
  stripe: Stripe,
  customerId: string,
  returnUrl: string
) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}
