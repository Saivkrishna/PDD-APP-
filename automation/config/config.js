/**
 * automation/config/config.js
 * Central configuration file for the Selenium automation framework.
 */

const path = require('path');

module.exports = {
  baseUrl: process.env.BASE_URL || 'https://Saivkrishna.github.io/PDD-APP-/',
  timeout: parseInt(process.env.TEST_TIMEOUT || '10000', 10),
  headless: process.env.HEADLESS !== 'false',
  paths: {
    screenshots: path.join(__dirname, '../../Test Results/Screenshots'),
    logs: path.join(__dirname, '../../Test Results/Logs'),
    reports: path.join(__dirname, '../../Test Results')
  }
};
