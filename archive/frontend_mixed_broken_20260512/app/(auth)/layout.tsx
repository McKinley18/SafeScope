export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={styles.container}>
      {children}
    </div>
  );
}

const styles: any = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
  },
};
