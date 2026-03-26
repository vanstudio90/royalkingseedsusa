import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendOrderEmail, sendTrackingEmail } from '@/lib/email';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const { id } = await params;
  const body = await req.json();

  // Check if tracking number is being saved (new or updated)
  const hasTrackingUpdate = !!body.tracking_number;

  // Track previous status for email notifications
  let previousStatus: string | null = null;

  // If status is being changed, add to status_history
  if (body.status) {
    const { data: current } = await supabaseAdmin
      .from('orders')
      .select('status, status_history')
      .eq('id', id)
      .single();

    if (current && current.status !== body.status) {
      previousStatus = current.status;
      const history = Array.isArray(current.status_history) ? current.status_history : [];
      history.push({
        from: current.status,
        to: body.status,
        timestamp: new Date().toISOString(),
      });
      body.status_history = history;
    }
  }

  const { data, error } = await supabaseAdmin
    .from('orders')
    .update(body)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send emails BEFORE returning response (must await on Vercel serverless)
  if (hasTrackingUpdate && data && data.tracking_number) {
    await sendTrackingEmail({
      order_number: data.order_number,
      customer_email: data.customer_email,
      customer_name: data.customer_name,
      tracking_number: data.tracking_number,
    });
  }

  if (previousStatus !== null && data) {
    await sendOrderEmail(body.status, {
      order_number: data.order_number,
      customer_email: data.customer_email,
      customer_name: data.customer_name,
      items: data.items,
      subtotal: data.subtotal,
      shipping_cost: data.shipping_cost,
      tax: data.tax,
      total: data.total,
      discount: data.discount,
      coupon_code: data.coupon_code,
      shipping_address: data.shipping_address,
      payment_method: data.payment_method,
      tracking_number: data.tracking_number,
    });
  }

  return NextResponse.json(data);
}
