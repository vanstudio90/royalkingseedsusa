'use client';

import { useState } from 'react';
import Link from 'next/link';

type Stage = 'seedling' | 'early-veg' | 'late-veg' | 'early-flower' | 'mid-flower' | 'late-flower';
type Medium = 'soil' | 'coco' | 'hydro';
type PlantType = 'autoflower' | 'photoperiod';
type Experience = 'beginner' | 'intermediate' | 'advanced';

interface FeedPlan {
  ecLow: number; ecHigh: number;
  ppmLow: number; ppmHigh: number;
  frequency: string;
  emphasis: string;
  notes: string;
  caution: string;
  summary: string;
  flushNote: string;
}

const STAGE_LABELS: Record<Stage, string> = {
  'seedling': 'Seedling', 'early-veg': 'Early Veg', 'late-veg': 'Late Veg',
  'early-flower': 'Early Flower', 'mid-flower': 'Mid Flower', 'late-flower': 'Late Flower',
};

const FEED_DATA: Record<Medium, Record<Stage, { ec: [number, number]; ppm: [number, number]; emphasis: string; freq: string; notes: string; flush: string }>> = {
  soil: {
    'seedling': { ec: [0.2, 0.4], ppm: [100, 200], emphasis: 'Very light — root development focus', freq: 'Water only for first 1-2 weeks, then light feed every 3rd watering', notes: 'Most quality soils contain enough nutrients for 2-3 weeks. Avoid feeding until you see 3-4 true leaf sets.', flush: 'Not needed at this stage.' },
    'early-veg': { ec: [0.6, 0.8], ppm: [300, 400], emphasis: 'Nitrogen (N) dominant — leafy growth', freq: 'Feed every other watering, water-only between feeds', notes: 'Start at 25-50% of the nutrient label dose. Increase gradually as the plant grows and shows hunger signs (light green new growth).', flush: 'Not needed. Plain water between feeds provides natural flushing.' },
    'late-veg': { ec: [0.8, 1.2], ppm: [400, 600], emphasis: 'Nitrogen (N) with increasing phosphorus (P)', freq: 'Feed 2 out of every 3 waterings', notes: 'This is when plants are most vigorous. They can handle stronger feeds but watch for dark green leaves (nitrogen excess) or leaf tip burn (overall excess).', flush: 'A light flush with plain water every 7-10 days helps prevent salt buildup.' },
    'early-flower': { ec: [1.0, 1.4], ppm: [500, 700], emphasis: 'Transition — reduce nitrogen, increase phosphorus (P) and potassium (K)', freq: 'Feed every other watering with bloom nutrients', notes: 'Switch to bloom nutrients when you see pistils forming. The plant still needs some nitrogen during the stretch phase but the ratio shifts toward P and K.', flush: 'Optional light flush during the transition to remove excess nitrogen salts.' },
    'mid-flower': { ec: [1.2, 1.6], ppm: [600, 800], emphasis: 'Phosphorus (P) and Potassium (K) dominant — bud development', freq: 'Feed 2 out of 3 waterings with bloom nutrients', notes: 'Peak feeding stage. Buds are forming and the plant demands more P and K. This is when high-yield strains really benefit from adequate nutrition. Monitor for any deficiency signs.', flush: 'Light flush every 10-14 days recommended to prevent lockout.' },
    'late-flower': { ec: [0.6, 1.0], ppm: [300, 500], emphasis: 'Reduced feeding — ripening and flushing', freq: 'Reduce feed strength by 30-50%, increase plain water days', notes: 'Begin reducing nutrients 1-2 weeks before expected harvest. Some growers flush with plain water for the final 5-10 days to improve taste and smoothness.', flush: 'Final flush with plain pH-adjusted water for 5-10 days before harvest. This is the most common flushing window.' },
  },
  coco: {
    'seedling': { ec: [0.3, 0.5], ppm: [150, 250], emphasis: 'Light feed with cal-mag supplement', freq: 'Light fertigation daily or every other day', notes: 'Coco has no built-in nutrients — you must feed from the start. Always add cal-mag (150-200 PPM base) before other nutrients. Keep coco moist but not saturated.', flush: 'Not needed. Consistent light feeding is key.' },
    'early-veg': { ec: [0.8, 1.0], ppm: [400, 500], emphasis: 'Nitrogen (N) dominant with cal-mag base', freq: 'Feed every watering — coco should never dry out completely', notes: 'Coco coir is an inert medium that requires consistent feeding. Unlike soil, there is no nutrient buffer. Feed at every watering with 10-20% runoff to prevent salt buildup.', flush: 'Run 10-20% runoff at each watering to naturally flush excess salts.' },
    'late-veg': { ec: [1.0, 1.4], ppm: [500, 700], emphasis: 'Nitrogen (N) with increasing bloom elements', freq: 'Feed every watering with 10-20% runoff', notes: 'Plants in coco grow faster than in soil and can handle higher feeding frequencies. Monitor EC of runoff — if it rises above input EC by more than 0.3, increase runoff percentage to flush accumulating salts.', flush: 'Monitor runoff EC. If it exceeds input by 0.3+, flush with half-strength nutrients until runoff normalizes.' },
    'early-flower': { ec: [1.2, 1.6], ppm: [600, 800], emphasis: 'Transition to bloom — increase P and K, maintain cal-mag', freq: 'Feed every watering, adjust to bloom nutrient ratio', notes: 'Transition to bloom nutrients when pistils appear. Maintain cal-mag supplementation throughout flower — coco locks out calcium easily. The switch from veg to bloom nutrients should be gradual over 3-5 days.', flush: 'Optional transition flush with half-strength bloom nutrients for 1-2 days.' },
    'mid-flower': { ec: [1.4, 1.8], ppm: [700, 900], emphasis: 'Phosphorus (P) and Potassium (K) heavy — peak bloom nutrition', freq: 'Feed every watering with full bloom nutrients', notes: 'Peak nutrient demand. Coco allows aggressive feeding that would cause issues in soil. Monitor runoff EC and pH closely. This is where high-yield genetics really benefit from coco precision. Watch for any leaf tip burn as an early sign of excess.', flush: 'Monitor runoff EC weekly. Flush if runoff exceeds input EC by 0.5+.' },
    'late-flower': { ec: [0.8, 1.2], ppm: [400, 600], emphasis: 'Reduced bloom feed — ripening phase', freq: 'Reduce strength by 30-40%, maintain daily watering', notes: 'Begin reducing nutrient strength 7-10 days before expected harvest. Some growers in coco do a full flush with plain pH-adjusted water for the final 3-7 days. Others simply reduce feed strength gradually. Both approaches work.', flush: 'Final flush with plain water + cal-mag for 3-7 days before harvest.' },
  },
  hydro: {
    'seedling': { ec: [0.3, 0.5], ppm: [150, 250], emphasis: 'Very light nutrients — root establishment', freq: 'Continuous recirculating feed at low strength', notes: 'Hydro seedlings are extremely sensitive to overfeeding. Start very low and increase slowly. Maintain reservoir temperature at 65-68°F for optimal oxygen levels. pH stability is critical — keep between 5.5-6.0.', flush: 'Not applicable. Reservoir changes every 7-10 days keep the system fresh.' },
    'early-veg': { ec: [0.8, 1.0], ppm: [400, 500], emphasis: 'Nitrogen (N) dominant — rapid vegetative growth', freq: 'Continuous feed via recirculating system', notes: 'Hydro plants grow significantly faster than soil or coco. Expect rapid root and canopy development. Monitor pH daily — hydro pH can drift quickly. Change reservoir every 7-10 days with fresh nutrients.', flush: 'Full reservoir change every 7-10 days acts as a natural flush.' },
    'late-veg': { ec: [1.2, 1.6], ppm: [600, 800], emphasis: 'Nitrogen (N) with pre-bloom elements', freq: 'Continuous feed — top off reservoir between changes', notes: 'Plants grow aggressively in hydro during late veg. Monitor EC of the reservoir — if it rises, plants are drinking more water than nutrients (add plain water). If it drops, plants are consuming nutrients faster than water (top off with nutrient solution).', flush: 'Reservoir change before switching to bloom nutrients.' },
    'early-flower': { ec: [1.4, 1.8], ppm: [700, 900], emphasis: 'Transition to bloom — phosphorus and potassium increasing', freq: 'Continuous feed with bloom nutrients', notes: 'Drain and refill reservoir with bloom-ratio nutrients when switching to 12/12 or when pistils appear on autoflowers. Hydro allows the most precise nutrient control during the critical flower transition. pH should be maintained at 5.8-6.0 during flower.', flush: 'Complete reservoir change with fresh bloom nutrients at the transition.' },
    'mid-flower': { ec: [1.6, 2.0], ppm: [800, 1000], emphasis: 'Peak bloom nutrition — heavy P and K', freq: 'Continuous feed at peak strength', notes: 'Highest nutrient demand stage. Hydro systems deliver nutrients directly to roots with maximum efficiency, supporting heavy bud development. This is where hydro growers see the biggest yield advantages. Monitor pH twice daily during peak flower.', flush: 'Reservoir change every 7 days during peak flower for best results.' },
    'late-flower': { ec: [0.8, 1.2], ppm: [400, 600], emphasis: 'Reduced feed — ripening and pre-harvest', freq: 'Reduce nutrient strength, maintain reservoir circulation', notes: 'Begin reducing nutrients 7-10 days before harvest. Many hydro growers run plain pH-adjusted water for the final 3-5 days. Keep the reservoir clean and oxygenated. Stale reservoir water during late flower can cause root issues and affect final product quality.', flush: 'Final flush with plain pH-adjusted water for 3-5 days. Drain and refill reservoir with plain water.' },
  },
};

