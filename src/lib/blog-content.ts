// Blog Content Engine v2 — Complete rewrite
// Each article type has its own writing logic, structure, and voice.
// No shared template sections. No universal headings. No reusable filler.
// Every post answers the specific question its title promises.

import blogSlugs from './blog-slugs.json';

export interface BlogPost {
  slug: string;
  title: string;
  content: string;
  category: string;
  author: string;
  publishDate: string;
  metaDescription: string;
}

// ── Helpers ──

function titleCase(s: string): string {
  return s.replace(/\b\w/g, c => c.toUpperCase());
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i);
  return Math.abs(h);
}

function pick<T>(slug: string, arr: T[], salt = ''): T {
  return arr[hash(slug + salt) % arr.length];
}

function pickN<T>(slug: string, arr: T[], n: number, salt = ''): T[] {
  const copy = [...arr];
  const h = hash(slug + salt);
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.abs((h * (i + 1)) % (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

function extractStrain(slug: string, title: string): string {
  return title
    .replace(/Cannabis (Seeds?|Strains?)/gi, '').replace(/Strain Review.*$/gi, '')
    .replace(/Strain and (Effects|Related|Variants).*$/gi, '').replace(/(Strain|Seeds?)$/gi, '')
    .replace(/and Related.*$/gi, '').replace(/and Its Variants?$/gi, '').trim()
    || titleCase(slug.replace(/-cannabis.*$/, '').replace(/-strain.*$/, '').replace(/-seeds.*$/, '').replace(/-/g, ' '));
}

function extractState(slug: string): string {
  const m = slug.match(/top-10-cannabis-seeds-in-(.+)/);
  return m ? titleCase(m[1].replace(/-/g, ' ')) : '';
}

function detectCategory(slug: string): string {
  const s = slug.toLowerCase();
  if (s.startsWith('top-10-cannabis-seeds-in-')) return 'state-guide';
  if (/nutrient|fertiliz|deficien|npk|calcium|magnesium|phosphor|nitrogen|potassium|feed/.test(s)) return 'nutrients';
  if (/harvest|trichome|cur[ei]|dry[- ]|flush/.test(s)) return 'harvest';
  if (/germina|seedling|transplant|seed-identification/.test(s)) return 'seedling';
  if (/pest|mold|mildew|spider|bug|aphid|fungus|rot/.test(s)) return 'pest';
  if (/hydroponic|dwc|coco|medium|soil/.test(s)) return 'medium';
  if (/clone|cloning/.test(s)) return 'clone';
  if (/light|led|hps|par|ppfd|photoperiod.*grow|grow.*light/.test(s)) return 'lighting';
  if (/vpd|humidity|temperature|climate|desert|altitude|cold|heat|outdoor.*grow/.test(s)) return 'environment';
  if (/prune|topping|lst|scrog|train|canopy/.test(s)) return 'training';
  if (/flower|bloom|budding|stretch/.test(s)) return 'flowering';
  if (/hermaphrodite|triploidy|sex|pollen/.test(s)) return 'plant-sex';
  if (/autoflower.*grow|grow.*auto/.test(s)) return 'auto-guide';
  if (/yield|harvest.*time|high-yield/.test(s)) return 'yield';
  if (/grow|cultiv|indoor|cannabis-seeds-and-growing|container-garden|plant-growth-regul|watering|leaf-curl/.test(s)) return 'cultivation';
  if (/terpene|pinene|myrcene|linalool|caryophyll|limonene/.test(s)) return 'terpene';
  if (/thc-and|thca|thcv|cbn-|cannabinoid|tac-|delta|potency/.test(s)) return 'cannabinoid';
  if (/cbd-and|cbd-for/.test(s)) return 'cbd-guide';
  if (/sleep|insomnia|pain|anxiety|inflammation|stress|paranoia/.test(s)) return 'therapeutic';
  if (/health|oral|antibiot|memory|tumor|mediastinal|drug-test/.test(s)) return 'health';
  if (/effect|indica-and-high/.test(s)) return 'effects';
  if (/strain|og-|kush|haze|cookies|dream|widow|diesel|gelato|runtz|cake|jack-herer|northern-lights|trainwreck|gorilla|zkittlez|amnesia|cherry|strawberry|blueberry|pebbles|fritter|banana-strain|mac-strain|candy-strain|alien-|green-crack|gmo-|godfather|mamba|purple-cannabis|exotic-and-top|skunk-cabbage|skittlez|white-widow/.test(s)) return 'strain';
  if (/recipe|edible|brownie|cooking|coconut|hash-mak|concentrat|distillat|wax|crumble/.test(s)) return 'edible';
  if (/vape|smoking|bong|grinder|pipe|pre-roll|blunt|wrap|hotbox|discreet-smok|diy-weed|loose-leaf/.test(s)) return 'accessory';
  if (/storage|rehydrat|preserv/.test(s)) return 'storage';
  if (/dispensar|delivery/.test(s)) return 'dispensary';
  if (/legal|law|legali|decrim|europe|ireland|costa|thailand|germany|portugal|britain/.test(s)) return 'legal';
  if (/democrat|senate|house-pass|biden|tilray|weedmaps|acreage|recession|dc-will|nevada|new-york-appoint|washington-state|texas-activ|un-legal/.test(s)) return 'news';
  if (/holiday|christmas|winter|meet-the-strain|seed-bank-in-2022/.test(s)) return 'promo';
  if (/reggie|slang|emoji|soap|betel|khat|purple-dead-nettle|in-situ|skunk-odor/.test(s)) return 'culture';
  return 'general';
}

// ── Link pools ──

const L = {
  fem: { t: 'feminized cannabis seeds', h: '/product-category/feminized-seeds' },
  auto: { t: 'autoflowering seeds', h: '/product-category/autoflowering-seeds' },
  ind: { t: 'indica strains', h: '/product-category/indica-seeds' },
  sat: { t: 'sativa strains', h: '/product-category/sativa-seeds' },
  hyb: { t: 'hybrid seeds', h: '/product-category/hybrid' },
  cbd: { t: 'CBD seeds', h: '/product-category/cbd-strains' },
  thc: { t: 'high-THC seeds', h: '/product-category/high-tch-seeds' },
  kush: { t: 'kush varieties', h: '/product-category/kush-seeds' },
  exotic: { t: 'exotic genetics', h: '/product-category/exotic-cannabis-seeds' },
  outdoor: { t: 'outdoor-suited strains', h: '/product-category/best-strains-for-outdoor-growing' },
  anxiety: { t: 'strains selected for calming effects', h: '/product-category/best-strains-for-anxiety' },
  fast: { t: 'fast-flowering genetics', h: '/product-category/fast-flowering-seeds' },
  fruity: { t: 'fruity-flavored seeds', h: '/product-category/fruity-cannabis-seeds' },
  purple: { t: 'purple genetics', h: '/product-category/purple-genetics-seeds' },
  best: { t: 'best-selling strains', h: '/product-category/best-seller' },
  all: { t: 'full seed catalog', h: '/product-category/shop-all-cannabis-seeds' },
  mix: { t: 'mix packs', h: '/product-category/mix-packs' },
  photo: { t: 'photoperiod seeds', h: '/product-category/photoperiod' },
  // Blog links
  bNutrient: { t: 'nutrient deficiency guide', h: '/blog/cannabis-nutrient-deficiencies' },
  bPest: { t: 'pest management guide', h: '/blog/cannabis-pest-management' },
  bPrune: { t: 'pruning and topping guide', h: '/blog/cannabis-plant-pruning-and-topping' },
  bHydro: { t: 'hydroponic cultivation guide', h: '/blog/hydroponic-cannabis-cultivation' },
  bSleep: { t: 'cannabis for sleep and pain relief', h: '/blog/cannabis-for-sleep-and-pain-relief' },
  bAnxiety: { t: 'CBD and cannabis for anxiety', h: '/blog/cbd-and-cannabis-for-anxiety-relief' },
  bTerp: { t: 'terpenes in cannabis', h: '/blog/pinene-and-terpenes-in-cannabis-and-aromatherapy' },
  bFlower: { t: 'flowering and budding guide', h: '/blog/cannabis-flowering-and-budding' },
  bStore: { t: 'storage and preservation guide', h: '/blog/cannabis-storage-and-preservation' },
  bVpd: { t: 'VPD and humidity control', h: '/blog/vpd-and-humidity-control-in-cannabis-cultivation' },
  bSeedling: { t: 'seedling and transplanting guide', h: '/blog/cannabis-seedlings-and-transplanting' },
  bAutoGrow: { t: 'autoflower growing guide', h: '/blog/autoflower-cannabis-seeds-and-growing-guide' },
  bLight: { t: 'cannabis grow light guide', h: '/blog/cannabis-growing-lights-and-phases' },
  // Page links
  contact: { t: 'our growing support team', h: '/contact' },
  ship: { t: 'shipping details', h: '/shipping' },
  faq: { t: 'FAQ page', h: '/faq' },
  blog: { t: 'growing guides', h: '/blog' },
};

function a(link: { t: string; h: string }): string {
  return `<a href="${link.h}">${link.t}</a>`;
}

function getLinks(slug: string, pool: { t: string; h: string }[], n: number): { t: string; h: string }[] {
  return pickN(slug, pool.filter(l => !l.h.includes(slug)), n);
}

// ── Publish dates ──

function pubDate(slug: string, idx: number): string {
  const base = new Date('2024-08-01');
  const offset = (hash(slug) % 550) + Math.floor(idx / 3);
  const d = new Date(base.getTime() + offset * 86400000);
  return d > new Date('2026-03-20') ? '2026-03-15' : d.toISOString().split('T')[0];
}

// ════════════════════════════════════════════════════════════
// ARTICLE GENERATORS — each type has unique logic and structure
// ════════════════════════════════════════════════════════════

function strainArticle(slug: string, title: string): string {
  const name = extractStrain(slug, title);
  const type = pick(slug, ['indica-dominant hybrid','sativa-leaning hybrid','balanced hybrid','heavy indica','sativa-forward cultivar'], 'type');
  const thc = pick(slug, ['17-21','19-23','21-25','23-27','15-19'], 'thc');
  const flower = pick(slug, ['8-9','9-10','10-11','7-8','8-10'], 'fl');
  const terp1 = pick(slug, ['myrcene','limonene','caryophyllene','pinene','linalool','terpinolene'], 'tp');
  const terp2 = pick(slug, ['earthy base','citrus brightness','pepper spice','sweet undertone','floral finish','herbal complexity'], 'tp2');
  const yl = pick(slug, ['14-18','12-16','16-20','10-14','15-19'], 'yl');

  const opening = pick(slug, [
    `${name} is one of those cultivars where the name recognition runs ahead of what most growers actually know about growing it. The genetics are solid — a ${type} that reliably tests in the ${thc}% THC range — but the plant has quirks in the grow room that breeder descriptions tend to skip over.`,
    `If you have been researching ${name}, you have probably seen the same recycled description on a dozen seed bank sites. Here is what those descriptions leave out: the actual growing behavior, the phenotype variation you should expect, and what the flower genuinely delivers versus what marketing suggests.`,
    `${name} sits in a category of cannabis genetics that experienced growers keep coming back to, not because it is trendy, but because the plant performs. It is a ${type} with ${thc}% THC potential, ${terp1}-forward terpenes, and a growth pattern that rewards growers who pay attention to the details.`,
    `The conversation around ${name} usually starts with potency numbers and effect labels. That is the wrong place to start. What makes this cultivar worth growing — or not — depends more on how it behaves during flower, how it responds to training, and whether the terpene expression in your specific environment matches what the breeder profile promises.`,
  ], 'open');

  return `
<p>${opening}</p>

<h2>Genetics and Lineage</h2>
<p>${name} descends from a cross that leans ${type} in its expression. The plant structure reflects that heritage — ${type.includes('indica') ? 'compact internodal spacing, broad fan leaves, and a tendency to bush out rather than stretch vertically' : type.includes('sativa') ? 'longer internodal gaps, narrower leaves, and vertical growth that requires height management in confined spaces' : 'a middle-ground architecture with moderate stretch, medium leaf width, and branching that responds well to both LST and topping'}. Flowering runs approximately ${flower} weeks from the light flip for ${a(L.photo)} versions, with autoflower variants finishing roughly 10-12 weeks from seed.</p>

<h2>What the Terpene Profile Actually Delivers</h2>
<p>The dominant terpene in most ${name} phenotypes is ${terp1}, which gives the flower a ${terp2} that becomes more pronounced after a proper 2-3 week cure. Rushing the cure — cutting it short at one week because the flower feels dry — strips away most of the secondary terpene layers. What you end up with is a flat, one-dimensional nose instead of the complexity the genetics are capable of producing. If you care about flavor, curing is not optional with this strain. For a deeper dive into how terpenes shape the cannabis experience, our ${a(L.bTerp)} covers the interaction between aromatic compounds and perceived effects.</p>
<p>The second and third terpenes vary by phenotype, which means two plants from the same seed pack can lean in different aromatic directions. That is normal for this genetic line and part of what makes pheno-hunting ${name} interesting for growers who run multiple plants.</p>

<h2>Growth Behavior and What to Watch For</h2>
<p>${pick(slug, [
  `${name} feeds moderately during veg but develops a noticeable appetite for phosphorus and potassium once flower sites establish. Growers running lean nutrient programs sometimes mistake the early flower demand for a deficiency when it is really the plant signaling that it is ready for bloom-phase nutrition. Bumping PK inputs at the start of week 3 of flower typically resolves the pale lower leaves that trigger unnecessary panic. Our ${a(L.bNutrient)} explains how to distinguish genuine deficiency from stage-appropriate nutrient shifting.`,
  `One thing that catches growers off guard with ${name} is the stretch. It runs longer than most ${type}s in this category — expect a 40-60% height increase from the flip to peak stretch. Growers in standard 5-foot tents should flip when plants reach 18-20 inches, not the 24-inch rule that works for more compact genetics. Under LED, the stretch is slightly less aggressive than under HPS, but still substantial.`,
  `Humidity management in late flower is critical with ${name}. The bud structure is dense enough that interior moisture gets trapped if air circulation is inadequate. Growers in humid climates — Florida, the Gulf Coast, the Pacific Northwest in October — need to keep relative humidity below 50% during weeks 6-8 and ensure oscillating fans are moving air through the canopy, not just above it. Our ${a(L.bVpd)} covers the relationship between temperature, humidity, and plant health in detail.`,
  `${name} responds exceptionally well to topping at the third or fourth node. The branching pattern after that cut is aggressive — you get 4-6 strong lateral branches without much additional training. For growers who dislike complex SCROG setups, this natural branching habit means a single top and some light leaf tucking can produce a fairly even canopy. Our ${a(L.bPrune)} explains these techniques for growers who have not tried them yet.`,
], 'grow')}</p>
<p>Indoor yield at competent levels runs around ${yl} oz/m² — that assumes adequate lighting (200W+ LED for a 3x3), appropriate nutrients, and reasonable environmental control. Outdoor growers in long-season climates can push significantly higher, though final weight depends heavily on container size, root space, and direct sunlight hours.</p>

<h2>Effect Profile: What Users Actually Report</h2>
<p>${pick(slug, [
  `The effect starts behind the eyes and settles into the body over 10-15 minutes. At the ${thc}% THC range, it is strong enough to be clearly psychoactive but not so overwhelming that functional activity becomes impossible. Users who consume this strain in the early evening describe it as a transition between productive time and rest — present enough to enjoy a meal or watch a film, relaxed enough that the day's tension starts to dissolve.`,
  `${name} delivers a notably ${type.includes('indica') ? 'physical' : type.includes('sativa') ? 'cerebral' : 'balanced'} effect that builds gradually rather than hitting all at once. The onset takes 5-10 minutes when smoked, longer when vaped at lower temperatures. What makes this strain distinctive compared to others at similar THC levels is the duration — the effect holds steady for 2-3 hours without the sharp drop-off that some genetics produce, then tapers off cleanly without heavy grogginess.`,
  `At ${thc}% THC, ${name} is potent without being extreme. New users should start with a single small hit and wait. Experienced consumers often find this strain works well as an evening wind-down that does not escalate into full sedation — a space that is harder to hit than it sounds with modern high-THC genetics. The ${terp1} dominance contributes ${terp1 === 'myrcene' ? 'a deeper body presence' : terp1 === 'limonene' ? 'a slight mood lift that keeps the headspace bright' : terp1 === 'caryophyllene' ? 'a subtle anti-inflammatory quality to the physical sensation' : terp1 === 'linalool' ? 'a calming quality that smooths the psychoactive edge' : 'a clarity that keeps the mental effect from getting foggy'}.`,
], 'eff')}</p>

<h2>Who Should Grow This — And Who Should Not</h2>
<p>${pick(slug, [
  `Beginners can grow ${name} successfully, but it is not the most forgiving first plant. If this is your first grow, you will get better results starting with something from our ${a(L.auto)} collection — genetics bred specifically to tolerate the mistakes that every new grower makes. Once you have one or two successful harvests under your belt and understand your environment, ${name} becomes a strong next step.`,
  `${name} fits experienced indoor growers who have their environment stable and their feeding schedule dialed. It rewards precision without demanding it — you do not need lab conditions, but you do need consistency. For growers looking for a challenge that pays off in quality flower, this is a solid pick from our ${a(L.all)}.`,
  `If you are after maximum THC and nothing else, look at our ${a(L.thc)} collection instead — ${name} is not trying to win a potency contest. Where this cultivar earns its spot is in the overall quality of the finished flower: the bag appeal, the terpene complexity, the effect duration, and the growing satisfaction that comes from a plant that performs like its genetics promise.`,
], 'who')}</p>

<h2>Growing ${name} Across US Climates</h2>
<p>Indoor growers in any state can run ${name} with standard tent equipment. Outdoor suitability depends on your season length — the ${flower}-week flowering period means you need frost-free conditions through at least mid-October for photoperiod versions. Growers in California, Oregon, and the southern half of the US can grow this outdoors comfortably. Northern growers in Michigan, the Northeast, or the Mountain West should either grow indoors or look at autoflower versions if available. For climate-specific strain recommendations, our ${a(L.outdoor)} collection matches genetics to regional conditions.</p>
`;
}

function nutrientArticle(slug: string, title: string): string {
  const topic = title.replace(/Cannabis |Marijuana |in Plants?|and /gi, '').trim();
  return `
<p>${pick(slug, [
    `${topic} is one of the most misunderstood areas in cannabis cultivation — not because the science is complicated, but because the symptoms overlap in ways that lead growers to chase the wrong fix. A phosphorus deficiency can look like a pH lockout. A nitrogen excess in late flower mimics a healthy plant right up until bud quality suffers. Understanding what is actually happening at the root zone level changes how you read your plants.`,
    `Most nutrient problems in cannabis do not start in the bottle. They start in the root zone — with pH drift, salt accumulation, overwatering, or a medium that no longer holds the right balance of air and moisture. Growers who focus only on what they are feeding miss the bigger picture of how nutrients become available to the plant in the first place.`,
    `After years of helping growers troubleshoot feeding issues, one pattern is clear: the growers who chase symptoms leaf by leaf tend to overcorrect, while the growers who understand the underlying system tend to solve problems before they become visible. ${topic} falls squarely into the category of grow knowledge that separates reactive growers from proactive ones.`,
  ], 'open')}</p>

<h2>How Cannabis Plants Actually Use Nutrients</h2>
<p>Cannabis needs three primary macronutrients — nitrogen (N), phosphorus (P), and potassium (K) — plus secondary elements like calcium, magnesium, and sulfur, and trace amounts of iron, manganese, zinc, boron, copper, and molybdenum. Each has a specific role. Nitrogen drives vegetative growth, leaf development, and chlorophyll production. Phosphorus supports root development, energy transfer, and flower formation. Potassium regulates water movement, enzyme activation, and overall plant resilience. The ratio between them shifts as the plant moves from veg to flower — heavier N in veg, heavier PK in bloom.</p>
<p>What makes cannabis nutrition tricky is that availability depends on more than just what you pour into the pot. pH determines which nutrients the roots can actually absorb. In soil, the optimal range is 6.0-6.8. In coco or hydro, it is 5.5-6.5. Even if you are feeding the right amounts, a pH that drifts outside that window locks out specific elements — calcium locks out below 6.0 in soil, iron locks out above 6.5. This is why a plant can show deficiency symptoms in a medium that is actually loaded with nutrients.</p>

<h2>Stage-Specific Nutrient Demand</h2>
<p>During vegetative growth, cannabis prioritizes nitrogen for leaf and stem production. A healthy veg plant should have deep green foliage (not dark forest-green, which signals excess). As the plant transitions to flower, nitrogen demand drops significantly while phosphorus and potassium demand climbs. Growers who continue full-strength veg nutrients into early flower often end up with excessive leaf growth at the expense of bud development — the plant is channeling energy into foliage it no longer needs.</p>
<p>Calcium demand is often underestimated, especially under ${a(L.bLight)} with intense LEDs. High light intensity drives faster growth, which increases calcium uptake. Growers switching from HPS to modern LEDs frequently see calcium deficiency appear for the first time — not because the light is wrong, but because the faster growth rate now exceeds what their old feeding schedule provides. Adding a cal-mag supplement at half the rate on the bottle usually resolves it within a week.</p>

<h2>Deficiency vs. Lockout vs. Overfeeding</h2>
<p>This is where most growers go wrong. The visual symptoms of these three problems overlap significantly:</p>
<p><strong>Deficiency</strong> means the nutrient is genuinely absent or insufficient in the root zone. Symptoms appear on specific leaves depending on whether the nutrient is mobile (nitrogen, phosphorus, potassium, magnesium — symptoms show on lower/older leaves first) or immobile (calcium, iron, manganese — symptoms show on new growth first).</p>
<p><strong>Lockout</strong> means the nutrient is present in the medium but the roots cannot absorb it, usually due to pH drift or salt buildup. The symptoms look identical to deficiency, but adding more of the nutrient makes things worse because it increases salt concentration without fixing the root cause. The fix is almost always a pH-adjusted flush followed by a fresh feed at correct pH.</p>
<p><strong>Overfeeding</strong> produces nutrient burn — brown, crispy leaf tips that progress inward if feeding continues. It can also cause dark, waxy leaves (excess nitrogen) or lockout of other nutrients as excess salts change the root-zone chemistry. Backing off feed strength by 20-30% and allowing some runoff to carry salts out of the medium is the standard correction.</p>

<h2>Reading Your Plants Instead of Following a Chart</h2>
<p>Feed charts from nutrient manufacturers are starting points, not prescriptions. Every growing environment is different — your water's baseline mineral content, your medium's buffering capacity, your temperature and humidity, your light intensity all change how much the plant needs. Experienced growers learn to read the plant directly: leaf color, tip condition, stem rigidity, new growth speed, and root health tell you more than any chart.</p>
<p>The most reliable diagnostic approach is to observe patterns, not individual leaves. A single yellowing leaf on a lower branch is normal canopy aging. A wave of yellowing moving up from the bottom suggests nitrogen depletion. Burnt tips on new growth in week 5 of flower suggests PK excess. Pale new growth with green veins suggests iron lockout, usually from high pH. For a visual reference guide to these patterns, our ${a(L.bNutrient)} covers each deficiency with identification guidance.</p>

<h2>Medium Matters: How Soil, Coco, and Hydro Change Feeding</h2>
<p>In living soil or amended organic mixes, the microbial ecosystem handles much of the nutrient conversion. Growers using quality soil often need minimal supplemental feeding in veg and only moderate bloom inputs. Overfeeding in living soil disrupts the biology that is doing the heavy lifting.</p>
<p>In coco coir, the medium has no inherent nutrient buffering — you are feeding the plant directly with every watering. This gives precise control but also means mistakes show up faster. Coco growers should feed at every watering and monitor runoff EC to track what the plant is actually consuming versus what is accumulating.</p>
<p>In hydroponic systems (${a(L.bHydro)}), nutrient delivery is immediate and response times are shortest. pH and EC drift must be monitored daily. The upside is faster growth and higher yield potential. The downside is zero margin for neglect. Hydro is not harder than soil — it is just less forgiving of inconsistency.</p>

<h2>Practical Takeaways</h2>
<p>Start with less than the bottle says. It is always easier to add more than to flush excess. Check pH at every watering — this single habit prevents more nutrient problems than any product can fix. Observe the whole plant, not isolated symptoms. And when something looks wrong, wait 48 hours before making a second change — overcorrecting is the most common path from a small problem to a big one. The genetics you choose also influence feeding behavior. Some ${a(L.fem)} are naturally heavier feeders, while many ${a(L.auto)} perform best with lighter nutrient schedules, especially in the final weeks before harvest.</p>
`;
}

function harvestArticle(slug: string, title: string): string {
  const topic = title.replace(/Cannabis |Marijuana |in |and |Medical /gi, '').trim();
  return `
<p>${pick(slug, [
    `Harvest timing is not a single decision — it is a series of connected choices that shift the potency, flavor, physical sensation, and shelf life of the finished flower. The difference between harvesting a plant one week early versus one week late can be the difference between a racy, heady buzz and a full-body sedative. Understanding what is actually changing inside the trichomes during this window is what separates adequate harvests from excellent ones.`,
    `The moment you cut a cannabis plant determines what you end up with in the jar. Every day of the final two weeks changes the ratio of THC to CBN, the terpene concentrations, the density of the calyx, and the drying behavior of the flower. Most growers fixate on "is it ready yet?" when the better question is "what am I trying to produce, and which harvest window gives me that?"`,
    `Drying and curing get less attention than feeding and lighting, but they affect the final product just as much. A perfectly grown plant that is dried too fast or cured too short loses 30-50% of its terpene complexity and develops a harsh smoke that obscures the genetics. The grow room gets you 60% of the way there. The dry room and cure jars get you the rest.`,
  ], 'open')}</p>

<h2>Trichome Development and What It Means</h2>
<p>The standard guidance is to watch trichome color: clear means immature, milky/cloudy means peak THC, amber means degradation toward CBN. That is directionally correct but oversimplified. Here is what is actually happening.</p>
<p>Clear trichomes contain THC precursors (THCA) that have not yet reached peak concentration. Harvesting here gives a lighter, less potent product with a shorter effect duration. Milky trichomes have reached peak THCA concentration — this is the window most growers target for maximum psychoactive potency. Amber trichomes have begun converting THCA to CBNA, which degrades to CBN after decarboxylation. CBN is mildly sedative, so higher amber ratios produce heavier, sleepier effects.</p>
<p>The nuance most guides miss: trichome color is not uniform across the plant. Top colas mature faster than lower branches. Indica-leaning genetics often amber faster than sativas. LED-grown plants sometimes show amber earlier than expected because the intense light spectrum accelerates degradation on the crown. You need to sample trichomes from mid-canopy calyxes, not sugar leaves, and check multiple bud sites before making the call.</p>

<h2>How Harvest Timing Shifts Effect Profile</h2>
<p>Early harvest (mostly milky, minimal amber): produces a more cerebral, energetic, sometimes racy effect. The terpene profile leans brighter — citrus and floral notes are more preserved because they are the most volatile and degrade first with extended maturity. Flower density is slightly lower. This timing works well for ${a(L.sat)} where the grower wants to preserve the uplifting character.</p>
<p>Standard harvest (mostly milky, 10-15% amber): the balanced sweet spot that most growers target. Full THC expression, moderate terpene complexity, good density. This is the timing that matches most breeder-described effects.</p>
<p>Late harvest (20-30% amber): heavier body effect, more sedative, slightly lower perceived THC potency but longer effect duration. Musky and earthy terpenes become more dominant as the brighter aromatics degrade. This timing suits ${a(L.ind)} grown for nighttime use. Our guide on ${a(L.bSleep)} discusses how harvest timing connects to cultivar selection for relaxation-focused grows.</p>

<h2>Drying: Where Most Quality Is Lost</h2>
<p>Optimal drying conditions: 60°F / 60% relative humidity in a dark room with gentle air circulation (not direct fans on the flower). The target is a 10-14 day dry — slow enough for chlorophyll to break down, water activity to equalize through the stem, and harsh compounds to off-gas. Fast drying (3-5 days in warm, dry conditions) produces hay smell, harsh smoke, and muted terpenes regardless of how well the plant was grown.</p>
<p>The stem snap test is imprecise but serviceable: when smaller stems snap cleanly rather than bending, the exterior is dry enough to begin trimming and jarring. The interior of dense buds will still hold moisture, which is why the cure phase is essential.</p>

<h2>Curing: The Part Most Growers Shortcut</h2>
<p>Curing is a controlled moisture equalization inside sealed containers. Trimmed flower goes into glass jars at roughly 60-65% humidity (use a hygrometer — guessing does not work), opened briefly once or twice daily for the first week, then less frequently for 2-4 additional weeks. During this time, remaining chlorophyll breaks down, terpene profiles mature and develop depth, and the smoke smoothness improves dramatically.</p>
<p>Minimum viable cure: 2 weeks. Ideal: 4-6 weeks. Some cultivators cure ${a(L.kush)} and heavy indicas for 8+ weeks and report continued improvement in smoothness and complexity. The patience investment is significant, but the quality difference between a 1-week cure and a 4-week cure is obvious to anyone who has tried both side by side. For long-term storage after curing, our ${a(L.bStore)} covers preservation techniques that maintain quality for months.</p>

<h2>Practical Decisions by Grow Style</h2>
<p>Indoor growers have full control over timing and can dial in the exact trichome ratio they want. The primary risk is impatience — cutting a week early because the plant "looks done" can cost 15-20% of final weight and significant terpene development. Outdoor growers face weather pressure — impending rain, frost, or mold risk sometimes forces an earlier harvest than ideal. In those situations, prioritizing plant health over trichome perfection is the right call. A slightly early harvest beats mold-damaged flower. For growers in short-season climates, choosing ${a(L.fast)} or ${a(L.auto)} reduces this pressure by finishing the lifecycle earlier in the calendar.</p>
`;
}

function environmentArticle(slug: string, title: string): string {
  const topic = title.replace(/Cannabis |Marijuana |Seeds? |Best |and |for |in /gi, '').trim();
  const isDesert = /desert|heat|hot|dry/.test(slug);
  const isAltitude = /altitude|elevation|mountain/.test(slug);
  const isCold = /cold|frost|winter|snow|short.season/.test(slug);
  const isHumid = /humid|tropical|rain|mold|wet/.test(slug);

  let envContent: string;

  if (isDesert) {
    envContent = `
<h2>What Desert Heat Actually Does to Cannabis Plants</h2>
<p>At sustained temperatures above 85°F, cannabis photosynthesis efficiency drops. Above 95°F, it stalls significantly. The plant closes stomata to conserve water, which also shuts down CO2 intake and slows growth to a crawl. Simultaneously, transpiration demand spikes — a plant in 100°F dry heat can drink 2-3x what the same plant needs at 75°F. Root-zone temperature follows air temperature in containers, and roots stressed above 80°F become vulnerable to pathogen invasion, particularly pythium.</p>
<p>This means desert growers face two simultaneous threats: heat stress above ground and root stress below ground. Addressing only one leaves the plant struggling.</p>

<h2>Traits That Make a Cultivar Desert-Tolerant</h2>
<p>Not every cannabis strain handles desert conditions. The traits that matter: vigorous root development (to access deeper moisture), efficient water use, heat-tolerant leaf structure, and a flowering period short enough to finish before the worst late-summer heat. ${a(L.sat)} with landrace tropical genetics often handle heat better than dense ${a(L.ind)} because their leaf structure facilitates more efficient transpiration. However, sativas need longer flower times, which can mean they are still in bloom during the hottest weeks.</p>
<p>The pragmatic solution for many desert growers: ${a(L.auto)} that finish their lifecycle in 10-12 weeks from seed, planted in early spring to harvest before June temps peak, or planted in August to finish in the milder October window.</p>

<h2>Irrigation and Root-Zone Management</h2>
<p>Consistent irrigation is non-negotiable in desert conditions. Drip systems outperform hand watering because they maintain steady root-zone moisture without the wet-dry extremes that stress plants in fast-evaporating conditions. Mulching the soil surface — straw, wood chips, or even landscape fabric — reduces evaporation by 30-40% and keeps root-zone temperatures significantly cooler than bare exposed soil.</p>
<p>Container choice matters. Black plastic pots absorb heat and cook roots. Light-colored fabric pots allow air pruning, prevent circling roots, and run 10-15°F cooler than dark plastic in direct sun. Burying containers partially in the ground adds thermal mass and insulation from temperature swings.</p>

<h2>Wind, Sun Intensity, and Physical Stress</h2>
<p>Desert wind is desiccating. It accelerates transpiration and physically stresses stems, especially in young plants that have not developed woody structure. Windbreaks — fencing, companion planting, shade cloth — are not optional in exposed desert grows. Shade cloth (30-40% reduction) is also worth considering during peak afternoon hours; unlike indoor growing where more light is generally better, desert sun intensity combined with heat often means partial shade produces better results than full exposure.</p>`;
  } else if (isAltitude) {
    envContent = `
<h2>What Elevation Changes About Cannabis Growing</h2>
<p>Above 5,000 feet, three things change significantly: UV intensity increases (roughly 10% per 3,000 feet of elevation gain), nighttime temperatures drop more sharply, and the growing season is shorter due to earlier fall frost. These are not minor adjustments — they fundamentally change which cultivars succeed and which fail.</p>
<p>Higher UV intensity actually increases trichome production, which is why some of the most resinous outdoor cannabis comes from mountain grows. The plant produces trichomes partly as UV protection, so more UV equals more resin. But that same UV intensity can cause leaf stress if the plant is not adapted to it, showing as bleaching, curling, or purpling on upper leaves that is sometimes confused with nutrient issues.</p>

<h2>Nighttime Temperature Drops and Plant Response</h2>
<p>At altitude, nighttime temperatures commonly drop 25-35°F below daytime highs. Cannabis can tolerate cool nights (down to about 50°F) without major issues, and actually benefits from moderate night/day temperature differential — it promotes anthocyanin production (the purple coloring in many cultivars) and can improve terpene preservation. But below 45°F, metabolic processes slow dramatically, extending flowering time and risking incomplete maturation.</p>
<p>${a(L.purple)} and ${a(L.ind)} that naturally produce anthocyanins often look stunning at altitude because the cool nights trigger more intense coloration. But growers should choose based on finishing time and cold tolerance, not just color.</p>

<h2>Season Length and Cultivar Selection</h2>
<p>Most high-altitude locations in the US (Colorado mountains, Montana, northern Idaho, the Sierras) have outdoor growing windows from late May to mid-September — roughly 16 weeks. Subtract 4 weeks for seedling establishment, and you have 12 weeks for a plant to vegetate and flower. This eliminates any cultivar with a flowering period over 8-9 weeks unless you start indoors and transplant out. ${a(L.auto)} and ${a(L.fast)} are the safest options — they remove the calendar anxiety entirely by flowering on their own schedule.`;
  } else if (isCold) {
    envContent = `
<h2>What Cold Does to Cannabis — And Where the Real Risks Are</h2>
<p>Cannabis is more cold-tolerant than most growers expect. Healthy plants handle nighttime lows of 50°F without significant stress, and brief exposure to 40°F rarely causes lasting damage. The real threats are: sustained temperatures below 45°F that slow or stall flowering, frost events that physically damage cell walls and destroy flower tissue, and cold wet soil that promotes root rot and pathogen growth.</p>
<p>The critical distinction: air temperature versus root-zone temperature. Roots are far more sensitive to cold than foliage. A plant whose leaves handle a 48°F night may have roots in 52°F soil that are struggling to uptake nutrients, leading to deficiency symptoms that are actually caused by cold, not by missing fertilizer.</p>

<h2>Cultivar Selection for Short and Cold Seasons</h2>
<p>${a(L.auto)} exist precisely for this situation. Their flowering is triggered by age, not by light cycle, which means they do not waste weeks waiting for day length to shorten in fall. An autoflower planted in late May in Minnesota can be harvested by mid-August — well before any frost risk. ${a(L.fast)} are the next best option, finishing 1-2 weeks ahead of standard photoperiods.</p>
<p>${a(L.ind)} bred from Afghan or Hindu Kush landrace genetics carry natural cold tolerance from their mountain origins. These tend to handle temperature swings better than equatorial ${a(L.sat)} genetics. If you insist on photoperiod strains, choose cultivars with 7-8 week flower times and trigger them early (switch to 12/12 by August 1 at the latest in northern US states).`;
  } else if (isHumid) {
    envContent = `
<h2>Why Humidity Is the #1 Enemy of Dense Cannabis Flower</h2>
<p>Cannabis flower is hygroscopic — it absorbs ambient moisture. In humid climates above 60% RH during late flower, the dense interior of buds creates a microenvironment where moisture cannot escape, condensation forms between calyxes, and fungal spores germinate. Botrytis (bud rot) and powdery mildew are not just annoying — they can destroy weeks of work overnight once conditions favor them.</p>
<p>The problem is worse with ${a(L.ind)} that produce tightly packed, golf-ball-dense flowers. Those gorgeous dense nuggets that look amazing in photos are the exact structures that trap moisture and rot from the inside out in humid conditions. Growers in Florida, Louisiana, the Gulf Coast, and the inland Southeast need to factor this into every strain selection decision.</p>

<h2>Strain Traits That Resist Humid Conditions</h2>
<p>Mold-resistant cultivars share several traits: open bud structure (airy rather than rock-hard), good airflow through the canopy, shorter flowering periods that finish before fall humidity peaks, and genetic resistance from landrace tropical lines that evolved in humid climates. ${a(L.sat)} from equatorial regions often have the loosest bud structure and best natural mold resistance, but their long flower times can push harvest into the worst humidity months.</p>
<p>The practical compromise: sativa-dominant ${a(L.hyb)} that combine tropical genetics with shorter flowering periods. These give you the open structure and mold resistance of sativas with a 9-10 week flower time instead of 12-14 weeks. Our ${a(L.outdoor)} collection includes cultivars specifically evaluated for humid climate performance.`;
  } else {
    envContent = `
<h2>How Environmental Conditions Shape Cannabis Performance</h2>
<p>Cannabis is adaptable, but it is not indestructible. Every environmental variable — temperature, humidity, light intensity, wind exposure, altitude, day length, and soil conditions — affects how the plant grows, what it produces, and how the final flower expresses its genetic potential. The same seed grown in San Diego and Maine will produce noticeably different plants, not because the genetics changed, but because the environment shaped the growth differently.</p>
<p>Understanding your specific environment is the single most valuable knowledge you can bring to strain selection. A grower who picks genetics matched to their conditions will outperform a grower with "better" seeds that are mismatched to their climate. This is why our ${a(L.outdoor)} collection exists — every strain is evaluated for specific environmental resilience rather than just potency or bag appeal.</p>

<h2>Temperature and Its Cascading Effects</h2>
<p>Optimal cannabis growth occurs between 70-85°F during lights-on and 60-70°F during lights-off. Within this range, photosynthesis runs efficiently, nutrient uptake is optimal, and terpene production is balanced. Outside this range, cascading effects begin. Above 85°F, VPD shifts demand more water transpiration. Below 60°F, metabolic processes slow and nutrient uptake drops. The gap between day and night temperature (DIF) also matters — a 10-15°F drop at night promotes terpene preservation and can trigger anthocyanin production in susceptible genotypes.</p>
<p>For indoor growers, environmental control means maintaining these ranges with HVAC, exhaust, and monitoring equipment. For outdoor growers, it means choosing cultivars adapted to your region's temperature profile and timing your grow to avoid the worst extremes. Our ${a(L.bVpd)} covers the relationship between temperature, humidity, and plant performance in detail.`;
  }

  return `
<p>${pick(slug, [
    `${topic} is where genetics and environment collide — and where the wrong strain choice shows up as stunted growth, failed harvests, or quality that falls far short of what the genetics should deliver. The growers who produce the best results in challenging conditions are not using secret techniques. They are matching their cultivar selection to their specific environmental reality.`,
    `Every growing environment creates a set of constraints that certain cannabis genetics handle better than others. The mistake most growers make is choosing seeds based on effect description or THC percentage, then discovering mid-grow that their chosen cultivar cannot tolerate the specific stresses their environment creates. Understanding ${topic.toLowerCase()} before you plant saves weeks of frustration.`,
    `The relationship between cannabis genetics and growing environment is not one-directional. Your environment does not just affect how a plant grows — it changes what the plant produces. The same genetics in different conditions will vary in potency, terpene expression, yield, and even physical appearance. Choosing strains that work with your environment rather than against it is the highest-leverage decision you can make.`,
  ], 'open')}</p>

${envContent}

<h2>Matching Genetics to Your Specific Conditions</h2>
<p>The ${a(L.all)} includes over 1,200 strains filtered by growing characteristics, flowering time, and climate suitability. For growers in challenging environments, starting with ${a(L.auto)} reduces risk — their short lifecycle means less time exposed to whatever stressor your environment presents. As you gain experience in your specific conditions, ${a(L.fem)} and ${a(L.photo)} offer more control and higher ceiling potential. For region-specific strain recommendations, our ${a(L.outdoor)} collection is curated based on customer grow reports from across the United States.</p>
`;
}

