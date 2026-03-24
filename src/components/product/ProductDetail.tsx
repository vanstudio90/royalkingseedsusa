'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/products/types';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';

export function ProductDetail({ product, relatedProducts }: { product: Product; relatedProducts: Product[] }) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));
  const toggleCart = useCartStore((s) => s.toggleCart);

  const seedOpts: { label: string; price: number }[] = (product.seedOptions || []).map((opt: any) => {
    if (typeof opt === 'object' && opt.label) return { label: opt.label, price: parseFloat(opt.price) || 0 };
    return { label: String(opt), price: product.price };
  });

  const [selectedOption, setSelectedOption] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const hasVariants = seedOpts.length > 1;
  const currentPrice = hasVariants ? seedOpts[selectedOption]?.price || product.price : product.price;

  const typeLabel = {
    indica: { text: 'Indica', color: 'bg-purple-100 text-purple-700' },
    sativa: { text: 'Sativa', color: 'bg-amber-100 text-amber-700' },
    hybrid: { text: 'Hybrid', color: 'bg-emerald-100 text-emerald-700' },
    cbd: { text: 'CBD', color: 'bg-blue-100 text-blue-700' },
  }[product.strainType];

  const handleAddToCart = () => {
    const variant = hasVariants ? seedOpts[selectedOption] : undefined;
    addItem(product, quantity, variant);
    toggleCart();
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'grow-guide', label: 'Grow Guide' },
    { id: 'faqs', label: 'FAQs' },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="text-[12px] text-[#192026]/50 mb-6 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-[#275C53]">Home</Link>
        <span>/</span>
        <Link href="/product-category/shop-all-cannabis-seeds" className="hover:text-[#275C53]">Cannabis Seeds</Link>
        <span>/</span>
        <span className="text-[#275C53]">{product.name}</span>
      </nav>

      {/* Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <div className="bg-white rounded-3xl p-8 flex items-center justify-center aspect-square border border-[#275C53]/5">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
          ) : (
            <span className="text-8xl opacity-30">🌱</span>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${typeLabel.color}`}>{typeLabel.text}</span>
            {product.autoflower && <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-cyan-100 text-cyan-700">Autoflower</span>}
            {product.feminized && <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-pink-100 text-pink-700">Feminized</span>}
            {product.thcContent && <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-[#275C53]/10 text-[#275C53]">THC {product.thcContent}%</span>}
          </div>

          <h1 className="text-2xl sm:text-3xl text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>{product.name}</h1>

          <p className="text-[#192026]/70 text-sm leading-relaxed mb-6">{product.shortDescription || product.description.slice(0, 300)}</p>

          {/* Effects */}
          {product.effects.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {product.effects.map((effect) => (
                <span key={effect} className="text-[11px] px-2.5 py-1 rounded-full bg-[#275C53]/10 text-[#275C53] font-medium">{effect}</span>
              ))}
            </div>
          )}

          {/* Strain Specs */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { label: 'Strain Type', value: product.strainType.charAt(0).toUpperCase() + product.strainType.slice(1) },
              { label: 'THC Content', value: product.thcContent ? `${product.thcContent}%` : 'Varies' },
              { label: 'Flowering Time', value: product.floweringTime || (product.autoflower ? '8-10 weeks' : '9-11 weeks') },
              { label: 'Difficulty', value: product.difficulty || (product.autoflower ? 'Beginner' : 'Intermediate') },
              { label: 'Indoor Yield', value: product.indoorYield || '14-18 oz/m²' },
              { label: 'Plant Height', value: product.plantHeight || 'Medium' },
            ].map((spec) => (
              <div key={spec.label} className="bg-[#F5F0EA] rounded-xl p-3">
                <span className="text-[10px] uppercase tracking-[1px] text-[#192026]/50 font-medium">{spec.label}</span>
                <p className="text-sm text-[#275C53] font-medium mt-0.5">{spec.value}</p>
              </div>
            ))}
          </div>

          {/* Variant Selector */}
          {hasVariants && (
            <div className="mb-4">
              <label className="text-[12px] uppercase tracking-[1px] text-[#192026]/50 font-medium mb-2 block">Pack Size</label>
              <div className="flex gap-2 flex-wrap">
                {seedOpts.map((opt, i) => (
                  <button key={i} onClick={() => setSelectedOption(i)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border ${
                      selectedOption === i ? 'bg-[#275C53] text-white border-[#275C53]' : 'bg-white text-[#192026] border-[#275C53]/20 hover:border-[#275C53]/40'
                    }`}>
                    {opt.label} — ${opt.price.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price & Add to Cart */}
          <div className="flex items-center gap-4 mb-6 pt-4 border-t border-[#275C53]/10">
            <div>
              <span className="text-3xl font-semibold text-[#275C53]">${currentPrice.toFixed(2)}</span>
              <span className="text-sm text-[#192026]/70 ml-1">USD</span>
            </div>
            <div className="flex items-center gap-2 bg-[#F5F0EA] rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-[#192026]/60 hover:text-[#275C53] cursor-pointer">-</button>
              <span className="w-8 text-center text-sm font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-[#192026]/60 hover:text-[#275C53] cursor-pointer">+</button>
            </div>
            <button onClick={handleAddToCart} className="btn-main flex-1">Add to Cart</button>
          </div>

          {/* Wishlist */}
          <button onClick={() => toggleWishlist(product)}
            className={`flex items-center gap-2 text-sm font-medium cursor-pointer transition-colors ${isInWishlist ? 'text-red-500' : 'text-[#192026]/50 hover:text-red-400'}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {isInWishlist ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>

          {/* Shipping Note */}
          <div className="mt-6 bg-[#275C53]/5 rounded-xl p-4 flex items-start gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#275C53" strokeWidth="1.5" className="shrink-0 mt-0.5">
              <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5a2 2 0 01-2 2h-1"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            <div>
              <p className="text-sm text-[#275C53] font-medium">Free shipping on orders over $99 USD</p>
              <p className="text-[12px] text-[#192026]/60 mt-0.5">Discreet packaging, ships to all 50 states. 3-7 business day delivery.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-14">
        <div className="flex gap-1 border-b border-[#275C53]/10 mb-8">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-[13px] font-medium uppercase tracking-[1px] transition-colors cursor-pointer border-b-2 ${
                activeTab === tab.id ? 'text-[#275C53] border-[#275C53]' : 'text-[#192026]/40 border-transparent hover:text-[#275C53]'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="prose prose-sm max-w-none text-[#192026]/80">
            <p>{product.description}</p>
            <h3 className="text-[#275C53]">Why Buy {product.name} from Royal King Seeds?</h3>
            <p>Royal King Seeds is a trusted American seed bank offering {product.name} with fast, discreet shipping to all 50 states. Every order includes our germination guarantee, ensuring you get viable seeds that perform. Whether you&apos;re a first-time grower in California or an experienced cultivator in Colorado, our {product.strainType} genetics are selected for quality and consistency.</p>
            <p>This strain is ideal for growers looking for {product.effects.join(', ').toLowerCase() || 'balanced'} effects. {product.autoflower ? 'As an autoflowering variety, it flowers automatically in 8-10 weeks regardless of light schedule, making it perfect for beginners and growers wanting multiple harvests per season.' : 'As a photoperiod strain, it gives experienced growers full control over vegetative and flowering stages for maximum yield potential.'}</p>
            <h3 className="text-[#275C53]">Growing {product.name} in the United States</h3>
            <p>{product.name} thrives in a variety of US climates. Indoor growers can expect yields of {product.indoorYield || '14-18 oz/m²'} with proper lighting and nutrient management. Outdoor cultivators in states like California, Oregon, Colorado, and Michigan will find this strain performs well in their regional conditions. The flowering time is approximately {product.floweringTime || '8-10 weeks'}, and the difficulty level is rated as {product.difficulty || 'Intermediate'}.</p>
          </div>
        )}

        {activeTab === 'grow-guide' && (
          <div className="prose prose-sm max-w-none text-[#192026]/80">
            <h3 className="text-[#275C53]">How to Grow {product.name}</h3>
            <p>Growing {product.name} successfully requires attention to a few key factors. Here&apos;s our recommended approach for American growers:</p>
            <h4>Germination</h4>
            <p>Use the paper towel method: place seeds between damp paper towels in a warm, dark location (70-80°F). Seeds typically crack within 24-72 hours. Transfer to your growing medium once the taproot reaches 0.5-1 inch.</p>
            <h4>Vegetative Stage</h4>
            <p>Provide 18-20 hours of light during the vegetative phase. {product.autoflower ? 'Autoflowering strains will transition to flowering automatically after 3-4 weeks.' : 'Keep your plants in veg until they reach the desired size, then switch to 12/12 light cycle to trigger flowering.'} Maintain temperatures between 70-85°F and relative humidity around 50-60%.</p>
            <h4>Flowering &amp; Harvest</h4>
            <p>During flowering, maintain 12 hours of light (for photoperiod strains). Expect flowering to take {product.floweringTime || '8-10 weeks'}. Monitor trichomes with a jeweler&apos;s loupe. Harvest when trichomes are mostly milky with some amber for peak potency and effect.</p>
            <h4>Expected Yields</h4>
            <p>Indoor: {product.indoorYield || '14-18 oz/m²'} | Outdoor: {product.outdoorYield || '16-24 oz/plant'} | Plant Height: {product.plantHeight || 'Medium'}</p>
          </div>
        )}

        {activeTab === 'faqs' && (
          <div className="space-y-4 max-w-3xl">
            {[
              { q: `How many seeds should I buy for ${product.name}?`, a: `We recommend starting with our 5-seed pack if you're trying ${product.name} for the first time. Experienced growers may prefer the 10 or 20-seed packs for better value and multiple grows.` },
              { q: `Is ${product.name} good for beginners?`, a: `${product.autoflower ? `Yes! ${product.name} is an autoflowering strain, which means it flowers automatically and is very forgiving for new growers.` : `${product.name} is rated as ${product.difficulty || 'Intermediate'} difficulty. Beginners can succeed with proper research and attention to the grow guide above.`}` },
              { q: `What are the main effects of ${product.name}?`, a: `${product.name} is known for ${product.effects.length > 0 ? product.effects.join(', ').toLowerCase() : 'balanced'} effects. The ${product.strainType} genetics provide ${product.strainType === 'indica' ? 'relaxing body effects ideal for evening use' : product.strainType === 'sativa' ? 'uplifting cerebral effects perfect for daytime activities' : 'a balanced blend of both body and cerebral effects'}.` },
              { q: `How long does ${product.name} take to flower?`, a: `${product.name} has an approximate flowering time of ${product.floweringTime || '8-10 weeks'}. ${product.autoflower ? 'As an autoflower, the total seed-to-harvest time is typically 10-12 weeks.' : 'Add 4-8 weeks of vegetative growth before the flowering period begins.'}` },
            ].map((faq, i) => (
              <details key={i} className="bg-white rounded-2xl border border-[#275C53]/5">
                <summary className="px-6 py-4 cursor-pointer text-[#275C53] font-medium text-sm flex items-center justify-between">
                  {faq.q}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#275C53]/40 shrink-0 ml-4"><polyline points="6 9 12 15 18 9" /></svg>
                </summary>
                <div className="px-6 pb-4 text-[13px] text-[#192026]/70 leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl sm:text-2xl text-[#275C53] mb-8" style={{ fontFamily: 'var(--font-patua)' }}>
            Related Cannabis Seeds You Might Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <Link key={p.id} href={`/${p.slug}`} className="product-card group block">
                <div className="product-image aspect-square bg-white flex items-center justify-center relative mb-4 overflow-hidden">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} loading="lazy" className="w-full h-full object-contain p-3" />
                  ) : (
                    <span className="text-5xl opacity-40">🌱</span>
                  )}
                </div>
                <h3 className="title-underline font-normal text-[#275C53] text-sm leading-snug">{p.name}</h3>
                <div className="mt-2 pt-2 border-t border-[#F5F0EA]">
                  <span className="text-base font-semibold text-[#275C53]">From ${p.price.toFixed(2)} USD</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Internal Links */}
      <div className="mt-14 pt-8 border-t border-[#275C53]/10">
        <h3 className="text-sm font-semibold text-[#275C53] mb-4">Browse More Cannabis Seeds</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'All Seeds', slug: 'shop-all-cannabis-seeds' },
            { name: 'Feminized', slug: 'feminized-seeds' },
            { name: 'Autoflower', slug: 'autoflowering-seeds' },
            { name: 'Indica', slug: 'indica-seeds' },
            { name: 'Sativa', slug: 'sativa-seeds' },
            { name: 'Hybrid', slug: 'hybrid' },
            { name: 'CBD', slug: 'cbd-strains' },
            { name: 'High THC', slug: 'high-tch-seeds' },
            { name: 'Kush', slug: 'kush-seeds' },
            { name: 'Best Sellers', slug: 'best-seller' },
          ].map((cat) => (
            <Link key={cat.slug} href={`/product-category/${cat.slug}`}
              className="px-3 py-1 bg-[#F5F0EA] rounded-full text-[11px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
