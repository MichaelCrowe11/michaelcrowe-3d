import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// Lazy initialization to avoid build errors
let supabaseClient: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase not configured - memory features disabled');
    return null;
  }
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseClient;
}

export interface Conversation {
  id?: string;
  conversation_id: string;
  agent_id: string;
  user_email?: string;
  user_name?: string;
  user_phone?: string;
  transcript: TranscriptEntry[];
  summary?: string;
  topics?: string[];
  duration_secs?: number;
  call_successful?: boolean;
  created_at?: string;
}

export interface TranscriptEntry {
  role: 'agent' | 'user';
  message: string;
  time_in_call_secs: number;
}

// Store a conversation after a call ends
export async function storeConversation(conversation: Conversation) {
  const supabase = getSupabase();
  if (!supabase) {
    console.log('Supabase not configured, skipping storage');
    return null;
  }

  const { data, error } = await supabase
    .from('conversations')
    .insert([conversation])
    .select()
    .single();

  if (error) {
    console.error('Error storing conversation:', error);
    throw error;
  }

  return data;
}

// Get past conversations for a user (by email or phone)
export async function getUserConversations(identifier: string, limit = 5) {
  const supabase = getSupabase();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .or(`user_email.eq.${identifier},user_phone.eq.${identifier}`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }

  return data || [];
}

// Build context from past conversations
export async function buildUserContext(identifier: string): Promise<{
  previousTopics: string;
  lastSummary: string;
  conversationCount: number;
  userName: string;
}> {
  const conversations = await getUserConversations(identifier, 3);

  if (conversations.length === 0) {
    return {
      previousTopics: '',
      lastSummary: '',
      conversationCount: 0,
      userName: ''
    };
  }

  // Extract topics from all conversations
  const allTopics = conversations
    .flatMap(c => c.topics || [])
    .filter((t, i, arr) => arr.indexOf(t) === i) // unique
    .slice(0, 10);

  // Get the most recent summary
  const lastSummary = conversations[0]?.summary || '';

  // Get user name from most recent conversation
  const userName = conversations[0]?.user_name || '';

  return {
    previousTopics: allTopics.join(', '),
    lastSummary,
    conversationCount: conversations.length,
    userName
  };
}

// Extract topics from transcript summary using simple keyword extraction
export function extractTopics(summary: string): string[] {
  if (!summary) return [];

  // Common mushroom/cultivation topics to look for
  const topicKeywords = [
    'lion\'s mane', 'lions mane', 'oyster', 'shiitake', 'reishi', 'chaga',
    'cultivation', 'growing', 'substrate', 'spawn', 'inoculation',
    'contamination', 'sterilization', 'pasteurization', 'fruiting',
    'humidity', 'temperature', 'lighting', 'harvest', 'yield',
    'agar', 'liquid culture', 'grain spawn', 'sawdust', 'straw',
    'monotub', 'martha', 'greenhouse', 'lab', 'flow hood',
    'tincture', 'extract', 'medicinal', 'gourmet', 'commercial',
    'consulting', 'AI', 'machine learning', 'drug discovery',
    'pricing', 'products', 'order', 'shipping', 'cultures'
  ];

  const lowerSummary = summary.toLowerCase();
  const foundTopics: string[] = [];

  for (const topic of topicKeywords) {
    if (lowerSummary.includes(topic.toLowerCase())) {
      foundTopics.push(topic);
    }
  }

  return foundTopics.slice(0, 5);
}
