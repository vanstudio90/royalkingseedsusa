import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/products/data';
import { generateStrainSpecs } from '@/components/product/dynamicProductData';

function getDifficulty(p: { autoflower: boolean; strainType: string; slug: string }): string {
  if (p.autoflower) return 'Easy';
  if (p.strainType === 'indica') return 'Easy - Moderate';
  if (p.strainType === 'sativa') return 'Moderate - Advanced';
  return 'Moderate';
}

export async function GET(req: NextRequest) {
  const slugs = req.nextUrl.searchParams.get('slugs')?.split(',').slice(0, 4) || [];
  if (slugs.length === 0) return NextResponse.json({ products: [] });

  const products = slugs.map(slug => {
    const p = getProductBySlug(slug.trim());
    if (!p) return null;
    const specs = generateStrainSpecs(p);
    return {
      slug: p.slug,
      name: p.name,
      strainType: p.strainType,
      thcContent: p.thcContent || specs.thc || 'N/A',
      autoflower: p.autoflower,
      feminized: p.feminized,
      effects: p.effects?.slice(0, 3) || [],
      price: p.price,
      imageUrl: p.imageUrl || '',
      floweringTime: specs.floweringTime || p.floweringTime || 'N/A',
      indoorYield: specs.yieldIndoor || p.indoorYield || 'N/A',
      outdoorYield: specs.yieldOutdoor || p.outdoorYield || 'N/A',
      difficulty: getDifficulty(p),
      height: specs.height || p.plantHeight || 'N/A',
      seedType: p.autoflower ? 'Autoflower' : p.feminized ? 'Feminized' : 'Regular',
      bestFor: p.autoflower ? 'Beginners, Speed' : p.strainType === 'indica' ? 'Evening, Relaxation' : p.strainType === 'sativa' ? 'Daytime, Energy' : 'Versatile Use',
    };
  }).filter(Boolean);

  return NextResponse.json({ products }, {
    headers: { 'Cache-Control': 'public, max-age=3600' },
  });
}
