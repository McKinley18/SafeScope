'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LayoutContainer } from '@/components/LayoutContainer';

const plans: any = {
  individual: { name: 'Basic', price: '$0', term: 'Free Forever' },
  pro: { name: 'Pro', price: '$79', term: 'One-Time Payment' },
  company: { name: 'Enterprise', price: '$99', term: 'Monthly' }
};

function CreateAccountForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 🔷 INVITATION STATE
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [isVerifyingInvite, setIsVerifyingInvite] = useState(false);
  const [orgInfo, setOrgInfo] = useState<any>(null);

  const planIdFromUrl = searchParams.get('plan') || 'individual';
  const tokenFromUrl = searchParams.get('token');

  const [type, setType] = useState(planIdFromUrl);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🔷 VERIFY INVITATION TOKEN ON MOUNT
  useEffect(() => {
    if (tokenFromUrl) {
      setInviteToken(tokenFromUrl);
      verifyInvitation(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  const verifyInvitation = async (token: string) => {
    setIsVerifyingInvite(true);
    try {
      const res = await fetch(`http://localhost:4000/auth/verify-invite/${token}`);
      const data = await res.json();
      
      if (res.ok) {
        setOrgInfo(data.organization);
        setEmail(data.email);
        setType('company'); // Lock to Enterprise tier
      } else {
        alert('Invalid or expired invitation token.');
        setInviteToken(null);
      }
    } catch (err) {
      console.error('Verify Invite Error:', err);
    } finally {
      setIsVerifyingInvite(false);
    }
  };

  const selectedPlan = plans[type] || plans.individual;

  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid = Object.values(checks).every(Boolean);
  const isValid = isPasswordValid && acceptedTerms && name && email;

  const handleCreateAccount = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:4000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          type,
          inviteToken: inviteToken 
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Error creating account');
        return;
      }
      alert('Account created successfully');
      router.push('/login');
    } catch (err) {
      console.error(err);
      alert('Server error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifyingInvite) {
    return <div style={styles.loading}>Verifying invitation security...</div>;
  }

  return (
    <div style={styles.layout}>
      <LayoutContainer type="compact">
        {/* 🔷 NAVIGATION BACK */}
        {!inviteToken && (
          <div style={styles.topNav}>
            <Link href="/pricing" style={styles.backButton}>
              ← Back to Plans
            </Link>
          </div>
        )}

        <header style={styles.header}>
          <h1 style={styles.title}>
            {inviteToken ? `Join ${orgInfo?.name || 'Organization'}` : 'Finalize Your Profile'}
          </h1>
          <p style={styles.subtitle}>
            {inviteToken 
              ? `Initialize your employee profile to access your team's encrypted shared vault.`
              : `Complete the details below to initialize your ${selectedPlan.name} account.`}
          </p>
        </header>

        {/* 🔷 SELECTED PLAN SUMMARY */}
        <div style={styles.summaryCard}>
          <div style={styles.summaryInfo}>
            <span style={styles.summaryLabel}>{inviteToken ? 'Department Access' : 'Selected Plan'}</span>
            <h2 style={styles.summaryName}>{inviteToken ? 'Enterprise Member' : selectedPlan.name}</h2>
          </div>
          <div style={styles.summaryPricing}>
            <span style={styles.summaryPrice}>{inviteToken ? 'Managed' : selectedPlan.price}</span>
            <span style={styles.summaryTerm}>{inviteToken ? 'Organizational Seat' : selectedPlan.term}</span>
          </div>
        </div>

        <section style={styles.formSection}>
          <div style={styles.formContent}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input placeholder="Chris McKinley" value={name} onChange={(e) => setName(e.target.value)} style={styles.input} />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Work Email</label>
              <input 
                type="email" 
                placeholder="name@company.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                style={styles.input}
                disabled={!!inviteToken} // Email locked if from invite
              />
              {inviteToken && <p style={styles.helpText}>This account will be bound to your work email.</p>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Create Password</label>
              <div style={styles.passwordRequirements}>
                <ul style={styles.reqList}>
                  <li style={checks.length ? styles.valid : styles.invalid}>8+ chars</li>
                  <li style={checks.upper && checks.lower ? styles.valid : styles.invalid}>Upper/Lower</li>
                  <li style={checks.number && checks.special ? styles.valid : styles.invalid}>Num/Symbol</li>
                </ul>
              </div>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
            </div>

            <div style={styles.termsGroup}>
              <input type="checkbox" id="terms" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} style={styles.checkbox} />
              <label htmlFor="terms" style={styles.checkboxLabel}>
                I agree to the <Link href="/legal" style={styles.legalLinkSmall}>Terms of Use</Link> and acknowledge the <Link href="/security" style={styles.legalLinkSmall}>Data Security</Link> protocols.
              </label>
            </div>

            <button
              onClick={handleCreateAccount}
              style={{
                ...styles.primaryButton,
                opacity: isValid && !isLoading ? 1 : 0.5,
              }}
              disabled={!isValid || isLoading}
            >
              {isLoading ? 'Creating Account...' : inviteToken ? 'Join Organization' : 'Initialize Account'}
            </button>

            <div style={styles.footerLink}>
              Already have an account? <Link href="/login" style={styles.link}>Sign In</Link>
            </div>
          </div>
        </section>
      </LayoutContainer>
    </div>
  );
}

export default function CreateAccountPage() {
  return (
    <Suspense fallback={<div>Loading profile initialization...</div>}>
      <CreateAccountForm />
    </Suspense>
  );
}

const styles: any = {
  layout: { padding: '40px 0', background: '#F8FAFC', minHeight: '100vh' },
  topNav: { marginBottom: '24px', padding: '0 10px' },
  backButton: { fontSize: '14px', fontWeight: 600, color: '#64748B', textDecoration: 'none' },
  
  header: { marginBottom: '32px', textAlign: 'center' },
  title: { fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' },
  subtitle: { fontSize: '14px', color: '#64748B', margin: 0 },
  
  summaryCard: { background: '#FFFFFF', padding: '24px', borderRadius: '20px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' },
  summaryInfo: { display: 'flex', flexDirection: 'column', gap: '2px' },
  summaryLabel: { fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' },
  summaryName: { fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 },
  summaryPricing: { textAlign: 'right' },
  summaryPrice: { fontSize: '20px', fontWeight: 800, color: '#F97316', display: 'block' },
  summaryTerm: { fontSize: '11px', color: '#64748B', fontWeight: 600 },

  formSection: { padding: '0 10px' },
  formContent: { background: '#FFFFFF', padding: '32px', borderRadius: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px -2px rgba(0,0,0,0.05)' },
  formGroup: { marginBottom: '24px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: 4 },
  input: { width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', background: '#F8FAFC', color: '#0F172A', outline: 'none', marginTop: '4px' },
  
  passwordRequirements: { marginBottom: '0' },
  reqList: { listStyle: 'disc', padding: '0 0 0 16px', margin: '8px 0 12px 0', display: 'flex', flexDirection: 'column', gap: '4px' },
  valid: { color: '#059669', fontSize: '11px', fontWeight: 700 },
  invalid: { color: '#CBD5E1', fontSize: '11px', fontWeight: 500 },

  termsGroup: { display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '32px', marginTop: '16px' },
  checkbox: { marginTop: '3px', cursor: 'pointer', flexShrink: 0, width: '18px', height: '18px' },
  checkboxLabel: { fontSize: '12px', color: '#64748B', lineHeight: '1.6', cursor: 'pointer' },
  legalLinkSmall: { color: '#0369A1', fontWeight: 600, textDecoration: 'none' },

  primaryButton: { width: '100%', background: '#0F172A', color: '#FFFFFF', padding: '16px', borderRadius: '14px', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '15px', boxShadow: '0 4px 12px -2px rgba(15, 23, 42, 0.25)', marginTop: '8px' },
  footerLink: { marginTop: '32px', textAlign: 'center', fontSize: '14px', color: '#64748B' },
  link: { color: '#0369A1', fontWeight: 600, textDecoration: 'none' },
  
  loading: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', color: '#0F172A', fontWeight: 700 },
  helpText: { fontSize: '11px', color: '#64748B', marginTop: '8px' },
};
