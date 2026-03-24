'use client';

import Link from 'next/link';
import { useWishlistStore } from '@/stores/wishlist-store';
import { ProductCard } from '@/components/product/ProductCard';

export default function FavoritesPage() {
  const items = useWishlistStore((s) => s.items);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl text-[#275C53] mb-2" style={{ fontFamily: 'var(--font-patua)' }}>Your Favorites</h1>
      <p className="text-[#192026]/70 text-sm mb-8">{items.length} {items.length === 1 ? 'strain' : 'strains'} saved</p>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#192026]/50 mb-4">No favorites saved yet</p>
          <Link href="/product-category/shop-all-cannabis-seeds" className="btn-main">Browse Seeds</Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <button onClick={clearWishlist} className="text-sm text-[#192026]/50 hover:text-[#275C53] cursor-pointer">Clear all favorites</button>
          </div>
        </>
      )}
    </div>
  );
}
