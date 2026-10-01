/**
 * seed.js — database seeding script.
 *
 * Populates MongoDB with the original Baker's Delight recipes.
 *
 * Usage:
 *   npm run seed               — inserts recipes (skips existing by title)
 *   npm run seed -- --force    — drops existing recipes and re-seeds
 *   npm run seed -- --clear    — drops all recipes without re-seeding
 *
 * Requires MONGODB_URI in backend/.env (or backend/.env.example copied to .env)
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
const { desserts, breakfast, lunch } = require('./recipes');

const MONGO_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/bakers-delight';
const allRecipes = [...desserts, ...breakfast, ...lunch];

async function seed() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const clearOnly = args.includes('--clear');

  console.log('🥐  Baker\'s Delight — Database Seed');
  console.log(`    MongoDB URI: ${MONGO_URI}`);

  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅  Connected to MongoDB\n');

    if (force || clearOnly) {
      await Recipe.deleteMany({});
      console.log('🗑   Cleared existing recipes');
    }

    if (clearOnly) {
      console.log('\n✅  Database cleared. Done.');
      return;
    }

    let inserted = 0;
    let skipped = 0;

    for (const recipeData of allRecipes) {
      const existing = await Recipe.findOne({ title: recipeData.title });
      if (existing && !force) {
        skipped++;
        continue;
      }

      await Recipe.findOneAndUpdate(
        { title: recipeData.title },
        recipeData,
        { upsert: true, new: true, runValidators: true }
      );
      inserted++;
      console.log(`  ✓  ${recipeData.category.padEnd(9)} — ${recipeData.title}`);
    }

    console.log(`\n📊  Summary:`);
    console.log(`    Inserted/Updated: ${inserted}`);
    console.log(`    Skipped (already exist): ${skipped}`);
    console.log(`    Total recipes in DB: ${await Recipe.countDocuments()}`);
    console.log('\n✅  Seed complete!');
  } catch (err) {
    console.error('\n❌  Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌  Disconnected from MongoDB');
  }
}

seed();
