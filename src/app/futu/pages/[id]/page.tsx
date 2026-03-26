'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminFetch } from '@/lib/admin-fetch';

interface PageData {
  id: number;
  slug: string;
  title: string;
  content: string;
  meta_title: string;
  meta_description: string;
  status: string;
  page_type: string;
  category: string;
  author: string;
}

export default function EditPagePage() {
  const router = useRouter();
  const params = useParams();
  const [page, setPage] = useState<PageData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminFetch(`/api/admin/pages?type=all`)
      .then(r => r.json())
      .then(data => {
        const found = (data.pages || []).find((p: PageData) => p.id === Number(params.id));
        if (found) setPage(found);
      });
  }, [params.id]);

  const handleSave = async () => {
    if (!page) return;
    setSaving(true);
    const res = await adminFetch(`/api/admin/pages/${page.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: page.title,
        slug: page.slug,
        content: page.content,
        meta_title: page.meta_title,
        meta_description: page.meta_description,
        status: page.status,
        page_type: page.page_type,
      }),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  if (!page) return <div className="p-12 text-center text-[#192026]/30">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => router.push('/futu/pages')} className="text-[#192026]/30 text-sm hover:text-[#275C53] mb-1 cursor-pointer">&larr; Back to Pages</button>
          <h1 className="text-2xl font-bold text-[#192026]" style={{ fontFamily: 'var(--font-patua)' }}>Edit Page</h1>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-emerald-600 text-sm font-medium">Saved!</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-[#275C53] text-white rounded-xl text-sm font-semibold hover:bg-[#1e4a42] cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main content */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-[#192026]/5 p-5">
            <label className="block text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-bold mb-2">Title</label>
            <input
              value={page.title}
              onChange={e => setPage({ ...page, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#f5f0ea] border border-[#275C53]/10 rounded-xl text-sm focus:outline-none focus:border-[#275C53]/30"
            />
          </div>

          <div className="bg-white rounded-2xl border border-[#192026]/5 p-5">
            <label className="block text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-bold mb-2">Slug</label>
            <input
              value={page.slug}
              onChange={e => setPage({ ...page, slug: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#f5f0ea] border border-[#275C53]/10 rounded-xl text-sm text-[#192026]/50 focus:outline-none focus:border-[#275C53]/30"
            />
          </div>

          <div className="bg-white rounded-2xl border border-[#192026]/5 p-5">
            <label className="block text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-bold mb-2">Content</label>
            <textarea
              value={page.content || ''}
              onChange={e => setPage({ ...page, content: e.target.value })}
              rows={20}
              className="w-full px-4 py-3 bg-[#f5f0ea] border border-[#275C53]/10 rounded-xl text-sm font-mono leading-relaxed focus:outline-none focus:border-[#275C53]/30 resize-y"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#192026]/5 p-5">
            <label className="block text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-bold mb-2">Status</label>
            <select
              value={page.status}
              onChange={e => setPage({ ...page, status: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#f5f0ea] border border-[#275C53]/10 rounded-xl text-sm cursor-pointer focus:outline-none"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-[#192026]/5 p-5">
            <label className="block text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-bold mb-2">Page Type</label>
            <select
              value={page.page_type || 'page'}
              onChange={e => setPage({ ...page, page_type: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#f5f0ea] border border-[#275C53]/10 rounded-xl text-sm cursor-pointer focus:outline-none"
            >
              <option value="page">Page</option>
              <option value="blog">Blog Post</option>
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-[#192026]/5 p-5">
            <h3 className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-bold mb-3">SEO</h3>
            <label className="block text-[11px] text-[#192026]/40 mb-1">Meta Title</label>
            <input
              value={page.meta_title || ''}
              onChange={e => setPage({ ...page, meta_title: e.target.value })}
              className="w-full px-3 py-2 bg-[#f5f0ea] border border-[#275C53]/10 rounded-lg text-[12px] mb-3 focus:outline-none focus:border-[#275C53]/30"
              placeholder="SEO title..."
            />
            <label className="block text-[11px] text-[#192026]/40 mb-1">Meta Description</label>
            <textarea
              value={page.meta_description || ''}
              onChange={e => setPage({ ...page, meta_description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-[#f5f0ea] border border-[#275C53]/10 rounded-lg text-[12px] focus:outline-none focus:border-[#275C53]/30 resize-y"
              placeholder="SEO description..."
            />
          </div>

          <div className="bg-white rounded-2xl border border-[#192026]/5 p-5">
            <h3 className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-bold mb-2">Info</h3>
            <div className="space-y-1.5 text-[12px] text-[#192026]/40">
              <p>ID: {page.id}</p>
              <p>Type: {page.page_type}</p>
              <p>Author: {page.author || '—'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
