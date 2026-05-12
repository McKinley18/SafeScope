import Field from '../ui/Field';

export default function Step3Risk({ data, setData, next, back }: any) {
  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Risk</h2>

      <Field label="Probability">
        <select
          value={data.probability}
          onChange={e => setData({ ...data, probability: e.target.value })}
          style={styles.input}
        >
          <option value="">Select</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </Field>

      <Field label="Severity">
        <select
          value={data.severity}
          onChange={e => setData({ ...data, severity: e.target.value })}
          style={styles.input}
        >
          <option value="">Select</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>
      </Field>

      <div style={styles.row}>
        <button onClick={back}>Back</button>
        <button onClick={next}>Add</button>
      </div>
    </div>
  );
}

const styles: any = {
  card: { background: '#fff', padding: 16, borderRadius: 8 },
  title: { marginBottom: 8 },

  input: {
    width: '100%',
    padding: 10,
    borderRadius: 6,
    border: '1px solid #d1d5db',
  },

  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 10,
  },
};
