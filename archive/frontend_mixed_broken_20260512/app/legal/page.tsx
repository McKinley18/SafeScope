'use client';

import { LayoutContainer } from '../components/LayoutContainer';
import ConditionalLoginLink from '../components/ConditionalLoginLink';

export default function LegalPage() {
  return (
    <div style={styles.layout}>
      <LayoutContainer type="standard">
        <header style={styles.header}>
          <h1 style={styles.title}>Legal & Terms of Use</h1>
          <p style={styles.subtitle}>Effective Date: May 7, 2026</p>
        </header>

        <div style={styles.pageBody}>
          <p style={styles.agreementText}>
            By accessing or using the Sentinel Safety platform, you explicitly agree to the following conditions. 
            <strong> You acknowledge that you use this system at your own risk and agree to hold Sentinel Safety, its developers, and partners harmless and free from any legal liability.</strong>
          </p>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>1. General Disclaimer</h2>
            <p style={styles.text}>
              Sentinel Safety provides safety insights and recommendations for informational purposes only. 
              The platform and its contents do not replace professional judgment, specialized safety consultation, or official regulatory interpretation. 
              Users are solely responsible for ensuring their operations meet all legal and regulatory requirements.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>2. Statistical & Analytical Data</h2>
            <p style={styles.text}>
              All statistical data, predictive projections, and risk scores provided by Sentinel Safety are advisory. 
              These metrics are derived from historical data and mathematical models that do not guarantee specific future safety outcomes. 
              Statistical Process Control (SPC) limits and Risk Priority Numbers (RPN) are theoretical calculations meant to highlight potential concerns, not to declare an absolute state of safety.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>3. SafeScope AI Content</h2>
            <p style={styles.text}>
              AI-generated insights, specifically standard matching from the SafeScope engine, must be independently verified by a qualified safety professional before implementation. 
              Sentinel Safety does not warrant the accuracy of AI suggestions, which may not reflect site-specific conditions or recent regulatory changes.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>4. Limitation of Liability & Indemnification</h2>
            <p style={styles.text}>
              In no event shall Sentinel Safety be liable for any direct, indirect, incidental, or consequential damages (including, but not limited to, personal injury, loss of life, or regulatory penalties) arising from the use of this platform. 
              You agree to indemnify and hold harmless Sentinel Safety from any claims resulting from your interpretation of the data or implementation of safety suggestions.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>5. User Responsibility</h2>
            <p style={styles.text}>
              The accuracy of generated reports depends entirely on the accuracy of user-provided input. 
              Users are responsible for performing thorough field hazard assessments and should not rely exclusively on this platform for safety compliance.
            </p>
          </section>

          <ConditionalLoginLink />
        </div>
      </LayoutContainer>
    </div>
  );
}

const styles: any = {
  layout: { padding: '40px 0', background: '#FFFFFF', minHeight: '100vh' },
  header: { marginBottom: '40px', borderLeft: '4px solid #0F172A', paddingLeft: '20px' },
  title: { fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' },
  subtitle: { fontSize: '13px', color: '#64748B', margin: 0 },
  
  pageBody: { marginTop: '10px' },
  
  agreementText: { 
    fontSize: '15px', 
    color: '#991B1B', 
    lineHeight: '1.7', 
    marginBottom: '40px',
    paddingBottom: '24px',
    borderBottom: '1px solid #F1F5F9'
  },
  
  section: { marginBottom: '40px' },
  sectionTitle: { fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  text: { fontSize: '14px', color: '#334155', lineHeight: '1.8', margin: 0 },
};
