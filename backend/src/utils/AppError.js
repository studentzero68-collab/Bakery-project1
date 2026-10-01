/**
 * AppError — custom error class that carries an HTTP status code.
 *
 * Usage:
 *   throw new AppError('Recipe not found', 404);
 *   throw new AppError('Not authorised', 403);
 */
class AppError extends Error {
  /**
   * @param {string} message  — human-readable message returned in the API response
   * @param {number} statusCode — HTTP status code
   */
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
