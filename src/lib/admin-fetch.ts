/**
 * Authenticated fetch wrapper for admin API calls.
 * Automatically includes the admin JWT token from localStorage.
 * Auto-redirects to login if token is expired (401).
 */
export async function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  let token: string | null = null;
  try {
    token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  } catch {
    // localStorage unavailable (private browsing, etc.)
  }

  // Don't set Content-Type for FormData — browser sets it with boundary automatically
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  // Auto-logout on expired/invalid token
  if (res.status === 401 && typeof window !== 'undefined') {
    try {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    } catch {}
    window.location.href = '/futu';
  }

  return res;
}
