import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/admin-auth';

// GET all products (admin - includes drafts)
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const flowering = searchParams.get('flowering');
  const strainType = searchParams.get('strain_type');
  const sortBy = searchParams.get('sort') || 'created_at';
  const sortDir = searchParams.get('dir') === 'asc' ? true : false;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = (page - 1) * limit;

  const validSorts = ['created_at', 'name', 'price', 'strain_type', 'status'];
  const orderCol = validSorts.includes(sortBy) ? sortBy : 'created_at';

  let query = supabaseAdmin
    .from('products')
    .select('*', { count: 'exact' })
    .order(orderCol, { ascending: sortDir })
    .range(offset, offset + limit - 1);

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  if (flowering === 'auto') {
    query = query.eq('autoflower', true);
  } else if (flowering === 'feminized') {
    query = query.eq('autoflower', false);
  }

  if (strainType && strainType !== 'all') {
    query = query.eq('strain_type', strainType);
  }

  if (search) {
    const safeSearch = search.replace(/[%_\\()]/g, '').slice(0, 100);
    if (safeSearch) {
      query = query.ilike('name', `%${safeSearch}%`);
    }
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data, total: count });
}

// POST create product
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from('products')
    .insert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
