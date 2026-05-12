'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { LayoutContainer } from '../components/LayoutContainer';
import { useUser } from '../../lib/UserContext';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  Cell,
  ReferenceLine,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

// 🔷 1. HIGH-VALUE DATA STRUCTURES
const morningBrief = [
  { rank: '01', label: 'Lockout/Tagout Critical Failure', desc: 'Plant East has exceeded its statistical variance (+2.4σ) for LOTO findings. Immediate departmental audit required.' },
  { rank: '02', label: 'Fall Hazard Mitigation Overdue', desc: 'Warehouse North has 4 "High" RPN findings remaining open beyond the 72hr mean mitigation target.' },
  { rank: '03', label: 'Audit Fatigue Warning', desc: 'Safety Audit Findings Rate (SAFR) has declined 15% in high-risk zones, suggesting a loss of professional vigilance.' },
];

const metrics = [
  {
    category: 'Tactical Leading Indicators',
    lead: 'Immediate Operational Risk',
    desc: 'Metrics that track the agility and sensitivity of your safety frontline.',
    items: [
      {
        label: 'Mean Mitigation Time (MMT)',
        value: '3.2 Days',
        trend: '↑ 14% Surge',
        trendColor: '#DC2626',
        equation: 'Σ (Closed Date - Open Date) / count(Mitigations)',
        justification: 'Measures management responsiveness and organizational agility.',
        impact: 'A rising MMT is the earliest indicator of "Normalization of Deviance"—where hazards are accepted as status quo.'
      },
      {
        label: 'Risk Exposure Ratio (RER)',
        value: '0.24',
        trend: '↓ 2% Stable',
        trendColor: '#059669',
        equation: 'Σ (Finding RPN) / (Inspections x Hazard Capacity)',
        justification: 'Normalizes hazard volume against audit frequency.',
        impact: 'Prevents "Ghost Safety"—where a site appears safe simply because it is not being inspected.'
      },
      {
        label: 'Statistical Variance (Sigma)',
        value: '+1.4s',
        trend: 'Critical Deviation',
        trendColor: '#DC2626',
        equation: '(Current Count - Historical Mean) / σ',
        justification: 'Differentiates random noise from systemic process failure.',
        impact: 'Deviations above +3σ indicate a process has lost control, predicting imminent incidents.'
      }
    ]
  },
  {
    category: 'Strategic Efficiency Metrics',
    lead: 'Culture & Systemic Integrity',
    desc: 'Metrics that validate the long-term efficacy and ROI of the safety program.',
    items: [
      {
        label: 'Hazard Recurrence Rate (HRR)',
        value: '8.4%',
        trend: '↑ 1.2% Low Efficacy',
        trendColor: '#DC2626',
        equation: '(Count of Recurrent Findings / Total Unique Findings) x 100',
        justification: 'Measures the technical quality and permanence of corrective actions.',
        impact: 'Exposes "Pencil-Whipping." High HRR indicates superficial fixes are being applied.'
      },
      {
        label: 'Risk Reduction Velocity (RRV)',
        value: '142 pts/wk',
        trend: '↑ 18% High Impact',
        trendColor: '#059669',
        equation: 'Σ (Initial RPN - Mitigated RPN) / Δ Time',
        justification: 'Quantifies the mathematical speed of hazard removal.',
        impact: 'The "True ROI." RRV allows leadership to see exactly how much risk potential has been removed.'
      },
      {
        label: 'Safety Audit Findings Rate (SAFR)',
        value: '2.4 / hr',
        trend: '↓ 0.4 Fatigue Warning',
        trendColor: '#F97316',
        equation: 'Total Findings Logged / Total Audit Man-Hours',
        justification: 'Monitors the professional vigilance and sensitivity of auditors.',
        impact: 'Identifies "Audit Fatigue." A declining SAFR suggests auditors are losing their "Eye for Risk."'
      }
    ]
  }
];

const complianceRadarData = [
  { subject: 'Electrical', A: 120 },
  { subject: 'Fall Protection', A: 98 },
  { subject: 'PPE', A: 86 },
  { subject: 'Machine Guard', A: 99 },
  { subject: 'HazCom', A: 85 },
  { subject: 'LOTO', A: 65 },
];

