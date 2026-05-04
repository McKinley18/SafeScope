export default function ActionsPage() {
  return (
    <div>
      <h1>Corrective Actions</h1>
      <div style={{ display: 'grid', gap: 12 }}>
        <div style={card}>
          <strong>Install additional berm markers</strong>
          <div>Priority: High</div>
          <div>Status: Open</div>
        </div>
      </div>
    </div>
  );
}

const card: React.CSSProperties = {
  border: '1px solid #1f2937',
  borderRadius: 12,
  padding: 16,
};
