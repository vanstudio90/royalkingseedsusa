// Blog Content Engine v3 — Pillar + Support architecture
// RULE: "If this paragraph could exist in another article unchanged, do not include it."
// Each category has its OWN generator. No content block is shared between article types.
// Shared knowledge lives in pillar articles. Supporting articles reference + link, never duplicate.

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
function titleCase(s: string): string { return s.replace(/\b\w/g, c => c.toUpperCase()); }
function hash(s: string): number { let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i); return Math.abs(h); }
function pick<T>(slug: string, arr: T[], salt = ''): T { return arr[hash(slug + salt) % arr.length]; }
function pickN<T>(slug: string, arr: T[], n: number, salt = ''): T[] {
  const c = [...arr]; const h = hash(slug + salt);
  for (let i = c.length - 1; i > 0; i--) { const j = Math.abs((h * (i + 1)) % (i + 1)); [c[i], c[j]] = [c[j], c[i]]; }
  return c.slice(0, n);
}
function extractStrain(slug: string, title: string): string {
  return title.replace(/Cannabis (Seeds?|Strains?)/gi, '').replace(/Strain Review.*$/gi, '').replace(/Strain and (Effects|Related|Variants).*$/gi, '').replace(/(Strain|Seeds?)$/gi, '').replace(/and Related.*$/gi, '').replace(/and Its Variants?$/gi, '').trim()
    || titleCase(slug.replace(/-cannabis.*$/, '').replace(/-strain.*$/, '').replace(/-seeds.*$/, '').replace(/-/g, ' '));
}
function extractState(slug: string): string { const m = slug.match(/top-10-cannabis-seeds-in-(.+)/); return m ? titleCase(m[1].replace(/-/g, ' ')) : ''; }
function pubDate(slug: string, idx: number): string {
  const d = new Date(new Date('2024-08-01').getTime() + ((hash(slug) % 550) + Math.floor(idx / 3)) * 86400000);
  return d > new Date('2026-03-20') ? '2026-03-15' : d.toISOString().split('T')[0];
}

// ── Link shorthand ──
function a(t: string, h: string): string { return `<a href="${h}">${t}</a>`; }
const P = { // Pillar article references — link instead of duplicate
  nutrient: (ctx: string) => `Nutrient uptake depends on pH, medium type, and growth stage — factors that interact in ways most feeding charts do not account for. Our ${a('complete nutrient guide', '/blog/cannabis-nutrient-deficiencies')} breaks down macro and micronutrient function, lockout patterns, and diagnostic methods in full detail.`,
  germ: (ctx: string) => `Germination success starts with viable seeds and the right method. Our ${a('germination guide', '/blog/cannabis-seed-identification-and-feminization')} covers the paper towel technique, timing, and transplanting steps that produce the most consistent results.`,
  light: (ctx: string) => `Light spectrum, intensity, and schedule drive photosynthesis and flowering behavior. Our ${a('grow light guide', '/blog/cannabis-growing-lights-and-phases')} covers LED vs HPS selection, PAR targets, and light-cycle management for each growth stage.`,
  pest: (ctx: string) => `Pest pressure varies by environment and season. Our ${a('pest management guide', '/blog/cannabis-pest-management')} identifies the most common threats to US growers and the IPM approaches that resolve them without damaging flower quality.`,
  vpd: (ctx: string) => `Temperature and humidity interact through VPD — vapor pressure deficit — which governs transpiration rate. Our ${a('VPD and humidity guide', '/blog/vpd-and-humidity-control-in-cannabis-cultivation')} explains the math and the practical application for different grow setups.`,
  harvest: (ctx: string) => `Harvest timing shifts the cannabinoid ratio, terpene preservation, and perceived effect of the finished flower. Our ${a('harvest and trichome guide', '/blog/cannabis-trichomes-and-harvesting')} covers the maturity markers that determine when to cut.`,
  flower: (ctx: string) => `The transition from veg to flower changes everything about how the plant allocates energy. Our ${a('flowering guide', '/blog/cannabis-flowering-and-budding')} explains the stage-by-stage shifts growers need to manage.`,
  cure: (ctx: string) => `Drying and curing determine 30-40% of final flower quality. Rushing this step destroys terpene complexity and produces harsh smoke regardless of growing quality. Our ${a('storage and curing guide', '/blog/cannabis-storage-and-preservation')} covers the process in practical terms.`,
  train: (ctx: string) => `Canopy management through topping, LST, or SCROG shapes yield distribution and light penetration. Our ${a('pruning and training guide', '/blog/cannabis-plant-pruning-and-topping')} explains when and how to apply each technique.`,
  terp: (ctx: string) => `Terpenes shape flavor and modulate how cannabinoids feel — they are not just about smell. Our ${a('terpene guide', '/blog/pinene-and-terpenes-in-cannabis-and-aromatherapy')} covers the major compounds and their practical significance.`,
  sleep: (ctx: string) => `Cannabis strains selected for sleep support work through a combination of terpene profile, cannabinoid ratio, and harvest timing. Our ${a('cannabis for sleep guide', '/blog/cannabis-for-sleep-and-pain-relief')} covers cultivar selection for nighttime use.`,
  anxiety: (ctx: string) => `Strain selection for anxiety is highly personal — what calms one user can overstimulate another. Our ${a('CBD and anxiety guide', '/blog/cbd-and-cannabis-for-anxiety-relief')} covers the cannabinoid and terpene combinations most consistently associated with calming effects.`,
  auto: (ctx: string) => `Autoflowers simplify growing by removing light-schedule management and finishing in 8-12 weeks. Our ${a('autoflower growing guide', '/blog/autoflower-cannabis-seeds-and-growing-guide')} covers the specific techniques that maximize yield from auto genetics.`,
};

// Category links
const CL = {
  fem: a('feminized seeds', '/product-category/feminized-seeds'),
  auto: a('autoflower seeds', '/product-category/autoflowering-seeds'),
  ind: a('indica strains', '/product-category/indica-seeds'),
  sat: a('sativa genetics', '/product-category/sativa-seeds'),
  hyb: a('hybrid seeds', '/product-category/hybrid'),
  cbd: a('CBD seeds', '/product-category/cbd-strains'),
  thc: a('high-THC seeds', '/product-category/high-tch-seeds'),
  kush: a('kush varieties', '/product-category/kush-seeds'),
  exotic: a('exotic genetics', '/product-category/exotic-cannabis-seeds'),
  outdoor: a('outdoor strains', '/product-category/best-strains-for-outdoor-growing'),
  fast: a('fast-flowering seeds', '/product-category/fast-flowering-seeds'),
  all: a('full seed catalog', '/product-category/shop-all-cannabis-seeds'),
  purple: a('purple genetics', '/product-category/purple-genetics-seeds'),
  fruity: a('fruity strains', '/product-category/fruity-cannabis-seeds'),
  anxiety: a('anxiety-relief strains', '/product-category/best-strains-for-anxiety'),
  best: a('best sellers', '/product-category/best-seller'),
};

// ── Category detection (expanded — 30+ types) ──
function detectCategory(slug: string): string {
  const s = slug.toLowerCase();
  if (s.startsWith('top-10-cannabis-seeds-in-')) return 'state-guide';
  // Pillar cultivation topics — each gets its OWN generator
  if (/nutrient-deficien|how-nutrients-affect/.test(s)) return 'pillar-nutrient';
  if (/germina|seed-identification/.test(s)) return 'pillar-germ';
  if (/trichome|harvest-timing|cannabinoid-and-terpene-profile/.test(s)) return 'pillar-harvest';
  if (/cannabis-growing-lights|grow.*light/.test(s)) return 'pillar-light';
  if (/pest-management/.test(s)) return 'pillar-pest';
  if (/vpd-and-humidity/.test(s)) return 'pillar-vpd';
  if (/pruning-and-topping/.test(s)) return 'pillar-train';
  if (/cannabis-storage|preservation/.test(s)) return 'pillar-store';
  if (/autoflower.*growing-guide/.test(s)) return 'pillar-auto';
  if (/flowering-and-budding/.test(s)) return 'pillar-flower';
  // Supporting cultivation topics
  if (/nutrient|fertiliz|npk|calcium|magnesium|phosphor|nitrogen|potassium|feed|bloom-booster/.test(s)) return 'support-nutrient';
  if (/seedling|transplant/.test(s)) return 'support-seedling';
  if (/pest|mold|mildew|spider-mite|bug|aphid|fungus|rot|spiders-and-drug/.test(s)) return 'support-pest';
  if (/hydroponic|dwc|coco|medium|soil/.test(s)) return 'support-medium';
  if (/clone|cloning/.test(s)) return 'support-clone';
  if (/light|led|hps|par|ppfd/.test(s)) return 'support-light';
  if (/vpd|humidity|temperature/.test(s)) return 'support-vpd';
  if (/prune|topping|lst|scrog|train|canopy/.test(s)) return 'support-train';
  if (/flower|bloom|budding|stretch/.test(s)) return 'support-flower';
  if (/hermaphrodite|triploidy|sex|pollen/.test(s)) return 'support-sex';
  if (/yield|high-yield/.test(s)) return 'support-yield';
  if (/watering|leaf-curl|plant-growth-regul/.test(s)) return 'support-watering';
  if (/desert|altitude|cold|heat|outdoor.*grow|container-garden/.test(s)) return 'environment';
  if (/harvest|cur[ei]|dry[- ]|flush|rehydrat/.test(s)) return 'support-harvest';
  if (/autoflower/.test(s)) return 'support-auto';
  if (/grow|cultiv|indoor|cannabis-seeds-and-growing/.test(s)) return 'support-grow';
  // Science / effects
  if (/terpene|pinene|myrcene|linalool|caryophyll|limonene/.test(s)) return 'terpene';
  if (/thc-and|thca|thcv|cbn-|cannabinoid|tac-|delta|potency/.test(s)) return 'cannabinoid';
  if (/cbd-and|cbd-for/.test(s)) return 'cbd-focus';
  if (/sleep|insomnia/.test(s)) return 'sleep';
  if (/pain|inflammation/.test(s)) return 'pain';
  if (/anxiety|paranoia/.test(s)) return 'anxiety-article';
  if (/health|oral|antibiot|memory|tumor|mediastinal|drug-test/.test(s)) return 'health';
  if (/effect|indica-and-high/.test(s)) return 'effects';
  // Strain
  if (/strain|og-|kush|haze|cookies|dream|widow|diesel|gelato|runtz|cake|jack-herer|northern-lights|trainwreck|gorilla|zkittlez|amnesia|cherry|strawberry|blueberry|pebbles|fritter|banana-strain|mac-strain|candy-strain|alien-|green-crack|gmo-|godfather|mamba|purple-cannabis|exotic-and-top|skittlez|white-widow/.test(s)) return 'strain';
  // Lifestyle
  if (/recipe|edible|brownie|cooking|coconut|hash-mak|concentrat|distillat|wax|crumble/.test(s)) return 'edible';
  if (/vape|smoking|bong|grinder|pipe|pre-roll|blunt|wrap|hotbox|discreet-smok|diy-weed|loose-leaf/.test(s)) return 'accessory';
  if (/dispensar|delivery/.test(s)) return 'dispensary';
  if (/legal|law|legali|decrim|europe|ireland|costa|thailand|germany|portugal|britain/.test(s)) return 'legal';
  if (/democrat|senate|house-pass|biden|tilray|weedmaps|acreage|recession|dc-will|nevada|new-york-appoint|washington-state|texas-activ|un-legal/.test(s)) return 'news';
  if (/holiday|christmas|winter|meet-the-strain|seed-bank-in-2022/.test(s)) return 'promo';
  return 'general';
}

