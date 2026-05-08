'use client';

import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { useRouter } from 'next/navigation';

export default function ReportBuilder() {
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('draftReport');
    if (saved) setData(JSON.parse(saved));
  }, []);

  const save = (updated: any) => {
    setData(updated);
    localStorage.setItem('draftReport', JSON.stringify(updated));
  };

  // 🗑 DELETE
  const deleteFinding = (index: number) => {
    const updated = { ...data };
    updated.findings.splice(index, 1);
    save(updated);
  };

  // ✏️ START EDIT
  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(data.findings[index].hazard);
  };

  // 💾 SAVE EDIT
  const saveEdit = () => {
    const updated = { ...data };
    updated.findings[editingIndex!].hazard = editValue;
    save(updated);
    setEditingIndex(null);
  };

  if (!data) {
    return <div style={{ padding: 20 }}>No report draft found.</div>;
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 20 }}>Report Builder</h1>

      {/* REPORT HEADER */}
      <Card>
        <div style={{ fontWeight: 600 }}>{data.report.company}</div>
        <div>{data.report.site}</div>
        <div>{data.report.inspector}</div>
        <div>{data.report.date}</div>

        {data.report.confidential && (
          <div style={{ color: '#ef4444', fontWeight: 600 }}>
            Privileged & Confidential
          </div>
        )}
      </Card>

      {/* FINDINGS */}
      <div style={{ marginTop: 20 }}>
        {data.findings.length === 0 ? (
          <div style={{ color: '#666' }}>No findings added</div>
        ) : (
          data.findings.map((f: any, i: number) => (
            <Card key={i}>
              {editingIndex === i ? (
                <>
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    style={input}
                  />

                  <button style={btn} onClick={saveEdit}>
                    Save
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontWeight: 600 }}>
                    {f.hazard}
                  </div>

                  <div style={{ fontSize: 12, color: '#666' }}>
                    Category: {f.category || '—'}
                  </div>

                  <div style={{ fontSize: 12, color: '#666' }}>
                    Risk: {f.severity * f.likelihood}
                  </div>

                  {/* IMAGE */}
                  {f.preview && (
                    <img
                      src={f.preview}
                      style={{
                        width: '100%',
                        marginTop: 10,
                        borderRadius: 10,
                      }}
                    />
                  )}

                  {/* ACTIONS */}
                  <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
                    <button onClick={() => startEdit(i)}>Edit</button>
                    <button onClick={() => deleteFinding(i)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </Card>
          ))
        )}
      </div>

      {/* NAVIGATION */}
      <div style={{ display: 'flex', gap: 10, marginTop: 30 }}>
        <button onClick={() => router.push('/inspection')}>
          ← Continue Adding
        </button>

        <button
          style={btn}
          onClick={() => router.push('/report/review')}
        >
          Finalize Report →
        </button>
      </div>
    </div>
  );
}

/* STYLES */

const input = {
  padding: 10,
  borderRadius: 8,
  border: '1px solid #ddd',
  width: '100%',
};

const btn = {
  padding: 10,
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
};
