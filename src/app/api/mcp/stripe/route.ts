import { NextRequest } from 'next/server';
import Stripe from 'stripe';

// Lazy Stripe initialization to avoid build errors
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

// MCP Tool definitions
const TOOLS = [
  {
    name: "list_products",
    description: "List all available products for sale",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Max products to return (default 10)" },
        active: { type: "boolean", description: "Filter by active status" },
      },
    },
  },
  {
    name: "get_product_details",
    description: "Get detailed information about a specific product including price",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID" },
      },
      required: ["product_id"],
    },
  },
  {
    name: "create_payment_link",
    description: "Create a shareable payment link for a product",
    inputSchema: {
      type: "object",
      properties: {
        price_id: { type: "string", description: "Price ID of the product" },
        quantity: { type: "number", description: "Quantity (default 1)" },
      },
      required: ["price_id"],
    },
  },
  {
    name: "create_checkout_session",
    description: "Create a checkout session and return the checkout URL",
    inputSchema: {
      type: "object",
      properties: {
        price_id: { type: "string", description: "Price ID to charge" },
        customer_email: { type: "string", description: "Customer email" },
      },
      required: ["price_id"],
    },
  },
  {
    name: "check_customer_orders",
    description: "Check recent orders/payments for a customer",
    inputSchema: {
      type: "object",
      properties: {
        email: { type: "string", description: "Customer email to look up" },
      },
      required: ["email"],
    },
  },
  {
    name: "validate_promo_code",
    description: "Check if a promo code is valid and get discount details",
    inputSchema: {
      type: "object",
      properties: {
        code: { type: "string", description: "The promo code to validate" },
      },
      required: ["code"],
    },
  },
  {
    name: "list_promo_codes",
    description: "List available promotional codes",
    inputSchema: {
      type: "object",
      properties: {
        active: { type: "boolean", description: "Only show active codes" },
      },
    },
  },
  {
    name: "create_checkout_with_discount",
    description: "Create checkout session with a promo code applied",
    inputSchema: {
      type: "object",
      properties: {
        price_id: { type: "string", description: "Price ID to charge" },
        promo_code: { type: "string", description: "Promo code to apply" },
        customer_email: { type: "string", description: "Customer email" },
      },
      required: ["price_id"],
    },
  },
  {
    name: "create_promo_code",
    description: "Create a new promotional discount code",
    inputSchema: {
      type: "object",
      properties: {
        code: { type: "string", description: "The code customers will enter (e.g., WELCOME20)" },
        percent_off: { type: "number", description: "Percentage discount (e.g., 20 for 20% off)" },
        amount_off: { type: "number", description: "Fixed amount off in cents (e.g., 5000 for $50 off)" },
        max_redemptions: { type: "number", description: "Maximum number of times this code can be used" },
      },
      required: ["code"],
    },
  },
  {
    name: "remember_customer",
    description: "Look up a customer by email and return their profile and purchase history for personalized conversation",
    inputSchema: {
      type: "object",
      properties: {
        email: { type: "string", description: "Customer's email address" },
      },
      required: ["email"],
    },
  },
  {
    name: "save_customer",
    description: "Save or update customer information for future personalization",
    inputSchema: {
      type: "object",
      properties: {
        email: { type: "string", description: "Customer's email" },
        name: { type: "string", description: "Customer's name" },
        company: { type: "string", description: "Customer's company (optional)" },
        interests: { type: "array", items: { type: "string" }, description: "Customer's interests (e.g., mushroom cultivation, AI, consulting)" },
        notes: { type: "string", description: "Special notes about the customer" },
      },
      required: ["email"],
    },
  },
  {
    name: "send_receipt",
    description: "Resend a payment receipt to a customer's email",
    inputSchema: {
      type: "object",
      properties: {
        email: { type: "string", description: "Customer's email to look up recent charges" },
        charge_id: { type: "string", description: "Optional: specific charge ID to resend receipt for" },
      },
      required: ["email"],
    },
  },
  {
    name: "get_booking_link",
    description: "Get a calendar booking link for consultation sessions",
    inputSchema: {
      type: "object",
      properties: {
        type: { type: "string", description: "Type of session: 'consultation', 'coaching', or 'workshop'" },
      },
    },
  },
  {
    name: "check_inventory",
    description: "Check product availability and stock status",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID to check" },
      },
    },
  },
  {
    name: "get_sales_stats",
    description: "Get sales statistics and revenue summary",
    inputSchema: {
      type: "object",
      properties: {
        days: { type: "number", description: "Number of days to look back (default 30)" },
      },
    },
  },
];

