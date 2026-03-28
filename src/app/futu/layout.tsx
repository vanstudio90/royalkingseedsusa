'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/futu', label: 'Dashboard', icon: '📊' },
  { href: '/futu/products', label: 'Products', icon: '🌱' },
  { href: '/futu/orders', label: 'Orders', icon: '📦' },
  { href: '/futu/customers', label: 'Customers', icon: '👤' },
  { href: '/futu/users', label: 'Users', icon: '👥' },
  { href: '/futu/coupons', label: 'Coupons', icon: '🏷️' },
  { href: '/futu/analytics', label: 'Analytics', icon: '📈' },
  { href: '/futu/pages', label: 'Pages & Blog', icon: '📄' },
  { href: '/futu/categories', label: 'Categories', icon: '📁' },
  { href: '/futu/blog-categories', label: 'Blog Categories', icon: '📝' },
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
              placeholder="Username"
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
              placeholder="Password"
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem('admin_token');
      if (token) setAuthenticated(true);
      const collapsed = localStorage.getItem('admin_sidebar_collapsed');
      if (collapsed === 'true') setDesktopCollapsed(true);
    } catch {}
    setChecking(false);
  }, []);

  const toggleDesktopSidebar = () => {
    const next = !desktopCollapsed;
    setDesktopCollapsed(next);
    try { localStorage.setItem('admin_sidebar_collapsed', String(next)); } catch {}
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

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
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#192026] flex items-center gap-3 px-4 py-3 border-b border-white/10">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-9 h-9 flex items-center justify-center text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
        >
          {sidebarOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
        <Link href="/futu" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#275C53] rounded-lg flex items-center justify-center">
            <span className="text-[#D7B65D] font-bold text-[10px]">RK</span>
          </div>
          <span className="text-white text-sm font-bold">Royal King Seeds</span>
        </Link>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 bg-[#192026] h-screen flex flex-col shrink-0 transition-all duration-200 ease-in-out
        ${desktopCollapsed ? 'lg:w-[68px]' : 'lg:w-[260px]'} w-[260px]
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        {/* Desktop header */}
        <div className={`hidden lg:flex items-center border-b border-white/5 ${desktopCollapsed ? 'flex-col gap-2 py-3 px-2' : 'p-4'}`}>
          {!desktopCollapsed && (
            <Link href="/futu" className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 bg-[#275C53] rounded-xl flex items-center justify-center shrink-0">
                <span className="text-[#D7B65D] font-bold text-xs">RK</span>
              </div>
              <div className="min-w-0">
                <div className="text-white text-sm font-bold truncate">Royal King Seeds</div>
                <div className="text-white/25 text-[10px] uppercase tracking-[1px]">Admin Panel</div>
              </div>
            </Link>
          )}
          <button
            onClick={toggleDesktopSidebar}
            className={`flex items-center justify-center rounded-lg transition-colors cursor-pointer shrink-0 ${
              desktopCollapsed
                ? 'w-10 h-10 bg-[#275C53] text-white/70 hover:text-white hover:bg-[#275C53]/80'
                : 'w-7 h-7 text-white/30 hover:text-white hover:bg-white/10 ml-auto'
            }`}
            title={desktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg width={desktopCollapsed ? 20 : 16} height={desktopCollapsed ? 20 : 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {desktopCollapsed ? (
                <><polyline points="13 7 18 12 13 17" /><line x1="18" y1="12" x2="6" y2="12" /></>
              ) : (
                <><polyline points="11 17 6 12 11 7" /><line x1="6" y1="12" x2="18" y2="12" /></>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile: spacer for top bar */}
        <div className="lg:hidden h-[52px] shrink-0" />

        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/futu' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                title={desktopCollapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  active
                    ? 'bg-[#275C53] text-white'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                } ${desktopCollapsed ? 'lg:justify-center lg:px-0' : ''}`}
              >
                <span className={`text-base ${desktopCollapsed ? 'lg:text-lg' : ''}`}>{item.icon}</span>
                <span className={desktopCollapsed ? 'lg:hidden' : ''}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t border-white/5">
          <Link href="/" title={desktopCollapsed ? 'View Site' : undefined} className={`flex items-center gap-3 px-3 py-2.5 text-white/30 hover:text-white/50 text-sm transition-colors ${desktopCollapsed ? 'lg:justify-center lg:px-0' : ''}`}>
            <span>🌐</span> <span className={desktopCollapsed ? 'lg:hidden' : ''}>View Site</span>
          </Link>
          <button
            onClick={handleLogout}
            title={desktopCollapsed ? 'Logout' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-white/30 hover:text-red-400 text-sm transition-colors text-left cursor-pointer ${desktopCollapsed ? 'lg:justify-center lg:px-0' : ''}`}
          >
            <span>🚪</span> <span className={desktopCollapsed ? 'lg:hidden' : ''}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="pt-[60px] lg:pt-0 p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
