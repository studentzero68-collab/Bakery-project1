/**
 * helpers.js — shared test utilities.
 *
 * Uses mongodb-memory-server so tests run without a real MongoDB instance.
 * Each test file gets a fresh in-memory database — no external dependencies needed.
 */
require('dotenv').config();

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/User');
const { generateToken } = require('../utils/tokenHelper');

let mongod;

/**
 * connectTestDB — starts an in-memory MongoDB instance and connects Mongoose.
 * Called in beforeAll() of each test file.
 */
async function connectTestDB() {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
}

/**
 * disconnectTestDB — drops the database, closes the connection,
 * and stops the in-memory server.
 * Called in afterAll() of each test file.
 */
async function disconnectTestDB() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
}

/**
 * clearCollections — removes all documents from the given models.
 * Called in beforeEach() to isolate each test.
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
