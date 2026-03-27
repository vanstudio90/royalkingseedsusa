import Link from 'next/link';
import type { Metadata } from 'next';
import { getRecentPosts, getAllBlogPosts } from '@/lib/blog-content';

export const metadata: Metadata = {
  title: 'Cannabis Seed Growing Blog — Guides, Strains & Tips',
  description: 'Expert cannabis growing guides, germination walkthroughs, strain reviews, troubleshooting help, and harvest advice. Written by cultivators for 200,000+ American growers.',
  alternates: { canonical: 'https://royalkingseeds.us/blog' },
};

const DISPLAY_CATEGORIES: { id: string; label: string; desc: string; icon: string; cats: string[] }[] = [
  { id: 'beginner', label: 'Beginner Guides', desc: 'First-time grower essentials', icon: '🌱', cats: ['pillar-germ', 'support-seedling', 'support-grow'] },
  { id: 'germination', label: 'Germination', desc: 'Seed starting & seedling care', icon: '💧', cats: ['pillar-germ', 'support-seedling'] },
  { id: 'indoor', label: 'Indoor Growing', desc: 'Lights, tents, airflow & feeding', icon: '💡', cats: ['pillar-light', 'support-light', 'pillar-vpd', 'support-vpd'] },
  { id: 'outdoor', label: 'Outdoor Growing', desc: 'Climate, pests & photoperiods', icon: '☀️', cats: ['environment', 'state-guide'] },
  { id: 'autoflower', label: 'Autoflower Guides', desc: 'Auto-specific growing advice', icon: '⚡', cats: ['pillar-auto', 'support-auto'] },
  { id: 'strains', label: 'Strain Guides', desc: 'Reviews, comparisons & picks', icon: '🧬', cats: ['strain'] },
  { id: 'nutrients', label: 'Nutrients & Soil', desc: 'Feeding, pH & deficiencies', icon: '🧪', cats: ['pillar-nutrient', 'support-nutrient', 'support-medium', 'support-watering'] },
  { id: 'troubleshooting', label: 'Troubleshooting', desc: 'Pests, diseases & fixes', icon: '🔧', cats: ['pillar-pest', 'support-pest', 'support-flower'] },
  { id: 'harvest', label: 'Harvest & Curing', desc: 'Trichomes, drying & storage', icon: '✂️', cats: ['pillar-harvest', 'support-harvest', 'pillar-store'] },
  { id: 'training', label: 'Training & Pruning', desc: 'LST, topping & canopy work', icon: '✋', cats: ['pillar-train', 'support-train'] },
  { id: 'science', label: 'Terpenes & Effects', desc: 'Cannabinoids, flavors & science', icon: '🔬', cats: ['terpene', 'cannabinoid', 'effects', 'cbd-focus'] },
  { id: 'breeding', label: 'Genetics & Breeding', desc: 'Phenotypes, cloning & seeds', icon: '🧬', cats: ['support-clone', 'support-sex'] },
];

const TOPIC_PILLS = [
  { label: 'Beginner Guides', anchor: 'beginner' },
  { label: 'Germination', anchor: 'germination' },
  { label: 'Indoor Growing', anchor: 'indoor' },
  { label: 'Outdoor Growing', anchor: 'outdoor' },
  { label: 'Autoflowers', anchor: 'autoflower' },
  { label: 'Strain Reviews', anchor: 'strains' },
  { label: 'Pest & Disease Help', anchor: 'troubleshooting' },
  { label: 'Harvest & Curing', anchor: 'harvest' },
];

const TROUBLE_POSTS = [
  'yellow-leaves', 'seedling-stretching', 'nutrient-burn', 'bud-rot', 'overwatering', 'slow-germination',
  'powdery-mildew', 'spider-mites', 'heat-stress', 'calcium-deficiency',
];

