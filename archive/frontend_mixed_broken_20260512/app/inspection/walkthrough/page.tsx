"use client";

'use client';

import Link from 'next/link';
import { useUser } from '../../../lib/UserContext';
import { useState, useEffect } from 'react';
import { LayoutContainer } from '../../components/LayoutContainer';
import { secureStorage } from '../../../lib/storage';
import { useOfflineStatus } from '../../../lib/useOfflineStatus';
import { localExporter } from '../../../lib/localExporter';

const steps = [
  { title: 'Step 1: Identify Hazards', desc: 'Document hazards observed during inspection.' },
  { title: 'Step 2: Take Photos', desc: 'Upload or capture evidence of the hazard.' },
  { title: 'Step 3: Regulation', desc: 'SafeScope AI mapping to regulatory standards.' },
  { title: 'Step 4: Risk Assessment', desc: 'Assign risk based on likelihood and severity.' },
  { title: 'Step 5: Corrective Actions', desc: 'What actions are required to mitigate this hazard?' },
  { title: 'Step 6: Review & Finalize', desc: 'Review findings and finalize your local report.' },
];

export default function WalkthroughPage() {
  const isOffline = useOfflineStatus();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [reportDensity, setReportDensity] = useState<'single' | 'multiple'>('single');
  const [findings, setFindings] = useState<any[]>([]);
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [currentData, setCurrentData] = useState({ 
    category: '', description: '', photos: [] as string[], likelihood: 0, severity: 0, action: '' 
  });
  const [isHydrated, setIsHydrated] = useState(false);

  const step = steps[currentStep - 1];

  // 🔷 HYDRATE STATE FROM ENCRYPTED STORAGE
  useEffect(() => {
    async function loadSavedData() {
      const saved = await secureStorage.getInspection('current-walkthrough');
      if (saved) {
        setFindings(saved.findings || []);
        setAdminInfo(saved.adminInfo || null);
        setCurrentData(saved.currentData || { category: '', description: '', photos: [], likelihood: 0, severity: 0, action: '' });
        setCurrentStep(saved.currentStep || 1);
      }
      setIsHydrated(true);
    }
    loadSavedData();
  }, []);

  // 🔷 AUTO-SAVE TO ENCRYPTED STORAGE ON CHANGE
  useEffect(() => {
    if (isHydrated) {
      secureStorage.saveInspection('current-walkthrough', {
        findings,
        adminInfo,
        currentData,
        currentStep,
        lastUpdated: new Date().toISOString()
      });
    }
  }, [findings, adminInfo, currentData, currentStep, isHydrated]);

  const handlePhotoUpload = (e: any) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map(file => URL.createObjectURL(file as Blob));
    setCurrentData(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] as string[] }));
  };

  const handleFinishFinding = () => {
    setFindings([...findings, currentData]);
    setCurrentData({ category: '', description: '', photos: [], likelihood: 0, severity: 0, action: '' });
    setCurrentStep(1);
  };

  // 🔷 LOCAL EXPORT ACTIONS
  const handleExportPDF = () => {
    localExporter.generatePDF({ adminInfo, findings }, { findingsPerPage: reportDensity });
  };

  const handlePreviewPDF = () => {
    localExporter.previewPDF({ adminInfo, findings }, { findingsPerPage: reportDensity });
  };

  const handleExportData = () => {
    localExporter.exportDataFile({ adminInfo, findings });
  };

  if (!isHydrated) return null;

  return (
    <div style={{ ...styles.layout, animation: 'fadeIn 0.5s ease-out' }}>
      <LayoutContainer type="standard">
        <header style={styles.header}>
          <div style={styles.headerTop}>
            <h1 style={styles.title}>{step.title}</h1>
            {isOffline && <span style={styles.offlineIndicator}>Local Mode Active</span>}
          </div>
          <p style={styles.subtitle}>{step.desc}</p>
        </header>
        
        <div style={styles.progressBar}>
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div key={s} style={{ ...styles.progressSegment, background: s <= currentStep ? '#F97316' : '#E2E8F0' }} />
          ))}
        </div>

        <div style={styles.card}>
          {currentStep === 1 && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>Hazard Category</label>
                <select style={styles.select} value={currentData.category} onChange={(e) => setCurrentData({...currentData, category: e.target.value})}>
                  <option value="">Select a category...</option>
                  <option value="Slip, Trip, and Fall">Slip, Trip, and Fall</option>
                  <option value="Fall from Heights">Fall from Heights</option>
                  <option value="Electrical Hazard">Electrical Hazard</option>
                  <option value="Machine Guarding">Machine Guarding</option>
                  <option value="PPE Violation">PPE Violation</option>
                  <option value="Chemical Exposure">Chemical Exposure</option>
                  <option value="Fire Safety">Fire Safety</option>
                  <option value="Lockout/Tagout (LOTO)">Lockout/Tagout (LOTO)</option>
                  <option value="Confined Space">Confined Space</option>
                  <option value="Ergonomic Hazard">Ergonomic Hazard</option>
                  <option value="Noise Exposure">Noise Exposure</option>
                  <option value="Vehicle/Traffic Safety">Vehicle/Traffic Safety</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Other">Other / Not Listed</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Hazard Description</label>
                <textarea style={styles.textarea} value={currentData.description} onChange={(e) => setCurrentData({...currentData, description: e.target.value})} placeholder="Describe the hazard observed..." />
              </div>
            </>
          )}

          {currentStep === 2 && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Evidence Photos</label>
              <div style={styles.photoActionRow}>
                <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} style={{ display: 'none' }} id="photo-upload" />
                <label htmlFor="photo-upload" style={styles.photoActionBox}>
                  <div style={styles.iconCircle}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>
                  <span style={styles.photoActionText}>Gallery</span>
                </label>

                <input type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} style={{ display: 'none' }} id="camera-upload" />
                <label htmlFor="camera-upload" style={styles.photoActionBox}>
                  <div style={styles.iconCircle}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  </div>
                  <span style={styles.photoActionText}>Camera</span>
                </label>
              </div>
              <div style={styles.photoGrid}>
                {currentData.photos.map((url, i) => <img key={i} src={url} style={styles.thumbnail} />)}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div style={styles.formGroup}>
              <div style={styles.aiHeaderRow}>
                <label style={styles.label}>SafeScope AI Standard Mapping</label>
                {(currentData.description && user?.type !== 'individual') && <span style={styles.confidenceBadge}>92% Match</span>}
              </div>
              
              {user?.type === 'individual' ? (
                <div style={{ ...styles.aiCard, borderColor: '#F97316', background: '#FFF7ED' }}>
                  <h3 style={{ fontSize: '15px', color: '#9A3412', marginBottom: '8px' }}>🚀 Pro-Grade Feature Gated</h3>
                  <p style={{ ...styles.aiText, color: '#9A3412' }}>
                    Automated regulatory mapping is a Pro/Enterprise feature. 
                    <Link href="/pricing" style={{ color: '#C2410C', fontWeight: 800, marginLeft: '6px' }}>Upgrade to unlock unlimited SafeScope AI matches.</Link>
                  </p>
                </div>
              ) : (
                currentData.description ? (
                  <div style={styles.aiCard}>
                    <div style={styles.aiCardInner}>
                      <div style={styles.aiCode}>MSHA 56.11002</div>
                      <div style={styles.aiFeedback}>
                        <button style={styles.feedbackBtn}>👍</button>
                        <button style={styles.feedbackBtn}>👎</button>
                      </div>
                    </div>
                    <p style={styles.aiText}>Handrails and toeboards shall be provided on all high-exposed areas where person could fall.</p>
                    <p style={styles.aiDisclaimer}>Disclaimer: SafeScope AI suggestions must be verified by a qualified professional.</p>
                  </div>
                ) : (
                  <div style={styles.emptyAiBox}>
                    <p style={styles.emptyText}>Please provide a hazard description in Step 1 to generate AI standard suggestions.</p>
                  </div>
                )
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={styles.label}>Likelihood of Occurrence</label>
                <select style={styles.select} value={currentData.likelihood} onChange={(e) => setCurrentData({...currentData, likelihood: parseInt(e.target.value)})}>
                  <option value="0">Select likelihood...</option>
                  <option value="1">1 - Rare</option>
                  <option value="2">2 - Unlikely</option>
                  <option value="3">3 - Possible</option>
                  <option value="4">4 - Likely</option>
                  <option value="5">5 - Almost Certain</option>
                </select>
              </div>

              <div>
                <label style={styles.label}>Severity of Impact</label>
                <select style={styles.select} value={currentData.severity} onChange={(e) => setCurrentData({...currentData, severity: parseInt(e.target.value)})}>
                  <option value="0">Select severity...</option>
                  <option value="1">1 - Insignificant</option>
                  <option value="2">2 - Minor</option>
                  <option value="3">3 - Moderate</option>
                  <option value="4">4 - Major</option>
                  <option value="5">5 - Catastrophic</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
                <button style={styles.textBtn} onClick={() => setIsMatrixOpen(!isMatrixOpen)}>
                  {isMatrixOpen ? 'Hide Risk Matrix' : 'View Risk Matrix'}
                </button>
              </div>

              {isMatrixOpen && (
                <div className="animate-fade-in">
                  <div style={styles.matrixWrapper}>
                    <div style={styles.matrixLabelVertical}>SEVERITY</div>
                    <div style={styles.matrixColumn}>
                      <h3 style={styles.matrixTitle}>Risk Matrix</h3>
                      <div style={styles.matrixGrid}>
                        {[5, 4, 3, 2, 1].map((s) => (
                          <div key={s} style={styles.matrixRow}>
                            {[1, 2, 3, 4, 5].map((l) => {
                              const score = l * s;
                              let color = '#22c55e';
                              if (score >= 5) color = '#eab308';
                              if (score >= 13) color = '#f97316';
                              if (score >= 21) color = '#ef4444';
                              const isActive = currentData.likelihood === l && currentData.severity === s;
                              return (
                                <div key={l} style={{
                                  ...styles.matrixCell,
                                  background: color,
                                  border: isActive ? '2px solid #0F172A' : '0.5px solid rgba(255,255,255,0.1)',
                                  opacity: isActive ? 1 : 0.4,
                                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                                  zIndex: isActive ? 10 : 1,
                                }}>{score}</div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                      <div style={styles.matrixLabelHorizontal}>LIKELIHOOD</div>
                    </div>
                  </div>
                </div>
              )}

              <div style={styles.riskDisplayBox}>
                <div style={styles.riskHeader}>
                  <span style={styles.riskTitle}>Calculated Risk Score</span>
                  <span style={{ ...styles.riskValue, color: (currentData.likelihood * currentData.severity) > 12 ? '#DC2626' : '#0F172A' }}>
                    {currentData.likelihood * currentData.severity || 0}
                  </span>
                </div>
                <div style={styles.rangeGrid}>
                  <div style={{...styles.rangeItem, color: '#059669'}}>1-4 L</div>
                  <div style={{...styles.rangeItem, color: '#D97706'}}>5-12 M</div>
                  <div style={{...styles.rangeItem, color: '#EA580C'}}>13-20 H</div>
                  <div style={{...styles.rangeItem, color: '#DC2626'}}>21-25 C</div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Corrective Actions</label>
              <textarea style={styles.textarea} value={currentData.action} onChange={(e) => setCurrentData({...currentData, action: e.target.value})} placeholder="Detailed mitigation plan..." />
            </div>
          )}

          {currentStep === 6 && (
            <div>
              {findings.length > 0 ? (
                findings.map((f, i) => (
                  <div key={i} style={styles.findingCard}>
                    <div>
                      <div style={styles.findingHeader}>{f.category}</div>
                      <div style={styles.findingDesc}>{f.description.substring(0, 60)}...</div>
                    </div>
                    <div style={styles.findingActions}>
                      <button style={styles.textBtn}>Edit</button>
                      <button style={{ ...styles.textBtn, color: '#EF4444' }} onClick={() => setFindings(findings.filter((_, idx) => idx !== i))}>Delete</button>
                    </div>
                  </div>
                ))
              ) : (
                <p style={styles.emptyText}>No findings recorded yet.</p>
              )}
              
              <div style={styles.reviewActions}>
                <button style={styles.secondaryButton} onClick={() => { setCurrentData({ category: '', description: '', photos: [], likelihood: 0, severity: 0, action: '' }); setCurrentStep(1); }}>
                  + New Finding
                </button>
                <div style={styles.divider} />
                <h3 style={styles.subSectionTitle}>Report Configuration</h3>
                <div style={styles.toggleGroup}>
                  <button 
                    style={{ ...styles.toggleBtn, background: reportDensity === 'single' ? '#0F172A' : '#FFF', color: reportDensity === 'single' ? '#FFF' : '#0F172A' }}
                    onClick={() => setReportDensity('single')}
                  >
                    1 Finding Per Page
                  </button>
                  <button 
                    style={{ ...styles.toggleBtn, background: reportDensity === 'multiple' ? '#0F172A' : '#FFF', color: reportDensity === 'multiple' ? '#FFF' : '#0F172A' }}
                    onClick={() => setReportDensity('multiple')}
                  >
                    Multiple Per Page
                  </button>
                </div>

                <div style={styles.divider} />
                <h3 style={styles.subSectionTitle}>Finalize & Export</h3>
                <p style={styles.helpTextGray}>Review your summary and generate the official executive report locally.</p>
                <div style={styles.exportButtonGroup}>
                  <button style={styles.secondaryButton} onClick={handlePreviewPDF}>
                    Preview Report
                  </button>
                  <button style={styles.primaryButton} onClick={handleExportPDF}>
                    Save PDF Report
                  </button>
                </div>

                <div style={styles.divider} />
                <h3 style={styles.subSectionTitle}>Secure Data Portability</h3>
                <p style={styles.helpTextGray}>
                  Export your raw inspection data as an encrypted .json file. 
                  <strong> To generate a PDF report from this file later:</strong> simply re-import it via the 'Resume from Backup' tool on the Start Inspection page.
                </p>
                <button style={{ ...styles.navyButton, marginTop: 12 }} onClick={handleExportData}>
                  Export Secure Backup (.json)
                </button>
              </div>
            </div>
          )}

          <div style={styles.footerActions}>
            <button style={styles.secondaryButton} onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} disabled={currentStep === 1}>Back</button>
            {currentStep < 6 && (
              <button 
                style={styles.primaryButton} 
                onClick={() => {
                  if (currentStep === 5) handleFinishFinding();
                  setCurrentStep(Math.min(6, currentStep + 1));
                }}
              >
                {currentStep === 5 ? 'Review Finding' : 'Next'}
              </button>
            )}
          </div>
        </div>

        {/* PROGRESSIVE PREVIEW */}
        {currentStep >= 2 && currentStep < 6 && (
          <div style={styles.previewCard}>
            <div style={styles.previewHeader}>
              <span style={styles.previewTitle}>Finding Preview</span>
              <span style={styles.previewIndex}>Finding #{findings.length + 1}</span>
            </div>
            <div style={styles.previewBody}>
              <p style={styles.previewText}><strong>Category:</strong> {currentData.category || 'Pending'}</p>
              <p style={styles.previewText}><strong>Summary:</strong> {currentData.description || 'Pending'}</p>
              {currentStep >= 4 && <p style={styles.previewText}><strong>Regulation:</strong> MSHA 56.11002</p>}
              {currentStep >= 5 && <p style={styles.previewText}><strong>Risk Score:</strong> {currentData.likelihood * currentData.severity || 0}</p>}
            </div>
          </div>
        )}
      </LayoutContainer>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const styles: any = {
  layout: { padding: '24px 0', background: '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  page: { maxWidth: 800, margin: '0 auto', padding: '0 16px', flex: 1 },
  header: { marginBottom: '32px', borderLeft: '4px solid #F97316', paddingLeft: '20px' },
  headerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' },
  title: { fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0 },
  offlineIndicator: { fontSize: '11px', fontWeight: 700, color: '#0369A1', background: '#E0F2FE', padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase' },
  subtitle: { fontSize: '14px', color: '#64748B', margin: 0 },
  
  progressBar: { display: 'flex', gap: '8px', marginBottom: '32px' },
  progressSegment: { flex: 1, height: '6px', borderRadius: '3px', transition: 'background 0.3s ease' },
  
  card: { background: '#FFFFFF', padding: '32px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' },
  formGroup: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: -4 },
  input: { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '14px', background: '#F8FAFC', marginTop: 4 },
  select: { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '14px', background: '#F8FAFC', marginTop: 4 },
  textarea: { width: '100%', minHeight: '180px', padding: '12px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '14px', background: '#F8FAFC', lineHeight: '1.6', marginTop: 4 },
  
  photoActionRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: 8 },
  photoActionBox: { background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
  iconCircle: { width: '40px', height: '40px', borderRadius: '50%', background: '#F1F5F9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  photoActionText: { fontSize: '12px', fontWeight: 600, color: '#475569' },
  photoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '12px', marginTop: '16px' },
  thumbnail: { width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' },
  
  aiHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  confidenceBadge: { fontSize: '11px', fontWeight: 700, color: '#059669', background: '#DCFCE7', padding: '4px 10px', borderRadius: '20px' },
  aiCard: { background: '#F8FAFC', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' },
  aiCardInner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  aiCode: { fontSize: '16px', fontWeight: 800, color: '#0369A1' },
  aiFeedback: { display: 'flex', gap: 12 },
  feedbackBtn: { background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '16px' },
  aiText: { fontSize: '14px', lineHeight: '1.6', color: '#334155', margin: 0 },
  aiDisclaimer: { fontSize: '11px', color: '#64748B', marginTop: '16px', fontStyle: 'italic' },
  emptyAiBox: { background: '#F8FAFC', padding: '32px', borderRadius: '16px', border: '1px dashed #E2E8F0', textAlign: 'center' },
  
  helpTextGray: { fontSize: '12px', color: '#64748B', marginBottom: '8px', marginTop: 4 },
  matrixWrapper: { display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'center', marginTop: '12px', padding: '0px' },
  matrixColumn: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  matrixTitle: { fontSize: '12px', fontWeight: 700, color: '#64748B', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  matrixGrid: { display: 'flex', flexDirection: 'column', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden' },
  matrixRow: { display: 'flex' },
  matrixCell: { width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: '#fff' },
  matrixLabelVertical: { writingMode: 'vertical-lr', transform: 'rotate(180deg)', fontSize: '10px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.1em' },
  matrixLabelHorizontal: { fontSize: '10px', fontWeight: 700, color: '#94A3B8', marginTop: '12px', letterSpacing: '0.1em' },
  
  riskDisplayBox: { background: '#F8FAFC', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0', marginTop: '12px' },
  riskHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  riskTitle: { fontSize: '14px', fontWeight: 700, color: '#1E293B' },
  riskValue: { fontSize: '24px', fontWeight: 800 },
  rangeGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '16px', borderTop: '1px solid #F1F5F9', paddingTop: '12px' },
  rangeItem: { fontSize: '10px', fontWeight: 700, textAlign: 'center', textTransform: 'uppercase' },

  footerActions: { display: 'flex', gap: '12px', marginTop: 32 },
  primaryButton: { background: '#0284C7', color: '#FFFFFF', padding: '12px 24px', borderRadius: '10px', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '14px', flex: 1, boxShadow: '0 4px 6px -1px rgba(2, 132, 199, 0.2)', textAlign: 'center' },
  secondaryButton: { background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', padding: '12px 24px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '14px', flex: 1, textAlign: 'center' },
  navyButton: { background: '#0F172A', color: '#FFFFFF', padding: '12px 24px', borderRadius: '10px', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '14px', flex: 1, textAlign: 'center' },

  reviewActions: { marginTop: '32px', paddingTop: '32px', borderTop: '2px solid #F1F5F9' },
  divider: { height: '1px', background: '#F1F5F9', margin: '24px 0' },
  subSectionTitle: { fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' },
  toggleGroup: { display: 'flex', borderRadius: '10px', overflow: 'hidden', border: '1px solid #E2E8F0', marginBottom: '16px' },
  toggleBtn: { flex: 1, padding: '10px', border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' },
  exportButtonGroup: { display: 'flex', gap: '12px', marginTop: '16px' },

  previewCard: { marginTop: '24px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' },
  previewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' },
  previewTitle: { fontSize: '13px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' },
  previewIndex: { fontSize: '11px', fontWeight: 700, color: '#0369A1', background: '#E0F2FE', padding: '4px 10px', borderRadius: '20px' },
  previewBody: { display: 'flex', flexDirection: 'column', gap: '8px' },
  previewText: { fontSize: '14px', color: '#1E293B', margin: 0 },
  
  findingCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: 12 },
  findingHeader: { fontSize: '14px', fontWeight: 700, color: '#0F172A' },
  findingDesc: { fontSize: '13px', color: '#64748B' },
  findingActions: { display: 'flex', gap: '16px' },
  textBtn: { background: 'none', border: 'none', color: '#0369A1', fontSize: '13px', fontWeight: 600, cursor: 'pointer' },
  emptyText: { textAlign: 'center', color: '#94A3B8', fontSize: '14px', margin: '40px 0' },
};
