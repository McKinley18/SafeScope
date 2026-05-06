import Image from 'next/image';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        {/* HEADER */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 24px',
            background: '#0a2540',
            color: 'white',
          }}
        >
          <Image
            src="/logo.png"
            alt="Sentinel Safety"
            width={40}
            height={40}
          />

          <div>
            <div style={{ fontWeight: 700 }}>Sentinel Safety</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              See Risk. Prevent Harm.
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main style={{ padding: '24px' }}>{children}</main>
      </body>
    </html>
  );
}
