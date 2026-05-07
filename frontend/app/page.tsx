export default function HomePage() {
  return (
    <div
      style={{
        padding: '40px',
        textAlign: 'center',
      }}
    >
      <h1>Sentinel Safety</h1>

      <p style={{ marginTop: '10px' }}>
        Select a section to begin
      </p>

      <div
        style={{
          marginTop: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          alignItems: 'center',
        }}
      >
        <a href="/login">Login</a>
        <a href="/signup">Create Account</a>
        <a href="/command-center">Command Center</a>
        <a href="/inspection">Inspection</a>
        <a href="/report">Reports</a>
        <a href="/settings">Settings</a>
      </div>
    </div>
  );
}
