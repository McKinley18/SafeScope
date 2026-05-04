export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard Overview</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          ['Incidents', '24'],
          ['Near Misses', '13'],
          ['Open Actions', '19'],
          ['Critical Reviews', '2'],
        ].map(([label, value]) => (
          <div key={label} style={{ padding: 16, border: '1px solid #1f2937', borderRadius: 12 }}>
            <div style={{ fontSize: 14, color: '#94a3b8' }}>{label}</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
