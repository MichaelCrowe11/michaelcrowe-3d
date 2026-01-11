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

// Product catalog - hardcoded for reliability
const PRODUCTS = {
  'mushroom-book-premium': {
    name: 'The Mushroom Grower - Premium Hardcover Edition',
    price: 89900, // $899
    description: '1,400-page professional reference encyclopedia + digital access + AI contamination detection',
    price_id: 'price_mushroom_premium',
  },
  'mushroom-book-digital': {
    name: 'The Mushroom Grower - Digital Edition',
    price: 49900, // $499
    description: 'Complete digital access to all 28 chapters with lifetime updates',
    price_id: 'price_mushroom_digital',
  },
  'ai-consultation': {
    name: 'AI Consulting Session',
    price: 29900, // $299
    description: '1-hour consultation on AI integration, automation, or mushroom cultivation',
    price_id: 'price_consultation',
  },
};

// Handle ElevenLabs tool calls
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[ElevenLabs Tool Call]', JSON.stringify(body, null, 2));

    const { tool_name, parameters } = body;

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

        // Create a price on the fly if needed
        let priceId: string;
        try {
          const prices = await stripe.prices.list({ limit: 100 });
          const existingPrice = prices.data.find(p =>
            p.unit_amount === product.price && p.active
          );

          if (existingPrice) {
            priceId = existingPrice.id;
          } else {
            // Create product and price
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

      case 'book_consultation': {
        const name = parameters?.name || 'Guest';
        const email = parameters?.email;
        const topic = parameters?.topic || 'General consultation';

        // In production, this would create a calendar booking
        return Response.json({
          result: {
            success: true,
            message: `I've noted your consultation request, ${name}. Topic: ${topic}. Michael will reach out to ${email || 'you'} within 24 hours to schedule.`,
            booking_reference: `CONSULT-${Date.now()}`,
          },
        });
      }

      default:
        return Response.json({
          result: { error: `Unknown tool: ${tool_name}` },
        });
    }
  } catch (error) {
    console.error('[Tool Error]', error);
    return Response.json({
      result: { error: 'Tool execution failed' },
    }, { status: 500 });
  }
}

// Health check
export async function GET() {
  return Response.json({
    status: 'ok',
    tools: ['list_products', 'get_product_info', 'create_payment_link', 'book_consultation'],
  });
}
