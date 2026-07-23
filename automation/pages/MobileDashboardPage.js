/**
 * automation/pages/MobileDashboardPage.js
 * Mobile Page Object Model for the dashboard screen.
 */

class MobileDashboardPage {
  constructor(driver) {
    this.driver = driver;
    // Appium Mobile Locators
    this.searchBar = 'accessibility id:search_input_box';
    this.homeTab = 'accessibility id:nav_home_tab';
    this.gamesTab = 'accessibility id:nav_games_tab';
    this.profileTab = 'accessibility id:nav_profile_tab';
  }

  async search(query) {
    const searchEl = await this.driver.$(this.searchBar);
    await searchEl.setValue(query);
  }

  async clickGames() {
    const el = await this.driver.$(this.gamesTab);
    await el.click();
  }

  async clickProfile() {
    const el = await this.driver.$(this.profileTab);
    await el.click();
  }
}

module.exports = MobileDashboardPage;
