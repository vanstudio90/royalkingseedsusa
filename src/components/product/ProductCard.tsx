'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/products/types';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));
  const [imgError, setImgError] = useState(false);

  // Parse seed options
  const seedOpts: { label: string; price: number }[] = (product.seedOptions || []).map((opt: any) => {
    if (typeof opt === 'object' && opt.label) return { label: opt.label, price: parseFloat(opt.price) || 0 };
    return { label: String(opt), price: product.price };
  });

  const [selectedOption, setSelectedOption] = useState(0);
  const [added, setAdded] = useState(false);
  const hasVariants = seedOpts.length > 1;
  const currentPrice = hasVariants ? seedOpts[selectedOption]?.price || product.price : product.price;

  const typeLabel = {
    indica: { text: 'Indica', color: 'bg-purple-100 text-purple-700' },
    sativa: { text: 'Sativa', color: 'bg-amber-100 text-amber-700' },
    hybrid: { text: 'Hybrid', color: 'bg-emerald-100 text-emerald-700' },
    cbd: { text: 'CBD', color: 'bg-blue-100 text-blue-700' },
  }[product.strainType];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const variant = hasVariants ? seedOpts[selectedOption] : undefined;
    addItem(product, 1, variant);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="product-card group flex flex-col h-full">
      <Link href={`/${product.slug}`}>
        {/* Image */}
        <div className="product-image aspect-square bg-white flex items-center justify-center relative mb-3 sm:mb-5 overflow-hidden">
          {product.imageUrl && !product.imageUrl.startsWith('/images/seeds/') && !imgError && !product.imageUrl.match(/\.(jpg|jpeg)$/i) ? (
            <Image src={product.imageUrl} alt={product.name} width={300} height={300} loading="lazy" onError={() => setImgError(true)} className="w-full h-full object-contain p-1 sm:p-3 group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#275C53" strokeWidth="1" className="opacity-25 group-hover:opacity-40 transition-opacity">
                <path d="M12 22s-8-4-8-10V5l8-3 8 3v7c0 6-8 10-8 10z" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              <span className="text-[10px] text-[#275C53]/20 font-medium">Image Coming Soon</span>
            </div>
          )}
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${typeLabel.color}`}>
              {typeLabel.text}
            </span>
            {product.autoflower && (
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-700">
                Auto
              </span>
            )}
          </div>
          {product.thcContent && (
            <div className="absolute top-3 right-3 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/80 text-[#275C53]">
              THC {product.thcContent}%
            </div>
          )}

          {/* Wishlist heart */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
              isInWishlist
                ? 'bg-red-500 text-white shadow-md scale-110'
                : 'bg-white/80 text-[#192026]/50 hover:text-red-400 hover:bg-white shadow-sm'
            }`}
            aria-label={isInWishlist ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Title with gold underline hover */}
        <h3 className="title-underline font-normal text-[#275C53] text-sm sm:text-base leading-snug">
          {product.name}
        </h3>
      </Link>

      {/* Middle content - grows to fill space */}
      <div className="flex-grow">
        {/* Short description — hide on small mobile to save space */}
        <p className="hidden sm:block text-[13px] text-[#192026]/70 mt-2 leading-relaxed line-clamp-2">
          {product.shortDescription || product.description.replace(/^##.*/gm, '').trim().slice(0, 100)}
        </p>

        {/* Effects */}
        {product.effects.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1 mt-2 sm:mt-3">
            {product.effects.slice(0, 3).map((effect) => (
              <span key={effect} className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-[#275C53]/15 text-[#275C53] font-medium">
                {effect}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Pack Size Selector */}
      {hasVariants && (
        <div className="mt-2 sm:mt-3 px-1" onClick={(e) => e.preventDefault()}>
          <div className="relative">
            <select
              value={selectedOption}
              onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedOption(Number(e.target.value));
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="w-full appearance-none bg-white border border-[#275C53]/20 rounded-lg px-3 py-2 text-xs sm:text-sm text-[#192026] font-medium cursor-pointer hover:border-[#275C53]/40 focus:border-[#275C53] focus:outline-none transition-colors"
            >
              {seedOpts.map((opt, i) => (
                <option key={i} value={i}>
                  {opt.label} — ${opt.price.toFixed(2)}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#275C53" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Price & Add to Cart - always at bottom */}
      <div className="mt-auto pt-3 sm:pt-4 border-t border-[#F5F0EA]">
        <div className="text-center mb-2">
          <span className="text-lg sm:text-xl font-semibold text-[#275C53]">
            {!hasVariants && <span className="text-[10px] sm:text-[11px] text-[#192026]/70 font-normal">From </span>}
            ${currentPrice.toFixed(2)}
            <span className="text-[10px] sm:text-[11px] text-[#192026]/70 ml-1 font-normal">USD</span>
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          className={`w-full py-2 sm:py-2.5 text-white text-[10px] sm:text-[11px] uppercase tracking-[1px] font-medium rounded-lg transition-colors duration-300 cursor-pointer ${
            added
              ? 'bg-emerald-500 hover:bg-emerald-600'
              : 'bg-[#275C53] hover:bg-[#1e4a42]'
          }`}
        >
          {added ? '✓ Added' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
