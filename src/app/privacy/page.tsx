import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Royal King Seeds USA',
  description: 'How Royal King Seeds collects, uses, and protects your personal information. Read our privacy policy for US customers.',
  alternates: { canonical: 'https://royalkingseeds.us/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
      <div className="max-w-3xl mx-auto prose prose-sm text-[#192026]/80 prose-headings:text-[#275C53] prose-headings:font-normal">
        <h1 style={{ fontFamily: 'var(--font-patua)' }}>Privacy Policy</h1>
        <p><em>Last updated: March 2026</em></p>
        <p>Royal King Seeds (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy and is committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data when you visit our website or place an order.</p>
        <h2>Information We Collect</h2>
        <p>We collect information you provide directly: name, email address, shipping address, and payment details when you place an order. We also collect usage data through cookies and analytics to improve our website experience.</p>
        <h2>How We Use Your Information</h2>
        <p>Your information is used to process orders, send shipping updates, provide customer support, and improve our services. We do not sell or share your personal information with third parties for marketing purposes.</p>
        <h2>Data Security</h2>
        <p>We use SSL encryption to protect all data transmitted between your browser and our servers. Payment processing is handled by PCI-compliant third-party processors. We do not store credit card numbers on our servers.</p>
        <h2>Cookies</h2>
        <p>We use essential cookies for site functionality and analytics cookies to understand how visitors use our site. You can disable cookies in your browser settings, though this may affect site functionality.</p>
        <h2>Your Rights</h2>
        <p>You may request access to, correction of, or deletion of your personal data by contacting us at support@royalkingseeds.us. California residents have additional rights under the CCPA.</p>
        <h2>Contact Us</h2>
        <p>For privacy-related inquiries, contact us at <a href="mailto:support@royalkingseeds.us">support@royalkingseeds.us</a>.</p>
        <div className="mt-8 flex flex-wrap gap-2 not-prose">
          <Link href="/terms" className="px-3 py-1.5 bg-[#F5F0EA] rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">Terms & Conditions</Link>
          <Link href="/contact" className="px-3 py-1.5 bg-[#F5F0EA] rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
