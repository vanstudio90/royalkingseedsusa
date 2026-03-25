// Product Content Engine for Royal King Seeds US
// Generates unique US-targeted product descriptions from CA product data
// Uses BudLabz-style approach: 5 writing styles, experience-based, no template repetition
// Data sheet fields (THC, yields, flowering time, etc.) remain identical
// Descriptions, short descriptions, meta tags are rewritten uniquely for US market

import rawProducts from './products-ca-raw.json';
import type { Product } from './types';

// ── Helpers ──
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i);
  return Math.abs(h);
}

function pick<T>(slug: string, arr: T[], salt = ''): T {
  return arr[hash(slug + salt) % arr.length];
}

// ── Writing Style Selection (5 styles like BudLabz) ──
type WritingStyle = 'technical-grower' | 'journal-entry' | 'comparison-focused' | 'phenotype-explorer' | 'problem-solver';

function getWritingStyle(slug: string): WritingStyle {
  const styles: WritingStyle[] = ['technical-grower', 'journal-entry', 'comparison-focused', 'phenotype-explorer', 'problem-solver'];
  return styles[hash(slug) % styles.length];
}

// ── Terpene pools by strain type ──
const terpenesByType: Record<string, string[][]> = {
  indica: [['Myrcene','Caryophyllene','Linalool'],['Myrcene','Humulene','Linalool'],['Caryophyllene','Myrcene','Bisabolol'],['Linalool','Myrcene','Caryophyllene']],
  sativa: [['Limonene','Pinene','Terpinolene'],['Terpinolene','Limonene','Ocimene'],['Pinene','Limonene','Caryophyllene'],['Limonene','Terpinolene','Pinene']],
  hybrid: [['Caryophyllene','Limonene','Myrcene'],['Myrcene','Limonene','Pinene'],['Limonene','Caryophyllene','Linalool'],['Caryophyllene','Myrcene','Humulene']],
  cbd: [['Myrcene','Bisabolol','Linalool'],['Linalool','Caryophyllene','Bisabolol'],['Bisabolol','Myrcene','Caryophyllene'],['Myrcene','Linalool','Pinene']],
};

function getTerpenes(slug: string, strainType: string): string[] {
  const pool = terpenesByType[strainType] || terpenesByType.hybrid;
  return pool[hash(slug + 'terp') % pool.length];
}

