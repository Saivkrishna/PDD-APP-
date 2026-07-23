# CareerPath AI - E2E Selenium Test Automation Guide

This guide details local and CI/CD pipelines execution, page object models, folder structures, and troubleshooting tips.

## 📁 Automation Folder Structure
```
automation/
├── pages/
│   ├── BasePage.js
│   └── AppPage.js
├── tests/
│   └── e2e.test.js
├── data/
│   └── testData.json
├── utils/
│   ├── logger.js
│   ├── reporter.js
│   └── screenshot.js
├── config/
│   └── config.js
└── reports/
    ├── Excel/
    ├── HTML/
    ├── JSON/
    └── Summary/
```

---

## 💻 Local Execution Guide

To run the full suite of 440 test cases locally against your React development server:

1. **Start the application servers**:
   ```bash
   # Start backend
   cd backend && npm start
   # Start frontend
   cd frontend && npm start
   ```

2. **Execute the automation test script**:
   ```bash
   # Navigate to root folder and run tests
   npm run install-all
   node automation/tests/e2e.test.js
   ```

3. **Check the outputs**:
   View generated reports inside the `automation/reports/` folder.

---

## 🚀 CI/CD Execution Guide (GitHub Actions)

Your pipeline runs automatically on every code push to the `main` branch. 

### Branch Setup for GitHub Pages:
1. Ensure your repository has **GitHub Pages** enabled.
2. Go to **Settings > Pages** on your GitHub repository.
3. Under **Build and deployment**, set Source to **Deploy from a branch**.
4. Set the branch to `gh-pages` and folder to `/ (root)`.

---

## 🛠️ Troubleshooting Guide

### Issue 1: WebDriver fails to start
* **Solution**: Ensure Google Chrome is installed on the machine. Selenium 4 automatically handles downloading matching ChromeDriver binaries.

### Issue 2: "Repository not found" or "Deployment returns 404"
* **Solution**: Ensure your target URL has the correct trailing hyphen casing matching the GitHub repository name (`PDD-APP-`).
