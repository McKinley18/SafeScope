'use client';

import Link from 'next/link';
import { LayoutContainer } from '../components/LayoutContainer';

const plans = [
  {
    id: 'individual',
    name: 'Basic',
    price: '$0',
    term: 'Free Forever',
    features: [
      '5 SafeScope AI standard matches per month',
      'Basic inspection templates & cloud syncing',
      'Individual practitioner dashboard access',
      'Standard community support'
    ],
    note: 'Perfect for initial evaluation.'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$99',
    term: 'One-Time Payment',
    features: [
      'Unlimited SafeScope AI regulatory mapping',
      'Full Leading Indicator Suite (MMT, RER, Sigma)',
      'Scientific SPC & RPN Hazard Mapping',
      'AES-GCM Encrypted Offline Field Mode',
      'Professional C-Suite PDF report generation'
    ],
    note: 'The Strategic Asset. No recurring fees.'
  },
  {
    id: 'company',
    name: 'Enterprise',
    price: '$149',
    term: 'Per Month (10 Seats)',
    features: [
      '10 Full-access departmental seats',
      'Organizational Benchmarking (Site Ranking)',
      'Cultural Analytics (APD, SAFR, HRR)',
      'Encrypted Shared Organizational Vault',
      'Team-wide action tracking & MMT monitoring'
    ],
    note: 'Complete departmental governance.'
  }
];

