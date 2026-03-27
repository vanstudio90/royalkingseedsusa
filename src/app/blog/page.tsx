import Link from 'next/link';
import type { Metadata } from 'next';
import { getRecentPosts, getAllBlogPosts } from '@/lib/blog-content';

export const metadata: Metadata = {
  title: 'Cannabis Growing Guides, Strain Reviews & Tips',
  description: 'Expert cannabis growing guides, in-depth strain reviews, and practical cultivation tips from Sierra Langston and the Royal King Seeds team. Written from hands-on experience for American growers.',
  alternates: { canonical: 'https://royalkingseeds.us/blog' },
};

export default function BlogPage() {
  const allPosts = getAllBlogPosts()
    .sort((a, b) => b.publishDate.localeCompare(a.publishDate));

  const featured = allPosts[0];
  const recent = allPosts.slice(1, 49);

  const categoryLabels: Record<string, string> = {
    'strain': 'Strain Review',
    'growing': 'Growing Guide',
    'effects': 'Effects & Science',
    'lifestyle': 'Cannabis Culture',
    'news': 'Industry News',
    'state-guide': 'State Guide',
    'general': 'Cannabis Knowledge',
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>
          Cannabis Growing Guides &amp; Strain Reviews
        </h1>
        <p className="text-[#192026]/70 max-w-2xl mx-auto">
          In-depth cultivation guides, honest strain breakdowns, and practical growing advice written by Sierra Langston — a hands-on cultivator and seed specialist who has helped over 50,000 American growers succeed. Updated weekly.
        </p>
      </div>

      {/* Featured Post */}
      {featured && (
        <Link href={`/blog/${featured.slug}`} className="block bg-[#275C53] rounded-3xl p-8 sm:p-12 mb-12 hover:shadow-xl transition-shadow group">
          <span className="text-[10px] uppercase tracking-[1.5px] text-[#D7B65D] font-semibold">{categoryLabels[featured.category] || 'Latest Article'}</span>
          <h2 className="text-xl sm:text-3xl text-white mt-3 mb-4 group-hover:text-[#D7B65D] transition-colors" style={{ fontFamily: 'var(--font-patua)' }}>
            {featured.title}
          </h2>
          <p className="text-white/70 text-sm max-w-2xl leading-relaxed">
            {featured.metaDescription}
          </p>
          <div className="flex items-center gap-3 mt-6">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-[#D7B65D] font-bold text-[10px]">SL</span>
            </div>
            <span className="text-white/60 text-sm">{featured.author} · {new Date(featured.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </Link>
      )}

      {/* Post Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recent.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}
            className="bg-white rounded-2xl border border-[#275C53]/5 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group">
            <div className="p-5">
              <span className="text-[9px] uppercase tracking-[1px] text-[#D7B65D] font-semibold bg-[#275C53] px-2 py-0.5 rounded-full">
                {categoryLabels[post.category] || 'Article'}
              </span>
              <span className="text-[10px] text-[#192026]/40 uppercase tracking-[1px] ml-2">
                {new Date(post.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <h3 className="title-underline text-base text-[#275C53] mt-2 leading-snug">
                {post.title}
              </h3>
              <p className="text-[12px] text-[#192026]/60 mt-2 line-clamp-2 leading-relaxed">
                {post.metaDescription}
              </p>
              <p className="text-[11px] text-[#192026]/40 mt-3">{post.author}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Internal Links */}
      <div className="mt-16 pt-8 border-t border-[#275C53]/10">
        <h2 className="text-lg text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Browse Cannabis Seeds</h2>
        <p className="text-sm text-[#192026]/60 mb-4">Find the genetics that match the growing knowledge you are building. Every strain includes detailed specs, effects, and growing information.</p>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'All Cannabis Seeds', slug: 'shop-all-cannabis-seeds' },
            { name: 'Feminized Seeds', slug: 'feminized-seeds' },
            { name: 'Autoflower Seeds', slug: 'autoflowering-seeds' },
            { name: 'Indica Strains', slug: 'indica-seeds' },
            { name: 'Sativa Strains', slug: 'sativa-seeds' },
            { name: 'High THC Seeds', slug: 'high-tch-seeds' },
            { name: 'CBD Seeds', slug: 'cbd-strains' },
            { name: 'Kush Seeds', slug: 'kush-seeds' },
            { name: 'Outdoor Strains', slug: 'best-strains-for-outdoor-growing' },
            { name: 'Best Sellers', slug: 'best-seller' },
            { name: 'Exotic Seeds', slug: 'exotic-cannabis-seeds' },
            { name: 'Mix Packs', slug: 'mix-packs' },
          ].map((cat) => (
            <Link key={cat.slug} href={`/product-category/${cat.slug}`}
              className="px-3 py-1.5 bg-white border border-[#275C53]/10 rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Complete Article Archive — server-rendered links to every post */}
      {(() => {
        const grouped: Record<string, typeof allPosts> = {};
        for (const post of allPosts) {
          const cat = categoryLabels[post.category] || 'Cannabis Knowledge';
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat].push(post);
        }
        const sortedCategories = Object.keys(grouped).sort();
        return (
          <div className="mt-16 pt-8 border-t border-[#275C53]/10">
            <h2 className="text-lg text-[#275C53] mb-2" style={{ fontFamily: 'var(--font-patua)' }}>Complete Article Archive</h2>
            <p className="text-sm text-[#192026]/50 mb-6">All {allPosts.length} articles organized by topic.</p>
            {sortedCategories.map((cat) => (
              <div key={cat} className="mb-6">
                <h3 className="text-sm font-semibold text-[#275C53] mb-2">{cat} ({grouped[cat].length})</h3>
                <ul className="columns-1 sm:columns-2 lg:columns-3 gap-x-6">
                  {grouped[cat].map((post) => (
                    <li key={post.slug} className="break-inside-avoid">
                      <Link href={`/blog/${post.slug}`} className="text-[12px] text-[#192026]/60 hover:text-[#275C53] leading-relaxed block py-0.5">
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
}
