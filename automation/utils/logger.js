/**
 * automation/utils/logger.js
 * Logging utility for reporting test execution details.
 */

const fs = require('fs');
const path = require('path');
const config = require('../config/config');

// Ensure log directory exists
if (!fs.existsSync(config.paths.logs)) {
  fs.mkdirSync(config.paths.logs, { recursive: true });
}

const logFile = path.join(config.paths.logs, 'execution.log');
// Clear previous log
fs.writeFileSync(logFile, '');

function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] [${level}] ${message}`;
  console.log(formattedMessage);
  fs.appendFileSync(logFile, formattedMessage + '\n');
}

module.exports = {
  info: (msg) => log(msg, 'INFO'),
  error: (msg) => log(msg, 'ERROR'),
  warn: (msg) => log(msg, 'WARN'),
  debug: (msg) => log(msg, 'DEBUG'),
  getLogPath: () => logFile
};
