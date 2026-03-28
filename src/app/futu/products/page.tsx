'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminFetch } from '@/lib/admin-fetch';

interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  sale_price: number | null;
  status: string;
  strain_type: string;
  categories: string[];
  in_stock: boolean;
  created_at: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: '25',
      status: statusFilter,
      ...(search && { search }),
    });

    const res = await adminFetch(`/api/admin/products?${params}`);
    const data = await res.json();
    setProducts(data.products || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [page, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const toggleStatus = async (id: number, current: string) => {
    const newStatus = current === 'published' ? 'draft' : 'published';
    await adminFetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchProducts();
  };

  const deleteProduct = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await adminFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Failed to delete product');
        return;
      }
      fetchProducts();
    } catch {
      alert('Failed to delete product. Please try again.');
    }
  };

  const totalPages = Math.ceil(total / 25);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#192026]" style={{ fontFamily: 'var(--font-patua)' }}>Products</h1>
          <p className="text-[#192026]/40 text-sm mt-1">{total} total products</p>
        </div>
        <Link
          href="/futu/products/new"
          className="px-4 py-2.5 bg-[#275C53] text-white rounded-xl text-sm font-semibold hover:bg-[#1e4a42] transition-colors"
        >
          + Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#192026]/5 p-4 mb-4 flex items-center gap-4 flex-wrap">
        <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-2.5 bg-[#f5f0ea] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#275C53]/20"
          />
        </form>
        <div className="flex gap-2">
          {['all', 'published', 'draft'].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-2 rounded-lg text-[11px] uppercase tracking-[1px] font-semibold transition-colors cursor-pointer ${
                statusFilter === s
                  ? 'bg-[#275C53] text-white'
                  : 'bg-[#f5f0ea] text-[#192026]/40 hover:text-[#192026]/70'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#192026]/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#192026]/30 text-sm">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-[#192026]/30 text-sm">No products found</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#192026]/5">
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Product</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Type</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Price</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Status</th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-[#192026]/5 hover:bg-[#f5f0ea]/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-[#192026]">{p.name}</div>
                    <div className="text-[11px] text-[#192026]/30">/{p.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] uppercase tracking-[1px] font-semibold px-2 py-1 rounded-full ${
                      p.strain_type === 'indica' ? 'bg-purple-50 text-purple-600' :
                      p.strain_type === 'sativa' ? 'bg-amber-50 text-amber-600' :
                      p.strain_type === 'hybrid' ? 'bg-emerald-50 text-emerald-600' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {p.strain_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#192026]/60">
                    {p.sale_price ? (
                      <>
                        <span className="line-through text-[#192026]/25">${p.price}</span>{' '}
                        <span className="text-[#275C53] font-semibold">${p.sale_price}</span>
                      </>
                    ) : (
                      `$${p.price}`
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStatus(p.id, p.status)}
                      className={`text-[10px] uppercase tracking-[1px] font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                        p.status === 'published'
                          ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          : 'bg-orange-50 text-orange-500 hover:bg-orange-100'
                      }`}
                    >
                      {p.status}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/futu/products/${p.id}`}
                        className="px-3 py-1.5 bg-[#f5f0ea] rounded-lg text-[11px] font-semibold text-[#192026]/50 hover:text-[#275C53] transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteProduct(p.id, p.name)}
                        className="px-3 py-1.5 bg-red-50 rounded-lg text-[11px] font-semibold text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#192026]/5">
            <span className="text-[12px] text-[#192026]/30">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 bg-[#f5f0ea] rounded-lg text-[11px] font-semibold disabled:opacity-30 cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 bg-[#f5f0ea] rounded-lg text-[11px] font-semibold disabled:opacity-30 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
