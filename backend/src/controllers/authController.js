/**
 * authController.js — handlers for authentication endpoints.
 *
 * POST /api/auth/register → register
 * POST /api/auth/login    → login
 * GET  /api/auth/me       → getMe
 */
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { success } = require('../utils/response');
const { generateToken } = require('../utils/tokenHelper');

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Signs and returns a JWT for the given user id.
 */
function signToken(userId) {
  return generateToken(userId);
}

/**
 * Strips the password field from a user document before sending.
 */
function sanitiseUser(user) {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────────────────────────────────────────

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Prevent duplicate registrations
    const exists = await User.findOne({ email });
    if (exists) {
      return next(new AppError('An account with that email already exists', 409));
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      data: sanitiseUser(user),
    });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────────────────────────────────────

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Explicitly select password (it is select:false by default)
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      // Deliberately vague — don't reveal which part is wrong
      return next(new AppError('Invalid email or password', 401));
    }

    const token = signToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      data: sanitiseUser(user),
    });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/me  — requires protect middleware
// ─────────────────────────────────────────────────────────────────────────────

async function getMe(req, res, next) {
  try {
    // req.user is attached by the protect middleware
    return success(res, sanitiseUser(req.user));
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, getMe };
