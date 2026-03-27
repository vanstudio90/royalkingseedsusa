import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllBlogPosts } from '@/lib/blog-content';

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
  { label: 'Beginner', anchor: 'start-here' },
  { label: 'Germination', anchor: 'germination' },
  { label: 'Indoor', anchor: 'indoor' },
  { label: 'Outdoor', anchor: 'outdoor' },
  { label: 'Autoflower', anchor: 'autoflower' },
  { label: 'Strains', anchor: 'strains' },
  { label: 'Troubleshooting', anchor: 'fix-problems' },
  { label: 'Harvest', anchor: 'harvest' },
];

const TROUBLE_KEYWORDS = [
  'yellow-leaves', 'seedling-stretching', 'nutrient-burn', 'bud-rot', 'overwatering', 'slow-germination',
  'powdery-mildew', 'spider-mites', 'heat-stress', 'calcium-deficiency',
];

const BEGINNER_PATH = [
  { step: '1', label: 'Beginner Grow Guide', slug: 'top-7-recommended-strains-for-beginners', desc: 'Choose easy strains' },
  { step: '2', label: 'Germination Guide', slug: 'autoflowering-seed-germination-guide', desc: 'Start your seeds' },
  { step: '3', label: 'Seedling Care', slug: 'cannabis-seedlings-and-transplanting', desc: 'First 2 weeks' },
  { step: '4', label: 'Vegetative Stage', slug: 'keep-cannabis-in-vegetative-stage', desc: 'Build the plant' },
  { step: '5', label: 'Flowering Stage', slug: 'cannabis-flowering-and-budding', desc: 'Grow the buds' },
  { step: '6', label: 'Harvest & Cure', slug: 'cannabis-trichomes-and-harvesting', desc: 'Finish strong' },
];

const FEATURED_SLUGS = [
  'autoflowering-seed-germination-guide',
  'cannabis-growing-lights-and-phases',
  'cannabis-trichomes-and-harvesting',
];

