/**
 * automation/pages/BasePage.js
 * Base Page Object Model class providing reusable Selenium operations.
 */

const { until, By } = require('selenium-webdriver');
const config = require('../config/config');

class BasePage {
  constructor(driver) {
    this.driver = driver;
  }

  async navigateTo(path = '') {
    const targetUrl = config.baseUrl.endsWith('/') ? `${config.baseUrl}${path}` : `${config.baseUrl}/${path}`;
    await this.driver.get(targetUrl);
  }

  async waitForElement(locator, timeout = config.timeout) {
    return await this.driver.wait(until.elementLocated(locator), timeout);
  }

  async waitForElementVisible(locator, timeout = config.timeout) {
    const el = await this.waitForElement(locator, timeout);
    await this.driver.wait(until.elementIsVisible(el), timeout);
    return el;
  }

  async click(locator) {
    const el = await this.waitForElementVisible(locator);
    await el.click();
  }

  async sendKeys(locator, text) {
    const el = await this.waitForElementVisible(locator);
    await el.clear();
    await el.sendKeys(text);
  }

  async getText(locator) {
    const el = await this.waitForElementVisible(locator);
    return await el.getText();
  }

  async isElementPresent(locator) {
    try {
      await this.driver.findElement(locator);
      return true;
    } catch (e) {
      return false;
    }
  }
}

module.exports = BasePage;
