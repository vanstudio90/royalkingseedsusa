import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug, getProducts } from '@/lib/products/data';
import { ProductDetail } from '@/components/product/ProductDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: 'Not Found' };

  return {
    title: `Buy ${product.name} Online USA | Royal King Seeds`,
    description: `Shop ${product.name} cannabis seeds online with discreet US shipping. ${product.strainType.charAt(0).toUpperCase() + product.strainType.slice(1)} strain${product.thcContent ? ` with ${product.thcContent}% THC` : ''}. Germination guarantee included. Order from Royal King Seeds today.`,
    alternates: {
      canonical: `https://royalkingseedsusa.vercel.app/${slug}`,
    },
    openGraph: {
      title: `${product.name} Cannabis Seeds | Royal King Seeds USA`,
      description: product.shortDescription || product.description.slice(0, 160),
      type: 'website',
      images: product.imageUrl ? [{ url: product.imageUrl, alt: product.name }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Related products (same strain type)
  const allProducts = getProducts();
  const related = allProducts
    .filter((p) => p.id !== product.id && (p.strainType === product.strainType || p.categories.some((c) => product.categories.includes(c))))
    .slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.shortDescription || product.description.slice(0, 300),
            image: product.imageUrl || undefined,
            brand: { "@type": "Brand", name: "Royal King Seeds" },
            offers: {
              "@type": "Offer",
              url: `https://royalkingseedsusa.vercel.app/${product.slug}`,
              priceCurrency: "USD",
              price: product.price,
              availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              seller: { "@type": "Organization", name: "Royal King Seeds" },
              shippingDetails: {
                "@type": "OfferShippingDetails",
                shippingDestination: { "@type": "DefinedRegion", addressCountry: "US" },
                deliveryTime: { "@type": "ShippingDeliveryTime", handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" }, transitTime: { "@type": "QuantitativeValue", minValue: 3, maxValue: 7, unitCode: "DAY" } },
              },
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://royalkingseedsusa.vercel.app" },
              { "@type": "ListItem", position: 2, name: "Cannabis Seeds", item: "https://royalkingseedsusa.vercel.app/product-category/shop-all-cannabis-seeds" },
              { "@type": "ListItem", position: 3, name: product.name, item: `https://royalkingseedsusa.vercel.app/${product.slug}` },
            ],
          }),
        }}
      />
      <ProductDetail product={product} relatedProducts={related} />
    </>
  );
}
