export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div>
      <h1>Report Detail</h1>
      <p>Report ID: {id}</p>
      <section style={card}>
        <h3>Classification Evidence</h3>
        <ul>
          <li>Suggested hazard: mobile_equipment → reversing_incident</li>
          <li>Confidence: 0.88</li>
          <li>Matched rules: mobile_equipment_vehicle_pattern</li>
          <li>Review status: pending</li>
        </ul>
      </section>
    </div>
  );
}

const card: React.CSSProperties = {
  border: '1px solid #1f2937',
  borderRadius: 12,
  padding: 16,
  marginTop: 12,
};
