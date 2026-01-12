#!/usr/bin/env npx ts-node
/**
 * Stripe Product Setup Script
 *
 * Run this script to automatically create all products and prices in your Stripe account.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_test_xxx npx ts-node scripts/setup-stripe-products.ts
 *
 * Or set STRIPE_SECRET_KEY in your .env.local first:
 *   npx ts-node scripts/setup-stripe-products.ts
 */

import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('❌ STRIPE_SECRET_KEY not found in environment');
  console.log('\nTo set up Stripe products, you need a Stripe API key.');
  console.log('1. Go to https://dashboard.stripe.com/apikeys');
  console.log('2. Copy your secret key (starts with sk_test_ or sk_live_)');
  console.log('3. Run: STRIPE_SECRET_KEY=sk_test_xxx npx ts-node scripts/setup-stripe-products.ts');
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-12-15.clover' as Stripe.LatestApiVersion,
});

interface ProductConfig {
  name: string;
  description: string;
  price: number;
  type: 'one_time' | 'recurring';
  envKey: string;
  metadata: Record<string, string>;
}

const products: ProductConfig[] = [
  // One-time packages
  {
    name: 'Starter Pack',
    description: '30 minutes of AI agent conversation time',
    price: 1500, // $15.00 in cents
    type: 'one_time',
    envKey: 'STRIPE_PRICE_STARTER_PACK',
    metadata: { type: 'package', minutes: '30' },
  },
  {
    name: 'Pro Pack',
    description: '120 minutes of AI agent conversation time (Save 17%)',
    price: 5000, // $50.00
    type: 'one_time',
    envKey: 'STRIPE_PRICE_PRO_PACK',
    metadata: { type: 'package', minutes: '120' },
  },
  {
    name: 'Enterprise Pack',
    description: '500 minutes of AI agent conversation time (Save 30%)',
    price: 17500, // $175.00
    type: 'one_time',
    envKey: 'STRIPE_PRICE_ENTERPRISE_PACK',
    metadata: { type: 'package', minutes: '500' },
  },
  // Subscriptions
  {
    name: 'Basic Subscription',
    description: '60 minutes per month of AI agent conversation time',
    price: 2900, // $29.00
    type: 'recurring',
    envKey: 'STRIPE_PRICE_BASIC_SUB',
    metadata: { type: 'subscription', monthlyMinutes: '60' },
  },
  {
    name: 'Professional Subscription',
    description: '200 minutes per month of AI agent conversation time (Save 34%)',
    price: 7900, // $79.00
    type: 'recurring',
    envKey: 'STRIPE_PRICE_PROFESSIONAL_SUB',
    metadata: { type: 'subscription', monthlyMinutes: '200' },
  },
  {
    name: 'Unlimited Subscription',
    description: 'Unlimited AI agent conversation time',
    price: 19900, // $199.00
    type: 'recurring',
    envKey: 'STRIPE_PRICE_UNLIMITED_SUB',
    metadata: { type: 'subscription', monthlyMinutes: '-1' },
  },
];

async function createProducts(): Promise<Map<string, string>> {
  const priceIds = new Map<string, string>();

  console.log('🚀 Creating Stripe products...\n');

  for (const config of products) {
    try {
      // Create product
      const product = await stripe.products.create({
        name: config.name,
        description: config.description,
        metadata: config.metadata,
      });

      console.log(`✅ Created product: ${product.name} (${product.id})`);

      // Create price
      const priceData: Stripe.PriceCreateParams = {
        product: product.id,
        unit_amount: config.price,
        currency: 'usd',
        metadata: config.metadata,
      };

      if (config.type === 'recurring') {
        priceData.recurring = { interval: 'month' };
      }

      const price = await stripe.prices.create(priceData);
      priceIds.set(config.envKey, price.id);

      console.log(`   Price: $${config.price / 100} ${config.type === 'recurring' ? '/month' : 'one-time'} (${price.id})\n`);
    } catch (error) {
      console.error(`❌ Failed to create ${config.name}:`, error);
    }
  }

  return priceIds;
}

function updateEnvFile(priceIds: Map<string, string>): void {
  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = '';

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Update or add each price ID
  for (const [key, value] of priceIds) {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      envContent += `\n${key}=${value}`;
    }
  }

  fs.writeFileSync(envPath, envContent.trim() + '\n');
  console.log('📝 Updated .env.local with price IDs');
}

async function main(): Promise<void> {
  try {
    // Check if products already exist
    const existingProducts = await stripe.products.list({ limit: 10 });
    const existingNames = existingProducts.data.map(p => p.name);

    const hasExisting = products.some(p => existingNames.includes(p.name));

    if (hasExisting) {
      console.log('⚠️  Some products already exist in your Stripe account.');
      console.log('   Existing products will be skipped.\n');
    }

    const priceIds = await createProducts();

    if (priceIds.size > 0) {
      console.log('\n' + '='.repeat(50));
      console.log('📋 Environment Variables to add to .env.local:\n');

      for (const [key, value] of priceIds) {
        console.log(`${key}=${value}`);
      }

      console.log('\n' + '='.repeat(50));

      // Ask to update .env.local
      updateEnvFile(priceIds);

      console.log('\n✨ Setup complete! Your Stripe products are ready.');
      console.log('\nNext steps:');
      console.log('1. Set up webhooks at https://dashboard.stripe.com/webhooks');
      console.log('   Endpoint: https://yourdomain.com/api/stripe/webhook');
      console.log('   Events: checkout.session.completed, customer.subscription.*');
      console.log('2. Copy STRIPE_WEBHOOK_SECRET to .env.local');
      console.log('3. Restart your development server');
    }
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

main();