export default function BlogPage() {
  const allPosts = getAllBlogPosts().sort((a, b) => b.publishDate.localeCompare(a.publishDate));

  // Featured: specific high-value posts
  const featured = FEATURED_SLUGS.map(s => allPosts.find(p => p.slug === s)).filter(Boolean) as typeof allPosts;
  const popular = allPosts.filter(p => !FEATURED_SLUGS.includes(p.slug)).slice(0, 12);

  // Category posts & counts
  const catPosts: Record<string, typeof allPosts> = {};
  const catCounts: Record<string, number> = {};
  for (const dc of DISPLAY_CATEGORIES) {
    const posts = allPosts.filter(p => dc.cats.includes(p.category));
    catPosts[dc.id] = posts.slice(0, 6);
    catCounts[dc.id] = posts.length;
  }

  // Troubleshooting
  const troublePosts = allPosts.filter(p =>
    TROUBLE_KEYWORDS.some(kw => p.slug.includes(kw)) || ['pillar-pest', 'support-pest'].includes(p.category)
  ).slice(0, 6);

  // Strains
  const strainPosts = allPosts.filter(p => p.category === 'strain').slice(0, 8);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Archive
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
        <h1 className="text-3xl sm:text-4xl text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>
          Cannabis Seed Growing Blog
        </h1>
        <p className="text-[#192026]/55 max-w-2xl mx-auto text-sm leading-relaxed mb-6">
          Expert guides on germination, indoor growing, outdoor harvests, strain selection, and troubleshooting. Written by cultivators for 200,000+ American growers.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-6">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#192026]/25" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search grow guides, problems, strains..." className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#275C53]/15 rounded-2xl text-[14px] text-[#192026] placeholder:text-[#192026]/30 focus:outline-none focus:border-[#275C53]/40 focus:shadow-sm transition-all" />
          </div>
        </div>

        {/* Topic Pills */}
        <div className="flex flex-wrap justify-center gap-2">
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

          {/* ─── FEATURED GUIDES (big emphasis) ─── */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[#D7B65D] text-sm">⭐</span>
              <h2 className="text-[11px] font-bold text-[#275C53] uppercase tracking-[1.5px]">Featured Guides</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {featured.map((post, i) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}
                  className={`rounded-2xl overflow-hidden hover:shadow-lg transition-all group ${i === 0 ? 'sm:col-span-2 sm:row-span-2 bg-[#275C53] p-6 sm:p-8 flex flex-col justify-end min-h-[220px]' : 'bg-white border border-[#275C53]/5 p-5'}`}>
                  {i === 0 ? (
                    <>
                      <span className="text-[10px] uppercase tracking-[1.5px] text-[#D7B65D] font-semibold">Must Read</span>
                      <h3 className="text-xl sm:text-2xl text-white mt-2 mb-3 group-hover:text-[#D7B65D] transition-colors" style={{ fontFamily: 'var(--font-patua)' }}>{post.title}</h3>
                      <p className="text-white/60 text-sm line-clamp-2">{post.metaDescription}</p>
                      <div className="flex items-center gap-2 mt-4">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><span className="text-[#D7B65D] font-bold text-[8px]">SL</span></div>
                        <span className="text-white/40 text-[11px]">{post.author} · {formatDate(post.publishDate)}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-[9px] uppercase tracking-[1px] text-[#D7B65D] font-semibold">Essential</span>
                      <h3 className="text-[15px] text-[#275C53] mt-1 mb-2 leading-snug group-hover:text-[#D7B65D] transition-colors font-semibold">{post.title}</h3>
                      <p className="text-[12px] text-[#192026]/50 line-clamp-2">{post.metaDescription}</p>
                      <span className="text-[11px] text-[#192026]/30 mt-2 block">{formatDate(post.publishDate)}</span>
                    </>
                  )}
                </Link>
              ))}
            </div>
          </section>

          {/* ─── START HERE: BEGINNER PATH ─── */}
          <section className="mb-10 bg-[#275C53] rounded-2xl p-6" id="start-here">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🌱</span>
              <h2 className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-patua)' }}>Start Growing Cannabis</h2>
            </div>
            <p className="text-white/50 text-[12px] mb-5">New to growing? Follow this step-by-step path from seed to harvest.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {BEGINNER_PATH.map(item => (
                <Link key={item.slug} href={`/blog/${item.slug}`}
                  className="bg-white/10 rounded-xl p-3 hover:bg-white/20 transition-colors group text-center">
                  <span className="text-[#D7B65D] font-bold text-lg block">{item.step}</span>
                  <h3 className="text-white text-[12px] font-semibold mt-1 group-hover:text-[#D7B65D] transition-colors">{item.label}</h3>
                  <p className="text-white/40 text-[10px] mt-0.5">{item.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* ─── FIX PROBLEMS (high SEO value) ─── */}
          <section className="mb-10 bg-red-50/40 rounded-2xl p-6 border border-red-100/60" id="fix-problems">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🚨</span>
              <h2 className="text-[#275C53] font-bold text-lg" style={{ fontFamily: 'var(--font-patua)' }}>Fix Your Grow Problems</h2>
            </div>
            <p className="text-[12px] text-[#192026]/40 mb-4">Something wrong with your plant? Find the answer fast.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {troublePosts.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`}
                  className="bg-white rounded-xl p-4 border border-red-100/50 hover:shadow-sm hover:border-red-200 transition-all group">
                  <h3 className="text-[13px] font-semibold text-[#275C53] group-hover:text-[#D7B65D] transition-colors">{post.title}</h3>
                  <p className="text-[11px] text-[#192026]/40 mt-1 line-clamp-2">{post.metaDescription}</p>
                  <span className="text-[10px] text-red-400/60 mt-2 block font-medium">Read fix →</span>
                </Link>
              ))}
            </div>
          </section>

          {/* ─── BROWSE BY TOPIC ─── */}
          <section className="mb-10" id="topics">
            <h2 className="text-[11px] font-bold text-[#275C53] uppercase tracking-[1.5px] mb-4">Browse by Topic</h2>
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
          <section className="mb-10">
            <h2 className="text-[11px] font-bold text-[#275C53] uppercase tracking-[1.5px] mb-4">Most Popular Guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popular.map(post => (
                <ArticleCard key={post.slug} post={post} formatDate={formatDate} />
              ))}
            </div>
          </section>

          {/* ─── GROW GOALS (conversion section) ─── */}
          <section className="mb-10 bg-[#F5F0EA] rounded-2xl p-6 border border-[#275C53]/5" id="grow-goals">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🎯</span>
              <h2 className="text-[#275C53] font-bold text-lg" style={{ fontFamily: 'var(--font-patua)' }}>Shop by Growing Goal</h2>
            </div>
            <p className="text-[12px] text-[#192026]/40 mb-4">Match your growing goals to the right seeds.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { name: 'High Yield', slug: 'best-strains-for-high-yield', icon: '📈', desc: 'Biggest harvests' },
                { name: 'Beginner Friendly', slug: 'autoflowering-seeds', icon: '🌱', desc: 'Easy to grow' },
                { name: 'Fast Growing', slug: 'fast-flowering-cannabis-seeds', icon: '⚡', desc: 'Quick harvests' },
                { name: 'High THC', slug: 'high-tch-seeds', icon: '🔥', desc: 'Maximum potency' },
                { name: 'Outdoor Tough', slug: 'best-strains-for-outdoor-growing', icon: '☀️', desc: 'Weather resistant' },
                { name: 'Best Flavor', slug: 'fruity-cannabis-seeds', icon: '🍇', desc: 'Terpene-rich' },
                { name: 'CBD & Wellness', slug: 'cbd-strains', icon: '💚', desc: 'Therapeutic' },
                { name: 'Feminized Seeds', slug: 'feminized-seeds', icon: '♀️', desc: '99.9% female' },
              ].map(c => (
                <Link key={c.slug} href={`/product-category/${c.slug}`}
                  className="bg-white rounded-xl p-4 border border-[#275C53]/5 hover:border-[#D7B65D]/40 hover:shadow-sm transition-all group text-center">
                  <span className="text-xl block mb-1">{c.icon}</span>
                  <h3 className="text-[13px] font-semibold text-[#275C53] group-hover:text-[#D7B65D] transition-colors">{c.name}</h3>
                  <p className="text-[11px] text-[#192026]/30">{c.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* ─── CATEGORY SECTIONS ─── */}
          {DISPLAY_CATEGORIES.filter(dc => (catPosts[dc.id]?.length || 0) > 0).map(dc => (
            <section key={dc.id} id={dc.id} className="mb-10 scroll-mt-24">
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

          {/* ─── STRAIN EDUCATION ─── */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🧬</span>
              <h2 className="text-[#275C53] font-bold text-lg" style={{ fontFamily: 'var(--font-patua)' }}>Strain Education</h2>
            </div>
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

          {/* ─── FULL ARCHIVE ─── */}
          <section className="mb-10 pt-8 border-t border-[#275C53]/10">
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
        <aside className="w-full lg:w-[300px] shrink-0 space-y-5 lg:sticky lg:top-24">

          {/* Sidebar Search */}
          <div className="bg-white rounded-2xl border border-[#275C53]/5 p-4">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#192026]/25" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input data-blog-search type="text" placeholder="Search articles..." className="w-full pl-9 pr-3 py-2.5 bg-[#F5F0EA] border-none rounded-xl text-[13px] text-[#192026] placeholder:text-[#192026]/30 focus:outline-none focus:ring-1 focus:ring-[#275C53]/30" />
            </div>
          </div>

          {/* Quick Fix (troubleshooting shortcuts) */}
          <div className="bg-red-50/40 rounded-2xl border border-red-100/40 p-5">
            <h3 className="text-[10px] uppercase tracking-[1px] text-red-400/60 font-semibold mb-3">Quick Fix</h3>
            <div className="space-y-1.5">
              {[
                { label: 'Yellow Leaves', href: '/blog/yellowing-of-cannabis-leaves-in-the-first-week-of-flowering' },
                { label: 'Nutrient Burn', href: '/blog/cannabis-nutrient-burn-and-light-stress' },
                { label: 'Overwatering', href: '/blog/overwatering-vs-underwatering-cannabis-plants' },
                { label: 'Pests & Bugs', href: '/blog/cannabis-pest-management' },
                { label: 'Bud Rot / Mold', href: '/blog/mold-in-cannabis' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="block text-[13px] text-[#192026]/60 hover:text-red-500 transition-colors py-0.5">🚨 {l.label}</Link>
              ))}
            </div>
          </div>

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

          {/* Seed Finder */}
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
              Every article is written from hands-on growing experience and reviewed for accuracy. Our guides have helped 200,000+ American growers succeed.
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
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#275C53]/10 flex items-center justify-center"><span className="text-[#275C53] font-bold text-[7px]">SL</span></div>
          <span className="text-[11px] text-[#192026]/30">{post.author}</span>
        </div>
        <span className="text-[11px] text-[#275C53] font-medium opacity-0 group-hover:opacity-100 transition-opacity">Read guide →</span>
      </div>
    </Link>
  );
}