const STRAIN_RECS: Record<string, { name: string; slug: string; type: string; yield: string; difficulty: string; reason: string }[]> = {
  beginner: [
    { name: 'Northern Lights Auto', slug: 'northern-lights-autoflower', type: 'Auto Indica', yield: 'Moderate-High', difficulty: 'Very Easy', reason: 'Extremely forgiving with nutrients — tolerates light feeding and minor mistakes without stress.' },
    { name: 'White Widow Auto', slug: 'white-widow-autoflower', type: 'Auto Hybrid', yield: 'Moderate', difficulty: 'Easy', reason: 'Robust genetics that handle variable feeding well. Great for growers learning nutrient management.' },
    { name: 'Blue Dream Feminized', slug: 'blue-dream-feminized', type: 'Fem Hybrid', yield: 'High', difficulty: 'Easy', reason: 'Vigorous grower that communicates hunger clearly through leaf color, making nutrient management intuitive.' },
  ],
  'high-yield': [
    { name: 'Big Bud Feminized', slug: 'big-bud-feminized', type: 'Fem Indica', yield: 'Very High', difficulty: 'Moderate', reason: 'Heavy feeder during bloom that rewards structured nutrient plans with exceptional bud weight.' },
    { name: 'Gorilla Glue Feminized', slug: 'gorilla-glue-feminized', type: 'Fem Hybrid', yield: 'Very High', difficulty: 'Moderate', reason: 'Responds strongly to increased P and K during mid-flower. Thrives with precise coco or hydro feeding.' },
    { name: 'Critical Mass Feminized', slug: 'critical-mass-feminized', type: 'Fem Indica', yield: 'Very High', difficulty: 'Moderate', reason: 'Bred for maximum bud production — performs best with consistent, structured feeding through flower.' },
  ],
  indoor: [
    { name: 'Girl Scout Cookies Fem', slug: 'girl-scout-cookies-feminized', type: 'Fem Hybrid', yield: 'High', difficulty: 'Moderate', reason: 'Excellent response to controlled indoor feeding programs. Compact enough for any tent size.' },
    { name: 'OG Kush Feminized', slug: 'og-kush-feminized', type: 'Fem Hybrid', yield: 'Moderate-High', difficulty: 'Moderate', reason: 'Classic indoor performer that responds well to moderate, consistent feeding through all stages.' },
    { name: 'Northern Lights Feminized', slug: 'northern-lights-feminized', type: 'Fem Indica', yield: 'High', difficulty: 'Easy', reason: 'The easiest indoor strain to feed. Tolerant of both under and overfeeding within reasonable ranges.' },
  ],
  autoflower: [
    { name: 'Gorilla Glue Auto', slug: 'gorilla-glue-autoflower', type: 'Auto Hybrid', yield: 'High', difficulty: 'Easy', reason: 'Performs well with lighter autoflower feeding schedules while still producing impressive yields.' },
    { name: 'Northern Lights Auto', slug: 'northern-lights-autoflower', type: 'Auto Indica', yield: 'Moderate-High', difficulty: 'Very Easy', reason: 'The most nutrient-forgiving autoflower available. Perfect for growers learning feeding management.' },
    { name: 'Amnesia Haze Auto', slug: 'amnesia-haze-autoflower', type: 'Auto Sativa', yield: 'Moderate-High', difficulty: 'Easy', reason: 'Good feeder that produces well on moderate nutrient programs without demanding heavy bloom supplementation.' },
  ],
};

function getStrainKey(stage: Stage, medium: Medium, plantType: PlantType): string {
  if (plantType === 'autoflower') return 'autoflower';
  if (['seedling', 'early-veg'].includes(stage)) return 'beginner';
  if (medium === 'coco' || medium === 'hydro') return 'high-yield';
  if (['mid-flower', 'late-flower'].includes(stage)) return 'high-yield';
  return 'indoor';
}

function calculate(stage: Stage, medium: Medium, plantType: PlantType, exp: Experience): FeedPlan {
  const data = FEED_DATA[medium][stage];
  const expMult = exp === 'beginner' ? 0.85 : exp === 'advanced' ? 1.1 : 1.0;
  const autoMult = plantType === 'autoflower' ? 0.8 : 1.0;
  const mult = expMult * autoMult;

  const ecLow = parseFloat((data.ec[0] * mult).toFixed(2));
  const ecHigh = parseFloat((data.ec[1] * mult).toFixed(2));
  const ppmLow = Math.round(data.ppm[0] * mult);
  const ppmHigh = Math.round(data.ppm[1] * mult);

  const mediumName = medium === 'coco' ? 'coco coir' : medium;
  const stageName = STAGE_LABELS[stage].toLowerCase();

  return {
    ecLow, ecHigh, ppmLow, ppmHigh,
    frequency: data.freq,
    emphasis: data.emphasis,
    notes: data.notes,
    caution: plantType === 'autoflower'
      ? 'Autoflowers are more sensitive to overfeeding than photoperiod plants. Start at the lower end and increase only if the plant shows hunger signs (light green new growth, slow development).'
      : exp === 'beginner'
        ? 'As a newer grower, start at the lower end of these ranges. It is much easier to add more nutrients than to recover from overfeeding.'
        : 'Monitor plant response and adjust within these ranges. Every strain and environment is slightly different.',
    summary: `Based on your ${stageName} stage in ${mediumName}${plantType === 'autoflower' ? ' with autoflowering genetics' : ''}, this setup typically benefits from ${stage.includes('flower') ? 'bloom-focused nutrition with emphasis on phosphorus and potassium' : 'growth-focused nutrition with nitrogen emphasis'}. Start at the lower end of the EC range (${ecLow}) and increase gradually only if the plant remains healthy and shows signs of hunger.`,
    flushNote: data.flush,
  };
}

