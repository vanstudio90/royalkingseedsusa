import type { Metadata } from 'next';
import { getProducts } from '@/lib/products/data';
import { StrainFinderQuiz } from './StrainFinderQuiz';

export const metadata: Metadata = {
  title: 'Find Your Perfect Strain — Smart Strain Finder Quiz | Royal King Seeds',
  description: 'Answer a few simple questions and we\'ll match you with the ideal cannabis seeds for your goals, experience level, and growing setup. Personalized strain recommendations from Royal King Seeds.',
  alternates: { canonical: 'https://royalkingseeds.us/strain-finder' },
  openGraph: {
    title: 'Find Your Perfect Strain — Smart Strain Finder Quiz',
    description: 'Answer a few simple questions and we\'ll match you with the ideal cannabis seeds for your goals, experience level, and growing setup.',
    url: 'https://royalkingseeds.us/strain-finder',
    siteName: 'Royal King Seeds',
    type: 'website',
  },
};

export default async function StrainFinderPage() {
  const allProducts = await getProducts();

  // Serialize only what the quiz needs
  const products = allProducts
    .filter((p) => p.inStock)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      strainType: p.strainType,
      thcContent: p.thcContent,
      indicaPercent: p.indicaPercent,
      sativaPercent: p.sativaPercent,
      effects: p.effects,
      bestUse: p.bestUse,
      difficulty: p.difficulty || 'intermediate',
      feminized: p.feminized,
      autoflower: p.autoflower,
      price: p.price,
      imageUrl: p.imageUrl,
      categories: p.categories,
      seedOptions: p.seedOptions,
    }));

  return (
    <div className="min-h-screen bg-[#F5F0EA]">
      {/* Hero */}
      <div className="bg-[#275C53] text-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <p className="text-[#D7B65D] text-xs uppercase tracking-[2px] font-semibold mb-3">Smart Strain Finder</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl mb-4" style={{ fontFamily: 'var(--font-patua)' }}>
            Find Your Perfect Strain
          </h1>
          <p className="text-white/80 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Not sure which cannabis seeds are right for you? Answer a few quick questions and we&apos;ll match you with strains tailored to your goals, experience, and growing setup.
          </p>
        </div>
      </div>

      <StrainFinderQuiz products={products} />

      {/* SEO Content */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-14">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>How the Smart Strain Finder Works</h2>
          <p className="text-[#192026]/70 text-sm leading-relaxed mb-6">
            Our Smart Strain Finder uses a weighted matching algorithm to recommend the best cannabis seeds for your specific needs. Instead of browsing through hundreds of strains, simply tell us what kind of experience you&apos;re after, your growing environment, and your skill level — and we&apos;ll do the rest.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            {[
              { title: 'Personalized Results', desc: 'Every recommendation is scored against your preferences. No generic lists — just strains that match what you actually want.' },
              { title: 'Beginner Friendly', desc: 'Don\'t know THC percentages or terpene profiles? No problem. Our quiz translates your preferences into the right genetics.' },
              { title: 'Data-Driven Matching', desc: 'We score each strain across multiple dimensions — effects, potency, grow difficulty, and flavor — to find your best matches.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-[#275C53]/5">
                <h3 className="text-[#275C53] font-semibold text-sm mb-2">{item.title}</h3>
                <p className="text-[#192026]/70 text-[13px] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <h2 className="text-xl text-[#275C53] mb-3" style={{ fontFamily: 'var(--font-patua)' }}>Why Use a Strain Finder?</h2>
          <p className="text-[#192026]/70 text-sm leading-relaxed mb-4">
            With over 1,200 cannabis seed varieties available, choosing the right strain can feel overwhelming — especially if you&apos;re new to growing. Most customers don&apos;t think in terms of strain names or THC percentages. They think in terms of how they want to feel, what flavors they enjoy, and whether a strain will thrive in their setup.
          </p>
          <p className="text-[#192026]/70 text-sm leading-relaxed">
            The Smart Strain Finder bridges that gap. Whether you want something relaxing for evening use, an energizing daytime strain, or a beginner-friendly plant that&apos;s hard to mess up — this tool translates your preferences into actionable recommendations backed by real product data.
          </p>
        </div>
      </div>
    </div>
  );
}
