'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Strain {
  slug: string; name: string; strainType: string; thcContent: string;
  autoflower: boolean; feminized: boolean; effects: string[]; price: number;
  imageUrl: string; floweringTime: string; indoorYield: string; outdoorYield: string;
  difficulty: string; height: string; seedType: string; bestFor: string;
}

interface SearchResult { id: string; slug: string; name: string; strainType: string; thcContent: string; }

function StrainSearch({ index, onSelect, selected }: { index: number; onSelect: (slug: string, name: string) => void; selected: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const search = async (q: string) => {
    setQuery(q);
    if (q.length < 2) { setResults([]); setOpen(false); return; }
    const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setResults(data.products || []);
    setOpen(true);
  };

  return (
    <div ref={ref} className="relative">
      <label className="text-[11px] uppercase tracking-[1px] text-[#192026]/40 font-semibold block mb-1">Strain {index + 1}{index >= 2 ? ' (Optional)' : ''}</label>
      {selected ? (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-[#275C53]/5 rounded-xl border border-[#275C53]/20">
          <span className="text-[13px] font-semibold text-[#275C53] flex-1 truncate">{selected}</span>
          <button onClick={() => { onSelect('', ''); setQuery(''); }} className="text-[#192026]/30 hover:text-red-400 cursor-pointer text-sm">✕</button>
        </div>
      ) : (
        <input type="text" value={query} onChange={e => search(e.target.value)} onFocus={() => { if (results.length > 0) setOpen(true); }}
          placeholder="Search strain name..." className="w-full px-3 py-2.5 bg-[#F5F0EA] rounded-xl text-[13px] text-[#192026] placeholder:text-[#192026]/30 focus:outline-none focus:ring-1 focus:ring-[#275C53]/30 border-none" />
      )}
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-[#275C53]/10 overflow-hidden z-50 max-h-[200px] overflow-y-auto">
          {results.map(p => (
            <button key={p.id} onClick={() => { onSelect(p.slug, p.name); setOpen(false); setQuery(''); }}
              className="block w-full text-left px-3 py-2 text-[13px] text-[#192026]/70 hover:bg-[#F5F0EA] transition-colors cursor-pointer border-b border-[#192026]/5 last:border-0">
              <span className="font-medium text-[#275C53]">{p.name}</span>
              <span className="text-[10px] text-[#192026]/30 ml-2 capitalize">{p.strainType} · {p.thcContent}% THC</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function getBestPick(strains: Strain[], metric: 'yield' | 'thc' | 'difficulty' | 'speed' | 'overall'): Strain | null {
  if (strains.length === 0) return null;
  switch (metric) {
    case 'yield': return [...strains].sort((a, b) => parseInt(b.indoorYield) - parseInt(a.indoorYield))[0];
    case 'thc': return [...strains].sort((a, b) => parseFloat(b.thcContent) - parseFloat(a.thcContent))[0];
    case 'difficulty': return [...strains].sort((a, b) => {
      const d = (s: string) => s.toLowerCase().includes('easy') ? 0 : s.toLowerCase().includes('moderate') ? 1 : 2;
      return d(a.difficulty) - d(b.difficulty);
    })[0];
    case 'speed': return [...strains].sort((a, b) => parseInt(a.floweringTime) - parseInt(b.floweringTime))[0];
    case 'overall': return strains[0]; // first selected as default
  }
}

function isWinner(strains: Strain[], strain: Strain, metric: string): boolean {
  if (strains.length < 2) return false;
  const best = getBestPick(strains, metric as 'yield' | 'thc' | 'difficulty' | 'speed');
  return best?.slug === strain.slug;
}

export default function CompareStrains() {
  const [selections, setSelections] = useState<{ slug: string; name: string }[]>([{ slug: '', name: '' }, { slug: '', name: '' }, { slug: '', name: '' }, { slug: '', name: '' }]);
  const [strains, setStrains] = useState<Strain[]>([]);
  const [loading, setLoading] = useState(false);
  const [compared, setCompared] = useState(false);

  const handleSelect = (idx: number, slug: string, name: string) => {
    setSelections(prev => prev.map((s, i) => i === idx ? { slug, name } : s));
  };

  const handleCompare = async () => {
    const slugs = selections.filter(s => s.slug).map(s => s.slug);
    if (slugs.length < 2) return;
    setLoading(true);
    const res = await fetch(`/api/products/compare?slugs=${slugs.join(',')}`);
    const data = await res.json();
    setStrains(data.products || []);
    setCompared(true);
    setLoading(false);
    setTimeout(() => document.getElementById('comparison-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const handleReset = () => {
    setSelections([{ slug: '', name: '' }, { slug: '', name: '' }, { slug: '', name: '' }, { slug: '', name: '' }]);
    setStrains([]); setCompared(false);
  };

  const selectedCount = selections.filter(s => s.slug).length;

  const COMPARE_ROWS: { label: string; key: string; metric?: string }[] = [
    { label: 'Seed Type', key: 'seedType' },
    { label: 'Strain Type', key: 'strainType' },
    { label: 'THC Content', key: 'thcContent', metric: 'thc' },
    { label: 'Indoor Yield', key: 'indoorYield', metric: 'yield' },
    { label: 'Outdoor Yield', key: 'outdoorYield' },
    { label: 'Flowering Time', key: 'floweringTime', metric: 'speed' },
    { label: 'Grow Difficulty', key: 'difficulty', metric: 'difficulty' },
    { label: 'Plant Height', key: 'height' },
    { label: 'Best For', key: 'bestFor' },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
      <div className="text-[12px] text-[#192026]/40 mb-6">
        <Link href="/" className="hover:text-[#275C53]">Home</Link><span className="mx-2">›</span>
        <span className="text-[#192026]/60">Compare Strains</span>
      </div>

      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>Cannabis Strain Comparison Tool</h1>
        <p className="text-[#192026]/55 max-w-2xl mx-auto text-sm leading-relaxed mb-4">
          Compare 2 to 4 <Link href="/product-category/shop-all-cannabis-seeds" className="text-[#275C53] hover:text-[#D7B65D]">cannabis strains</Link> side by side by yield, THC, grow difficulty, flowering time, and overall suitability. Find the best strain for your grow setup.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-[12px] text-[#192026]/50">
          <span>📊 Compare yield &amp; potency</span>
          <span>🌱 See grow difficulty side by side</span>
          <span>🎯 Find the best strain for your setup</span>
        </div>
      </div>

      <div className="flex gap-8 items-start flex-col lg:flex-row">
        <div className="flex-1 min-w-0">

          {/* Selector Card */}
          <div className="bg-white rounded-2xl border border-[#275C53]/10 p-6 sm:p-8 mb-8">
            <h2 className="text-lg font-bold text-[#275C53] mb-5" style={{ fontFamily: 'var(--font-patua)' }}>Select Strains to Compare</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {selections.map((s, i) => (
                <StrainSearch key={i} index={i} selected={s.name} onSelect={(slug, name) => handleSelect(i, slug, name)} />
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={handleCompare} disabled={selectedCount < 2 || loading}
                className="flex-1 py-4 bg-[#275C53] text-white rounded-xl text-[14px] font-bold uppercase tracking-[1px] hover:bg-[#1e4a42] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                {loading ? 'Comparing...' : `Compare ${selectedCount} Strains`}
              </button>
              <button onClick={handleReset} className="px-5 py-4 bg-[#F5F0EA] text-[#192026]/40 rounded-xl text-[13px] font-semibold hover:text-[#192026]/60 cursor-pointer">Reset</button>
            </div>
          </div>

          {/* Results */}
          {compared && strains.length >= 2 && (
            <div id="comparison-results" className="mb-10 scroll-mt-24">
              {/* Comparison Table */}
              <div className="bg-white rounded-2xl border border-[#275C53]/10 overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#275C53]">
                        <th className="text-left px-4 py-4 text-[10px] uppercase tracking-[1px] text-white/50 font-semibold w-[140px]">Attribute</th>
                        {strains.map(s => (
                          <th key={s.slug} className="text-left px-4 py-4 min-w-[160px]">
                            <Link href={`/${s.slug}`} className="text-white font-bold text-[14px] hover:text-[#D7B65D] transition-colors">{s.name}</Link>
                            <span className="text-white/40 text-[10px] block mt-0.5">${s.price.toFixed(2)}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARE_ROWS.map(row => (
                        <tr key={row.key} className="border-b border-[#192026]/5">
                          <td className="px-4 py-3 text-[11px] uppercase tracking-[1px] text-[#192026]/40 font-semibold">{row.label}</td>
                          {strains.map(s => {
                            const val = (s as unknown as Record<string, string>)[row.key];
                            const winner = row.metric ? isWinner(strains, s, row.metric) : false;
                            return (
                              <td key={s.slug} className={`px-4 py-3 text-[13px] ${winner ? 'text-[#275C53] font-bold' : 'text-[#192026]/60'}`}>
                                {val}
                                {winner && <span className="text-[9px] bg-[#D7B65D]/20 text-[#D7B65D] px-1.5 py-0.5 rounded font-medium ml-2">Best</span>}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                      <tr>
                        <td className="px-4 py-3 text-[11px] uppercase tracking-[1px] text-[#192026]/40 font-semibold">Effects</td>
                        {strains.map(s => (
                          <td key={s.slug} className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {s.effects.map(e => (
                                <span key={e} className="text-[10px] bg-[#F5F0EA] text-[#275C53] px-2 py-0.5 rounded-full">{e}</span>
                              ))}
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Best Pick Summary */}
              <div className="bg-[#275C53] rounded-2xl p-6 sm:p-8 text-white mb-6">
                <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Best Pick Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { label: 'Easiest to Grow', pick: getBestPick(strains, 'difficulty'), icon: '🌱' },
                    { label: 'Highest Yield', pick: getBestPick(strains, 'yield'), icon: '📈' },
                    { label: 'Strongest THC', pick: getBestPick(strains, 'thc'), icon: '🔥' },
                    { label: 'Fastest Finish', pick: getBestPick(strains, 'speed'), icon: '⚡' },
                  ].filter(b => b.pick).map(b => (
                    <div key={b.label} className="bg-white/10 rounded-xl p-4">
                      <span className="text-[10px] uppercase tracking-[1px] text-white/40 font-semibold block mb-1">{b.icon} {b.label}</span>
                      <Link href={`/${b.pick!.slug}`} className="text-[14px] font-bold text-[#D7B65D] hover:text-white transition-colors">{b.pick!.name}</Link>
                      <span className="text-white/40 text-[11px] block mt-0.5">{b.pick!.seedType} · {b.pick!.difficulty}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Choice */}
              {strains.length >= 2 && (() => {
                const best = getBestPick(strains, 'overall') || strains[0];
                const easiest = getBestPick(strains, 'difficulty') || strains[0];
                const yieldBest = getBestPick(strains, 'yield') || strains[0];
                return (
                  <div className="bg-[#D7B65D]/10 border border-[#D7B65D]/20 rounded-2xl p-6 mb-6">
                    <h3 className="text-[14px] font-bold text-[#275C53] mb-2">Recommended Choice Based on Your Comparison</h3>
                    <p className="text-[13px] text-[#192026]/60 leading-relaxed mb-4">
                      Based on your comparison, <strong className="text-[#275C53]">{best.name}</strong> is the strongest overall choice for growers seeking a balance of yield, potency, and grow ease.
                      {easiest.slug !== best.slug && <> <strong className="text-[#275C53]">{easiest.name}</strong> is better suited for beginners or growers who want the simplest possible experience.</>}
                      {yieldBest.slug !== best.slug && yieldBest.slug !== easiest.slug && <> For maximum harvest weight, <strong className="text-[#275C53]">{yieldBest.name}</strong> is the top producer.</>}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link href={`/${best.slug}`} className="px-5 py-2.5 bg-[#275C53] text-white rounded-xl text-[12px] font-bold hover:bg-[#1e4a42] transition-colors">Shop Best Overall: {best.name.split(' ').slice(0, 2).join(' ')}</Link>
                      {easiest.slug !== best.slug && <Link href={`/${easiest.slug}`} className="px-5 py-2.5 bg-white text-[#275C53] rounded-xl text-[12px] font-bold border border-[#275C53]/10 hover:bg-[#275C53] hover:text-white transition-colors">Shop Easiest: {easiest.name.split(' ').slice(0, 2).join(' ')}</Link>}
                    </div>
                  </div>
                );
              })()}

              {/* Shop Compared Strains */}
              <div className="bg-white rounded-2xl border border-[#275C53]/10 p-6 mb-6">
                <h3 className="text-lg font-bold text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Shop the Compared Strains</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {strains.map(s => (
                    <Link key={s.slug} href={`/${s.slug}`}
                      className="flex items-center gap-4 p-4 rounded-xl border border-[#275C53]/5 hover:border-[#D7B65D]/40 hover:shadow-sm transition-all group">
                      <div className="w-14 h-14 rounded-xl bg-[#F5F0EA] flex items-center justify-center shrink-0">
                        {s.imageUrl ? <img src={s.imageUrl} alt={s.name} className="w-full h-full object-contain p-1 rounded-xl" /> : <span className="text-2xl">🌱</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[14px] font-semibold text-[#275C53] group-hover:text-[#D7B65D] transition-colors">{s.name}</h4>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium">{s.seedType}</span>
                          <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium">{s.indoorYield}</span>
                          <span className="text-[9px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-medium">{s.difficulty}</span>
                        </div>
                      </div>
                      <span className="text-[14px] font-bold text-[#275C53]">${s.price.toFixed(2)}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Related Categories */}
              <div className="bg-[#F5F0EA] rounded-2xl p-6 mb-6">
                <h3 className="text-[14px] font-bold text-[#275C53] mb-3">Explore Similar Seeds</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'High Yield Seeds', slug: 'best-strains-for-high-yield' },
                    { name: 'Autoflower Seeds', slug: 'autoflowering-seeds' },
                    { name: 'Feminized Seeds', slug: 'feminized-seeds' },
                    { name: 'High THC Seeds', slug: 'high-tch-seeds' },
                    { name: 'Indoor Seeds', slug: 'best-strains-for-indoor-growing' },
                    { name: 'Fast Flowering', slug: 'fast-flowering-seeds' },
                    { name: 'Beginner Seeds', slug: 'autoflowering-seeds' },
                  ].map(c => (
                    <Link key={c.name} href={`/product-category/${c.slug}`} className="px-3 py-1.5 bg-white border border-[#275C53]/10 rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">{c.name}</Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick Comparison Answers */}
          <div className="bg-white rounded-2xl border border-[#275C53]/10 p-6 mb-10">
            <h2 className="text-lg font-bold text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Quick Strain Comparison Answers</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div><h3 className="text-[13px] font-semibold text-[#275C53] mb-1">Best for Yield?</h3><p className="text-[18px] font-bold text-[#D7B65D]">Big Bud</p><p className="text-[11px] text-[#192026]/40">500-600g/m² indoor</p></div>
              <div><h3 className="text-[13px] font-semibold text-[#275C53] mb-1">Best for Beginners?</h3><p className="text-[18px] font-bold text-[#D7B65D]">Northern Lights</p><p className="text-[11px] text-[#192026]/40">Most forgiving strain</p></div>
              <div><h3 className="text-[13px] font-semibold text-[#275C53] mb-1">Highest THC?</h3><p className="text-[18px] font-bold text-[#D7B65D]">Gorilla Glue</p><p className="text-[11px] text-[#192026]/40">28-32% THC potential</p></div>
              <div><h3 className="text-[13px] font-semibold text-[#275C53] mb-1">Fastest Harvest?</h3><p className="text-[18px] font-bold text-[#D7B65D]">Critical Auto</p><p className="text-[11px] text-[#192026]/40">8 weeks seed to harvest</p></div>
            </div>
          </div>

          {/* SEO Content */}
          <div className="space-y-10 max-w-3xl">
            <section>
              <h2 className="text-xl font-bold text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>How the Cannabis Strain Comparison Tool Works</h2>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed mb-3">Select 2 to 4 cannabis strains from our catalog of 1,600+ varieties and instantly see them compared across the metrics that matter most to growers: yield potential, THC content, flowering time, grow difficulty, and indoor/outdoor suitability. The tool highlights the &ldquo;best&rdquo; option in each category, helping you make faster, more confident buying decisions.</p>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed">Unlike simple stat sheets, our comparison tool interprets the data — telling you which strain wins for specific goals like maximum harvest, easiest grow, or fastest finish. Whether you are deciding between two similar <Link href="/product-category/feminized-seeds" className="text-[#275C53] hover:text-[#D7B65D]">feminized strains</Link> or weighing an <Link href="/product-category/autoflowering-seeds" className="text-[#275C53] hover:text-[#D7B65D]">autoflower</Link> against a photoperiod option, this tool simplifies the decision.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>What to Compare When Choosing Cannabis Strains</h2>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed mb-3">The most important comparison factors depend on your goals. Here is what each metric means for your grow:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {[
                  { title: 'Yield', desc: 'Measured in grams per square meter (indoor) or grams per plant (outdoor). High-yield strains like Big Bud and Critical Mass produce 500-600g/m² indoor. Use our yield calculator for personalized estimates.', icon: '📈' },
                  { title: 'THC Content', desc: 'Higher THC means stronger effects. Moderate strains run 15-20%, high-potency strains exceed 25%. More THC does not always mean a better experience — terpenes and other cannabinoids matter too.', icon: '🔥' },
                  { title: 'Flowering Time', desc: 'How long from first pistils to harvest. Fast strains finish in 7-8 weeks, standard strains take 9-10 weeks, slow sativas can take 12+ weeks. Faster does not always mean less yield.', icon: '⏱️' },
                  { title: 'Grow Difficulty', desc: 'Ranges from very easy (Northern Lights, autoflowers) to advanced (pure sativas, exotic genetics). Beginners should prioritize easy-to-grow strains for their first run.', icon: '🌱' },
                  { title: 'Indoor/Outdoor Suitability', desc: 'Some strains thrive indoors (compact indicas), others need outdoor space (tall sativas). Many hybrids perform well in both environments. Match your strain to your setup.', icon: '🏠' },
                  { title: 'Seed Type', desc: 'Autoflowers flower automatically in 8-10 weeks — fastest and easiest. Feminized photoperiod seeds offer more control and higher per-plant yields. Both produce female-only plants.', icon: '🧬' },
                ].map(item => (
                  <div key={item.title} className="bg-white rounded-xl border border-[#275C53]/5 p-4">
                    <h3 className="text-[13px] font-semibold text-[#275C53] mb-1">{item.icon} {item.title}</h3>
                    <p className="text-[12px] text-[#192026]/50 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>Yield vs THC vs Flowering Time — Which Matters Most?</h2>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed mb-3">There is no single &ldquo;best&rdquo; metric — it depends entirely on your priorities. Growers focused on maximum harvest weight should compare <Link href="/product-category/best-strains-for-high-yield" className="text-[#275C53] hover:text-[#D7B65D]">high-yield strains</Link> and look at indoor yield numbers. Potency hunters should compare <Link href="/product-category/high-tch-seeds" className="text-[#275C53] hover:text-[#D7B65D]">high-THC strains</Link> and check THC percentages. Speed-focused growers should compare <Link href="/product-category/fast-flowering-seeds" className="text-[#275C53] hover:text-[#D7B65D]">fast-flowering strains</Link> and flowering times.</p>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed">For beginners, grow difficulty often matters more than raw numbers. A strain that is easy to grow and forgiving of mistakes will produce better results in inexperienced hands than an advanced strain with theoretically higher potential. Start with forgiving genetics, learn your growing environment, and progress to more demanding strains as your skills improve.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>Best Cannabis Strains for Different Grower Goals</h2>
              <div className="space-y-3">
                {[
                  { goal: 'Beginners', strains: 'Northern Lights, White Widow, Blue Dream', why: 'Forgiving genetics that tolerate feeding mistakes, temperature fluctuations, and irregular watering while still producing quality harvests.', link: '/product-category/autoflowering-seeds' },
                  { goal: 'Maximum Yield', strains: 'Big Bud, Critical Mass, White Widow', why: 'Bred specifically for heavy harvests. These strains reward proper nutrition and training with exceptional bud weight.', link: '/product-category/best-strains-for-high-yield' },
                  { goal: 'Highest Potency', strains: 'Gorilla Glue, Bruce Banner, Girl Scout Cookies', why: 'Consistently test above 25% THC with dense trichome coverage. Best for experienced consumers seeking intense effects.', link: '/product-category/high-tch-seeds' },
                  { goal: 'Fast Harvest', strains: 'Critical Auto, Northern Lights Auto, Quick One', why: 'Finish in 8-10 weeks from seed. Autoflowering genetics allow multiple harvests per year without light cycle changes.', link: '/product-category/fast-flowering-seeds' },
                  { goal: 'Indoor Growing', strains: 'Northern Lights, OG Kush, Girl Scout Cookies', why: 'Compact growth, manageable height, and excellent performance under LED and HPS lighting in tents and grow rooms.', link: '/product-category/best-strains-for-indoor-growing' },
                ].map(item => (
                  <Link key={item.goal} href={item.link} className="bg-white rounded-xl border border-[#275C53]/5 p-5 block hover:shadow-sm transition-all group">
                    <h3 className="text-[14px] font-semibold text-[#275C53] group-hover:text-[#D7B65D] transition-colors">Best for {item.goal}: {item.strains}</h3>
                    <p className="text-[12px] text-[#192026]/50 mt-1 leading-relaxed">{item.why}</p>
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>Compare Autoflower vs Feminized Cannabis Strains</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-xl border border-[#275C53]/5 p-5">
                  <h3 className="text-[14px] font-semibold text-[#275C53] mb-2">⚡ Autoflower Seeds</h3>
                  <ul className="text-[13px] text-[#192026]/60 space-y-1.5">
                    <li>• Seed to harvest: 8-10 weeks</li>
                    <li>• No light cycle changes needed</li>
                    <li>• Stay compact (2-4 feet)</li>
                    <li>• Up to 4 harvests per year indoors</li>
                    <li>• Best for: beginners, speed, small spaces</li>
                    <li>• Trade-off: smaller per-plant yield</li>
                  </ul>
                </div>
                <div className="bg-white rounded-xl border border-[#275C53]/5 p-5">
                  <h3 className="text-[14px] font-semibold text-[#275C53] mb-2">🌿 Feminized Photoperiod Seeds</h3>
                  <ul className="text-[13px] text-[#192026]/60 space-y-1.5">
                    <li>• Total time: 3-5 months</li>
                    <li>• Requires 12/12 light to flower</li>
                    <li>• Can grow large (3-10+ feet)</li>
                    <li>• 2 harvests per year indoors</li>
                    <li>• Best for: max yield, control, cloning</li>
                    <li>• Trade-off: more knowledge required</li>
                  </ul>
                </div>
              </div>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed">New growers often compare <Link href="/product-category/autoflowering-seeds" className="text-[#275C53] hover:text-[#D7B65D]">autoflower seeds</Link> with <Link href="/product-category/feminized-seeds" className="text-[#275C53] hover:text-[#D7B65D]">feminized seeds</Link> before choosing their first run. Autoflowers are simpler and faster but produce smaller individual harvests. Feminized photoperiod seeds offer more control and larger yields but require understanding light cycles. Many experienced growers run both types simultaneously.</p>
            </section>

            {/* Strain Comparison Chart Explained */}
            <section>
              <h2 className="text-xl font-bold text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>Cannabis Strain Comparison Chart Explained</h2>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed mb-3">When comparing cannabis strains, each metric tells a different story about how the plant will perform in your garden. <strong>Yield</strong> (measured in grams per square meter indoors or per plant outdoors) indicates harvest potential — <Link href="/product-category/best-strains-for-high-yield" className="text-[#275C53] hover:text-[#D7B65D]">high-yield cannabis seeds</Link> like Big Bud can exceed 600g/m². <strong>THC content</strong> determines potency — <Link href="/product-category/high-tch-seeds" className="text-[#275C53] hover:text-[#D7B65D]">high-THC strains</Link> above 25% deliver the strongest effects.</p>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed"><strong>Flowering time</strong> affects your total grow timeline — <Link href="/product-category/fast-flowering-seeds" className="text-[#275C53] hover:text-[#D7B65D]">fast-flowering strains</Link> finish in 7-8 weeks while sativas may take 12+. <strong>Grow difficulty</strong> ranges from very easy (<Link href="/product-category/autoflowering-seeds" className="text-[#275C53] hover:text-[#D7B65D]">autoflower seeds</Link> like Northern Lights Auto) to advanced (pure sativas and exotic genetics). Understanding these metrics helps you choose genetics that match your space, experience, and goals. Use our <Link href="/yield-calculator" className="text-[#275C53] hover:text-[#D7B65D]">yield calculator</Link> for harvest estimates and our <Link href="/nutrient-calculator" className="text-[#275C53] hover:text-[#D7B65D]">nutrient calculator</Link> for feeding plans.</p>
            </section>

            {/* Which Strain Is Best for You */}
            <section>
              <h2 className="text-xl font-bold text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>Which Cannabis Strain Is Best for You?</h2>
              <p className="text-[14px] text-[#192026]/65 leading-relaxed mb-4">The right strain depends entirely on your priorities. Here is a breakdown by grower type:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="bg-white rounded-xl border border-[#275C53]/5 p-4"><h3 className="text-[13px] font-semibold text-[#275C53] mb-1">🌱 Beginners</h3><p className="text-[12px] text-[#192026]/50">Choose <Link href="/product-category/autoflowering-seeds" className="text-[#275C53] hover:text-[#D7B65D]">autoflower seeds</Link> like Northern Lights Auto or White Widow Auto. They flower automatically, stay compact, and tolerate mistakes.</p></div>
                <div className="bg-white rounded-xl border border-[#275C53]/5 p-4"><h3 className="text-[13px] font-semibold text-[#275C53] mb-1">📈 Yield Hunters</h3><p className="text-[12px] text-[#192026]/50">Compare <Link href="/product-category/best-strains-for-high-yield" className="text-[#275C53] hover:text-[#D7B65D]">high-yield strains</Link> like Big Bud, Critical Mass, and White Widow. Train with ScrOG for maximum canopy coverage.</p></div>
                <div className="bg-white rounded-xl border border-[#275C53]/5 p-4"><h3 className="text-[13px] font-semibold text-[#275C53] mb-1">🔥 Potency Seekers</h3><p className="text-[12px] text-[#192026]/50">Compare <Link href="/product-category/high-tch-seeds" className="text-[#275C53] hover:text-[#D7B65D]">high-THC strains</Link> like Gorilla Glue (28-32%), Bruce Banner (25-29%), and Girl Scout Cookies (25-28%).</p></div>
                <div className="bg-white rounded-xl border border-[#275C53]/5 p-4"><h3 className="text-[13px] font-semibold text-[#275C53] mb-1">⚡ Speed Growers</h3><p className="text-[12px] text-[#192026]/50">Choose <Link href="/product-category/fast-flowering-seeds" className="text-[#275C53] hover:text-[#D7B65D]">fast-flowering strains</Link> or autoflowers that finish in 8-10 weeks from seed. Critical Auto and Northern Lights Auto are the fastest.</p></div>
                <div className="bg-white rounded-xl border border-[#275C53]/5 p-4"><h3 className="text-[13px] font-semibold text-[#275C53] mb-1">🏠 Indoor Growers</h3><p className="text-[12px] text-[#192026]/50">Compare <Link href="/product-category/best-strains-for-indoor-growing" className="text-[#275C53] hover:text-[#D7B65D]">indoor strains</Link> that stay compact under 4 feet. Northern Lights, Girl Scout Cookies, and OG Kush are top indoor performers.</p></div>
                <div className="bg-white rounded-xl border border-[#275C53]/5 p-4"><h3 className="text-[13px] font-semibold text-[#275C53] mb-1">☀️ Outdoor Growers</h3><p className="text-[12px] text-[#192026]/50">Compare <Link href="/product-category/best-strains-for-outdoor-growing" className="text-[#275C53] hover:text-[#D7B65D]">outdoor strains</Link> with mold resistance and fast finish times. Blue Dream and Sour Diesel thrive in warm US climates.</p></div>
              </div>
            </section>

            {/* Expanded Example Comparisons */}
            <section>
              <h2 className="text-xl font-bold text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Popular Strain Comparisons</h2>

              {[
                { heading: 'Classic Strain Comparisons', items: [
                  { title: 'Northern Lights vs Blue Dream', summary: 'Northern Lights is the easier grow — compact, fast, and incredibly forgiving. Blue Dream offers higher yields and more balanced effects. Choose Northern Lights for your first grow; Blue Dream for bigger, more versatile harvests.' },
                  { title: 'OG Kush vs Girl Scout Cookies', summary: 'Both are West Coast legends. OG Kush has the signature fuel-lemon-pine terpene profile. GSC delivers sweeter flavors with slightly higher THC. OG Kush is the purist choice; GSC is the modern classic.' },
                  { title: 'White Widow vs AK-47', summary: 'White Widow is the Dutch coffeeshop standard — easy to grow with balanced effects. AK-47 hits harder with more cerebral stimulation. Choose White Widow for reliability; AK-47 for a more intense experience.' },
                  { title: 'Jack Herer vs Sour Diesel', summary: 'Both are elite sativas. Jack Herer offers clear-headed focus and creativity. Sour Diesel delivers more intense energy with its signature fuel aroma. Jack Herer for mental clarity; Sour Diesel for raw energy.' },
                ]},
                { heading: 'High Yield Strain Comparisons', items: [
                  { title: 'Big Bud vs Critical Mass', summary: 'Both are yield monsters. Big Bud has a slight edge in total weight. Critical Mass finishes faster with denser buds. Choose Big Bud for maximum weight; Critical Mass for faster turnaround.' },
                  { title: 'Blue Dream vs Super Silver Haze', summary: 'Blue Dream yields heavily with balanced effects and easy growing. Super Silver Haze produces similar yields but with more intense sativa effects and longer flowering. Blue Dream for balance; SSH for pure sativa energy.' },
                  { title: 'Gorilla Glue vs White Widow', summary: 'Gorilla Glue produces extreme resin with higher THC (28%+). White Widow yields comparably but with lower potency (20-25%). Gorilla Glue for potency + yield; White Widow for easier growing.' },
                ]},
                { heading: 'High THC Strain Comparisons', items: [
                  { title: 'Gorilla Glue vs Bruce Banner', summary: 'Both exceed 25% THC. Gorilla Glue produces more resin and is slightly easier to grow. Bruce Banner offers more cerebral effects and potentially higher THC peaks. Gorilla Glue for yield + potency; Bruce Banner for the strongest THC.' },
                  { title: 'Girl Scout Cookies vs Gelato', summary: 'GSC is the iconic hybrid with 25-28% THC. Gelato offers more exotic dessert terpenes with similar potency. GSC for proven reliability; Gelato for the most complex flavor experience.' },
                  { title: 'Wedding Cake vs Ice Cream Cake', summary: 'Both are dessert-terpene powerhouses above 25% THC. Wedding Cake leans slightly more euphoric; Ice Cream Cake is more sedating. Wedding Cake for balanced potency; Ice Cream Cake for deep evening relaxation.' },
                ]},
                { heading: 'Beginner Strain Comparisons', items: [
                  { title: 'Northern Lights vs White Widow', summary: 'Both are top beginner choices. Northern Lights is slightly more compact and forgiving. White Widow yields a bit more and has more balanced effects. Northern Lights for absolute ease; White Widow for a step up in yield.' },
                  { title: 'Blue Dream vs Green Crack', summary: 'Blue Dream is the most beginner-friendly sativa-hybrid with balanced effects. Green Crack delivers more intense energy. Blue Dream for versatility; Green Crack for daytime productivity.' },
                  { title: 'Northern Lights Auto vs White Widow Auto', summary: 'The two easiest autoflowers. Northern Lights Auto is the most forgiving plant in existence. White Widow Auto yields slightly more. Both finish in 8-10 weeks and tolerate beginner mistakes beautifully.' },
                ]},
                { heading: 'Autoflower vs Feminized Comparisons', items: [
                  { title: 'Northern Lights Auto vs Northern Lights Feminized', summary: 'The auto version finishes in 10 weeks from seed but yields less per plant. The feminized version needs 4-5 months but produces significantly more per plant. Auto for speed; feminized for maximum yield.' },
                  { title: 'Gorilla Glue Auto vs Gorilla Glue Feminized', summary: 'Both carry the legendary potency. The auto version is faster and easier but produces smaller harvests. The feminized version needs more time and skill but rewards with massive, extremely potent buds.' },
                  { title: 'Blue Dream Auto vs Blue Dream Feminized', summary: 'Auto Blue Dream finishes in 10 weeks with moderate yields. Feminized Blue Dream can grow huge outdoors with much larger harvests. Auto for beginners and speed; feminized for experienced growers chasing maximum production.' },
                ]},
              ].map(group => (
                <div key={group.heading} className="mb-6">
                  <h3 className="text-[14px] font-bold text-[#275C53] mb-3">{group.heading}</h3>
                  <div className="space-y-3">
                    {group.items.map(ex => (
                      <div key={ex.title} className="bg-white rounded-xl border border-[#275C53]/5 p-4">
                        <h4 className="text-[13px] font-semibold text-[#275C53] mb-1">{ex.title}</h4>
                        <p className="text-[12px] text-[#192026]/50 leading-relaxed">{ex.summary}</p>
                        <div className="flex gap-3 mt-2">
                          {ex.title.split(' vs ').map(name => (
                            <Link key={name} href={`/${name.trim().toLowerCase().replace(/\s+/g, '-').replace(/#/g, '')}-feminized`} className="text-[10px] text-[#275C53] font-semibold hover:text-[#D7B65D]">Shop {name.trim()} →</Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-xl font-bold text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Frequently Asked Questions</h2>
              <div className="space-y-3">
                {[
                  { q: 'How do I compare cannabis strains effectively?', a: 'Focus on the metrics that matter for your goals. Beginners should prioritize grow difficulty. Yield-focused growers should compare indoor/outdoor yield numbers. Potency seekers should look at THC content. Use our comparison tool above to see these metrics side by side for any strains in our catalog.' },
                  { q: 'Which cannabis strain has the highest yield?', a: 'Big Bud, Critical Mass, and Super Skunk consistently produce the highest yields. Indoor, expect 500-600g/m². Outdoor, individual plants can exceed 800g. Use our yield calculator for estimates based on your specific setup and strain choice.' },
                  { q: 'What is more important — THC or yield when choosing seeds?', a: 'It depends on your priorities. Higher THC means stronger effects per gram — you need less product. Higher yield means more total harvest weight. For personal growers, a balanced strain with moderate THC (20-25%) and good yield is usually the best value.' },
                  { q: 'Are autoflowers easier to grow than feminized strains?', a: 'Yes. Autoflowers flower automatically, stay compact, and finish in 8-10 weeks with minimal intervention. Feminized photoperiod plants require light cycle management and more growing knowledge but offer larger yields and more control over plant size.' },
                  { q: 'Which strain is better for indoor growing?', a: 'Northern Lights, Girl Scout Cookies, and White Widow are consistently rated as the best indoor strains. They stay compact, respond well to training, and produce excellent yields under LED or HPS lighting. Autoflowering versions are even easier for indoor beginners.' },
                  { q: 'How do I know which cannabis strain is right for me?', a: 'Consider your experience level, grow space, desired effects, and timeline. Beginners should start with forgiving autoflowers. Indoor growers need compact strains. Yield-focused growers should choose proven heavy producers. Our strain finder quiz can help narrow your options in 60 seconds.' },
                  { q: 'Can I compare more than two cannabis strains at once?', a: 'Yes. Our comparison tool supports up to 4 strains simultaneously. This is useful when narrowing down your final selection from a shortlist. Compare yield, THC, difficulty, and flowering time side by side to make the best choice for your grow.' },
                  { q: 'What makes one strain easier to grow than another?', a: 'Easy-to-grow strains share traits like natural pest resistance, tolerance to feeding mistakes, compact growth, fast flowering, and stable genetics. Strains like Northern Lights and White Widow have been refined over decades to be forgiving. Exotic or pure sativa genetics tend to be more demanding.' },
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
                { label: 'Beginner Grow Guide', href: '/blog/top-7-recommended-strains-for-beginners' },
                { label: 'Indoor Growing Guide', href: '/blog/cannabis-growing-lights-and-phases' },
                { label: 'Autoflower Grow Guide', href: '/blog/autoflower-cannabis-seeds-and-growing-guide' },
                { label: 'Nutrient Guide', href: '/blog/cannabis-nutrient-deficiencies' },
                { label: 'Training & Topping', href: '/blog/cannabis-plant-pruning-and-topping' },
                { label: 'When to Harvest', href: '/blog/cannabis-trichomes-and-harvesting' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="block text-[13px] text-[#192026]/60 hover:text-[#275C53] transition-colors py-0.5">→ {l.label}</Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#275C53]/5 p-5">
            <h3 className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 font-semibold mb-3">Shop by Goal</h3>
            <div className="space-y-2">
              {[
                { label: 'Beginner Seeds', href: '/product-category/autoflowering-seeds' },
                { label: 'High Yield Seeds', href: '/product-category/best-strains-for-high-yield' },
                { label: 'High THC Seeds', href: '/product-category/high-tch-seeds' },
                { label: 'Indoor Strains', href: '/product-category/best-strains-for-indoor-growing' },
                { label: 'Fast Flowering', href: '/product-category/fast-flowering-seeds' },
                { label: 'Feminized Seeds', href: '/product-category/feminized-seeds' },
                { label: 'Autoflower Seeds', href: '/product-category/autoflowering-seeds' },
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
                { label: 'Nutrient Calculator', href: '/nutrient-calculator' },
                { label: 'Strain Finder Quiz', href: '/strain-finder' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="block text-[13px] text-[#275C53] hover:text-[#D7B65D] transition-colors py-0.5 font-medium">→ {l.label}</Link>
              ))}
            </div>
          </div>

          <div className="bg-[#F5F0EA] rounded-2xl p-5">
            <h3 className="text-[10px] uppercase tracking-[1px] text-[#275C53]/50 font-semibold mb-2">About This Tool</h3>
            <p className="text-[12px] text-[#192026]/50 leading-relaxed">This comparison tool helps growers evaluate yield, potency, flowering time, and grow difficulty side by side. Use it as a planning tool before choosing seeds for your next run.</p>
          </div>

          <div className="bg-[#275C53] rounded-2xl p-5 text-center">
            <p className="text-white/80 text-[13px] mb-3">Not sure which strain is right?</p>
            <Link href="/strain-finder" className="inline-block w-full py-3 bg-white text-[#275C53] rounded-xl text-[13px] font-bold hover:bg-[#D7B65D] hover:text-white transition-colors">Take the Strain Finder Quiz</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
