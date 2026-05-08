import Link from 'next/link';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>

        {/* 🔷 FULL-WIDTH HEADER */}
        <header style={styles.header}>
          <img src="/logo.png" style={styles.logo} />
        </header>

        {/* 🔥 CONTENT (TIGHTER SPACING) */}
        <main style={styles.main}>
          {children}
        </main>

        {/* 🔻 FULL-WIDTH FOOTER */}
        <footer style={styles.footer}>
          <div style={styles.footerInner}>
            <span>© 2026 Sentinel Safety</span>

            <div style={styles.footerLinks}>
              <Link href="/legal/privacy" style={styles.footerLink}>Privacy</Link>
              <Link href="/legal/terms" style={styles.footerLink}>Terms</Link>
            </div>
          </div>
        </footer>

        {/* FLOATING NAV */}
        <div style={styles.navWrapper}>
          <nav style={styles.nav}>
            <Link href="/inspection" style={styles.navLink}>Inspection</Link>
            <Link href="/report" style={styles.navLink}>Reports</Link>
          </nav>
        </div>

      </body>
    </html>
  );
}

const styles: any = {
  /* HEADER */
  header: {
    width: '100vw',           // 🔥 FORCE EDGE-TO-EDGE
    margin: 0,
    background: '#0f172a',
    height: 80,               // 🔥 slightly tighter
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    height: 70,               // 🔥 LARGER LOGO
  },

  /* MAIN CONTENT */
  main: {
    maxWidth: '1200px',
    margin: '10px auto',      // 🔥 REDUCED GAP FROM HEADER
    padding: '0 20px',
  },

  /* FOOTER */
  footer: {
    width: '100vw',
    background: '#0f172a',
    color: '#fff',
    padding: '20px 0',
    marginTop: 40,
  },

  footerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
  },

  footerLinks: {
    display: 'flex',
    gap: 20,
  },

  footerLink: {
    color: '#9ca3af',
    textDecoration: 'none',
  },

  /* NAV */
  navWrapper: {
    position: 'fixed',
    bottom: 20,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },

  nav: {
    display: 'flex',
    gap: 20,
    padding: '12px 24px',
    borderRadius: 20,
    background: 'rgba(17,24,39,0.95)',
  },

  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 500,
  },
};