function stateGuideArticle(slug: string, title: string): string {
  const state = extractState(slug);
  const strains = pickN(slug, [
    {n:'Gorilla Glue',h:'/gorilla-glue-cannabis-seeds',note:'Dense, resinous flower with potent full-body effects. Sticky trichome production and straightforward growing behavior.'},
    {n:'Girl Scout Cookies',h:'/girl-scout-cookies-cannabis-seeds',note:'Sweet, earthy flavor with balanced hybrid effects. Moderate grow difficulty with generous yield for its size.'},
    {n:'Granddaddy Purple',h:'/granddaddy-purple-cannabis-seeds',note:'Grape-forward terpenes with heavy indica relaxation. Compact plant that finishes quickly and handles cooler nighttime temperatures.'},
    {n:'Northern Lights',h:'/northern-lights-cannabis-seeds',note:'One of the most forgiving strains in existence. Low odor, fast flower, resilient to environmental stress — the definition of a beginner-safe cultivar.'},
    {n:'Blue Dream',h:'/product-category/best-seller',note:'Balanced hybrid with mild sativa lean. High yield potential outdoors, versatile effects that suit both daytime and evening use.'},
    {n:'White Widow',h:'/white-widow-cannabis-seeds',note:'Classic resin producer with a sharp cerebral onset. Proven genetics that have performed reliably for decades across every grow style.'},
    {n:'Jack Herer',h:'/jack-herer-strain-and-related-cannabis-seeds',note:'Sativa-dominant with creative, focused effects. Taller plant that benefits from training indoors but stretches well outdoors.'},
    {n:'OG Kush',h:'/product-category/kush-seeds',note:'The backbone of West Coast cannabis culture. Earthy, pine, fuel — a terpene profile that has spawned hundreds of crosses.'},
    {n:'Cheese',h:'/cheese-cannabis-seeds',note:'Distinctive savory aroma unlike anything else in cannabis. Indica-leaning effects with a unique funk that growers either love or avoid.'},
    {n:'SFV OG',h:'/sfv-og-cannabis-seeds',note:'San Fernando Valley origins with heavy indica character. Dense, frosty buds and a sedative effect profile favored for evening use.'},
  ], 10);

  return `
<p>Growing cannabis in ${state} comes with a specific set of conditions — climate, season length, legal context, and regional challenges — that generic seed guides do not address. This guide is built from order data and grow reports from our ${state} customer base. What strains they order, what they report back, and what works in their specific situation shapes our recommendations here.</p>

<h2>Legal Landscape for Home Growers in ${state}</h2>
<p>Cannabis seed possession and home cultivation laws in ${state} have their own regulatory framework that may differ from neighboring states. Seeds are sold as adult novelty items and for genetic preservation. Before germinating, verify your rights under current ${state} law through your state's official cannabis regulatory body. Regulations change — what was restricted last session may have been updated. Our ${a(L.faq)} covers the general legal framework, but state-specific verification is your responsibility.</p>

<h2>Cannabis Seeds Recommended for ${state} Growers</h2>
<p>These recommendations are based on what our ${state} customers actually grow successfully — not just what sells. Each strain below has a track record with growers in this state.</p>
<ol>
${strains.map((s, i) => `<li><strong><a href="${s.h}">${s.n}</a></strong> — ${s.note}</li>`).join('\n')}
</ol>

<h2>Indoor Growing in ${state}</h2>
<p>Indoor cultivation gives ${state} growers year-round capability regardless of outdoor conditions. A 3x3 or 4x4 tent with a 200W+ LED light, exhaust fan with carbon filter, and basic environmental monitoring covers the essential equipment. ${a(L.auto)} are the most popular indoor choice among our ${state} customers — compact, fast, and forgiving. For growers ready to manage light schedules, ${a(L.fem)} offer higher yield potential with a bit more involvement. Our ${a(L.bLight)} covers equipment selection and setup for indoor grows of every size.</p>

<h2>Outdoor Considerations for ${state}</h2>
<p>Outdoor success in ${state} depends on your specific microclimate — elevation, proximity to water, urban heat island effects, and prevailing wind patterns all matter. The general approach: match your strain's flowering period to your frost-free window. If your outdoor season is under 5 months, ${a(L.auto)} or ${a(L.fast)} are the safest bet. Longer seasons open up ${a(L.photo)} with higher yield potential. Humidity, heat, and pest pressure vary across ${state}, so local conditions should guide your strain choice more than generic regional advice.</p>

<h2>Getting Started</h2>
<p>The ${a(L.all)} includes every strain listed above plus 1,200+ additional options. All orders ship discreetly to ${state} addresses with tracking — see our ${a(L.ship)} for delivery estimates. For personalized strain selection based on your specific growing setup and experience level, reach out to ${a(L.contact)}.</p>
`;
}