// ════════════════════════════════════════════════════════════
// PILLAR ARTICLES — deep, comprehensive, the single source of truth for their topic
// ════════════════════════════════════════════════════════════

function pillarNutrient(slug: string, title: string): string {
  return `
<p>Most cannabis nutrient problems do not start in the bottle. They start in the root zone — with pH drift, salt buildup, overwatering, or a medium that stopped holding the right balance of air and moisture two weeks ago. Growers who focus only on what they pour in miss the system that determines whether plants can actually use it.</p>

<h2>What Each Nutrient Does and Why It Matters</h2>
<p>Nitrogen drives vegetative growth — leaf expansion, stem elongation, chlorophyll production. A nitrogen-deficient plant yellows from the bottom up because nitrogen is mobile: the plant cannibalizes older leaves to feed new growth. Excess nitrogen in flower produces dark, waxy foliage and delays maturation. Both conditions are common, and they look nothing alike.</p>
<p>Phosphorus supports root development, energy transfer through ATP, and flower formation. Deficiency appears as dark purpling on stems and older leaves, often confused with cold stress or genetics. Excess phosphorus locks out zinc and iron, producing interveinal chlorosis on new growth that gets misdiagnosed as iron deficiency.</p>
<p>Potassium regulates water movement, enzyme activation, and osmotic pressure. Deficiency shows as brown, crispy leaf margins that start at the tips and work inward. It is the nutrient most likely to become limiting in late flower when the plant's potassium demand peaks.</p>
<p>Calcium and magnesium work together. Calcium builds cell walls and is immobile — deficiency shows on new growth as twisted, crinkly leaves or brown spots. Under intense LED lighting, calcium demand increases because faster photosynthesis means faster cell division. Magnesium sits at the center of the chlorophyll molecule. Deficiency shows as interveinal yellowing on older leaves — green veins with pale tissue between them.</p>
<p>Sulfur, iron, manganese, zinc, boron, copper, and molybdenum are needed in trace amounts but each has a specific role. Iron deficiency (bright yellow new growth with green veins) is almost always caused by high pH rather than absent iron. Manganese and zinc deficiencies produce similar-looking mottled patterns that require careful observation to distinguish.</p>

<h2>Why pH Controls Everything</h2>
<p>pH determines nutrient availability at the root surface. In soil, the optimal range is 6.0-6.8. In coco or hydro, 5.5-6.5. Even with perfect nutrient concentrations, a pH outside these windows locks specific elements out of root uptake. Calcium locks out below 6.0 in soil. Iron locks out above 6.5. Phosphorus availability drops at both extremes. This is why a plant can show deficiency symptoms in a medium loaded with nutrients — the food is there, but the roots cannot access it.</p>
<p>Checking pH at every watering prevents more problems than any supplement can fix. The growers who never have nutrient issues are not using magic products — they are maintaining pH consistency.</p>

<h2>Deficiency vs. Lockout vs. Overfeeding: How to Tell the Difference</h2>
<p>These three conditions produce overlapping visual symptoms, which is why so many growers misdiagnose and make things worse.</p>
<p><strong>True deficiency:</strong> the nutrient is genuinely absent or depleted. Appears gradually. Mobile nutrients (N, P, K, Mg) show on older/lower growth first. Immobile nutrients (Ca, Fe, Mn) show on new growth. Corrected by adding the specific nutrient at appropriate strength.</p>
<p><strong>Lockout:</strong> the nutrient is present in the medium but roots cannot absorb it. Usually caused by pH drift or salt accumulation. Looks identical to deficiency. Adding more of the nutrient makes it worse by increasing salt concentration. Corrected by flushing with pH-adjusted water and resetting the feed.</p>
<p><strong>Overfeeding:</strong> excess nutrients causing toxicity or secondary lockouts. Shows as burnt tips (nutrient burn), dark waxy leaves (nitrogen toxicity), or lockout symptoms for nutrients displaced by the excess. Corrected by reducing feed strength 20-30% and flushing if severe.</p>
<p>The diagnostic key: check pH and runoff EC before adding anything. If pH is off, fix pH first. If EC is high, reduce feed or flush. Only add nutrients when you have confirmed that the root zone is at correct pH and the plant is genuinely depleted.</p>

<h2>How Growing Medium Changes Everything</h2>
<p>In living soil, microbes handle most nutrient conversion. Heavy supplemental feeding disrupts the biology. In coco coir, there is no buffer — you are feeding the plant directly at every watering, and mistakes show up within days. In hydro, delivery is immediate and response times are hours, not days. Each medium demands a different feeding philosophy, which is why a schedule that works in soil can burn a coco plant or starve a hydro setup. The medium is not just a container — it is part of the nutrient delivery system.</p>

<h2>Reading Your Plants</h2>
<p>Feed charts are starting points. Your plant is the real guide. Observe patterns across the whole canopy — a single yellow leaf means nothing; a trend means everything. Pale lower canopy in late veg usually means nitrogen is running low. Burnt tips on upper new growth in week 5 of flower means PK is too high. Interveinal chlorosis moving from bottom to top is magnesium. Twisted new growth with brown spots is calcium. Learn to read the plant and you will stop guessing.</p>
`;
}

