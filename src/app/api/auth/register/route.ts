import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, company, accessType } = await request.json();

    // Log the registration (you could send this to a database, email, webhook, etc.)
    console.log('New user registration:', {
      name,
      email,
      company,
      accessType,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    });

    // You could add:
    // - Send to a database (Supabase, PlanetScale, etc.)
    // - Send email notification
    // - Add to CRM (HubSpot, etc.)
    // - Send to webhook (Zapier, Make, etc.)

    // Optional: Send email notification to Michael
    // await sendEmailNotification({ name, email, company, accessType });

    return new Response(
      JSON.stringify({ success: true, message: 'Registration successful' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Registration failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
