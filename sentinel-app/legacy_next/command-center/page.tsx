'use client';

import { useState } from 'react';
import { LayoutContainer } from '../components/LayoutContainer';

const initialFindings = [
  { id: '101', site: 'Plant East', category: 'LOTO Failure', rpn: 25, status: 'Open', assignee: 'Sarah Jenkins', date: '2026-05-08' },
  { id: '102', site: 'Warehouse North', category: 'Fall Hazard', rpn: 16, status: 'In Progress', assignee: 'Marcus Chen', date: '2026-05-09' },
  { id: '103', site: 'Dist. Center', category: 'PPE Violation', rpn: 4, status: 'Mitigated', assignee: 'Sarah Jenkins', date: '2026-05-09' },
];

export default function CommandCenterPage() {
  const [findings, setFindings] = useState(initialFindings);
  const [filter, setFilter] = useState('All');

  const updateStatus = (id: string, newStatus: string) => {
    setFindings(findings.map(f => f.id === id ? { ...f, status: newStatus } : f));
  };

  const filtered = filter === 'All' ? findings : findings.filter(f => f.status === filter);

  return (
    <div style={styles.layout}>
      <LayoutContainer type="wide">
        <header style={styles.header}>
          <div style={styles.headerTop}>
            <h1 style={styles.title}>Global Command Center</h1>
            <div style={styles.statsRow}>
              <div style={styles.statMini}>
                <span style={styles.statLabel}>Open Actions</span>
                <span style={styles.statValue}>{findings.filter(f => f.status === 'Open').length}</span>
              </div>
              <div style={styles.statMini}>
                <span style={styles.statLabel}>Mean Mitigation Time</span>
                <span style={styles.statValue}>3.2d</span>
              </div>
            </div>
          </div>
          <p style={styles.subtitle}>Consolidated departmental action log and multi-user finding distribution.</p>
        </header>

        {/* 🔷 FILTER BAR */}
        <div style={styles.filterBar}>
          {['All', 'Open', 'In Progress', 'Mitigated'].map((f) => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              style={{ ...styles.filterBtn, background: filter === f ? '#0F172A' : '#FFF', color: filter === f ? '#FFF' : '#475569' }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* 🔷 ACTION TABLE */}
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHead}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Site / Category</th>
                <th style={styles.th}>Assignee</th>
                <th style={styles.th}>RPN</th>
                <th style={styles.th}>Current Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.id} style={styles.tr}>
                  <td style={styles.td}><span style={styles.idBadge}>#{f.id}</span></td>
                  <td style={styles.td}>
                    <div style={styles.siteCat}>
                      <span style={styles.siteName}>{f.site}</span>
                      <span style={styles.catName}>{f.category}</span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <select style={styles.inlineSelect} defaultValue={f.assignee}>
                      <option>Sarah Jenkins</option>
                      <option>Marcus Chen</option>
                      <option>Elena Rodriguez</option>
                    </select>
                  </td>
                  <td style={styles.td}>
                    <span style={{ ...styles.rpnText, color: f.rpn >= 15 ? '#DC2626' : '#F97316' }}>{f.rpn}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.statusCol}>
                      <span style={{ ...styles.statusBadge, background: f.status === 'Open' ? '#FEE2E2' : f.status === 'In Progress' ? '#FEF9C3' : '#DCFCE7', color: f.status === 'Open' ? '#991B1B' : f.status === 'In Progress' ? '#854D0E' : '#166534' }}>
                        {f.status}
                      </span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <button style={styles.updateBtn} onClick={() => updateStatus(f.id, f.status === 'Open' ? 'Mitigated' : 'Open')}>
                      Toggle Progress
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LayoutContainer>
    </div>
  );
}

const styles: any = {
  layout: { padding: '40px 0', background: '#F8FAFC', minHeight: '100vh' },
  header: { marginBottom: '32px', borderLeft: '4px solid #F97316', paddingLeft: '20px' },
  headerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0 },
  subtitle: { fontSize: '14px', color: '#64748B', marginTop: 4 },
  
  statsRow: { display: 'flex', gap: '24px' },
  statMini: { textAlign: 'right' },
  statLabel: { fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' },
  statValue: { fontSize: '18px', fontWeight: 800, color: '#0F172A', display: 'block' },

  filterBar: { display: 'flex', gap: '8px', marginBottom: '24px' },
  filterBtn: { padding: '8px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },

  tableCard: { background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  tableHead: { background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' },
  th: { padding: '16px 24px', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #F1F5F9' },
  td: { padding: '16px 24px', fontSize: '13px' },
  
  idBadge: { background: '#F1F5F9', padding: '4px 8px', borderRadius: '4px', color: '#475569', fontWeight: 700, fontSize: '11px' },
  siteCat: { display: 'flex', flexDirection: 'column' },
  siteName: { fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' },
  catName: { fontSize: '14px', fontWeight: 600, color: '#1E293B' },
  
  inlineSelect: { padding: '6px 10px', borderRadius: '6px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: '12px', outline: 'none' },
  rpnText: { fontWeight: 800, fontSize: '15px' },
  statusBadge: { padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' },
  updateBtn: { background: 'none', border: 'none', color: '#0369A1', fontWeight: 700, fontSize: '12px', cursor: 'pointer' },
};
