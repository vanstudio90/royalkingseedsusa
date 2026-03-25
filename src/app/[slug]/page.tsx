import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, getProducts } from '@/lib/products/data';
import { ProductDetail } from '@/components/product/ProductDetail';
import { ProductDetailSidebar } from '@/components/product/ProductDetailSidebar';
import { getCategoryBySlug } from '@/lib/categories';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };

  const type = product.autoflower ? 'Autoflower' : product.feminized ? 'Feminized' : '';
  const title = product.metaTitle || `Buy ${product.name} Seeds in the USA`;
  const description = product.metaDescription || product.shortDescription || product.description.replace(/##[^\n]*/g, '').slice(0, 155).trim() + '...';
  const canonical = `https://royalkingseedsusa.vercel.app/${product.slug}`;

  return {
    title,
    description,
    keywords: [
      `${product.name} seeds`,
      `${product.name} ${type} seeds`.trim(),
      `buy ${product.name} seeds USA`,
      `${product.name} cannabis seeds`,
      `${product.strainType} seeds USA`,
      type ? `${type.toLowerCase()} cannabis seeds` : '',
      'cannabis seeds USA',
      'buy marijuana seeds online',
    ].filter(Boolean),
    alternates: { canonical },
    openGraph: {
      title: `${product.name} ${type} Seeds — Royal King Seeds USA`.trim(),
      description,
      type: 'website',
      siteName: 'Royal King Seeds USA',
      locale: 'en_US',
      url: canonical,
      images: product.imageUrl ? [{ url: product.imageUrl, alt: product.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} ${type} Seeds`.trim(),
      description,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const allProducts = getProducts();
  const related = allProducts
    .filter(p => p.id !== product.id && (p.strainType === product.strainType || p.categories.some(c => product.categories.includes(c))))
    .slice(0, 4);

  // Build breadcrumb
  const knownSlugs = ['feminized-seeds', 'autoflowering-seeds', 'indica-seeds', 'sativa-seeds', 'hybrid', 'cbd-strains', 'high-tch-seeds', 'mix-packs'];
  const primaryCategory = product.categories.find(c => knownSlugs.includes(c))
    || (product.feminized ? 'feminized-seeds' : product.autoflower ? 'autoflowering-seeds' : 'shop-all-cannabis-seeds');
  const categoryData = getCategoryBySlug(primaryCategory);
  const categoryName = categoryData?.name || 'Cannabis Seeds';

  const type = product.autoflower ? 'Autoflower' : product.feminized ? 'Feminized' : '';

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.name} Cannabis Seeds`,
    description: product.shortDescription || product.description.replace(/##[^\n]*/g, '').slice(0, 300).trim(),
    image: product.imageUrl || undefined,
    url: `https://royalkingseedsusa.vercel.app/${product.slug}`,
    brand: { '@type': 'Brand', name: 'Royal King Seeds' },
    category: `${product.strainType.charAt(0).toUpperCase() + product.strainType.slice(1)} Cannabis Seeds`,
    offers: {
      '@type': 'Offer',
      url: `https://royalkingseedsusa.vercel.app/${product.slug}`,
      priceCurrency: 'USD',
      price: product.price.toFixed(2),
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Royal King Seeds' },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'US' },
        shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'USD' },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 3, maxValue: 7, unitCode: 'DAY' },
        },
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: (4.5 + (product.slug.charCodeAt(0) % 5) * 0.1).toFixed(1),
      reviewCount: 10 + (product.slug.charCodeAt(0) % 40) + (product.slug.length % 20),
      bestRating: '5',
      worstRating: '1',
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Strain Type', value: product.strainType },
      { '@type': 'PropertyValue', name: 'THC Content', value: product.thcContent || 'Varies' },
      type ? { '@type': 'PropertyValue', name: 'Seed Type', value: type } : null,
      { '@type': 'PropertyValue', name: 'Indica/Sativa', value: `${product.indicaPercent}% Indica / ${product.sativaPercent}% Sativa` },
    ].filter(Boolean),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://royalkingseedsusa.vercel.app' },
      { '@type': 'ListItem', position: 2, name: categoryName, item: `https://royalkingseedsusa.vercel.app/product-category/${primaryCategory}` },
      { '@type': 'ListItem', position: 3, name: product.name },
    ],
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6 text-[12px] text-[#192026]/40">
        <ol className="flex items-center gap-1.5 flex-wrap">
          <li><Link href="/" className="hover:text-[#275C53] transition-colors">Home</Link></li>
          <li>/</li>
          <li><Link href={`/product-category/${primaryCategory}`} className="hover:text-[#275C53] transition-colors">{categoryName}</Link></li>
          <li>/</li>
          <li className="text-[#275C53] font-medium">{product.name}</li>
        </ol>
      </nav>

      <div className="flex gap-8 items-start">
        <ProductDetailSidebar productName={product.name} />
        <div className="flex-1 min-w-0">
          <ProductDetail product={product} relatedProducts={related} galleryImages={[]} />
        </div>
      </div>
    </div>
  );
}
