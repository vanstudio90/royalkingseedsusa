'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminFetch } from '@/lib/admin-fetch';

type Period = '7d' | '30d' | '90d' | 'all';

interface TopProduct {
  name: string;
  qty: number;
  revenue: number;
}

interface DailyData {
  date: string;
  revenue: number;
  orders: number;
}

interface AovPoint {
  week: string;
  aov: number;
}

interface StatusEntry {
  status: string;
  count: number;
  percent: number;
}

interface CouponStat {
  id: number;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  active: boolean;
  used_count: number;
  max_uses: number | null;
  expires_at: string | null;
  period_orders: number;
  period_discount: number;
}

interface AnalyticsData {
  topProducts: TopProduct[];
  dailyData: DailyData[];
  summary: {
    totalRevenue: number;
    totalOrders: number;
    aov: number;
    conversionRate: number;
  };
  aovTrend: AovPoint[];
  statusBreakdown: StatusEntry[];
  couponStats: CouponStat[];
}

const GREEN = '#275C53';
const GOLD = '#D7B65D';
const CREAM = '#F5F0EA';

const statusColors: Record<string, string> = {
  pending: '#EAB308',
  processing: '#3B82F6',
  shipped: '#8B5CF6',
  completed: '#10B981',
  cancelled: '#EF4444',
  refunded: '#6B7280',
};

