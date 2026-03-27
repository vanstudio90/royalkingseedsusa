import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, currentPassword, newPassword } = body;

  if (!email || !currentPassword || !newPassword) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  if (newPassword.length < 6) {
    return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
  }

  // Check if password_hash column exists
  const { error: colErr } = await supabaseAdmin.from('customers').select('password_hash').limit(0);
  if (colErr) {
    return NextResponse.json({ error: 'Password feature is being set up. Please try again later.' }, { status: 503 });
  }

  const { data: customer, error } = await supabaseAdmin
    .from('customers')
    .select('password_hash')
    .eq('email', email)
    .single();

  if (error || !customer) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  // If no password set yet, set it now
  if (!customer.password_hash) {
    const hash = await bcrypt.hash(newPassword, 10);
    await supabaseAdmin
      .from('customers')
      .update({ password_hash: hash, updated_at: new Date().toISOString() })
      .eq('email', email);
    return NextResponse.json({ success: true });
  }

  const valid = await bcrypt.compare(currentPassword, customer.password_hash);
  if (!valid) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
  }

  const hash = await bcrypt.hash(newPassword, 10);
  const { error: updateError } = await supabaseAdmin
    .from('customers')
    .update({ password_hash: hash, updated_at: new Date().toISOString() })
    .eq('email', email);

  if (updateError) {
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
