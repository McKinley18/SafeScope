"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ReviewPage({ params }: any) {
  const { id } = params;
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    fetch(`${API}/reports/${id}`)
      .then(res => res.json())
      .then(setReport);
  }, [id]);

  if (!report) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h1>Executive Summary</h1>

      <div style={card}>
        <h3>{report.company}</h3>
        <p>Inspector: {report.inspector}</p>
        <p><strong>Risk Score:</strong> {report.riskScore}</p>
      </div>

      <div style={card}>
        <h2>Findings</h2>
        {report.findings?.map((f: any, i: number) => (
          <div key={i} style={finding}>
            <strong>{f.hazardCategory}</strong>
            <div>Severity: {f.severity}</div>
          </div>
        ))}
      </div>

      <div style={card}>
        <h2>AI Alerts</h2>
        {report.alerts?.map((a: any, i: number) => (
          <div key={i} style={alert}>
            {a.message}
          </div>
        ))}
      </div>

      <a href={`${API}/pdf/${report.id}`} target="_blank">
        <button style={button}>Download PDF</button>
      </a>
    </div>
  );
}

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 10,
  marginBottom: 20,
  boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
};

const finding = {
  padding: 10,
  borderBottom: "1px solid #eee",
};

const alert = {
  background: "#fee2e2",
  padding: 10,
  borderRadius: 6,
  marginBottom: 10,
};

const button = {
  width: "100%",
  padding: 14,
  background: "#111827",
  color: "#fff",
  borderRadius: 10,
  fontWeight: 600,
};