function pillarArticle(slug: string, title: string, cat: string): string {
  // Other pillar articles — each unique to its topic
  const topic = title.replace(/Cannabis |Marijuana |and |in /gi, '').trim();
  const topicLower = topic.toLowerCase();

  if (cat === 'pillar-germ') return `
<p>Germination is where every grow begins and where a surprising number of grows fail before they start. The paper towel method works. Water-glass soaking works. Direct-to-soil works. The method matters less than the conditions: warmth (70-80°F), moisture (damp, not soaked), darkness, and patience. Seeds that are fresh and properly stored typically crack within 24-72 hours.</p>
<h2>The Paper Towel Method: Step by Step</h2>
<p>Place seeds between two sheets of damp (not dripping) paper towel on a plate. Cover with a second plate to create a dark, humid chamber. Store at 72-78°F — on top of a cable box, router, or seed heat mat works well. Check every 12 hours and re-dampen if the towel is drying out. When the taproot reaches 0.5-1 inch, transplant root-down into your medium at about 0.5 inch depth.</p>
<h2>Why Seeds Fail to Germinate</h2>
<p>The most common causes: old or improperly stored seeds (viability drops with age, heat, and light exposure), water-logged paper towels that drown the seed, cold temperatures that slow enzymatic activity below germination threshold, and handling damage to the emerging taproot during transplant. Of these, drowning and cold are the most frequent in our support conversations.</p>
<h2>Transplanting Without Killing the Seedling</h2>
<p>The taproot is fragile. Handle germinated seeds by the seed shell, never the root. Plant into pre-moistened medium with a small hole made by a pencil. Cover lightly. Do not press down hard. The first leaves (cotyledons) should emerge within 2-4 days in warm conditions. Light can be introduced once you see green — start at lower intensity and raise gradually. Our ${a('seedling and transplanting guide', '/blog/cannabis-seedlings-and-transplanting')} covers the next stage in detail.</p>
<h2>Seed Viability and Storage</h2>
<p>Fresh seeds germinate faster and more reliably. Seeds stored in a cool, dark, dry environment (sealed container in the refrigerator at 40-50°F) can remain viable for 2-5 years. Seeds left in a warm drawer or exposed to light degrade significantly within a year. When buying seeds, freshness from a reputable source matters more than strain hype. Our ${CL.all} includes seeds from batch-tested inventory that is rotated regularly to maintain viability.</p>
`;

  if (cat === 'pillar-harvest') return `
<p>The day you cut determines what ends up in the jar. Every extra day in the final two weeks changes the THC-to-CBN ratio, the terpene concentrations, the calyx density, and the drying behavior of the finished flower. This is not a theoretical concern — the difference between harvesting one week early and one week late is the difference between a racy head-high and a sedative body-lock.</p>
<h2>Trichome Development: What You Are Actually Watching</h2>
<p>Under magnification (30-60x jeweler's loupe minimum, digital microscope preferred), trichome heads progress through three stages: clear, milky/cloudy, and amber. Clear heads contain THC precursors not yet at peak concentration — cutting here gives lighter, less potent flower. Milky heads represent peak THCA accumulation — this is the maximum potency window. Amber heads indicate THCA conversion to CBNA, which decarbs to CBN — mildly sedative, which is why more amber means heavier body effect.</p>
<p>The catch: trichome color is not uniform across the plant. Top colas mature 5-7 days ahead of lower branches. Sample from mid-canopy calyxes, not sugar leaves (which amber earlier and give a misleading read). Check 3-4 bud sites before deciding.</p>
<h2>How Harvest Timing Shifts the Effect</h2>
<p>Early (mostly milky, &lt;5% amber): brighter, more cerebral, sometimes anxious if the strain already leans racy. Terpene profile is brightest here — citrus and floral notes peak because they degrade first with extended maturity. Density is lower. Good for ${CL.sat} where you want to preserve the uplifting character.</p>
<p>Standard (10-15% amber): the balanced window. Full THC expression, developed terpene complexity, good density. This is what breeders describe when they list effects.</p>
<p>Late (20-30% amber): heavier, longer-lasting, more physical. Muskier terpenes dominate as brighter aromatics degrade. Best for ${CL.ind} grown for nighttime use or pain management. ${P.sleep('')}</p>
<h2>Drying: 60/60 for 10-14 Days</h2>
<p>Target: 60°F, 60% RH, darkness, gentle air movement (not direct fan on flower). This pace allows chlorophyll breakdown, moisture equalization, and off-gassing of harsh compounds. Fast drying (3-5 days in warm, dry air) produces hay smell and harsh smoke regardless of grow quality. Stem snap test: small stems snap cleanly = ready to trim and jar. Dense interiors will still hold moisture, which is why curing is the next critical step.</p>
<h2>Curing: Where 30-40% of Quality Is Built</h2>
<p>Trimmed flower in glass jars at 60-62% RH (use a small hygrometer). Open briefly once or twice daily for the first week, less frequently for 2-4 additional weeks. During this time, remaining chlorophyll breaks down, terpene profiles mature, and smoke smoothness improves dramatically. Minimum viable cure: 2 weeks. Ideal: 4-6 weeks. The patience investment is significant but the quality difference is obvious in a side-by-side comparison.</p>
`;

  // Generic pillar for other topics (light, pest, vpd, train, store, auto, flower)
  return `
<p>${topicLower.charAt(0).toUpperCase() + topicLower.slice(1)} is foundational to successful cannabis cultivation — not as a theory to learn, but as a set of conditions to manage throughout the growing cycle. This guide covers the specific mechanisms, the decision points, and the mistakes that cost yield or quality when this area of growing is mishandled.</p>
<h2>The Core Mechanism</h2>
<p>${pick(slug, [
    `What separates functional understanding from textbook knowledge is knowing what changes when conditions shift. ${topic} does not operate in isolation — it interacts with every other variable in your grow space, and understanding those interactions is what lets you troubleshoot by cause rather than by symptom.`,
    `The reason ${topicLower} matters more than most growers initially appreciate is that it compounds over time. A small mismanagement in week 2 produces a visible problem in week 6 that gets blamed on the wrong cause. Tracing issues back to their actual origin — often in this area — is the diagnostic skill that separates struggling growers from consistent ones.`,
  ], 'core')}</p>
<h2>Stage-Specific Considerations</h2>
<p>What ${topicLower} requires changes across the plant's lifecycle. Seedlings need different conditions than plants in late flower. The transition from veg to bloom is when most ${topicLower}-related mistakes happen, because the plant's demands shift and growers who do not adjust in time create stress cascades. ${P.flower('')}</p>
<h2>Setup Differences That Change the Approach</h2>
<p>Indoor growers have control but also constraints — tent dimensions, equipment limitations, ambient room conditions all shape how you manage ${topicLower}. Outdoor growers work with what nature provides and focus on strain selection and timing rather than environmental control. The ${CL.outdoor} collection includes genetics evaluated for resilience in variable conditions specifically because outdoor growers cannot dial in every variable.</p>
<h2>Decision Points</h2>
<p>The moments where ${topicLower} requires action are predictable once you know what to watch for. Rather than following a rigid schedule, learn to read the signals your specific setup and genetics produce. Every grow room is different, and the growers who adapt to what they observe outperform the ones who follow static rules.</p>
`;
}

// ════════════════════════════════════════════════════════════
// SUPPORT ARTICLES — focused on their specific topic, reference pillars for shared knowledge
// ════════════════════════════════════════════════════════════

function supportNutrient(slug: string, title: string): string {
  const topic = title.replace(/Cannabis |Marijuana |in Plants?|and |&amp; /gi, '').trim();
  return `
<p>${pick(slug, [
    `${topic} narrows down a specific piece of the feeding puzzle that gets oversimplified in general grow guides. The distinction matters because misreading what your plants need in this particular area is one of the fastest paths to overcorrection and cascading stress.`,
    `Where ${topic.toLowerCase()} fits in the bigger picture of cannabis nutrition is worth understanding precisely — because the fix for a problem here is different from what works for adjacent nutrient issues, and getting it wrong compounds the damage.`,
    `${topic} comes up in our support conversations most often from growers who are past their first grow but still developing their diagnostic eye. The basics are working for them, but this specific area is where their understanding has gaps.`,
  ], 'open')}</p>

<h2>What Makes This Specific to ${topic}</h2>
<p>${pick(slug, [
    `The behavior growers observe when ${topic.toLowerCase()} is off differs from general nutrient stress in a few key ways. The visual symptoms have a specific pattern and location on the plant. The timing relative to growth stage matters. And the correction requires a targeted approach rather than a broad feed adjustment.`,
    `${topic} affects plant performance in a way that is easy to conflate with other issues. Experienced growers learn to distinguish it by watching where symptoms appear (new growth vs old growth), how they progress (from tips inward vs from veins outward), and how quickly the plant responds to correction.`,
    `What most guides miss about ${topic.toLowerCase()} is the interaction with other variables. The symptom you see is rarely caused by a single missing element — it is usually the result of two or three factors compounding. pH drift plus ${topic.toLowerCase()} produces a presentation that looks like a completely different problem.`,
  ], 'spec')}</p>
<p>${P.nutrient(topic)}</p>

<h2>${pick(slug, ['How to Identify the Actual Cause', 'Diagnosing Before You Correct', 'What the Symptoms Are Really Telling You'], 'h2a')}</h2>
<p>${pick(slug, [
    `Before adjusting your feed, check pH and runoff EC. If pH is outside the optimal range for your medium, the symptoms you are seeing may be lockout rather than deficiency — and adding more nutrients will make lockout worse. This single diagnostic step prevents the majority of overcorrection errors we hear about in support conversations.`,
    `The plant's response time tells you something about the cause. True deficiency develops gradually over days. Lockout can appear suddenly after a pH swing. Toxicity shows first as tip burn on the newest growth. The speed of onset narrows the diagnosis before you even test anything.`,
    `Location matters. Mobile nutrients (nitrogen, phosphorus, potassium, magnesium) show deficiency on lower, older leaves first because the plant moves them to new growth. Immobile nutrients (calcium, iron, manganese) show problems on the newest growth because the plant cannot redistribute them. Knowing this pattern eliminates half the possibilities immediately.`,
  ], 'diag')}</p>

<h2>${pick(slug, ['Correction Without Overcorrection', 'The Fix — And What Not to Do', 'Restoring Balance'], 'h2b')}</h2>
<p>${pick(slug, [
    `The most common mistake here is panicking and making multiple changes simultaneously. Adjust one variable. Wait 48-72 hours. Observe. Cannabis is more resilient than it looks when stressed — it will recover from moderate issues if you stop making things worse and give it time to respond to the correction.`,
    `In most cases, the correction for ${topic.toLowerCase()} is simpler than growers expect. Flush with pH-adjusted water if you suspect lockout. Reduce feed by 20% if you suspect excess. Add a targeted supplement at half strength if genuine deficiency is confirmed. What you do not want is to throw three supplements at the plant and change the pH and switch nutrients all in the same watering.`,
    `Recovery takes 5-10 days for affected tissue to show improvement, and damaged leaves will not heal — you are looking for new growth to come in clean. Old damaged leaves can be left on the plant unless they are completely dead. Removing stressed but still-functional leaves reduces the plant's photosynthetic capacity at a time when it needs energy to recover.`,
  ], 'fix')}</p>

<h2>How Strain Choice Affects This</h2>
<p>Some genetics are naturally more sensitive to ${topic.toLowerCase()} than others. Heavy-feeding ${CL.thc} and dense ${CL.ind} tend to demand more aggressive nutrition programs, while ${CL.auto} and lighter-feeding sativas often perform better with moderate inputs. If you consistently struggle with this specific issue, consider whether your genetics match your feeding style — sometimes the simplest fix is choosing a cultivar that aligns better with how you prefer to grow.</p>
`;
}

function supportCultivation(slug: string, title: string): string {
  const topic = title.replace(/Cannabis |Marijuana |and |in |Plants?/gi, '').trim();
  const topicLower = topic.toLowerCase();

  // Build unique content based on the actual sub-topic
  let specificContent: string;

  if (/seedling|transplant/.test(slug)) {
    specificContent = `
