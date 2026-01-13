import { NextRequest, NextResponse } from 'next/server';

// Cal.com API integration
const CALCOM_BASE_URL = 'https://api.cal.com/v1';

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

// Calendar tool definitions
const CALENDAR_TOOLS = [
  {
    name: 'get_availability',
    description: 'Get available time slots for booking a meeting',
    inputSchema: {
      type: 'object',
      properties: {
        dateFrom: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
        dateTo: { type: 'string', description: 'End date (YYYY-MM-DD)' },
        eventTypeId: { type: 'number', description: 'Event type ID (optional)' },
      },
      required: ['dateFrom', 'dateTo'],
    },
  },
  {
    name: 'create_booking',
    description: 'Book a meeting with the specified details',
    inputSchema: {
      type: 'object',
      properties: {
        eventTypeId: { type: 'number', description: 'Event type ID' },
        start: { type: 'string', description: 'Start time (ISO 8601)' },
        name: { type: 'string', description: 'Attendee name' },
        email: { type: 'string', description: 'Attendee email' },
        notes: { type: 'string', description: 'Meeting notes (optional)' },
      },
      required: ['eventTypeId', 'start', 'name', 'email'],
    },
  },
  {
    name: 'list_bookings',
    description: 'List upcoming bookings',
    inputSchema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['upcoming', 'past', 'cancelled'] },
        limit: { type: 'number', description: 'Max results (default 10)' },
      },
    },
  },
  {
    name: 'cancel_booking',
    description: 'Cancel an existing booking',
    inputSchema: {
      type: 'object',
      properties: {
        bookingId: { type: 'number', description: 'Booking ID to cancel' },
        reason: { type: 'string', description: 'Cancellation reason' },
      },
      required: ['bookingId'],
    },
  },
  {
    name: 'get_event_types',
    description: 'Get available event types (meeting types)',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

async function executeCalendarTool(
  name: string,
  args: Record<string, unknown>,
  apiKey: string | null
): Promise<{ content: Array<{ type: string; text: string }> }> {
  if (!apiKey) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          error: 'Calendar not configured',
          message: 'Cal.com API key not set. Please configure CALCOM_API_KEY.',
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
      case 'get_availability': {
        const { dateFrom, dateTo, eventTypeId } = args;
        const username = process.env.CALCOM_USERNAME || 'michaelcrowe';
        const params = new URLSearchParams({
          dateFrom: String(dateFrom),
          dateTo: String(dateTo),
          username,
        });
        if (eventTypeId) params.append('eventTypeId', String(eventTypeId));

        const res = await fetch(`${CALCOM_BASE_URL}/availability?${params}`, { headers });
        const data = await res.json();

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              availability: data.busy || [],
              slots: data.slots || [],
            }),
          }],
        };
      }

      case 'create_booking': {
        const { eventTypeId, start, name, email, notes } = args;

        const res = await fetch(`${CALCOM_BASE_URL}/bookings`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            eventTypeId: Number(eventTypeId),
            start: String(start),
            responses: {
              name: String(name),
              email: String(email),
              notes: notes ? String(notes) : undefined,
            },
            timeZone: 'America/New_York',
            language: 'en',
          }),
        });

        const data = await res.json();

        if (data.error) {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ error: data.error, message: data.message }),
            }],
          };
        }

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              booking: {
                id: data.id,
                uid: data.uid,
                title: data.title,
                start: data.startTime,
                end: data.endTime,
                attendee: name,
                email: email,
              },
            }),
          }],
        };
      }

      case 'list_bookings': {
        const { status = 'upcoming', limit = 10 } = args;
        const params = new URLSearchParams({
          status: String(status),
          limit: String(limit),
        });

        const res = await fetch(`${CALCOM_BASE_URL}/bookings?${params}`, { headers });
        const data = await res.json();

        const bookings = data.bookings?.map((b: Record<string, unknown>) => {
          const attendees = b.attendees as Array<{ name?: string; email?: string }> | undefined;
          return {
            id: b.id,
            title: b.title,
            start: b.startTime,
            end: b.endTime,
            attendee: attendees?.[0]?.name,
            email: attendees?.[0]?.email,
          };
        }) || [];

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ bookings }),
          }],
        };
      }

      case 'cancel_booking': {
        const { bookingId, reason } = args;

        const res = await fetch(`${CALCOM_BASE_URL}/bookings/${bookingId}/cancel`, {
          method: 'DELETE',
          headers,
          body: JSON.stringify({ reason: reason ? String(reason) : undefined }),
        });

        if (res.ok) {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Booking cancelled' }),
            }],
          };
        }

        const data = await res.json();
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ error: data.error || 'Failed to cancel' }),
          }],
        };
      }

      case 'get_event_types': {
        const res = await fetch(`${CALCOM_BASE_URL}/event-types`, { headers });
        const data = await res.json();

        const eventTypes = data.event_types?.map((e: Record<string, unknown>) => ({
          id: e.id,
          title: e.title,
          slug: e.slug,
          length: e.length,
          description: e.description,
        })) || [];

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ eventTypes }),
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
              name: 'calendar-mcp',
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
          result: { tools: CALENDAR_TOOLS },
        };
        break;

      case 'tools/call':
        const toolName = params?.name as string;
        const toolArgs = params?.arguments as Record<string, unknown>;
        const apiKey = process.env.CALCOM_API_KEY || null;
        const toolResult = await executeCalendarTool(toolName, toolArgs, apiKey);
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
    console.error('Calendar MCP error:', error);
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
    service: 'calendar-mcp',
    configured: !!process.env.CALCOM_API_KEY,
    tools: CALENDAR_TOOLS.map((t) => t.name),
  });
}
