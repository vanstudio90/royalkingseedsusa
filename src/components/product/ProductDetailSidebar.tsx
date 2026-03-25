'use client';

import Link from 'next/link';

interface TopStrain {
  name: string;
  slug: string;
}

export function ProductDetailSidebar({ productName, topStrains }: { productName: string; topStrains?: TopStrain[] }) {
  const defaultStrains: TopStrain[] = [
    { name: 'OG Kush Feminized', slug: 'og-kush-feminized' },
    { name: 'Granddaddy Purple Feminized', slug: 'granddaddy-purple-feminized' },
    { name: 'Hindu Kush Feminized', slug: 'hindu-kush-feminized' },
    { name: 'Fruity Pebbles Feminized', slug: 'fruity-pebbles-feminized' },
    { name: 'Forbidden Fruit Feminized', slug: 'forbidden-fruit-feminized' },
    { name: 'G13 Feminized', slug: 'g13-feminized' },
    { name: 'Acapulco Gold Auto', slug: 'acapulco-gold-auto' },
    { name: 'A-10 Auto', slug: 'a-10-auto' },
    { name: 'High Resin Pack', slug: 'high-resin-strains-mixpack' },
    { name: 'G.O.A.T Pack', slug: 'goat-mixpack' },
  ];

  const strains = topStrains || defaultStrains;

  return (
    <aside className="hidden lg:block w-[260px] shrink-0">
      <div className="sticky top-[120px] space-y-6">
        {/* Top 10 Strains */}
        <div className="bg-white rounded-2xl p-5 border border-[#275C53]/5">
          <h3 className="text-sm font-bold text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua), Patua One, serif' }}>Top 10 Strains</h3>
          <div className="space-y-1">
            {strains.map((strain, i) => (
              <Link
                key={strain.slug}
                href={`/${strain.slug}`}
                className="flex items-center gap-3 py-2 group hover:bg-[#F5F0EA] rounded-lg px-2 -mx-2 transition-colors"
              >
                <span className="w-5 h-5 rounded-full bg-[#275C53]/10 flex items-center justify-center text-[10px] font-bold text-[#275C53] shrink-0">
                  {i + 1}
                </span>
                <span className="text-[13px] text-[#192026]/60 group-hover:text-[#275C53] transition-colors leading-tight">
                  {strain.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Free Seeds promo */}
        <div className="bg-[#275C53] rounded-2xl p-5 text-white">
          <h3 className="text-sm font-bold mb-3" style={{ fontFamily: 'var(--font-patua), Patua One, serif' }}>Free Seeds</h3>
          <p className="text-[12px] text-white/70 leading-relaxed mb-3">& Eco Freebies with every order</p>
          <div className="space-y-1.5 text-[12px]">
            <div className="flex justify-between"><span>1 Free Seed*</span><span className="text-[#D7B65D]">$25</span></div>
            <div className="flex justify-between"><span>3 Free Seeds*</span><span className="text-[#D7B65D]">$50</span></div>
            <div className="flex justify-between"><span>5 Free Seeds*</span><span className="text-[#D7B65D]">$75</span></div>
            <div className="flex justify-between"><span>6 Free Seeds*</span><span className="text-[#D7B65D]">$110</span></div>
            <div className="flex justify-between"><span>10 Free Seeds*</span><span className="text-[#D7B65D]">$135</span></div>
          </div>
          <Link href="/product-category/shop-all-cannabis-seeds" className="block mt-4 text-center py-2 bg-[#D7B65D] text-[#275C53] rounded-full text-[11px] uppercase tracking-[1px] font-semibold hover:bg-[#c9a84e] transition-colors">
            More Free Seeds
          </Link>
        </div>

        {/* Free Shipping */}
        <div className="bg-white rounded-2xl p-5 border border-[#275C53]/5 text-center">
          <h3 className="text-sm font-bold text-[#275C53] mb-2" style={{ fontFamily: 'var(--font-patua), Patua One, serif' }}>Free Shipping</h3>
          <p className="text-[12px] text-[#192026]/50">to all of Canada 🇨🇦</p>
          <div className="flex justify-center gap-4 mt-3 text-[10px] text-[#192026]/40 uppercase tracking-[0.5px]">
            <div className="text-center">
              <span className="text-lg block mb-0.5">📦</span>
              Fast &<br/>Discreet
            </div>
            <div className="text-center">
              <span className="text-lg block mb-0.5">🔒</span>
              Stealth<br/>Shipping
            </div>
            <div className="text-center">
              <span className="text-lg block mb-0.5">📍</span>
              Track &<br/>Trace
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
