/**
 * errorHandler.js — centralised Express error handling middleware.
 *
 * Converts thrown errors into consistent JSON responses.
 * Must be registered AFTER all routes.
 */

/**
 * Send a consistent error response.
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 */
function sendError(res, statusCode, message) {
  return res.status(statusCode).json({ success: false, message });
}

/**
 * Express error-handling middleware.
 * Handles:
 *  - Mongoose CastError (invalid ObjectId)
 *  - Mongoose ValidationError
 *  - Mongoose duplicate key (code 11000)
 *  - JWT errors
 *  - Generic errors
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  // Log in development
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error] ${err.name ?? 'Error'}: ${err.message}`);
  }

  // Mongoose: invalid ObjectId  → 404 (recipe/user not found)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return sendError(res, 404, 'Resource not found — invalid ID');
  }

  // Mongoose: schema validation failed  → 400
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message).join(', ');
    return sendError(res, 400, messages);
  }

  // MongoDB: duplicate key  → 409
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? 'field';
    return sendError(res, 409, `${field} already exists`);
  }

  // JWT: invalid/expired token  → 401
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 401, 'Invalid token');
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 401, 'Token expired — please sign in again');
  }

  // CORS rejection
  if (err.message && err.message.startsWith('CORS:')) {
    return sendError(res, 403, err.message);
  }

  // Explicit status code set by controller
  const status = err.statusCode ?? err.status ?? 500;
  const message = err.message ?? 'Internal server error';

  return sendError(res, status, message);
}

module.exports = errorHandler;
