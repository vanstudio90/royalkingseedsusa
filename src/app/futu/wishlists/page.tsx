'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin-fetch';

interface WishlistItem {
  id: number;
  customer_email: string | null;
  session_id: string | null;
  product_name: string;
  created_at: string;
}

interface WishlistStats {
  total_items: number;
  unique_sessions: number;
  most_wishlisted: string | null;
}

export default function AdminWishlistsPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [stats, setStats] = useState<WishlistStats>({ total_items: 0, unique_sessions: 0, most_wishlisted: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch('/api/admin/wishlists')
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items || []);
        setStats(data.stats || { total_items: 0, unique_sessions: 0, most_wishlisted: null });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#192026]" style={{ fontFamily: 'var(--font-patua)' }}>Wishlists</h1>
        <p className="text-[#192026]/40 text-sm mt-1">Customer wishlist activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-2xl">❤️</span>
            <span className="text-[10px] uppercase tracking-[1px] font-semibold text-[#192026]/30">Total Items</span>
          </div>
          <div className="text-2xl font-bold text-[#192026]">{stats.total_items}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-2xl">👤</span>
            <span className="text-[10px] uppercase tracking-[1px] font-semibold text-[#192026]/30">Unique Sessions</span>
          </div>
          <div className="text-2xl font-bold text-[#192026]">{stats.unique_sessions}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-2xl">🌟</span>
            <span className="text-[10px] uppercase tracking-[1px] font-semibold text-[#192026]/30">Most Wishlisted</span>
          </div>
          <div className="text-sm font-bold text-[#192026] truncate">{stats.most_wishlisted || '—'}</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#192026]/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#192026]/30 text-sm">Loading wishlists...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-[#192026]/30 text-sm">No wishlist items yet</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#192026]/5">
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Customer</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Product</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Date Added</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-[#192026]/5 hover:bg-[#f5f0ea]/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-[#192026]/60">
                    {item.customer_email || `Session: ${item.session_id?.slice(0, 8)}...`}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-[#192026]">{item.product_name}</td>
                  <td className="px-4 py-3 text-sm text-[#192026]/40">{new Date(item.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
