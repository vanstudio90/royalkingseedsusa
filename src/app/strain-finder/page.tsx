import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts } from '@/lib/products/data';
import { StrainFinderQuiz } from './StrainFinderQuiz';

export const metadata: Metadata = {
  title: 'Cannabis Strain Finder — Find the Best Weed Strain for You | Royal King Seeds',
  description: 'Use our cannabis strain finder quiz to discover the best marijuana strains for your desired effects, growing experience, climate, and flavor preferences. Find your perfect strain in under 60 seconds.',
  keywords: ['cannabis strain finder', 'find the best cannabis strain', 'weed strain selector', 'cannabis strain quiz', 'what strain should I grow', 'best marijuana strains for beginners', 'strain recommendation tool'],
  alternates: { canonical: 'https://royalkingseeds.us/strain-finder' },
  openGraph: {
    title: 'Cannabis Strain Finder — Find the Best Weed Strain for You',
    description: 'Use our cannabis strain finder quiz to discover the best marijuana strains based on effects, experience level, climate, and flavor. Personalized recommendations in 60 seconds.',
    url: 'https://royalkingseeds.us/strain-finder',
    siteName: 'Royal King Seeds',
    type: 'website',
  },
};

const faqs = [
  {
    q: 'What is the best cannabis strain for beginners?',
    a: 'The best beginner strains are forgiving, mold-resistant, and easy to grow. Autoflowering varieties like Northern Lights Auto, Blue Dream Auto, and White Widow Auto are excellent choices because they flower automatically, finish quickly (8–10 weeks), and don\'t require light schedule changes. Our strain finder quiz factors in your experience level to recommend beginner-friendly genetics.',
  },
  {
    q: 'How do I choose the right weed strain?',
    a: 'Start with what you want to feel — relaxed, energetic, creative, or sleepy. Then consider your growing environment (indoor vs outdoor), your experience level, and flavor preferences. Our cannabis strain finder automates this process by scoring over 1,200 strains against your answers and showing you the top matches with explanations for why each strain fits.',
  },
  {
    q: 'What cannabis strain gives the strongest high?',
    a: 'High-THC strains like Gorilla Glue (30%+ THC), Bruce Banner, Girl Scout Cookies, and Godfather OG are among the most potent cannabis strains available. These are best suited for experienced users. If you\'re looking for strong effects, select "Strong" in the potency step of our strain finder quiz.',
  },
  {
    q: 'What\'s better: indica or sativa?',
    a: 'Neither is objectively better — it depends on what you want. Indica strains tend to produce relaxing, body-heavy effects ideal for evening use and sleep. Sativa strains lean toward energizing, cerebral effects great for daytime creativity and focus. Hybrids offer a blend of both. Our quiz helps you find the right type based on your desired experience.',
  },
  {
    q: 'What cannabis strain grows fastest?',
    a: 'Autoflowering strains are the fastest, finishing in 8–10 weeks from seed to harvest regardless of light schedule. Fast-flowering photoperiod strains like Quick One, Speedy Chile, and Early Skunk can finish in 6–7 weeks of flowering. Use our strain finder and select "Cold / Short Season" under climate to see fast-finishing recommendations.',
  },
  {
    q: 'Can I grow cannabis seeds indoors and outdoors?',
    a: 'Yes — most cannabis strains can be grown both indoors and outdoors, though some perform better in specific environments. Autoflowers and compact indicas thrive indoors, while tall sativas and mold-resistant strains excel outdoors. Our strain finder quiz matches strains to your grow environment for optimal results.',
  },
  {
    q: 'What are the best cannabis strains for anxiety?',
    a: 'Strains high in CBD or with balanced THC/CBD ratios are often recommended for anxiety, along with calming indica-dominant hybrids. Popular choices include Granddaddy Purple, ACDC, Harlequin, and Northern Lights. In our quiz, select "Relax / Chill" and "Mild" potency to see anxiety-friendly strain recommendations.',
  },
  {
    q: 'How does the cannabis strain finder quiz work?',
    a: 'Our strain finder uses a weighted scoring algorithm that evaluates over 1,200 cannabis strains across six dimensions: desired effects, potency level, growing environment, experience level, flavor preferences, and climate compatibility. Each strain receives a match score, and your top results are ranked by how closely they align with your specific answers — so you always see the most relevant recommendations first.',
  },
];

