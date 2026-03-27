import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('customers')
    .select('name, phone, shipping_address')
    .eq('email', email)
    .single();

  if (error || !data) {
    return NextResponse.json({ name: '', phone: '', shipping_address: null });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, name, phone, shipping_address } = body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('customers')
    .upsert(
      {
        email,
        name: name || '',
        phone: phone || '',
        shipping_address: shipping_address || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'email' }
    );

  if (error) {
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
