'use client';

import { useState } from 'react';
import { analyzePhoto } from '../../lib/safescope';

const RISK_OPTIONS = [
  { label: 'Low', severity: 1, likelihood: 2, color: '#4caf50' },
  { label: 'Medium', severity: 3, likelihood: 3, color: '#fbc02d' },
  { label: 'High', severity: 4, likelihood: 3, color: '#fb8c00' },
  { label: 'Critical', severity: 5, likelihood: 4, color: '#e53935' }
];

export default function InspectionPage() {
  const [findings, setFindings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addFinding = () => {
    setFindings([
      ...findings,
      { hazard: '', severity: 0, likelihood: 0, riskLabel: '', photo: '' }
    ]);
  };

  const updateFinding = (index: number, field: string, value: any) => {
    const updated = [...findings];
    updated[index][field] = value;
    setFindings(updated);
  };

  const setRisk = (index: number, option: any) => {
    const updated = [...findings];
    updated[index].severity = option.severity;
    updated[index].likelihood = option.likelihood;
    updated[index].riskLabel = option.label;
    setFindings(updated);
  };

  const handlePhoto = async (index: number, file: File) => {
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64 = reader.result as string;

      updateFinding(index, 'photo', base64);

      // 🔥 AI ANALYSIS
      const ai = await analyzePhoto(base64);

      // Only auto-fill if empty
      if (!findings[index].hazard) {
        updateFinding(index, 'hazard', ai.hazard);
      }
    };

    reader.readAsDataURL(file);
  };

  const saveReport = async () => {
    setLoading(true);

    const payload = {
      company: 'Demo Company',
      site: 'Demo Site',
      inspector: 'Inspector Name',
      type: 'MSHA',
      confidential: true,
      findings
    };

    const res = await fetch('http://localhost:4000/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    setLoading(false);

    window.location.href = `/report/${data.id}`;
  };

  return (
    <div style={container}>
      <h1 style={title}>Findings</h1>

      <div style={topActions}>
        <button style={addBtn} onClick={addFinding}>
          + Add Finding
        </button>
      </div>

      {findings.map((f, i) => (
        <div key={i} style={card}>

          {/* PHOTO */}
          <div style={section}>
            <label style={label}>Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handlePhoto(i, e.target.files[0]);
                }
              }}
            />

            {f.photo && <img src={f.photo} style={preview} />}
          </div>

          {/* HAZARD */}
          <div style={section}>
            <label style={label}>Hazard</label>
            <input
              style={input}
              placeholder="Describe the hazard"
              value={f.hazard}
              onChange={(e) => updateFinding(i, 'hazard', e.target.value)}
            />

            {f.hazard && (
              <div style={aiNote}>
                AI Suggested (editable)
              </div>
            )}
          </div>

          {/* RISK */}
          <div style={section}>
            <label style={label}>Risk Level</label>
            <div style={riskRow}>
              {RISK_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setRisk(i, opt)}
                  style={{
                    ...riskBtn,
                    background:
                      f.riskLabel === opt.label ? opt.color : '#eee',
                    color:
                      f.riskLabel === opt.label ? 'white' : '#333'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      ))}

      {findings.length > 0 && (
        <div style={bottomActions}>
          <button style={saveBtn} onClick={saveReport} disabled={loading}>
            {loading ? 'Saving...' : 'Save Report'}
          </button>
        </div>
      )}
    </div>
  );
}

/* STYLES */

const container = { padding: '30px', maxWidth: '700px', margin: 'auto' };
const title = { fontSize: '26px', marginBottom: '10px' };

const topActions = { marginBottom: '20px' };
const bottomActions = { marginTop: '30px', textAlign: 'center' as const };

const addBtn = {
  padding: '10px 15px',
  background: '#0a2540',
  color: 'white',
  border: 'none',
  borderRadius: '6px'
};

const saveBtn = {
  padding: '12px 20px',
  background: '#1a7f37',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '16px'
};

const card = {
  background: 'white',
  padding: '20px',
  marginTop: '15px',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
};

const section = { marginBottom: '15px' };

const label = {
  display: 'block',
  fontSize: '13px',
  marginBottom: '5px',
  color: '#555'
};

const input = {
  width: '100%',
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #ddd'
};

const preview = {
  marginTop: '10px',
  maxWidth: '200px',
  borderRadius: '6px'
};

const aiNote = {
  fontSize: '12px',
  color: '#777',
  marginTop: '5px'
};

const riskRow = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap' as const
};

const riskBtn = {
  padding: '10px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer'
};
