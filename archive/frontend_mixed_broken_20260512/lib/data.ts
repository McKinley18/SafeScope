export function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}

export function saveUsers(users: any[]) {
  localStorage.setItem('users', JSON.stringify(users));
}

export function getTasks() {
  return JSON.parse(localStorage.getItem('tasks') || '[]');
}

export function saveTasks(tasks: any[]) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