// Handle tool execution
async function executeTool(name: string, args: Record<string, unknown>) {
  const stripe = getStripe();

  switch (name) {
    case "list_products": {
      // Fetch products and all prices
      const [products, prices] = await Promise.all([
        stripe.products.list({
          limit: (args.limit as number) || 10,
          active: args.active as boolean | undefined,
        }),
        stripe.prices.list({ limit: 100, active: true }),
      ]);

      // Map prices to products
      const priceMap = new Map<string, { id: string; amount: number }>();
      for (const price of prices.data) {
        const productId = typeof price.product === 'string' ? price.product : price.product?.id;
        if (productId && price.unit_amount && !priceMap.has(productId)) {
          priceMap.set(productId, { id: price.id, amount: price.unit_amount });
        }
      }

      return products.data.map(p => {
        const priceInfo = priceMap.get(p.id);
        return {
          id: p.id,
          name: p.name,
          description: p.description,
          price_id: priceInfo?.id || null,
          price: priceInfo ? `$${(priceInfo.amount / 100).toFixed(2)}` : 'Contact for pricing',
        };
      });
    }

    case "get_product_details": {
      const product = await stripe.products.retrieve(args.product_id as string, {
        expand: ['default_price'],
      });
      const price = typeof product.default_price === 'object' ? product.default_price : null;

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price_id: price?.id,
        price: price?.unit_amount ? `$${(price.unit_amount / 100).toFixed(2)}` : null,
        images: product.images,
      };
    }

    case "create_payment_link": {
      const link = await stripe.paymentLinks.create({
        line_items: [{
          price: args.price_id as string,
          quantity: (args.quantity as number) || 1,
        }],
      });
      return { payment_url: link.url };
    }

    case "create_checkout_session": {
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [{
          price: args.price_id as string,
          quantity: 1,
        }],
        success_url: 'https://www.michaelcrowe.ai/?success=true',
        cancel_url: 'https://www.michaelcrowe.ai/?canceled=true',
        customer_email: args.customer_email as string | undefined,
      });
      return { checkout_url: session.url };
    }

    case "check_customer_orders": {
      const customers = await stripe.customers.list({
        email: args.email as string,
        limit: 1,
      });

      if (customers.data.length === 0) {
        return { found: false, message: "No customer found with that email" };
      }

      const customer = customers.data[0];
      const charges = await stripe.charges.list({
        customer: customer.id,
        limit: 5,
      });

      return {
        found: true,
        customer_name: customer.name,
        orders: charges.data.map(c => ({
          amount: `$${(c.amount / 100).toFixed(2)}`,
          status: c.status,
          date: new Date(c.created * 1000).toLocaleDateString(),
          description: c.description,
        })),
      };
    }

    case "validate_promo_code": {
      const code = args.code as string;
      try {
        // Search for promotion code by code string
        const promoCodes = await stripe.promotionCodes.list({
          code: code,
          active: true,
          limit: 1,
        });

        if (promoCodes.data.length === 0) {
          return { valid: false, message: "Promo code not found or expired" };
        }

        const promoCode = promoCodes.data[0] as unknown as {
          code: string;
          id: string;
          coupon: string | { id: string };
          restrictions: unknown;
          expires_at: number | null;
        };
        // Get coupon ID - it's either a string or expanded object
        const couponId = typeof promoCode.coupon === 'string'
          ? promoCode.coupon
          : promoCode.coupon.id;
        const coupon = await stripe.coupons.retrieve(couponId);

        return {
          valid: true,
          code: promoCode.code,
          promo_code_id: promoCode.id,
          discount: coupon.percent_off
            ? `${coupon.percent_off}% off`
            : coupon.amount_off
            ? `$${(coupon.amount_off / 100).toFixed(2)} off`
            : 'Special discount',
          restrictions: promoCode.restrictions,
          expires: promoCode.expires_at
            ? new Date(promoCode.expires_at * 1000).toLocaleDateString()
            : null,
        };
      } catch {
        return { valid: false, message: "Invalid promo code" };
      }
    }

    case "list_promo_codes": {
      const promoCodes = await stripe.promotionCodes.list({
        active: args.active !== false,
        limit: 10,
      });

      type PromoCodeData = {
        code: string;
        id: string;
        coupon: string | { id: string };
        active: boolean;
        times_redeemed: number;
        max_redemptions: number | null;
      };

      // Fetch all coupons for the promo codes
      const results = await Promise.all(
        (promoCodes.data as unknown as PromoCodeData[]).map(async (pc) => {
          const couponId = typeof pc.coupon === 'string' ? pc.coupon : pc.coupon.id;
          const coupon = await stripe.coupons.retrieve(couponId);
          return {
            code: pc.code,
            id: pc.id,
            discount: coupon.percent_off
              ? `${coupon.percent_off}% off`
              : coupon.amount_off
              ? `$${(coupon.amount_off / 100).toFixed(2)} off`
              : 'Special discount',
            active: pc.active,
            times_redeemed: pc.times_redeemed,
            max_redemptions: pc.max_redemptions,
          };
        })
      );
      return results;
    }

    case "create_checkout_with_discount": {
      const checkoutParams: Stripe.Checkout.SessionCreateParams = {
        mode: 'payment',
        line_items: [{
          price: args.price_id as string,
          quantity: 1,
        }],
        success_url: 'https://www.michaelcrowe.ai/?success=true',
        cancel_url: 'https://www.michaelcrowe.ai/?canceled=true',
        customer_email: args.customer_email as string | undefined,
        allow_promotion_codes: true, // Allow customers to enter promo codes
      };

      // If a specific promo code is provided, apply it
      if (args.promo_code) {
        const promoCodes = await stripe.promotionCodes.list({
          code: args.promo_code as string,
          active: true,
          limit: 1,
        });

        if (promoCodes.data.length > 0) {
          checkoutParams.discounts = [{
            promotion_code: promoCodes.data[0].id,
          }];
          // Can't use both discounts and allow_promotion_codes
          delete checkoutParams.allow_promotion_codes;
        }
      }

      const session = await stripe.checkout.sessions.create(checkoutParams);
      return {
        checkout_url: session.url,
        promo_applied: !!args.promo_code,
      };
    }

    case "create_promo_code": {
      const code = args.code as string;
      const percentOff = args.percent_off as number | undefined;
      const amountOff = args.amount_off as number | undefined;
      const maxRedemptions = args.max_redemptions as number | undefined;

      // Create the coupon first
      const couponParams: Stripe.CouponCreateParams = {
        name: `Promo: ${code}`,
        duration: 'once',
      };

      if (percentOff) {
        couponParams.percent_off = percentOff;
      } else if (amountOff) {
        couponParams.amount_off = amountOff;
        couponParams.currency = 'usd';
      } else {
        // Default to 10% off if nothing specified
        couponParams.percent_off = 10;
      }

      const coupon = await stripe.coupons.create(couponParams);

      // Create the promotion code
      const promoCode = await stripe.promotionCodes.create({
        coupon: coupon.id,
        code: code.toUpperCase(),
        ...(maxRedemptions && { max_redemptions: maxRedemptions }),
      } as unknown as Stripe.PromotionCodeCreateParams);

      return {
        success: true,
        code: promoCode.code,
        promo_code_id: promoCode.id,
        discount: percentOff
          ? `${percentOff}% off`
          : amountOff
          ? `$${(amountOff / 100).toFixed(2)} off`
          : '10% off',
        max_redemptions: maxRedemptions || 'unlimited',
      };
    }

    case "remember_customer": {
      const email = args.email as string;

      // Look up customer by email
      const customers = await stripe.customers.list({
        email: email,
        limit: 1,
        expand: ['data.subscriptions'],
      });

      if (customers.data.length === 0) {
        return {
          found: false,
          is_returning: false,
          message: "New customer - no previous record found",
        };
      }

      const customer = customers.data[0];

      // Get purchase history
      const charges = await stripe.charges.list({
        customer: customer.id,
        limit: 10,
      });

      // Parse metadata for stored preferences
      const metadata = customer.metadata || {};

      return {
        found: true,
        is_returning: true,
        customer_id: customer.id,
        name: customer.name || metadata.name || 'Friend',
        email: customer.email,
        company: metadata.company || null,
        interests: metadata.interests ? JSON.parse(metadata.interests) : [],
        notes: metadata.notes || null,
        first_purchase: charges.data.length > 0
          ? new Date(charges.data[charges.data.length - 1].created * 1000).toLocaleDateString()
          : null,
        total_purchases: charges.data.length,
        total_spent: `$${(charges.data.reduce((sum, c) => sum + (c.amount || 0), 0) / 100).toFixed(2)}`,
        recent_products: charges.data
          .filter(c => c.description)
          .slice(0, 3)
          .map(c => c.description),
        welcome_message: customer.name
          ? `Welcome back, ${customer.name.split(' ')[0]}!`
          : 'Welcome back!',
      };
    }

    case "save_customer": {
      const email = args.email as string;
      const name = args.name as string | undefined;
      const company = args.company as string | undefined;
      const interests = args.interests as string[] | undefined;
      const notes = args.notes as string | undefined;

      // Check if customer exists
      const customers = await stripe.customers.list({
        email: email,
        limit: 1,
      });

      const metadata: Record<string, string> = {};
      if (name) metadata.name = name;
      if (company) metadata.company = company;
      if (interests) metadata.interests = JSON.stringify(interests);
      if (notes) metadata.notes = notes;
      metadata.last_updated = new Date().toISOString();

      let customer;
      if (customers.data.length > 0) {
        // Update existing customer
        customer = await stripe.customers.update(customers.data[0].id, {
          name: name || customers.data[0].name || undefined,
          metadata: {
            ...customers.data[0].metadata,
            ...metadata,
          },
        });
      } else {
        // Create new customer
        customer = await stripe.customers.create({
          email: email,
          name: name,
          metadata: metadata,
        });
      }

      return {
        success: true,
        customer_id: customer.id,
        message: customers.data.length > 0
          ? `Updated profile for ${name || email}`
          : `Created new customer profile for ${name || email}`,
      };
    }

    case "send_receipt": {
      const email = args.email as string;
      const chargeId = args.charge_id as string | undefined;

      // If specific charge ID provided, use it
      if (chargeId) {
        const charge = await stripe.charges.retrieve(chargeId);
        if (charge.receipt_email) {
          // Receipt was already sent to this email
          return {
            success: true,
            message: `Receipt was sent to ${charge.receipt_email}`,
            receipt_url: charge.receipt_url,
          };
        }
        // Update charge with receipt email
        await stripe.charges.update(chargeId, {
          receipt_email: email,
        });
        return {
          success: true,
          message: `Receipt sent to ${email}`,
          receipt_url: charge.receipt_url,
        };
      }

      // Look up customer's most recent charge
      const customers = await stripe.customers.list({
        email: email,
        limit: 1,
      });

      if (customers.data.length === 0) {
        return {
          success: false,
          message: "No customer found with that email",
        };
      }

      const charges = await stripe.charges.list({
        customer: customers.data[0].id,
        limit: 1,
      });

      if (charges.data.length === 0) {
        return {
          success: false,
          message: "No charges found for this customer",
        };
      }

      const latestCharge = charges.data[0];

      // Update charge to trigger receipt
      if (!latestCharge.receipt_email) {
        await stripe.charges.update(latestCharge.id, {
          receipt_email: email,
        });
      }

      return {
        success: true,
        message: `Receipt for $${(latestCharge.amount / 100).toFixed(2)} sent to ${email}`,
        receipt_url: latestCharge.receipt_url,
        amount: `$${(latestCharge.amount / 100).toFixed(2)}`,
        date: new Date(latestCharge.created * 1000).toLocaleDateString(),
      };
    }

    case "get_booking_link": {
      const sessionType = (args.type as string || 'consultation').toLowerCase();

      // Booking links - update these with actual Cal.com or scheduling links
      const bookingLinks: Record<string, { url: string; duration: string; description: string }> = {
        consultation: {
          url: 'https://cal.com/michaelcrowe/consultation',
          duration: '1 hour',
          description: 'One-on-one consultation on AI, automation, or mushroom cultivation',
        },
        coaching: {
          url: 'https://cal.com/michaelcrowe/coaching',
          duration: '30 minutes',
          description: 'Quick coaching session for specific questions',
        },
        workshop: {
          url: 'https://cal.com/michaelcrowe/workshop',
          duration: '2 hours',
          description: 'Deep-dive workshop session for teams or individuals',
        },
      };

      const booking = bookingLinks[sessionType] || bookingLinks.consultation;

      return {
        booking_url: booking.url,
        duration: booking.duration,
        description: booking.description,
        message: `Book a ${booking.duration} ${sessionType} session with Michael`,
      };
    }

    case "check_inventory": {
      const productId = args.product_id as string | undefined;

      if (productId) {
        // Get specific product with metadata
        const product = await stripe.products.retrieve(productId);
        const inventory = product.metadata?.inventory;
        const soldCount = product.metadata?.sold_count;

        // For digital products, always available
        if (product.type === 'service' || !inventory) {
          return {
            product_id: product.id,
            name: product.name,
            available: true,
            type: 'digital',
            message: `${product.name} is always available (digital product)`,
          };
        }

        const remaining = parseInt(inventory) - (parseInt(soldCount || '0') || 0);
        return {
          product_id: product.id,
          name: product.name,
          available: remaining > 0,
          stock: remaining,
          total_inventory: parseInt(inventory),
          sold: parseInt(soldCount || '0'),
          type: 'physical',
          message: remaining > 0
            ? `${remaining} units available`
            : 'Currently out of stock',
        };
      }

      // Get all products with inventory info
      const products = await stripe.products.list({ active: true, limit: 20 });
      return products.data.map(p => ({
        product_id: p.id,
        name: p.name,
        available: true, // All digital products always available
        type: p.type === 'service' ? 'digital' : 'physical',
        stock: p.metadata?.inventory ? parseInt(p.metadata.inventory) - (parseInt(p.metadata.sold_count || '0') || 0) : 'unlimited',
      }));
    }

    case "get_sales_stats": {
      const days = (args.days as number) || 30;
      const startDate = Math.floor(Date.now() / 1000) - (days * 24 * 60 * 60);

      // Get recent charges
      const charges = await stripe.charges.list({
        created: { gte: startDate },
        limit: 100,
      });

      const successfulCharges = charges.data.filter(c => c.status === 'succeeded');
      const totalRevenue = successfulCharges.reduce((sum, c) => sum + c.amount, 0);
      const averageOrderValue = successfulCharges.length > 0
        ? totalRevenue / successfulCharges.length
        : 0;

      // Group by product if possible
      const productSales: Record<string, number> = {};
      successfulCharges.forEach(c => {
        const desc = c.description || 'Unknown';
        productSales[desc] = (productSales[desc] || 0) + 1;
      });

      // Get top products
      const topProducts = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, sales: count }));

      return {
        period: `Last ${days} days`,
        total_revenue: `$${(totalRevenue / 100).toFixed(2)}`,
        total_orders: successfulCharges.length,
        average_order_value: `$${(averageOrderValue / 100).toFixed(2)}`,
        top_products: topProducts,
        daily_average: `$${((totalRevenue / 100) / days).toFixed(2)}/day`,
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// SSE endpoint for MCP
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send tools list on connect
      const toolsMessage = JSON.stringify({
        jsonrpc: "2.0",
        method: "tools/list",
        result: { tools: TOOLS },
      });
      controller.enqueue(encoder.encode(`data: ${toolsMessage}\n\n`));
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

// POST endpoint for tool calls
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle different MCP message types
    if (body.method === 'tools/list') {
      return Response.json({
        jsonrpc: "2.0",
        id: body.id,
        result: { tools: TOOLS },
      });
    }

    if (body.method === 'tools/call') {
      const { name, arguments: args } = body.params;
      const result = await executeTool(name, args || {});

      return Response.json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          content: [{
            type: "text",
            text: JSON.stringify(result, null, 2),
          }],
        },
      });
    }

    // Initialize response
    if (body.method === 'initialize') {
      return Response.json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: {
            name: "stripe-mcp",
            version: "1.0.0",
          },
        },
      });
    }

    return Response.json({
      jsonrpc: "2.0",
      id: body.id,
      error: { code: -32601, message: "Method not found" },
    });

  } catch (error) {
    console.error('MCP Error:', error);
    return Response.json({
      jsonrpc: "2.0",
      error: {
        code: -32603,
        message: error instanceof Error ? error.message : 'Internal error'
      },
    }, { status: 500 });
  }
}
