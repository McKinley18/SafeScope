'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function ResetPassword() {
  const params = useSearchParams();
  const token = params.get('token');

  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    const res = await fetch('http://localhost:4000/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Reset Password</h1>

      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: '10px', marginTop: '20px' }}
      />

      <button onClick={handleReset} style={{ marginLeft: '10px' }}>
        Reset
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}
