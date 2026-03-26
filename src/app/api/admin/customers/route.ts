import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');
  const sortBy = searchParams.get('sortBy') || 'total_spent';
  const sortDir = searchParams.get('sortDir') || 'desc';

  // Fetch customers
  let query = supabaseAdmin
    .from('customers')
    .select('*', { count: 'exact' })
    .order(sortBy, { ascending: sortDir === 'asc' })
    .limit(200);

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data: customers, error, count } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fetch all orders for these customers to build order histories
  const customerEmails = (customers || []).map((c: { email: string }) => c.email);

  let orders: Array<{
    id: number;
    order_number: string;
    customer_email: string;
    total: number;
    status: string;
    created_at: string;
    province: string;
    shipping_address: Record<string, string>;
  }> = [];

  if (customerEmails.length > 0) {
    // Fetch orders in batches if needed
    const { data: orderData } = await supabaseAdmin
      .from('orders')
      .select('id, order_number, customer_email, total, status, created_at, province, shipping_address')
      .in('customer_email', customerEmails)
      .order('created_at', { ascending: false });

    orders = orderData || [];
  }

  // Build order map by customer email
  const orderMap: Record<string, typeof orders> = {};
  for (const order of orders) {
    if (!orderMap[order.customer_email]) {
      orderMap[order.customer_email] = [];
    }
    orderMap[order.customer_email].push(order);
  }

  // Enrich customers with order history, LTV, last order date, location
  const enrichedCustomers = (customers || []).map((c: {
    id: number;
    email: string;
    name: string;
    phone: string;
    shipping_address: Record<string, string>;
    total_orders: number;
    total_spent: number;
    notes: string;
    tags: string[] | null;
    created_at: string;
    updated_at: string;
  }) => {
    const customerOrders = orderMap[c.email] || [];
    const ltv = customerOrders.reduce((sum: number, o: { total: number }) => sum + Number(o.total), 0);
    const lastOrder = customerOrders.length > 0 ? customerOrders[0] : null;

    // Try to extract location from shipping_address or orders
    let city = '';
    let province = '';
    if (c.shipping_address && typeof c.shipping_address === 'object') {
      city = c.shipping_address.city || '';
      province = c.shipping_address.province || c.shipping_address.state || '';
    }
    if (!province && lastOrder) {
      province = lastOrder.province || '';
      if (lastOrder.shipping_address && typeof lastOrder.shipping_address === 'object') {
        city = city || lastOrder.shipping_address.city || '';
        province = province || lastOrder.shipping_address.province || lastOrder.shipping_address.state || '';
      }
    }

    return {
      ...c,
      order_count: customerOrders.length || c.total_orders,
      ltv: ltv || Number(c.total_spent),
      last_order_date: lastOrder?.created_at || null,
      city,
      province,
      tags: c.tags || [],
      orders: customerOrders.map((o: { id: number; order_number: string; created_at: string; total: number; status: string }) => ({
        id: o.id,
        order_number: o.order_number,
        date: o.created_at,
        total: Number(o.total),
        status: o.status,
      })),
    };
  });

  // Compute summary stats
  const totalCustomers = enrichedCustomers.length;
  const totalLTV = enrichedCustomers.reduce((sum: number, c: { ltv: number }) => sum + c.ltv, 0);
  const avgLTV = totalCustomers > 0 ? totalLTV / totalCustomers : 0;
  const repeatCustomers = enrichedCustomers.filter((c: { order_count: number }) => c.order_count > 1).length;
  const repeatRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;

  return NextResponse.json({
    customers: enrichedCustomers,
    total: count,
    stats: {
      totalCustomers,
      avgLTV,
      repeatRate,
      repeatCustomers,
    },
  });
}

// PATCH - update customer notes or tags
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const body = await req.json();
  const { id, notes, tags } = body;

  if (!id) {
    return NextResponse.json({ error: 'Customer ID required' }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (notes !== undefined) updates.notes = notes;
  if (tags !== undefined) updates.tags = tags;

  const { data, error } = await supabaseAdmin
    .from('customers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ customer: data });
}
