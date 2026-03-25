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

  // Fetch counts for the current type filter
  const countsBase = supabaseAdmin.from('pages').select('status, page_type');
  const { data: allRows } = type !== 'all'
    ? await countsBase.eq('page_type', type)
    : await countsBase;

  const counts = { all: 0, published: 0, draft: 0 };
  if (allRows) {
    counts.all = allRows.length;
    for (const row of allRows) {
      const s = (row as { status: string }).status;
      if (s === 'published') counts.published++;
      else if (s === 'draft') counts.draft++;
    }
  }

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
