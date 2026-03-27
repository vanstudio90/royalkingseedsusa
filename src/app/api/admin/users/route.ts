import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const tab = searchParams.get('tab') || 'ordered';
  const search = searchParams.get('search') || '';

  // Get all customers
  const { data: customers, error } = await supabaseAdmin
    .from('customers')
    .select('id, email, name, phone, shipping_address, total_orders, total_spent, created_at')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const all = customers || [];

  let filtered = tab === 'ordered'
    ? all.filter(c => (c.total_orders || 0) > 0)
    : all.filter(c => (c.total_orders || 0) === 0);

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(c =>
      (c.name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q)
    );
  }

  const users = filtered.map(c => {
    const addr = c.shipping_address || {};
    const addressParts = [addr.street, addr.city, addr.state, addr.zip].filter(Boolean);
    return {
      id: c.id,
      name: c.name || '',
      email: c.email || '',
      phone: c.phone || '',
      address: addressParts.join(', ') || '—',
      orders: c.total_orders || 0,
      totalSpent: c.total_spent || 0,
      createdAt: c.created_at,
    };
  });

  return NextResponse.json({
    users,
    stats: {
      totalOrdered: all.filter(c => (c.total_orders || 0) > 0).length,
      totalNoOrder: all.filter(c => (c.total_orders || 0) === 0).length,
      totalAll: all.length,
    },
  });
}
