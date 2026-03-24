import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'My Account | Royal King Seeds USA',
};

export default function AccountPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-3xl text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>My Account</h1>
        <p className="text-[#192026]/70 mb-8">Account features coming soon. For order inquiries, please contact our support team.</p>
        <div className="flex flex-col gap-3">
          <Link href="/contact" className="btn-main">Contact Support</Link>
          <Link href="/product-category/shop-all-cannabis-seeds" className="btn-second">Shop Seeds</Link>
        </div>
      </div>
    </div>
  );
}
