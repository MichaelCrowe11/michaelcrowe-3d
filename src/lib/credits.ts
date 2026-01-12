import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

let supabaseClient: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase not configured - credits features disabled');
    return null;
  }
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseClient;
}

export interface UserCredits {
  user_id: string;
  balance_minutes: number;
  subscription_tier: string | null;
  subscription_minutes_remaining: number;
  subscription_reset_date: string | null;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface UsageRecord {
  id?: string;
  user_id: string;
  agent_id: string;
  duration_seconds: number;
  minutes_charged: number;
  billing_type: 'free_tier' | 'subscription' | 'credits';
  created_at?: string;
}

// Get or create user credits
export async function getUserCredits(userId: string): Promise<UserCredits | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('user_credits')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching credits:', error);
    return null;
  }

  if (!data) {
    // Create new user credits record
    const { data: newData, error: insertError } = await supabase
      .from('user_credits')
      .insert({
        user_id: userId,
        balance_minutes: 3, // Free tier: 3 minutes
        subscription_tier: null,
        subscription_minutes_remaining: 0,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating credits:', insertError);
      return null;
    }

    return newData;
  }

  return data;
}

// Add minutes to user balance (after package purchase)
export async function addCredits(userId: string, minutes: number): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { error } = await supabase.rpc('add_user_credits', {
    p_user_id: userId,
    p_minutes: minutes,
  });

  if (error) {
    console.error('Error adding credits:', error);
    // Fallback: direct update
    const current = await getUserCredits(userId);
    if (current) {
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({
          balance_minutes: current.balance_minutes + minutes,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      return !updateError;
    }
    return false;
  }

  return true;
}

// Deduct minutes from user balance
export async function deductCredits(
  userId: string,
  agentId: string,
  durationSeconds: number
): Promise<{ success: boolean; billingType: UsageRecord['billing_type'] }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, billingType: 'credits' };

  const credits = await getUserCredits(userId);
  if (!credits) return { success: false, billingType: 'credits' };

  const minutesToDeduct = Math.ceil(durationSeconds / 60);
  let billingType: UsageRecord['billing_type'] = 'credits';

  // Check subscription first
  if (credits.subscription_tier && credits.subscription_minutes_remaining > 0) {
    billingType = 'subscription';
    const { error } = await supabase
      .from('user_credits')
      .update({
        subscription_minutes_remaining: Math.max(0, credits.subscription_minutes_remaining - minutesToDeduct),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error deducting subscription minutes:', error);
      return { success: false, billingType };
    }
  } else if (credits.balance_minutes >= minutesToDeduct) {
    // Use credit balance
    billingType = 'credits';
    const { error } = await supabase
      .from('user_credits')
      .update({
        balance_minutes: credits.balance_minutes - minutesToDeduct,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error deducting credits:', error);
      return { success: false, billingType };
    }
  } else {
    // Not enough credits
    return { success: false, billingType };
  }

  // Record usage
  await supabase.from('usage_records').insert({
    user_id: userId,
    agent_id: agentId,
    duration_seconds: durationSeconds,
    minutes_charged: minutesToDeduct,
    billing_type: billingType,
  });

  return { success: true, billingType };
}

// Check if user has enough credits for a session
export async function canStartSession(userId: string): Promise<{
  canStart: boolean;
  availableMinutes: number;
  source: 'subscription' | 'credits' | 'none';
}> {
  const credits = await getUserCredits(userId);

  if (!credits) {
    return { canStart: false, availableMinutes: 0, source: 'none' };
  }

  // Check subscription first
  if (credits.subscription_tier) {
    if (credits.subscription_tier === 'unlimited') {
      return { canStart: true, availableMinutes: -1, source: 'subscription' };
    }
    if (credits.subscription_minutes_remaining > 0) {
      return {
        canStart: true,
        availableMinutes: credits.subscription_minutes_remaining,
        source: 'subscription'
      };
    }
  }

  // Check credit balance
  if (credits.balance_minutes > 0) {
    return {
      canStart: true,
      availableMinutes: credits.balance_minutes,
      source: 'credits'
    };
  }

  return { canStart: false, availableMinutes: 0, source: 'none' };
}

// Update subscription after payment
export async function updateSubscription(
  userId: string,
  tier: string,
  monthlyMinutes: number,
  stripeCustomerId: string
): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const resetDate = new Date();
  resetDate.setMonth(resetDate.getMonth() + 1);

  const { error } = await supabase
    .from('user_credits')
    .upsert({
      user_id: userId,
      subscription_tier: tier,
      subscription_minutes_remaining: monthlyMinutes === -1 ? 999999 : monthlyMinutes,
      subscription_reset_date: resetDate.toISOString(),
      stripe_customer_id: stripeCustomerId,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id',
    });

  if (error) {
    console.error('Error updating subscription:', error);
    return false;
  }

  return true;
}

// Get user's usage history
export async function getUsageHistory(userId: string, limit = 20): Promise<UsageRecord[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('usage_records')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching usage:', error);
    return [];
  }

  return data || [];
}
