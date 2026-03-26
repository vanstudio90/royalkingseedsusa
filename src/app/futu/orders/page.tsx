'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminFetch } from '@/lib/admin-fetch';

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  items: { name: string; qty: number; price: number }[];
  notes?: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-600',
  processing: 'bg-blue-50 text-blue-600',
  manual_payment: 'bg-teal-50 text-teal-600',
  shipped: 'bg-purple-50 text-purple-600',
  completed: 'bg-emerald-50 text-emerald-600',
  cancelled: 'bg-red-50 text-red-500',
  refunded: 'bg-gray-50 text-gray-500',
  trashed: 'bg-gray-100 text-gray-400',
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ status: statusFilter });
    if (search) params.set('search', search);
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);
    const res = await adminFetch(`/api/admin/orders?${params}`);
    const data = await res.json();
    setOrders(data.orders || []);
    setTotal(data.total || 0);
    setStatusCounts(data.statusCounts || {});
    setLoading(false);
  }, [statusFilter, search, dateFrom, dateTo]);

  useEffect(() => {
    const timeout = setTimeout(fetchOrders, search ? 300 : 0);
    return () => clearTimeout(timeout);
  }, [fetchOrders, search]);

  const updateStatus = async (id: number, status: string) => {
    await adminFetch(`/api/admin/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  const moveToTrash = async (id: number, orderNumber: string) => {
    if (!confirm(`Move order #${orderNumber} to trash?`)) return;
    await updateStatus(id, 'trashed');
  };

  const restoreOrder = async (id: number) => {
    await updateStatus(id, 'cancelled');
  };

  const emptyTrash = async () => {
    if (!confirm('Archive all orders in trash older than 30 days? Orders are moved to the archive and will no longer appear here.')) return;
    await adminFetch('/api/admin/orders/empty-trash', { method: 'POST' });
    fetchOrders();
  };

  const exportCSV = async () => {
    const params = new URLSearchParams({ status: statusFilter, export: 'csv' });
    if (search) params.set('search', search);
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);
    const res = await adminFetch(`/api/admin/orders?${params}`);
    const data = await res.json();
    const rows = data.orders || [];

    const headers = ['Order Number', 'Customer Name', 'Email', 'Total', 'Status', 'Payment', 'Date', 'Items'];
    const csvRows = [
      headers.join(','),
      ...rows.map((o: Order) => [
        o.order_number,
        `"${(o.customer_name || '').replace(/"/g, '""')}"`,
        o.customer_email,
        o.total,
        o.status,
        o.payment_status,
        new Date(o.created_at).toLocaleDateString('en-US'),
        `"${(o.items || []).map(i => `${i.name} x${i.qty}`).join('; ')}"`,
      ].join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statuses = ['all', 'pending', 'processing', 'manual_payment', 'shipped', 'completed', 'cancelled', 'trashed'];
  const isTrashView = statusFilter === 'trashed';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#192026]" style={{ fontFamily: 'var(--font-patua)' }}>
            {isTrashView ? 'Trash' : 'Orders'}
          </h1>
          <p className="text-[#192026]/40 text-sm mt-1">{total} {isTrashView ? 'trashed' : 'total'} orders</p>
        </div>
        <div className="flex gap-2">
          {isTrashView && (statusCounts.trashed || 0) > 0 && (
            <button
              onClick={emptyTrash}
              className="px-4 py-2.5 bg-red-50 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors cursor-pointer flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Empty Trash (30+ days)
            </button>
          )}
          <button
            onClick={exportCSV}
            className="px-4 py-2.5 bg-[#275C53] text-white rounded-xl text-sm font-semibold hover:bg-[#275C53]/90 transition-colors cursor-pointer flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Search & Date Filters */}
      <div className="bg-white rounded-2xl border border-[#192026]/5 p-4 mb-4 flex items-end gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-1.5">Search</label>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Order number or customer name..."
            className="w-full px-3 py-2 rounded-lg border border-[#192026]/10 text-sm focus:outline-none focus:border-[#275C53] transition-colors bg-[#f5f0ea]/30"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-1.5">From</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="px-3 py-2 rounded-lg border border-[#192026]/10 text-sm focus:outline-none focus:border-[#275C53] transition-colors bg-[#f5f0ea]/30" />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-1.5">To</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="px-3 py-2 rounded-lg border border-[#192026]/10 text-sm focus:outline-none focus:border-[#275C53] transition-colors bg-[#f5f0ea]/30" />
        </div>
        {(search || dateFrom || dateTo) && (
          <button onClick={() => { setSearch(''); setDateFrom(''); setDateTo(''); }} className="px-3 py-2 rounded-lg text-[11px] font-semibold text-[#192026]/40 hover:text-red-500 transition-colors cursor-pointer">
            Clear Filters
          </button>
        )}
      </div>

      {/* Status Filters */}
      <div className="bg-white rounded-2xl border border-[#192026]/5 p-4 mb-4 flex items-center gap-2 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-2 rounded-lg text-[11px] uppercase tracking-[1px] font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              statusFilter === s
                ? s === 'trashed' ? 'bg-gray-600 text-white' : 'bg-[#275C53] text-white'
                : 'bg-[#f5f0ea] text-[#192026]/40 hover:text-[#192026]/70'
            }`}
          >
            {s === 'trashed' ? '🗑 Trash' : s}
            {statusCounts[s] !== undefined && statusCounts[s] > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                statusFilter === s ? 'bg-white/20 text-white' : 'bg-[#192026]/5 text-[#192026]/30'
              }`}>
                {statusCounts[s]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Trash notice */}
      {isTrashView && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4 text-[12px] text-orange-700">
          Orders in trash are archived after 30 days. Archived orders are never deleted and can be retrieved from the database. Use &quot;Empty Trash&quot; to archive orders older than 30 days now, or restore individual orders.
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#192026]/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#192026]/30 text-sm">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[#192026]/30 text-sm mb-2">{isTrashView ? 'Trash is empty' : 'No orders found'}</p>
            <p className="text-[#192026]/20 text-[12px]">
              {isTrashView ? 'No orders have been moved to trash' : search || dateFrom || dateTo ? 'Try adjusting your filters' : 'Orders will appear here when customers place them'}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#192026]/5">
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Order</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Customer</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Total</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Payment</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Status</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Date</th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className={`border-b border-[#192026]/5 hover:bg-[#f5f0ea]/50 transition-colors ${isTrashView ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3 text-sm font-mono font-semibold text-[#275C53]">#{o.order_number}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-[#192026]">{o.customer_name}</div>
                    <div className="text-[11px] text-[#192026]/30">{o.customer_email}</div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#192026]">${o.total}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] uppercase tracking-[1px] font-semibold px-2 py-1 rounded-full ${
                      o.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-600'
                      : (o.notes || '').includes('[DECLINED:') ? 'bg-red-100 text-red-700'
                      : (o.notes || '').includes('[FAILED:') ? 'bg-orange-100 text-orange-700'
                      : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {(o.notes || '').includes('[DECLINED:') ? 'DECLINED'
                       : (o.notes || '').includes('[FAILED:') ? 'FAILED'
                       : o.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {isTrashView ? (
                      <span className="text-[11px] uppercase tracking-[1px] font-semibold px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-400">Trashed</span>
                    ) : (
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className={`text-[11px] uppercase tracking-[1px] font-semibold px-2.5 py-1.5 rounded-lg border-0 cursor-pointer ${statusColors[o.status] || 'bg-gray-50'}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="manual_payment">Manual Payment Received</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#192026]/30">
                    <div>{new Date(o.created_at).toLocaleDateString('en-US')}</div>
                    <div className="text-[10px] text-[#192026]/20">{new Date(o.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/futu/orders/${o.id}`} className="px-3 py-1.5 bg-[#f5f0ea] rounded-lg text-[11px] font-semibold text-[#192026]/50 hover:text-[#275C53] transition-colors cursor-pointer">
                        View
                      </Link>
                      {isTrashView ? (
                        <button
                          onClick={() => restoreOrder(o.id)}
                          className="px-3 py-1.5 bg-emerald-50 rounded-lg text-[11px] font-semibold text-emerald-500 hover:text-emerald-700 transition-colors cursor-pointer"
                        >
                          Restore
                        </button>
                      ) : (
                        <button
                          onClick={() => moveToTrash(o.id, o.order_number)}
                          className="px-3 py-1.5 bg-red-50 rounded-lg text-[11px] font-semibold text-red-300 hover:text-red-500 transition-colors cursor-pointer"
                          title="Move to trash"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
