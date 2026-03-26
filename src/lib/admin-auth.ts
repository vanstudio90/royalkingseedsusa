import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Verify the admin JWT token from the Authorization header.
 * Returns the authenticated user or an error response.
 */
export async function requireAdmin(req: NextRequest): Promise<
  | { user: { id: string; email: string }; error?: never }
  | { user?: never; error: NextResponse }
> {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return {
      error: NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      ),
    };
  }

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return {
        error: NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        ),
      };
    }

    return { user: { id: data.user.id, email: data.user.email || '' } };
  } catch {
    return {
      error: NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      ),
    };
  }
}
