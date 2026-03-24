import Link from 'next/link';
import type { Metadata } from 'next';
import { fetchWpPosts } from '@/lib/woocommerce';

export const metadata: Metadata = {
  title: 'Cannabis Growing Guides & Strain Reviews — Royal King Seeds Blog',
  description: 'Expert cannabis growing guides, strain reviews, cultivation tips, and industry news for American growers. Learn from our team of experienced cultivators at Royal King Seeds.',
  alternates: { canonical: 'https://royalkingseedsusa.vercel.app/blog' },
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&#8217;/g, "'").replace(/&#8220;/g, '"').replace(/&#8221;/g, '"').replace(/&nbsp;/g, ' ').trim();
}

export default async function BlogPage() {
  const { posts } = await fetchWpPosts(1, 50);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>
          Cannabis Growing Guides &amp; Strain Reviews
        </h1>
        <p className="text-[#192026]/70 max-w-2xl mx-auto">
          Expert cultivation advice, strain breakdowns, and growing tips from our team of experienced American cultivators. Updated weekly with fresh content for home growers across the United States.
        </p>
      </div>

      {/* Featured Post */}
      {posts.length > 0 && (
        <Link href={`/blog/${posts[0].slug}`} className="block bg-[#275C53] rounded-3xl p-8 sm:p-12 mb-12 hover:shadow-xl transition-shadow group">
          <span className="text-[10px] uppercase tracking-[1.5px] text-[#D7B65D] font-semibold">Latest Article</span>
          <h2 className="text-xl sm:text-3xl text-white mt-3 mb-4 group-hover:text-[#D7B65D] transition-colors" style={{ fontFamily: 'var(--font-patua)' }}>
            {stripHtml(posts[0].title.rendered)}
          </h2>
          <p className="text-white/70 text-sm max-w-2xl leading-relaxed">
            {stripHtml(posts[0].excerpt.rendered).slice(0, 200)}...
          </p>
          <span className="inline-flex items-center gap-2 mt-6 text-[#D7B65D] text-sm font-medium">
            Read Article →
          </span>
        </Link>
      )}

      {/* Post Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(1).map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}
            className="bg-white rounded-2xl border border-[#275C53]/5 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group">
            <div className="h-48 bg-gradient-to-br from-[#275C53] to-[#1e4a42] flex items-center justify-center">
              <span className="text-5xl opacity-30">🌿</span>
            </div>
            <div className="p-5">
              <span className="text-[10px] text-[#192026]/40 uppercase tracking-[1px]">
                {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <h3 className="title-underline text-base text-[#275C53] mt-2 leading-snug">
                {stripHtml(post.title.rendered)}
              </h3>
              <p className="text-[13px] text-[#192026]/70 mt-2 line-clamp-3 leading-relaxed">
                {stripHtml(post.excerpt.rendered).slice(0, 150)}...
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Internal Links */}
      <div className="mt-16 pt-8 border-t border-[#275C53]/10">
        <h2 className="text-lg text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Browse Cannabis Seeds</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'All Seeds', slug: 'shop-all-cannabis-seeds' },
            { name: 'Feminized Seeds', slug: 'feminized-seeds' },
            { name: 'Autoflower Seeds', slug: 'autoflowering-seeds' },
            { name: 'Indica Seeds', slug: 'indica-seeds' },
            { name: 'Sativa Seeds', slug: 'sativa-seeds' },
            { name: 'High THC Seeds', slug: 'high-tch-seeds' },
            { name: 'CBD Seeds', slug: 'cbd-strains' },
            { name: 'Best Sellers', slug: 'best-seller' },
          ].map((cat) => (
            <Link key={cat.slug} href={`/product-category/${cat.slug}`}
              className="px-3 py-1.5 bg-white border border-[#275C53]/10 rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
