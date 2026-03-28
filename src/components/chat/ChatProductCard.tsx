'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/products/types';
import { useCartStore } from '@/stores/cart-store';

export function ChatProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      className="flex gap-3 bg-white border border-[#275C53]/10 rounded-xl p-2.5 hover:border-[#275C53]/25 hover:shadow-sm transition-all relative"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {added && (
        <div className="absolute inset-x-0 -top-8 flex justify-center z-10">
          <div className="bg-[#275C53] text-white text-[10px] font-medium px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
            Added to Cart
          </div>
        </div>
      )}

      {/* Image */}
      <div className="w-12 h-12 rounded-lg bg-[#F5F0EA] overflow-hidden shrink-0 flex items-center justify-center">
        {product.imageUrl && !product.imageUrl.startsWith('/images/seeds/') ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-0.5" />
        ) : (
          <span className="text-lg opacity-30">🌱</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <Link href={`/${product.slug}`} className="font-semibold text-[#275C53] hover:text-[#D7B65D] transition-colors text-xs leading-tight truncate">
            {product.name}
          </Link>
          <span className="text-xs font-bold text-[#192026] shrink-0">${product.price}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] px-1.5 py-0.5 bg-[#275C53]/8 text-[#275C53] rounded-md capitalize">{product.strainType}</span>
          {product.thcContent && <span className="text-[10px] text-[#192026]/40">THC {product.thcContent}%</span>}
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex gap-1">
            {(product.effects || []).slice(0, 2).map((e) => (
              <span key={e} className="text-[9px] px-1.5 py-0.5 bg-[#D7B65D]/10 text-[#D7B65D] rounded-md">{e}</span>
            ))}
          </div>
          <button onClick={handleAdd} className="text-[10px] font-semibold px-2 py-1 bg-[#D7B65D] text-[#1a3d36] rounded-lg hover:bg-[#c9a84e] transition-colors cursor-pointer">
            {added ? '✓ Added' : '+ Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
