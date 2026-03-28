import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

// Public order lookup — requires order_number + email to verify identity
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = rateLimit(ip, { maxRequests: 10, windowMs: 60_000 });
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests. Please wait.' }, { status: 429 });
  }

  try {
    const { order_number, email } = await req.json();

    if (!order_number || !email) {
      return NextResponse.json({ error: 'Order number and email are required.' }, { status: 400 });
    }

    const safeOrderNumber = String(order_number).replace(/[^a-zA-Z0-9-]/g, '').slice(0, 50);
    const safeEmail = String(email).toLowerCase().trim().slice(0, 200);

    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('order_number, customer_name, status, payment_status, tracking_number, items, total, shipping_cost, created_at, updated_at')
      .eq('order_number', safeOrderNumber)
      .eq('customer_email', safeEmail)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Order not found. Please check your order number and email.' }, { status: 404 });
    }

    // Return only safe, read-only info
    const itemSummary = Array.isArray(data.items)
      ? data.items.map((item: any) => ({ name: item.name || item.product_name, quantity: item.quantity }))
      : [];

    return NextResponse.json({
      order_number: data.order_number,
      customer_name: data.customer_name,
      status: data.status,
      payment_status: data.payment_status,
      tracking_number: data.tracking_number || null,
      items: itemSummary,
      total: data.total,
      shipping_cost: data.shipping_cost,
      placed_at: data.created_at,
      last_updated: data.updated_at,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to look up order.' }, { status: 500 });
  }
}
