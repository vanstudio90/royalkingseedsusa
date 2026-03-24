import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Legal Disclaimer | Royal King Seeds USA',
  description: 'Legal disclaimer for Royal King Seeds. Cannabis seeds are sold as adult novelty souvenirs and for genetic preservation purposes.',
  alternates: { canonical: 'https://royalkingseedsusa.vercel.app/legal' },
};

export default function LegalPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
      <div className="max-w-3xl mx-auto prose prose-sm text-[#192026]/80 prose-headings:text-[#275C53] prose-headings:font-normal">
        <h1 style={{ fontFamily: 'var(--font-patua)' }}>Legal Product Disclaimer</h1>
        <p>Cannabis seeds sold by Royal King Seeds are intended as adult novelty souvenirs and for the preservation of cannabis genetics. Our products are sold with the understanding that customers will use them in accordance with all applicable local, state, and federal laws.</p>
        <h2>US Cannabis Law Overview</h2>
        <p>Cannabis laws in the United States vary significantly by state. While many states have legalized home cultivation for personal use (including California, Colorado, Oregon, Michigan, and others), some states still restrict or prohibit the germination of cannabis seeds. It is the buyer&apos;s sole responsibility to research and comply with the laws in their specific jurisdiction before germinating any seeds.</p>
        <h2>No Medical Claims</h2>
        <p>Royal King Seeds does not make medical claims about any of our products. Descriptions of effects (such as relaxation, pain relief, or sleep aid) are based on commonly reported user experiences and should not be interpreted as medical advice. Consult a healthcare professional for medical guidance.</p>
        <h2>Age Verification</h2>
        <p>All customers must be 21 years of age or older to purchase from Royal King Seeds. By placing an order, you confirm that you meet this age requirement.</p>
        <div className="mt-8 flex flex-wrap gap-2 not-prose">
          <Link href="/terms" className="px-3 py-1.5 bg-[#F5F0EA] rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">Terms & Conditions</Link>
          <Link href="/privacy" className="px-3 py-1.5 bg-[#F5F0EA] rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
