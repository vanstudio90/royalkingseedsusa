'use client';

import Link from 'next/link';
import { useCartStore, getCartKey } from '@/stores/cart-store';

export default function CheckoutPage() {
  const { items, totalPrice } = useCartStore();
  const shipping = totalPrice() >= 99 ? 0 : 9.99;
  const total = totalPrice() + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="text-2xl text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Your Cart is Empty</h1>
        <p className="text-[#192026]/60 mb-8">Add some seeds to your cart to proceed with checkout.</p>
        <Link href="/product-category/shop-all-cannabis-seeds" className="btn-main">Shop Cannabis Seeds</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl text-[#275C53] mb-8" style={{ fontFamily: 'var(--font-patua)' }}>Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
        {/* Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#275C53]/5">
            <h2 className="text-lg text-[#275C53] font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <input type="email" className="checkout-input" placeholder="Email address" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#275C53]/5">
            <h2 className="text-lg text-[#275C53] font-semibold mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" className="checkout-input" placeholder="First name" />
                <input type="text" className="checkout-input" placeholder="Last name" />
              </div>
              <input type="text" className="checkout-input" placeholder="Address" />
              <input type="text" className="checkout-input" placeholder="Apartment, suite, etc. (optional)" />
              <div className="grid grid-cols-3 gap-4">
                <input type="text" className="checkout-input" placeholder="City" />
                <select className="checkout-input"><option>State</option></select>
                <input type="text" className="checkout-input" placeholder="ZIP code" />
              </div>
              <input type="tel" className="checkout-input" placeholder="Phone (optional)" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#275C53]/5">
            <h2 className="text-lg text-[#275C53] font-semibold mb-4">Payment</h2>
            <div className="space-y-4">
              <input type="text" className="checkout-input" placeholder="Card number" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" className="checkout-input" placeholder="MM / YY" />
                <input type="text" className="checkout-input" placeholder="CVC" />
              </div>
              <input type="text" className="checkout-input" placeholder="Name on card" />
            </div>
          </div>

          <button className="btn-main w-full py-4">Place Order — ${total.toFixed(2)} USD</button>
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-[100px] self-start">
          <div className="bg-white rounded-2xl p-6 border border-[#275C53]/5">
            <h2 className="text-lg text-[#275C53] font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => {
                const key = getCartKey(item);
                const unitPrice = item.selectedVariant?.price ?? item.product.price;
                return (
                  <div key={key} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#F5F0EA] flex items-center justify-center text-lg shrink-0 overflow-hidden">
                      {item.product.imageUrl ? (
                        <img src={item.product.imageUrl} alt="" className="w-full h-full object-contain p-1" />
                      ) : <span className="opacity-40">🌱</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#192026] truncate">{item.product.name}</p>
                      <p className="text-[11px] text-[#192026]/50">Qty: {item.quantity}{item.selectedVariant ? ` · ${item.selectedVariant.label}` : ''}</p>
                    </div>
                    <span className="text-sm font-medium text-[#275C53]">${(unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-[#F5F0EA] pt-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-[#192026]/60">Subtotal</span><span>${totalPrice().toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[#192026]/60">Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
              <div className="flex justify-between text-base font-semibold text-[#275C53] pt-2 border-t border-[#F5F0EA]"><span>Total</span><span>${total.toFixed(2)} USD</span></div>
            </div>
            {shipping > 0 && (
              <p className="text-[11px] text-[#192026]/50 mt-3">Free shipping on orders over $99 USD</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
