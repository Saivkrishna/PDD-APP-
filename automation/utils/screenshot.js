/**
 * automation/utils/screenshot.js
 * Captures browser viewport screenshots on test failure.
 */

const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const logger = require('./logger');

// Ensure screenshots directory exists
if (!fs.existsSync(config.paths.screenshots)) {
  fs.mkdirSync(config.paths.screenshots, { recursive: true });
}

async function captureScreenshot(driver, testId) {
  try {
    const screenshotData = await driver.takeScreenshot();
    const fileName = `Test_${testId}_${Date.now()}.png`;
    const filePath = path.join(config.paths.screenshots, fileName);
    fs.writeFileSync(filePath, screenshotData, 'base64');
    logger.info(`Screenshot captured: ${filePath}`);
    return filePath;
  } catch (err) {
    logger.error(`Failed to capture screenshot for Test #${testId}: ${err.message}`);
    return null;
  }
}

module.exports = {
  captureScreenshot
};
