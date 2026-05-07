'use client';

import { useState } from 'react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const validatePassword = (password: string) => {
    return {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
  };

  const rules = validatePassword(password);

  const isValid =
    rules.length &&
    rules.upper &&
    rules.lower &&
    rules.number &&
    rules.special;

  const handleSignup = async () => {
    if (!isValid) return;

    try {
      const res = await fetch('http://localhost:4000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setMessage('Account created successfully');

      setTimeout(() => {
        window.location.href = '/login';
      }, 800);
    } catch (err: any) {
      setMessage(err.message || 'Signup failed');
    }
  };

  const ruleStyle = (valid: boolean) => ({
    color: valid ? 'green' : '#999',
    fontSize: '12px',
  });

  return (
    <div
      style={{
        background: '#eef2f7',
        padding: '30px 20px 60px',
        minHeight: 'calc(100vh - 140px)',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          width: '100%',
          display: 'flex',
          gap: '60px',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* LEFT CONTENT */}
        <div style={{ maxWidth: '480px', marginTop: '10px' }}>
          <h1 style={{ marginBottom: '16px' }}>
            Build a Safer Operation.
          </h1>

          <p style={{ color: '#555', lineHeight: 1.6 }}>
            Create your Sentinel Safety account to start capturing hazards,
            aligning with regulatory standards, and generating actionable
            safety intelligence in real time.
          </p>

          <div style={{ marginTop: '20px', color: '#444' }}>
            • AI Hazard Recognition<br />
            • MSHA / OSHA Standard Matching<br />
            • Real-Time Risk Scoring<br />
            • Corrective Action Tracking
          </div>
        </div>

        {/* SIGNUP CARD */}
        <div
          style={{
            width: '380px',
            background: 'white',
            padding: '32px',
            borderRadius: '12px',
            boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
          }}
        >
          <h2 style={{ marginBottom: '6px' }}>Create Account</h2>

          <p style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
            Get started with Sentinel Safety
          </p>

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '10px',
              borderRadius: '8px',
              border: '1px solid #ddd',
            }}
          />

          {/* PASSWORD RULES */}
          <div style={{ marginBottom: '16px' }}>
            <div style={ruleStyle(rules.length)}>• At least 8 characters</div>
            <div style={ruleStyle(rules.upper)}>• One uppercase letter</div>
            <div style={ruleStyle(rules.lower)}>• One lowercase letter</div>
            <div style={ruleStyle(rules.number)}>• One number</div>
            <div style={ruleStyle(rules.special)}>• One special character</div>
          </div>

          <button
            onClick={handleSignup}
            disabled={!isValid}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: isValid ? '#0a2540' : '#999',
              color: 'white',
              fontWeight: 600,
              cursor: isValid ? 'pointer' : 'not-allowed',
            }}
          >
            Create Account
          </button>

          {message && (
            <div
              style={{
                marginTop: '16px',
                textAlign: 'center',
                fontSize: '14px',
              }}
            >
              {message}
            </div>
          )}

          <div
            style={{
              marginTop: '18px',
              textAlign: 'center',
              fontSize: '13px',
              color: '#666',
            }}
          >
            Already have an account?{' '}
            <a href="/login" style={{ color: '#0a2540', fontWeight: 600 }}>
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
