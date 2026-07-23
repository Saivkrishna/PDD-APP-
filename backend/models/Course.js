const { after10thCourses } = require('../after10thDb');

class Course {
  constructor(data) {
    this.id = data.id;
    this.categoryId = data.categoryId;
    this.title = data.title;
    this.icon = data.icon;
    this.description = data.description;
    this.duration = data.duration;
    this.skillsRequired = data.skillsRequired || [];
    this.higherStudies = data.higherStudies || [];
    this.futureScope = data.futureScope || '';
    this.careerOpportunities = data.careerOpportunities || [];
  }

  /**
   * Retrieves all after-10th courses.
   * @returns {Course[]} Array of course instances
   */
  static getAll() {
    return after10thCourses.map(course => new Course(course));
  }

  /**
   * Retrieves all courses belonging to a specific category ID.
   * @param {string} categoryId - The category ID to filter by
   * @returns {Course[]} Array of course instances in that category
   */
  static getByCategoryId(categoryId) {
    const courses = after10thCourses.filter(c => c.categoryId === categoryId);
    return courses.map(course => new Course(course));
  }

  /**
   * Finds a course by its ID.
   * @param {string} id - The course ID
   * @returns {Course|null} The Course instance or null if not found
   */
  static getById(id) {
    const course = after10thCourses.find(c => c.id === id);
    if (!course) return null;
    return new Course(course);
  }
}

module.exports = Course;
