'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import type { Product } from '@/lib/products/types';

interface MenuItem {
  label: string;
  href: string;
  highlight?: string;
  children?: (MenuGroup | MenuItem)[];
}

interface MenuGroup {
  label: string;
  children: { label: string; href: string }[];
}

function isMenuGroup(item: MenuGroup | MenuItem): item is MenuGroup {
  return 'children' in item && !('href' in item);
}

const navItems: MenuItem[] = [
  {
    label: 'Seeds',
    href: '/product-category/shop-all-cannabis-seeds',
    children: [
      {
        label: 'Shop by Type',
        children: [
          { label: 'Autoflower Seeds', href: '/product-category/autoflowering-seeds' },
          { label: 'Feminized Seeds', href: '/product-category/feminized-seeds' },
          { label: 'High THC Seeds', href: '/product-category/high-tch-seeds' },
          { label: 'CBD Seeds', href: '/product-category/cbd-strains' },
          { label: 'Photoperiod Seeds', href: '/product-category/photoperiod' },
        ],
      },
      {
        label: 'Shop by Goal',
        children: [
          { label: 'Beginner-Friendly', href: '/product-category/autoflowering-seeds' },
          { label: 'High Yield Seeds', href: '/product-category/best-strains-for-high-yield' },
          { label: 'Fast Growing Seeds', href: '/product-category/fast-flowering-cannabis-seeds' },
          { label: 'Easy to Grow', href: '/product-category/autoflowering-seeds' },
        ],
      },
      {
        label: 'Shop by Setup',
        children: [
          { label: 'Indoor Seeds', href: '/product-category/best-strains-for-indoor-growing' },
          { label: 'Outdoor Seeds', href: '/product-category/best-strains-for-outdoor-growing' },
          { label: 'Mix Packs', href: '/product-category/mix-packs' },
        ],
      },
      {
        label: 'Shop by Effects',
        children: [
          { label: 'Relaxing', href: '/product-category/indica-seeds' },
          { label: 'Uplifting', href: '/product-category/sativa-seeds' },
          { label: 'Best Sellers', href: '/product-category/best-seller' },
          { label: 'Shop All Seeds', href: '/product-category/shop-all-cannabis-seeds' },
        ],
      },
    ],
  },
  {
    label: 'Autoflower',
    href: '/product-category/autoflowering-seeds',
    children: [
      { label: 'All Autoflower Seeds', href: '/product-category/autoflowering-seeds' },
      { label: 'High Yield Autoflowers', href: '/product-category/best-strains-for-high-yield' },
      { label: 'Fast Autoflowers', href: '/product-category/fast-flowering-cannabis-seeds' },
      { label: 'Beginner Autoflowers', href: '/product-category/autoflowering-seeds' },
      { label: 'Autoflower Grow Guide', href: '/blog/autoflower-cannabis-seeds-and-growing-guide' },
    ],
  },
  {
    label: 'Feminized',
    href: '/product-category/feminized-seeds',
    children: [
      { label: 'All Feminized Seeds', href: '/product-category/feminized-seeds' },
      { label: 'High THC Feminized', href: '/product-category/high-tch-seeds' },
      { label: 'Indoor Feminized', href: '/product-category/best-strains-for-indoor-growing' },
      { label: 'Outdoor Feminized', href: '/product-category/best-strains-for-outdoor-growing' },
      { label: 'High Yield Feminized', href: '/product-category/best-strains-for-high-yield' },
    ],
  },
  {
    label: 'Grow Guides',
    href: '/blog',
    children: [
      {
        label: 'Start Here',
        children: [
          { label: 'Beginner Grow Guide', href: '/blog/top-7-recommended-strains-for-beginners' },
          { label: 'Germination Guide', href: '/blog/autoflowering-seed-germination-guide' },
          { label: 'Indoor Growing', href: '/blog/cannabis-growing-lights-and-phases' },
          { label: 'Outdoor Growing', href: '/blog/rainy-season-outdoors-fast-finishing-seeds-that-beat-the-storms' },
        ],
      },
      {
        label: 'Grow Stages',
        children: [
          { label: 'Seedling Stage', href: '/blog/cannabis-seedlings-and-transplanting' },
          { label: 'Vegetative Stage', href: '/blog/keep-cannabis-in-vegetative-stage' },
          { label: 'Flowering Stage', href: '/blog/cannabis-flowering-and-budding' },
        ],
      },
      {
        label: 'Fix Problems',
        children: [
          { label: 'Yellow Leaves', href: '/blog/yellowing-of-cannabis-leaves-in-the-first-week-of-flowering' },
          { label: 'Nutrient Burn', href: '/blog/cannabis-nutrient-burn-and-light-stress' },
          { label: 'Pests & Mold', href: '/blog/cannabis-pest-management' },
          { label: 'Overwatering', href: '/blog/overwatering-vs-underwatering-cannabis-plants' },
        ],
      },
      {
        label: 'Harvest',
        children: [
          { label: 'When to Harvest', href: '/blog/cannabis-trichomes-and-harvesting' },
          { label: 'Drying Cannabis', href: '/blog/drying-and-curing-your-cannabis-plants' },
          { label: 'Curing Cannabis', href: '/blog/cannabis-harvesting-and-curing' },
          { label: 'Yield Calculator', href: '/yield-calculator' },
          { label: 'All Grow Guides', href: '/blog' },
        ],
      },
    ],
  },
  {
    label: 'Strain Library',
    href: '/product-category/shop-all-cannabis-seeds',
    children: [
      {
        label: 'By Type',
        children: [
          { label: 'Indica', href: '/product-category/indica-seeds' },
          { label: 'Sativa', href: '/product-category/sativa-seeds' },
          { label: 'Hybrid', href: '/product-category/hybrid' },
        ],
      },
      {
        label: 'By Effects',
        children: [
          { label: 'Relaxing', href: '/product-category/indica-seeds' },
          { label: 'Energizing', href: '/product-category/energizing-cannabis-seeds' },
          { label: 'For Anxiety', href: '/product-category/best-strains-for-anxiety' },
          { label: 'For Sleep', href: '/product-category/indica-seeds' },
        ],
      },
      {
        label: 'By Grow Traits',
        children: [
          { label: 'High THC', href: '/product-category/high-tch-seeds' },
          { label: 'High Yield', href: '/product-category/best-strains-for-high-yield' },
          { label: 'Fast Flowering', href: '/product-category/fast-flowering-cannabis-seeds' },
          { label: 'Beginner Friendly', href: '/product-category/autoflowering-seeds' },
        ],
      },
      {
        label: 'Featured',
        children: [
          { label: 'Best Sellers', href: '/product-category/best-seller' },
          { label: 'Exotic Strains', href: '/product-category/exotic-cannabis-seeds' },
          { label: 'Strain Finder Quiz', href: '/strain-finder' },
        ],
      },
    ],
  },
  {
    label: 'Beginner',
    href: '/blog/top-7-recommended-strains-for-beginners',
    highlight: 'text-[#D7B65D]',
    children: [
      {
        label: 'Start Growing',
        children: [
          { label: 'Beginner Grow Guide', href: '/blog/top-7-recommended-strains-for-beginners' },
          { label: 'How to Germinate Seeds', href: '/blog/autoflowering-seed-germination-guide' },
          { label: 'Indoor Setup', href: '/blog/cannabis-growing-lights-and-phases' },
          { label: 'Outdoor Setup', href: '/blog/rainy-season-outdoors-fast-finishing-seeds-that-beat-the-storms' },
        ],
      },
      {
        label: 'Easy Picks',
        children: [
          { label: 'Best Beginner Seeds', href: '/product-category/autoflowering-seeds' },
          { label: 'Autoflowers for Beginners', href: '/product-category/autoflowering-seeds' },
          { label: 'Easy Strains', href: '/product-category/autoflowering-seeds' },
        ],
      },
      {
        label: 'Avoid Mistakes',
        children: [
          { label: 'Overwatering', href: '/blog/overwatering-vs-underwatering-cannabis-plants' },
          { label: 'Nutrient Burn', href: '/blog/cannabis-nutrient-burn-and-light-stress' },
          { label: 'Common Grow Mistakes', href: '/blog/cannabis-seedlings-and-transplanting' },
        ],
      },
    ],
  },
  {
    label: 'Buy By State',
    href: '/seeds/usa',
    children: [
      { label: 'California', href: '/seeds/usa/california' },
      { label: 'Texas', href: '/seeds/usa/texas' },
      { label: 'Florida', href: '/seeds/usa/florida' },
      { label: 'New York', href: '/seeds/usa/new-york' },
      { label: 'Illinois', href: '/seeds/usa/illinois' },
      { label: 'Michigan', href: '/seeds/usa/michigan' },
      { label: 'All 50 States', href: '/seeds/usa' },
    ],
  },
  {
    label: 'Support',
    href: '/contact',
    children: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'Germination Guarantee', href: '/faq' },
      { label: 'Refund & Returns', href: '/refund-returns' },
    ],
  },
];

