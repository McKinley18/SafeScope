import React from 'react';

export default function Header() {
  return (
    <div style={styles.banner}>
      <div style={styles.inner}>
        <img src="/logo-header.jpg" style={styles.logo} alt="logo" />

        <div style={styles.text}>
          <div style={styles.sentinel}>Sentinel</div>
          <div style={styles.safety}>Safety</div>
        </div>
      </div>
    </div>
  );
}

const styles: any = {
  banner: {
    width: '100%',
    background: '#0b1f3a',
    padding: '14px 0',
  },
  inner: {
    maxWidth: 1000,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    height: 42,
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
  },
  sentinel: {
    color: '#3b82f6',
    fontWeight: 700,
    fontSize: 20,
  },
  safety: {
    color: '#9ca3af',
    fontWeight: 600,
    fontSize: 14,
  },
};
