/**
 * authController.js — authentication handlers for Baker's Delight.
 *
 * Database: Supabase (PostgreSQL)
 * Table:    users
 *
 * Custom JWT flow — we manage tokens ourselves so the frontend
 * API contract (Bearer token in Authorization header) stays unchanged.
 *
 * POST /api/auth/register → register
 * POST /api/auth/login    → login
 * GET  /api/auth/me       → getMe
 */
const { supabase } = require('../config/supabase');
const AppError = require('../utils/AppError');
const { success } = require('../utils/response');
const { generateToken } = require('../utils/tokenHelper');
const { hashPassword, comparePassword, sanitiseUser } = require('../models/User');

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────────────────────────────────────────

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Check for existing account
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (existing) {
      return next(new AppError('An account with that email already exists', 409));
    }

    const password_hash = await hashPassword(password);

    const { data: user, error } = await supabase
      .from('users')
      .insert({
        name,
        email: email.toLowerCase(),
        password_hash,
        role: 'user',
      })
      .select()
      .single();

    if (error) return next(new AppError(error.message, 500));

    const token = generateToken(user.id);

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

    // Fetch the user including password_hash
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (error) return next(new AppError(error.message, 500));

    if (!user || !(await comparePassword(password, user.password_hash))) {
      // Deliberately vague — don't reveal which part is wrong
      return next(new AppError('Invalid email or password', 401));
    }

    const token = generateToken(user.id);

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
// GET /api/auth/me — requires protect middleware
// ─────────────────────────────────────────────────────────────────────────────

async function getMe(req, res, next) {
  try {
    // req.user is attached by the protect middleware (already sanitised)
    return success(res, req.user);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, getMe };