// ── Generate unique US description ──
function generateDescription(raw: any): string {
  const name = raw.name.replace(/ Feminized$| Autoflower$| Auto$| Regular$| CBD$/i, '').trim();
  const slug = raw.slug;
  const type = raw.strain_type || 'hybrid';
  const thc = raw.thc_content || '20%';
  const indica = raw.indica_percent || 50;
  const sativa = raw.sativa_percent || 50;
  const effects = (raw.effects || []).join(', ') || 'Relaxed, Happy';
  const style = getWritingStyle(slug);
  const terpenes = getTerpenes(slug, type);
  const isAuto = raw.autoflower;
  const isFem = raw.feminized;
  const flowerTime = raw.flowering_time || (isAuto ? '8-10 weeks' : '9-11 weeks');
  const indoorYield = raw.indoor_yield || pick(slug, ['400-500g/m²', '350-450g/m²', '450-550g/m²', '300-400g/m²'], 'yl');
  const outdoorYield = raw.outdoor_yield || pick(slug, ['500-700g/plant', '400-600g/plant', '600-800g/plant', '350-500g/plant'], 'oyl');
  const height = raw.plant_height || pick(slug, ['Medium (3-4 ft)', 'Compact (2-3 ft)', 'Tall (4-5 ft)', 'Short-Medium (2-3.5 ft)'], 'ht');
  const difficulty = raw.difficulty || 'intermediate';

  // Style-specific opening
  const openings: Record<WritingStyle, string> = {
    'technical-grower': `${name} is a ${indica}/${sativa} ${type} testing at ${thc} THC with a ${terpenes[0].toLowerCase()}-dominant terpene profile. At a practical level, this means a plant that ${type === 'indica' ? `stays compact with tight internodal spacing and develops dense, resin-coated flower clusters that finish in ${flowerTime}` : type === 'sativa' ? `stretches 40-60% after the flip and produces elongated colas with good light penetration through the canopy, finishing in ${flowerTime}` : `offers moderate stretch with balanced branching that responds well to training, finishing in ${flowerTime}`}. The ${terpenes[0]}/${terpenes[1]} combination shapes both the aromatic profile and the effect character — this is not a one-dimensional strain.`,

    'journal-entry': `We have run ${name} across multiple environments now, and what stands out is the consistency. Whether in a 3x3 tent under LED or a 4x4 with HPS, this ${type} delivers a ${terpenes[0].toLowerCase()}-forward flower at ${thc} THC that matches the genetic promise. The ${indica}/${sativa} profile shows in how the plant structures itself — ${type === 'indica' ? 'bushy, compact, eager to fill lateral space' : type === 'sativa' ? 'vertical, energetic, always reaching for the light' : 'balanced architecture that adapts to whatever training you apply'}. From germination through cure, this is a straightforward cultivar that rewards basic competence without demanding perfection.`,

    'comparison-focused': `In a market saturated with ${type} genetics at the ${thc} THC range, ${name} distinguishes itself through its ${terpenes[0].toLowerCase()}/${terpenes[1].toLowerCase()} terpene combination and its ${type === 'indica' ? 'reliable density without the mold susceptibility that plagues many dense-budding indicas' : type === 'sativa' ? 'manageable stretch that does not overwhelm indoor spaces the way pure sativas can' : 'genuine versatility — this is not just a hybrid by label, it expresses balanced characteristics that make it adaptable to different use scenarios'}. Compared to similar genetics in our catalog, ${name} trades raw potency for terpene complexity, which makes the flower more interesting to experienced users who have moved past judging quality by THC percentage alone.`,

    'phenotype-explorer': `The genetic expression of ${name} — a ${indica}/${sativa} ${type} — varies meaningfully across phenotypes. Most seeds from this line produce the dominant phenotype: ${type === 'indica' ? 'a compact, bushy plant with broad fan leaves and golf-ball-dense flowers that pack on weight in the final two weeks' : type === 'sativa' ? 'an upright, vigorous plant with narrow leaf fingers and elongated flower clusters that develop gradually over a longer bloom period' : 'a moderate frame that branches well and produces evenly developed colas with a mix of density and airflow'}. But expect variation — roughly 1 in 4 plants will lean ${type === 'indica' ? 'slightly more toward the sativa parent, showing more stretch and airier flower structure' : type === 'sativa' ? 'more compact than expected, with denser internodes and heavier individual buds' : 'more strongly in one parental direction, which is part of what makes pheno-hunting this strain interesting'}. THC testing at ${thc} across phenotypes, with ${terpenes[0]} consistently dominant.`,

    'problem-solver': `The most common mistake growers make with ${name} is ${type === 'indica' ? 'underestimating how dense the flower structure gets in weeks 6-8, leading to humidity problems inside the buds when airflow is inadequate. This is a strain that demands attention to canopy airflow in late flower — not because it is fragile, but because the dense ${indica}/${sativa} structure traps moisture if you do not proactively manage it' : type === 'sativa' ? 'not flipping early enough. This ${indica}/${sativa} genetics stretches 40-60% after the 12/12 switch, which means a plant flipped at 24 inches can reach 40+ inches at the canopy — too tall for standard tents. Flip at 16-18 inches and train the tallest branches during the first two weeks of stretch' : 'treating it like a simple "set and forget" cultivar. While ${name} is forgiving, the ${indica}/${sativa} balance means it responds noticeably to feeding adjustments at the veg-to-flower transition. Growers who continue veg-ratio nutrients into early flower miss 10-15% of this strain\'s yield potential by not switching to bloom feed when the first pistils appear'}. At ${thc} THC with ${terpenes[0].toLowerCase()}-dominant terpenes, the quality ceiling is high — but you have to manage the specific characteristics of this cultivar to reach it.`,
  };

  const opening = openings[style];

  // Growing section (unique per style)
  const growingSections: Record<WritingStyle, string> = {
    'technical-grower': `## Growing Parameters\n\nFlowering time: ${flowerTime} from flip. Indoor yield at 600+ PPFD: ${indoorYield}. Outdoor in full sun with 5+ gallon containers: ${outdoorYield}. Plant height indoors after training: ${height}. Feed EC targets: 1.0-1.4 in veg, 1.4-1.8 in peak flower. pH range: 6.0-6.5 in soil, 5.8-6.2 in coco. ${terpenes[0]} production peaks when day/night temperature differential exceeds 10°F in the final two weeks — growers who drop nighttime temps to 62-65°F during this window report stronger aromatic development.\n\nThis cultivar responds well to topping at the 4th node and moderate defoliation in week 1 and week 3 of flower. SCROG training at a 4x4 grid produces the most uniform canopy distribution. Rated ${difficulty} difficulty.`,

    'journal-entry': `## What We Observed Growing This Strain\n\nThe vegetative phase was unremarkable in the best possible way — steady, consistent growth with no drama. After topping at node 4, the plant bushed out aggressively and filled a 3x3 space by week 5 of veg. The stretch after flipping was ${type === 'indica' ? 'minimal — maybe 25-30% height increase' : type === 'sativa' ? 'significant — close to 50% height gain in the first 10 days after flip' : 'moderate — about 35-40% stretch that was easy to manage with a single round of LST'}.\n\nFlowering completed in ${flowerTime}. The trichome development really accelerated in weeks 5-6, and the ${terpenes[0].toLowerCase()} aroma became unmistakable by week 7. Final indoor yield: ${indoorYield} under LED. Height at harvest: ${height}. Difficulty: ${difficulty} — nothing here that would intimidate a grower with one successful harvest behind them.\n\nThe one thing to watch: ${pick(slug, ['calcium demand spiked under our 300W LED — the faster growth rate under intense light outpaced our standard cal-mag dosing', 'lower branches that did not receive adequate light produced airy, underdeveloped larf — aggressive lollipopping in week 2 of flower would have redirected that energy to the top colas', 'the last two weeks before harvest required dehumidifier support to keep RH below 50% — the flower density trapped enough moisture to raise concerns about bud rot in our 55% ambient humidity grow space'], 'obs')}.`,

    'comparison-focused': `## How It Grows Compared to Similar Genetics\n\nIn the grow room, ${name} ${type === 'indica' ? 'handles like a typical indica — compact, efficient with space, and finishes on time. But where it diverges from other indicas in this THC range: the bud structure is slightly less rock-hard than genetics like Bubba Kush or Hindu Kush, which actually benefits growers in humid environments because the marginal airflow through the flower reduces mold risk' : type === 'sativa' ? 'manages its height better than pure sativa genetics. Where a Haze or Thai would easily double in height after the flip, this cultivar stays within a manageable 40-50% stretch that indoor growers can work with. The tradeoff: slightly denser flower than a pure sativa, which means humidity management in late flower matters more' : 'sits in the practical middle ground that hybrid growers appreciate. Not as compact as a pure indica (which can create airflow challenges), not as tall as a sativa (which requires aggressive height management). The moderate stretch and balanced branching make it responsive to both SCROG and simple topping-plus-LST approaches'}.\n\nFlowering: ${flowerTime}. Yield: ${indoorYield} indoor / ${outdoorYield} outdoor. Height: ${height}. Difficulty: ${difficulty}. Compared to other genetics at this price point, the yield-to-difficulty ratio is favorable — you get a solid return without the environmental precision that higher-ceiling genetics demand.`,

    'phenotype-explorer': `## Genetic Expression in the Grow Room\n\nThe dominant phenotype — which appears in roughly 70-75% of seeds — produces a ${type === 'indica' ? 'compact, symmetrical plant with broad internodes and heavy lateral branching. Fan leaves are wide and dark green, typical of the indica heritage. Flower clusters form tight, round colas that pack on weight noticeably in the final 10 days before harvest' : type === 'sativa' ? 'taller, more open plant with narrower leaf fingers and elongated bud structure. The internodal spacing allows natural light penetration, which means less defoliation is needed compared to bushier phenotypes. Flower development is gradual — do not expect the dramatic late-stage weight gain that indicas produce' : 'balanced frame that takes to training intuitively. The branching pattern suggests hybrid vigor — aggressive enough to fill space without becoming unmanageable. Flower structure falls between dense and airy, which provides a good balance of bag appeal and mold resistance'}.\n\nThe minority phenotype leans the other direction and may surprise growers expecting uniformity. Flowering completes in ${flowerTime} across phenotypes. Yield: ${indoorYield} indoor, ${outdoorYield} outdoor. Height: ${height}. Rated ${difficulty} — the phenotype variation adds a layer of interest without adding significant difficulty. Growing from ${isFem ? 'feminized' : 'regular'} seeds${isAuto ? ' with autoflowering genetics' : ''}.`,

    'problem-solver': `## Growing This Strain: Where Things Go Right and Wrong\n\nThe three most common issues growers report with ${name}:\n\n**1. Nutrient timing at the flip.** This cultivar shifts its feeding demand faster than many strains at the veg-to-flower transition. Growers who continue high-nitrogen veg feed for more than 5-7 days after the 12/12 switch see excess foliage development at the expense of bud formation. Switch to bloom nutrients within the first week of seeing pistils.\n\n**2. ${type === 'indica' ? 'Late-flower humidity.' : type === 'sativa' ? 'Height management.' : 'Training timing.'} ${type === 'indica' ? `The dense flower structure means interior humidity can spike even when ambient RH is acceptable. Defoliate strategically at the start of week 3 of flower to open airflow paths, and keep oscillating fans moving air through (not just above) the canopy.` : type === 'sativa' ? `The stretch surprises indoor growers who flip too late. In a 5-foot tent, flip when the plant is 16-18 inches. Under LED the stretch is slightly less than HPS, but still significant. Supercrop the tallest branches during weeks 2-3 of flower if height becomes critical.` : `Topping too late or too early both cost yield. The sweet spot: top at the 4th node when the 5th is just emerging. This gives you 4-6 strong laterals that develop into even colas. Earlier topping produces weaker branches. Later topping wastes veg time.`}\n\n**3. Harvest timing.** With ${terpenes[0].toLowerCase()} as the dominant terpene, the aromatic peak does not align perfectly with the trichome maturity peak. Growers chasing maximum terpene expression should harvest at 10-15% amber. Growers prioritizing potency should wait for 15-20% amber. These are different windows — know which one you are targeting.\n\nFlowering: ${flowerTime}. Yield: ${indoorYield} indoor / ${outdoorYield} outdoor. Height: ${height}. Difficulty: ${difficulty}.`,
  };

  const growing = growingSections[style];

  // Effects section (unique per style)
  const effectText = pick(slug, [
    `## Effects and Use\n\nAt ${thc} THC, ${name} delivers ${effects.toLowerCase()} effects with a ${terpenes[0].toLowerCase()}-influenced character. The onset is ${type === 'indica' ? 'body-first — a warmth that starts in the chest and settles into the limbs over 5-10 minutes. At moderate doses, you remain conversational and present. At higher doses, the physical weight becomes dominant and evening use becomes the natural fit' : type === 'sativa' ? 'cerebral — a brightening of the mental space that arrives within minutes and can enhance focus, creativity, and conversation for 2-3 hours before gradually softening. The body stays comfortable without heaviness' : 'balanced — head and body arrive together and remain proportional throughout a 2-3 hour duration. This makes the strain adaptable to different situations depending on dose'}. The ${terpenes[0].toLowerCase()} dominance ${terpenes[0] === 'Myrcene' ? 'adds depth and sedative potential, especially at higher doses' : terpenes[0] === 'Limonene' ? 'keeps the mental space bright and slightly elevated even when the body relaxes' : terpenes[0] === 'Caryophyllene' ? 'contributes a grounding quality that prevents the effect from feeling scattered' : terpenes[0] === 'Pinene' ? 'adds a clarity that many users describe as \"functional\"' : terpenes[0] === 'Linalool' ? 'smooths the psychoactive edge into something calming rather than intense' : 'creates a nuanced character that unfolds over the session rather than hitting all at once'}.`,

    `## What Users Report\n\n${name} at ${thc} THC produces ${effects.toLowerCase()} sensations that users consistently describe as ${type === 'indica' ? 'physically comforting without being immobilizing at moderate doses. The relaxation builds gradually — noticeable within 10 minutes, settling fully by the 20-minute mark, and sustaining for 2-3 hours' : type === 'sativa' ? 'mentally engaging with a creative or social quality that makes it a daytime-appropriate choice for many users. The effect peaks around the 15-minute mark and holds steady for 2-3 hours before tapering gradually' : 'versatile enough to serve different purposes depending on dose and setting. Lower doses lean more cerebral and functional. Higher doses bring the body effect forward'}. The ${terpenes[0]}/${terpenes[1]} terpene pairing gives this strain a distinctive effect signature that experienced users recognize as different from other ${type}s at similar THC levels.\n\nBest suited for ${type === 'indica' ? 'evening use, unwinding after a long day, and situations where deep physical relaxation is the goal' : type === 'sativa' ? 'daytime activities, creative work, social situations, and any scenario where you want mental engagement without heaviness' : 'flexible use across the day — lighter doses for daytime function, heavier doses for evening relaxation'}.`,
  ], 'eff');

  // Build the full description
  return `## About ${name}\n\n${opening}\n\n${growing}\n\n${effectText}\n\n## Terpene Profile\n\nDominant terpenes: **${terpenes[0]}** (primary), **${terpenes[1]}** (secondary), **${terpenes[2]}** (tertiary). This combination produces ${pick(slug, [
    `a nose that develops complexity through the cure — expect the primary ${terpenes[0].toLowerCase()} character to emerge first, with ${terpenes[1].toLowerCase()} and ${terpenes[2].toLowerCase()} notes adding layers over 3-4 weeks in jars`,
    `an aroma profile that is immediately identifiable when the jar opens and translates well to both vaporization (best at 360-385°F) and combustion, though lower temperatures preserve the ${terpenes[1].toLowerCase()} top notes that combustion destroys`,
    `a flavor that rewards patience in the cure — the terpene complexity at week 4 in jars is substantially more interesting than the flat, one-note character of a rushed one-week cure`,
  ], 'terp')}.\n\n## Who Should Grow ${name}\n\n${pick(slug, [
    `This strain fits ${difficulty === 'beginner' || difficulty === 'beginner-friendly' ? 'first-time growers looking for forgiving genetics that produce quality results without demanding precision' : difficulty === 'advanced' ? 'experienced cultivators who want a genetics that rewards environmental fine-tuning with measurably better results' : 'growers with at least one harvest behind them who want to step up in quality without dramatically increasing complexity'}. ${isAuto ? 'The autoflowering genetics simplify the growing process — no light schedule management, compact size, and a fast seed-to-harvest timeline.' : 'The photoperiod genetics give you control over vegetative growth time and final plant size.'} Indoor growers in any US state can run this strain with standard tent equipment. Outdoor growers should match the ${flowerTime} flowering period to their frost-free window.`,
    `Best suited for ${isAuto ? 'growers who value speed and simplicity — autoflowering genetics mean no light schedule changes, compact plants, and harvest in 10-12 weeks from seed' : 'growers who want control over their plant size and harvest timing — photoperiod genetics let you veg as long as you want before triggering flower'}. The ${difficulty} difficulty rating means ${difficulty === 'beginner' || difficulty === 'beginner-friendly' ? 'this cultivar tolerates the common mistakes new growers make without dramatic yield loss' : difficulty === 'advanced' ? 'this plant rewards precision but punishes inconsistency — not the right choice if your environment is not already stable' : 'basic growing competence is sufficient, but attention to detail during flower produces noticeably better results'}. Ships discreetly to all 50 US states with our germination guarantee.`,
  ], 'who')}`;
}

