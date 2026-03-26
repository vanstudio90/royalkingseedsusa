/**
 * Authenticated fetch wrapper for admin API calls.
 * Automatically includes the admin JWT token from localStorage.
 */
export function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}
