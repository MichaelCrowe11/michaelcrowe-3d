import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { storeConversation, extractTopics } from '@/lib/supabase';

const WEBHOOK_SECRET = process.env.ELEVENLABS_WEBHOOK_SECRET || '';

interface TranscriptEntry {
  role: 'agent' | 'user';
  message: string;
  time_in_call_secs: number;
}

interface WebhookPayload {
  type: 'post_call_transcription' | 'post_call_audio' | 'call_initiation_failure';
  event_timestamp: number;
  data: {
    agent_id: string;
    conversation_id: string;
    status?: string;
    user_id?: string;
    transcript?: TranscriptEntry[];
    full_audio?: string;
    failure_reason?: string;
    metadata?: {
      start_time_unix_secs?: number;
      call_duration_secs?: number;
      cost?: number;
      termination_reason?: string;
      phone_number?: string;
    };
    analysis?: {
      call_successful?: string;
      transcript_summary?: string;
      evaluation_criteria_results?: Record<string, unknown>;
      data_collection_results?: Record<string, unknown>;
    };
    conversation_initiation_client_data?: {
      dynamic_variables?: Record<string, string>;
    };
  };
}

function verifySignature(payload: string, signature: string, secret: string): boolean {
  if (!signature || !secret) return true; // Skip if not configured

  const parts = signature.split(',');
  const timestampPart = parts.find(p => p.startsWith('t='));
  const signaturePart = parts.find(p => p.startsWith('v0='));

  if (!timestampPart || !signaturePart) return false;

  const timestamp = timestampPart.substring(2);
  const providedSignature = signaturePart;

  // Check timestamp is within 30 minutes
  const reqTimestamp = parseInt(timestamp) * 1000;
  const tolerance = Date.now() - 30 * 60 * 1000;
  if (reqTimestamp < tolerance) return false;

  // Verify HMAC signature
  const message = `${timestamp}.${payload}`;
  const expectedSignature = 'v0=' + crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');

  return providedSignature === expectedSignature;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('elevenlabs-signature') || '';

    // Verify signature if secret is configured
    if (WEBHOOK_SECRET && !verifySignature(body, signature, WEBHOOK_SECRET)) {
      console.error('Invalid webhook signature');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const payload: WebhookPayload = JSON.parse(body);

    console.log(`[ElevenLabs Webhook] Type: ${payload.type}, Conversation: ${payload.data.conversation_id}`);

    switch (payload.type) {
      case 'post_call_transcription':
        await handleTranscription(payload.data);
        break;

      case 'post_call_audio':
        console.log('[Audio] Received audio for:', payload.data.conversation_id);
        break;

      case 'call_initiation_failure':
        console.log('[Call Failure]', payload.data.failure_reason);
        break;

      default:
        console.log('Unknown webhook type:', payload.type);
    }

    return new Response(JSON.stringify({ status: 'received' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(JSON.stringify({ error: 'Processing failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleTranscription(data: WebhookPayload['data']) {
  const { agent_id, conversation_id, transcript, metadata, analysis } = data;
  const dynamicVars = data.conversation_initiation_client_data?.dynamic_variables || {};

  // Extract user info from dynamic variables or data collection
  const userName = dynamicVars.user_name || dynamicVars.name || '';
  const userEmail = dynamicVars.user_email || dynamicVars.email || '';
  const userPhone = metadata?.phone_number || dynamicVars.phone || '';

  const summary = analysis?.transcript_summary || '';
  const topics = extractTopics(summary);

  console.log('[Transcription]', {
    conversationId: conversation_id,
    userName,
    userEmail,
    duration: metadata?.call_duration_secs,
    topics
  });

  // Store in Supabase
  try {
    await storeConversation({
      conversation_id,
      agent_id,
      user_email: userEmail || undefined,
      user_name: userName || undefined,
      user_phone: userPhone || undefined,
      transcript: transcript || [],
      summary,
      topics,
      duration_secs: metadata?.call_duration_secs,
      call_successful: analysis?.call_successful === 'success'
    });
    console.log('[Stored] Conversation saved to database');
  } catch (error) {
    console.error('[Storage Error]', error);
    // Don't fail the webhook if storage fails
  }
}

// Health check endpoint
export async function GET() {
  return new Response(JSON.stringify({ status: 'webhook listening', memory: 'enabled' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
