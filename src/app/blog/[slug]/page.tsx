import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchWpPostBySlug, fetchWpPosts } from '@/lib/woocommerce';

interface Props {
  params: Promise<{ slug: string }>;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&#8217;/g, "'").replace(/&#8220;/g, '"').replace(/&#8221;/g, '"').replace(/&nbsp;/g, ' ').trim();
}

function cleanContent(html: string): string {
  // Remove WordPress-specific divs but keep content
  let content = html
    .replace(/<div class="[^"]*flex[^"]*"[^>]*>/gi, '')
    .replace(/<div class="[^"]*react-scroll[^"]*"[^>]*>/gi, '')
    .replace(/<div class="[^"]*gizmo[^"]*"[^>]*>/gi, '')
    .replace(/<div class="[^"]*dark:bg[^"]*"[^>]*>/gi, '')
    .replace(/<\/div>/gi, '');
  // Fix internal links to point to our site
  content = content.replace(/https?:\/\/royalkingseeds\.us\//g, '/');
  content = content.replace(/\/product-category\//g, '/product-category/');
  return content;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchWpPostBySlug(slug);
  if (!post) return { title: 'Not Found' };

  const title = stripHtml(post.title.rendered);
  const excerpt = stripHtml(post.excerpt.rendered).slice(0, 160);

  return {
    title: `${title} | Royal King Seeds USA Blog`,
    description: excerpt,
    alternates: {
      canonical: `https://royalkingseedsusa.vercel.app/blog/${slug}`,
    },
    openGraph: {
      title,
      description: excerpt,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await fetchWpPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { posts: recentPosts } = await fetchWpPosts(1, 6);
  const related = recentPosts.filter((p) => p.id !== post.id).slice(0, 4);
  const title = stripHtml(post.title.rendered);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="text-[12px] text-[#192026]/50 mb-6 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-[#275C53]">Home</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-[#275C53]">Blog</Link>
        <span>/</span>
        <span className="text-[#275C53]">{title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
        {/* Main Content */}
        <article>
          <header className="mb-8">
            <span className="text-[11px] text-[#192026]/40 uppercase tracking-[1px]">
              {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-[#275C53] mt-2 mb-4" style={{ fontFamily: 'var(--font-patua)' }}>
              {title}
            </h1>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#275C53] flex items-center justify-center">
                <span className="text-[#E8CC7A] font-bold text-xs">RK</span>
              </div>
              <div>
                <p className="text-sm font-medium text-[#192026]">Royal King Seeds Team</p>
                <p className="text-[11px] text-[#192026]/50">Expert Cannabis Cultivators</p>
              </div>
            </div>
          </header>

          <div
            className="prose prose-sm max-w-none text-[#192026]/80 prose-headings:text-[#275C53] prose-headings:font-normal prose-a:text-[#275C53] prose-a:no-underline hover:prose-a:text-[#D7B65D]"
            style={{ fontFamily: 'var(--font-sans)' }}
            dangerouslySetInnerHTML={{ __html: cleanContent(post.content.rendered) }}
          />

          {/* CTA */}
          <div className="mt-12 bg-[#275C53] rounded-2xl p-8 text-center">
            <h3 className="text-xl text-white mb-3" style={{ fontFamily: 'var(--font-patua)' }}>
              Ready to Start Growing?
            </h3>
            <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
              Browse our collection of 1,200+ premium cannabis seeds with discreet shipping to all 50 states.
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
              {related.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="block group">
                  <p className="text-[10px] text-[#192026]/40">{new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  <p className="text-sm text-[#275C53] group-hover:text-[#D7B65D] transition-colors leading-snug mt-0.5">
                    {stripHtml(p.title.rendered)}
                  </p>
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
              ].map((cat) => (
                <Link key={cat.slug} href={`/product-category/${cat.slug}`}
                  className="block text-[13px] text-[#192026]/60 hover:text-[#275C53] transition-colors">
                  {cat.name}
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
            headline: title,
            datePublished: post.date,
            dateModified: post.modified,
            author: { "@type": "Organization", name: "Royal King Seeds" },
            publisher: { "@type": "Organization", name: "Royal King Seeds", url: "https://royalkingseedsusa.vercel.app" },
            mainEntityOfPage: `https://royalkingseedsusa.vercel.app/blog/${slug}`,
          }),
        }}
      />
    </div>
  );
}