function fmt(n: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtShort(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${Math.round(n)}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('30d');

  const fetchData = useCallback(async (p: Period) => {
    setLoading(true);
    try {
      const res = await adminFetch(`/api/admin/analytics/top-products?period=${p}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to load analytics', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData(period);
  }, [period, fetchData]);

  const handlePeriod = (p: Period) => {
    setPeriod(p);
  };

  // --- Render ---

  const periodLabel = period === '7d' ? 'Last 7 Days' : period === '30d' ? 'Last 30 Days' : period === '90d' ? 'Last 90 Days' : 'All Time';

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#192026]" style={{ fontFamily: 'var(--font-patua)' }}>Analytics</h1>
          <p className="text-[#192026]/40 text-sm mt-1">Store performance &mdash; {periodLabel}</p>
        </div>
        {/* Period Selector */}
        <div className="flex gap-1.5 bg-white rounded-xl border border-[#192026]/5 p-1">
          {(['7d', '30d', '90d', 'all'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => handlePeriod(p)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                period === p
                  ? 'text-white'
                  : 'text-[#192026]/50 hover:text-[#192026]/80 hover:bg-[#F5F0EA]'
              }`}
              style={period === p ? { backgroundColor: GREEN } : undefined}
            >
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : p === '90d' ? '90 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {loading || !data ? (
        <div className="p-16 text-center text-[#192026]/30 text-sm">Loading analytics...</div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <SummaryCard
              label="Total Revenue"
              value={`$${fmt(data.summary.totalRevenue)}`}
              sub={periodLabel}
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke={GREEN} strokeWidth="1.5"/><path d="M10 5v10M7 8h6M7 12h6" stroke={GREEN} strokeWidth="1.5" strokeLinecap="round"/></svg>
              }
            />
            <SummaryCard
              label="Orders"
              value={data.summary.totalOrders.toString()}
              sub={periodLabel}
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="13" rx="2" stroke={GOLD} strokeWidth="1.5"/><path d="M7 1v4M13 1v4" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/></svg>
              }
            />
            <SummaryCard
              label="Avg Order Value"
              value={`$${fmt(data.summary.aov)}`}
              sub="per order"
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 14l4-4 3 3 7-8" stroke={GREEN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              }
            />
            <SummaryCard
              label="Est. Conversion"
              value={`${data.summary.conversionRate.toFixed(1)}%`}
              sub="orders / visits"
              icon={
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2a8 8 0 110 16 8 8 0 010-16z" stroke={GOLD} strokeWidth="1.5"/><path d="M10 6v4l3 2" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/></svg>
              }
            />
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl border border-[#192026]/5 p-6 mb-6">
            <h2 className="text-lg font-bold text-[#192026] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>
              Daily Revenue
            </h2>
            {data.dailyData.length === 0 ? (
              <div className="text-sm text-[#192026]/30 py-8 text-center">No revenue data for this period</div>
            ) : (
              <RevenueChart data={data.dailyData} />
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Top 10 Products */}
            <div className="bg-white rounded-2xl border border-[#192026]/5 p-6">
              <h2 className="text-lg font-bold text-[#192026] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Top 10 Products</h2>
              {data.topProducts.length === 0 ? (
                <div className="text-sm text-[#192026]/30 py-8 text-center">No sales data yet</div>
              ) : (
                <TopProductsTable products={data.topProducts} />
              )}
            </div>

            {/* Order Status Breakdown */}
            <div className="bg-white rounded-2xl border border-[#192026]/5 p-6">
              <h2 className="text-lg font-bold text-[#192026] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Order Status Breakdown</h2>
              {data.statusBreakdown.length === 0 ? (
                <div className="text-sm text-[#192026]/30 py-8 text-center">No order data yet</div>
              ) : (
                <StatusBreakdown entries={data.statusBreakdown} />
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* AOV Trend */}
            <div className="bg-white rounded-2xl border border-[#192026]/5 p-6">
              <h2 className="text-lg font-bold text-[#192026] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>AOV Trend (Weekly)</h2>
              {data.aovTrend.length < 2 ? (
                <div className="text-sm text-[#192026]/30 py-8 text-center">Need more data for trend line</div>
              ) : (
                <AovTrendChart data={data.aovTrend} />
              )}
            </div>

            {/* Coupon Performance */}
            <div className="bg-white rounded-2xl border border-[#192026]/5 p-6">
              <h2 className="text-lg font-bold text-[#192026] mb-4" style={{ fontFamily: 'var(--font-patua)' }}>Coupon Performance</h2>
              {data.couponStats.length === 0 ? (
                <div className="text-sm text-[#192026]/30 py-8 text-center">No coupons created yet</div>
              ) : (
                <CouponTable coupons={data.couponStats} />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ---- Sub-components ---- */

function SummaryCard({ label, value, sub, icon }: { label: string; value: string; sub: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#192026]/5 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: CREAM }}>
          {icon}
        </div>
        <span className="text-[10px] uppercase tracking-[1px] font-semibold text-[#192026]/30">{label}</span>
      </div>
      <div className="text-2xl font-bold text-[#192026]">{value}</div>
      <div className="text-[12px] text-[#192026]/40 mt-0.5">{sub}</div>
    </div>
  );
}

function RevenueChart({ data }: { data: DailyData[] }) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);
  const chartH = 200;
  const barGap = 1;
  const barCount = data.length;
  // Show labels at intervals to avoid crowding
  const labelEvery = barCount > 30 ? Math.ceil(barCount / 10) : barCount > 14 ? 3 : 1;

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: Math.max(barCount * 14, 300) }}>
        {/* Y-axis labels */}
        <div className="flex items-end mb-1">
          <div className="flex flex-col justify-between text-right pr-2" style={{ height: chartH, width: 50 }}>
            <span className="text-[10px] text-[#192026]/30 leading-none">{fmtShort(maxRevenue)}</span>
            <span className="text-[10px] text-[#192026]/30 leading-none">{fmtShort(maxRevenue / 2)}</span>
            <span className="text-[10px] text-[#192026]/30 leading-none">$0</span>
          </div>
          {/* Bars */}
          <div className="flex-1">
            <svg width="100%" height={chartH} preserveAspectRatio="none" viewBox={`0 0 ${barCount * (10 + barGap)} ${chartH}`}>
              {/* Grid lines */}
              <line x1="0" y1={chartH * 0.25} x2={barCount * (10 + barGap)} y2={chartH * 0.25} stroke="#192026" strokeOpacity="0.05" />
              <line x1="0" y1={chartH * 0.5} x2={barCount * (10 + barGap)} y2={chartH * 0.5} stroke="#192026" strokeOpacity="0.05" />
              <line x1="0" y1={chartH * 0.75} x2={barCount * (10 + barGap)} y2={chartH * 0.75} stroke="#192026" strokeOpacity="0.05" />
              {data.map((d, i) => {
                const h = maxRevenue > 0 ? (d.revenue / maxRevenue) * (chartH - 4) : 0;
                const x = i * (10 + barGap);
                return (
                  <g key={d.date}>
                    <rect
                      x={x}
                      y={chartH - Math.max(h, 1)}
                      width={10}
                      height={Math.max(h, 1)}
                      rx={2}
                      fill={d.revenue > 0 ? GREEN : '#e5e7eb'}
                    >
                      <title>{formatDate(d.date)}: ${fmt(d.revenue)} ({d.orders} orders)</title>
                    </rect>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
        {/* X-axis labels */}
        <div className="flex" style={{ paddingLeft: 50 }}>
          <div className="flex-1 flex">
            {data.map((d, i) => (
              <div
                key={d.date}
                style={{ width: `${100 / barCount}%` }}
                className="text-center"
              >
                {i % labelEvery === 0 && (
                  <span className="text-[9px] text-[#192026]/30">{formatDate(d.date)}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TopProductsTable({ products }: { products: TopProduct[] }) {
  const maxRev = Math.max(...products.map((p) => p.revenue), 1);

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-1.5 text-[10px] uppercase tracking-[1px] font-semibold text-[#192026]/30">
        <span className="w-6">#</span>
        <span className="flex-1">Product</span>
        <span className="w-16 text-right">Units</span>
        <span className="w-20 text-right">Revenue</span>
        <span className="w-24"></span>
      </div>
      {products.map((p, i) => {
        const barW = (p.revenue / maxRev) * 100;
        return (
          <div key={p.name} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: `${CREAM}80` }}>
            <span
              className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 text-white"
              style={{ backgroundColor: i < 3 ? GOLD : GREEN }}
            >
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[#192026] truncate">{p.name}</div>
            </div>
            <span className="w-16 text-right text-xs text-[#192026]/60 font-medium">{p.qty}</span>
            <span className="w-20 text-right text-sm font-bold" style={{ color: GREEN }}>${fmt(p.revenue)}</span>
            <div className="w-24">
              <div className="h-2 rounded-full" style={{ backgroundColor: `${GREEN}15` }}>
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ width: `${Math.max(barW, 2)}%`, backgroundColor: i < 3 ? GOLD : GREEN }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatusBreakdown({ entries }: { entries: StatusEntry[] }) {
  const total = entries.reduce((s, e) => s + e.count, 0);
  // Sort by count desc
  const sorted = [...entries].sort((a, b) => b.count - a.count);

  // SVG donut
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 60;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const segments = sorted.map((entry) => {
    const pct = total > 0 ? entry.count / total : 0;
    const seg = {
      ...entry,
      dashArray: `${circumference * pct} ${circumference * (1 - pct)}`,
      dashOffset: -offset,
      color: statusColors[entry.status] || '#94A3B8',
    };
    offset += circumference * pct;
    return seg;
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* Donut */}
      <div className="shrink-0">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth="20" />
          {segments.map((seg) => (
            <circle
              key={seg.status}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth="20"
              strokeDasharray={seg.dashArray}
              strokeDashoffset={seg.dashOffset}
              transform={`rotate(-90 ${cx} ${cy})`}
              strokeLinecap="butt"
            />
          ))}
          <text x={cx} y={cy - 6} textAnchor="middle" className="text-lg font-bold" fill="#192026" fontSize="20" fontWeight="700">{total}</text>
          <text x={cx} y={cy + 12} textAnchor="middle" fill="#192026" fillOpacity="0.4" fontSize="10">orders</text>
        </svg>
      </div>
      {/* Legend */}
      <div className="flex-1 space-y-2 w-full">
        {sorted.map((entry) => (
          <div key={entry.status} className="flex items-center gap-3">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: statusColors[entry.status] || '#94A3B8' }}
            />
            <span className="text-sm capitalize text-[#192026]/70 flex-1">{entry.status}</span>
            <span className="text-sm font-semibold text-[#192026]">{entry.count}</span>
            <span className="text-xs text-[#192026]/40 w-10 text-right">{entry.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AovTrendChart({ data }: { data: AovPoint[] }) {
  const maxAov = Math.max(...data.map((d) => d.aov), 1);
  const minAov = Math.min(...data.map((d) => d.aov));
  const padding = (maxAov - minAov) * 0.1 || 10;
  const yMin = Math.max(0, minAov - padding);
  const yMax = maxAov + padding;

  const w = 500;
  const h = 160;
  const px = 10;
  const py = 10;

  const points = data.map((d, i) => {
    const x = px + (i / (data.length - 1)) * (w - 2 * px);
    const y = py + (1 - (d.aov - yMin) / (yMax - yMin)) * (h - 2 * py);
    return { x, y, ...d };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  // Area fill
  const areaPath = `M${points[0].x},${h - py} ${points.map((p) => `L${p.x},${p.y}`).join(' ')} L${points[points.length - 1].x},${h - py} Z`;

  return (
    <div className="overflow-x-auto">
      <svg width="100%" height={h + 30} viewBox={`0 0 ${w} ${h + 30}`} preserveAspectRatio="xMidYMid meet">
        {/* Grid */}
        <line x1={px} y1={py} x2={w - px} y2={py} stroke="#192026" strokeOpacity="0.05" />
        <line x1={px} y1={h / 2} x2={w - px} y2={h / 2} stroke="#192026" strokeOpacity="0.05" />
        <line x1={px} y1={h - py} x2={w - px} y2={h - py} stroke="#192026" strokeOpacity="0.05" />

        {/* Y labels */}
        <text x={px} y={py - 2} fontSize="9" fill="#192026" fillOpacity="0.3">${fmt(yMax)}</text>
        <text x={px} y={h - py + 12} fontSize="9" fill="#192026" fillOpacity="0.3">${fmt(yMin)}</text>

        {/* Area */}
        <path d={areaPath} fill={GREEN} fillOpacity="0.08" />

        {/* Line */}
        <polyline points={polylinePoints} fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots */}
        {points.map((p, i) => (
          <g key={p.week}>
            <circle cx={p.x} cy={p.y} r={3.5} fill="white" stroke={GREEN} strokeWidth="2" />
            <title>Week of {formatDate(p.week)}: ${fmt(p.aov)}</title>
            {/* X labels — show some */}
            {(i === 0 || i === points.length - 1 || i % Math.ceil(points.length / 5) === 0) && (
              <text x={p.x} y={h + 16} fontSize="9" fill="#192026" fillOpacity="0.3" textAnchor="middle">{formatDate(p.week)}</text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

function CouponTable({ coupons }: { coupons: CouponStat[] }) {
  return (
    <div className="space-y-2 max-h-[340px] overflow-y-auto">
      {coupons.map((c) => (
        <div
          key={c.id}
          className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-xl"
          style={{ backgroundColor: `${CREAM}80` }}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider"
              style={{
                backgroundColor: c.active ? `${GREEN}15` : '#f3f4f6',
                color: c.active ? GREEN : '#9ca3af',
              }}
            >
              {c.code}
            </span>
            <span className="text-xs text-[#192026]/40">
              {c.type === 'percentage' ? `${c.value}% off` : `$${c.value} off`}
            </span>
            {!c.active && <span className="text-[10px] text-red-400 font-medium">Inactive</span>}
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="text-center">
              <div className="font-semibold text-[#192026]">{c.used_count}</div>
              <div className="text-[10px] text-[#192026]/30">total uses</div>
            </div>
            <div className="text-center">
              <div className="font-semibold" style={{ color: GREEN }}>{c.period_orders}</div>
              <div className="text-[10px] text-[#192026]/30">period uses</div>
            </div>
            <div className="text-center">
              <div className="font-semibold" style={{ color: GOLD }}>${fmt(c.period_discount)}</div>
              <div className="text-[10px] text-[#192026]/30">discounted</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