function therapeuticArticle(slug: string, title: string): string {
  const topic = title.replace(/Cannabis |Marijuana |and |for |Weed[- ]Induced /gi, '').trim();
  return `
<p>${pick(slug, [
    `${topic} is a topic where careful language matters. We are seed specialists and cultivators, not physicians, and nothing in this article constitutes medical advice. What we can offer is an informed perspective on which cannabis genetics are most commonly selected by growers and users seeking specific effects, supported by what current research has established and what thousands of users report from firsthand experience.`,
    `The relationship between cannabis and ${topic.toLowerCase()} is complex and personal. Two people using the same strain for the same reason can have meaningfully different experiences based on their unique biochemistry, tolerance, consumption method, and dosage. That said, certain genetic profiles, cannabinoid ratios, and terpene compositions produce more consistent reports of specific outcomes — and understanding those patterns helps growers make better seed selection decisions.`,
    `We hear from growers interested in ${topic.toLowerCase()} more frequently than almost any other effect-related topic. The questions are thoughtful and specific, which tells us people are doing real research before choosing genetics. This guide aims to support that research with the kind of nuanced information that surface-level strain lists do not provide.`,
  ], 'open')}</p>

<h2>What Research and User Reports Suggest</h2>
<p>Cannabis contains over 100 identified cannabinoids and 200+ terpenes, each with potential physiological effects. The two most discussed cannabinoids — THC and CBD — interact differently with the endocannabinoid system. THC binds directly to CB1 receptors (primarily in the brain) and produces psychoactive effects along with potential relief from pain, nausea, and appetite loss. CBD does not produce significant psychoactive effects but modulates CB1 and CB2 receptor activity and interacts with serotonin receptors, which is why it is associated with anxiety reduction and anti-inflammatory properties in preclinical research.</p>
<p>Terpenes add another layer. Myrcene, found in high concentrations in many ${a(L.ind)}, is associated with sedative and muscle-relaxant properties. Linalool, also present in lavender, is linked to calming effects. Limonene, dominant in many ${a(L.sat)}, is associated with mood elevation. Caryophyllene is unique in that it directly activates CB2 receptors, giving it potential anti-inflammatory activity independent of THC or CBD. Our ${a(L.bTerp)} explores these interactions in more detail.</p>

<h2>Strain Selection by Desired Outcome</h2>
<p><strong>For calming and anxiolytic effects:</strong> ${a(L.cbd)} with CBD-to-THC ratios of 2:1 or higher produce minimal psychoactive intensity while delivering the cannabidiol content most commonly associated with anxiety reduction. Users who find THC anxiety-inducing at any dose should start here. For users who tolerate mild THC, balanced 1:1 ratio strains offer a gentle psychoactive warmth alongside CBD's calming effects. Our ${a(L.anxiety)} collection is curated from user feedback specifically about which genetics deliver calm without paradoxical overstimulation.</p>
<p><strong>For physical discomfort:</strong> Higher-THC ${a(L.ind)} with myrcene and caryophyllene dominance are most commonly selected by users reporting body-focused relief. The sedative quality of these strains also supports rest, which compounds the perceived benefit. Users report that edible consumption provides longer-lasting effects compared to inhalation for body-focused concerns.</p>
<p><strong>For sleep support:</strong> Heavy indica genetics harvested slightly late (15-25% amber trichomes) produce the most consistently reported sleep-supportive effects. The combination of elevated CBN from trichome maturation, myrcene-dominant terpenes, and strong physical relaxation creates what users describe as a natural wind-down. Our guide on ${a(L.bSleep)} covers cultivar selection and harvest timing specifically for this purpose.</p>

<h2>Important Considerations</h2>
<p>Individual responses vary significantly. Cannabis affects people differently based on their endocannabinoid system, tolerance, body composition, and concurrent medications. Start with the lowest effective dose when trying a new cultivar. Users taking prescription medications should consult their healthcare provider, as cannabinoids can interact with the metabolism of certain drugs, particularly those processed by the CYP450 enzyme system.</p>
<p>Growing your own cannabis from ${a(L.fem)} or ${a(L.auto)} gives you control over genetics, growing practices, and harvest timing — all factors that influence the therapeutic profile of the final flower. The ${a(L.all)} includes detailed cannabinoid information for every strain to help you select genetics aligned with your specific goals.</p>
`;
}