export default async function StrainFinderPage() {
  const allProducts = await getProducts();

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

  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  // WebApplication Schema
  const toolSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Cannabis Strain Finder Quiz',
    description: 'Interactive cannabis strain recommendation tool that matches users with ideal marijuana strains based on desired effects, growing experience, climate, and flavor preferences.',
    url: 'https://royalkingseeds.us/strain-finder',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    provider: {
      '@type': 'Organization',
      name: 'Royal King Seeds',
      url: 'https://royalkingseeds.us',
    },
  };

  const hStyle = { fontFamily: 'var(--font-patua)' };
  const pClass = 'text-[#192026]/75 text-[15px] leading-[1.85] mb-5';
  const h2Class = 'text-2xl sm:text-[28px] text-[#275C53] mb-4 mt-14';
  const h3Class = 'text-lg text-[#275C53] font-semibold mb-2 mt-8';

  return (
    <div className="min-h-screen bg-[#F5F0EA]">
      {/* Schema Markup */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />

      {/* ── HERO ── */}
      <div className="bg-[#275C53] text-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <p className="text-[#D7B65D] text-xs uppercase tracking-[2px] font-semibold mb-3">Cannabis Strain Finder</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl mb-4" style={hStyle}>
            Cannabis Strain Finder — Find the Best Weed Strain for You
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-4">
            Use our cannabis strain finder to quickly discover the best weed seeds based on your desired effects, THC level, growing environment, and flavor preferences. Whether you&apos;re looking for relaxing indica strains, energizing sativas, or beginner-friendly cannabis seeds, this marijuana strain selector matches you with the right genetics in seconds.
          </p>
          <p className="text-white/60 max-w-2xl mx-auto text-sm leading-relaxed">
            Not sure what strain you should grow? Our weed strain finder quiz takes under 60 seconds — just answer 6 simple questions and get personalized recommendations from over 1,200 strains, ranked by how closely they match what you&apos;re looking for.
          </p>
        </div>
      </div>

      {/* ── QUIZ ── */}
      <StrainFinderQuiz products={products} />

      {/* ── SEO CONTENT BLOCK ── */}
      <div className="bg-white border-t border-[#275C53]/5">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-14">
          <div className="max-w-3xl mx-auto">

            {/* ── H2: How to Choose the Right Cannabis Strain ── */}
            <h2 className={h2Class} style={hStyle}>How to Choose the Right Cannabis Strain</h2>
            <p className={pClass}>
              Choosing the right cannabis strain can feel overwhelming when you&apos;re staring at a catalog of over a thousand varieties. Whether you&apos;re browsing <Link href="/product-category/feminized-seeds" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">feminized seeds</Link>, <Link href="/product-category/autoflowering-seeds" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">autoflower seeds</Link>, or <Link href="/product-category/high-tch-seeds" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">high-THC strains</Link> — strain names alone don&apos;t tell you much. Most growers, especially first-timers, don&apos;t think in terms of genetics or terpene profiles. They think in terms of how they want to feel, what they can realistically grow, and what flavors appeal to them.
            </p>
            <p className={pClass}>
              That&apos;s exactly why we built this cannabis strain finder tool. Our weed strain finder takes the guesswork out of choosing seeds — whether you use the quiz above or prefer to browse manually, understanding a few key factors will help you find the best cannabis strain for your specific situation.
            </p>

            <h3 className={h3Class} style={hStyle}>Indica vs. Sativa vs. Hybrid</h3>
            <p className={pClass}>
              The three main cannabis types — <strong>indica</strong>, <strong>sativa</strong>, and <strong>hybrid</strong> — each produce different effects and grow differently. <Link href="/product-category/indica-seeds" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">Indica strains</Link> tend to deliver deep body relaxation, making them popular for evening use, pain relief, and sleep. <Link href="/product-category/sativa-seeds" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">Sativa strains</Link> lean cerebral — think energy, creativity, and focus — and are preferred for daytime use. <Link href="/product-category/hybrid" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">Hybrids</Link> blend both, and most modern strains fall into this category with varying indica-to-sativa ratios.
            </p>

            <h3 className={h3Class} style={hStyle}>THC vs. CBD — Potency Matters</h3>
            <p className={pClass}>
              THC is the compound responsible for the psychoactive &ldquo;high,&rdquo; while CBD provides therapeutic benefits without intense psychoactivity. <Link href="/product-category/high-tch-seeds" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">High-THC strains</Link> (22%+) deliver powerful effects suited for experienced users. <Link href="/product-category/cbd-strains" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">CBD-dominant strains</Link> or balanced THC/CBD varieties are ideal for those seeking relief without overwhelming potency. Our weed strain selector quiz lets you choose your preferred potency level so your results match your comfort zone.
            </p>

            <h3 className={h3Class} style={hStyle}>Effects — Relaxation, Energy, Creativity, Sleep</h3>
            <p className={pClass}>
              The most important question isn&apos;t &ldquo;what strain name do I want?&rdquo; — it&apos;s &ldquo;how do I want to feel?&rdquo; Some people want a strain that melts stress after a long day. Others want something that fuels a creative session or powers through a hike. Our cannabis strain quiz starts with this exact question because effects are the single biggest factor in strain satisfaction.
            </p>

            <h3 className={h3Class} style={hStyle}>Grow Difficulty — Match Your Skill Level</h3>
            <p className={pClass}>
              Not every strain is easy to grow. Some require precise humidity control, specific nutrient schedules, or advanced training techniques. If you&apos;re asking &ldquo;what strain should I grow?&rdquo; for the first time, stick with beginner-rated genetics — strains labeled as easy to grow, mold-resistant, and forgiving of minor mistakes. <Link href="/product-category/autoflowering-seeds" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">Autoflowering seeds</Link> are particularly beginner-friendly since they flower on their own schedule without light cycle changes.
            </p>

            <h3 className={h3Class} style={hStyle}>Indoor vs. Outdoor Growing</h3>
            <p className={pClass}>
              Your grow environment matters. Indoor growers need compact plants with manageable heights and quick flowering times. Outdoor growers need strains that can handle weather fluctuations, pests, and potentially shorter seasons. Many <Link href="/product-category/feminized-seeds" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">feminized photoperiod strains</Link> excel outdoors, while autoflowers work well in both environments. Our strain finder quiz factors in your growing setup to recommend varieties that will thrive where you grow.
            </p>

            {/* ── H2: What Makes a Cannabis Strain Right for You? ── */}
            <h2 className={h2Class} style={hStyle}>What Makes a Cannabis Strain Right for You?</h2>
            <p className={pClass}>
              The &ldquo;best&rdquo; strain doesn&apos;t exist in a vacuum — it depends entirely on your situation. Here are the dimensions our cannabis strain finder evaluates to deliver personalized results.
            </p>

            <h3 className={h3Class} style={hStyle}>Desired Effects</h3>
            <p className={pClass}>
              Whether you want deep relaxation, social energy, creative focus, or heavy sedation for sleep — effects are the #1 driver of strain satisfaction. Our quiz maps your desired experience to strains with matching effect profiles: indica-heavy genetics for body relaxation, sativa-dominant strains for cerebral stimulation, and balanced hybrids for the best of both worlds.
            </p>

            <h3 className={h3Class} style={hStyle}>Flavor and Terpene Profiles</h3>
            <p className={pClass}>
              Cannabis flavor isn&apos;t just about taste — terpenes influence effects too. Myrcene (earthy, musky) promotes relaxation. Limonene (citrus) tends toward mood elevation. Caryophyllene (peppery) may help with inflammation. Our quiz includes a flavor preference step so you can find strains like <Link href="/product-category/fruity-cannabis-seeds" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">fruity cannabis seeds</Link>, diesel-forward genetics, or earthy <Link href="/product-category/kush-seeds" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">kush varieties</Link> based on what appeals to you.
            </p>

            <h3 className={h3Class} style={hStyle}>Yield Expectations</h3>
            <p className={pClass}>
              If maximizing harvest is your priority, you&apos;ll want high-yielding genetics. Indoor yields typically range from 400–600g/m&sup2;, while outdoor plants can produce 500–1000g+ per plant depending on strain, climate, and growing technique. Indica-dominant strains often produce dense, heavy buds, while sativas may stretch taller with airier colas but can still deliver impressive total weight.
            </p>

            <h3 className={h3Class} style={hStyle}>Climate Compatibility</h3>
            <p className={pClass}>
              Growing in Michigan is very different from growing in Arizona. Cold climates with short seasons demand <Link href="/product-category/fast-flowering-seeds" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">fast-flowering strains</Link> or autoflowers that finish before frost. Hot, dry climates favor sativa-leaning genetics with open bud structures that resist mold. Humid regions need strains with natural mold resistance. Our strain finder&apos;s climate step ensures your recommendations actually suit your environment.
            </p>

            {/* ── H2: Cannabis Strain Finder Tool — How It Works ── */}
            <h2 className={h2Class} style={hStyle}>How Our Cannabis Strain Finder Tool Works</h2>
            <p className={pClass}>
              Our cannabis strain finder isn&apos;t a simple filter — it&apos;s a weighted scoring engine that evaluates every strain in our catalog against your specific answers. Here&apos;s what makes it different from just browsing a product page.
            </p>
            <p className={pClass}>
              <strong>Step 1:</strong> You answer 6 quick questions about your desired experience, potency preference, growing environment, skill level, flavor taste, and climate. Each question takes just a few seconds — most people finish the entire quiz in under 60 seconds.
            </p>
            <p className={pClass}>
              <strong>Step 2:</strong> Behind the scenes, our algorithm scores each of our 1,200+ strains across multiple dimensions. Instead of strict filtering (which often returns zero results), we use weighted matching — every strain gets a score, and your best matches rise to the top.
            </p>
            <p className={pClass}>
              <strong>Step 3:</strong> You see your top recommended strains ranked by match percentage, with clear explanations of <em>why</em> each strain was selected — like &ldquo;Beginner-friendly,&rdquo; &ldquo;Great for relaxation,&rdquo; or &ldquo;Matches your flavor preferences.&rdquo; This builds confidence in your purchase decision instead of leaving you guessing.
            </p>
            <p className={pClass}>
              Why is this better than browsing? Because most people don&apos;t know strain names. They know how they want to feel. Our weed strain selector translates your preferences into genetics — so instead of &ldquo;I don&apos;t know what to buy,&rdquo; it becomes &ldquo;this is exactly what I need.&rdquo;
            </p>

            {/* ── H2: Best Cannabis Strains by Category ── */}
            <h2 className={h2Class} style={hStyle}>Best Cannabis Strains by Category</h2>
            <p className={pClass}>
              Not ready for the quiz? Here&apos;s a quick guide to our most popular strain categories with direct links to browse each collection.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 my-8">
              {[
                {
                  title: 'Best Strains for Beginners',
                  desc: 'Forgiving, mold-resistant, and easy to grow. Autoflowering varieties like Northern Lights Auto, Blue Dream Auto, and White Widow Auto are perfect first-time grows.',
                  href: '/product-category/autoflowering-seeds',
                  label: 'Shop Beginner Seeds',
                },
                {
                  title: 'Best High-THC Strains',
                  desc: 'For experienced users seeking maximum potency. Strains like Gorilla Glue, Bruce Banner, and Girl Scout Cookies test at 25–30%+ THC for powerful effects.',
                  href: '/product-category/high-tch-seeds',
                  label: 'Shop High THC Seeds',
                },
                {
                  title: 'Best Outdoor Strains',
                  desc: 'Hardy genetics built for real-world conditions. Mold-resistant, pest-tolerant strains that thrive in gardens, balconies, and open fields across the USA.',
                  href: '/product-category/best-strains-for-outdoor-growing',
                  label: 'Shop Outdoor Seeds',
                },
                {
                  title: 'Best Indoor Strains',
                  desc: 'Compact plants with manageable heights and excellent yields under artificial light. Autoflowers and feminized indicas dominate indoor grow rooms.',
                  href: '/product-category/feminized-seeds',
                  label: 'Shop Indoor Seeds',
                },
                {
                  title: 'Best Fruity Cannabis Strains',
                  desc: 'Sweet, berry-forward, and tropical flavor profiles. Strains like Zkittlez, Gelato, Strawberry Banana, and Blueberry deliver exceptional taste and smooth smoke.',
                  href: '/product-category/fruity-cannabis-seeds',
                  label: 'Shop Fruity Seeds',
                },
                {
                  title: 'Best Strains for Relaxation & Anxiety',
                  desc: 'Calming indica-dominant genetics and CBD-rich strains ideal for stress relief, unwinding, and managing anxiety. Granddaddy Purple and Northern Lights are classics.',
                  href: '/product-category/best-strains-for-anxiety',
                  label: 'Shop Relaxation Seeds',
                },
              ].map((cat) => (
                <Link
                  key={cat.title}
                  href={cat.href}
                  className="bg-[#F5F0EA] rounded-2xl p-6 border border-[#275C53]/5 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                >
                  <h3 className="text-[#275C53] font-semibold text-[15px] mb-2 group-hover:text-[#D7B65D] transition-colors" style={hStyle}>{cat.title}</h3>
                  <p className="text-[#192026]/70 text-[13px] leading-relaxed mb-3">{cat.desc}</p>
                  <span className="text-[#D7B65D] text-[13px] font-medium">{cat.label} →</span>
                </Link>
              ))}
            </div>

            <p className={pClass}>
              Want something more specific? Our <Link href="/product-category/exotic-cannabis-seeds" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">exotic strains collection</Link> features rare genetics, while the <Link href="/product-category/purple-genetics-seeds" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">purple genetics collection</Link> showcases visually stunning cultivars. For quick harvests, check our <Link href="/product-category/fast-flowering-seeds" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">fast-flowering seeds</Link>. Or simply <a href="#top" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">take the cannabis strain finder quiz</a> above and let the algorithm do the work.
            </p>

            {/* ── H2: Best Cannabis Strains for Specific Needs ── */}
            <h2 className={h2Class} style={hStyle}>Best Cannabis Strains for Specific Needs</h2>
            <p className={pClass}>
              Wondering what strain you should grow? Here are our top picks broken down by the most common goals growers have. Each recommendation links directly to seeds you can order today with discreet US shipping.
            </p>

            <h3 className={h3Class} style={hStyle}>Best Cannabis Strains for Beginners</h3>
            <p className={pClass}>
              The best marijuana strains for beginners are resilient, require minimal maintenance, and produce reliable yields even on a first grow. <Link href="/northern-lights-feminized" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">Northern Lights</Link> is a classic — forgiving, compact, and mold-resistant with deeply relaxing indica effects. <Link href="/blue-dream-feminized" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">Blue Dream</Link> is another go-to for new growers thanks to its balanced hybrid profile and generous yields. For the easiest possible experience, choose <Link href="/product-category/autoflowering-seeds" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">autoflower seeds</Link> — they flower on their own schedule without needing light cycle changes.
            </p>

            <h3 className={h3Class} style={hStyle}>Best Strains for Sleep and Relaxation</h3>
            <p className={pClass}>
              Heavy indica strains with sedating effects are the top choice for sleep. <Link href="/granddaddy-purple-feminized" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">Granddaddy Purple</Link> delivers grape-flavored relaxation that melts into deep sleep. <Link href="/northern-lights-feminized" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">Northern Lights</Link> is equally effective for nighttime use. For a balanced option with CBD, explore our <Link href="/product-category/cbd-strains" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">CBD seed collection</Link> — ideal for relaxation without overwhelming potency. Use our weed strain finder above and select &ldquo;Sleep / Heavy Body&rdquo; to see all our best sleep strains ranked for you.
            </p>

            <h3 className={h3Class} style={hStyle}>Best Strains for Energy and Creativity</h3>
            <p className={pClass}>
              Sativa-dominant strains are the go-to for daytime energy, focus, and creative sessions. <Link href="/jack-herer-feminized" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">Jack Herer</Link> is a legendary sativa with sharp cerebral effects and a spicy, earthy flavor. <Link href="/green-crack-feminized" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">Green Crack</Link> delivers intense focus and motivation without heavy sedation. Browse our full <Link href="/product-category/energizing-cannabis-seeds" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">energizing cannabis seeds</Link> collection or take the cannabis strain quiz and select &ldquo;Energy / Daytime&rdquo; for personalized picks.
            </p>

            <h3 className={h3Class} style={hStyle}>Best High-Yield Cannabis Strains</h3>
            <p className={pClass}>
              If maximizing your harvest is the priority, look for strains known for heavy production. <Link href="/big-bud-feminized" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">Big Bud</Link> lives up to its name with massive cola development — expect 500–600g/m&sup2; indoors. <Link href="/critical-mass-feminized" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">Critical Mass</Link> is another heavy producer that responds well to training techniques. For outdoor growers chasing maximum weight, explore our <Link href="/product-category/best-strains-for-outdoor-growing" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">best outdoor strains</Link> — some varieties produce over 1,000g per plant under optimal conditions.
            </p>

            <h3 className={h3Class} style={hStyle}>Best Fast-Growing Cannabis Strains</h3>
            <p className={pClass}>
              Short on time or growing in a cold climate with a limited season? <Link href="/product-category/fast-flowering-seeds" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">Fast-flowering strains</Link> and autoflowers finish weeks earlier than standard photoperiod genetics. Most autoflowers go from seed to harvest in just 8–10 weeks total. <Link href="/white-widow-auto-feminized" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">White Widow Auto</Link> is a popular fast-finisher with potent effects and excellent resin production. Our marijuana strain selector quiz includes a climate step — select &ldquo;Cold / Short Season&rdquo; to see fast-finishing strains matched to your setup.
            </p>

            {/* ── H2: Why Use Our Cannabis Strain Finder? ── */}
            <h2 className={h2Class} style={hStyle}>Why Use Our Cannabis Strain Finder?</h2>
            <p className={pClass}>
              With over 1,200 cannabis seed varieties in our catalog, browsing manually can take hours — and most customers end up overwhelmed, second-guessing their choice, or buying something that doesn&apos;t match what they actually want. Our cannabis strain finder tool solves this by doing the hard work for you.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                { bold: 'Personalized strain recommendations', text: ' — every result is scored against your specific answers, not a generic "best of" list. Your results are unique to you.' },
                { bold: 'Beginner-friendly guidance', text: ' — you don\'t need to know THC percentages, terpene profiles, or strain genetics. Just tell us how you want to feel and we\'ll translate that into the right seeds.' },
                { bold: 'Matches effects, flavor, and climate', text: ' — our weed strain finder evaluates six dimensions simultaneously: desired effects, potency, grow location, skill level, flavor preferences, and climate compatibility.' },
                { bold: 'Saves hours of browsing', text: ' — instead of reading through hundreds of product descriptions, get your top matches in under 60 seconds with clear explanations of why each strain fits.' },
                { bold: 'No "zero results" problem', text: ' — unlike rigid filters, our weighted scoring ensures you always see relevant recommendations, ranked from best match to good match.' },
              ].map((item) => (
                <li key={item.bold} className="flex items-start gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#275C53" strokeWidth="2" className="shrink-0 mt-0.5 opacity-70"><polyline points="20 6 9 17 4 12"/></svg>
                  <span className="text-[#192026]/75 text-[15px] leading-[1.85]"><strong className="text-[#275C53]">{item.bold}</strong>{item.text}</span>
                </li>
              ))}
            </ul>
            <p className={pClass}>
              Whether you&apos;re a first-time grower trying to find the best cannabis strain for your situation or an experienced cultivator exploring new genetics, our strain quiz gives you a shortcut to confident buying decisions. <a href="#top" className="text-[#275C53] font-medium hover:text-[#D7B65D] underline underline-offset-2">Try the cannabis strain finder now</a> — it&apos;s free and takes less than a minute.
            </p>

            {/* ── H2: FAQ ── */}
            <h2 className={h2Class} style={hStyle}>Cannabis Strain Finder FAQs</h2>
            <p className="text-[#192026]/70 text-[15px] leading-relaxed mb-6">
              Common questions about choosing cannabis strains, using our strain finder quiz, and finding the best seeds for your goals.
            </p>

            <div className="space-y-3 mb-10">
              {faqs.map((faq, i) => (
                <details key={i} className="bg-[#F5F0EA] rounded-2xl border border-[#275C53]/5 group">
                  <summary className="px-6 py-4 cursor-pointer text-[#275C53] font-medium text-sm flex items-center justify-between">
                    {faq.q}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#275C53]/40 shrink-0 ml-4 group-open:rotate-180 transition-transform">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-4 text-[13px] text-[#192026]/70 leading-relaxed">{faq.a}</div>
                </details>
              ))}
            </div>

            {/* ── CTA ── */}
            <div className="bg-[#275C53] rounded-2xl p-8 sm:p-10 text-center text-white">
              <h2 className="text-xl sm:text-2xl mb-3" style={hStyle}>Ready to Find Your Strain?</h2>
              <p className="text-white/80 text-sm max-w-lg mx-auto mb-6">
                Our cannabis strain finder quiz takes less than 60 seconds. Get personalized recommendations from over 1,200 strains — matched to your effects, flavor, climate, and skill level.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a href="#top" className="px-7 py-3 bg-[#D7B65D] text-[#1a3d36] text-sm font-semibold rounded-full hover:bg-[#c9a84e] transition-colors">
                  Take the Quiz Now
                </a>
                <Link href="/product-category/shop-all-cannabis-seeds" className="px-7 py-3 border border-white/25 text-white text-sm font-medium rounded-full hover:bg-white/10 transition-colors">
                  Browse All Seeds
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
