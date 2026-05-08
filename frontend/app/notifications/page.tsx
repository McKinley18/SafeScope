'use client';

import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function Notifications() {
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/reports`)
      .then(res => res.json())
      .then((reports) => {
        const allAlerts = reports.flatMap(
          (r: any) => r.predictive?.alerts || []
        );
        setAlerts(allAlerts);
      });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Alerts & Notifications</h1>

      {alerts.map((a, i) => (
        <div key={i} style={{
          background: '#fee2e2',
          padding: 12,
          borderRadius: 8,
          marginBottom: 10,
        }}>
          {a.message}
        </div>
      ))}
    </div>
  );
}
