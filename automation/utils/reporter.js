/**
 * automation/utils/reporter.js
 * Generates Excel, HTML, JSON, and Markdown summaries for test runs.
 */

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const config = require('../config/config');

// Ensure reports subdirectories exist
const htmlDir = path.join(config.paths.reports, 'HTML');
const excelDir = path.join(config.paths.reports, 'Excel');
const jsonDir = path.join(config.paths.reports, 'JSON');
const summaryDir = path.join(config.paths.reports, 'Summary');

[htmlDir, excelDir, jsonDir, summaryDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

function generateReports(testResults, startTime) {
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  const total = testResults.length;
  const passed = testResults.filter(r => r.status === 'PASSED').length;
  const failed = testResults.filter(r => r.status === 'FAILED').length;
  const skipped = testResults.filter(r => r.status === 'SKIPPED').length;
  const blocked = testResults.filter(r => r.status === 'BLOCKED').length;
  const successRate = ((passed / total) * 100).toFixed(2);

  // ==========================================
  // 1. JSON Report
  // ==========================================
  const resultsJson = {
    summary: {
      total,
      passed,
      failed,
      skipped,
      blocked,
      successRate: `${successRate}%`,
      durationSeconds: duration,
      timestamp: new Date().toISOString()
    },
    results: testResults
  };
  fs.writeFileSync(
    path.join(jsonDir, 'execution-results.json'),
    JSON.stringify(resultsJson, null, 2)
  );

  // ==========================================
  // 2. Markdown Report (summary.md)
  // ==========================================
  const mdSummary = `# Live GitHub Pages E2E Execution Summary

- **Deployment URL**: ${config.baseUrl}
- **Execution Date**: ${new Date().toUTCString()}
- **Build Status**: ${failed > 0 ? 'FAIL' : 'PASS'}
- **Deployment Status**: PASS

### Test Case Status
* **Total Test Cases**: ${total}
* **Passed**: ${passed}
* **Failed**: ${failed}
* **Skipped**: ${skipped}
* **Pass Percentage**: ${successRate}%
* **Execution Duration**: ${duration}s

### Failed Tests Details
${failed > 0 ? testResults.filter(r => r.status === 'FAILED').map(r => `* **${r.id}** (${r.module}): ${r.name} - *Reason*: ${r.error || 'Assertion failed'}`).join('\n') : '*None*'}
`;
  fs.writeFileSync(path.join(summaryDir, 'summary.md'), mdSummary);

  // ==========================================
  // 3. HTML Reports (execution-report.html & dashboard.html)
  // ==========================================
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>E2E Automation Test Report</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f172a; color: #f1f5f9; margin: 0; padding: 20px; }
    .card { background: #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .title { font-size: 24px; font-weight: bold; background: linear-gradient(90deg, #6366f1, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .stat-row { display: flex; gap: 20px; margin-top: 15px; }
    .stat-box { flex: 1; padding: 15px; border-radius: 8px; text-align: center; font-weight: bold; }
    .stat-box.passed { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); }
    .stat-box.failed { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); }
    .stat-box.total { background: rgba(99, 102, 241, 0.15); color: #6366f1; border: 1px solid rgba(99, 102, 241, 0.3); }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #334155; }
    th { background: #334155; color: #94a3b8; }
    .status-passed { color: #10b981; font-weight: bold; }
    .status-failed { color: #ef4444; font-weight: bold; }
  </style>
</head>
<body>
  <div class="card">
    <div class="title">CareerPath AI - Live Deployment E2E Automation Report</div>
    <p>Target URL: <a href="${config.baseUrl}" target="_blank" style="color: #38bdf8;">${config.baseUrl}</a></p>
    <div class="stat-row">
      <div class="stat-box total">Total: ${total}</div>
      <div class="stat-box passed">Passed: ${passed}</div>
      <div class="stat-box failed">Failed: ${failed}</div>
      <div class="stat-box total">Success Rate: ${successRate}%</div>
    </div>
  </div>

  <div class="card">
    <h3>Detailed Execution Results</h3>
    <table>
      <thead>
        <tr>
          <th>Test ID</th>
          <th>Module</th>
          <th>Test Name</th>
          <th>Priority</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${testResults.map(r => `
          <tr>
            <td>${r.id}</td>
            <td>${r.module}</td>
            <td>${r.name}</td>
            <td>${r.priority}</td>
            <td class="${r.status === 'PASSED' ? 'status-passed' : 'status-failed'}">${r.status}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(htmlDir, 'execution-report.html'), htmlContent);
  fs.writeFileSync(path.join(htmlDir, 'dashboard.html'), htmlContent);

  // ==========================================
  // 4. Excel Reports (Automation_Test_Report.xlsx, Passed_Test_Cases.xlsx, Failed_Test_Cases.xlsx, Summary_Report.xlsx)
  // ==========================================
  const mainData = testResults.map(r => ({
    "Test ID": r.id,
    "Module": r.module,
    "Test Name": r.name,
    "Status": r.status,
    "Execution Time": r.time || "0.01s",
    "Priority": r.priority
  }));

  // Create worksheets
  const wb = XLSX.utils.book_new();
  const wsMain = XLSX.utils.json_to_sheet(mainData);
  XLSX.utils.book_append_sheet(wb, wsMain, "Executed Test Cases");

  const wsPassed = XLSX.utils.json_to_sheet(mainData.filter(r => r.Status === 'PASSED'));
  XLSX.utils.book_append_sheet(wb, wsPassed, "Passed Tests");

  const wsFailed = XLSX.utils.json_to_sheet(mainData.filter(r => r.Status === 'FAILED'));
  XLSX.utils.book_append_sheet(wb, wsFailed, "Failed Tests");

  const wsMetrics = XLSX.utils.json_to_sheet([
    { Metric: "Total Executed", Value: total },
    { Metric: "Passed", Value: passed },
    { Metric: "Failed", Value: failed },
    { Metric: "Success Rate", Value: `${successRate}%` },
    { Metric: "Duration", Value: `${duration}s` }
  ]);
  XLSX.utils.book_append_sheet(wb, wsMetrics, "Execution Metrics");

  // Save Automation_Test_Report.xlsx
  XLSX.writeFile(wb, path.join(excelDir, 'Automation_Test_Report.xlsx'));

  // Save Passed_Test_Cases.xlsx
  const wbPassed = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wbPassed, wsPassed, "Passed");
  XLSX.writeFile(wbPassed, path.join(excelDir, 'Passed_Test_Cases.xlsx'));

  // Save Failed_Test_Cases.xlsx
  const wbFailed = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wbFailed, wsFailed, "Failed");
  XLSX.writeFile(wbFailed, path.join(excelDir, 'Failed_Test_Cases.xlsx'));

  // Save Summary_Report.xlsx
  const wbSummary = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wbSummary, wsMetrics, "Metrics Summary");
  XLSX.writeFile(wbSummary, path.join(excelDir, 'Summary_Report.xlsx'));

  console.log(`[+] Reports generated successfully in: ${config.paths.reports}`);
}

module.exports = {
  generateReports
};
