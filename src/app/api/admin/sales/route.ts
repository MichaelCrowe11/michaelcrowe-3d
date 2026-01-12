import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'michael@michaelcrowe.ai').split(',');

// Simple admin check - in production, use proper auth
async function isAdmin(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('x-admin-email');
  if (authHeader && ADMIN_EMAILS.includes(authHeader)) {
    return true;
  }

  // Check for Clerk admin
  try {
    if (process.env.CLERK_SECRET_KEY) {
      const { auth, clerkClient } = await import('@clerk/nextjs/server');
      const { userId } = await auth();
      if (userId) {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const email = user.emailAddresses[0]?.emailAddress;
        return email ? ADMIN_EMAILS.includes(email) : false;
      }
    }
  } catch {
    // Clerk not configured
  }

  return false;
}

export async function GET(request: NextRequest) {
  const isAdminUser = await isAdmin(request);
  if (!isAdminUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const stripe = getStripe();
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || '30d';

    // Calculate date range
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const metrics: {
      totalRevenue: number;
      subscriptionRevenue: number;
      packageRevenue: number;
      activeSubscriptions: number;
      totalCustomers: number;
      newCustomers: number;
      recentCharges: Array<{
        id: string;
        amount: number;
        status: string;
        created: number;
        description: string | null;
        customer: string | null;
      }>;
      subscriptions: Array<{
        id: string;
        status: string;
        plan: string;
        amount: number;
        currentPeriodEnd: number;
      }>;
      usageStats: {
        totalMinutesUsed: number;
        totalSessions: number;
        averageSessionLength: number;
      } | null;
    } = {
      totalRevenue: 0,
      subscriptionRevenue: 0,
      packageRevenue: 0,
      activeSubscriptions: 0,
      totalCustomers: 0,
      newCustomers: 0,
      recentCharges: [],
      subscriptions: [],
      usageStats: null,
    };

    if (stripe) {
      // Get recent charges
      const charges = await stripe.charges.list({
        created: { gte: Math.floor(startDate.getTime() / 1000) },
        limit: 100,
      });

      metrics.recentCharges = charges.data.map(charge => ({
        id: charge.id,
        amount: charge.amount / 100,
        status: charge.status,
        created: charge.created,
        description: charge.description,
        customer: typeof charge.customer === 'string' ? charge.customer : null,
      }));

      metrics.totalRevenue = charges.data
        .filter(c => c.status === 'succeeded')
        .reduce((sum, c) => sum + c.amount / 100, 0);

      // Get active subscriptions
      const subscriptions = await stripe.subscriptions.list({
        status: 'active',
        limit: 100,
      });

      metrics.activeSubscriptions = subscriptions.data.length;
      metrics.subscriptionRevenue = subscriptions.data.reduce((sum, sub) => {
        const item = sub.items.data[0];
        return sum + (item?.price?.unit_amount || 0) / 100;
      }, 0);

      metrics.subscriptions = subscriptions.data.map(sub => ({
        id: sub.id,
        status: sub.status,
        plan: sub.items.data[0]?.price?.nickname || 'Unknown',
        amount: (sub.items.data[0]?.price?.unit_amount || 0) / 100,
        currentPeriodEnd: (sub as { current_period_end?: number }).current_period_end || 0,
      }));

      // Get customer count
      const customers = await stripe.customers.list({
        created: { gte: Math.floor(startDate.getTime() / 1000) },
        limit: 100,
      });
      metrics.newCustomers = customers.data.length;

      const allCustomers = await stripe.customers.list({ limit: 1 });
      metrics.totalCustomers = allCustomers.data.length > 0
        ? (await stripe.customers.list({})).data.length
        : 0;

      metrics.packageRevenue = metrics.totalRevenue - metrics.subscriptionRevenue;
    }

    // Get usage stats from Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: usageData } = await supabase
        .from('usage_records')
        .select('duration_seconds, minutes_charged')
        .gte('created_at', startDate.toISOString());

      if (usageData && usageData.length > 0) {
        const totalSeconds = usageData.reduce((sum, r) => sum + (r.duration_seconds || 0), 0);
        metrics.usageStats = {
          totalMinutesUsed: usageData.reduce((sum, r) => sum + (r.minutes_charged || 0), 0),
          totalSessions: usageData.length,
          averageSessionLength: Math.round(totalSeconds / usageData.length / 60),
        };
      }
    }

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Admin sales error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales data' },
      { status: 500 }
    );
  }
}
