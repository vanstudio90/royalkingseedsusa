'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/futu', label: 'Dashboard', icon: '📊' },
  { href: '/futu/products', label: 'Products', icon: '🌱' },
  { href: '/futu/orders', label: 'Orders', icon: '📦' },
  { href: '/futu/customers', label: 'Customers', icon: '👤' },
  { href: '/futu/coupons', label: 'Coupons', icon: '🏷️' },
  { href: '/futu/analytics', label: 'Analytics', icon: '📈' },
  { href: '/futu/pages', label: 'Pages & Blog', icon: '📄' },
  { href: '/futu/categories', label: 'Categories', icon: '📁' },
  { href: '/futu/reviews', label: 'Reviews', icon: '⭐' },
  { href: '/futu/shipping', label: 'Shipping', icon: '🚚' },
  { href: '/futu/wishlists', label: 'Wishlists', icon: '❤️' },
  { href: '/futu/abandoned-carts', label: 'Abandoned Carts', icon: '🛒' },
  { href: '/futu/activity', label: 'Activity Log', icon: '📋' },
  { href: '/futu/settings', label: 'Settings', icon: '⚙️' },
  { href: '/futu/export', label: 'Export/Import', icon: '💾' },
];

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      localStorage.setItem('admin_token', data.session.access_token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      onLogin();
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#192026] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#275C53] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-[#D7B65D] font-bold text-lg" style={{ fontFamily: 'var(--font-patua)' }}>RK</span>
          </div>
          <h1 className="text-xl text-white font-bold" style={{ fontFamily: 'var(--font-patua)' }}>Royal King Seeds</h1>
          <p className="text-white/30 text-sm mt-1">Admin Dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="bg-[#1e2830] rounded-2xl p-6 border border-white/5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-white/40 text-[11px] uppercase tracking-[1px] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#192026] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#D7B65D]/50"
              placeholder="contact@royalkingseeds.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-white/40 text-[11px] uppercase tracking-[1px] mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#192026] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#D7B65D]/50"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#275C53] text-white rounded-xl text-sm font-semibold hover:bg-[#1e4a42] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setAuthenticated(true);
    }
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#192026] flex items-center justify-center">
        <div className="text-white/30 text-sm">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return <LoginForm onLogin={() => setAuthenticated(true)} />;
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-[#f0ece6] flex">
      {/* Sidebar */}
      <aside className="w-[240px] bg-[#192026] min-h-screen flex flex-col shrink-0">
        <div className="p-5 border-b border-white/5">
          <Link href="/futu" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#275C53] rounded-xl flex items-center justify-center">
              <span className="text-[#D7B65D] font-bold text-xs">RK</span>
            </div>
            <div>
              <div className="text-white text-sm font-bold">Royal King Seeds</div>
              <div className="text-white/25 text-[10px] uppercase tracking-[1px]">Admin Panel</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/futu' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  active
                    ? 'bg-[#275C53] text-white'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/5">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 text-white/30 hover:text-white/50 text-sm transition-colors">
            <span>🌐</span> View Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-white/30 hover:text-red-400 text-sm transition-colors text-left cursor-pointer"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="p-6 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
