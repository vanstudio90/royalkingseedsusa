// US Location Content Engine — Hub → State → City hierarchy
// RULE: "If this paragraph could exist on another page unchanged, do NOT include it."
// Deterministic hash-based content selection. No AI filler. Every sentence teaches or links.

export interface LocationPage {
  slug: string;
  title: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  pageType: 'hub' | 'state' | 'city' | 'legality';
  state?: string;
  city?: string;
}

// ── Helpers ──
function hash(s: string): number { let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i); return Math.abs(h); }
function pick<T>(slug: string, arr: T[], salt = ''): T { return arr[hash(slug + salt) % arr.length]; }
function pickN<T>(slug: string, arr: T[], n: number, salt = ''): T[] {
  const c = [...arr]; const h = hash(slug + salt);
  for (let i = c.length - 1; i > 0; i--) { const j = Math.abs((h * (i + 1)) % (i + 1)); [c[i], c[j]] = [c[j], c[i]]; }
  return c.slice(0, n);
}
function titleCase(s: string): string { return s.replace(/\b\w/g, c => c.toUpperCase()); }

// ── Link shorthand ──
function a(text: string, href: string): string { return `<a href="${href}">${text}</a>`; }

const CL = {
  fem: a('feminized seeds', '/product-category/feminized-seeds'),
  auto: a('autoflower seeds', '/product-category/autoflowering-seeds'),
  ind: a('indica strains', '/product-category/indica-seeds'),
  sat: a('sativa genetics', '/product-category/sativa-seeds'),
  cbd: a('CBD seeds', '/product-category/cbd-strains'),
  thc: a('high-THC seeds', '/product-category/high-tch-seeds'),
  kush: a('kush varieties', '/product-category/kush-seeds'),
  outdoor: a('outdoor strains', '/product-category/best-strains-for-outdoor-growing'),
  all: a('full seed catalog', '/product-category/shop-all-cannabis-seeds'),
  best: a('best sellers', '/product-category/best-seller'),
};

const BL = {
  germ: a('germination guide', '/blog/cannabis-seed-identification-and-feminization'),
  nutrients: a('nutrient deficiency guide', '/blog/cannabis-nutrient-deficiencies'),
  lights: a('grow light guide', '/blog/cannabis-growing-lights-and-phases'),
  autoGuide: a('autoflower growing guide', '/blog/autoflower-cannabis-seeds-and-growing-guide'),
  pest: a('pest management guide', '/blog/cannabis-pest-management'),
  vpd: a('VPD and humidity guide', '/blog/vpd-and-humidity-control-in-cannabis-cultivation'),
  harvest: a('harvest and trichome guide', '/blog/cannabis-trichomes-and-harvesting'),
  flower: a('flowering guide', '/blog/cannabis-flowering-and-budding'),
  train: a('training and topping guide', '/blog/cannabis-plant-pruning-and-topping'),
  terp: a('terpene guide', '/blog/pinene-and-terpenes-in-cannabis-and-aromatherapy'),
};

function locLink(text: string, slug: string): string { return a(text, `/seeds/usa/${slug}`); }
function stateLink(state: StateInfo): string { return a(`Buy seeds in ${state.name}`, `/seeds/usa/${state.slug}`); }
function cityLink(city: CityInfo, state: StateInfo): string { return a(`${city.name}, ${state.abbreviation}`, `/seeds/usa/${state.slug}/${city.slug}`); }
function hubLink(): string { return a('Buy Cannabis Seeds in the USA', '/seeds/usa'); }

// ── Types ──
type ClimateZone = 'hot-humid' | 'hot-dry' | 'temperate' | 'cold' | 'mild-coastal' | 'alpine' | 'subtropical' | 'tropical';
type LegalStatus = 'recreational' | 'medical' | 'decriminalized' | 'illegal';
type Region = 'northeast' | 'southeast' | 'midwest' | 'southwest' | 'west' | 'pacific-northwest';

interface CityInfo {
  name: string;
  slug: string;
  population?: string;
  note?: string;
}

interface StateInfo {
  name: string;
  abbreviation: string;
  slug: string;
  climate: ClimateZone;
  growingSeason: string;
  topStrainTypes: string[];
  frostFreeDays: number;
  cities: CityInfo[];
  legalStatus: LegalStatus;
  legalNote: string;
  region: Region;
  indoorOutdoor: string;
}

// ── Strain Pools by Climate ──
const STRAINS_BY_CLIMATE: Record<ClimateZone, string[]> = {
  'hot-humid': ['White Widow', 'Northern Lights', 'Blue Dream', 'Gorilla Glue', 'Durban Poison', 'Super Lemon Haze', 'Amnesia Haze', 'Critical Mass'],
  'hot-dry': ['Sour Diesel', 'Jack Herer', 'Super Silver Haze', 'Amnesia Haze', 'Afghan Kush', 'Durban Poison', 'Acapulco Gold', 'Tangie'],
  'cold': ['Northern Lights Auto', 'White Widow Auto', 'AK-47 Auto', 'Critical Mass', 'Blueberry', 'Early Girl', 'Gorilla Glue Auto', 'Quick One'],
  'temperate': ['Girl Scout Cookies', 'OG Kush', 'Gelato', 'Wedding Cake', 'Purple Kush', 'Zkittlez', 'MAC', 'Runtz'],
  'mild-coastal': ['Blue Dream', 'Granddaddy Purple', 'Zkittlez', 'Runtz', 'Trainwreck', 'OG Kush', 'Gelato', 'Sherbet'],
  'alpine': ['Northern Lights Auto', 'White Widow Auto', 'AK-47 Auto', 'Critical Mass', 'Blueberry', 'Early Girl', 'Purple Kush', 'Gorilla Glue Auto'],
  'subtropical': ['White Widow', 'Gorilla Glue', 'Northern Lights', 'Blue Dream', 'Durban Poison', 'Super Silver Haze', 'Sour Diesel', 'Trainwreck'],
  'tropical': ['Durban Poison', 'Super Silver Haze', 'Amnesia Haze', 'Jack Herer', 'Sour Diesel', 'White Widow', 'Gorilla Glue', 'Northern Lights'],
};

// ════════════════════════════════════════════════════════════
// STATE DATA — ALL 50 STATES
// ════════════════════════════════════════════════════════════

