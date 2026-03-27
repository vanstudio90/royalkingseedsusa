'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'Order Inquiry', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to send message.');
        setStatus('error');
      } else {
        setStatus('sent');
        setForm({ name: '', email: '', subject: 'Order Inquiry', message: '' });
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
      setStatus('error');
    }
  };

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

        {status === 'sent' ? (
          <div className="bg-white rounded-2xl p-8 border border-[#275C53]/5 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h2 className="text-lg text-[#275C53] font-semibold mb-2" style={{ fontFamily: 'var(--font-patua)' }}>Message Sent!</h2>
            <p className="text-[13px] text-[#192026]/60 mb-4">Thank you for reaching out. Our team will respond within 24 hours.</p>
            <button onClick={() => setStatus('idle')} className="text-[12px] text-[#275C53] font-semibold hover:underline cursor-pointer">Send another message</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-2xl p-8 border border-[#275C53]/5">
            <h2 className="text-lg text-[#275C53] font-semibold mb-4">Send Us a Message</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="text-[12px] uppercase tracking-[1px] text-[#192026]/50 font-medium mb-1.5 block">Name *</label>
                <input type="text" id="name" name="name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="checkout-input" placeholder="Your name" required />
              </div>
              <div>
                <label htmlFor="email" className="text-[12px] uppercase tracking-[1px] text-[#192026]/50 font-medium mb-1.5 block">Email *</label>
                <input type="email" id="email" name="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="checkout-input" placeholder="your@email.com" required />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="text-[12px] uppercase tracking-[1px] text-[#192026]/50 font-medium mb-1.5 block">Subject</label>
              <select id="subject" name="subject" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="checkout-input">
                <option>Order Inquiry</option>
                <option>Strain Selection Help</option>
                <option>Shipping Question</option>
                <option>Growing Advice</option>
                <option>Returns / Germination Guarantee</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="text-[12px] uppercase tracking-[1px] text-[#192026]/50 font-medium mb-1.5 block">Message *</label>
              <textarea id="message" name="message" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} className="checkout-input" rows={5} placeholder="How can we help?" required />
            </div>
            {errorMsg && (
              <p className="text-red-500 text-[12px] bg-red-50 rounded-lg p-2">{errorMsg}</p>
            )}
            <button type="submit" disabled={status === 'sending'} className="btn-main w-full disabled:opacity-50">
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}

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
