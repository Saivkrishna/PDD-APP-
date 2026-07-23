/**
 * automation/runners/appiumRunner.js
 * Runner node script to spin up Appium server and execute test files.
 */

const { spawn } = require('child_process');
const path = require('path');

console.log("[+] Starting Appium Server on port 4723...");
const appium = spawn('npx', ['appium', '--port', '4723'], { shell: true });

appium.stdout.on('data', (data) => {
  const output = data.toString();
  if (output.includes('Appium REST http interface listener started')) {
    console.log("[+] Appium Server initialized and ready!");
    
    // Spawn test suite
    console.log("[+] Spawning Mobile E2E Test Suite...");
    const runner = spawn('node', [path.join(__dirname, '../tests/mobile-e2e.test.js')], { stdio: 'inherit', shell: true });
    
    runner.on('close', (code) => {
      console.log(`[+] Mobile E2E Test Suite finished with exit code ${code}`);
      appium.kill();
      process.exit(code);
    });
  }
});

appium.on('close', () => {
  console.log("[-] Appium Server stopped.");
});
