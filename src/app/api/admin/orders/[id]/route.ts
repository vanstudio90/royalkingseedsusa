import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  // If status is being changed, add to status_history
  if (body.status) {
    // Get current order to check if status actually changed
    const { data: current } = await supabaseAdmin
      .from('orders')
      .select('status, status_history')
      .eq('id', id)
      .single();

    if (current && current.status !== body.status) {
      const history = Array.isArray(current.status_history) ? current.status_history : [];
      history.push({
        from: current.status,
        to: body.status,
        timestamp: new Date().toISOString(),
      });
      body.status_history = history;
    }
  }

  const { data, error } = await supabaseAdmin
    .from('orders')
    .update(body)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
