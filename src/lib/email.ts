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

function layout(content: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background: #f5f1eb; font-family: Georgia, 'Times New Roman', serif; color: #2d2a26; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: #2d2a26; padding: 28px 32px; text-align: center; }
    .header h1 { margin: 0; color: #c8a85c; font-size: 22px; font-weight: 700; letter-spacing: 1px; }
    .header p { margin: 4px 0 0; color: #a89b8a; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; }
    .body { padding: 32px; }
    .greeting { font-size: 16px; margin-bottom: 16px; }
    .message { font-size: 15px; line-height: 1.6; color: #4a4540; margin-bottom: 24px; }
    .status-badge { display: inline-block; padding: 8px 20px; border-radius: 4px; font-size: 14px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 24px; }
    .status-processing { background: #fef3c7; color: #92400e; }
    .status-shipped { background: #dbeafe; color: #1e40af; }
    .status-completed { background: #d1fae5; color: #065f46; }
    .status-cancelled { background: #fee2e2; color: #991b1b; }
    .status-refunded { background: #ede9fe; color: #5b21b6; }
    .order-number { font-size: 13px; color: #8a8078; margin-bottom: 24px; }
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .items-table th { text-align: left; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #8a8078; border-bottom: 2px solid #e8e2d9; padding: 8px 0; }
    .items-table th:last-child { text-align: right; }
    .items-table td { padding: 12px 0; border-bottom: 1px solid #f0ebe4; font-size: 14px; color: #4a4540; }
    .items-table td:last-child { text-align: right; font-weight: 600; }
    .totals { margin-bottom: 24px; }
    .totals-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 14px; color: #6b6560; }
    .totals-total { display: flex; justify-content: space-between; padding: 12px 0; font-size: 18px; font-weight: 700; color: #2d2a26; border-top: 2px solid #2d2a26; margin-top: 8px; }
    .info-box { background: #faf8f5; border: 1px solid #e8e2d9; border-radius: 6px; padding: 16px 20px; margin-bottom: 16px; }
    .info-box h3 { margin: 0 0 8px; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #8a8078; }
    .info-box p { margin: 0; font-size: 14px; line-height: 1.5; color: #4a4540; }
    .tracking-box { background: #f0fdf4; border: 2px solid #86efac; border-radius: 6px; padding: 20px; margin-bottom: 24px; text-align: center; }
    .tracking-box h3 { margin: 0 0 8px; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #065f46; }
    .tracking-box .number { font-size: 18px; font-weight: 700; color: #065f46; letter-spacing: 1px; }
    .cta-button { display: inline-block; background: #2d2a26; color: #c8a85c; text-decoration: none; padding: 12px 28px; border-radius: 4px; font-size: 14px; font-weight: 600; letter-spacing: 0.5px; }
    .footer { background: #2d2a26; padding: 24px 32px; text-align: center; }
    .footer p { margin: 0; color: #8a8078; font-size: 12px; line-height: 1.6; }
    .footer a { color: #c8a85c; text-decoration: none; }
    .divider { height: 1px; background: #e8e2d9; margin: 24px 0; }
    @media (max-width: 600px) {
      .body { padding: 20px; }
      .header { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Royal King Seeds</h1>
      <p>Premium Cannabis Seeds</p>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>Questions? Reply directly to this email.</p>
      <p style="margin-top: 8px;"><a href="${STORE_URL}">royalkingseeds.us</a></p>
    </div>
  </div>
</body>
</html>`;
}

// ── Helpers ──────────────────────────────────────────────────

function itemsTable(items: OrderData['items']) {
  const rows = items.map(i => `
    <tr>
      <td>${i.name}</td>
      <td style="text-align:center">${i.qty}</td>
      <td>$${(i.price * i.qty).toFixed(2)}</td>
    </tr>`).join('');

  return `
    <table class="items-table">
      <thead><tr><th>Product</th><th style="text-align:center">Qty</th><th style="text-align:right">Total</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function totalsBlock(order: OrderData) {
  let html = '<div class="totals">';
  html += `<div class="totals-row"><span>Subtotal</span><span>$${order.subtotal.toFixed(2)}</span></div>`;
  if (order.discount > 0) {
    html += `<div class="totals-row"><span>Discount${order.coupon_code ? ` (${order.coupon_code})` : ''}</span><span>-$${order.discount.toFixed(2)}</span></div>`;
  }
  html += `<div class="totals-row"><span>Shipping</span><span>${order.shipping_cost > 0 ? '$' + order.shipping_cost.toFixed(2) : 'Free'}</span></div>`;
  html += `<div class="totals-row"><span>Tax</span><span>$${order.tax.toFixed(2)}</span></div>`;
  html += `<div class="totals-total"><span>Total</span><span>$${order.total.toFixed(2)} USD</span></div>`;
  html += '</div>';
  return html;
}

function addressBlock(title: string, addr: Record<string, string>) {
  const parts = [addr.street, addr.street2, `${addr.city}${addr.state ? ', ' + addr.state : ''} ${addr.zip || ''}`.trim(), addr.country].filter(Boolean);
  return `
    <div class="info-box">
      <h3>${title}</h3>
      <p>${parts.join('<br>')}</p>
    </div>`;
}

function paymentBlock(method: string) {
  return `
    <div class="info-box">
      <h3>Payment</h3>
      <p>${method}</p>
    </div>`;
}

// ── Email templates ─────────────────────────────────────────

function orderConfirmationHtml(order: OrderData) {
  return layout(`
    <p class="greeting">Hi ${order.customer_name.split(' ')[0]},</p>
    <p class="message">Thank you for your order! We've received your payment and your order is being prepared.</p>
    <span class="status-badge status-processing">Processing</span>
    <p class="order-number">Order <strong>${order.order_number}</strong></p>
    ${itemsTable(order.items)}
    ${totalsBlock(order)}
    <div class="divider"></div>
    <div style="display:flex;gap:16px;flex-wrap:wrap;">
      ${addressBlock('Shipping To', order.shipping_address)}
      ${paymentBlock(order.payment_method)}
    </div>
    <div class="divider"></div>
    <p class="message">You'll receive another email when your order ships with tracking information.</p>
  `);
}

function shippedHtml(order: OrderData) {
  return layout(`
    <p class="greeting">Hi ${order.customer_name.split(' ')[0]},</p>
    <p class="message">Great news! Your order is on its way.</p>
    <span class="status-badge status-shipped">Shipped</span>
    <p class="order-number">Order <strong>${order.order_number}</strong></p>
    ${order.tracking_number ? `
      <div class="tracking-box">
        <h3>Tracking Number</h3>
        <p class="number">${order.tracking_number}</p>
      </div>` : ''}
    ${itemsTable(order.items)}
    ${addressBlock('Shipping To', order.shipping_address)}
    <div class="divider"></div>
    <p class="message">Estimated delivery: 3-7 business days. If you have any questions about your shipment, reply to this email.</p>
  `);
}

function completedHtml(order: OrderData) {
  return layout(`
    <p class="greeting">Hi ${order.customer_name.split(' ')[0]},</p>
    <p class="message">Your order has been marked as complete! We hope you love your seeds.</p>
    <span class="status-badge status-completed">Completed</span>
    <p class="order-number">Order <strong>${order.order_number}</strong></p>
    ${itemsTable(order.items)}
    <div class="divider"></div>
    <p class="message">If you have a moment, we'd love to hear from you:</p>
    <p style="text-align:center;margin:24px 0;">
      <a href="${STORE_URL}" class="cta-button">Shop Again</a>
    </p>
    <p class="message">Thank you for choosing Royal King Seeds!</p>
  `);
}

function cancelledHtml(order: OrderData) {
  return layout(`
    <p class="greeting">Hi ${order.customer_name.split(' ')[0]},</p>
    <p class="message">Your order has been cancelled.</p>
    <span class="status-badge status-cancelled">Cancelled</span>
    <p class="order-number">Order <strong>${order.order_number}</strong></p>
    ${itemsTable(order.items)}
    ${totalsBlock(order)}
    <div class="divider"></div>
    <p class="message">If you were charged, a refund will be processed within 5-10 business days.</p>
    <p class="message">If you didn't request this cancellation, please reply to this email immediately.</p>
  `);
}

function refundedHtml(order: OrderData) {
  return layout(`
    <p class="greeting">Hi ${order.customer_name.split(' ')[0]},</p>
    <p class="message">A refund has been issued for your order.</p>
    <span class="status-badge status-refunded">Refunded</span>
    <p class="order-number">Order <strong>${order.order_number}</strong></p>
    <div class="info-box">
      <h3>Refund Details</h3>
      <p><strong>Amount:</strong> $${order.total.toFixed(2)} USD<br>
      <strong>Method:</strong> ${order.payment_method}<br>
      Please allow 5-10 business days for the refund to appear on your statement.</p>
    </div>
    ${itemsTable(order.items)}
    <div class="divider"></div>
    <p class="message">If you have any questions, reply to this email.</p>
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
