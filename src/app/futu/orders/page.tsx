'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
  items: { name: string; qty: number; price: number }[];
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-600',
  processing: 'bg-blue-50 text-blue-600',
  shipped: 'bg-purple-50 text-purple-600',
  completed: 'bg-emerald-50 text-emerald-600',
  cancelled: 'bg-red-50 text-red-500',
  refunded: 'bg-gray-50 text-gray-500',
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
    const res = await fetch(`/api/admin/orders?${params}`);
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
    await fetch(`/api/futu/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  const exportCSV = async () => {
    const params = new URLSearchParams({ status: statusFilter, export: 'csv' });
    if (search) params.set('search', search);
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);
    const res = await fetch(`/api/admin/orders?${params}`);
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

  const statuses = ['all', 'pending', 'processing', 'shipped', 'completed', 'cancelled'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#192026]" style={{ fontFamily: 'var(--font-patua)' }}>Orders</h1>
          <p className="text-[#192026]/40 text-sm mt-1">{total} total orders</p>
        </div>
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
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#192026]/10 text-sm focus:outline-none focus:border-[#275C53] transition-colors bg-[#f5f0ea]/30"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-1.5">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#192026]/10 text-sm focus:outline-none focus:border-[#275C53] transition-colors bg-[#f5f0ea]/30"
          />
        </div>
        {(search || dateFrom || dateTo) && (
          <button
            onClick={() => { setSearch(''); setDateFrom(''); setDateTo(''); }}
            className="px-3 py-2 rounded-lg text-[11px] font-semibold text-[#192026]/40 hover:text-red-500 transition-colors cursor-pointer"
          >
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
                ? 'bg-[#275C53] text-white'
                : 'bg-[#f5f0ea] text-[#192026]/40 hover:text-[#192026]/70'
            }`}
          >
            {s}
            {statusCounts[s] !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                statusFilter === s ? 'bg-white/20 text-white' : 'bg-[#192026]/5 text-[#192026]/30'
              }`}>
                {statusCounts[s]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#192026]/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#192026]/30 text-sm">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[#192026]/30 text-sm mb-2">No orders found</p>
            <p className="text-[#192026]/20 text-[12px]">
              {search || dateFrom || dateTo ? 'Try adjusting your filters' : 'Orders will appear here when customers place them'}
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
                <tr key={o.id} className="border-b border-[#192026]/5 hover:bg-[#f5f0ea]/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono font-semibold text-[#275C53]">#{o.order_number}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-[#192026]">{o.customer_name}</div>
                    <div className="text-[11px] text-[#192026]/30">{o.customer_email}</div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#192026]">${o.total}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] uppercase tracking-[1px] font-semibold px-2 py-1 rounded-full ${
                      o.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {o.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className={`text-[11px] uppercase tracking-[1px] font-semibold px-2.5 py-1.5 rounded-lg border-0 cursor-pointer ${statusColors[o.status] || 'bg-gray-50'}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#192026]/30">
                    {new Date(o.created_at).toLocaleDateString('en-US')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => router.push(`/futu/orders/${o.id}`)} className="px-3 py-1.5 bg-[#f5f0ea] rounded-lg text-[11px] font-semibold text-[#192026]/50 hover:text-[#275C53] transition-colors cursor-pointer">
                      View
                    </button>
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
