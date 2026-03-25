'use client';

import { useEffect, useState, useCallback } from 'react';

interface CustomerOrder {
  id: number;
  order_number: string;
  date: string;
  total: number;
  status: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  order_count: number;
  ltv: number;
  total_spent: number;
  created_at: string;
  last_order_date: string | null;
  city: string;
  province: string;
  notes: string | null;
  tags: string[];
  orders: CustomerOrder[];
  shipping_address: Record<string, string> | null;
}

interface Stats {
  totalCustomers: number;
  avgLTV: number;
  repeatRate: number;
  repeatCustomers: number;
}

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  'VIP': { bg: 'bg-amber-100', text: 'text-amber-800' },
  'Wholesale': { bg: 'bg-blue-100', text: 'text-blue-800' },
  'Repeat Buyer': { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  'First-time': { bg: 'bg-purple-100', text: 'text-purple-800' },
  'High Value': { bg: 'bg-rose-100', text: 'text-rose-800' },
  'At Risk': { bg: 'bg-orange-100', text: 'text-orange-800' },
  'Newsletter': { bg: 'bg-cyan-100', text: 'text-cyan-800' },
  'Influencer': { bg: 'bg-pink-100', text: 'text-pink-800' },
};

const AVAILABLE_TAGS = Object.keys(TAG_COLORS);

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-600',
};

