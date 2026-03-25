import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  const now = new Date();

  // Date boundaries
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).toISOString();
  const lastWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 7).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();

  // Last 7 days boundaries for daily chart
  const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6).toISOString();

  const [
    allOrders,
    products,
    pages,
    categories,
    abandonedCarts,
  ] = await Promise.all([
    supabaseAdmin
      .from('orders')
      .select('id, order_number, customer_email, customer_name, status, payment_status, total, items, created_at', { count: 'exact' }),
    supabaseAdmin
      .from('products')
      .select('id, name, slug, status, stock_quantity, low_stock_threshold, in_stock', { count: 'exact' }),
    supabaseAdmin
      .from('pages')
      .select('status, page_type', { count: 'exact' }),
    supabaseAdmin
      .from('categories')
      .select('*', { count: 'exact' }),
    supabaseAdmin
      .from('abandoned_carts')
      .select('id', { count: 'exact' })
      .eq('recovered', false),
  ]);

  const orders = allOrders.data || [];
  const productList = products.data || [];

  // --- Revenue calculations ---
  const paidOrders = orders.filter(o => o.payment_status === 'paid');

  const revenueInRange = (start: string, end: string) =>
    paidOrders
      .filter(o => o.created_at >= start && o.created_at < end)
      .reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);

  const allTimeRevenue = paidOrders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
  const todayRevenue = revenueInRange(todayStart, new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString());
  const yesterdayRevenue = revenueInRange(yesterdayStart, todayStart);
  const weekRevenue = revenueInRange(weekStart, now.toISOString());
  const lastWeekRevenue = revenueInRange(lastWeekStart, weekStart);
  const monthRevenue = revenueInRange(monthStart, now.toISOString());
  const lastMonthRevenue = revenueInRange(lastMonthStart, monthStart);

  // --- Order status counts ---
  const countByStatus = (status: string) => orders.filter(o => o.status === status).length;
  const pendingOrders = countByStatus('pending');
  const processingOrders = countByStatus('processing');
  const shippedOrders = countByStatus('shipped');
  const completedOrders = countByStatus('completed');
  const cancelledOrders = countByStatus('cancelled');

  // --- Failed payments ---
  const failedPayments = orders.filter(o => o.payment_status === 'unpaid' && o.status !== 'cancelled').length;

  // --- Products (use SQL counts to avoid Supabase row limit) ---
  const [publishedCount, draftCount] = await Promise.all([
    supabaseAdmin.from('products').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabaseAdmin.from('products').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
  ]);
  const publishedProducts = publishedCount.count || 0;
  const draftProducts = draftCount.count || 0;
  const outOfStock = productList.filter(p => !p.in_stock || (p.stock_quantity !== null && p.stock_quantity <= 0)).length;

  // --- Low stock products ---
  const lowStockProducts = productList
    .filter(p => p.stock_quantity !== null && p.low_stock_threshold !== null && p.stock_quantity <= p.low_stock_threshold && p.stock_quantity > 0 && p.status === 'published')
    .sort((a, b) => (a.stock_quantity || 0) - (b.stock_quantity || 0))
    .slice(0, 10)
    .map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      stock_quantity: p.stock_quantity,
      low_stock_threshold: p.low_stock_threshold,
    }));

  // --- Recent orders ---
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
    .map(o => ({
      id: o.id,
      order_number: o.order_number,
      customer_name: o.customer_name,
      customer_email: o.customer_email,
      total: parseFloat(o.total) || 0,
      status: o.status,
      payment_status: o.payment_status,
      item_count: Array.isArray(o.items) ? o.items.length : 0,
      created_at: o.created_at,
    }));

  // --- Daily revenue (last 7 days) ---
  const dailyRevenue: { date: string; revenue: number; orders: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const dayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dayStart = dayDate.toISOString();
    const dayEnd = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate() + 1).toISOString();
    const dayOrders = paidOrders.filter(o => o.created_at >= dayStart && o.created_at < dayEnd);
    const dayRevenue = dayOrders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
    dailyRevenue.push({
      date: dayDate.toISOString().slice(0, 10),
      revenue: dayRevenue,
      orders: dayOrders.length,
    });
  }

  // --- Pages / Blog ---
  const pageList = pages.data || [];
  const totalPages = pageList.filter(p => p.page_type === 'page').length;
  const totalBlogPosts = pageList.filter(p => p.page_type === 'blog').length;

  return NextResponse.json({
    // Revenue
    today_revenue: todayRevenue,
    yesterday_revenue: yesterdayRevenue,
    week_revenue: weekRevenue,
    last_week_revenue: lastWeekRevenue,
    month_revenue: monthRevenue,
    last_month_revenue: lastMonthRevenue,
    all_time_revenue: allTimeRevenue,

    // Order counts by status
    total_orders: orders.length,
    pending_orders: pendingOrders,
    processing_orders: processingOrders,
    shipped_orders: shippedOrders,
    completed_orders: completedOrders,
    cancelled_orders: cancelledOrders,
    failed_payments: failedPayments,

    // Products
    products: {
      published: publishedProducts,
      draft: draftProducts,
      total: products.count || 0,
      out_of_stock: outOfStock,
    },
    low_stock_products: lowStockProducts,
    low_stock_count: lowStockProducts.length,

    // Abandoned carts
    abandoned_carts_count: abandonedCarts.count || 0,

    // Recent orders
    recent_orders: recentOrders,

    // Daily revenue chart data
    daily_revenue: dailyRevenue,

    // Pages / Blog (kept for backward compat)
    pages: { total: totalPages },
    blog: { total: totalBlogPosts },
    categories: { total: categories.count || 0 },

    // Legacy compat
    orders: { total: orders.length, pending: pendingOrders, revenue: allTimeRevenue },
  });
}
