// USERS
export function getUsers(): any[] {
  if (typeof window === 'undefined') return [];

  try {
    return JSON.parse(localStorage.getItem('users') || '[]');
  } catch {
    return [];
  }
}

export function saveUsers(users: any[]) {
  if (typeof window === 'undefined') return;

  localStorage.setItem('users', JSON.stringify(users));
}

// TASKS
export function getTasks(): any[] {
  if (typeof window === 'undefined') return [];

  try {
    return JSON.parse(localStorage.getItem('tasks') || '[]');
  } catch {
    return [];
  }
}

export function saveTasks(tasks: any[]) {
  if (typeof window === 'undefined') return;

  localStorage.setItem('tasks', JSON.stringify(tasks));
}
