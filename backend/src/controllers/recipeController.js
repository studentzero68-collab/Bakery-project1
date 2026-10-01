/**
 * recipeController.js — handlers for all recipe API endpoints.
 *
 * GET  /api/recipes                   → getRecipes
 * GET  /api/recipes/:id               → getRecipeById
 * GET  /api/recipes/category/:category → getRecipesByCategory
 * POST /api/recipes                   → createRecipe   (admin)
 * PUT  /api/recipes/:id               → updateRecipe   (admin)
 * DELETE /api/recipes/:id             → deleteRecipe   (admin)
 */
const Recipe = require('../models/Recipe');
const AppError = require('../utils/AppError');
const { success, list, error: sendError } = require('../utils/response');

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/recipes
// Supports query params: ?category=dessert&audience=family
// ─────────────────────────────────────────────────────────────────────────────

async function getRecipes(req, res, next) {
  try {
    const filter = {};

    if (req.query.category) {
      const cat = req.query.category.toLowerCase();
      if (!Recipe.CATEGORIES.includes(cat)) {
        return sendError(res, `Invalid category. Must be one of: ${Recipe.CATEGORIES.join(', ')}`, 400);
      }
      filter.category = cat;
    }

    if (req.query.audience) {
      const aud = req.query.audience.toLowerCase();
      if (!Recipe.AUDIENCES.includes(aud)) {
        return sendError(res, `Invalid audience. Must be one of: ${Recipe.AUDIENCES.join(', ')}`, 400);
      }
      filter.audiences = aud;
    }

    const recipes = await Recipe.find(filter).sort({ createdAt: -1 });
    return list(res, recipes);
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/recipes/:id
// ─────────────────────────────────────────────────────────────────────────────

async function getRecipeById(req, res, next) {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return next(new AppError('Recipe not found', 404));
    }
    return success(res, recipe);
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/recipes/category/:category
// ─────────────────────────────────────────────────────────────────────────────

async function getRecipesByCategory(req, res, next) {
  try {
    const category = req.params.category.toLowerCase();

    if (!Recipe.CATEGORIES.includes(category)) {
      return next(
        new AppError(`Invalid category. Must be one of: ${Recipe.CATEGORIES.join(', ')}`, 400)
      );
    }

    const recipes = await Recipe.find({ category }).sort({ createdAt: -1 });
    return list(res, recipes);
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/recipes  — Admin only
// ─────────────────────────────────────────────────────────────────────────────

async function createRecipe(req, res, next) {
  try {
    const recipe = await Recipe.create({
      ...req.body,
      createdBy: req.user._id,
    });
    return success(res, recipe, 201, 'Recipe created');
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/recipes/:id  — Admin only
// ─────────────────────────────────────────────────────────────────────────────

async function updateRecipe(req, res, next) {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!recipe) {
      return next(new AppError('Recipe not found', 404));
    }

    return success(res, recipe, 200, 'Recipe updated');
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/recipes/:id  — Admin only
// ─────────────────────────────────────────────────────────────────────────────

async function deleteRecipe(req, res, next) {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!recipe) {
      return next(new AppError('Recipe not found', 404));
    }

    return success(res, null, 200, 'Recipe deleted');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getRecipes,
  getRecipeById,
  getRecipesByCategory,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