const STATE_DATA: Record<string, StateInfo> = {
  alabama: {
    name: 'Alabama', abbreviation: 'AL', slug: 'alabama',
    climate: 'hot-humid', growingSeason: 'Late March through early November, with 200-240 frost-free days depending on latitude. The Black Belt region sees heavy clay soils that retain moisture.',
    topStrainTypes: ['indica-dominant hybrids', 'mold-resistant sativas', 'autoflowers'],
    frostFreeDays: 220, legalStatus: 'medical', legalNote: 'Medical cannabis law passed in 2021. Patient cards available through the Alabama Medical Cannabis Commission. No home cultivation permitted. Recreational remains illegal.',
    region: 'southeast', indoorOutdoor: 'Outdoor grows thrive in southern Alabama; northern growers should consider light-dep greenhouses to manage September humidity.',
    cities: [
      { name: 'Birmingham', slug: 'birmingham', note: 'Zone 7b-8a, urban heat island adds 3-5 days to season' },
      { name: 'Montgomery', slug: 'montgomery', note: 'Zone 8a, long hot summers favor sativa-leaning hybrids' },
      { name: 'Huntsville', slug: 'huntsville', note: 'Zone 7a, cooler than southern AL, first frost by late October' },
      { name: 'Mobile', slug: 'mobile', note: 'Zone 8b-9a, high humidity demands mold-resistant genetics' },
      { name: 'Tuscaloosa', slug: 'tuscaloosa', note: 'Zone 7b, university town with expanding indoor grow community' },
    ],
  },
  alaska: {
    name: 'Alaska', abbreviation: 'AK', slug: 'alaska',
    climate: 'cold', growingSeason: 'June through September in Anchorage; shorter in interior and northern regions. Extended summer daylight (18-22 hours) creates massive vegetative growth.',
    topStrainTypes: ['autoflowers', 'fast-finishing indicas', 'cold-hardy genetics'],
    frostFreeDays: 115, legalStatus: 'recreational', legalNote: 'Recreational cannabis legal since 2015. Adults 21+ may possess up to 1 oz and cultivate up to 6 plants (3 flowering). Licensed dispensaries operate statewide.',
    region: 'west', indoorOutdoor: 'Indoor growing recommended for most of Alaska. Outdoor autoflowers work in the Matanuska Valley and Kenai Peninsula during summer.',
    cities: [
      { name: 'Anchorage', slug: 'anchorage', note: 'Zone 4b, extended summer daylight, short but intense growing season' },
      { name: 'Fairbanks', slug: 'fairbanks', note: 'Zone 2a, extreme cold but nearly 24hr summer light' },
      { name: 'Juneau', slug: 'juneau', note: 'Zone 7a maritime, wet and cool, indoor preferred' },
      { name: 'Wasilla', slug: 'wasilla', note: 'Zone 4a, Matanuska Valley famous for oversized vegetables and cannabis' },
    ],
  },
  arizona: {
    name: 'Arizona', abbreviation: 'AZ', slug: 'arizona',
    climate: 'hot-dry', growingSeason: 'February through November in low desert; May through October at elevation. Phoenix averages 300+ frost-free days but summer temps above 110°F stress most cultivars.',
    topStrainTypes: ['heat-tolerant sativas', 'drought-resistant indicas', 'autoflowers'],
    frostFreeDays: 308, legalStatus: 'recreational', legalNote: 'Proposition 207 legalized recreational cannabis in 2020. Adults 21+ may possess up to 1 oz (5g concentrate) and grow up to 6 plants at home.',
    region: 'southwest', indoorOutdoor: 'Indoor growing with AC is standard in the low desert. Higher elevations (Flagstaff, Prescott) allow outdoor grows with shorter seasons.',
    cities: [
      { name: 'Phoenix', slug: 'phoenix', note: 'Zone 9b-10a, extreme heat requires shade cloth and drip irrigation' },
      { name: 'Tucson', slug: 'tucson', note: 'Zone 9a, slightly cooler than Phoenix, good outdoor potential with water management' },
      { name: 'Flagstaff', slug: 'flagstaff', note: 'Zone 5b, 7000ft elevation, cold winters but excellent summer grows' },
      { name: 'Scottsdale', slug: 'scottsdale', note: 'Zone 9b, premium indoor grow scene' },
      { name: 'Mesa', slug: 'mesa', note: 'Zone 9b, similar to Phoenix heat profile' },
    ],
  },
  arkansas: {
    name: 'Arkansas', abbreviation: 'AR', slug: 'arkansas',
    climate: 'hot-humid', growingSeason: 'April through October. The Ozark Plateau sees cooler temperatures and earlier frosts than the Mississippi Delta lowlands.',
    topStrainTypes: ['mold-resistant hybrids', 'indica-dominant strains', 'autoflowers'],
    frostFreeDays: 210, legalStatus: 'medical', legalNote: 'Medical cannabis legal since 2016 (Issue 6). Qualifying conditions include chronic pain, PTSD, and cancer. No home cultivation allowed. Recreational efforts ongoing.',
    region: 'southeast', indoorOutdoor: 'Outdoor growing works well in the river valleys. Ozark growers should plan for earlier harvests or use light-dep techniques.',
    cities: [
      { name: 'Little Rock', slug: 'little-rock', note: 'Zone 7b-8a, central location with moderate growing conditions' },
      { name: 'Fayetteville', slug: 'fayetteville', note: 'Zone 6b-7a, Ozark region, cooler and drier than delta' },
      { name: 'Fort Smith', slug: 'fort-smith', note: 'Zone 7b, river valley location with good drainage' },
      { name: 'Bentonville', slug: 'bentonville', note: 'Zone 6b, northwest AR, growing tech scene' },
    ],
  },
  california: {
    name: 'California', abbreviation: 'CA', slug: 'california',
    climate: 'mild-coastal', growingSeason: 'Year-round in Southern California; March through November in Northern California. The Emerald Triangle (Humboldt, Mendocino, Trinity) is the historic heart of US outdoor cannabis.',
    topStrainTypes: ['sativa-dominant hybrids', 'OG lineage', 'exotic genetics'],
    frostFreeDays: 290, legalStatus: 'recreational', legalNote: 'Adult-use legal since 2016 (Prop 64). Adults 21+ may possess up to 28.5g and cultivate 6 plants. Licensed dispensaries statewide. Largest legal cannabis market globally.',
    region: 'west', indoorOutdoor: 'Both indoor and outdoor excel in California. Coastal grows benefit from fog-moderated temperatures; Central Valley offers intense sun and heat for massive outdoor plants.',
    cities: [
      { name: 'Los Angeles', slug: 'los-angeles', note: 'Zone 10a-10b, nearly year-round outdoor capability' },
      { name: 'San Francisco', slug: 'san-francisco', note: 'Zone 10b, fog and cool temps favor indica-leaning genetics' },
      { name: 'San Diego', slug: 'san-diego', note: 'Zone 10b-11a, ideal outdoor climate, minimal pest pressure' },
      { name: 'Sacramento', slug: 'sacramento', note: 'Zone 9b, Central Valley heat, great for sativas' },
      { name: 'Oakland', slug: 'oakland', note: 'Zone 10a, historic cannabis culture, equity licensing programs' },
    ],
  },
  colorado: {
    name: 'Colorado', abbreviation: 'CO', slug: 'colorado',
    climate: 'alpine', growingSeason: 'May through September at elevation; April through October on the Eastern Plains. UV intensity at altitude accelerates trichome production but also increases heat stress risk.',
    topStrainTypes: ['cold-hardy indicas', 'autoflowers', 'high-altitude genetics'],
    frostFreeDays: 155, legalStatus: 'recreational', legalNote: 'First state to legalize recreational cannabis (Amendment 64, 2012). Adults 21+ may possess up to 2 oz and grow 6 plants (3 flowering). Mature market with extensive dispensary network.',
    region: 'west', indoorOutdoor: 'Indoor growing dominates Front Range cities. Outdoor grows succeed on the Western Slope and Eastern Plains with autoflowers or early-finishing photoperiods.',
    cities: [
      { name: 'Denver', slug: 'denver', note: 'Zone 5b-6a, 5280ft elevation, intense UV, dry air' },
      { name: 'Colorado Springs', slug: 'colorado-springs', note: 'Zone 5b, 6035ft elevation, conservative local regulations' },
      { name: 'Boulder', slug: 'boulder', note: 'Zone 6a, 5430ft, established cannabis culture' },
      { name: 'Fort Collins', slug: 'fort-collins', note: 'Zone 5b, northern CO, first frost by late September' },
      { name: 'Pueblo', slug: 'pueblo', note: 'Zone 6b-7a, warmer than Denver, good outdoor potential' },
    ],
  },
  connecticut: {
    name: 'Connecticut', abbreviation: 'CT', slug: 'connecticut',
    climate: 'temperate', growingSeason: 'May through October. Coastal areas (New Haven, Stamford) get 10-15 extra frost-free days compared to inland Hartford.',
    topStrainTypes: ['balanced hybrids', 'fast-finishing indicas', 'autoflowers'],
    frostFreeDays: 175, legalStatus: 'recreational', legalNote: 'Recreational cannabis legal since 2021. Adults 21+ may possess up to 1.5 oz and grow up to 6 plants (3 mature) starting July 2023. Dispensary sales active.',
    region: 'northeast', indoorOutdoor: 'Indoor growing is the primary method. Outdoor grows succeed along the coast with mold-resistant genetics harvested before October rains.',
    cities: [
      { name: 'Hartford', slug: 'hartford', note: 'Zone 6b, Connecticut River Valley, moderate growing season' },
      { name: 'New Haven', slug: 'new-haven', note: 'Zone 7a, coastal buffer extends season by 2 weeks' },
      { name: 'Stamford', slug: 'stamford', note: 'Zone 7a, Long Island Sound moderates temperatures' },
      { name: 'Bridgeport', slug: 'bridgeport', note: 'Zone 7a, coastal humidity needs airflow management' },
    ],
  },
  delaware: {
    name: 'Delaware', abbreviation: 'DE', slug: 'delaware',
    climate: 'temperate', growingSeason: 'April through October. Small state with relatively uniform climate, though Sussex County in the south gets 15-20 more frost-free days than New Castle County.',
    topStrainTypes: ['hybrid strains', 'autoflowers', 'mold-resistant varieties'],
    frostFreeDays: 195, legalStatus: 'recreational', legalNote: 'Recreational cannabis signed into law in 2023. Adults 21+ may possess up to 1 oz. Home cultivation of up to 6 plants permitted. Dispensary framework expanding.',
    region: 'northeast', indoorOutdoor: 'Both viable. Outdoor grows work well along the coastal plain. Indoor setups recommended for Sussex County growers dealing with summer humidity.',
    cities: [
      { name: 'Wilmington', slug: 'wilmington', note: 'Zone 7a, northern DE, Brandywine Valley microclimate' },
      { name: 'Dover', slug: 'dover', note: 'Zone 7a-7b, central location, flat terrain' },
      { name: 'Newark', slug: 'newark', note: 'Zone 7a, university town near PA border' },
    ],
  },
  florida: {
    name: 'Florida', abbreviation: 'FL', slug: 'florida',
    climate: 'subtropical', growingSeason: 'Year-round in South Florida; March through November in the Panhandle. Hurricane season (June-November) is the primary outdoor risk.',
    topStrainTypes: ['mold-resistant strains', 'heat-tolerant hybrids', 'sativa-dominant genetics'],
    frostFreeDays: 300, legalStatus: 'medical', legalNote: 'Medical cannabis legal since 2016 (Amendment 2). Over 800,000 active patient cards. Recreational legalization narrowly failed in 2024 (Amendment 3 got 57%, needed 60%). Home cultivation not permitted.',
    region: 'southeast', indoorOutdoor: 'Indoor growing with dehumidification is the reliable path. Outdoor grows produce enormous plants but require constant mold vigilance during the wet season.',
    cities: [
      { name: 'Miami', slug: 'miami', note: 'Zone 10b-11a, tropical, year-round growing with humidity challenges' },
      { name: 'Orlando', slug: 'orlando', note: 'Zone 9b, central FL, hot and humid summers' },
      { name: 'Tampa', slug: 'tampa', note: 'Zone 9b-10a, Gulf Coast humidity, good indoor market' },
      { name: 'Jacksonville', slug: 'jacksonville', note: 'Zone 9a, northeast FL, slightly cooler winters' },
      { name: 'Fort Lauderdale', slug: 'fort-lauderdale', note: 'Zone 10b, tropical growing conditions year-round' },
    ],
  },
  georgia: {
    name: 'Georgia', abbreviation: 'GA', slug: 'georgia',
    climate: 'hot-humid', growingSeason: 'March through November in southern Georgia; April through October in the Piedmont and mountains. The Vidalia onion region of southeast GA has some of the longest seasons in the eastern US.',
    topStrainTypes: ['mold-resistant hybrids', 'heat-tolerant indicas', 'autoflowers'],
    frostFreeDays: 230, legalStatus: 'medical', legalNote: 'Limited medical cannabis access (low-THC oil only, under 5% THC) since 2015. No flower, no home cultivation. Among the most restrictive medical programs in the US.',
    region: 'southeast', indoorOutdoor: 'Indoor growing is strongly recommended given legal restrictions and extreme summer humidity. Light-dep greenhouses work in the mountains.',
    cities: [
      { name: 'Atlanta', slug: 'atlanta', note: 'Zone 7b-8a, urban heat island, decriminalized possession under 1 oz' },
      { name: 'Savannah', slug: 'savannah', note: 'Zone 8b-9a, coastal heat and humidity, long season' },
      { name: 'Augusta', slug: 'augusta', note: 'Zone 8a, fall river area, moderate conditions' },
      { name: 'Athens', slug: 'athens', note: 'Zone 7b, Piedmont region, university town' },
    ],
  },
  hawaii: {
    name: 'Hawaii', abbreviation: 'HI', slug: 'hawaii',
    climate: 'tropical', growingSeason: 'Year-round. Trade winds moderate temperatures but create micro-climates across islands. Windward sides get 2-3x the rainfall of leeward sides.',
    topStrainTypes: ['sativa-dominant strains', 'landrace genetics', 'tropical-adapted hybrids'],
    frostFreeDays: 365, legalStatus: 'medical', legalNote: 'Medical cannabis legal since 2000. Patients may grow up to 10 plants. Recreational bill introduced but not yet passed as of 2026. Dispensaries limited compared to mainland states.',
    region: 'west', indoorOutdoor: 'Outdoor growing is legendary in Hawaii. Leeward locations produce the best results. Windward sides require covered structures to manage rainfall.',
    cities: [
      { name: 'Honolulu', slug: 'honolulu', note: 'Zone 12a, Oahu, urban setting with robust dispensary network' },
      { name: 'Hilo', slug: 'hilo', note: 'Zone 11b, Big Island windward side, very wet — greenhouse recommended' },
      { name: 'Kailua-Kona', slug: 'kailua-kona', note: 'Zone 12a, Big Island leeward, dry and sunny — ideal outdoor' },
      { name: 'Maui', slug: 'maui', note: 'Zone 11b-12a, diverse microclimates from coast to volcano' },
    ],
  },
  idaho: {
    name: 'Idaho', abbreviation: 'ID', slug: 'idaho',
    climate: 'cold', growingSeason: 'May through September. The Snake River Plain has the longest season; northern Idaho and mountain valleys see frost as early as mid-September.',
    topStrainTypes: ['autoflowers', 'fast-finishing indicas', 'cold-hardy genetics'],
    frostFreeDays: 140, legalStatus: 'illegal', legalNote: 'Cannabis remains fully illegal in Idaho — no medical or recreational programs. The state constitution was amended in 2022 to make legalization harder. Seeds may be purchased as novelty souvenirs.',
    region: 'west', indoorOutdoor: 'Indoor growing is the only practical option given the legal environment and short outdoor season.',
    cities: [
      { name: 'Boise', slug: 'boise', note: 'Zone 6b-7a, Treasure Valley, dry continental climate' },
      { name: 'Idaho Falls', slug: 'idaho-falls', note: 'Zone 5b, high desert, cold winters' },
      { name: 'Nampa', slug: 'nampa', note: 'Zone 7a, Treasure Valley, growing metro area' },
      { name: 'Meridian', slug: 'meridian', note: 'Zone 6b-7a, suburban Boise, fastest-growing city in ID' },
    ],
  },
  illinois: {
    name: 'Illinois', abbreviation: 'IL', slug: 'illinois',
    climate: 'temperate', growingSeason: 'May through October in northern Illinois; April through October in southern Illinois. The state spans nearly 400 miles north to south with significant climate variation.',
    topStrainTypes: ['balanced hybrids', 'indica-dominant strains', 'autoflowers'],
    frostFreeDays: 185, legalStatus: 'recreational', legalNote: 'Recreational cannabis legal since January 2020 (Cannabis Regulation and Tax Act). Adults 21+ may possess up to 30g. Home cultivation allowed only for medical patients (5 plants).',
    region: 'midwest', indoorOutdoor: 'Indoor growing dominates due to legal limits on home cultivation. Outdoor grows succeed in southern Illinois with early-finishing genetics.',
    cities: [
      { name: 'Chicago', slug: 'chicago', note: 'Zone 5b-6a, Lake Michigan moderates temps, strong dispensary network' },
      { name: 'Springfield', slug: 'springfield', note: 'Zone 5b-6a, central IL, state capital' },
      { name: 'Peoria', slug: 'peoria', note: 'Zone 5b, Illinois River valley, moderate growing season' },
      { name: 'Rockford', slug: 'rockford', note: 'Zone 5a-5b, northern IL, shorter season' },
    ],
  },
  indiana: {
    name: 'Indiana', abbreviation: 'IN', slug: 'indiana',
    climate: 'temperate', growingSeason: 'May through October. Southern Indiana (Evansville area) gets 20+ more frost-free days than the northern tier.',
    topStrainTypes: ['fast-finishing hybrids', 'autoflowers', 'indica-dominant genetics'],
    frostFreeDays: 180, legalStatus: 'illegal', legalNote: 'Cannabis remains fully illegal in Indiana — no medical or recreational programs. CBD products with <0.3% THC are legal. Seeds may be purchased as novelty souvenirs.',
    region: 'midwest', indoorOutdoor: 'Indoor growing is the only practical path given legal restrictions.',
    cities: [
      { name: 'Indianapolis', slug: 'indianapolis', note: 'Zone 5b-6a, central IN, urban core' },
      { name: 'Fort Wayne', slug: 'fort-wayne', note: 'Zone 5b, northeast IN, colder winters' },
      { name: 'Evansville', slug: 'evansville', note: 'Zone 6b-7a, Ohio River valley, longest IN growing season' },
      { name: 'Bloomington', slug: 'bloomington', note: 'Zone 6a, university town, southern IN hills' },
    ],
  },
  iowa: {
    name: 'Iowa', abbreviation: 'IA', slug: 'iowa',
    climate: 'cold', growingSeason: 'May through September. The state\'s rich prairie soil is excellent for cannabis but the short season limits outdoor photoperiod grows.',
    topStrainTypes: ['autoflowers', 'fast-finishing indicas', 'cold-hardy hybrids'],
    frostFreeDays: 160, legalStatus: 'medical', legalNote: 'Limited medical cannabis program since 2014. Low THC cap (4.5g total THC in 90 days). No home cultivation. Recreational remains illegal.',
    region: 'midwest', indoorOutdoor: 'Indoor growing strongly recommended. The rich soil would support excellent outdoor grows, but season length and legal restrictions make indoor the practical choice.',
    cities: [
      { name: 'Des Moines', slug: 'des-moines', note: 'Zone 5a-5b, central IA, state capital' },
      { name: 'Cedar Rapids', slug: 'cedar-rapids', note: 'Zone 5a, eastern IA, Cedar River corridor' },
      { name: 'Iowa City', slug: 'iowa-city', note: 'Zone 5a-5b, university town, progressive politics' },
      { name: 'Davenport', slug: 'davenport', note: 'Zone 5b, Quad Cities, Mississippi River influence' },
    ],
  },
  kansas: {
    name: 'Kansas', abbreviation: 'KS', slug: 'kansas',
    climate: 'temperate', growingSeason: 'April through October. Western Kansas is drier and windier; eastern Kansas has more moderate conditions with better rainfall.',
    topStrainTypes: ['wind-resistant indicas', 'autoflowers', 'hardy hybrids'],
    frostFreeDays: 190, legalStatus: 'illegal', legalNote: 'Cannabis remains fully illegal in Kansas — no medical or recreational programs. Decriminalization bills have been introduced but not passed. Seeds may be purchased as novelty souvenirs.',
    region: 'midwest', indoorOutdoor: 'Indoor growing is the only practical option given full prohibition.',
    cities: [
      { name: 'Wichita', slug: 'wichita', note: 'Zone 6b, south-central KS, moderate growing conditions' },
      { name: 'Kansas City', slug: 'kansas-city', note: 'Zone 6a, eastern KS, borders legal Missouri' },
      { name: 'Topeka', slug: 'topeka', note: 'Zone 6a, state capital, Kansas River valley' },
      { name: 'Lawrence', slug: 'lawrence', note: 'Zone 6a, university town, 40 min from MO dispensaries' },
    ],
  },
  kentucky: {
    name: 'Kentucky', abbreviation: 'KY', slug: 'kentucky',
    climate: 'temperate', growingSeason: 'April through October. The Bluegrass Region\'s limestone-rich soil and moderate climate historically supported hemp cultivation — Daniel Boone grew it here.',
    topStrainTypes: ['balanced hybrids', 'indica-dominant strains', 'CBD genetics'],
    frostFreeDays: 195, legalStatus: 'medical', legalNote: 'Medical cannabis signed into law in 2023, with dispensary sales beginning January 2025. Qualifying conditions include chronic pain and PTSD. No home cultivation permitted.',
    region: 'southeast', indoorOutdoor: 'Both viable. Kentucky\'s climate and soil are well-suited for outdoor cannabis. Indoor growing offers more control for medical-grade production.',
    cities: [
      { name: 'Louisville', slug: 'louisville', note: 'Zone 6b-7a, Ohio River valley, moderate humidity' },
      { name: 'Lexington', slug: 'lexington', note: 'Zone 6b, Bluegrass Region, excellent soil for cannabis' },
      { name: 'Bowling Green', slug: 'bowling-green', note: 'Zone 6b-7a, southern KY, longer season' },
      { name: 'Covington', slug: 'covington', note: 'Zone 6b, Cincinnati metro area, northern KY' },
    ],
  },
  louisiana: {
    name: 'Louisiana', abbreviation: 'LA', slug: 'louisiana',
    climate: 'hot-humid', growingSeason: 'March through November. Gulf Coast humidity is relentless — mold and botrytis are the primary outdoor threats.',
    topStrainTypes: ['mold-resistant strains', 'fast-finishing indicas', 'autoflowers'],
    frostFreeDays: 260, legalStatus: 'medical', legalNote: 'Medical cannabis legal since 2015 with expanding product options. Flower became available in 2022. Home cultivation not permitted. Recreational bill under discussion.',
    region: 'southeast', indoorOutdoor: 'Indoor growing with strong dehumidification is the standard recommendation. Outdoor grows can produce massive yields but require constant mold monitoring.',
    cities: [
      { name: 'New Orleans', slug: 'new-orleans', note: 'Zone 9a-9b, below sea level, extreme humidity' },
      { name: 'Baton Rouge', slug: 'baton-rouge', note: 'Zone 8b-9a, state capital, Mississippi River influence' },
      { name: 'Shreveport', slug: 'shreveport', note: 'Zone 8a, northwest LA, less humid than south' },
      { name: 'Lafayette', slug: 'lafayette', note: 'Zone 9a, Cajun country, hot and wet' },
    ],
  },
  maine: {
    name: 'Maine', abbreviation: 'ME', slug: 'maine',
    climate: 'cold', growingSeason: 'May through September in most areas. Coastal southern Maine gets 2-3 extra weeks. The growing community is tight-knit and highly skilled.',
    topStrainTypes: ['cold-hardy indicas', 'autoflowers', 'fast-finishing hybrids'],
    frostFreeDays: 145, legalStatus: 'recreational', legalNote: 'Recreational cannabis legal since 2016 (Question 1). Adults 21+ may possess up to 2.5 oz and cultivate up to 3 mature plants. Thriving craft cannabis market.',
    region: 'northeast', indoorOutdoor: 'Indoor growing dominates due to the short season. Greenhouse extends work along the coast. Autoflowers are the outdoor go-to for northern Maine.',
    cities: [
      { name: 'Portland', slug: 'portland', note: 'Zone 5b-6a, coastal, strong dispensary and craft grow scene' },
      { name: 'Bangor', slug: 'bangor', note: 'Zone 5a, central ME, shorter season than coast' },
      { name: 'Lewiston', slug: 'lewiston', note: 'Zone 5a-5b, Androscoggin River valley' },
      { name: 'Augusta', slug: 'augusta', note: 'Zone 5a, state capital, Kennebec Valley' },
    ],
  },
  maryland: {
    name: 'Maryland', abbreviation: 'MD', slug: 'maryland',
    climate: 'temperate', growingSeason: 'April through October. The Chesapeake Bay moderates eastern shore temperatures. Western Maryland\'s mountains see significantly shorter seasons.',
    topStrainTypes: ['balanced hybrids', 'indica-dominant strains', 'autoflowers'],
    frostFreeDays: 200, legalStatus: 'recreational', legalNote: 'Recreational cannabis legal since July 2023 (Question 4). Adults 21+ may possess up to 1.5 oz and grow 2 plants. Dispensary network well-established from medical program.',
    region: 'northeast', indoorOutdoor: 'Both viable. The temperate climate supports outdoor grows from the Eastern Shore to the Piedmont. Indoor setups are popular in the Baltimore-DC corridor.',
    cities: [
      { name: 'Baltimore', slug: 'baltimore', note: 'Zone 7a-7b, Chesapeake Bay influence, established cannabis market' },
      { name: 'Annapolis', slug: 'annapolis', note: 'Zone 7b, coastal moderation, maritime influence' },
      { name: 'Frederick', slug: 'frederick', note: 'Zone 7a, western MD foothills, slightly cooler' },
      { name: 'Rockville', slug: 'rockville', note: 'Zone 7a, DC suburbs, Montgomery County' },
    ],
  },
  massachusetts: {
    name: 'Massachusetts', abbreviation: 'MA', slug: 'massachusetts',
    climate: 'temperate', growingSeason: 'May through October. Cape Cod and the Islands get additional frost-free days. The Berkshires in western MA have significantly shorter seasons.',
    topStrainTypes: ['balanced hybrids', 'fast-finishing indicas', 'autoflowers'],
    frostFreeDays: 175, legalStatus: 'recreational', legalNote: 'Recreational cannabis legal since 2016 (Question 4). Adults 21+ may possess up to 1 oz in public, 10 oz at home, and cultivate 6 plants (12 per household). Mature dispensary market.',
    region: 'northeast', indoorOutdoor: 'Indoor growing is standard. Outdoor grows succeed in eastern MA with early-finishing genetics. Cape Cod\'s mild fall extends the outdoor window.',
    cities: [
      { name: 'Boston', slug: 'boston', note: 'Zone 6b-7a, harbor moderates temps, dense dispensary network' },
      { name: 'Worcester', slug: 'worcester', note: 'Zone 6a, central MA, slightly cooler than coast' },
      { name: 'Springfield', slug: 'springfield', note: 'Zone 6a-6b, Connecticut River valley, affordable grow space' },
      { name: 'Cambridge', slug: 'cambridge', note: 'Zone 6b, research-oriented cannabis community' },
    ],
  },
  michigan: {
    name: 'Michigan', abbreviation: 'MI', slug: 'michigan',
    climate: 'cold', growingSeason: 'May through September in the Upper Peninsula; May through October in southern Michigan. Lake effect adds humidity and moderates coastal temps.',
    topStrainTypes: ['cold-hardy indicas', 'autoflowers', 'mold-resistant hybrids'],
    frostFreeDays: 160, legalStatus: 'recreational', legalNote: 'Recreational cannabis legal since 2018 (Proposal 1). Adults 21+ may possess up to 2.5 oz and grow up to 12 plants. One of the most permissive home grow states.',
    region: 'midwest', indoorOutdoor: 'Indoor growing is the primary method. Outdoor grows work in southern MI and the lakeshore fruit belt with mold-resistant genetics.',
    cities: [
      { name: 'Detroit', slug: 'detroit', note: 'Zone 6a-6b, Great Lakes influence, expanding cannabis industry' },
      { name: 'Grand Rapids', slug: 'grand-rapids', note: 'Zone 5b-6a, West Michigan, lake effect humidity' },
      { name: 'Ann Arbor', slug: 'ann-arbor', note: 'Zone 6a, pioneer of cannabis decriminalization (1972)' },
      { name: 'Lansing', slug: 'lansing', note: 'Zone 5b-6a, state capital, competitive market' },
      { name: 'Traverse City', slug: 'traverse-city', note: 'Zone 5b, wine country microclimate, tourist market' },
    ],
  },
  minnesota: {
    name: 'Minnesota', abbreviation: 'MN', slug: 'minnesota',
    climate: 'cold', growingSeason: 'May through September. Twin Cities average 160 frost-free days; northern MN gets as few as 100. Rich soil but brutal winters.',
    topStrainTypes: ['autoflowers', 'fast-finishing indicas', 'cold-hardy genetics'],
    frostFreeDays: 155, legalStatus: 'recreational', legalNote: 'Recreational cannabis signed into law in May 2023. Adults 21+ may possess up to 2 oz and grow 8 plants (4 mature). Dispensary sales rolling out through 2025.',
    region: 'midwest', indoorOutdoor: 'Indoor growing is the standard. Outdoor autoflowers can finish in the Twin Cities metro area. Northern MN grows need greenhouse protection.',
    cities: [
      { name: 'Minneapolis', slug: 'minneapolis', note: 'Zone 4b, urban heat island helps, strong grow community' },
      { name: 'Saint Paul', slug: 'saint-paul', note: 'Zone 4b, Twin Cities east side, dispensary hub' },
      { name: 'Duluth', slug: 'duluth', note: 'Zone 4a, Lake Superior influence, challenging outdoor season' },
      { name: 'Rochester', slug: 'rochester', note: 'Zone 4b, southern MN, slightly longer season' },
    ],
  },
  mississippi: {
    name: 'Mississippi', abbreviation: 'MS', slug: 'mississippi',
    climate: 'hot-humid', growingSeason: 'March through November. The Delta region is flat and humid; the Pine Belt in the south has sandy, well-drained soil.',
    topStrainTypes: ['mold-resistant strains', 'heat-tolerant genetics', 'autoflowers'],
    frostFreeDays: 240, legalStatus: 'medical', legalNote: 'Medical cannabis legal since 2022 (Initiative 65, then SB 2095). Program allows flower with qualifying conditions. No home cultivation. Recreational remains illegal.',
    region: 'southeast', indoorOutdoor: 'Indoor growing with climate control recommended due to extreme humidity. Outdoor grows require mold-resistant genetics and aggressive airflow management.',
    cities: [
      { name: 'Jackson', slug: 'jackson', note: 'Zone 8a, state capital, central MS' },
      { name: 'Gulfport', slug: 'gulfport', note: 'Zone 8b-9a, Gulf Coast, extreme humidity' },
      { name: 'Hattiesburg', slug: 'hattiesburg', note: 'Zone 8a-8b, Pine Belt, better drainage than Delta' },
      { name: 'Tupelo', slug: 'tupelo', note: 'Zone 7b, northeast MS, slightly cooler' },
    ],
  },
  missouri: {
    name: 'Missouri', abbreviation: 'MO', slug: 'missouri',
    climate: 'temperate', growingSeason: 'April through October. The Ozarks provide micro-climates with good drainage; river valleys along the Missouri and Mississippi offer rich alluvial soil.',
    topStrainTypes: ['balanced hybrids', 'indica-dominant strains', 'autoflowers'],
    frostFreeDays: 195, legalStatus: 'recreational', legalNote: 'Recreational cannabis legal since December 2022 (Amendment 3). Adults 21+ may possess up to 3 oz and cultivate 6 flowering plants. Fast-growing market.',
    region: 'midwest', indoorOutdoor: 'Both work well. Outdoor grows thrive in the southern Ozarks and river valleys. Indoor setups dominate in KC and STL metro areas.',
    cities: [
      { name: 'Kansas City', slug: 'kansas-city', note: 'Zone 6a, western MO, strong dispensary market bordering KS' },
      { name: 'St. Louis', slug: 'st-louis', note: 'Zone 6b-7a, Mississippi River influence, growing industry' },
      { name: 'Springfield', slug: 'springfield', note: 'Zone 6b, Ozark Plateau, moderate conditions' },
      { name: 'Columbia', slug: 'columbia', note: 'Zone 6a, university town, central MO' },
    ],
  },
  montana: {
    name: 'Montana', abbreviation: 'MT', slug: 'montana',
    climate: 'cold', growingSeason: 'May through September. Eastern Montana is drier with more frost-free days; western Montana\'s mountain valleys see frost as early as mid-September.',
    topStrainTypes: ['autoflowers', 'fast-finishing indicas', 'cold-hardy genetics'],
    frostFreeDays: 130, legalStatus: 'recreational', legalNote: 'Recreational cannabis legal since 2021 (I-190). Adults 21+ may possess up to 1 oz and grow up to 4 mature plants. Dispensaries concentrated in western MT.',
    region: 'west', indoorOutdoor: 'Indoor growing is the reliable choice. Outdoor autoflowers work in the Yellowstone and Flathead valleys during peak summer.',
    cities: [
      { name: 'Billings', slug: 'billings', note: 'Zone 4b-5a, eastern MT, longest growing season in state' },
      { name: 'Missoula', slug: 'missoula', note: 'Zone 5b-6a, western MT valley, active cannabis community' },
      { name: 'Great Falls', slug: 'great-falls', note: 'Zone 4b, central MT, windy and dry' },
      { name: 'Bozeman', slug: 'bozeman', note: 'Zone 4b, Gallatin Valley, fast-growing market' },
    ],
  },
  nebraska: {
    name: 'Nebraska', abbreviation: 'NE', slug: 'nebraska',
    climate: 'cold', growingSeason: 'May through September. The Sandhills region has sandy, fast-draining soil; eastern Nebraska has richer prairie loam.',
    topStrainTypes: ['autoflowers', 'fast-finishing indicas', 'wind-resistant genetics'],
    frostFreeDays: 160, legalStatus: 'medical', legalNote: 'Medical cannabis initiative passed in November 2024. Program implementation underway. No home cultivation. Recreational remains illegal.',
    region: 'midwest', indoorOutdoor: 'Indoor growing is the standard due to harsh winters and evolving legal landscape.',
    cities: [
      { name: 'Omaha', slug: 'omaha', note: 'Zone 5b, eastern NE, Missouri River influence' },
      { name: 'Lincoln', slug: 'lincoln', note: 'Zone 5b, state capital, university town' },
      { name: 'Grand Island', slug: 'grand-island', note: 'Zone 5a, central NE, Platte River valley' },
    ],
  },
  nevada: {
    name: 'Nevada', abbreviation: 'NV', slug: 'nevada',
    climate: 'hot-dry', growingSeason: 'March through November in Las Vegas; May through September at elevation. Desert air means huge day-night temperature swings — 30-40°F differentials are common.',
    topStrainTypes: ['heat-tolerant sativas', 'desert-adapted genetics', 'indoor hybrids'],
    frostFreeDays: 270, legalStatus: 'recreational', legalNote: 'Recreational cannabis legal since 2017 (Question 2). Adults 21+ may possess up to 1 oz and grow up to 6 plants (if more than 25 miles from a dispensary). Major tourism-driven market.',
    region: 'west', indoorOutdoor: 'Indoor growing with climate control is standard in Las Vegas. Northern NV (Reno) has a shorter season but lower humidity.',
    cities: [
      { name: 'Las Vegas', slug: 'las-vegas', note: 'Zone 9a, extreme desert heat, massive dispensary market' },
      { name: 'Reno', slug: 'reno', note: 'Zone 6b-7a, high desert, cooler than Vegas' },
      { name: 'Henderson', slug: 'henderson', note: 'Zone 9a, Las Vegas suburb, similar climate' },
      { name: 'Carson City', slug: 'carson-city', note: 'Zone 6b, state capital, mountain influence' },
    ],
  },
  'new-hampshire': {
    name: 'New Hampshire', abbreviation: 'NH', slug: 'new-hampshire',
    climate: 'cold', growingSeason: 'May through September. The White Mountains create dramatic climate variation — Portsmouth on the coast is Zone 6a while Mt. Washington is subarctic.',
    topStrainTypes: ['autoflowers', 'cold-hardy indicas', 'fast-finishing genetics'],
    frostFreeDays: 145, legalStatus: 'decriminalized', legalNote: 'Cannabis decriminalized (under 3/4 oz is a violation, not criminal). Medical cannabis legal since 2013. Recreational legalization bills have passed the House multiple times but stalled in the Senate.',
    region: 'northeast', indoorOutdoor: 'Indoor growing is the standard approach. Outdoor autoflowers can finish in the Connecticut River valley and southern tier.',
    cities: [
      { name: 'Manchester', slug: 'manchester', note: 'Zone 5b, southern NH, largest city' },
      { name: 'Nashua', slug: 'nashua', note: 'Zone 5b-6a, MA border, commuter city' },
      { name: 'Concord', slug: 'concord', note: 'Zone 5b, state capital, Merrimack River' },
      { name: 'Portsmouth', slug: 'portsmouth', note: 'Zone 6a, seacoast, maritime influence' },
    ],
  },
  'new-jersey': {
    name: 'New Jersey', abbreviation: 'NJ', slug: 'new-jersey',
    climate: 'temperate', growingSeason: 'April through October. The Pine Barrens have sandy, acidic soil; the Piedmont has richer clay loam. Shore areas get extended frost-free periods.',
    topStrainTypes: ['balanced hybrids', 'indica-dominant strains', 'autoflowers'],
    frostFreeDays: 200, legalStatus: 'recreational', legalNote: 'Recreational cannabis legal since 2021 (Public Question 1). Adults 21+ may possess up to 6 oz. Home cultivation is NOT permitted — one of few rec states with this restriction.',
    region: 'northeast', indoorOutdoor: 'Indoor growing is the practical choice since home grow is not permitted. Seeds are sold as novelty items.',
    cities: [
      { name: 'Newark', slug: 'newark', note: 'Zone 7a, urban core, dispensary hub' },
      { name: 'Jersey City', slug: 'jersey-city', note: 'Zone 7a, Hudson waterfront, NYC-adjacent market' },
      { name: 'Trenton', slug: 'trenton', note: 'Zone 7a, state capital, Delaware River' },
      { name: 'Atlantic City', slug: 'atlantic-city', note: 'Zone 7b, shore influence, tourism market' },
    ],
  },
  'new-mexico': {
    name: 'New Mexico', abbreviation: 'NM', slug: 'new-mexico',
    climate: 'hot-dry', growingSeason: 'April through October in the Rio Grande valley; shorter at elevation. Intense sunlight (300+ sunny days in many areas) drives aggressive trichome production.',
    topStrainTypes: ['heat-tolerant sativas', 'drought-resistant genetics', 'landrace influences'],
    frostFreeDays: 210, legalStatus: 'recreational', legalNote: 'Recreational cannabis legal since June 2021 (Cannabis Regulation Act). Adults 21+ may possess up to 2 oz and grow up to 12 plants (6 mature). Active craft market.',
    region: 'southwest', indoorOutdoor: 'Both work well. The Rio Grande valley is excellent for outdoor growing. Indoor setups at elevation benefit from naturally low humidity.',
    cities: [
      { name: 'Albuquerque', slug: 'albuquerque', note: 'Zone 7a, Rio Grande valley, 5312ft elevation' },
      { name: 'Santa Fe', slug: 'santa-fe', note: 'Zone 6a, 7199ft, dry and sunny, shorter season' },
      { name: 'Las Cruces', slug: 'las-cruces', note: 'Zone 8a, southern NM, long hot season' },
      { name: 'Rio Rancho', slug: 'rio-rancho', note: 'Zone 7a, high desert, ABQ suburb' },
    ],
  },
  'new-york': {
    name: 'New York', abbreviation: 'NY', slug: 'new-york',
    climate: 'temperate', growingSeason: 'May through October in NYC; shorter in the Adirondacks and Western NY. The state spans from Zone 4b (mountains) to Zone 7b (Long Island).',
    topStrainTypes: ['balanced hybrids', 'indica-dominant strains', 'autoflowers'],
    frostFreeDays: 185, legalStatus: 'recreational', legalNote: 'Recreational cannabis legal since 2021 (MRTA). Adults 21+ may possess up to 3 oz and grow 6 plants (3 mature). NYC dispensary rollout ongoing with equity focus.',
    region: 'northeast', indoorOutdoor: 'Indoor growing dominates in NYC. Upstate and Long Island support outdoor grows with early-finishing genetics and mold-resistant strains.',
    cities: [
      { name: 'New York City', slug: 'new-york-city', note: 'Zone 7b, urban heat island, largest cannabis market by population' },
      { name: 'Buffalo', slug: 'buffalo', note: 'Zone 6a, Lake Erie effect, challenging outdoor season' },
      { name: 'Rochester', slug: 'rochester', note: 'Zone 6a, Finger Lakes region, growing craft scene' },
      { name: 'Albany', slug: 'albany', note: 'Zone 5b-6a, state capital, Hudson Valley' },
      { name: 'Syracuse', slug: 'syracuse', note: 'Zone 5b, heavy lake effect snow, indoor preferred' },
    ],
  },
  'north-carolina': {
    name: 'North Carolina', abbreviation: 'NC', slug: 'north-carolina',
    climate: 'hot-humid', growingSeason: 'April through October in the Piedmont; May through September in the mountains. The Outer Banks and coastal plain have the longest season.',
    topStrainTypes: ['mold-resistant hybrids', 'heat-tolerant strains', 'autoflowers'],
    frostFreeDays: 210, legalStatus: 'decriminalized', legalNote: 'Cannabis decriminalized for small amounts (under 0.5 oz is a misdemeanor, not a felony). No medical or recreational program as of 2026. Legislative movement toward medical cannabis ongoing.',
    region: 'southeast', indoorOutdoor: 'Indoor growing recommended given legal climate. The Piedmont and mountain regions would excel for outdoor cultivation when legal.',
    cities: [
      { name: 'Charlotte', slug: 'charlotte', note: 'Zone 7b-8a, Piedmont region, largest city' },
      { name: 'Raleigh', slug: 'raleigh', note: 'Zone 7b, Research Triangle, tech-oriented grow community' },
      { name: 'Asheville', slug: 'asheville', note: 'Zone 7a, Blue Ridge Mountains, craft culture' },
      { name: 'Durham', slug: 'durham', note: 'Zone 7b, Research Triangle, progressive politics' },
      { name: 'Wilmington', slug: 'wilmington', note: 'Zone 8a-8b, coastal, long season with hurricane risk' },
    ],
  },
  'north-dakota': {
    name: 'North Dakota', abbreviation: 'ND', slug: 'north-dakota',
    climate: 'cold', growingSeason: 'May through September. Extreme continental climate with harsh winters. The Red River Valley has rich soil but a very short outdoor window.',
    topStrainTypes: ['autoflowers', 'fast-finishing indicas', 'cold-hardy genetics'],
    frostFreeDays: 130, legalStatus: 'medical', legalNote: 'Medical cannabis legal since 2016 (Measure 5). Qualifying conditions include PTSD, cancer, and chronic pain. No home cultivation. Recreational ballot measure failed in 2022.',
    region: 'midwest', indoorOutdoor: 'Indoor growing is essential. The extreme cold and short season make outdoor growing impractical for photoperiod strains.',
    cities: [
      { name: 'Fargo', slug: 'fargo', note: 'Zone 4a, Red River valley, extreme temperature swings' },
      { name: 'Bismarck', slug: 'bismarck', note: 'Zone 4a, state capital, Missouri River' },
      { name: 'Grand Forks', slug: 'grand-forks', note: 'Zone 3b-4a, one of coldest cities in lower 48' },
      { name: 'Minot', slug: 'minot', note: 'Zone 3b, north-central ND, arctic air incursions' },
    ],
  },
  ohio: {
    name: 'Ohio', abbreviation: 'OH', slug: 'ohio',
    climate: 'temperate', growingSeason: 'May through October. Lake Erie moderates northern Ohio temps. The Ohio River valley in the south has the longest season.',
    topStrainTypes: ['balanced hybrids', 'fast-finishing indicas', 'autoflowers'],
    frostFreeDays: 180, legalStatus: 'recreational', legalNote: 'Recreational cannabis legal since 2023 (Issue 2). Adults 21+ may possess up to 2.5 oz and grow up to 6 plants. Market transitioning from medical-only.',
    region: 'midwest', indoorOutdoor: 'Both viable. Indoor growing dominates metro areas. Southern Ohio valleys support outdoor grows with proper strain selection.',
    cities: [
      { name: 'Columbus', slug: 'columbus', note: 'Zone 6a, central OH, state capital, largest city' },
      { name: 'Cleveland', slug: 'cleveland', note: 'Zone 6a-6b, Lake Erie moderation, growing scene' },
      { name: 'Cincinnati', slug: 'cincinnati', note: 'Zone 6b, Ohio River valley, longer season' },
      { name: 'Toledo', slug: 'toledo', note: 'Zone 6a, Lake Erie west, industrial legacy' },
      { name: 'Dayton', slug: 'dayton', note: 'Zone 6a, Miami Valley, moderate conditions' },
    ],
  },
  oklahoma: {
    name: 'Oklahoma', abbreviation: 'OK', slug: 'oklahoma',
    climate: 'hot-dry', growingSeason: 'March through November. Tornado season (April-June) is a real threat to outdoor grows. Eastern OK gets more rainfall; western OK is semi-arid.',
    topStrainTypes: ['heat-tolerant hybrids', 'indica-dominant strains', 'autoflowers'],
    frostFreeDays: 220, legalStatus: 'medical', legalNote: 'Medical cannabis legal since 2018 (SQ 788) with one of the most accessible programs in the US — no qualifying condition list. Patients may grow up to 6 mature plants. Recreational measure failed in 2023.',
    region: 'southwest', indoorOutdoor: 'Both work well. The long growing season supports outdoor cultivation. Indoor grows avoid tornado and severe storm risks.',
    cities: [
      { name: 'Oklahoma City', slug: 'oklahoma-city', note: 'Zone 7a, central OK, massive dispensary density' },
      { name: 'Tulsa', slug: 'tulsa', note: 'Zone 7a, Green Country region, more rainfall than OKC' },
      { name: 'Norman', slug: 'norman', note: 'Zone 7a, university town, active grow scene' },
      { name: 'Edmond', slug: 'edmond', note: 'Zone 7a, OKC suburb, growing market' },
    ],
  },
  oregon: {
    name: 'Oregon', abbreviation: 'OR', slug: 'oregon',
    climate: 'mild-coastal', growingSeason: 'May through October west of the Cascades; shorter and drier east of the mountains. The Willamette Valley is the state\'s outdoor cannabis heartland.',
    topStrainTypes: ['sativa-dominant hybrids', 'craft genetics', 'outdoor strains'],
    frostFreeDays: 200, legalStatus: 'recreational', legalNote: 'Recreational cannabis legal since 2014 (Measure 91). Adults 21+ may possess up to 1 oz in public, 8 oz at home, and grow 4 plants. Mature market with significant craft culture.',
    region: 'pacific-northwest', indoorOutdoor: 'Both excel. The Willamette Valley produces legendary outdoor cannabis. Indoor grows avoid the October rain that threatens late-finishing sativas.',
    cities: [
      { name: 'Portland', slug: 'portland', note: 'Zone 8b, Willamette Valley, highest dispensary density per capita' },
      { name: 'Eugene', slug: 'eugene', note: 'Zone 8a-8b, southern Willamette, craft cannabis culture' },
      { name: 'Salem', slug: 'salem', note: 'Zone 8a-8b, state capital, agricultural region' },
      { name: 'Bend', slug: 'bend', note: 'Zone 6a, east of Cascades, dry and sunny, shorter season' },
      { name: 'Medford', slug: 'medford', note: 'Zone 8a, Rogue Valley, warm and sunny' },
    ],
  },
  pennsylvania: {
    name: 'Pennsylvania', abbreviation: 'PA', slug: 'pennsylvania',
    climate: 'temperate', growingSeason: 'May through October. The state has significant elevation variation — Philadelphia is Zone 7a while the Poconos are Zone 5b.',
    topStrainTypes: ['balanced hybrids', 'indica-dominant strains', 'autoflowers'],
    frostFreeDays: 180, legalStatus: 'medical', legalNote: 'Medical cannabis legal since 2016. One of the largest medical programs in the US with over 400,000 patients. No home cultivation. Recreational legalization bills introduced but not yet passed as of 2026.',
    region: 'northeast', indoorOutdoor: 'Indoor growing is the standard given no home grow in the current program. The state\'s climate would support excellent outdoor grows across the southern tier.',
    cities: [
      { name: 'Philadelphia', slug: 'philadelphia', note: 'Zone 7a, Delaware Valley, decriminalized possession' },
      { name: 'Pittsburgh', slug: 'pittsburgh', note: 'Zone 6b, three rivers confluence, moderate humidity' },
      { name: 'Allentown', slug: 'allentown', note: 'Zone 6b, Lehigh Valley, growing metro' },
      { name: 'Erie', slug: 'erie', note: 'Zone 6a, Lake Erie influence, heavy winter snow' },
    ],
  },
  'rhode-island': {
    name: 'Rhode Island', abbreviation: 'RI', slug: 'rhode-island',
    climate: 'temperate', growingSeason: 'May through October. Narragansett Bay moderates temperatures statewide — no point in RI is more than 30 miles from the coast.',
    topStrainTypes: ['balanced hybrids', 'indica-dominant strains', 'autoflowers'],
    frostFreeDays: 185, legalStatus: 'recreational', legalNote: 'Recreational cannabis legal since 2022 (Rhode Island Cannabis Act). Adults 21+ may possess up to 1 oz and grow up to 6 plants (3 mature). Compact market with growing dispensary count.',
    region: 'northeast', indoorOutdoor: 'Both viable in this small state. Coastal moderation makes outdoor growing more feasible than in northern New England.',
    cities: [
      { name: 'Providence', slug: 'providence', note: 'Zone 6b-7a, Narragansett Bay, dispensary hub' },
      { name: 'Warwick', slug: 'warwick', note: 'Zone 6b-7a, coastal, moderate conditions' },
      { name: 'Cranston', slug: 'cranston', note: 'Zone 6b-7a, Providence metro, residential grow scene' },
    ],
  },
  'south-carolina': {
    name: 'South Carolina', abbreviation: 'SC', slug: 'south-carolina',
    climate: 'hot-humid', growingSeason: 'March through November along the coast; April through October in the upstate. Charleston\'s humidity tests even the most mold-resistant genetics.',
    topStrainTypes: ['mold-resistant strains', 'heat-tolerant indicas', 'autoflowers'],
    frostFreeDays: 230, legalStatus: 'illegal', legalNote: 'Cannabis remains illegal in South Carolina — no medical or recreational programs. A medical cannabis bill (Compassionate Care Act) has been introduced repeatedly but not passed. Seeds may be purchased as novelty souvenirs.',
    region: 'southeast', indoorOutdoor: 'Indoor growing is the only practical option given the legal environment.',
    cities: [
      { name: 'Charleston', slug: 'charleston', note: 'Zone 8b-9a, coastal, extreme humidity, historic city' },
      { name: 'Columbia', slug: 'columbia', note: 'Zone 8a, state capital, central SC heat' },
      { name: 'Greenville', slug: 'greenville', note: 'Zone 7b, upstate foothills, cooler and less humid' },
      { name: 'Myrtle Beach', slug: 'myrtle-beach', note: 'Zone 8b, coastal tourism area' },
    ],
  },
  'south-dakota': {
    name: 'South Dakota', abbreviation: 'SD', slug: 'south-dakota',
    climate: 'cold', growingSeason: 'May through September. The Black Hills see slightly more precipitation than the prairie. Extreme temperature swings common — -30°F winters to 100°F summers.',
    topStrainTypes: ['autoflowers', 'fast-finishing indicas', 'cold-hardy genetics'],
    frostFreeDays: 140, legalStatus: 'medical', legalNote: 'Medical cannabis legal since 2020 (Measure 26). Recreational measure passed but was invalidated by courts; second attempt failed in 2022. No home cultivation in medical program.',
    region: 'midwest', indoorOutdoor: 'Indoor growing is essential. The extreme climate and legal constraints make outdoor growing impractical.',
    cities: [
      { name: 'Sioux Falls', slug: 'sioux-falls', note: 'Zone 4b-5a, largest city, Big Sioux River' },
      { name: 'Rapid City', slug: 'rapid-city', note: 'Zone 5a, Black Hills gateway, slightly milder' },
      { name: 'Aberdeen', slug: 'aberdeen', note: 'Zone 4a, northeast SD, extreme cold' },
    ],
  },
  tennessee: {
    name: 'Tennessee', abbreviation: 'TN', slug: 'tennessee',
    climate: 'hot-humid', growingSeason: 'April through October. West Tennessee (Memphis area) is flatter and hotter; East Tennessee (Knoxville, Chattanooga) has mountain influence and cooler nights.',
    topStrainTypes: ['mold-resistant hybrids', 'indica-dominant strains', 'autoflowers'],
    frostFreeDays: 210, legalStatus: 'medical', legalNote: 'Limited medical cannabis program allowing low-THC CBD oil since 2014. No dispensaries for THC products. Recreational remains illegal. Nashville decriminalized small amounts.',
    region: 'southeast', indoorOutdoor: 'Indoor growing is the practical approach given legal constraints. The climate supports excellent outdoor cultivation when regulations change.',
    cities: [
      { name: 'Nashville', slug: 'nashville', note: 'Zone 7a, urban core, decriminalized small amounts' },
      { name: 'Memphis', slug: 'memphis', note: 'Zone 7b-8a, Mississippi River, hot and humid' },
      { name: 'Knoxville', slug: 'knoxville', note: 'Zone 7a, Tennessee Valley, mountain influence' },
      { name: 'Chattanooga', slug: 'chattanooga', note: 'Zone 7b, Tennessee River gorge, moderate humidity' },
    ],
  },
  texas: {
    name: 'Texas', abbreviation: 'TX', slug: 'texas',
    climate: 'hot-dry', growingSeason: 'March through November in South Texas; April through October in the Panhandle. The state spans from hot-humid Gulf Coast to semi-arid West Texas to temperate Hill Country.',
    topStrainTypes: ['heat-tolerant strains', 'drought-resistant genetics', 'autoflowers'],
    frostFreeDays: 250, legalStatus: 'medical', legalNote: 'Very limited medical program (Compassionate Use Program) allowing low-THC cannabis (<1% THC) for specific conditions. No general medical cannabis. No recreational. No home cultivation.',
    region: 'southwest', indoorOutdoor: 'Indoor growing with climate control is the standard. The extreme heat in most of Texas stresses plants above 95°F — shade structures and drip irrigation essential for any outdoor attempt.',
    cities: [
      { name: 'Houston', slug: 'houston', note: 'Zone 9a, Gulf Coast humidity, year-round indoor growing' },
      { name: 'Dallas', slug: 'dallas', note: 'Zone 8a, north TX, hot summers, mild winters' },
      { name: 'Austin', slug: 'austin', note: 'Zone 8b, Hill Country, progressive politics, growing scene' },
      { name: 'San Antonio', slug: 'san-antonio', note: 'Zone 8b-9a, south-central TX, long hot season' },
      { name: 'Fort Worth', slug: 'fort-worth', note: 'Zone 8a, DFW metroplex, expanding market' },
    ],
  },
  utah: {
    name: 'Utah', abbreviation: 'UT', slug: 'utah',
    climate: 'hot-dry', growingSeason: 'May through October in the valleys; shorter in the mountains. The Wasatch Front gets the most consistent growing conditions. Extremely low humidity.',
    topStrainTypes: ['drought-adapted strains', 'indoor hybrids', 'autoflowers'],
    frostFreeDays: 180, legalStatus: 'medical', legalNote: 'Medical cannabis legal since 2018 (Proposition 2, then modified by legislature). Qualifying conditions required. No home cultivation. Recreational remains illegal.',
    region: 'west', indoorOutdoor: 'Indoor growing is the standard. The low humidity is actually excellent for preventing mold, but the legal framework limits options.',
    cities: [
      { name: 'Salt Lake City', slug: 'salt-lake-city', note: 'Zone 6b-7a, Wasatch Front, 4226ft elevation' },
      { name: 'Provo', slug: 'provo', note: 'Zone 6b, Utah Valley, conservative community' },
      { name: 'St. George', slug: 'st-george', note: 'Zone 8b-9a, southwest UT, hot desert, longest season' },
      { name: 'Ogden', slug: 'ogden', note: 'Zone 6b, northern Wasatch, mountain access' },
    ],
  },
  vermont: {
    name: 'Vermont', abbreviation: 'VT', slug: 'vermont',
    climate: 'cold', growingSeason: 'May through September. The Champlain Valley has the longest season; the Green Mountains see first frost by mid-September.',
    topStrainTypes: ['autoflowers', 'cold-hardy indicas', 'fast-finishing genetics'],
    frostFreeDays: 140, legalStatus: 'recreational', legalNote: 'First state to legalize recreational cannabis through legislature (2018). Adults 21+ may possess up to 1 oz and grow 6 plants (2 mature). Retail sales began in 2022.',
    region: 'northeast', indoorOutdoor: 'Indoor growing dominates. Outdoor autoflowers and light-dep greenhouses work in the Champlain Valley and southern Vermont.',
    cities: [
      { name: 'Burlington', slug: 'burlington', note: 'Zone 5a, Lake Champlain moderation, active cannabis scene' },
      { name: 'Montpelier', slug: 'montpelier', note: 'Zone 4b, smallest state capital, Green Mountain valley' },
      { name: 'Rutland', slug: 'rutland', note: 'Zone 5a, central VT, moderate valley conditions' },
      { name: 'Brattleboro', slug: 'brattleboro', note: 'Zone 5b-6a, southern VT, longest growing season' },
    ],
  },
  virginia: {
    name: 'Virginia', abbreviation: 'VA', slug: 'virginia',
    climate: 'temperate', growingSeason: 'April through October. The Tidewater region has the longest season; the Blue Ridge and Shenandoah Valley see earlier frosts.',
    topStrainTypes: ['balanced hybrids', 'indica-dominant strains', 'autoflowers'],
    frostFreeDays: 200, legalStatus: 'recreational', legalNote: 'Cannabis possession and home cultivation legal since 2021. Adults 21+ may possess up to 1 oz and grow 4 plants. Retail sales framework still under development as of 2026.',
    region: 'southeast', indoorOutdoor: 'Both viable. The Piedmont and Tidewater regions support strong outdoor grows. Shenandoah Valley growers should plan for earlier harvests.',
    cities: [
      { name: 'Virginia Beach', slug: 'virginia-beach', note: 'Zone 8a, Atlantic coast, maritime moderation' },
      { name: 'Richmond', slug: 'richmond', note: 'Zone 7a-7b, state capital, Fall Line microclimate' },
      { name: 'Norfolk', slug: 'norfolk', note: 'Zone 8a, Hampton Roads, naval city' },
      { name: 'Arlington', slug: 'arlington', note: 'Zone 7a, DC suburbs, urban growing scene' },
    ],
  },
  washington: {
    name: 'Washington', abbreviation: 'WA', slug: 'washington',
    climate: 'mild-coastal', growingSeason: 'May through October west of the Cascades; May through September east of the mountains. The Puget Sound region rarely freezes but lacks the heat units for late sativas.',
    topStrainTypes: ['indica-dominant hybrids', 'craft genetics', 'outdoor strains'],
    frostFreeDays: 200, legalStatus: 'recreational', legalNote: 'Recreational cannabis legal since 2012 (I-502), one of the first two states. Adults 21+ may possess up to 1 oz. Home cultivation is NOT permitted for recreational users (medical only, 6 plants).',
    region: 'pacific-northwest', indoorOutdoor: 'Indoor growing is the primary method due to home grow restrictions. Western WA\'s mild but cloudy climate favors indoor. Eastern WA (Yakima, Tri-Cities) has excellent outdoor conditions.',
    cities: [
      { name: 'Seattle', slug: 'seattle', note: 'Zone 8b, Puget Sound, dense dispensary network' },
      { name: 'Spokane', slug: 'spokane', note: 'Zone 6b, eastern WA, continental climate, drier' },
      { name: 'Tacoma', slug: 'tacoma', note: 'Zone 8b, South Sound, similar to Seattle' },
      { name: 'Vancouver', slug: 'vancouver', note: 'Zone 8b, Portland metro, Columbia River' },
      { name: 'Olympia', slug: 'olympia', note: 'Zone 8a, state capital, South Sound' },
    ],
  },
  'west-virginia': {
    name: 'West Virginia', abbreviation: 'WV', slug: 'west-virginia',
    climate: 'temperate', growingSeason: 'May through October. Mountain terrain creates dramatic microclimate variation. The Kanawha Valley and Ohio River corridor have the longest seasons.',
    topStrainTypes: ['balanced hybrids', 'cold-hardy indicas', 'autoflowers'],
    frostFreeDays: 170, legalStatus: 'medical', legalNote: 'Medical cannabis legal since 2017. Patient registry active with dispensary sales. No home cultivation permitted. Recreational bills introduced but not advanced.',
    region: 'southeast', indoorOutdoor: 'Indoor growing is the standard approach. Outdoor grows work in the lower elevation valleys with early-finishing genetics.',
    cities: [
      { name: 'Charleston', slug: 'charleston', note: 'Zone 6b-7a, Kanawha Valley, state capital' },
      { name: 'Huntington', slug: 'huntington', note: 'Zone 6b, Ohio River, western WV' },
      { name: 'Morgantown', slug: 'morgantown', note: 'Zone 6a-6b, university town, northern WV' },
      { name: 'Wheeling', slug: 'wheeling', note: 'Zone 6a, northern panhandle, Ohio Valley' },
    ],
  },
  wisconsin: {
    name: 'Wisconsin', abbreviation: 'WI', slug: 'wisconsin',
    climate: 'cold', growingSeason: 'May through September. Lake Michigan and Lake Superior moderate coastal temps. The Driftless Area in southwest WI has unique terrain for the region.',
    topStrainTypes: ['autoflowers', 'fast-finishing indicas', 'cold-hardy genetics'],
    frostFreeDays: 155, legalStatus: 'decriminalized', legalNote: 'Cannabis not fully legal — some municipalities (Madison, Milwaukee) have decriminalized small amounts. No statewide medical or recreational program. Governor supports legalization but legislature has blocked it.',
    region: 'midwest', indoorOutdoor: 'Indoor growing is the practical approach. Short season and legal uncertainty make outdoor growing challenging.',
    cities: [
      { name: 'Milwaukee', slug: 'milwaukee', note: 'Zone 5b-6a, Lake Michigan influence, decriminalized' },
      { name: 'Madison', slug: 'madison', note: 'Zone 5a-5b, state capital, decriminalized, progressive' },
      { name: 'Green Bay', slug: 'green-bay', note: 'Zone 5a, northeast WI, short season' },
      { name: 'Kenosha', slug: 'kenosha', note: 'Zone 5b-6a, IL border, Lake Michigan influence' },
    ],
  },
  wyoming: {
    name: 'Wyoming', abbreviation: 'WY', slug: 'wyoming',
    climate: 'alpine', growingSeason: 'June through September. High elevation (average 6700ft) and persistent wind define growing conditions. Cheyenne averages only 125 frost-free days.',
    topStrainTypes: ['autoflowers', 'fast-finishing indicas', 'wind-resistant genetics'],
    frostFreeDays: 125, legalStatus: 'illegal', legalNote: 'Cannabis remains fully illegal in Wyoming — no medical or recreational programs. No active legalization legislation. Seeds may be purchased as novelty souvenirs.',
    region: 'west', indoorOutdoor: 'Indoor growing is the only practical option. Extreme elevation, wind, and short season make outdoor growing nearly impossible.',
    cities: [
      { name: 'Cheyenne', slug: 'cheyenne', note: 'Zone 5b, 6062ft, windy, near CO border' },
      { name: 'Casper', slug: 'casper', note: 'Zone 4b-5a, central WY, North Platte River' },
      { name: 'Laramie', slug: 'laramie', note: 'Zone 4b, 7165ft, university town, extreme altitude' },
      { name: 'Jackson', slug: 'jackson', note: 'Zone 4a, Teton County, tourist town, mountain valley' },
    ],
  },
};

