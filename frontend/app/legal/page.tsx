'use client';

import { useRouter } from 'next/navigation';
import { getUser, updateUser } from '@/lib/auth';

export default function LegalPage() {
  const router = useRouter();

  async function accept() {
    const user = getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    await fetch('http://localhost:3000/auth/accept-agreement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    });

    user.hasAcceptedAgreement = true;
    updateUser(user);

    router.push('/inspection');
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h1>User Agreement</h1>

      <p>
        The SafeScope™ engine provides AI-assisted hazard identification and
        regulatory guidance. These outputs are advisory only and do not guarantee
        compliance with MSHA, OSHA, or any regulatory authority.
      </p>

      <p>
        Users are responsible for verifying all findings before taking action.
      </p>

      <button
        onClick={accept}
        style={{
          marginTop: 20,
          padding: '10px 20px',
          background: '#ff7a00',
          color: '#fff',
        }}
      >
        Accept & Continue
      </button>
    </div>
  );
}
