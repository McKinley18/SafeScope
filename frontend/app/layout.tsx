import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0 }}>

        {/* HEADER */}
        <div style={header}>
          <img src="/logo.png" style={{ height: 110 }} />
        </div>

        {/* CONTENT */}
        <div style={{ paddingBottom: 90 }}>
          {children}
        </div>

        {/* NAV */}
        <div style={nav}>
          <a href="/command-center" style={link}>Command</a>
          <a href="/inspection" style={link}>Inspect</a>
          <a href="/report" style={link}>Reports</a>
          <a href="/settings" style={link}>Settings</a>
        </div>

      </body>
    </html>
  );
}

/* STYLES */

const header = {
  height: 140,
  background: '#0b1f3a',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const nav = {
  position: 'fixed',
  bottom: 0,
  width: '100%',
  height: 70,
  background: '#0b1f3a',
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
};

const link = {
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 600,
};
