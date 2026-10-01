/**
 * Recipe.js — Recipe constants for Baker's Delight.
 *
 * Mongoose has been removed. The database is now Supabase (PostgreSQL).
 * This file exports the CATEGORIES and AUDIENCES constants that the
 * controller and routes still reference for validation.
 *
 * Supabase table: recipes
 * Columns: id, title, category, description, joke, meaning,
 *          prep_time, cook_time, ingredients (text[]), steps (text[]),
 *          audiences (text[]), image, video, created_by, created_at, updated_at
 */

const CATEGORIES = ['dessert', 'breakfast', 'lunch'];
const AUDIENCES  = ['family', 'friend', 'romantic'];

module.exports = { CATEGORIES, AUDIENCES };
