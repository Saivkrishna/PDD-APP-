/**
 * automation/config/appium.config.js
 * Configuration file for Appium Android E2E automation.
 */

module.exports = {
  port: 4723,
  host: '127.0.0.1',
  capabilities: {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Android Emulator',
    'appium:app': './android/app/build/outputs/apk/debug/app-debug.apk',
    'appium:autoGrantPermissions': true,
    'appium:noReset': false,
    'appium:fullReset': false
  },
  timeout: 15000
};
