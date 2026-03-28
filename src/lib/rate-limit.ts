import { NextRequest } from 'next/server';

const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, opts: { maxRequests: number; windowMs: number }) {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { success: true };
  }
  entry.count++;
  if (entry.count > opts.maxRequests) return { success: false };
  return { success: true };
}

export function getClientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown';
}
