import fs from 'fs';
import path from 'path';

async function globalTeardown() {
  console.log('🧩 Running global teardown...');

  const resultsDir = path.join(process.cwd(), 'playwright-report');
  const summaryFile = path.join(resultsDir, '.report.json');

  let hasFailures = false;

  if (fs.existsSync(summaryFile)) {
    const report = JSON.parse(fs.readFileSync(summaryFile, 'utf-8'));
    hasFailures = report.stats.failed > 0;
  }

  if (hasFailures) {
    console.log('\n❌ Some tests failed!');

    console.log('\n🩹 Playwright Healer is available via VS Code + Copilot Chat.');
    console.log('Follow these steps to heal failed tests:');
    console.log('1️⃣ Open VS Code in this project.');
    console.log('2️⃣ Make sure GitHub Copilot Chat is installed.');
    console.log('3️⃣ In Copilot Chat, type:');
    console.log('   @Playwright Healer fix my last failed test run');
    console.log('4️⃣ Review and apply suggested fixes.');
    console.log('5️⃣ Re-run your tests to verify they are fixed.\n');
  } else {
    console.log('✅ All tests passed! No healing needed.');
  }
}

export default globalTeardown;
