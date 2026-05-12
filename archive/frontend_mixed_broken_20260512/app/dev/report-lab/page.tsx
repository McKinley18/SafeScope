"use client";

'use client';

import { useState, useEffect } from 'react';
import { LayoutContainer } from '../../components/LayoutContainer';
import { localExporter } from '../../../lib/localExporter';
import { secureStorage } from '../../../lib/storage';

export default function ReportLabPage() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [density, setDensity] = useState<'single' | 'multiple'>('single');
  const [benchmarks, setBenchmarks] = useState<any[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);

  // 🔷 MOCK DATA GENERATOR FOR AUDIT
  const generateStressData = (count: number) => {
    const findings = [];
    for (let i = 0; i < count; i++) {
      findings.push({
        category: `Stress Item ${i}`,
        description: `Simulated high-density field finding for stress testing purposes. Item #${i}.`,
        likelihood: Math.floor(Math.random() * 5) + 1,
        severity: Math.floor(Math.random() * 5) + 1,
        action: `Mandatory mitigation path for stress item ${i}.`,
        photos: []
      });
    }
    return {
      adminInfo: { company: 'Audit Corp', site: 'Lab', inspector: 'Chris McKinley', date: '2026-05-10' },
      findings
    };
  };

  const runStabilityAudit = async () => {
    setIsAuditing(true);
    const results = [];
    const counts = [10, 25, 50];

    for (const count of counts) {
      const data = generateStressData(count);
      const start = performance.now();
      await (localExporter as any)._buildDoc(data, { findingsPerPage: 'multiple' });
      const end = performance.now();
      results.push({ count, latency: (end - start).toFixed(2) });
    }

    setBenchmarks(results);
    setIsAuditing(false);
  };

  const mockData = generateStressData(3);

  const refreshPreview = async () => {
    const doc = await (localExporter as any)._buildDoc(mockData, { findingsPerPage: density });
    const url = doc.output('bloburl');
    setPdfUrl(url);
  };

  useEffect(() => {
    refreshPreview();
  }, [density]);

  return (
    <div style={styles.layout}>
      <LayoutContainer type="standard">
        <header style={styles.header}>
          <div style={styles.badge}>Development & Audit Hub</div>
          <h1 style={styles.title}>Report Laboratory</h1>
          <p style={styles.subtitle}>Scientific validation and live PDF iteration.</p>
        </header>

        {/* 🔷 MARKETING VALIDATION MODULE */}
        <div style={styles.auditCard}>
          <h2 style={styles.auditTitle}>Marketing Validation Suite</h2>
          <p style={styles.auditDesc}>Generate statistical benchmarks for high-authority marketing claims.</p>
          
          <button 
            style={styles.auditBtn} 
            onClick={runStabilityAudit}
            disabled={isAuditing}
          >
            {isAuditing ? 'Executing Audit...' : 'Run Stability Stress Test'}
          </button>

          {benchmarks.length > 0 && (
            <div style={styles.benchmarkResults}>
              {benchmarks.map((b, i) => (
                <div key={i} style={styles.benchRow}>
                  <span style={styles.benchLabel}>{b.count} Findings Assembly</span>
                  <span style={styles.benchValue}>{b.latency}ms</span>
                </div>
              ))}
              <div style={styles.claimBox}>
                <strong>MARKETING CLAIM:</strong> "Sentinel Pro generates a 50-finding audit in under {benchmarks[2].latency}ms (Scientific Benchmark)"
              </div>
            </div>
          )}
        </div>

        <div style={styles.labControls}>
          <div style={styles.toggleGroup}>
            <label style={styles.toggleLabel}>Report Density:</label>
            <div style={styles.toggleButtons}>
              <button 
                style={{ ...styles.toggleBtn, background: density === 'single' ? '#0F172A' : '#FFF', color: density === 'single' ? '#FFF' : '#0F172A' }}
                onClick={() => setDensity('single')}
              >
                1 Per Page
              </button>
              <button 
                style={{ ...styles.toggleBtn, background: density === 'multiple' ? '#0F172A' : '#FFF', color: density === 'multiple' ? '#FFF' : '#0F172A' }}
                onClick={() => setDensity('multiple')}
              >
                Multiple Per Page
              </button>
            </div>
          </div>
        </div>

        <div style={styles.previewContainer}>
          {pdfUrl ? (
            <iframe src={pdfUrl} style={styles.iframe} title="PDF Preview" />
          ) : (
            <div style={styles.loading}>Generating PDF Build...</div>
          )}
        </div>
      </LayoutContainer>
    </div>
  );
}

const styles: any = {
  layout: { padding: '40px 0', background: '#F8FAFC', minHeight: '100vh' },
  header: { marginBottom: '32px', borderLeft: '4px solid #F97316', paddingLeft: '20px' },
  badge: { fontSize: '10px', fontWeight: 800, color: '#F97316', background: 'rgba(249, 115, 22, 0.1)', padding: '4px 10px', borderRadius: '4px', textTransform: 'uppercase', marginBottom: '8px', display: 'inline-block' },
  title: { fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' },
  subtitle: { fontSize: '14px', color: '#64748B', margin: 0 },
  
  auditCard: { background: '#0F172A', padding: '32px', borderRadius: '24px', color: '#FFF', marginBottom: '40px' },
  auditTitle: { fontSize: '16px', fontWeight: 800, color: '#F97316', marginBottom: '8px' },
  auditDesc: { fontSize: '13px', color: '#94A3B8', marginBottom: '24px' },
  auditBtn: { background: '#F97316', color: '#FFF', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' },
  
  benchmarkResults: { marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' },
  benchRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' },
  benchLabel: { fontSize: '13px', color: '#94A3B8' },
  benchValue: { fontSize: '14px', fontWeight: 700, color: '#FFF' },
  claimBox: { marginTop: '20px', padding: '16px', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '12px', color: '#F97316', fontSize: '12px', border: '1px solid rgba(249, 115, 22, 0.2)' },

  labControls: { display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' },
  toggleGroup: { display: 'flex', alignItems: 'center', gap: '12px' },
  toggleLabel: { fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' },
  toggleButtons: { display: 'flex', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E2E8F0' },
  toggleBtn: { padding: '8px 16px', border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },

  previewContainer: { background: '#E2E8F0', borderRadius: '16px', padding: '1px', overflow: 'hidden', height: '80vh', boxShadow: 'inset 0 2px 4px 0 rgba(0,0,0,0.1)' },
  iframe: { width: '100%', height: '100%', border: 'none' },
  loading: { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontWeight: 600 }
};
