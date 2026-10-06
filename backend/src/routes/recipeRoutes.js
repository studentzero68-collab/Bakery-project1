/**
 * recipeRoutes.js — Express router for recipe endpoints.
 *
 * Public:
 *   GET  /api/recipes
 *   GET  /api/recipes/:id
 *   GET  /api/recipes/category/:category
 *
 * Admin-only (requires JWT + role=admin):
 *   POST   /api/recipes
 *   PUT    /api/recipes/:id
 *   DELETE /api/recipes/:id
 */
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getRecipes,
  getRecipeById,
  getRecipesByCategory,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipeController');

const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

// ─────────────────────────────────────────────────────────────────────────────
// Validation rules
// ─────────────────────────────────────────────────────────────────────────────

const recipeValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('category')
    .isIn(['dessert', 'breakfast', 'lunch'])
    .withMessage('Category must be dessert, breakfast, or lunch'),
  body('ingredients')
    .isArray({ min: 1 })
    .withMessage('At least one ingredient is required'),
  body('steps')
    .isArray({ min: 1 })
    .withMessage('At least one step is required'),
  body('audiences')
    .isArray({ min: 1 })
    .withMessage('At least one audience is required'),
  body('audiences.*')
    .isIn(['family', 'friend', 'romantic'])
    .withMessage('Audience must be family, friend, or romantic'),
];

// ─────────────────────────────────────────────────────────────────────────────
// Public routes
// ─────────────────────────────────────────────────────────────────────────────

// NOTE: /category/:category must come BEFORE /:id to avoid 'category' being
// interpreted as an ObjectId.
router.get('/category/:category', getRecipesByCategory);

router.get('/', getRecipes);
router.get('/:id', getRecipeById);

// ─────────────────────────────────────────────────────────────────────────────
// Admin-only routes
// ─────────────────────────────────────────────────────────────────────────────

router.post(
  '/',
  protect,
  authorize('admin'),
  recipeValidation,
  validate,
  createRecipe
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  recipeValidation,
  validate,
  updateRecipe
);

router.delete('/:id', protect, authorize('admin'), deleteRecipe);

module.exports = router;
