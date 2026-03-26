import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/products/data';
import { generateStrainSpecs } from '@/components/product/dynamicProductData';

// GET product images and strain specs by slugs (comma-separated)
export async function GET(req: NextRequest) {
  const slugs = req.nextUrl.searchParams.get('slugs')?.split(',').slice(0, 50) || [];
  if (slugs.length === 0) return NextResponse.json({});

  const result: Record<string, { imageUrl: string; specs: ReturnType<typeof generateStrainSpecs> } | null> = {};

  for (const slug of slugs) {
    const product = getProductBySlug(slug.trim());
    if (product) {
      result[slug.trim()] = {
        imageUrl: product.imageUrl || '',
        specs: generateStrainSpecs(product),
      };
    } else {
      result[slug.trim()] = null;
    }
  }

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, max-age=3600' },
  });
}
