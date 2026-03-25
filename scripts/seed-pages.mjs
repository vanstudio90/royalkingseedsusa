import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Check existing
const { count } = await supabase.from('pages').select('*', { count: 'exact', head: true });
if (count && count > 0) {
  console.log(`Pages table already has ${count} entries. Skipping seed.`);
  process.exit(0);
}

// Static pages
const staticPages = [
  { slug: 'contact', title: 'Contact Us', page_type: 'page', status: 'published' },
  { slug: 'faq', title: 'Frequently Asked Questions', page_type: 'page', status: 'published' },
  { slug: 'shipping', title: 'Shipping Information', page_type: 'page', status: 'published' },
  { slug: 'privacy', title: 'Privacy Policy', page_type: 'page', status: 'published' },
  { slug: 'terms', title: 'Terms of Service', page_type: 'page', status: 'published' },
  { slug: 'legal', title: 'Legal Disclaimer', page_type: 'page', status: 'published' },
  { slug: 'affiliate', title: 'Affiliate Program', page_type: 'page', status: 'published' },
  { slug: 'refund-returns', title: 'Refund & Returns Policy', page_type: 'page', status: 'published' },
];

// Blog posts from slugs JSON
const blogSlugs = JSON.parse(
  readFileSync(new URL('../src/lib/blog-slugs.json', import.meta.url), 'utf-8')
);

const blogPages = blogSlugs.map((b) => ({
  slug: b.slug,
  title: b.title,
  page_type: 'blog',
  status: 'published',
  author: 'Sierra Langston',
}));

const allPages = [...staticPages, ...blogPages];
console.log(`Seeding ${staticPages.length} pages + ${blogPages.length} blog posts = ${allPages.length} total`);

// Insert in batches
const batchSize = 100;
let inserted = 0;

for (let i = 0; i < allPages.length; i += batchSize) {
  const batch = allPages.slice(i, i + batchSize);
  const { error } = await supabase.from('pages').insert(batch);
  if (error) {
    console.error(`Batch ${Math.floor(i / batchSize) + 1} error:`, error.message);
  } else {
    inserted += batch.length;
    console.log(`Inserted batch ${Math.floor(i / batchSize) + 1} (${inserted}/${allPages.length})`);
  }
}

console.log(`Done! Inserted ${inserted} of ${allPages.length} entries.`);
