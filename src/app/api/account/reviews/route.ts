import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ reviews: [] }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('reviews')
    .select('id, product_slug, product_name, rating, title, content, status, created_at')
    .eq('customer_email', email)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ reviews: [] });
  return NextResponse.json({ reviews: data || [] });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { email, reviewId, rating, title, content } = body;

  if (!email || !reviewId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Verify the review belongs to this customer
  const { data: review } = await supabaseAdmin
    .from('reviews')
    .select('id, customer_email')
    .eq('id', reviewId)
    .eq('customer_email', email)
    .single();

  if (!review) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  }

  const updates: Record<string, unknown> = {};
  if (rating !== undefined) updates.rating = rating;
  if (title !== undefined) updates.title = title;
  if (content !== undefined) updates.content = content;
  // Edited reviews go back to pending for re-approval
  updates.status = 'pending';

  const { error } = await supabaseAdmin
    .from('reviews')
    .update(updates)
    .eq('id', reviewId)
    .eq('customer_email', email);

  if (error) {
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { email, reviewId } = await req.json();

  if (!email || !reviewId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Verify the review belongs to this customer
  const { data: review } = await supabaseAdmin
    .from('reviews')
    .select('id')
    .eq('id', reviewId)
    .eq('customer_email', email)
    .single();

  if (!review) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  }

  const { error } = await supabaseAdmin
    .from('reviews')
    .delete()
    .eq('id', reviewId)
    .eq('customer_email', email);

  if (error) {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
