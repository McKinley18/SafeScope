export default function NewReportPage() {
  return (
    <div>
      <h1>New Report</h1>
      <form style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
        <input placeholder="Site ID" style={inputStyle} />
        <input placeholder="Source Type" defaultValue="manual_entry" style={inputStyle} />
        <input placeholder="Event Type" style={inputStyle} />
        <input placeholder="Title" style={inputStyle} />
        <textarea placeholder="Describe what happened" style={{ ...inputStyle, minHeight: 160 }} />
        <button type="button" style={buttonStyle}>Submit Report</button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: '#111827',
  border: '1px solid #374151',
  borderRadius: 10,
  padding: 12,
  color: '#e5e7eb',
};

const buttonStyle: React.CSSProperties = {
  background: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: 10,
  padding: '12px 16px',
  width: 180,
  cursor: 'pointer',
};
