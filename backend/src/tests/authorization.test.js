/**
 * authorization.test.js — tests that enforce role-based access control.
 *
 * Verifies that:
 *   - Unauthenticated users cannot perform protected actions
 *   - Normal users cannot perform admin-only actions
 *   - Admins CAN perform all admin actions
 */
require('dotenv').config();

const request = require('supertest');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const app = require('../app');
const {
  connectTestDB,
  disconnectTestDB,
  clearCollections,
  createTestAdmin,
  createTestUser,
} = require('./helpers');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-jwt-secret-for-bakers-delight';

const validRecipe = {
  title: 'Authorization Test Cookie',
  category: 'dessert',
  ingredients: ['Flour', 'Sugar', 'Butter'],
  steps: ['Mix', 'Bake', 'Cool'],
  audiences: ['family'],
};

beforeAll(async () => await connectTestDB());
afterAll(async () => await disconnectTestDB());
beforeEach(async () => await clearCollections(Recipe, User));

// ─────────────────────────────────────────────────────────────────────────────
// Unauthenticated access
// ─────────────────────────────────────────────────────────────────────────────

describe('Unauthenticated users', () => {
  test('can read all recipes', async () => {
    const res = await request(app).get('/api/recipes');
    expect(res.status).toBe(200);
  });

  test('cannot create a recipe', async () => {
    const res = await request(app).post('/api/recipes').send(validRecipe);
    expect(res.status).toBe(401);
  });

  test('cannot update a recipe', async () => {
    const recipe = await Recipe.create(validRecipe);
    const res = await request(app).put(`/api/recipes/${recipe._id}`).send(validRecipe);
    expect(res.status).toBe(401);
  });

  test('cannot delete a recipe', async () => {
    const recipe = await Recipe.create(validRecipe);
    const res = await request(app).delete(`/api/recipes/${recipe._id}`);
    expect(res.status).toBe(401);
  });

  test('cannot access /api/auth/me', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Normal user access (role=user)
// ─────────────────────────────────────────────────────────────────────────────

describe('Normal users (role=user)', () => {
  let userToken;

  beforeEach(async () => {
    const { token } = await createTestUser();
    userToken = token;
  });

  test('can read all recipes', async () => {
    const res = await request(app)
      .get('/api/recipes')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
  });

  test('can access /api/auth/me', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
  });

  test('cannot create a recipe (403)', async () => {
    const res = await request(app)
      .post('/api/recipes')
      .set('Authorization', `Bearer ${userToken}`)
      .send(validRecipe);
    expect(res.status).toBe(403);
  });

  test('cannot update a recipe (403)', async () => {
    const recipe = await Recipe.create(validRecipe);
    const res = await request(app)
      .put(`/api/recipes/${recipe._id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(validRecipe);
    expect(res.status).toBe(403);
  });

  test('cannot delete a recipe (403)', async () => {
    const recipe = await Recipe.create(validRecipe);
    const res = await request(app)
      .delete(`/api/recipes/${recipe._id}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Admin user access (role=admin)
// ─────────────────────────────────────────────────────────────────────────────

describe('Admin users (role=admin)', () => {
  let adminToken;

  beforeEach(async () => {
    const { token } = await createTestAdmin();
    adminToken = token;
  });

  test('can create a recipe', async () => {
    const res = await request(app)
      .post('/api/recipes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validRecipe);
    expect(res.status).toBe(201);
  });

  test('can update a recipe', async () => {
    const recipe = await Recipe.create(validRecipe);
    const res = await request(app)
      .put(`/api/recipes/${recipe._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...validRecipe, title: 'Admin Updated' });
    expect(res.status).toBe(200);
  });

  test('can delete a recipe', async () => {
    const recipe = await Recipe.create(validRecipe);
    const res = await request(app)
      .delete(`/api/recipes/${recipe._id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tampered/expired tokens
// ─────────────────────────────────────────────────────────────────────────────

describe('Invalid tokens', () => {
  test('rejects a tampered token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.tampered.signature');
    expect(res.status).toBe(401);
  });

  test('rejects a malformed Authorization header', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'NotBearer sometoken');
    expect(res.status).toBe(401);
  });
});