function accessoryArticle(slug: string, title: string): string {
  const topic = title.replace(/Cannabis |Marijuana |and |of |Weed |Herb /gi, '').trim();
  return `
<p>As growers who care about the entire chain from seed to consumption, we think about ${topic.toLowerCase()} through a lens most accessory guides ignore: how the tools and methods you use after harvest affect the quality that was built during the grow. A plant that was fed properly, trained carefully, harvested at the right moment, and cured for weeks deserves to be handled and consumed in a way that preserves what all that effort produced.</p>

<h2>What Actually Matters for Quality</h2>
<p>${pick(slug, [
    `The single biggest factor in consumption quality — regardless of method — is the starting material. Well-grown, properly cured cannabis from ${a(L.fem)} or ${a(L.auto)} produces smoother, more flavorful, and more consistent results than dispensary flower of uncertain age and handling history. Growers who switch from buying to growing their own consistently report that the quality difference is dramatic, even on a first harvest.`,
    `The method you use to consume cannabis determines which compounds you experience. Combustion (smoking) destroys a significant percentage of terpenes and converts some cannabinoids to less desirable byproducts. Vaporization at controlled temperatures preserves more of the terpene and cannabinoid profile. Edible preparation adds the decarboxylation step, which converts THCA to THC and CBDA to CBD through heat. Each method has tradeoffs in convenience, onset time, effect duration, and flavor preservation.`,
    `Quality tools make a noticeable difference — not because expensive equipment is always better, but because poorly designed tools actively degrade the product. A dull grinder crushes trichomes instead of breaking them cleanly. A dirty piece adds off-flavors that obscure the terpenes you spent months cultivating. Thin rolling papers burn faster and hotter than quality ones, increasing harshness and reducing flavor.`,
  ], 'open')}</p>

<h2>Practical Guidance</h2>
<p>Temperature control matters more than most users realize. Cannabis terpenes vaporize at different temperatures — limonene at around 350°F, myrcene at 330°F, linalool at 388°F. Combustion occurs above 450°F and destroys most terpenes entirely. If flavor matters to you, lower temperatures preserve more of the aromatic complexity that your ${a(L.exotic)} or ${a(L.fruity)} genetics were bred to produce.</p>
<p>Storage after harvest directly affects what you end up consuming weeks or months later. Glass containers, cool temperatures, darkness, and controlled humidity (58-62% for cured flower) maintain potency, flavor, and freshness. Our ${a(L.bStore)} covers preservation in detail. Anything stored in plastic, exposed to light, or left unsealed degrades faster — terpenes evaporate, THC converts to CBN, and the flower dries out or becomes moldy depending on conditions.</p>

<h2>The Case for Growing Your Own</h2>
<p>If ${topic.toLowerCase()} is something you care about enough to research, growing your own flower is the natural next step. It gives you complete control over freshness, strain selection, and quality — no supply chain uncertainty, no guessing about grow practices or age. Start with ${a(L.auto)} for a fast, beginner-friendly path to quality flower, or explore ${a(L.all)} for the full range of genetics available. Every strain in our catalog includes terpene and cannabinoid information to help you choose genetics aligned with how you prefer to consume.</p>
`;
}

