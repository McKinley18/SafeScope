"use client";

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutContainer } from '../../components/LayoutContainer';
import { secureStorage } from '../../../lib/storage';

export default function StartInspectionPage() {
  const [formData, setFormData] = useState({
    company: '',
    site: '',
    inspector: '',
    date: new Date().toISOString().split('T')[0],
    isConfidential: false
  });
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();

  // 🔷 HYDRATE STATE FROM ENCRYPTED STORAGE
  useEffect(() => {
    async function loadSavedData() {
      const saved = await secureStorage.getInspection('current-walkthrough');
      if (saved && saved.adminInfo) {
        setFormData(saved.adminInfo);
      }
      setIsHydrated(true);
    }
    loadSavedData();
  }, []);

  // 🔷 IMPORT BACKUP LOGIC
  const handleImportBackup = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        
        // Basic Validation
        if (!importedData.findings || !importedData.adminInfo) {
          alert('Invalid Sentinel Backup File.');
          return;
        }

        // Restore to local encrypted storage
        await secureStorage.saveInspection('current-walkthrough', {
          ...importedData,
          lastUpdated: new Date().toISOString()
        });

        alert('Backup Restored Successfully.');
        // Redirect to Step 6 for finalization
        window.location.href = '/inspection/walkthrough';
      } catch (err) {
        alert('Error reading backup file.');
      }
    };
    reader.readAsText(file);
  };

  const updateField = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    
    // Auto-save to same object used by walkthrough
    secureStorage.getInspection('current-walkthrough').then(saved => {
      secureStorage.saveInspection('current-walkthrough', {
        ...(saved || {}),
        adminInfo: newData,
        lastUpdated: new Date().toISOString()
      });
    });
  };

  if (!isHydrated) return null;

  return (
    <div style={styles.layout}>
      <LayoutContainer type="standard">
        <header style={styles.header}>
          <h1 style={styles.title}>Administrative Information</h1>
          <p style={styles.subtitle}>
            Define the core parameters for this inspection to populate the C-suite report cover page.
          </p>
        </header>

        <div style={styles.card}>
          {/* 🔷 RESUME FROM BACKUP SECTION */}
          <div style={styles.importBox}>
            <h3 style={styles.subSectionTitle}>Resume from Backup</h3>
            <p style={styles.helpTextGray}>Restore a previously exported .json file to continue your walkthrough or generate a PDF report.</p>
            <input type="file" accept=".json" onChange={handleImportBackup} style={{ display: 'none' }} id="import-json" />
            <label htmlFor="import-json" style={styles.secondaryButtonSmall}>Import Secure Backup</label>
          </div>

          <div style={styles.divider} />

          <h3 style={styles.subSectionTitle}>Start New Walkthrough</h3>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Company / Organization</label>
            <input type="text" style={styles.input} value={formData.company} onChange={(e) => updateField('company', e.target.value)} placeholder="e.g. Sentinel Safety Operations" />
          </div>
          
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Site Location</label>
              <select style={styles.select} value={formData.site} onChange={(e) => updateField('site', e.target.value)}>
                <option value="">Select a site...</option>
                <option value="Warehouse North">Warehouse North</option>
                <option value="Plant East">Plant East</option>
                <option value="Distribution Center South">Distribution Center South</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Inspection Date</label>
              <input type="date" style={styles.input} value={formData.date} onChange={(e) => updateField('date', e.target.value)} />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Lead Inspector</label>
            <input type="text" style={styles.input} value={formData.inspector} onChange={(e) => updateField('inspector', e.target.value)} placeholder="Full name of lead inspector" />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Additional Inspectors</label>
            <div style={{ display: 'flex', gap: '8px', marginTop: 4 }}>
              <input type="text" style={{ ...styles.input, marginTop: 0 }} placeholder="Name of additional inspector" />
              <button style={styles.navyButtonSmall}>Add</button>
            </div>
            <p style={styles.helpTextGray}>List any other personnel participating in this walkthrough.</p>
          </div>

          <div style={styles.divider} />

          <div style={styles.checkboxGroup}>
            <input 
              type="checkbox" 
              id="confidential" 
              checked={formData.isConfidential} 
              onChange={(e) => updateField('isConfidential', e.target.checked)} 
              style={styles.checkbox}
            />
            <div style={styles.checkboxText}>
              <label htmlFor="confidential" style={styles.checkboxLabel}>Mark as "Privileged & Confidential"</label>
              <p style={styles.helpTextRed}>This will apply a high-visibility red header to every page of the generated PDF.</p>
            </div>
          </div>

          <div style={styles.footerActions}>
            <button 
              style={styles.primaryButton}
              onClick={() => window.location.href = '/inspection/walkthrough'}
            >
              Continue to Walkthrough
            </button>
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
  
  importBox: { background: '#F8FAFC', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '8px' },
  subSectionTitle: { fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '12px' },
  secondaryButtonSmall: { display: 'inline-block', background: '#FFFFFF', color: '#0F172A', padding: '10px 24px', borderRadius: '8px', border: '1px solid #E2E8F0', fontWeight: 700, cursor: 'pointer', fontSize: '13px', marginTop: '4px' },

  card: { 
    background: '#FFFFFF', 
    padding: '32px', 
    borderRadius: '16px', 
    border: '1px solid #E2E8F0', 
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
  },
  
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  formGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: -4 },
  input: { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '14px', background: '#F8FAFC', marginTop: 4 },
  select: { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '14px', background: '#F8FAFC', marginTop: 4 },
  
  divider: { height: '1px', background: '#F1F5F9', margin: '24px 0' },
  
  checkboxGroup: { display: 'flex', gap: '12px', background: '#FFFBFB', padding: '16px', borderRadius: '12px', border: '1px solid #FEE2E2' },
  checkbox: { marginTop: '4px', cursor: 'pointer', width: '18px', height: '18px' },
  checkboxText: { display: 'flex', flexDirection: 'column', gap: '2px' },
  checkboxLabel: { fontSize: '14px', fontWeight: 700, color: '#991B1B', cursor: 'pointer' },
  helpTextRed: { fontSize: '12px', color: '#B91C1C', margin: 0 },
  
  footerActions: { display: 'flex', justifyContent: 'center', marginTop: '32px' },
  primaryButton: { background: '#0369A1', color: '#FFFFFF', padding: '14px 48px', borderRadius: '12px', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 6px -1px rgba(3, 105, 161, 0.2)' },
  navyButtonSmall: { background: '#0F172A', color: '#FFFFFF', padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '12px' },
  helpTextGray: { fontSize: '12px', color: '#64748B', marginTop: 4 },
};
