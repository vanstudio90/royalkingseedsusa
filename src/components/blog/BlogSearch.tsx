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
  const [fullResults, setFullResults] = useState<SearchPost[]>([]);
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const doSearch = (q: string) => {
    setQuery(q);
    setSubmitted(false);
    if (q.length < 2) { setResults([]); setFullResults([]); setOpen(false); return; }
    const lower = q.toLowerCase();
    const matches = posts.filter(p =>
      p.title.toLowerCase().includes(lower) || p.slug.includes(lower.replace(/\s+/g, '-'))
    );
    setFullResults(matches);
    setResults(matches.slice(0, 8));
    setOpen(matches.length > 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length < 2) return;
    setOpen(false);
    setSubmitted(true);
    const lower = query.toLowerCase();
    const matches = posts.filter(p =>
      p.title.toLowerCase().includes(lower) || p.slug.includes(lower.replace(/\s+/g, '-'))
    );
    setFullResults(matches);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setFullResults([]);
    setSubmitted(false);
    setOpen(false);
  };

  return (
    <>
      <div ref={ref} className="max-w-xl mx-auto mb-6 relative">
        <form onSubmit={handleSubmit} className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#192026]/25" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            value={query}
            onChange={e => doSearch(e.target.value)}
            onFocus={() => { if (results.length > 0 && !submitted) setOpen(true); }}
            placeholder="Search grow guides, problems, strains..."
            className="w-full pl-11 pr-10 py-3.5 bg-white border border-[#275C53]/15 rounded-2xl text-[14px] text-[#192026] placeholder:text-[#192026]/30 focus:outline-none focus:border-[#275C53]/40 focus:shadow-sm transition-all"
          />
          {query && (
            <button type="button" onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#192026]/25 hover:text-[#192026]/50 cursor-pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
        </form>
        {open && !submitted && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#275C53]/10 overflow-hidden z-50 max-h-[350px] overflow-y-auto">
            {results.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} onClick={() => { setOpen(false); setQuery(''); setSubmitted(false); }}
                className="block px-4 py-3 text-[13px] text-[#192026]/70 hover:text-[#275C53] hover:bg-[#F5F0EA] transition-colors border-b border-[#192026]/5 last:border-0">
                {post.title}
              </Link>
            ))}
            {fullResults.length > 8 && (
              <button type="button" onClick={() => { setOpen(false); setSubmitted(true); }}
                className="block w-full px-4 py-3 text-[13px] text-[#275C53] font-semibold hover:bg-[#F5F0EA] transition-colors text-center cursor-pointer">
                View all {fullResults.length} results →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Full search results */}
      {submitted && fullResults.length > 0 && (
        <div className="max-w-[1280px] mx-auto mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] font-bold text-[#275C53] uppercase tracking-[1.5px]">
              {fullResults.length} results for &ldquo;{query}&rdquo;
            </h2>
            <button onClick={clearSearch} className="text-[12px] text-[#192026]/40 hover:text-[#275C53] cursor-pointer">Clear search</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {fullResults.slice(0, 30).map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`}
                className="bg-white rounded-xl border border-[#275C53]/5 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <h3 className="text-[14px] font-semibold text-[#275C53] leading-snug group-hover:text-[#D7B65D] transition-colors">{post.title}</h3>
                <span className="text-[11px] text-[#275C53] font-medium opacity-0 group-hover:opacity-100 transition-opacity mt-2 block">Read guide →</span>
              </Link>
            ))}
          </div>
          {fullResults.length > 30 && (
            <p className="text-center text-[12px] text-[#192026]/30 mt-4">Showing first 30 of {fullResults.length} results</p>
          )}
        </div>
      )}
      {submitted && fullResults.length === 0 && (
        <div className="max-w-xl mx-auto mb-10 text-center">
          <p className="text-[#192026]/40 text-sm">No articles found for &ldquo;{query}&rdquo;. Try a different search term.</p>
          <button onClick={clearSearch} className="text-[12px] text-[#275C53] font-semibold mt-2 hover:underline cursor-pointer">Clear search</button>
        </div>
      )}
    </>
  );
}
