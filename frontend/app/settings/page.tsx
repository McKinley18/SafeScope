'use client';

import { useState, useEffect } from 'react';
import { getUsers, saveUsers } from '@/lib/data';

export default function SettingsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Worker');

  // Toggles
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  function addUser() {
    if (!name) return;

    const updated = [...users, { name, role }];
    setUsers(updated);
    saveUsers(updated);
    setName('');
  }

  function deleteUser(index: number) {
    const updated = users.filter((_, i) => i !== index);
    setUsers(updated);
    saveUsers(updated);
  }

  return (
    <div style={container}>

      <h1 style={title}>Settings</h1>

      {/* ACCOUNT */}
      <div style={card}>
        <h3>Account</h3>
        <p>Email: user@company.com</p>

        <button style={btn}>Change Password</button>
        <button style={btn}>Update Profile</button>
      </div>

      {/* USER PREFERENCES */}
      <div style={card}>
        <h3>User Preferences</h3>

        <div style={toggleRow}>
          <span>Notifications</span>
          <Toggle value={notifications} onChange={setNotifications} />
        </div>

        <div style={toggleRow}>
          <span>Dark Mode</span>
          <Toggle value={darkMode} onChange={setDarkMode} />
        </div>

        <label style={label}>Default Risk Threshold</label>
        <select style={input}>
          <option>Low</option>
          <option>Moderate</option>
          <option>High</option>
        </select>
      </div>

      {/* SECURITY */}
      <div style={card}>
        <h3>Security</h3>

        <div style={toggleRow}>
          <span>Two-Factor Authentication</span>
          <Toggle value={twoFA} onChange={setTwoFA} />
        </div>

        <button style={btn}>Manage Sessions</button>
      </div>

      {/* NETWORK MANAGEMENT */}
      <div style={card}>
        <h3>Network Management</h3>
        <p>Add and manage users in your organization.</p>

        <input
          placeholder="User Name"
          style={input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          style={input}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option>Worker</option>
          <option>Supervisor</option>
          <option>Manager</option>
          <option>Admin</option>
        </select>

        <button style={btn} onClick={addUser}>
          Add User
        </button>

        {users.map((u, i) => (
          <div key={i} style={userCard}>
            <div>
              <strong>{u.name}</strong> — {u.role}
            </div>

            <button
              style={dangerBtn}
              onClick={() => deleteUser(i)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* REPORT SETTINGS */}
      <div style={card}>
        <h3>Report Settings</h3>

        <div style={toggleRow}>
          <span>Include Executive Summary</span>
          <Toggle value={true} onChange={() => {}} />
        </div>

        <div style={toggleRow}>
          <span>Auto Generate PDF</span>
          <Toggle value={true} onChange={() => {}} />
        </div>

        <button style={btn}>Customize Report Template</button>
      </div>

    </div>
  );
}

/* 🔹 TOGGLE COMPONENT */

function Toggle({ value, onChange }: any) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 50,
        height: 26,
        borderRadius: 20,
        background: value ? '#ff7a00' : '#ccc',
        display: 'flex',
        alignItems: 'center',
        padding: 3,
        cursor: 'pointer',
        transition: '0.2s',
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#fff',
          transform: value ? 'translateX(24px)' : 'translateX(0)',
          transition: '0.2s',
        }}
      />
    </div>
  );
}

/* STYLES */

const container = {
  padding: 20,
  maxWidth: 900,
  margin: '0 auto',
};

const title = {
  fontSize: 28,
  marginBottom: 20,
};

const card = {
  background: '#fff',
  padding: 20,
  marginBottom: 15,
  borderRadius: 10,
};

const input = {
  width: '100%',
  padding: 10,
  marginTop: 8,
  marginBottom: 12,
};

const label = {
  fontWeight: 600,
};

const toggleRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 15,
};

const btn = {
  padding: 10,
  background: '#ff7a00',
  color: '#fff',
  borderRadius: 6,
  marginRight: 10,
  marginTop: 5,
};

const dangerBtn = {
  padding: 8,
  background: '#d32f2f',
  color: '#fff',
  borderRadius: 6,
};

const userCard = {
  marginTop: 10,
  padding: 10,
  background: '#f4f4f4',
  borderRadius: 8,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};
