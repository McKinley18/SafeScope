// lib/auth.ts

type User = {
  id?: string;
  email: string;
  hasAcceptedAgreement?: boolean;
};

// =========================
// TOKEN
// =========================
export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// =========================
// USER
// =========================
export function getUser(): User | null {
  if (typeof window === 'undefined') return null;

  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function updateUser(user: User) {
  localStorage.setItem('user', JSON.stringify(user));
}

export function isAuthenticated() {
  return !!getToken();
}