export default function BlogPage() {
  const allPosts = getAllBlogPosts().sort((a, b) => b.publishDate.localeCompare(a.publishDate));
  const featured = allPosts.slice(0, 3);
  const popular = allPosts.slice(3, 15);

  // Group posts by display category
  const catPosts: Record<string, typeof allPosts> = {};
  for (const dc of DISPLAY_CATEGORIES) {
    catPosts[dc.id] = allPosts.filter(p => dc.cats.includes(p.category)).slice(0, 6);
  }

  // Troubleshooting posts
  const troublePosts = allPosts.filter(p =>
    TROUBLE_POSTS.some(kw => p.slug.includes(kw)) ||
    ['pillar-pest', 'support-pest'].includes(p.category)
  ).slice(0, 6);

  // Strain posts for education section
  const strainPosts = allPosts.filter(p => p.category === 'strain').slice(0, 8);

  // Category counts for sidebar
  const catCounts: Record<string, number> = {};
  for (const dc of DISPLAY_CATEGORIES) {
    catCounts[dc.id] = allPosts.filter(p => dc.cats.includes(p.category)).length;
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Full archive grouped
  const archiveLabels: Record<string, string> = {
    strain: 'Strain Reviews', 'pillar-nutrient': 'Nutrient Guides', 'support-nutrient': 'Nutrient Guides',
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

  const archiveGrouped: Record<string, typeof allPosts> = {};
  for (const post of allPosts) {
    const label = archiveLabels[post.category] || 'Cannabis Knowledge';
    if (!archiveGrouped[label]) archiveGrouped[label] = [];
    archiveGrouped[label].push(post);
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6">

      {/* ═══ HERO ═══ */}
      <section className="py-12 text-center">
        <h1 className="text-3xl sm:text-4xl text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>
          Cannabis Seed Growing Blog
        </h1>
        <p className="text-[#192026]/60 max-w-2xl mx-auto text-sm leading-relaxed mb-8">
          Expert guides on germination, indoor growing, outdoor harvests, strain selection, yields, terpene profiles, and troubleshooting. Written by cultivators for American growers.
        </p>

        {/* Topic Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {TOPIC_PILLS.map(t => (
            <a key={t.anchor} href={`#${t.anchor}`}
              className="px-4 py-2 bg-white border border-[#275C53]/10 rounded-full text-[12px] text-[#275C53] font-semibold hover:bg-[#275C53] hover:text-white transition-colors">
              {t.label}
            </a>
          ))}
        </div>
      </section>

      <div className="flex gap-8 items-start flex-col lg:flex-row">
        {/* ═══ MAIN CONTENT ═══ */}
        <div className="flex-1 min-w-0">

          {/* ─── FEATURED ARTICLES ─── */}
          <section className="mb-12">
            <h2 className="text-lg font-bold text-[#275C53] mb-4 uppercase tracking-[1px] text-[11px]">Featured Guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {featured.map((post, i) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}
                  className={`rounded-2xl overflow-hidden hover:shadow-lg transition-all group ${i === 0 ? 'sm:col-span-2 sm:row-span-2 bg-[#275C53] p-6 sm:p-8 flex flex-col justify-end' : 'bg-white border border-[#275C53]/5 p-5'}`}>
                  {i === 0 ? (
                    <>
                      <span className="text-[10px] uppercase tracking-[1.5px] text-[#D7B65D] font-semibold">Featured</span>
                      <h3 className="text-xl sm:text-2xl text-white mt-2 mb-3 group-hover:text-[#D7B65D] transition-colors" style={{ fontFamily: 'var(--font-patua)' }}>{post.title}</h3>
                      <p className="text-white/60 text-sm line-clamp-2">{post.metaDescription}</p>
                      <div className="flex items-center gap-2 mt-4">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><span className="text-[#D7B65D] font-bold text-[8px]">SL</span></div>
                        <span className="text-white/40 text-[11px]">{post.author} · {formatDate(post.publishDate)}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-[9px] uppercase tracking-[1px] text-[#D7B65D] font-semibold">{formatDate(post.publishDate)}</span>
                      <h3 className="text-[15px] text-[#275C53] mt-1 mb-2 leading-snug group-hover:text-[#D7B65D] transition-colors font-semibold">{post.title}</h3>
                      <p className="text-[12px] text-[#192026]/50 line-clamp-2">{post.metaDescription}</p>
                    </>
                  )}
                </Link>
              ))}
            </div>
          </section>

          {/* ─── BROWSE BY TOPIC ─── */}
          <section className="mb-12" id="topics">
            <h2 className="text-lg font-bold text-[#275C53] mb-4 uppercase tracking-[1px] text-[11px]">Browse by Topic</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {DISPLAY_CATEGORIES.map(dc => (
                <a key={dc.id} href={`#${dc.id}`}
                  className="bg-white border border-[#275C53]/5 rounded-xl p-4 hover:border-[#275C53]/20 hover:shadow-sm transition-all group">
                  <span className="text-xl">{dc.icon}</span>
                  <h3 className="text-[13px] font-semibold text-[#275C53] mt-1 group-hover:text-[#D7B65D] transition-colors">{dc.label}</h3>
                  <p className="text-[11px] text-[#192026]/40 mt-0.5">{dc.desc}</p>
                  <span className="text-[10px] text-[#192026]/25 mt-1 block">{catCounts[dc.id] || 0} articles</span>
                </a>
              ))}
            </div>
          </section>

          {/* ─── MOST POPULAR ─── */}
          <section className="mb-12">
            <h2 className="text-lg font-bold text-[#275C53] mb-4 uppercase tracking-[1px] text-[11px]">Most Popular Guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popular.map(post => (
                <ArticleCard key={post.slug} post={post} formatDate={formatDate} />
              ))}
            </div>
          </section>

          {/* ─── CATEGORY SECTIONS ─── */}
          {DISPLAY_CATEGORIES.filter(dc => (catPosts[dc.id]?.length || 0) > 0).map(dc => (
            <section key={dc.id} id={dc.id} className="mb-12 scroll-mt-24">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-[#275C53]" style={{ fontFamily: 'var(--font-patua)' }}>
                    <span className="mr-2">{dc.icon}</span>{dc.label}
                  </h2>
                  <p className="text-[12px] text-[#192026]/40">{dc.desc}</p>
                </div>
                <span className="text-[11px] text-[#192026]/25">{catCounts[dc.id]} articles</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catPosts[dc.id].map(post => (
                  <ArticleCard key={post.slug} post={post} formatDate={formatDate} />
                ))}
              </div>
            </section>
          ))}

          {/* ─── TROUBLESHOOTING CENTER ─── */}
          <section className="mb-12 bg-red-50/30 rounded-2xl p-6 border border-red-100/50" id="troubleshooting-center">
            <h2 className="text-lg font-bold text-[#275C53] mb-1" style={{ fontFamily: 'var(--font-patua)' }}>
              🔧 Troubleshooting Center
            </h2>
            <p className="text-[12px] text-[#192026]/40 mb-4">Having a problem? Find answers fast.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {troublePosts.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`}
                  className="bg-white rounded-xl p-4 border border-red-100/50 hover:shadow-sm transition-all group">
                  <h3 className="text-[13px] font-semibold text-[#275C53] group-hover:text-[#D7B65D] transition-colors">{post.title}</h3>
                  <p className="text-[11px] text-[#192026]/40 mt-1 line-clamp-2">{post.metaDescription}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* ─── STRAIN EDUCATION ─── */}
          <section className="mb-12">
            <h2 className="text-lg font-bold text-[#275C53] mb-1" style={{ fontFamily: 'var(--font-patua)' }}>
              🧬 Strain Education
            </h2>
            <p className="text-[12px] text-[#192026]/40 mb-4">In-depth strain reviews with grow data, effects, and terpene profiles.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {strainPosts.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`}
                  className="bg-white rounded-xl p-4 border border-[#275C53]/5 hover:shadow-sm transition-all group">
                  <span className="text-[9px] uppercase tracking-[1px] text-[#D7B65D] font-semibold">Strain Review</span>
                  <h3 className="text-[13px] font-semibold text-[#275C53] mt-1 group-hover:text-[#D7B65D] transition-colors">{post.title}</h3>
                  <p className="text-[11px] text-[#192026]/40 mt-1 line-clamp-2">{post.metaDescription}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* ─── SHOP BY GROWING GOAL ─── */}
          <section className="mb-12 bg-[#F5F0EA] rounded-2xl p-6 border border-[#275C53]/5">
            <h2 className="text-lg font-bold text-[#275C53] mb-1" style={{ fontFamily: 'var(--font-patua)' }}>
              Ready to Grow?
            </h2>
            <p className="text-[12px] text-[#192026]/40 mb-4">Find seeds that match your growing knowledge.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { name: 'Beginner Seeds', slug: 'autoflowering-seeds', desc: 'Easy autoflowers' },
                { name: 'Feminized Seeds', slug: 'feminized-seeds', desc: '99.9% female' },
                { name: 'High THC Seeds', slug: 'high-tch-seeds', desc: 'Maximum potency' },
                { name: 'High Yield Seeds', slug: 'best-strains-for-high-yield', desc: 'Biggest harvests' },
                { name: 'Outdoor Strains', slug: 'best-strains-for-outdoor-growing', desc: 'Sun-loving genetics' },
                { name: 'CBD Seeds', slug: 'cbd-strains', desc: 'Therapeutic varieties' },
                { name: 'Indica Seeds', slug: 'indica-seeds', desc: 'Relaxing effects' },
                { name: 'Fast Flowering', slug: 'fast-flowering-cannabis-seeds', desc: 'Quick harvests' },
              ].map(c => (
                <Link key={c.slug} href={`/product-category/${c.slug}`}
                  className="bg-white rounded-xl p-4 border border-[#275C53]/5 hover:border-[#275C53]/20 hover:shadow-sm transition-all group text-center">
                  <h3 className="text-[13px] font-semibold text-[#275C53] group-hover:text-[#D7B65D] transition-colors">{c.name}</h3>
                  <p className="text-[11px] text-[#192026]/30">{c.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* ─── FULL ARCHIVE ─── */}
          <section className="mb-12 pt-8 border-t border-[#275C53]/10">
            <h2 className="text-lg text-[#275C53] mb-2" style={{ fontFamily: 'var(--font-patua)' }}>Complete Article Archive</h2>
            <p className="text-sm text-[#192026]/40 mb-6">All {allPosts.length} articles organized by topic.</p>
            {Object.keys(archiveGrouped).sort().map(label => (
              <div key={label} className="mb-6">
                <h3 className="text-sm font-semibold text-[#275C53] mb-2">{label} ({archiveGrouped[label].length})</h3>
                <ul className="columns-1 sm:columns-2 lg:columns-3 gap-x-6">
                  {archiveGrouped[label].map(post => (
                    <li key={post.slug} className="break-inside-avoid">
                      <Link href={`/blog/${post.slug}`} className="text-[12px] text-[#192026]/50 hover:text-[#275C53] leading-relaxed block py-0.5">{post.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </div>

        {/* ═══ SIDEBAR ═══ */}
        <aside className="w-full lg:w-[300px] shrink-0 space-y-6 lg:sticky lg:top-24">

          {/* Categories */}
          <div className="bg-white rounded-2xl border border-[#275C53]/5 p-5">
            <h3 className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-3">Categories</h3>
            <div className="space-y-1">
              {DISPLAY_CATEGORIES.map(dc => (
                <a key={dc.id} href={`#${dc.id}`}
                  className="flex items-center justify-between py-1.5 text-[13px] text-[#192026]/60 hover:text-[#275C53] transition-colors">
                  <span>{dc.icon} {dc.label}</span>
                  <span className="text-[11px] text-[#192026]/20">{catCounts[dc.id]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Popular Posts */}
          <div className="bg-white rounded-2xl border border-[#275C53]/5 p-5">
            <h3 className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-3">Popular Guides</h3>
            <div className="space-y-3">
              {allPosts.slice(0, 6).map((post, i) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="flex gap-3 group">
                  <span className="text-[11px] text-[#192026]/15 font-bold w-5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[13px] text-[#192026]/60 group-hover:text-[#275C53] transition-colors leading-snug">{post.title}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Latest Posts */}
          <div className="bg-white rounded-2xl border border-[#275C53]/5 p-5">
            <h3 className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-3">Latest Articles</h3>
            <div className="space-y-2">
              {allPosts.slice(0, 5).map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                  <span className="text-[13px] text-[#192026]/60 group-hover:text-[#275C53] transition-colors leading-snug block">{post.title}</span>
                  <span className="text-[10px] text-[#192026]/25">{formatDate(post.publishDate)}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Strain Finder */}
          <div className="bg-white rounded-2xl border border-[#275C53]/5 p-5">
            <h3 className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-3">Find Seeds</h3>
            <div className="space-y-1.5">
              {[
                { label: 'Best Beginner Strains', href: '/product-category/autoflowering-seeds' },
                { label: 'High THC Strains', href: '/product-category/high-tch-seeds' },
                { label: 'High Yield Strains', href: '/product-category/best-strains-for-high-yield' },
                { label: 'Fast Flowering Seeds', href: '/product-category/fast-flowering-cannabis-seeds' },
                { label: 'Outdoor Strains', href: '/product-category/best-strains-for-outdoor-growing' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="block text-[13px] text-[#275C53] hover:text-[#D7B65D] transition-colors py-0.5">→ {l.label}</Link>
              ))}
            </div>
          </div>

          {/* Trust Box */}
          <div className="bg-[#F5F0EA] rounded-2xl p-5">
            <h3 className="text-[10px] uppercase tracking-[1px] text-[#275C53]/50 font-semibold mb-3">About Our Content</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#275C53] flex items-center justify-center shrink-0">
                <span className="text-[#D7B65D] font-bold text-xs">SL</span>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#275C53]">Sierra Langston</p>
                <p className="text-[11px] text-[#192026]/40">Cultivator & Seed Specialist</p>
              </div>
            </div>
            <p className="text-[12px] text-[#192026]/50 leading-relaxed">
              Every article is written from hands-on growing experience, reviewed for accuracy, and updated regularly. Our guides have helped 200,000+ American growers succeed.
            </p>
          </div>

          {/* Shop CTA */}
          <div className="bg-[#275C53] rounded-2xl p-5 text-center">
            <p className="text-white/80 text-[13px] mb-3">Ready to start growing?</p>
            <Link href="/product-category/shop-all-cannabis-seeds" className="inline-block w-full py-3 bg-white text-[#275C53] rounded-xl text-[13px] font-bold hover:bg-[#D7B65D] hover:text-white transition-colors">
              Shop All 1,600+ Seeds
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ArticleCard({ post, formatDate }: { post: { slug: string; title: string; metaDescription: string; author: string; publishDate: string; category: string }; formatDate: (d: string) => string }) {
  return (
    <Link href={`/blog/${post.slug}`}
      className="bg-white rounded-xl border border-[#275C53]/5 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[9px] uppercase tracking-[1px] text-[#D7B65D] font-semibold bg-[#275C53] px-2 py-0.5 rounded-full">
          {post.category.replace(/^(pillar|support)-/, '').replace(/-/g, ' ')}
        </span>
        <span className="text-[10px] text-[#192026]/25">{formatDate(post.publishDate)}</span>
      </div>
      <h3 className="text-[14px] font-semibold text-[#275C53] leading-snug group-hover:text-[#D7B65D] transition-colors">{post.title}</h3>
      <p className="text-[12px] text-[#192026]/45 mt-1.5 line-clamp-2 leading-relaxed">{post.metaDescription}</p>
      <div className="flex items-center gap-2 mt-3">
        <div className="w-5 h-5 rounded-full bg-[#275C53]/10 flex items-center justify-center"><span className="text-[#275C53] font-bold text-[7px]">SL</span></div>
        <span className="text-[11px] text-[#192026]/30">{post.author}</span>
      </div>
    </Link>
  );
}
