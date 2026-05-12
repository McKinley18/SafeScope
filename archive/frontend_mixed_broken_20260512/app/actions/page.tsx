'use client';

import { useState } from 'react';
import { LayoutContainer } from '../components/LayoutContainer';

type ActionStatus = 'Pending' | 'In Progress' | 'Resolved';

interface SafetyAction {
  id: number;
  site: string;
  hazard: string;
  priority: 'Medium' | 'High' | 'Critical';
  status: ActionStatus;
}

const INITIAL_ACTIONS: SafetyAction[] = [
  { id: 1, site: 'Warehouse North', hazard: 'Blocked Fire Exit', priority: 'High', status: 'Pending' },
  { id: 2, site: 'Plant East', hazard: 'Exposed Wiring', priority: 'Critical', status: 'In Progress' },
  { id: 3, site: 'Warehouse North', hazard: 'Spill not cleaned', priority: 'Medium', status: 'Pending' },
];

export default function ActionsPage() {
  const [actions, setActions] = useState<SafetyAction[]>(INITIAL_ACTIONS);
  const [activeTab, setActiveTab] = useState<'Active' | 'Resolved'>('Active');

  const updateStatus = (id: number) => {
    setActions(prev => prev.map(action => {
      if (action.id !== id) return action;
      
      let nextStatus: ActionStatus = action.status;
      if (action.status === 'Pending') nextStatus = 'In Progress';
      else if (action.status === 'In Progress') nextStatus = 'Resolved';
      
      return { ...action, status: nextStatus };
    }));
  };

  const filteredActions = actions.filter(a => 
    activeTab === 'Active' ? a.status !== 'Resolved' : a.status === 'Resolved'
  );

  return (
    <div style={styles.layout}>
      <LayoutContainer type="standard">
        <header style={styles.header}>
          <h1 style={styles.title}>Corrective Actions</h1>
          <p style={styles.subtitle}>Track and manage safety mitigations from identified hazards.</p>
        </header>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.filterGroup}>
              <button 
                style={activeTab === 'Active' ? styles.filterBtn : styles.filterBtnInactive}
                onClick={() => setActiveTab('Active')}
              >
                Active ({actions.filter(a => a.status !== 'Resolved').length})
              </button>
              <button 
                style={activeTab === 'Resolved' ? styles.filterBtn : styles.filterBtnInactive}
                onClick={() => setActiveTab('Resolved')}
              >
                Resolved ({actions.filter(a => a.status === 'Resolved').length})
              </button>
            </div>
          </div>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Site / Location</th>
                  <th style={styles.th}>Hazard Detail</th>
                  <th style={styles.th}>Priority</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}></th>
                </tr>
              </thead>
              <tbody>
                {filteredActions.length > 0 ? filteredActions.map((action) => (
                  <tr key={action.id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.siteText}>{action.site}</div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.hazardText}>{action.hazard}</div>
                    </td>
                    <td style={styles.td}>
                      <span style={{ 
                        ...styles.priorityBadge, 
                        background: action.priority === 'Critical' ? '#FEF2F2' : action.priority === 'High' ? '#FFFBEB' : '#F0F9FF',
                        color: action.priority === 'Critical' ? '#991B1B' : action.priority === 'High' ? '#92400E' : '#0369A1'
                      }}>
                        {action.priority}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.statusGroup}>
                        <div style={{ 
                          ...styles.statusDot, 
                          background: action.status === 'Pending' ? '#F97316' : action.status === 'In Progress' ? '#0284C7' : '#059669' 
                        }} />
                        <span style={styles.statusText}>{action.status}</span>
                      </div>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>
                      {action.status !== 'Resolved' && (
                        <button 
                          style={styles.actionBtn}
                          onClick={() => updateStatus(action.id)}
                        >
                          {action.status === 'Pending' ? 'Start' : 'Resolve'}
                        </button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} style={styles.emptyCell}>No actions found in this category.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </LayoutContainer>
    </div>
  );
}

const styles: any = {
  layout: { padding: '40px 0' },
  header: { marginBottom: '32px', borderLeft: '4px solid #F97316', paddingLeft: '20px' },
  title: { fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' },
  subtitle: { fontSize: '14px', color: '#64748B', margin: 0 },
  
  card: { 
    background: '#FFFFFF', 
    borderRadius: '16px', 
    border: '1px solid #E2E8F0', 
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
    overflow: 'hidden'
  },
  cardHeader: { padding: '20px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
  filterGroup: { display: 'flex', gap: '8px' },
  filterBtn: { background: '#0F172A', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
  filterBtnInactive: { background: '#F1F5F9', color: '#64748B', border: 'none', padding: '8px 20px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
  
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '16px 24px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#F8FAFC' },
  tr: { borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s' },
  td: { padding: '16px 24px', verticalAlign: 'middle' },
  
  siteText: { fontSize: '14px', fontWeight: 600, color: '#1E293B' },
  hazardText: { fontSize: '14px', color: '#64748B' },
  priorityBadge: { padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' },
  statusGroup: { display: 'flex', alignItems: 'center', gap: '8px' },
  statusDot: { width: '6px', height: '6px', borderRadius: '50%' },
  statusText: { fontSize: '13px', color: '#475569', fontWeight: 500 },
  actionBtn: { background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#0F172A', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' },
  emptyCell: { padding: '48px', textAlign: 'center', color: '#94A3B8', fontSize: '14px' },
};
