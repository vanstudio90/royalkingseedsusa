import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Refund & Returns Policy | Royal King Seeds USA',
  description: 'Royal King Seeds refund and returns policy. Learn about our germination guarantee and seed replacement program for US customers.',
  alternates: { canonical: 'https://royalkingseedsusa.vercel.app/refund-returns' },
};

export default function RefundReturnsPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
      <div className="max-w-3xl mx-auto prose prose-sm text-[#192026]/80 prose-headings:text-[#275C53] prose-headings:font-normal">
        <h1 style={{ fontFamily: 'var(--font-patua)' }}>Refund &amp; Returns Policy</h1>
        <h2>Germination Guarantee</h2>
        <p>Royal King Seeds stands behind the quality of our seeds. If your seeds fail to germinate following our recommended germination guide, we will replace them at no additional cost. To make a claim:</p>
        <ol>
          <li>Contact us within 30 days of delivery at support@royalkingseeds.us</li>
          <li>Provide your order number and photos documenting the germination attempt</li>
          <li>Follow our recommended paper towel germination method</li>
          <li>Replacement seeds will be shipped at no charge</li>
        </ol>
        <h2>Returns Policy</h2>
        <p>Due to the nature of our products, we cannot accept returns on opened seed packs. Unopened seed packs in their original sealed condition may be returned within 14 days of delivery for a full refund. Contact our support team for return authorization before shipping.</p>
        <h2>Damaged or Missing Items</h2>
        <p>If your order arrives damaged or is missing items, contact us within 7 days of delivery with photos of the damage. We will ship replacement items at no cost.</p>
        <h2>Shipping Costs</h2>
        <p>Return shipping costs are the responsibility of the customer unless the return is due to our error (wrong item shipped, damaged packaging). We will provide a prepaid return label in those cases.</p>
        <div className="mt-8 flex flex-wrap gap-2 not-prose">
          <Link href="/shipping" className="px-3 py-1.5 bg-[#F5F0EA] rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">Shipping Info</Link>
          <Link href="/contact" className="px-3 py-1.5 bg-[#F5F0EA] rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">Contact Us</Link>
          <Link href="/faq" className="px-3 py-1.5 bg-[#F5F0EA] rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">FAQ</Link>
        </div>
      </div>
    </div>
  );
}
