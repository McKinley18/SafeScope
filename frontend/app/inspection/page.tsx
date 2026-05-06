'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUsers, getTasks, saveTasks } from '@/lib/data';

const steps = ['Photo', 'Description', 'AI', 'Hazard', 'Risk', 'Details'];

const hazardData: any = {
  'Mobile Equipment & Traffic': [
    'Interaction / Collision',
    'Rollover / Tip-over',
    'Mechanical Failure',
    'Struck-by / Caught-between',
  ],
  'Confined Space & Atmospheric': [
    'Oxygen Deficiency',
    'Toxic Atmosphere',
    'Physical Entrapment',
    'Energy Isolation Failure',
  ],
  'Fall Protection & Heights': [
    'Unprotected Edge',
    'Dropped Objects',
    'Access / Egress Failure',
    'Surface Instability',
  ],
  'Lifting, Rigging & Cranes': [
    'Load Failure',
    'Dynamic Loading',
    'Improper Rigging',
    'Power Line Proximity',
  ],
  'Hazardous Energy': [
    'Electrical Exposure',
    'Mechanical Energy',
    'Pressurized Systems',
  ],
  'Chemical, Dust & Particulates': [
    'Respirable Silica',
    'Combustible Dust',
    'Chemical Exposure',
  ],
  'Ground Control & Structural': [
    'Wall / Roof Failure',
    'Impoundment Failure',
    'Material Instability',
  ],
};

