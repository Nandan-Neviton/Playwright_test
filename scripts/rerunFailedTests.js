/**
 * Reruns only failed and skipped Playwright tests from the last run.
 * Generates classic Allure report (old style) after rerun.
 * Merges rerun results with original ones.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function readJsonSafe(filePath) {
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
      console.error(`❌ Error parsing ${filePath}:`, e.message);
    }
  }
  return null;
}

/**
 * Find latest allure-results folder (in case there are multiple)
 */
function findLatestAllureResults() {
  const root = 'allure-reports';
  const defaultDir = 'allure-results';
  if (fs.existsSync(defaultDir)) return defaultDir;

  if (fs.existsSync(root)) {
    const dirs = fs
      .readdirSync(root)
      .map((f) => path.join(root, f))
      .filter((f) => fs.existsSync(path.join(f, 'allure-results')))
      .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);

    if (dirs.length > 0) {
      return path.join(dirs[0], 'allure-results');
    }
  }
  return null;
}

/**
 * Extract failed/skipped test files from Allure results
 */
function extractFromAllure(allureResultsPath) {
  const files = [];
  const resultFiles = fs.readdirSync(allureResultsPath).filter((f) => f.endsWith('-result.json'));

  for (const file of resultFiles) {
    const data = readJsonSafe(path.join(allureResultsPath, file));
    if (!data) continue;

    const status = data.status || data.stage;
    if (['failed', 'skipped', 'broken'].includes(status)) {
      const testFile =
        data.labels?.find((l) => l.name === 'testFile')?.value ||
        data.testFile ||
        data.fullName?.match(/tests[\\/].+\.spec\.js/)?.[0];

      if (testFile) {
        files.push(testFile.replace(/\\/g, '/'));
      }
    }
  }

  return [...new Set(files)];
}

/**
 * Extract failed/skipped tests from playwright-report/.last-run.json
 */
function extractFromPlaywright() {
  const lastRunFile = path.join('playwright-report', '.last-run.json');
  if (!fs.existsSync(lastRunFile)) return [];

  const data = readJsonSafe(lastRunFile);
  if (!data?.suites) return [];

  const failed = new Set();

  const traverse = (suite) => {
    suite.specs?.forEach((spec) => {
      const hasFailedOrSkipped = spec.tests.some((test) =>
        test.results.some((r) => ['failed', 'skipped'].includes(r.status))
      );
      if (hasFailedOrSkipped) failed.add(spec.file);
    });
    suite.suites?.forEach(traverse);
  };

  data.suites.forEach(traverse);
  return [...failed];
}

/**
 * Merge rerun allure-results into main allure-results
 */
function mergeAllureResults(mainDir, rerunDir) {
  if (!fs.existsSync(rerunDir)) return;
  const rerunFiles = fs.readdirSync(rerunDir);

  console.log(`🔗 Merging ${rerunFiles.length} rerun result files into ${mainDir}...`);

  for (const file of rerunFiles) {
    const src = path.join(rerunDir, file);
    const dest = path.join(mainDir, file);
    fs.copyFileSync(src, dest);
  }
}

// -------------------- MAIN EXECUTION --------------------
console.log('🔍 Searching for latest Allure results...');
const allureResultsPath = findLatestAllureResults();
let failedOrSkipped = [];

if (allureResultsPath && fs.existsSync(allureResultsPath)) {
  console.log(`📂 Found Allure results at: ${allureResultsPath}`);
  failedOrSkipped = extractFromAllure(allureResultsPath);
}

if (failedOrSkipped.length === 0) {
  console.log('📁 Checking Playwright .last-run.json...');
  failedOrSkipped = extractFromPlaywright();
}

if (failedOrSkipped.length === 0) {
  console.log('✅ No failed or skipped tests found in last run.');
  process.exit(0);
}

console.log(`\n🎯 Rerunning ${failedOrSkipped.length} failed/skipped test files:\n`);
failedOrSkipped.forEach((f) => console.log(' -', f));

const rerunResultsDir = 'allure-results-rerun';
if (fs.existsSync(rerunResultsDir)) {
  fs.rmSync(rerunResultsDir, { recursive: true, force: true });
}

// Rerun failed/skipped tests with a single worker
try {
  console.log(`\n🔁 Rerunning failed/skipped tests with 1 worker...`);
  execSync(
    `npx playwright test ${failedOrSkipped.join(
      ' '
    )} --workers=1 --reporter=line,allure-playwright --output ${rerunResultsDir}`,
    { stdio: 'inherit' }
  );

  // Merge rerun results into main results
  mergeAllureResults(allureResultsPath, rerunResultsDir);

  console.log('\n📊 Generating merged Allure report (old style)...');
  execSync(`allure generate ${allureResultsPath} --clean -o allure-report`, { stdio: 'inherit' });

  console.log('\n🌐 Opening Allure report...');
  execSync(`allure open allure-report`, { stdio: 'inherit' });
} catch (err) {
  console.error('\n❌ Some tests still failed during rerun.');
  process.exit(1);
}
