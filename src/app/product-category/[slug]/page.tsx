import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchAllProducts } from '@/lib/woocommerce';
import { getCategoryBySlug, categories } from '@/lib/categories';
import { getCategoryContent } from '@/lib/category-content';
import { ProductGrid } from '@/components/product/ProductGrid';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  const content = getCategoryContent(slug);
  if (!category) return { title: 'Category Not Found' };

  return {
    title: content?.h1 || `${category.name} — Buy Online USA | Royal King Seeds`,
    description: content?.intro?.slice(0, 160) || `Shop ${category.name} online with discreet US shipping. Premium cannabis seed genetics from Royal King Seeds.`,
    alternates: {
      canonical: `https://royalkingseedsusa.vercel.app/product-category/${slug}`,
    },
  };
}

function filterProductsByCategory(products: any[], slug: string) {
  const catName = getCategoryBySlug(slug)?.name || '';

  // Special filtering logic
  const filters: Record<string, (p: any) => boolean> = {
    'shop-all-cannabis-seeds': () => true,
    'feminized-seeds': (p) => p.feminized || p.categories.some((c: string) => c.toLowerCase().includes('feminized')),
    'autoflowering-seeds': (p) => p.autoflower || p.categories.some((c: string) => c.toLowerCase().includes('auto')),
    'indica-seeds': (p) => p.strainType === 'indica' || p.categories.some((c: string) => c.toLowerCase().includes('indica')),
    'sativa-seeds': (p) => p.strainType === 'sativa' || p.categories.some((c: string) => c.toLowerCase().includes('sativa')),
    'hybrid': (p) => p.strainType === 'hybrid' || p.categories.some((c: string) => c.toLowerCase().includes('hybrid')),
    'cbd-strains': (p) => p.strainType === 'cbd' || p.categories.some((c: string) => c.toLowerCase().includes('cbd')),
    'high-tch-seeds': (p) => { const thc = parseFloat(p.thcContent) || 0; return thc >= 25; },
    'kush-seeds': (p) => p.name.toLowerCase().includes('kush') || p.categories.some((c: string) => c.toLowerCase().includes('kush')),
    'mix-packs': (p) => p.categories.some((c: string) => c.toLowerCase().includes('mix')),
    'classic-cannabis-seeds': (p) => p.categories.some((c: string) => c.toLowerCase().includes('classic')),
    'exotic-cannabis-seeds': (p) => p.categories.some((c: string) => c.toLowerCase().includes('exotic')),
    'fruity-cannabis-seeds': (p) => p.categories.some((c: string) => c.toLowerCase().includes('fruity')),
    'purple-genetics-seeds': (p) => p.categories.some((c: string) => c.toLowerCase().includes('purple')),
    'euphoric-seeds': (p) => p.categories.some((c: string) => c.toLowerCase().includes('euphoric')),
    'energizing-cannabis-seeds': (p) => p.categories.some((c: string) => c.toLowerCase().includes('energizing')),
    'best-seller': (p) => p.categories.some((c: string) => c.toLowerCase().includes('best seller')),
    'best-strains-for-anxiety': (p) => p.categories.some((c: string) => c.toLowerCase().includes('anxiety')),
    'best-strains-for-outdoor-growing': (p) => p.categories.some((c: string) => c.toLowerCase().includes('outdoor')),
    'bogo-seeds': (p) => p.categories.some((c: string) => c.toLowerCase().includes('bogo')),
    'cannabis-seeds-on-sale': (p) => p.categories.some((c: string) => c.toLowerCase().includes('sale')),
    'usa-premium-cannabis-seeds': (p) => p.categories.some((c: string) => c.toLowerCase().includes('usa') || c.toLowerCase().includes('premium')),
    'photoperiod': (p) => !p.autoflower || p.categories.some((c: string) => c.toLowerCase().includes('photoperiod')),
    'fast-flowering-seeds': (p) => p.categories.some((c: string) => c.toLowerCase().includes('fast')),
    'feminized-hybrids': (p) => p.feminized && p.strainType === 'hybrid',
    'feminized-indicas': (p) => p.feminized && p.strainType === 'indica',
    'feminized-sativas': (p) => p.feminized && p.strainType === 'sativa',
    'auto-flowering-hybrids': (p) => p.autoflower && p.strainType === 'hybrid',
    'auto-flowering-indicas': (p) => p.autoflower && p.strainType === 'indica',
    'auto-flowering-sativas': (p) => p.autoflower && p.strainType === 'sativa',
    'ruderalis': (p) => p.categories.some((c: string) => c.toLowerCase().includes('ruderalis')),
  };

  const filterFn = filters[slug];
  if (filterFn) return products.filter(filterFn);

  // Fallback: match by category name
  return products.filter((p) => p.categories.some((c: string) => c.toLowerCase().includes(catName.toLowerCase())));
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { q } = await searchParams;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const allProducts = await fetchAllProducts();
  const filtered = filterProductsByCategory(allProducts, slug);
  const content = getCategoryContent(slug);

  const relatedCategories = categories
    .filter((c) => c.slug !== slug && c.parent === category.parent)
    .slice(0, 6);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="text-[12px] text-[#192026]/50 mb-6 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-[#275C53]">Home</Link>
        <span>/</span>
        <Link href="/product-category/shop-all-cannabis-seeds" className="hover:text-[#275C53]">Cannabis Seeds</Link>
        <span>/</span>
        <span className="text-[#275C53]">{category.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>
          {content?.h1 || category.name}
        </h1>
        {content?.intro && (
          <p className="text-[#192026]/70 text-sm sm:text-base leading-relaxed max-w-4xl">{content.intro}</p>
        )}
        <p className="text-sm text-[#192026]/40 mt-3">{filtered.length} strains available</p>
      </div>

      {/* Product Grid */}
      <ProductGrid products={filtered} activeCategory={slug} initialQuery={q} />

      {/* Bottom SEO Content */}
      {content?.bottomSections && content.bottomSections.length > 0 && (
        <div className="mt-16 space-y-10 max-w-4xl">
          {content.bottomSections.map((section, i) => (
            <div key={i}>
              <h2 className="text-xl text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>{section.title}</h2>
              <p className="text-[#192026]/70 text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* FAQs */}
      {content?.faqs && content.faqs.length > 0 && (
        <div className="mt-12 max-w-3xl">
          <h2 className="text-xl text-[#275C53] mb-6" style={{ fontFamily: 'var(--font-patua)' }}>Frequently Asked Questions</h2>
          <div className="space-y-3">
            {content.faqs.map((faq, i) => (
              <details key={i} className="bg-white rounded-2xl border border-[#275C53]/5">
                <summary className="px-6 py-4 cursor-pointer text-[#275C53] font-medium text-sm">{faq.q}</summary>
                <div className="px-6 pb-4 text-[13px] text-[#192026]/70 leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Related Categories */}
      {relatedCategories.length > 0 && (
        <div className="mt-12 pt-8 border-t border-[#275C53]/10">
          <h3 className="text-sm font-semibold text-[#275C53] mb-4">Related Seed Categories</h3>
          <div className="flex flex-wrap gap-2">
            {relatedCategories.map((cat) => (
              <Link key={cat.slug} href={`/product-category/${cat.slug}`}
                className="px-3 py-1.5 bg-white border border-[#275C53]/10 rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: content?.h1 || category.name,
            description: content?.intro || `Browse ${category.name} at Royal King Seeds USA`,
            url: `https://royalkingseedsusa.vercel.app/product-category/${slug}`,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: filtered.length,
              itemListElement: filtered.slice(0, 10).map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `https://royalkingseedsusa.vercel.app/${p.slug}`,
                name: p.name,
              })),
            },
          }),
        }}
      />
    </div>
  );
}
