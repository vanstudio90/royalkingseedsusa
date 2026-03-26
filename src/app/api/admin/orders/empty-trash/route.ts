import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/admin-auth';

// Instead of deleting orders, archive them so they are NEVER lost
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  // 1. Fetch trashed orders older than 30 days
  const { data: trashedOrders, error: fetchError } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('status', 'trashed')
    .lt('updated_at', thirtyDaysAgo);

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!trashedOrders || trashedOrders.length === 0) {
    return NextResponse.json({ success: true, archived: 0 });
  }

  // 2. Copy each order to the orders_archive table
  const archiveRows = trashedOrders.map((order) => ({
    original_id: order.id,
    order_number: order.order_number,
    customer_email: order.customer_email,
    customer_name: order.customer_name,
    shipping_address: order.shipping_address,
    billing_address: order.billing_address,
    items: order.items,
    subtotal: order.subtotal,
    shipping_cost: order.shipping_cost,
    tax: order.tax,
    total: order.total,
    discount: order.discount,
    coupon_code: order.coupon_code,
    province: order.province,
    status: order.status,
    payment_status: order.payment_status,
    payment_method: order.payment_method,
    tracking_number: order.tracking_number,
    notes: order.notes,
    status_history: order.status_history,
    original_created_at: order.created_at,
    original_updated_at: order.updated_at,
    archived_reason: 'empty_trash',
  }));

  const { error: archiveError } = await supabaseAdmin
    .from('orders_archive')
    .insert(archiveRows);

  if (archiveError) {
    return NextResponse.json({ error: `Archive failed: ${archiveError.message}` }, { status: 500 });
  }

  // 3. Now safe to mark as archived (change status so they leave the trash view)
  const ids = trashedOrders.map((o) => o.id);
  const { error: updateError } = await supabaseAdmin
    .from('orders')
    .update({ status: 'archived' })
    .in('id', ids);

  if (updateError) {
    return NextResponse.json({ error: `Status update failed: ${updateError.message}` }, { status: 500 });
  }

  return NextResponse.json({ success: true, archived: trashedOrders.length });
}
