import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';

async function hasPasswordColumn(): Promise<boolean> {
  const { error } = await supabaseAdmin.from('customers').select('password_hash').limit(0);
  return !error;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, email, password, name, phone } = body;

  if (!email || !password || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email and password required' }, { status: 400 });
  }

  const hasPwCol = await hasPasswordColumn();

  if (action === 'register') {
    const { data: existing } = await supabaseAdmin
      .from('customers')
      .select('email')
      .eq('email', email)
      .single();

    if (existing && hasPwCol) {
      // Check if they already have a password
      const { data: existingPw } = await supabaseAdmin
        .from('customers')
        .select('password_hash')
        .eq('email', email)
        .single();
      if (existingPw?.password_hash) {
        return NextResponse.json({ error: 'An account with this email already exists. Please sign in.' }, { status: 409 });
      }
    }

    const hash = await bcrypt.hash(password, 10);

    const upsertData: Record<string, unknown> = {
      email,
      name: name || email.split('@')[0],
      phone: phone || '',
      updated_at: new Date().toISOString(),
    };
    if (hasPwCol) upsertData.password_hash = hash;

    const { error } = await supabaseAdmin
      .from('customers')
      .upsert(upsertData, { onConflict: 'email' });

    if (error) {
      return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, user: { email, name: name || email.split('@')[0], phone: phone || '' } });
  }

  if (action === 'login') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let customer: any = null;
    let fetchError = false;

    if (hasPwCol) {
      const { data, error: e } = await supabaseAdmin
        .from('customers')
        .select('email, name, phone, shipping_address, password_hash')
        .eq('email', email)
        .single();
      customer = data;
      fetchError = !!e;
    } else {
      const { data, error: e } = await supabaseAdmin
        .from('customers')
        .select('email, name, phone, shipping_address')
        .eq('email', email)
        .single();
      customer = data;
      fetchError = !!e;
    }

    // If no customer found, create a new account (auto-register on login)
    if (fetchError || !customer) {
      const hash = await bcrypt.hash(password, 10);
      const insertData: Record<string, unknown> = {
        email,
        name: name || email.split('@')[0],
        phone: phone || '',
        updated_at: new Date().toISOString(),
      };
      if (hasPwCol) insertData.password_hash = hash;

      await supabaseAdmin.from('customers').insert(insertData);

      return NextResponse.json({
        success: true,
        user: {
          email,
          name: name || email.split('@')[0],
          phone: phone || '',
          street: '', city: '', state: '', zip: '',
        },
      });
    }

    const passwordHash = hasPwCol ? (customer.password_hash as string) : null;

    // If no password set yet (legacy account), set it now
    if (!passwordHash) {
      if (hasPwCol) {
        const hash = await bcrypt.hash(password, 10);
        await supabaseAdmin
          .from('customers')
          .update({ password_hash: hash, updated_at: new Date().toISOString() })
          .eq('email', email);
      }

      const addr = (customer.shipping_address || {}) as Record<string, string>;
      return NextResponse.json({
        success: true,
        firstLogin: true,
        user: {
          email: customer.email,
          name: customer.name || '',
          phone: customer.phone || '',
          street: addr.street || '',
          city: addr.city || '',
          state: addr.state || '',
          zip: addr.zip || '',
        },
      });
    }

    const valid = await bcrypt.compare(password, passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
    }

    const addr = (customer.shipping_address || {}) as Record<string, string>;
    return NextResponse.json({
      success: true,
      user: {
        email: customer.email,
        name: customer.name || '',
        phone: customer.phone || '',
        street: addr.street || '',
        city: addr.city || '',
        state: addr.state || '',
        zip: addr.zip || '',
      },
    });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
