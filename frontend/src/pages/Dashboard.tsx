import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';

export const Dashboard = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    apiClient.getDashboard().then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <a href="/reports" className="p-4 bg-white shadow rounded hover:bg-gray-50">Reports: {data.totalReports}</a>
        <a href="/reports?status=open" className="p-4 bg-white shadow rounded hover:bg-gray-50">Open: {data.openReports}</a>
        <a href="/review-queue" className="p-4 bg-white shadow rounded hover:bg-gray-50">Pending: {data.reviewQueueCount}</a>
        <a href="/actions?statusCode=open" className="p-4 bg-white shadow rounded hover:bg-gray-50">Open Actions: {data.overdueActionsCount}</a>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-2 gap-6">
        <section className="p-6 bg-white shadow rounded">
            <h2 className="font-bold mb-4">Review SLA (Avg Hrs)</h2>
            <div className="text-3xl font-bold text-blue-600">{data.analytics.avgReviewTime.toFixed(1)}</div>
        </section>

        <section className="p-6 bg-white shadow rounded">
            <h2 className="font-bold mb-4">Pending Review Aging</h2>
            <div className="flex gap-2">
                {data.analytics.aging.reviewAging.map((b: any) => (
                    <div key={b.bucket} className="text-center p-2 border rounded">
                        <div className="font-bold">{b.count}</div>
                        <div className="text-xs">{b.bucket}</div>
                    </div>
                ))}
            </div>
        </section>
      </div>
      {/* Management Report */}
      <section className="p-6 bg-white shadow rounded mt-8">
        <h2 className="font-bold mb-4">Management Summary</h2>
        <div className="grid grid-cols-3 gap-4">
            <div>Avg Review Time: {data.analytics.avgReviewTime.toFixed(1)} hrs</div>
            <div>Avg Action Close Time: {data.analytics.avgCloseTime.toFixed(1)} days</div>
            <button onClick={() => window.open('https://safescope-backend.onrender.com/reports/export?format=csv', '_blank')} className="px-3 py-1 bg-blue-500 text-white rounded">Download CSV Report</button>
        </div>
      </section>
    </div>
  );
};
