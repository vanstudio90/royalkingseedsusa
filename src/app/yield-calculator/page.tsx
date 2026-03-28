'use client';

import { useState } from 'react';
import Link from 'next/link';

type Environment = 'indoor' | 'outdoor';
type LightType = 'led' | 'hps' | 'cfl' | 'sunlight';
type Experience = 'beginner' | 'intermediate' | 'advanced';
type SeedType = 'autoflower' | 'feminized' | 'both';

interface Results {
  yieldLow: number;
  yieldHigh: number;
  yieldPerPlantLow: number;
  yieldPerPlantHigh: number;
  plantCount: number;
  cyclesPerYear: number;
  annualLow: number;
  annualHigh: number;
}

const YIELD_PER_SQFT: Record<LightType, [number, number]> = {
  led: [0.5, 1.0],
  hps: [0.75, 1.25],
  cfl: [0.25, 0.5],
  sunlight: [0.75, 2.0],
};

const PLANTS_PER_SQFT: Record<SeedType, number> = {
  autoflower: 1.5,
  feminized: 1.0,
  both: 1.25,
};

const EXP_MULTIPLIER: Record<Experience, number> = {
  beginner: 0.75,
  intermediate: 1.0,
  advanced: 1.2,
};

const STRAIN_RECS: Record<string, { name: string; slug: string; yield: string; type: string; difficulty: string }[]> = {
  'indoor-high-yield': [
    { name: 'Northern Lights Feminized', slug: 'northern-lights-feminized', yield: '500-600g/m²', type: 'Indica', difficulty: 'Easy' },
    { name: 'White Widow Feminized', slug: 'white-widow-feminized', yield: '450-500g/m²', type: 'Hybrid', difficulty: 'Easy' },
    { name: 'Girl Scout Cookies Feminized', slug: 'girl-scout-cookies-feminized', yield: '400-500g/m²', type: 'Hybrid', difficulty: 'Moderate' },
    { name: 'Blue Dream Feminized', slug: 'blue-dream-feminized', yield: '500-600g/m²', type: 'Sativa', difficulty: 'Moderate' },
  ],
  'outdoor-high-yield': [
    { name: 'Big Bud Feminized', slug: 'big-bud-feminized', yield: '600-800g/plant', type: 'Indica', difficulty: 'Easy' },
    { name: 'Critical Mass Feminized', slug: 'critical-mass-feminized', yield: '500-700g/plant', type: 'Indica', difficulty: 'Easy' },
    { name: 'Amnesia Haze Feminized', slug: 'amnesia-haze-feminized', yield: '600-700g/plant', type: 'Sativa', difficulty: 'Moderate' },
    { name: 'OG Kush Feminized', slug: 'og-kush-feminized', yield: '500-600g/plant', type: 'Hybrid', difficulty: 'Moderate' },
  ],
  'autoflower-high-yield': [
    { name: 'Northern Lights Auto', slug: 'northern-lights-autoflower', yield: '400-500g/m²', type: 'Auto Indica', difficulty: 'Easy' },
    { name: 'Gorilla Glue Auto', slug: 'gorilla-glue-autoflower', yield: '350-500g/m²', type: 'Auto Hybrid', difficulty: 'Easy' },
    { name: 'Amnesia Haze Auto', slug: 'amnesia-haze-autoflower', yield: '400-450g/m²', type: 'Auto Sativa', difficulty: 'Easy' },
    { name: 'Critical Auto', slug: 'critical-autoflower', yield: '400-500g/m²', type: 'Auto Indica', difficulty: 'Easy' },
  ],
  'beginner': [
    { name: 'Northern Lights Auto', slug: 'northern-lights-autoflower', yield: '400-500g/m²', type: 'Auto Indica', difficulty: 'Very Easy' },
    { name: 'White Widow Auto', slug: 'white-widow-autoflower', yield: '350-450g/m²', type: 'Auto Hybrid', difficulty: 'Very Easy' },
    { name: 'Blue Dream Auto', slug: 'blue-dream-autoflower', yield: '350-400g/m²', type: 'Auto Sativa', difficulty: 'Easy' },
    { name: 'AK-47 Auto', slug: 'ak-47-autoflower', yield: '350-450g/m²', type: 'Auto Hybrid', difficulty: 'Easy' },
  ],
};

