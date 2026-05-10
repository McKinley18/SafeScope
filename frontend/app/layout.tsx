import './globals.css';
import AppWrapper from './components/AppWrapper';
import PWARegistration from './components/PWARegistration';

export const metadata = {
  title: 'Sentinel Safety',
  description: 'See Risk. Prevent Harm.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={styles.body}>
        <PWARegistration />
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}

const styles: any = {
  body: {
    margin: 0,
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#F3F4F6',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
};
