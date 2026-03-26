import { Resend } from 'resend';

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const FROM_EMAIL = 'Royal King Seeds <orders@royalkingseeds.us>';
const STORE_URL = 'https://royalkingseeds.us';

// Brand colors
const GREEN = '#275C53';
const GOLD = '#D7B65D';
const DARK = '#192026';
const BG = '#F5F0EA';

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

function layout(heroTitle: string, heroSubtitle: string, content: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:${DARK};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:20px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="background:${GREEN};padding:28px 40px;text-align:center;">
          <div style="font-size:24px;font-weight:800;color:#ffffff;letter-spacing:2px;">ROYAL KING SEEDS</div>
          <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${GOLD};margin-top:6px;">Premium Cannabis Seeds</div>
        </td></tr>

        <!-- Hero Section -->
        <tr><td style="background:${BG};padding:32px 40px;text-align:center;">
          <div style="font-size:22px;font-weight:700;color:${DARK};margin-bottom:6px;">${heroTitle}</div>
          <div style="font-size:14px;color:#6b6560;">${heroSubtitle}</div>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#ffffff;padding:32px 40px;">
          ${content}
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:${GREEN};padding:24px 40px;text-align:center;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="text-align:center;padding-bottom:14px;">
              <a href="${STORE_URL}" style="display:inline-block;background:${GOLD};color:${DARK};text-decoration:none;padding:10px 28px;border-radius:4px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Visit Our Shop</a>
            </td></tr>
            <tr><td style="text-align:center;">
              <div style="font-size:11px;color:rgba(255,255,255,0.6);line-height:1.8;">
                Questions? Reply directly to this email<br>
                <a href="${STORE_URL}" style="color:${GOLD};text-decoration:none;">royalkingseeds.us</a>
              </div>
            </td></tr>
          </table>
        </td></tr>

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
      <td style="padding:12px 0;border-bottom:1px solid #e8e2d9;color:${DARK};font-size:14px;font-weight:600;">${i.name}</td>
      <td style="padding:12px 0;border-bottom:1px solid #e8e2d9;color:#6b6560;font-size:14px;text-align:center;">${i.qty}</td>
      <td style="padding:12px 0;border-bottom:1px solid #e8e2d9;color:${DARK};font-size:14px;text-align:right;font-weight:700;">$${(i.price * i.qty).toFixed(2)}</td>
    </tr>`).join('');

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="padding:10px 0;border-bottom:2px solid ${GREEN};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${GREEN};">Product</td>
        <td style="padding:10px 0;border-bottom:2px solid ${GREEN};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${GREEN};text-align:center;">Qty</td>
        <td style="padding:10px 0;border-bottom:2px solid ${GREEN};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${GREEN};text-align:right;">Total</td>
      </tr>
      ${rows}
    </table>`;
}

function totalsBlock(order: OrderData) {
  let rows = '';
  rows += `<tr><td style="padding:5px 0;color:#6b6560;font-size:14px;">Subtotal</td><td style="padding:5px 0;color:${DARK};font-size:14px;text-align:right;">$${order.subtotal.toFixed(2)}</td></tr>`;
  if (order.discount > 0) {
    rows += `<tr><td style="padding:5px 0;color:${GREEN};font-size:14px;">Discount${order.coupon_code ? ` (${order.coupon_code})` : ''}</td><td style="padding:5px 0;color:${GREEN};font-size:14px;text-align:right;">-$${order.discount.toFixed(2)}</td></tr>`;
  }
  rows += `<tr><td style="padding:5px 0;color:#6b6560;font-size:14px;">Shipping</td><td style="padding:5px 0;color:${DARK};font-size:14px;text-align:right;">${order.shipping_cost > 0 ? '$' + order.shipping_cost.toFixed(2) : '<span style="color:' + GREEN + ';">Free</span>'}</td></tr>`;
  rows += `<tr><td style="padding:5px 0;color:#6b6560;font-size:14px;">Tax</td><td style="padding:5px 0;color:${DARK};font-size:14px;text-align:right;">$${order.tax.toFixed(2)}</td></tr>`;
  rows += `<tr><td colspan="2" style="padding:8px 0 0;"><div style="height:2px;background:${GREEN};"></div></td></tr>`;
  rows += `<tr><td style="padding:10px 0 0;color:${DARK};font-size:20px;font-weight:800;">Total</td><td style="padding:10px 0 0;color:${GREEN};font-size:20px;font-weight:800;text-align:right;">$${order.total.toFixed(2)} USD</td></tr>`;

  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">${rows}</table>`;
}