export default function PricingPage() {
  return (
    <div style={styles.layout}>
      <LayoutContainer type="compact">
        {/* 🔷 STAGE 1: THE HIGH-STAKES HOOK */}
        <header style={styles.header}>
          <div style={styles.badge}>Scientific Safety Intelligence</div>
          <h1 style={styles.title}>Stop Paying the "Safety Tax" on Your Time.</h1>
          <p style={styles.subtitle}>
            Traditional auditing is a sinkhole of administrative friction and compliance risk. 
            Sentinel Safety replaces the paperwork "tax" with automated, defensible intelligence.
          </p>
        </header>

        {/* 🔷 STAGE 2: THE PROBLEM (PAIN POINTS) */}
        <section style={styles.problemSection}>
          <h2 style={styles.sectionTitle}>The High Cost of Status Quo</h2>
          <div style={styles.problemGrid}>
            <div style={styles.problemItem}>
              <h4 style={styles.problemTitle}>Administrative Lag</h4>
              <p style={styles.problemDesc}>Hours wasted transcribing field notes into reports. By the time it reaches the office, the hazard has already evolved.</p>
            </div>
            <div style={styles.problemItem}>
              <h4 style={styles.problemTitle}>Regulatory Exposure</h4>
              <p style={styles.problemDesc}>Inconsistent standard mapping leaves you vulnerable to MSHA/OSHA fines and legal liability.</p>
            </div>
          </div>
        </section>

        {/* 🔷 STAGE 3: THE SCIENTIFIC "WHY" */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>The Science of Prevention</h2>
          <div style={styles.scienceHighlight}>
            <div style={styles.scienceBlock}>
              <h3 style={styles.capabilityTitle}>Beyond the Checklist</h3>
              <p style={styles.capabilityDesc}>
                Checklists are reactive. Sentinel Safety uses <strong>Leading Indicators</strong> to predict failure before it occurs. 
                Our platform calculates mathematical probability based on real-time organizational performance.
              </p>
            </div>

            <div style={styles.statsExplainerGrid}>
              <div style={styles.statExplanation}>
                <strong style={styles.statLabelMini}>Mean Mitigation Time (MMT)</strong>
                <p style={styles.statDescMini}>Quantifies responsiveness. A rising MMT is a scientific early-warning signal of an imminent incident.</p>
              </div>
              <div style={styles.statExplanation}>
                <strong style={styles.statLabelMini}>Statistical Variance (Sigma)</strong>
                <p style={styles.statDescMini}>Differentiates random noise from systemic failure. Deviations above +3σ identify processes out of control.</p>
              </div>
              <div style={styles.statExplanation}>
                <strong style={styles.statLabelMini}>Risk Reduction Velocity (RRV)</strong>
                <p style={styles.statDescMini}>Measures the speed of hazard removal. This is the only "True ROI" metric for a safety department.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 🔷 STAGE 4: THE INTELLIGENCE SOLUTION (WORKFLOW) */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>The Sentinel Advantage</h2>
          <div style={styles.capabilityList}>
            <div style={styles.capabilityBlock}>
              <h3 style={styles.capabilityTitle}>Rapid Field Documentation</h3>
              <p style={styles.capabilityDesc}>
                Capture hazards and evidence in seconds. Our local-first architecture ensures 
                zero lag, even in high-security zones with no connectivity.
              </p>
            </div>

            <div style={styles.capabilityBlock}>
              <h3 style={styles.capabilityTitle}>SafeScope AI: Your Regulatory Shield</h3>
              <p style={styles.capabilityDesc}>
                SafeScope correlates findings to regulatory standards 
                using characteristic-based mapping, providing a defensible audit trail.
              </p>
              <div style={styles.processSteps}>
                <span style={styles.stepTag}>IDENTIFY</span>
                <span style={styles.stepArrow}>→</span>
                <span style={styles.stepTag}>SAFE-SCOPE AI</span>
                <span style={styles.stepArrow}>→</span>
                <span style={styles.stepTag}>DEFENSIBLE PDF</span>
              </div>
            </div>
          </div>
        </section>

        {/* 🔷 STAGE 5: STRATEGIC ROI (LIFETIME ASSET) */}
        <section style={styles.comparisonSection}>
          <h2 style={styles.sectionTitle}>An Asset, Not a Recurring Expense</h2>
          <p style={styles.compText}>
            Sentinel Safety Pro is a <strong>Strategic Asset</strong>. One payment. Lifetime intelligence. 
            Stop paying recurring industry subscriptions.
          </p>
          
          <div style={styles.roiBox}>
            <div style={styles.roiHeader}>
              <span style={styles.roiTitle}>5-Year Ownership Cost Analysis</span>
            </div>
            <div style={styles.roiGrid}>
              <div style={styles.roiItem}>
                <span style={styles.roiLabel}>Sentinel Pro</span>
                <span style={styles.roiValue}>$99</span>
                <span style={styles.roiSub}>Total Investment</span>
              </div>
              <div style={styles.roiItem}>
                <span style={styles.roiLabelAlt}>Industry Average</span>
                <span style={styles.roiValueAlt}>$1,200+</span>
                <span style={styles.roiSub}>Accumulated Fees</span>
              </div>
            </div>
          </div>
        </section>

        {/* 🔷 STAGE 6: THE CHOICE */}
        <section style={styles.sectionNoMargin}>
          <h2 style={styles.sectionTitle}>Select Your Intelligence Tier</h2>
          <div style={styles.planStack}>
            {plans.map((plan) => (
              <div key={plan.id} style={styles.planOption}>
                <div style={styles.planHeader}>
                  <div style={styles.planInfo}>
                    <h3 style={styles.planName}>{plan.name}</h3>
                    <p style={styles.planNote}>{plan.note}</p>
                  </div>
                  <div style={styles.planPricing}>
                    <span style={styles.planPrice}>{plan.price}</span>
                    <span style={styles.planTerm}>{plan.term}</span>
                  </div>
                </div>
                
                <div style={styles.detailBox}>
                  <ul style={styles.featureList}>
                    {plan.features.map((f, i) => (
                      <li key={i} style={styles.featureItem}>
                        <span style={styles.bullet}>•</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  
                  <Link 
                    href={`/create-account?plan=${plan.id}`} 
                    style={styles.proceedButton}
                  >
                    Initialize {plan.name} Account →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={styles.footerNav}>
          <span style={styles.footerBaseText}>Already have an account? </span>
          <Link href="/login" style={styles.loginLink}>Sign In</Link>
        </div>
      </LayoutContainer>
    </div>
  );
}

const styles: any = {
  layout: { padding: '32px 0', background: '#F8FAFC', minHeight: '100vh' },
  header: { marginBottom: '40px', textAlign: 'left', padding: '0 20px' },
  badge: { display: 'inline-block', fontSize: '11px', fontWeight: 800, color: '#F97316', background: 'rgba(249, 115, 22, 0.1)', padding: '6px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' },
  title: { fontSize: '28px', fontWeight: 800, color: '#0F172A', marginBottom: '12px', lineHeight: '1.2' },
  subtitle: { fontSize: '15px', color: '#64748B', margin: 0, lineHeight: '1.6', fontWeight: 500 },
  
  section: { marginBottom: '40px' },
  sectionNoMargin: { marginBottom: '0px' },
  sectionTitle: { fontSize: '12px', fontWeight: 800, color: '#94A3B8', marginBottom: '20px', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.15em', padding: '0 20px' },
  
  problemSection: { marginBottom: '40px', padding: '0 20px' },
  problemGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' },
  problemItem: { padding: '16px', background: '#FFF', borderRadius: '16px', border: '1px solid #F1F5F9' },
  problemTitle: { fontSize: '13px', fontWeight: 800, color: '#991B1B', marginBottom: '6px' },
  problemDesc: { fontSize: '12px', color: '#64748B', lineHeight: '1.5', margin: 0 },

  scienceHighlight: { padding: '0 20px' },
  scienceBlock: { marginBottom: '24px', borderLeft: '3px solid #0369A1', paddingLeft: '20px' },
  capabilityTitle: { fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' },
  capabilityDesc: { fontSize: '13px', color: '#475569', lineHeight: '1.7', margin: 0 },
  
  statsExplainerGrid: { display: 'flex', flexDirection: 'column', gap: '12px' },
  statExplanation: { background: '#FFF', padding: '14px 16px', borderRadius: '12px', border: '1px solid #E2E8F0' },
  statLabelMini: { fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '2px' },
  statDescMini: { fontSize: '11px', color: '#64748B', lineHeight: '1.4', margin: 0 },

  capabilityList: { display: 'flex', flexDirection: 'column', gap: '32px', padding: '0 20px' },
  capabilityBlock: { borderLeft: '3px solid #F97316', paddingLeft: '20px' },
  processSteps: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' },
  stepTag: { fontSize: '9px', fontWeight: 800, color: '#0369A1', background: '#E0F2FE', padding: '3px 8px', borderRadius: '4px' },
  stepArrow: { fontSize: '12px', color: '#CBD5E1', fontWeight: 800 },

  comparisonSection: { marginBottom: '40px', padding: '0 20px' },
  compText: { fontSize: '13px', lineHeight: '1.6', color: '#64748B', marginBottom: '24px' },
  
  roiBox: { background: '#0F172A', padding: '24px', borderRadius: '24px', color: '#FFF' },
  roiHeader: { marginBottom: '20px', textAlign: 'center' },
  roiTitle: { fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' },
  roiGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', textAlign: 'center' },
  roiItem: { display: 'flex', flexDirection: 'column', gap: '2px' },
  roiLabel: { fontSize: '10px', color: '#F97316', fontWeight: 700, textTransform: 'uppercase' },
  roiValue: { fontSize: '28px', fontWeight: 800, color: '#FFF' },
  roiLabelAlt: { fontSize: '10px', color: '#475569', fontWeight: 700, textTransform: 'uppercase' },
  roiValueAlt: { fontSize: '28px', fontWeight: 800, color: '#475569' },
  roiSub: { fontSize: '9px', color: '#64748B' },

  planStack: { display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 20px' },
  planOption: { padding: '20px', borderLeft: '4px solid #E2E8F0', transition: 'all 0.2s ease', background: '#FFF', borderRadius: '0 16px 16px 0' },
  planHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  planInfo: { flex: 1 },
  planName: { fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0, marginBottom: 2 },
  planNote: { fontSize: '11px', color: '#0369A1', fontWeight: 600, margin: 0 },
  planPricing: { textAlign: 'right' },
  planPrice: { fontSize: '22px', fontWeight: 800, color: '#0F172A', display: 'block' },
  planTerm: { fontSize: '10px', color: '#94A3B8', fontWeight: 600 },
  
  detailBox: { marginTop: '12px' },
  featureList: { listStyle: 'none', padding: 0, margin: '0 0 20px 0', display: 'flex', flexDirection: 'column', gap: '8px' },
  featureItem: { fontSize: '12px', color: '#475569', display: 'flex', gap: '8px', lineHeight: '1.5' },
  bullet: { color: '#F97316', fontWeight: 800 },

  proceedButton: { display: 'block', textDecoration: 'none', background: '#0F172A', color: '#FFFFFF', padding: '12px', borderRadius: '12px', textAlign: 'center', fontWeight: 700, fontSize: '13px', boxShadow: '0 4px 12px -2px rgba(15, 23, 42, 0.25)' },
  
  footerNav: { marginTop: '40px', textAlign: 'center', paddingBottom: '48px' },
  footerBaseText: { color: '#64748B', fontSize: '13px', fontWeight: 500 },
  loginLink: { color: '#0369A1', fontSize: '13px', fontWeight: 600, textDecoration: 'none' },
};
