import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  generateLocationPage,
  getCitySlugsForState,
  getAllStateSlugs,
} from '@/lib/us-locations';

const BASE = 'https://royalkingseedsusa.vercel.app';

interface Props {
  params: Promise<{ state: string; city: string }>;
}

/* ── Static generation ── */
export async function generateStaticParams() {
  const states = getAllStateSlugs();
  const params: { state: string; city: string }[] = [];
  for (const s of states) {
    const cities = getCitySlugsForState(s.slug);
    for (const c of cities) {
      params.push({ state: s.slug, city: c.slug });
    }
  }
  return params;
}

/* ── Metadata ── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const slug = `buy-cannabis-seeds-in-${citySlug}-${stateSlug}`;
  const page = generateLocationPage(slug);
  if (!page) return { title: 'Not Found' };

  const stateEntry = getAllStateSlugs().find((s) => s.slug === stateSlug);
  const stateName = stateEntry?.state || stateSlug;
  const cities = getCitySlugsForState(stateSlug);
  const cityEntry = cities.find((c) => c.slug === citySlug);
  const cityName = cityEntry?.city || citySlug;

  const title = `Buy Cannabis Seeds in ${cityName}, ${stateName} | Royal King Seeds`;
  const description = `Buy premium cannabis seeds in ${cityName}, ${stateName}. Discreet shipping, 92% germination guarantee. Feminized, autoflower, and CBD strains for ${cityName} growers.`;

  return {
    title,
    description,
    alternates: { canonical: `${BASE}/seeds/usa/${stateSlug}/${citySlug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${BASE}/seeds/usa/${stateSlug}/${citySlug}`,
      siteName: 'Royal King Seeds USA',
      locale: 'en_US',
    },
  };
}

/* ── Category links ── */
const CATEGORIES = [
  { name: 'Feminized Seeds', slug: 'feminized-seeds' },
  { name: 'Autoflower Seeds', slug: 'autoflowering-seeds' },
  { name: 'CBD Seeds', slug: 'cbd-strains' },
  { name: 'High THC Seeds', slug: 'high-tch-seeds' },
  { name: 'Indica Seeds', slug: 'indica-seeds' },
  { name: 'Sativa Seeds', slug: 'sativa-seeds' },
];