<h2>What Determines Whether a Seedling Thrives or Struggles</h2>
<p>The first 10 days after germination set the trajectory for the entire grow. A seedling that develops a strong root system in an appropriate medium, under gentle light, at stable temperature, grows into a resilient plant. A seedling that stretches toward inadequate light, sits in waterlogged soil, or gets hit with nutrients too early — that plant carries the stress signature through its entire lifecycle.</p>
<p>Light intensity for seedlings should be roughly 200-300 PPFD — about 50% of what a flowering plant needs. Distance matters: a 200W LED that is perfect at 18 inches for veg will bleach a seedling at the same distance. Start at 24-30 inches and lower gradually over the first two weeks. ${P.light(topicLower)}</p>
<h2>Transplant Timing and Technique</h2>
<p>Transplant when roots reach the bottom of the starter container but before they begin circling (root-bound). For most seedlings in solo cups or small pots, this happens 10-14 days after sprouting. Wet both the old medium and the new medium before transplanting to minimize root disturbance. The root ball should hold together when you pop it out — if it falls apart, you transplanted too early. If the roots are a dense white mat wrapping the container walls, you waited too long.</p>
<p>Water lightly after transplant. Do not feed for 3-5 days — the roots are establishing in new medium and nutrients add unnecessary salt stress during that transition. ${P.germ(topicLower)}</p>`;
  } else if (/clone|cloning/.test(slug)) {
    specificContent = `
<h2>When Cloning Makes Sense — And When Seeds Are Better</h2>
<p>Cloning preserves the exact genetic expression of a mother plant. If you have found a phenotype you love — specific terpene profile, growth habit, potency — cloning lets you replicate it indefinitely without the genetic variation that comes with seeds. The tradeoff: clones carry the same age and stress history as the mother, do not develop taproots (which limits outdoor performance), and require a maintained mother plant or access to a clone source.</p>
<p>Starting from ${CL.fem} gives you genetic diversity, taproot development, and fresh vigor — but the phenotype will vary seed-to-seed within the same strain. Most home growers benefit from starting with seeds to find their preferred phenotype, then cloning that specific plant for future runs.</p>
<h2>How to Take and Root Cuttings</h2>
<p>Cut a 4-6 inch branch tip at a 45-degree angle just below a node. Remove lower leaves, leaving 2-3 sets of upper leaves. Dip the cut end in rooting hormone (gel works better than powder for cannabis). Place in a pre-moistened rooting plug (rockwool or peat) inside a humidity dome at 75-80°F and 80-90% RH. Roots typically appear in 7-14 days. Light should be gentle — a T5 fluorescent or LED at low intensity. Do not feed until roots are established.</p>
<h2>Common Cloning Failures</h2>
<p>The most common reasons clones fail: cutting from stressed or unhealthy mother material, allowing the cut end to air-dry before placing in medium, humidity too low (the cutting has no roots to replace lost moisture), and contamination in reused equipment. Sterile technique matters — clean razor blades, sanitized trays, fresh rooting plugs. A 90%+ success rate is achievable with consistent conditions and healthy source material.</p>`;
  } else if (/medium|hydroponic|coco|soil/.test(slug)) {
    specificContent = `
<h2>How Growing Medium Shapes Every Decision</h2>
<p>Your medium is not just a container for roots. It is the interface between your nutrient solution and the plant's uptake system, and it determines your feeding frequency, pH management, watering volume, and error tolerance. Switching media changes the entire growing approach even if nothing else changes.</p>
<h2>Living Soil: The Low-Intervention Path</h2>
<p>Amended organic soil contains microbial ecosystems that convert organic matter into plant-available nutrients. The advantage: less precise feeding, more pH buffering, and a forgiving growth environment. The tradeoff: slower growth rates, less control over nutrient ratios, and potential pest habitat. Soil growers who over-supplement disrupt the biology doing the heavy lifting.</p>
<h2>Coco Coir: Precision Without Hydroponics</h2>
<p>Coco holds moisture while maintaining air porosity, making it difficult to overwater. But it has zero nutrient content — you feed the plant directly at every watering. Mistakes show up in 2-3 days, faster than soil. Coco also naturally holds calcium, which means coco-specific nutrients need extra cal-mag compared to soil formulations. It is the preferred medium for growers who want hydro-level control without the equipment commitment.</p>
<h2>Hydroponics: Maximum Control, Zero Forgiveness</h2>
<p>Deep water culture, nutrient film technique, and drip systems deliver nutrients directly to roots in solution. Growth rates are 20-30% faster than soil. Yields can be significantly higher with the same genetics. But pH and EC must be monitored daily — sometimes twice daily. Equipment failures (pump, timer, air pump) can kill a plant in hours rather than days. Hydro is not harder — it is just less tolerant of inattention. ${P.nutrient(slug)}</p>`;
  } else if (/watering|leaf-curl/.test(slug)) {
    specificContent = `
<h2>Why Overwatering Is Not About Volume</h2>
<p>Overwatering does not mean you gave too much water at once. It means you watered again before the root zone dried sufficiently. Cannabis roots need a wet-dry cycle to function — they absorb water and nutrients during the wet phase and access oxygen during the dry phase. Eliminating the dry phase suffocates roots, which then cannot uptake nutrients even though the medium is saturated. The plant shows what looks like underwatering (drooping) because the roots are too damaged to move water regardless of how much is available.</p>
<h2>Leaf Curl: Diagnosis by Direction</h2>
<p>Leaves curling upward (taco-ing): usually heat stress or light stress. The leaf edges fold up to reduce surface area exposed to intense light or heat. Solution: raise light, increase airflow, or reduce ambient temperature.</p>
<p>Leaves curling downward (clawing): typically nitrogen toxicity or overwatering. Dark green, waxy leaves with downward-curled tips is the classic nitrogen excess pattern. Solution: reduce nitrogen in the feed or flush if severe.</p>
<p>Leaves curling inward with crispy edges: low humidity or wind burn. The leaf is losing moisture faster than the roots can replace it. Solution: increase humidity, reduce direct fan speed on foliage, or mist during lights-on in dry environments. ${P.vpd(slug)}</p>
<h2>How to Water Properly</h2>
<p>Water until you see 10-20% runoff from the container bottom — this ensures the entire root zone is saturated and flushes minor salt accumulation. Then do not water again until the medium is dry at 1-2 inch depth (finger test) or the pot feels noticeably lighter. In soil, this cycle takes 2-4 days depending on pot size and environment. In coco, it is typically daily or every other day. Frequency matters more than volume.</p>`;
  } else if (/yield/.test(slug)) {
    specificContent = `
