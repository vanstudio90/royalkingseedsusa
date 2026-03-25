import { NextResponse } from 'next/server';

export async function GET() {
  const API_URL = (process.env.ACCEPT_BLUE_API_URL || 'NOT SET').trim();
  const API_KEY = (process.env.ACCEPT_BLUE_API_KEY || '').trim();
  const PIN = (process.env.ACCEPT_BLUE_PIN || '').trim();

  // Test the API connection with a minimal charge (will be declined with test card)
  const auth = Buffer.from(`${API_KEY}:${PIN}`).toString('base64');

  try {
    const res = await fetch(`${API_URL}/transactions/charge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: 0.01,
        card: '4111111111111111',
        expiry_month: 12,
        expiry_year: 2027,
        cvv2: '123',
        capture: true,
      }),
    });

    const body = await res.text();

    return NextResponse.json({
      env: {
        api_url: API_URL,
        has_key: API_KEY.length > 0 ? `yes (${API_KEY.length} chars, starts: ${API_KEY.slice(0, 4)}...)` : 'NO - MISSING',
        has_pin: PIN.length > 0 ? `yes (${PIN.length} chars)` : 'NO - MISSING',
      },
      api_response: {
        status: res.status,
        body: body.slice(0, 500),
      },
    });
  } catch (err: any) {
    return NextResponse.json({
      env: {
        api_url: API_URL,
        has_key: API_KEY.length > 0 ? `yes (${API_KEY.length} chars)` : 'NO - MISSING',
        has_pin: PIN.length > 0 ? `yes (${PIN.length} chars)` : 'NO - MISSING',
      },
      error: err.message,
    });
  }
}
