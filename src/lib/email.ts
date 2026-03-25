import { Resend } from 'resend';

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const FROM_EMAIL = 'Royal King Seeds <orders@royalkingseeds.us>';
const STORE_URL = 'https://royalkingseeds.us';

interface OrderData {
  order_number: string;
  customer_email: string;
  customer_name: string;
  items: Array<{ name: string; qty: number; price: number }>;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  discount: number;
  coupon_code: string;
  shipping_address: Record<string, string>;
  payment_method: string;
  tracking_number?: string;
}

// ── Base layout ──────────────────────────────────────────────

function layout(heroEmoji: string, heroTitle: string, heroSubtitle: string, content: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#1a1a1a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#e8e2d9;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;padding:20px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.4);">

        <!-- Top gold accent bar -->
        <tr><td style="height:4px;background:linear-gradient(90deg,#8B6914,#c8a85c,#e8d48b,#c8a85c,#8B6914);"></td></tr>

        <!-- Header -->
        <tr><td style="background:#111;padding:32px 40px;text-align:center;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="text-align:center;">
              <div style="font-size:13px;letter-spacing:4px;text-transform:uppercase;color:#c8a85c;margin-bottom:4px;">&#9830; &#9830; &#9830;</div>
              <div style="font-size:28px;font-weight:800;color:#ffffff;letter-spacing:2px;">ROYAL KING SEEDS</div>
              <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#8B6914;margin-top:6px;">Premium Cannabis Genetics Since Day One</div>
            </td>
          </tr></table>
        </td></tr>

        <!-- Hero Section -->
        <tr><td style="background:linear-gradient(135deg,#1e3a1e 0%,#0d1f0d 50%,#1a2e1a 100%);padding:40px;text-align:center;border-bottom:1px solid #2a4a2a;">
          <div style="font-size:48px;margin-bottom:12px;">${heroEmoji}</div>
          <div style="font-size:24px;font-weight:700;color:#ffffff;margin-bottom:8px;">${heroTitle}</div>
          <div style="font-size:14px;color:#7dba7d;letter-spacing:0.5px;">${heroSubtitle}</div>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#1e1e1e;padding:36px 40px;">
          ${content}
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#111;padding:28px 40px;text-align:center;border-top:1px solid #2a2a2a;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="text-align:center;padding-bottom:16px;">
              <a href="${STORE_URL}" style="display:inline-block;background:linear-gradient(135deg,#c8a85c,#8B6914);color:#111;text-decoration:none;padding:12px 32px;border-radius:6px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Visit Our Shop</a>
            </td></tr>
            <tr><td style="text-align:center;">
              <div style="font-size:11px;color:#555;line-height:1.8;">
                Questions? Reply directly to this email<br>
                <a href="${STORE_URL}" style="color:#c8a85c;text-decoration:none;">royalkingseeds.us</a>
              </div>
            </td></tr>
          </table>
        </td></tr>

        <!-- Bottom gold accent bar -->
        <tr><td style="height:4px;background:linear-gradient(90deg,#8B6914,#c8a85c,#e8d48b,#c8a85c,#8B6914);"></td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Helpers ──────────────────────────────────────────────────

function itemsTable(items: OrderData['items']) {
  const rows = items.map(i => `
    <tr>
      <td style="padding:14px 16px;border-bottom:1px solid #333;color:#e8e2d9;font-size:14px;">
        <div style="font-weight:600;">${i.name}</div>
      </td>
      <td style="padding:14px 12px;border-bottom:1px solid #333;color:#999;font-size:14px;text-align:center;">${i.qty}</td>
      <td style="padding:14px 16px;border-bottom:1px solid #333;color:#c8a85c;font-size:14px;text-align:right;font-weight:700;">$${(i.price * i.qty).toFixed(2)}</td>
    </tr>`).join('');

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#161616;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      <tr>
        <td style="padding:12px 16px;border-bottom:2px solid #c8a85c;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#c8a85c;">Product</td>
        <td style="padding:12px 12px;border-bottom:2px solid #c8a85c;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#c8a85c;text-align:center;">Qty</td>
        <td style="padding:12px 16px;border-bottom:2px solid #c8a85c;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#c8a85c;text-align:right;">Total</td>
      </tr>
      ${rows}
    </table>`;
}

function totalsBlock(order: OrderData) {
  let rows = '';
  rows += `<tr><td style="padding:6px 0;color:#999;font-size:14px;">Subtotal</td><td style="padding:6px 0;color:#e8e2d9;font-size:14px;text-align:right;">$${order.subtotal.toFixed(2)}</td></tr>`;
  if (order.discount > 0) {
    rows += `<tr><td style="padding:6px 0;color:#7dba7d;font-size:14px;">Discount${order.coupon_code ? ` (${order.coupon_code})` : ''}</td><td style="padding:6px 0;color:#7dba7d;font-size:14px;text-align:right;">-$${order.discount.toFixed(2)}</td></tr>`;
  }
  rows += `<tr><td style="padding:6px 0;color:#999;font-size:14px;">Shipping</td><td style="padding:6px 0;color:#e8e2d9;font-size:14px;text-align:right;">${order.shipping_cost > 0 ? '$' + order.shipping_cost.toFixed(2) : '<span style="color:#7dba7d;">Free</span>'}</td></tr>`;
  rows += `<tr><td style="padding:6px 0;color:#999;font-size:14px;">Tax</td><td style="padding:6px 0;color:#e8e2d9;font-size:14px;text-align:right;">$${order.tax.toFixed(2)}</td></tr>`;
  rows += `<tr><td colspan="2" style="padding:8px 0 0;"><div style="height:2px;background:linear-gradient(90deg,#c8a85c,#8B6914);"></div></td></tr>`;
  rows += `<tr><td style="padding:12px 0 0;color:#ffffff;font-size:20px;font-weight:800;">Total</td><td style="padding:12px 0 0;color:#c8a85c;font-size:20px;font-weight:800;text-align:right;">$${order.total.toFixed(2)} USD</td></tr>`;

  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">${rows}</table>`;
}

function infoCard(icon: string, title: string, content: string) {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#161616;border:1px solid #2a2a2a;border-radius:8px;margin-bottom:12px;">
      <tr><td style="padding:16px 20px;">
        <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#c8a85c;margin-bottom:8px;">${icon} ${title}</div>
        <div style="font-size:14px;color:#ccc;line-height:1.6;">${content}</div>
      </td></tr>
    </table>`;
}

function statusBadge(label: string, bgColor: string, textColor: string) {
  return `<div style="display:inline-block;padding:8px 24px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;background:${bgColor};color:${textColor};margin-bottom:20px;">${label}</div>`;
}

function orderNumberBlock(orderNumber: string) {
  return `<div style="font-size:12px;color:#666;margin-bottom:28px;">Order <span style="color:#c8a85c;font-weight:600;">${orderNumber}</span></div>`;
}

function greeting(name: string) {
  return `<div style="font-size:16px;color:#ffffff;margin-bottom:16px;">Hi ${name.split(' ')[0]},</div>`;
}

function message(text: string) {
  return `<div style="font-size:15px;line-height:1.7;color:#aaa;margin-bottom:24px;">${text}</div>`;
}

function addressContent(addr: Record<string, string>) {
  const parts = [addr.street, addr.street2, `${addr.city}${addr.state ? ', ' + addr.state : ''} ${addr.zip || ''}`.trim(), addr.country].filter(Boolean);
  return parts.join('<br>');
}

// ── Email templates ─────────────────────────────────────────

function orderConfirmationHtml(order: OrderData) {
  return layout(
    '&#127793;',
    'Order Confirmed!',
    'Your seeds are being prepared with care',
    `
    ${greeting(order.customer_name)}
    ${message("Thank you for your order! We've received your payment and your seeds are being carefully prepared for shipment.")}
    ${statusBadge('Processing', 'rgba(200,168,92,0.15)', '#c8a85c')}
    ${orderNumberBlock(order.order_number)}
    ${itemsTable(order.items)}
    ${totalsBlock(order)}
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="48%" valign="top">
        ${infoCard('&#128230;', 'Shipping To', addressContent(order.shipping_address))}
      </td>
      <td width="4%"></td>
      <td width="48%" valign="top">
        ${infoCard('&#128179;', 'Payment', order.payment_method)}
      </td>
    </tr></table>
    ${message("You'll receive another email with tracking info once your order ships. We handle every order with the same care we'd want for our own garden.")}
  `);
}

function shippedHtml(order: OrderData) {
  const trackingHtml = order.tracking_number ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1e3a1e,#0d1f0d);border:2px solid #2d5a2d;border-radius:10px;margin-bottom:24px;">
      <tr><td style="padding:24px;text-align:center;">
        <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#7dba7d;margin-bottom:10px;">&#128230; Tracking Number</div>
        <div style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:2px;">${order.tracking_number}</div>
      </td></tr>
    </table>` : '';

  return layout(
    '&#128666;',
    'Your Seeds Are On The Way!',
    'Packed with care and headed to your door',
    `
    ${greeting(order.customer_name)}
    ${message("Great news! Your order has been packed and shipped. Your premium genetics are on their way to you.")}
    ${statusBadge('Shipped', 'rgba(59,130,246,0.15)', '#60a5fa')}
    ${orderNumberBlock(order.order_number)}
    ${trackingHtml}
    ${itemsTable(order.items)}
    ${infoCard('&#128230;', 'Shipping To', addressContent(order.shipping_address))}
    ${message("Estimated delivery: <strong style='color:#e8e2d9;'>3-7 business days</strong>. Your seeds are shipped in discreet, secure packaging. If you have any questions, just reply to this email.")}
  `);
}

function completedHtml(order: OrderData) {
  return layout(
    '&#127775;',
    'Order Complete!',
    'Thank you for growing with us',
    `
    ${greeting(order.customer_name)}
    ${message("Your order has been delivered! We hope you're excited to start your grow. Every seed in your order was hand-selected from our premium genetics.")}
    ${statusBadge('Completed', 'rgba(34,197,94,0.15)', '#4ade80')}
    ${orderNumberBlock(order.order_number)}
    ${itemsTable(order.items)}
    ${message("Happy with your seeds? We'd love for you to come back and explore more of our collection.")}
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;"><tr><td style="text-align:center;">
      <a href="${STORE_URL}" style="display:inline-block;background:linear-gradient(135deg,#22c55e,#15803d);color:#fff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:14px;font-weight:700;letter-spacing:1px;">Shop New Strains</a>
    </td></tr></table>
    ${message("Thank you for choosing Royal King Seeds. Happy growing! &#127793;")}
  `);
}

function cancelledHtml(order: OrderData) {
  return layout(
    '&#10060;',
    'Order Cancelled',
    'We\'re sorry to see this order go',
    `
    ${greeting(order.customer_name)}
    ${message("Your order has been cancelled. If you were charged, a full refund will be processed.")}
    ${statusBadge('Cancelled', 'rgba(239,68,68,0.15)', '#f87171')}
    ${orderNumberBlock(order.order_number)}
    ${itemsTable(order.items)}
    ${totalsBlock(order)}
    ${infoCard('&#128176;', 'Refund Info', 'If you were charged, your refund will be processed within <strong>5-10 business days</strong> back to your original payment method.')}
    ${message("If you didn't request this cancellation, please reply to this email immediately. We're here to help.")}
  `);
}

function refundedHtml(order: OrderData) {
  return layout(
    '&#128176;',
    'Refund Processed',
    'Your money is on its way back',
    `
    ${greeting(order.customer_name)}
    ${message("A refund has been issued for your order. Here are the details:")}
    ${statusBadge('Refunded', 'rgba(139,92,246,0.15)', '#a78bfa')}
    ${orderNumberBlock(order.order_number)}
    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1e1e3a,#0d0d1f);border:2px solid #3a3a5a;border-radius:10px;margin-bottom:24px;">
      <tr><td style="padding:24px;text-align:center;">
        <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#a78bfa;margin-bottom:10px;">Refund Amount</div>
        <div style="font-size:28px;font-weight:800;color:#ffffff;">$${order.total.toFixed(2)} <span style="font-size:14px;color:#888;">USD</span></div>
        <div style="font-size:13px;color:#888;margin-top:8px;">${order.payment_method}</div>
      </td></tr>
    </table>
    ${itemsTable(order.items)}
    ${message("Please allow <strong style='color:#e8e2d9;'>5-10 business days</strong> for the refund to appear on your statement. If you have questions, reply to this email.")}
  `);
}

// ── Send functions ──────────────────────────────────────────

const SUBJECTS: Record<string, (order: OrderData) => string> = {
  processing: (o) => `Order Confirmed \u2014 ${o.order_number}`,
  shipped: (o) => `Your Order Has Shipped! \u2014 ${o.order_number}`,
  completed: (o) => `Order Complete \u2014 ${o.order_number}`,
  cancelled: (o) => `Order Cancelled \u2014 ${o.order_number}`,
  refunded: (o) => `Refund Processed \u2014 ${o.order_number}`,
};

const TEMPLATES: Record<string, (order: OrderData) => string> = {
  processing: orderConfirmationHtml,
  shipped: shippedHtml,
  completed: completedHtml,
  cancelled: cancelledHtml,
  refunded: refundedHtml,
};

export async function sendOrderEmail(status: string, order: OrderData) {
  const subjectFn = SUBJECTS[status];
  const templateFn = TEMPLATES[status];

  if (!subjectFn || !templateFn) return;

  if (!process.env.RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY not set, skipping email');
    return;
  }

  try {
    const { error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: order.customer_email,
      subject: subjectFn(order),
      html: templateFn(order),
    });

    if (error) {
      console.error('[Email] Send error:', error);
    } else {
      console.log(`[Email] Sent ${status} email to ${order.customer_email} for ${order.order_number}`);
    }
  } catch (err) {
    console.error('[Email] Failed:', err);
  }
}
