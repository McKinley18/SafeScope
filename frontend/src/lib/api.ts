const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// 🔐 AUTH
export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error('Login failed');

  return res.json();
}

// 🧠 AI MATCHING
export async function matchStandards(data: {
  hazardType: string;
  description: string;
}) {
  const res = await fetch(`${API_URL}/standards/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('AI match failed');

  return res.json();
}

// 📋 TASKS
export async function fetchTasks() {
  const res = await fetch(`${API_URL}/tasks`);

  if (!res.ok) throw new Error('Failed to fetch tasks');

  return res.json();
}

export async function createTask(data: {
  hazardType: string;
  description: string;
}) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Failed to create task');

  return res.json();
}

// 🧪 FEEDBACK LOOP (SafeScope learning)
export async function sendFeedback(payload: {
  citation: string;
  action: 'accepted' | 'rejected';
}) {
  try {
    await fetch(`${API_URL}/safescope/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('Feedback error:', err);
  }
}
