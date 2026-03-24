import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ — Cannabis Seed Questions Answered | Royal King Seeds USA',
  description: 'Find answers to common questions about buying cannabis seeds online in the USA. Shipping, payment, germination guarantee, legality, and growing advice from Royal King Seeds.',
  alternates: { canonical: 'https://royalkingseedsusa.vercel.app/faq' },
};

const faqs = [
  { category: 'Ordering & Payment', questions: [
    { q: 'How do I place an order?', a: 'Browse our seed catalog, add items to your cart, and proceed to checkout. Enter your shipping and payment details, and your order will be confirmed via email within minutes.' },
    { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, and cryptocurrency (Bitcoin, Ethereum). All payment processing is secured with SSL encryption for your protection.' },
    { q: 'Can I modify or cancel my order?', a: 'Contact us within 2 hours of placing your order at support@royalkingseeds.us. Once orders enter processing, modifications may not be possible.' },
    { q: 'Do you offer bulk or wholesale pricing?', a: 'Yes. We offer volume discounts on pack sizes of 10 and 20 seeds. For larger wholesale inquiries, contact our team directly.' },
  ]},
  { category: 'Shipping & Delivery', questions: [
    { q: 'Where do you ship?', a: 'We ship to all 50 US states. Orders are packaged discreetly in plain, unmarked packaging with no external indication of contents.' },
    { q: 'How long does shipping take?', a: 'Orders ship within 1-2 business days and typically arrive within 3-7 business days via USPS or UPS. Tracking information is provided for every order.' },
    { q: 'Is shipping free?', a: 'Free shipping on all orders over $99 USD. Orders under $99 have a flat shipping rate of $9.99.' },
    { q: 'Is the packaging discreet?', a: 'Absolutely. All orders ship in plain, unmarked boxes or envelopes. There is no mention of cannabis, seeds, or Royal King Seeds on the exterior packaging.' },
  ]},
  { category: 'Seeds & Growing', questions: [
    { q: 'What is your germination guarantee?', a: 'If your seeds fail to germinate following our recommended germination guide, we will replace them at no additional cost. Contact us within 30 days of delivery with photos documenting the germination attempt.' },
    { q: 'What\'s the difference between feminized and autoflower seeds?', a: 'Feminized seeds produce 99.9% female plants and require light cycle changes to trigger flowering. Autoflower seeds flower automatically based on age (8-10 weeks from seed), regardless of light schedule.' },
    { q: 'How should I store my seeds?', a: 'Store seeds in a cool, dark, dry place. An airtight container in the refrigerator is ideal for long-term storage. Properly stored seeds can remain viable for several years.' },
    { q: 'Do you provide growing advice?', a: 'Yes! Check our blog for growing guides, and our support team is happy to help with strain selection and basic cultivation questions.' },
  ]},
  { category: 'Legal & Privacy', questions: [
    { q: 'Is it legal to buy cannabis seeds in the USA?', a: 'Cannabis seeds are sold as adult novelty souvenirs and for genetic preservation purposes. Laws regarding germination vary by state. Buyers are responsible for understanding and complying with their local laws. Many states now allow home cultivation.' },
    { q: 'Is my personal information safe?', a: 'We use SSL encryption for all transactions and never share your personal information with third parties. Read our full Privacy Policy for details on data handling.' },
    { q: 'Do I need to be a certain age to order?', a: 'Yes, you must be at least 21 years of age (or the legal age in your jurisdiction) to place an order.' },
  ]},
];

export default function FaqPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Frequently Asked Questions</h1>
        <p className="text-[#192026]/70 mb-10">Everything you need to know about buying cannabis seeds online from Royal King Seeds. Can&apos;t find your answer? <Link href="/contact" className="text-[#275C53] font-medium hover:text-[#D7B65D]">Contact us</Link>.</p>

        {faqs.map((section) => (
          <div key={section.category} className="mb-10">
            <h2 className="text-lg text-[#275C53] font-semibold mb-4" style={{ fontFamily: 'var(--font-patua)' }}>{section.category}</h2>
            <div className="space-y-3">
              {section.questions.map((faq, i) => (
                <details key={i} className="bg-white rounded-2xl border border-[#275C53]/5 group">
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
          </div>
        ))}

        <div className="mt-10 bg-[#275C53] rounded-2xl p-8 text-center">
          <h3 className="text-xl text-white mb-3" style={{ fontFamily: 'var(--font-patua)' }}>Still Have Questions?</h3>
          <p className="text-white/70 text-sm mb-6">Our team is here to help with strain selection, orders, and growing advice.</p>
          <Link href="/contact" className="btn-main !bg-[#D7B65D] !text-[#1a3d36]">Contact Support</Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <Link href="/shipping" className="px-3 py-1.5 bg-[#F5F0EA] rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">Shipping Info</Link>
          <Link href="/product-category/shop-all-cannabis-seeds" className="px-3 py-1.5 bg-[#F5F0EA] rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">Shop Seeds</Link>
          <Link href="/blog" className="px-3 py-1.5 bg-[#F5F0EA] rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">Growing Guides</Link>
          <Link href="/privacy" className="px-3 py-1.5 bg-[#F5F0EA] rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
