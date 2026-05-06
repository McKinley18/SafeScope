'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function SessionsList() {
  const router = useRouter();

  const sessions = [
    { id: '1', name: 'Inspection Session 1' },
    { id: '2', name: 'Inspection Session 2' },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>Sessions</h1>

      {sessions.map((session) => (
        <div
          key={session.id}
          style={{
            padding: 10,
            border: '1px solid #ccc',
            marginBottom: 10,
            cursor: 'pointer',
          }}
          onClick={() => router.push(`/report?id=${session.id}`)}
        >
          {session.name}
        </div>
      ))}
    </div>
  );
}
