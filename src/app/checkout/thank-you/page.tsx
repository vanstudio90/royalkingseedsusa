'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order') || 'N/A';

  return (
    <div className="max-w-[600px] mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-[#275C53] mb-2" style={{ fontFamily: 'var(--font-patua)' }}>
        Thank You for Your Order!
      </h1>
      <p className="text-[#192026]/60 text-sm mb-6">
        Your order <strong className="text-[#275C53]">{orderNumber}</strong> has been placed successfully.
      </p>
      <div className="bg-white rounded-2xl border border-[#275C53]/10 p-6 mb-8 text-left space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-[#275C53] mb-1">What happens next?</h3>
          <ul className="text-[13px] text-[#192026]/60 space-y-2">
            <li className="flex items-start gap-2"><span className="text-[#275C53] font-bold">1.</span> You will receive an order confirmation email shortly.</li>
            <li className="flex items-start gap-2"><span className="text-[#275C53] font-bold">2.</span> Your seeds will be packed in discreet, unmarked packaging.</li>
            <li className="flex items-start gap-2"><span className="text-[#275C53] font-bold">3.</span> A tracking number will be emailed when your order ships.</li>
            <li className="flex items-start gap-2"><span className="text-[#275C53] font-bold">4.</span> Delivery typically takes 3-7 business days across the US.</li>
          </ul>
        </div>
        <div className="pt-4 border-t border-[#192026]/5">
          <h3 className="text-sm font-semibold text-[#275C53] mb-1">Need help?</h3>
          <p className="text-[13px] text-[#192026]/60">
            Contact us at <a href="mailto:support@royalkingseeds.us" className="text-[#275C53] font-medium">support@royalkingseeds.us</a> with your order number.
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/product-category/shop-all-cannabis-seeds" className="btn-main">Continue Shopping</Link>
        <Link href="/blog" className="btn-second">Read Growing Guides</Link>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="max-w-[600px] mx-auto px-4 py-16 text-center"><p className="text-[#192026]/40">Loading...</p></div>}>
      <ThankYouContent />
    </Suspense>
  );
}
