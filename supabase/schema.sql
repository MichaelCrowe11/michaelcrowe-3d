-- Supabase Schema for michaelcrowe.ai Voice Agent Platform
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Credits Table
-- Stores user balance, subscription info, and Stripe customer mapping
CREATE TABLE IF NOT EXISTS user_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT UNIQUE NOT NULL,
  balance_minutes NUMERIC(10, 2) DEFAULT 3.0,  -- Free tier: 3 minutes
  subscription_tier TEXT,  -- 'basic', 'professional', 'unlimited', or null
  subscription_minutes_remaining NUMERIC(10, 2) DEFAULT 0,
  subscription_reset_date TIMESTAMPTZ,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage Records Table
-- Tracks all agent session usage for billing and analytics
CREATE TABLE IF NOT EXISTS usage_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  minutes_charged NUMERIC(10, 2) NOT NULL,
  billing_type TEXT NOT NULL CHECK (billing_type IN ('free_tier', 'subscription', 'credits')),
  cost_usd NUMERIC(10, 4),  -- Optional: track actual cost
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_user_credits_stripe_customer ON user_credits(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_user_id ON usage_records(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_agent_id ON usage_records(agent_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_created_at ON usage_records(created_at DESC);

-- Function to add credits (atomic operation)
CREATE OR REPLACE FUNCTION add_user_credits(p_user_id TEXT, p_minutes NUMERIC)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_credits (user_id, balance_minutes)
  VALUES (p_user_id, p_minutes)
  ON CONFLICT (user_id)
  DO UPDATE SET
    balance_minutes = user_credits.balance_minutes + p_minutes,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to reset subscription minutes (for monthly billing cycle)
CREATE OR REPLACE FUNCTION reset_subscription_minutes(p_user_id TEXT, p_minutes NUMERIC)
RETURNS VOID AS $$
BEGIN
  UPDATE user_credits
  SET
    subscription_minutes_remaining = p_minutes,
    subscription_reset_date = NOW() + INTERVAL '1 month',
    updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) Policies
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for API routes)
CREATE POLICY "Service role can manage user_credits" ON user_credits
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage usage_records" ON usage_records
  FOR ALL USING (auth.role() = 'service_role');

-- Allow users to read their own credits (if using Supabase Auth)
CREATE POLICY "Users can read own credits" ON user_credits
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can read own usage" ON usage_records
  FOR SELECT USING (auth.uid()::text = user_id);

-- Analytics Views
CREATE OR REPLACE VIEW usage_analytics AS
SELECT
  agent_id,
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as sessions,
  SUM(duration_seconds) as total_seconds,
  SUM(minutes_charged) as total_minutes,
  SUM(cost_usd) as total_revenue
FROM usage_records
GROUP BY agent_id, DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Grant access to views
GRANT SELECT ON usage_analytics TO authenticated;
GRANT SELECT ON usage_analytics TO service_role;

-- Comments for documentation
COMMENT ON TABLE user_credits IS 'User balance and subscription information';
COMMENT ON TABLE usage_records IS 'Session usage tracking for billing';
COMMENT ON COLUMN user_credits.balance_minutes IS 'Prepaid minutes from package purchases';
COMMENT ON COLUMN user_credits.subscription_tier IS 'Active subscription: basic, professional, unlimited';
COMMENT ON COLUMN usage_records.billing_type IS 'How the session was billed: free_tier, subscription, or credits';
