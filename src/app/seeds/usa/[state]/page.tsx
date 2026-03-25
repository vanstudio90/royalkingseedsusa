import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  generateLocationPage,
  getCitySlugsForState,
  getRelatedStates,
  getAllStateSlugs,
} from '@/lib/us-locations';

const BASE = 'https://royalkingseeds.us';

interface Props {
  params: Promise<{ state: string }>;
}

/* ── Static generation ── */
export async function generateStaticParams() {
  return getAllStateSlugs().map((s) => ({ state: s.slug }));
}

/* ── Metadata ── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const slug = stateSlug;
  const page = generateLocationPage(slug);
  if (!page) return { title: 'Not Found' };

  const stateEntry = getAllStateSlugs().find((s) => s.slug === stateSlug);
  const stateName = stateEntry?.state || stateSlug;

  const title = `Buy Cannabis Seeds in ${stateName} — Discreet Shipping`;
  const description = `Buy premium cannabis seeds in ${stateName} with fast, discreet shipping. Feminized, autoflower, and CBD seeds. 92% germination guarantee. Best strains for ${stateName} climate.`;

  return {
    title,
    description,
    alternates: { canonical: `${BASE}/seeds/usa/${stateSlug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${BASE}/seeds/usa/${stateSlug}`,
      siteName: 'Royal King Seeds USA',
      locale: 'en_US',
    },
  };
}

/* ── Helpers ── */
const CATEGORIES = [
  { name: 'Feminized Seeds', slug: 'feminized-seeds' },
  { name: 'Autoflower Seeds', slug: 'autoflowering-seeds' },
  { name: 'CBD Seeds', slug: 'cbd-strains' },
  { name: 'High THC Seeds', slug: 'high-tch-seeds' },
  { name: 'Indica Seeds', slug: 'indica-seeds' },
  { name: 'Sativa Seeds', slug: 'sativa-seeds' },
  { name: 'Kush Seeds', slug: 'kush-seeds' },
  { name: 'Exotic Seeds', slug: 'exotic-cannabis-seeds' },
];

