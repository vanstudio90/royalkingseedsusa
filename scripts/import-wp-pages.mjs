import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);
const WP_BASE = 'https://royalkingseeds.us/wp-json/wp/v2';

// Fetch all WP pages
async function fetchAllWpPages() {
  const all = [];
  let page = 1;
  while (true) {
    const url = `${WP_BASE}/pages?per_page=100&page=${page}&_fields=id,slug,title,content,excerpt,status,modified`;
    console.log(`Fetching WP page ${page}...`);
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 400) break; // past last page
      console.error(`HTTP ${res.status} on page ${page}`);
      break;
    }
    const data = await res.json();
    if (!data.length) break;
    all.push(...data);
    const totalPages = parseInt(res.headers.get('x-wp-totalpages') || '0');
    if (page >= totalPages) break;
    page++;
  }
  return all;
}

console.log('Fetching all WordPress pages from royalkingseeds.us...');
const wpPages = await fetchAllWpPages();
console.log(`Fetched ${wpPages.length} WP pages`);

// Get existing slugs to avoid duplicates
const { data: existing } = await supabase.from('pages').select('slug');
const existingSlugs = new Set((existing || []).map(p => p.slug));
console.log(`${existingSlugs.size} pages already in Supabase`);

// Classify pages
const staticSlugs = new Set([
  'contact', 'faq', 'shipping', 'privacy', 'terms', 'legal',
  'affiliate', 'refund-returns', 'about', 'about-us',
]);

const rows = [];
for (const wp of wpPages) {
  const slug = wp.slug;
  if (existingSlugs.has(slug)) continue; // skip duplicates

  const title = (wp.title?.rendered || '').replace(/&#8217;/g, "'").replace(/&#8211;/g, '–').replace(/&amp;/g, '&').replace(/&#8220;/g, '"').replace(/&#8221;/g, '"');
  const content = wp.content?.rendered || '';
  const excerpt = (wp.excerpt?.rendered || '').replace(/<[^>]*>/g, '').trim();

  // Determine type: strain reviews and articles = blog, actual pages = page
  const isStrainReview = slug.includes('-strain-') || slug.includes('-strain');
  const isStateGuide = slug.startsWith('top-10-cannabis-seeds-in-');
  const isCountryGuide = slug.startsWith('guide-to-buying-');
  const isArticle = slug.includes('cannabis-') || slug.includes('growing-') || slug.includes('strains') || isStrainReview || isStateGuide || isCountryGuide;
  const isStaticPage = staticSlugs.has(slug) || slug === 'rks' || slug === 'my-account' || slug === 'cart' || slug === 'checkout' || slug === 'shop';

  const pageType = isStaticPage ? 'page' : 'blog';

  rows.push({
    slug,
    title,
    content,
    meta_description: excerpt.substring(0, 160),
    page_type: pageType,
    status: wp.status === 'publish' ? 'published' : 'draft',
    author: 'Royal King Seeds',
  });
}

console.log(`${rows.length} new pages to insert (${wpPages.length - rows.length} skipped as duplicates)`);

// Insert in batches
const batchSize = 50;
let inserted = 0;

for (let i = 0; i < rows.length; i += batchSize) {
  const batch = rows.slice(i, i + batchSize);
  const { error } = await supabase.from('pages').insert(batch);
  if (error) {
    console.error(`Batch ${Math.floor(i / batchSize) + 1} error:`, error.message);
  } else {
    inserted += batch.length;
    console.log(`Inserted batch ${Math.floor(i / batchSize) + 1} (${inserted}/${rows.length})`);
  }
}

console.log(`Done! Imported ${inserted} of ${rows.length} WordPress pages.`);
