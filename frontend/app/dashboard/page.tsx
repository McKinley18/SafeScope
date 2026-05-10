'use client';

import { useEffect, useState } from 'react';
import { fetchReports } from '../../lib/api';
import { LayoutContainer } from '../components/LayoutContainer';

export default function DashboardPage() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const data = await fetchReports();
      setReports(data || []);
    }
    load();
  }, []);

  const total = reports.length;
  const highRisk = reports.filter(r => r.riskScore > 70).length;

  return (
    <div style={styles.layout}>
      <LayoutContainer type="wide">
        <header style={styles.header}>
          <h1 style={styles.title}>Command Center</h1>
          <p style={styles.subtitle}>
            Real-time operational awareness and safety performance metrics.
          </p>
        </header>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Operational Status</h2>
          <div style={styles.grid}>
            {[
              { label: 'Pending Reviews', value: highRisk, color: '#0369A1' },
              { label: 'Overdue Actions', value: 12, color: '#DC2626' },
              { label: 'Inspections Due', value: 3, color: '#D97706' },
              { label: 'Site Alerts', value: 1, color: '#7C3AED' },
            ].map((stat, i) => (
              <div key={i} style={styles.statCard}>
                <span style={styles.statLabel}>{stat.label}</span>
                <span style={{ ...styles.statValue, color: stat.color }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </section>

        <div style={styles.stackColumn}>
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>High-Priority Actions</h2>
            <div style={styles.card}>
              <p style={styles.emptyText}>No immediate high-priority actions pending review.</p>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Recent Activity</h2>
            <div style={styles.card}>
              {[
                { user: 'Chris McKinley', action: 'completed inspection', site: 'Warehouse North', time: '2h ago' },
                { user: 'System', action: 'generated report', site: 'April 2026', time: 'Yesterday' },
              ].map((activity, i) => (
                <div key={i} style={styles.activityItem}>
                  <div style={styles.activityDot} />
                  <div style={styles.activityContent}>
                    <p style={styles.activityText}>
                      <strong>{activity.user}</strong> {activity.action} for <strong>{activity.site}</strong>
                    </p>
                    <span style={styles.activityTime}>{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </LayoutContainer>
    </div>
  );
}

const styles: any = {
  layout: { padding: '40px 0' },
  header: { marginBottom: '32px', borderLeft: '4px solid #0369A1', paddingLeft: '20px' },
  title: { fontSize: '28px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' },
  subtitle: { fontSize: '15px', color: '#64748B', margin: 0 },
  
  section: { marginBottom: '32px' },
  sectionTitle: { fontSize: '14px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' },
  
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
    gap: '20px',
  },
  
  statCard: { 
    background: '#FFFFFF', 
    padding: '24px', 
    borderRadius: '16px', 
    border: '1px solid #E2E8F0', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
  },
  statLabel: { fontSize: '13px', fontWeight: 600, color: '#64748B' },
  statValue: { fontSize: '32px', fontWeight: 800 },
  
  stackColumn: { display: 'flex', flexDirection: 'column', gap: '8px' },
  card: { 
    background: '#FFFFFF', 
    padding: '24px', 
    borderRadius: '16px', 
    border: '1px solid #E2E8F0', 
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
    minHeight: '160px',
  },
  emptyText: { fontSize: '14px', color: '#94A3B8', textAlign: 'center', marginTop: '40px' },
  
  activityItem: { display: 'flex', gap: '12px', paddingBottom: '16px', marginBottom: '16px', borderBottom: '1px solid #F1F5F9' },
  activityDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#0369A1', marginTop: '6px', flexShrink: 0 },
  activityContent: { display: 'flex', flexDirection: 'column', gap: '2px' },
  activityText: { fontSize: '13px', color: '#1E293B', margin: 0 },
  activityTime: { fontSize: '11px', color: '#94A3B8' },
};
