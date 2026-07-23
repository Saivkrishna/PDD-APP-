# CareerPath AI - Android Appium E2E Automation Guide

This guide details folder structures, configuration capabilities, local Appium executions, and troubleshooting steps.

## 📁 Mobile Automation Folder Structure
```
automation/
├── pages/
│   ├── MobileLoginPage.js
│   └── MobileDashboardPage.js
├── tests/
│   └── mobile-e2e.test.js
├── data/
│   └── mobileTestData.json
├── config/
│   └── appium.config.js
├── utils/
│   └── mobile-reporter.js
├── listeners/
│   └── testListener.js
└── runners/
    └── appiumRunner.js
```

---

## 💻 Local Execution Guide

To run the Appium mobile test suite locally:

1. **Install Appium Server and Drivers**:
   ```bash
   npm install -g appium
   appium driver install uiautomator2
   ```

2. **Launch Android Emulator**:
   Start your configured Android Virtual Device (AVD) from Android Studio.

3. **Execute the runner script**:
   ```bash
   # Starts Appium server automatically and executes tests
   node automation/runners/appiumRunner.js
   ```

4. **Verify Outputs**:
   Check `automation/reports/` for generated HTML, Excel, and JSON test reports.

---

## 🛠️ Mobile Troubleshooting Guide

### Issue 1: Appium cannot connect to emulator
* **Solution**: Ensure your emulator is running and detected by running `adb devices`. Update `deviceName` in `appium.config.js` if necessary.

### Issue 2: Build failure in Gradle / APK creation
* **Solution**: Ensure Java JDK 17 is configured on your system path and Android SDK path matches (`ANDROID_HOME`).
