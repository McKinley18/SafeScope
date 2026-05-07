import Image from 'next/image';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, sans-serif',
          background: '#f5f7fa',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {/* HEADER */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '14px',
            background: '#0a2540',
          }}
        >
          <div style={{ width: '220px' }}>
            <Image
              src="/logo.png"
              alt="Sentinel Safety"
              width={800}
              height={300}
              style={{
                width: '100%',
                height: 'auto',
              }}
              priority
            />
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main style={{ flex: 1 }}>{children}</main>

        {/* FOOTER */}
        <footer
          style={{
            background: '#0a2540',
            color: '#ffffff',
            padding: '24px',
            fontSize: '13px',
          }}
        >
          <div
            style={{
              maxWidth: '1100px',
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            {/* LEFT */}
            <div>
              © {new Date().getFullYear()} Sentinel Safety  
              <br />
              SafeScope™ Engine
            </div>

            {/* RIGHT */}
            <div style={{ textAlign: 'right' }}>
              About Us  
              <br />
              Privacy Policy  
              <br />
              Terms of Use
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
