const fs = require('fs');
const path = require('path');

const BACKEND_URL = 'http://localhost:4000';
const FRONTEND_FILES = [
  'app/inspection/walkthrough/page.tsx',
  'app/analytics/page.tsx',
  'lib/localExporter.ts',
  'lib/storage.ts'
];

async function runDiagnostics() {
  console.log('\x1b[36m%s\x1b[0m', '\n🛡️  SENTINEL SAFETY SYSTEM DIAGNOSTICS');
  console.log('====================================');

  // 1. Backend Connectivity
  process.stdout.write('📡 Backend Connectivity: ');
  try {
    const res = await fetch(`${BACKEND_URL}/health`);
    if (res.ok) {
      const data = await res.json();
      console.log('\x1b[32m%s\x1b[0m', 'ONLINE');
      console.log(`📊 DB Status: \x1b[32m${data.database.toUpperCase()}\x1b[0m`);
      console.log(`⏱️  Timestamp: ${data.timestamp}`);
    } else {
      console.log('\x1b[31m%s\x1b[0m', 'ERROR (' + res.status + ')');
    }
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', 'OFFLINE (Ensure port 4000 is listening)');
  }

  // 2. Critical File Verification
  console.log('\n📁 Verifying Critical Frontend Assets:');
  FRONTEND_FILES.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, '../', file));
    process.stdout.write(`${exists ? '\x1b[32m✅\x1b[0m' : '\x1b[31m❌\x1b[0m'} ${file}\n`);
  });

  // 3. Environment Check
  console.log('\n🔐 Environment Configuration:');
  const envPath = path.join(__dirname, '../../backend/.env');
  if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, 'utf8');
    const hasPort = env.includes('PORT=4000');
    console.log(`${hasPort ? '\x1b[32m✅\x1b[0m' : '\x1b[33m⚠️\x1b[0m'} Backend Port Alignment (4000)`);
  } else {
    console.log('\x1b[31m%s\x1b[0m', '❌ Backend .env file missing');
  }

  // 4. Build Readiness
  console.log('\n🏗️  System Integrity:');
  const buildErrorLog = path.join(__dirname, '../build-error.log');
  if (fs.existsSync(buildErrorLog)) {
    const stats = fs.statSync(buildErrorLog);
    const lastModified = new Date(stats.mtime);
    console.log(`\x1b[33m%s\x1b[0m`, `⚠️  Build errors detected in log (${lastModified.toLocaleString()})`);
  } else {
    console.log('\x1b[32m%s\x1b[0m', '✅ No active build error logs detected');
  }

  console.log('\n====================================');
  console.log('\x1b[36m%s\x1b[0m', 'DIAGNOSTICS COMPLETE\n');
}

runDiagnostics();
