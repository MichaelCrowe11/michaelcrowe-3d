# Stripe Products Setup Guide

This guide walks you through creating the Stripe products and prices needed for the michaelcrowe.ai monetization system.

## Prerequisites

1. A Stripe account (https://dashboard.stripe.com)
2. Access to your Stripe Dashboard
3. Your Stripe Secret Key (for `.env.local`)

## Step 1: Get Your API Keys

1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Secret key** (starts with `sk_live_` or `sk_test_`)
3. Add to your `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_test_your_key_here
   ```

## Step 2: Create Minute Packages (One-Time Purchases)

### Starter Pack - $15 for 30 minutes

1. Go to **Products** → **Add product**
2. Fill in:
   - **Name**: Starter Pack
   - **Description**: 30 minutes of AI consulting time
   - **Price**: $15.00 USD (one-time)
3. Click **Save product**
4. Copy the **Price ID** (starts with `price_`)
5. Add to `.env.local`:
   ```
   STRIPE_PRICE_STARTER_PACK=price_xxxxxxxxxxxxx
   ```

### Pro Pack - $50 for 120 minutes

1. Go to **Products** → **Add product**
2. Fill in:
   - **Name**: Pro Pack
   - **Description**: 120 minutes of AI consulting (17% savings)
   - **Price**: $50.00 USD (one-time)
3. Copy the **Price ID** and add:
   ```
   STRIPE_PRICE_PRO_PACK=price_xxxxxxxxxxxxx
   ```

### Enterprise Pack - $175 for 500 minutes

1. Go to **Products** → **Add product**
2. Fill in:
   - **Name**: Enterprise Pack
   - **Description**: 500 minutes of AI consulting (30% savings)
   - **Price**: $175.00 USD (one-time)
3. Copy the **Price ID** and add:
   ```
   STRIPE_PRICE_ENTERPRISE_PACK=price_xxxxxxxxxxxxx
   ```

## Step 3: Create Subscription Plans

### Basic Plan - $29/month for 60 minutes

1. Go to **Products** → **Add product**
2. Fill in:
   - **Name**: Basic Subscription
   - **Description**: 60 minutes per month
   - **Price**: $29.00 USD / month (recurring)
3. Copy the **Price ID** and add:
   ```
   STRIPE_PRICE_BASIC_SUB=price_xxxxxxxxxxxxx
   ```

### Professional Plan - $79/month for 200 minutes

1. Go to **Products** → **Add product**
2. Fill in:
   - **Name**: Professional Subscription
   - **Description**: 200 minutes per month (34% savings)
   - **Price**: $79.00 USD / month (recurring)
3. Copy the **Price ID** and add:
   ```
   STRIPE_PRICE_PROFESSIONAL_SUB=price_xxxxxxxxxxxxx
   ```

### Unlimited Plan - $199/month

1. Go to **Products** → **Add product**
2. Fill in:
   - **Name**: Unlimited Subscription
   - **Description**: Unlimited consulting minutes
   - **Price**: $199.00 USD / month (recurring)
3. Copy the **Price ID** and add:
   ```
   STRIPE_PRICE_UNLIMITED_SUB=price_xxxxxxxxxxxxx
   ```

## Step 4: Set Up Webhooks

1. Go to **Developers** → **Webhooks** → **Add endpoint**
2. Enter your endpoint URL:
   ```
   https://your-domain.com/api/stripe/webhook
   ```
   For local development, use Stripe CLI (see below)
3. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Click **Add endpoint**
5. Copy the **Signing secret** and add:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

## Local Development with Stripe CLI

For testing webhooks locally:

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. Copy the webhook signing secret shown and add to `.env.local`

## Testing

### Test Card Numbers

Use these in test mode:
- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **3D Secure**: 4000 0000 0000 3220

### Verify Setup

1. Start your dev server: `npm run dev`
2. Open the pricing modal
3. Click "Buy Now" on any package
4. Complete checkout with a test card
5. Check your Supabase `user_credits` table for the added minutes

## Production Checklist

- [ ] Switch to live API keys
- [ ] Update webhook URL to production domain
- [ ] Test a real payment (you can refund it)
- [ ] Enable fraud protection in Stripe Radar
- [ ] Set up billing email templates

## Pricing Summary

| Product | Type | Price | Minutes | Per-Minute Cost |
|---------|------|-------|---------|-----------------|
| Starter Pack | One-time | $15 | 30 | $0.50 |
| Pro Pack | One-time | $50 | 120 | $0.42 |
| Enterprise Pack | One-time | $175 | 500 | $0.35 |
| Basic Sub | Monthly | $29 | 60 | $0.48 |
| Professional Sub | Monthly | $79 | 200 | $0.40 |
| Unlimited Sub | Monthly | $199 | ∞ | - |

## Troubleshooting

### "Payments not configured" error
- Ensure `STRIPE_SECRET_KEY` is set correctly
- Restart your dev server after adding env vars

### "Price ID not configured" error
- Verify all `STRIPE_PRICE_*` variables are set
- Check that price IDs start with `price_`

### Webhook not receiving events
- Verify webhook URL is accessible
- Check `STRIPE_WEBHOOK_SECRET` matches your endpoint
- Use Stripe CLI for local development

### Credits not being added
- Check Supabase connection (`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`)
- Verify `user_credits` table exists (run schema.sql)
- Check webhook logs in Stripe Dashboard
