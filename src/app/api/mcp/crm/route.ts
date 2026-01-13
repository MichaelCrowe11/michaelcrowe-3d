import { NextRequest, NextResponse } from 'next/server';

// HubSpot CRM API integration
const HUBSPOT_BASE_URL = 'https://api.hubapi.com';

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

// CRM tool definitions
const CRM_TOOLS = [
  {
    name: 'search_contacts',
    description: 'Search for contacts by email, name, or company',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search term (email, name, or company)' },
        limit: { type: 'number', description: 'Max results (default 10)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_contact',
    description: 'Get detailed contact information by email',
    inputSchema: {
      type: 'object',
      properties: {
        email: { type: 'string', description: 'Contact email address' },
      },
      required: ['email'],
    },
  },
  {
    name: 'create_contact',
    description: 'Create a new contact in the CRM',
    inputSchema: {
      type: 'object',
      properties: {
        email: { type: 'string', description: 'Email address' },
        firstName: { type: 'string', description: 'First name' },
        lastName: { type: 'string', description: 'Last name' },
        company: { type: 'string', description: 'Company name' },
        phone: { type: 'string', description: 'Phone number' },
        notes: { type: 'string', description: 'Contact notes' },
      },
      required: ['email', 'firstName'],
    },
  },
  {
    name: 'update_contact',
    description: 'Update an existing contact',
    inputSchema: {
      type: 'object',
      properties: {
        email: { type: 'string', description: 'Contact email (to identify)' },
        updates: {
          type: 'object',
          description: 'Fields to update',
          properties: {
            name: { type: 'string' },
            company: { type: 'string' },
            phone: { type: 'string' },
            notes: { type: 'string' },
            status: { type: 'string' },
          },
        },
      },
      required: ['email', 'updates'],
    },
  },
  {
    name: 'log_interaction',
    description: 'Log an interaction with a contact (call, email, meeting)',
    inputSchema: {
      type: 'object',
      properties: {
        email: { type: 'string', description: 'Contact email' },
        interactionType: { type: 'string', enum: ['call', 'email', 'meeting', 'note'] },
        summary: { type: 'string', description: 'Interaction summary' },
        outcome: { type: 'string', description: 'Outcome or next steps' },
      },
      required: ['email', 'interactionType', 'summary'],
    },
  },
  {
    name: 'get_deals',
    description: 'Get deals/opportunities for a contact',
    inputSchema: {
      type: 'object',
      properties: {
        email: { type: 'string', description: 'Contact email' },
      },
      required: ['email'],
    },
  },
  {
    name: 'create_deal',
    description: 'Create a new deal/opportunity',
    inputSchema: {
      type: 'object',
      properties: {
        contactEmail: { type: 'string', description: 'Associated contact email' },
        dealName: { type: 'string', description: 'Deal name' },
        amount: { type: 'number', description: 'Deal amount in USD' },
        stage: { type: 'string', description: 'Pipeline stage' },
        closeDate: { type: 'string', description: 'Expected close date (YYYY-MM-DD)' },
      },
      required: ['contactEmail', 'dealName'],
    },
  },
];

async function executeCRMTool(
  name: string,
  args: Record<string, unknown>,
  apiKey: string | null
): Promise<{ content: Array<{ type: string; text: string }> }> {
  if (!apiKey) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          error: 'CRM not configured',
          message: 'HubSpot API key not set. Please configure HUBSPOT_API_KEY.',
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
      case 'search_contacts': {
        const { query, limit = 10 } = args;

        const res = await fetch(`${HUBSPOT_BASE_URL}/crm/v3/objects/contacts/search`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            filterGroups: [{
              filters: [
                { propertyName: 'email', operator: 'CONTAINS_TOKEN', value: String(query) },
              ],
            }],
            properties: ['email', 'firstname', 'lastname', 'company', 'phone', 'hs_lead_status'],
            limit: Number(limit),
          }),
        });

        const data = await res.json();

        const contacts = data.results?.map((c: { id: string; properties: Record<string, string> }) => ({
          id: c.id,
          email: c.properties.email,
          name: `${c.properties.firstname || ''} ${c.properties.lastname || ''}`.trim(),
          company: c.properties.company,
          phone: c.properties.phone,
          status: c.properties.hs_lead_status,
        })) || [];

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ contacts }),
          }],
        };
      }

      case 'get_contact': {
        const { email } = args;

        const res = await fetch(`${HUBSPOT_BASE_URL}/crm/v3/objects/contacts/search`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            filterGroups: [{
              filters: [
                { propertyName: 'email', operator: 'EQ', value: String(email) },
              ],
            }],
            properties: [
              'email', 'firstname', 'lastname', 'company', 'phone',
              'hs_lead_status', 'notes_last_updated', 'hs_object_id',
              'createdate', 'lastmodifieddate',
            ],
          }),
        });

        const data = await res.json();

        if (!data.results?.length) {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ error: 'Contact not found' }),
            }],
          };
        }

        const c = data.results[0];
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              contact: {
                id: c.id,
                email: c.properties.email,
                firstName: c.properties.firstname,
                lastName: c.properties.lastname,
                company: c.properties.company,
                phone: c.properties.phone,
                status: c.properties.hs_lead_status,
                createdAt: c.properties.createdate,
                updatedAt: c.properties.lastmodifieddate,
              },
            }),
          }],
        };
      }

      case 'create_contact': {
        const { email, firstName, lastName, company, phone, notes } = args;

        const properties: Record<string, string> = {
          email: String(email),
          firstname: String(firstName),
        };
        if (lastName) properties.lastname = String(lastName);
        if (company) properties.company = String(company);
        if (phone) properties.phone = String(phone);
        if (notes) properties.notes = String(notes);

        const res = await fetch(`${HUBSPOT_BASE_URL}/crm/v3/objects/contacts`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ properties }),
        });

        const data = await res.json();

        if (data.status === 'error') {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ error: data.message }),
            }],
          };
        }

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              contact: {
                id: data.id,
                email: data.properties.email,
                name: `${data.properties.firstname} ${data.properties.lastname || ''}`.trim(),
              },
            }),
          }],
        };
      }

      case 'update_contact': {
        const { email, updates } = args;

        // First find the contact
        const searchRes = await fetch(`${HUBSPOT_BASE_URL}/crm/v3/objects/contacts/search`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            filterGroups: [{
              filters: [
                { propertyName: 'email', operator: 'EQ', value: String(email) },
              ],
            }],
          }),
        });

        const searchData = await searchRes.json();

        if (!searchData.results?.length) {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ error: 'Contact not found' }),
            }],
          };
        }

        const contactId = searchData.results[0].id;
        const updateData = updates as Record<string, unknown>;

        const properties: Record<string, string> = {};
        if (updateData.name) properties.firstname = String(updateData.name).split(' ')[0];
        if (updateData.company) properties.company = String(updateData.company);
        if (updateData.phone) properties.phone = String(updateData.phone);
        if (updateData.notes) properties.notes = String(updateData.notes);
        if (updateData.status) properties.hs_lead_status = String(updateData.status);

        await fetch(
          `${HUBSPOT_BASE_URL}/crm/v3/objects/contacts/${contactId}`,
          {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ properties }),
          }
        );

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ success: true, message: 'Contact updated' }),
          }],
        };
      }

      case 'log_interaction': {
        const { email, summary, outcome } = args;
        const interactionType = String(args.interactionType || 'note');

        // Create engagement (note)
        const noteRes = await fetch(`${HUBSPOT_BASE_URL}/crm/v3/objects/notes`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            properties: {
              hs_note_body: `[${interactionType.toUpperCase()}] ${summary}${outcome ? `\n\nOutcome: ${outcome}` : ''}`,
              hs_timestamp: new Date().toISOString(),
            },
          }),
        });

        const noteData = await noteRes.json();

        // Associate with contact
        const searchRes = await fetch(`${HUBSPOT_BASE_URL}/crm/v3/objects/contacts/search`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            filterGroups: [{
              filters: [
                { propertyName: 'email', operator: 'EQ', value: String(email) },
              ],
            }],
          }),
        });

        const searchData = await searchRes.json();
        if (searchData.results?.length && noteData.id) {
          const contactId = searchData.results[0].id;
          await fetch(
            `${HUBSPOT_BASE_URL}/crm/v3/objects/notes/${noteData.id}/associations/contacts/${contactId}/note_to_contact`,
            { method: 'PUT', headers }
          );
        }

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: 'Interaction logged',
              noteId: noteData.id,
            }),
          }],
        };
      }

      case 'get_deals': {
        const { email } = args;

        // Find contact first
        const searchRes = await fetch(`${HUBSPOT_BASE_URL}/crm/v3/objects/contacts/search`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            filterGroups: [{
              filters: [
                { propertyName: 'email', operator: 'EQ', value: String(email) },
              ],
            }],
          }),
        });

        const searchData = await searchRes.json();
        if (!searchData.results?.length) {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ deals: [], message: 'Contact not found' }),
            }],
          };
        }

        const contactId = searchData.results[0].id;

        // Get associated deals
        const dealsRes = await fetch(
          `${HUBSPOT_BASE_URL}/crm/v3/objects/contacts/${contactId}/associations/deals`,
          { headers }
        );
        const dealsData = await dealsRes.json();

        if (!dealsData.results?.length) {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ deals: [] }),
            }],
          };
        }

        // Get deal details
        const dealIds = dealsData.results.map((d: { id: string }) => d.id);
        const detailsRes = await fetch(`${HUBSPOT_BASE_URL}/crm/v3/objects/deals/batch/read`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            properties: ['dealname', 'amount', 'dealstage', 'closedate', 'createdate'],
            inputs: dealIds.map((id: string) => ({ id })),
          }),
        });
        const detailsData = await detailsRes.json();

        const deals = detailsData.results?.map((d: { id: string; properties: Record<string, string> }) => ({
          id: d.id,
          name: d.properties.dealname,
          amount: d.properties.amount,
          stage: d.properties.dealstage,
          closeDate: d.properties.closedate,
        })) || [];

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ deals }),
          }],
        };
      }

      case 'create_deal': {
        const { contactEmail, dealName, amount, stage, closeDate } = args;

        const properties: Record<string, string | number> = {
          dealname: String(dealName),
        };
        if (amount) properties.amount = Number(amount);
        if (stage) properties.dealstage = String(stage);
        if (closeDate) properties.closedate = String(closeDate);

        const dealRes = await fetch(`${HUBSPOT_BASE_URL}/crm/v3/objects/deals`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ properties }),
        });
        const dealData = await dealRes.json();

        // Associate with contact
        const searchRes = await fetch(`${HUBSPOT_BASE_URL}/crm/v3/objects/contacts/search`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            filterGroups: [{
              filters: [
                { propertyName: 'email', operator: 'EQ', value: String(contactEmail) },
              ],
            }],
          }),
        });
        const searchData = await searchRes.json();

        if (searchData.results?.length && dealData.id) {
          const contactId = searchData.results[0].id;
          await fetch(
            `${HUBSPOT_BASE_URL}/crm/v3/objects/deals/${dealData.id}/associations/contacts/${contactId}/deal_to_contact`,
            { method: 'PUT', headers }
          );
        }

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              success: true,
              deal: {
                id: dealData.id,
                name: dealData.properties?.dealname,
              },
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
              name: 'crm-mcp',
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
          result: { tools: CRM_TOOLS },
        };
        break;

      case 'tools/call':
        const toolName = params?.name as string;
        const toolArgs = params?.arguments as Record<string, unknown>;
        const apiKey = process.env.HUBSPOT_ACCESS_TOKEN || process.env.HUBSPOT_API_KEY || null;
        const toolResult = await executeCRMTool(toolName, toolArgs, apiKey);
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
    console.error('CRM MCP error:', error);
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
    service: 'crm-mcp',
    configured: !!(process.env.HUBSPOT_ACCESS_TOKEN || process.env.HUBSPOT_API_KEY),
    tools: CRM_TOOLS.map((t) => t.name),
  });
}