// ── Region grouping ──
const REGIONS: Record<Region, string> = {
  northeast: 'Northeast',
  southeast: 'Southeast',
  midwest: 'Midwest',
  southwest: 'Southwest',
  west: 'West',
  'pacific-northwest': 'Pacific Northwest',
};

function getStatesByRegion(): Record<Region, StateInfo[]> {
  const grouped: Record<Region, StateInfo[]> = {
    northeast: [], southeast: [], midwest: [], southwest: [], west: [], 'pacific-northwest': [],
  };
  for (const state of Object.values(STATE_DATA)) {
    grouped[state.region].push(state);
  }
  for (const region of Object.keys(grouped) as Region[]) {
    grouped[region].sort((a, b) => a.name.localeCompare(b.name));
  }
  return grouped;
}

// ── Climate descriptions ──
const CLIMATE_DESCRIPTIONS: Record<ClimateZone, string> = {
  'hot-humid': 'Hot, humid summers with mild winters. Mold and botrytis are the primary outdoor threats. Dehumidification is essential for indoor grows.',
  'hot-dry': 'Intense heat with low humidity. Excellent for preventing mold but requires aggressive irrigation and shade management when temps exceed 95°F.',
  'temperate': 'Four distinct seasons with moderate summers and cold winters. The classic outdoor window runs May through October with strain-dependent harvest timing.',
  'cold': 'Short growing seasons with harsh winters. Autoflowers and fast-finishing photoperiods are essential for outdoor grows. Indoor growing is the reliable year-round option.',
  'mild-coastal': 'Maritime influence creates mild temperatures year-round. Low frost risk but limited heat units can slow flowering on equatorial sativas.',
  'alpine': 'High elevation with intense UV, cool nights, and short frost-free windows. The UV intensity drives exceptional trichome production but the season limits strain selection.',
  'subtropical': 'Long, hot, humid growing seasons. Year-round outdoor potential in southern zones. Hurricane season is the primary threat.',
  'tropical': 'Year-round growing with minimal temperature variation. Trade winds and rainfall patterns create dramatic microclimates over short distances.',
};

