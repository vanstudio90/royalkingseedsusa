'use client';

import { useEffect, useState } from 'react';

interface Coupon {
  id: number;
  code: string;
  type: 'percentage' | 'fixed' | 'bogo' | 'free_shipping';
  value: number;
  min_order: number | null;
  max_uses: number | null;
  used_count: number;
  applies_to: 'all' | 'category' | 'product';
  applies_to_ids: string[] | null;
  active: boolean;
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
  revenue_generated: number;
  actual_orders: number;
}

type DiscountType = 'percentage' | 'fixed' | 'bogo' | 'free_shipping';
type AppliesTo = 'all' | 'category' | 'product';

const emptyCoupon = {
  code: '',
  type: 'percentage' as DiscountType,
  value: 0,
  min_order: '',
  max_uses: '',
  applies_to: 'all' as AppliesTo,
  applies_to_ids: '',
  expires_at: '',
  active: true,
};

const typeLabels: Record<DiscountType, string> = {
  percentage: 'Percentage (%)',
  fixed: 'Fixed Amount ($)',
  bogo: 'Buy One Get One',
  free_shipping: 'Free Shipping',
};

const typeBadgeColors: Record<DiscountType, string> = {
  percentage: 'bg-blue-50 text-blue-600',
  fixed: 'bg-emerald-50 text-emerald-600',
  bogo: 'bg-purple-50 text-purple-600',
  free_shipping: 'bg-[#D7B65D]/15 text-[#D7B65D]',
};

