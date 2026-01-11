-- Supabase Schema for ElevenLabs Conversation Memory
-- Run this in your Supabase SQL Editor

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id TEXT NOT NULL UNIQUE,
  agent_id TEXT NOT NULL,
  user_email TEXT,
  user_name TEXT,
  user_phone TEXT,
  transcript JSONB DEFAULT '[]'::jsonb,
  summary TEXT,
  topics TEXT[] DEFAULT '{}',
  duration_secs INTEGER,
  call_successful BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_conversations_user_email ON conversations(user_email);
CREATE INDEX IF NOT EXISTS idx_conversations_user_phone ON conversations(user_phone);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_agent_id ON conversations(agent_id);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role full access
CREATE POLICY "Service role has full access" ON conversations
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- View for conversation analytics
CREATE OR REPLACE VIEW conversation_stats AS
SELECT
  agent_id,
  COUNT(*) as total_calls,
  COUNT(DISTINCT user_email) as unique_users_email,
  COUNT(DISTINCT user_phone) as unique_users_phone,
  AVG(duration_secs) as avg_duration,
  SUM(CASE WHEN call_successful THEN 1 ELSE 0 END) as successful_calls,
  array_agg(DISTINCT unnest(topics)) as all_topics
FROM conversations
GROUP BY agent_id;

-- Function to get user's conversation history
CREATE OR REPLACE FUNCTION get_user_history(user_identifier TEXT, max_results INTEGER DEFAULT 5)
RETURNS TABLE (
  conversation_id TEXT,
  summary TEXT,
  topics TEXT[],
  duration_secs INTEGER,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.conversation_id,
    c.summary,
    c.topics,
    c.duration_secs,
    c.created_at
  FROM conversations c
  WHERE c.user_email = user_identifier
     OR c.user_phone = user_identifier
  ORDER BY c.created_at DESC
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql;
