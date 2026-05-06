export function setAuth(data: any) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
}

export function getUser() {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}

export function updateUser(user: any) {
  localStorage.setItem('user', JSON.stringify(user));
}

export function logout() {
  localStorage.clear();
}
