import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const url = req.nextUrl;
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');

  let query = supabaseAdmin
    .from('abandoned_carts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (from) {
    query = query.gte('created_at', new Date(from).toISOString());
  }
  if (to) {
    const toDate = new Date(to);
    toDate.setDate(toDate.getDate() + 1);
    query = query.lt('created_at', toDate.toISOString());
  }

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ carts: data });
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const { id, ...updates } = await req.json();

  const { data, error } = await supabaseAdmin
    .from('abandoned_carts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
