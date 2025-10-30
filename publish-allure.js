// publish-allure.js
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const teamsPath = 'C:\\Users\\nandan.avadhani\\Neviton Softech Pvt Ltd\\QA Automation reports - QA Automation'; // your synced Teams folder
const sourceFolder = path.join('allure-report'); // local allure output folder
const destinationFolder = path.join(
  teamsPath,
  `Allure_Report_${new Date().toISOString().replace(/[:.]/g, '-')}`
);

// 🔍 Helper function to copy recursively
function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
  for (const item of fs.readdirSync(from)) {
    const srcPath = path.join(from, item);
    const destPath = path.join(to, item);
    const stats = fs.statSync(srcPath);
    if (stats.isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (!fs.existsSync(sourceFolder)) {
  console.error('❌ No Allure report folder found. Run `npm run allure:generate` first.');
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Do you want to publish the latest Allure report folder to Teams shared path? (y/n): ', (answer) => {
  rl.close();
  if (answer.toLowerCase() !== 'y') {
    console.log('🛑 Publish canceled.');
    process.exit(0);
  }

  console.log('📂 Copying Allure report to Teams shared folder...');
  copyFolderSync(sourceFolder, destinationFolder);
  console.log(`✅ Report folder copied successfully:\n${destinationFolder}`);
  console.log('\n📎 You can open index.html directly in Teams Files or from this local path.');
});
