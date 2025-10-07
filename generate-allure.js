import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

// 🕒 Create timestamp for folder and banner
const date = new Date();
const timestamp = date.toISOString().replace(/[:.]/g, '-');
const reportFolder = path.join('allure-reports', timestamp);
const runTimestamp = date.toISOString();

// ✅ Ensure allure-results exists
if (!fs.existsSync('allure-results')) {
    console.error('❌ No allure-results folder found. Please run your Playwright tests first.');
    process.exit(1);
}

// ✅ Create report output folder
if (!fs.existsSync(reportFolder)) {
    fs.mkdirSync(reportFolder, { recursive: true });
}

console.log('Generating Allure report...\n');

// 🧩 Generate Allure report only
exec(`npx allure generate allure-results --clean -o "${reportFolder}"`, (error, stdout, stderr) => {
    console.log(stdout);
    if (error) {
        console.error(stderr);
        console.error(`❌ Error generating report: ${error.message}`);
        return;
    }

    console.log(`✅ Allure report generated at: ${reportFolder}`);

    // 🧾 Inject date-time banner into report HTML
    const indexHtmlPath = path.join(reportFolder, 'index.html');
    if (fs.existsSync(indexHtmlPath)) {
        let html = fs.readFileSync(indexHtmlPath, 'utf8');
        const banner = `<div style="position:fixed;top:0;left:0;width:100%;background:#2a2a2a;color:white;padding:5px;text-align:center;z-index:9999;font-size:14px;">
      Test Run Time: ${runTimestamp}
    </div><div style="margin-top:30px"></div>`;
        html = html.replace(/(<body.*?>)/, `$1${banner}`);
        fs.writeFileSync(indexHtmlPath, html, 'utf8');
        console.log('✅ Added date-time banner to Allure report');
    }

    console.log('Opening report...');
    exec(`npx allure open "${reportFolder}"`);
});
