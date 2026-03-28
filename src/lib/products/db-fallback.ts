import { supabaseAdmin } from '@/lib/supabase/server';
import type { Product } from './types';

function toProduct(row: any): Product {
  let bestUse: string[] = [];
  try { bestUse = typeof row.best_use === 'string' ? JSON.parse(row.best_use) : row.best_use || []; } catch { bestUse = []; }

  return {
    id: String(row.id),
    slug: row.slug,
    name: row.name,
    description: row.description || '',
    shortDescription: row.short_description || '',
    categories: row.categories || [],
    strainType: row.strain_type || 'hybrid',
    thcContent: (row.thc_content || '').replace('%', ''),
    indicaPercent: row.indica_percent || 50,
    sativaPercent: row.sativa_percent || 50,
    effects: row.effects || [],
    bestUse,
    seedOptions: row.seed_options || [],
    price: parseFloat(row.price) || 0,
    feminized: row.feminized ?? true,
    autoflower: row.autoflower ?? false,
    inStock: row.in_stock ?? true,
    imageUrl: row.image_url || '',
    metaTitle: row.meta_title || '',
    metaDescription: row.meta_description || '',
    floweringTime: row.flowering_time || '',
    plantHeight: row.plant_height || '',
    indoorYield: row.indoor_yield || '',
    outdoorYield: row.outdoor_yield || '',
    difficulty: row.difficulty || 'intermediate',
  };
}

export async function getProductBySlugFromDb(slug: string): Promise<Product | null> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) return null;
  return toProduct(data);
}

export async function getDbImageUrl(slug: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from('products')
    .select('image_url')
    .eq('slug', slug)
    .single();

  return data?.image_url || null;
}

// Batch: overlay DB images onto an array of products from static JSON
export async function overlayDbImages(products: Product[]): Promise<Product[]> {
  if (products.length === 0) return products;
  const slugs = products.map(p => p.slug);
  const { data } = await supabaseAdmin
    .from('products')
    .select('slug, image_url')
    .in('slug', slugs);

  if (!data || data.length === 0) return products;
  const dbMap = new Map(data.map(r => [r.slug, r.image_url]));
  return products.map(p => {
    const dbImg = dbMap.get(p.slug);
    if (dbImg && dbImg !== p.imageUrl) {
      return { ...p, imageUrl: dbImg };
    }
    return p;
  });
}
