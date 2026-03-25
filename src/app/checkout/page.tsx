'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore, getCartKey } from '@/stores/cart-store';
import { useRouter } from 'next/navigation';

const usStates = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }, { code: 'DC', name: 'District of Columbia' },
  { code: 'PR', name: 'Puerto Rico' }, { code: 'GU', name: 'Guam' }, { code: 'VI', name: 'US Virgin Islands' },
];

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'IE', name: 'Ireland' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'JP', name: 'Japan' },
  { code: 'MX', name: 'Mexico' },
  { code: 'BR', name: 'Brazil' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'TH', name: 'Thailand' },
  { code: 'IL', name: 'Israel' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'PT', name: 'Portugal' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgium' },
  { code: 'SE', name: 'Sweden' },
  { code: 'DK', name: 'Denmark' },
  { code: 'NO', name: 'Norway' },
  { code: 'FI', name: 'Finland' },
  { code: 'PL', name: 'Poland' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'AR', name: 'Argentina' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'JM', name: 'Jamaica' },
];

const caProvinces = [
  { code: 'AB', name: 'Alberta' }, { code: 'BC', name: 'British Columbia' }, { code: 'MB', name: 'Manitoba' },
  { code: 'NB', name: 'New Brunswick' }, { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'NS', name: 'Nova Scotia' }, { code: 'NT', name: 'Northwest Territories' },
  { code: 'NU', name: 'Nunavut' }, { code: 'ON', name: 'Ontario' }, { code: 'PE', name: 'Prince Edward Island' },
  { code: 'QC', name: 'Quebec' }, { code: 'SK', name: 'Saskatchewan' }, { code: 'YT', name: 'Yukon' },
];

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
  return digits;
}

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCartStore();
  const router = useRouter();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [country, setCountry] = useState('US');

  const [form, setForm] = useState({
    email: '', firstName: '', lastName: '', street: '', city: '',
    state: '', zip: '', phone: '', notes: '',
    billingSame: true, billingStreet: '', billingCity: '',
    billingState: '', billingZip: '',
  });

  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '' });

  const FREE_SHIPPING_THRESHOLD = 150;
  const FLAT_RATE = 9.99;
  const subtotal = totalPrice();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_RATE;
  const total = subtotal - discount + shipping;
  const surcharge = parseFloat((total * 0.03).toFixed(2));
  const grandTotal = parseFloat((total + surcharge).toFixed(2));

  const updateForm = (key: string, value: string | boolean) => setForm(prev => ({ ...prev, [key]: value }));

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'GROWNOW15') {
      setDiscount(subtotal * 0.15);
      setPromoApplied(true);
    }
  };

  useEffect(() => {
    if ((form.firstName || form.lastName) && !card.name) {
      setCard(prev => ({ ...prev, name: `${form.firstName} ${form.lastName}`.trim() }));
    }
  }, [form.firstName, form.lastName]);

  const getRegions = () => {
    if (country === 'US') return usStates;
    if (country === 'CA') return caProvinces;
    return [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) { alert('Please agree to the terms and conditions.'); return; }
    setPaymentError('');
    setProcessing(true);

    const orderNumber = `RKSUS-${Date.now().toString(36).toUpperCase()}`;

    if (paymentMethod === 'credit-card') {
      const cardDigits = card.number.replace(/\s/g, '');
      const expiryDigits = card.expiry.replace(/\D/g, '');
      if (cardDigits.length < 13) { setPaymentError('Please enter a valid card number.'); setProcessing(false); return; }
      if (expiryDigits.length < 4) { setPaymentError('Please enter a valid expiry date (MM/YY).'); setProcessing(false); return; }
      if (card.cvv.length < 3) { setPaymentError('Please enter a valid CVV.'); setProcessing(false); return; }
      if (!card.name.trim()) { setPaymentError('Please enter the name on your card.'); setProcessing(false); return; }

      const expiryMonth = parseInt(expiryDigits.slice(0, 2), 10);
      const expiryYear = parseInt(`20${expiryDigits.slice(2, 4)}`, 10);

      const billingAddress = form.billingSame
        ? { street: form.street, city: form.city, state: form.state, zip: form.zip }
        : { street: form.billingStreet, city: form.billingCity, state: form.billingState, zip: form.billingZip };

      try {
        const res = await fetch('/api/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            card: { number: cardDigits, expiry_month: expiryMonth, expiry_year: expiryYear, cvv: card.cvv, name: card.name },
            order: {
              order_number: orderNumber, customer_email: form.email,
              customer_name: `${form.firstName} ${form.lastName}`, first_name: form.firstName,
              last_name: form.lastName, phone: form.phone,
              shipping_address: { street: form.street, city: form.city, state: form.state, zip: form.zip, country },
              billing_address: { ...billingAddress, country },
              items: items.map(i => ({ name: i.product.name, slug: i.product.slug, qty: i.quantity, price: i.selectedVariant?.price ?? i.product.price, variant: i.selectedVariant?.label })),
              subtotal, shipping_cost: shipping, tax: 0, total: grandTotal, discount,
              coupon_code: promoApplied ? promoCode.toUpperCase() : '', state: form.state, notes: form.notes,
            },
          }),
        });

        const result = await res.json();
        if (!res.ok) { setPaymentError(result.message || 'Payment was declined. Please check your card details.'); setProcessing(false); return; }

        clearCart();
        router.push(`/checkout/thank-you?order=${orderNumber}`);
      } catch {
        setPaymentError('There was an error processing your payment. Please try again.');
        setProcessing(false);
      }
    } else {
      clearCart();
      router.push(`/checkout/thank-you?order=${orderNumber}`);
    }
  };

  useEffect(() => {
    if (totalItems() === 0 && !processing) {
      const timer = setTimeout(() => { if (totalItems() === 0) router.push('/'); }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (totalItems() === 0 && !processing) {
    return (
      <div className="max-w-[600px] mx-auto px-4 py-20 text-center">
        <span className="text-5xl block mb-4">🛒</span>
        <h1 className="text-2xl font-bold text-[#275C53] mb-2" style={{ fontFamily: 'var(--font-patua)' }}>Your Cart is Empty</h1>
        <p className="text-[#192026]/40 text-sm mb-6">Add some seeds to your cart before checking out.</p>
        <Link href="/product-category/shop-all-cannabis-seeds" className="btn-main">Browse Seeds</Link>
      </div>
    );
  }

  const regions = getRegions();

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {subtotal < FREE_SHIPPING_THRESHOLD && (
        <div className="bg-[#275C53]/10 text-[#275C53] text-[13px] rounded-xl p-3 mb-6 text-center">
          🇺🇸 Add <strong>${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)}</strong> more to unlock <strong>free shipping</strong> across the USA!
        </div>
      )}
      {subtotal >= FREE_SHIPPING_THRESHOLD && (
        <div className="bg-[#275C53] text-white text-[13px] rounded-xl p-3 mb-6 text-center">
          ✓ You qualify for <strong>free shipping</strong> across the United States!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex gap-8 items-start flex-col lg:flex-row">
          <div className="flex-1 min-w-0 space-y-8">

            {/* Information */}
            <section>
              <h2 className="text-lg font-bold text-[#192026] mb-4 uppercase tracking-[1px]" style={{ fontFamily: 'var(--font-patua)' }}>Information</h2>
              <input type="email" value={form.email} onChange={e => updateForm('email', e.target.value)} placeholder="Email address" className="checkout-input" required />
            </section>

            {/* Shipping Address */}
            <section>
              <h2 className="text-lg font-bold text-[#192026] mb-4 uppercase tracking-[1px]" style={{ fontFamily: 'var(--font-patua)' }}>Shipping Address</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" value={form.firstName} onChange={e => updateForm('firstName', e.target.value)} placeholder="First name" className="checkout-input" required />
                  <input type="text" value={form.lastName} onChange={e => updateForm('lastName', e.target.value)} placeholder="Last name" className="checkout-input" required />
                </div>
                <input type="text" value={form.street} onChange={e => updateForm('street', e.target.value)} placeholder="Street address" className="checkout-input" required />
                <div className="grid grid-cols-3 gap-3">
                  <div className="checkout-input !p-0 overflow-hidden">
                    <select value={country} onChange={e => setCountry(e.target.value)} className="w-full h-full px-4 py-3 bg-transparent text-sm text-[#192026]/70">
                      {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                  </div>
                  <input type="text" value={form.zip} onChange={e => updateForm('zip', e.target.value)} placeholder={country === 'US' ? 'ZIP code' : 'Postal code'} className="checkout-input" required />
                  {regions.length > 0 ? (
                    <div className="checkout-input !p-0 overflow-hidden">
                      <select value={form.state} onChange={e => updateForm('state', e.target.value)} className="w-full h-full px-4 py-3 bg-transparent text-sm text-[#192026]/70" required>
                        <option value="">{country === 'US' ? 'State' : 'Province'}</option>
                        {regions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                      </select>
                    </div>
                  ) : (
                    <input type="text" value={form.state} onChange={e => updateForm('state', e.target.value)} placeholder="State / Province / Region" className="checkout-input" />
                  )}
                </div>
                <input type="text" value={form.city} onChange={e => updateForm('city', e.target.value)} placeholder="Town / City" className="checkout-input" required />
                <input type="tel" value={form.phone} onChange={e => updateForm('phone', e.target.value)} placeholder="Phone" className="checkout-input" required />
              </div>
            </section>

            {/* Payment */}
            <section>
              <h2 className="text-lg font-bold text-[#192026] mb-2 uppercase tracking-[1px]" style={{ fontFamily: 'var(--font-patua)' }}>Payment</h2>
              <p className="text-[12px] text-[#192026]/40 mb-4">All transactions are secure and encrypted.</p>

              {paymentError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-xl p-4 mb-4">
                  <strong>Payment Error:</strong> {paymentError}
                </div>
              )}

              <div className="space-y-2">
                <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'credit-card' ? 'border-[#275C53] bg-white' : 'border-[#192026]/10 bg-[#F5F0EA]'}`}>
                  <input type="radio" name="payment" value="credit-card" checked={paymentMethod === 'credit-card'} onChange={() => setPaymentMethod('credit-card')} className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-semibold text-[#192026]">Credit/Debit Card Payment (USD)</span>
                      <div className="flex gap-1">
                        <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[9px] font-bold rounded">VISA</span>
                        <span className="px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded">MC</span>
                        <span className="px-1.5 py-0.5 bg-[#006FCF] text-white text-[9px] font-bold rounded">AMEX</span>
                        <span className="px-1.5 py-0.5 bg-[#FF6600] text-white text-[9px] font-bold rounded">DISC</span>
                        <span className="px-1.5 py-0.5 bg-[#1A1F71] text-white text-[9px] font-bold rounded">JCB</span>
                      </div>
                    </div>
                    {paymentMethod === 'credit-card' && (
                      <div className="mt-3 space-y-3">
                        <p className="text-[12px] text-[#192026]/40">
                          There is a fee of 3% when you use your card to make your payment. Please make sure that your billing details match the information on your card&apos;s statement to avoid a decline.
                        </p>
                        <input type="text" value={card.name} onChange={e => setCard(prev => ({ ...prev, name: e.target.value }))} placeholder="Name on Card" className="checkout-input !bg-[#F5F0EA]" autoComplete="cc-name" />
                        <input type="text" inputMode="numeric" value={card.number} onChange={e => setCard(prev => ({ ...prev, number: formatCardNumber(e.target.value) }))} placeholder="Card Number" className="checkout-input !bg-[#F5F0EA]" autoComplete="cc-number" maxLength={19} />
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" inputMode="numeric" value={card.expiry} onChange={e => setCard(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))} placeholder="MM / YY" className="checkout-input !bg-[#F5F0EA]" autoComplete="cc-exp" maxLength={7} />
                          <input type="text" inputMode="numeric" value={card.cvv} onChange={e => setCard(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))} placeholder="CVC" className="checkout-input !bg-[#F5F0EA]" autoComplete="cc-csc" maxLength={4} />
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[#192026]/30">
                          <svg className="w-3.5 h-3.5 text-[#275C53]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                          <span>Your card is charged securely via our payment processor. We never store your card details.</span>
                        </div>
                      </div>
                    )}
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'crypto' ? 'border-[#275C53] bg-white' : 'border-[#192026]/10 bg-[#F5F0EA]'}`}>
                  <input type="radio" name="payment" value="crypto" checked={paymentMethod === 'crypto'} onChange={() => setPaymentMethod('crypto')} />
                  <span className="text-[14px] font-semibold text-[#192026]">Crypto (BTC, ETH)</span>
                </label>
              </div>
            </section>

            {/* Billing Address */}
            <section>
              <h2 className="text-lg font-bold text-[#192026] mb-4 uppercase tracking-[1px]" style={{ fontFamily: 'var(--font-patua)' }}>Billing Address</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-[#192026]/10 bg-[#F5F0EA] cursor-pointer">
                  <input type="radio" name="billing" checked={form.billingSame === true} onChange={() => updateForm('billingSame', true)} />
                  <span className="text-[14px] text-[#192026]">Same as shipping address</span>
                </label>
                <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-[#192026]/10 bg-[#F5F0EA] cursor-pointer">
                  <input type="radio" name="billing" checked={form.billingSame === false} onChange={() => updateForm('billingSame', false)} />
                  <span className="text-[14px] text-[#192026]">Use a different billing address</span>
                </label>
              </div>
              {!form.billingSame && (
                <div className="space-y-3 mt-4">
                  <input type="text" value={form.billingStreet} onChange={e => updateForm('billingStreet', e.target.value)} placeholder="Billing street address" className="checkout-input" required />
                  <div className="grid grid-cols-3 gap-3">
                    <input type="text" value={form.billingCity} onChange={e => updateForm('billingCity', e.target.value)} placeholder="City" className="checkout-input" required />
                    {regions.length > 0 ? (
                      <div className="checkout-input !p-0 overflow-hidden">
                        <select value={form.billingState} onChange={e => updateForm('billingState', e.target.value)} className="w-full h-full px-4 py-3 bg-transparent text-sm text-[#192026]/70" required>
                          <option value="">{country === 'US' ? 'State' : 'Province'}</option>
                          {regions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                        </select>
                      </div>
                    ) : (
                      <input type="text" value={form.billingState} onChange={e => updateForm('billingState', e.target.value)} placeholder="State / Province" className="checkout-input" />
                    )}
                    <input type="text" value={form.billingZip} onChange={e => updateForm('billingZip', e.target.value)} placeholder={country === 'US' ? 'ZIP' : 'Postal code'} className="checkout-input" required />
                  </div>
                </div>
              )}
            </section>

            {/* Order Notes */}
            <section>
              <textarea value={form.notes} onChange={e => updateForm('notes', e.target.value)} placeholder="Notes about your order, e.g. special notes for delivery. (optional)" className="checkout-input min-h-[80px]" />
            </section>

            {/* Disclaimers */}
            <div className="space-y-3 text-[12px] text-[#192026]/40">
              <p>Your order will be shipped securely using <strong className="text-[#275C53]">discreet packaging</strong> for extra privacy.</p>
              <p>Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <Link href="/privacy" className="text-[#275C53] underline">privacy policy</Link>.</p>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} className="mt-0.5" required />
                <span>I have read and agree with the <Link href="/terms" className="text-[#275C53] underline">terms and conditions</Link> *</span>
              </label>
            </div>

            {/* Submit */}
            <button type="submit" disabled={processing || !agreeTerms}
              className="w-full py-4 bg-[#275C53] text-white rounded-2xl text-[14px] font-bold uppercase tracking-[1px] hover:bg-[#1e4a42] transition-colors disabled:opacity-50 cursor-pointer">
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing Payment...
                </span>
              ) : paymentMethod === 'credit-card' ? (
                `Pay $${grandTotal.toFixed(2)} USD`
              ) : (
                'Complete Order'
              )}
            </button>
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-[360px] shrink-0 lg:sticky lg:top-[100px]">
            <div className="bg-white rounded-2xl border border-[#275C53]/10 p-5">
              <h3 className="text-sm font-bold text-[#192026] uppercase tracking-[1px] mb-4">Order Summary</h3>

              <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
                {items.map(item => (
                  <div key={getCartKey(item)} className="flex gap-3 items-start">
                    <div className="w-14 h-14 rounded-lg bg-white overflow-hidden shrink-0 flex items-center justify-center relative">
                      {item.product.imageUrl ? (
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        <span className="text-xl opacity-30">🌱</span>
                      )}
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#275C53] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#192026] truncate">{item.product.name}</p>
                      {item.selectedVariant && <p className="text-[11px] text-[#275C53]">{item.selectedVariant.label}</p>}
                      <div className="flex items-center gap-2 mt-1">
                        <button type="button" onClick={() => updateQuantity(getCartKey(item), Math.max(0, item.quantity - 1))} className="text-[#192026]/30 hover:text-[#275C53] text-sm cursor-pointer">−</button>
                        <span className="text-[12px] text-[#192026]/50">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(getCartKey(item), item.quantity + 1)} className="text-[#192026]/30 hover:text-[#275C53] text-sm cursor-pointer">+</button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-semibold text-[#192026]">${((item.selectedVariant?.price ?? item.product.price) * item.quantity).toFixed(2)}</p>
                      <button type="button" onClick={() => removeItem(getCartKey(item))} className="text-[10px] text-red-400 hover:text-red-600 cursor-pointer">Remove</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="flex gap-2 mb-4">
                <input type="text" value={promoCode} onChange={e => setPromoCode(e.target.value)} placeholder="Enter Promo Code" className="checkout-input flex-1 !py-2.5" disabled={promoApplied} />
                <button type="button" onClick={applyPromo} disabled={promoApplied || !promoCode}
                  className="px-4 py-2.5 bg-[#275C53] text-white rounded-xl text-[12px] font-bold uppercase tracking-[0.5px] hover:bg-[#1e4a42] disabled:opacity-30 cursor-pointer shrink-0">
                  {promoApplied ? 'Applied' : 'Apply'}
                </button>
              </div>

              {/* Totals */}
              <div className="border-t border-[#192026]/5 pt-4 space-y-2 text-[13px]">
                <div className="flex justify-between"><span className="text-[#192026]/50">Subtotal</span><span className="text-[#192026]">${subtotal.toFixed(2)}</span></div>
                {discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount ({promoCode.toUpperCase()})</span><span>-${discount.toFixed(2)}</span></div>}
                <div className="flex justify-between"><span className="text-[#192026]/50">Shipping</span><span className={shipping === 0 ? 'text-emerald-600 font-semibold' : 'text-[#192026]'}>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
                {paymentMethod === 'credit-card' && <div className="flex justify-between"><span className="text-[#192026]/50">Card Processing Fee (3%)</span><span className="text-[#192026]">${surcharge.toFixed(2)}</span></div>}
                <div className="flex justify-between pt-3 border-t border-[#192026]/5 text-lg font-bold">
                  <span className="text-[#192026]">Total</span>
                  <span className="text-[#275C53]">
                    ${paymentMethod === 'credit-card' ? grandTotal.toFixed(2) : total.toFixed(2)}{' '}
                    <span className="text-[11px] font-normal text-[#192026]/30">USD</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="bg-white rounded-xl p-3 text-center border border-[#275C53]/5">
                <span className="text-lg block mb-1">🔒</span>
                <span className="text-[9px] uppercase tracking-[1px] text-[#275C53] font-bold">Secure</span>
              </div>
              <div className="bg-white rounded-xl p-3 text-center border border-[#275C53]/5">
                <span className="text-lg block mb-1">📦</span>
                <span className="text-[9px] uppercase tracking-[1px] text-[#275C53] font-bold">Discreet</span>
              </div>
              <div className="bg-white rounded-xl p-3 text-center border border-[#275C53]/5">
                <span className="text-lg block mb-1">🌱</span>
                <span className="text-[9px] uppercase tracking-[1px] text-[#275C53] font-bold">Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
