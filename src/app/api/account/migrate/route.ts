import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

// One-time migration to add password_hash column
export async function POST() {
  // Try inserting a test value to see if column exists
  const { error } = await supabaseAdmin.rpc('exec_sql', {
    sql: "ALTER TABLE customers ADD COLUMN IF NOT EXISTS password_hash TEXT DEFAULT ''",
  });

  if (error) {
    // RPC doesn't exist, try a workaround: update a row with the new field
    // This won't work for adding columns, so we need another approach
    return NextResponse.json({ error: error.message, hint: 'Run this SQL in Supabase dashboard: ALTER TABLE customers ADD COLUMN IF NOT EXISTS password_hash TEXT DEFAULT \'\'' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
