import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/admin-auth';
import { categories as codeCats } from '@/lib/categories';
import { getAllProducts } from '@/lib/products/product-engine';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  // Get DB categories
  const { data: dbCats } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('name');

  // Get product counts
  const allProducts = getAllProducts();

  // Merge code categories with DB categories
  const dbSlugs = new Set((dbCats || []).map((c: { slug: string }) => c.slug));

  const codeCategories = codeCats.map((c, i) => {
    const productCount = allProducts.filter(p =>
      (p.categories || []).some((pc: string) => pc.toLowerCase().includes(c.name.toLowerCase()))
    ).length;

    return {
      id: -(i + 1), // negative IDs for code-defined categories
      name: c.name,
      slug: c.slug,
      parent_slug: c.parent || null,
      description: '',
      meta_title: '',
      meta_description: '',
      product_count: productCount,
      source: 'code',
    };
  }).filter(c => !dbSlugs.has(c.slug));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbCategories = (dbCats || []).map((c: any) => ({
    ...c,
    source: 'database',
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const all = [...dbCategories, ...codeCategories].sort((a: any, b: any) =>
    String(a.name).localeCompare(String(b.name))
  );

  return NextResponse.json({ categories: all });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const body = await req.json();

  const { data, error } = await supabaseAdmin
    .from('categories')
    .insert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const body = await req.json();
  const { id, ...updates } = body;

  const { data, error } = await supabaseAdmin
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const { id } = await req.json();

  const { error } = await supabaseAdmin
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
