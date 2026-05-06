'use client';

import React from 'react';
import { RuleForm } from '../../components/admin/RuleForm';
import { BulkImport } from '../../components/admin/BulkImport';
import { VersionHistory } from '../../components/admin/versioning/VersionHistory';

export default function TaxonomyAdmin() {
  const handleExport = () => {
    const csv = 'sample,data,export';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'taxonomy.csv';
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Taxonomy Admin</h1>

      <button onClick={handleExport}>Export CSV</button>

      <div style={{ marginTop: 20 }}>
        <RuleForm />
      </div>

      <div style={{ marginTop: 20 }}>
        <BulkImport />
      </div>

      <div style={{ marginTop: 20 }}>
        <VersionHistory />
      </div>
    </div>
  );
}
