'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import type { Product } from '@/lib/products/types';

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  items: { name: string; slug: string; qty: number; price: number }[];
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  status: string;
  payment_status: string;
  payment_method: string;
  tracking_number: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-600',
  processing: 'bg-blue-50 text-blue-600',
  shipped: 'bg-purple-50 text-purple-600',
  completed: 'bg-emerald-50 text-emerald-600',
  cancelled: 'bg-red-50 text-red-500',
  refunded: 'bg-gray-50 text-gray-500',
};

type Tab = 'dashboard' | 'orders' | 'profile' | 'password' | 'reviews' | 'benefits' | 'growroom' | 'saved';

interface Review {
  id: number;
  product_slug: string;
  product_name: string;
  rating: number;
  title: string;
  content: string;
  status: string;
  created_at: string;
}

function getTrackingUrl(tracking: string): string | null {
  if (!tracking) return null;
  const cleaned = tracking.replace(/\s/g, '');
  // USPS
  if (/^\d{20,22}$/.test(cleaned) || /^9[0-9]{15,21}$/.test(cleaned)) {
    return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${cleaned}`;
  }
  // UPS
  if (/^1Z/i.test(cleaned)) {
    return `https://www.ups.com/track?tracknum=${cleaned}`;
  }
  // FedEx
  if (/^\d{12,15}$/.test(cleaned)) {
    return `https://www.fedex.com/fedextrack/?trknbr=${cleaned}`;
  }
  // Generic — try USPS
  return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${cleaned}`;
}

export default function AccountPage() {
  const { user, isLoggedIn, login, logout, updateProfile } = useAuthStore();
  const wishlistItems = useWishlistStore((s) => s.items);
  const removeFromWishlist = useWishlistStore((s) => s.removeItem);

  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({
    email: '', name: '', phone: '', password: '',
  });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ current: '', newPw: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [editingReview, setEditingReview] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ rating: 5, title: '', content: '' });
  const [reviewSaving, setReviewSaving] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: '', phone: '', street: '', city: '', state: '', zip: '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user?.email) {
      setLoadingOrders(true);
      fetch(`/api/account/orders?email=${encodeURIComponent(user.email)}`)
        .then(r => r.json())
        .then(data => { setOrders(Array.isArray(data) ? data : []); setLoadingOrders(false); })
        .catch(() => setLoadingOrders(false));

      // Load reviews
      setLoadingReviews(true);
      fetch(`/api/account/reviews?email=${encodeURIComponent(user.email)}`)
        .then(r => r.json())
        .then(data => { setReviews(Array.isArray(data.reviews) ? data.reviews : []); setLoadingReviews(false); })
        .catch(() => setLoadingReviews(false));

      // Load profile from database
      fetch(`/api/account/profile?email=${encodeURIComponent(user.email)}`)
        .then(r => r.json())
        .then(data => {
          const addr = data.shipping_address || {};
          const dbProfile = {
            name: data.name || user.name || '',
            phone: data.phone || user.phone || '',
            street: addr.street || user.street || '',
            city: addr.city || user.city || '',
            state: addr.state || user.state || '',
            zip: addr.zip || user.zip || '',
          };
          setProfileForm(dbProfile);
          updateProfile(dbProfile);
        })
        .catch(() => {});

      // Load wishlist from database and merge with local
      fetch(`/api/account/wishlist?email=${encodeURIComponent(user.email)}`)
        .then(r => r.json())
        .then(data => {
          if (data.items && data.items.length > 0) {
            const localSlugs = new Set(wishlistItems.map((i: Product) => i.slug));
            const dbSlugs = data.items.map((i: { product_slug: string }) => i.product_slug);
            // If DB has items not in local, we sync local → DB on next toggle
            // For now, just ensure DB items are noted
            if (wishlistItems.length === 0 && dbSlugs.length > 0) {
              // DB has items but local is empty — user cleared browser
              // We can't fully restore Product objects from DB (only slug/name stored)
              // But we note that the data exists
            }
          }
          // Sync local wishlist to DB
          if (wishlistItems.length > 0) {
            fetch('/api/account/wishlist', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: user.email,
                action: 'sync',
                items: wishlistItems.map((i: Product) => ({ slug: i.slug, name: i.name })),
              }),
            }).catch(() => {});
          }
        })
        .catch(() => {});
    }
  }, [isLoggedIn, user?.email]);

  useEffect(() => {
    if (user) {
      setProfileForm(prev => ({
        name: prev.name || user.name || '',
        phone: prev.phone || user.phone || '',
        street: prev.street || user.street || '',
        city: prev.city || user.city || '',
        state: prev.state || user.state || '',
        zip: prev.zip || user.zip || '',
      }));
    }
  }, [user]);

  const boughtStrains = orders.flatMap(o =>
    (o.items || []).map(item => ({ name: item.name, slug: item.slug, qty: item.qty, orderDate: o.created_at }))
  );
  const uniqueStrains = [...new Map(boughtStrains.map(s => [s.slug, s])).values()];

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const res = await fetch('/api/account/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: authMode,
          email: authForm.email,
          password: authForm.password,
          name: authForm.name,
          phone: authForm.phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.error || 'Authentication failed');
        setAuthLoading(false);
        return;
      }

      login({
        email: data.user.email,
        name: data.user.name || authForm.name || authForm.email.split('@')[0],
        phone: data.user.phone || authForm.phone || '',
        street: data.user.street || '',
        city: data.user.city || '',
        state: data.user.state || '',
        zip: data.user.zip || '',
      });
    } catch {
      setAuthError('Something went wrong. Please try again.');
    }
    setAuthLoading(false);
  };

  const handleProfileSave = async () => {
    setProfileSaving(true);
    setProfileSaved(false);
    updateProfile(profileForm);

    try {
      await fetch('/api/account/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          name: profileForm.name,
          phone: profileForm.phone,
          shipping_address: {
            street: profileForm.street,
            city: profileForm.city,
            state: profileForm.state,
            zip: profileForm.zip,
          },
        }),
      });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch {
      // Still saved locally
    }
    setProfileSaving(false);
  };

  // --- Not Logged In ---
  if (!isLoggedIn) {
    return (
      <div className="max-w-[440px] mx-auto px-4 py-12 sm:py-20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#275C53]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#275C53" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-[#275C53]" style={{ fontFamily: 'var(--font-patua)' }}>
            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-[13px] text-[#192026]/40 mt-1">
            {authMode === 'login' ? 'Sign in to view your orders and saved items.' : 'Join Royal King Seeds for order tracking and exclusive benefits.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="bg-white rounded-2xl p-6 border border-[#275C53]/5 space-y-4">
          {authMode === 'register' && (
            <div>
              <label htmlFor="auth_name" className="text-[12px] font-semibold text-[#192026]/50 uppercase tracking-[0.5px] block mb-1">Full Name</label>
              <input type="text" id="auth_name" name="name" value={authForm.name} onChange={e => setAuthForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" className="checkout-input" required />
            </div>
          )}
          <div>
            <label htmlFor="auth_email" className="text-[12px] font-semibold text-[#192026]/50 uppercase tracking-[0.5px] block mb-1">Email</label>
            <input type="email" id="auth_email" name="email" value={authForm.email} onChange={e => setAuthForm(p => ({ ...p, email: e.target.value }))} placeholder="you@email.com" className="checkout-input" required />
          </div>
          <div>
            <label htmlFor="auth_password" className="text-[12px] font-semibold text-[#192026]/50 uppercase tracking-[0.5px] block mb-1">Password</label>
            <input type="password" id="auth_password" name="password" value={authForm.password} onChange={e => setAuthForm(p => ({ ...p, password: e.target.value }))} placeholder="Password" className="checkout-input" required minLength={6} />
          </div>
          {authMode === 'register' && (
            <div>
              <label htmlFor="auth_phone" className="text-[12px] font-semibold text-[#192026]/50 uppercase tracking-[0.5px] block mb-1">Phone (optional)</label>
              <input type="tel" id="auth_phone" name="phone" value={authForm.phone} onChange={e => setAuthForm(p => ({ ...p, phone: e.target.value }))} placeholder="Phone number" className="checkout-input" />
            </div>
          )}
          {authError && (
            <p className="text-red-500 text-[12px] text-center bg-red-50 rounded-lg p-2">{authError}</p>
          )}
          <button type="submit" disabled={authLoading} className="w-full py-3.5 bg-[#275C53] text-white rounded-xl text-[13px] font-bold uppercase tracking-[1px] hover:bg-[#1e4a42] transition-colors cursor-pointer disabled:opacity-50">
            {authLoading ? 'Please wait...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
          <p className="text-center text-[12px] text-[#192026]/40">
            {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-[#275C53] font-semibold hover:underline cursor-pointer">
              {authMode === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </form>
      </div>
    );
  }

  // --- Logged In ---
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'orders', label: 'Purchase History', icon: '📦' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'password', label: 'Change Password', icon: '🔒' },
    { id: 'reviews', label: 'My Reviews', icon: '⭐' },
    { id: 'benefits', label: 'Member Benefits', icon: '🎁' },
    { id: 'growroom', label: 'Grow Room', icon: '🌱' },
    { id: 'saved', label: 'Saved Items', icon: '❤️' },
  ];

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#275C53]" style={{ fontFamily: 'var(--font-patua)' }}>My Account</h1>
          <p className="text-[13px] text-[#192026]/40">Welcome back, {user?.name || user?.email}</p>
        </div>
        <button onClick={logout} className="text-[12px] text-[#192026]/30 hover:text-red-400 transition-colors cursor-pointer uppercase tracking-[0.5px]">Sign Out</button>
      </div>

      <div className="flex gap-8 items-start flex-col lg:flex-row">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-[220px] shrink-0">
          <div className="bg-white rounded-2xl border border-[#275C53]/5 overflow-hidden">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left text-[13px] transition-colors cursor-pointer border-b border-[#192026]/5 last:border-0 ${
                  activeTab === tab.id ? 'bg-[#275C53] text-white font-semibold' : 'text-[#192026]/60 hover:bg-[#F5F0EA]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">

          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-[#275C53]/5 p-5 text-center">
                  <span className="text-2xl block mb-1">📦</span>
                  <span className="text-2xl font-bold text-[#275C53]">{orders.length}</span>
                  <span className="text-[11px] text-[#192026]/40 block">Total Orders</span>
                </div>
                <div className="bg-white rounded-2xl border border-[#275C53]/5 p-5 text-center">
                  <span className="text-2xl block mb-1">🌱</span>
                  <span className="text-2xl font-bold text-[#275C53]">{uniqueStrains.length}</span>
                  <span className="text-[11px] text-[#192026]/40 block">Strains Grown</span>
                </div>
                <div className="bg-white rounded-2xl border border-[#275C53]/5 p-5 text-center">
                  <span className="text-2xl block mb-1">❤️</span>
                  <span className="text-2xl font-bold text-[#275C53]">{wishlistItems.length}</span>
                  <span className="text-[11px] text-[#192026]/40 block">Saved Items</span>
                </div>
                <div className="bg-white rounded-2xl border border-[#275C53]/5 p-5 text-center">
                  <span className="text-2xl block mb-1">💰</span>
                  <span className="text-2xl font-bold text-[#275C53]">${orders.reduce((s, o) => s + (o.total || 0), 0).toFixed(0)}</span>
                  <span className="text-[11px] text-[#192026]/40 block">Total Spent</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#275C53]/5 p-5">
                <h3 className="text-sm font-bold text-[#275C53] uppercase tracking-[1px] mb-4">Recent Orders</h3>
                {orders.length === 0 ? (
                  <p className="text-[13px] text-[#192026]/40">No orders yet. <Link href="/product-category/shop-all-cannabis-seeds" className="text-[#275C53] hover:underline">Browse seeds</Link></p>
                ) : (
                  <div className="space-y-2">
                    {orders.slice(0, 3).map(order => (
                      <div key={order.id} className="flex items-center justify-between py-2 border-b border-[#192026]/5 last:border-0">
                        <div>
                          <span className="text-[13px] font-semibold text-[#192026]">{order.order_number}</span>
                          <span className="text-[11px] text-[#192026]/30 ml-2">{new Date(order.created_at).toLocaleDateString('en-US')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[order.status] || 'bg-gray-50 text-gray-500'}`}>{order.status}</span>
                          <span className="text-[13px] font-semibold text-[#275C53]">${order.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {orders.length > 3 && (
                  <button onClick={() => setActiveTab('orders')} className="text-[12px] text-[#275C53] font-semibold mt-3 hover:underline cursor-pointer">View all orders →</button>
                )}
              </div>
            </div>
          )}

          {/* Purchase History */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-bold text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Purchase History</h2>
              {loadingOrders ? (
                <div className="text-center py-12 text-[#192026]/30">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#275C53]/5 p-8 text-center">
                  <span className="text-4xl block mb-3">📦</span>
                  <p className="text-[#192026]/40 text-sm mb-4">No orders found for {user?.email}</p>
                  <Link href="/product-category/shop-all-cannabis-seeds" className="inline-block px-6 py-2.5 bg-[#275C53] text-white rounded-xl text-[12px] font-bold">Shop Seeds</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white rounded-2xl border border-[#275C53]/5 overflow-hidden">
                      <div className="px-5 py-3 bg-[#F5F0EA] flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 block">Order</span>
                            <span className="text-[14px] font-bold text-[#275C53]">{order.order_number}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 block">Date</span>
                            <span className="text-[13px] text-[#192026]/60">{new Date(order.created_at).toLocaleDateString('en-US')}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-[1px] text-[#192026]/30 block">Total</span>
                            <span className="text-[14px] font-bold text-[#275C53]">${order.total} USD</span>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-[0.5px] ${statusColors[order.status] || 'bg-gray-50 text-gray-500'}`}>{order.status}</span>
                      </div>

                      <div className="px-5 py-3">
                        {(order.items || []).map((item, i) => (
                          <div key={i} className="flex items-center justify-between py-1.5 border-b border-[#192026]/5 last:border-0">
                            <div className="flex items-center gap-2">
                              <Link href={`/${item.slug}`} className="text-[13px] text-[#275C53] hover:underline">{item.name}</Link>
                              <span className="text-[11px] text-[#192026]/30">× {item.qty}</span>
                            </div>
                            <span className="text-[13px] text-[#192026]/60">${(item.qty * item.price).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {order.tracking_number && (
                        <div className="px-5 py-3 border-t border-[#192026]/5 bg-[#275C53]/5">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-[#192026]/40 uppercase tracking-[0.5px]">Tracking:</span>
                            {getTrackingUrl(order.tracking_number) ? (
                              <a href={getTrackingUrl(order.tracking_number)!} target="_blank" rel="noopener noreferrer" className="text-[13px] text-[#275C53] font-semibold hover:underline flex items-center gap-1">
                                {order.tracking_number}
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                              </a>
                            ) : (
                              <span className="text-[13px] text-[#192026] font-mono">{order.tracking_number}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile */}
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-bold text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>My Profile</h2>
              <div className="bg-white rounded-2xl border border-[#275C53]/5 p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="profile_name" className="text-[11px] font-semibold text-[#192026]/40 uppercase tracking-[0.5px] block mb-1">Full Name</label>
                    <input type="text" id="profile_name" name="name" value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} className="checkout-input" />
                  </div>
                  <div>
                    <label htmlFor="profile_phone" className="text-[11px] font-semibold text-[#192026]/40 uppercase tracking-[0.5px] block mb-1">Phone</label>
                    <input type="tel" id="profile_phone" name="phone" value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} className="checkout-input" />
                  </div>
                </div>
                <div>
                  <label htmlFor="profile_email" className="text-[11px] font-semibold text-[#192026]/40 uppercase tracking-[0.5px] block mb-1">Email</label>
                  <input type="email" id="profile_email" name="email" value={user?.email || ''} disabled className="checkout-input !bg-[#F5F0EA] !text-[#192026]/40" />
                </div>
                <div>
                  <label htmlFor="profile_street" className="text-[11px] font-semibold text-[#192026]/40 uppercase tracking-[0.5px] block mb-1">Street Address</label>
                  <input type="text" id="profile_street" name="street" value={profileForm.street} onChange={e => setProfileForm(p => ({ ...p, street: e.target.value }))} className="checkout-input" placeholder="123 Main St" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="profile_city" className="text-[11px] font-semibold text-[#192026]/40 uppercase tracking-[0.5px] block mb-1">City</label>
                    <input type="text" id="profile_city" name="city" value={profileForm.city} onChange={e => setProfileForm(p => ({ ...p, city: e.target.value }))} className="checkout-input" />
                  </div>
                  <div>
                    <label htmlFor="profile_state" className="text-[11px] font-semibold text-[#192026]/40 uppercase tracking-[0.5px] block mb-1">State</label>
                    <input type="text" id="profile_state" name="state" value={profileForm.state} onChange={e => setProfileForm(p => ({ ...p, state: e.target.value }))} className="checkout-input" />
                  </div>
                  <div>
                    <label htmlFor="profile_zip" className="text-[11px] font-semibold text-[#192026]/40 uppercase tracking-[0.5px] block mb-1">ZIP Code</label>
                    <input type="text" id="profile_zip" name="zip" value={profileForm.zip} onChange={e => setProfileForm(p => ({ ...p, zip: e.target.value }))} className="checkout-input" />
                  </div>
                </div>
                <button onClick={handleProfileSave} disabled={profileSaving} className="px-6 py-2.5 bg-[#275C53] text-white rounded-xl text-[12px] font-bold uppercase tracking-[0.5px] hover:bg-[#1e4a42] transition-colors cursor-pointer disabled:opacity-50">
                  {profileSaving ? 'Saving...' : profileSaved ? 'Saved!' : 'Save Profile'}
                </button>
              </div>
            </div>
          )}

          {/* Change Password */}
          {activeTab === 'password' && (
            <div>
              <h2 className="text-xl font-bold text-[#275C53] mb-2" style={{ fontFamily: 'var(--font-patua)' }}>Change Password</h2>
              <p className="text-[13px] text-[#192026]/40 mb-4">Update your password</p>
              <div className="bg-white rounded-2xl border border-[#275C53]/5 p-6 space-y-4 max-w-md">
                <div>
                  <label htmlFor="pw_current" className="text-[11px] font-semibold text-[#192026]/40 uppercase tracking-[0.5px] block mb-1">Current Password *</label>
                  <input type="password" id="pw_current" value={passwordForm.current} onChange={e => setPasswordForm(p => ({ ...p, current: e.target.value }))} className="checkout-input" placeholder="Enter current password" required />
                </div>
                <div>
                  <label htmlFor="pw_new" className="text-[11px] font-semibold text-[#192026]/40 uppercase tracking-[0.5px] block mb-1">New Password *</label>
                  <input type="password" id="pw_new" value={passwordForm.newPw} onChange={e => setPasswordForm(p => ({ ...p, newPw: e.target.value }))} className="checkout-input" placeholder="Enter new password (min 6 characters)" required minLength={6} />
                </div>
                <div>
                  <label htmlFor="pw_confirm" className="text-[11px] font-semibold text-[#192026]/40 uppercase tracking-[0.5px] block mb-1">Confirm New Password *</label>
                  <input type="password" id="pw_confirm" value={passwordForm.confirm} onChange={e => setPasswordForm(p => ({ ...p, confirm: e.target.value }))} className="checkout-input" placeholder="Confirm new password" required />
                </div>
                {passwordError && (
                  <p className="text-red-500 text-[12px] bg-red-50 rounded-lg p-2">{passwordError}</p>
                )}
                {passwordSuccess && (
                  <p className="text-emerald-600 text-[12px] bg-emerald-50 rounded-lg p-2">{passwordSuccess}</p>
                )}
                <button
                  disabled={passwordLoading}
                  onClick={async () => {
                    setPasswordError('');
                    setPasswordSuccess('');

                    if (!passwordForm.current || !passwordForm.newPw || !passwordForm.confirm) {
                      setPasswordError('All fields are required');
                      return;
                    }
                    if (passwordForm.newPw.length < 6) {
                      setPasswordError('New password must be at least 6 characters');
                      return;
                    }
                    if (passwordForm.newPw !== passwordForm.confirm) {
                      setPasswordError('New passwords do not match');
                      return;
                    }

                    setPasswordLoading(true);
                    try {
                      const res = await fetch('/api/account/change-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          email: user?.email,
                          currentPassword: passwordForm.current,
                          newPassword: passwordForm.newPw,
                        }),
                      });
                      const data = await res.json();
                      if (!res.ok) {
                        setPasswordError(data.error || 'Failed to change password');
                      } else {
                        setPasswordSuccess('Password changed successfully!');
                        setPasswordForm({ current: '', newPw: '', confirm: '' });
                      }
                    } catch {
                      setPasswordError('Something went wrong. Please try again.');
                    }
                    setPasswordLoading(false);
                  }}
                  className="px-6 py-2.5 bg-[#275C53] text-white rounded-xl text-[12px] font-bold uppercase tracking-[0.5px] hover:bg-[#1e4a42] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {passwordLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          )}

          {/* My Reviews */}
          {activeTab === 'reviews' && (
            <div>
              <h2 className="text-xl font-bold text-[#275C53] mb-2" style={{ fontFamily: 'var(--font-patua)' }}>My Reviews</h2>
              <p className="text-[13px] text-[#192026]/40 mb-6">Reviews you&apos;ve posted on our products.</p>

              {loadingReviews ? (
                <div className="text-center py-12 text-[#192026]/30">Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#275C53]/5 p-8 text-center">
                  <span className="text-4xl block mb-3">⭐</span>
                  <p className="text-[#192026]/40 text-sm mb-4">You haven&apos;t posted any reviews yet.</p>
                  <Link href="/product-category/shop-all-cannabis-seeds" className="inline-block px-6 py-2.5 bg-[#275C53] text-white rounded-xl text-[12px] font-bold">Browse Seeds to Review</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="bg-white rounded-2xl border border-[#275C53]/5 overflow-hidden">
                      <div className="px-5 py-3 bg-[#F5F0EA] flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          <Link href={`/${review.product_slug}`} className="text-[14px] font-semibold text-[#275C53] hover:underline">{review.product_name || 'Product'}</Link>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.5px] ${
                            review.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                            review.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                            'bg-red-50 text-red-500'
                          }`}>{review.status}</span>
                        </div>
                        <span className="text-[11px] text-[#192026]/30">{new Date(review.created_at).toLocaleDateString('en-US')}</span>
                      </div>

                      {editingReview === review.id ? (
                        <div className="px-5 py-4 space-y-3">
                          <div>
                            <label className="text-[11px] font-semibold text-[#192026]/40 uppercase tracking-[0.5px] block mb-1">Rating</label>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button key={star} onClick={() => setEditForm(p => ({ ...p, rating: star }))} className="text-xl cursor-pointer">
                                  {star <= editForm.rating ? '★' : '☆'}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-[#192026]/40 uppercase tracking-[0.5px] block mb-1">Title</label>
                            <input type="text" value={editForm.title} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))} className="checkout-input" />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-[#192026]/40 uppercase tracking-[0.5px] block mb-1">Review</label>
                            <textarea value={editForm.content} onChange={e => setEditForm(p => ({ ...p, content: e.target.value }))} rows={3} className="checkout-input" />
                          </div>
                          <div className="flex gap-2">
                            <button
                              disabled={reviewSaving}
                              onClick={async () => {
                                setReviewSaving(true);
                                try {
                                  const res = await fetch('/api/account/reviews', {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      email: user?.email,
                                      reviewId: review.id,
                                      rating: editForm.rating,
                                      title: editForm.title,
                                      content: editForm.content,
                                    }),
                                  });
                                  if (res.ok) {
                                    setReviews(prev => prev.map(r => r.id === review.id ? { ...r, rating: editForm.rating, title: editForm.title, content: editForm.content, status: 'pending' } : r));
                                    setEditingReview(null);
                                  }
                                } catch { /* ignore */ }
                                setReviewSaving(false);
                              }}
                              className="px-4 py-2 bg-[#275C53] text-white rounded-xl text-[12px] font-bold uppercase tracking-[0.5px] hover:bg-[#1e4a42] transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {reviewSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button onClick={() => setEditingReview(null)} className="px-4 py-2 text-[#192026]/40 text-[12px] font-semibold hover:text-[#192026]/60 cursor-pointer">
                              Cancel
                            </button>
                          </div>
                          <p className="text-[10px] text-[#192026]/30">Edited reviews will be re-submitted for approval.</p>
                        </div>
                      ) : (
                        <div className="px-5 py-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[#D7B65D] text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                          </div>
                          {review.title && <p className="text-[14px] font-semibold text-[#192026] mb-1">{review.title}</p>}
                          {review.content && <p className="text-[13px] text-[#192026]/60 leading-relaxed">{review.content}</p>}

                          <div className="flex gap-3 mt-3 pt-3 border-t border-[#192026]/5">
                            <button
                              onClick={() => {
                                setEditingReview(review.id);
                                setEditForm({ rating: review.rating, title: review.title, content: review.content });
                              }}
                              className="text-[11px] text-[#275C53] font-semibold hover:underline cursor-pointer flex items-center gap-1"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                              Edit
                            </button>
                            <button
                              onClick={async () => {
                                if (!confirm('Are you sure you want to delete this review?')) return;
                                try {
                                  const res = await fetch('/api/account/reviews', {
                                    method: 'DELETE',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ email: user?.email, reviewId: review.id }),
                                  });
                                  if (res.ok) {
                                    setReviews(prev => prev.filter(r => r.id !== review.id));
                                  }
                                } catch { /* ignore */ }
                              }}
                              className="text-[11px] text-red-400 font-semibold hover:underline cursor-pointer flex items-center gap-1"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Member Benefits */}
          {activeTab === 'benefits' && (
            <div>
              <h2 className="text-xl font-bold text-[#275C53] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Member Benefits</h2>
              <div className="bg-white rounded-2xl border border-[#275C53]/5 p-8 text-center">
                <div className="w-20 h-20 bg-[#D7B65D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">⭐</span>
                </div>
                <h3 className="text-lg font-bold text-[#275C53] mb-2" style={{ fontFamily: 'var(--font-patua)' }}>Coming Soon</h3>
                <p className="text-[13px] text-[#192026]/40 max-w-md mx-auto leading-relaxed mb-6">
                  We&apos;re building an exclusive loyalty program for Royal King Seeds members. Earn points on every purchase,
                  unlock member-only strains, get early access to new releases, and receive exclusive discounts.
                </p>
                <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                  <div className="bg-[#F5F0EA] rounded-xl p-4">
                    <span className="text-xl block mb-1">🎁</span>
                    <span className="text-[10px] text-[#275C53] font-semibold uppercase tracking-[0.5px]">Earn Points</span>
                  </div>
                  <div className="bg-[#F5F0EA] rounded-xl p-4">
                    <span className="text-xl block mb-1">🔓</span>
                    <span className="text-[10px] text-[#275C53] font-semibold uppercase tracking-[0.5px]">Exclusive Strains</span>
                  </div>
                  <div className="bg-[#F5F0EA] rounded-xl p-4">
                    <span className="text-xl block mb-1">💎</span>
                    <span className="text-[10px] text-[#275C53] font-semibold uppercase tracking-[0.5px]">VIP Discounts</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grow Room */}
          {activeTab === 'growroom' && (
            <div>
              <h2 className="text-xl font-bold text-[#275C53] mb-2" style={{ fontFamily: 'var(--font-patua)' }}>My Grow Room</h2>
              <p className="text-[13px] text-[#192026]/40 mb-6">Strains you&apos;ve purchased — your personal seed collection.</p>

              {uniqueStrains.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#275C53]/5 p-8 text-center">
                  <span className="text-4xl block mb-3">🌱</span>
                  <p className="text-[#192026]/40 text-sm mb-4">Your grow room is empty. Purchase seeds to start your collection.</p>
                  <Link href="/product-category/shop-all-cannabis-seeds" className="inline-block px-6 py-2.5 bg-[#275C53] text-white rounded-xl text-[12px] font-bold">Shop Seeds</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uniqueStrains.map(strain => (
                    <Link key={strain.slug} href={`/${strain.slug}`} className="bg-white rounded-2xl border border-[#275C53]/5 p-5 hover:shadow-md hover:border-[#275C53]/15 transition-all group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#275C53]/10 to-[#D7B65D]/10 flex items-center justify-center shrink-0">
                          <span className="text-xl group-hover:scale-110 transition-transform">🌱</span>
                        </div>
                        <div>
                          <span className="text-[14px] font-semibold text-[#275C53] group-hover:text-[#D7B65D] transition-colors block leading-tight">{strain.name}</span>
                          <span className="text-[10px] text-[#192026]/30">Qty: {strain.qty} seeds</span>
                        </div>
                      </div>
                      <div className="text-[10px] text-[#192026]/30">
                        Purchased {new Date(strain.orderDate).toLocaleDateString('en-US')}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Saved Items */}
          {activeTab === 'saved' && (
            <div>
              <h2 className="text-xl font-bold text-[#275C53] mb-2" style={{ fontFamily: 'var(--font-patua)' }}>Saved Items</h2>
              <p className="text-[13px] text-[#192026]/40 mb-6">Strains you&apos;ve saved for later.</p>

              {wishlistItems.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#275C53]/5 p-8 text-center">
                  <span className="text-4xl block mb-3">❤️</span>
                  <p className="text-[#192026]/40 text-sm mb-4">No saved items. Tap the heart on any product to save it.</p>
                  <Link href="/product-category/shop-all-cannabis-seeds" className="inline-block px-6 py-2.5 bg-[#275C53] text-white rounded-xl text-[12px] font-bold">Browse Seeds</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {wishlistItems.map((product: Product) => (
                    <div key={product.id} className="bg-white rounded-2xl border border-[#275C53]/5 p-4 flex items-center gap-4">
                      <Link href={`/${product.slug}`} className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shrink-0">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-2" />
                        ) : (
                          <span className="text-2xl opacity-30">🌱</span>
                        )}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/${product.slug}`} className="text-[14px] font-semibold text-[#275C53] hover:text-[#D7B65D] transition-colors">{product.name}</Link>
                        <span className="text-[13px] text-[#192026]/40 block">${product.price.toFixed(2)} USD</span>
                      </div>
                      <button onClick={() => removeFromWishlist(product.id)} className="text-[#192026]/20 hover:text-red-400 transition-colors cursor-pointer p-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
