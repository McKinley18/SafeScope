import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../api/client';

export const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<any>(null);
  const [audit, setAudit] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      apiClient.getReportDetail(id).then((data) => {
        setReport(data);
        setLoading(false);
      });
      apiClient.getReportAudit(id).then(setAudit);
    }
  }, [id]);

  const handleExport = async () => {
    const data = await apiClient.exportReport(id!);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${id}.json`;
    a.click();
  };

  if (loading) return <div>Loading...</div>;
  if (!report) return <div>Report not found</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Report Details</h1>
        <button onClick={handleExport} className="px-4 py-2 bg-blue-600 text-white rounded">Export JSON</button>
      </div>

      <section className="bg-white p-6 rounded shadow">
        <p><strong>Narrative:</strong> {report.narrative}</p>
        <p><strong>Status:</strong> {report.reportStatus}</p>
      </section>

      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Audit Trail</h2>
        {audit.map((a: any) => (
          <div key={a.id} className="text-sm border-b pb-2">
            <span className="font-semibold">{a.actionCode}</span> by {a.actorUserId || 'System'} at {new Date(a.createdAt).toLocaleString()}
          </div>
        ))}
      </section>
    </div>
  );
};
