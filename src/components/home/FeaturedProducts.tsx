import type { Product } from '@/lib/products/types';
import { ProductCard } from '@/components/product/ProductCard';

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
      {products.slice(0, 8).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
