import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json([], { status: 400 });
  }

  // Only return safe fields — never expose notes (contains payment refs)
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('id, order_number, customer_name, customer_email, items, subtotal, shipping_cost, tax, total, discount, coupon_code, status, payment_status, tracking_number, shipping_address, created_at')
    .eq('customer_email', email)
    .neq('status', 'trashed')
    .neq('status', 'archived')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return NextResponse.json([], { status: 500 });
  return NextResponse.json(data || []);
}
