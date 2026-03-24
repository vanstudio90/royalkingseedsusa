import Link from 'next/link';
import type { Metadata } from 'next';
import { fetchWcProducts } from '@/lib/woocommerce';

export const metadata: Metadata = {
  title: 'Royal King Seeds USA — Buy Cannabis Seeds Online | Discreet US Shipping',
  description: 'Shop 1,000+ premium cannabis seeds online at Royal King Seeds. Feminized, autoflower, CBD, indica, sativa, and hybrid seeds with discreet shipping across the United States. Germination guarantee on every order.',
  alternates: { canonical: 'https://royalkingseedsusa.vercel.app' },
};

export default async function HomePage() {
  const { products } = await fetchWcProducts(1, 12);

  const featuredByType = {
    indica: products.filter(p => p.strainType === 'indica').slice(0, 2),
    sativa: products.filter(p => p.strainType === 'sativa').slice(0, 2),
    hybrid: products.filter(p => p.strainType === 'hybrid').slice(0, 2),
    cbd: products.filter(p => p.strainType === 'cbd').slice(0, 2),
  };
  const featured = [...featuredByType.indica, ...featuredByType.sativa, ...featuredByType.hybrid, ...featuredByType.cbd].slice(0, 8);

  return (
    <>
      {/* Hero Section */}
      <section className="hero-gradient text-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl max-w-4xl mx-auto leading-tight" style={{ fontFamily: 'var(--font-patua)' }}>
            Premium Cannabis Seeds<br />Shipped Discreetly Across the USA
          </h1>
          <p className="mt-6 text-white/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Over 1,000 feminized, autoflower, and CBD strains from America&apos;s trusted seed bank. Fast delivery to all 50 states with our germination guarantee.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/product-category/shop-all-cannabis-seeds" className="btn-main !bg-[#D7B65D] !text-[#1a3d36] hover:!bg-[#c9a84e]">
              Shop All Seeds
            </Link>
            <Link href="/product-category/feminized-seeds" className="btn-second !border-white/30 !text-white hover:!bg-white/10">
              Feminized Seeds
            </Link>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-14">
        <h2 className="text-2xl sm:text-3xl text-[#275C53] text-center mb-10" style={{ fontFamily: 'var(--font-patua)' }}>
          Shop by Seed Type
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'Feminized Seeds', slug: 'feminized-seeds', desc: '1,000+ strains, 99.9% female guarantee', icon: '♀' },
            { name: 'Autoflower Seeds', slug: 'autoflowering-seeds', desc: 'Harvest in 8-10 weeks, beginner-friendly', icon: '⚡' },
            { name: 'Indica Strains', slug: 'indica-seeds', desc: 'Deep relaxation and pain relief genetics', icon: '🌙' },
            { name: 'Sativa Strains', slug: 'sativa-seeds', desc: 'Energizing daytime strains for focus', icon: '☀️' },
            { name: 'High THC Seeds', slug: 'high-tch-seeds', desc: '25%+ THC for experienced cultivators', icon: '🔥' },
            { name: 'CBD Seeds', slug: 'cbd-strains', desc: 'Therapeutic and low-THC varieties', icon: '💚' },
          ].map((cat) => (
            <Link key={cat.slug} href={`/product-category/${cat.slug}`}
              className="bg-white rounded-2xl p-5 text-center hover:shadow-lg hover:-translate-y-1 transition-all border border-[#275C53]/5 group">
              <div className="text-3xl mb-3">{cat.icon}</div>
              <h3 className="text-sm font-semibold text-[#275C53] group-hover:text-[#D7B65D] transition-colors">{cat.name}</h3>
              <p className="text-[11px] text-[#192026]/60 mt-1 leading-relaxed">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white/50">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-14">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl sm:text-3xl text-[#275C53]" style={{ fontFamily: 'var(--font-patua)' }}>
              Featured Cannabis Seeds
            </h2>
            <Link href="/product-category/shop-all-cannabis-seeds" className="text-sm text-[#275C53] hover:text-[#D7B65D] font-medium transition-colors">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => (
              <Link key={p.id} href={`/${p.slug}`} className="product-card group block">
                <div className="product-image aspect-square bg-white flex items-center justify-center relative mb-4 overflow-hidden">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} loading="lazy" className="w-full h-full object-contain p-3" />
                  ) : (
                    <span className="text-5xl opacity-40">🌱</span>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                      p.strainType === 'indica' ? 'bg-purple-100 text-purple-700' :
                      p.strainType === 'sativa' ? 'bg-amber-100 text-amber-700' :
                      p.strainType === 'cbd' ? 'bg-blue-100 text-blue-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>{p.strainType.charAt(0).toUpperCase() + p.strainType.slice(1)}</span>
                  </div>
                  {p.thcContent && (
                    <div className="absolute top-3 right-3 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/80 text-[#275C53]">THC {p.thcContent}%</div>
                  )}
                </div>
                <h3 className="title-underline font-normal text-[#275C53] text-sm leading-snug">{p.name}</h3>
                <div className="mt-3 pt-3 border-t border-[#F5F0EA]">
                  <span className="text-lg font-semibold text-[#275C53]">
                    <span className="text-[11px] text-[#192026]/70 font-normal">From </span>${p.price.toFixed(2)}
                    <span className="text-[11px] text-[#192026]/70 ml-1 font-normal">USD</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl text-[#275C53] text-center mb-4" style={{ fontFamily: 'var(--font-patua)' }}>
          Why American Growers Choose Royal King Seeds
        </h2>
        <p className="text-center text-[#192026]/70 max-w-2xl mx-auto mb-12">
          We combine premium genetics, competitive pricing, and discreet US-wide delivery to give home growers the best cannabis seed buying experience in America.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: '1,200+ Cannabis Seed Strains', desc: 'From classic OG Kush and Girl Scout Cookies to exotic new genetics, our catalog covers every preference, growing environment, and experience level across the United States.', link: '/product-category/shop-all-cannabis-seeds' },
            { title: 'Discreet Delivery to All 50 States', desc: 'Every order ships in plain packaging with no external branding. We protect your privacy from checkout to doorstep with fast USPS and UPS delivery options.', link: '/shipping' },
            { title: 'Germination Guarantee Program', desc: 'Our seed replacement policy covers eligible orders. If your seeds don\'t germinate following our guide, we replace them at no extra cost to you.', link: '/faq' },
            { title: 'Expert Growing Guides & Support', desc: 'Access free cultivation guides covering germination, indoor growing, autoflower techniques, nutrient schedules, and harvest timing for American climates.', link: '/blog' },
            { title: 'Secure SSL Payment Processing', desc: 'Shop with confidence using Visa, Mastercard, or cryptocurrency. Our checkout is protected with bank-level SSL encryption for every transaction.', link: '/faq' },
            { title: 'Real Customer Support Team', desc: 'Our knowledgeable team responds to emails within 24 hours. Get help choosing strains, troubleshooting grows, or tracking your order status.', link: '/contact' },
          ].map((item) => (
            <Link key={item.title} href={item.link} className="bg-white rounded-2xl p-6 border border-[#275C53]/5 hover:shadow-md hover:-translate-y-1 transition-all group">
              <h3 className="text-base font-semibold text-[#275C53] mb-2 group-hover:text-[#D7B65D] transition-colors">{item.title}</h3>
              <p className="text-[13px] text-[#192026]/70 leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="bg-[#275C53] text-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl sm:text-3xl text-center mb-10" style={{ fontFamily: 'var(--font-patua)' }}>
            Popular Seed Categories for US Growers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Best Seller Seeds', slug: 'best-seller', desc: 'Our most popular strains chosen by American growers for proven performance and reliability.' },
              { name: 'Kush Seeds', slug: 'kush-seeds', desc: 'Classic kush genetics including OG Kush, Bubba Kush, and Purple Kush varieties with dense, resinous buds.' },
              { name: 'Mix Packs', slug: 'mix-packs', desc: 'Curated seed packs combining multiple strains at a discount. Perfect for growers who want variety.' },
              { name: 'USA Premium Seeds', slug: 'usa-premium-cannabis-seeds', desc: 'Hand-selected premium genetics specifically chosen for the American market and US growing conditions.' },
            ].map((cat) => (
              <Link key={cat.slug} href={`/product-category/${cat.slug}`} className="bg-white/10 rounded-2xl p-6 hover:bg-white/15 transition-colors border border-white/10">
                <h3 className="text-base font-semibold text-[#D7B65D] mb-2">{cat.name}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl text-[#275C53] text-center mb-10" style={{ fontFamily: 'var(--font-patua)' }}>
          Frequently Asked Questions About Buying Cannabis Seeds in the USA
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            { q: 'Is it legal to buy cannabis seeds online in the United States?', a: 'Cannabis seeds are sold as adult novelty souvenirs and for genetic preservation purposes. Laws vary by state, and buyers are responsible for understanding their local regulations before germinating seeds. Many states now allow home cultivation for personal use.' },
            { q: 'How long does shipping take within the United States?', a: 'Most orders ship within 1-2 business days and arrive within 3-7 business days depending on your location. We offer USPS and UPS delivery options with tracking on every order.' },
            { q: 'Do you ship to all 50 states?', a: 'Yes, we offer discreet shipping to all 50 states. Orders ship in plain, unmarked packaging with no external indication of the contents for your privacy.' },
            { q: 'What is your germination guarantee?', a: 'We stand behind our seed quality. If your seeds fail to germinate when following our recommended germination guide, we will replace them at no additional cost through our seed replacement program.' },
            { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, and cryptocurrency payments. All transactions are processed through our SSL-encrypted secure checkout for your protection.' },
            { q: 'What is the difference between feminized and autoflower seeds?', a: 'Feminized seeds produce 99.9% female plants and require a light schedule change to trigger flowering. Autoflower seeds flower automatically based on age (typically 8-10 weeks), making them ideal for beginners and growers wanting faster harvests.' },
            { q: 'How do I choose the right cannabis seeds for my climate?', a: 'For hot, humid climates like the South, choose mold-resistant strains. For shorter northern growing seasons, autoflowers or fast-flowering varieties are ideal. Indoor growers can choose any strain. Our support team can help you pick the best genetics for your specific location.' },
            { q: 'Do you offer bulk or wholesale pricing?', a: 'Yes, we offer pack sizes from 5 to 20+ seeds with volume discounts. Mix packs let you try multiple strains at reduced prices. Contact our support team for custom bulk orders.' },
          ].map((faq, i) => (
            <details key={i} className="bg-white rounded-2xl border border-[#275C53]/5 group">
              <summary className="px-6 py-4 cursor-pointer text-[#275C53] font-medium text-sm flex items-center justify-between">
                {faq.q}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#275C53]/40 shrink-0 ml-4 group-open:rotate-180 transition-transform">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div className="px-6 pb-4 text-[13px] text-[#192026]/70 leading-relaxed">{faq.a}</div>
            </details>
          ))}
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                { "@type": "Question", name: "Is it legal to buy cannabis seeds online in the United States?", acceptedAnswer: { "@type": "Answer", text: "Cannabis seeds are sold as adult novelty souvenirs and for genetic preservation purposes. Laws vary by state, and buyers are responsible for understanding their local regulations." } },
                { "@type": "Question", name: "How long does shipping take within the United States?", acceptedAnswer: { "@type": "Answer", text: "Most orders ship within 1-2 business days and arrive within 3-7 business days depending on your location." } },
                { "@type": "Question", name: "Do you ship to all 50 states?", acceptedAnswer: { "@type": "Answer", text: "Yes, we offer discreet shipping to all 50 states in plain, unmarked packaging." } },
                { "@type": "Question", name: "What is your germination guarantee?", acceptedAnswer: { "@type": "Answer", text: "If your seeds fail to germinate following our guide, we replace them at no additional cost." } },
              ],
            }),
          }}
        />
      </section>

      {/* Internal Links Section */}
      <section className="bg-white/50 border-t border-[#275C53]/5">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-xl text-[#275C53] mb-6" style={{ fontFamily: 'var(--font-patua)' }}>
            Browse Cannabis Seeds by Category
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Shop All Seeds', slug: 'shop-all-cannabis-seeds' },
              { name: 'Feminized Seeds', slug: 'feminized-seeds' },
              { name: 'Autoflower Seeds', slug: 'autoflowering-seeds' },
              { name: 'Indica Seeds', slug: 'indica-seeds' },
              { name: 'Sativa Seeds', slug: 'sativa-seeds' },
              { name: 'Hybrid Seeds', slug: 'hybrid' },
              { name: 'CBD Seeds', slug: 'cbd-strains' },
              { name: 'High THC Seeds', slug: 'high-tch-seeds' },
              { name: 'Kush Seeds', slug: 'kush-seeds' },
              { name: 'Mix Packs', slug: 'mix-packs' },
              { name: 'Classic Seeds', slug: 'classic-cannabis-seeds' },
              { name: 'Exotic Seeds', slug: 'exotic-cannabis-seeds' },
              { name: 'Fruity Seeds', slug: 'fruity-cannabis-seeds' },
              { name: 'Purple Genetics', slug: 'purple-genetics-seeds' },
              { name: 'Euphoric Seeds', slug: 'euphoric-seeds' },
              { name: 'Energizing Seeds', slug: 'energizing-cannabis-seeds' },
              { name: 'Best Sellers', slug: 'best-seller' },
              { name: 'Anxiety Relief', slug: 'best-strains-for-anxiety' },
              { name: 'Outdoor Growing', slug: 'best-strains-for-outdoor-growing' },
              { name: 'BOGO Seeds', slug: 'bogo-seeds' },
              { name: 'Seeds on Sale', slug: 'cannabis-seeds-on-sale' },
              { name: 'USA Premium', slug: 'usa-premium-cannabis-seeds' },
            ].map((cat) => (
              <Link key={cat.slug} href={`/product-category/${cat.slug}`}
                className="px-3 py-1.5 bg-white border border-[#275C53]/10 rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
