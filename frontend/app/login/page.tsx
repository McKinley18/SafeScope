'use client';

import { useState } from 'react';
import { login } from '@/lib/api';
import { setAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    try {
      const data = await login(email, password);

      setAuth(data);

      if (!data.user.hasAcceptedAgreement) {
        router.push('/legal');
      } else {
        router.push('/inspection');
      }
    } catch {
      alert('Invalid login');
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Sentinel Safety Login</h1>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: 'block', marginBottom: 10 }}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: 'block', marginBottom: 10 }}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
