import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/products/data';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  if (!slug) return NextResponse.json(null, { status: 400 });

  const product = getProductBySlug(slug.trim());
  if (!product) return NextResponse.json(null, { status: 404 });

  return NextResponse.json(product, {
    headers: { 'Cache-Control': 'public, max-age=3600' },
  });
}
