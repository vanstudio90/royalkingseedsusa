/**
 * Fetch SKUs from WooCommerce (bcseedstores.com) and map them to local products.
 *
 * Output: scripts/sku-mapping.json — a mapping of local slug → { parentSku, variations: [{label, sku}] }
 *
 * REVERSIBLE: To undo, just delete scripts/sku-mapping.json and revert products-ca-raw.json from git.
 */

const WC_URL = 'https://bcseedstores.com/wp-json/wc/v3';
const CK = 'ck_961921f9a209e386febb150116e0381598d737cb';
const CS = 'cs_69aabe854a6ee7c1f6f37da7495bff291664d07e';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function wcFetch(endpoint, params = {}) {
  const url = new URL(`${WC_URL}/${endpoint}`);
  url.searchParams.set('consumer_key', CK);
  url.searchParams.set('consumer_secret', CS);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`WC API error: ${res.status} ${await res.text()}`);
  const totalPages = parseInt(res.headers.get('x-wp-totalpages') || '1');
  const data = await res.json();
  return { data, totalPages };
}

// Normalize strain name from slug for matching
function normalizeStrain(slug) {
  return slug
    .replace(/-feminized$/, '')
    .replace(/-auto$/, '')
    .replace(/-autoflower$/, '')
    .replace(/-cannabis-seeds.*$/, '')
    .replace(/-seeds.*$/, '')
    .replace(/-\d+$/, '') // remove trailing numbers like -2
    .replace(/[^a-z0-9]/g, '')
    .toLowerCase();
}

async function main() {
  console.log('Loading local products...');
  const localProducts = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/lib/products/products-ca-raw.json'), 'utf8'));
  console.log(`Local products: ${localProducts.length}`);

  // Build local lookup: normalizedName → [{ slug, feminized, autoflower }]
  const localByName = {};
  for (const p of localProducts) {
    const norm = normalizeStrain(p.slug);
    if (!localByName[norm]) localByName[norm] = [];
    localByName[norm].push({
      slug: p.slug,
      feminized: !!p.feminized,
      autoflower: !!p.autoflower || p.slug.endsWith('-auto'),
      isFemPage: p.slug.endsWith('-feminized'),
      isAutoPage: p.slug.endsWith('-auto'),
    });
  }

  console.log('Fetching WooCommerce products (this may take a few minutes)...');

  let allWcProducts = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    process.stdout.write(`  Page ${page}/${totalPages}...\r`);
    const result = await wcFetch('products', { per_page: '100', page: String(page) });
    allWcProducts.push(...result.data);
    totalPages = result.totalPages;
    page++;
    // Rate limit
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\nFetched ${allWcProducts.length} WooCommerce products`);

  // Now fetch variations for each product and build SKU mapping
  const skuMapping = {};
  let matched = 0;
  let unmatched = 0;

  for (let i = 0; i < allWcProducts.length; i++) {
    const wc = allWcProducts[i];
    const wcNorm = normalizeStrain(wc.slug);

    process.stdout.write(`  Matching ${i + 1}/${allWcProducts.length} — ${wc.name}...\r`);

    const localMatches = localByName[wcNorm];
    if (!localMatches || localMatches.length === 0) {
      unmatched++;
      continue;
    }

    // Fetch variations
    let variations = [];
    try {
      const vResult = await wcFetch(`products/${wc.id}/variations`, { per_page: '100' });
      variations = vResult.data;
    } catch (e) {
      console.log(`\n  Warning: Could not fetch variations for ${wc.name}: ${e.message}`);
      continue;
    }

    // Group variations by flowering type
    const femVariations = [];
    const autoVariations = [];

    for (const v of variations) {
      const floweringType = v.attributes?.find(a => a.slug === 'pa_flowering-type' || a.name === 'Flowering Type')?.option || '';
      const seedCount = v.attributes?.find(a => a.slug === 'pa_number-of-seeds' || a.name === 'Number Of Seeds')?.option || '';

      const entry = { sku: v.sku, label: seedCount, price: v.price };

      if (floweringType.toLowerCase().includes('auto')) {
        autoVariations.push(entry);
      } else {
        femVariations.push(entry);
      }
    }

    // Match to local products
    for (const local of localMatches) {
      const isAuto = local.isAutoPage;
      const relevantVariations = isAuto ? autoVariations : femVariations;

      // If no type-specific variations, use all of them (product only has one type)
      const finalVariations = relevantVariations.length > 0 ? relevantVariations : (isAuto ? autoVariations : femVariations);

      if (finalVariations.length > 0 || wc.sku) {
        skuMapping[local.slug] = {
          parentSku: wc.sku,
          wcProductId: wc.id,
          wcProductName: wc.name,
          floweringType: isAuto ? 'Autoflowering' : 'Feminized',
          variations: finalVariations,
        };
        matched++;
      }
    }

    // Rate limit
    if (i % 5 === 0) await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n\nMatching complete:`);
  console.log(`  Matched: ${matched}`);
  console.log(`  Unmatched WC products: ${unmatched}`);
  console.log(`  Total SKU entries: ${Object.keys(skuMapping).length}`);

  // Save mapping
  const outputPath = path.join(__dirname, 'sku-mapping.json');
  fs.writeFileSync(outputPath, JSON.stringify(skuMapping, null, 2));
  console.log(`\nSaved to: ${outputPath}`);

  // Also update products-ca-raw.json with parent SKUs
  const backupPath = path.join(__dirname, '../src/lib/products/products-ca-raw.backup.json');
  fs.writeFileSync(backupPath, JSON.stringify(localProducts, null, 2));
  console.log(`Backup saved to: ${backupPath}`);

  let updated = 0;
  for (const p of localProducts) {
    const mapping = skuMapping[p.slug];
    if (mapping) {
      p.sku = mapping.parentSku || '';
      // Store variation SKUs in seed_options if they exist
      if (mapping.variations.length > 0 && Array.isArray(p.seed_options)) {
        for (const opt of p.seed_options) {
          // Match by seed count number
          const optNum = parseInt(opt.label) || 0;
          const matchVar = mapping.variations.find(v => {
            const vNum = parseInt(v.label) || 0;
            return vNum === optNum;
          });
          if (matchVar) {
            opt.sku = matchVar.sku;
          }
        }
      }
      updated++;
    }
  }

  fs.writeFileSync(
    path.join(__dirname, '../src/lib/products/products-ca-raw.json'),
    JSON.stringify(localProducts, null, 2)
  );
  console.log(`Updated ${updated} products in products-ca-raw.json`);
  console.log('\nTo REVERSE: restore from products-ca-raw.backup.json');
}

main().catch(console.error);
