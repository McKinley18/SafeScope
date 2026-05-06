'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

export default function ReportDetail() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return (
    <div style={{ padding: 20 }}>
      <h1>Report Detail</h1>

      <p>Report ID: {id}</p>
    </div>
  );
}
