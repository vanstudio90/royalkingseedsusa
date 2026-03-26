'use client';

import Link from 'next/link';
import { useState } from 'react';

const linkClass = 'text-[13px] text-[#192026]/70 hover:text-[#275C53] transition-colors';
const headingClass = 'font-semibold text-[#275C53] mb-5 text-[13px] uppercase tracking-[1.5px]';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer>
      {/* NEWSLETTER */}
      <div className="bg-[#275C53]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left max-w-md">
              <h3 className="text-white font-semibold text-lg">Get Grow Tips, New Strains &amp; Subscriber-Only Deals</h3>
              <p className="text-white/70 text-sm mt-1.5">Join American growers getting strain drops, grow guides, and special offers. Unsubscribe anytime.</p>
            </div>
            {subscribed ? (
              <p className="text-[#D7B65D] text-sm font-medium">You&apos;re in! Check your inbox.</p>
            ) : (
              <div className="w-full sm:w-auto">
                <form
                  onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }}
                  className="flex w-full sm:w-auto"
                >
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 sm:w-72 px-4 py-3 rounded-l-full bg-white/10 border border-white/20 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-[#D7B65D]/50"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#D7B65D] text-[#1a3d36] text-sm font-semibold rounded-r-full hover:bg-[#c9a84e] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
                <p className="text-white/70 text-[11px] mt-2 sm:text-right">We respect your privacy. No spam, ever.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NEED HELP? */}
      <div className="bg-[#F5F0EA] border-b border-[#275C53]/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl px-8 py-6 border border-[#275C53]/5">
            <div>
              <h4 className="text-[#275C53] font-semibold text-base">Not sure which strain is right for you?</h4>
              <p className="text-[#192026]/70 text-sm mt-1">Our team can help you pick the perfect seeds for your climate, experience level, and goals.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link href="/strain-finder" className="px-5 py-2.5 bg-[#D7B65D] text-[#1a3d36] text-sm font-semibold rounded-full hover:bg-[#c9a84e] transition-colors">Take the Strain Quiz</Link>
              <Link href="/contact" className="px-5 py-2.5 border border-[#275C53]/20 text-[#275C53] text-sm font-medium rounded-full hover:bg-[#275C53]/5 transition-colors">Contact Support</Link>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER */}
      <div className="bg-[#F5F0EA]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-10">
            {/* Brand + Contact */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#275C53] flex items-center justify-center">
                  <span className="text-[#E8CC7A] font-bold text-sm">RK</span>
                </div>
                <span className="font-semibold text-lg text-[#275C53]">Royal King Seeds</span>
              </div>
              <p className="text-sm text-[#192026]/70 leading-relaxed max-w-xs">
                Trusted by growers across the United States for premium seed genetics, discreet delivery, and responsive support before and after purchase.
              </p>
              <div className="mt-5 space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#192026]/75">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#275C53]/50 shrink-0"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <a href="mailto:support@royalkingseeds.us" className="hover:text-[#275C53] transition-colors">support@royalkingseeds.us</a>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#192026]/75">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#275C53]/50 shrink-0"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                  <span>Mon-Fri, 9 AM - 5 PM EST</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#192026]/75">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#275C53]/50 shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>Ships across all 50 states</span>
                </div>
              </div>
              <div className="mt-5">
                <p className="text-[11px] uppercase tracking-[1px] text-[#192026]/70 font-medium mb-2.5">Follow Us</p>
                <div className="flex items-center gap-2.5">
                  <a href="https://www.instagram.com/royalkingseeds/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#275C53]/8 flex items-center justify-center text-[#275C53]/50 hover:bg-[#275C53] hover:text-white transition-all" aria-label="Instagram">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                  <a href="https://x.com/RoyalKingSeeds_" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#275C53]/8 flex items-center justify-center text-[#275C53]/50 hover:bg-[#275C53] hover:text-white transition-all" aria-label="X / Twitter">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Shop Seeds */}
            <div>
              <h3 className={headingClass}>Shop Seeds</h3>
              <ul className="space-y-2.5">
                <li><Link href="/product-category/shop-all-cannabis-seeds" className={linkClass}>All Cannabis Seeds</Link></li>
                <li><Link href="/product-category/feminized-seeds" className={linkClass}>Feminized Seeds</Link></li>
                <li><Link href="/product-category/autoflowering-seeds" className={linkClass}>Autoflower Seeds</Link></li>
                <li><Link href="/product-category/high-tch-seeds" className={linkClass}>High THC Seeds</Link></li>
                <li><Link href="/product-category/indica-seeds" className={linkClass}>Indica Strains</Link></li>
                <li><Link href="/product-category/sativa-seeds" className={linkClass}>Sativa Strains</Link></li>
                <li><Link href="/product-category/fast-flowering-seeds" className={linkClass}>Fast Flowering</Link></li>
                <li><Link href="/product-category/photoperiod" className={linkClass}>Photoperiod Seeds</Link></li>
                <li><Link href="/product-category/usa-premium-cannabis-seeds" className={linkClass}>USA Premium</Link></li>
              </ul>
            </div>

            {/* Help & Policies */}
            <div>
              <h3 className={headingClass}>Help &amp; Policies</h3>
              <ul className="space-y-2.5">
                <li><Link href="/strain-finder" className={linkClass}>Strain Finder Quiz</Link></li>
                <li><Link href="/contact" className={linkClass}>Contact Us</Link></li>
                <li><Link href="/faq" className={linkClass}>FAQ</Link></li>
                <li><Link href="/shipping" className={linkClass}>Shipping &amp; Returns</Link></li>
                <li><Link href="/privacy" className={linkClass}>Privacy Policy</Link></li>
                <li><Link href="/terms" className={linkClass}>Terms &amp; Conditions</Link></li>
                <li><Link href="/refund-returns" className={linkClass}>Refund &amp; Returns</Link></li>
                <li><Link href="/affiliate" className={linkClass}>Affiliate Program</Link></li>
              </ul>
            </div>

            {/* Grow Guides */}
            <div>
              <h3 className={headingClass}>Grow Guides</h3>
              <ul className="space-y-2.5">
                <li><Link href="/blog" className={linkClass}>All Grow Guides</Link></li>
                <li><Link href="/product-category/autoflowering-seeds" className={linkClass}>Autoflower Growing</Link></li>
                <li><Link href="/product-category/feminized-seeds" className={linkClass}>Feminized Growing</Link></li>
                <li><Link href="/product-category/indica-seeds" className={linkClass}>Indica Strains Guide</Link></li>
                <li><Link href="/product-category/sativa-seeds" className={linkClass}>Sativa Strains Guide</Link></li>
              </ul>
            </div>

            {/* Buy Seeds By State */}
            <div>
              <h3 className={headingClass}>Buy Seeds By State</h3>
              <ul className="space-y-2.5">
                <li><Link href="/seeds/usa" className={linkClass}>All 50 States</Link></li>
                <li><Link href="/seeds/usa/california" className={linkClass}>California</Link></li>
                <li><Link href="/seeds/usa/colorado" className={linkClass}>Colorado</Link></li>
                <li><Link href="/seeds/usa/florida" className={linkClass}>Florida</Link></li>
                <li><Link href="/seeds/usa/new-york" className={linkClass}>New York</Link></li>
                <li><Link href="/seeds/usa/texas" className={linkClass}>Texas</Link></li>
                <li><Link href="/seeds/usa/michigan" className={linkClass}>Michigan</Link></li>
                <li><Link href="/seeds/usa/oregon" className={linkClass}>Oregon</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* WHY GROWERS TRUST US */}
      <div className="bg-[#EDE8E1] border-t border-[#275C53]/5">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10">
          <h4 className="text-center text-xs uppercase tracking-[1.5px] text-[#275C53] font-semibold mb-8">Why American Growers Trust Us</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {[
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#275C53]"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
                title: 'Germination Guarantee',
                desc: 'Eligible orders covered by our seed replacement policy.',
                link: '/faq',
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#275C53]"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5a2 2 0 01-2 2h-1"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
                title: 'Discreet US Shipping',
                desc: 'Plain outer packaging. Fast delivery to all 50 states.',
                link: '/shipping',
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#275C53]"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
                title: 'Secure Checkout',
                desc: 'SSL encrypted payment processing. Visa, Mastercard, Crypto.',
                link: '/faq',
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#275C53]"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                title: 'Fast US Delivery',
                desc: 'Quick shipping across all states and territories.',
                link: '/shipping',
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#275C53]"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
                title: 'Real Support',
                desc: 'Responsive team by email. Help before and after purchase.',
                link: '/contact',
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.link}
                className="bg-white/60 rounded-xl p-5 text-center hover:bg-white hover:shadow-sm transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-[#275C53]/8 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#275C53]/15 transition-colors">
                  {item.icon}
                </div>
                <h5 className="text-sm font-semibold text-[#275C53] mb-1">{item.title}</h5>
                <p className="text-[12px] text-[#192026]/70 leading-relaxed">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="bg-[#275C53]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 flex-wrap justify-center">
              <span className="text-[11px] text-white/80 mr-1">Secure Checkout:</span>
              <span className="px-2.5 py-1 bg-white/20 rounded text-[11px] text-white font-medium">Visa</span>
              <span className="px-2.5 py-1 bg-white/20 rounded text-[11px] text-white font-medium">Mastercard</span>
              <span className="px-2.5 py-1 bg-white/20 rounded text-[11px] text-white font-medium">Crypto</span>
              <span className="px-2.5 py-1 bg-white/20 rounded text-[11px] text-white font-medium flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                SSL
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-white/70">
              <Link href="/privacy" className="hover:text-[#D7B65D] transition-colors">Privacy</Link>
              <span className="text-white/15">|</span>
              <Link href="/terms" className="hover:text-[#D7B65D] transition-colors">Terms</Link>
              <span className="text-white/15">|</span>
              <Link href="/legal" className="hover:text-[#D7B65D] transition-colors">Disclaimer</Link>
              <span className="text-white/15">|</span>
              <Link href="/contact" className="hover:text-[#D7B65D] transition-colors">Contact</Link>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 text-center">
            <p className="text-[11px] text-white/70 max-w-3xl mx-auto leading-relaxed">
              &copy; {new Date().getFullYear()} Royal King Seeds. All rights reserved. Cannabis seeds are sold as adult novelty souvenirs and for genetic preservation purposes where applicable by law. Customers must be of legal age in their jurisdiction.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
