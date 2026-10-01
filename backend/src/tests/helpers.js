/**
 * helpers.js — shared test utilities.
 *
 * Provides database connection/teardown and token generation
 * helpers used across all test files.
 */
require('dotenv').config();

const mongoose = require('mongoose');
const User = require('../models/User');
const { generateToken } = require('../utils/tokenHelper');

const TEST_URI =
  process.env.TEST_MONGODB_URI ?? 'mongodb://localhost:27017/bakers-delight-test';

/**
 * Connect to the test database.
 * Called in beforeAll() of each test file.
 */
async function connectTestDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_URI);
  }
}

/**
 * Close and clean up the test database connection.
 * Called in afterAll() of each test file.
 */
async function disconnectTestDB() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
}

/**
 * clearCollections — clears specific collections between tests.
 */
async function clearCollections(...models) {
  for (const Model of models) {
    await Model.deleteMany({});
  }
}

/**
 * createTestUser — creates a user in the test DB and returns
 * the user document plus a signed JWT.
 *
 * @param {object} overrides — fields to override defaults
 * @returns {{ user, token }}
 */
async function createTestUser(overrides = {}) {
  const defaults = {
    name: 'Test User',
    email: `test_${Date.now()}@bakersdelight.test`,
    password: 'TestPass123!',
    role: 'user',
  };

  const user = await User.create({ ...defaults, ...overrides });
  const token = generateToken(user._id);
  return { user, token };
}

/**
 * createTestAdmin — shorthand for an admin user.
 */
async function createTestAdmin(overrides = {}) {
  return createTestUser({ role: 'admin', ...overrides });
}

module.exports = {
  connectTestDB,
  disconnectTestDB,
  clearCollections,
  createTestUser,
  createTestAdmin,
};
