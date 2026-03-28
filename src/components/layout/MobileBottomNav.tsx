'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cart-store';

interface SearchResult {
  slug: string;
  name: string;
  strainType: string;
  price: number;
  imageUrl?: string;
  thcContent?: string;
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const toggleCart = useCartStore((s) => s.toggleCart);
  const totalItems = useCartStore((s) => s.totalItems());
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const isActive = (href: string) => pathname === href;

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  // Close search on navigation
  useEffect(() => {
    setSearchOpen(false);
    setQuery('');
    setResults([]);
  }, [pathname]);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data.products || []);
      } catch { setResults([]); }
      setLoading(false);
    }, 250);
  };

  const goToProduct = (slug: string) => {
    setSearchOpen(false);
    setQuery('');
    setResults([]);
    router.push(`/${slug}`);
  };

  return (
    <>
      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />

          {/* Search panel */}
          <div className="absolute inset-x-0 top-0 bg-white rounded-b-2xl shadow-xl max-h-[85vh] flex flex-col">
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#275C53]/10">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#275C53" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search strains, effects, flavors..."
                className="flex-1 text-[15px] text-[#192026] placeholder:text-[#192026]/30 outline-none bg-transparent"
              />
              <button
                onClick={() => { setSearchOpen(false); setQuery(''); setResults([]); }}
                className="w-8 h-8 rounded-full bg-[#f5f0ea] flex items-center justify-center text-[#192026]/40 hover:text-[#192026] cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            {/* Results */}
            <div className="overflow-y-auto flex-1">
              {loading && (
                <div className="px-4 py-6 text-center text-[#192026]/30 text-sm">Searching...</div>
              )}

              {!loading && query.length >= 2 && results.length === 0 && (
                <div className="px-4 py-6 text-center text-[#192026]/30 text-sm">No results for &ldquo;{query}&rdquo;</div>
              )}

              {!loading && results.length > 0 && (
                <div>
                  {results.map((p) => (
                    <button
                      key={p.slug}
                      onClick={() => goToProduct(p.slug)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f5f0ea]/70 transition-colors text-left cursor-pointer border-b border-[#192026]/5 last:border-0"
                    >
                      <div className="w-12 h-12 rounded-lg bg-[#f5f0ea] overflow-hidden shrink-0 flex items-center justify-center">
                        {p.imageUrl && !p.imageUrl.startsWith('/images/seeds/') ? (
                          <img src={p.imageUrl} alt="" className="w-full h-full object-contain p-0.5" />
                        ) : (
                          <span className="text-lg opacity-20">🌱</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[#192026] truncate">{p.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[9px] uppercase tracking-[0.5px] font-semibold px-1.5 py-0.5 rounded ${
                            p.strainType === 'indica' ? 'bg-purple-50 text-purple-600' :
                            p.strainType === 'sativa' ? 'bg-amber-50 text-amber-600' :
                            p.strainType === 'hybrid' ? 'bg-emerald-50 text-emerald-600' :
                            'bg-blue-50 text-blue-600'
                          }`}>{p.strainType}</span>
                          {p.thcContent && <span className="text-[10px] text-[#192026]/30">THC {p.thcContent}%</span>}
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-[#275C53] shrink-0">${p.price}</span>
                    </button>
                  ))}
                  <Link
                    href={`/product-category/shop-all-cannabis-seeds?q=${encodeURIComponent(query)}`}
                    onClick={() => { setSearchOpen(false); setQuery(''); setResults([]); }}
                    className="block px-4 py-3 text-center text-sm font-semibold text-[#275C53] hover:bg-[#f5f0ea]/70 transition-colors"
                  >
                    View all results for &ldquo;{query}&rdquo;
                  </Link>
                </div>
              )}

              {!loading && query.length < 2 && (
                <div className="px-4 py-6 space-y-3">
                  <p className="text-[10px] uppercase tracking-[1px] text-[#192026]/25 font-semibold">Popular Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {['Gorilla Glue', 'Blue Dream', 'Northern Lights', 'Girl Scout Cookies', 'OG Kush', 'White Widow', 'Gelato', 'Autoflower'].map(term => (
                      <button
                        key={term}
                        onClick={() => handleSearch(term)}
                        className="px-3 py-1.5 bg-[#f5f0ea] rounded-full text-xs text-[#192026]/60 hover:bg-[#275C53]/10 hover:text-[#275C53] transition-colors cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-[#275C53]/10 lg:hidden">
        <div className="flex items-end justify-around px-2 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
          {/* Home */}
          <Link href="/" className="flex flex-col items-center gap-0.5 py-1 px-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={isActive('/') ? '#275C53' : '#192026'} strokeWidth={isActive('/') ? 2.2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className={`text-[10px] font-semibold ${isActive('/') ? 'text-[#275C53]' : 'text-[#192026]/40'}`}>Home</span>
          </Link>

          {/* Search — opens overlay */}
          <button onClick={() => setSearchOpen(true)} className="flex flex-col items-center gap-0.5 py-1 px-3 cursor-pointer" aria-label="Search">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={searchOpen ? '#275C53' : '#192026'} strokeWidth={searchOpen ? 2.2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className={`text-[10px] font-semibold ${searchOpen ? 'text-[#275C53]' : 'text-[#192026]/40'}`}>Search</span>
          </button>

          {/* Cart — elevated circle */}
          <button onClick={toggleCart} className="flex flex-col items-center -mt-5 cursor-pointer" aria-label="Open cart">
            <div className="w-14 h-14 rounded-full bg-[#275C53] flex items-center justify-center shadow-lg relative">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D7B65D] text-[#1a3d36] text-[10px] font-bold rounded-full flex items-center justify-center">{totalItems > 99 ? '99+' : totalItems}</span>
              )}
            </div>
            <span className="text-[10px] font-semibold text-[#275C53] mt-0.5">Cart</span>
          </button>

          {/* Wishlist */}
          <Link href="/favorites" className="flex flex-col items-center gap-0.5 py-1 px-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill={isActive('/favorites') ? '#275C53' : 'none'} stroke={isActive('/favorites') ? '#275C53' : '#192026'} strokeWidth={isActive('/favorites') ? 2.2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className={`text-[10px] font-semibold ${isActive('/favorites') ? 'text-[#275C53]' : 'text-[#192026]/40'}`}>Wishlist</span>
          </Link>

          {/* Account */}
          <Link href="/account" className="flex flex-col items-center gap-0.5 py-1 px-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={isActive('/account') ? '#275C53' : '#192026'} strokeWidth={isActive('/account') ? 2.2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className={`text-[10px] font-semibold ${isActive('/account') ? 'text-[#275C53]' : 'text-[#192026]/40'}`}>Account</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
