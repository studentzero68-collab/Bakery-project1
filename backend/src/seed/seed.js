/**
 * seed.js — database seeding script for Supabase/PostgreSQL.
 *
 * Populates the Supabase `recipes` table with the original Baker's Delight recipes.
 *
 * Usage (from the backend/ directory):
 *   node src/seed/seed.js               — upserts all recipes (safe to re-run)
 *   node src/seed/seed.js --clear       — deletes all recipes without re-seeding
 *   node src/seed/seed.js --force       — deletes then re-inserts all recipes
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env
 */
require('dotenv').config();

const { supabase } = require('../config/supabase');
const { desserts, breakfast, lunch } = require('./recipes');

const allRecipes = [...desserts, ...breakfast, ...lunch];

/**
 * Maps the seed data (camelCase) to the Supabase column names (snake_case).
 */
function toRow(recipe) {
  return {
    title:       recipe.title,
    category:    recipe.category,
    description: recipe.description ?? null,
    joke:        recipe.joke        ?? null,
    meaning:     recipe.meaning     ?? null,
    prep_time:   recipe.prepTime    ?? null,
    cook_time:   recipe.cookTime    ?? null,
    ingredients: recipe.ingredients ?? [],
    steps:       recipe.steps       ?? [],
    audiences:   recipe.audiences   ?? [],
    image:       recipe.image       ?? null,
    video:       recipe.video       ?? null,
  };
}

async function seed() {
  const args = process.argv.slice(2);
  const force     = args.includes('--force');
  const clearOnly = args.includes('--clear');

  console.log("🥐  Baker's Delight — Supabase Seed");

  // ── Clear ──────────────────────────────────────────────────────────────────
  if (force || clearOnly) {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // delete all rows

    if (error) {
      console.error('❌  Failed to clear recipes:', error.message);
      process.exit(1);
    }
    console.log('🗑   Cleared existing recipes');
  }

  if (clearOnly) {
    console.log('\n✅  Database cleared. Done.');
    process.exit(0);
  }

  // ── Upsert ─────────────────────────────────────────────────────────────────
  const rows = allRecipes.map(toRow);

  const { data, error } = await supabase
    .from('recipes')
    .upsert(rows, { onConflict: 'title', ignoreDuplicates: false })
    .select('id, title, category');

  if (error) {
    console.error('❌  Seed failed:', error.message);
    process.exit(1);
  }

  console.log(`\n📊  Upserted ${data.length} recipes:`);
  data.forEach((r) =>
    console.log(`  ✓  ${r.category.padEnd(9)} — ${r.title}`)
  );
  console.log('\n✅  Seed complete!');
}

seed();
