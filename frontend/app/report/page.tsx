'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReportPage() {
  const [hazards, setHazards] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('hazards');
    if (saved) setHazards(JSON.parse(saved));
  }, []);

  async function finalizeReport() {
    await fetch('http://localhost:3000/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hazards }),
    });

    alert('Report finalized');
    localStorage.removeItem('hazards');
    router.push('/command-center');
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Report Review</h1>

      {hazards.length === 0 && <p>No hazards found.</p>}

      {hazards.map((h, i) => (
        <div key={i} style={card}>
          <strong>{h.hazardType}</strong>
          <p>{h.description}</p>
          <p><strong>Risk:</strong> {h.riskScore}</p>
          <p><strong>Environment:</strong> {h.environment}</p>
          <p><strong>Equipment:</strong> {h.equipment}</p>
          <p><strong>PPE:</strong> {h.ppe}</p>

          {h.matches?.map((m: any, idx: number) => (
            <div key={idx}>
              {m.standard.citation} — {m.standard.title}
            </div>
          ))}
        </div>
      ))}

      {hazards.length > 0 && (
        <button style={btn} onClick={finalizeReport}>
          Finalize Report
        </button>
      )}
    </div>
  );
}

const card = {
  border: '1px solid #ddd',
  padding: 12,
  marginBottom: 10,
  borderRadius: 8,
};

const btn = {
  padding: 14,
  background: '#ff7a00',
  color: '#fff',
  borderRadius: 8,
  width: '100%',
};
