"use client";

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LayoutContainer } from '@/components/LayoutContainer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:4000/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message || 'If an account exists with that email, a reset link has been sent.');
    } catch (err) {
      console.error(err);
      setMessage('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.layout}>
      <LayoutContainer type="compact">
        <header style={styles.header}>
          <h1 style={styles.title}>Reset Password</h1>
          <p style={styles.subtitle}>Enter your email address and we'll send you a link to reset your password.</p>
        </header>

        <div style={styles.formCard}>
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

          <button 
            onClick={handleSubmit} 
            style={styles.primaryButton}
            disabled={isLoading || !email}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>

          {message && (
            <div style={styles.messageBox}>
              <p style={styles.messageText}>{message}</p>
            </div>
          )}

          <div style={styles.footerLink}>
            Remembered your password? <Link href="/login" style={styles.link}>Sign In</Link>
          </div>
        </div>
      </LayoutContainer>
    </div>
  );
}

const styles: any = {
  layout: { padding: '80px 0', background: '#F8FAFC', minHeight: '100vh' },
  header: { marginBottom: '32px', textAlign: 'center' },
  title: { fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' },
  subtitle: { fontSize: '14px', color: '#64748B', margin: 0 },
  
  formCard: { 
    background: '#FFFFFF', 
    padding: '32px', 
    borderRadius: '16px', 
    border: '1px solid #E2E8F0', 
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' 
  },
  
  formGroup: { marginBottom: '24px' },
  label: { display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: 8 },
  input: { 
    width: '100%', 
    padding: '12px 16px', 
    borderRadius: '10px', 
    border: '1px solid #E2E8F0', 
    fontSize: '14px', 
    background: '#F8FAFC',
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
  },

  messageBox: {
    marginTop: '24px',
    padding: '16px',
    background: '#F0F9FF',
    borderRadius: '12px',
    border: '1px solid #B9E6FE',
  },
  messageText: { fontSize: '13px', color: '#0369A1', margin: 0, textAlign: 'center', lineHeight: '1.5' },
  
  footerLink: { marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#64748B' },
  link: { color: '#0369A1', fontWeight: 600, textDecoration: 'none' },
};