// ════════════════════════════════════════════════════════════
// CONTENT GENERATORS
// ════════════════════════════════════════════════════════════

// ── Opening templates — varied by hash ──
const STATE_OPENERS: ((state: StateInfo) => string)[] = [
  (s) => `${s.name} sits in USDA hardiness zones that translate to ${s.frostFreeDays} frost-free days for most growers — and those days define which genetics finish outdoors and which need the controlled environment of an indoor setup.`,
  (s) => `Growing cannabis in ${s.name} means working with a ${s.climate} climate where ${s.growingSeason}`,
  (s) => `The ${s.frostFreeDays}-day frost-free window in ${s.name} sets the boundaries for outdoor growers. ${s.indoorOutdoor}`,
  (s) => `${s.name} growers face a specific set of conditions: ${CLIMATE_DESCRIPTIONS[s.climate].toLowerCase()} That shapes everything from strain selection to harvest timing.`,
  (s) => `Cannabis cultivation in ${s.name} follows the rhythm of a ${s.climate} climate. ${s.growingSeason} These are the parameters that determine what you can grow and how you should grow it.`,
];

const CITY_OPENERS: ((city: CityInfo, state: StateInfo) => string)[] = [
  (c, s) => `${c.name} growers operate in ${s.name}'s ${s.climate} climate zone${c.note ? ` — specifically, ${c.note.toLowerCase()}` : ''}. That local microclimate shapes which seeds perform best and how you should set up your grow.`,
  (c, s) => `Buying cannabis seeds in ${c.name}, ${s.abbreviation} means choosing genetics that handle the local conditions${c.note ? `: ${c.note.toLowerCase()}` : ` typical of ${s.name}'s ${s.climate} zone`}.`,
  (c, s) => `${c.name} sits in ${s.name}'s ${s.region} region${c.note ? `, where ${c.note.toLowerCase()}` : ''}. Understanding these local conditions is the difference between a successful harvest and a disappointing one.`,
  (c, s) => `For ${c.name} growers looking for cannabis seeds, the local growing environment matters more than most online guides acknowledge${c.note ? `. ${c.note}.` : `.`} Here is what you need to know.`,
  (c, s) => `Cannabis seed selection for ${c.name}, ${s.name} comes down to matching genetics to your specific conditions. ${c.note || `The ${s.climate} climate of ${s.name} sets the baseline.`}`,
];

