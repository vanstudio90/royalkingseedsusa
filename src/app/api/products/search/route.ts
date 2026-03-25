import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/products/data';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || '';
  if (q.length < 2) {
    return NextResponse.json({ products: [] });
  }
  const products = searchProducts(q, 8);
  return NextResponse.json({ products });
}
