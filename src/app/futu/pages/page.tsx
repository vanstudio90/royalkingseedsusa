'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminFetch } from '@/lib/admin-fetch';

interface PageItem {
  id: number;
  slug: string;
  title: string;
  status: string;
  page_type: string;
  category: string;
  author: string;
  created_at: string;
  updated_at: string;
}

export default function AdminPagesPage() {
  const router = useRouter();
  const [pages, setPages] = useState<PageItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [counts, setCounts] = useState<{ all: number; published: number; draft: number }>({ all: 0, published: 0, draft: 0 });
  const [page, setPage] = useState(1);
  const limit = 50;

  const fetchPages = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      type: typeFilter,
      status: statusFilter,
      page: String(page),
      limit: String(limit),
    });
    const res = await adminFetch(`/api/admin/pages?${params}`);
    const data = await res.json();
    setPages(data.pages || []);
    setTotal(data.total || 0);
    setCounts(data.counts || { all: 0, published: 0, draft: 0 });
    setLoading(false);
  }, [typeFilter, statusFilter, page]);

  useEffect(() => { fetchPages(); }, [fetchPages]);

  const toggleStatus = async (id: number, current: string) => {
    const newStatus = current === 'published' ? 'draft' : 'published';
    await adminFetch(`/api/admin/pages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchPages();
  };

  const deletePage = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await adminFetch(`/api/admin/pages/${id}`, { method: 'DELETE' });
    fetchPages();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#192026]" style={{ fontFamily: 'var(--font-patua)' }}>Pages & Blog</h1>
          <p className="text-[#192026]/40 text-sm mt-1">{total} items</p>
        </div>
        <Link
          href="/futu/pages/new"
          className="px-4 py-2.5 bg-[#275C53] text-white rounded-xl text-sm font-semibold hover:bg-[#1e4a42] transition-colors"
        >
          + New Page
        </Link>
      </div>

      {/* Type Filter */}
      <div className="bg-white rounded-2xl border border-[#192026]/5 p-4 mb-4 flex items-center gap-2">
        {(['all', 'page', 'blog'] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTypeFilter(t); setStatusFilter('all'); setPage(1); }}
            className={`px-3 py-2 rounded-lg text-[11px] uppercase tracking-[1px] font-semibold transition-colors cursor-pointer ${
              typeFilter === t
                ? 'bg-[#275C53] text-white'
                : 'bg-[#f5f0ea] text-[#192026]/40 hover:text-[#192026]/70'
            }`}
          >
            {t === 'all' ? 'All' : t === 'page' ? 'Pages' : 'Blog Posts'}
          </button>
        ))}
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-2xl border border-[#192026]/5 p-4 mb-4 flex items-center gap-2">
        {(['all', 'published', 'draft'] as const).map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-2 rounded-lg text-[11px] uppercase tracking-[1px] font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              statusFilter === s
                ? 'bg-[#275C53] text-white'
                : 'bg-[#f5f0ea] text-[#192026]/40 hover:text-[#192026]/70'
            }`}
          >
            {s}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              statusFilter === s ? 'bg-white/20 text-white' : 'bg-[#192026]/5 text-[#192026]/30'
            }`}>
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#192026]/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#192026]/30 text-sm">Loading...</div>
        ) : pages.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[#192026]/30 text-sm mb-2">No pages found</p>
            <Link href="/futu/pages/new" className="text-[#275C53] text-sm underline">Create your first page</Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#192026]/5">
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Title</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Type</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Status</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Updated</th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.id} className="border-b border-[#192026]/5 hover:bg-[#f5f0ea]/50 transition-colors">
                  <td className="px-4 py-3">
                    <a
                      href={p.page_type === 'blog' ? `/blog/${p.slug}` : `/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <div className="text-sm font-medium text-[#192026] group-hover:text-[#275C53] transition-colors">{p.title}</div>
                      <div className="text-[11px] text-[#192026]/30 group-hover:text-[#275C53]/50 transition-colors">/{p.slug}</div>
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] uppercase tracking-[1px] font-semibold px-2 py-1 rounded-full ${
                      p.page_type === 'blog' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {p.page_type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStatus(p.id, p.status)}
                      className={`text-[10px] uppercase tracking-[1px] font-semibold px-2.5 py-1 rounded-full cursor-pointer ${
                        p.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-500'
                      }`}
                    >
                      {p.status}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#192026]/30">
                    {new Date(p.updated_at).toLocaleDateString('en-US')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => router.push(`/futu/pages/${p.id}`)} className="px-3 py-1.5 bg-[#f5f0ea] rounded-lg text-[11px] font-semibold text-[#192026]/50 hover:text-[#275C53] transition-colors cursor-pointer">
                        Edit
                      </button>
                      <button
                        onClick={() => deletePage(p.id, p.title)}
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
