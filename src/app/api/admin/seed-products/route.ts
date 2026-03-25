import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import rawProducts from '@/lib/products/products-ca-raw.json';

// POST - Seed Supabase products table from CA raw JSON data
export async function POST() {
  // Check if products already exist
  const { count } = await supabaseAdmin
    .from('products')
    .select('*', { count: 'exact', head: true });

  if (count && count > 0) {
    return NextResponse.json({
      error: `Products table already has ${count} products. Delete them first if you want to re-seed.`
    }, { status: 400 });
  }

  const products = (rawProducts as any[]).map((raw) => ({
    slug: raw.slug,
    name: raw.name,
    description: raw.description || '',
    short_description: raw.short_description || '',
    categories: raw.categories || [],
    strain_type: raw.strain_type || 'hybrid',
    thc_content: raw.thc_content || '',
    indica_percent: raw.indica_percent || 50,
    sativa_percent: raw.sativa_percent || 50,
    effects: raw.effects || [],
    best_use: typeof raw.best_use === 'string' ? raw.best_use : JSON.stringify(raw.best_use || []),
    price: parseFloat(raw.price) || 0,
    seed_options: raw.seed_options || [],
    feminized: raw.feminized ?? true,
    autoflower: raw.autoflower ?? false,
    in_stock: raw.in_stock ?? true,
    stock_quantity: 100,
    image_url: raw.image_url || '',
    status: raw.status || 'published',
    flowering_time: raw.flowering_time || '',
    plant_height: raw.plant_height || '',
    indoor_yield: raw.indoor_yield || '',
    outdoor_yield: raw.outdoor_yield || '',
    difficulty: raw.difficulty || 'intermediate',
    meta_title: raw.meta_title || '',
    meta_description: raw.meta_description || '',
  }));

  // Insert in batches of 100
  const batchSize = 100;
  let inserted = 0;
  const errors: string[] = [];

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    const { error } = await supabaseAdmin
      .from('products')
      .insert(batch);

    if (error) {
      errors.push(`Batch ${i / batchSize + 1}: ${error.message}`);
    } else {
      inserted += batch.length;
    }
  }

  return NextResponse.json({
    success: true,
    inserted,
    total: products.length,
    errors: errors.length > 0 ? errors : undefined
  });
}