// ── Hub Page Generator ──
function generateHubPage(): LocationPage {
  const slug = 'usa';
  const byRegion = getStatesByRegion();

  let statesByRegionHtml = '';
  for (const [region, label] of Object.entries(REGIONS)) {
    const states = byRegion[region as Region];
    if (states.length === 0) continue;
    statesByRegionHtml += `<h3>${label}</h3>\n<ul>\n`;
    for (const state of states) {
      statesByRegionHtml += `<li>${a(`Buy Cannabis Seeds in ${state.name}`, `/seeds/usa/${state.slug}`)}</li>\n`;
    }
    statesByRegionHtml += `</ul>\n`;
  }

  const content = `
<h1>Buy Cannabis Seeds in the USA — All 50 States, Discreet Shipping</h1>

<p>Royal King Seeds ships cannabis seeds to all 50 US states with discreet, trackable packaging. As of 2026, the legal landscape for cannabis in America is a patchwork — 24 states plus DC have legalized recreational use, 38 states have some form of medical program, and the remaining states maintain varying degrees of restriction. What has not changed is that ungerminated cannabis seeds are legal to purchase and possess in all 50 states as collector items and genetic preservation specimens.</p>

<p>Whether you grow in a 4x4 tent in Michigan or run a full outdoor plot in California's Emerald Triangle, seed selection starts with understanding your local climate, legal framework, and growing goals. This page connects you to state-specific growing guides, strain recommendations matched to your region, and the ${CL.all} in our catalog.</p>

<p>We stock ${CL.fem}, ${CL.auto}, ${CL.ind}, ${CL.sat}, ${CL.cbd}, and ${CL.thc} — all from proven genetics with verified germination rates. Every order ships in unmarked packaging with no external branding.</p>

<h2>Cannabis Seeds by State</h2>
<p>Click your state below for climate-specific strain recommendations, growing tips for your region, legal status, and city-level guides.</p>

${statesByRegionHtml}

<h2>Cannabis Seeds by Climate Zone</h2>

<h3>Hot &amp; Humid States (Southeast, Gulf Coast)</h3>
<p>Mold resistance is non-negotiable. States like Florida, Louisiana, Alabama, and Georgia see relative humidity above 80% during peak flowering season. Choose strains with open bud structures and natural botrytis resistance — White Widow, Northern Lights, and Durban Poison handle these conditions well. ${CL.outdoor} bred for humidity tolerance are your safest bet. Harvest timing matters more here than anywhere — one week late can mean losing half your crop to bud rot.</p>

<h3>Hot &amp; Dry States (Southwest, Desert)</h3>
<p>Arizona, Nevada, New Mexico, and West Texas offer nearly zero mold pressure but present heat stress and water management challenges. When daytime temps exceed 100°F, cannabis growth stalls — shade cloth (30-40%) and drip irrigation keep plants productive. Sour Diesel, Jack Herer, and Afghan Kush thrive in arid conditions. The intense UV at elevation drives heavy trichome production that makes desert-grown cannabis distinctive. Browse our ${CL.sat} for genetics that love the sun.</p>

<h3>Temperate States (Mid-Atlantic, Upper South, Parts of Midwest)</h3>
<p>States like Ohio, Pennsylvania, Virginia, and Missouri enjoy four-season growing with a May-through-October outdoor window. This is the sweet spot for the widest range of genetics — Girl Scout Cookies, OG Kush, Gelato, and Wedding Cake all thrive. Our ${CL.best} include many cultivars bred for temperate performance. Start seeds indoors 4-6 weeks before last frost for the longest possible flowering window.</p>

<h3>Cold States (Upper Midwest, Northern Plains, Northern New England)</h3>
<p>Minnesota, Wisconsin, Montana, Vermont, and the Dakotas have frost-free windows as short as 100-130 days. ${CL.auto} are the reliable outdoor choice — they finish in 70-85 days regardless of light schedule. For photoperiod growers, fast-finishing indicas like Northern Lights and Blueberry can work when started indoors and transplanted after last frost. Indoor growing is the year-round standard. Our ${BL.autoGuide} covers the specific techniques that maximize yield in short seasons.</p>

<h3>Mild Coastal States (Pacific Coast)</h3>
<p>California, Oregon, and Washington enjoy maritime moderation that supports legendary outdoor grows. The mild temperatures allow a wide strain range, though coastal fog and fall rain can challenge late-finishing sativas. Blue Dream was bred for these conditions and remains one of the most reliable outdoor performers. Check our ${CL.outdoor} for genetics selected for Pacific Coast growing.</p>

<h3>Alpine &amp; Mountain States</h3>
<p>Colorado, Wyoming, and parts of Idaho, Utah, and Montana sit above 5000ft where UV intensity is 20-30% higher than sea level. That UV drives trichome production as a natural plant defense — alpine-grown cannabis often tests higher in cannabinoid and terpene content. The trade-off is a compressed season and cold nights. Our ${CL.auto} and fast-finishing ${CL.ind} handle these conditions best.</p>

<h2>Shipping &amp; Delivery</h2>
<p>Every Royal King Seeds order ships in discreet, unmarked packaging with no cannabis-related branding visible on the outside. We offer tracked shipping to all 50 states with delivery typically within 5-7 business days. Seeds are packaged in crush-proof containers to ensure they arrive in perfect condition. Orders over $100 qualify for free shipping.</p>

<h2>Frequently Asked Questions</h2>

<h3>Is it legal to buy cannabis seeds in the US?</h3>
<p>Ungerminated cannabis seeds are sold as collector items and genetic preservation specimens. They contain negligible THC and are legal to purchase and possess in all 50 states. Germination and cultivation laws vary by state — check your ${a('state-specific guide', '/seeds/usa')} for local regulations.</p>

<h3>What are the best cannabis seeds for beginners?</h3>
<p>For first-time growers, ${CL.auto} simplify the process by removing light schedule management. Northern Lights Auto and White Widow Auto are forgiving of beginner mistakes and finish in 8-10 weeks from seed. Our ${BL.germ} walks through the process step by step.</p>

<h3>Which seeds produce the highest yield?</h3>
<p>Yield depends on genetics, growing environment, and technique. Indoors, Gorilla Glue, Girl Scout Cookies, and Blue Dream consistently produce 14-20 oz per square meter under 600W+ lighting. Outdoor yields can reach 2+ pounds per plant with ${CL.outdoor} genetics in favorable climates. Our ${BL.train} covers canopy management techniques that maximize production.</p>

<h3>How should I store cannabis seeds?</h3>
<p>Cool, dark, and dry — aim for 40-50°F with relative humidity under 10%. A sealed container in the refrigerator works for storage up to 2-3 years. Avoid freezing, which can damage cell walls. Properly stored seeds maintain 80%+ germination rates for years.</p>

<h3>Do you ship to all 50 states?</h3>
<p>Yes. Royal King Seeds ships to every US state with discreet, tracked packaging. Delivery times vary by location but typically run 5-7 business days. We also ship to US territories.</p>

<h3>What is the difference between feminized and autoflower seeds?</h3>
<p>${CL.fem} produce only female plants (the ones that make flower) and follow a photoperiod light schedule — they flower when light drops below 12 hours. ${CL.auto} flower based on age rather than light, finishing in 8-12 weeks regardless of schedule. Autoflowers are simpler to grow; feminized photoperiods typically produce larger yields. Our ${BL.autoGuide} explains the differences in detail.</p>
`;

  return {
    slug: 'usa',
    title: 'Buy Cannabis Seeds in the USA — All 50 States, Discreet Shipping',
    content,
    metaTitle: 'Buy Cannabis Seeds in the USA | All 50 States | Royal King Seeds',
    metaDescription: 'Shop cannabis seeds with discreet shipping to all 50 US states. Feminized, autoflower, indica, sativa, and CBD seeds. State-specific growing guides and strain recommendations.',
    pageType: 'hub',
  };
}

