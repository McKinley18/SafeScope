// Web-safe API client (Next.js compatible)

const AUTH_TOKEN_KEY = 'sentinel_safety_auth_token_v1';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://safescope-backend.onrender.com';

// 🔐 TOKEN STORAGE (replaces AsyncStorage)
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

// 🌐 API REQUEST WRAPPER
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}
