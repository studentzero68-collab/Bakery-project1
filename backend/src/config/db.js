/**
 * db.js — DEPRECATED.
 *
 * MongoDB has been replaced by Supabase (PostgreSQL).
 * This file is kept as a placeholder so any accidental import does not crash.
 * The active database client is in src/config/supabase.js
 */

// No-op stubs — the server no longer connects to MongoDB at startup
async function connectDB() {
  console.warn('connectDB() called but MongoDB has been removed. Using Supabase instead.');
}

async function disconnectDB() {}

module.exports = connectDB;
module.exports.disconnectDB = disconnectDB;
