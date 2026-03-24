import type { Product, StrainType } from './products/types';

const WC_BASE = process.env.WC_BASE_URL || 'https://royalkingseeds.us';
const WC_KEY = process.env.WC_CONSUMER_KEY || '';
const WC_SECRET = process.env.WC_CONSUMER_SECRET || '';

function wcUrl(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${WC_BASE}/wp-json/wc/v3/${endpoint}`);
  url.searchParams.set('consumer_key', WC_KEY);
  url.searchParams.set('consumer_secret', WC_SECRET);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  return url.toString();
}

function wpUrl(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${WC_BASE}/wp-json/wp/v2/${endpoint}`);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  return url.toString();
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#8217;/g, "'").replace(/&#8220;/g, '"').replace(/&#8221;/g, '"').replace(/&nbsp;/g, ' ').trim();
}

function detectStrainType(cats: string[], name: string, desc: string): StrainType {
  const combined = (cats.join(' ') + ' ' + name + ' ' + desc).toLowerCase();
  if (cats.some(c => c.toLowerCase().includes('cbd'))) return 'cbd';
  if (cats.some(c => c.toLowerCase().includes('indica')) && !cats.some(c => c.toLowerCase().includes('hybrid'))) return 'indica';
  if (cats.some(c => c.toLowerCase().includes('sativa')) && !cats.some(c => c.toLowerCase().includes('hybrid'))) return 'sativa';
  if (combined.includes('indica-dominant') || combined.includes('indica dominant')) return 'indica';
  if (combined.includes('sativa-dominant') || combined.includes('sativa dominant')) return 'sativa';
  return 'hybrid';
}

function detectEffects(desc: string): string[] {
  const effects: string[] = [];
  const lower = desc.toLowerCase();
  if (lower.includes('relax')) effects.push('Relaxing');
  if (lower.includes('euphori')) effects.push('Euphoric');
  if (lower.includes('uplift')) effects.push('Uplifting');
  if (lower.includes('creative') || lower.includes('creativity')) effects.push('Creative');
  if (lower.includes('energy') || lower.includes('energiz')) effects.push('Energizing');
  if (lower.includes('sleep') || lower.includes('sedati')) effects.push('Sleepy');
  if (lower.includes('happy') || lower.includes('happiness')) effects.push('Happy');
  if (lower.includes('focus')) effects.push('Focused');
  if (lower.includes('pain') || lower.includes('analgesic')) effects.push('Pain Relief');
  if (lower.includes('appetite') || lower.includes('hunger') || lower.includes('munchies')) effects.push('Hungry');
  return effects.slice(0, 5);
}

function extractThc(desc: string, shortDesc: string): string {
  const combined = shortDesc + ' ' + desc;
  const match = combined.match(/(\d{1,2})\s*%?\s*THC/i) || combined.match(/THC\s*:?\s*(\d{1,2})/i) || combined.match(/(\d{1,2})%/);
  return match ? match[1] : '';
}

export function wcProductToProduct(p: any): Product {
  const catNames = (p.categories || []).map((c: any) => c.name || c);
  const shortDesc = stripHtml(p.short_description || '');
  const desc = stripHtml(p.description || '');
  const strainType = detectStrainType(catNames, p.name, desc);
  const isAuto = catNames.some((c: string) => c.toLowerCase().includes('auto'));
  const isFem = catNames.some((c: string) => c.toLowerCase().includes('feminized'));

  return {
    id: String(p.id),
    slug: p.slug,
    name: p.name,
    description: desc,
    shortDescription: shortDesc.slice(0, 200),
    categories: catNames,
    strainType,
    thcContent: extractThc(desc, shortDesc),
    indicaPercent: strainType === 'indica' ? 70 : strainType === 'hybrid' ? 50 : 30,
    sativaPercent: strainType === 'sativa' ? 70 : strainType === 'hybrid' ? 50 : 30,
    effects: detectEffects(desc + ' ' + shortDesc),
    bestUse: [],
    seedOptions: (p.variations || []).length > 0
      ? [
          { label: '5 Seeds', price: parseFloat(p.price) || 24.99 },
          { label: '10 Seeds', price: (parseFloat(p.price) || 24.99) * 1.8 },
          { label: '20 Seeds', price: (parseFloat(p.price) || 24.99) * 3.2 },
        ]
      : [
          { label: '5 Seeds', price: parseFloat(p.price) || 24.99 },
          { label: '10 Seeds', price: (parseFloat(p.price) || 24.99) * 1.8 },
          { label: '20 Seeds', price: (parseFloat(p.price) || 24.99) * 3.2 },
        ],
    price: parseFloat(p.price) || 24.99,
    feminized: isFem || !isAuto,
    autoflower: isAuto,
    inStock: p.stock_status !== 'outofstock',
    imageUrl: p.images?.[0]?.src || '',
    metaTitle: `Buy ${p.name} Online USA | Royal King Seeds`,
    metaDescription: `Shop ${p.name} with fast, discreet shipping across the United States. Premium genetics, germination guarantee. Order from Royal King Seeds today.`,
    floweringTime: isAuto ? '8-10 weeks' : '9-11 weeks',
    plantHeight: isAuto ? 'Medium (2-4 ft)' : 'Tall (4-6 ft)',
    indoorYield: '14-18 oz/m²',
    outdoorYield: '16-24 oz/plant',
    difficulty: isAuto ? 'Beginner' : 'Intermediate',
  };
}

export async function fetchWcProducts(page = 1, perPage = 100): Promise<{ products: Product[]; total: number }> {
  const res = await fetch(wcUrl('products', { per_page: String(perPage), page: String(page), status: 'publish' }), {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return { products: [], total: 0 };
  const total = parseInt(res.headers.get('x-wp-total') || '0');
  const data = await res.json();
  return { products: data.map(wcProductToProduct), total };
}

export async function fetchAllProducts(): Promise<Product[]> {
  const all: Product[] = [];
  let page = 1;
  const perPage = 100;
  while (true) {
    const { products, total } = await fetchWcProducts(page, perPage);
    all.push(...products);
    if (all.length >= total || products.length === 0) break;
    page++;
  }
  return all;
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(wcUrl('products', { slug, status: 'publish' }), {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.length) return null;
  return wcProductToProduct(data[0]);
}

export async function fetchWpPosts(page = 1, perPage = 100): Promise<{ posts: any[]; total: number }> {
  const res = await fetch(wpUrl('posts', { per_page: String(perPage), page: String(page), _embed: '1' }), {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return { posts: [], total: 0 };
  const total = parseInt(res.headers.get('x-wp-total') || '0');
  const data = await res.json();
  return { posts: data, total };
}

export async function fetchWpPostBySlug(slug: string): Promise<any | null> {
  const res = await fetch(wpUrl('posts', { slug, _embed: '1' }), {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data[0] || null;
}

export async function fetchWpPages(page = 1, perPage = 100): Promise<{ pages: any[]; total: number }> {
  const res = await fetch(wpUrl('pages', { per_page: String(perPage), page: String(page) }), {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return { pages: [], total: 0 };
  const total = parseInt(res.headers.get('x-wp-total') || '0');
  const data = await res.json();
  return { pages: data, total };
}

export async function searchProducts(query: string, limit = 8): Promise<Product[]> {
  const res = await fetch(wcUrl('products', { search: query, per_page: String(limit), status: 'publish' }), {
    next: { revalidate: 300 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.map(wcProductToProduct);
}
