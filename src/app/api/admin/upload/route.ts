import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  const formData = await req.formData();
  const file = formData.get('file') as File;
  const slug = formData.get('slug') as string || 'product';

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Validate file type and size
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP, AVIF, GIF' }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large. Maximum 10MB' }, { status: 400 });
  }
  // Sanitize slug to prevent path traversal
  const safeSlug = (slug || 'product').replace(/[^a-z0-9-]/gi, '').slice(0, 100);

  const ext = file.name.split('.').pop()?.replace(/[^a-z0-9]/gi, '') || 'jpg';
  const fileName = `${safeSlug}-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from('products')
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: urlData } = supabaseAdmin.storage
    .from('products')
    .getPublicUrl(fileName);

  return NextResponse.json({ url: urlData.publicUrl });
}
