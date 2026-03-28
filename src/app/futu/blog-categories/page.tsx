'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin-fetch';

interface BlogCategory {
  id: string;
  label: string;
  description: string;
  postCount: number;
  cats: string[];
}

export default function AdminBlogCategoriesPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await adminFetch('/api/admin/blog-categories');
      const data = await res.json();
      setCategories(data.categories || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalPosts = categories.reduce((sum, c) => sum + c.postCount, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#192026]" style={{ fontFamily: 'var(--font-patua)' }}>Blog Categories</h1>
        <p className="text-[#192026]/40 text-sm mt-1">{categories.length} categories · {totalPosts} total posts</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#192026]/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#192026]/30 text-sm">Loading...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#192026]/5">
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Category</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Description</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Internal IDs</th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold">Posts</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} className="border-b border-[#192026]/5 hover:bg-[#f5f0ea]/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-[#192026]">{cat.label}</span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#192026]/50 max-w-[300px]">{cat.description}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {cat.cats.map(c => (
                        <span key={c} className="text-[10px] bg-[#F5F0EA] text-[#192026]/50 px-2 py-0.5 rounded font-mono">{c}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-[#275C53]">{cat.postCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
