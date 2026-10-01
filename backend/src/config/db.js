/**
 * db.js — MongoDB connection via Mongoose.
 *
 * Called once at startup from server.js.
 * Uses MONGODB_URI environment variable.
 *
 * In tests, TEST_MONGODB_URI is used instead to avoid corrupting dev data.
 */
const mongoose = require('mongoose');

const MONGO_URI =
  process.env.NODE_ENV === 'test'
    ? (process.env.TEST_MONGODB_URI ?? 'mongodb://localhost:27017/bakers-delight-test')
    : (process.env.MONGODB_URI ?? 'mongodb://localhost:27017/bakers-delight');

/**
 * connectDB — establishes the Mongoose connection.
 * @returns {Promise<mongoose.Connection>}
 */
async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      // Recommended options for Mongoose 8
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(`❌  MongoDB connection failed: ${err.message}`);
    throw err;
  }
}

/**
 * disconnectDB — gracefully closes the connection.
 * Used in tests and graceful shutdown handlers.
 */
async function disconnectDB() {
  await mongoose.connection.close();
  console.log('🔌  MongoDB disconnected');
}

module.exports = connectDB;
module.exports.disconnectDB = disconnectDB;
