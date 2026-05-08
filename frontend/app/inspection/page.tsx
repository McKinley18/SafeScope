'use client';

import { useState } from 'react';

export default function InspectionPage() {
  const [step, setStep] = useState(1);

  const steps = ['Details', 'Hazard', 'Risk', 'Review'];

  return (
    <div style={styles.container}>

      {/* 🔶 PROGRESS BAR */}
      <div style={styles.progressBar}>
        {steps.map((s, i) => (
          <div
            key={i}
            style={{
              ...styles.progressStep,
              background: i + 1 <= step ? '#f97316' : '#e5e7eb',
            }}
          />
        ))}
      </div>

      <div style={styles.stepLabel}>
        Step {step} of 4 — {steps[step - 1]}
      </div>

      {/* STEP CONTENT */}
      {step === 1 && <Step1 next={() => setStep(2)} />}
      {step === 2 && <Step2 next={() => setStep(3)} back={() => setStep(1)} />}
      {step === 3 && <Step3 next={() => setStep(4)} back={() => setStep(2)} />}
      {step === 4 && <Step4 back={() => setStep(2)} />}

    </div>
  );
}

/* ---------------- STEPS ---------------- */

function Step1({ next }: any) {
  return (
    <div style={styles.card}>
      <h2>Inspection Details</h2>

      <Field label="Company" />
      <Field label="Location" />
      <Field label="Inspector" />
      <Field label="Date" type="date" />

      <div style={styles.buttonRight}>
        <button onClick={next} style={styles.primary}>Next</button>
      </div>
    </div>
  );
}

function Step2({ next, back }: any) {
  return (
    <div style={styles.card}>
      <h2>Capture Hazard</h2>

      <Field label="Hazard Description" textarea />

      <div style={styles.buttonBetween}>
        <button onClick={back} style={styles.secondary}>Back</button>
        <button onClick={next} style={styles.primary}>Next</button>
      </div>
    </div>
  );
}

function Step3({ next, back }: any) {
  return (
    <div style={styles.card}>
      <h2>Risk Assessment</h2>

      <div style={styles.row}>
        <Field label="Probability" select half />
        <Field label="Severity" select half />
      </div>

      <div style={styles.buttonBetween}>
        <button onClick={back} style={styles.secondary}>Back</button>
        <button onClick={next} style={styles.primary}>Add Finding</button>
      </div>
    </div>
  );
}

function Step4({ back }: any) {
  return (
    <div style={styles.card}>
      <h2>Review</h2>

      <div style={styles.buttonBetween}>
        <button onClick={back} style={styles.secondary}>+ Add Another</button>
        <button style={styles.primary}>Generate Report</button>
      </div>
    </div>
  );
}

/* ---------------- FIELD ---------------- */

function Field({ label, type, textarea, select, half }: any) {
  return (
    <div style={{ ...styles.field, flex: half ? 1 : undefined }}>
      <label style={styles.label}>{label}</label>

      {textarea && <textarea style={styles.input} />}
      {select && (
        <select style={styles.input}>
          <option>Select</option>
        </select>
      )}
      {!textarea && !select && (
        <input type={type || 'text'} style={styles.input} />
      )}
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles: any = {
  container: {
    maxWidth: 700,
    margin: '10px auto',
  },

  progressBar: {
    display: 'flex',
    gap: 6,
    marginBottom: 10,
  },

  progressStep: {
    height: 6,
    flex: 1,
    borderRadius: 4,
  },

  stepLabel: {
    fontSize: 13,
    marginBottom: 10,
  },

  card: {
    background: '#fff',
    padding: 20,
    borderRadius: 8,
  },

  field: {
    marginBottom: 12,
  },

  label: {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 4,
    display: 'block',
  },

  input: {
    width: '100%',
    padding: '8px 10px',
  },

  row: {
    display: 'flex',
    gap: 10,
  },

  buttonRight: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 16,
  },

  buttonBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  primary: {
    padding: '10px 18px',
    background: '#111827',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
  },

  secondary: {
    padding: '10px 18px',
    background: '#e5e7eb',
    border: 'none',
    borderRadius: 6,
  },
};
