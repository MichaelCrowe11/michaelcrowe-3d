import { NextRequest } from 'next/server';
import { buildUserContext } from '@/lib/supabase';

// Get conversation context for a user
// Called before starting a new conversation to inject memory
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const phone = searchParams.get('phone');

  const identifier = email || phone;

  if (!identifier) {
    return new Response(JSON.stringify({
      error: 'Email or phone required',
      context: {
        previous_topics: '',
        last_summary: '',
        conversation_count: 0,
        user_name: '',
        is_returning: false
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const context = await buildUserContext(identifier);

    return new Response(JSON.stringify({
      context: {
        previous_topics: context.previousTopics,
        last_summary: context.lastSummary,
        conversation_count: context.conversationCount,
        user_name: context.userName,
        is_returning: context.conversationCount > 0
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error building context:', error);
    return new Response(JSON.stringify({
      error: 'Failed to build context',
      context: {
        previous_topics: '',
        last_summary: '',
        conversation_count: 0,
        user_name: '',
        is_returning: false
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