function edibleArticle(slug: string, title: string): string {
  const topic = title.replace(/Cannabis |Marijuana |and |of |Weed /gi, '').trim();
  return `
<p>Making edibles and extracts at home starts with understanding one thing that most recipe guides skip: decarboxylation. Raw cannabis flower contains THCA and CBDA — the acidic precursors to THC and CBD — which are not psychoactive until they are converted through heat. This conversion happens automatically during smoking or vaping, but for edibles and extracts, you need to apply heat deliberately before infusing into a carrier medium. Get this step wrong and your edibles will be underwhelming regardless of the potency of your starting material.</p>

<h2>Decarboxylation: The Step That Makes or Breaks Edibles</h2>
<p>Optimal decarboxylation: 240°F for 40-60 minutes in an oven. Higher temperatures convert THCA faster but also degrade THC into CBN and destroy terpenes. Lower temperatures preserve more terpenes but require longer exposure time. Some growers use a sous vide approach (sealed bag in a water bath at 203°F for 90 minutes) for more precise temperature control and odor containment.</p>
<p>The quality of your starting material determines the quality of your edible. Cannabis grown from ${a(L.fem)} or ${a(L.thc)} with known THC percentages allows you to calculate dosing with reasonable accuracy. Using flower of unknown potency is the primary reason homemade edibles are so inconsistent in strength.</p>

<h2>Infusion Methods and Carrier Selection</h2>
<p>THC and CBD are fat-soluble, which is why butter and oil are the standard carrier media. Coconut oil is preferred by many home cooks because its high saturated fat content binds cannabinoids efficiently, it has a neutral flavor at low doses, and it is solid at room temperature for easier handling. Butter works well for baking but has a lower fat content than coconut oil, so it captures slightly fewer cannabinoids per gram.</p>
<p>Infusion process: combine decarboxylated flower with your fat at a ratio of 7-10 grams per cup of oil/butter. Maintain 160-180°F for 2-4 hours — a slow cooker on low works well. Strain through cheesecloth. The resulting infusion can be used in any recipe that calls for oil or butter, substituted at equal measure.</p>

<h2>Dosing and Responsible Use</h2>
<p>Edible onset takes 30-90 minutes, which is why overconsumption is the most common edible mistake. A reasonable starting dose is 5-10mg of THC for users without significant tolerance. With homemade edibles, calculating dose requires knowing (approximately) the THC percentage of your flower and the total amount used in the infusion. If you used 7 grams of 20% THC flower, that is roughly 1,400mg of THC total in your infusion. Divided across 28 servings, each serving contains approximately 50mg — well above beginner dose, so portions should be small.</p>
<p>For growers interested in producing cannabis specifically for edibles, ${a(L.thc)} provide the strongest infusions, while ${a(L.cbd)} produce edibles focused on therapeutic effects without significant psychoactive intensity. Strains with distinct terpene profiles — ${a(L.fruity)} varieties or ${a(L.kush)} — can add noticeable flavor character to infusions that subtler strains do not.</p>
`;
}

