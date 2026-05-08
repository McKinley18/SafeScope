'use client';

import { useEffect, useState } from 'react';
import Card from '../components/Card';

export default function CommandCenter() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:4000/reports/intelligence')
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>Command Center</h1>

      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <Card>Reports: {data.totalReports}</Card>
        <Card>Findings: {data.totalFindings}</Card>
        <Card>Critical: {data.criticalRisk}</Card>
      </div>

      <Card>
        <h3>Top Hazards</h3>
        {data.topHazards.map((h: any, i: number) => (
          <div key={i}>{h.key} ({h.count})</div>
        ))}
      </Card>
    </div>
  );
}
