'use client';

import { useState } from 'react';
import Field from '../ui/Field';

const API = 'http://localhost:4000';

export default function Step2Hazard({ data, setData, next, back }: any) {
  const [loading, setLoading] = useState(false);

  const getSuggestion = async () => {
    if (!data.hazard) return;

    setLoading(true);

    const res = await fetch(`${API}/standards/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: data.hazard }),
    });

    const result = await res.json();

    if (result.length > 0) {
      setData({
        ...data,
        standard: result[0].citation,
      });
    }

    setLoading(false);
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Hazard</h2>

      <Field label="Describe Hazard">
        <textarea
          value={data.hazard}
          onChange={e => setData({ ...data, hazard: e.target.value })}
          style={styles.textarea}
        />
      </Field>

      <button onClick={getSuggestion} style={styles.ai}>
        {loading ? 'Analyzing...' : 'Suggest Standard'}
      </button>

      {data.standard && (
        <div style={styles.result}>
          {data.standard}
        </div>
      )}

      <div style={styles.row}>
        <button onClick={back}>Back</button>
        <button onClick={next}>Next</button>
      </div>
    </div>
  );
}

const styles: any = {
  card: { background: '#fff', padding: 16, borderRadius: 8 },
  title: { marginBottom: 8 },

  textarea: {
    width: '100%',
    minHeight: 80,
    padding: 10,
    borderRadius: 6,
    border: '1px solid #d1d5db',
  },

  ai: {
    width: '100%',
    marginTop: 6,
    padding: 10,
    background: '#f97316',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
  },

  result: {
    marginTop: 6,
    padding: 8,
    background: '#fff7ed',
    borderRadius: 6,
    fontSize: 13,
  },

  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 10,
  },
};
