import { execSync } from 'child_process';
import fs from 'fs';

async function globalTeardown() {
  console.log('🧩 Running global teardown...');
  const resultsDir = 'test-results';

  // Check if any failures exist
  const hasFailures = fs.existsSync(resultsDir) && fs.readdirSync(resultsDir).some((f) => f.includes('failed'));

  if (hasFailures) {
    console.log('🩹 Detected failed tests. Running Playwright Healer...');
    execSync('npx playwright heal', { stdio: 'inherit' });
    execSync('npx playwright test --grep "@healed"', { stdio: 'inherit' });
  } else {
    console.log('✅ No failed tests detected. Skipping healing.');
  }
}

export default globalTeardown;
