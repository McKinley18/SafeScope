export default function Field({ label, children }: any) {
  return (
    <div style={styles.wrapper}>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}

const styles: any = {
  wrapper: {
    marginBottom: 12,
  },

  label: {
    fontSize: 12,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 4,
    display: 'block',
  },
};
