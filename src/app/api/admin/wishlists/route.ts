import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('wishlists')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Stats
  const uniqueSessions = new Set((data || []).map(w => w.session_id)).size;
  const productCounts: Record<string, { name: string; count: number }> = {};
  (data || []).forEach(w => {
    if (!productCounts[w.product_slug]) productCounts[w.product_slug] = { name: w.product_name, count: 0 };
    productCounts[w.product_slug].count++;
  });
  const topProduct = Object.values(productCounts).sort((a, b) => b.count - a.count)[0] || null;

  return NextResponse.json({ wishlists: data, total: data?.length || 0, uniqueSessions, topProduct });
}
