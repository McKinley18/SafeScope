const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchReports() {
  try {
    const token = localStorage.getItem('token');

    const res = await fetch(`${API_URL}/reports`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error('API error:', res.status);
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error('Fetch failed:', err);
    return [];
  }
}