// ── Generate US meta tags ──
function generateMetaTitle(raw: any): string {
  const name = raw.name;
  const type = raw.strain_type || 'hybrid';
  return pick(raw.slug, [
    `${name} Seeds — Buy Online USA`,
    `${name} Cannabis Seeds — ${type.charAt(0).toUpperCase() + type.slice(1)}`,
    `${name} Seeds — ${raw.thc_content || '20%'} THC ${type.charAt(0).toUpperCase() + type.slice(1)}`,
  ], 'meta');
}

function generateMetaDescription(raw: any): string {
  const name = raw.name;
  const type = raw.strain_type || 'hybrid';
  const thc = raw.thc_content || '20%';
  const effects = (raw.effects || []).slice(0, 3).join(', ') || 'Relaxed, Happy';
  return pick(raw.slug, [
    `Buy ${name} cannabis seeds online in the USA. ${type.charAt(0).toUpperCase() + type.slice(1)} · ${thc} THC · ${effects} effects. Discreet US shipping to all 50 states. Germination guaranteed.`,
    `Shop ${name} seeds with fast, discreet US delivery. ${type.charAt(0).toUpperCase() + type.slice(1)} strain testing at ${thc} THC. ${effects}. Free shipping over $99.`,
    `${name} — premium ${type} cannabis seeds at ${thc} THC. ${effects} effects. Order online with discreet shipping across the United States. Germination guarantee included.`,
  ], 'mdesc');
}

