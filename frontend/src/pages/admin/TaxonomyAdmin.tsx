import React, { useEffect, useState } from 'react';
import { apiClient } from '../../api/client';
import { RuleForm } from '../../components/admin/RuleForm';
import { BulkImport } from '../../components/admin/BulkImport';

export const TaxonomyAdmin = () => {
  const [data, setData] = useState<any>({ categories: [], rules: [], severity: {} });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [creating, setCreating] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [categories, rules, severity] = await Promise.all([
      apiClient.getTaxonomyCategories(),
      apiClient.getTaxonomyRules(),
      apiClient.getTaxonomySeverity()
    ]);
    setData({ categories, rules, severity });
    setLoading(false);
    setEditing(null);
    setCreating(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleExport = async () => {
    const csv = await apiClient.exportRules();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    import { RuleForm } from '../../components/admin/RuleForm';
    import { BulkImport } from '../../components/admin/BulkImport';
    import { VersionHistory } from '../../components/admin/versioning/VersionHistory';

    export const TaxonomyAdmin = () => {
      const [selectedRule, setSelectedRule] = useState<any>(null);
      // ...
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Taxonomy Governance</h1>
          {/* ... */}
          <section className="bg-white p-6 rounded shadow mt-6">
            <table className="w-full">
              <thead><tr className="text-left border-b"><th>Code</th><th>Severity</th><th>Keywords</th><th>Action</th></tr></thead>
              <tbody>
                {data.rules.map((r: any) => (
                  <tr key={r.id} className="border-b">
                    <td className="p-2 font-mono">{r.code}</td>
                    <td className="p-2">{r.severity}</td>
                    <td className="p-2 text-sm">{r.keywords.join(', ')}</td>
                    <td className="p-2">
                        <button onClick={() => setEditing(r)} className="text-blue-500 mr-2">Edit</button>
                        <button onClick={() => setSelectedRule(r)} className="text-purple-500">History</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          {selectedRule && <VersionHistory versions={selectedRule.versions || []} />}
        </div>
      );
    };

  );
};
