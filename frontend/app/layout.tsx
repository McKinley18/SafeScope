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
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            background: '#0a2540',
          }}
        >
          <Image
            src="/logo.png"
            alt="Sentinel Safety"
            width={120}
            height={120}
            priority
          />
        </header>

        {/* PAGE CONTENT */}
        <main style={{ padding: '24px' }}>{children}</main>

      </body>
    </html>
  );
}