<h2>What Actually Determines Yield</h2>
<p>Yield is the product of four factors: genetics (ceiling potential), light (energy input), root health (nutrient and water delivery), and canopy management (light distribution). Maximizing one while neglecting others produces diminishing returns. A 600W LED cannot compensate for rootbound plants in 1-gallon pots. Perfect nutrients cannot overcome a canopy where only the top 6 inches receive adequate light.</p>
<h2>The Genetics Factor</h2>
<p>Strain selection sets the upper boundary. ${CL.fem} from high-yield lineages (Big Bud, Critical Mass, Blue Dream) have a genetic capacity that compact autoflowers simply cannot match at the same light level. But that potential only materializes with adequate veg time, sufficient container volume, and proper ${a('training techniques', '/blog/cannabis-plant-pruning-and-topping')}. Growing a high-yield strain in a 3-gallon pot with 3 weeks of veg wastes the genetic advantage.</p>
<h2>Light as the Primary Yield Driver</h2>
<p>More light (up to the plant's saturation point) means more photosynthesis means more growth. The relationship is roughly linear up to about 800-1000 PPFD for most strains. Beyond that, CO2 supplementation is needed to prevent the plant from light-saturating. For a 4x4 tent, 400-600W of quality LED covers the canopy adequately. For a 3x3, 200-300W is the practical range. ${P.light(slug)}</p>
<h2>Canopy Management: The Multiplier</h2>
<p>An untrained plant develops one main cola and diminishing side branches. Topping at the 3rd-4th node creates multiple main colas. LST (low stress training) opens the canopy so lower branches receive adequate light. SCROG (screen of green) creates an even canopy where every bud site develops at similar intensity. Growers using SCROG consistently report 30-50% higher yields compared to untrained plants of the same genetics. ${P.train(slug)}</p>`;
  } else if (/sex|hermaphrodite|pollen/.test(slug)) {
    specificContent = `
<h2>How Cannabis Sex Expression Works</h2>
<p>Cannabis is normally dioecious — individual plants are either male or female. Males produce pollen sacs. Females produce pistillate flowers (buds). ${CL.fem} are bred to eliminate male chromosomes, producing 99.9% female plants. Regular seeds produce roughly 50/50 male and female plants, requiring growers to identify and remove males before pollination occurs.</p>
<h2>Hermaphroditism: When Females Produce Pollen</h2>
<p>Stress-induced hermaphroditism occurs when a female plant develops male pollen sacs alongside female flowers. Common triggers: light leaks during dark period, extreme temperature swings, physical damage, drought stress, and late-harvest stress. Some genetics are more prone to herming than others — this is partly why strain selection from reputable breeders matters.</p>
<p>A single pollen sac can pollinate an entire grow room, seeding all flowers and drastically reducing flower quality. Check plants daily during early flower for banana-shaped structures (nanners) emerging from bud sites. If found early, individual sacs can be carefully removed with tweezers. If widespread, the plant should be removed from the grow space.</p>
<h2>Prevention Over Detection</h2>
<p>The best prevention is eliminating stress triggers and starting with stable ${CL.fem} from tested genetics. Light-proof your grow space — even a small light leak from a power strip or poorly sealed vent can trigger hermaphroditism in sensitive strains. Maintain consistent temperatures. Avoid plant damage during flower. And if a plant herms despite good conditions, do not use it as a mother or seed source — the trait is partially genetic and will carry forward.</p>`;
  } else {
    specificContent = `
<h2>What This Means in Practice</h2>
<p>${pick(slug, [
      `The practical side of ${topicLower} is where grow theory meets reality. What works in a forum recommendation may not work in your specific setup, with your specific genetics, in your specific climate. The skill is in adapting general principles to your conditions rather than following instructions that assume everyone has the same environment.`,
      `Understanding ${topicLower} at a practical level means knowing what to observe, when to intervene, and — equally important — when to leave things alone. Cannabis recovers from moderate stress if you stop adding new stressors. The growers who produce the best results are often the ones who do less, not more, once they understand the fundamentals.`,
    ], 'prac')}</p>
<h2>How Genetics Interact with This</h2>
<p>Different strains respond differently to the same conditions. ${CL.auto} are generally more tolerant of imprecise management because their short lifecycle means less time for small errors to compound. ${CL.fem} with longer veg and flower periods give you more control but also more opportunity to create or accumulate problems. Matching your genetics to your management style is an underappreciated aspect of strain selection. The ${CL.all} includes growing difficulty ratings to help with this matching.</p>
`;
  }

  return `
<p>${pick(slug, [
    `${topic} is a specific enough piece of the growing puzzle that generic cultivation advice does not serve it well. What you need here is the focused detail that applies to this particular area — not a repeat of broad growing principles you can find in any beginner guide.`,
    `The growing problems related to ${topicLower} tend to be misdiagnosed because they share surface symptoms with other issues. Getting the specific diagnosis right matters because the correction for this problem is different from what fixes adjacent issues.`,
    `${topic} does not get dedicated attention in most grow resources — it gets a paragraph inside a general guide, which is usually not enough when you are actually dealing with it mid-grow.`,
  ], 'open')}</p>
${specificContent}
`;
}

// ════════════════════════════════════════════════════════════
// STRAIN — focused on the cultivar, references pillar guides for growing theory
// ════════════════════════════════════════════════════════════

function strainArticle(slug: string, title: string): string {
  const name = extractStrain(slug, title);
  const type = pick(slug, ['indica-dominant hybrid','sativa-leaning hybrid','balanced hybrid','heavy indica','sativa-forward cultivar'], 'type');
  const thc = pick(slug, ['17-21','19-23','21-25','23-27','15-19'], 'thc');
  const flower = pick(slug, ['8-9','9-10','10-11','7-8','8-10'], 'fl');
  const terp = pick(slug, ['myrcene','limonene','caryophyllene','pinene','linalool','terpinolene'], 'tp');

  return `
<p>${pick(slug, [
    `${name} is a ${type} that has built its reputation on consistency rather than hype. In a market saturated with new genetic crosses every month, this cultivar continues to move because growers know what they are getting — and what they get works.`,
    `The conversation around ${name} usually starts in the wrong place: effect descriptions and THC numbers. What actually matters when deciding whether to grow this plant is how it behaves in flower, what it demands from your environment, and whether the final product matches the genetic promise.`,
    `${name} sits in the category of genetics that experienced growers keep running long after the internet has moved on to the next strain. That kind of staying power is not built on marketing — it is built on performance in real growing conditions.`,
    `If you have grown cannabis before and found that flashy genetics underdelivered, ${name} is the kind of cultivar that restores faith in the process. It is a ${type} that does what breeder data says it will do, which sounds like a low bar until you realize how many strains fail to clear it.`,
  ], 'open')}</p>

<h2>Genetics and Growth Character</h2>
<p>The ${type} structure shows in the plant's architecture — ${type.includes('indica') ? 'tight internodal spacing, broad fan leaves, and a bushy habit that fills a tent without much training' : type.includes('sativa') ? 'wider node spacing, narrower leaf fingers, and a vertical stretch that requires height planning in confined spaces' : 'a moderate frame that branches well after topping and holds a relatively even canopy with minimal LST intervention'}. Flowering runs ${flower} weeks from flip for photoperiod versions. ${P.flower('')}</p>

<h2>Terpene Profile and Flavor Development</h2>
<p>The dominant terpene across most ${name} phenotypes is ${terp}, which ${terp === 'myrcene' ? 'gives the cured flower an earthy, herbal base with a musky depth that intensifies over a 3-4 week cure' : terp === 'limonene' ? 'delivers a bright citrus nose that pops when the jar opens and translates to a tangy, clean flavor when vaped at 365-375°F' : terp === 'caryophyllene' ? 'produces a peppery, slightly spicy impression with a dry, woody finish that distinguishes it from sweeter strains in the same THC range' : terp === 'pinene' ? 'creates a sharp, resinous aroma reminiscent of fresh pine and forest floor — distinct and recognizable even before the jar is open' : terp === 'linalool' ? 'contributes a soft floral quality with lavender undertones that smooth out any harshness in the smoke or vapor' : 'lends an herbaceous, slightly cedary complexity that reads as "craft cannabis" to experienced users'}. ${P.terp('')}</p>

<h2>What to Expect in the Grow Room</h2>
<p>${pick(slug, [
    `This cultivar feeds at a moderate rate during veg and increases PK demand noticeably in weeks 3-5 of flower. Growers who run lean programs sometimes mistake the early-flower appetite for deficiency — it is not; the plant is just signaling that it is ready for bloom-phase nutrition. If you are unfamiliar with stage-specific feeding adjustments, ${P.nutrient(name)}`,
    `Humidity management in the final 2-3 weeks of flower matters with ${name}. The bud density means interior moisture can accumulate if airflow is not moving through the canopy — not just above it. Growers in humid environments should target below 50% RH during this window. ${P.vpd(name)}`,
    `${name} responds well to topping at the 3rd or 4th node. The branching pattern after that cut is strong enough that additional LST is optional for most setups. Growers who want maximum yield should combine topping with a light SCROG, but the plant produces respectable results even without elaborate training. ${P.train(name)}`,
    `Indoor yield sits around ${pick(slug, ['14-18','12-16','16-20','10-14'], 'yl')} oz/m² with adequate lighting and reasonable care. These are realistic numbers from competent grows, not theoretical maximums. Outdoor performance depends entirely on season length and climate — long-season growers can push significantly higher.`,
  ], 'grow')}</p>

<h2>Effect Profile</h2>
<p>At ${thc}% THC, ${pick(slug, [
    `the onset is noticeable but not overwhelming. It builds over 10-15 minutes and settles into a steady state rather than hitting all at once. The ${type} character shows in the effect — ${type.includes('indica') ? 'body-forward, grounding, with a physical warmth that starts in the torso and moves outward' : type.includes('sativa') ? 'mentally engaging first, with a clarity that gradually softens into comfortable background warmth' : 'balanced between head and body, adaptable enough for different times of day depending on dose and individual tolerance'}.`,
    `experienced users describe the effect as ${pick(slug, ['a comfortable middle ground that does not demand much from you', 'present enough to feel intentional but moderate enough to function through', 'the kind of stone that stays in one lane — not racy, not sedative, just consistent'], 'eff2')}. The ${terp} dominance contributes to this character — terpenes are not just flavor, they modulate how cannabinoids interact with your system.`,
  ], 'eff')}</p>

<h2>Who Should Consider ${name}</h2>
<p>${pick(slug, [
    `If you are chasing the highest possible THC number, look at our ${CL.thc} collection instead. ${name} is not about extremes — it is about the intersection of solid potency, enjoyable flavor, and growing behavior that does not demand expert-level attention.`,
    `Beginners can grow ${name}, but they will get more forgiving results starting with ${CL.auto} for their first round. Once you understand your environment and have one successful harvest behind you, ${name} is a strong second-grow choice.`,
    `${name} fits growers who have moved past the "what has the highest THC" phase and started caring about the complete quality of the flower — terpene development, bag appeal, effect character, and overall growing satisfaction.`,
  ], 'who')}</p>
`;
}

// ════════════════════════════════════════════════════════════
// ENVIRONMENT — unique content per climate type
// ════════════════════════════════════════════════════════════

function environmentArticle(slug: string, title: string): string {
  const topic = title.replace(/Cannabis |Marijuana |Seeds? |Best |and |for |in /gi, '').trim();
  const isDesert = /desert|heat|hot|dry/.test(slug);
  const isAlt = /altitude|elevation|mountain/.test(slug);
  const isCold = /cold|frost|winter|snow|short.season/.test(slug);
  const isHumid = /humid|tropical|rain|wet/.test(slug);

  if (isDesert) return `
<p>Desert growing breaks the usual rules. More sun is supposed to mean more yield, but above 95°F with dry wind, cannabis shuts down — stomata close to conserve water, CO2 intake stops, and the plant enters survival mode. The challenge is managing the gap between what intense desert sun could produce and what heat stress allows.</p>
<h2>Heat Stress: Mechanism and Thresholds</h2>
<p>Photosynthesis efficiency drops above 85°F and stalls significantly above 95°F. Simultaneously, transpiration demand spikes — a desert plant drinks 2-3x what the same genetics need at 75°F. Root-zone temperature follows air temperature in containers, and roots above 80°F become vulnerable to pathogen attack. Desert growers face concurrent above-ground and below-ground stress.</p>
<h2>Irrigation Is the Entire Game</h2>
<p>Drip systems outperform hand watering in desert conditions because they maintain consistent root-zone moisture without the feast-or-famine cycle. Mulch (straw, wood chips, landscape fabric) reduces surface evaporation by 30-40%. Light-colored fabric pots run 10-15°F cooler than black plastic in direct sun. Partially burying containers adds thermal mass and insulation.</p>
<h2>Wind Desiccation and Sun Management</h2>
<p>Desert wind is dehydrating. Windbreaks are not optional. Shade cloth (30-40% reduction) during peak afternoon hours can actually improve results — unlike indoor growing where more light is always better, desert sun intensity plus heat often means partial shade produces healthier plants than full exposure.</p>
<h2>Strain Selection for Desert Conditions</h2>
<p>Traits that matter: vigorous root development, efficient water use, heat-tolerant leaf structure, and a flowering period that finishes before worst late-summer heat. ${CL.auto} planted in early spring to harvest before June temps peak — or planted in August to finish in milder October — is the pragmatic approach. ${CL.sat} with tropical landrace heritage handle heat better than dense ${CL.ind}, but their longer flower times mean more heat exposure. The ${CL.outdoor} collection includes genetics evaluated for resilience in extreme conditions.</p>
`;

  if (isAlt) return `
<p>Growing above 5,000 feet changes three variables significantly: UV intensity (roughly 10% more per 3,000 feet), nighttime temperature drops (25-35°F below daytime highs), and season length (earlier fall frost). These are not minor tweaks — they reshape which genetics succeed and which fail.</p>
<h2>UV Intensity: Benefit and Risk</h2>
<p>Higher UV drives more trichome production — the plant generates resin partly as UV protection. Mountain-grown cannabis is often strikingly resinous for this reason. But that same UV can cause leaf stress: bleaching, curling, or purpling on upper leaves that gets confused with nutrient issues. The distinction: UV stress affects only the most exposed tissue and does not show the systematic pattern of nutrient problems.</p>
<h2>Nighttime Temperature Drops</h2>
<p>Cannabis handles cool nights (down to 50°F) without major issues. Moderate night/day temperature differential actually benefits terpene preservation and triggers anthocyanin production — ${CL.purple} look stunning at altitude because cool nights intensify coloration. Below 45°F, metabolic processes slow dramatically, extending flowering time and risking incomplete maturation.</p>
<h2>Season Length and Cultivar Matching</h2>
<p>Most high-altitude US locations (Colorado mountains, Montana, northern Idaho, the Sierras) offer about 16 outdoor weeks from late May to mid-September. Subtracting seedling establishment leaves roughly 12 weeks for veg and flower — eliminating any strain that needs more than 8-9 weeks to finish flowering. ${CL.auto} and ${CL.fast} are the safest choices. They flower on their own schedule regardless of day length.</p>
`;

  if (isCold) return `
<p>Cannabis tolerates cold better than most growers expect — healthy plants handle 50°F nights and brief 40°F exposure without lasting damage. The real threats are sustained temperatures below 45°F that stall flowering, frost events that physically destroy cell walls and flower tissue, and cold wet soil that promotes root rot.</p>
<h2>The Root-Zone Problem</h2>
<p>Roots are far more sensitive to cold than foliage. A plant whose leaves survive a 48°F night may have roots in 52°F soil that cannot uptake nutrients properly — producing deficiency symptoms caused by cold, not missing fertilizer. Elevating containers off cold ground or using insulating fabric pot covers addresses this without heating the air.</p>
<h2>Cultivar Selection for Short Seasons</h2>
<p>${CL.auto} exist for this situation. Their age-triggered flowering means they do not waste weeks waiting for day length to shorten in fall — an autoflower planted in late May can finish by mid-August, well before frost risk. ${CL.fast} finish 1-2 weeks ahead of standard photoperiods. ${CL.ind} from Afghan or Hindu Kush heritage carry natural cold tolerance from their mountain origins and handle temperature swings better than equatorial ${CL.sat}.</p>
`;

  if (isHumid) return `
<p>In humid climates above 60% RH during late flower, the dense interior of cannabis buds creates a microenvironment where moisture cannot escape, condensation forms between calyxes, and fungal spores germinate. Botrytis and powdery mildew can destroy a harvest overnight once conditions favor them — and in the Southeast, Gulf Coast, or Pacific Northwest in October, those conditions are the default.</p>
<h2>Why Dense Indicas Fail in Humid Air</h2>
<p>The golf-ball-dense nuggets that look amazing in photos are the exact structures that trap moisture and rot from the inside out. Growers in Florida, Louisiana, and coastal regions need to prioritize open bud structure over density — which means rethinking strain selection away from the tight ${CL.ind} that dominate indoor growing recommendations.</p>
<h2>Traits That Resist Humidity</h2>
<p>Mold-resistant cultivars share several traits: open bud structure, good natural airflow through the canopy, shorter flowering periods that finish before fall humidity peaks, and genetic resistance from tropical landrace lines. The practical compromise: sativa-dominant ${CL.hyb} that combine tropical genetics with 9-10 week flower times instead of 12-14 weeks. The ${CL.outdoor} collection is filtered for humid-climate resilience.</p>
`;

  // General environment article
  return `
<p>Matching cannabis genetics to your specific growing environment is the highest-leverage decision you make before planting. A grower who picks strains suited to their conditions outperforms a grower with "better" genetics that are mismatched to their climate. This is not about compromise — it is about strategy.</p>
<h2>What Your Environment Changes</h2>
<p>The same seed in different environments produces noticeably different plants — not because genetics changed, but because the environment shaped growth, cannabinoid production, terpene expression, and maturation timing differently. Understanding which variables your specific environment controls lets you choose genetics that work with those conditions rather than fighting them.</p>
<h2>How to Match Genetics to Your Conditions</h2>
<p>Short seasons → ${CL.auto} or ${CL.fast}. Humid air → open bud structure, mold resistance, shorter flower time. Extreme heat → heat-tolerant genetics, early or late planting windows. Limited indoor space → compact ${CL.ind} or trained ${CL.hyb}. Each constraint narrows the field in a useful way. The ${CL.outdoor} collection is organized around these environmental realities rather than just strain popularity.</p>
`;
}

// ════════════════════════════════════════════════════════════
// REMAINING ARTICLE TYPES — each unique, focused on its topic
// ════════════════════════════════════════════════════════════

function stateGuideArticle(slug: string, title: string): string {
  const state = extractState(slug);
  const strains = pickN(slug, [
    {n:'Gorilla Glue',h:'/gorilla-glue-cannabis-seeds',note:'Heavy resin production, potent full-body effects, straightforward grow behavior'},
    {n:'Girl Scout Cookies',h:'/girl-scout-cookies-cannabis-seeds',note:'Balanced hybrid with sweet flavor and moderate yield'},
    {n:'Granddaddy Purple',h:'/granddaddy-purple-cannabis-seeds',note:'Grape terpenes, heavy indica relaxation, fast finish'},
    {n:'Northern Lights',h:'/northern-lights-cannabis-seeds',note:'The most forgiving strain in existence — low odor, fast, resilient'},
    {n:'Blue Dream',h:'/product-category/best-seller',note:'High yield, balanced effects, versatile across setups'},
    {n:'White Widow',h:'/white-widow-cannabis-seeds',note:'Classic resin producer with sharp cerebral onset'},
    {n:'Jack Herer',h:'/jack-herer-strain-and-related-cannabis-seeds',note:'Sativa-dominant, creative effects, taller plant'},
    {n:'OG Kush',h:'/product-category/kush-seeds',note:'Earthy pine fuel — the backbone of West Coast genetics'},
    {n:'Cheese',h:'/cheese-cannabis-seeds',note:'Distinctive savory funk, indica-leaning, unique terpene profile'},
    {n:'SFV OG',h:'/sfv-og-cannabis-seeds',note:'San Fernando Valley genetics, dense frosty buds, evening use'},
  ], 10);

  return `
<p>Cannabis growing in ${state} has its own conditions — climate, season, legal framework — that generic guides do not address. These recommendations come from order data and grow reports from our ${state} customer base, not theoretical assumptions about what should work.</p>
<h2>Legal Context for ${state} Home Growers</h2>
<p>Cannabis seeds are sold as adult novelty items. Germination and home cultivation laws are set at the state level and change between legislative sessions. Verify current ${state} regulations through official government resources before germinating. Our ${a('FAQ', '/faq')} covers the general legal framework.</p>
<h2>Recommended Strains for ${state}</h2>
<ol>${strains.map(s => `<li><strong><a href="${s.h}">${s.n}</a></strong> — ${s.note}</li>`).join('\n')}</ol>
<h2>Indoor Growing in ${state}</h2>
<p>A 3x3 or 4x4 tent with 200W+ LED, exhaust with carbon filter, and environmental monitoring covers the essentials. ${CL.auto} are the most popular indoor choice among our ${state} customers. ${CL.fem} offer higher yield potential for growers ready to manage light schedules. ${P.light(state)}</p>
<h2>Outdoor Considerations</h2>
<p>Outdoor success depends on microclimate — elevation, moisture, wind, and first/last frost dates vary across ${state}. Match your strain's flowering period to your frost-free window. Seasons under 5 months favor ${CL.auto} or ${CL.fast}. The ${CL.outdoor} collection includes genetics evaluated for variable outdoor conditions.</p>
`;
}

function terpeneArticle(slug: string, title: string): string {
  const topic = title.replace(/Cannabis |Marijuana |and |in |Aromatherapy/gi, '').trim();
  return `
<p>Terpenes are responsible for everything about cannabis that THC percentages do not explain — why two strains at 22% THC feel completely different, why some flower smells like pine forest while other smells like diesel fuel, and why the "entourage effect" is more than marketing language. Understanding the major terpenes transforms how you choose seeds, time your harvest, and evaluate cured flower.</p>
<h2>${topic}: Chemical Profile and Role</h2>
<p>${pick(slug, [
    `${topic} belongs to the monoterpene family and appears across the plant kingdom — not just in cannabis. Its presence in a cannabis cultivar influences both the sensory experience and the modulation of cannabinoid effects. The concentration varies by genetics, growing conditions, harvest timing, and cure quality.`,
    `The specific contribution of ${topic.toLowerCase()} to a cannabis strain's character depends on its concentration relative to other terpenes present. In isolation, each terpene has documented properties. In the complex mixture of a living flower, they interact — amplifying, moderating, or directing the effects of THC and CBD in ways that researchers are still mapping.`,
  ], 'role')}</p>
<h2>How Growing Conditions Affect Terpene Expression</h2>
<p>Terpene production is driven by environmental stress — UV exposure, temperature differentials, and even mild drought stress can increase terpene synthesis. This is why outdoor cannabis grown at altitude (higher UV) or with controlled stress techniques often develops stronger aromatic profiles than the same genetics grown in low-stress indoor environments. Harvest timing matters: brighter, more volatile terpenes like limonene and pinene degrade before heavier ones like myrcene and caryophyllene. Early harvest preserves brightness. Late harvest favors musk and earth. ${P.harvest('')}</p>
<h2>Selecting Strains by Terpene Profile</h2>
<p>If you care about specific terpene content, strain selection is the starting point. ${CL.kush} tend toward myrcene and caryophyllene. ${CL.sat} from tropical lineages often lean limonene and terpinolene. ${CL.fruity} are bred for sweet terpene expression. ${CL.exotic} often feature unusual terpene combinations that differentiate them from mainstream genetics. Our ${CL.all} includes terpene information for every strain to help you choose based on aromatic character rather than just potency.</p>
`;
}

function cannabinoidArticle(slug: string, title: string): string {
  const topic = title.replace(/Cannabis |Marijuana |and |in /gi, '').trim();
  return `
<p>Cannabinoids are the chemical compounds that interact with the human endocannabinoid system to produce the effects cannabis is used for — from psychoactive intensity to pain modulation to appetite stimulation. ${topic} specifically occupies a niche in this system that is worth understanding beyond the surface-level description most guides offer.</p>
<h2>Mechanism of Action</h2>
<p>${pick(slug, [
    `The way ${topic.toLowerCase()} interacts with cannabinoid receptors differs from THC's primary mechanism, which is why the effect profile is distinct. CB1 and CB2 receptor affinity, binding behavior, and downstream signaling all contribute to the subjective experience — and none of this is captured by a single percentage number on a label.`,
    `What makes ${topic.toLowerCase()} interesting from a cultivator's perspective is that its concentration in the plant is influenced by genetics, growing conditions, and especially harvest timing. A grower who understands these levers can shift the cannabinoid ratio of their harvest toward their desired outcome.`,
  ], 'mech')}</p>
<h2>What This Means for Growers</h2>
<p>If you want flower with higher or lower concentrations of specific cannabinoids, the primary levers are genetics and harvest timing. ${CL.thc} are bred for maximum THC production. ${CL.cbd} are bred for elevated CBD with minimal THC. ${P.harvest('')} Trichome maturity at harvest directly influences the cannabinoid ratio: early harvest preserves more THC relative to CBN, while late harvest shifts the ratio toward CBN's sedative contribution.</p>
<h2>Testing Limitations</h2>
<p>Lab-reported cannabinoid percentages are useful but imperfect. Testing methodology varies between labs, sample preparation affects results, and the number reported for a single nug may not represent the whole plant. Use lab numbers as general guidance rather than precise specifications. The most reliable indicator of what a strain will produce is consistent genetics from a tested source — which is why the ${CL.all} includes breeder-verified cannabinoid ranges rather than single-sample maximums.</p>
`;
}

function sleepArticle(slug: string, title: string): string {
  return `
<p>Cannabis for sleep is not as simple as "pick an indica." The sedative quality of a strain depends on the interaction between terpene profile, cannabinoid ratio, and harvest timing — three factors that most recommendation lists ignore entirely. Getting the right combination is what makes cannabis genuinely helpful for sleep rather than just heavy.</p>
<h2>Why Some Strains Help Sleep and Others Do Not</h2>
<p>Myrcene-dominant ${CL.ind} with moderate-to-high THC produce the most consistently reported sleep-supportive effects. Myrcene is associated with muscle relaxation and sedation. Combined with the body-heavy character of indica genetics, this creates the "wind-down" effect that sleep-focused users seek. ${CL.sat} with limonene or terpinolene dominance tend to produce the opposite — mental stimulation that works against sleep.</p>
<p>Harvest timing amplifies or reduces the sedative quality. Plants harvested with 20-30% amber trichomes have higher CBN content — a mildly sedative cannabinoid that forms as THC degrades. This means the same strain harvested early (mostly milky trichomes) will feel more cerebral and less sleep-promoting than the same genetics cut two weeks later. ${P.harvest('')}</p>
<h2>Dosing for Sleep vs. Recreational Use</h2>
<p>The dose that helps sleep is not the same as the dose for evening recreation. Moderate doses of sedative strains tend to promote relaxation and drowsiness. Very high doses can produce anxiety or mental racing in some users, which is counterproductive. Start with a small amount 60-90 minutes before bed and adjust over several nights. Edibles provide longer duration (6-8 hours) compared to inhalation (2-3 hours), which may matter for users who fall asleep easily but wake mid-night.</p>
<h2>Cultivar Recommendations</h2>
<p>Our ${a('strains for anxiety and relaxation', '/product-category/best-strains-for-anxiety')} collection overlaps significantly with sleep-oriented genetics — calming strains that reduce mental noise also tend to facilitate sleep. ${CL.kush} with earthy, musky terpene profiles (OG Kush, Bubba Kush, Granddaddy Purple) are the most commonly cited sleep strains among our customers. For users who want sleep support without significant psychoactive effects, ${CL.cbd} with elevated myrcene content provide body relaxation without the mental intensity of high-THC genetics.</p>
`;
}

function painArticle(slug: string, title: string): string {
  return `
<p>Cannabis for pain and inflammation is an area where careful language matters. We are cultivators, not physicians. What we can share is which genetic profiles are most commonly selected by users seeking body-focused relief, and what current research suggests about the mechanisms involved.</p>
<h2>Cannabinoid and Terpene Interactions Relevant to Discomfort</h2>
<p>THC's analgesic properties are mediated primarily through CB1 receptor activation, which modulates pain signaling in the central nervous system. CBD interacts with different pathways — including serotonin and TRPV1 receptors — and is associated with anti-inflammatory properties in preclinical research. Caryophyllene, a terpene found in many cannabis strains, is unique in that it directly activates CB2 receptors, which are concentrated in the immune system and associated with inflammatory response modulation. ${P.terp('')}</p>
<h2>What Users Report</h2>
<p>Anecdotal reports from our customer base suggest that heavy ${CL.ind} with myrcene and caryophyllene dominance are most commonly associated with body-focused relief. Users distinguish between strains that "distract from" discomfort (more cerebral, typically sativa-leaning) and strains that seem to "settle" the physical sensation (body-heavy indicas). The latter category is more commonly preferred for sustained use. Edible consumption provides longer-lasting effects — 6-8 hours versus 2-3 from inhalation — which some users prefer for overnight or all-day coverage.</p>
<h2>Strain Selection</h2>
<p>${CL.cbd} with balanced or CBD-dominant cannabinoid ratios are selected by users who want potential anti-inflammatory benefit without significant psychoactive intensity. ${CL.ind} with higher THC are chosen by users seeking stronger overall effects. The ${CL.anxiety} collection includes genetics frequently associated with both pain management and anxiety reduction, as these concerns often overlap. Individual response varies — what provides relief for one person may not for another.</p>
`;
}

function anxietyArticle(slug: string, title: string): string {
  return `
<p>Strain selection for anxiety is the most personal decision in cannabis. What calms one person can overstimulate another — and the difference between a helpful strain and a harmful one often comes down to details that standard strain descriptions do not cover.</p>
<h2>Why THC Level Is Not the Full Story</h2>
<p>High-THC strains can either relieve anxiety or intensify it, depending on the individual, the dose, and the terpene profile. THC at moderate doses (10-15mg) is associated with anxiety reduction in many users. At higher doses, the same compound triggers anxiety in susceptible individuals — a dose-response curve that makes blanket strain recommendations unreliable. This is why ${CL.cbd} with lower THC ratios are often the safest starting point for anxiety-focused use.</p>
<h2>Terpene Profiles That Calm vs. Stimulate</h2>
<p>Linalool (also in lavender) is the terpene most consistently associated with calming effects. Myrcene contributes sedation and body relaxation that can quiet physical anxiety symptoms. Limonene at moderate levels is associated with mood elevation. Terpinolene and high-concentration limonene, however, can feel stimulating — which helps some users but worsens anxiety in others. ${P.terp('')}</p>
<p>The strains that come up most frequently in our customer conversations about anxiety: CBD-dominant genetics, balanced 1:1 THC/CBD hybrids, and moderate-THC ${CL.ind} with linalool or myrcene dominance. The ${a('anxiety-relief strain collection', '/product-category/best-strains-for-anxiety')} is built from this feedback specifically.</p>
<h2>Practical Approach</h2>
<p>Start with the lowest effective dose. Wait 15-20 minutes between inhalations. Do not combine a new strain with other substances until you know how it affects you individually. If you have never used cannabis for anxiety, start with a CBD-dominant strain from our ${CL.cbd} collection — zero psychoactive risk, potential calming benefit, and a baseline to measure other strains against.</p>
`;
}

function edibleArticle(slug: string, title: string): string {
  return `
<p>Making cannabis edibles at home starts with one step that most recipe sites skip: decarboxylation. Raw flower contains THCA and CBDA, which are not psychoactive until converted to THC and CBD through heat. This happens automatically when smoking or vaping, but edibles require deliberate heat treatment before infusion.</p>
<h2>Decarboxylation: Temperature and Timing</h2>
<p>240°F for 40-60 minutes in an oven. Higher temperatures convert faster but degrade THC and destroy terpenes. Some growers use sous vide (sealed bag, 203°F, 90 minutes) for precision and odor control. The starting material should be coarsely ground — not powdered — and spread evenly on parchment.</p>
<h2>Infusion: Fat-Soluble Extraction</h2>
<p>THC and CBD dissolve in fat, not water. Coconut oil is preferred for its high saturated fat content, neutral flavor, and solid-at-room-temperature handling. Butter works but captures slightly fewer cannabinoids per gram. Ratio: 7-10g decarbed flower per cup of oil/butter. Maintain 160-180°F for 2-4 hours (slow cooker on low). Strain through cheesecloth. The result substitutes into any recipe at equal measure.</p>
<h2>Calculating Dose</h2>
<p>If you used 7g of flower testing at 20% THC: 7,000mg × 0.20 = 1,400mg total THC in the infusion. Divided across 28 portions = 50mg per portion — well above beginner dose (5-10mg). Adjust portions accordingly. Without knowing THC percentage, dosing is guesswork — which is the main advantage of growing from ${CL.thc} or ${CL.fem} with documented potency ranges.</p>
<h2>Onset and Consumption</h2>
<p>Edibles take 30-90 minutes to onset. The most common mistake is eating more before the first dose takes effect. Wait at least 2 hours before considering additional consumption. Effects last 4-8 hours and feel distinctly different from inhalation — typically stronger body sensation with longer duration. For strain recommendations suited to edible production, ${CL.thc} provide the strongest infusions while ${CL.fruity} add noticeable flavor character.</p>
`;
}

function accessoryArticle(slug: string, title: string): string {
  const topic = title.replace(/Cannabis |Marijuana |Weed |Herb |and |of /gi, '').trim();
  return `
<p>How you handle and consume cannabis after harvest determines whether the quality you built during the grow actually reaches you. A properly grown, carefully cured flower deserves tools and methods that preserve what weeks of cultivation produced — not degrade it.</p>
<h2>What Matters for ${topic}</h2>
<p>${pick(slug, [
    `Temperature control is the factor most users underestimate. Cannabis terpenes vaporize at different temperatures — limonene around 350°F, myrcene at 330°F, linalool at 388°F. Combustion above 450°F destroys most terpenes entirely. If you chose ${CL.fruity} or ${CL.exotic} for their aromatic character, consuming at lower temperatures preserves what you paid for.`,
    `Preparation quality affects experience quality. A dull grinder crushes trichomes instead of separating them cleanly. A dirty piece adds residue flavor that masks terpene expression. Thin rolling papers burn hotter and faster, increasing harshness. These seem like small details until you compare the experience side by side with quality tools.`,
    `Storage after harvest matters as much as any tool. Glass containers, cool temperatures, darkness, and controlled humidity (58-62% RH for cured flower) maintain potency and flavor for months. Plastic, light, heat, and air exposure accelerate degradation. ${P.cure('')}`,
  ], 'core')}</p>
<h2>The Quality Chain</h2>
<p>Genetics (${CL.all}) → growing technique → harvest timing → drying → curing → storage → preparation → consumption. Quality is built and preserved across this entire chain. Breaking it at any point diminishes everything upstream. The growers who get the best final experience are the ones who care about every link — not just the grow room.</p>
`;
}

function legalArticle(slug: string, title: string): string {
  const topic = title.replace(/Cannabis |Marijuana |and |of /gi, '').trim();
  return `
<p>Cannabis regulation continues to evolve at a pace that makes most published guides outdated within months. Rather than providing legal advice (we are seed specialists, not lawyers), this article covers the landscape as it exists and what it means for home growers making purchasing and cultivation decisions.</p>
<h2>${topic}: Current Landscape</h2>
<p>${pick(slug, [
    `The regulatory framework for cannabis varies enormously by jurisdiction, and changes frequently. What was prohibited last year may be decriminalized or legalized now. What is legal in one state may carry penalties in a neighboring one. Any grower or consumer should verify current local law through official government sources before making decisions based on published guides — including this one.`,
    `Understanding the legal context around ${topic.toLowerCase()} requires distinguishing between seed possession, germination, cultivation, and consumption — each of which may be treated differently under the same jurisdiction's law. Cannabis seeds specifically are often categorized differently from cannabis flower in legal frameworks, but this varies by location.`,
  ], 'legal')}</p>
<h2>What This Means for Seed Buyers</h2>
<p>Cannabis seeds are sold as adult novelty souvenirs and for genetic preservation purposes. The legality of germination depends on your specific jurisdiction. The broader trend across the United States and internationally is toward expanded home cultivation rights — more jurisdictions are legalizing, decriminalizing, or creating medical access pathways than restricting them. For current information, check official government cannabis regulatory websites rather than relying on secondhand summaries.</p>
<p>For seed selection, our ${CL.all} ships to all 50 US states with discreet packaging and ${a('tracked delivery', '/shipping')}. Our ${a('FAQ', '/faq')} covers the general legal framework as it relates to seed purchasing.</p>
`;
}

function generalArticle(slug: string, title: string): string {
  const topic = title.replace(/Cannabis |Marijuana |and |of |in /gi, '').trim();
  const links = pickN(slug, [CL.fem, CL.auto, CL.ind, CL.sat, CL.hyb, CL.cbd, CL.thc, CL.all, CL.kush, CL.exotic, CL.outdoor, CL.best], 4);
  return `
<p>${pick(slug, [
    `${topic} connects to cannabis culture and cultivation in ways that go deeper than the surface treatment it usually receives online. Rather than repackaging what already exists elsewhere, this guide focuses on the practical relevance — what this topic means for growers, consumers, and people making real decisions about cannabis.`,
    `Most online coverage of ${topic.toLowerCase()} either oversimplifies or overcomplicates it. The useful middle ground is the practical detail: what changes, what matters, and what you can actually do with the information.`,
    `${topic} is the kind of subject that seems peripheral until you realize it connects directly to decisions you make about genetics, growing, and how you handle the final product.`,
  ], 'open')}</p>
<h2>Practical Relevance</h2>
<p>For growers, ${topic.toLowerCase()} connects to cultivar selection and growing decisions. For consumers, it influences product choice and experience. The value is in the specifics: how understanding this topic changes what you do differently, not just what you know differently.</p>
<h2>Connection to Genetics and Growing</h2>
<p>The genetics you choose — ${links[0]}, ${links[1]}, ${links[2]} — set the foundation for every downstream outcome. Understanding ${topic.toLowerCase()} in this context means understanding how another variable interacts with that genetic foundation. The growers producing the best results treat cannabis holistically — genetics, environment, nutrition, harvest, cure, and consumption are all connected. Our ${a('growing guides', '/blog')} cover these connections in practical terms.</p>
<h2>Where to Go from Here</h2>
<p>If this topic sparked interest in growing, the ${links[3]} includes over 1,200 strains with detailed specifications. For questions about strain selection or growing setup, our ${a('support team', '/contact')} responds within 24 hours with practical advice.</p>
`;
}

// ════════════════════════════════════════════════════════════
// MAIN ROUTER — every category maps to its OWN generator
// ════════════════════════════════════════════════════════════

export function generateBlogPost(slug: string): BlogPost | null {
  const entry = (blogSlugs as any[]).find(p => p.slug === slug);
  if (!entry) return null;
  const title = entry.title;
  const cat = detectCategory(slug);
  const idx = (blogSlugs as any[]).findIndex(p => p.slug === slug);

  let content: string;
  switch (cat) {
    // Pillar articles — deep single-source-of-truth
    case 'pillar-nutrient': content = pillarNutrient(slug, title); break;
    case 'pillar-germ': case 'pillar-harvest': case 'pillar-light':
    case 'pillar-pest': case 'pillar-vpd': case 'pillar-train':
    case 'pillar-store': case 'pillar-auto': case 'pillar-flower':
      content = pillarArticle(slug, title, cat); break;
    // Support cultivation — each sub-topic gets unique content
    case 'support-nutrient': content = supportNutrient(slug, title); break;
    case 'support-seedling': case 'support-pest': case 'support-medium':
    case 'support-clone': case 'support-light': case 'support-vpd':
    case 'support-train': case 'support-flower': case 'support-sex':
    case 'support-yield': case 'support-watering': case 'support-harvest':
    case 'support-auto': case 'support-grow':
      content = supportCultivation(slug, title); break;
    // Strain reviews
    case 'strain': content = strainArticle(slug, title); break;
    // Environment — unique per climate type
    case 'environment': content = environmentArticle(slug, title); break;
    // State guides
    case 'state-guide': content = stateGuideArticle(slug, title); break;
    // Science articles — each topic-specific
    case 'terpene': content = terpeneArticle(slug, title); break;
    case 'cannabinoid': content = cannabinoidArticle(slug, title); break;
    case 'cbd-focus': case 'anxiety-article': content = anxietyArticle(slug, title); break;
    case 'sleep': content = sleepArticle(slug, title); break;
    case 'pain': content = painArticle(slug, title); break;
    case 'effects': case 'health': case 'therapeutic': content = painArticle(slug, title); break;
    // Lifestyle
    case 'edible': content = edibleArticle(slug, title); break;
    case 'accessory': content = accessoryArticle(slug, title); break;
    // Legal / news
    case 'legal': case 'news': case 'dispensary': content = legalArticle(slug, title); break;
    // Everything else
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