export default async function StatePage({ params }: Props) {
  const { state: stateSlug } = await params;
  const slug = stateSlug;
  const page = generateLocationPage(slug);

  if (!page) {
    notFound();
  }

  const stateEntry = getAllStateSlugs().find((s) => s.slug === stateSlug);
  const stateName = stateEntry?.state || stateSlug;

  const cities = getCitySlugsForState(stateSlug);
  const related = getRelatedStates(stateSlug);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="text-[12px] text-[#192026]/50 mb-6 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-[#275C53]">Home</Link>
        <span>/</span>
        <Link href="/seeds/usa" className="hover:text-[#275C53]">USA</Link>
        <span>/</span>
        <span className="text-[#275C53]">{stateName}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        {/* Main content */}
        <main>
          <header className="mb-8">
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl text-[#275C53] mb-4"
              style={{ fontFamily: 'var(--font-patua)' }}
            >
              Buy Cannabis Seeds in {stateName}
            </h1>
            <p className="text-[#192026]/70 text-sm sm:text-base leading-relaxed max-w-3xl">
              Royal King Seeds ships premium cannabis seeds to {stateName} with discreet packaging and
              fast 3-5 day delivery. Browse 1,200+ strains including feminized, autoflower, and CBD
              genetics — all backed by our 92% germination guarantee.
            </p>
          </header>

          {/* Engine content */}
          <div className="bg-white rounded-2xl border border-[#192026]/5 p-6 sm:p-8 mb-10">
            <div
              className="prose prose-sm max-w-none text-[#192026]/80 prose-headings:text-[#275C53] prose-headings:font-normal prose-a:text-[#275C53] prose-a:no-underline hover:prose-a:underline prose-p:leading-relaxed prose-li:leading-relaxed prose-table:text-sm"
              style={{ fontFamily: 'var(--font-sans)' }}
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>

          {/* City Grid */}
          {cities.length > 0 && (
            <section className="mb-10">
              <h2
                className="text-xl sm:text-2xl text-[#275C53] mb-5"
                style={{ fontFamily: 'var(--font-patua)' }}
              >
                Buy Cannabis Seeds by City in {stateName}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {cities.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/seeds/usa/${stateSlug}/${c.slug}`}
                    className="bg-white rounded-2xl border border-[#192026]/5 p-4 hover:shadow-md hover:border-[#275C53]/20 transition-all group"
                  >
                    <p className="text-sm font-semibold text-[#275C53] group-hover:text-[#D7B65D] transition-colors">
                      {c.city}
                    </p>
                    <p className="text-[11px] text-[#192026]/40 mt-1">{stateName}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Category Quick Links */}
          <section className="mb-10">
            <h2
              className="text-xl sm:text-2xl text-[#275C53] mb-5"
              style={{ fontFamily: 'var(--font-patua)' }}
            >
              Shop Cannabis Seeds for {stateName}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/product-category/${cat.slug}`}
                  className="bg-[#275C53] rounded-2xl p-4 text-center hover:bg-[#1e4a43] transition-colors group"
                >
                  <p className="text-sm font-semibold text-white">{cat.name}</p>
                  <p className="text-[11px] text-white/60 mt-1">Shop now</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Related States */}
          {related.length > 0 && (
            <section className="mb-10 pt-8 border-t border-[#275C53]/10">
              <h3
                className="text-lg text-[#275C53] mb-4"
                style={{ fontFamily: 'var(--font-patua)' }}
              >
                Nearby States
              </h3>
              <div className="flex flex-wrap gap-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/seeds/usa/${r.slug}`}
                    className="px-3 py-1.5 bg-white border border-[#275C53]/10 rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors"
                  >
                    {r.state}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="bg-[#275C53] rounded-2xl p-8 text-center">
            <h3
              className="text-xl text-white mb-3"
              style={{ fontFamily: 'var(--font-patua)' }}
            >
              Start Growing in {stateName}
            </h3>
            <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
              Browse 1,200+ premium strains with discreet shipping to {stateName} and our 92%
              germination guarantee.
            </p>
            <Link
              href="/product-category/shop-all-cannabis-seeds"
              className="inline-block bg-[#D7B65D] text-[#1a3d36] font-semibold px-6 py-3 rounded-full text-sm hover:bg-[#c9a94f] transition-colors"
            >
              Shop All Cannabis Seeds
            </Link>
          </section>
        </main>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* State Quick Nav */}
          <div className="bg-white rounded-2xl p-6 border border-[#275C53]/5">
            <h3 className="text-sm font-semibold text-[#275C53] uppercase tracking-[1px] mb-4">
              {stateName} Seeds
            </h3>
            <div className="space-y-2">
              {cities.slice(0, 8).map((c) => (
                <Link
                  key={c.slug}
                  href={`/seeds/usa/${stateSlug}/${c.slug}`}
                  className="block text-[13px] text-[#192026]/60 hover:text-[#275C53] transition-colors"
                >
                  {c.city}
                </Link>
              ))}
              {cities.length > 8 && (
                <p className="text-[11px] text-[#192026]/40 mt-2">
                  +{cities.length - 8} more cities
                </p>
              )}
            </div>
          </div>

          {/* Shop CTA */}
          <div className="bg-[#275C53] rounded-2xl p-6 text-center">
            <h3 className="text-white font-semibold text-sm mb-2">Shop Cannabis Seeds</h3>
            <p className="text-white/70 text-[12px] mb-4">1,200+ strains with US-wide shipping</p>
            <Link
              href="/product-category/shop-all-cannabis-seeds"
              className="inline-block bg-[#D7B65D] text-[#1a3d36] font-semibold px-5 py-2 rounded-full text-[11px] hover:bg-[#c9a94f] transition-colors"
            >
              Browse Seeds
            </Link>
          </div>

          {/* Seed Categories */}
          <div className="bg-white rounded-2xl p-6 border border-[#275C53]/5">
            <h3 className="text-sm font-semibold text-[#275C53] uppercase tracking-[1px] mb-4">
              Seed Categories
            </h3>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/product-category/${cat.slug}`}
                  className="block text-[13px] text-[#192026]/60 hover:text-[#275C53] transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Growing Guides */}
          <div className="bg-white rounded-2xl p-6 border border-[#275C53]/5">
            <h3 className="text-sm font-semibold text-[#275C53] uppercase tracking-[1px] mb-4">
              Growing Guides
            </h3>
            <div className="space-y-2">
              {[
                { title: 'Germination Guide', slug: 'cannabis-seed-identification-and-feminization' },
                { title: 'Grow Lights', slug: 'cannabis-growing-lights-and-phases' },
                { title: 'Pest Management', slug: 'cannabis-pest-management' },
                { title: 'Harvesting Tips', slug: 'cannabis-trichomes-and-harvesting' },
              ].map((g) => (
                <Link
                  key={g.slug}
                  href={`/blog/${g.slug}`}
                  className="block text-[13px] text-[#192026]/60 hover:text-[#275C53] transition-colors"
                >
                  {g.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Nearby States (sidebar) */}
          {related.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-[#275C53]/5">
              <h3 className="text-sm font-semibold text-[#275C53] uppercase tracking-[1px] mb-4">
                Nearby States
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {related.slice(0, 6).map((r) => (
                  <Link
                    key={r.slug}
                    href={`/seeds/usa/${r.slug}`}
                    className="px-2.5 py-1 bg-[#F5F0EA] rounded-full text-[11px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors"
                  >
                    {r.state}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Structured Data — BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
              { '@type': 'ListItem', position: 2, name: 'Buy Cannabis Seeds in USA', item: `${BASE}/seeds/usa` },
              { '@type': 'ListItem', position: 3, name: stateName, item: `${BASE}/seeds/usa/${stateSlug}` },
            ],
          }),
        }}
      />

      {/* Structured Data — WebPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: `Buy Cannabis Seeds in ${stateName}`,
            description: `Premium cannabis seeds shipped discreetly to ${stateName} with germination guarantee.`,
            url: `${BASE}/seeds/usa/${stateSlug}`,
            isPartOf: {
              '@type': 'WebSite',
              name: 'Royal King Seeds USA',
              url: BASE,
            },
            about: {
              '@type': 'State',
              name: stateName,
              containedInPlace: {
                '@type': 'Country',
                name: 'United States',
              },
            },
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: cities.length,
              itemListElement: cities.slice(0, 20).map((c, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: `Buy Cannabis Seeds in ${c.city}, ${stateName}`,
                url: `${BASE}/seeds/usa/${stateSlug}/${c.slug}`,
              })),
            },
          }),
        }}
      />

      {/* Structured Data — FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: `Can I buy cannabis seeds in ${stateName}?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `Yes. Cannabis seeds are sold as adult novelty souvenirs and collectible genetics. Royal King Seeds ships discreetly to ${stateName} with fast 3-5 day delivery.`,
                },
              },
              {
                '@type': 'Question',
                name: `What are the best cannabis seeds to grow in ${stateName}?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `The best strains for ${stateName} depend on your local climate and grow setup. Autoflower seeds are great for shorter seasons, while feminized photoperiod strains work well for indoor growers. Check our ${stateName} city guides for climate-specific recommendations.`,
                },
              },
              {
                '@type': 'Question',
                name: `How fast is shipping to ${stateName}?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `Royal King Seeds typically delivers to ${stateName} within 3-5 business days using discreet packaging with no cannabis-related markings.`,
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}