// ── State Page Generator ──
function generateStatePage(stateKey: string): LocationPage | null {
  const state = STATE_DATA[stateKey];
  if (!state) return null;

  const slug = state.slug;
  const opener = pick(slug, STATE_OPENERS, 'opener');
  const strains = pickN(slug, STRAINS_BY_CLIMATE[state.climate], 5, 'strains');
  const relatedStates = getRelatedStatesInternal(stateKey);

  // Pick blog references deterministically
  const blogRefs = pickN(slug, [
    `Our ${BL.germ} covers the paper towel method and transplanting steps for maximum success rates.`,
    `Managing nutrients through each growth stage prevents the most common issues — see our ${BL.nutrients} for diagnostic charts.`,
    `Lighting decisions shape everything from energy cost to bud density. Our ${BL.lights} breaks down the options.`,
    `The ${BL.autoGuide} covers techniques specific to automatic genetics that apply directly to ${state.name}'s growing conditions.`,
    `Pest pressure varies by season and region. Our ${BL.pest} identifies the threats most relevant to ${state.region} growers.`,
    `Temperature and humidity management through VPD is especially important in ${state.name}'s ${state.climate} climate. Our ${BL.vpd} explains the math.`,
    `Knowing when to harvest makes or breaks the final product. Our ${BL.harvest} covers trichome maturity and timing.`,
    `The flowering stretch can surprise ${state.name} growers working in tight spaces. Our ${BL.flower} explains stage-by-stage management.`,
    `Canopy management through topping and LST shapes yield distribution. Our ${BL.train} walks through the techniques.`,
    `Terpene preservation during dry and cure determines flavor quality. Our ${BL.terp} covers the major compounds.`,
  ], 3, 'blogrefs');

  // Strain recommendations
  let strainsHtml = '';
  for (let i = 0; i < strains.length; i++) {
    const strain = strains[i];
    const desc = pick(slug + strain, [
      `A proven performer in ${state.climate} conditions. Finishes reliably within the ${state.frostFreeDays}-day outdoor window and handles ${state.name}'s typical growing challenges.`,
      `Well-suited for ${state.name} growers — the genetics handle ${state.climate === 'hot-humid' ? 'high humidity without dense bud rot issues' : state.climate === 'cold' ? 'cool nights and shorter days without stalling' : state.climate === 'hot-dry' ? 'heat stress and low water availability' : 'the temperature range and seasonal shifts typical of the region'}.`,
      `Consistent results indoors and out in ${state.abbreviation}. The terpene profile develops fully when given ${state.climate === 'cold' || state.climate === 'alpine' ? 'the cool night temperatures' : state.climate === 'hot-dry' ? 'the intense UV exposure' : 'adequate flowering time'} that ${state.name} provides.`,
    ], 'sdesc' + i);
    strainsHtml += `<h3>${i + 1}. ${strain}</h3>\n<p>${desc}</p>\n`;
  }

  // City links
  let citiesHtml = '<ul>\n';
  for (const city of state.cities) {
    citiesHtml += `<li>${a(`Buy Cannabis Seeds in ${city.name}, ${state.abbreviation}`, `/seeds/usa/${state.slug}/${city.slug}`)}${city.note ? ` — ${city.note}` : ''}</li>\n`;
  }
  citiesHtml += '</ul>';

  // Related states
  let relatedHtml = '<ul>\n';
  for (const rel of relatedStates) {
    relatedHtml += `<li>${a(`Buy Cannabis Seeds in ${rel.name}`, `/seeds/usa/${rel.slug}`)}</li>\n`;
  }
  relatedHtml += '</ul>';

  // Legal section
  const legalStatusLabel = state.legalStatus === 'recreational' ? 'Recreational (Legal)' :
    state.legalStatus === 'medical' ? 'Medical Only' :
    state.legalStatus === 'decriminalized' ? 'Decriminalized' : 'Illegal';

  // Indoor vs outdoor section
  const indoorOutdoorSection = pick(slug, [
    `<h2>Indoor vs Outdoor Growing in ${state.name}</h2>
<p>${state.indoorOutdoor}</p>
<p><strong>Indoor advantages in ${state.abbreviation}:</strong> Climate control eliminates the ${state.climate === 'hot-humid' || state.climate === 'subtropical' ? 'humidity and mold risk that define outdoor growing in this region' : state.climate === 'cold' || state.climate === 'alpine' ? 'short season that limits strain selection outdoors' : state.climate === 'hot-dry' ? 'extreme heat that stalls plant growth above 95°F' : 'weather variability that can damage outdoor crops'}. Year-round growing means 4-6 harvests per year with ${CL.auto} or 3-4 with photoperiod ${CL.fem}.</p>
<p><strong>Outdoor advantages in ${state.abbreviation}:</strong> Natural sunlight delivers the full spectrum that no grow light perfectly replicates. ${state.frostFreeDays > 200 ? `With ${state.frostFreeDays} frost-free days, ${state.name} growers can finish even long-flowering sativas outdoors.` : state.frostFreeDays > 160 ? `The ${state.frostFreeDays}-day frost-free window accommodates most indica-dominant hybrids and autoflowers.` : `The ${state.frostFreeDays}-day frost-free season limits outdoor options to autoflowers and fast-finishing indicas.`}</p>`,
    `<h2>Growing Environment: Indoor or Outdoor in ${state.name}?</h2>
<p>${state.indoorOutdoor}</p>
<p>The ${state.climate} climate of ${state.name} shapes this decision. ${state.frostFreeDays > 200 ? 'The long season opens outdoor growing to a wide range of genetics — from fast autoflowers to 12-week sativas.' : state.frostFreeDays > 160 ? 'The moderate season supports outdoor grows for growers who choose their genetics carefully and start seeds indoors before transplanting.' : 'The short frost-free window makes indoor growing the default for most growers. Autoflowers are the outdoor exception.'}</p>
<p>For indoor setups in ${state.name}, our ${BL.lights} covers LED vs HPS selection and the PAR targets that drive yield. Outdoor growers should review our ${CL.outdoor} catalog for genetics bred to handle real-world conditions.</p>`,
  ], 'indoor-outdoor');

  // FAQ section
  const faqs = [
    { q: `Can I legally grow cannabis in ${state.name}?`, a: state.legalNote },
    { q: `What are the best cannabis seeds for ${state.name}'s climate?`, a: `${state.name}'s ${state.climate} climate (${state.frostFreeDays} frost-free days) favors ${state.topStrainTypes.join(', ')}. Our top recommendations are ${strains.slice(0, 3).join(', ')} — all selected for performance in ${state.name}'s specific conditions.` },
    { q: `When should I start growing cannabis in ${state.name}?`, a: `${state.growingSeason} For indoor grows, start any time — climate control makes season irrelevant. For outdoor grows, start seeds indoors 4-6 weeks before your area's last frost date to maximize the growing window.` },
    { q: `Do you ship cannabis seeds to ${state.name}?`, a: `Yes. Royal King Seeds ships to ${state.name} with discreet, tracked packaging. Delivery typically takes 5-7 business days. Seeds ship in unmarked, crush-proof containers.` },
    pick(slug, [
      { q: `Is it better to grow indoors or outdoors in ${state.name}?`, a: state.indoorOutdoor },
      { q: `What is the best autoflower strain for ${state.name}?`, a: `For ${state.name}'s ${state.climate} conditions, ${strains[0]} Auto and ${strains[1]} Auto are strong choices. Autoflowers finish in 8-12 weeks regardless of light schedule, which is especially valuable ${state.frostFreeDays < 180 ? `given ${state.name}'s short frost-free window.` : `for growers wanting multiple harvests per season in ${state.name}.`}` },
    ], 'faq-extra'),
  ];

  let faqHtml = '';
  for (const faq of faqs) {
    faqHtml += `<h3>${faq.q}</h3>\n<p>${faq.a}</p>\n`;
  }

  const content = `
<h1>Buy Cannabis Seeds in ${state.name} — ${state.topStrainTypes[0].charAt(0).toUpperCase() + state.topStrainTypes[0].slice(1)} for ${titleCase(state.climate.replace('-', ' '))} Growing</h1>

<p>${opener(state)}</p>

<p>Royal King Seeds ships ${CL.fem}, ${CL.auto}, and specialty genetics directly to ${state.name} addresses with discreet packaging and tracked delivery. Every strain recommendation on this page is selected for ${state.name}'s ${state.climate} climate zone — not generic advice repackaged with a state name on it.</p>

<h2>Why ${state.name} Growers Choose Royal King Seeds</h2>
<p>${pick(slug, [
  `We match genetics to growing conditions — not the other way around. The ${state.topStrainTypes.join(', ')} in our catalog are selected for growers who deal with ${state.name}'s specific ${state.climate} challenges. Browse our ${CL.all} filtered for ${state.climate} performance, or explore the ${CL.best} that ${state.abbreviation} customers order most.`,
  `Seed selection for ${state.name} is not about picking the strain with the highest THC number — it is about choosing genetics that perform in ${state.frostFreeDays} frost-free days with ${state.climate === 'hot-humid' || state.climate === 'subtropical' ? 'high humidity pressure' : state.climate === 'hot-dry' ? 'extreme heat exposure' : state.climate === 'cold' || state.climate === 'alpine' ? 'compressed growing seasons' : 'variable weather patterns'}. Our ${CL.best} reflect what actually works in this region, not what is trending on social media.`,
  `Growers across ${state.name} come back to Royal King Seeds for verified genetics, germination guarantees, and strains that actually handle ${state.climate} conditions. Our ${CL.all} includes the proven performers listed below along with hundreds of other options for ${state.abbreviation} growing.`,
], 'why')}</p>

