import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ items: [] }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('wishlists')
    .select('product_slug, product_name')
    .eq('customer_email', email);

  if (error) {
    return NextResponse.json({ items: [] });
  }

  return NextResponse.json({ items: data || [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, action, product } = body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  if (action === 'add' && product) {
    const { error } = await supabaseAdmin
      .from('wishlists')
      .upsert(
        {
          session_id: email,
          customer_email: email,
          product_slug: product.slug,
          product_name: product.name,
        },
        { onConflict: 'session_id,product_id', ignoreDuplicates: true }
      );

    if (error) {
      // Try insert without product_id FK constraint
      await supabaseAdmin
        .from('wishlists')
        .insert({
          session_id: email,
          customer_email: email,
          product_slug: product.slug,
          product_name: product.name,
        });
    }

    return NextResponse.json({ success: true });
  }

  if (action === 'remove' && product) {
    await supabaseAdmin
      .from('wishlists')
      .delete()
      .eq('customer_email', email)
      .eq('product_slug', product.slug);

    return NextResponse.json({ success: true });
  }

  if (action === 'sync' && body.items) {
    // Full sync — delete all and re-insert
    await supabaseAdmin
      .from('wishlists')
      .delete()
      .eq('customer_email', email);

    if (body.items.length > 0) {
      const rows = body.items.map((item: { slug: string; name: string }) => ({
        session_id: email,
        customer_email: email,
        product_slug: item.slug,
        product_name: item.name,
      }));

      await supabaseAdmin.from('wishlists').insert(rows);
    }

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
