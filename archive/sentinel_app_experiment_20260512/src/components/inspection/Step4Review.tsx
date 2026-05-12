export default function Step4Review({ findings, back }: any) {
  return (
    <div style={{ background: '#fff', padding: 20 }}>
      <h2>Review</h2>

      {findings.map((f: any, i: number) => (
        <div key={i}>
          {f.hazard} - {f.severity}
        </div>
      ))}

      <button onClick={back}>Back</button>
      <button>Generate Report</button>
    </div>
  );
}
