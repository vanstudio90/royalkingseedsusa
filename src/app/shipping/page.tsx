import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Shipping & Delivery — Discreet US Seed Shipping',
  description: 'Free shipping on orders over $99. Discreet packaging to all 50 states. 3-7 business day delivery with tracking. Learn about Royal King Seeds shipping policies.',
  alternates: { canonical: 'https://royalkingseeds.us/shipping' },
};

export default function ShippingPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Shipping &amp; Delivery</h1>
        <p className="text-[#192026]/70 mb-10">We ship cannabis seeds discreetly to all 50 US states. Here&apos;s everything you need to know about our shipping process.</p>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-6 border border-[#275C53]/5">
            <h2 className="text-lg text-[#275C53] font-semibold mb-3">Shipping Rates</h2>
            <div className="space-y-2 text-sm text-[#192026]/70">
              <p><strong className="text-[#275C53]">Free Shipping:</strong> Orders over $99 USD</p>
              <p><strong className="text-[#275C53]">Standard Shipping:</strong> $9.99 flat rate for orders under $99</p>
              <p><strong className="text-[#275C53]">Processing Time:</strong> 1-2 business days</p>
              <p><strong className="text-[#275C53]">Delivery Time:</strong> 3-7 business days via USPS/UPS</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#275C53]/5">
            <h2 className="text-lg text-[#275C53] font-semibold mb-3">Discreet Packaging</h2>
            <p className="text-sm text-[#192026]/70 leading-relaxed">
              Every order ships in plain, unmarked packaging. There is absolutely no mention of cannabis, seeds, or Royal King Seeds on the exterior of any package. Your privacy is our priority. Seeds are packaged in protective containers inside to ensure they arrive in perfect condition.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#275C53]/5">
            <h2 className="text-lg text-[#275C53] font-semibold mb-3">Order Tracking</h2>
            <p className="text-sm text-[#192026]/70 leading-relaxed">
              Every order includes a tracking number sent to your email. You can monitor your delivery status from our warehouse to your doorstep. If you have any concerns about your shipment, contact our support team.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#275C53]/5">
            <h2 className="text-lg text-[#275C53] font-semibold mb-3">Returns &amp; Germination Guarantee</h2>
            <p className="text-sm text-[#192026]/70 leading-relaxed">
              Due to the nature of our products, we cannot accept returns on opened seed packs. However, our germination guarantee covers seeds that fail to germinate when following our recommended method. Contact us within 30 days of delivery with documentation for a replacement.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <Link href="/faq" className="px-3 py-1.5 bg-[#F5F0EA] rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">FAQ</Link>
          <Link href="/contact" className="px-3 py-1.5 bg-[#F5F0EA] rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">Contact Us</Link>
          <Link href="/product-category/shop-all-cannabis-seeds" className="px-3 py-1.5 bg-[#F5F0EA] rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">Shop Seeds</Link>
        </div>
      </div>
    </div>
  );
}
