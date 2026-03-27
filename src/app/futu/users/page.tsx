'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminFetch } from '@/lib/admin-fetch';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  orders: number;
  totalSpent: number;
  createdAt: string;
}

interface Stats {
  totalOrdered: number;
  totalNoOrder: number;
  totalAll: number;
}

type Tab = 'ordered' | 'no-order';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({ totalOrdered: 0, totalNoOrder: 0, totalAll: 0 });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('ordered');
  const [search, setSearch] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('tab', tab === 'ordered' ? 'ordered' : 'no-order');
    if (search) params.set('search', search);
    const res = await adminFetch(`/api/admin/users?${params}`);
    const data = await res.json();
    setUsers(data.users || []);
    setStats(data.stats || { totalOrdered: 0, totalNoOrder: 0, totalAll: 0 });
    setLoading(false);
  }, [tab, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#192026]" style={{ fontFamily: 'var(--font-patua)' }}>Users</h1>
        <p className="text-[#192026]/40 text-sm mt-1">All registered users — customers who ordered and those who haven&apos;t</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-5">
          <div className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-1">Total Users</div>
          <div className="text-2xl font-bold text-[#192026]">{stats.totalAll}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-5">
          <div className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-1">Ordered</div>
          <div className="text-2xl font-bold text-[#275C53]">{stats.totalOrdered}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-5">
          <div className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-1">Didn&apos;t Order</div>
          <div className="text-2xl font-bold text-[#D7B65D]">{stats.totalNoOrder}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-white rounded-2xl border border-[#192026]/5 p-1 w-fit">
        <button
          onClick={() => setTab('ordered')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
            tab === 'ordered' ? 'bg-[#275C53] text-white' : 'text-[#192026]/40 hover:text-[#192026]/60'
          }`}
        >
          Ordered ({stats.totalOrdered})
        </button>
        <button
          onClick={() => setTab('no-order')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
            tab === 'no-order' ? 'bg-[#D7B65D] text-white' : 'text-[#192026]/40 hover:text-[#192026]/60'
          }`}
        >
          Didn&apos;t Order ({stats.totalNoOrder})
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-[#192026]/5 p-4 mb-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="input flex-1"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#275C53] text-white rounded-xl text-sm font-semibold hover:bg-[#1e4a42] transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#192026]/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#192026]/30 text-sm">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-[#192026]/30 text-sm">
            {tab === 'ordered' ? 'No customers with orders found' : 'No users without orders found'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#192026]/5">
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Full Name</th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Email</th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Shipping Address</th>
                  {tab === 'ordered' && (
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Orders</th>
                  )}
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-[#192026]/5 hover:bg-[#f5f0ea]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-[#192026]">{u.name || '(No name)'}</div>
                      {u.phone && <div className="text-[11px] text-[#192026]/30">{u.phone}</div>}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#192026]/60">{u.email}</td>
                    <td className="px-4 py-3 text-sm text-[#192026]/60 max-w-[250px]">{u.address}</td>
                    {tab === 'ordered' && (
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-[#275C53]">{u.orders}</span>
                          <span className="text-[11px] text-[#192026]/30">(${u.totalSpent.toFixed(2)})</span>
                        </span>
                      </td>
                    )}
                    <td className="px-4 py-3 text-sm text-[#192026]/40">{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
