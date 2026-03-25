import { NextRequest, NextResponse } from 'next/server';
import { processCharge } from '@/lib/accept-blue';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { card, order } = body as {
    card: {
      number: string;
      expiry_month: number;
      expiry_year: number;
      cvv: string;
      name: string;
    };
    order: {
      order_number: string;
      customer_email: string;
      customer_name: string;
      shipping_address: Record<string, string>;
      items: Array<{ name: string; slug: string; qty: number; price: number }>;
      subtotal: number;
      shipping_cost: number;
      tax: number;
      total: number;
      discount: number;
      coupon_code: string;
      province: string;
      notes: string;
      phone: string;
      first_name: string;
      last_name: string;
      billing_address?: Record<string, string>;
    };
  };

  if (!card?.number || !card?.cvv || !order?.customer_email || !order?.items?.length) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  console.log('[Payment] Processing order:', order.order_number, 'amount:', order.total, 'card_last4:', card.number.slice(-4));

  // 1. Process payment via Accept.Blue
  try {
    const chargeResult = await processCharge({
      amount: order.total,
      card: card.number.replace(/\s/g, ''),
      expiry_month: card.expiry_month,
      expiry_year: card.expiry_year,
      cvv2: card.cvv,
      name: card.name,
      billing_info: {
        first_name: order.first_name,
        last_name: order.last_name,
        street: order.billing_address?.street || order.shipping_address.street,
        city: order.billing_address?.city || order.shipping_address.city,
        state: order.billing_address?.state || order.shipping_address.state,
        zip: order.billing_address?.zip || order.shipping_address.zip,
        country: 'US',
        phone: order.phone,
        email: order.customer_email,
      },
      shipping_info: {
        first_name: order.first_name,
        last_name: order.last_name,
        street: order.shipping_address.street,
        city: order.shipping_address.city,
        state: order.shipping_address.state,
        zip: order.shipping_address.zip,
        country: 'US',
      },
      transaction_details: {
        description: `Royal King Seeds Order ${order.order_number}`,
        order_number: order.order_number,
        client_ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '',
      },
      amount_details: {
        tax: order.tax,
        shipping: order.shipping_cost,
        subtotal: order.subtotal - order.discount,
      },
      custom_fields: {
        custom1: order.order_number,
      },
    });

    if (chargeResult.status !== 'Approved') {
      // Save declined order so it shows in admin panel
      const declineInfo = `[DECLINED: ${chargeResult.error_message || chargeResult.status}, Card ending ${chargeResult.last_4 || card.number.slice(-4)}, Ref #${chargeResult.reference_number || 'N/A'}]`;
      await supabaseAdmin
        .from('orders')
        .insert({
          order_number: order.order_number,
          customer_email: order.customer_email,
          customer_name: order.customer_name,
          shipping_address: order.shipping_address,
          items: order.items,
          subtotal: order.subtotal,
          shipping_cost: order.shipping_cost,
          tax: order.tax,
          total: order.total,
          discount: order.discount,
          coupon_code: order.coupon_code,
          province: order.province,
          payment_method: `credit-card (*${chargeResult.last_4 || card.number.slice(-4)})`,
          status: 'cancelled',
          payment_status: 'unpaid',
          notes: order.notes ? `${order.notes}\n\n${declineInfo}` : declineInfo,
        });

      console.log('[Payment] DECLINED order saved:', order.order_number);

      return NextResponse.json({
        error: 'Payment declined',
        message: chargeResult.error_message || `Card was ${chargeResult.status.toLowerCase()}. Please check your card details and try again.`,
        avs_result: chargeResult.avs_result,
      }, { status: 402 });
    }

    // 2. Payment approved — save order to Supabase
    const paymentInfo = `[Payment: ${chargeResult.card_type} ending ${chargeResult.last_4}, Ref #${chargeResult.reference_number}, Auth: ${chargeResult.auth_code}]`;
    const combinedNotes = order.notes
      ? `${order.notes}\n\n${paymentInfo}`
      : paymentInfo;

    const { error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        order_number: order.order_number,
        customer_email: order.customer_email,
        customer_name: order.customer_name,
        shipping_address: order.shipping_address,
        items: order.items,
        subtotal: order.subtotal,
        shipping_cost: order.shipping_cost,
        tax: order.tax,
        total: order.total,
        discount: order.discount,
        coupon_code: order.coupon_code,
        province: order.province,
        payment_method: `credit-card (${chargeResult.card_type} *${chargeResult.last_4})`,
        status: 'processing',
        payment_status: 'paid',
        notes: combinedNotes,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order save error (payment was successful):', orderError);
    }

    // 3. Create/update customer record
    await supabaseAdmin
      .from('customers')
      .upsert({
        email: order.customer_email,
        name: order.customer_name,
        phone: order.phone || '',
        shipping_address: order.shipping_address,
        total_orders: 1,
        total_spent: order.total,
      }, { onConflict: 'email' });

    return NextResponse.json({
      success: true,
      order_number: order.order_number,
      reference_number: chargeResult.reference_number,
      card_type: chargeResult.card_type,
      last_4: chargeResult.last_4,
    });

  } catch (err: any) {
    console.error('[Payment] Error:', err?.message || err);
    const errMsg = err?.message || '';

    // Save failed order so it shows in admin panel
    const failInfo = `[FAILED: ${errMsg || 'Unknown error'}]`;
    try {
      await supabaseAdmin
        .from('orders')
        .insert({
          order_number: order.order_number,
          customer_email: order.customer_email,
          customer_name: order.customer_name,
          shipping_address: order.shipping_address,
          items: order.items,
          subtotal: order.subtotal,
          shipping_cost: order.shipping_cost,
          tax: order.tax,
          total: order.total,
          discount: order.discount,
          coupon_code: order.coupon_code,
          province: order.province,
          payment_method: `credit-card (*${card.number.slice(-4)})`,
          status: 'cancelled',
          payment_status: 'unpaid',
          notes: order.notes ? `${order.notes}\n\n${failInfo}` : failInfo,
        });
    } catch (_) {}

    return NextResponse.json({
      error: 'Payment processing failed',
      message: errMsg.includes('not configured')
        ? 'Payment gateway is not configured. Please contact support.'
        : errMsg.includes('Accept.Blue API error')
        ? 'Payment gateway returned an error. Please try again or use a different card.'
        : 'There was an error connecting to the payment processor. Please try again.',
      debug: process.env.NODE_ENV !== 'production' ? errMsg : undefined,
    }, { status: 500 });
  }
}
