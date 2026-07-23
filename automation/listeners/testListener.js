/**
 * automation/listeners/testListener.js
 * Test listener monitoring Appium test lifecycle hooks.
 */

class TestListener {
  onTestStart(testName) {
    console.log(`[START] Test case execution: ${testName}`);
  }

  onTestSuccess(testName) {
    console.log(`[SUCCESS] Test case passed: ${testName}`);
  }

  onTestFailure(testName, error) {
    console.log(`[FAILURE] Test case failed: ${testName} - Error: ${error}`);
  }

  onTestSkipped(testName) {
    console.log(`[SKIP] Test case skipped: ${testName}`);
  }
}

module.exports = TestListener;
