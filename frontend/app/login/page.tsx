'use client';

import { useState } from 'react';

const DEV_MODE = true; // 🔥 MATCH THIS WITH COMMAND CENTER

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      if (DEV_MODE) {
        // 🔥 Skip backend auth in dev mode
        localStorage.setItem('token', 'dev-token');
        window.location.href = '/command-center';
        return;
      }

      const res = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      localStorage.setItem('token', data.access_token);

      setMessage('Login successful');

      setTimeout(() => {
        window.location.href = '/command-center';
      }, 800);
    } catch (err: any) {
      setMessage(err.message || 'Login failed');
    }
  };

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
          <h1>See Risk. Prevent Harm.</h1>

          <p style={{ color: '#555', lineHeight: 1.6 }}>
            Sentinel Safety, powered by the SafeScope engine, transforms
            field observations into real-time safety intelligence.
          </p>
        </div>

        {/* LOGIN CARD */}
        <div
          style={{
            width: '380px',
            background: 'white',
            padding: '32px',
            borderRadius: '12px',
            boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
          }}
        >
          <h2>Sign In</h2>

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '12px',
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
              marginTop: '12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
            }}
          />

          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              marginTop: '16px',
              padding: '12px',
              background: '#0a2540',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Sign In
          </button>

          {message && (
            <div style={{ marginTop: '12px', textAlign: 'center' }}>
              {message}
            </div>
          )}

          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <a href="/signup">Create Account</a>
          </div>
        </div>
      </div>
    </div>
  );
}
