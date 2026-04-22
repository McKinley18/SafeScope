import React, { useEffect, useState } from 'react';
import { apiClient } from '../../api/client';
import { useNavigate } from 'react-router-dom';

export const SessionsList = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => { apiClient.getSessions().then(setSessions); }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Audit Sessions</h1>
        <button onClick={() => navigate('/audit/start')} className="px-4 py-2 bg-blue-600 text-white rounded">New Session</button>
      </div>
      <table className="w-full bg-white shadow rounded">
        <thead><tr className="text-left border-b"><th>Date</th><th>Site</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {sessions.map(s => (
            <tr key={s.id} className="border-b">
              <td>{new Date(s.createdAt).toLocaleDateString()}</td>
              <td>{s.siteId}</td>
              <td><span className={`px-2 rounded ${s.status === 'published' ? 'bg-green-100' : 'bg-yellow-100'}`}>{s.status}</span></td>
              <td>
                <button onClick={() => navigate(s.status === 'published' ? `/report/${s.id}` : `/audit/${s.id}/walkthrough`)} 
                        className="text-blue-600 font-medium">
                  {s.status === 'published' ? 'View Report' : 'Continue'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