export function Header() {
  const { toggleCart, totalItems } = useCartStore();
  const wishlistTotal = useWishlistStore((s) => s.totalItems());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const menuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchRef.current && !searchRef.current.contains(e.target as Node) &&
        mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.length < 2) { setSearchResults([]); return; }
    try {
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSearchResults(data.products || []);
      setSearchOpen(true);
    } catch {
      setSearchResults([]);
    }
  };

  const handleMenuEnter = (label: string) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveMenu(label);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => setActiveMenu(null), 150);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Mobile Search Bar */}
      <div className="lg:hidden bg-[#275C53] border-b border-[#275C53]/20">
        <div className="px-4 py-2">
          <div ref={mobileSearchRef} className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setSearchOpen(true)}
              placeholder="Search strains, effects, flavors..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/15 border border-white/20 rounded-full text-white placeholder:text-white/50 text-sm focus:outline-none focus:border-white/40 focus:bg-white/20 transition-colors"
            />
            {searchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#275C53]/10 overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                {searchResults.map((p) => (
                  <Link key={p.id} href={`/${p.slug}`} onClick={() => { setSearchOpen(false); setSearchQuery(''); setMobileOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#F5F0EA] transition-colors border-b border-[#275C53]/5 last:border-0">
                    <div className="w-10 h-10 rounded-lg bg-[#275C53]/5 flex items-center justify-center text-lg shrink-0">🌱</div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#192026] truncate">{p.name}</p>
                      <p className="text-[11px] text-[#192026]/70 flex items-center gap-2">
                        <span className="capitalize">{p.strainType}</span>
                        {p.thcContent && <span>THC {p.thcContent}%</span>}
                        <span>${p.price.toFixed(2)}</span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Bar */}
      <div className="bg-white border-b border-[#275C53]/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 gap-4">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 rounded-full bg-[#275C53] flex items-center justify-center">
                <span className="text-[#E8CC7A] font-bold text-xs">RK</span>
              </div>
              <span className="hidden sm:block font-bold text-base text-[#275C53] leading-none" style={{ fontFamily: 'var(--font-patua), Patua One, serif' }}>
                Royal King Seeds
              </span>
            </Link>

            {/* Desktop search */}
            <div ref={searchRef} className="hidden lg:block flex-1 max-w-xl relative">
              <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#192026]/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setSearchOpen(true)}
                  placeholder="Search strains, effects, flavors..."
                  className="w-full pl-10 pr-4 py-2 bg-[#F5F0EA] border border-[#275C53]/10 rounded-full text-[#192026] placeholder:text-[#192026]/70 text-sm focus:outline-none focus:border-[#275C53]/30 transition-colors"
                />
              </div>
              {searchOpen && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#275C53]/10 overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                  {searchResults.map((p) => (
                    <Link key={p.id} href={`/${p.slug}`} onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#F5F0EA] transition-colors border-b border-[#275C53]/5 last:border-0">
                      <div className="w-10 h-10 rounded-lg bg-[#275C53]/5 flex items-center justify-center text-lg shrink-0">🌱</div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#192026] truncate">{p.name}</p>
                        <p className="text-[11px] text-[#192026]/70 flex items-center gap-2">
                          <span className="capitalize">{p.strainType}</span>
                          {p.thcContent && <span>THC {p.thcContent}%</span>}
                          <span>${p.price.toFixed(2)}</span>
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <span className="hidden md:block text-[10px] text-[#275C53] mr-1">🇺🇸</span>
              <Link href="/favorites" className="relative w-9 h-9 rounded-full hover:bg-[#F5F0EA] flex items-center justify-center text-[#192026]/70 hover:text-[#275C53] transition-colors" aria-label="Favorites">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                {wishlistTotal > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-bold">{wishlistTotal}</span>
                )}
              </Link>
              <Link href="/account" className="w-9 h-9 rounded-full hover:bg-[#F5F0EA] flex items-center justify-center text-[#192026]/70 hover:text-[#275C53] transition-colors" aria-label="Account">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </Link>
              <button onClick={toggleCart} className="relative w-9 h-9 rounded-full hover:bg-[#F5F0EA] flex items-center justify-center text-[#192026]/70 hover:text-[#275C53] transition-colors cursor-pointer" aria-label="Cart">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                {totalItems() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] rounded-full bg-[#D7B65D] text-[#275C53] text-[9px] flex items-center justify-center font-bold">{totalItems()}</span>
                )}
              </button>
              <button onClick={() => { setMobileOpen(!mobileOpen); setExpandedMobile(null); }} className="lg:hidden w-9 h-9 rounded-full hover:bg-[#F5F0EA] flex items-center justify-center text-[#192026]/70 hover:text-[#275C53] transition-colors cursor-pointer ml-1" aria-label="Menu">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {mobileOpen ? (<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>) : (<><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>)}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white border-b border-[#275C53]/10 hidden lg:block">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-2 h-12">
            {navItems.map((item, navIdx) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && handleMenuEnter(item.label)}
                onMouseLeave={handleMenuLeave}
              >
                <Link
                  href={item.href}
                  className={`px-4 py-2 text-[13px] uppercase tracking-[2px] font-bold transition-colors flex items-center gap-1.5 ${
                    item.highlight || 'text-[#192026] hover:text-[#D7B65D]'
                  }`}
                >
                  {item.label}
                  {item.children && (
                    <span className="text-[#D7B65D] text-sm font-normal leading-none">+</span>
                  )}
                </Link>

                {item.children && activeMenu === item.label && (
                  <div
                    className={`absolute top-full pt-1 z-50 ${navIdx <= 2 ? 'left-0' : navIdx >= navItems.length - 2 ? 'right-0' : 'left-1/2 -translate-x-1/2'}`}
                    onMouseEnter={() => handleMenuEnter(item.label)}
                    onMouseLeave={handleMenuLeave}
                  >
                    {item.children.some((c) => 'children' in c && !('href' in c)) ? (
                      <div className={`bg-white rounded-2xl shadow-xl border border-[#275C53]/10 p-6 grid gap-x-8 gap-y-5 ${
                        (() => { const cols = item.children.filter(c => isMenuGroup(c)).length; return cols >= 4 ? 'min-w-[750px] grid-cols-4' : cols === 3 ? 'min-w-[600px] grid-cols-3' : 'min-w-[500px] grid-cols-2'; })()
                      }`}>
                        {item.children.map((child) =>
                          isMenuGroup(child) ? (
                            <div key={child.label}>
                              <span className="text-[11px] uppercase tracking-[1.5px] font-bold text-[#275C53] mb-2 block">{child.label}</span>
                              <div className="space-y-1">
                                {child.children.map((sub) => (
                                  <Link key={sub.label} href={sub.href} className="block text-[13px] text-[#192026]/55 hover:text-[#275C53] transition-colors py-0.5">{sub.label}</Link>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <Link key={child.label} href={(child as MenuItem).href} className={`block text-[13px] py-1 transition-colors rounded-lg px-2 ${
                              (child as MenuItem).highlight
                                ? `${(child as MenuItem).highlight} px-3 py-1.5 rounded-full text-[11px] uppercase tracking-[1px] font-semibold inline-block`
                                : 'text-[#192026]/55 hover:text-[#275C53]'
                            }`}>{child.label}</Link>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl shadow-xl border border-[#275C53]/10 py-2 min-w-[220px]">
                        {item.children.map((child) => (
                          <Link key={child.label} href={(child as MenuItem).href || '#'}
                            className="block text-[13px] text-[#192026]/60 hover:text-[#275C53] hover:bg-[#F5F0EA] transition-colors py-2 px-5">
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-[#275C53]/10 max-h-[70vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-0.5">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => setExpandedMobile(expandedMobile === item.label ? null : item.label)}
                      className="flex items-center justify-between w-full px-3 py-2.5 text-[14px] text-[#192026]/70 hover:text-[#275C53] hover:bg-[#F5F0EA] rounded-lg transition-colors font-semibold uppercase tracking-[1px] cursor-pointer"
                    >
                      {item.label}
                      <svg
                        className={`w-4 h-4 text-[#275C53]/40 transition-transform duration-200 ${expandedMobile === item.label ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedMobile === item.label && (
                      <div className="ml-3 pl-3 border-l-2 border-[#275C53]/10 space-y-0.5 pb-2">
                        <Link href={item.href} onClick={() => setMobileOpen(false)}
                          className="block px-3 py-2 text-[13px] text-[#275C53] font-semibold hover:bg-[#F5F0EA] rounded-lg transition-colors">
                          View All {item.label}
                        </Link>
                        {item.children.map((child) =>
                          isMenuGroup(child) ? (
                            <div key={child.label} className="pt-2">
                              <span className="block px-3 py-1 text-[10px] uppercase tracking-[1.5px] font-bold text-[#275C53]/50">{child.label}</span>
                              {child.children.map((sub) => (
                                <Link key={sub.label} href={sub.href} onClick={() => setMobileOpen(false)}
                                  className="block px-3 py-2 text-[13px] text-[#192026]/60 hover:text-[#275C53] hover:bg-[#F5F0EA] rounded-lg transition-colors">
                                  {sub.label}
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <Link key={child.label} href={(child as MenuItem).href} onClick={() => setMobileOpen(false)}
                              className={`block px-3 py-2 text-[13px] rounded-lg transition-colors ${
                                (child as MenuItem).highlight
                                  ? `${(child as MenuItem).highlight} px-3 py-1.5 rounded-full text-[11px] uppercase tracking-[1px] font-semibold inline-block mx-3 my-1`
                                  : 'text-[#192026]/60 hover:text-[#275C53] hover:bg-[#F5F0EA]'
                              }`}>
                              {child.label}
                            </Link>
                          )
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <Link href={item.href} onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2.5 text-[14px] hover:bg-[#F5F0EA] rounded-lg transition-colors font-semibold uppercase tracking-[1px] ${
                      item.highlight || 'text-[#192026]/70 hover:text-[#275C53]'
                    }`}>
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
