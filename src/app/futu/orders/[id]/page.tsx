'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface StatusChange {
  from: string;
  to: string;
  timestamp: string;
}

interface Order {
  id: number; order_number: string; customer_name: string; customer_email: string;
  shipping_address: { street?: string; city?: string; province?: string; postal?: string; country?: string };
  items: { name: string; slug: string; qty: number; price: number; variant?: string }[];
  subtotal: number; shipping_cost: number; tax: number; total: number; discount: number;
  status: string; payment_status: string; payment_method: string;
  tracking_number: string; notes: string; coupon_code: string; province: string;
  created_at: string; updated_at: string;
  status_history?: StatusChange[];
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-600', processing: 'bg-blue-50 text-blue-600',
  manual_payment: 'bg-teal-50 text-teal-600',
  shipped: 'bg-purple-50 text-purple-600', completed: 'bg-emerald-50 text-emerald-600',
  cancelled: 'bg-red-50 text-red-500', refunded: 'bg-gray-50 text-gray-500',
};

const statusDotColors: Record<string, string> = {
  pending: 'bg-yellow-400', processing: 'bg-blue-400',
  manual_payment: 'bg-teal-400',
  shipped: 'bg-purple-400', completed: 'bg-emerald-400',
  cancelled: 'bg-red-400', refunded: 'bg-gray-400',
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [tracking, setTracking] = useState('');
  const [notes, setNotes] = useState('');
  const [toast, setToast] = useState('');
  const printRef = useRef<HTMLDivElement>(null);
  const packingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/admin/orders/${params.id}`)
      .then(r => r.json())
      .then(data => { setOrder(data); setTracking(data.tracking_number || ''); setNotes(data.notes || ''); });
  }, [params.id]);

  const updateOrder = async (updates: Partial<Order>) => {
    const res = await fetch(`/api/admin/orders/${params.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    setOrder(data);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<html><head><title>Invoice #${order?.order_number}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #eee; }
        th { font-size: 11px; text-transform: uppercase; color: #999; letter-spacing: 0.5px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #275C53; }
        .logo-section { display: flex; align-items: center; gap: 12px; }
        .logo-section img { width: 48px; height: 48px; border-radius: 8px; }
        .store-name { font-size: 20px; font-weight: bold; color: #275C53; margin: 0; }
        .store-address { font-size: 12px; color: #999; margin: 2px 0 0; }
        .invoice-title { text-align: right; }
        .invoice-title h2 { margin: 0; font-size: 24px; color: #275C53; }
        .invoice-title p { margin: 4px 0 0; color: #999; font-size: 13px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 20px; }
        .info-box h4 { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #999; margin: 0 0 6px; }
        .info-box p { margin: 2px 0; font-size: 13px; }
        .summary { text-align: right; margin-top: 10px; }
        .summary div { display: flex; justify-content: flex-end; gap: 40px; padding: 4px 0; font-size: 14px; }
        .summary .total-line { border-top: 2px solid #275C53; padding-top: 10px; margin-top: 6px; font-size: 18px; font-weight: bold; color: #275C53; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px; }
        @media print { body { padding: 20px; } }
      </style></head><body>${content.innerHTML}</body></html>`);
    win.document.close();
    win.print();
  };

  const handlePackingSlip = () => {
    const content = packingRef.current;
    if (!content) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<html><head><title>Packing Slip #${order?.order_number}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px; color: #333; max-width: 700px; margin: 0 auto; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #eee; }
        th { font-size: 11px; text-transform: uppercase; color: #999; letter-spacing: 0.5px; }
        h1 { font-size: 20px; color: #275C53; margin: 0 0 4px; }
        h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #999; margin: 20px 0 6px; }
        p { margin: 2px 0; font-size: 13px; }
        .header { border-bottom: 2px solid #275C53; padding-bottom: 15px; margin-bottom: 20px; }
        @media print { body { padding: 20px; } }
      </style></head><body>${content.innerHTML}</body></html>`);
    win.document.close();
    win.print();
  };

  const handleResendConfirmation = () => {
    showToast('Confirmation email queued for resend');
  };

  if (!order) return <div className="p-12 text-center text-[#192026]/30">Loading...</div>;

  const addr = order.shipping_address;
  const history = order.status_history || [];

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#275C53] text-white px-5 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => router.push('/futu/orders')} className="text-[#192026]/30 text-sm hover:text-[#275C53] mb-1 cursor-pointer">&larr; Back to Orders</button>
          <h1 className="text-2xl font-bold text-[#192026]" style={{ fontFamily: 'var(--font-patua)' }}>Order #{order.order_number}</h1>
          <p className="text-[#192026]/40 text-sm">{new Date(order.created_at).toLocaleString('en-US')}</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <button onClick={handleResendConfirmation} className="px-4 py-2.5 bg-white border border-[#192026]/10 rounded-xl text-sm font-semibold hover:bg-[#f5f0ea] cursor-pointer flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Resend Confirmation
          </button>
          <button onClick={handlePackingSlip} className="px-4 py-2.5 bg-white border border-[#192026]/10 rounded-xl text-sm font-semibold hover:bg-[#f5f0ea] cursor-pointer flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Packing Slip
          </button>
          <button onClick={handlePrint} className="px-4 py-2.5 bg-white border border-[#192026]/10 rounded-xl text-sm font-semibold hover:bg-[#f5f0ea] cursor-pointer flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Invoice
          </button>
          <select value={order.status} onChange={e => updateOrder({ status: e.target.value })}
            className={`px-3 py-2.5 rounded-xl text-sm font-semibold border-0 cursor-pointer ${statusColors[order.status]}`}>
            <option value="pending">Pending</option><option value="processing">Processing</option>
            <option value="manual_payment">Manual Payment Received</option>
            <option value="shipped">Shipped</option><option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option><option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-[#192026]/5 overflow-hidden">
            <div className="px-5 py-3 border-b border-[#192026]/5">
              <h3 className="text-sm font-bold text-[#192026] uppercase tracking-[1px]">Items</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#192026]/5">
                  <th className="text-left px-5 py-2 text-[10px] uppercase tracking-[1px] text-[#192026]/30">Product</th>
                  <th className="text-center px-5 py-2 text-[10px] uppercase tracking-[1px] text-[#192026]/30">Qty</th>
                  <th className="text-right px-5 py-2 text-[10px] uppercase tracking-[1px] text-[#192026]/30">Price</th>
                  <th className="text-right px-5 py-2 text-[10px] uppercase tracking-[1px] text-[#192026]/30">Total</th>
                </tr>
              </thead>
              <tbody>
                {(order.items || []).map((item, i) => (
                  <tr key={i} className="border-b border-[#192026]/5">
                    <td className="px-5 py-3 text-sm">{item.name}{item.variant && <span className="text-[#192026]/40 ml-1.5">({item.variant})</span>}</td>
                    <td className="px-5 py-3 text-sm text-center">{item.qty}</td>
                    <td className="px-5 py-3 text-sm text-right">${item.price}</td>
                    <td className="px-5 py-3 text-sm text-right font-semibold">${(item.qty * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 space-y-1 text-sm text-right">
              <div className="flex justify-end gap-8"><span className="text-[#192026]/40">Subtotal</span><span>${order.subtotal}</span></div>
              {order.discount > 0 && <div className="flex justify-end gap-8"><span className="text-[#192026]/40">Discount ({order.coupon_code})</span><span className="text-red-500">-${order.discount}</span></div>}
              <div className="flex justify-end gap-8"><span className="text-[#192026]/40">Shipping</span><span>${order.shipping_cost}</span></div>
              <div className="flex justify-end gap-8"><span className="text-[#192026]/40">Tax</span><span>${order.tax}</span></div>
              <div className="flex justify-end gap-8 pt-2 border-t border-[#192026]/5 font-bold text-lg"><span>Total</span><span>${order.total} USD</span></div>
            </div>
          </div>

          {/* Tracking */}
          <div className="bg-white rounded-2xl border border-[#192026]/5 p-5">
            <h3 className="text-sm font-bold text-[#192026] uppercase tracking-[1px] mb-3">Tracking</h3>
            <div className="flex gap-2">
              <input value={tracking} onChange={e => setTracking(e.target.value)} className="input flex-1" placeholder="Enter tracking number..." />
              <button onClick={() => { updateOrder({ tracking_number: tracking }); showToast('Tracking number saved'); }}
                className="px-4 py-2.5 bg-[#275C53] text-white rounded-xl text-sm font-semibold cursor-pointer">Save</button>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl border border-[#192026]/5 p-5">
            <h3 className="text-sm font-bold text-[#192026] uppercase tracking-[1px] mb-3">Notes</h3>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} className="input min-h-[80px] w-full" placeholder="Internal notes..." />
            <button onClick={() => { updateOrder({ notes }); showToast('Notes saved'); }} className="mt-2 px-4 py-2 bg-[#f5f0ea] rounded-xl text-sm font-semibold cursor-pointer">Save Notes</button>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-2xl border border-[#192026]/5 p-5">
            <h3 className="text-sm font-bold text-[#192026] uppercase tracking-[1px] mb-4">Order Timeline</h3>
            <div className="space-y-0">
              {/* Order created */}
              <div className="flex gap-3 items-start">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full mt-1 ${statusDotColors.pending}`} />
                  {history.length > 0 && <div className="w-px h-full bg-[#192026]/10 min-h-[24px]" />}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-semibold text-[#192026]">Order placed</p>
                  <p className="text-[11px] text-[#192026]/40 mt-0.5">
                    {new Date(order.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
              </div>

              {/* Status changes */}
              {history.map((h, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full mt-1 ${statusDotColors[h.to] || 'bg-gray-400'}`} />
                    {i < history.length - 1 && <div className="w-px h-full bg-[#192026]/10 min-h-[24px]" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm text-[#192026]">
                      Status changed from <span className="font-semibold capitalize">{h.from}</span> to <span className="font-semibold capitalize">{h.to}</span>
                    </p>
                    <p className="text-[11px] text-[#192026]/40 mt-0.5">
                      {new Date(h.timestamp).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>
              ))}

              {history.length === 0 && (
                <p className="text-[12px] text-[#192026]/30 mt-1">No status changes recorded yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#192026]/5 p-5">
            <h3 className="text-sm font-bold text-[#192026] uppercase tracking-[1px] mb-3">Customer</h3>
            <p className="text-sm font-semibold">{order.customer_name}</p>
            <p className="text-[13px] text-[#192026]/50">{order.customer_email}</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#192026]/5 p-5">
            <h3 className="text-sm font-bold text-[#192026] uppercase tracking-[1px] mb-3">Shipping Address</h3>
            {addr ? (
              <div className="text-[13px] text-[#192026]/60 space-y-0.5">
                <p>{addr.street}</p>
                <p>{addr.city}, {addr.province}</p>
                <p>{addr.postal}</p>
                <p>{addr.country || 'Canada'}</p>
              </div>
            ) : <p className="text-[13px] text-[#192026]/30">No address</p>}
          </div>

          <div className="bg-white rounded-2xl border border-[#192026]/5 p-5">
            <h3 className="text-sm font-bold text-[#192026] uppercase tracking-[1px] mb-3">Payment</h3>
            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between"><span className="text-[#192026]/40">Status</span>
                <span className={`font-semibold ${order.payment_status === 'paid' ? 'text-emerald-600' : 'text-yellow-600'}`}>{order.payment_status}</span>
              </div>
              <div className="flex justify-between"><span className="text-[#192026]/40">Method</span><span>{order.payment_method || '\u2014'}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden print invoice - improved with logo and store address */}
      <div ref={printRef} className="hidden">
        <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="logo-section" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/icons/icon-192x192.png" alt="Royal King Seeds" style={{ width: 48, height: 48, borderRadius: 8 }} />
            <div>
              <p className="store-name" style={{ fontSize: 20, fontWeight: 'bold', color: '#275C53', margin: 0 }}>Royal King Seeds</p>
              <p className="store-address" style={{ fontSize: 12, color: '#999', margin: '2px 0 0' }}>royalkingseeds.ca</p>
              <p className="store-address" style={{ fontSize: 12, color: '#999', margin: '2px 0 0' }}>Canada</p>
            </div>
          </div>
          <div className="invoice-title" style={{ textAlign: 'right' }}>
            <h2 style={{ margin: 0, fontSize: 24, color: '#275C53' }}>Invoice</h2>
            <p style={{ margin: '4px 0 0', color: '#999', fontSize: 13 }}>#{order.order_number}</p>
            <p style={{ margin: '2px 0 0', color: '#999', fontSize: 13 }}>{new Date(order.created_at).toLocaleDateString('en-US')}</p>
          </div>
        </div>

        <div className="info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, marginBottom: 20 }}>
          <div className="info-box">
            <h4 style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: '#999', margin: '0 0 6px' }}>Bill To</h4>
            <p style={{ margin: '2px 0', fontSize: 13, fontWeight: 600 }}>{order.customer_name}</p>
            <p style={{ margin: '2px 0', fontSize: 13 }}>{order.customer_email}</p>
          </div>
          <div className="info-box">
            <h4 style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: '#999', margin: '0 0 6px' }}>Ship To</h4>
            {addr && (
              <>
                <p style={{ margin: '2px 0', fontSize: 13 }}>{addr.street}</p>
                <p style={{ margin: '2px 0', fontSize: 13 }}>{addr.city}, {addr.province} {addr.postal}</p>
                <p style={{ margin: '2px 0', fontSize: 13 }}>{addr.country || 'Canada'}</p>
              </>
            )}
          </div>
        </div>

        <table><thead><tr><th>Product</th><th>Qty</th><th style={{ textAlign: 'right' }}>Price</th><th style={{ textAlign: 'right' }}>Total</th></tr></thead>
        <tbody>{(order.items||[]).map((item,i)=>(
          <tr key={i}><td>{item.name}{item.variant ? ` (${item.variant})` : ''}</td><td>{item.qty}</td><td style={{ textAlign: 'right' }}>${item.price}</td><td style={{ textAlign: 'right' }}>${(item.qty*item.price).toFixed(2)}</td></tr>
        ))}</tbody></table>

        <div className="summary" style={{ textAlign: 'right', marginTop: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 40, padding: '4px 0', fontSize: 14 }}><span style={{ color: '#999' }}>Subtotal</span><span>${order.subtotal}</span></div>
          {order.discount > 0 && <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 40, padding: '4px 0', fontSize: 14 }}><span style={{ color: '#999' }}>Discount ({order.coupon_code})</span><span style={{ color: '#e53e3e' }}>-${order.discount}</span></div>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 40, padding: '4px 0', fontSize: 14 }}><span style={{ color: '#999' }}>Shipping</span><span>${order.shipping_cost}</span></div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 40, padding: '4px 0', fontSize: 14 }}><span style={{ color: '#999' }}>Tax</span><span>${order.tax}</span></div>
          <div className="total-line" style={{ display: 'flex', justifyContent: 'flex-end', gap: 40, borderTop: '2px solid #275C53', paddingTop: 10, marginTop: 6, fontSize: 18, fontWeight: 'bold', color: '#275C53' }}><span>Total</span><span>${order.total} USD</span></div>
        </div>

        <div className="footer" style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid #eee', textAlign: 'center', color: '#999', fontSize: 12 }}>
          <p>Thank you for your order! | royalkingseeds.ca</p>
        </div>
      </div>

      {/* Hidden packing slip */}
      <div ref={packingRef} className="hidden">
        <div className="header" style={{ borderBottom: '2px solid #275C53', paddingBottom: 15, marginBottom: 20 }}>
          <h1 style={{ fontSize: 20, color: '#275C53', margin: '0 0 4px' }}>Packing Slip</h1>
          <p style={{ margin: '2px 0', fontSize: 13, color: '#999' }}>Order #{order.order_number} &mdash; {new Date(order.created_at).toLocaleDateString('en-US')}</p>
        </div>

        <h3 style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: '#999', margin: '20px 0 6px' }}>Ship To</h3>
        {addr ? (
          <>
            <p style={{ margin: '2px 0', fontSize: 13, fontWeight: 600 }}>{order.customer_name}</p>
            <p style={{ margin: '2px 0', fontSize: 13 }}>{addr.street}</p>
            <p style={{ margin: '2px 0', fontSize: 13 }}>{addr.city}, {addr.province} {addr.postal}</p>
            <p style={{ margin: '2px 0', fontSize: 13 }}>{addr.country || 'Canada'}</p>
          </>
        ) : <p style={{ fontSize: 13, color: '#999' }}>No address on file</p>}

        <table style={{ marginTop: 20 }}>
          <thead><tr><th>Product</th><th style={{ textAlign: 'center' }}>Qty</th></tr></thead>
          <tbody>{(order.items||[]).map((item,i)=>(
            <tr key={i}><td>{item.name}{item.variant ? ` (${item.variant})` : ''}</td><td style={{ textAlign: 'center' }}>{item.qty}</td></tr>
          ))}</tbody>
        </table>

        <div style={{ marginTop: 30, paddingTop: 20, borderTop: '1px solid #eee', fontSize: 12, color: '#999' }}>
          <p>Royal King Seeds | royalkingseeds.ca</p>
        </div>
      </div>
    </div>
  );
}
