'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface SearchPost {
  slug: string;
  title: string;
}

export function BlogSearch({ posts }: { posts: SearchPost[] }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchPost[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.length < 2) { setResults([]); setOpen(false); return; }
    const lower = q.toLowerCase();
    const matches = posts.filter(p =>
      p.title.toLowerCase().includes(lower) || p.slug.includes(lower.replace(/\s+/g, '-'))
    ).slice(0, 8);
    setResults(matches);
    setOpen(matches.length > 0);
  };

  return (
    <div ref={ref} className="max-w-xl mx-auto mb-6 relative">
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#192026]/25" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          type="text"
          value={query}
          onChange={e => handleSearch(e.target.value)}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          placeholder="Search grow guides, problems, strains..."
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#275C53]/15 rounded-2xl text-[14px] text-[#192026] placeholder:text-[#192026]/30 focus:outline-none focus:border-[#275C53]/40 focus:shadow-sm transition-all"
        />
      </div>
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#275C53]/10 overflow-hidden z-50 max-h-[350px] overflow-y-auto">
          {results.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} onClick={() => { setOpen(false); setQuery(''); }}
              className="block px-4 py-3 text-[13px] text-[#192026]/70 hover:text-[#275C53] hover:bg-[#F5F0EA] transition-colors border-b border-[#192026]/5 last:border-0">
              {post.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
