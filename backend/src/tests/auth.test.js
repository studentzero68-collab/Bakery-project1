/**
 * auth.test.js — tests for authentication endpoints.
 *
 * Tests:
 *   POST /api/auth/register
 *   POST /api/auth/login
 *   GET  /api/auth/me
 */
require('dotenv').config();

const request = require('supertest');
const User = require('../models/User');
const app = require('../app');
const {
  connectTestDB,
  disconnectTestDB,
  clearCollections,
} = require('./helpers');

// ─────────────────────────────────────────────────────────────────────────────
// Set up test environment variables
// ─────────────────────────────────────────────────────────────────────────────

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-jwt-secret-for-bakers-delight';

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

beforeEach(async () => {
  await clearCollections(User);
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────────────────────────────────────────

describe('POST /api/auth/register', () => {
  const validUser = {
    name: 'Mukelani Test',
    email: 'mukelani@bakersdelight.test',
    password: 'TestPass123!',
  };

  test('registers a new user and returns token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(validUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.data.email).toBe(validUser.email);
    expect(res.body.data.password).toBeUndefined(); // never expose password
  });

  test('new user gets role=user by default', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(validUser);

    expect(res.body.data.role).toBe('user');
  });

  test('rejects duplicate email', async () => {
    await request(app).post('/api/auth/register').send(validUser);
    const res = await request(app).post('/api/auth/register').send(validUser);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  test('rejects missing name', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com', password: 'TestPass123!' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('rejects invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'not-an-email', password: 'TestPass123!' });

    expect(res.status).toBe(400);
  });

  test('rejects password shorter than 8 characters', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@test.com', password: 'short' });

    expect(res.status).toBe(400);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {
  const userCreds = {
    name: 'Login Tester',
    email: 'login@bakersdelight.test',
    password: 'LoginPass123!',
  };

  beforeEach(async () => {
    // Register a user to log in with
    await request(app).post('/api/auth/register').send(userCreds);
  });

  test('logs in with correct credentials and returns token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: userCreds.email, password: userCreds.password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.data.email).toBe(userCreds.email);
  });

  test('does not expose password in response', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: userCreds.email, password: userCreds.password });

    expect(res.body.data.password).toBeUndefined();
  });

  test('rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: userCreds.email, password: 'WrongPassword!' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('rejects unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@bakersdelight.test', password: 'TestPass123!' });

    expect(res.status).toBe(401);
  });

  test('rejects missing password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: userCreds.email });

    expect(res.status).toBe(400);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/me
// ─────────────────────────────────────────────────────────────────────────────

describe('GET /api/auth/me', () => {
  let token;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Me Tester', email: 'me@bakersdelight.test', password: 'MePass123!' });
    token = res.body.token;
  });

  test('returns current user when authenticated', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('me@bakersdelight.test');
  });

  test('returns 401 without token', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('returns 401 with invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer this.is.not.a.valid.jwt');

    expect(res.status).toBe(401);
  });
});