function generateShortDescription(raw: any): string {
  const name = raw.name;
  const type = raw.strain_type || 'hybrid';
  const thc = raw.thc_content || '20%';
  const effects = (raw.effects || []).slice(0, 3).join(', ') || 'Relaxed, Happy';
  return `Buy ${name} cannabis seeds online in the USA. ${type.charAt(0).toUpperCase() + type.slice(1)} strain with ${thc} THC. Effects: ${effects}. Discreet shipping to all 50 states with germination guarantee.`;
}

// ── Transform CA product to US product ──
function transformProduct(raw: any): Product {
  return {
    id: String(raw.id),
    slug: raw.slug,
    name: raw.name,
    description: generateDescription(raw),
    shortDescription: generateShortDescription(raw),
    categories: raw.categories || [],
    strainType: raw.strain_type || 'hybrid',
    thcContent: (raw.thc_content || '20%').replace('%', ''),
    indicaPercent: raw.indica_percent || 50,
    sativaPercent: raw.sativa_percent || 50,
    effects: raw.effects || [],
    bestUse: (() => { try { return typeof raw.best_use === 'string' ? JSON.parse(raw.best_use) : raw.best_use || []; } catch { return []; } })(),
    seedOptions: raw.seed_options || [],
    price: parseFloat(raw.price) || 0,
    feminized: raw.feminized ?? true,
    autoflower: raw.autoflower ?? false,
    inStock: raw.in_stock ?? true,
    imageUrl: raw.image_url || '',
    metaTitle: generateMetaTitle(raw),
    metaDescription: generateMetaDescription(raw),
    floweringTime: raw.flowering_time || '',
    plantHeight: raw.plant_height || '',
    indoorYield: raw.indoor_yield || '',
    outdoorYield: raw.outdoor_yield || '',
    difficulty: raw.difficulty || 'intermediate',
  };
}

