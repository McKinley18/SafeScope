import React from 'react';
import { apiClient } from '../../../api/client';

export const VersionHistory = ({ ruleId, versions, onRollback }: { ruleId: string, versions: any[], onRollback: () => void }) => {
  const handleRollback = async (versionId: string) => {
    if (confirm('Are you sure you want to rollback to this version?')) {
      await apiClient.rollbackRule(ruleId, versionId);
      onRollback();
    }
  };

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="font-bold mb-2">Rule Version History</h3>
      <table className="w-full text-sm">
        <thead><tr className="text-left"><th>Version</th><th>Status</th><th>Updated</th><th>Action</th></tr></thead>
        <tbody>
          {versions.map(v => (
            <tr key={v.id}>
              <td>v{v.version}</td>
              <td>{v.status}</td>
              <td>{new Date(v.createdAt).toLocaleString()}</td>
              <td><button onClick={() => handleRollback(v.id)} className="text-blue-500">Rollback</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
