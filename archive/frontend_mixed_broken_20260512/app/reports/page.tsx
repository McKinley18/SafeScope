'use client';

import { LayoutContainer } from '../components/LayoutContainer';

export default function ReportsPage() {
  return (
    <div style={styles.layout}>
      <LayoutContainer type="standard">
        <header style={styles.header}>
          <h1 style={styles.title}>Reports & Inspections</h1>
          <p style={styles.subtitle}>Create and manage comprehensive safety audit documentation.</p>
        </header>

        {/* NEW INSPECTION QUICK START */}
        <section style={styles.section}>
          <div style={styles.quickStartCard}>
            <div style={styles.quickStartContent}>
              <h2 style={styles.quickStartTitle}>New Safety Walkthrough</h2>
              <p style={styles.quickStartText}>
                Begin a structured inspection using SafeScope AI standard matching and risk analysis.
              </p>
            </div>
            <button 
              style={styles.primaryButton} 
              onClick={() => window.location.href = '/inspection/start'}
            >
              Begin Inspection
            </button>
          </div>
        </section>

        {/* COMPLETED REPORTS SEARCH */}
        <section style={styles.section}>
          <div style={styles.cardHeader}>
            <h2 style={styles.sectionTitle}>Completed Reports</h2>
            <input 
              type="text" 
              placeholder="Search reports by site, date, or inspector..." 
              style={styles.searchBar} 
            />
          </div>
          <div style={styles.card}>
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📄</div>
              <p style={styles.emptyText}>No completed reports found.</p>
              <p style={styles.emptySubtext}>Start an inspection to generate a report.</p>
            </div>
          </div>
        </section>
      </LayoutContainer>
    </div>
  );
}

const styles: any = {
  layout: { padding: '40px 0' },
  header: { marginBottom: '32px', borderLeft: '4px solid #0369A1', paddingLeft: '20px' },
  title: { fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' },
  subtitle: { fontSize: '14px', color: '#64748B', margin: 0 },
  
  section: { marginBottom: '40px' },
  
  quickStartCard: { 
    background: '#0F172A', 
    padding: '40px', 
    borderRadius: '20px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    gap: '32px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  quickStartContent: { flex: 1 },
  quickStartTitle: { fontSize: '20px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' },
  quickStartText: { fontSize: '14px', color: '#94A3B8', margin: 0, lineHeight: '1.6' },
  
  primaryButton: { 
    background: '#0369A1', 
    color: '#FFFFFF', 
    padding: '14px 32px', 
    borderRadius: '12px', 
    border: 'none', 
    fontWeight: 600, 
    cursor: 'pointer',
    fontSize: '14px',
    whiteSpace: 'nowrap' as const,
  },
  
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  sectionTitle: { fontSize: '14px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' },
  searchBar: { 
    width: '320px', 
    padding: '10px 14px', 
    borderRadius: '10px', 
    border: '1px solid #E2E8F0', 
    fontSize: '14px',
    background: '#FFFFFF',
  },
  
  card: { 
    background: '#FFFFFF', 
    padding: '48px', 
    borderRadius: '16px', 
    border: '1px solid #E2E8F0', 
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
  },
  emptyState: { textAlign: 'center' },
  emptyIcon: { fontSize: '32px', marginBottom: '16px' },
  emptyText: { fontSize: '15px', fontWeight: 600, color: '#1E293B', marginBottom: '4px' },
  emptySubtext: { fontSize: '13px', color: '#64748B', margin: 0 },
};
