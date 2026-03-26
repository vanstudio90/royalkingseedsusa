'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface QuizProduct {
  id: string;
  slug: string;
  name: string;
  strainType: 'indica' | 'sativa' | 'hybrid' | 'cbd';
  thcContent: string;
  indicaPercent: number;
  sativaPercent: number;
  effects: string[];
  bestUse: string[];
  difficulty: string;
  feminized: boolean;
  autoflower: boolean;
  price: number;
  imageUrl: string;
  categories: string[];
  seedOptions: any[];
}

interface Answers {
  experience: string[];
  potency: string;
  growLocation: string;
  skillLevel: string;
  flavors: string[];
  climate: string;
}

/* ------------------------------------------------------------------ */
/*  Quiz step definitions                                              */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    key: 'experience' as const,
    title: 'What kind of experience are you after?',
    subtitle: 'Pick all that apply — we\'ll find strains that hit every note.',
    multi: true,
    options: [
      { value: 'relax', label: 'Relax / Chill', icon: '🧘', desc: 'Wind down, ease tension' },
      { value: 'energy', label: 'Energy / Daytime', icon: '⚡', desc: 'Stay active and alert' },
      { value: 'creative', label: 'Creative / Focus', icon: '🎨', desc: 'Spark ideas and flow' },
      { value: 'sleep', label: 'Sleep / Heavy Body', icon: '🌙', desc: 'Deep rest and recovery' },
      { value: 'euphoria', label: 'Euphoria / Mood', icon: '😊', desc: 'Feel happy and uplifted' },
      { value: 'pain', label: 'Pain / Relief', icon: '💆', desc: 'Physical comfort and calm' },
    ],
  },
  {
    key: 'potency' as const,
    title: 'How strong do you want it?',
    subtitle: 'No wrong answer — we\'ll match potency to your comfort level.',
    multi: false,
    options: [
      { value: 'mild', label: 'Mild', icon: '🌿', desc: 'Low THC / balanced CBD (under 15%)' },
      { value: 'medium', label: 'Medium', icon: '🌲', desc: 'Moderate THC (15–22%)' },
      { value: 'strong', label: 'Strong', icon: '🔥', desc: 'High THC (22%+)' },
      { value: 'any', label: 'No Preference', icon: '🤷', desc: 'Show me everything' },
    ],
  },
  {
    key: 'growLocation' as const,
    title: 'Where are you growing?',
    subtitle: 'This helps us pick strains suited to your environment.',
    multi: false,
    options: [
      { value: 'indoor', label: 'Indoor', icon: '🏠', desc: 'Tent, closet, or grow room' },
      { value: 'outdoor', label: 'Outdoor', icon: '☀️', desc: 'Garden, balcony, or field' },
      { value: 'both', label: 'Both / Greenhouse', icon: '🏡', desc: 'Flexible setup' },
      { value: 'unsure', label: 'Not Sure Yet', icon: '🤔', desc: 'Still deciding' },
    ],
  },
  {
    key: 'skillLevel' as const,
    title: 'What\'s your growing experience?',
    subtitle: 'We\'ll match you with strains that fit your skill level.',
    multi: false,
    options: [
      { value: 'beginner', label: 'Beginner', icon: '🌱', desc: 'First grow or still learning' },
      { value: 'intermediate', label: 'Intermediate', icon: '🪴', desc: 'A few grows under my belt' },
      { value: 'advanced', label: 'Advanced', icon: '🌳', desc: 'Experienced grower' },
    ],
  },
  {
    key: 'flavors' as const,
    title: 'What flavors do you enjoy?',
    subtitle: 'Pick all that sound good — or skip if you don\'t have a preference.',
    multi: true,
    options: [
      { value: 'fruity', label: 'Fruity / Sweet', icon: '🍓', desc: 'Berry, candy, tropical' },
      { value: 'citrus', label: 'Citrus', icon: '🍋', desc: 'Lemon, orange, grapefruit' },
      { value: 'diesel', label: 'Diesel / Gas', icon: '⛽', desc: 'Fuel, pungent, skunky' },
      { value: 'earthy', label: 'Earthy / Kush', icon: '🍂', desc: 'Pine, woody, herbal' },
      { value: 'floral', label: 'Floral / Lavender', icon: '🌸', desc: 'Soft, aromatic, gentle' },
      { value: 'spicy', label: 'Spicy / Pepper', icon: '🌶️', desc: 'Bold, warm, peppery' },
    ],
  },
  {
    key: 'climate' as const,
    title: 'What\'s your climate like?',
    subtitle: 'Optional — helps us recommend strains that thrive where you are.',
    multi: false,
    options: [
      { value: 'cold', label: 'Cold / Short Season', icon: '❄️', desc: 'Northern states, short summers' },
      { value: 'hot', label: 'Hot / Dry', icon: '🏜️', desc: 'Southwest, arid regions' },
      { value: 'humid', label: 'Warm / Humid', icon: '🌴', desc: 'Southeast, tropical feel' },
      { value: 'temperate', label: 'Temperate', icon: '🌤️', desc: 'Moderate seasons, mild' },
      { value: 'any', label: 'Skip / Indoor Only', icon: '⏭️', desc: 'Doesn\'t matter for me' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Scoring engine                                                     */
/* ------------------------------------------------------------------ */

function parseThc(thcStr: string): number {
  const match = thcStr.replace(/%%/g, '%').match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 15;
}

// Map quiz experience choices → effects/bestUse keywords + strain type affinity
const EXPERIENCE_MAP: Record<string, { effects: string[]; bestUse: string[]; strainBias?: string }> = {
  relax:    { effects: ['Relaxed', 'Calm', 'Mellow', 'Body High'], bestUse: ['Anxiety', 'Stress'], strainBias: 'indica' },
  energy:   { effects: ['Energetic', 'Uplifted', 'Focused', 'Motivated'], bestUse: ['Daytime', 'Anytime'], strainBias: 'sativa' },
  creative: { effects: ['Creative', 'Focused', 'Euphoric', 'Inspired'], bestUse: ['Creativity', 'Focus'], strainBias: 'sativa' },
  sleep:    { effects: ['Sleepy', 'Relaxed', 'Sedated', 'Body High'], bestUse: ['Insomnia', 'Sleep', 'Nighttime'], strainBias: 'indica' },
  euphoria: { effects: ['Euphoric', 'Happy', 'Uplifted', 'Giggly'], bestUse: ['Depression', 'Mood'], strainBias: 'hybrid' },
  pain:     { effects: ['Relaxed', 'Body High', 'Tingly', 'Calm'], bestUse: ['Pain', 'Inflammation', 'Chronic Pain'] },
};

// Map flavor choices → product name / category keywords
const FLAVOR_KEYWORDS: Record<string, string[]> = {
  fruity:  ['fruit', 'berry', 'banana', 'grape', 'cherry', 'strawberry', 'mango', 'apple', 'watermelon', 'blueberry', 'tropical', 'candy', 'sweet', 'punch', 'zkittlez', 'runtz', 'gelato'],
  citrus:  ['citrus', 'lemon', 'orange', 'lime', 'tangie', 'grapefruit', 'clementine', 'haze', 'tangerine'],
  diesel:  ['diesel', 'gas', 'fuel', 'skunk', 'chem', 'sour', 'og', 'dawg'],
  earthy:  ['kush', 'earth', 'pine', 'wood', 'hash', 'afghan', 'hindu'],
  floral:  ['lavender', 'floral', 'rose', 'violet', 'lilac'],
  spicy:   ['pepper', 'spice', 'jack', 'herer', 'durban'],
};

function scoreProduct(product: QuizProduct, answers: Answers): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];
  const thc = parseThc(product.thcContent);
  const nameLower = product.name.toLowerCase();
  const catsJoined = product.categories.join(' ').toLowerCase();

  // --- Experience match (highest weight) ---
  for (const exp of answers.experience) {
    const map = EXPERIENCE_MAP[exp];
    if (!map) continue;

    // Effect keyword match
    for (const kw of map.effects) {
      if (product.effects.some((e) => e.toLowerCase().includes(kw.toLowerCase()))) {
        score += 4;
        break; // one match per experience type is enough
      }
    }

    // Best use match
    for (const kw of map.bestUse) {
      if (product.bestUse.some((b) => b.toLowerCase().includes(kw.toLowerCase()))) {
        score += 2;
        break;
      }
    }

    // Strain type bias
    if (map.strainBias) {
      if (product.strainType === map.strainBias) {
        score += 3;
      } else if (product.strainType === 'hybrid') {
        // Hybrids get partial credit based on indica/sativa lean
        if (map.strainBias === 'indica' && product.indicaPercent >= 60) score += 2;
        else if (map.strainBias === 'sativa' && product.sativaPercent >= 60) score += 2;
        else score += 1;
      }
    }
  }

  // --- Potency match ---
  if (answers.potency === 'mild' && thc <= 15) {
    score += 4;
    reasons.push('Mild potency — great for a gentle experience');
  } else if (answers.potency === 'mild' && thc <= 20) {
    score += 1;
  } else if (answers.potency === 'medium' && thc >= 15 && thc <= 22) {
    score += 4;
    reasons.push('Medium potency — balanced and versatile');
  } else if (answers.potency === 'medium') {
    score += 1;
  } else if (answers.potency === 'strong' && thc >= 22) {
    score += 4;
    reasons.push(`High potency at ${thc}% THC`);
  } else if (answers.potency === 'strong' && thc >= 18) {
    score += 2;
  } else if (answers.potency === 'any') {
    score += 2;
  }

  // --- Grow location ---
  if (answers.growLocation === 'indoor') {
    // Autoflowers and shorter plants score higher indoors
    if (product.autoflower) { score += 2; reasons.push('Autoflower — ideal for indoor grows'); }
  } else if (answers.growLocation === 'outdoor') {
    if (!product.autoflower && product.feminized) score += 1;
    if (catsJoined.includes('outdoor')) { score += 3; reasons.push('Well-suited for outdoor growing'); }
  }

  // --- Skill level ---
  const diff = product.difficulty?.toLowerCase() || 'intermediate';
  if (answers.skillLevel === 'beginner') {
    if (diff === 'beginner' || diff === 'easy') {
      score += 5;
      reasons.push('Beginner-friendly — forgiving and easy to grow');
    } else if (diff === 'intermediate') {
      score += 1;
    }
    // Autoflowers are easier for beginners
    if (product.autoflower) score += 2;
  } else if (answers.skillLevel === 'intermediate') {
    if (diff === 'intermediate') score += 3;
    else if (diff === 'beginner' || diff === 'easy') score += 2;
    else score += 1;
  } else if (answers.skillLevel === 'advanced') {
    score += 2; // advanced growers can grow anything
    if (diff === 'advanced' || diff === 'hard') { score += 2; reasons.push('A rewarding challenge for experienced growers'); }
  }

  // --- Flavor match ---
  if (answers.flavors.length > 0) {
    let flavorMatched = false;
    for (const flav of answers.flavors) {
      const keywords = FLAVOR_KEYWORDS[flav] || [];
      for (const kw of keywords) {
        if (nameLower.includes(kw) || catsJoined.includes(kw)) {
          score += 3;
          flavorMatched = true;
          break;
        }
      }
    }
    if (flavorMatched) reasons.push('Matches your flavor preferences');
  }

  // --- Climate ---
  if (answers.climate === 'cold') {
    if (product.autoflower) { score += 2; reasons.push('Fast-finishing — great for short seasons'); }
    if (catsJoined.includes('fast-flowering')) score += 2;
  } else if (answers.climate === 'humid') {
    // Sativas and mold-resistant strains do better in humidity
    if (product.strainType === 'sativa' || product.sativaPercent >= 60) score += 1;
  } else if (answers.climate === 'hot') {
    if (product.strainType === 'sativa' || product.sativaPercent >= 50) score += 1;
  }

  // --- Build "why it matches" reasons ---
  // Add experience-based reasons
  const expLabels: Record<string, string> = {
    relax: 'Great for relaxation',
    energy: 'Energizing daytime strain',
    creative: 'Sparks creativity and focus',
    sleep: 'Helps with deep sleep',
    euphoria: 'Mood-boosting and uplifting',
    pain: 'Supports physical relief',
  };
  for (const exp of answers.experience) {
    const map = EXPERIENCE_MAP[exp];
    if (map && product.effects.some((e) => map.effects.some((k) => e.toLowerCase().includes(k.toLowerCase())))) {
      reasons.push(expLabels[exp]);
      break; // one experience reason is enough
    }
  }

  // Strain type reason
  const typeLabels: Record<string, string> = {
    indica: 'Indica-dominant genetics',
    sativa: 'Sativa-dominant genetics',
    hybrid: 'Balanced hybrid genetics',
    cbd: 'CBD-rich strain',
  };
  reasons.push(typeLabels[product.strainType] || 'Hybrid genetics');

  return { score, reasons: [...new Set(reasons)].slice(0, 4) };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function StrainFinderQuiz({ products }: { products: QuizProduct[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    experience: [],
    potency: '',
    growLocation: '',
    skillLevel: '',
    flavors: [],
    climate: '',
  });
  const [showResults, setShowResults] = useState(false);

  const currentStep = STEPS[step];
  const totalSteps = STEPS.length;
  const progress = showResults ? 100 : ((step) / totalSteps) * 100;

  // Handle option selection
  function selectOption(value: string) {
    const key = currentStep.key;
    if (currentStep.multi) {
      setAnswers((prev) => {
        const arr = prev[key] as string[];
        return {
          ...prev,
          [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
        };
      });
    } else {
      setAnswers((prev) => ({ ...prev, [key]: value }));
      // Auto-advance for single-select
      if (step < totalSteps - 1) {
        setTimeout(() => setStep(step + 1), 300);
      } else {
        setTimeout(() => setShowResults(true), 300);
      }
    }
  }

  function isSelected(value: string) {
    const val = answers[currentStep.key];
    if (Array.isArray(val)) return val.includes(value);
    return val === value;
  }

  function canAdvance() {
    const val = answers[currentStep.key];
    if (currentStep.multi) return true; // multi-select can skip
    return !!val;
  }

  function handleNext() {
    if (step < totalSteps - 1) setStep(step + 1);
    else setShowResults(true);
  }

  function handleBack() {
    if (showResults) { setShowResults(false); return; }
    if (step > 0) setStep(step - 1);
  }

  function handleRestart() {
    setStep(0);
    setShowResults(false);
    setAnswers({ experience: [], potency: '', growLocation: '', skillLevel: '', flavors: [], climate: '' });
  }

  // --- Results ---
  const results = useMemo(() => {
    if (!showResults) return [];
    return products
      .map((p) => ({ product: p, ...scoreProduct(p, answers) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  }, [showResults, products, answers]);

  const maxScore = results[0]?.score || 1;

  // --- Render ---
  if (showResults) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10">
        {/* Progress bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="h-1.5 bg-[#275C53]/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#D7B65D] rounded-full transition-all duration-500" style={{ width: '100%' }} />
          </div>
        </div>

        <div className="text-center mb-10">
          <p className="text-[#D7B65D] text-xs uppercase tracking-[2px] font-semibold mb-2">Your Results</p>
          <h2 className="text-2xl sm:text-3xl text-[#275C53]" style={{ fontFamily: 'var(--font-patua)' }}>
            Your Recommended Strains
          </h2>
          <p className="text-[#192026]/70 text-sm mt-2 max-w-lg mx-auto">
            Based on your answers, here are the strains we think you&apos;ll love — ranked by how closely they match your preferences.
          </p>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-[#275C53] font-semibold mb-2">No matches found</p>
            <p className="text-[#192026]/70 text-sm mb-6">Try adjusting your preferences for broader results.</p>
            <button onClick={handleRestart} className="px-6 py-3 bg-[#275C53] text-white rounded-full text-sm font-medium hover:bg-[#1e4a42] transition-colors cursor-pointer">
              Retake Quiz
            </button>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((r, i) => {
                const matchPct = Math.round((r.score / maxScore) * 100);
                const displayPct = Math.max(matchPct, 60); // floor at 60% for display
                return (
                  <Link
                    key={r.product.id}
                    href={`/${r.product.slug}`}
                    className="bg-white rounded-2xl border border-[#275C53]/5 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all group"
                  >
                    {/* Match badge */}
                    <div className="relative">
                      <div className="aspect-square bg-[#F5F0EA] flex items-center justify-center overflow-hidden">
                        {r.product.imageUrl && !r.product.imageUrl.startsWith('/images/seeds/') ? (
                          <Image
                            src={r.product.imageUrl}
                            alt={r.product.name}
                            width={300}
                            height={300}
                            loading={i < 6 ? 'eager' : 'lazy'}
                            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <span className="text-6xl opacity-40">🌱</span>
                        )}
                      </div>
                      <div className="absolute top-3 right-3 bg-[#275C53] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        {displayPct}% Match
                      </div>
                      {i === 0 && (
                        <div className="absolute top-3 left-3 bg-[#D7B65D] text-[#1a3d36] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                          Top Pick
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 flex gap-1.5">
                        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                          { indica: 'bg-purple-100 text-purple-700', sativa: 'bg-amber-100 text-amber-700', hybrid: 'bg-emerald-100 text-emerald-700', cbd: 'bg-blue-100 text-blue-700' }[r.product.strainType]
                        }`}>
                          {r.product.strainType.charAt(0).toUpperCase() + r.product.strainType.slice(1)}
                        </span>
                        {r.product.autoflower && (
                          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-700">Auto</span>
                        )}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-[#275C53] font-semibold text-sm mb-1 group-hover:text-[#D7B65D] transition-colors">
                        {r.product.name}
                      </h3>
                      <div className="flex items-center gap-3 text-[12px] text-[#192026]/60 mb-3">
                        <span>{r.product.thcContent.replace('%%', '%')} THC</span>
                        <span className="text-[#275C53]/20">|</span>
                        <span>{r.product.indicaPercent}% Indica / {r.product.sativaPercent}% Sativa</span>
                      </div>

                      {/* Why it matches */}
                      <div className="space-y-1 mb-4">
                        {r.reasons.map((reason) => (
                          <div key={reason} className="flex items-start gap-1.5">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#275C53" strokeWidth="2" className="shrink-0 mt-0.5 opacity-60"><polyline points="20 6 9 17 4 12"/></svg>
                            <span className="text-[12px] text-[#192026]/70">{reason}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[#275C53] font-semibold text-sm">From ${r.product.price.toFixed(2)}</span>
                        <span className="text-[11px] text-[#D7B65D] font-medium group-hover:translate-x-0.5 transition-transform">
                          View Strain →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={handleRestart} className="px-6 py-3 bg-[#275C53] text-white rounded-full text-sm font-medium hover:bg-[#1e4a42] transition-colors cursor-pointer">
                Retake Quiz
              </button>
              <Link href="/product-category/shop-all-cannabis-seeds" className="px-6 py-3 border border-[#275C53]/20 text-[#275C53] rounded-full text-sm font-medium hover:bg-[#275C53]/5 transition-colors">
                Browse All Seeds
              </Link>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-[12px] text-[#192026]/50 mb-2">
          <span>Step {step + 1} of {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-[#275C53]/10 rounded-full overflow-hidden">
          <div className="h-full bg-[#D7B65D] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl text-[#275C53] mb-2" style={{ fontFamily: 'var(--font-patua)' }}>
          {currentStep.title}
        </h2>
        <p className="text-[#192026]/60 text-sm">{currentStep.subtitle}</p>
      </div>

      {/* Options */}
      <div className={`grid gap-3 ${currentStep.options.length <= 4 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
        {currentStep.options.map((opt) => {
          const selected = isSelected(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => selectOption(opt.value)}
              className={`relative flex flex-col items-center text-center px-4 py-5 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-md ${
                selected
                  ? 'border-[#275C53] bg-[#275C53]/5 shadow-sm'
                  : 'border-[#275C53]/10 bg-white hover:border-[#275C53]/30'
              }`}
            >
              {selected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-[#275C53] rounded-full flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              )}
              <span className="text-2xl mb-2">{opt.icon}</span>
              <span className="text-[#275C53] font-semibold text-sm">{opt.label}</span>
              <span className="text-[#192026]/50 text-[11px] mt-0.5">{opt.desc}</span>
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={handleBack}
          disabled={step === 0}
          className={`px-5 py-2.5 text-sm rounded-full transition-colors cursor-pointer ${
            step === 0
              ? 'text-[#192026]/30 cursor-default'
              : 'text-[#275C53] hover:bg-[#275C53]/5'
          }`}
        >
          ← Back
        </button>

        {currentStep.multi && (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-[#275C53] text-white text-sm font-medium rounded-full hover:bg-[#1e4a42] transition-colors cursor-pointer"
          >
            {step === totalSteps - 1 ? 'See My Results' : 'Next →'}
          </button>
        )}
      </div>
    </div>
  );
}
