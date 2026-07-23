const { after10thCategories } = require('../after10thDb');

class Category {
  constructor(id, title, icon, description, duration) {
    this.id = id;
    this.title = title;
    this.icon = icon;
    this.description = description;
    this.duration = duration;
  }

  /**
   * Retrieves all after-10th categories.
   * @returns {Category[]} Array of category instances
   */
  static getAll() {
    return after10thCategories.map(
      cat => new Category(cat.id, cat.title, cat.icon, cat.description, cat.duration)
    );
  }

  /**
   * Finds a category by its ID.
   * @param {string} id - The category ID
   * @returns {Category|null} The Category instance or null if not found
   */
  static getById(id) {
    const cat = after10thCategories.find(c => c.id === id);
    if (!cat) return null;
    return new Category(cat.id, cat.title, cat.icon, cat.description, cat.duration);
  }
}

module.exports = Category;
