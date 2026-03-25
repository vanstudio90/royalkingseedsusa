import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'all';
  const status = searchParams.get('status') || 'all';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from('pages')
    .select('*', { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (type !== 'all') {
    query = query.eq('page_type', type);
  }

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch counts using exact count queries (no row limit)
  const buildCountQuery = (statusVal?: string) => {
    let q = supabaseAdmin.from('pages').select('*', { count: 'exact', head: true });
    if (type !== 'all') q = q.eq('page_type', type);
    if (statusVal) q = q.eq('status', statusVal);
    return q;
  };

  const [allQ, pubQ, draftQ] = await Promise.all([
    buildCountQuery(),
    buildCountQuery('published'),
    buildCountQuery('draft'),
  ]);

  const counts = {
    all: allQ.count || 0,
    published: pubQ.count || 0,
    draft: draftQ.count || 0,
  };

  return NextResponse.json({ pages: data, total: count, counts });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from('pages')
    .insert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
