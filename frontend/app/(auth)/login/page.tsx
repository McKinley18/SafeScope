'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutContainer } from '@/components/LayoutContainer';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // 🛑 CENTRALIZED API CONFIG (Use 4000 based on backend .env)
      const API_URL = 'http://localhost:4000';
      
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Login failed. Check credentials.');
        return;
      }

      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (err) {
      console.error('Login Error:', err);
      alert('Connection Error: Ensure backend is running on port 4000.');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔷 DEV BYPASS AUTO-LOGIN
  const handleDevBypass = () => {
    localStorage.setItem('token', 'dev-bypass-token');
    router.push('/dashboard');
  };

  return (
    <div style={styles.layout}>
      <LayoutContainer type="compact">
        <header style={styles.header}>
          <p style={styles.subtitle}>Precision Safety. Proactive Intelligence.</p>
        </header>

        {/* 🔷 WHAT TO EXPECT SECTION */}
        <div style={styles.expectations}>
          <div style={styles.featureList}>
            {[
              { title: 'Streamlined Inspections', desc: 'Mobile-first walkthroughs for high-risk environments.' },
              { title: 'Automated Reporting', desc: 'Professional reports generated in seconds.' },
              { title: 'SafeScope AI', desc: 'Proprietary standards-matching for MSHA/OSHA.' },
            ].map((feature, i) => (
              <div key={i} style={styles.featureItem}>
                <div style={styles.featureDot} />
                <div>
                  <p style={styles.featureTitle}>{feature.title}</p>
                  <p style={styles.featureDesc}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SIGN IN SECTION */}
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Sign In</h2>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={{ ...styles.formGroup, marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ ...styles.label, marginBottom: 0 }}>Password</label>
              <Link href="/forgot-password" style={styles.forgotLink}>Forgot Password?</Link>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...styles.input, marginTop: 0 }}
            />
          </div>

          <button 
            onClick={handleLogin} 
            style={styles.primaryButton}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

          {/* 🔷 DEV BYPASS BUTTON */}
          <button 
            onClick={handleDevBypass}
            style={styles.bypassButton}
          >
            Dev Bypass: Dashboard →
          </button>

          <div style={styles.footerLink}>
            Don't have an account? <Link href="/pricing" style={styles.link}>Create Account</Link>
          </div>
        </div>
      </LayoutContainer>
    </div>
  );
}

const styles: any = {
  layout: { padding: '24px 0', background: '#F8FAFC', minHeight: '100vh' },
  header: { marginBottom: '16px', textAlign: 'center' },
  subtitle: { fontSize: '15px', fontWeight: 600, color: '#64748B', margin: 0 },
  
  expectations: { marginBottom: '24px', padding: '0 8px' },
  featureList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  featureItem: { display: 'flex', gap: '12px' },
  featureDot: { width: '6px', height: '6px', borderRadius: '50%', background: '#0369A1', marginTop: '6px', flexShrink: 0 },
  featureTitle: { fontSize: '13px', fontWeight: 700, color: '#1E293B', margin: 0 },
  featureDesc: { fontSize: '12px', color: '#64748B', margin: '1px 0 0 0', lineHeight: '1.4' },

  formCard: { 
    background: '#FFFFFF', 
    padding: '32px', 
    borderRadius: '16px', 
    border: '1px solid #E2E8F0', 
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' 
  },
  formTitle: { fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '24px', textAlign: 'center' },
  formGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: -4 },
  forgotLink: { fontSize: '11px', color: '#0369A1', fontWeight: 600, textDecoration: 'none' },
  input: { 
    width: '100%', 
    padding: '12px 16px', 
    borderRadius: '8px', 
    border: '1px solid #E2E8F0', 
    fontSize: '14px', 
    background: '#F8FAFC',
    marginTop: 4,
  },
  
  primaryButton: { 
    width: '100%',
    background: '#0F172A', 
    color: '#FFFFFF', 
    padding: '14px', 
    borderRadius: '12px', 
    border: 'none', 
    fontWeight: 600, 
    cursor: 'pointer', 
    fontSize: '14px',
    boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.2)',
    marginTop: '8px'
  },

  bypassButton: {
    width: '100%',
    background: '#F1F5F9',
    color: '#991B1B',
    padding: '10px',
    borderRadius: '10px',
    border: '1px dashed #991B1B',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '12px',
    marginTop: '12px'
  },
  
  footerLink: { marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#64748B' },
  link: { color: '#0369A1', fontWeight: 600, textDecoration: 'none' },
};