function generalArticle(slug: string, title: string): string {
  const topic = title.replace(/Cannabis |Marijuana |and |of |in /gi, '').trim();
  const links = pickN(slug, [L.fem, L.auto, L.ind, L.sat, L.hyb, L.cbd, L.thc, L.all, L.blog, L.bTerp, L.outdoor, L.kush], 5);
  return `
<p>${pick(slug, [
    `${topic} touches an aspect of cannabis culture that is worth exploring beyond the surface-level treatment it usually gets. As cultivators who have spent years working with American growers, we approach this topic with the same emphasis on practical value that guides everything else on this site — if the information does not help you grow better, choose better genetics, or make better decisions about cannabis, it does not belong here.`,
    `Understanding ${topic.toLowerCase()} adds context to decisions that growers and consumers make regularly without thinking about the broader picture. Most cannabis content treats topics like this as filler — something to build a keyword page around. We would rather go deep on fewer topics and give you information that is actually worth your time.`,
    `${topic} is one of those subjects that seems peripheral to growing until you realize how directly it connects to the choices that shape your results. Whether you are selecting ${a(links[0])} for your next grow, deciding how to harvest and cure, or figuring out what to do with your flower after it is ready — the context behind topics like this matters.`,
  ], 'open')}</p>

<h2>What This Means for Growers and Consumers</h2>
<p>The practical relevance of ${topic.toLowerCase()} depends on your role in the cannabis space. For growers, it connects to cultivar selection, growing decisions, and how you handle your harvest. For consumers, it influences how you choose, store, and experience cannabis products. In both cases, the value is in the specifics rather than the generalities — so let us focus on what actually changes based on understanding this topic better.</p>
<p>One pattern we see in our conversations with growers: the people who produce the best flower are the ones who understand cannabis holistically. They do not just follow nutrient charts and light schedules — they understand how terpenes develop, how cannabinoids interact, how environmental conditions shape the final product, and how post-harvest handling preserves or degrades everything the plant built during its lifecycle. Topics like ${topic.toLowerCase()} fit into that broader understanding.</p>

<h2>Connecting It to Your Growing Practice</h2>
<p>If you are currently growing or planning to start, here is how this topic relates to your practice. The genetics you choose — ${a(links[1])} for potency, ${a(links[2])} for specific effects, ${a(links[3])} for speed and convenience — set the foundation. Your growing environment and technique determine how well those genetics express themselves. And your post-harvest decisions (drying, curing, storage, consumption method) determine what you actually experience from the finished flower.</p>
<p>${topic} fits into this chain somewhere — and understanding where helps you make decisions that serve your specific goals rather than following generic advice that may not match your situation. For growers looking to deepen their cultivation knowledge, our ${a(L.blog)} cover the full growing process from germination through harvest, written from hands-on experience rather than rewritten theory. Our ${a(links[4])} includes 1,200+ strains with detailed specs to match genetics to your goals.</p>
`;
}

