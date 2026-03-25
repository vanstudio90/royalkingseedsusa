'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

/* ─── Types ────────────────────────────────────────────────────── */

interface DashboardStats {
  today_revenue: number;
  yesterday_revenue: number;
  week_revenue: number;
  last_week_revenue: number;
  month_revenue: number;
  last_month_revenue: number;
  all_time_revenue: number;
  total_orders: number;
  pending_orders: number;
  processing_orders: number;
  shipped_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  failed_payments: number;
  products: { published: number; draft: number; total: number; out_of_stock: number };
  low_stock_products: { id: number; name: string; slug: string; stock_quantity: number; low_stock_threshold: number }[];
  low_stock_count: number;
  abandoned_carts_count: number;
  recent_orders: {
    id: number;
    order_number: string;
    customer_name: string;
    customer_email: string;
    total: number;
    status: string;
    payment_status: string;
    item_count: number;
    created_at: string;
  }[];
  daily_revenue: { date: string; revenue: number; orders: number }[];
  pages: { total: number };
  blog: { total: number };
  categories: { total: number };
}

interface TopProduct {
  name: string;
  qty: number;
  revenue: number;
}

/* ─── Helpers ──────────────────────────────────────────────────── */

const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

const fmtShort = (n: number) => {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return fmt(n);
};

const pctChange = (current: number, previous: number): { value: number; label: string; positive: boolean } => {
  if (previous === 0 && current === 0) return { value: 0, label: '0%', positive: true };
  if (previous === 0) return { value: 100, label: '+100%', positive: true };
  const pct = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(pct),
    label: `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`,
    positive: pct >= 0,
  };
};

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

const paymentStatusColor: Record<string, string> = {
  paid: 'text-green-600',
  unpaid: 'text-red-500',
  refunded: 'text-gray-500',
};

function relativeTime(dateStr: string) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const HEADING = { fontFamily: 'var(--font-patua)' };

