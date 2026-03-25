import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts } from '@/lib/products/data';
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
      canonical: `https://royalkingseeds.us/product-category/${slug}`,
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
    'mix-packs': (p) => p.categories.some((c: string) => c.toLowerCase().includes('mix')) || /mix.?pack|variety|sampler|combo/i.test(p.name),
    'classic-cannabis-seeds': (p) => p.categories.some((c: string) => c.toLowerCase().includes('classic')) || /\b(og|kush|haze|skunk|white widow|northern lights|ak.?47|blue dream|gorilla|jack herer|sour diesel|girl scout|cheese|amnesia|critical|diesel|widow|headband|trainwreck|bubba)\b/i.test(p.name),
    'exotic-cannabis-seeds': (p) => p.categories.some((c: string) => c.toLowerCase().includes('exotic')) || /gelato|zkittlez|runtz|wedding cake|purple punch|ice cream|sherbet|mimosa|biscotti|cereal milk|gary payton|london pound|exotic|gushers|zoap|lemon cherry/i.test(p.name),
    'fruity-cannabis-seeds': (p) => p.categories.some((c: string) => c.toLowerCase().includes('fruity')) || /berry|fruit|citrus|mango|grape|apple|banana|cherry|orange|lemon|strawberry|blueberry|pineapple|tropical|melon|peach|watermelon|tangerine|lime|grapefruit|papaya|guava|punch|candy|sherbet|tangie|mimosa/i.test(p.name),
    'purple-genetics-seeds': (p) => p.categories.some((c: string) => c.toLowerCase().includes('purple')) || /purple|violet|lavender|grape|granddaddy/i.test(p.name),
    'euphoric-seeds': (p) => p.categories.some((c: string) => c.toLowerCase().includes('euphoric')) || ((p.effects || []).some((e: string) => /euphoric/i.test(e)) && (p.effects || []).some((e: string) => /happy|uplifted|giggly/i.test(e))),
    'energizing-cannabis-seeds': (p) => p.categories.some((c: string) => c.toLowerCase().includes('energizing')) || ((p.effects || []).some((e: string) => /energi|energetic/i.test(e)) && p.strainType === 'sativa'),
    'best-seller': (p) => p.categories.some((c: string) => c.toLowerCase().includes('best seller')) || /gorilla|gelato|wedding cake|blue dream|girl scout|og kush|white widow|northern lights|jack herer|sour diesel|bruce banner|amnesia|critical|runtz|zkittlez|granddaddy|pineapple express|green crack|super lemon|gsc|gg4|do.si.dos/i.test(p.name),
    'best-strains-for-anxiety': (p) => p.categories.some((c: string) => c.toLowerCase().includes('anxiety')) || ((p.effects || []).some((e: string) => /relax|calm/i.test(e)) && (p.strainType === 'indica' || p.strainType === 'cbd')),
    'best-strains-for-outdoor-growing': (p) => p.categories.some((c: string) => c.toLowerCase().includes('outdoor')) || (!p.autoflower && (p.strainType === 'sativa' || p.strainType === 'hybrid')),
    'bogo-seeds': (p) => p.categories.some((c: string) => c.toLowerCase().includes('bogo')) || (p.sale_price && p.sale_price < p.price),
    'cannabis-seeds-on-sale': (p) => p.categories.some((c: string) => c.toLowerCase().includes('sale')) || (p.sale_price && p.sale_price < p.price),
    'usa-premium-cannabis-seeds': (p) => p.categories.some((c: string) => c.toLowerCase().includes('usa') || c.toLowerCase().includes('premium')) || (parseFloat(p.thc_content || p.thcContent || '0') >= 20),
    'photoperiod': (p) => !p.autoflower,
    'fast-flowering-seeds': (p) => p.categories.some((c: string) => c.toLowerCase().includes('fast')) || (p.autoflower && p.strainType === 'indica'),
    'ruderalis': (p) => p.autoflower === true,
    'growers-choice-seeds-collection': (p) => p.categories.some((c: string) => c.toLowerCase().includes('grower')) || (parseFloat(p.thc_content || p.thcContent || '0') >= 22 && (p.effects || []).some((e: string) => /euphoric|happy/i.test(e))),
    'feminized-hybrids': (p) => p.feminized && p.strainType === 'hybrid',
    'feminized-indicas': (p) => p.feminized && p.strainType === 'indica',
    'feminized-sativas': (p) => p.feminized && p.strainType === 'sativa',
    'auto-flowering-hybrids': (p) => p.autoflower && p.strainType === 'hybrid',
    'auto-flowering-indicas': (p) => p.autoflower && p.strainType === 'indica',
    'auto-flowering-sativas': (p) => p.autoflower && p.strainType === 'sativa',
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

  const allProducts = getProducts();
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
            url: `https://royalkingseeds.us/product-category/${slug}`,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: filtered.length,
              itemListElement: filtered.slice(0, 10).map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `https://royalkingseeds.us/${p.slug}`,
                name: p.name,
              })),
            },
          }),
        }}
      />
    </div>
  );
}
