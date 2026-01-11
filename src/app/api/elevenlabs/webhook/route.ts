import { NextRequest } from 'next/server';
import crypto from 'crypto';

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
      type?: string;
      body?: Record<string, unknown>;
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
  if (!signature || !secret) return false;

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
        await handleAudio(payload.data);
        break;

      case 'call_initiation_failure':
        await handleCallFailure(payload.data);
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
  const userName = data.conversation_initiation_client_data?.dynamic_variables?.user_name;

  console.log('[Transcription]', {
    agentId: agent_id,
    conversationId: conversation_id,
    userName,
    duration: metadata?.call_duration_secs,
    success: analysis?.call_successful,
    summary: analysis?.transcript_summary?.substring(0, 200)
  });

  // Store conversation data
  // TODO: Add database integration (Supabase, etc.)
  // await db.conversations.create({
  //   conversationId: conversation_id,
  //   agentId: agent_id,
  //   userName,
  //   transcript,
  //   summary: analysis?.transcript_summary,
  //   duration: metadata?.call_duration_secs,
  //   timestamp: new Date(metadata?.start_time_unix_secs || Date.now() * 1000)
  // });

  // Send notification email
  // await sendNotificationEmail({
  //   subject: `New conversation with ${userName || 'Unknown'}`,
  //   body: analysis?.transcript_summary
  // });
}

async function handleAudio(data: WebhookPayload['data']) {
  const { agent_id, conversation_id, full_audio } = data;

  console.log('[Audio]', {
    agentId: agent_id,
    conversationId: conversation_id,
    audioSize: full_audio ? `${(full_audio.length * 0.75 / 1024).toFixed(1)}KB` : 'none'
  });

  // Store audio file
  // TODO: Upload to cloud storage (S3, Azure Blob, etc.)
  // if (full_audio) {
  //   const audioBuffer = Buffer.from(full_audio, 'base64');
  //   await uploadToStorage(`conversations/${conversation_id}.mp3`, audioBuffer);
  // }
}

async function handleCallFailure(data: WebhookPayload['data']) {
  const { agent_id, conversation_id, failure_reason, metadata } = data;

  console.log('[Call Failure]', {
    agentId: agent_id,
    conversationId: conversation_id,
    reason: failure_reason,
    provider: metadata?.type,
    details: metadata?.body
  });

  // Log failed call attempts
  // TODO: Store in database for analytics
}

// Health check endpoint
export async function GET() {
  return new Response(JSON.stringify({ status: 'webhook listening' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