const spcData = [
  { month: 'Jan', findings: 12 },
  { month: 'Feb', findings: 15 },
  { month: 'Mar', findings: 8 },
  { month: 'Apr', findings: 19 },
];

const riskData = [
  { likelihood: 2, severity: 4, name: 'Slip/Trip' },
  { likelihood: 4, severity: 5, name: 'Electrical' },
  { likelihood: 1, severity: 2, name: 'PPE' },
  { likelihood: 3, severity: 3, name: 'Machine Guarding' },
];

const benchmarkData = [
  { site: 'Warehouse N.', score: 82 },
  { site: 'Plant E.', score: 94 },
  { site: 'Dist. Center S.', score: 68 },
];

// 🔷 2. STYLES DEFINITION (TIGHTENED & MOBILE OPTIMIZED)
const styles: any = {
  layout: { padding: '24px 0', background: '#F8FAFC', minHeight: '100vh' },
  header: { marginBottom: '40px', borderLeft: '4px solid #F97316', paddingLeft: '20px' },
  title: { fontSize: '24px', fontWeight: 900, color: '#0F172A', marginBottom: '4px' },
  subtitle: { fontSize: '14px', color: '#64748B', margin: 0, maxWidth: '800px', lineHeight: '1.6' },
  
  briefCard: { background: '#0F172A', padding: '24px', borderRadius: '24px', color: '#FFFFFF', marginBottom: '48px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
  briefTitle: { fontSize: '10px', fontWeight: 900, color: '#F97316', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px', display: 'block' },
  briefItem: { display: 'flex', gap: '16px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  briefRank: { fontSize: '24px', fontWeight: 900, color: 'rgba(255,255,255,0.15)', width: '35px' },
  briefContent: { flex: 1 },
  briefLabel: { fontSize: '15px', fontWeight: 800, marginBottom: '4px', display: 'block' },
  briefDesc: { fontSize: '13px', color: '#94A3B8', lineHeight: '1.5' },

  kpiChapter: { marginBottom: '64px' },
  chapterHeader: { marginBottom: '32px', padding: '0 16px' },
  chapterTag: { fontSize: '10px', fontWeight: 900, color: '#F97316', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '8px' },
  chapterLead: { fontSize: '20px', fontWeight: 900, color: '#0F172A', marginBottom: '6px' },
  chapterDesc: { fontSize: '14px', color: '#64748B', maxWidth: '750px', lineHeight: '1.5' },

  kpiList: { display: 'flex', flexDirection: 'column', gap: '40px' },
  kpiRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '24px', marginBottom: '48px', alignItems: 'start', padding: '0 16px' },
  kpiValueBlock: { borderLeft: '4px solid #0F172A', paddingLeft: '20px' },
  kpiMainLabel: { fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' },
  kpiMainValue: { fontSize: '40px', fontWeight: 900, color: '#0F172A', display: 'block', lineHeight: '1.1' },
  kpiMainTrend: { fontSize: '11px', fontWeight: 800, marginTop: '8px', display: 'inline-block', padding: '4px 10px', borderRadius: '6px', background: '#F1F5F9' },

  kpiNarrative: { display: 'flex', flexDirection: 'column', gap: '16px' },
  kpiEquationBox: { background: '#FFFFFF', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0' },
  kpiFormula: { fontSize: '12px', fontWeight: 800, color: '#0369A1', fontFamily: 'monospace' },
  kpiJustText: { fontSize: '13px', color: '#475569', lineHeight: '1.6', margin: 0 },
  kpiImpactBadge: { background: '#0F172A', color: '#FFFFFF', padding: '12px 16px', borderRadius: '12px', fontSize: '12px', lineHeight: '1.6' },

  chartSection: { marginBottom: '64px' },
  chartGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '24px', padding: '0 16px' },
  chartCard: { background: '#FFFFFF', padding: '24px', borderRadius: '20px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' },
  chartHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  chartTitle: { fontSize: '16px', fontWeight: 900, color: '#0F172A' },
  chartMethod: { fontSize: '9px', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' },
  
  foundation: { background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #F1F5F9', marginBottom: '24px' },
  foundationTitle: { fontSize: '9px', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' },
  foundationText: { fontSize: '11px', color: '#475569', lineHeight: '1.6', margin: 0 },

  footer: { marginTop: '64px', padding: '48px 16px', borderTop: '1px solid #E2E8F0', textAlign: 'center' },
  footerText: { fontSize: '12px', color: '#94A3B8', lineHeight: '1.6' },
};

// 🔷 3. COMPONENT DEFINITION
export default function AnalyticsPage() {
  const { user } = useUser();

  return (
    <div style={styles.layout}>
      <LayoutContainer type="wide">
        <header style={styles.header}>
          <h1 style={styles.title}>Safety Intelligence Dashboard</h1>
          <p style={styles.subtitle}>Scientific decision-support environment validating organizational resilience.</p>
        </header>

        {/* CHAPTER 1: PRIORITY HUB */}
        <div style={styles.priorityHub}>
          <div style={styles.briefCard}>
            <span style={styles.briefTitle}>Morning Intelligence Brief</span>
            {morningBrief.map((item, i) => (
              <div key={i} style={styles.briefItem}>
                <span style={styles.briefRank}>{item.rank}</span>
                <div style={styles.briefContent}>
                  <strong style={styles.briefLabel}>{item.label}</strong>
                  <p style={styles.briefDesc}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHAPTER 2 & 3: KPI CATEGORIES */}
        {metrics.map((chapter, cIdx) => (
          <div key={cIdx} style={styles.kpiChapter}>
            <div style={styles.chapterHeader}>
              <span style={styles.chapterTag}>{chapter.category}</span>
              <h2 style={styles.chapterLead}>{chapter.lead}</h2>
              <p style={styles.chapterDesc}>{chapter.desc}</p>
            </div>

            <div style={styles.kpiList}>
              {chapter.items.map((m, i) => (
                <div key={i} style={styles.kpiRow}>
                  {/* Left: Quantitative Value */}
                  <div style={styles.kpiValueBlock}>
                    <span style={styles.kpiMainLabel}>{m.label}</span>
                    <span style={styles.kpiMainValue}>{m.value}</span>
                    <span style={{ ...styles.kpiMainTrend, color: m.trendColor }}>{m.trend}</span>
                  </div>

                  {/* Right: Technical Narrative */}
                  <div style={styles.kpiNarrative}>
                    <div style={styles.kpiEquationBox}>
                      <span style={styles.foundationTitle}>Equation</span>
                      <code style={styles.kpiFormula}>{m.equation}</code>
                    </div>
                    <div>
                      <span style={styles.foundationTitle}>Scientific Foundation</span>
                      <p style={styles.kpiJustText}>{m.justification}</p>
                    </div>
                    <div style={styles.kpiImpactBadge}>
                      <span style={{ ...styles.foundationTitle, color: '#F97316' }}>Strategic Impact</span>
                      {m.impact}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {/* CHAPTER 4: DEEP ANALYTICAL VISUALIZATION */}
        <div style={styles.chartSection}>
          <div style={styles.chapterHeader}>
            <span style={styles.chapterTag}>Deep Analytical Intelligence</span>
            <h2 style={styles.chapterLead}>Multi-Dimensional Risk Mapping</h2>
          </div>

          {user?.type === 'individual' ? (
            <div style={{ background: '#0F172A', padding: '48px 24px', borderRadius: '32px', textAlign: 'center', margin: '0 16px' }}>
              <h2 style={{ color: '#F97316', fontSize: '20px', fontWeight: 900, marginBottom: '12px' }}>🚀 Predictive Modeling Gated</h2>
              <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.7', maxWidth: '600px', margin: '0 auto 24px' }}>
                Advanced Statistical Process Control (SPC) and Risk Priority Matrix (RPN) mapping are reserved for Pro and Enterprise users. 
              </p>
              <Link href="/pricing" style={{ background: '#F97316', color: '#FFF', padding: '12px 32px', borderRadius: '12px', fontWeight: 800, textDecoration: 'none', fontSize: '14px', display: 'inline-block' }}>
                Upgrade to Sentinel Pro
              </Link>
            </div>
          ) : (
            <div style={styles.chartGrid}>
              
              {/* RADAR: HOT ZONES */}
              <div style={styles.chartCard}>
                <div style={styles.chartHeader}>
                  <h3 style={styles.chartTitle}>Regulatory Hot Zones</h3>
                  <span style={styles.chartMethod}>RADAR</span>
                </div>
                <div style={styles.foundation}>
                  <span style={styles.foundationTitle}>Foundation</span>
                  <p style={styles.foundationText}>
                    <strong>Method:</strong> Normalized compliance density across domains.<br/>
                    <strong>Action:</strong> Gaps require departmental audit.
                  </p>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={complianceRadarData}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 700 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                    <Radar name="Compliance" dataKey="A" stroke="#0F172A" fill="#0F172A" fillOpacity={0.1} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* LINE: SPC STABILITY */}
              <div style={styles.chartCard}>
                <div style={styles.chartHeader}>
                  <h3 style={styles.chartTitle}>Process Stability (SPC)</h3>
                  <span style={styles.chartMethod}>CONTROL</span>
                </div>
                <div style={styles.foundation}>
                  <span style={styles.foundationTitle}>Foundation</span>
                  <p style={styles.foundationText}>
                    <strong>Method:</strong> Statistical variance differentiation.<br/>
                    <strong>Action:</strong> UCL surges require root-cause analysis.
                  </p>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={spcData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} label={{ value: 'Audit Period', position: 'insideBottom', offset: -10, fontSize: 10, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fontSize: 10, fontWeight: 700 }} />
                    <ReferenceLine y={18} stroke="#DC2626" strokeDasharray="4 4" />
                    <ReferenceLine y={12} stroke="#64748B" strokeDasharray="2 2" />
                    <Line type="monotone" dataKey="findings" stroke="#0F172A" strokeWidth={3} dot={{ r: 4, fill: '#0F172A' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* SCATTER: RPN MATRIX */}
              <div style={styles.chartCard}>
                <div style={styles.chartHeader}>
                  <h3 style={styles.chartTitle}>Risk Priority Matrix</h3>
                  <span style={styles.chartMethod}>RPN</span>
                </div>
                <div style={styles.foundation}>
                  <span style={styles.foundationTitle}>Foundation</span>
                  <p style={styles.foundationText}>
                    <strong>Method:</strong> (Likelihood x Severity) product analysis.<br/>
                    <strong>Action:</strong> Red-zone requires immediate area closure.
                  </p>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis type="number" dataKey="likelihood" domain={[0, 6]} axisLine={false} tickLine={false} tick={{ fontSize: 10 }} label={{ value: 'Probability', position: 'insideBottom', offset: -10, fontSize: 10, fontWeight: 700 }} />
                    <YAxis type="number" dataKey="severity" domain={[0, 6]} axisLine={false} tickLine={false} tick={{ fontSize: 10 }} label={{ value: 'Impact', angle: -90, position: 'insideLeft', fontSize: 10, fontWeight: 700 }} />
                    <ZAxis type="number" range={[100, 100]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter data={riskData}>
                      {riskData.map((entry, index) => (
                        <Cell key={index} fill={entry.likelihood * entry.severity >= 15 ? '#DC2626' : '#F97316'} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              {/* BAR: BENCHMARKING */}
              <div style={styles.chartCard}>
                <div style={styles.chartHeader}>
                  <h3 style={styles.chartTitle}>Maturity Benchmarking</h3>
                  <span style={styles.chartMethod}>RANKING</span>
                </div>
                <div style={styles.foundation}>
                  <span style={styles.foundationTitle}>Foundation</span>
                  <p style={styles.foundationText}>
                    <strong>Method:</strong> Site score benchmarking.<br/>
                    <strong>Action:</strong> Red zones trigger automated training.
                  </p>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={benchmarkData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="site" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} label={{ value: 'Operational Site', position: 'insideBottom', offset: -10, fontSize: 10, fontWeight: 700 }} />
                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10 }} label={{ value: 'Index', angle: -90, position: 'insideLeft', fontSize: 10, fontWeight: 700 }} />
                    <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={32}>
                      {benchmarkData.map((entry, index) => (
                        <Cell key={index} fill={entry.score < 70 ? '#DC2626' : entry.score < 85 ? '#F97316' : '#059669'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>
          )}
        </div>

        <footer style={styles.footer}>
          <p style={styles.footerText}>
            Predictive modeling based on statistical variance (+1.4σ). 
            Verify all suggestions with a Safety Professional. 
            View <Link href="/legal" style={{ color: '#0369A1', fontWeight: 600 }}>Statistical Disclaimer</Link>.
          </p>
        </footer>
      </LayoutContainer>
    </div>
  );
}