function calculate(sqft: number, env: Environment, light: LightType, exp: Experience, seedType: SeedType): Results {
  const [low, high] = YIELD_PER_SQFT[light];
  const mult = EXP_MULTIPLIER[exp];
  const plantCount = Math.max(1, Math.round(sqft * PLANTS_PER_SQFT[seedType]));

  const yieldLow = parseFloat((sqft * low * mult).toFixed(1));
  const yieldHigh = parseFloat((sqft * high * mult).toFixed(1));
  const yieldPerPlantLow = parseFloat((yieldLow / plantCount).toFixed(1));
  const yieldPerPlantHigh = parseFloat((yieldHigh / plantCount).toFixed(1));

  const cyclesPerYear = env === 'outdoor' ? 1 : seedType === 'autoflower' ? 4 : 2;
  const annualLow = parseFloat((yieldLow * cyclesPerYear).toFixed(1));
  const annualHigh = parseFloat((yieldHigh * cyclesPerYear).toFixed(1));

  return { yieldLow, yieldHigh, yieldPerPlantLow, yieldPerPlantHigh, plantCount, cyclesPerYear, annualLow, annualHigh };
}

export default function YieldCalculatorPage() {
  const [sqft, setSqft] = useState(16);
  const [env, setEnv] = useState<Environment>('indoor');
  const [light, setLight] = useState<LightType>('led');
  const [exp, setExp] = useState<Experience>('beginner');
  const [seedType, setSeedType] = useState<SeedType>('autoflower');
  const [results, setResults] = useState<Results | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = () => {
    const r = calculate(sqft, env, light, exp, seedType);
    setResults(r);
    setShowResults(true);
    setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const getStrainKey = () => {
    if (exp === 'beginner') return 'beginner';
    if (seedType === 'autoflower') return 'autoflower-high-yield';
    return env === 'outdoor' ? 'outdoor-high-yield' : 'indoor-high-yield';
  };

  const SPACE_PRESETS = [
    { label: '2x2 Tent', sqft: 4 },
    { label: '2x4 Tent', sqft: 8 },
    { label: '4x4 Tent', sqft: 16 },
    { label: '5x5 Tent', sqft: 25 },
    { label: '4x8 Tent', sqft: 32 },
    { label: '10x10 Room', sqft: 100 },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <div className="text-[12px] text-[#192026]/40 mb-6">
        <Link href="/" className="hover:text-[#275C53]">Home</Link>
        <span className="mx-2">›</span>
        <span className="text-[#192026]/60">Yield Calculator</span>
      </div>

      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>
          Cannabis Yield Calculator
        </h1>
        <p className="text-[#192026]/55 max-w-2xl mx-auto text-sm leading-relaxed">
          Estimate your indoor or outdoor cannabis harvest, get plant count recommendations, and discover the best high-yield strains for your grow space.
        </p>
      </div>

      <div className="flex gap-8 items-start flex-col lg:flex-row">
        {/* Calculator */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl border border-[#275C53]/10 p-6 sm:p-8 mb-8">
            <h2 className="text-lg font-bold text-[#275C53] mb-6" style={{ fontFamily: 'var(--font-patua)' }}>Calculate Your Yield</h2>

            {/* Space Size */}
            <div className="mb-6">
              <label className="text-[11px] uppercase tracking-[1px] text-[#192026]/40 font-semibold block mb-2">Grow Space Size (sq ft)</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {SPACE_PRESETS.map(p => (
                  <button key={p.label} onClick={() => setSqft(p.sqft)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors cursor-pointer ${sqft === p.sqft ? 'bg-[#275C53] text-white' : 'bg-[#F5F0EA] text-[#275C53] hover:bg-[#275C53]/10'}`}>
                    {p.label}
                  </button>
                ))}
              </div>
              <input type="range" min={1} max={200} value={sqft} onChange={e => setSqft(Number(e.target.value))}
                className="w-full accent-[#275C53]" />
              <div className="flex justify-between text-[11px] text-[#192026]/30 mt-1">
                <span>1 sq ft</span>
                <span className="text-[#275C53] font-bold text-sm">{sqft} sq ft</span>
                <span>200 sq ft</span>
              </div>
            </div>

            {/* Environment */}
            <div className="mb-6">
              <label className="text-[11px] uppercase tracking-[1px] text-[#192026]/40 font-semibold block mb-2">Growing Environment</label>
              <div className="grid grid-cols-2 gap-3">
                {([['indoor', '💡', 'Indoor'], ['outdoor', '☀️', 'Outdoor']] as const).map(([val, icon, label]) => (
                  <button key={val} onClick={() => { setEnv(val); if (val === 'outdoor') setLight('sunlight'); else if (light === 'sunlight') setLight('led'); }}
                    className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${env === val ? 'border-[#275C53] bg-[#275C53]/5' : 'border-[#192026]/10 hover:border-[#275C53]/30'}`}>
                    <span className="text-2xl block mb-1">{icon}</span>
                    <span className="text-[13px] font-semibold text-[#275C53]">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Light Type */}
            {env === 'indoor' && (
              <div className="mb-6">
                <label className="text-[11px] uppercase tracking-[1px] text-[#192026]/40 font-semibold block mb-2">Light Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {([['led', 'LED'], ['hps', 'HPS'], ['cfl', 'CFL']] as const).map(([val, label]) => (
                    <button key={val} onClick={() => setLight(val)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${light === val ? 'border-[#275C53] bg-[#275C53]/5' : 'border-[#192026]/10 hover:border-[#275C53]/30'}`}>
                      <span className="text-[13px] font-semibold text-[#275C53]">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Seed Type */}
            <div className="mb-6">
              <label className="text-[11px] uppercase tracking-[1px] text-[#192026]/40 font-semibold block mb-2">Seed Type</label>
              <div className="grid grid-cols-3 gap-3">
                {([['autoflower', '⚡', 'Autoflower'], ['feminized', '🌿', 'Feminized'], ['both', '🧬', 'Mixed']] as const).map(([val, icon, label]) => (
                  <button key={val} onClick={() => setSeedType(val)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${seedType === val ? 'border-[#275C53] bg-[#275C53]/5' : 'border-[#192026]/10 hover:border-[#275C53]/30'}`}>
                    <span className="text-lg">{icon}</span>
                    <span className="text-[12px] font-semibold text-[#275C53] block mt-0.5">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="mb-6">
              <label className="text-[11px] uppercase tracking-[1px] text-[#192026]/40 font-semibold block mb-2">Experience Level</label>
              <div className="grid grid-cols-3 gap-3">
                {([['beginner', '🌱', 'Beginner'], ['intermediate', '🌿', 'Intermediate'], ['advanced', '🌳', 'Advanced']] as const).map(([val, icon, label]) => (
                  <button key={val} onClick={() => setExp(val)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${exp === val ? 'border-[#275C53] bg-[#275C53]/5' : 'border-[#192026]/10 hover:border-[#275C53]/30'}`}>
                    <span className="text-lg">{icon}</span>
                    <span className="text-[12px] font-semibold text-[#275C53] block mt-0.5">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleCalculate}
              className="w-full py-4 bg-[#275C53] text-white rounded-xl text-[14px] font-bold uppercase tracking-[1px] hover:bg-[#1e4a42] transition-colors cursor-pointer">
              Calculate My Yield
            </button>
          </div>

          {/* Results */}
          {showResults && results && (
            <div id="results" className="mb-10 scroll-mt-24">
              <div className="bg-[#275C53] rounded-2xl p-6 sm:p-8 text-white mb-6">
                <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Your Estimated Yield</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <span className="text-2xl sm:text-3xl font-bold text-[#D7B65D] block">{results.yieldLow}–{results.yieldHigh}</span>
                    <span className="text-white/60 text-[11px] uppercase tracking-[1px]">oz per harvest</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <span className="text-2xl sm:text-3xl font-bold text-[#D7B65D] block">{results.plantCount}</span>
                    <span className="text-white/60 text-[11px] uppercase tracking-[1px]">plants</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <span className="text-2xl sm:text-3xl font-bold text-[#D7B65D] block">{results.yieldPerPlantLow}–{results.yieldPerPlantHigh}</span>
                    <span className="text-white/60 text-[11px] uppercase tracking-[1px]">oz per plant</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <span className="text-2xl sm:text-3xl font-bold text-[#D7B65D] block">{results.annualLow}–{results.annualHigh}</span>
                    <span className="text-white/60 text-[11px] uppercase tracking-[1px]">oz per year ({results.cyclesPerYear} cycle{results.cyclesPerYear > 1 ? 's' : ''})</span>
                  </div>
                </div>
                <p className="text-white/40 text-[11px] mt-4">* Estimates based on {sqft} sq ft, {env}, {light.toUpperCase()} lighting, {exp} level. Actual results vary by genetics, environment, and technique.</p>
              </div>

              {/* Strain Recommendations */}
              <div className="bg-white rounded-2xl border border-[#275C53]/10 p-6 sm:p-8 mb-6">
                <h3 className="text-lg font-bold text-[#275C53] mb-1" style={{ fontFamily: 'var(--font-patua)' }}>Recommended Strains for Your Setup</h3>
                <p className="text-[12px] text-[#192026]/40 mb-4">High-yield genetics matched to your grow environment and experience level.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(STRAIN_RECS[getStrainKey()] || STRAIN_RECS['indoor-high-yield']).map(s => (
                    <Link key={s.slug} href={`/${s.slug}`}
                      className="flex items-center gap-4 p-4 rounded-xl border border-[#275C53]/5 hover:border-[#D7B65D]/40 hover:shadow-sm transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-[#275C53]/5 flex items-center justify-center shrink-0">
                        <span className="text-xl">🌱</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] font-semibold text-[#275C53] group-hover:text-[#D7B65D] transition-colors">{s.name}</h4>
                        <div className="flex gap-3 text-[10px] text-[#192026]/40 mt-0.5">
                          <span>{s.type}</span>
                          <span>{s.yield}</span>
                          <span>{s.difficulty}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="flex gap-3 mt-5">
                  <Link href="/product-category/best-strains-for-high-yield" className="inline-block px-6 py-3 bg-[#275C53] text-white rounded-xl text-[13px] font-bold hover:bg-[#1e4a42] transition-colors">
                    Shop High Yield Seeds
                  </Link>
                  <Link href="/product-category/autoflowering-seeds" className="inline-block px-6 py-3 bg-[#F5F0EA] text-[#275C53] rounded-xl text-[13px] font-bold hover:bg-[#275C53] hover:text-white transition-colors">
                    Shop Autoflower Seeds
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* SEO Content */}
          <div className="space-y-10 max-w-3xl">
            <section>
              <h2 className="text-xl font-bold text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>How Much Cannabis Can You Yield?</h2>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed mb-3">Cannabis yield depends on four main factors: grow space size, lighting, genetics, and grower experience. Indoor growers using LED lights typically harvest 0.5 to 1.0 ounces per square foot, while HPS setups can push 0.75 to 1.25 oz/sq ft. Outdoor plants have the highest potential — a single plant in open ground can produce 1 to 5+ ounces depending on climate and strain.</p>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed">Our yield calculator uses these baseline ranges and adjusts for your experience level and seed type. Autoflowering seeds allow more harvest cycles per year (up to 4 indoors), while feminized photoperiod strains typically produce larger individual harvests.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>Cannabis Yield Per Square Foot — What to Expect</h2>
              <div className="bg-white rounded-2xl border border-[#275C53]/5 overflow-hidden mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F5F0EA]">
                      <th className="text-left px-4 py-3 text-[11px] uppercase tracking-[1px] text-[#275C53] font-semibold">Light Type</th>
                      <th className="text-left px-4 py-3 text-[11px] uppercase tracking-[1px] text-[#275C53] font-semibold">Yield / sq ft</th>
                      <th className="text-left px-4 py-3 text-[11px] uppercase tracking-[1px] text-[#275C53] font-semibold">Best For</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#192026]/5"><td className="px-4 py-3 text-[#192026]/70">LED</td><td className="px-4 py-3 font-semibold text-[#275C53]">0.5–1.0 oz</td><td className="px-4 py-3 text-[#192026]/50">Energy efficiency, full spectrum</td></tr>
                    <tr className="border-b border-[#192026]/5"><td className="px-4 py-3 text-[#192026]/70">HPS</td><td className="px-4 py-3 font-semibold text-[#275C53]">0.75–1.25 oz</td><td className="px-4 py-3 text-[#192026]/50">Maximum intensity, proven results</td></tr>
                    <tr className="border-b border-[#192026]/5"><td className="px-4 py-3 text-[#192026]/70">CFL</td><td className="px-4 py-3 font-semibold text-[#275C53]">0.25–0.5 oz</td><td className="px-4 py-3 text-[#192026]/50">Small spaces, supplemental</td></tr>
                    <tr><td className="px-4 py-3 text-[#192026]/70">Sunlight (Outdoor)</td><td className="px-4 py-3 font-semibold text-[#275C53]">0.75–2.0 oz</td><td className="px-4 py-3 text-[#192026]/50">Highest potential per plant</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed">These ranges represent realistic expectations for properly maintained grows. Factors like <Link href="/blog/cannabis-nutrient-deficiencies" className="text-[#275C53] hover:text-[#D7B65D]">nutrient management</Link>, <Link href="/blog/vpd-and-humidity-control-in-cannabis-cultivation" className="text-[#275C53] hover:text-[#D7B65D]">VPD control</Link>, and <Link href="/blog/cannabis-plant-pruning-and-topping" className="text-[#275C53] hover:text-[#D7B65D]">plant training</Link> can push you toward the higher end.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>How to Increase Cannabis Yields</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Choose High-Yield Genetics', desc: 'Strain selection is the #1 factor. Some strains are bred specifically for heavy harvests.', link: '/product-category/best-strains-for-high-yield', cta: 'Shop High Yield Seeds' },
                  { title: 'Use Training Techniques', desc: 'LST, topping, and ScrOG can increase yields 20-40% by maximizing light exposure.', link: '/blog/cannabis-plant-pruning-and-topping', cta: 'Read Training Guide' },
                  { title: 'Optimize Your Lighting', desc: 'More light = more yield (to a point). LED and HPS both deliver strong results.', link: '/blog/cannabis-growing-lights-and-phases', cta: 'Read Light Guide' },
                  { title: 'Dial In Nutrients', desc: 'Proper feeding through each stage prevents deficiencies and maximizes bud development.', link: '/blog/cannabis-nutrient-deficiencies', cta: 'Read Nutrient Guide' },
                ].map(item => (
                  <Link key={item.title} href={item.link}
                    className="bg-white rounded-xl border border-[#275C53]/5 p-5 hover:shadow-sm transition-all group">
                    <h3 className="text-[14px] font-semibold text-[#275C53] group-hover:text-[#D7B65D] transition-colors">{item.title}</h3>
                    <p className="text-[12px] text-[#192026]/50 mt-1 leading-relaxed">{item.desc}</p>
                    <span className="text-[11px] text-[#275C53] font-semibold mt-2 block">{item.cta} →</span>
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>Best High-Yield Cannabis Strains</h2>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed mb-4">The right genetics make the biggest difference. These strains consistently produce above-average harvests when given proper care. Whether you grow <Link href="/product-category/autoflowering-seeds" className="text-[#275C53] hover:text-[#D7B65D]">autoflowering seeds</Link> for faster cycles or <Link href="/product-category/feminized-seeds" className="text-[#275C53] hover:text-[#D7B65D]">feminized photoperiod seeds</Link> for maximum single-harvest weight, choosing yield-oriented genetics is your foundation.</p>
              <div className="flex flex-wrap gap-2">
                <Link href="/product-category/best-strains-for-high-yield" className="px-4 py-2 bg-[#275C53] text-white rounded-full text-[12px] font-semibold hover:bg-[#1e4a42] transition-colors">High Yield Seeds</Link>
                <Link href="/product-category/autoflowering-seeds" className="px-4 py-2 bg-[#F5F0EA] text-[#275C53] rounded-full text-[12px] font-semibold hover:bg-[#275C53] hover:text-white transition-colors">Autoflower Seeds</Link>
                <Link href="/product-category/feminized-seeds" className="px-4 py-2 bg-[#F5F0EA] text-[#275C53] rounded-full text-[12px] font-semibold hover:bg-[#275C53] hover:text-white transition-colors">Feminized Seeds</Link>
                <Link href="/product-category/best-strains-for-outdoor-growing" className="px-4 py-2 bg-[#F5F0EA] text-[#275C53] rounded-full text-[12px] font-semibold hover:bg-[#275C53] hover:text-white transition-colors">Outdoor Seeds</Link>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>Indoor vs Outdoor Yield Comparison</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-[#275C53]/5 p-5">
                  <h3 className="text-[14px] font-semibold text-[#275C53] mb-2">💡 Indoor Growing</h3>
                  <ul className="text-[13px] text-[#192026]/60 space-y-1.5">
                    <li>• Typical: 0.5–1.25 oz per sq ft</li>
                    <li>• 2–4 harvests per year</li>
                    <li>• Full control over environment</li>
                    <li>• Year-round growing</li>
                    <li>• Higher startup cost, lower risk</li>
                  </ul>
                </div>
                <div className="bg-white rounded-xl border border-[#275C53]/5 p-5">
                  <h3 className="text-[14px] font-semibold text-[#275C53] mb-2">☀️ Outdoor Growing</h3>
                  <ul className="text-[13px] text-[#192026]/60 space-y-1.5">
                    <li>• Typical: 1–5+ oz per plant</li>
                    <li>• 1 harvest per year (fall)</li>
                    <li>• Free sunlight, lower costs</li>
                    <li>• Larger plants possible</li>
                    <li>• Weather and pest risks</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* FAQ Schema */}
            <section>
              <h2 className="text-xl font-bold text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  { q: 'How much weed can I grow in a 4x4 tent?', a: 'A 4x4 tent (16 sq ft) with LED lighting typically yields 8–16 ounces per harvest for an intermediate grower. Beginners can expect 6–12 ounces. Using high-yield genetics and training techniques can push you toward the upper range.' },
                  { q: 'How many plants per square foot for cannabis?', a: 'For autoflowers, plan 1–2 plants per square foot. For feminized photoperiod plants with training, 1 plant per square foot is standard. In a 4x4 tent, most growers run 4–9 plants depending on pot size and training method.' },
                  { q: 'Cannabis yield LED vs HPS — which is better?', a: 'Modern LEDs match or exceed HPS yields while using 30–40% less electricity. HPS delivers 0.75–1.25 oz/sq ft while quality LEDs deliver 0.5–1.0 oz/sq ft. The gap has closed significantly, and LED advantages in heat management and spectrum control make them the preferred choice for most growers.' },
                  { q: 'How much does an outdoor cannabis plant yield?', a: 'A single outdoor cannabis plant can yield 1–5+ ounces depending on strain, climate, and growing season length. In warm climates with long seasons (California, Southern states), plants can reach massive sizes. High-yield outdoor strains like Big Bud and Critical Mass are bred for heavy harvests.' },
                  { q: 'How do autoflower yields compare to feminized?', a: 'Individual autoflower plants yield less than feminized photoperiod plants (typically 1–4 oz vs 2–8 oz per plant). However, autoflowers complete in 8–10 weeks and allow 3–4 harvests per year indoors, often matching or exceeding annual yields from photoperiod plants.' },
                ].map(faq => (
                  <div key={faq.q} className="bg-white rounded-xl border border-[#275C53]/5 p-5">
                    <h3 className="text-[14px] font-semibold text-[#275C53] mb-2">{faq.q}</h3>
                    <p className="text-[13px] text-[#192026]/55 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-[300px] shrink-0 space-y-5 lg:self-start lg:sticky lg:top-4">
          <div className="bg-white rounded-2xl border border-[#275C53]/5 p-5">
            <h3 className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-3">Related Guides</h3>
            <div className="space-y-2">
              {[
                { label: 'Indoor Growing Guide', href: '/blog/cannabis-growing-lights-and-phases' },
                { label: 'Outdoor Growing Guide', href: '/blog/rainy-season-outdoors-fast-finishing-seeds-that-beat-the-storms' },
                { label: 'Autoflower Grow Guide', href: '/blog/autoflower-cannabis-seeds-and-growing-guide' },
                { label: 'Training & Topping', href: '/blog/cannabis-plant-pruning-and-topping' },
                { label: 'Nutrient Guide', href: '/blog/cannabis-nutrient-deficiencies' },
                { label: 'When to Harvest', href: '/blog/cannabis-trichomes-and-harvesting' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="block text-[13px] text-[#192026]/60 hover:text-[#275C53] transition-colors py-0.5">→ {l.label}</Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#275C53]/5 p-5">
            <h3 className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-3">Shop Seeds</h3>
            <div className="space-y-2">
              {[
                { label: 'High Yield Seeds', href: '/product-category/best-strains-for-high-yield' },
                { label: 'Autoflower Seeds', href: '/product-category/autoflowering-seeds' },
                { label: 'Feminized Seeds', href: '/product-category/feminized-seeds' },
                { label: 'Outdoor Strains', href: '/product-category/best-strains-for-outdoor-growing' },
                { label: 'High THC Seeds', href: '/product-category/high-tch-seeds' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="block text-[13px] text-[#275C53] hover:text-[#D7B65D] transition-colors py-0.5 font-medium">→ {l.label}</Link>
              ))}
            </div>
          </div>

          <div className="bg-[#275C53] rounded-2xl p-5 text-center">
            <p className="text-white/80 text-[13px] mb-3">Find the perfect seeds for your grow</p>
            <Link href="/strain-finder" className="inline-block w-full py-3 bg-white text-[#275C53] rounded-xl text-[13px] font-bold hover:bg-[#D7B65D] hover:text-white transition-colors">
              Take the Strain Finder Quiz
            </Link>
          </div>

          <div className="bg-[#F5F0EA] rounded-2xl p-5">
            <h3 className="text-[10px] uppercase tracking-[1px] text-[#275C53]/50 font-semibold mb-2">About This Tool</h3>
            <p className="text-[12px] text-[#192026]/50 leading-relaxed">
              Our yield calculator provides estimates based on grow space, lighting, and experience level. Actual yields depend on genetics, environment, nutrients, and growing technique. Use these estimates as a starting point for planning your grow.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
