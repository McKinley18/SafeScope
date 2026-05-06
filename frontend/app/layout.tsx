export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif' }}>
        <header
          style={{
            padding: '16px',
            background: '#0a2540',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          Sentinel Safety
        </header>

        <main style={{ padding: '20px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
