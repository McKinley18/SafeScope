'use client';

import { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    const res = await fetch('http://localhost:4000/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Forgot Password</h1>

      <input
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: '10px', marginTop: '20px' }}
      />

      <button onClick={handleSubmit} style={{ marginLeft: '10px' }}>
        Send Reset Link
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}

