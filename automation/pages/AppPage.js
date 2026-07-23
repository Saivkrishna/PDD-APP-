/**
 * automation/pages/AppPage.js
 * Page Object Model for the main CareerPath AI application interface.
 */

const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class AppPage extends BasePage {
  constructor(driver) {
    super(driver);
    
    // Selectors
    this.splashButton = By.xpath("//button[contains(text(), 'Get Started') or contains(text(), 'Explore')]");
    this.searchInput = By.css("input[placeholder*='Search']");
    this.navHome = By.xpath("//div[contains(text(), 'Home') or contains(@id, 'nav-home')]");
    this.navGames = By.xpath("//div[contains(text(), 'Games') or contains(@id, 'nav-games')]");
    this.navWorkspace = By.xpath("//div[contains(text(), 'Workspace') or contains(@id, 'nav-workspace')]");
    this.navProfile = By.xpath("//div[contains(text(), 'Profile') or contains(@id, 'nav-profile')]");
    
    // Auth selectors
    this.loginEmailInput = By.css("input[type='email']");
    this.loginPasswordInput = By.css("input[type='password']");
    this.loginSubmitButton = By.xpath("//button[contains(text(), 'Sign In') or contains(text(), 'Login')]");
  }

  async startApp() {
    if (await this.isElementPresent(this.splashButton)) {
      await this.click(this.splashButton);
    }
  }

  async performSearch(query) {
    await this.sendKeys(this.searchInput, query);
  }

  async navigateToGames() {
    await this.click(this.navGames);
  }

  async navigateToWorkspace() {
    await this.click(this.navWorkspace);
  }

  async navigateToProfile() {
    await this.click(this.navProfile);
  }
}

module.exports = AppPage;
