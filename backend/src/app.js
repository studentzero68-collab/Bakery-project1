/**
 * app.js — Express application factory.
 *
 * Separated from server.js so the app can be imported in tests
 * without binding to a port.
 */
const express = require('express');
const cors = require('cors');

const recipeRoutes = require('./routes/recipeRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ─────────────────────────────────────────────────────────────────────────────
// Core middleware
// ─────────────────────────────────────────────────────────────────────────────

// CORS — allow the React frontend origin
const allowedOrigins = [
  process.env.CLIENT_URL ?? 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Basic security headers
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// ─────────────────────────────────────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: "Baker's Delight API is running",
    timestamp: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────────────────────────────────

app.use('/api/recipes', recipeRoutes);
app.use('/api/auth', authRoutes);

// 404 handler for unknown routes
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─────────────────────────────────────────────────────────────────────────────
// Centralised error handler (must be last middleware)
// ─────────────────────────────────────────────────────────────────────────────

app.use(errorHandler);

module.exports = app;