type SortField = 'ltv' | 'order_count' | 'last_order_date' | 'created_at' | 'name';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<Stats>({ totalCustomers: 0, avgLTV: 0, repeatRate: 0, repeatCustomers: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortField>('ltv');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [editingNotes, setEditingNotes] = useState<Record<number, string>>({});
  const [savingNotes, setSavingNotes] = useState<number | null>(null);
  const [tagDropdownOpen, setTagDropdownOpen] = useState<number | null>(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    params.set('sortBy', sortBy === 'ltv' ? 'total_spent' : sortBy === 'order_count' ? 'total_orders' : sortBy);
    params.set('sortDir', sortDir);
    const res = await fetch(`/api/admin/customers?${params}`);
    const data = await res.json();
    setCustomers(data.customers || []);
    setStats(data.stats || { totalCustomers: 0, avgLTV: 0, repeatRate: 0, repeatCustomers: 0 });
    setLoading(false);
  }, [search, sortBy, sortDir]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
  };

  const sortArrow = (field: SortField) => {
    if (sortBy !== field) return <span className="ml-1 text-[#192026]/15">↕</span>;
    return <span className="ml-1 text-[#275C53]">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  const saveNotes = async (customerId: number) => {
    setSavingNotes(customerId);
    const noteText = editingNotes[customerId] ?? '';
    await fetch('/api/admin/customers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: customerId, notes: noteText }),
    });
    setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, notes: noteText } : c));
    setSavingNotes(null);
  };

  const toggleTag = async (customerId: number, tag: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    const currentTags = customer.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];

    // Optimistic update
    setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, tags: newTags } : c));

    await fetch('/api/admin/customers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: customerId, tags: newTags }),
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getLocation = (c: Customer) => {
    const parts = [];
    if (c.city) parts.push(c.city);
    if (c.province) parts.push(c.province);
    return parts.length > 0 ? parts.join(', ') : '—';
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#192026]" style={{ fontFamily: 'var(--font-patua)' }}>Customers</h1>
        <p className="text-[#192026]/40 text-sm mt-1">Manage your customer base</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-5">
          <div className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-1">Total Customers</div>
          <div className="text-2xl font-bold text-[#192026]">{stats.totalCustomers}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-5">
          <div className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-1">Average LTV</div>
          <div className="text-2xl font-bold text-[#275C53]">{formatCurrency(stats.avgLTV)}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-5">
          <div className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-1">Repeat Customers</div>
          <div className="text-2xl font-bold text-[#192026]">{stats.repeatCustomers}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-5">
          <div className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-1">Repeat Rate</div>
          <div className="text-2xl font-bold text-[#275C53]">{stats.repeatRate.toFixed(1)}%</div>
        </div>
      </div>

      {/* Search & Sort Controls */}
      <div className="bg-white rounded-2xl border border-[#192026]/5 p-4 mb-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="input flex-1"
          />
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortField)}
              className="px-3 py-2.5 border border-[#192026]/10 rounded-xl text-sm text-[#192026]/60 bg-white cursor-pointer"
            >
              <option value="ltv">Sort by LTV</option>
              <option value="order_count">Sort by Orders</option>
              <option value="last_order_date">Sort by Last Order</option>
              <option value="created_at">Sort by Join Date</option>
              <option value="name">Sort by Name</option>
            </select>
            <button
              type="button"
              onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2.5 border border-[#192026]/10 rounded-xl text-sm text-[#192026]/60 hover:bg-[#f5f0ea]/50 transition-colors cursor-pointer"
              title={sortDir === 'asc' ? 'Ascending' : 'Descending'}
            >
              {sortDir === 'asc' ? '↑ Asc' : '↓ Desc'}
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#275C53] text-white rounded-xl text-sm font-semibold hover:bg-[#1e4a42] transition-colors cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-[#192026]/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#192026]/30 text-sm">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-[#192026]/30 text-sm">No customers found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#192026]/5">
                  <th
                    onClick={() => handleSort('name')}
                    className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold cursor-pointer hover:text-[#192026]/50 select-none"
                  >
                    Name{sortArrow('name')}
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Email</th>
                  <th
                    onClick={() => handleSort('order_count')}
                    className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold cursor-pointer hover:text-[#192026]/50 select-none"
                  >
                    Orders{sortArrow('order_count')}
                  </th>
                  <th
                    onClick={() => handleSort('ltv')}
                    className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold cursor-pointer hover:text-[#192026]/50 select-none"
                  >
                    LTV{sortArrow('ltv')}
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Location</th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Tags</th>
                  <th
                    onClick={() => handleSort('last_order_date')}
                    className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold cursor-pointer hover:text-[#192026]/50 select-none"
                  >
                    Last Order{sortArrow('last_order_date')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <CustomerRow
                    key={c.id}
                    customer={c}
                    isExpanded={expandedId === c.id}
                    onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)}
                    editingNotes={editingNotes}
                    setEditingNotes={setEditingNotes}
                    savingNotes={savingNotes}
                    saveNotes={saveNotes}
                    toggleTag={toggleTag}
                    tagDropdownOpen={tagDropdownOpen}
                    setTagDropdownOpen={setTagDropdownOpen}
                    formatCurrency={formatCurrency}
                    formatDate={formatDate}
                    getLocation={getLocation}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function CustomerRow({
  customer: c,
  isExpanded,
  onToggle,
  editingNotes,
  setEditingNotes,
  savingNotes,
  saveNotes,
  toggleTag,
  tagDropdownOpen,
  setTagDropdownOpen,
  formatCurrency,
  formatDate,
  getLocation,
}: {
  customer: Customer;
  isExpanded: boolean;
  onToggle: () => void;
  editingNotes: Record<number, string>;
  setEditingNotes: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  savingNotes: number | null;
  saveNotes: (id: number) => void;
  toggleTag: (id: number, tag: string) => void;
  tagDropdownOpen: number | null;
  setTagDropdownOpen: (id: number | null) => void;
  formatCurrency: (n: number) => string;
  formatDate: (s: string | null) => string;
  getLocation: (c: Customer) => string;
}) {
  const currentNotes = editingNotes[c.id] !== undefined ? editingNotes[c.id] : (c.notes || '');
  const notesChanged = currentNotes !== (c.notes || '');

  return (
    <>
      <tr
        onClick={onToggle}
        className={`border-b border-[#192026]/5 hover:bg-[#f5f0ea]/50 transition-colors cursor-pointer ${isExpanded ? 'bg-[#f5f0ea]/30' : ''}`}
      >
        <td className="px-4 py-3">
          <div className="text-sm font-medium text-[#192026]">{c.name || '(No name)'}</div>
        </td>
        <td className="px-4 py-3 text-sm text-[#192026]/60">{c.email}</td>
        <td className="px-4 py-3 text-sm text-[#192026]/60">{c.order_count}</td>
        <td className="px-4 py-3 text-sm font-semibold text-[#275C53]">{formatCurrency(c.ltv)}</td>
        <td className="px-4 py-3 text-sm text-[#192026]/60">{getLocation(c)}</td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-1">
            {(c.tags || []).map(tag => {
              const color = TAG_COLORS[tag] || { bg: 'bg-gray-100', text: 'text-gray-700' };
              return (
                <span key={tag} className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${color.bg} ${color.text}`}>
                  {tag}
                </span>
              );
            })}
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-[#192026]/40">{formatDate(c.last_order_date)}</td>
      </tr>

      {/* Expanded Detail Row */}
      {isExpanded && (
        <tr className="border-b border-[#192026]/5 bg-[#f5f0ea]/20">
          <td colSpan={7} className="px-0 py-0">
            <div className="px-6 py-5 space-y-5">
              {/* Order History */}
              <div>
                <h3 className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-3">
                  Order History ({c.orders.length})
                </h3>
                {c.orders.length === 0 ? (
                  <p className="text-sm text-[#192026]/30">No orders found</p>
                ) : (
                  <div className="bg-white rounded-xl border border-[#192026]/5 overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#192026]/5 bg-[#f5f0ea]/30">
                          <th className="text-left px-4 py-2 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Order #</th>
                          <th className="text-left px-4 py-2 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Date</th>
                          <th className="text-left px-4 py-2 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Total</th>
                          <th className="text-left px-4 py-2 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {c.orders.map((o) => (
                          <tr key={o.id} className="border-b border-[#192026]/5 last:border-0">
                            <td className="px-4 py-2 text-sm font-medium text-[#275C53]">{o.order_number}</td>
                            <td className="px-4 py-2 text-sm text-[#192026]/60">{formatDate(o.date)}</td>
                            <td className="px-4 py-2 text-sm font-medium text-[#192026]">{formatCurrency(o.total)}</td>
                            <td className="px-4 py-2">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-600'}`}>
                                {o.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Notes */}
                <div>
                  <h3 className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-2">Customer Notes</h3>
                  <textarea
                    value={currentNotes}
                    onChange={(e) => setEditingNotes(prev => ({ ...prev, [c.id]: e.target.value }))}
                    placeholder="Add notes about this customer..."
                    rows={4}
                    className="w-full px-3 py-2 border border-[#192026]/10 rounded-xl text-sm text-[#192026] placeholder:text-[#192026]/20 focus:outline-none focus:border-[#275C53]/40 resize-none bg-white"
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); saveNotes(c.id); }}
                    disabled={!notesChanged || savingNotes === c.id}
                    className={`mt-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                      notesChanged
                        ? 'bg-[#275C53] text-white hover:bg-[#1e4a42]'
                        : 'bg-[#192026]/5 text-[#192026]/20 cursor-not-allowed'
                    }`}
                  >
                    {savingNotes === c.id ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(c.tags || []).map(tag => {
                      const color = TAG_COLORS[tag] || { bg: 'bg-gray-100', text: 'text-gray-700' };
                      return (
                        <span
                          key={tag}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${color.bg} ${color.text}`}
                        >
                          {tag}
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleTag(c.id, tag); }}
                            className="ml-0.5 hover:opacity-60 transition-opacity cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                    {(c.tags || []).length === 0 && (
                      <span className="text-sm text-[#192026]/20">No tags assigned</span>
                    )}
                  </div>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTagDropdownOpen(tagDropdownOpen === c.id ? null : c.id);
                      }}
                      className="px-3 py-1.5 border border-dashed border-[#192026]/15 rounded-xl text-xs text-[#192026]/40 hover:border-[#275C53]/40 hover:text-[#275C53] transition-colors cursor-pointer"
                    >
                      + Add Tag
                    </button>
                    {tagDropdownOpen === c.id && (
                      <div
                        className="absolute top-full left-0 mt-1 bg-white rounded-xl border border-[#192026]/10 shadow-lg py-1 z-10 min-w-[160px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {AVAILABLE_TAGS.filter(t => !(c.tags || []).includes(t)).map(tag => {
                          const color = TAG_COLORS[tag] || { bg: 'bg-gray-100', text: 'text-gray-700' };
                          return (
                            <button
                              key={tag}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTag(c.id, tag);
                                setTagDropdownOpen(null);
                              }}
                              className="w-full px-3 py-1.5 text-left text-sm hover:bg-[#f5f0ea]/50 flex items-center gap-2 transition-colors cursor-pointer"
                            >
                              <span className={`inline-block w-2 h-2 rounded-full ${color.bg}`} />
                              {tag}
                            </button>
                          );
                        })}
                        {AVAILABLE_TAGS.filter(t => !(c.tags || []).includes(t)).length === 0 && (
                          <div className="px-3 py-1.5 text-sm text-[#192026]/30">All tags assigned</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-[#192026]/5">
                <div>
                  <div className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-1">Phone</div>
                  <div className="text-sm text-[#192026]/60">{c.phone || '—'}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-1">Location</div>
                  <div className="text-sm text-[#192026]/60">{getLocation(c)}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-1">Customer Since</div>
                  <div className="text-sm text-[#192026]/60">{formatDate(c.created_at)}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-1">Total Spent</div>
                  <div className="text-sm font-semibold text-[#275C53]">{formatCurrency(c.ltv)}</div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
