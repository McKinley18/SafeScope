'use client';

import { useEffect, useState } from 'react';

export default function CommandCenter() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:4000/reports')
      .then(res => res.json())
      .then(setReports);
  }, []);

  return (
    <div style={container}>
      <h1 style={title}>Command Center</h1>

      {reports.length === 0 && (
        <div>No reports yet</div>
      )}

      {reports.map((r) => (
        <div
          key={r.id}
          style={card}
          onClick={() => {
            window.location.href = `/report/${r.id}`;
          }}
        >
          <div style={cardTitle}>{r.site}</div>
          <div style={sub}>{r.company}</div>

          <div style={meta}>
            {r.summary?.totalFindings} Findings •{' '}
            {r.summary?.criticalRisk} Critical
          </div>
        </div>
      ))}
    </div>
  );
}

/* STYLES */

const container = {
  padding: '30px',
  maxWidth: '900px',
  margin: 'auto'
};

const title = {
  fontSize: '26px',
  marginBottom: '20px'
};

const card = {
  background: 'white',
  padding: '20px',
  marginTop: '15px',
  borderRadius: '10px',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
};

const cardTitle = {
  fontWeight: 'bold'
};

const sub = {
  color: '#666'
};

const meta = {
  marginTop: '10px',
  fontSize: '12px',
  color: '#555'
};
