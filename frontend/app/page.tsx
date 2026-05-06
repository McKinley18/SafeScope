export default function Home() {
  return (
    <main style={styles.container}>
      <h1>Dashboard</h1>

      <div style={styles.grid}>
        <Card title="Open Cases" value="12" />
        <Card title="Critical Risks" value="3" color="#dc3545" />
        <Card title="Moderate Risks" value="7" color="#ffc107" />
        <Card title="Closed Cases" value="28" color="#28a745" />
      </div>

      <div style={{ marginTop: 30 }}>
        <a href="/inspection" style={styles.button}>
          Start Inspection
        </a>
      </div>
    </main>
  );
}

function Card({ title, value, color = '#0d6efd' }: any) {
  return (
    <div style={{ ...styles.card, borderTop: `4px solid ${color}` }}>
      <div>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

const styles: any = {
  container: {
    padding: 24,
    maxWidth: 1000,
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
  },
  card: {
    padding: 16,
    border: '1px solid #ddd',
    borderRadius: 8,
    background: '#fff',
  },
  button: {
    padding: '12px 18px',
    background: '#0d6efd',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: 6,
  },
};
