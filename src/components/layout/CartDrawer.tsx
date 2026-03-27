'use client';

import { useCartStore, getCartKey } from '@/stores/cart-store';

export function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={toggleCart} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F5F0EA]">
          <h2 className="text-lg font-semibold text-[#275C53]">Your Cart</h2>
          <button
            onClick={toggleCart}
            className="w-8 h-8 rounded-full bg-[#F5F0EA] flex items-center justify-center text-[#192026]/60 hover:text-[#275C53] transition-colors cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#192026]/60">Your cart is empty</p>
              <p className="text-sm text-[#192026]/70 mt-2">Browse our collection to find your perfect seeds</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const key = getCartKey(item);
                const unitPrice = item.selectedVariant?.price ?? item.product.price;
                return (
                  <div key={key} className="flex gap-4 bg-[#F5F0EA] rounded-2xl p-4">
                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                      {item.product.imageUrl ? (
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        <span className="opacity-40">🌱</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-[#192026] truncate">{item.product.name}</h3>
                      <p className="text-xs text-[#192026]/70 mt-0.5">
                        {item.selectedVariant && (
                          <span className="text-[#275C53] font-medium">{item.selectedVariant.label} &middot; </span>
                        )}
                        ${unitPrice.toFixed(2)} each
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(key, item.quantity - 1)} className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#192026]/60 hover:text-[#275C53] text-sm cursor-pointer border border-[#275C53]/10">-</button>
                        <span className="text-sm text-[#192026] w-6 text-center font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(key, item.quantity + 1)} className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#192026]/60 hover:text-[#275C53] text-sm cursor-pointer border border-[#275C53]/10">+</button>
                        <button onClick={() => removeItem(key)} className="ml-auto text-xs text-red-500 hover:text-red-600 cursor-pointer">Remove</button>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-[#275C53]">
                      ${(unitPrice * item.quantity).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[#F5F0EA] px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[#192026]/60 text-sm">Subtotal</span>
              <span className="text-xl font-semibold text-[#275C53]">${totalPrice().toFixed(2)} USD</span>
            </div>
            <p className="text-xs text-[#192026]/70">Free shipping on orders over $150 USD across the United States.</p>
            <a href="/checkout" onClick={toggleCart} className="btn-main w-full py-3.5 text-center block">
              Proceed to Checkout
            </a>
            <button onClick={clearCart} className="w-full py-2 text-sm text-[#192026]/70 hover:text-[#275C53] transition-colors cursor-pointer">
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
