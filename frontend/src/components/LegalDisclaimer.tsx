'use client';

import { useEffect, useState } from 'react';

const LEGAL_ACCEPTED_KEY = 'legal_disclaimer_accepted';

export default function LegalDisclaimer() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(LEGAL_ACCEPTED_KEY);
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(LEGAL_ACCEPTED_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Important Notice</h2>

        <div style={styles.content}>
          <p>
            This application uses the SafeScope™ engine to assist with hazard identification,
            regulatory matching, and safety recommendations.
          </p>

          <p>
            Users are responsible for verifying all information before acting on it. Sentinel Safety
            and Monolith Studios assume no liability for misuse or reliance on generated outputs.
          </p>

          <p>
            © {new Date().getFullYear()} Monolith Studios — Sentinel Safety<br />
            SafeScope™ is proprietary technology.
          </p>
        </div>

        <button onClick={accept} style={styles.button}>
          I Accept
        </button>
      </div>
    </div>
  );
}

const styles: any = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '90%',
    maxWidth: 500,
  },
  content: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 14,
  },
  button: {
    padding: 10,
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
  },
};
