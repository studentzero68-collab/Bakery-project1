/**
 * server.js — Baker's Delight Express server entry point.
 *
 * No MongoDB. Database is Supabase (PostgreSQL).
 * The server starts immediately — no async DB connection required at boot.
 */
require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🥐 Baker's Delight API running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV ?? 'development'}`);
  console.log(`   Database:    Supabase / PostgreSQL`);
  console.log(`   API base:    http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received — shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled promise rejection:', err.message);
  server.close(() => process.exit(1));
});
