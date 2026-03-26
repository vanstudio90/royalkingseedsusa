'use client';

import { Fragment, useEffect, useState, useCallback } from 'react';
import { adminFetch } from '@/lib/admin-fetch';

interface CartItem {
  name?: string;
  product_name?: string;
  title?: string;
  quantity?: number;
  qty?: number;
  price?: number;
  unit_price?: number;
}

interface AbandonedCart {
  id: number;
  customer_email: string | null;
  customer_name: string | null;
  items: CartItem[] | null;
  items_count?: number;
  subtotal: number;
  created_at: string;
  recovery_email_sent: boolean;
  recovered: boolean;
}

export default function AdminAbandonedCartsPage() {
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCart, setExpandedCart] = useState<number | null>(null);
  const [sendingEmail, setSendingEmail] = useState<number | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchCarts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (dateFrom) params.set('from', dateFrom);
    if (dateTo) params.set('to', dateTo);
    const qs = params.toString();
    const res = await adminFetch(`/api/admin/abandoned-carts${qs ? `?${qs}` : ''}`);
    const data = await res.json();
    setCarts(data.carts || []);
    setLoading(false);
  }, [dateFrom, dateTo]);

  useEffect(() => {
    fetchCarts();
  }, [fetchCarts]);

  const sendRecoveryEmail = async (id: number) => {
    setSendingEmail(id);
    await adminFetch(`/api/admin/abandoned-carts`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, recovery_email_sent: true }),
    });
    setSendingEmail(null);
    fetchCarts();
  };

  const getItemName = (item: CartItem) => item.name || item.product_name || item.title || 'Unknown Product';
  const getItemQty = (item: CartItem) => item.quantity || item.qty || 1;
  const getItemPrice = (item: CartItem) => item.price || item.unit_price || 0;
  const getItemsCount = (cart: AbandonedCart) => {
    if (Array.isArray(cart.items) && cart.items.length > 0) return cart.items.length;
    return cart.items_count || 0;
  };

  const totalValue = carts.reduce((sum, c) => sum + (Number(c.subtotal) || 0), 0);
  const recoveredCount = carts.filter((c) => c.recovered).length;
  const recoveryRate = carts.length > 0 ? ((recoveredCount / carts.length) * 100) : 0;
  const emailSentCount = carts.filter((c) => c.recovery_email_sent).length;
  const pendingRecovery = carts.filter((c) => !c.recovered && !c.recovery_email_sent && c.customer_email).length;

  const clearFilters = () => {
    setDateFrom('');
    setDateTo('');
  };

  const timeSince = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    const mins = Math.floor(diff / (1000 * 60));
    return `${mins}m ago`;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#192026]" style={{ fontFamily: 'var(--font-patua)' }}>Abandoned Carts</h1>
        <p className="text-[#192026]/40 text-sm mt-1">Track and recover lost sales</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-4">
          <p className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Total Carts</p>
          <p className="text-2xl font-bold text-[#192026] mt-1">{carts.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-4">
          <p className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Total Value</p>
          <p className="text-2xl font-bold text-[#275C53] mt-1">${totalValue.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-4">
          <p className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Recovery Rate</p>
          <p className="text-2xl font-bold text-[#D7B65D] mt-1">{recoveryRate.toFixed(1)}%</p>
          <p className="text-[11px] text-[#192026]/30 mt-0.5">{recoveredCount} recovered</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-4">
          <p className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Emails Sent</p>
          <p className="text-2xl font-bold text-[#192026] mt-1">{emailSentCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-4">
          <p className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Pending Recovery</p>
          <p className="text-2xl font-bold text-orange-500 mt-1">{pendingRecovery}</p>
          <p className="text-[11px] text-[#192026]/30 mt-0.5">have email, no outreach</p>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-2xl border border-[#192026]/5 p-4 mb-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold block mb-1.5">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="input !py-2 !text-sm"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold block mb-1.5">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="input !py-2 !text-sm"
          />
        </div>
        {(dateFrom || dateTo) && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-sm text-[#192026]/40 hover:text-[#192026]/60 transition-colors cursor-pointer"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#192026]/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#192026]/30 text-sm">Loading abandoned carts...</div>
        ) : carts.length === 0 ? (
          <div className="p-12 text-center text-[#192026]/30 text-sm">No abandoned carts found</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#192026]/5">
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold w-8"></th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Customer</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Products</th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Cart Value</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Abandoned</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Status</th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {carts.map((c) => {
                const items = Array.isArray(c.items) ? c.items : [];
                const isExpanded = expandedCart === c.id;
                const cartValue = Number(c.subtotal) || 0;

                return (
                  <Fragment key={c.id}>
                    <tr className="border-b border-[#192026]/5 hover:bg-[#F5F0EA]/50 transition-colors">
                      {/* Expand toggle */}
                      <td className="px-4 py-3">
                        {items.length > 0 && (
                          <button
                            onClick={() => setExpandedCart(isExpanded ? null : c.id)}
                            className="text-[#192026]/30 hover:text-[#275C53] transition-colors cursor-pointer text-sm"
                          >
                            {isExpanded ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                            )}
                          </button>
                        )}
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3">
                        <div className="text-sm text-[#192026]">{c.customer_email || 'Guest'}</div>
                        {c.customer_name && <div className="text-[11px] text-[#192026]/30">{c.customer_name}</div>}
                      </td>

                      {/* Products summary */}
                      <td className="px-4 py-3">
                        <span className="text-sm text-[#192026]/60">
                          {getItemsCount(c)} {getItemsCount(c) === 1 ? 'item' : 'items'}
                        </span>
                        {items.length > 0 && (
                          <div className="text-[11px] text-[#192026]/30 truncate max-w-[200px]">
                            {items.map(i => getItemName(i)).join(', ')}
                          </div>
                        )}
                      </td>

                      {/* Cart Value (prominent) */}
                      <td className="px-4 py-3 text-right">
                        <span className="text-base font-bold text-[#275C53]">${cartValue.toFixed(2)}</span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3">
                        <div className="text-sm text-[#192026]/60">{timeSince(c.created_at)}</div>
                        <div className="text-[11px] text-[#192026]/30">{new Date(c.created_at).toLocaleDateString()}</div>
                      </td>

                      {/* Status badges */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          {c.recovered ? (
                            <span className="text-[10px] uppercase tracking-[1px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 w-fit">
                              Recovered
                            </span>
                          ) : c.recovery_email_sent ? (
                            <span className="text-[10px] uppercase tracking-[1px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 w-fit">
                              Email Sent
                            </span>
                          ) : (
                            <span className="text-[10px] uppercase tracking-[1px] font-semibold px-2.5 py-1 rounded-full bg-orange-50 text-orange-500 w-fit">
                              Abandoned
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        {!c.recovery_email_sent && c.customer_email && !c.recovered && (
                          <button
                            onClick={() => sendRecoveryEmail(c.id)}
                            disabled={sendingEmail === c.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#275C53] text-white rounded-lg text-[11px] font-semibold hover:bg-[#1e4a42] transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                            {sendingEmail === c.id ? 'Sending...' : 'Send Recovery Email'}
                          </button>
                        )}
                        {c.recovery_email_sent && !c.recovered && (
                          <span className="text-[11px] text-[#192026]/30">Email sent</span>
                        )}
                      </td>
                    </tr>

                    {/* Expanded product details */}
                    {isExpanded && items.length > 0 && (
                      <tr className="border-b border-[#192026]/5">
                        <td colSpan={7} className="px-4 py-0">
                          <div className="bg-[#F5F0EA]/40 rounded-xl p-4 my-2 ml-8">
                            <p className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-2">Products in Cart</p>
                            <div className="space-y-2">
                              {items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-[#275C53]/10 text-[#275C53] text-[11px] font-bold flex items-center justify-center">
                                      {getItemQty(item)}
                                    </span>
                                    <span className="text-[#192026]/70">{getItemName(item)}</span>
                                  </div>
                                  <span className="font-medium text-[#275C53]">
                                    ${(getItemPrice(item) * getItemQty(item)).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 pt-2 border-t border-[#192026]/5 flex justify-between text-sm">
                              <span className="font-semibold text-[#192026]/50">Cart Total</span>
                              <span className="font-bold text-[#275C53]">${cartValue.toFixed(2)}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

