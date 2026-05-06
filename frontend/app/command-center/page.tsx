'use client';

import { useEffect, useState } from 'react';
import { getTasks, saveTasks } from '@/lib/data';

export default function CommandCenter() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  function updateStatus(index: number, status: string) {
    const updated = [...tasks];
    updated[index].status = status;
    setTasks(updated);
    saveTasks(updated);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Command Center</h1>

      {tasks.map((t, i) => (
        <div key={i} style={card}>
          <strong>{t.hazardType}</strong>
          <p>{t.description}</p>

          <p><strong>Assigned:</strong> {t.assignedTo}</p>
          <p><strong>Status:</strong> {t.status}</p>

          <div style={actions}>
            <button onClick={() => updateStatus(i, 'In Progress')}>
              Start
            </button>

            <button onClick={() => updateStatus(i, 'Complete')}>
              Complete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const card = {
  background: '#fff',
  padding: 15,
  marginBottom: 10,
  borderRadius: 8,
};

const actions = {
  display: 'flex',
  gap: 10,
  marginTop: 10,
};