const appliesToLabels: Record<AppliesTo, string> = {
  all: 'All Products',
  category: 'Specific Categories',
  product: 'Specific Products',
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyCoupon);
  const [saving, setSaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const fetchCoupons = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/coupons');
    const data = await res.json();
    setCoupons(data.coupons || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: form.code,
        type: form.type,
        value: form.type === 'free_shipping' ? 0 : Number(form.value),
        min_order: form.min_order ? Number(form.min_order) : null,
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        applies_to: form.applies_to,
        applies_to_ids: form.applies_to !== 'all' && form.applies_to_ids
          ? form.applies_to_ids.split(',').map((s: string) => s.trim()).filter(Boolean)
          : [],
        expires_at: form.expires_at || null,
        active: form.active,
      }),
    });
    setForm(emptyCoupon);
    setShowForm(false);
    setSaving(false);
    fetchCoupons();
  };

  const toggleActive = async (id: number, active: boolean) => {
    await fetch(`/api/admin/coupons/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    });
    fetchCoupons();
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} coupon${selectedIds.size > 1 ? 's' : ''}?`)) return;
    setDeleting(true);
    await fetch('/api/admin/coupons', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: Array.from(selectedIds) }),
    });
    setSelectedIds(new Set());
    setDeleting(false);
    fetchCoupons();
  };

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === coupons.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(coupons.map((c) => c.id)));
    }
  };

  const copyCode = async (id: number, code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatus = (c: Coupon): { label: string; color: string } => {
    if (!c.active) return { label: 'Inactive', color: 'bg-gray-100 text-gray-400' };
    if (c.expires_at && new Date(c.expires_at) < new Date()) return { label: 'Expired', color: 'bg-red-50 text-red-500' };
    if (c.max_uses && c.used_count >= c.max_uses) return { label: 'Maxed Out', color: 'bg-orange-50 text-orange-500' };
    return { label: 'Active', color: 'bg-emerald-50 text-emerald-600' };
  };

  const formatValue = (c: Coupon) => {
    if (c.type === 'percentage') return `${c.value}%`;
    if (c.type === 'fixed') return `$${Number(c.value).toFixed(2)}`;
    if (c.type === 'bogo') return 'BOGO';
    if (c.type === 'free_shipping') return 'Free Ship';
    return `${c.value}`;
  };

  const totalRevenue = coupons.reduce((sum, c) => sum + (c.revenue_generated || 0), 0);
  const activeCoupons = coupons.filter((c) => getStatus(c).label === 'Active').length;
  const totalUsage = coupons.reduce((sum, c) => sum + (c.used_count || 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#192026]" style={{ fontFamily: 'var(--font-patua)' }}>Coupons & Marketing</h1>
          <p className="text-[#192026]/40 text-sm mt-1">Manage discount codes and promotions</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={deleting}
              className="px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : `Delete (${selectedIds.size})`}
            </button>
          )}
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2.5 bg-[#275C53] text-white rounded-xl text-sm font-semibold hover:bg-[#1e4a42] transition-colors cursor-pointer"
          >
            {showForm ? 'Cancel' : '+ Add Coupon'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-4">
          <p className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Total Coupons</p>
          <p className="text-2xl font-bold text-[#192026] mt-1">{coupons.length}</p>
          <p className="text-[11px] text-[#192026]/30 mt-0.5">{activeCoupons} active</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-4">
          <p className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Total Usage</p>
          <p className="text-2xl font-bold text-[#275C53] mt-1">{totalUsage}</p>
          <p className="text-[11px] text-[#192026]/30 mt-0.5">times redeemed</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-4">
          <p className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Revenue Generated</p>
          <p className="text-2xl font-bold text-[#D7B65D] mt-1">${totalRevenue.toFixed(2)}</p>
          <p className="text-[11px] text-[#192026]/30 mt-0.5">from coupon orders</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-4">
          <p className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Avg Order Value</p>
          <p className="text-2xl font-bold text-[#192026] mt-1">
            ${totalUsage > 0 ? (totalRevenue / totalUsage).toFixed(2) : '0.00'}
          </p>
          <p className="text-[11px] text-[#192026]/30 mt-0.5">with coupon</p>
        </div>
      </div>

      {/* Add Coupon Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-6 mb-4">
          <h2 className="text-lg font-bold text-[#192026] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>New Coupon</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold block mb-1.5">Code</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="SAVE20"
                className="input"
                required
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold block mb-1.5">Discount Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as DiscountType })}
                className="input"
              >
                {Object.entries(typeLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            {form.type !== 'free_shipping' && form.type !== 'bogo' && (
              <div>
                <label className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold block mb-1.5">
                  Value {form.type === 'percentage' ? '(%)' : '($)'}
                </label>
                <input
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                  placeholder={form.type === 'percentage' ? '20' : '10.00'}
                  className="input"
                  required
                  min={0}
                  max={form.type === 'percentage' ? 100 : undefined}
                  step="0.01"
                />
              </div>
            )}
            {form.type === 'bogo' && (
              <div>
                <label className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold block mb-1.5">Free Item Value ($)</label>
                <input
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                  placeholder="Max free item value"
                  className="input"
                  min={0}
                  step="0.01"
                />
              </div>
            )}
            <div>
              <label className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold block mb-1.5">Applies To</label>
              <select
                value={form.applies_to}
                onChange={(e) => setForm({ ...form, applies_to: e.target.value as AppliesTo })}
                className="input"
              >
                {Object.entries(appliesToLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            {form.applies_to !== 'all' && (
              <div>
                <label className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold block mb-1.5">
                  {form.applies_to === 'category' ? 'Category Slugs' : 'Product Slugs'} (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.applies_to_ids}
                  onChange={(e) => setForm({ ...form, applies_to_ids: e.target.value })}
                  placeholder={form.applies_to === 'category' ? 'indica, sativa' : 'blue-dream, og-kush'}
                  className="input"
                />
              </div>
            )}
            <div>
              <label className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold block mb-1.5">Min Order ($)</label>
              <input
                type="number"
                value={form.min_order}
                onChange={(e) => setForm({ ...form, min_order: e.target.value })}
                placeholder="50"
                className="input"
                min={0}
                step="0.01"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold block mb-1.5">Max Uses</label>
              <input
                type="number"
                value={form.max_uses}
                onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                placeholder="100"
                className="input"
                min={0}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold block mb-1.5">Expires At</label>
              <input
                type="date"
                value={form.expires_at}
                onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                className="input"
              />
            </div>
            <div className="col-span-full flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#275C53]"
                />
                <span className="text-sm text-[#192026]/60">Active</span>
              </label>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-[#275C53] text-white rounded-xl text-sm font-semibold hover:bg-[#1e4a42] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {saving ? 'Creating...' : 'Create Coupon'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-[#192026]/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#192026]/30 text-sm">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center text-[#192026]/30 text-sm">No coupons yet</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#192026]/5">
                <th className="text-left px-4 py-3 w-8">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === coupons.length && coupons.length > 0}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded accent-[#275C53] cursor-pointer"
                  />
                </th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Code</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Type</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Value</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Applies To</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Usage</th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Revenue</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Status</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Expires</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => {
                const status = getStatus(c);
                return (
                  <tr key={c.id} className="border-b border-[#192026]/5 hover:bg-[#F5F0EA]/50 transition-colors">
                    {/* Checkbox */}
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(c.id)}
                        onChange={() => toggleSelection(c.id)}
                        className="w-4 h-4 rounded accent-[#275C53] cursor-pointer"
                      />
                    </td>

                    {/* Code + copy button */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-bold text-[#275C53]">{c.code}</span>
                        <button
                          onClick={() => copyCode(c.id, c.code)}
                          className="text-[#192026]/20 hover:text-[#275C53] transition-colors cursor-pointer"
                          title="Copy code"
                        >
                          {copiedId === c.id ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M20 6 9 17l-5-5"/></svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Type badge */}
                    <td className="px-4 py-3">
                      <span className={`text-[10px] uppercase tracking-[1px] font-semibold px-2 py-1 rounded-full ${typeBadgeColors[c.type] || 'bg-gray-50 text-gray-500'}`}>
                        {typeLabels[c.type] || c.type}
                      </span>
                    </td>

                    {/* Value */}
                    <td className="px-4 py-3 text-sm font-medium text-[#192026]">
                      {formatValue(c)}
                    </td>

                    {/* Applies to */}
                    <td className="px-4 py-3">
                      <div className="text-sm text-[#192026]/60">{appliesToLabels[c.applies_to] || 'All Products'}</div>
                      {c.applies_to !== 'all' && c.applies_to_ids && c.applies_to_ids.length > 0 && (
                        <div className="text-[11px] text-[#192026]/30 truncate max-w-[140px]">
                          {c.applies_to_ids.join(', ')}
                        </div>
                      )}
                    </td>

                    {/* Usage */}
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-[#192026]">{c.used_count}</div>
                      {c.max_uses ? (
                        <div className="mt-1">
                          <div className="w-16 h-1.5 bg-[#192026]/5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#275C53] rounded-full transition-all"
                              style={{ width: `${Math.min((c.used_count / c.max_uses) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-[#192026]/30">{c.used_count}/{c.max_uses}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#192026]/30">Unlimited</span>
                      )}
                    </td>

                    {/* Revenue */}
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-bold text-[#D7B65D]">
                        ${(c.revenue_generated || 0).toFixed(2)}
                      </span>
                      {(c.actual_orders || 0) > 0 && (
                        <div className="text-[11px] text-[#192026]/30">{c.actual_orders} orders</div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(c.id, c.active)}
                        className={`text-[10px] uppercase tracking-[1px] font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${status.color}`}
                      >
                        {status.label}
                      </button>
                    </td>

                    {/* Expires */}
                    <td className="px-4 py-3 text-sm text-[#192026]/40">
                      {c.expires_at ? (
                        <div>
                          <div>{new Date(c.expires_at).toLocaleDateString()}</div>
                          {new Date(c.expires_at) < new Date() && (
                            <span className="text-[10px] text-red-400">Past due</span>
                          )}
                        </div>
                      ) : (
                        'Never'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