function infoCard(title: string, content: string) {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${BG};border-radius:6px;margin-bottom:12px;">
      <tr><td style="padding:14px 18px;">
        <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${GREEN};margin-bottom:6px;">${title}</div>
        <div style="font-size:14px;color:#4a4540;line-height:1.6;">${content}</div>
      </td></tr>
    </table>`;
}

function statusBadge(label: string, color: string) {
  return `<div style="display:inline-block;padding:6px 20px;border:2px solid ${color};border-radius:20px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${color};margin-bottom:20px;">${label}</div>`;
}

function orderNumberBlock(orderNumber: string) {
  return `<div style="font-size:12px;color:#8a8078;margin-bottom:24px;">Order <span style="color:${GREEN};font-weight:600;">${orderNumber}</span></div>`;
}

function greeting(name: string) {
  return `<div style="font-size:16px;color:${DARK};margin-bottom:14px;">Hi ${name.split(' ')[0]},</div>`;
}

function message(text: string) {
  return `<div style="font-size:15px;line-height:1.7;color:#4a4540;margin-bottom:20px;">${text}</div>`;
}

function addressContent(addr: Record<string, string>) {
  const parts = [addr.street, addr.street2, `${addr.city}${addr.state ? ', ' + addr.state : ''} ${addr.zip || ''}`.trim(), addr.country].filter(Boolean);
  return parts.join('<br>');
}

// ── Email templates ─────────────────────────────────────────

function orderConfirmationHtml(order: OrderData) {
  return layout(
    'Order Confirmed!',
    'Your seeds are being prepared with care',
    `
    ${greeting(order.customer_name)}
    ${message("Thank you for your order! We've received your payment and your seeds are being carefully prepared for shipment.")}
    ${statusBadge('Processing', GOLD)}
    ${orderNumberBlock(order.order_number)}
    ${itemsTable(order.items)}
    ${totalsBlock(order)}
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="48%" valign="top">
        ${infoCard('Shipping To', addressContent(order.shipping_address))}
      </td>
      <td width="4%"></td>
      <td width="48%" valign="top">
        ${infoCard('Payment', order.payment_method)}
      </td>
    </tr></table>
    ${message("You'll receive another email with tracking info once your order ships. We handle every order with the same care we'd want for our own garden.")}
  `);
}

function trackingBlock(trackingNumber: string) {
  const uspsUrl = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${BG};border-radius:6px;margin-bottom:24px;">
      <tr><td style="padding:20px;text-align:center;">
        <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${GREEN};margin-bottom:8px;">Tracking Number</div>
        <div style="font-size:18px;font-weight:800;color:${DARK};letter-spacing:2px;margin-bottom:12px;">${trackingNumber}</div>
        <a href="${uspsUrl}" target="_blank" style="display:inline-block;background:${GREEN};color:#ffffff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:6px;text-decoration:none;letter-spacing:0.5px;">Track on USPS</a>
      </td></tr>
    </table>`;
}

function shippedHtml(order: OrderData) {
  const trackingHtml = order.tracking_number ? trackingBlock(order.tracking_number) : '';

  return layout(
    'Your Seeds Are On The Way!',
    'Packed with care and headed to your door',
    `
    ${greeting(order.customer_name)}
    ${message("Great news! Your order has been packed and shipped. Your premium genetics are on their way to you.")}
    ${statusBadge('Shipped', '#2563eb')}
    ${orderNumberBlock(order.order_number)}
    ${trackingHtml}
    ${itemsTable(order.items)}
    ${infoCard('Shipping To', addressContent(order.shipping_address))}
    ${message("Estimated delivery: <strong style='color:" + DARK + ";'>3-7 business days</strong>. Your seeds are shipped in discreet, secure packaging. If you have any questions, just reply to this email.")}
  `);
}

function completedHtml(order: OrderData) {
  return layout(
    'Order Complete!',
    'Thank you for growing with us',
    `
    ${greeting(order.customer_name)}
    ${message("Your order has been delivered! We hope you're excited to start your grow. Every seed in your order was hand-selected from our premium genetics.")}
    ${statusBadge('Completed', GREEN)}
    ${orderNumberBlock(order.order_number)}
    ${itemsTable(order.items)}
    ${message("Happy with your seeds? We'd love for you to come back and explore more of our collection.")}
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;"><tr><td style="text-align:center;">
      <a href="${STORE_URL}" style="display:inline-block;background:${GREEN};color:#fff;text-decoration:none;padding:12px 32px;border-radius:4px;font-size:14px;font-weight:700;letter-spacing:1px;">Shop New Strains</a>
    </td></tr></table>
    ${message("Thank you for choosing Royal King Seeds. Happy growing!")}
  `);
}

function cancelledHtml(order: OrderData) {
  return layout(
    'Order Cancelled',
    "We're sorry to see this order go",
    `
    ${greeting(order.customer_name)}
    ${message("Your order has been cancelled. If you were charged, a full refund will be processed.")}
    ${statusBadge('Cancelled', '#dc2626')}
    ${orderNumberBlock(order.order_number)}
    ${itemsTable(order.items)}
    ${totalsBlock(order)}
    ${infoCard('Refund Info', 'If you were charged, your refund will be processed within <strong>5-10 business days</strong> back to your original payment method.')}
    ${message("If you didn't request this cancellation, please reply to this email immediately. We're here to help.")}
  `);
}

