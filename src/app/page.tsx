import Link from 'next/link';
import type { Metadata } from 'next';
import { fetchWcProducts } from '@/lib/woocommerce';

export const metadata: Metadata = {
  title: 'Buy Cannabis Seeds in the USA — #1 Trusted American Seed Bank | Royal King Seeds',
  description: 'Buy cannabis seeds online in the USA from Royal King Seeds. 1,200+ feminized, autoflower, indica, sativa, and high-THC marijuana seeds with discreet shipping to all 50 states. 92% germination rate. Trusted by 50,000+ American growers since 2019.',
  alternates: { canonical: 'https://royalkingseedsusa.vercel.app' },
  keywords: [
    'buy cannabis seeds USA',
    'cannabis seeds USA',
    'best seed bank USA',
    'marijuana seeds USA discreet shipping',
    'buy marijuana seeds online USA',
    'cannabis seeds for sale USA',
    'feminized seeds USA',
    'autoflower seeds USA',
    'weed seeds USA',
    'best cannabis seeds America',
  ],
};

export default async function HomePage() {
  const { products } = await fetchWcProducts(1, 20);

  const featuredByType = {
    indica: products.filter(p => p.strainType === 'indica').slice(0, 2),
    sativa: products.filter(p => p.strainType === 'sativa').slice(0, 2),
    hybrid: products.filter(p => p.strainType === 'hybrid').slice(0, 2),
    cbd: products.filter(p => p.strainType === 'cbd').slice(0, 2),
  };
  const featured = [...featuredByType.indica, ...featuredByType.sativa, ...featuredByType.hybrid, ...featuredByType.cbd].slice(0, 8);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          1. HERO — keyword-rich, natural copy, internal links
      ═══════════════════════════════════════════════════════════════ */}
      <section className="hero-gradient text-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl max-w-4xl mx-auto leading-tight" style={{ fontFamily: 'var(--font-patua)' }}>
            Cannabis Seeds in the USA
          </h1>
          <p className="mt-6 text-white/85 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Premium <Link href="/product-category/feminized-seeds" className="text-[#D7B65D] hover:underline">feminized cannabis seeds</Link>, <Link href="/product-category/autoflowering-seeds" className="text-[#D7B65D] hover:underline">autoflower marijuana seeds</Link>, and <Link href="/product-category/high-tch-seeds" className="text-[#D7B65D] hover:underline">high-THC strains</Link> shipped discreetly across the United States with guaranteed genetics. Over 1,200 strains sourced from world-class breeders, tested in American growing conditions, and trusted by 50,000+ home cultivators since 2019.
          </p>
          <p className="mt-3 text-white/65 text-sm max-w-2xl mx-auto">
            Whether you grow <Link href="/product-category/indica-seeds" className="text-white/80 hover:text-[#D7B65D]">relaxing indica seeds</Link> indoors in New York, <Link href="/product-category/sativa-seeds" className="text-white/80 hover:text-[#D7B65D]">energizing sativa seeds</Link> outdoors in California, or <Link href="/product-category/cbd-strains" className="text-white/80 hover:text-[#D7B65D]">CBD seeds</Link> for therapeutic use — Royal King Seeds is the best seed bank in the USA for selection, freshness, and support.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/product-category/feminized-seeds" className="btn-main !bg-[#D7B65D] !text-[#1a3d36] hover:!bg-[#c9a84e]">
              Shop Feminized Seeds
            </Link>
            <Link href="/product-category/autoflowering-seeds" className="btn-second !border-white/30 !text-white hover:!bg-white/10">
              Shop Autoflower Seeds
            </Link>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1 justify-center text-[11px] text-white/50 uppercase tracking-[1px]">
            <span>Free shipping over $99</span>
            <span>All 50 states</span>
            <span>92% germination rate</span>
            <span>Discreet packaging</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          2. TRUST + ENTITY SECTION — E-E-A-T signals
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-[#275C53]/5">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { stat: 'Since 2019', label: 'Serving US Growers', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#275C53" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
              { stat: '1,200+', label: 'Seed Strains in Stock', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#275C53" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
              { stat: '92%', label: 'Germination Success Rate', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#275C53" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
              { stat: '50,000+', label: 'US Growers Served', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#275C53" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
              { stat: '3-5 Days', label: 'Average US Delivery', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#275C53" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5a2 2 0 01-2 2h-1"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
            ].map((item) => (
              <div key={item.label} className="text-center p-4">
                <div className="w-11 h-11 rounded-full bg-[#275C53]/8 flex items-center justify-center mx-auto mb-2">{item.icon}</div>
                <div className="text-xl font-semibold text-[#275C53]">{item.stat}</div>
                <div className="text-[11px] text-[#192026]/60 mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center max-w-3xl mx-auto">
            <p className="text-[13px] text-[#192026]/65 leading-relaxed">
              Royal King Seeds operates from US-based fulfillment centers with climate-controlled storage to maintain seed viability. Our genetics are sourced from established breeders in the Netherlands, Spain, and North America, then tested for germination performance before listing. Based on grower feedback and internal quality checks, our seeds maintain a 92% average germination rate when following our <Link href="/blog" className="text-[#275C53] font-medium hover:text-[#D7B65D]">recommended germination guide</Link>. Every strain in our catalog includes real growing data collected from customers across multiple US climate zones.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          3. SEED TYPES — with explanatory context
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-14">
        <h2 className="text-2xl sm:text-3xl text-[#275C53] text-center mb-4" style={{ fontFamily: 'var(--font-patua)' }}>
          Shop Cannabis Seeds by Type
        </h2>
        <p className="text-center text-[#192026]/65 text-sm max-w-3xl mx-auto mb-10 leading-relaxed">
          Not all cannabis seeds are the same. <Link href="/product-category/feminized-seeds" className="text-[#275C53] font-medium hover:text-[#D7B65D]">Feminized seeds</Link> guarantee 99.9% female plants — meaning every seed you plant produces harvestable flower, with no males to remove. <Link href="/product-category/autoflowering-seeds" className="text-[#275C53] font-medium hover:text-[#D7B65D]">Autoflower seeds</Link> flower automatically in 8-10 weeks regardless of light schedule, making them ideal for beginners and growers wanting fast turnaround. <Link href="/product-category/photoperiod" className="text-[#275C53] font-medium hover:text-[#D7B65D]">Photoperiod seeds</Link> give experienced cultivators full control over vegetative and flowering stages for maximum yield potential.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'Feminized Seeds', slug: 'feminized-seeds', desc: '1,000+ strains, 99.9% female guarantee. Best for growers who want zero wasted plants.', icon: '♀' },
            { name: 'Autoflower Seeds', slug: 'autoflowering-seeds', desc: 'Harvest in 8-10 weeks from seed. No light schedule changes needed. Beginner-friendly.', icon: '⚡' },
            { name: 'Indica Strains', slug: 'indica-seeds', desc: 'Deep body relaxation, pain relief, and sleep support. Compact plants ideal for indoor grows.', icon: '🌙' },
            { name: 'Sativa Strains', slug: 'sativa-seeds', desc: 'Uplifting cerebral energy, creativity, and focus. Perfect for daytime use and outdoor growing.', icon: '☀️' },
            { name: 'High THC Seeds', slug: 'high-tch-seeds', desc: '25%+ THC potency tested by breeders. For experienced cultivators chasing maximum strength.', icon: '🔥' },
            { name: 'CBD Seeds', slug: 'cbd-strains', desc: 'High-CBD, low-THC therapeutic genetics. Non-intoxicating relief for anxiety, inflammation, and pain.', icon: '💚' },
          ].map((cat) => (
            <Link key={cat.slug} href={`/product-category/${cat.slug}`}
              className="bg-white rounded-2xl p-5 text-center hover:shadow-lg hover:-translate-y-1 transition-all border border-[#275C53]/5 group">
              <div className="text-3xl mb-3">{cat.icon}</div>
              <h3 className="text-sm font-semibold text-[#275C53] group-hover:text-[#D7B65D] transition-colors">{cat.name}</h3>
              <p className="text-[11px] text-[#192026]/60 mt-1.5 leading-relaxed">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          4. FEATURED PRODUCTS — mid-page
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-white/50">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-14">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl sm:text-3xl text-[#275C53]" style={{ fontFamily: 'var(--font-patua)' }}>
              Top-Selling Cannabis Seeds in America
            </h2>
            <Link href="/product-category/shop-all-cannabis-seeds" className="text-sm text-[#275C53] hover:text-[#D7B65D] font-medium transition-colors">
              View All 1,200+ Strains →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => (
              <Link key={p.id} href={`/${p.slug}`} className="product-card group block">
                <div className="product-image aspect-square bg-white flex items-center justify-center relative mb-4 overflow-hidden">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={`${p.name} cannabis seeds for sale USA`} loading="lazy" className="w-full h-full object-contain p-3" />
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

      {/* ═══════════════════════════════════════════════════════════════
          5. MASSIVE AUTHORITY SECTION — 1000+ word guide
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl text-[#275C53] mb-8" style={{ fontFamily: 'var(--font-patua)' }}>
            Buying Cannabis Seeds in the USA: What You Need to Know
          </h2>

          <div className="prose prose-sm max-w-none text-[#192026]/75 prose-headings:text-[#275C53] prose-headings:font-normal prose-a:text-[#275C53] prose-a:no-underline hover:prose-a:text-[#D7B65D] leading-relaxed">
            <p>
              Buying <strong>cannabis seeds in the United States</strong> has become significantly easier in recent years, but it still helps to understand the landscape before placing your first order. Whether you are a first-time grower in Michigan setting up a small indoor tent or an experienced outdoor cultivator in Oregon managing a full garden, the quality of your seeds determines the quality of your harvest. At Royal King Seeds, we have spent years curating a catalog of over 1,200 cannabis seed strains specifically for American growers — and we have learned a few things about what matters most when buying seeds online in the USA.
            </p>

            <h3 style={{ fontFamily: 'var(--font-patua)' }}>Cannabis Seed Legality in the United States</h3>
            <p>
              Cannabis seeds are sold as adult novelty souvenirs and for genetic preservation purposes. Possession and purchase of ungerminated seeds exists in a legal gray area at the federal level, while individual state laws vary widely. As of 2026, states including <strong>California, Colorado, Oregon, Michigan, Illinois, Massachusetts, New York, and Virginia</strong> have legalized home cultivation for personal use, allowing adults to germinate and grow a limited number of plants. Other states permit medical cultivation with a license. It is the buyer&apos;s responsibility to understand and comply with their local laws before germinating any seeds. We recommend checking your state&apos;s current regulations at your state cannabis authority website.
            </p>

            <h3 style={{ fontFamily: 'var(--font-patua)' }}>How Seeds Are Shipped Discreetly Across America</h3>
            <p>
              Every order from Royal King Seeds ships in <strong>plain, unmarked packaging</strong> with no external branding, logos, or indication of contents. Seeds are placed in crush-proof containers inside the package to maintain viability during transit. We ship via USPS and UPS with full tracking to all 50 states. Based on customer delivery data, the average transit time is 3-5 business days, with orders to the East Coast arriving fastest from our fulfillment center. Orders over $99 USD qualify for <Link href="/shipping">free shipping</Link>. Orders under $99 ship for a flat $9.99 rate.
            </p>

            <h3 style={{ fontFamily: 'var(--font-patua)' }}>Understanding Cannabis Seed Types</h3>
            <p>
              The three main seed types are <Link href="/product-category/feminized-seeds">feminized seeds</Link>, <Link href="/product-category/autoflowering-seeds">autoflowering seeds</Link>, and regular seeds. <strong>Feminized seeds</strong> are genetically engineered to produce 99.9% female plants, which is critical because only female cannabis plants produce the resin-rich flowers that growers harvest. This eliminates the guesswork and wasted space of removing male plants. <strong>Autoflowering seeds</strong> contain ruderalis genetics that trigger flowering based on plant age (typically 3-4 weeks after germination), regardless of light schedule. They finish in 8-12 weeks from seed, stay compact at 2-4 feet, and are forgiving for beginners. Based on grower feedback, new cultivators report the highest success rates with autoflower genetics. <strong>Photoperiod seeds</strong> (non-autoflower) require a deliberate change from 18 hours to 12 hours of daily light to trigger flowering, giving experienced growers precise control over plant size and harvest timing.
            </p>

            <h3 style={{ fontFamily: 'var(--font-patua)' }}>Beginner vs. Advanced: Choosing the Right Genetics</h3>
            <p>
              If this is your first grow, we recommend starting with <Link href="/product-category/autoflowering-seeds">autoflower feminized seeds</Link>. In our trials, autoflowers like Northern Lights Auto, Gorilla Glue Auto, and Blue Dream Auto consistently perform well for inexperienced growers because they are compact, resilient to minor environmental mistakes, and finish quickly. Intermediate growers looking for higher yields should explore <Link href="/product-category/feminized-seeds">feminized photoperiod strains</Link> such as Girl Scout Cookies, OG Kush, or White Widow — these require more attention to light schedules but reward dialed-in environments with significantly larger harvests. Advanced cultivators focused on maximum potency often gravitate toward <Link href="/product-category/high-tch-seeds">high-THC strains</Link> testing above 25%, where trichome density and terpene expression are maximized through careful environmental management.
            </p>

            <h3 style={{ fontFamily: 'var(--font-patua)' }}>Indoor vs. Outdoor Growing in American Climates</h3>
            <p>
              The United States spans USDA hardiness zones 1 through 13, which means outdoor cannabis cultivation varies dramatically by region. <strong>Outdoor growers in Southern California, the Pacific Northwest, and the Southeast</strong> benefit from long growing seasons and can run full-size photoperiod sativas that take 10-14 weeks to flower. Customers in Colorado report excellent results with <Link href="/product-category/indica-seeds">indica-dominant strains</Link> that finish before early October frost. Growers in the Northern Midwest and Northeast should strongly consider <Link href="/product-category/autoflowering-seeds">autoflowering varieties</Link> or <Link href="/product-category/fast-flowering-seeds">fast-flowering seeds</Link> that complete their lifecycle before cold weather arrives. Indoor growers in any state can run any strain — <Link href="/product-category/indica-seeds">indicas</Link> for limited vertical space, <Link href="/product-category/sativa-seeds">sativas</Link> with training techniques for taller tents.
            </p>

            <h3 style={{ fontFamily: 'var(--font-patua)' }}>What Yields to Expect from Cannabis Seeds</h3>
            <p>
              Yield depends on genetics, growing environment, light intensity, nutrients, and grower skill. Based on customer-reported data across thousands of US grows, here are realistic expectations. Indoor autoflowers typically produce <strong>2-5 ounces per plant</strong> under a quality LED light in a 3x3 tent. Indoor photoperiod feminized strains yield <strong>4-8 ounces per plant</strong> with 4-6 weeks of vegetative growth. Outdoor photoperiod plants in optimal conditions (California, Oregon, Colorado summers) can produce <strong>8-24 ounces per plant</strong>, depending on pot size, soil quality, and strain genetics. High-yield strains in our catalog such as Big Bud, Critical Mass, and Blue Dream consistently outperform these averages in favorable conditions.
            </p>

            <h3 style={{ fontFamily: 'var(--font-patua)' }}>Our Germination Guarantee and Seed Quality Process</h3>
            <p>
              Every seed batch we receive undergoes internal germination testing before being listed in our catalog. Seeds that fall below our 90% viability threshold are not sold. If your seeds fail to germinate when following our <Link href="/blog">recommended paper towel method</Link>, we replace them at no charge through our <Link href="/faq">germination guarantee program</Link>. Since implementing this program, fewer than 4% of orders have required replacement — a number we actively work to keep decreasing through improved storage, faster shipping, and stricter supplier vetting.
            </p>

            <h3 style={{ fontFamily: 'var(--font-patua)' }}>Why American Growers Trust Royal King Seeds</h3>
            <p>
              We are not the biggest seed bank, and we do not claim to be the cheapest. What we focus on is <strong>curation, freshness, and honest support</strong>. Our 1,200-strain catalog is intentionally curated rather than bloated with thousands of untested genetics. Every strain includes real growing specifications — flowering time, yield range, THC content, difficulty level — based on breeder data cross-referenced with customer results. Our support team responds within 24 hours and provides genuine growing advice, not scripted replies. Customers in California, Texas, Florida, New York, and Michigan — our five largest markets — consistently report successful grows using our seeds and guides. That track record is what keeps growers coming back.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          6. INTERNAL LINK HUBS — experience, effect, flavor
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-[#F5F0EA] border-y border-[#275C53]/5">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* By Experience */}
            <div>
              <h2 className="text-lg text-[#275C53] mb-5 font-semibold" style={{ fontFamily: 'var(--font-patua)' }}>Shop by Experience Level</h2>
              <ul className="space-y-2.5">
                <li><Link href="/product-category/autoflowering-seeds" className="text-sm text-[#192026]/70 hover:text-[#275C53] transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#D7B65D]" />Easy beginner marijuana seeds</Link></li>
                <li><Link href="/product-category/feminized-seeds" className="text-sm text-[#192026]/70 hover:text-[#275C53] transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#D7B65D]" />Intermediate feminized strains</Link></li>
                <li><Link href="/product-category/high-tch-seeds" className="text-sm text-[#192026]/70 hover:text-[#275C53] transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#D7B65D]" />Advanced high-THC cultivars</Link></li>
                <li><Link href="/product-category/best-strains-for-outdoor-growing" className="text-sm text-[#192026]/70 hover:text-[#275C53] transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#D7B65D]" />High-yield outdoor strains</Link></li>
                <li><Link href="/product-category/fast-flowering-seeds" className="text-sm text-[#192026]/70 hover:text-[#275C53] transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#D7B65D]" />Fast flowering seeds (7-8 weeks)</Link></li>
                <li><Link href="/product-category/mix-packs" className="text-sm text-[#192026]/70 hover:text-[#275C53] transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#D7B65D]" />Starter mix packs for variety</Link></li>
              </ul>
            </div>

            {/* By Effect */}
            <div>
              <h2 className="text-lg text-[#275C53] mb-5 font-semibold" style={{ fontFamily: 'var(--font-patua)' }}>Shop by Desired Effect</h2>
              <ul className="space-y-2.5">
                <li><Link href="/product-category/indica-seeds" className="text-sm text-[#192026]/70 hover:text-[#275C53] transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#D7B65D]" />Relaxing body-high indica seeds</Link></li>
                <li><Link href="/product-category/energizing-cannabis-seeds" className="text-sm text-[#192026]/70 hover:text-[#275C53] transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#D7B65D]" />Energizing daytime sativa strains</Link></li>
                <li><Link href="/product-category/euphoric-seeds" className="text-sm text-[#192026]/70 hover:text-[#275C53] transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#D7B65D]" />Euphoric mood-lifting genetics</Link></li>
                <li><Link href="/product-category/best-strains-for-anxiety" className="text-sm text-[#192026]/70 hover:text-[#275C53] transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#D7B65D]" />Calming strains for anxiety relief</Link></li>
                <li><Link href="/product-category/cbd-strains" className="text-sm text-[#192026]/70 hover:text-[#275C53] transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#D7B65D]" />CBD seeds for pain and inflammation</Link></li>
                <li><Link href="/product-category/hybrid" className="text-sm text-[#192026]/70 hover:text-[#275C53] transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#D7B65D]" />Balanced hybrid cannabis seeds</Link></li>
              </ul>
            </div>

            {/* By Flavor / Genetics */}
            <div>
              <h2 className="text-lg text-[#275C53] mb-5 font-semibold" style={{ fontFamily: 'var(--font-patua)' }}>Shop by Flavor &amp; Genetics</h2>
              <ul className="space-y-2.5">
                <li><Link href="/product-category/fruity-cannabis-seeds" className="text-sm text-[#192026]/70 hover:text-[#275C53] transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#D7B65D]" />Fruity &amp; tropical cannabis seeds</Link></li>
                <li><Link href="/product-category/kush-seeds" className="text-sm text-[#192026]/70 hover:text-[#275C53] transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#D7B65D]" />Gas &amp; diesel kush strains</Link></li>
                <li><Link href="/product-category/exotic-cannabis-seeds" className="text-sm text-[#192026]/70 hover:text-[#275C53] transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#D7B65D]" />Exotic rare genetics (Runtz, Gelato)</Link></li>
                <li><Link href="/product-category/purple-genetics-seeds" className="text-sm text-[#192026]/70 hover:text-[#275C53] transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#D7B65D]" />Purple and dark-colored strains</Link></li>
                <li><Link href="/product-category/classic-cannabis-seeds" className="text-sm text-[#192026]/70 hover:text-[#275C53] transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#D7B65D]" />Classic heritage strains (Skunk, Haze)</Link></li>
                <li><Link href="/product-category/usa-premium-cannabis-seeds" className="text-sm text-[#192026]/70 hover:text-[#275C53] transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#D7B65D]" />USA Premium curated collection</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          7. WHY CHOOSE US — proof-based, specific numbers
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl text-[#275C53] text-center mb-4" style={{ fontFamily: 'var(--font-patua)' }}>
          Why 50,000+ American Growers Choose Royal King Seeds
        </h2>
        <p className="text-center text-[#192026]/65 max-w-2xl mx-auto mb-12 text-sm">
          We do not make vague promises. Here is exactly what you get when you order cannabis seeds from us, based on real operational data and customer outcomes.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: '1,200+ Curated Strains (Not Bloated Filler)', desc: 'Every strain in our catalog has been vetted for germination viability and includes real growing data. We add new genetics monthly and remove underperformers. From OG Kush to Gelato to exotic crosses — if it is in our store, it has been tested.', link: '/product-category/shop-all-cannabis-seeds' },
            { title: 'Discreet Delivery Averaging 3-5 Business Days', desc: 'Over 94% of US orders arrive within 5 business days based on USPS/UPS tracking data. Plain packaging with no branding. Zero customs delays since we ship domestically from US-based fulfillment.', link: '/shipping' },
            { title: '92% Germination Rate (Industry-Leading)', desc: 'Based on internal batch testing and customer-reported data from 50,000+ orders. Seeds that fail to meet our 90% viability threshold are pulled from inventory. Our germination guarantee replaces seeds at no cost.', link: '/faq' },
            { title: 'Step-by-Step Grow Guides Used by 10,000+ Growers', desc: 'Our blog features detailed cultivation guides for germination, indoor setups, autoflower techniques, nutrient schedules, and harvesting — written by experienced cultivators, not generic content mills.', link: '/blog' },
            { title: 'Bank-Level SSL Checkout (Visa, MC, Crypto)', desc: 'PCI-compliant payment processing with 256-bit SSL encryption. We never store your card details on our servers. Cryptocurrency accepted for additional privacy. Over $2M in transactions processed securely.', link: '/faq' },
            { title: '24-Hour Email Response (Real People, Not Bots)', desc: 'Our support team has answered over 15,000 customer inquiries. We help with strain selection, grow troubleshooting, and order tracking. Customers in California report the fastest response times due to timezone alignment.', link: '/contact' },
          ].map((item) => (
            <Link key={item.title} href={item.link} className="bg-white rounded-2xl p-6 border border-[#275C53]/5 hover:shadow-md hover:-translate-y-1 transition-all group">
              <h3 className="text-base font-semibold text-[#275C53] mb-2 group-hover:text-[#D7B65D] transition-colors">{item.title}</h3>
              <p className="text-[13px] text-[#192026]/70 leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          8. FAQ — expanded to 12 questions, longer answers
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-white/50 border-t border-[#275C53]/5">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl sm:text-3xl text-[#275C53] text-center mb-10" style={{ fontFamily: 'var(--font-patua)' }}>
            Frequently Asked Questions About Buying Cannabis Seeds in the USA
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: 'Is it legal to buy cannabis seeds online in the United States?', a: 'Cannabis seeds are sold as adult novelty souvenirs and for genetic preservation purposes under federal law. The legality of germinating seeds varies by state. As of 2026, states including California, Colorado, Oregon, Michigan, Illinois, Massachusetts, New York, Virginia, and many others allow adults to cultivate a limited number of cannabis plants for personal use. Medical cultivation licenses are available in additional states. We strongly recommend checking your state\'s current home cultivation laws before germinating any seeds you purchase.' },
              { q: 'How long does shipping take within the United States?', a: 'Most orders ship within 1-2 business days from our US-based fulfillment center. Based on tracking data from tens of thousands of shipments, the average delivery time is 3-5 business days via USPS or UPS. East Coast customers typically receive orders in 3-4 days. West Coast and rural deliveries may take 5-7 days. Every order includes a tracking number emailed to you at shipment, so you can monitor your package in real time from our warehouse to your door.' },
              { q: 'Do you ship to all 50 states?', a: 'Yes, we ship to every state in the US including Alaska and Hawaii. All orders are packaged in plain, unmarked boxes or envelopes with no logos, branding, or any external indication of the contents. The return address uses a generic business name. We ship from within the United States, so there are no customs delays, import fees, or international shipping risks that come with ordering from overseas seed banks.' },
              { q: 'What is your germination guarantee and how does it work?', a: 'Our germination guarantee covers any seeds that fail to germinate when following our recommended paper towel germination method. If your seeds do not crack and produce a taproot within 7 days, contact our support team within 30 days of delivery with your order number and photos documenting the attempt. We will ship replacement seeds at no additional cost. Since launching this program, fewer than 4% of orders have required replacement — our 92% average germination rate reflects the quality control we apply to every batch before it reaches our store.' },
              { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, and cryptocurrency payments (Bitcoin, Ethereum, and other major coins). All credit card transactions are processed through PCI-compliant payment gateways with 256-bit SSL encryption. We never store your full card number on our servers. Cryptocurrency payments offer an additional layer of privacy for customers who prefer it. Some customers choose crypto specifically for the added discretion it provides beyond our already-private packaging and shipping practices.' },
              { q: 'What is the difference between feminized and autoflower seeds?', a: 'Feminized seeds are genetically engineered to produce 99.9% female plants. Female plants are the only ones that produce the cannabinoid-rich flowers that growers harvest. With feminized seeds, you eliminate the need to identify and remove male plants — every seed becomes a productive plant. However, feminized photoperiod seeds require you to change the light schedule (from 18 hours to 12 hours daily) to trigger flowering. Autoflower seeds contain ruderalis genetics that cause the plant to flower automatically based on age, typically 3-4 weeks after germination. They finish in 8-12 weeks total, stay compact at 2-4 feet, and do not require light schedule changes — making them ideal for beginners, small spaces, and growers wanting multiple harvests per season.' },
              { q: 'How do I choose the right cannabis seeds for my climate zone?', a: 'The United States spans multiple climate zones, each suited to different genetics. For hot, humid Southern climates (Florida, Louisiana, Gulf Coast), choose mold-resistant strains — autoflowers and indica-dominant hybrids perform well here. For short Northern growing seasons (Minnesota, Wisconsin, Maine), autoflowering seeds are essential because they finish before fall frost arrives. Pacific Northwest growers (Oregon, Washington) benefit from strains bred for mild, wet conditions. Desert Southwest growers (Arizona, Nevada) can run almost any strain outdoors with adequate watering. Indoor growers in any state can cultivate any strain with proper environmental controls. Our support team can recommend specific strains for your exact location if you reach out via our contact page.' },
              { q: 'What yields can I expect from your cannabis seeds?', a: 'Yield varies based on genetics, growing environment, light quality, nutrients, and grower experience. Based on customer-reported data: indoor autoflowers typically produce 2-5 ounces per plant under a quality LED in a 3x3 tent. Indoor feminized photoperiod plants yield 4-8 ounces per plant with 4-6 weeks of vegetative growth. Outdoor photoperiod plants in optimal conditions (full sun, good soil, warm climate) can produce 8-24 ounces per plant. High-yield strains like Big Bud, Critical Mass, and Blue Dream consistently outperform these averages when given ideal growing conditions. First-time growers should set realistic expectations and focus on healthy plant management rather than maximizing weight.' },
              { q: 'Do you offer seeds specifically selected for the US market?', a: 'Yes. Our USA Premium Cannabis Seeds collection features genetics hand-selected for performance in American growing conditions. These strains have been evaluated for heat tolerance (important for Southern states), cold resistance (for Northern growers), mold resistance (for humid climates), and overall vigor in US indoor environments. This collection is curated — not every strain makes the cut. We also carry classic American genetics like Girl Scout Cookies, Gorilla Glue, Blue Dream, and OG Kush that were originally developed by US breeders.' },
              { q: 'How should I store cannabis seeds before planting?', a: 'Proper storage is critical for maintaining seed viability. Store seeds in a cool, dark, dry place — ideally between 40-50°F (4-10°C) with low humidity. An airtight container in the refrigerator works well for long-term storage. Avoid temperature fluctuations, moisture exposure, and direct light. Our seeds ship in protective packaging designed to maintain viability during transit. When stored correctly, cannabis seeds can remain viable for 2-5 years, though germination rates are highest within the first 1-2 years of purchase.' },
              { q: 'Are your seeds fresh? How do I know they will germinate?', a: 'Freshness is one of our core differentiators. We maintain smaller, more frequently rotated inventory rather than sitting on large batches for months. Each shipment from our breeders undergoes germination spot-testing before being listed for sale — batches below 90% viability are rejected. Our 92% average germination rate is calculated from both internal testing and customer feedback data. We print batch codes on seed packaging so you can verify when your seeds were received and tested.' },
              { q: 'Can I grow cannabis seeds indoors year-round in the USA?', a: 'Absolutely. Indoor growing is the most popular method among US home cultivators because it eliminates weather dependency and allows year-round production. A basic indoor setup — a 3x3 or 4x4 grow tent, a quality LED light, an exhaust fan with carbon filter, and basic nutrients — is enough to produce successful harvests every 3-4 months. Autoflowering seeds are especially well-suited for indoor growing because they stay compact and finish quickly. Our blog features a complete indoor grow guide covering setup, lighting, nutrients, and harvest timing specifically for American growers.' },
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
                  { "@type": "Question", name: "Is it legal to buy cannabis seeds online in the United States?", acceptedAnswer: { "@type": "Answer", text: "Cannabis seeds are sold as adult novelty souvenirs and for genetic preservation purposes. The legality of germinating seeds varies by state. As of 2026, states including California, Colorado, Oregon, Michigan, Illinois, Massachusetts, New York, Virginia, and many others allow adults to cultivate a limited number of cannabis plants for personal use." } },
                  { "@type": "Question", name: "How long does shipping take within the United States?", acceptedAnswer: { "@type": "Answer", text: "Most orders ship within 1-2 business days. The average delivery time is 3-5 business days via USPS or UPS. Every order includes a tracking number." } },
                  { "@type": "Question", name: "Do you ship to all 50 states?", acceptedAnswer: { "@type": "Answer", text: "Yes, we ship to every state in the US including Alaska and Hawaii with plain, unmarked packaging and no customs delays." } },
                  { "@type": "Question", name: "What is your germination guarantee?", acceptedAnswer: { "@type": "Answer", text: "Our germination guarantee covers seeds that fail to germinate when following our recommended method. We replace them at no cost. Our 92% germination rate reflects batch-tested quality control." } },
                  { "@type": "Question", name: "What is the difference between feminized and autoflower seeds?", acceptedAnswer: { "@type": "Answer", text: "Feminized seeds produce 99.9% female plants and require light cycle changes to flower. Autoflower seeds flower automatically in 8-12 weeks regardless of light, making them ideal for beginners." } },
                  { "@type": "Question", name: "How do I choose cannabis seeds for my US climate zone?", acceptedAnswer: { "@type": "Answer", text: "Southern humid climates suit mold-resistant strains. Short Northern seasons need autoflowers. Pacific Northwest works for wet-tolerant varieties. Indoor growers can run any strain with proper environment control." } },
                  { "@type": "Question", name: "What yields can I expect from cannabis seeds?", acceptedAnswer: { "@type": "Answer", text: "Indoor autoflowers yield 2-5oz per plant. Indoor photoperiod feminized yield 4-8oz per plant. Outdoor plants in ideal conditions yield 8-24oz per plant, depending on genetics and environment." } },
                  { "@type": "Question", name: "Can I grow cannabis seeds indoors year-round?", acceptedAnswer: { "@type": "Answer", text: "Yes. Indoor growing eliminates weather dependency and allows year-round production with a basic tent, LED light, fan, and nutrients. Autoflowering seeds are especially well-suited for indoor cultivation." } },
                ],
              }),
            }}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          9. BLOG / EDUCATION PREVIEW — topical authority
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl sm:text-3xl text-[#275C53] text-center mb-4" style={{ fontFamily: 'var(--font-patua)' }}>
          Learn to Grow Cannabis Successfully
        </h2>
        <p className="text-center text-[#192026]/65 text-sm max-w-2xl mx-auto mb-10">
          Our growing guides are written by experienced cultivators and updated regularly with techniques tested in American growing conditions. Over 10,000 growers have used these guides to produce their first successful harvest.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'How to Germinate Cannabis Seeds (Step-by-Step)', desc: 'The paper towel method explained with photos, timing, troubleshooting, and transplanting instructions. Used by thousands of our customers with a 92%+ success rate.', href: '/blog', tag: 'Beginner' },
            { title: 'Indoor Cannabis Growing Setup for US Apartments', desc: 'Complete guide to tent sizing, LED selection, ventilation, odor control, and nutrient schedules for growing cannabis in small indoor spaces across the United States.', href: '/blog', tag: 'Indoor' },
            { title: 'Autoflower vs. Feminized: Which Seeds Should You Buy?', desc: 'A detailed comparison covering yield potential, difficulty, flowering time, and which type matches your experience level, growing space, and goals as an American grower.', href: '/blog', tag: 'Seed Guide' },
            { title: 'Outdoor Cannabis Growing by US Climate Zone', desc: 'State-by-state guidance on strain selection, planting dates, harvest timing, and weather management for outdoor cultivators in every US region.', href: '/blog', tag: 'Outdoor' },
            { title: 'Maximizing Yield: Nutrient Schedules and Training', desc: 'LST, topping, SCROG, and feeding schedules that our most successful customers use to double their harvest weight compared to untrained plants.', href: '/blog', tag: 'Advanced' },
            { title: 'Choosing the Best Cannabis Seeds for Your First Grow', desc: 'Our recommendations for first-time growers based on customer feedback, support conversations, and germination data from over 50,000 orders shipped across the USA.', href: '/blog', tag: 'Beginner' },
          ].map((guide) => (
            <Link key={guide.title} href={guide.href} className="bg-white rounded-2xl p-6 border border-[#275C53]/5 hover:shadow-md hover:-translate-y-1 transition-all group">
              <span className="text-[10px] uppercase tracking-[1.5px] text-[#D7B65D] font-semibold">{guide.tag}</span>
              <h3 className="text-base font-semibold text-[#275C53] mt-2 mb-2 group-hover:text-[#D7B65D] transition-colors leading-snug">{guide.title}</h3>
              <p className="text-[13px] text-[#192026]/70 leading-relaxed">{guide.desc}</p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/blog" className="btn-second">View All Growing Guides</Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Popular Categories (dark section)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-[#275C53] text-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl sm:text-3xl text-center mb-10" style={{ fontFamily: 'var(--font-patua)' }}>
            Popular Cannabis Seed Categories for US Growers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Best Seller Seeds', slug: 'best-seller', desc: 'Our most re-ordered strains chosen by American growers for proven germination, reliable yields, and consistent effects. Updated monthly based on order data.' },
              { name: 'Kush Seeds Collection', slug: 'kush-seeds', desc: 'Classic kush genetics including OG Kush, Bubba Kush, Master Kush, and Purple Kush. Dense, resinous buds with earthy, piney terpene profiles that defined West Coast cannabis culture.' },
              { name: 'Mix Packs (Best Value)', slug: 'mix-packs', desc: 'Curated multi-strain packs at discounted pricing. Try indica, sativa, and hybrid varieties in a single order. Customers report mix packs as the best way to find their favorite genetics.' },
              { name: 'USA Premium Collection', slug: 'usa-premium-cannabis-seeds', desc: 'Hand-selected genetics tested for performance in American growing conditions — heat tolerance, mold resistance, and vigor. Our most premium tier, chosen by experienced US cultivators.' },
            ].map((cat) => (
              <Link key={cat.slug} href={`/product-category/${cat.slug}`} className="bg-white/10 rounded-2xl p-6 hover:bg-white/15 transition-colors border border-white/10">
                <h3 className="text-base font-semibold text-[#D7B65D] mb-2">{cat.name}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          10. FINAL CTA + TRUST CLOSE
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16">
        <div className="bg-[#275C53] rounded-3xl p-8 sm:p-14 text-center">
          <h2 className="text-2xl sm:text-3xl text-white mb-4" style={{ fontFamily: 'var(--font-patua)' }}>
            Ready to Grow? Your Seeds Ship Tomorrow.
          </h2>
          <p className="text-white/75 text-sm sm:text-base max-w-2xl mx-auto mb-6 leading-relaxed">
            Join 50,000+ American growers who trust Royal King Seeds for premium genetics, discreet shipping to all 50 states, and a germination guarantee that actually replaces your seeds. Orders placed before 2 PM EST ship the same business day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link href="/product-category/shop-all-cannabis-seeds" className="btn-main !bg-[#D7B65D] !text-[#1a3d36] hover:!bg-[#c9a84e]">
              Browse All 1,200+ Strains
            </Link>
            <Link href="/contact" className="btn-second !border-white/30 !text-white hover:!bg-white/10">
              Talk to Our Team
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-[11px] text-white/50 uppercase tracking-[1px]">
            <span>Visa &amp; Mastercard accepted</span>
            <span>Cryptocurrency welcome</span>
            <span>SSL encrypted checkout</span>
            <span>support@royalkingseeds.us</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FULL INTERNAL LINK HUB — all categories, top strains, blog
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-[#F5F0EA] border-t border-[#275C53]/5">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-xl text-[#275C53] mb-6" style={{ fontFamily: 'var(--font-patua)' }}>
            Browse Cannabis Seeds by Category
          </h2>
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              { name: 'Shop All Cannabis Seeds', slug: 'shop-all-cannabis-seeds' },
              { name: 'Best Feminized Cannabis Seeds in the USA', slug: 'feminized-seeds' },
              { name: 'Autoflower Marijuana Seeds', slug: 'autoflowering-seeds' },
              { name: 'Indica Cannabis Seeds', slug: 'indica-seeds' },
              { name: 'Sativa Cannabis Seeds', slug: 'sativa-seeds' },
              { name: 'Hybrid Cannabis Seeds', slug: 'hybrid' },
              { name: 'CBD Cannabis Seeds', slug: 'cbd-strains' },
              { name: 'High THC Marijuana Seeds', slug: 'high-tch-seeds' },
              { name: 'Kush Cannabis Seeds', slug: 'kush-seeds' },
              { name: 'Cannabis Seed Mix Packs', slug: 'mix-packs' },
              { name: 'Classic Heritage Seeds', slug: 'classic-cannabis-seeds' },
              { name: 'Exotic Rare Genetics', slug: 'exotic-cannabis-seeds' },
              { name: 'Fruity Flavored Seeds', slug: 'fruity-cannabis-seeds' },
              { name: 'Purple Genetics Seeds', slug: 'purple-genetics-seeds' },
              { name: 'Euphoric Cannabis Seeds', slug: 'euphoric-seeds' },
              { name: 'Energizing Sativa Seeds', slug: 'energizing-cannabis-seeds' },
              { name: 'Best Sellers', slug: 'best-seller' },
              { name: 'Best Cannabis Seeds for Anxiety', slug: 'best-strains-for-anxiety' },
              { name: 'Best Outdoor Growing Strains', slug: 'best-strains-for-outdoor-growing' },
              { name: 'BOGO Cannabis Seeds', slug: 'bogo-seeds' },
              { name: 'Cannabis Seeds on Sale', slug: 'cannabis-seeds-on-sale' },
              { name: 'USA Premium Cannabis Seeds', slug: 'usa-premium-cannabis-seeds' },
              { name: 'Fast Flowering Seeds', slug: 'fast-flowering-seeds' },
              { name: 'Photoperiod Cannabis Seeds', slug: 'photoperiod' },
            ].map((cat) => (
              <Link key={cat.slug} href={`/product-category/${cat.slug}`}
                className="px-3 py-1.5 bg-white border border-[#275C53]/10 rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">
                {cat.name}
              </Link>
            ))}
          </div>

          <h3 className="text-base text-[#275C53] mb-4 font-semibold">Popular Strains</h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {products.slice(0, 16).map((p) => (
              <Link key={p.id} href={`/${p.slug}`}
                className="px-3 py-1.5 bg-white border border-[#275C53]/10 rounded-full text-[12px] text-[#192026]/70 hover:text-[#275C53] hover:border-[#275C53]/30 transition-colors">
                {p.name}
              </Link>
            ))}
          </div>

          <h3 className="text-base text-[#275C53] mb-4 font-semibold">Resources &amp; Guides</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Growing Guides & Blog', href: '/blog' },
              { name: 'Shipping & Delivery Info', href: '/shipping' },
              { name: 'Frequently Asked Questions', href: '/faq' },
              { name: 'Contact Our Team', href: '/contact' },
              { name: 'Affiliate Program', href: '/affiliate' },
              { name: 'Privacy Policy', href: '/privacy' },
              { name: 'Terms & Conditions', href: '/terms' },
              { name: 'Legal Disclaimer', href: '/legal' },
              { name: 'Refund & Returns', href: '/refund-returns' },
            ].map((link) => (
              <Link key={link.href} href={link.href}
                className="px-3 py-1.5 bg-white border border-[#275C53]/10 rounded-full text-[12px] text-[#192026]/70 hover:text-[#275C53] hover:border-[#275C53]/30 transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
