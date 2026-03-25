import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Load raw products
const rawProducts = JSON.parse(
  readFileSync(new URL('../src/lib/products/products-ca-raw.json', import.meta.url), 'utf-8')
);

console.log(`Loaded ${rawProducts.length} raw products`);

// Check existing
const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
if (count && count > 0) {
  console.log(`Products table already has ${count} products. Skipping seed.`);
  process.exit(0);
}

// Transform to DB format
const products = rawProducts.map((raw) => ({
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

// Insert in batches
const batchSize = 100;
let inserted = 0;

for (let i = 0; i < products.length; i += batchSize) {
  const batch = products.slice(i, i + batchSize);
  const { error } = await supabase.from('products').insert(batch);
  if (error) {
    console.error(`Batch ${Math.floor(i / batchSize) + 1} error:`, error.message);
  } else {
    inserted += batch.length;
    console.log(`Inserted batch ${Math.floor(i / batchSize) + 1} (${inserted}/${products.length})`);
  }
}

console.log(`Done! Inserted ${inserted} of ${products.length} products.`);
