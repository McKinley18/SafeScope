'use client';

import { LayoutContainer } from '../components/LayoutContainer';
import ConditionalLoginLink from '../components/ConditionalLoginLink';

export default function SecurityPage() {
  return (
    <div style={styles.layout}>
      <LayoutContainer type="standard">
        <header style={styles.header}>
          <h1 style={styles.title}>Security & Data Protection</h1>
          <p style={styles.subtitle}>Our commitment to enterprise-grade security and organizational data integrity.</p>
        </header>

        <div style={styles.pageBody}>
          <p style={styles.leadText}>
            Sentinel Safety is architected with a "Security First" philosophy. We implement 
            industry-standard protocols to ensure that your organizational data, user credentials, 
            and safety findings remain private, secure, and defensible.
          </p>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>1. Data Encryption & Storage</h2>
            <p style={styles.text}>
              All user passwords are encrypted using <strong>bcrypt</strong> with a high-work-factor salt, 
              ensuring that credentials are never stored in plain text and are resistant to rainbow table 
              or brute-force attacks. Our database architecture utilizes <strong>Least Privilege</strong> principles, 
              masking sensitive fields from standard API responses to prevent accidental data exposure.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>2. Infrastructure Defense</h2>
            <p style={styles.text}>
              The Sentinel Safety API is protected by several layers of defense-in-depth:
            </p>
            <ul style={styles.list}>
              <li><strong>Rate Limiting:</strong> Automated protection against brute-force and Denial of Service (DoS) attacks.</li>
              <li><strong>Security Headers:</strong> Full <strong>Helmet.js</strong> integration to mitigate Cross-Site Scripting (XSS), Clickjacking, and other common web vulnerabilities.</li>
              <li><strong>CORS Enforcement:</strong> Strict cross-origin policies ensuring only authorized organizational domains can interact with system data.</li>
            </ul>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>3. Operational Compliance</h2>
            <p style={styles.text}>
              To meet corporate IT standards, we utilize <strong>Externalized Secret Management</strong>. 
              Sensitive configurations are never stored in the codebase and are managed through 
              secure environment variables. Furthermore, production database schemas are protected 
              from automatic alteration, requiring formal, audited migrations for any structural changes.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>4. Role-Based Access Control (RBAC)</h2>
            <p style={styles.text}>
              Access to safety data is governed by strict organizational roles. Permissions are 
              isolated to ensure that only authorized personnel can generate, edit, or delete 
              inspection records, maintaining a clear and verifiable chain of custody for all 
              compliance documentation.
            </p>
          </section>

          <ConditionalLoginLink />
        </div>
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
  layout: { padding: '40px 0', background: '#FFFFFF', minHeight: '100vh' },
  header: { marginBottom: '40px', borderLeft: '4px solid #0284C7', paddingLeft: '20px' },
  title: { fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' },
  subtitle: { fontSize: '14px', color: '#64748B', margin: 0 },
  
  pageBody: { marginTop: '10px' },
  
  leadText: { 
    fontSize: '16px', 
    color: '#1E293B', 
    lineHeight: '1.8', 
    marginBottom: '40px',
    paddingBottom: '32px',
    borderBottom: '1px solid #F1F5F9',
    fontWeight: 500
  },
  
  section: { marginBottom: '40px' },
  sectionTitle: { fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  text: { fontSize: '14px', color: '#475569', lineHeight: '1.8', marginBottom: '16px' },
  list: { paddingLeft: '20px', margin: '12px 0' },
};
