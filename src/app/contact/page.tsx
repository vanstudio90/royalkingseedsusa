import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us — Customer Support',
  description: 'Get in touch with the Royal King Seeds team. We help American growers with seed selection, order inquiries, growing advice, and account support. Email us or use our contact form.',
  alternates: { canonical: 'https://royalkingseeds.us/contact' },
};

export default function ContactPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Contact Us</h1>
        <p className="text-[#192026]/70 mb-8">Have a question about strains, your order, or growing advice? Our team responds within 24 hours on business days.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-white rounded-2xl p-6 border border-[#275C53]/5">
            <h3 className="text-sm font-semibold text-[#275C53] mb-2">Email Support</h3>
            <a href="mailto:support@royalkingseeds.us" className="text-[#275C53] text-sm hover:text-[#D7B65D]">support@royalkingseeds.us</a>
            <p className="text-[12px] text-[#192026]/50 mt-1">Responses within 24 hours</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#275C53]/5">
            <h3 className="text-sm font-semibold text-[#275C53] mb-2">Business Hours</h3>
            <p className="text-sm text-[#192026]/70">Monday - Friday</p>
            <p className="text-sm text-[#192026]/70">9:00 AM - 5:00 PM EST</p>
          </div>
        </div>

        <form className="space-y-4 bg-white rounded-2xl p-8 border border-[#275C53]/5">
          <h2 className="text-lg text-[#275C53] font-semibold mb-4">Send Us a Message</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="text-[12px] uppercase tracking-[1px] text-[#192026]/50 font-medium mb-1.5 block">Name</label>
              <input type="text" id="name" name="name" className="checkout-input" placeholder="Your name" />
            </div>
            <div>
              <label htmlFor="email" className="text-[12px] uppercase tracking-[1px] text-[#192026]/50 font-medium mb-1.5 block">Email</label>
              <input type="email" id="email" name="email" className="checkout-input" placeholder="your@email.com" />
            </div>
          </div>
          <div>
            <label htmlFor="subject" className="text-[12px] uppercase tracking-[1px] text-[#192026]/50 font-medium mb-1.5 block">Subject</label>
            <select id="subject" name="subject" className="checkout-input">
              <option>Order Inquiry</option>
              <option>Strain Selection Help</option>
              <option>Shipping Question</option>
              <option>Growing Advice</option>
              <option>Returns / Germination Guarantee</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="message" className="text-[12px] uppercase tracking-[1px] text-[#192026]/50 font-medium mb-1.5 block">Message</label>
            <textarea id="message" name="message" className="checkout-input" rows={5} placeholder="How can we help?" />
          </div>
          <button type="submit" className="btn-main w-full">Send Message</button>
        </form>

        <div className="mt-10 pt-8 border-t border-[#275C53]/10">
          <h3 className="text-sm font-semibold text-[#275C53] mb-3">Quick Links</h3>
          <div className="flex flex-wrap gap-2">
            <Link href="/faq" className="px-3 py-1.5 bg-[#F5F0EA] rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">FAQ</Link>
            <Link href="/shipping" className="px-3 py-1.5 bg-[#F5F0EA] rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">Shipping</Link>
            <Link href="/product-category/shop-all-cannabis-seeds" className="px-3 py-1.5 bg-[#F5F0EA] rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">Shop Seeds</Link>
            <Link href="/blog" className="px-3 py-1.5 bg-[#F5F0EA] rounded-full text-[12px] text-[#275C53] hover:bg-[#275C53] hover:text-white transition-colors">Blog</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