<h2>Climate &amp; Growing Season in ${state.name}</h2>
<p>${state.growingSeason}</p>
<p><strong>Climate zone:</strong> ${titleCase(state.climate.replace('-', ' '))}</p>
<p><strong>Average frost-free days:</strong> ${state.frostFreeDays}</p>
<p><strong>Climate profile:</strong> ${CLIMATE_DESCRIPTIONS[state.climate]}</p>

<h2>Top 5 Recommended Strains for ${state.name}</h2>
<p>These strains are selected specifically for ${state.name}'s ${state.climate} climate. Each has a track record of performing well in the conditions ${state.abbreviation} growers face.</p>
${strainsHtml}
<p>Browse more options in our ${CL.all} — filter by ${CL.ind}, ${CL.sat}, ${CL.auto}, or ${CL.cbd} to find the right genetics for your ${state.name} grow.</p>

${indoorOutdoorSection}

<h2>Cannabis Laws in ${state.name}</h2>
<p><strong>Status:</strong> ${legalStatusLabel}</p>
<p>${state.legalNote}</p>
<p>Ungerminated cannabis seeds are sold as collector items and genetic preservation specimens. They contain negligible THC and can be legally purchased and possessed in ${state.name}. For a detailed legal breakdown, see our ${a(`${state.name} marijuana legality guide`, `/seeds/usa/${state.slug}/is-marijuana-legal`)}.</p>

