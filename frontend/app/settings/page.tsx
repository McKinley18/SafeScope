'use client';

import { useState } from 'react';
import { LayoutContainer } from '../components/LayoutContainer';

export default function UnifiedSettingsPage() {
  const [orgName, setOrgName] = useState('Sentinel Safety Operations');
  const [accountType] = useState('Enterprise'); 
  
  // 🔷 MOCK TEAM DATA
  const [team, setTeam] = useState([
    { id: 1, name: 'Chris McKinley', email: 'chris@sentinelsafety.com', role: 'Owner', status: 'Active' },
    { id: 2, name: 'Sarah Jenkins', email: 's.jenkins@company.com', role: 'Auditor', status: 'Active' },
    { id: 3, name: 'Marcus Chen', email: 'm.chen@company.com', role: 'Auditor', status: 'Active' },
    { id: 4, name: 'Elena Rodriguez', email: 'e.rod@company.com', role: 'Viewer', status: 'Pending' },
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Auditor');

  const handleInvite = () => {
    if (team.length >= 10) {
      alert('Seat limit reached. Upgrade for more seats.');
      return;
    }
    if (!inviteEmail) return;
    setTeam([...team, { 
      id: Date.now(), 
      name: 'Pending Invite', 
      email: inviteEmail, 
      role: inviteRole, 
      status: 'Pending' 
    }]);
    setInviteEmail('');
  };

  return (
    <div style={styles.layout}>
      <LayoutContainer type="standard">
        <header style={styles.header}>
          <h1 style={styles.title}>Account & Governance</h1>
          <p style={styles.subtitle}>Manage your organizational identity, team seats, and operational standards.</p>
        </header>

        <div style={styles.grid}>
          
          {/* SECTION: PLAN & SEATS */}
          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.sectionTitle}>Plan & Utilization</h2>
              <span style={styles.seatBadge}>{team.length} of 10 Seats Used</span>
            </div>
            <div style={styles.planStatus}>
              <div>
                <span style={styles.planLabel}>Active Plan</span>
                <p style={styles.planValue}>{accountType} Departmental</p>
              </div>
              <button style={styles.navyButtonSmall}>Upgrade Plan</button>
            </div>
          </section>

          {/* SECTION: TEAM HUB */}
          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.sectionTitle}>Team Hub (Employee Accounts)</h2>
              <p style={styles.sectionSubtitle}>Assign roles and manage access for your 10-seat department.</p>
            </div>

            <div style={styles.inviteSection}>
              <div style={styles.inviteRow}>
                <div style={{ flex: 2 }}>
                  <label style={styles.label}>Employee Work Email</label>
                  <input 
                    type="email" 
                    style={styles.input} 
                    placeholder="colleague@company.com" 
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>System Role</label>
                  <select style={styles.select} value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                    <option value="Auditor">Auditor (Field Entry)</option>
                    <option value="Viewer">Viewer (Read-Only)</option>
                  </select>
                </div>
                <button style={styles.primaryButton} onClick={handleInvite}>Send Invite</button>
              </div>
              <p style={styles.helpText}>Invitations grant access to your encrypted Shared Organizational Vault.</p>
            </div>

            <div style={styles.memberList}>
              {team.map((member) => (
                <div key={member.id} style={styles.memberRow}>
                  <div style={styles.memberInfo}>
                    <span style={styles.memberName}>{member.name}</span>
                    <span style={styles.memberEmail}>{member.email}</span>
                  </div>
                  <div style={styles.memberStatusCol}>
                    <span style={{ ...styles.roleBadge, background: member.role === 'Owner' ? '#0F172A' : '#F1F5F9', color: member.role === 'Owner' ? '#FFF' : '#475569' }}>
                      {member.role}
                    </span>
                    <span style={{ ...styles.statusDot, background: member.status === 'Active' ? '#22C55E' : '#EAB308' }} />
                  </div>
                  <button style={styles.textBtn}>Remove</button>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION: ORGANIZATION IDENTITY */}
          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.sectionTitle}>Organization Identity</h2>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Organization Name</label>
              <input type="text" style={styles.input} value={orgName} onChange={(e) => setOrgName(e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Primary Regulatory Standard</label>
              <select style={styles.select}>
                <option>MSHA (Mine Safety and Health)</option>
                <option>OSHA (General Industry)</option>
                <option>OSHA (Construction)</option>
              </select>
            </div>
          </section>
          
          {/* SECTION: PERSONAL PROFILE */}
          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.sectionTitle}>My Profile</h2>
            </div>
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>First Name</label>
                <input type="text" style={styles.input} defaultValue="Chris" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Last Name</label>
                <input type="text" style={styles.input} defaultValue="McKinley" />
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Password Management</label>
              <button style={{ ...styles.navyButtonSmall, width: '100%', marginTop: 8 }}>Update Security Credentials</button>
            </div>
          </section>

          <div style={styles.saveContainer}>
            <button style={styles.primaryButtonWide}>Save All Settings</button>
          </div>
        </div>
      </LayoutContainer>
    </div>
  );
}

const styles: any = {
  layout: { padding: '40px 0', background: '#F8FAFC', minHeight: '100vh' },
  header: { marginBottom: '40px', borderLeft: '4px solid #0369A1', paddingLeft: '20px' },
  title: { fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' },
  subtitle: { fontSize: '14px', color: '#64748B', margin: 0 },
  
  grid: { display: 'flex', flexDirection: 'column', gap: 24 },
  card: { background: '#FFFFFF', padding: '32px', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  sectionTitle: { fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 },
  sectionSubtitle: { fontSize: '13px', color: '#64748B', marginTop: 4 },

  seatBadge: { fontSize: '10px', fontWeight: 800, color: '#0369A1', background: '#E0F2FE', padding: '6px 12px', borderRadius: '20px', textTransform: 'uppercase' },
  planStatus: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', background: '#F8FAFC', padding: '20px', borderRadius: '12px', border: '1px solid #F1F5F9' },
  planLabel: { fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' },
  planValue: { fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '4px 0 0 0' },

  inviteSection: { marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid #F1F5F9' },
  inviteRow: { display: 'flex', gap: '16px', alignItems: 'flex-end' },
  memberList: { display: 'flex', flexDirection: 'column' },
  memberRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #F8FAFC' },
  memberInfo: { display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 },
  memberName: { fontSize: '14px', fontWeight: 700, color: '#1E293B' },
  memberEmail: { fontSize: '12px', color: '#64748B' },
  memberStatusCol: { display: 'flex', alignItems: 'center', gap: '12px', marginRight: '24px' },
  roleBadge: { fontSize: '10px', fontWeight: 700, padding: '4px 8px', borderRadius: '4px' },
  statusDot: { width: '8px', height: '8px', borderRadius: '50%' },

  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  formGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: 4 },
  input: { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '14px', background: '#F8FAFC', outline: 'none' },
  select: { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '14px', background: '#F8FAFC', outline: 'none' },
  
  primaryButton: { background: '#0F172A', color: '#FFFFFF', padding: '10px 24px', borderRadius: '10px', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '13px' },
  primaryButtonWide: { background: '#0369A1', color: '#FFFFFF', padding: '14px 48px', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '14px', width: '280px', boxShadow: '0 4px 6px -1px rgba(3, 105, 161, 0.2)' },
  navyButtonSmall: { background: '#0F172A', color: '#FFFFFF', padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '12px' },
  textBtn: { background: 'none', border: 'none', color: '#DC2626', fontSize: '12px', fontWeight: 700, cursor: 'pointer' },
  saveContainer: { display: 'flex', justifyContent: 'center', marginTop: '16px', paddingBottom: '40px' },
  helpText: { fontSize: '11px', color: '#94A3B8', marginTop: '12px' },
};