export default async function CityPage({ params }: Props) {
  const { state: stateSlug, city: citySlug } = await params;
  const slug = `buy-cannabis-seeds-in-${citySlug}-${stateSlug}`;
  const page = generateLocationPage(slug);

  if (!page) {
    notFound();
  }

  const stateEntry = getAllStateSlugs().find((s) => s.slug === stateSlug);
  const stateName = stateEntry?.state || stateSlug;
  const cities = getCitySlugsForState(stateSlug);
  const cityEntry = cities.find((c) => c.slug === citySlug);
  const cityName = cityEntry?.city || citySlug;

  // Nearby cities: other cities in the same state, excluding current
  const nearbyCities = cities.filter((c) => c.slug !== citySlug).slice(0, 12);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="text-[12px] text-[#192026]/50 mb-6 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-[#275C53]">Home</Link>
        <span>/</span>
        <Link href="/seeds/usa" className="hover:text-[#275C53]">USA</Link>
        <span>/</span>
        <Link href={`/seeds/usa/${stateSlug}`} className="hover:text-[#275C53]">{stateName}</Link>
        <span>/</span>
        <span className="text-[#275C53]">{cityName}</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <h1
          className="text-2xl sm:text-3xl lg:text-4xl text-[#275C53] mb-4"
          style={{ fontFamily: 'var(--font-patua)' }}
        >
          Buy Cannabis Seeds in {cityName}, {stateName}
        </h1>
        <p className="text-[#192026]/70 text-sm sm:text-base leading-relaxed max-w-3xl">
          Royal King Seeds delivers premium cannabis seeds to {cityName}, {stateName} with discreet
          packaging and fast 3-5 day shipping. Shop 1,200+ strains with our 92% germination guarantee.
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

      {/* Category Quick Links */}
      <section className="mb-10">
        <h2
          className="text-lg sm:text-xl text-[#275C53] mb-4"
          style={{ fontFamily: 'var(--font-patua)' }}
        >
          Cannabis Seeds Available in {cityName}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/product-category/${cat.slug}`}
              className="bg-[#275C53] rounded-2xl p-4 text-center hover:bg-[#1e4a43] transition-colors"
            >
              <p className="text-[13px] font-semibold text-white">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Nearby Cities */}
      {nearbyCities.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-lg sm:text-xl text-[#275C53] mb-4"
            style={{ fontFamily: 'var(--font-patua)' }}
          >
            Other Cities in {stateName}
          </h2>
          <div className="flex flex-wrap gap-2">
            {nearbyCities.map((c) => (
              <Link
                key={c.slug}
                href={`/seeds/usa/${stateSlug}/${c.slug}`}
                className="px-3 py-1.5 bg-white border border-[#275C53]/10 rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors"
              >
                {c.city}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Back to state + CTA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <Link
          href={`/seeds/usa/${stateSlug}`}
          className="bg-white rounded-2xl border border-[#192026]/5 p-6 hover:shadow-md hover:border-[#275C53]/20 transition-all group text-center"
        >
          <p className="text-sm font-semibold text-[#275C53] group-hover:text-[#D7B65D] transition-colors">
            All {stateName} Seeds
          </p>
          <p className="text-[11px] text-[#192026]/40 mt-1">
            View all cities and strains in {stateName}
          </p>
        </Link>
        <Link
          href="/seeds/usa"
          className="bg-white rounded-2xl border border-[#192026]/5 p-6 hover:shadow-md hover:border-[#275C53]/20 transition-all group text-center"
        >
          <p className="text-sm font-semibold text-[#275C53] group-hover:text-[#D7B65D] transition-colors">
            All 50 States
          </p>
          <p className="text-[11px] text-[#192026]/40 mt-1">
            Browse cannabis seeds by state
          </p>
        </Link>
      </div>

      {/* Bottom CTA */}
      <section className="bg-[#275C53] rounded-2xl p-8 text-center">
        <h3
          className="text-xl text-white mb-3"
          style={{ fontFamily: 'var(--font-patua)' }}
        >
          Ready to Grow in {cityName}?
        </h3>
        <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
          Over 1,200 premium strains shipped discreetly to {cityName}, {stateName} with our
          92% germination guarantee.
        </p>
        <Link
          href="/product-category/shop-all-cannabis-seeds"
          className="inline-block bg-[#D7B65D] text-[#1a3d36] font-semibold px-6 py-3 rounded-full text-sm hover:bg-[#c9a94f] transition-colors"
        >
          Shop All Cannabis Seeds
        </Link>
      </section>

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
              { '@type': 'ListItem', position: 4, name: cityName, item: `${BASE}/seeds/usa/${stateSlug}/${citySlug}` },
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
            name: `Buy Cannabis Seeds in ${cityName}, ${stateName}`,
            description: `Premium cannabis seeds shipped discreetly to ${cityName}, ${stateName}.`,
            url: `${BASE}/seeds/usa/${stateSlug}/${citySlug}`,
            isPartOf: {
              '@type': 'WebSite',
              name: 'Royal King Seeds USA',
              url: BASE,
            },
            about: {
              '@type': 'City',
              name: cityName,
              containedInPlace: {
                '@type': 'State',
                name: stateName,
                containedInPlace: {
                  '@type': 'Country',
                  name: 'United States',
                },
              },
            },
          }),
        }}
      />

      {/* Structured Data — LocalBusiness */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Store',
            name: `Royal King Seeds — ${cityName}, ${stateName}`,
            url: `${BASE}/seeds/usa/${stateSlug}/${citySlug}`,
            description: `Buy cannabis seeds online in ${cityName}, ${stateName}. Discreet shipping with germination guarantee.`,
            areaServed: {
              '@type': 'City',
              name: cityName,
              containedInPlace: { '@type': 'State', name: stateName },
            },
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'Cannabis Seeds',
              itemListElement: CATEGORIES.map((c) => ({
                '@type': 'OfferCatalog',
                name: c.name,
                url: `${BASE}/product-category/${c.slug}`,
              })),
            },
          }),
        }}
      />
    </div>
  );
}
