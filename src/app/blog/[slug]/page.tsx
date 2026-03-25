import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { generateBlogPost, getRelatedPosts, getRecentPosts } from '@/lib/blog-content';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = generateBlogPost(slug);
  if (!post) return { title: 'Not Found' };

  return {
    title: `${post.title} | Royal King Seeds USA`,
    description: post.metaDescription,
    alternates: {
      canonical: `https://royalkingseeds.us/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: 'article',
      publishedTime: post.publishDate,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = generateBlogPost(slug);

  if (!post) {
    notFound();
  }

  const related = getRelatedPosts(slug, 4);
  const recent = getRecentPosts(6).filter(p => p.slug !== slug).slice(0, 4);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="text-[12px] text-[#192026]/50 mb-6 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-[#275C53]">Home</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-[#275C53]">Blog</Link>
        <span>/</span>
        <span className="text-[#275C53]">{post.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
        {/* Main Content */}
        <article>
          <header className="mb-8">
            <span className="text-[11px] text-[#192026]/40 uppercase tracking-[1px]">
              {new Date(post.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-[#275C53] mt-2 mb-4" style={{ fontFamily: 'var(--font-patua)' }}>
              {post.title}
            </h1>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#275C53] flex items-center justify-center">
                <span className="text-[#E8CC7A] font-bold text-xs">SL</span>
              </div>
              <div>
                <p className="text-sm font-medium text-[#192026]">{post.author}</p>
                <p className="text-[11px] text-[#192026]/50">Cannabis Cultivator &amp; Seed Specialist</p>
              </div>
            </div>
          </header>

          <div
            className="prose prose-sm max-w-none text-[#192026]/80 prose-headings:text-[#275C53] prose-headings:font-normal prose-a:text-[#275C53] prose-a:no-underline hover:prose-a:text-[#D7B65D] prose-p:leading-relaxed prose-li:leading-relaxed"
            style={{ fontFamily: 'var(--font-sans)' }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Related Posts */}
          {related.length > 0 && (
            <div className="mt-12 pt-8 border-t border-[#275C53]/10">
              <h3 className="text-lg text-[#275C53] mb-5" style={{ fontFamily: 'var(--font-patua)' }}>Related Articles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map((p) => (
                  <Link key={p.slug} href={`/blog/${p.slug}`} className="bg-white rounded-xl p-4 border border-[#275C53]/5 hover:shadow-md transition-all group">
                    <span className="text-[10px] text-[#192026]/40 uppercase tracking-[1px]">{p.category}</span>
                    <p className="text-sm text-[#275C53] group-hover:text-[#D7B65D] transition-colors mt-1 leading-snug font-medium">{p.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-10 bg-[#275C53] rounded-2xl p-8 text-center">
            <h3 className="text-xl text-white mb-3" style={{ fontFamily: 'var(--font-patua)' }}>
              Ready to Start Growing?
            </h3>
            <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
              Browse over 1,200 premium cannabis seeds with discreet shipping to all 50 states and our 92% germination guarantee.
            </p>
            <Link href="/product-category/shop-all-cannabis-seeds" className="btn-main !bg-[#D7B65D] !text-[#1a3d36]">
              Shop Cannabis Seeds
            </Link>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Latest Posts */}
          <div className="bg-white rounded-2xl p-6 border border-[#275C53]/5">
            <h3 className="text-sm font-semibold text-[#275C53] uppercase tracking-[1px] mb-4">Latest Articles</h3>
            <div className="space-y-4">
              {recent.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="block group">
                  <p className="text-[10px] text-[#192026]/40">{new Date(p.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  <p className="text-sm text-[#275C53] group-hover:text-[#D7B65D] transition-colors leading-snug mt-0.5">{p.title}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Shop Seeds CTA */}
          <div className="bg-[#275C53] rounded-2xl p-6 text-center">
            <h3 className="text-white font-semibold text-sm mb-2">Shop Cannabis Seeds</h3>
            <p className="text-white/70 text-[12px] mb-4">1,200+ strains with US-wide shipping</p>
            <Link href="/product-category/shop-all-cannabis-seeds" className="btn-main !bg-[#D7B65D] !text-[#1a3d36] !px-5 !py-2 !text-[11px] !min-w-0">
              Browse Seeds
            </Link>
          </div>

          {/* Category Links */}
          <div className="bg-white rounded-2xl p-6 border border-[#275C53]/5">
            <h3 className="text-sm font-semibold text-[#275C53] uppercase tracking-[1px] mb-4">Seed Categories</h3>
            <div className="space-y-2">
              {[
                { name: 'Feminized Seeds', slug: 'feminized-seeds' },
                { name: 'Autoflower Seeds', slug: 'autoflowering-seeds' },
                { name: 'Indica Strains', slug: 'indica-seeds' },
                { name: 'Sativa Strains', slug: 'sativa-seeds' },
                { name: 'CBD Seeds', slug: 'cbd-strains' },
                { name: 'High THC Seeds', slug: 'high-tch-seeds' },
                { name: 'Kush Seeds', slug: 'kush-seeds' },
                { name: 'Exotic Seeds', slug: 'exotic-cannabis-seeds' },
                { name: 'Best Sellers', slug: 'best-seller' },
                { name: 'Outdoor Strains', slug: 'best-strains-for-outdoor-growing' },
              ].map((cat) => (
                <Link key={cat.slug} href={`/product-category/${cat.slug}`}
                  className="block text-[13px] text-[#192026]/60 hover:text-[#275C53] transition-colors">
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Blog Categories */}
          <div className="bg-white rounded-2xl p-6 border border-[#275C53]/5">
            <h3 className="text-sm font-semibold text-[#275C53] uppercase tracking-[1px] mb-4">Topics</h3>
            <div className="flex flex-wrap gap-1.5">
              {['Strain Reviews', 'Growing Guides', 'Effects & Science', 'Cannabis Culture', 'Industry News'].map((tag) => (
                <Link key={tag} href="/blog"
                  className="px-2.5 py-1 bg-[#F5F0EA] rounded-full text-[11px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Article structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            datePublished: post.publishDate,
            dateModified: post.publishDate,
            author: { "@type": "Person", name: post.author, jobTitle: "Cannabis Cultivator & Seed Specialist" },
            publisher: { "@type": "Organization", name: "Royal King Seeds", url: "https://royalkingseeds.us" },
            mainEntityOfPage: `https://royalkingseeds.us/blog/${slug}`,
          }),
        }}
      />
    </div>
  );
}
