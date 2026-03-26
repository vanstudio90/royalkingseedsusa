import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'products';

  let csv = '';

  if (type === 'products') {
    const { data } = await supabaseAdmin.from('products').select('*').order('name');
    if (!data) return NextResponse.json({ error: 'No data' }, { status: 500 });

    csv = 'ID,Name,Slug,Price,Sale Price,Status,Strain Type,THC,Stock,SKU,Categories\n';
    data.forEach(p => {
      csv += `${p.id},"${p.name}","${p.slug}",${p.price},${p.sale_price || ''},${p.status},${p.strain_type},"${p.thc_content}",${p.stock_quantity || ''},"${p.sku || ''}","${(p.categories || []).join('; ')}"\n`;
    });
  } else if (type === 'orders') {
    const { data } = await supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false });
    if (!data) return NextResponse.json({ error: 'No data' }, { status: 500 });

    csv = 'Order Number,Customer,Email,Total,Status,Payment,Date\n';
    data.forEach(o => {
      csv += `${o.order_number},"${o.customer_name}","${o.customer_email}",${o.total},${o.status},${o.payment_status},${o.created_at}\n`;
    });
  } else if (type === 'customers') {
    const { data } = await supabaseAdmin.from('customers').select('*').order('name');
    if (!data) return NextResponse.json({ error: 'No data' }, { status: 500 });

    csv = 'ID,Name,Email,Phone,Total Orders,Total Spent,Joined\n';
    data.forEach(c => {
      csv += `${c.id},"${c.name}","${c.email}","${c.phone || ''}",${c.total_orders},${c.total_spent},${c.created_at}\n`;
    });
  }

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${type}-export-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  // Import products from CSV
  const formData = await req.formData();
  const file = formData.get('file') as File;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const text = await file.text();
  const lines = text.split('\n').filter(l => l.trim());
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/[^a-z_]/g, ''));

  let imported = 0;
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    if (!values) continue;

    const row: Record<string, string> = {};
    headers.forEach((h, j) => {
      row[h] = (values[j] || '').replace(/^"|"$/g, '');
    });

    if (row.name && row.slug) {
      await supabaseAdmin.from('products').upsert({
        name: row.name,
        slug: row.slug,
        price: parseFloat(row.price) || 0,
        status: row.status || 'draft',
        strain_type: row.strain_type || 'hybrid',
      }, { onConflict: 'slug' });
      imported++;
    }
  }

  return NextResponse.json({ imported });
}
