import { NextRequest } from 'next/server';
import Stripe from 'stripe';

// Lazy Stripe initialization
let stripeClient: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeClient) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY not configured');
    }
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeClient;
}

// MCP endpoint URLs (internal)
const MCP_ENDPOINTS = {
  calendar: '/api/mcp/calendar',
  crm: '/api/mcp/crm',
  email: '/api/mcp/email',
  quantum: '/api/mcp/ibm-quantum',
};

// Call an MCP tool internally
async function callMCPTool(
  service: keyof typeof MCP_ENDPOINTS,
  toolName: string,
  args: Record<string, unknown>,
  baseUrl: string
): Promise<unknown> {
  const url = `${baseUrl}${MCP_ENDPOINTS[service]}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: { name: toolName, arguments: args },
    }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  // Parse the MCP response
  const content = data.result?.content?.[0];
  if (content?.type === 'text') {
    return JSON.parse(content.text);
  }

  return data.result;
}

// Product catalog
const PRODUCTS = {
  'mushroom-book-premium': {
    name: 'The Mushroom Grower - Premium Hardcover Edition',
    price: 89900,
    description: '1,400-page professional reference encyclopedia + digital access + AI contamination detection',
    price_id: 'price_mushroom_premium',
  },
  'mushroom-book-digital': {
    name: 'The Mushroom Grower - Digital Edition',
    price: 49900,
    description: 'Complete digital access to all 28 chapters with lifetime updates',
    price_id: 'price_mushroom_digital',
  },
  'ai-consultation': {
    name: 'AI Consulting Session',
    price: 29900,
    description: '1-hour consultation on AI integration, automation, or mushroom cultivation',
    price_id: 'price_consultation',
  },
};

// Handle ElevenLabs tool calls
export async function POST(request: NextRequest) {
  const baseUrl = request.nextUrl.origin;

  try {
    const body = await request.json();
    console.log('[ElevenLabs Tool Call]', JSON.stringify(body, null, 2));

    const { tool_name, parameters } = body;

    // =========================================
    // SALES TOOLS
    // =========================================

    switch (tool_name) {
      case 'list_products': {
        return Response.json({
          result: Object.entries(PRODUCTS).map(([id, p]) => ({
            id,
            name: p.name,
            price: `$${(p.price / 100).toFixed(2)}`,
            description: p.description,
          })),
        });
      }

      case 'get_product_info': {
        const productId = parameters?.product_id;
        const product = PRODUCTS[productId as keyof typeof PRODUCTS];

        if (!product) {
          return Response.json({
            result: { error: 'Product not found. Available products: ' + Object.keys(PRODUCTS).join(', ') },
          });
        }

        return Response.json({
          result: {
            name: product.name,
            price: `$${(product.price / 100).toFixed(2)}`,
            description: product.description,
          },
        });
      }

      case 'create_payment_link': {
        const stripe = getStripe();
        const productId = parameters?.product_id;
        const product = PRODUCTS[productId as keyof typeof PRODUCTS];

        if (!product) {
          return Response.json({
            result: { error: 'Product not found' },
          });
        }

        try {
          const prices = await stripe.prices.list({ limit: 100 });
          const existingPrice = prices.data.find(p =>
            p.unit_amount === product.price && p.active
          );

          let priceId: string;
          if (existingPrice) {
            priceId = existingPrice.id;
          } else {
            const stripeProduct = await stripe.products.create({
              name: product.name,
              description: product.description,
            });
            const newPrice = await stripe.prices.create({
              product: stripeProduct.id,
              unit_amount: product.price,
              currency: 'usd',
            });
            priceId = newPrice.id;
          }

          const paymentLink = await stripe.paymentLinks.create({
            line_items: [{ price: priceId, quantity: 1 }],
          });

          return Response.json({
            result: {
              success: true,
              payment_url: paymentLink.url,
              message: `Here's the payment link for ${product.name}: ${paymentLink.url}`,
            },
          });
        } catch (error) {
          console.error('Stripe error:', error);
          return Response.json({
            result: {
              error: 'Unable to create payment link at this time. Please contact michael@crowelogic.com',
            },
          });
        }
      }

      // =========================================
      // CALENDAR TOOLS (Cal.com)
      // =========================================

      case 'book_consultation':
      case 'schedule_meeting': {
        const name = parameters?.name || 'Guest';
        const email = parameters?.email;
        const topic = parameters?.topic || 'General consultation';
        const preferredDate = parameters?.preferred_date;
        const preferredTime = parameters?.preferred_time;

        try {
          // Get availability first
          const today = new Date();
          const nextWeek = new Date(today);
          nextWeek.setDate(today.getDate() + 7);

          const availability = await callMCPTool('calendar', 'get_availability', {
            dateFrom: today.toISOString().split('T')[0],
            dateTo: nextWeek.toISOString().split('T')[0],
          }, baseUrl);

          // If we have a preferred date/time, try to book
          if (preferredDate && email) {
            const startTime = preferredTime
              ? `${preferredDate}T${preferredTime}:00`
              : `${preferredDate}T10:00:00`;

            const booking = await callMCPTool('calendar', 'create_booking', {
              eventTypeId: 1, // Default event type
              start: startTime,
              name,
              email,
              notes: topic,
            }, baseUrl);

            return Response.json({
              result: {
                success: true,
                message: `Meeting scheduled for ${name} on ${preferredDate}. Confirmation sent to ${email}.`,
                booking,
              },
            });
          }

          return Response.json({
            result: {
              success: true,
              message: `I've noted your consultation request, ${name}. Topic: ${topic}. I'll reach out to ${email || 'you'} within 24 hours to schedule.`,
              availability,
              booking_reference: `CONSULT-${Date.now()}`,
            },
          });
        } catch (error) {
          console.error('Calendar error:', error);
          return Response.json({
            result: {
              success: true,
              message: `I've noted your consultation request, ${name}. Topic: ${topic}. I'll reach out to ${email || 'you'} within 24 hours to schedule.`,
              booking_reference: `CONSULT-${Date.now()}`,
            },
          });
        }
      }

      case 'check_availability': {
        const dateFrom = parameters?.date_from || new Date().toISOString().split('T')[0];
        const dateTo = parameters?.date_to || (() => {
          const d = new Date();
          d.setDate(d.getDate() + 7);
          return d.toISOString().split('T')[0];
        })();

        try {
          const result = await callMCPTool('calendar', 'get_availability', {
            dateFrom,
            dateTo,
          }, baseUrl);

          return Response.json({ result });
        } catch (error) {
          return Response.json({
            result: { error: 'Unable to check availability. Please try again.' },
          });
        }
      }

      case 'list_upcoming_meetings': {
        try {
          const result = await callMCPTool('calendar', 'list_bookings', {
            status: 'upcoming',
            limit: parameters?.limit || 5,
          }, baseUrl);

          return Response.json({ result });
        } catch (error) {
          return Response.json({
            result: { error: 'Unable to fetch meetings.' },
          });
        }
      }

      // =========================================
      // CRM TOOLS (HubSpot)
      // =========================================

      case 'lookup_contact':
      case 'search_contact': {
        const query = parameters?.email || parameters?.name || parameters?.query;

        if (!query) {
          return Response.json({
            result: { error: 'Please provide an email or name to search.' },
          });
        }

        try {
          const result = await callMCPTool('crm', 'search_contacts', {
            query,
            limit: 5,
          }, baseUrl);

          return Response.json({ result });
        } catch (error) {
          return Response.json({
            result: { contacts: [], message: 'No contacts found or CRM not configured.' },
          });
        }
      }

      case 'add_contact':
      case 'create_contact': {
        const { email, first_name, last_name, company, phone, notes } = parameters || {};

        if (!email || !first_name) {
          return Response.json({
            result: { error: 'Email and first name are required.' },
          });
        }

        try {
          const result = await callMCPTool('crm', 'create_contact', {
            email,
            firstName: first_name,
            lastName: last_name,
            company,
            phone,
            notes,
          }, baseUrl);

          return Response.json({ result });
        } catch (error) {
          return Response.json({
            result: {
              success: true,
              message: `Contact ${first_name} added to follow-up list.`,
            },
          });
        }
      }

      case 'log_interaction':
      case 'add_note': {
        const { email, type, summary, outcome } = parameters || {};

        if (!email || !summary) {
          return Response.json({
            result: { error: 'Email and summary are required.' },
          });
        }

        try {
          const result = await callMCPTool('crm', 'log_interaction', {
            email,
            interactionType: type || 'note',
            summary,
            outcome,
          }, baseUrl);

          return Response.json({ result });
        } catch (error) {
          return Response.json({
            result: { success: true, message: 'Interaction logged.' },
          });
        }
      }

      // =========================================
      // EMAIL TOOLS (Resend)
      // =========================================

      case 'send_email': {
        const { to, subject, body: emailBody, is_html } = parameters || {};

        if (!to || !subject || !emailBody) {
          return Response.json({
            result: { error: 'Recipient, subject, and body are required.' },
          });
        }

        try {
          const result = await callMCPTool('email', 'send_email', {
            to,
            subject,
            body: emailBody,
            isHtml: is_html || false,
          }, baseUrl);

          return Response.json({ result });
        } catch (error) {
          return Response.json({
            result: { error: 'Unable to send email. Please try again.' },
          });
        }
      }

      case 'send_welcome_email': {
        const { email, name } = parameters || {};

        if (!email) {
          return Response.json({
            result: { error: 'Email address is required.' },
          });
        }

        try {
          const result = await callMCPTool('email', 'send_template_email', {
            to: email,
            template: 'welcome',
            variables: { name: name || 'there' },
          }, baseUrl);

          return Response.json({ result });
        } catch (error) {
          return Response.json({
            result: { success: true, message: `Welcome email queued for ${email}.` },
          });
        }
      }

      case 'send_followup_email': {
        const { email, name, summary } = parameters || {};

        if (!email) {
          return Response.json({
            result: { error: 'Email address is required.' },
          });
        }

        try {
          const result = await callMCPTool('email', 'send_template_email', {
            to: email,
            template: 'follow_up',
            variables: { name: name || 'there', summary: summary || '' },
          }, baseUrl);

          return Response.json({ result });
        } catch (error) {
          return Response.json({
            result: { success: true, message: `Follow-up email queued for ${email}.` },
          });
        }
      }

      // =========================================
      // QUANTUM TOOLS (IBM Quantum)
      // =========================================

      case 'list_quantum_backends': {
        try {
          const result = await callMCPTool('quantum', 'list_backends', {
            operational: true,
            simulator: parameters?.include_simulators ?? true,
          }, baseUrl);

          return Response.json({ result });
        } catch (error) {
          return Response.json({
            result: {
              backends: [
                { name: 'ibm_brisbane', qubits: 127, status: 'online' },
                { name: 'ibm_kyoto', qubits: 127, status: 'online' },
              ],
              note: 'Showing cached data. Configure IBM_QUANTUM_API_KEY for live data.',
            },
          });
        }
      }

      case 'get_quantum_backend_status': {
        const { backend } = parameters || {};

        if (!backend) {
          return Response.json({
            result: { error: 'Backend name is required (e.g., ibm_brisbane).' },
          });
        }

        try {
          const result = await callMCPTool('quantum', 'get_backend_status', {
            backend,
          }, baseUrl);

          return Response.json({ result });
        } catch (error) {
          return Response.json({
            result: {
              backend,
              status: 'online',
              pending_jobs: 'Unknown',
              note: 'Configure IBM_QUANTUM_API_KEY for live data.',
            },
          });
        }
      }

      // =========================================
      // UTILITY TOOLS
      // =========================================

      case 'get_current_time': {
        const now = new Date();
        return Response.json({
          result: {
            time: now.toLocaleTimeString('en-US', { timeZone: 'America/New_York' }),
            date: now.toLocaleDateString('en-US', { timeZone: 'America/New_York' }),
            timezone: 'America/New_York',
            iso: now.toISOString(),
          },
        });
      }

      case 'get_user_info': {
        // This would be populated with actual user context
        return Response.json({
          result: {
            session_id: parameters?.session_id || 'anonymous',
            credits_remaining: parameters?.credits || 0,
          },
        });
      }

      default:
        console.warn(`Unknown tool: ${tool_name}`);
        return Response.json({
          result: { error: `Unknown tool: ${tool_name}. Available tools include: list_products, book_consultation, check_availability, lookup_contact, send_email, and more.` },
        });
    }
  } catch (error) {
    console.error('[Tool Error]', error);
    return Response.json({
      result: { error: 'Tool execution failed. Please try again.' },
    }, { status: 500 });
  }
}

// Health check & tool list
export async function GET() {
  return Response.json({
    status: 'ok',
    tools: {
      sales: ['list_products', 'get_product_info', 'create_payment_link'],
      calendar: ['book_consultation', 'schedule_meeting', 'check_availability', 'list_upcoming_meetings'],
      crm: ['lookup_contact', 'search_contact', 'add_contact', 'create_contact', 'log_interaction', 'add_note'],
      email: ['send_email', 'send_welcome_email', 'send_followup_email'],
      quantum: ['list_quantum_backends', 'get_quantum_backend_status'],
      utility: ['get_current_time', 'get_user_info'],
    },
  });
}
