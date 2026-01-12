// Monetization Components
// ======================
// Complete suite of components for Stripe-based monetization

// Pricing components
export { PricingModal } from '@/components/pricing/PricingModal';
export { CreditAlert, CreditBadge } from '@/components/pricing/CreditAlert';

// Account management
export { AccountDashboard } from '@/components/account/AccountDashboard';

// Admin components
export { AdminDashboard } from '@/components/admin/AdminDashboard';

// Hooks
export { useCredits, useSessionUsage } from '@/hooks/useCredits';

// Re-export types
export type { PackageId, SubscriptionId } from '@/lib/stripe';

// Re-export products config
export { PRODUCTS } from '@/lib/stripe';
