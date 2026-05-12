'use client';

import { LayoutContainer } from '@/components/LayoutContainer';
import ConditionalLoginLink from '../components/ConditionalLoginLink';

export default function AboutPage() {
  return (
    <div style={styles.layout}>
      <LayoutContainer type="standard">
        <header style={styles.header}>
          <h1 style={styles.title}>About Sentinel Safety</h1>
          <p style={styles.slogan}>Precision Safety. Proactive Intelligence.</p>
        </header>

        <div style={styles.pageBody}>
          <p style={styles.leadText}>
            Sentinel Safety is a streamlined safety intelligence platform built to simplify the inspection 
            process and automate professional report generation. Our primary goal is to provide safety 
            professionals with an efficient, high-performance tool that removes the complexity from field 
            documentation while delivering precise, actionable insights.
          </p>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>The Mission</h2>
            <p style={styles.text}>
              Born from real-world experience in high-risk environments—ranging from industrial worksites 
              to the flight decks of AH-64 Apache helicopters—Sentinel Safety is founded on the principles 
              of precision, structured decision-making, and operational excellence. 
            </p>
            <p style={styles.text}>
              Our platform bridges the gap between field-level hazard identification and strategic 
              risk management. By leveraging a Master’s in Occupational Safety and Health alongside 
              the analytical rigor of an MBA, we have architected a system that doesn't just collect data, 
              but generates actionable intelligence.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>The Result</h2>
            <p style={styles.text}>
              Sentinel Safety empowers safety managers and teams to foster a proactive safety culture, 
              reduce mean mitigation times, and generate professional-grade reports that clearly 
              communicate the state of organizational safety health without the traditional administrative burden.
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
