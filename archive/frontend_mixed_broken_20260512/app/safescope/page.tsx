'use client';

import { LayoutContainer } from '../components/LayoutContainer';
import Link from 'next/link';
import ConditionalLoginLink from '../components/ConditionalLoginLink';

export default function SafeScopePage() {
  return (
    <div style={styles.layout}>
      <LayoutContainer type="standard">
        <header style={styles.header}>
          <h1 style={styles.title}>SafeScope Intelligence</h1>
          <p style={styles.slogan}>Proprietary Regulatory Engine</p>
        </header>

        <div style={styles.pageBody}>
          <p style={styles.leadText}>
            SafeScope is the core intelligence engine of the Sentinel Safety platform. It is a 
            proprietary system designed to bridge the gap between field observations and 
            regulatory compliance with unprecedented speed and accuracy.
          </p>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Intelligent Standard Matching</h2>
            <p style={styles.text}>
              SafeScope utilizes a sophisticated mapping algorithm to correlate identified hazard 
              categories and field descriptions with applicable MSHA and OSHA standards. This process 
              is not merely a keyword search; it is an analysis of hazard characteristics that 
              provides a confidence-rated match for regulatory accuracy.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Continuous Learning & Reliability</h2>
            <p style={styles.text}>
              Every interaction with SafeScope improves its accuracy. By incorporating user feedback 
              loops from safety professionals, the system refines its internal taxonomy over time. 
              This ensure that suggestions remain relevant to the specific operational contexts of 
              our users while maintaining a defensible audit trail.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Proprietary Security</h2>
            <p style={styles.text}>
              As a proprietary technology, SafeScope's internal logic and taxonomy weighting are 
              protected to maintain the competitive advantage and security of our partners' data. 
              Organization-specific learning is isolated, ensuring that your operational insights 
              remain yours alone.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Professional Oversight</h2>
            <p style={styles.text}>
              SafeScope is designed to augment, not replace, the safety professional. All AI-generated 
              suggestions require human verification, ensuring that the final report is backed by 
              both advanced technology and expert judgment.
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
  header: { marginBottom: '40px', borderLeft: '4px solid #F97316', paddingLeft: '20px' },
  title: { fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' },
  slogan: { fontSize: '15px', fontWeight: 600, color: '#64748B', margin: 0, letterSpacing: '0.02em' },
  
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
};
