import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const entityType = searchParams.get('entity_type');

  let query = supabaseAdmin
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (entityType && entityType !== 'all') {
    query = query.eq('entity_type', entityType);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ activities: data });
}

// Helper to log an activity (called from other routes)
export async function POST(req: NextRequest) {
  const body = await req.json();

  const { error } = await supabaseAdmin
    .from('activity_log')
    .insert(body);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
