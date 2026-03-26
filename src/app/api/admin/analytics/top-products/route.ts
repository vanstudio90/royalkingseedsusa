import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;

  const period = request.nextUrl.searchParams.get('period') || '30d';

  // Calculate date range
  let startDate: string | null = null;
  const now = new Date();
  if (period === '7d') {
    startDate = new Date(now.getTime() - 7 * 86400000).toISOString();
  } else if (period === '30d') {
    startDate = new Date(now.getTime() - 30 * 86400000).toISOString();
  } else if (period === '90d') {
    startDate = new Date(now.getTime() - 90 * 86400000).toISOString();
  }
  // 'all' => startDate stays null

  // Fetch paid orders (with optional date filter)
  let ordersQuery = supabaseAdmin
    .from('orders')
    .select('items, total, status, payment_status, created_at, discount, coupon_code')
    .eq('payment_status', 'paid');

  if (startDate) {
    ordersQuery = ordersQuery.gte('created_at', startDate);
  }

  const { data: orders } = await ordersQuery;

  // Fetch ALL orders (paid or not, within period) for status breakdown
  let allOrdersQuery = supabaseAdmin
    .from('orders')
    .select('status, created_at');
  if (startDate) {
    allOrdersQuery = allOrdersQuery.gte('created_at', startDate);
  }
  const { data: allOrders } = await allOrdersQuery;

  // Fetch coupons
  const { data: coupons } = await supabaseAdmin
    .from('coupons')
    .select('*')
    .order('used_count', { ascending: false });

  // --- Top Products ---
  const productSales: Record<string, { name: string; qty: number; revenue: number }> = {};
  (orders || []).forEach((order) => {
    const items = order.items as { name: string; qty: number; price: number }[];
    (items || []).forEach((item) => {
      const key = item.name;
      if (!productSales[key]) productSales[key] = { name: key, qty: 0, revenue: 0 };
      productSales[key].qty += item.qty;
      productSales[key].revenue += item.qty * item.price;
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // --- Daily Revenue (for chart) ---
  const dailyRevenue: Record<string, number> = {};
  const dailyOrders: Record<string, number> = {};
  (orders || []).forEach((order) => {
    const day = new Date(order.created_at).toISOString().slice(0, 10);
    dailyRevenue[day] = (dailyRevenue[day] || 0) + parseFloat(order.total);
    dailyOrders[day] = (dailyOrders[day] || 0) + 1;
  });

  // Fill in missing days within period
  const daysCount = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 0;
  const dailyData: { date: string; revenue: number; orders: number }[] = [];

  if (daysCount > 0) {
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      dailyData.push({
        date: key,
        revenue: dailyRevenue[key] || 0,
        orders: dailyOrders[key] || 0,
      });
    }
  } else {
    // "all" — group by day, sorted
    Object.keys(dailyRevenue)
      .sort()
      .forEach((key) => {
        dailyData.push({
          date: key,
          revenue: dailyRevenue[key] || 0,
          orders: dailyOrders[key] || 0,
        });
      });
  }

  // --- Summary Stats ---
  const totalRevenue = (orders || []).reduce((s, o) => s + parseFloat(o.total), 0);
  const totalOrders = (orders || []).length;
  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  // Rough conversion rate estimate: assume 20x orders as "visits"
  const estimatedVisits = Math.max(totalOrders * 20, 1);
  const conversionRate = (totalOrders / estimatedVisits) * 100;

  // --- AOV over time (weekly buckets) ---
  const weeklyAov: Record<string, { revenue: number; orders: number }> = {};
  (orders || []).forEach((order) => {
    const d = new Date(order.created_at);
    // Get Monday of the week
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d);
    monday.setDate(diff);
    const key = monday.toISOString().slice(0, 10);
    if (!weeklyAov[key]) weeklyAov[key] = { revenue: 0, orders: 0 };
    weeklyAov[key].revenue += parseFloat(order.total);
    weeklyAov[key].orders += 1;
  });

  const aovTrend = Object.entries(weeklyAov)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, data]) => ({
      week,
      aov: data.orders > 0 ? data.revenue / data.orders : 0,
    }));

  // --- Order Status Breakdown ---
  const statusCounts: Record<string, number> = {};
  (allOrders || []).forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });
  const totalAllOrders = (allOrders || []).length;
  const statusBreakdown = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
    percent: totalAllOrders > 0 ? Math.round((count / totalAllOrders) * 100) : 0,
  }));

  // --- Coupon Stats ---
  const couponRevenue: Record<string, { discount: number; orders: number }> = {};
  (orders || []).forEach((order) => {
    if (order.coupon_code) {
      const code = order.coupon_code.toUpperCase();
      if (!couponRevenue[code]) couponRevenue[code] = { discount: 0, orders: 0 };
      couponRevenue[code].discount += parseFloat(order.discount) || 0;
      couponRevenue[code].orders += 1;
    }
  });

  const couponStats = (coupons || []).map((c) => ({
    id: c.id,
    code: c.code,
    type: c.type,
    value: c.value,
    active: c.active,
    used_count: c.used_count,
    max_uses: c.max_uses,
    expires_at: c.expires_at,
    period_orders: couponRevenue[c.code]?.orders || 0,
    period_discount: couponRevenue[c.code]?.discount || 0,
  }));

  return NextResponse.json({
    topProducts,
    dailyData,
    summary: {
      totalRevenue,
      totalOrders,
      aov,
      conversionRate,
    },
    aovTrend,
    statusBreakdown,
    couponStats,
  });
}