<h2>Buy Cannabis Seeds in ${state.name} Cities</h2>
<p>Local growing conditions vary across ${state.name}. Click your city for climate-specific recommendations:</p>
${citiesHtml}

<h2>Nearby States</h2>
<p>Explore cannabis seed guides for states near ${state.name}:</p>
${relatedHtml}

<h2>Growing Resources for ${state.name}</h2>
${blogRefs.map(ref => `<p>${ref}</p>`).join('\n')}

<h2>Frequently Asked Questions — ${state.name}</h2>
${faqHtml}

<p>${hubLink()} | ${a('Shop All Seeds', '/product-category/shop-all-cannabis-seeds')}</p>
`;

  return {
    slug: state.slug,
    title: `Buy Cannabis Seeds in ${state.name}`,
    content,
    metaTitle: `Buy Cannabis Seeds in ${state.name} | ${state.topStrainTypes[0].charAt(0).toUpperCase() + state.topStrainTypes[0].slice(1)} | Royal King Seeds`,
    metaDescription: `Shop cannabis seeds for ${state.name}'s ${state.climate} climate. ${strains.slice(0, 3).join(', ')} and more. ${state.frostFreeDays} frost-free days. ${legalStatusLabel}. Discreet shipping to ${state.abbreviation}.`,
    pageType: 'state',
    state: state.name,
  };
}

// ── City Page Generator ──
function generateCityPage(stateKey: string, citySlug: string): LocationPage | null {
  const state = STATE_DATA[stateKey];
  if (!state) return null;

  const city = state.cities.find(c => c.slug === citySlug);
  if (!city) return null;

  const slug = `${state.slug}-${city.slug}`;
  const opener = pick(slug, CITY_OPENERS, 'cityopener');
  const strains = pickN(slug, STRAINS_BY_CLIMATE[state.climate], 3, 'citystrains');
  const otherCities = state.cities.filter(c => c.slug !== citySlug);

  // Strain recommendations
  let strainsHtml = '';
  for (let i = 0; i < strains.length; i++) {
    const strain = strains[i];
    const desc = pick(slug + strain, [
      `Handles ${city.name}'s local conditions well — ${city.note ? city.note.toLowerCase() + '.' : `the ${state.climate} climate zone typical of ${state.name}.`}`,
      `A reliable choice for ${city.name} growers who want ${i === 0 ? 'a proven performer' : i === 1 ? 'variety in their garden' : 'a backup strain that delivers consistently'}.`,
      `Performs in the ${state.climate} conditions around ${city.name}. ${state.frostFreeDays > 200 ? 'The long season lets this strain fully mature outdoors.' : 'Start indoors and transplant after last frost for best results.'}`,
    ], 'cdesc' + i);
    strainsHtml += `<h3>${i + 1}. ${strain}</h3>\n<p>${desc}</p>\n`;
  }

  // Nearby cities
  let nearbyCitiesHtml = '';
  if (otherCities.length > 0) {
    nearbyCitiesHtml = '<h2>More Cannabis Seed Guides Near ' + city.name + '</h2>\n<ul>\n';
    for (const c of otherCities) {
      nearbyCitiesHtml += `<li>${a(`Buy Cannabis Seeds in ${c.name}, ${state.abbreviation}`, `/seeds/usa/${state.slug}/${c.slug}`)}</li>\n`;
    }
    nearbyCitiesHtml += '</ul>';
  }

  // Pick a blog ref
  const blogRef = pick(slug, [
    `For step-by-step starting advice, our ${BL.germ} covers methods that produce the most consistent results.`,
    `Managing your grow environment matters more than strain hype. Our ${BL.lights} and ${BL.vpd} cover the fundamentals.`,
    `Autoflowers simplify growing for ${city.name} residents — our ${BL.autoGuide} covers the specific techniques.`,
    `New to growing? Our ${BL.nutrients} and ${BL.germ} cover the fundamentals every ${city.name} grower should know.`,
  ], 'cityblog');

  const content = `
<h1>Buy Cannabis Seeds in ${city.name}, ${state.name}</h1>

<p>${opener(city, state)}</p>

<p>Royal King Seeds ships directly to ${city.name} with discreet, tracked packaging. We stock ${CL.fem}, ${CL.auto}, ${CL.ind}, ${CL.sat}, and ${CL.cbd} — all available for delivery to ${state.abbreviation} addresses.</p>

<h2>Local Growing Conditions in ${city.name}</h2>
<p>${city.note || `${city.name} falls within ${state.name}'s ${state.climate} climate zone.`} ${state.name} averages ${state.frostFreeDays} frost-free days, though local conditions in the ${city.name} area may vary by 10-20 days depending on elevation and urban heat effects.</p>
<p>${state.indoorOutdoor}</p>

<h2>Top 3 Strains for ${city.name} Growers</h2>
${strainsHtml}
<p>See more options in our ${CL.all} or browse ${CL.best} that ${state.abbreviation} customers order most frequently.</p>

<h2>Cannabis Laws in ${city.name}, ${state.name}</h2>
<p>${state.legalNote}</p>
<p>Cannabis seeds are sold as collector items and genetic preservation specimens. ${a(`Read the full ${state.name} legal guide`, `/seeds/usa/${state.slug}/is-marijuana-legal`)}.</p>

<h2>Growing Resources</h2>
<p>${blogRef}</p>

${nearbyCitiesHtml}

<p>${a(`Buy Cannabis Seeds in ${state.name}`, `/seeds/usa/${state.slug}`)} | ${hubLink()} | ${a('Shop All Seeds', '/product-category/shop-all-cannabis-seeds')}</p>
`;

  return {
    slug: `${state.slug}/${city.slug}`,
    title: `Buy Cannabis Seeds in ${city.name}, ${state.name}`,
    content,
    metaTitle: `Buy Cannabis Seeds in ${city.name}, ${state.abbreviation} | Royal King Seeds`,
    metaDescription: `Cannabis seeds shipped to ${city.name}, ${state.name}. ${strains.slice(0, 2).join(' and ')} recommended for local growing conditions. Discreet delivery to ${state.abbreviation}.`,
    pageType: 'city',
    state: state.name,
    city: city.name,
  };
}

// ── Legality Page Generator ──
function generateLegalityPage(stateKey: string): LocationPage | null {
  const state = STATE_DATA[stateKey];
  if (!state) return null;

  const slug = `${state.slug}-legal`;
  const year = 2026;

  const statusLabel = state.legalStatus === 'recreational' ? 'Legal (Recreational & Medical)' :
    state.legalStatus === 'medical' ? 'Medical Cannabis Only' :
    state.legalStatus === 'decriminalized' ? 'Decriminalized' : 'Illegal';

  const homeGrowSection = pick(slug, [
    state.legalStatus === 'recreational'
      ? `<p>${state.name} allows home cultivation for adults 21 and older. Check your local municipality for any additional restrictions beyond the state law. Growing limits, plant counts, and security requirements vary — the state guide above covers the specifics.</p>`
      : state.legalStatus === 'medical'
      ? `<p>Home cultivation in ${state.name} is ${state.legalNote.toLowerCase().includes('no home cultivation') ? 'not permitted under the current medical program. Patients must purchase from licensed dispensaries.' : 'available to qualifying medical patients under the state program. Check the current rules for plant count limits and registration requirements.'}</p>`
      : `<p>Home cultivation is not legally permitted in ${state.name} under current law. Cannabis seeds may be purchased and possessed as collector items and genetic preservation specimens.</p>`,
  ], 'homegrow');

  const content = `
<h1>Is Marijuana Legal in ${state.name}? ${year} Update</h1>

<p><strong>Current Status:</strong> ${statusLabel}</p>

<p>${state.legalNote}</p>

<h2>Medical vs Recreational Cannabis in ${state.name}</h2>
<p>${state.legalStatus === 'recreational'
  ? `${state.name} has legalized both medical and recreational cannabis. Adults 21 and older may purchase, possess, and in most cases cultivate cannabis within state limits. Medical patients may have access to higher possession limits and additional product types depending on the program structure.`
  : state.legalStatus === 'medical'
  ? `${state.name} has a medical cannabis program but has not legalized recreational use. Access requires a qualifying condition and patient registration. Products, possession limits, and allowed forms vary by program — check the state's health department for current details.`
  : state.legalStatus === 'decriminalized'
  ? `${state.name} has decriminalized cannabis possession for small amounts, reducing penalties from criminal charges to civil fines. However, there is no regulated medical or recreational sales framework. This is a middle ground that reduces enforcement but does not create legal access to cannabis products.`
  : `${state.name} has not legalized cannabis for medical or recreational use. Possession, cultivation, and sale remain criminal offenses under state law. Legislative efforts may be underway — check current news for the latest developments.`
}</p>

<h2>Home Cultivation Rules</h2>
${homeGrowSection}

<h2>Buying Cannabis Seeds in ${state.name}</h2>
<p>Ungerminated cannabis seeds contain negligible THC and are available for purchase as collector items, genetic preservation specimens, and educational materials. Royal King Seeds ships to all ${state.name} addresses with discreet, trackable packaging.</p>
<p>Browse our ${CL.all} including ${CL.fem}, ${CL.auto}, ${CL.ind}, and ${CL.sat}.</p>

<p>${a(`Buy Cannabis Seeds in ${state.name}`, `/seeds/usa/${state.slug}`)} | ${hubLink()} | ${a('Shop All Seeds', '/product-category/shop-all-cannabis-seeds')}</p>
`;

  return {
    slug: `${state.slug}/is-marijuana-legal`,
    title: `Is Marijuana Legal in ${state.name}? ${year} Update`,
    content,
    metaTitle: `Is Marijuana Legal in ${state.name}? ${year} Laws & Home Grow Rules`,
    metaDescription: `${state.name} cannabis laws in ${year}: ${statusLabel}. Home cultivation rules, medical vs recreational breakdown, and where to buy seeds legally.`,
    pageType: 'legality',
    state: state.name,
  };
}

// ════════════════════════════════════════════════════════════
// PUBLIC API
// ════════════════════════════════════════════════════════════

function findStateKeyBySlug(slug: string): string | undefined {
  return Object.keys(STATE_DATA).find(key => STATE_DATA[key].slug === slug);
}

export function generateLocationPage(slug: string): LocationPage | null {
  // Normalize: remove leading/trailing slashes
  const parts = slug.replace(/^\/+|\/+$/g, '').split('/');

  // Hub page: "usa" or empty
  if (parts.length === 0 || (parts.length === 1 && (parts[0] === 'usa' || parts[0] === ''))) {
    return generateHubPage();
  }

  // Remove "usa" prefix if present
  const pathParts = parts[0] === 'usa' ? parts.slice(1) : parts;

  if (pathParts.length === 0) {
    return generateHubPage();
  }

  const stateSlug = pathParts[0];
  const stateKey = findStateKeyBySlug(stateSlug);

  if (!stateKey) return null;

  // State page: just the state slug
  if (pathParts.length === 1) {
    return generateStatePage(stateKey);
  }

  // Legality page: state/is-marijuana-legal
  if (pathParts.length === 2 && pathParts[1] === 'is-marijuana-legal') {
    return generateLegalityPage(stateKey);
  }

  // City page: state/city
  if (pathParts.length === 2) {
    return generateCityPage(stateKey, pathParts[1]);
  }

  return null;
}

export function getAllStateSlugs(): { slug: string; state: string }[] {
  return Object.values(STATE_DATA)
    .map(s => ({ slug: s.slug, state: s.name }))
    .sort((a, b) => a.state.localeCompare(b.state));
}

export function getCitySlugsForState(stateSlug: string): { slug: string; city: string; state: string }[] {
  const stateKey = findStateKeyBySlug(stateSlug);
  if (!stateKey) return [];
  const state = STATE_DATA[stateKey];
  return state.cities.map(c => ({
    slug: c.slug,
    city: c.name,
    state: state.name,
  }));
}

// Internal helper for related states
function getRelatedStatesInternal(stateKey: string): StateInfo[] {
  const state = STATE_DATA[stateKey];
  if (!state) return [];
  // Return states in the same region, excluding self, max 5
  const sameRegion = Object.values(STATE_DATA)
    .filter(s => s.region === state.region && s.slug !== state.slug);
  return pickN(state.slug, sameRegion, Math.min(5, sameRegion.length), 'related');
}

export function getRelatedStates(stateSlug: string): { slug: string; state: string }[] {
  const stateKey = findStateKeyBySlug(stateSlug);
  if (!stateKey) return [];
  return getRelatedStatesInternal(stateKey).map(s => ({ slug: s.slug, state: s.name }));
}
