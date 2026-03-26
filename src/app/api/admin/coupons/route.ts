import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const [couponsRes, ordersRes] = await Promise.all([
    supabaseAdmin
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false }),
    supabaseAdmin
      .from('orders')
      .select('coupon_code, total, discount, payment_status')
      .neq('coupon_code', '')
      .not('coupon_code', 'is', null),
  ]);

  if (couponsRes.error) return NextResponse.json({ error: couponsRes.error.message }, { status: 500 });

  const orders = ordersRes.data || [];

  // Build coupon revenue/usage map from paid orders
  const couponStats: Record<string, { revenue: number; orders_count: number }> = {};
  for (const order of orders) {
    const code = (order.coupon_code || '').toUpperCase();
    if (!code) continue;
    if (!couponStats[code]) couponStats[code] = { revenue: 0, orders_count: 0 };
    if (order.payment_status === 'paid') {
      couponStats[code].revenue += parseFloat(order.total) || 0;
    }
    couponStats[code].orders_count += 1;
  }

  const coupons = (couponsRes.data || []).map((c: Record<string, unknown>) => ({
    ...c,
    revenue_generated: couponStats[(c.code as string || '').toUpperCase()]?.revenue || 0,
    actual_orders: couponStats[(c.code as string || '').toUpperCase()]?.orders_count || 0,
  }));

  return NextResponse.json({ coupons });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const body = await req.json();
  body.code = body.code?.toUpperCase();

  const { data, error } = await supabaseAdmin
    .from('coupons')
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const { ids } = await req.json();

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('coupons')
    .delete()
    .in('id', ids);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: ids.length });
}
