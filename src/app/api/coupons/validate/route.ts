import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

// Public endpoint — validates a coupon code without requiring admin auth
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')?.trim().toUpperCase();
  if (!code || code.length > 50) {
    return NextResponse.json({ valid: false, error: 'Invalid code' }, { status: 400 });
  }

  const { data: coupon, error } = await supabaseAdmin
    .from('coupons')
    .select('id, code, type, value, min_order, max_uses, used_count, expires_at, active')
    .eq('code', code)
    .eq('active', true)
    .single();

  if (error || !coupon) {
    return NextResponse.json({ valid: false, error: 'Invalid or expired coupon code' });
  }

  // Check expiry
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return NextResponse.json({ valid: false, error: 'This coupon has expired' });
  }

  // Check usage limit
  if (coupon.max_uses && (coupon.used_count || 0) >= coupon.max_uses) {
    return NextResponse.json({ valid: false, error: 'This coupon has reached its usage limit' });
  }

  return NextResponse.json({
    valid: true,
    type: coupon.type,
    value: coupon.value,
    min_order: coupon.min_order || 0,
  });
}