export default function InspectionPage() {
  const router = useRouter();

  const users = getUsers();

  const [step, setStep] = useState(0);
  const [hazards, setHazards] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [assignedUser, setAssignedUser] = useState('');

  const [current, setCurrent] = useState<any>({
    facility: '',
    description: '',
    category: '',
    hazardType: '',
    likelihood: '',
    severity: '',
    riskScore: '',
    environment: '',
    equipment: '',
    ppe: '',
  });

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  function calcRisk(l: string, s: string) {
    if (!l || !s) return '';
    if (l === 'High' && s === 'Critical') return 'Critical';
    if (l === 'High' || s === 'High') return 'High';
    if (l === 'Moderate' || s === 'Moderate') return 'Moderate';
    return 'Low';
  }

  function saveHazard() {
    const newTask = {
      ...current,
      assignedTo: assignedUser,
      status: 'Open',
    };

    const tasks = getTasks();
    saveTasks([...tasks, newTask]);

    if (editingIndex !== null) {
      const updated = [...hazards];
      updated[editingIndex] = current;
      setHazards(updated);
      setEditingIndex(null);
    } else {
      setHazards([...hazards, current]);
    }

    setCurrent({});
    setAssignedUser('');
    setStep(0);
  }

  function editHazard(index: number) {
    setCurrent(hazards[index]);
    setEditingIndex(index);
    setStep(0);
  }

  function deleteHazard(index: number) {
    setHazards(hazards.filter((_, i) => i !== index));
  }

  function finalizeReport() {
    localStorage.setItem('hazards', JSON.stringify(hazards));
    router.push('/report');
  }

  return (
    <div style={{ padding: 15 }}>

      {/* HEADER */}
      <div style={header}>
        Step {step + 1} of {steps.length} — {steps[step]}
      </div>

      {/* CONTENT */}
      <div style={card}>

        {/* STEP 1 */}
        {step === 0 && (
          <>
            <h3>Capture Evidence</h3>

            <input
              placeholder="Facility Name"
              style={input}
              onChange={(e) =>
                setCurrent({ ...current, facility: e.target.value })
              }
            />

            <div style={{ marginTop: 15 }}>
              <button style={primaryBtn}>📷 Take Photo</button>
            </div>

            <div style={{ margin: '10px 0', textAlign: 'center' }}>or</div>

            <input type="file" />
          </>
        )}

        {/* STEP 2 */}
        {step === 1 && (
          <>
            <h3>Describe Hazard</h3>

            <textarea
              style={textarea}
              onChange={(e) =>
                setCurrent({ ...current, description: e.target.value })
              }
            />
          </>
        )}

        {/* STEP 3 */}
        {step === 2 && (
          <>
            <h3>AI Analysis</h3>
            <button style={primaryBtn}>Run Analysis</button>
          </>
        )}

        {/* STEP 4 */}
        {step === 3 && (
          <>
            <h3>Hazard Classification</h3>

            <select
              style={input}
              onChange={(e) =>
                setCurrent({
                  ...current,
                  category: e.target.value,
                  hazardType: '',
                })
              }
            >
              <option>Select Category</option>
              {Object.keys(hazardData).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            {current.category && (
              <select
                style={input}
                onChange={(e) =>
                  setCurrent({ ...current, hazardType: e.target.value })
                }
              >
                <option>Select Hazard Type</option>
                {hazardData[current.category].map((h: string) => (
                  <option key={h}>{h}</option>
                ))}
              </select>
            )}
          </>
        )}

        {/* STEP 5 */}
        {step === 4 && (
          <>
            <h3>Risk Assessment</h3>

            <select
              style={input}
              onChange={(e) =>
                setCurrent({
                  ...current,
                  likelihood: e.target.value,
                  riskScore: calcRisk(e.target.value, current.severity),
                })
              }
            >
              <option>Likelihood</option>
              <option>Low</option>
              <option>Moderate</option>
              <option>High</option>
            </select>

            <select
              style={input}
              onChange={(e) =>
                setCurrent({
                  ...current,
                  severity: e.target.value,
                  riskScore: calcRisk(current.likelihood, e.target.value),
                })
              }
            >
              <option>Severity</option>
              <option>Low</option>
              <option>Moderate</option>
              <option>High</option>
              <option>Critical</option>
            </select>

            <div style={riskBox}>
              <strong>Risk:</strong> {current.riskScore || '-'}
            </div>
          </>
        )}

        {/* STEP 6 */}
        {step === 5 && (
          <>
            <h3>Scene Details</h3>

            <input
              placeholder="Environment"
              style={input}
              onChange={(e) =>
                setCurrent({ ...current, environment: e.target.value })
              }
            />

            <input
              placeholder="Equipment"
              style={input}
              onChange={(e) =>
                setCurrent({ ...current, equipment: e.target.value })
              }
            />

            <input
              placeholder="PPE"
              style={input}
              onChange={(e) =>
                setCurrent({ ...current, ppe: e.target.value })
              }
            />

            <select
              style={input}
              onChange={(e) => setAssignedUser(e.target.value)}
            >
              <option>Assign To</option>
              {users.map((u: any, i: number) => (
                <option key={i}>{u.name}</option>
              ))}
            </select>
          </>
        )}

      </div>

      {/* NAV */}
      <div style={nav}>
        {step > 0 && <button style={secondaryBtn} onClick={back}>Back</button>}

        {step < steps.length - 1 && (
          <button style={primaryBtn} onClick={next}>Next</button>
        )}

        {step === steps.length - 1 && (
          <button style={primaryBtn} onClick={saveHazard}>
            {editingIndex !== null ? 'Update Hazard' : 'Add to Report'}
          </button>
        )}
      </div>

      {/* REPORT BUILDER */}
      <div style={{ marginTop: 25 }}>
        <h3>Report Builder (Live)</h3>

        {hazards.map((h, i) => (
          <div key={i} style={cardSmall}>
            <strong>{h.hazardType}</strong>
            <div>{h.description}</div>
            <div>Risk: {h.riskScore}</div>

            <div style={cardActions}>
              <button style={secondaryBtn} onClick={() => editHazard(i)}>
                Edit
              </button>
              <button style={dangerBtn} onClick={() => deleteHazard(i)}>
                Delete
              </button>
            </div>
          </div>
        ))}

        {hazards.length > 0 && (
          <button style={primaryBtn} onClick={finalizeReport}>
            Finalize Report
          </button>
        )}
      </div>

    </div>
  );
}

/* STYLES */

const header = { fontWeight: 'bold', marginBottom: 10 };

const card = {
  background: '#fff',
  padding: 15,
  marginTop: 10,
  borderRadius: 10,
};

const cardSmall = {
  background: '#fff',
  padding: 12,
  marginTop: 10,
  borderRadius: 8,
};

const cardActions = {
  display: 'flex',
  gap: 10,
  marginTop: 10,
};

const input = {
  width: '100%',
  padding: 10,
  marginTop: 10,
};

const textarea = {
  ...input,
  height: 100,
};

const nav = {
  display: 'flex',
  justifyContent: 'center',
  gap: 15,
  marginTop: 15,
};

const primaryBtn = {
  padding: '10px 18px',
  background: '#ff7a00',
  color: '#fff',
  borderRadius: 6,
  height: 42,
};

const secondaryBtn = {
  padding: '10px 18px',
  background: '#e0e0e0',
  color: '#333',
  borderRadius: 6,
  height: 42,
};

const dangerBtn = {
  padding: '10px 18px',
  background: '#d32f2f',
  color: '#fff',
  borderRadius: 6,
  height: 42,
};

const riskBox = {
  marginTop: 15,
  padding: 12,
  background: '#fff3e0',
  borderRadius: 8,
};
