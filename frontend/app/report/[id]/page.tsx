'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ReportPage() {
  const params = useParams();
  const id = params.id as string;

  const [report, setReport] = useState<any>(null);
  const [feedbackState, setFeedbackState] = useState<any>({});

  useEffect(() => {
    fetch(`http://localhost:4000/reports/${id}`)
      .then(res => res.json())
      .then(setReport);
  }, [id]);

  const sendFeedback = async (
    findingId: string,
    citation: string,
    action: string
  ) => {
    setFeedbackState((prev: any) => ({
      ...prev,
      [`${findingId}-${citation}`]: action
    }));

    await fetch('http://localhost:4000/reports/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ findingId, citation, action })
    });
  };

  if (!report) return <div style={container}>Loading...</div>;

  return (
    <div style={container}>

      {/* HEADER */}
      <h1>{report.company}</h1>

      <div style={metaRow}>
        <span><strong>Site:</strong> {report.site}</span>
        <span><strong>Inspector:</strong> {report.inspector}</span>
        <span><strong>Type:</strong> {report.type}</span>
        <span><strong>Date:</strong> {new Date(report.createdAt).toLocaleDateString()}</span>
      </div>

      {/* SUMMARY */}
      <h2 style={sectionTitle}>Executive Summary</h2>

      <div style={summaryGrid}>
        <SummaryCard label="Total" value={report.summary?.totalFindings} />
        <SummaryCard label="Critical" value={report.summary?.criticalRisk} color="#e53935" />
        <SummaryCard label="High" value={report.summary?.highRisk} color="#fb8c00" />
      </div>

      {/* FINDINGS */}
      <h2 style={sectionTitle}>Findings</h2>

      {report.findings?.map((f: any, index: number) => (
        <div key={f.id} style={card}>

          <div style={headerRow}>
            <h3>#{index + 1} — {f.hazard}</h3>
            <div style={badge(f.priority)}>{f.priority}</div>
          </div>

          <div style={meta}>
            Severity: {f.severity} | Likelihood: {f.likelihood} | Score: {f.riskScore}
          </div>

          <div style={category}>
            Category: {f.category || 'N/A'}
          </div>

          {/* PHOTO */}
          {f.photo && (
            <img src={f.photo} style={image} />
          )}

          {/* STANDARDS */}
          {f.standards?.length > 0 && (
            <div style={standardsBox}>
              <div style={standardsTitle}>Applicable Standards</div>

              {f.standards.map((s: any, i: number) => {
                const key = `${f.id}-${s.citation}`;
                const state = feedbackState[key];

                return (
                  <div key={i} style={standardCard}>

                    {/* HEADER */}
                    <div style={standardHeader}>
                      <div style={citation}>
                        {s.citation}
                      </div>

                      <div style={standardTitle}>
                        {s.title || 'Unknown Standard'}
                      </div>
                    </div>

                    {/* TEXT */}
                    {s.text && (
                      <div style={standardText}>
                        {s.text}
                      </div>
                    )}

                    {/* META */}
                    <div style={standardMeta}>
                      <span>
                        Confidence: {(s.confidence * 100).toFixed(0)}%
                      </span>

                      <span>
                        {s.reason}
                      </span>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div style={actions}>

                      <button
                        style={{
                          ...btn,
                          background: state === 'accepted' ? '#1a7f37' : '#e6f4ea',
                          color: state === 'accepted' ? 'white' : '#1a7f37'
                        }}
                        onClick={() => sendFeedback(f.id, s.citation, 'accepted')}
                      >
                        ✓ Accept
                      </button>

                      <button
                        style={{
                          ...btn,
                          background: state === 'rejected' ? '#d32f2f' : '#fdecea',
                          color: state === 'rejected' ? 'white' : '#d32f2f'
                        }}
                        onClick={() => sendFeedback(f.id, s.citation, 'rejected')}
                      >
                        ✕ Reject
                      </button>

                      <button
                        style={changeBtn}
                        onClick={() => {
                          const newCitation = prompt('Enter replacement standard:');
                          if (!newCitation) return;
                          sendFeedback(f.id, newCitation, 'changed');
                        }}
                      >
                        Change
                      </button>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      ))}

    </div>
  );
}

/* COMPONENTS */

function SummaryCard({ label, value, color }: any) {
  return (
    <div style={{
      ...summaryCard,
      borderTop: `4px solid ${color || '#0a2540'}`
    }}>
      <div style={summaryValue}>{value ?? 0}</div>
      <div style={summaryLabel}>{label}</div>
    </div>
  );
}

/* STYLES */

const container = {
  padding: '30px',
  maxWidth: '1000px',
  margin: 'auto'
};

const metaRow = {
  display: 'flex',
  gap: '20px',
  marginTop: '10px',
  fontSize: '13px',
  color: '#555',
  flexWrap: 'wrap'
};

const sectionTitle = {
  marginTop: '30px'
};

const summaryGrid = {
  display: 'flex',
  gap: '15px',
  marginTop: '10px'
};

const summaryCard = {
  background: 'white',
  padding: '15px',
  borderRadius: '8px',
  minWidth: '120px'
};

const summaryValue = {
  fontSize: '20px',
  fontWeight: 'bold'
};

const summaryLabel = {
  fontSize: '12px',
  color: '#666'
};

const card = {
  background: 'white',
  padding: '20px',
  marginTop: '15px',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
};

const headerRow = {
  display: 'flex',
  justifyContent: 'space-between'
};

const meta = {
  marginTop: '10px',
  color: '#555'
};

const category = {
  marginTop: '10px',
  fontWeight: 'bold'
};

const standardsBox = {
  marginTop: '15px'
};

const standardsTitle = {
  fontWeight: 'bold',
  marginBottom: '10px'
};

const standardCard = {
  background: '#f8fafc',
  padding: '12px',
  borderRadius: '8px',
  marginBottom: '10px',
  border: '1px solid #e2e8f0'
};

const standardHeader = {
  display: 'flex',
  gap: '10px',
  alignItems: 'baseline',
  marginBottom: '6px'
};

const citation = {
  fontWeight: 'bold',
  color: '#0a2540'
};

const standardTitle = {
  fontWeight: '600'
};

const standardText = {
  fontSize: '13px',
  color: '#444',
  marginBottom: '6px'
};

const standardMeta = {
  fontSize: '11px',
  color: '#777',
  display: 'flex',
  justifyContent: 'space-between'
};

const actions = {
  marginTop: '10px',
  display: 'flex',
  gap: '10px'
};

const btn = {
  border: 'none',
  padding: '6px 10px',
  borderRadius: '5px',
  cursor: 'pointer'
};

const changeBtn = {
  background: '#444',
  color: 'white',
  border: 'none',
  padding: '6px 10px',
  borderRadius: '5px',
  cursor: 'pointer'
};

const image = {
  marginTop: '10px',
  maxWidth: '300px',
  borderRadius: '6px'
};

function badge(priority: string) {
  let color = '#4caf50';
  if (priority === 'Critical') color = '#e53935';
  if (priority === 'High') color = '#fb8c00';

  return {
    background: color,
    color: 'white',
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '12px'
  };
}
