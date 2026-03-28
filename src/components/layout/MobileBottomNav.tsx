'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/stores/cart-store';

export function MobileBottomNav() {
  const pathname = usePathname();
  const toggleCart = useCartStore((s) => s.toggleCart);
  const totalItems = useCartStore((s) => s.totalItems());

  const isActive = (href: string) => pathname === href;

  return (
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

        {/* Search */}
        <Link href="/product-category/shop-all-cannabis-seeds" className="flex flex-col items-center gap-0.5 py-1 px-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={isActive('/product-category/shop-all-cannabis-seeds') ? '#275C53' : '#192026'} strokeWidth={isActive('/product-category/shop-all-cannabis-seeds') ? 2.2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className={`text-[10px] font-semibold ${isActive('/product-category/shop-all-cannabis-seeds') ? 'text-[#275C53]' : 'text-[#192026]/40'}`}>Search</span>
        </Link>

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
  );
}