/* ─── Main Component ───────────────────────────────────────────── */

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then(r => r.json()),
      fetch('/api/admin/analytics/top-products').then(r => r.json()),
    ])
      .then(([statsData, analyticsData]) => {
        setStats(statsData);
        setTopProducts((analyticsData.topProducts || []).slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#275C53] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-[#192026]/40">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-20 text-[#192026]/40">
        Failed to load dashboard data. Please refresh.
      </div>
    );
  }

  const todayChange = pctChange(stats.today_revenue, stats.yesterday_revenue);
  const weekChange = pctChange(stats.week_revenue, stats.last_week_revenue);
  const monthChange = pctChange(stats.month_revenue, stats.last_month_revenue);

  const maxDailyRevenue = Math.max(...stats.daily_revenue.map(d => d.revenue), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#192026]" style={HEADING}>
            Dashboard
          </h1>
          <p className="text-[#192026]/40 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link
          href="/futu/orders"
          className="px-4 py-2 bg-[#275C53] text-white text-sm rounded-xl hover:bg-[#275C53]/90 transition-colors"
        >
          View All Orders
        </Link>
      </div>

      {/* ─── 1. Revenue Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <RevenueCard title="Today" amount={stats.today_revenue} change={todayChange} compareLabel="vs yesterday" />
        <RevenueCard title="This Week" amount={stats.week_revenue} change={weekChange} compareLabel="vs last week" />
        <RevenueCard title="This Month" amount={stats.month_revenue} change={monthChange} compareLabel="vs last month" />
        <RevenueCard title="All Time" amount={stats.all_time_revenue} change={null} compareLabel="" />
      </div>

      {/* ─── 2. Quick Alerts ────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AlertCard
          label="Failed Payments"
          count={stats.failed_payments}
          color={stats.failed_payments > 0 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
            </svg>
          }
          href="/futu/orders?status=pending"
          okText="All clear"
        />
        <AlertCard
          label="Out of Stock"
          count={stats.products.out_of_stock}
          color={stats.products.out_of_stock > 0 ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-green-50 border-green-200 text-green-700'}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
          href="/futu/products?status=all"
          okText="Fully stocked"
        />
        <AlertCard
          label="Pending Orders"
          count={stats.pending_orders}
          color={stats.pending_orders > 0 ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-green-50 border-green-200 text-green-700'}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          href="/futu/orders?status=pending"
          okText="None pending"
        />
        <AlertCard
          label="Abandoned Carts"
          count={stats.abandoned_carts_count}
          color={stats.abandoned_carts_count > 0 ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-green-50 border-green-200 text-green-700'}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          }
          href="/futu/abandoned-carts"
          okText="None"
        />
      </div>

      {/* ─── 3. Orders Overview + Revenue Chart ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Status */}
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-6">
          <h2 className="text-lg font-bold text-[#192026] mb-4" style={HEADING}>
            Orders Overview
          </h2>
          <div className="space-y-3">
            <OrderStatusRow label="Pending" count={stats.pending_orders} color="bg-yellow-400" total={stats.total_orders} />
            <OrderStatusRow label="Processing" count={stats.processing_orders} color="bg-blue-400" total={stats.total_orders} />
            <OrderStatusRow label="Shipped" count={stats.shipped_orders} color="bg-purple-400" total={stats.total_orders} />
            <OrderStatusRow label="Completed" count={stats.completed_orders} color="bg-green-500" total={stats.total_orders} />
            <OrderStatusRow label="Cancelled" count={stats.cancelled_orders} color="bg-red-400" total={stats.total_orders} />
          </div>
          <div className="mt-4 pt-4 border-t border-[#192026]/5 flex items-center justify-between">
            <span className="text-sm text-[#192026]/50">Total Orders</span>
            <span className="text-lg font-bold text-[#192026]">{stats.total_orders}</span>
          </div>
        </div>

        {/* Revenue Chart - Last 7 Days */}
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-6">
          <h2 className="text-lg font-bold text-[#192026] mb-4" style={HEADING}>
            Revenue — Last 7 Days
          </h2>
          <div className="flex items-end gap-2 h-48">
            {stats.daily_revenue.map((day) => {
              const barHeight = maxDailyRevenue > 0 ? (day.revenue / maxDailyRevenue) * 100 : 0;
              const dayLabel = new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' });
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  {day.revenue > 0 && (
                    <span className="text-[10px] text-[#192026]/50 font-medium">
                      {fmtShort(day.revenue)}
                    </span>
                  )}
                  <div
                    className="w-full rounded-t-lg transition-all duration-500 min-h-[4px]"
                    style={{
                      height: `${Math.max(barHeight, 2)}%`,
                      backgroundColor: day.revenue > 0 ? '#275C53' : '#e5e7eb',
                    }}
                    title={`${day.date}: ${fmt(day.revenue)} (${day.orders} orders)`}
                  />
                  <span className="text-[11px] text-[#192026]/40 mt-1">{dayLabel}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-[#192026]/5 flex items-center justify-between text-sm">
            <span className="text-[#192026]/50">7-day total</span>
            <span className="font-bold text-[#275C53]">
              {fmt(stats.daily_revenue.reduce((s, d) => s + d.revenue, 0))}
            </span>
          </div>
        </div>
      </div>

      {/* ─── 4. Top Selling Strains + Low Stock ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Selling Strains */}
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-6">
          <h2 className="text-lg font-bold text-[#192026] mb-4" style={HEADING}>
            Top Selling Strains
          </h2>
          {topProducts.length === 0 ? (
            <p className="text-sm text-[#192026]/30 py-8 text-center">No sales data yet</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product, i) => (
                <div key={product.name} className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      backgroundColor: i === 0 ? '#D7B65D' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : '#F5F0EA',
                      color: i < 3 ? '#fff' : '#192026',
                    }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#192026] truncate">{product.name}</div>
                    <div className="text-[11px] text-[#192026]/40">{product.qty} units sold</div>
                  </div>
                  <span className="text-sm font-bold text-[#275C53] shrink-0">{fmt(product.revenue)}</span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 pt-3 border-t border-[#192026]/5">
            <Link href="/futu/analytics" className="text-sm text-[#275C53] hover:underline">
              View full analytics &rarr;
            </Link>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl border border-[#192026]/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#192026]" style={HEADING}>
              Low Stock Alerts
            </h2>
            {stats.low_stock_count > 0 && (
              <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                {stats.low_stock_count} items
              </span>
            )}
          </div>
          {stats.low_stock_products.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-2xl mb-2">&#10003;</div>
              <p className="text-sm text-[#192026]/30">All products are well stocked</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.low_stock_products.map((product) => {
                const pct = product.low_stock_threshold > 0
                  ? Math.round((product.stock_quantity / product.low_stock_threshold) * 100)
                  : 0;
                const urgent = product.stock_quantity <= 3;
                return (
                  <Link
                    key={product.id}
                    href={`/futu/products/${product.id}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[#192026] truncate group-hover:text-[#275C53] transition-colors">
                        {product.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-[#192026]/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(pct, 100)}%`,
                              backgroundColor: urgent ? '#ef4444' : '#f59e0b',
                            }}
                          />
                        </div>
                        <span className={`text-[11px] font-semibold ${urgent ? 'text-red-600' : 'text-orange-600'}`}>
                          {product.stock_quantity} left
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#192026]/30 shrink-0">
                      threshold: {product.low_stock_threshold}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
          <div className="mt-4 pt-3 border-t border-[#192026]/5">
            <Link href="/futu/products" className="text-sm text-[#275C53] hover:underline">
              Manage inventory &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* ─── 5. Recent Orders ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#192026]/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#192026]" style={HEADING}>
            Recent Orders
          </h2>
          <Link href="/futu/orders" className="text-sm text-[#275C53] hover:underline">
            View all &rarr;
          </Link>
        </div>
        {stats.recent_orders.length === 0 ? (
          <p className="text-sm text-[#192026]/30 py-8 text-center">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#192026]/5">
                  <th className="text-left py-2 pr-4 text-[10px] uppercase tracking-[1px] font-semibold text-[#192026]/30">Order</th>
                  <th className="text-left py-2 pr-4 text-[10px] uppercase tracking-[1px] font-semibold text-[#192026]/30">Customer</th>
                  <th className="text-left py-2 pr-4 text-[10px] uppercase tracking-[1px] font-semibold text-[#192026]/30">Total</th>
                  <th className="text-left py-2 pr-4 text-[10px] uppercase tracking-[1px] font-semibold text-[#192026]/30">Status</th>
                  <th className="text-left py-2 text-[10px] uppercase tracking-[1px] font-semibold text-[#192026]/30">When</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_orders.map((order) => (
                  <tr key={order.id} className="border-b border-[#192026]/5 last:border-0 hover:bg-[#F5F0EA]/30 transition-colors">
                    <td className="py-3 pr-4">
                      <Link href={`/futu/orders/${order.id}`} className="text-[#275C53] font-medium hover:underline">
                        #{order.order_number}
                      </Link>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="font-medium text-[#192026]">{order.customer_name}</div>
                      <div className="text-[11px] text-[#192026]/40">{order.customer_email}</div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="font-semibold text-[#192026]">{fmt(order.total)}</span>
                      <span className={`block text-[11px] ${paymentStatusColor[order.payment_status] || 'text-gray-500'}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`inline-block px-2.5 py-1 text-[11px] font-semibold rounded-full ${statusColor[order.status] || 'bg-gray-100 text-gray-700'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-[#192026]/50 text-[12px]">
                      {relativeTime(order.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── 6. Quick Actions ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#192026]/5 p-6">
        <h2 className="text-lg font-bold text-[#192026] mb-4" style={HEADING}>Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickAction href="/futu/products" label="Manage Products" icon={<ProductIcon />} count={stats.products.total} />
          <QuickAction href="/futu/orders" label="View Orders" icon={<OrderIcon />} count={stats.total_orders} />
          <QuickAction href="/futu/customers" label="Customers" icon={<CustomerIcon />} />
          <QuickAction href="/futu/coupons" label="Coupons" icon={<CouponIcon />} />
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ───────────────────────────────────────────── */

function RevenueCard({
  title,
  amount,
  change,
  compareLabel,
}: {
  title: string;
  amount: number;
  change: { value: number; label: string; positive: boolean } | null;
  compareLabel: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#192026]/5 p-5 hover:shadow-md transition-shadow">
      <div className="text-[10px] uppercase tracking-[1px] font-semibold text-[#192026]/30 mb-1">
        {title}
      </div>
      <div className="text-2xl font-bold text-[#192026]" style={HEADING}>
        {fmt(amount)}
      </div>
      {change ? (
        <div className="flex items-center gap-1.5 mt-2">
          <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold ${
              change.positive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
            }`}
          >
            {change.positive ? (
              <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            )}
            {change.label}
          </span>
          <span className="text-[10px] text-[#192026]/30">{compareLabel}</span>
        </div>
      ) : (
        <div className="mt-2 text-[11px] text-[#192026]/30">lifetime</div>
      )}
    </div>
  );
}

function AlertCard({
  label,
  count,
  color,
  icon,
  href,
  okText,
}: {
  label: string;
  count: number;
  color: string;
  icon: React.ReactNode;
  href: string;
  okText: string;
}) {
  return (
    <Link href={href}>
      <div className={`rounded-2xl border p-4 ${color} hover:shadow-md transition-shadow cursor-pointer`}>
        <div className="flex items-center justify-between mb-2">
          {icon}
          <span className="text-2xl font-bold" style={HEADING}>
            {count}
          </span>
        </div>
        <div className="text-xs font-semibold">{label}</div>
        {count === 0 && (
          <div className="text-[10px] mt-0.5 opacity-60">{okText}</div>
        )}
      </div>
    </Link>
  );
}

function OrderStatusRow({
  label,
  count,
  color,
  total,
}: {
  label: string;
  count: number;
  color: string;
  total: number;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-[#192026]/60 w-24">{label}</span>
      <div className="flex-1 h-2 bg-[#192026]/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${Math.max(pct, 0)}%` }}
        />
      </div>
      <span className="text-sm font-bold text-[#192026] w-10 text-right">{count}</span>
    </div>
  );
}

function QuickAction({
  href,
  label,
  icon,
  count,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 bg-[#F5F0EA] rounded-xl text-sm text-[#192026]/70 hover:bg-[#275C53] hover:text-white transition-colors group"
    >
      <span className="text-[#275C53] group-hover:text-[#D7B65D] transition-colors">{icon}</span>
      <span className="flex-1">{label}</span>
      {count !== undefined && (
        <span className="text-[11px] font-semibold opacity-50">{count}</span>
      )}
    </Link>
  );
}

/* ─── Icon components ──────────────────────────────────────────── */

function ProductIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}

function CustomerIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function CouponIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );
}
