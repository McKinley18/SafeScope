import Field from '../ui/Field';

export default function Step1Details({ data, setData, next }: any) {
  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Inspection Details</h2>

      <Field label="Company">
        <input
          value={data.company}
          onChange={e => setData({ ...data, company: e.target.value })}
          style={styles.input}
        />
      </Field>

      <Field label="Inspector">
        <input
          value={data.inspector}
          onChange={e => setData({ ...data, inspector: e.target.value })}
          style={styles.input}
        />
      </Field>

      <button onClick={next} style={styles.primary}>
        Next
      </button>
    </div>
  );
}

const styles: any = {
  card: { background: '#fff', padding: 16, borderRadius: 8 },
  title: { marginBottom: 10, fontSize: 18 },

  input: {
    width: '100%',
    padding: 10,
    borderRadius: 6,
    border: '1px solid #d1d5db',
  },

  primary: {
    marginTop: 10,
    width: '100%',
    padding: 12,
    background: '#111827',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
  },
};
