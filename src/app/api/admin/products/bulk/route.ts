import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const { ids, action } = await req.json();

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'No product IDs provided' }, { status: 400 });
  }

  if (action === 'publish') {
    const { error } = await supabaseAdmin
      .from('products')
      .update({ status: 'published' })
      .in('id', ids);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else if (action === 'draft') {
    const { error } = await supabaseAdmin
      .from('products')
      .update({ status: 'draft' })
      .in('id', ids);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else if (action === 'delete') {
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .in('id', ids);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  return NextResponse.json({ success: true, affected: ids.length });
}
