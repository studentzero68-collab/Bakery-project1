/**
 * server.js — Baker's Delight Express server entry point.
 *
 * Starts the Express application and connects to MongoDB.
 */
require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`🥐 Baker's Delight API running on port ${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV ?? 'development'}`);
    console.log(`   API base:    http://localhost:${PORT}/api`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received — shutting down gracefully');
    server.close(async () => {
      const { disconnectDB } = require('./config/db');
      await disconnectDB();
      process.exit(0);
    });
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