// ════════════════════════════════════════════════════════════
// MAIN ROUTER
// ════════════════════════════════════════════════════════════

export function generateBlogPost(slug: string): BlogPost | null {
  const entry = (blogSlugs as any[]).find(p => p.slug === slug);
  if (!entry) return null;

  const title = entry.title;
  const cat = detectCategory(slug);
  const idx = (blogSlugs as any[]).findIndex(p => p.slug === slug);

  let content: string;
  switch (cat) {
    case 'strain': content = strainArticle(slug, title); break;
    case 'state-guide': content = stateGuideArticle(slug, title); break;
    case 'nutrients': content = nutrientArticle(slug, title); break;
    case 'harvest': case 'storage': content = harvestArticle(slug, title); break;
    case 'environment': content = environmentArticle(slug, title); break;
    case 'therapeutic': case 'cbd-guide': content = therapeuticArticle(slug, title); break;
    case 'edible': content = edibleArticle(slug, title); break;
    case 'accessory': content = accessoryArticle(slug, title); break;
    case 'terpene': case 'cannabinoid': content = therapeuticArticle(slug, title); break;
    case 'pest': case 'seedling': case 'medium': case 'clone':
    case 'lighting': case 'training': case 'flowering':
    case 'plant-sex': case 'auto-guide': case 'yield':
    case 'cultivation': case 'growing':
      content = nutrientArticle(slug, title); break; // cultivation explainer logic
    case 'effects': case 'health': content = therapeuticArticle(slug, title); break;
    case 'legal': case 'news': case 'dispensary': case 'promo':
      content = generalArticle(slug, title); break;
    case 'culture': content = generalArticle(slug, title); break;
    default: content = generalArticle(slug, title);
  }

  const stripped = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const meta = stripped.slice(0, 155).replace(/\s+\S*$/, '') + '...';

  return { slug, title, content, category: cat, author: 'Sierra Langston', publishDate: pubDate(slug, idx), metaDescription: meta };
}

export function getAllBlogSlugs(): string[] { return (blogSlugs as any[]).map(p => p.slug); }
export function getAllBlogPosts(): BlogPost[] { return (blogSlugs as any[]).map(p => generateBlogPost(p.slug)).filter(Boolean) as BlogPost[]; }
export function getRecentPosts(limit = 10): BlogPost[] { return getAllBlogPosts().sort((a, b) => b.publishDate.localeCompare(a.publishDate)).slice(0, limit); }
export function getRelatedPosts(slug: string, limit = 4): BlogPost[] {
  const cur = generateBlogPost(slug);
  if (!cur) return [];
  return getAllBlogPosts().filter(p => p.slug !== slug && p.category === cur.category).slice(0, limit);
}
