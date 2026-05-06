const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function sendFeedback(payload: {
  citation: string;
  action: 'accepted' | 'rejected';
}) {
  try {
    await fetch(`${API_BASE}/safescope/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('Feedback error:', err);
  }
}