export default function NutrientCalculatorPage() {
  const [stage, setStage] = useState<Stage>('late-veg');
  const [medium, setMedium] = useState<Medium>('soil');
  const [plantType, setPlantType] = useState<PlantType>('photoperiod');
  const [exp, setExp] = useState<Experience>('beginner');
  const [brand, setBrand] = useState('');
  const [results, setResults] = useState<FeedPlan | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = () => {
    setResults(calculate(stage, medium, plantType, exp));
    setShowResults(true);
    setTimeout(() => document.getElementById('nutrient-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const handleReset = () => {
    setStage('late-veg'); setMedium('soil'); setPlantType('photoperiod'); setExp('beginner'); setBrand('');
    setResults(null); setShowResults(false);
  };

  const strainKey = getStrainKey(stage, medium, plantType);
  const strains = STRAIN_RECS[strainKey] || STRAIN_RECS.indoor;

  const getContextualCtas = () => {
    const ctas: { label: string; href: string }[] = [];
    if (stage.includes('flower')) {
      ctas.push({ label: 'Shop High-Yield Flowering Strains', href: '/product-category/best-strains-for-high-yield' });
    } else {
      ctas.push({ label: 'Shop Beginner-Friendly Seeds', href: '/product-category/autoflowering-seeds' });
    }
    if (medium === 'coco') ctas.push({ label: 'Shop Fast Indoor Strains', href: '/product-category/best-strains-for-indoor-growing' });
    else if (medium === 'soil') ctas.push({ label: 'Shop Easy-Grow Strains', href: '/product-category/autoflowering-seeds' });
    else ctas.push({ label: 'Shop High-Performance Seeds', href: '/product-category/best-strains-for-high-yield' });
    return ctas;
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <div className="text-[12px] text-[#192026]/40 mb-6">
        <Link href="/" className="hover:text-[#275C53]">Home</Link><span className="mx-2">›</span>
        <span className="text-[#192026]/60">Nutrient Calculator</span>
      </div>

      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>Cannabis Nutrient Calculator</h1>
        <p className="text-[#192026]/55 max-w-2xl mx-auto text-sm leading-relaxed mb-4">
          Calculate a stage-based cannabis feeding recommendation for <Link href="/blog/cannabis-nutrient-deficiencies" className="text-[#275C53] hover:text-[#D7B65D]">soil, coco, or hydro setups</Link>, including EC and PPM targets. Built from real growing data to help you feed smarter — not harder.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-[12px] text-[#192026]/50">
          <span>🌱 Stage-based nutrient guidance</span>
          <span>🧪 Soil, coco & hydro support</span>
          <span>📊 EC and PPM recommendations</span>
        </div>
      </div>

      {/* Pre-Tool Quick Answers (SEO Entry Points) */}
      <div className="bg-white rounded-2xl border border-[#275C53]/10 p-6 mb-8 max-w-3xl mx-auto">
        <h2 className="text-[11px] font-bold text-[#275C53] uppercase tracking-[1.5px] mb-3">Quick Cannabis Feeding Answers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          {[
            { q: 'Ideal EC for cannabis in veg:', a: '0.6–1.4 depending on medium and stage' },
            { q: 'Flowering PPM range:', a: '600–1000 depending on medium and week' },
            { q: 'Soil feeding frequency:', a: 'Every 2–3 waterings (alternate with plain water)' },
            { q: 'Coco feeding frequency:', a: 'Every watering — small daily feeds with runoff' },
            { q: 'Autoflower nutrients:', a: '~20% less than photoperiod plants' },
            { q: 'When to start feeding seedlings:', a: 'After 3-4 true leaf sets (2-3 weeks in soil)' },
          ].map(item => (
            <div key={item.q} className="flex gap-2 py-1.5">
              <span className="text-[12px] text-[#275C53] font-semibold shrink-0">{item.q}</span>
              <span className="text-[12px] text-[#192026]/50">{item.a}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-8 items-start flex-col lg:flex-row">
        <div className="flex-1 min-w-0">

          {/* Calculator Card */}
          <div className="bg-white rounded-2xl border border-[#275C53]/10 p-6 sm:p-8 mb-8">
            <h2 className="text-lg font-bold text-[#275C53] mb-6" style={{ fontFamily: 'var(--font-patua)' }}>Calculate Your Feeding Plan</h2>

            {/* Plant Stage */}
            <div className="mb-6">
              <label className="text-[11px] uppercase tracking-[1px] text-[#192026]/40 font-semibold block mb-2">Plant Stage</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {(Object.entries(STAGE_LABELS) as [Stage, string][]).map(([val, label]) => (
                  <button key={val} onClick={() => setStage(val)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer text-[11px] font-semibold ${stage === val ? 'border-[#275C53] bg-[#275C53]/5 text-[#275C53]' : 'border-[#192026]/10 text-[#192026]/40 hover:border-[#275C53]/30'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Medium */}
            <div className="mb-6">
              <label className="text-[11px] uppercase tracking-[1px] text-[#192026]/40 font-semibold block mb-2">Growing Medium</label>
              <div className="grid grid-cols-3 gap-3">
                {([['soil', '🌍', 'Soil'], ['coco', '🥥', 'Coco Coir'], ['hydro', '💧', 'Hydroponic']] as const).map(([val, icon, label]) => (
                  <button key={val} onClick={() => setMedium(val)}
                    className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${medium === val ? 'border-[#275C53] bg-[#275C53]/5' : 'border-[#192026]/10 hover:border-[#275C53]/30'}`}>
                    <span className="text-2xl block mb-1">{icon}</span>
                    <span className="text-[12px] font-semibold text-[#275C53]">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Plant Type + Experience */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-[11px] uppercase tracking-[1px] text-[#192026]/40 font-semibold block mb-2">Seed Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {([['autoflower', '⚡', 'Autoflower'], ['photoperiod', '🌿', 'Photoperiod']] as const).map(([val, icon, label]) => (
                    <button key={val} onClick={() => setPlantType(val)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${plantType === val ? 'border-[#275C53] bg-[#275C53]/5' : 'border-[#192026]/10 hover:border-[#275C53]/30'}`}>
                      <span className="text-lg">{icon}</span>
                      <span className="text-[11px] font-semibold text-[#275C53] block">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[1px] text-[#192026]/40 font-semibold block mb-2">Experience Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {([['beginner', '🌱'], ['intermediate', '🌿'], ['advanced', '🌳']] as const).map(([val, icon]) => (
                    <button key={val} onClick={() => setExp(val)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${exp === val ? 'border-[#275C53] bg-[#275C53]/5' : 'border-[#192026]/10 hover:border-[#275C53]/30'}`}>
                      <span className="text-lg">{icon}</span>
                      <span className="text-[10px] font-semibold text-[#275C53] block capitalize">{val}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Brand (optional) */}
            <div className="mb-6">
              <label className="text-[11px] uppercase tracking-[1px] text-[#192026]/40 font-semibold block mb-2">Nutrient Brand <span className="text-[#192026]/20">(Optional)</span></label>
              <select value={brand} onChange={e => setBrand(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F5F0EA] border-none rounded-xl text-sm text-[#192026] focus:outline-none focus:ring-1 focus:ring-[#275C53]/30 cursor-pointer">
                <option value="">Any / General</option>
                <option value="general-hydroponics">General Hydroponics</option>
                <option value="fox-farm">Fox Farm</option>
                <option value="advanced-nutrients">Advanced Nutrients</option>
                <option value="biobizz">BioBizz</option>
                <option value="canna">CANNA</option>
                <option value="botanicare">Botanicare</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button onClick={handleCalculate}
                className="flex-1 py-4 bg-[#275C53] text-white rounded-xl text-[14px] font-bold uppercase tracking-[1px] hover:bg-[#1e4a42] transition-colors cursor-pointer">
                Generate Feeding Plan
              </button>
              <button onClick={handleReset}
                className="px-5 py-4 bg-[#F5F0EA] text-[#192026]/40 rounded-xl text-[13px] font-semibold hover:text-[#192026]/60 transition-colors cursor-pointer">
                Reset
              </button>
            </div>
          </div>

          {/* Results */}
          {showResults && results && (
            <div id="nutrient-results" className="mb-10 scroll-mt-24">
              {/* Result Cards */}
              <div className="bg-[#275C53] rounded-2xl p-6 sm:p-8 text-white mb-6">
                <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-patua)' }}>Your Feeding Plan</h2>
                <p className="text-white/50 text-[13px] mb-5">{STAGE_LABELS[stage]} stage in {medium === 'coco' ? 'coco coir' : medium} · {plantType === 'autoflower' ? 'Autoflower' : 'Photoperiod'} · {exp} level{brand ? ` · Compatible with ${brand.replace(/-/g, ' ')} feeding patterns` : ''}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <span className="text-2xl font-bold text-[#D7B65D] block">{results.ecLow}–{results.ecHigh}</span>
                    <span className="text-white/50 text-[10px] uppercase tracking-[1px]">EC Range</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <span className="text-2xl font-bold text-[#D7B65D] block">{results.ppmLow}–{results.ppmHigh}</span>
                    <span className="text-white/50 text-[10px] uppercase tracking-[1px]">PPM Range</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <span className="text-[13px] font-semibold text-white block leading-snug">{results.emphasis.split('—')[0]}</span>
                    <span className="text-white/50 text-[10px] uppercase tracking-[1px]">Nutrient Focus</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <span className="text-[13px] font-semibold text-white block leading-snug">{results.frequency.split(',')[0]}</span>
                    <span className="text-white/50 text-[10px] uppercase tracking-[1px]">Feed Schedule</span>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-white/5 rounded-xl p-4 mb-4">
                  <p className="text-white/70 text-[13px] leading-relaxed">{results.summary}</p>
                </div>

                {/* Stage Notes */}
                <div className="bg-white/5 rounded-xl p-4 mb-4">
                  <h3 className="text-[10px] uppercase tracking-[1px] text-[#D7B65D] font-semibold mb-2">Stage Notes</h3>
                  <p className="text-white/60 text-[12px] leading-relaxed">{results.notes}</p>
                </div>

                {/* Flush */}
                <div className="bg-white/5 rounded-xl p-4 mb-4">
                  <h3 className="text-[10px] uppercase tracking-[1px] text-[#D7B65D] font-semibold mb-2">Flushing Guidance</h3>
                  <p className="text-white/60 text-[12px] leading-relaxed">{results.flushNote}</p>
                </div>

                <p className="text-white/25 text-[10px]">Estimates are a planning tool. Actual needs vary by genetics, environment, water quality, and nutrient line.</p>
              </div>

              {/* Caution Strip */}
              <div className="bg-amber-50 border border-amber-200/50 rounded-2xl p-5 mb-6">
                <p className="text-[13px] text-amber-800">{results.caution}</p>
              </div>

              {/* Conversion Bridge */}
              <div className="bg-[#D7B65D]/10 border border-[#D7B65D]/20 rounded-2xl p-5 mb-6 text-center">
                <p className="text-[14px] text-[#275C53] font-semibold">Looking for genetics that perform well with this feeding plan?</p>
                <p className="text-[12px] text-[#192026]/50 mt-1">Explore strains matched to your grow style below.</p>
              </div>

              {/* Strain Recommendations */}
              <div className="bg-white rounded-2xl border border-[#275C53]/10 p-6 sm:p-8 mb-6">
                <h3 className="text-lg font-bold text-[#275C53] mb-1" style={{ fontFamily: 'var(--font-patua)' }}>Recommended Strains for Your Setup</h3>
                <p className="text-[12px] text-[#192026]/40 mb-4">Genetics selected based on your {medium === 'coco' ? 'coco coir' : medium} medium and {STAGE_LABELS[stage].toLowerCase()} feeding requirements.</p>
                <div className="space-y-3">
                  {strains.map(s => (
                    <Link key={s.slug} href={`/${s.slug}`}
                      className="flex items-start gap-4 p-4 rounded-xl border border-[#275C53]/5 hover:border-[#D7B65D]/40 hover:shadow-sm transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-[#275C53]/5 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xl">🌱</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="text-[14px] font-semibold text-[#275C53] group-hover:text-[#D7B65D] transition-colors">{s.name}</h4>
                          <span className="text-[9px] bg-[#275C53] text-white px-1.5 py-0.5 rounded font-medium">Matches Setup</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-1.5">
                          <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium">{s.type}</span>
                          <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium">{s.yield} Yield</span>
                          <span className="text-[9px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-medium">{s.difficulty}</span>
                        </div>
                        <p className="text-[12px] text-[#192026]/50 leading-relaxed">{s.reason}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 mt-5">
                  {getContextualCtas().map(cta => (
                    <Link key={cta.href} href={cta.href} className="inline-block px-5 py-3 bg-[#275C53] text-white rounded-xl text-[12px] font-bold hover:bg-[#1e4a42] transition-colors">{cta.label}</Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick Answers */}
          <div className="bg-white rounded-2xl border border-[#275C53]/10 p-6 mb-10">
            <h2 className="text-lg font-bold text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Quick Feeding Answers</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div><h3 className="text-[13px] font-semibold text-[#275C53] mb-1">Seedling EC?</h3><p className="text-[20px] font-bold text-[#D7B65D]">0.2–0.5</p><p className="text-[11px] text-[#192026]/40">Very light — most soils provide enough</p></div>
              <div><h3 className="text-[13px] font-semibold text-[#275C53] mb-1">Flower PPM?</h3><p className="text-[20px] font-bold text-[#D7B65D]">600–1000</p><p className="text-[11px] text-[#192026]/40">Varies by medium and stage</p></div>
              <div><h3 className="text-[13px] font-semibold text-[#275C53] mb-1">Soil vs Coco?</h3><p className="text-[20px] font-bold text-[#D7B65D]">Less vs More</p><p className="text-[11px] text-[#192026]/40">Soil buffers more, coco needs daily feed</p></div>
              <div><h3 className="text-[13px] font-semibold text-[#275C53] mb-1">Autoflower feed?</h3><p className="text-[20px] font-bold text-[#D7B65D]">20% Less</p><p className="text-[11px] text-[#192026]/40">Lighter than photoperiod plants</p></div>
            </div>
          </div>

          {/* SEO Content */}
          <div className="space-y-10 max-w-3xl">
            <section>
              <h2 className="text-xl font-bold text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>How the Cannabis Nutrient Calculator Works</h2>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed mb-3">This tool uses your plant&apos;s growth stage and growing medium to estimate a practical feeding range. Rather than generic feeding charts that apply the same numbers to every situation, our calculator adjusts recommendations based on whether you grow in <Link href="/blog/cannabis-nutrient-deficiencies" className="text-[#275C53] hover:text-[#D7B65D]">soil, coco coir, or hydroponic systems</Link> — because each medium handles nutrients very differently.</p>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed">EC (electrical conductivity) and PPM (parts per million) are the two primary measurements growers use to gauge nutrient strength. Our calculator provides target ranges for both, along with feeding frequency, nutrient emphasis, and flush timing. The ranges are deliberately conservative — starting lower and increasing gradually is always safer than starting too strong. If you select autoflowering seeds, the calculator automatically reduces recommendations by 20% to account for their lighter feeding requirements.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>Cannabis Feeding Schedule Generator — Soil, Coco & Hydro</h2>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed mb-3">Our calculator creates personalized feeding schedules based on your specific growing medium and plant stage. Unlike static feeding charts, the schedule generator accounts for whether you grow in soil (less frequent, buffered feeding), <Link href="/blog/cannabis-nutrient-deficiencies" className="text-[#275C53] hover:text-[#D7B65D]">coco coir</Link> (daily feeding with runoff monitoring), or hydroponic systems (continuous feed with tight EC management).</p>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed">The generated schedule includes feed frequency, nutrient strength targets (EC and PPM), stage-specific nutrient emphasis (nitrogen for veg, phosphorus and potassium for flower), and flushing guidance. Growers using <Link href="/product-category/autoflowering-seeds" className="text-[#275C53] hover:text-[#D7B65D]">autoflowering cannabis seeds</Link> receive automatically adjusted schedules with 20% lower nutrient concentrations to match their lighter feeding requirements. Scroll up to the calculator to generate your custom feeding schedule.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>Cannabis Feeding by Growth Stage</h2>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed mb-4">Cannabis nutrient requirements change dramatically as plants progress from seedling to harvest. Understanding what your plant needs at each stage is the foundation of successful feeding.</p>
              <div className="bg-white rounded-2xl border border-[#275C53]/5 overflow-hidden mb-4">
                <table className="w-full text-sm">
                  <thead><tr className="bg-[#F5F0EA]">
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-[1px] text-[#275C53] font-semibold">Stage</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-[1px] text-[#275C53] font-semibold">EC Range</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-[1px] text-[#275C53] font-semibold">Primary Focus</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-[1px] text-[#275C53] font-semibold">Key Nutrient</th>
                  </tr></thead>
                  <tbody>
                    <tr className="border-b border-[#192026]/5"><td className="px-4 py-3 text-[#192026]/70">Seedling</td><td className="px-4 py-3 font-semibold text-[#275C53]">0.2–0.5</td><td className="px-4 py-3 text-[#192026]/50">Root development</td><td className="px-4 py-3 text-[#192026]/50">Very light / water only</td></tr>
                    <tr className="border-b border-[#192026]/5"><td className="px-4 py-3 text-[#192026]/70">Early Veg</td><td className="px-4 py-3 font-semibold text-[#275C53]">0.6–1.0</td><td className="px-4 py-3 text-[#192026]/50">Leaf & stem growth</td><td className="px-4 py-3 text-[#192026]/50">Nitrogen (N)</td></tr>
                    <tr className="border-b border-[#192026]/5"><td className="px-4 py-3 text-[#192026]/70">Late Veg</td><td className="px-4 py-3 font-semibold text-[#275C53]">0.8–1.4</td><td className="px-4 py-3 text-[#192026]/50">Vigorous canopy</td><td className="px-4 py-3 text-[#192026]/50">N with increasing P</td></tr>
                    <tr className="border-b border-[#192026]/5"><td className="px-4 py-3 text-[#192026]/70">Early Flower</td><td className="px-4 py-3 font-semibold text-[#275C53]">1.0–1.6</td><td className="px-4 py-3 text-[#192026]/50">Transition to bloom</td><td className="px-4 py-3 text-[#192026]/50">P & K increasing</td></tr>
                    <tr className="border-b border-[#192026]/5"><td className="px-4 py-3 text-[#192026]/70">Mid Flower</td><td className="px-4 py-3 font-semibold text-[#275C53]">1.2–2.0</td><td className="px-4 py-3 text-[#192026]/50">Bud development</td><td className="px-4 py-3 text-[#192026]/50">P & K dominant</td></tr>
                    <tr><td className="px-4 py-3 text-[#192026]/70">Late Flower</td><td className="px-4 py-3 font-semibold text-[#275C53]">0.6–1.2</td><td className="px-4 py-3 text-[#192026]/50">Ripening & flush</td><td className="px-4 py-3 text-[#192026]/50">Reduced / flush</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed"><strong>Seedlings</strong> need almost no external nutrients — most quality soils provide enough for the first 2-3 weeks. <strong>Vegetative plants</strong> demand nitrogen for leaf and stem development. The <strong>flowering stage</strong> shifts demand toward phosphorus and potassium for bud formation. <strong>Late flower</strong> involves reducing nutrients and often flushing with plain water to improve final product quality. <Link href="/blog/cannabis-trichomes-and-harvesting" className="text-[#275C53] hover:text-[#D7B65D]">Harvest timing</Link> and final flush duration vary by medium and grower preference.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>Soil vs Coco vs Hydro — Feeding Differences</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="bg-white rounded-xl border border-[#275C53]/5 p-5">
                  <h3 className="text-[14px] font-semibold text-[#275C53] mb-2">🌍 Soil</h3>
                  <ul className="text-[13px] text-[#192026]/60 space-y-1.5">
                    <li>• Built-in nutrient buffer</li>
                    <li>• Feed every other watering</li>
                    <li>• Most forgiving medium</li>
                    <li>• Natural pH stability</li>
                    <li>• Best for beginners</li>
                  </ul>
                </div>
                <div className="bg-white rounded-xl border border-[#275C53]/5 p-5">
                  <h3 className="text-[14px] font-semibold text-[#275C53] mb-2">🥥 Coco Coir</h3>
                  <ul className="text-[13px] text-[#192026]/60 space-y-1.5">
                    <li>• No nutrient buffer — feed every watering</li>
                    <li>• Needs cal-mag supplementation</li>
                    <li>• Faster growth than soil</li>
                    <li>• Monitor runoff EC closely</li>
                    <li>• Best for yield-focused growers</li>
                  </ul>
                </div>
                <div className="bg-white rounded-xl border border-[#275C53]/5 p-5">
                  <h3 className="text-[14px] font-semibold text-[#275C53] mb-2">💧 Hydroponic</h3>
                  <ul className="text-[13px] text-[#192026]/60 space-y-1.5">
                    <li>• Most precise nutrient control</li>
                    <li>• Continuous feed via reservoir</li>
                    <li>• Fastest growth rates</li>
                    <li>• pH and EC must be monitored daily</li>
                    <li>• Best for experienced growers</li>
                  </ul>
                </div>
              </div>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed">Soil naturally buffers nutrients, making it the most forgiving medium for beginners. Coco coir is an inert medium that requires consistent feeding at every watering — it offers faster growth but less margin for error. Hydroponic systems deliver nutrients directly to roots with maximum efficiency, producing the fastest growth and highest yields, but requiring the most knowledge and monitoring. Your medium choice should match your experience level and how much time you can dedicate to plant care.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>EC and PPM Explained for Cannabis Growers</h2>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed mb-3"><strong>EC (Electrical Conductivity)</strong> measures the total dissolved mineral content in your nutrient solution. Higher EC means more concentrated nutrients. It is measured in millisiemens per centimeter (mS/cm) and is the most universal measurement used by cannabis growers worldwide.</p>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed mb-3"><strong>PPM (Parts Per Million)</strong> is another way to measure nutrient concentration. There are two PPM scales: the 500 scale (multiply EC by 500) and the 700 scale (multiply EC by 700). Our calculator uses the 500 scale, which is the most common in the United States. When reading PPM values from other sources, confirm which scale they use.</p>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed">Ranges matter more than exact numbers. Every strain, environment, and water source creates slightly different conditions. A grower using hard tap water (200+ PPM base) will need to account for those dissolved minerals before adding nutrients. A grower using RO or distilled water starts from near zero. Our calculator provides ranges — start at the lower end and increase only if plants show hunger signs like light green new growth or slowed development.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>Common Cannabis Feeding Mistakes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: 'Starting Too Strong', desc: 'The most common mistake. Seedlings need almost no nutrients. Start at 25% of label dose and increase gradually. More plants are damaged by overfeeding than underfeeding.' },
                  { title: 'Feeding Seedlings Like Adults', desc: 'Seedlings have tiny root systems that cannot process concentrated nutrients. Wait until you see 3-4 true leaf sets before introducing any feed. Quality soil provides enough for the first 2-3 weeks.' },
                  { title: 'Ignoring Runoff in Coco', desc: 'Coco growers must check runoff EC regularly. If runoff EC exceeds input EC by more than 0.3, salts are accumulating. Flush with half-strength nutrients until runoff normalizes.' },
                  { title: 'Confusing Deficiency and Toxicity', desc: 'Nutrient burn (toxicity) and nutrient lockout often look similar. Before adding more nutrients to fix a deficiency, check your pH and EC first. The issue is often lockout, not shortage.' },
                  { title: 'Same Feed for Every Medium', desc: 'Soil, coco, and hydro have fundamentally different feeding requirements. A feed schedule designed for soil will underwater coco plants, and a hydro schedule will burn soil plants.' },
                  { title: 'Not Adjusting for Autoflowers', desc: 'Autoflowers need roughly 20% less nutrients than photoperiod plants. Their shorter lifecycle and smaller root systems make them more sensitive to overfeeding.' },
                ].map(item => (
                  <div key={item.title} className="bg-white rounded-xl border border-[#275C53]/5 p-4">
                    <h3 className="text-[13px] font-semibold text-[#275C53] mb-1">{item.title}</h3>
                    <p className="text-[12px] text-[#192026]/50 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>How to Choose Strains for Your Feeding Style</h2>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed mb-3">Not all cannabis strains handle nutrients the same way. Some are heavy feeders that reward aggressive nutrition programs with massive yields. Others are sensitive to overfeeding and prefer lighter, more conservative schedules. Matching your strain selection to your feeding style — or vice versa — is one of the most overlooked factors in growing success.</p>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed mb-3"><Link href="/product-category/autoflowering-seeds" className="text-[#275C53] hover:text-[#D7B65D]">Autoflowering strains</Link> generally need lighter feeding due to their shorter lifecycle and smaller root systems. <Link href="/product-category/best-strains-for-high-yield" className="text-[#275C53] hover:text-[#D7B65D]">High-yield strains</Link> like Big Bud and Critical Mass are heavy feeders during bloom and reward structured feeding programs. Beginner-friendly strains like Northern Lights and White Widow are forgiving of feeding mistakes — they tolerate both slight overfeeding and underfeeding without major stress.</p>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed">If you are new to nutrients, start with forgiving genetics in soil. If you are chasing maximum yields in coco or hydro, choose strains bred for heavy production and feed them precisely through bloom. Use our <Link href="/strain-finder" className="text-[#275C53] hover:text-[#D7B65D]">strain finder quiz</Link> or <Link href="/yield-calculator" className="text-[#275C53] hover:text-[#D7B65D]">yield calculator</Link> to find genetics matched to your growing goals.</p>
            </section>

            {/* Week-by-Week Feeding Chart */}
            <section>
              <h2 className="text-xl font-bold text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>Cannabis Feeding Chart by Week</h2>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed mb-4">This week-by-week feeding chart provides general EC and PPM targets for cannabis grown in soil. <Link href="/blog/cannabis-nutrient-deficiencies" className="text-[#275C53] hover:text-[#D7B65D]">Coco coir growers</Link> should increase EC by 0.2-0.4 and feed more frequently. Hydroponic growers can increase EC by 0.3-0.5 with continuous feeding.</p>
              <div className="bg-white rounded-2xl border border-[#275C53]/5 overflow-hidden mb-4">
                <table className="w-full text-sm">
                  <thead><tr className="bg-[#F5F0EA]">
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-[1px] text-[#275C53] font-semibold">Week</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-[1px] text-[#275C53] font-semibold">Stage</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-[1px] text-[#275C53] font-semibold">EC (Soil)</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-[1px] text-[#275C53] font-semibold">PPM</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-[1px] text-[#275C53] font-semibold">Focus</th>
                  </tr></thead>
                  <tbody>
                    {[
                      ['1-2', 'Seedling', '0.0-0.4', '0-200', 'Water only or very light feed'],
                      ['3-4', 'Early Veg', '0.6-0.8', '300-400', 'Nitrogen for leaf growth'],
                      ['5-6', 'Late Veg', '0.8-1.2', '400-600', 'N with increasing P, training'],
                      ['7', 'Transition', '1.0-1.4', '500-700', 'Switch to bloom nutrients'],
                      ['8-9', 'Early Flower', '1.2-1.6', '600-800', 'P & K increasing, bud sites'],
                      ['10-11', 'Mid Flower', '1.2-1.6', '600-800', 'Peak P & K, bud fattening'],
                      ['12', 'Late Flower', '0.6-1.0', '300-500', 'Reduce feed, begin flush'],
                      ['13+', 'Flush', '0.0', '0', 'Plain water 5-10 days'],
                    ].map(([week, stage, ec, ppm, focus]) => (
                      <tr key={week} className="border-b border-[#192026]/5"><td className="px-4 py-2.5 text-[#192026]/70 font-medium">Wk {week}</td><td className="px-4 py-2.5 text-[#192026]/60">{stage}</td><td className="px-4 py-2.5 font-semibold text-[#275C53]">{ec}</td><td className="px-4 py-2.5 text-[#192026]/60">{ppm}</td><td className="px-4 py-2.5 text-[#192026]/50 text-[12px]">{focus}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed"><Link href="/product-category/autoflowering-seeds" className="text-[#275C53] hover:text-[#D7B65D]">Autoflowering strains</Link> follow a compressed version of this schedule, typically finishing by week 10. Reduce all EC values by 20% for autoflowers. <Link href="/product-category/best-strains-for-high-yield" className="text-[#275C53] hover:text-[#D7B65D]">High-yield strains</Link> can handle the upper end of these ranges during peak flower.</p>
            </section>

            {/* Example Feeding Plans (indexable) */}
            <section>
              <h2 className="text-xl font-bold text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>Example Cannabis Feeding Plans</h2>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed mb-4">Here are sample feeding plans for the most common growing setups. Use our calculator above for a plan customized to your exact stage and medium.</p>
              <div className="space-y-4">
                {[
                  { title: 'Soil — Late Veg Feeding Plan', ec: '0.8–1.2 EC', ppm: '400–600 PPM', freq: 'Feed every other watering', focus: 'Nitrogen dominant with increasing phosphorus. Focus on building strong canopy structure before flip.', medium: 'soil' },
                  { title: 'Coco Coir — Mid Flower Feeding Plan', ec: '1.4–1.8 EC', ppm: '700–900 PPM', freq: 'Feed every watering with 10-20% runoff', focus: 'Heavy phosphorus and potassium for bud development. Maintain cal-mag. Monitor runoff EC weekly.', medium: 'coco' },
                  { title: 'Hydroponic — Early Veg Feeding Plan', ec: '0.8–1.0 EC', ppm: '400–500 PPM', freq: 'Continuous recirculating feed', focus: 'Nitrogen dominant for rapid vegetative growth. Change reservoir every 7-10 days. Monitor pH daily.', medium: 'hydro' },
                  { title: 'Autoflower — Full Cycle (Soil)', ec: '0.4–1.0 EC', ppm: '200–500 PPM', freq: 'Light feed every other watering', focus: 'Start very light, peak at week 5-6 of flower, then reduce. Autoflowers need 20% less than photoperiod.', medium: 'soil' },
                ].map(plan => (
                  <div key={plan.title} className="bg-white rounded-xl border border-[#275C53]/5 p-5">
                    <h3 className="text-[14px] font-semibold text-[#275C53] mb-2">{plan.title}</h3>
                    <div className="grid grid-cols-3 gap-3 mb-2">
                      <div><span className="text-[10px] text-[#192026]/30 block">EC</span><span className="text-[13px] font-bold text-[#275C53]">{plan.ec}</span></div>
                      <div><span className="text-[10px] text-[#192026]/30 block">PPM</span><span className="text-[13px] font-bold text-[#275C53]">{plan.ppm}</span></div>
                      <div><span className="text-[10px] text-[#192026]/30 block">Schedule</span><span className="text-[13px] font-bold text-[#275C53]">{plan.freq.split(',')[0]}</span></div>
                    </div>
                    <p className="text-[12px] text-[#192026]/50 leading-relaxed">{plan.focus}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Beginner vs Advanced */}
            <section>
              <h2 className="text-xl font-bold text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>Beginner vs Advanced Cannabis Feeding</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-emerald-50/50 rounded-xl border border-emerald-100 p-5">
                  <h3 className="text-[14px] font-semibold text-[#275C53] mb-2">🌱 Beginner Feeding Approach</h3>
                  <ul className="text-[13px] text-[#192026]/60 space-y-1.5">
                    <li>• Start at 25-50% of label dose</li>
                    <li>• Use soil for natural buffering</li>
                    <li>• Feed every other watering</li>
                    <li>• Choose <Link href="/product-category/autoflowering-seeds" className="text-[#275C53] hover:text-[#D7B65D]">forgiving autoflower strains</Link></li>
                    <li>• Watch for leaf tip burn as first sign of excess</li>
                    <li>• When in doubt, use less — not more</li>
                  </ul>
                </div>
                <div className="bg-amber-50/50 rounded-xl border border-amber-100 p-5">
                  <h3 className="text-[14px] font-semibold text-[#275C53] mb-2">🌳 Advanced Feeding Approach</h3>
                  <ul className="text-[13px] text-[#192026]/60 space-y-1.5">
                    <li>• Push EC to strain-specific limits</li>
                    <li>• Use coco or hydro for precision control</li>
                    <li>• Feed daily or continuous recirculating</li>
                    <li>• Choose <Link href="/product-category/best-strains-for-high-yield" className="text-[#275C53] hover:text-[#D7B65D]">heavy-feeding high-yield strains</Link></li>
                    <li>• Monitor runoff EC and pH at every feed</li>
                    <li>• Fine-tune ratios by growth stage</li>
                  </ul>
                </div>
              </div>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed">Most growers should start with the beginner approach and progress to advanced techniques over multiple grows. The biggest mistake is jumping to aggressive feeding before understanding how your specific strain, environment, and water source interact. Our nutrient calculator adjusts recommendations for your experience level — beginners get conservative ranges that prioritize plant safety.</p>
            </section>

            {/* Increase Yields with Feeding */}
            <section>
              <h2 className="text-xl font-bold text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>How to Increase Cannabis Yields with Proper Feeding</h2>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed mb-3">Proper nutrition is one of the three pillars of yield optimization — alongside <Link href="/blog/cannabis-growing-lights-and-phases" className="text-[#275C53] hover:text-[#D7B65D]">lighting</Link> and <Link href="/blog/cannabis-plant-pruning-and-topping" className="text-[#275C53] hover:text-[#D7B65D]">plant training</Link>. Even the best genetics cannot reach their yield potential without adequate nutrition through the flowering stage.</p>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed mb-3">During mid-flower (weeks 4-6 of bloom), <Link href="/product-category/best-strains-for-high-yield" className="text-[#275C53] hover:text-[#D7B65D]">high-yield cannabis strains</Link> demand peak phosphorus and potassium levels to support bud development. Growers who maintain consistent, adequate feeding through this critical window see 20-40% more yield than those who underfeed or feed inconsistently. The key is not maximum strength — it is consistent, stage-appropriate nutrition.</p>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed">Use our <Link href="/yield-calculator" className="text-[#275C53] hover:text-[#D7B65D]">yield calculator</Link> to estimate your harvest potential, then match it with the feeding plan from this nutrient calculator. Together, these tools help you plan both your genetics and your nutrition for maximum results.</p>
            </section>

            {/* Nutrient Deficiencies Bridge */}
            <section>
              <h2 className="text-xl font-bold text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>Cannabis Nutrient Deficiencies and Feeding Issues</h2>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed mb-4">Even with a good feeding plan, deficiencies and toxicities can occur. Learning to identify and correct common issues is essential for every grower. Most problems are caused by pH imbalance or overfeeding — not actual nutrient shortage.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { issue: 'Nitrogen Deficiency', symptom: 'Lower leaves yellowing', link: '/blog/cannabis-nutrient-deficiencies' },
                  { issue: 'Phosphorus Deficiency', symptom: 'Dark purple stems, slow flower', link: '/blog/cannabis-nutrient-deficiencies' },
                  { issue: 'Nutrient Burn', symptom: 'Brown crispy leaf tips', link: '/blog/cannabis-nutrient-burn-and-light-stress' },
                  { issue: 'Nutrient Lockout', symptom: 'Multiple deficiency signs at once', link: '/blog/cannabis-nutrient-deficiencies' },
                  { issue: 'Calcium Deficiency', symptom: 'Brown spots on leaves (coco)', link: '/blog/cannabis-nutrient-deficiencies' },
                  { issue: 'Overwatering', symptom: 'Droopy leaves, slow growth', link: '/blog/overwatering-vs-underwatering-cannabis-plants' },
                ].map(d => (
                  <Link key={d.issue} href={d.link} className="bg-white rounded-xl border border-[#275C53]/5 p-4 hover:shadow-sm transition-all group">
                    <h3 className="text-[13px] font-semibold text-[#275C53] group-hover:text-[#D7B65D] transition-colors">{d.issue}</h3>
                    <p className="text-[11px] text-[#192026]/40 mt-0.5">{d.symptom}</p>
                    <span className="text-[10px] text-[#275C53] font-medium mt-1 block">Read guide →</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-xl font-bold text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Frequently Asked Questions</h2>
              <div className="space-y-3">
                {[
                  { q: 'How often should I feed cannabis plants in soil?', a: 'In soil, feed every other watering — alternating between nutrient solution and plain pH-adjusted water. This prevents salt buildup while keeping plants nourished. During peak flowering, you may increase to feeding 2 out of every 3 waterings if plants are hungry. Always check runoff and monitor plant response.' },
                  { q: 'What EC should cannabis seedlings have?', a: 'Seedlings should receive very light nutrition: 0.2-0.5 EC (100-250 PPM). Most quality soils provide enough nutrients for the first 2-3 weeks, so you may not need to add anything until you see 3-4 true leaf sets. When you start feeding, begin at 25% of the label dose.' },
                  { q: 'What PPM is best for cannabis in flower?', a: 'Flowering cannabis typically needs 600-1000 PPM depending on stage and medium. Early flower runs 500-700 PPM, mid flower peaks at 700-1000 PPM, and late flower drops back to 300-600 PPM as you approach harvest and begin flushing. Hydro and coco can handle the higher end; soil works best at the lower end.' },
                  { q: 'Is coco coir fed differently than soil?', a: 'Yes, significantly. Coco is an inert medium with no nutrient content — you must feed at every watering. Coco also requires cal-mag supplementation because it naturally binds calcium. Feed frequency in coco is daily or even multiple times daily in larger plants, compared to every 2-3 days in soil.' },
                  { q: 'Do autoflowers need fewer nutrients?', a: 'Yes. Autoflowering plants generally need about 20% less nutrients than photoperiod plants. Their shorter lifecycle, smaller root systems, and faster growth stages make them more sensitive to overfeeding. Start at the lower end of any feeding recommendation when growing autoflowers.' },
                  { q: 'Can I use the same feeding schedule for every strain?', a: 'No. Different strains have different nutrient demands. Heavy-feeding strains like Big Bud and Gorilla Glue thrive on stronger nutrients during bloom. Sensitive strains and autoflowers prefer lighter feeding. Always start conservative and adjust based on how each specific plant responds.' },
                  { q: 'What happens if cannabis plants are overfed?', a: 'Overfeeding causes nutrient burn — leaf tips turn brown and crispy, then progresses inward. Severe overfeeding can cause nutrient lockout, where excess salts prevent the plant from absorbing any nutrients at all. If you see burn, flush with plain pH-adjusted water and reduce feed strength by 25-50%.' },
                  { q: 'Should I use EC or PPM when feeding cannabis?', a: 'Both measure the same thing — nutrient concentration. EC is more universal and avoids the confusion of different PPM scales (500 vs 700). Most professional growers prefer EC. If you use PPM, confirm which scale your meter uses. Our calculator provides both EC and PPM values for convenience.' },
                ].map(faq => (
                  <details key={faq.q} className="bg-white rounded-xl border border-[#275C53]/5">
                    <summary className="px-5 py-4 cursor-pointer text-[#275C53] font-medium text-sm">{faq.q}</summary>
                    <div className="px-5 pb-4 text-[13px] text-[#192026]/60 leading-relaxed">{faq.a}</div>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-[300px] shrink-0 space-y-5 lg:self-start lg:sticky lg:top-4">
          <div className="bg-white rounded-2xl border border-[#275C53]/5 p-5">
            <h3 className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-3">Related Grow Guides</h3>
            <div className="space-y-2">
              {[
                { label: 'Cannabis Nutrient Guide', href: '/blog/cannabis-nutrient-deficiencies' },
                { label: 'Indoor Growing Guide', href: '/blog/cannabis-growing-lights-and-phases' },
                { label: 'Autoflower Grow Guide', href: '/blog/autoflower-cannabis-seeds-and-growing-guide' },
                { label: 'Training & Topping', href: '/blog/cannabis-plant-pruning-and-topping' },
                { label: 'When to Harvest', href: '/blog/cannabis-trichomes-and-harvesting' },
                { label: 'Drying & Curing', href: '/blog/drying-and-curing-your-cannabis-plants' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="block text-[13px] text-[#192026]/60 hover:text-[#275C53] transition-colors py-0.5">→ {l.label}</Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#275C53]/5 p-5">
            <h3 className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-3">Shop by Grower Need</h3>
            <div className="space-y-2">
              {[
                { label: 'Beginner Seeds', href: '/product-category/autoflowering-seeds' },
                { label: 'High Yield Seeds', href: '/product-category/best-strains-for-high-yield' },
                { label: 'Autoflower Seeds', href: '/product-category/autoflowering-seeds' },
                { label: 'Feminized Seeds', href: '/product-category/feminized-seeds' },
                { label: 'Indoor Strains', href: '/product-category/best-strains-for-indoor-growing' },
                { label: 'Fast Flowering', href: '/product-category/fast-flowering-seeds' },
              ].map(l => (
                <Link key={l.label} href={l.href} className="block text-[13px] text-[#275C53] hover:text-[#D7B65D] transition-colors py-0.5 font-medium">→ {l.label}</Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#275C53]/5 p-5">
            <h3 className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-3">Helpful Tools</h3>
            <div className="space-y-2">
              {[
                { label: 'Yield Calculator', href: '/yield-calculator' },
                { label: 'Strain Finder Quiz', href: '/strain-finder' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="block text-[13px] text-[#275C53] hover:text-[#D7B65D] transition-colors py-0.5 font-medium">→ {l.label}</Link>
              ))}
            </div>
          </div>

          <div className="bg-[#F5F0EA] rounded-2xl p-5">
            <h3 className="text-[10px] uppercase tracking-[1px] text-[#275C53]/50 font-semibold mb-2">About This Tool</h3>
            <p className="text-[12px] text-[#192026]/50 leading-relaxed">Calculator estimates are a planning tool. Actual nutrient needs vary by genetics, environment, water quality, and nutrient line. Always start at the lower end of recommended ranges and increase based on plant response.</p>
          </div>

          <div className="bg-[#275C53] rounded-2xl p-5 text-center">
            <p className="text-white/80 text-[13px] mb-3">Not sure which seeds to grow?</p>
            <Link href="/strain-finder" className="inline-block w-full py-3 bg-white text-[#275C53] rounded-xl text-[13px] font-bold hover:bg-[#D7B65D] hover:text-white transition-colors">Find Your Perfect Strain</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
