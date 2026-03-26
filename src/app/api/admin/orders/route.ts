import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = (page - 1) * limit;
  const search = searchParams.get('search');
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  const exportAll = searchParams.get('export') === 'csv';

  // Build base query
  let query = supabaseAdmin
    .from('orders')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (status === 'trashed') {
    query = query.eq('status', 'trashed');
  } else if (status && status !== 'all') {
    query = query.eq('status', status);
  } else {
    // "all" excludes trashed orders
    query = query.neq('status', 'trashed');
  }

  if (search) {
    query = query.or(`order_number.ilike.%${search}%,customer_name.ilike.%${search}%`);
  }

  if (dateFrom) {
    query = query.gte('created_at', `${dateFrom}T00:00:00`);
  }

  if (dateTo) {
    query = query.lte('created_at', `${dateTo}T23:59:59`);
  }

  // For export, get all rows; otherwise paginate
  if (!exportAll) {
    query = query.range(offset, offset + limit - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Also fetch status counts for tabs
  const countsQuery = await supabaseAdmin
    .from('orders')
    .select('status', { count: 'exact', head: false });

  const statusCounts: Record<string, number> = { all: 0 };
  if (countsQuery.data) {
    statusCounts.all = countsQuery.data.length;
    for (const row of countsQuery.data) {
      const s = (row as { status: string }).status;
      statusCounts[s] = (statusCounts[s] || 0) + 1;
    }
  }

  return NextResponse.json({ orders: data, total: count, statusCounts });
}
