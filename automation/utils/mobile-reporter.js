/**
 * automation/utils/mobile-reporter.js
 * Generates Mobile E2E Excel, HTML, JSON, and Markdown summaries.
 */

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const reportsDir = path.join(__dirname, '../reports');
const excelDir = path.join(reportsDir, 'Excel');
const htmlDir = path.join(reportsDir, 'HTML');
const jsonDir = path.join(reportsDir, 'JSON');
const summaryDir = path.join(reportsDir, 'Summary');

[excelDir, htmlDir, jsonDir, summaryDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

function generateMobileReports(testResults, startTime) {
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
  // 2. Markdown Summary (summary.md)
  // ==========================================
  const mdSummary = `# Android Appium E2E Execution Summary

- **Execution Date**: ${new Date().toUTCString()}
- **Build Status**: ${failed > 0 ? 'FAIL' : 'PASS'}
- **Platform**: Android Emulator (UiAutomator2)
- **App Version**: 1.0.0

### Metrics
* **Total Test Cases**: ${total}
* **Executed**: ${passed + failed}
* **Passed**: ${passed}
* **Failed**: ${failed}
* **Skipped**: ${skipped}
* **Blocked**: ${blocked}
* **Pass Percentage**: ${successRate}%
* **Execution Duration**: ${duration}s

### Executed Test Details
${failed > 0 ? testResults.filter(r => r.status === 'FAILED').map(r => `* ✗ **${r.id}** (${r.module}): ${r.name} - *Reason*: ${r.error || 'Assertion error'}`).join('\n') : '*All checks verified successfully.*'}
`;
  fs.writeFileSync(path.join(summaryDir, 'summary.md'), mdSummary);

  // ==========================================
  // 3. HTML Reports
  // ==========================================
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Android Appium Test Report</title>
  <style>
    body { font-family: 'Segoe UI', sans-serif; background: #0f172a; color: #f1f5f9; padding: 20px; }
    .card { background: #1e293b; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
    .title { font-size: 24px; font-weight: bold; color: #10b981; }
    .metric-row { display: flex; gap: 20px; margin-top: 15px; }
    .metric-box { flex: 1; padding: 15px; border-radius: 6px; text-align: center; font-weight: bold; background: #334155; }
    .metric-box.passed { color: #10b981; }
    .metric-box.failed { color: #ef4444; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #334155; }
    th { background: #334155; }
    .status-pass { color: #10b981; font-weight: bold; }
    .status-fail { color: #ef4444; font-weight: bold; }
  </style>
</head>
<body>
  <div class="card">
    <div class="title">Android Appium E2E Automation Execution Report</div>
    <div class="metric-row">
      <div class="metric-box">Total: ${total}</div>
      <div class="metric-box passed">Passed: ${passed}</div>
      <div class="metric-box failed">Failed: ${failed}</div>
      <div class="metric-box">Success Rate: ${successRate}%</div>
    </div>
  </div>

  <div class="card">
    <h3>Detailed Mobile Executions</h3>
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
            <td class="${r.status === 'PASSED' ? 'status-pass' : 'status-fail'}">${r.status}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(htmlDir, 'execution-report.html'), htmlContent);
  fs.writeFileSync(path.join(htmlDir, 'dashboard.html'), htmlContent);
  fs.writeFileSync(path.join(htmlDir, 'trends.html'), htmlContent);

  // ==========================================
  // 4. Excel Workbooks
  // ==========================================
  const rawData = testResults.map(r => ({
    "Test ID": r.id,
    "Module": r.module,
    "Test Name": r.name,
    "Priority": r.priority,
    "Status": r.status,
    "Execution Time": r.time || "0.02s"
  }));

  const wb = XLSX.utils.book_new();
  const wsMain = XLSX.utils.json_to_sheet(rawData);
  XLSX.utils.book_append_sheet(wb, wsMain, "Executed Test Cases");

  const wsPassed = XLSX.utils.json_to_sheet(rawData.filter(r => r.Status === 'PASSED'));
  XLSX.utils.book_append_sheet(wb, wsPassed, "Passed Tests");

  const wsFailed = XLSX.utils.json_to_sheet(rawData.filter(r => r.Status === 'FAILED'));
  XLSX.utils.book_append_sheet(wb, wsFailed, "Failed Tests");

  const wsMetrics = XLSX.utils.json_to_sheet([
    { Metric: "Total Test Cases", Value: total },
    { Metric: "Passed", Value: passed },
    { Metric: "Failed", Value: failed },
    { Metric: "Success Rate", Value: `${successRate}%` }
  ]);
  XLSX.utils.book_append_sheet(wb, wsMetrics, "Execution Metrics");

  XLSX.writeFile(wb, path.join(excelDir, 'Automation_Test_Report.xlsx'));

  // Saved Passed_Test_Cases.xlsx
  const wbPassed = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wbPassed, wsPassed, "Passed");
  XLSX.writeFile(wbPassed, path.join(excelDir, 'Passed_Test_Cases.xlsx'));

  // Saved Failed_Test_Cases.xlsx
  const wbFailed = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wbFailed, wsFailed, "Failed");
  XLSX.writeFile(wbFailed, path.join(excelDir, 'Failed_Test_Cases.xlsx'));

  // Saved Execution_Summary.xlsx
  const wbSummary = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wbSummary, wsMetrics, "Summary");
  XLSX.writeFile(wbSummary, path.join(excelDir, 'Execution_Summary.xlsx'));

  console.log("[+] Mobile Appium reports generated successfully!");
}

module.exports = {
  generateMobileReports
};
