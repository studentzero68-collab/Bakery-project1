/**
 * recipeController.js — handlers for all recipe API endpoints.
 *
 * Database: Supabase (PostgreSQL)
 * Table:    recipes
 *
 * GET  /api/recipes                    → getRecipes
 * GET  /api/recipes/:id                → getRecipeById
 * GET  /api/recipes/category/:category → getRecipesByCategory
 * POST /api/recipes                    → createRecipe   (admin)
 * PUT  /api/recipes/:id                → updateRecipe   (admin)
 * DELETE /api/recipes/:id              → deleteRecipe   (admin)
 */
const { supabase } = require('../config/supabase');
const AppError = require('../utils/AppError');
const { success, list, error: sendError } = require('../utils/response');
const { CATEGORIES, AUDIENCES } = require('../models/Recipe');

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Maps camelCase body fields to snake_case columns for the DB.
 * Supabase/Postgres column names use snake_case.
 */
function toDbRow(body, userId) {
  const row = {};
  if (body.title       !== undefined) row.title       = body.title;
  if (body.category    !== undefined) row.category    = body.category?.toLowerCase();
  if (body.description !== undefined) row.description = body.description;
  if (body.joke        !== undefined) row.joke        = body.joke;
  if (body.meaning     !== undefined) row.meaning     = body.meaning;
  if (body.prepTime    !== undefined) row.prep_time   = body.prepTime;
  if (body.cookTime    !== undefined) row.cook_time   = body.cookTime;
  if (body.ingredients !== undefined) row.ingredients = body.ingredients;
  if (body.steps       !== undefined) row.steps       = body.steps;
  if (body.audiences   !== undefined) row.audiences   = body.audiences;
  if (body.image       !== undefined) row.image       = body.image;
  if (body.video       !== undefined) row.video       = body.video;
  if (userId)                         row.created_by  = userId;
  return row;
}

/**
 * Maps a DB row (snake_case) back to the camelCase shape the frontend expects.
 * Preserves the same field names the original MongoDB API returned.
 */
function fromDbRow(row) {
  if (!row) return null;
  return {
    _id:         row.id,          // keep _id so existing frontend code works
    id:          row.id,
    title:       row.title,
    category:    row.category,
    description: row.description,
    joke:        row.joke,
    meaning:     row.meaning,
    prepTime:    row.prep_time,
    cookTime:    row.cook_time,
    ingredients: row.ingredients ?? [],
    steps:       row.steps       ?? [],
    audiences:   row.audiences   ?? [],
    image:       row.image,
    video:       row.video,
    createdBy:   row.created_by,
    createdAt:   row.created_at,
    updatedAt:   row.updated_at,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/recipes
// Supports query params: ?category=dessert&audience=family
// ─────────────────────────────────────────────────────────────────────────────

async function getRecipes(req, res, next) {
  try {
    const { category, audience } = req.query;

    if (category && !CATEGORIES.includes(category.toLowerCase())) {
      return sendError(res, `Invalid category. Must be one of: ${CATEGORIES.join(', ')}`, 400);
    }
    if (audience && !AUDIENCES.includes(audience.toLowerCase())) {
      return sendError(res, `Invalid audience. Must be one of: ${AUDIENCES.join(', ')}`, 400);
    }

    let query = supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (category) query = query.eq('category', category.toLowerCase());
    if (audience) query = query.contains('audiences', [audience.toLowerCase()]);

    const { data, error } = await query;
    if (error) return next(new AppError(error.message, 500));

    return list(res, (data ?? []).map(fromDbRow));
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/recipes/:id
// ─────────────────────────────────────────────────────────────────────────────

async function getRecipeById(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) return next(new AppError('Recipe not found', 404));
    return success(res, fromDbRow(data));
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

    if (!CATEGORIES.includes(category)) {
      return next(new AppError(`Invalid category. Must be one of: ${CATEGORIES.join(', ')}`, 400));
    }

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) return next(new AppError(error.message, 500));
    return list(res, (data ?? []).map(fromDbRow));
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/recipes — Admin only
// ─────────────────────────────────────────────────────────────────────────────

async function createRecipe(req, res, next) {
  try {
    const row = toDbRow(req.body, req.user?.id ?? req.user?._id);

    const { data, error } = await supabase
      .from('recipes')
      .insert(row)
      .select()
      .single();

    if (error) return next(new AppError(error.message, 500));
    return success(res, fromDbRow(data), 201, 'Recipe created');
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/recipes/:id — Admin only
// ─────────────────────────────────────────────────────────────────────────────

async function updateRecipe(req, res, next) {
  try {
    const row = toDbRow(req.body);
    // Add updated_at explicitly since Supabase doesn't auto-update it by default
    row.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('recipes')
      .update(row)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !data) return next(new AppError('Recipe not found', 404));
    return success(res, fromDbRow(data), 200, 'Recipe updated');
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/recipes/:id — Admin only
// ─────────────────────────────────────────────────────────────────────────────

async function deleteRecipe(req, res, next) {
  try {
    // Check existence first so we can return a proper 404
    const { data: existing } = await supabase
      .from('recipes')
      .select('id')
      .eq('id', req.params.id)
      .single();

    if (!existing) return next(new AppError('Recipe not found', 404));

    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', req.params.id);

    if (error) return next(new AppError(error.message, 500));
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
