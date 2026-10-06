/**
 * User.js — User helpers for Baker's Delight.
 *
 * Mongoose has been removed. The database is now Supabase (PostgreSQL).
 * This file provides the password-hashing helpers that the auth
 * controller still needs.
 *
 * Supabase table: users
 * Columns: id (uuid), name, email, role (default 'user'),
 *          password_hash, created_at, updated_at
 *
 * Passwords are NEVER stored in plain text.
 */
const bcrypt = require('bcryptjs');

const ROLES = ['user', 'admin'];

/**
 * hashPassword — hashes a plain-text password.
 * @param {string} plain
 * @returns {Promise<string>} bcrypt hash
 */
async function hashPassword(plain) {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '12', 10);
  return bcrypt.hash(plain, saltRounds);
}

/**
 * comparePassword — compares a plain-text password against a stored hash.
 * @param {string} plain
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

/**
 * sanitiseUser — strips sensitive fields before sending a user to the client.
 * @param {object} user  — row from the users table
 * @returns {object}
 */
function sanitiseUser(user) {
  if (!user) return null;
  const { password_hash, ...safe } = user;
  return safe;
}

module.exports = { ROLES, hashPassword, comparePassword, sanitiseUser };
