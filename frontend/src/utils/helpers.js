/**
 * helpers.js — frontend utility functions for Baker's Delight.
 */

/**
 * formatCategory — converts a category key to a display label.
 * @param {string} category
 * @returns {string}
 */
export function formatCategory(category) {
  const labels = {
    dessert: 'Desserts',
    breakfast: 'Breakfast',
    lunch: 'Lunch Bakes',
  };
  return labels[category] ?? category;
}

/**
 * formatAudience — converts an audience key to a display label.
 * @param {string} audience
 * @returns {string}
 */
export function formatAudience(audience) {
  const labels = {
    family: 'Family',
    friend: 'Friend',
    romantic: 'Romantic',
  };
  return labels[audience] ?? audience;
}

/**
 * getCategoryDotClass — returns the CSS dot class for a given category.
 * @param {string} category
 * @returns {string}
 */
export function getCategoryDotClass(category) {
  const classes = {
    dessert: 'dot-dessert',
    breakfast: 'dot-breakfast',
    lunch: 'dot-lunch',
  };
  return classes[category] ?? 'dot-dessert';
}

/**
 * truncateText — truncates a string to the given length with an ellipsis.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text ?? '';
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

/**
 * isAdminUser — returns true if the user has the admin role.
 * @param {object|null} user
 * @returns {boolean}
 */
export function isAdminUser(user) {
  return user?.role === 'admin';
}
