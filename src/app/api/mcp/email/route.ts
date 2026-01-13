import { NextRequest, NextResponse } from 'next/server';

// Resend Email API integration
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const DEFAULT_FROM_EMAIL = process.env.FROM_EMAIL || 'Michael Crowe <hello@michaelcrowe.ai>';
const RESEND_BASE_URL = 'https://api.resend.com';

// MCP Protocol types
interface MCPRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

interface MCPResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: unknown;
  error?: { code: number; message: string };
}

// Email tool definitions
const EMAIL_TOOLS = [
  {
    name: 'send_email',
    description: 'Send an email to one or more recipients',
    inputSchema: {
      type: 'object',
      properties: {
        to: {
          oneOf: [
            { type: 'string', description: 'Single recipient email' },
            { type: 'array', items: { type: 'string' }, description: 'Multiple recipients' },
          ],
        },
        subject: { type: 'string', description: 'Email subject line' },
        body: { type: 'string', description: 'Email body (plain text or HTML)' },
        isHtml: { type: 'boolean', description: 'Whether body is HTML (default: false)' },
        replyTo: { type: 'string', description: 'Reply-to email address' },
        cc: { type: 'array', items: { type: 'string' }, description: 'CC recipients' },
        bcc: { type: 'array', items: { type: 'string' }, description: 'BCC recipients' },
      },
      required: ['to', 'subject', 'body'],
    },
  },
  {
    name: 'send_template_email',
    description: 'Send a pre-designed email template',
    inputSchema: {
      type: 'object',
      properties: {
        to: { type: 'string', description: 'Recipient email' },
        template: {
          type: 'string',
          enum: ['welcome', 'booking_confirmation', 'follow_up', 'thank_you'],
          description: 'Template name',
        },
        variables: {
          type: 'object',
          description: 'Template variables (name, date, etc.)',
        },
      },
      required: ['to', 'template'],
    },
  },
  {
    name: 'schedule_email',
    description: 'Schedule an email to be sent later',
    inputSchema: {
      type: 'object',
      properties: {
        to: { type: 'string', description: 'Recipient email' },
        subject: { type: 'string', description: 'Email subject' },
        body: { type: 'string', description: 'Email body' },
        sendAt: { type: 'string', description: 'ISO 8601 datetime to send (max 7 days)' },
      },
      required: ['to', 'subject', 'body', 'sendAt'],
    },
  },
  {
    name: 'get_email_status',
    description: 'Check the delivery status of a sent email',
    inputSchema: {
      type: 'object',
      properties: {
        emailId: { type: 'string', description: 'Email ID from send response' },
      },
      required: ['emailId'],
    },
  },
];

// Email templates
const EMAIL_TEMPLATES: Record<string, { subject: string; html: (vars: Record<string, string>) => string }> = {
  welcome: {
    subject: 'Welcome to michaelcrowe.ai',
    html: (vars) => `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #06b6d4; margin-bottom: 24px;">Welcome, ${vars.name || 'there'}!</h1>
        <p style="color: #374151; line-height: 1.6;">
          Thank you for joining michaelcrowe.ai. You now have access to our AI-powered voice agents for consulting in:
        </p>
        <ul style="color: #374151; line-height: 1.8;">
          <li>Cultivation Intelligence</li>
          <li>AI Strategy</li>
          <li>Drug Discovery</li>
          <li>And more...</li>
        </ul>
        <p style="color: #374151; line-height: 1.6;">
          You've received <strong>3 free minutes</strong> to try any agent. Ready to get started?
        </p>
        <a href="https://michaelcrowe.ai" style="display: inline-block; background: linear-gradient(to right, #06b6d4, #10b981); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">
          Start Consulting
        </a>
      </div>
    `,
  },
  booking_confirmation: {
    subject: 'Your Consultation is Confirmed',
    html: (vars) => `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #06b6d4; margin-bottom: 24px;">Booking Confirmed</h1>
        <p style="color: #374151; line-height: 1.6;">Hi ${vars.name || 'there'},</p>
        <p style="color: #374151; line-height: 1.6;">
          Your consultation has been scheduled:
        </p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #374151;"><strong>Date:</strong> ${vars.date || 'TBD'}</p>
          <p style="margin: 8px 0 0; color: #374151;"><strong>Time:</strong> ${vars.time || 'TBD'}</p>
          <p style="margin: 8px 0 0; color: #374151;"><strong>Topic:</strong> ${vars.topic || 'General Consultation'}</p>
        </div>
        <p style="color: #6b7280; font-size: 14px;">
          You'll receive a calendar invite shortly. Questions? Reply to this email.
        </p>
      </div>
    `,
  },
  follow_up: {
    subject: 'Following Up on Your Consultation',
    html: (vars) => `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #06b6d4; margin-bottom: 24px;">Thank You for Your Time</h1>
        <p style="color: #374151; line-height: 1.6;">Hi ${vars.name || 'there'},</p>
        <p style="color: #374151; line-height: 1.6;">
          Thank you for your recent consultation. I hope you found our discussion valuable.
        </p>
        ${vars.summary ? `<p style="color: #374151; line-height: 1.6;"><strong>Key Points:</strong><br/>${vars.summary}</p>` : ''}
        <p style="color: #374151; line-height: 1.6;">
          If you have any follow-up questions or would like to continue our conversation, I'm here to help.
        </p>
        <a href="https://michaelcrowe.ai" style="display: inline-block; background: linear-gradient(to right, #06b6d4, #10b981); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">
          Schedule Follow-up
        </a>
      </div>
    `,
  },
  thank_you: {
    subject: 'Access Confirmed',
    html: (vars) => `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #06b6d4; margin-bottom: 24px;">Access confirmed</h1>
        <p style="color: #374151; line-height: 1.6;">Hi ${vars.name || 'there'},</p>
        <p style="color: #374151; line-height: 1.6;">
          Your account has been credited with <strong>${vars.minutes || '0'} minutes</strong>.
        </p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #374151;"><strong>Order:</strong> ${vars.orderId || 'N/A'}</p>
          <p style="margin: 8px 0 0; color: #374151;"><strong>Amount:</strong> $${vars.amount || '0'}</p>
          <p style="margin: 8px 0 0; color: #374151;"><strong>Minutes Added:</strong> ${vars.minutes || '0'}</p>
        </div>
        <a href="https://michaelcrowe.ai" style="display: inline-block; background: linear-gradient(to right, #06b6d4, #10b981); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">
          Open your minutes
        </a>
      </div>
    `,
  },
};

