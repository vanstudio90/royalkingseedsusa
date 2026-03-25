import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');

  if (key) {
    const { data, error } = await supabaseAdmin
      .from('settings')
      .select('*')
      .eq('key', key)
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json(data);
  }

  const { data, error } = await supabaseAdmin
    .from('settings')
    .select('*');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: data });
}

export async function PUT(req: NextRequest) {
  const { key, value } = await req.json();

  const { data, error } = await supabaseAdmin
    .from('settings')
    .upsert({ key, value }, { onConflict: 'key' })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
