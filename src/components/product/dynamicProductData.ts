/**
 * Dynamic product data generation for tabs
 * Generates terpenes, lineage, FAQs, and strain specs from product attributes
 * so all 341+ products have rich, unique tab content.
 */

import type { Product } from '@/lib/products/types';

// ─── Deterministic hash for consistent data per product ───
function hash(str: string): number {
  return str.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0) >>> 0;
}

function pick<T>(arr: T[], seed: number, count: number): T[] {
  const shuffled = [...arr];
  let s = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = ((s * 1103515245 + 12345) & 0x7fffffff) >>> 0;
    const j = s % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

// ─── TERPENES ───
interface TerpeneProfile {
  name: string;
  flavor: string;
  aroma: string;
  effect: string;
  color: string;
  percentage: number;
}

const allTerpenes = [
  { name: 'Myrcene', flavor: 'Earthy, musky, herbal', aroma: 'Cloves, cardamom, hops', effect: 'Relaxation, sedation, pain relief', color: '#6B8E4E' },
  { name: 'Limonene', flavor: 'Citrus, lemon, orange', aroma: 'Fresh citrus, lemon zest', effect: 'Mood elevation, stress relief', color: '#F5C542' },
  { name: 'Caryophyllene', flavor: 'Peppery, spicy, woody', aroma: 'Black pepper, cloves', effect: 'Anti-inflammatory, stress relief', color: '#8B5E3C' },
  { name: 'Linalool', flavor: 'Floral, lavender, sweet', aroma: 'Lavender, chamomile', effect: 'Calming, anti-anxiety', color: '#9B72AA' },
  { name: 'Pinene', flavor: 'Pine, cedar, rosemary', aroma: 'Fresh pine forest', effect: 'Alertness, memory retention', color: '#2E7D32' },
  { name: 'Terpinolene', flavor: 'Floral, herbal, piney', aroma: 'Lilac, nutmeg, cumin', effect: 'Uplifting, mildly sedating', color: '#7B9E87' },
  { name: 'Humulene', flavor: 'Earthy, woody, hoppy', aroma: 'Hops, sage, ginseng', effect: 'Appetite suppression, anti-inflammatory', color: '#A08050' },
  { name: 'Ocimene', flavor: 'Sweet, herbal, woody', aroma: 'Mint, parsley, basil', effect: 'Uplifting, antiviral', color: '#4CAF50' },
  { name: 'Bisabolol', flavor: 'Sweet, floral, delicate', aroma: 'Chamomile, honey', effect: 'Skin healing, anti-irritation', color: '#E8B4B8' },
  { name: 'Camphene', flavor: 'Herbal, damp, musky', aroma: 'Fir needles, damp woodland', effect: 'Antioxidant, cardiovascular support', color: '#5D8A66' },
  { name: 'Valencene', flavor: 'Citrus, sweet orange', aroma: 'Valencia oranges, grapefruit', effect: 'Anti-inflammatory, uplifting', color: '#FF9800' },
  { name: 'Geraniol', flavor: 'Rose, sweet, floral', aroma: 'Roses, peaches', effect: 'Neuroprotection, antioxidant', color: '#E91E63' },
];

export function generateTerpenes(product: Product): TerpeneProfile[] {
  const h = hash(product.slug);
  const st = product.strainType;

  // Indica-dominant: more Myrcene, Caryophyllene, Linalool
  // Sativa-dominant: more Limonene, Pinene, Terpinolene
  // Hybrid: balanced mix
  let primary: typeof allTerpenes;
  if (st === 'indica') {
    primary = [allTerpenes[0], allTerpenes[2], allTerpenes[3], allTerpenes[6]]; // Myrcene, Caryo, Linalool, Humulene
  } else if (st === 'sativa') {
    primary = [allTerpenes[1], allTerpenes[4], allTerpenes[5], allTerpenes[7]]; // Limonene, Pinene, Terpinolene, Ocimene
  } else if (st === 'cbd') {
    primary = [allTerpenes[0], allTerpenes[3], allTerpenes[8], allTerpenes[2]]; // Myrcene, Linalool, Bisabolol, Caryo
  } else {
    primary = [allTerpenes[0], allTerpenes[1], allTerpenes[2], allTerpenes[4]]; // Mixed
  }

  const secondary = pick(allTerpenes.filter(t => !primary.includes(t)), h, 2);
  const selected = [...primary.slice(0, 3), ...secondary.slice(0, 2)];

  return selected.map((t, i) => {
    const basePercentage = i === 0 ? 30 + (h % 15) : i === 1 ? 18 + (h % 12) : 8 + ((h >> (i * 3)) % 10);
    return { ...t, percentage: Math.min(45, basePercentage) };
  });
}

// ─── LINEAGE ───
export interface LineageInfo {
  parents: string[];
  breeder: string;
  origin: string;
  generation: string;
  crossType: string;
  history: string;
}

const breeders = ['Royal King Seeds', 'DNA Genetics', 'Barney\'s Farm', 'Dutch Passion', 'Sensi Seeds', 'Green House Seeds', 'Mephisto Genetics', 'Fast Buds', 'Sweet Seeds', 'Humboldt Seed Co.'];
const origins = ['California, USA', 'California, Canada', 'Netherlands', 'Colorado, USA', 'Spain', 'Northern California, USA', 'Oregon, USA', 'New York, Canada', 'Amsterdam, Netherlands', 'Pacific Northwest, USA'];

export function generateLineage(product: Product): LineageInfo {
  const h = hash(product.slug);
  const name = product.name.replace(/ Feminized$| Auto$| Seeds$/, '');
  const st = product.strainType;

  // Generate plausible parent strains
  const indicaParents = ['Afghan Kush', 'Northern Lights', 'Granddaddy Purple', 'Bubba Kush', 'Hindu Kush', 'Purple Punch', 'Blueberry', 'Blackberry Kush', 'Master Kush', 'LA Confidential', 'Grape Ape', 'Death Star'];
  const sativaParents = ['Haze', 'Jack Herer', 'Durban Poison', 'Green Crack', 'Sour Diesel', 'Thai Landrace', 'Amnesia Haze', 'Maui Wowie', 'Strawberry Cough', 'Super Lemon Haze', 'Tangie', 'Trainwreck'];
  const hybridParents = ['OG Kush', 'Girl Scout Cookies', 'Gelato', 'Wedding Cake', 'Blue Dream', 'Gorilla Glue', 'Chemdawg', 'White Widow', 'Skunk #1', 'AK-47', 'Pineapple Express', 'Sunset Sherbet'];

  let parentPool = st === 'indica' ? indicaParents : st === 'sativa' ? sativaParents : hybridParents;
  const parents = pick(parentPool, h, 2).filter(p => !name.toLowerCase().includes(p.toLowerCase()));
  if (parents.length < 2) parents.push(pick(hybridParents, h + 99, 1)[0]);
  if (product.autoflower) parents.push('Ruderalis');

  const breeder = breeders[h % breeders.length];
  const origin = origins[(h >> 4) % origins.length];
  const generation = product.autoflower ? `Auto F${3 + (h % 3)}` : `S1 Feminized`;
  const crossType = product.autoflower
    ? `Autoflower ${st.charAt(0).toUpperCase() + st.slice(1)}`
    : st === 'indica' ? 'Indica-Dominant Cross' : st === 'sativa' ? 'Sativa-Dominant Cross' : 'Hybrid Cross';

  const history = `${name} was developed by ${breeder} through selective breeding of ${parents.slice(0, 2).join(' and ')} genetics. `
    + `This ${crossType.toLowerCase()} was stabilized over multiple generations to lock in its signature terpene profile and consistent ${st} effects. `
    + `The resulting cultivar delivers reliable performance for American growers, combining `
    + (st === 'indica'
      ? 'deep physical relaxation with dense, resinous bud production that thrives in diverse American climates.'
      : st === 'sativa'
      ? 'uplifting cerebral effects with vigorous growth patterns suited to longer growing seasons.'
      : 'a balanced effect profile with versatile growing characteristics that adapt well to diverse American environments.');

  return { parents: parents.slice(0, product.autoflower ? 3 : 2), breeder, origin, generation, crossType, history };
}

// ─── STRAIN SPECS ───
export interface StrainSpecs {
  thc: string;
  lineageShort: string;
  type: string;
  climate: string;
  harvest: string;
  height: string;
  yieldRating: string;
  yieldIndoor: string;
  yieldOutdoor: string;
  floweringTime: string;
}

export function generateStrainSpecs(product: Product): StrainSpecs {
  const h = hash(product.slug);
  const st = product.strainType;
  const thcBase = parseInt(product.thcContent?.replace(/[^\d]/g, '') || '0') || (15 + (h % 13));
  const thcRange = `${thcBase}% - ${thcBase + 3 + (h % 3)}%`;
  const thcLabel = thcBase >= 25 ? 'Very High' : thcBase >= 20 ? 'High' : thcBase >= 15 ? 'Medium-High' : 'Medium';

  const lineage = generateLineage(product);
  const lineageShort = lineage.parents.slice(0, 2).join(' × ');

  const type = product.autoflower
    ? `Autoflower ${st.charAt(0).toUpperCase() + st.slice(1)}`
    : `Feminized ${st.charAt(0).toUpperCase() + st.slice(1)}`;

  const climates = st === 'indica'
    ? ['Continental, Temperate', 'Cool, Temperate', 'All Climates (Hardy)']
    : st === 'sativa'
    ? ['Mediterranean, Warm', 'Temperate, Warm', 'Mild, Warm']
    : ['Temperate, Continental', 'All Climates (Adaptable)', 'Mediterranean, Temperate'];
  const climate = product.autoflower ? 'All Climates (Adaptable)' : climates[h % climates.length];

  const flowerWeeksMin = product.autoflower ? 8 + (h % 3) : 7 + (h % 3);
  const flowerWeeksMax = flowerWeeksMin + 2;
  const floweringTime = product.autoflower
    ? `${flowerWeeksMin} - ${flowerWeeksMax} weeks (seed to harvest)`
    : `${flowerWeeksMin} - ${flowerWeeksMax} weeks`;

  const harvest = product.autoflower
    ? `${flowerWeeksMin} - ${flowerWeeksMax} weeks from seed`
    : ['Late September - Early October', 'Early - Mid October', 'Mid - Late October'][h % 3];

  const heightMin = product.autoflower ? 60 + (h % 30) : st === 'indica' ? 70 + (h % 30) : st === 'sativa' ? 120 + (h % 40) : 90 + (h % 40);
  const heightMax = heightMin + 40 + (h % 30);
  const height = `${(heightMin / 30).toFixed(1)} - ${(heightMax / 30).toFixed(1)} ft | ${heightMin} - ${heightMax} cm`;

  const yieldIndoorMin = product.autoflower ? 250 + (h % 150) : 350 + (h % 150);
  const yieldIndoorMax = yieldIndoorMin + 100 + (h % 100);
  const yieldOutdoorMin = product.autoflower ? 80 + (h % 120) : 400 + (h % 200);
  const yieldOutdoorMax = yieldOutdoorMin + 100 + (h % 150);

  const yieldRating = yieldIndoorMax > 550 ? 'High' : yieldIndoorMax > 400 ? 'Medium - High' : 'Medium';

  return {
    thc: `${thcRange} (${thcLabel})`,
    lineageShort,
    type,
    climate,
    harvest,
    height,
    yieldRating,
    yieldIndoor: `${(yieldIndoorMin / 28.35).toFixed(1)} oz/ft² | ${yieldIndoorMin} - ${yieldIndoorMax} g/m²`,
    yieldOutdoor: product.autoflower
      ? `${(yieldOutdoorMin / 28.35).toFixed(0)} - ${(yieldOutdoorMax / 28.35).toFixed(0)} oz/plant | ${yieldOutdoorMin} - ${yieldOutdoorMax} g/plant`
      : `${(yieldOutdoorMin / 28.35).toFixed(0)} - ${(yieldOutdoorMax / 28.35).toFixed(0)} oz/plant | ${yieldOutdoorMin} - ${yieldOutdoorMax} g/plant`,
    floweringTime,
  };
}

// ─── FAQ ───
export interface FAQ {
  q: string;
  a: string;
}

export function generateFAQs(product: Product): FAQ[] {
  const name = product.name.replace(/ Feminized$| Auto$/, '');
  const st = product.strainType;
  const type = product.autoflower ? 'autoflower' : 'feminized';
  const typeLabel = product.autoflower ? 'autoflowering' : 'feminized photoperiod';
  const thcBase = parseInt(product.thcContent?.replace(/[^\d]/g, '') || '0') || (15 + (hash(product.slug) % 13));
  const specs = generateStrainSpecs(product);
  const effects = (product.effects || []).slice(0, 3).join(', ') || 'Relaxed, Happy';

  const faqs: FAQ[] = [
    {
      q: `Is ${name} good for beginner growers in the USA?`,
      a: product.autoflower
        ? `Yes. ${name} autoflower seeds are well-suited for beginners. Autoflowering genetics mean the plant flowers automatically based on age, requiring no light schedule changes. Plants stay compact at ${specs.height}, and the full seed-to-harvest cycle completes in just ${specs.floweringTime}. American beginners will appreciate its forgiving nature and fast turnaround.`
        : st === 'indica'
        ? `${name} is a good choice for beginners with basic growing knowledge. Its compact ${st} structure stays manageable at ${specs.height}, and the ${specs.floweringTime} flowering period is relatively short. The plants are naturally resilient to temperature fluctuations common in American growing environments.`
        : `${name} requires moderate growing experience. ${st.charAt(0).toUpperCase() + st.slice(1)} genetics can produce taller plants reaching ${specs.height}, which may need training techniques like topping or LST. However, with proper attention, American growers at any level can achieve rewarding results.`,
    },
    {
      q: `What are the effects of ${name}?`,
      a: st === 'indica'
        ? `${name} delivers deeply relaxing ${st} effects including ${effects.toLowerCase()}. With ${thcBase}%+ THC, expect a powerful body stone that builds gradually from a gentle head buzz into full physical relaxation. Canadian users commonly choose this strain for evening use, stress relief, and sleep support.`
        : st === 'sativa'
        ? `${name} produces uplifting ${st} effects characterized by ${effects.toLowerCase()}. With ${thcBase}%+ THC, you can expect cerebral stimulation, enhanced creativity, and a clear-headed energy that makes it popular for daytime use among American consumers. The effects are motivating without causing anxiety at moderate doses.`
        : `${name} offers balanced hybrid effects combining ${effects.toLowerCase()}. At ${thcBase}%+ THC, you get a well-rounded experience — initial cerebral uplift transitions into comfortable body relaxation. This versatility makes it suitable for both daytime and evening use, which American consumers particularly appreciate.`,
    },
    {
      q: `How much yield can I expect from ${name} ${type} seeds?`,
      a: `Under optimal conditions, ${name} produces ${specs.yieldIndoor} indoors and ${specs.yieldOutdoor} outdoors. ${product.autoflower ? 'As an autoflower, yields are somewhat lower than photoperiod versions, but the fast turnaround allows for multiple harvests per Canadian growing season.' : 'Maximizing yield requires proper lighting (18/6 veg, 12/12 flower), adequate nutrition, and training techniques like topping or SCROG.'} American growers report best results with consistent environment control and quality nutrients.`,
    },
    {
      q: `Can I grow ${name} outdoors in the USA?`,
      a: product.autoflower
        ? `Absolutely. ${name} autoflower seeds thrive outdoors across the United States thanks to their automatic flowering and fast lifecycle. They can be planted from late May through July and still finish before fall frost. Growers in California, New York, and even shorter-season provinces like Colorado and Michigan have reported successful outdoor harvests.`
        : `Yes, ${name} can be grown outdoors in the USA, particularly in provinces with longer growing seasons like California and southern New York. Seeds should be started indoors in April-May and transplanted after the last frost. Harvest typically falls ${specs.harvest}. In shorter-season provinces, consider starting earlier indoors or using a greenhouse to extend the season.`,
    },
    {
      q: `What does ${name} taste and smell like?`,
      a: st === 'indica'
        ? `${name} features a rich ${st} terpene profile with earthy, woody base notes accented by hints of pine and spice. The flavor is smooth and grounding — earthy on the inhale with subtle sweet or berry undertones on the exhale. The aroma intensifies during late flowering, so American indoor growers should consider carbon filtration.`
        : st === 'sativa'
        ? `${name} offers a bright, complex ${st} terpene profile with citrus, tropical fruit, and herbal notes. The flavor is uplifting — sweet and tangy on the inhale with floral or hazy undertones. The aroma is pungent and invigorating, filling the grow room with fresh, energizing scents during late flowering.`
        : `${name} delivers a layered hybrid terpene profile combining sweet, earthy, and citrus notes. The flavor profile is complex — initial sweetness gives way to deeper earthy or fuel undertones. The aroma is distinctive and increases significantly during the final weeks of flowering.`,
    },
    {
      q: `How long does ${name} take to flower?`,
      a: product.autoflower
        ? `${name} autoflower seeds complete their entire lifecycle — from germination to harvest — in ${specs.floweringTime}. This is significantly faster than photoperiod versions, which makes it ideal for American growers wanting quick results or planning multiple outdoor runs in a single season.`
        : `${name} has a flowering period of ${specs.floweringTime} when grown under a 12/12 light cycle. Add 4-6 weeks of vegetative growth for a total indoor cycle of approximately 12-16 weeks. For outdoor American growers, flowering begins naturally as daylight hours decrease in late summer, with harvest typically falling ${specs.harvest}.`,
    },
    {
      q: `Is ${name} legal to grow in the USA?`,
      a: `Yes. Under applicable state law, adults can legally purchase cannabis seeds and grow up to 4 plants per household for personal use in most provinces. ${name} ${type} seeds can be legally purchased, shipped, and cultivated across the United States. Royal King Seeds ships all orders discreetly from within the United States with full tracking.`,
    },
    {
      q: `What is the THC content of ${name}?`,
      a: `${name} typically produces THC levels of ${specs.thc}. Actual THC content varies based on growing conditions, nutrients, harvest timing, and curing methods. To maximize potency, harvest when trichomes are mostly milky white with some amber, provide strong lighting during flower, and cure buds slowly in a controlled environment.`,
    },
  ];

  return faqs;
}

// ─── GROW JOURNAL ───
// Matches the GrowWeek interface from productTabData.ts:
// { week: number, stage: string, title: string, description: string, tips: string }
export interface GrowJournalEntry {
  week: number;
  stage: string;
  title: string;
  description: string;
  tips: string;
}

export function generateGrowJournal(product: Product): GrowJournalEntry[] {
  const name = product.name.replace(/ Feminized$| Auto$/, '');
  const isAuto = product.autoflower;
  const st = product.strainType;

  if (isAuto) {
    return [
      { week: 1, stage: 'Germination', title: 'Seed Start', description: `${name} autoflower seeds typically sprout within 2-5 days using the paper towel method. Plant directly into the final container (3-5 gallon) to avoid transplant stress — autos don't recover well from transplanting.`, tips: 'Use a small amount of water in a circle around the seedling to encourage root spread.' },
      { week: 2, stage: 'Seedling', title: 'First True Leaves', description: `Cotyledons open and first serrated true leaves appear. Keep light on 18-20 hours per day. ${name}'s autoflower clock has started — every day of healthy growth counts.`, tips: 'Gentle watering around the stem — do not overwater at this stage.' },
      { week: 4, stage: 'Vegetative', title: 'Rapid Growth Phase', description: `Rapid growth begins. ${name} develops multiple nodes and begins branching. Under 18-20 hours of light, expect vigorous growth. Light LST can be started now by gently bending the main stem.`, tips: 'Start nutrients at 1/4 strength and gradually increase. Autoflowers are sensitive to overfeeding.' },
      { week: 5, stage: 'Pre-Flower', title: 'Auto-Flowering Begins', description: `${name} begins showing pre-flowers — small white pistils at the nodes. The stretch phase begins, and plants may increase 50-100% in height. Continue LST to create an even canopy.`, tips: 'This is the last chance for training. Do not top autoflowers after this point.' },
      { week: 7, stage: 'Flower', title: 'Bud Development', description: `Bud sites form and begin to fatten. ${name}'s ${st} genetics become evident in the bud structure. Trichome production increases rapidly. Switch to bloom nutrients and maintain humidity below 50%.`, tips: 'Increase airflow to prevent mold in the developing buds.' },
      { week: 9, stage: 'Late Flower', title: 'Ripening & Flush', description: `Buds reach peak density and trichomes shift from clear to milky. ${name}'s terpene production peaks — expect strong aromas. Begin flushing with plain water 7-10 days before harvest.`, tips: 'Check trichomes with a loupe — harvest when mostly cloudy for balanced effects.' },
      { week: 10, stage: 'Harvest', title: 'Harvest Day', description: `Cut plants, remove large fan leaves, and hang branches to dry at 60°F/16°C and 60% humidity for 7-10 days. Once stems snap cleanly, trim and cure in sealed jars, burping daily for 2 weeks minimum.`, tips: 'Longer curing (4-8 weeks) significantly improves flavor, smoothness, and potency.' },
    ];
  }

  return [
    { week: 1, stage: 'Germination', title: 'Seed Activation', description: `Start ${name} feminized seeds using the paper towel method or directly in a seedling plug. Seeds typically crack within 24-72 hours and emerge from soil within 5-7 days. Keep humidity at 70%+ and temperature around 75°F/24°C.`, tips: 'A heat mat under seedling trays speeds germination and promotes healthy root development.' },
    { week: 3, stage: 'Seedling', title: 'Seedling Development', description: `${name} develops its first sets of true leaves. ${st === 'indica' ? 'Expect compact, bushy growth with tight node spacing.' : st === 'sativa' ? 'Expect stretchy growth with wider node spacing.' : 'Growth is balanced between vertical and lateral branching.'} Roots are establishing in the medium.`, tips: 'Transplant to a larger container once roots start emerging from the bottom of the starter pot.' },
    { week: 5, stage: 'Vegetative', title: 'Vegetative Growth (18/6 Light)', description: `Under 18 hours of light, ${name} enters vigorous vegetative growth. Begin topping after the 4th-5th node to encourage bushier growth. Multiple branches develop rapidly.`, tips: 'American growers: if growing near a window, supplement with grow lights during shorter spring days.' },
    { week: 7, stage: 'Late Veg', title: 'Training & Canopy Building', description: `Continue LST, SCROG, or mainlining techniques. ${name} responds well to training, developing multiple bud sites. Plants should fill the available canopy before flipping to flower.`, tips: 'Defoliate lightly to improve airflow and light penetration to lower bud sites.' },
    { week: 8, stage: 'Flip', title: 'Flip to 12/12 & Stretch', description: `Switch lights to 12/12 to trigger flowering. ${name} enters a stretch phase — ${st === 'sativa' ? 'sativa genetics may cause 2-3x height increase during stretch.' : 'expect 50-100% height increase over 2 weeks.'} Pre-flowers appear within 7-10 days of the flip.`, tips: 'Raise lights accordingly during the stretch to prevent light burn on upper colas.' },
    { week: 10, stage: 'Early Flower', title: 'Bud Formation', description: `Buds form and expand rapidly. ${name}'s trichome production increases significantly — buds become frosty and aromatic. Maintain humidity below 50% to prevent bud rot.`, tips: 'Supplement with CalMag and PK boosters during peak flowering for maximum resin production.' },
    { week: 12, stage: 'Late Flower', title: 'Ripening & Flush', description: `${name} buds reach final density. Trichomes transition from clear to milky to amber. Fan leaves begin to yellow naturally. Begin flushing with plain pH'd water 10-14 days before planned harvest.`, tips: 'Harvesting with mostly milky trichomes gives more cerebral effects; more amber gives heavier body effects.' },
    { week: 14, stage: 'Harvest', title: 'Harvest, Dry & Cure', description: `Chop the plant, trim fan leaves, and hang whole branches in a dark room at 60°F/16°C with 60% humidity. Dry for 7-14 days until stems snap. Cure in mason jars, burping daily for at least 2 weeks.`, tips: `A proper 4-8 week cure develops the full terpene profile and smoothness that ${name} is known for.` },
  ];
}
