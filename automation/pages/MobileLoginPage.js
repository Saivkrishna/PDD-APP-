/**
 * automation/pages/MobileLoginPage.js
 * Mobile Page Object Model for the login screen.
 */

class MobileLoginPage {
  constructor(driver) {
    this.driver = driver;
    // Mobile Element Locators (Accessibility IDs and XPaths)
    this.usernameInput = 'accessibility id:login_email';
    this.passwordInput = 'accessibility id:login_password';
    this.loginBtn = 'accessibility id:login_submit_btn';
    this.errorMsg = 'accessibility id:login_error_msg';
  }

  async login(email, password) {
    const emailEl = await this.driver.$(this.usernameInput);
    await emailEl.setValue(email);

    const passEl = await this.driver.$(this.passwordInput);
    await passEl.setValue(password);

    const btnEl = await this.driver.$(this.loginBtn);
    await btnEl.click();
  }

  async getErrorMessage() {
    const errorEl = await this.driver.$(this.errorMsg);
    return await errorEl.getText();
  }
}

module.exports = MobileLoginPage;
