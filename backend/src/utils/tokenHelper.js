/**
 * tokenHelper.js — JWT token generation and verification utilities.
 *
 * Centralises all JWT operations so they are easy to test and update.
 */
const jwt = require('jsonwebtoken');
const AppError = require('./AppError');

/**
 * generateToken — creates a signed JWT for the given user ID.
 *
 * @param {string|ObjectId} userId
 * @returns {string} signed JWT
 */
function generateToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new AppError('JWT_SECRET is not configured', 500);
  }
  return jwt.sign(
    { id: userId.toString() },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' }
  );
}

/**
 * verifyToken — verifies a JWT and returns the decoded payload.
 *
 * @param {string} token
 * @returns {{ id: string, iat: number, exp: number }}
 * @throws AppError on invalid or expired tokens
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Token expired — please sign in again', 401);
    }
    throw new AppError('Invalid token', 401);
  }
}

module.exports = { generateToken, verifyToken };