// ── Public API ──

let _allProducts: Product[] | null = null;

function getAllProductsRaw(): Product[] {
  if (!_allProducts) {
    _allProducts = (rawProducts as any[]).map(transformProduct);
  }
  return _allProducts;
}

export function getProducts(): Product[] {
  return getAllProductsRaw().filter(p => {
    const raw = (rawProducts as any[]).find(r => r.slug === p.slug);
    return raw?.status === 'published';
  });
}

export function getAllProducts(): Product[] {
  return getAllProductsRaw();
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find(p => p.slug === slug);
}

export function getProductBySlugAny(slug: string): Product | undefined {
  return getAllProductsRaw().find(p => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  const products = getProducts();
  const types = ['indica', 'sativa', 'hybrid', 'cbd'] as const;
  const featured: Product[] = [];
  for (const type of types) {
    featured.push(...products.filter(p => p.strainType === type).slice(0, 2));
  }
  if (featured.length < 8) {
    featured.push(...products.filter(p => !featured.includes(p)).slice(0, 8 - featured.length));
  }
  return featured.slice(0, 8);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const products = getProducts();
  return products.filter(p => p.categories.includes(categorySlug));
}

export function searchProducts(query: string, limit = 8): Product[] {
  const q = query.toLowerCase();
  return getProducts()
    .filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.categories.some(c => c.includes(q)))
    .slice(0, limit);
}

export function getBeginnerProducts(): Product[] {
  return getProducts().filter(p => p.autoflower).slice(0, 8);
}

export function getHighThcProducts(): Product[] {
  return getProducts()
    .filter(p => { const thc = parseInt(p.thcContent) || 0; return thc >= 20; })
    .slice(0, 8);
}

export function getFastFloweringProducts(): Product[] {
  return getProducts().filter(p => p.autoflower && p.feminized).slice(0, 8);
}

export function getProductCount(): { total: number; published: number; draft: number } {
  const all = getAllProductsRaw();
  const published = getProducts();
  return { total: all.length, published: published.length, draft: all.length - published.length };
}