function manualPaymentHtml(order: OrderData) {
  return layout(
    'Payment Received',
    'Your order is confirmed and preparing to ship',
    `
    ${greeting(order.customer_name)}
    ${message("We are writing to confirm that your payment has been successfully received and verified. Thank you for choosing Royal King Seeds.")}
    ${statusBadge('Payment Confirmed', GREEN)}
    ${orderNumberBlock(order.order_number)}
    ${message("Your order is now being carefully prepared for shipment. Our team inspects every seed pack to ensure you receive only the highest quality genetics.")}
    ${itemsTable(order.items)}
    ${totalsBlock(order)}
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="48%" valign="top">
        ${infoCard('Shipping To', addressContent(order.shipping_address))}
      </td>
      <td width="4%"></td>
      <td width="48%" valign="top">
        ${infoCard('Payment', order.payment_method || 'Manual Payment')}
      </td>
    </tr></table>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${BG};border-radius:6px;margin:20px 0 24px;">
      <tr><td style="padding:18px 20px;">
        <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${GREEN};margin-bottom:8px;">What Happens Next</div>
        <div style="font-size:14px;color:#4a4540;line-height:1.8;">
          1. Our team will carefully package your order<br>
          2. You will receive a shipping confirmation email with tracking details<br>
          3. Estimated delivery: 3-7 business days after shipment
        </div>
      </td></tr>
    </table>
    ${message("If you have any questions about your order, simply reply to this email and our team will be happy to assist you.")}
  `);
}

function refundedHtml(order: OrderData) {
  return layout(
    'Refund Processed',
    'Your money is on its way back',
    `
    ${greeting(order.customer_name)}
    ${message("A refund has been issued for your order. Here are the details:")}
    ${statusBadge('Refunded', '#7c3aed')}
    ${orderNumberBlock(order.order_number)}
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${BG};border-radius:6px;margin-bottom:24px;">
      <tr><td style="padding:20px;text-align:center;">
        <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#7c3aed;margin-bottom:8px;">Refund Amount</div>
        <div style="font-size:26px;font-weight:800;color:${DARK};">$${order.total.toFixed(2)} <span style="font-size:14px;color:#8a8078;">USD</span></div>
        <div style="font-size:13px;color:#6b6560;margin-top:6px;">${order.payment_method}</div>
      </td></tr>
    </table>
    ${itemsTable(order.items)}
    ${message("Please allow <strong style='color:" + DARK + ";'>5-10 business days</strong> for the refund to appear on your statement. If you have questions, reply to this email.")}
  `);
}

// ── Send functions ──────────────────────────────────────────

const SUBJECTS: Record<string, (order: OrderData) => string> = {
  processing: (o) => `Order Confirmed \u2014 ${o.order_number}`,
  manual_payment: (o) => `Payment Received \u2014 ${o.order_number}`,
  shipped: (o) => `Your Order Has Shipped! \u2014 ${o.order_number}`,
  completed: (o) => `Order Complete \u2014 ${o.order_number}`,
  cancelled: (o) => `Order Cancelled \u2014 ${o.order_number}`,
  refunded: (o) => `Refund Processed \u2014 ${o.order_number}`,
};

const TEMPLATES: Record<string, (order: OrderData) => string> = {
  processing: orderConfirmationHtml,
  manual_payment: manualPaymentHtml,
  shipped: shippedHtml,
  completed: completedHtml,
  cancelled: cancelledHtml,
  refunded: refundedHtml,
};

export async function sendTrackingEmail(order: { order_number: string; customer_email: string; customer_name: string; tracking_number: string }) {
  if (!process.env.RESEND_API_KEY || !order.tracking_number) return;

  const uspsUrl = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${order.tracking_number}`;
  const html = layout(
    'Your Tracking Number Is Here!',
    'Your seeds are on the way',
    `
    ${greeting(order.customer_name)}
    ${message("Your order <strong style='color:" + DARK + ";'>#" + order.order_number + "</strong> has been shipped! Here's your tracking number:")}
    ${trackingBlock(order.tracking_number)}
    ${message("Click the button above or visit <a href='" + uspsUrl + "' style='color:" + GREEN + ";font-weight:600;'>USPS Tracking</a> to follow your package.")}
    ${message("Estimated delivery: <strong style='color:" + DARK + ";'>3-7 business days</strong>. Your seeds are shipped in discreet, secure packaging.")}
    ${message("Questions? Just reply to this email and we'll help you out.")}
  `);

  try {
    const result = await getResend().emails.send({
      from: FROM_EMAIL,
      to: order.customer_email,
      subject: `Tracking Update \u2014 ${order.order_number}`,
      html,
    });
    console.log('[Tracking Email] Sent to', order.customer_email, 'result:', JSON.stringify(result));
  } catch (err) {
    console.error('[Tracking Email] Failed:', err);
  }
}

export async function sendOrderEmail(status: string, order: OrderData) {
  const subjectFn = SUBJECTS[status];
  const templateFn = TEMPLATES[status];

  if (!subjectFn || !templateFn) return;

  if (!process.env.RESEND_API_KEY) return;

  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: order.customer_email,
      subject: subjectFn(order),
      html: templateFn(order),
    });
  } catch {
    // Email send failed silently — order is already saved
  }
}
