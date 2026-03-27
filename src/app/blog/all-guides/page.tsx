import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllBlogPosts } from '@/lib/blog-content';

export const metadata: Metadata = {
  title: 'All Cannabis Growing Guides — Complete Archive',
  description: 'Browse all cannabis growing guides, strain reviews, troubleshooting articles, and cultivation tips. Over 1,300 expert articles organized by topic.',
  alternates: { canonical: 'https://royalkingseeds.us/blog/all-guides' },
};

const ARCHIVE_LABELS: Record<string, string> = {
  strain: 'Strain Reviews',
  'pillar-nutrient': 'Nutrient Guides', 'support-nutrient': 'Nutrient Guides',
  'pillar-germ': 'Germination & Seedlings', 'support-seedling': 'Germination & Seedlings',
  'pillar-harvest': 'Harvest & Curing', 'support-harvest': 'Harvest & Curing', 'pillar-store': 'Harvest & Curing',
  'pillar-light': 'Lighting & Indoor', 'support-light': 'Lighting & Indoor',
  'pillar-pest': 'Pest & Disease', 'support-pest': 'Pest & Disease',
  'pillar-vpd': 'Climate & Environment', 'support-vpd': 'Climate & Environment', environment: 'Climate & Environment',
  'pillar-train': 'Training & Pruning', 'support-train': 'Training & Pruning',
  'pillar-auto': 'Autoflower Growing', 'support-auto': 'Autoflower Growing',
  'pillar-flower': 'Flowering & Bloom', 'support-flower': 'Flowering & Bloom',
  'support-medium': 'Growing Media', 'support-watering': 'Watering & pH',
  'support-clone': 'Cloning & Genetics', 'support-sex': 'Cloning & Genetics',
  'support-yield': 'Yield Optimization', 'support-grow': 'General Growing',
  terpene: 'Terpenes & Flavor', cannabinoid: 'Cannabinoid Science', effects: 'Effects & Science',
  'cbd-focus': 'CBD & Wellness', sleep: 'Cannabis & Sleep', pain: 'Cannabis & Pain',
  'anxiety-article': 'Anxiety & Wellness', health: 'Health & Wellness', therapeutic: 'Health & Wellness',
  edible: 'Edibles & Recipes', accessory: 'Accessories & Gear',
  legal: 'Legal & News', news: 'Industry News', dispensary: 'Dispensary Info',
  'state-guide': 'State Growing Guides', promo: 'Seasonal Picks', general: 'Cannabis Knowledge',
};

export default function AllGuidesPage() {
  const allPosts = getAllBlogPosts().sort((a, b) => b.publishDate.localeCompare(a.publishDate));

  const grouped: Record<string, typeof allPosts> = {};
  for (const post of allPosts) {
    const label = ARCHIVE_LABELS[post.category] || 'Cannabis Knowledge';
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(post);
  }

  const sortedCategories = Object.keys(grouped).sort();

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <div className="text-[12px] text-[#192026]/40 mb-6">
        <Link href="/" className="hover:text-[#275C53]">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/blog" className="hover:text-[#275C53]">Blog</Link>
        <span className="mx-2">›</span>
        <span className="text-[#192026]/60">All Guides</span>
      </div>

      <div className="max-w-4xl">
        <h1 className="text-3xl text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>
          All Cannabis Growing Guides
        </h1>
        <p className="text-[#192026]/55 text-sm leading-relaxed mb-4">
          Browse our complete library of {allPosts.length} cannabis growing articles. Every guide is written by Sierra Langston, a hands-on cultivator and seed specialist, and updated regularly for accuracy.
        </p>

        {/* Jump to category */}
        <div className="flex flex-wrap gap-2 mb-10">
          {sortedCategories.map(cat => (
            <a key={cat} href={`#archive-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              className="px-3 py-1.5 bg-white border border-[#275C53]/10 rounded-full text-[11px] text-[#275C53] font-semibold hover:bg-[#275C53] hover:text-white transition-colors">
              {cat} ({grouped[cat].length})
            </a>
          ))}
        </div>

        {/* Archive sections */}
        {sortedCategories.map(cat => (
          <section key={cat} id={`archive-${cat.toLowerCase().replace(/\s+/g, '-')}`} className="mb-8 scroll-mt-24">
            <h2 className="text-lg font-bold text-[#275C53] mb-3 flex items-center gap-2" style={{ fontFamily: 'var(--font-patua)' }}>
              {cat}
              <span className="text-[11px] font-normal text-[#192026]/25">({grouped[cat].length})</span>
            </h2>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-x-8">
              {grouped[cat].map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`}
                  className="text-[13px] text-[#192026]/55 hover:text-[#275C53] leading-relaxed block py-1 break-inside-avoid">
                  {post.title}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Back to blog */}
      <div className="mt-12 pt-8 border-t border-[#275C53]/10 text-center">
        <Link href="/blog" className="inline-block px-8 py-3 bg-[#275C53] text-white rounded-xl text-[13px] font-bold hover:bg-[#1e4a42] transition-colors">
          ← Back to Blog
        </Link>
      </div>
    </div>
  );
}
