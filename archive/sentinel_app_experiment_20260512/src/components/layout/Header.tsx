export default function Header() {
  return (
    <header style={styles.header}>
      <img src="/logo.png" alt="Sentinel Safety" style={styles.logo} />
    </header>
  );
}

const styles: any = {
  header: {
    width: '100%',
    background: '#0f172a',
    padding: '14px 0',
    display: 'flex',
    justifyContent: 'center', // 🔥 centers logo
  },

  logo: {
    height: 72, // 🔥 bigger
  },
};
