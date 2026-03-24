import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Royal King Seeds USA',
  description: 'Terms and conditions for purchasing cannabis seeds from Royal King Seeds. Read before ordering.',
  alternates: { canonical: 'https://royalkingseedsusa.vercel.app/terms' },
};

export default function TermsPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
      <div className="max-w-3xl mx-auto prose prose-sm text-[#192026]/80 prose-headings:text-[#275C53] prose-headings:font-normal">
        <h1 style={{ fontFamily: 'var(--font-patua)' }}>Terms &amp; Conditions</h1>
        <p><em>Last updated: March 2026</em></p>
        <p>By accessing and using Royal King Seeds, you agree to the following terms and conditions. Please read them carefully before making a purchase.</p>
        <h2>Products</h2>
        <p>Cannabis seeds are sold as adult novelty souvenirs and for genetic preservation purposes only. It is the buyer&apos;s sole responsibility to understand and comply with all applicable local, state, and federal laws regarding cannabis seeds in their jurisdiction. Royal King Seeds assumes no liability for any illegal use of our products.</p>
        <h2>Age Requirement</h2>
        <p>You must be at least 21 years of age to place an order. By making a purchase, you confirm that you meet this age requirement.</p>
        <h2>Pricing &amp; Payment</h2>
        <p>All prices are listed in US Dollars (USD). We reserve the right to modify prices without notice. Payment is required at the time of order. We accept Visa, Mastercard, and cryptocurrency.</p>
        <h2>Shipping</h2>
        <p>We ship to all 50 US states. Delivery times are estimates and not guarantees. Royal King Seeds is not responsible for delays caused by shipping carriers, customs, or other factors beyond our control.</p>
        <h2>Germination Guarantee</h2>
        <p>Our germination guarantee covers seeds that fail to germinate when following our recommended germination guide. Claims must be submitted within 30 days of delivery with photographic documentation. Replacements are limited to the same strain and quantity as the original order.</p>
        <h2>Returns</h2>
        <p>Due to the nature of our products, we cannot accept returns on opened seed packs. Unopened packs in original condition may be eligible for return within 14 days of delivery. Contact support for return authorization.</p>
        <h2>Limitation of Liability</h2>
        <p>Royal King Seeds shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our total liability shall not exceed the purchase price of the order in question.</p>
        <h2>Contact</h2>
        <p>For questions about these terms, contact us at <a href="mailto:support@royalkingseeds.us">support@royalkingseeds.us</a>.</p>
        <div className="mt-8 flex flex-wrap gap-2 not-prose">
          <Link href="/privacy" className="px-3 py-1.5 bg-[#F5F0EA] rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/contact" className="px-3 py-1.5 bg-[#F5F0EA] rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
