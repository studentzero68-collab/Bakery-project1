/**
 * recipes.test.js — tests for recipe API endpoints.
 *
 * Tests:
 *   GET  /api/recipes
 *   GET  /api/recipes/:id
 *   GET  /api/recipes/category/:category
 *   POST /api/recipes
 *   PUT  /api/recipes/:id
 *   DELETE /api/recipes/:id
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

// ─────────────────────────────────────────────────────────────────────────────
// Test data
// ─────────────────────────────────────────────────────────────────────────────

const validRecipe = {
  title: 'Test Chocolate Chip Cookies',
  category: 'dessert',
  description: 'Test description',
  joke: 'Test joke',
  meaning: 'Test meaning',
  prepTime: '15 min',
  cookTime: '12 min',
  ingredients: ['2 cups flour', '1 cup butter', '1 cup chocolate chips'],
  steps: ['Preheat oven to 375F', 'Mix ingredients', 'Bake 10 minutes'],
  audiences: ['family', 'friend'],
  image: 'https://example.com/image.jpg',
};

beforeAll(async () => await connectTestDB());
afterAll(async () => await disconnectTestDB());
beforeEach(async () => await clearCollections(Recipe, User));

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/recipes
// ─────────────────────────────────────────────────────────────────────────────

describe('GET /api/recipes', () => {
  beforeEach(async () => {
    await Recipe.create([
      validRecipe,
      { ...validRecipe, title: 'Banana Bread', category: 'breakfast', audiences: ['family'] },
      { ...validRecipe, title: 'Garlic Knots', category: 'lunch', audiences: ['friend'] },
    ]);
  });

  test('returns all recipes', async () => {
    const res = await request(app).get('/api/recipes');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(3);
    expect(res.body.count).toBe(3);
  });

  test('filters by category', async () => {
    const res = await request(app).get('/api/recipes?category=dessert');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].category).toBe('dessert');
  });

  test('filters by audience', async () => {
    const res = await request(app).get('/api/recipes?audience=friend');

    expect(res.status).toBe(200);
    expect(res.body.data.every((r) => r.audiences.includes('friend'))).toBe(true);
  });

  test('rejects invalid category', async () => {
    const res = await request(app).get('/api/recipes?category=invalid');
    expect(res.status).toBe(400);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/recipes/:id
// ─────────────────────────────────────────────────────────────────────────────

describe('GET /api/recipes/:id', () => {
  test('returns a single recipe by ID', async () => {
    const recipe = await Recipe.create(validRecipe);
    const res = await request(app).get(`/api/recipes/${recipe._id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(validRecipe.title);
  });

  test('returns 404 for nonexistent ID', async () => {
    const fakeId = '65f5a1b2c3d4e5f6a7b8c9d0';
    const res = await request(app).get(`/api/recipes/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  test('returns 404 for invalid ObjectId format', async () => {
    const res = await request(app).get('/api/recipes/not-a-valid-id');

    expect(res.status).toBe(404);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/recipes/category/:category
// ─────────────────────────────────────────────────────────────────────────────

describe('GET /api/recipes/category/:category', () => {
  beforeEach(async () => {
    await Recipe.create([
      validRecipe,
      { ...validRecipe, title: 'Another Dessert', category: 'dessert' },
      { ...validRecipe, title: 'Pancakes', category: 'breakfast' },
    ]);
  });

  test('returns recipes for a valid category', async () => {
    const res = await request(app).get('/api/recipes/category/dessert');

    expect(res.status).toBe(200);
    expect(res.body.data.every((r) => r.category === 'dessert')).toBe(true);
  });

  test('returns 400 for invalid category', async () => {
    const res = await request(app).get('/api/recipes/category/noodles');
    expect(res.status).toBe(400);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/recipes  — admin only
// ─────────────────────────────────────────────────────────────────────────────

describe('POST /api/recipes', () => {
  test('admin can create a recipe', async () => {
    const { token } = await createTestAdmin();

    const res = await request(app)
      .post('/api/recipes')
      .set('Authorization', `Bearer ${token}`)
      .send(validRecipe);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(validRecipe.title);
  });

  test('rejects unauthenticated recipe creation', async () => {
    const res = await request(app).post('/api/recipes').send(validRecipe);

    expect(res.status).toBe(401);
  });

  test('rejects missing required fields', async () => {
    const { token } = await createTestAdmin();

    const res = await request(app)
      .post('/api/recipes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Incomplete Recipe' });

    expect(res.status).toBe(400);
  });

  test('rejects invalid category', async () => {
    const { token } = await createTestAdmin();

    const res = await request(app)
      .post('/api/recipes')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validRecipe, category: 'invalid' });

    expect(res.status).toBe(400);
  });

  test('rejects invalid audience values', async () => {
    const { token } = await createTestAdmin();

    const res = await request(app)
      .post('/api/recipes')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validRecipe, audiences: ['invalid-audience'] });

    expect(res.status).toBe(400);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/recipes/:id  — admin only
// ─────────────────────────────────────────────────────────────────────────────

describe('PUT /api/recipes/:id', () => {
  test('admin can update a recipe', async () => {
    const { token } = await createTestAdmin();
    const recipe = await Recipe.create(validRecipe);

    const res = await request(app)
      .put(`/api/recipes/${recipe._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validRecipe, title: 'Updated Cookies' });

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Updated Cookies');
  });

  test('returns 404 for nonexistent recipe', async () => {
    const { token } = await createTestAdmin();
    const fakeId = '65f5a1b2c3d4e5f6a7b8c9d0';

    const res = await request(app)
      .put(`/api/recipes/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(validRecipe);

    expect(res.status).toBe(404);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/recipes/:id  — admin only
// ─────────────────────────────────────────────────────────────────────────────

describe('DELETE /api/recipes/:id', () => {
  test('admin can delete a recipe', async () => {
    const { token } = await createTestAdmin();
    const recipe = await Recipe.create(validRecipe);

    const res = await request(app)
      .delete(`/api/recipes/${recipe._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify it's gone
    const deleted = await Recipe.findById(recipe._id);
    expect(deleted).toBeNull();
  });

  test('returns 404 when deleting nonexistent recipe', async () => {
    const { token } = await createTestAdmin();
    const fakeId = '65f5a1b2c3d4e5f6a7b8c9d0';

    const res = await request(app)
      .delete(`/api/recipes/${fakeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
