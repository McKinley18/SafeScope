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
