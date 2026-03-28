import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth.error) return auth.error;

  // Revalidate all pages (server-side cache only — cart/favorites are client localStorage)
  revalidatePath('/', 'layout');

  return NextResponse.json({ success: true, message: 'Site cache cleared. Cart and favorites are unaffected.' });
}
