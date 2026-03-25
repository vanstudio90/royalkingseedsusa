'use client';

import { useEffect, useState } from 'react';

interface Category {
  id: number;
  name: string;
  slug: string;
  parent_slug: string | null;
  description: string;
  meta_title: string;
  meta_description: string;
  product_count: number;
}

const emptyForm = { name: '', slug: '', parent_slug: '', description: '', meta_title: '', meta_description: '' };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchCategories = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/categories');
    const data = await res.json();
    setCategories(data.categories || []);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const payload = { ...form, slug };

    if (editingId) {
      await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...payload }),
      });
    } else {
      await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    setForm(emptyForm);
    setShowForm(false);
    setEditingId(null);
    fetchCategories();
  };

  const startEdit = (cat: Category) => {
    setForm({
      name: cat.name,
      slug: cat.slug,
      parent_slug: cat.parent_slug || '',
      description: cat.description || '',
      meta_title: cat.meta_title || '',
      meta_description: cat.meta_description || '',
    });
    setEditingId(cat.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    await fetch('/api/admin/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchCategories();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#192026]" style={{ fontFamily: 'var(--font-patua)' }}>Categories</h1>
          <p className="text-[#192026]/40 text-sm mt-1">{categories.length} categories</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}
          className="px-4 py-2.5 bg-[#275C53] text-white rounded-xl text-sm font-semibold hover:bg-[#1e4a42] transition-colors cursor-pointer"
        >
          {showForm ? 'Cancel' : '+ Add Category'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#192026]/5 p-6 mb-4">
          <h3 className="text-sm font-bold text-[#275C53] uppercase tracking-[1px] mb-4">
            {editingId ? 'Edit Category' : 'New Category'}
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[11px] uppercase tracking-[1px] text-[#192026]/40 font-semibold mb-1.5">Name</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#f5f0ea] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#275C53]/30" required />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[1px] text-[#192026]/40 font-semibold mb-1.5">Slug</label>
              <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#f5f0ea] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#275C53]/30" placeholder="auto-generated from name" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[1px] text-[#192026]/40 font-semibold mb-1.5">Parent Category</label>
              <select value={form.parent_slug} onChange={e => setForm({ ...form, parent_slug: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#f5f0ea] rounded-xl text-sm focus:outline-none cursor-pointer">
                <option value="">None (top level)</option>
                {categories.filter(c => !c.parent_slug).map(c => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[1px] text-[#192026]/40 font-semibold mb-1.5">Description</label>
              <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#f5f0ea] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#275C53]/30" />
            </div>
          </div>

          {/* SEO Section */}
          <div className="border-t border-[#192026]/5 pt-4 mt-4">
            <h4 className="text-[11px] uppercase tracking-[1px] text-[#275C53] font-bold mb-3">SEO Settings</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] uppercase tracking-[1px] text-[#192026]/40 font-semibold mb-1.5">Meta Title</label>
                <input type="text" value={form.meta_title} onChange={e => setForm({ ...form, meta_title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#f5f0ea] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#275C53]/30"
                  placeholder="SEO title for this category page..." />
                <p className="text-[10px] text-[#192026]/30 mt-1">{(form.meta_title || '').length}/60 characters</p>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[1px] text-[#192026]/40 font-semibold mb-1.5">Meta Description</label>
                <textarea value={form.meta_description} onChange={e => setForm({ ...form, meta_description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#f5f0ea] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#275C53]/30 resize-y"
                  rows={2} placeholder="SEO description for this category page..." />
                <p className="text-[10px] text-[#192026]/30 mt-1">{(form.meta_description || '').length}/155 characters</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button type="submit" className="px-5 py-2.5 bg-[#275C53] text-white rounded-xl text-sm font-semibold hover:bg-[#1e4a42] cursor-pointer">
              {editingId ? 'Save Changes' : 'Create Category'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}
                className="px-5 py-2.5 bg-[#f5f0ea] text-[#192026]/50 rounded-xl text-sm font-semibold hover:text-[#192026] cursor-pointer">
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-[#192026]/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#192026]/30 text-sm">Loading...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#192026]/5">
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Category</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Slug</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Parent</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">SEO</th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Products</th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-[#192026]/5 hover:bg-[#f5f0ea]/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-[#192026]">
                      {cat.parent_slug ? '— ' : ''}{cat.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#192026]/40 font-mono">{cat.slug}</td>
                  <td className="px-4 py-3 text-[12px] text-[#192026]/30">{cat.parent_slug || '—'}</td>
                  <td className="px-4 py-3">
                    {cat.meta_title || cat.meta_description ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold">SET</span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-500 font-semibold">MISSING</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-[#192026]/40">{cat.product_count || 0}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => startEdit(cat)}
                        className="px-3 py-1.5 bg-[#f5f0ea] rounded-lg text-[11px] font-semibold text-[#192026]/50 hover:text-[#275C53] transition-colors cursor-pointer">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(cat.id, cat.name)}
                        className="px-3 py-1.5 bg-red-50 rounded-lg text-[11px] font-semibold text-red-400 hover:text-red-600 transition-colors cursor-pointer">
                        Delete
                      </button>
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
