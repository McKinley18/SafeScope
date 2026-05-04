const items = [
  { id: '1', title: 'Haul truck visibility event', confidence: '0.88', severity: '4', reason: 'High-risk category' },
  { id: '2', title: 'Electrical cable exposure', confidence: '0.61', severity: '5', reason: 'Critical severity' },
];

export default function ReviewQueuePage() {
  return (
    <div>
      <h1>Review Queue</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Title', 'Confidence', 'Severity', 'Reason'].map((header) => (
              <th key={header} style={thtd}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td style={thtd}>{item.title}</td>
              <td style={thtd}>{item.confidence}</td>
              <td style={thtd}>{item.severity}</td>
              <td style={thtd}>{item.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thtd: React.CSSProperties = {
  borderBottom: '1px solid #1f2937',
  padding: 12,
  textAlign: 'left',
};
