export function getUsers() {
  if (typeof window === 'undefined') return [];

  return JSON.parse(localStorage.getItem('users') || '[]');
}

export function saveUsers(users: any[]) {
  if (typeof window === 'undefined') return;

  localStorage.setItem('users', JSON.stringify(users));
}