async function executeEmailTool(
  name: string,
  args: Record<string, unknown>,
  apiKey: string | null
): Promise<{ content: Array<{ type: string; text: string }> }> {
  if (!apiKey) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          error: 'Email not configured',
          message: 'Resend API key not set. Please configure RESEND_API_KEY.',
        }),
      }],
    };
  }

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  try {
    switch (name) {
      case 'send_email': {
        const { to, subject, body, isHtml, replyTo, cc, bcc } = args;

        const payload: Record<string, unknown> = {
          from: DEFAULT_FROM_EMAIL,
          to: Array.isArray(to) ? to : [String(to)],
          subject: String(subject),
        };

        if (isHtml) {
          payload.html = String(body);
        } else {
          payload.text = String(body);
        }

        if (replyTo) payload.reply_to = String(replyTo);
        if (cc) payload.cc = cc;
        if (bcc) payload.bcc = bcc;

        const res = await fetch(`${RESEND_BASE_URL}/emails`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (data.error) {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ error: data.error.message }),
            }],
          };
        }

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              emailId: data.id,
              message: 'Email sent successfully',
            }),
          }],
        };
      }

      case 'send_template_email': {
        const { to, template, variables } = args;
        const templateName = String(template);
        const templateData = EMAIL_TEMPLATES[templateName];

        if (!templateData) {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ error: `Unknown template: ${templateName}` }),
            }],
          };
        }

        const vars = (variables as Record<string, string>) || {};
        const html = templateData.html(vars);

        const res = await fetch(`${RESEND_BASE_URL}/emails`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            from: DEFAULT_FROM_EMAIL,
            to: [String(to)],
            subject: templateData.subject,
            html,
          }),
        });

        const data = await res.json();

        if (data.error) {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ error: data.error.message }),
            }],
          };
        }

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              emailId: data.id,
              template: templateName,
              message: 'Template email sent successfully',
            }),
          }],
        };
      }

      case 'schedule_email': {
        const { to, subject, body, sendAt } = args;

        const scheduledDate = new Date(String(sendAt));
        const now = new Date();
        const maxDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        if (scheduledDate < now) {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ error: 'Scheduled time must be in the future' }),
            }],
          };
        }

        if (scheduledDate > maxDate) {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ error: 'Cannot schedule more than 7 days in advance' }),
            }],
          };
        }

        const res = await fetch(`${RESEND_BASE_URL}/emails`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            from: DEFAULT_FROM_EMAIL,
            to: [String(to)],
            subject: String(subject),
            text: String(body),
            scheduled_at: scheduledDate.toISOString(),
          }),
        });

        const data = await res.json();

        if (data.error) {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ error: data.error.message }),
            }],
          };
        }

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              emailId: data.id,
              scheduledAt: scheduledDate.toISOString(),
              message: 'Email scheduled successfully',
            }),
          }],
        };
      }

      case 'get_email_status': {
        const { emailId } = args;

        const res = await fetch(`${RESEND_BASE_URL}/emails/${emailId}`, {
          headers,
        });

        const data = await res.json();

        if (data.error) {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ error: data.error.message }),
            }],
          };
        }

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              id: data.id,
              to: data.to,
              subject: data.subject,
              status: data.last_event || 'sent',
              createdAt: data.created_at,
            }),
          }],
        };
      }

      default:
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ error: `Unknown tool: ${name}` }),
          }],
        };
    }
  } catch (err) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ error: String(err) }),
      }],
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: MCPRequest = await request.json();
    const { id, method, params } = body;

    let response: MCPResponse;

    switch (method) {
      case 'initialize':
        response = {
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            serverInfo: {
              name: 'email-mcp',
              version: '1.0.0',
            },
            capabilities: { tools: {} },
          },
        };
        break;

      case 'tools/list':
        response = {
          jsonrpc: '2.0',
          id,
          result: { tools: EMAIL_TOOLS },
        };
        break;

      case 'tools/call':
        const toolName = params?.name as string;
        const toolArgs = params?.arguments as Record<string, unknown>;
        const toolResult = await executeEmailTool(toolName, toolArgs, RESEND_API_KEY ?? null);
        response = {
          jsonrpc: '2.0',
          id,
          result: toolResult,
        };
        break;

      default:
        response = {
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Method not found: ${method}` },
        };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Email MCP error:', error);
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32603, message: 'Internal error' },
      },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'email-mcp',
    configured: !!RESEND_API_KEY,
    tools: EMAIL_TOOLS.map((t) => t.name),
    templates: Object.keys(EMAIL_TEMPLATES),
  });
}
