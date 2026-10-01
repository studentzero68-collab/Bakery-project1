/**
 * Recipe.js — Mongoose model for Baker's Delight recipes.
 *
 * Stores all fields present in the original vanilla HTML application plus
 * the metadata needed for the REST API (createdBy, timestamps).
 */
const mongoose = require('mongoose');

const CATEGORIES = ['dessert', 'breakfast', 'lunch'];
const AUDIENCES = ['family', 'friend', 'romantic'];

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
      maxlength: [120, 'Title must be 120 characters or fewer'],
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: CATEGORIES,
        message: `Category must be one of: ${CATEGORIES.join(', ')}`,
      },
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description must be 500 characters or fewer'],
    },

    joke: {
      type: String,
      trim: true,
      maxlength: [300, 'Joke must be 300 characters or fewer'],
    },

    meaning: {
      type: String,
      trim: true,
      maxlength: [400, 'Meaning must be 400 characters or fewer'],
    },

    prepTime: {
      type: String,
      trim: true,
    },

    cookTime: {
      type: String,
      trim: true,
    },

    ingredients: {
      type: [String],
      required: [true, 'Ingredients are required'],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'At least one ingredient is required',
      },
    },

    steps: {
      type: [String],
      required: [true, 'Steps are required'],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'At least one step is required',
      },
    },

    audiences: {
      type: [String],
      required: [true, 'At least one audience is required'],
      enum: {
        values: AUDIENCES,
        message: `Audience values must be: ${AUDIENCES.join(', ')}`,
      },
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'At least one audience is required',
      },
    },

    image: {
      type: String,
      trim: true,
    },

    video: {
      type: String,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Indexes
// ─────────────────────────────────────────────────────────────────────────────

recipeSchema.index({ category: 1 });
recipeSchema.index({ audiences: 1 });
recipeSchema.index({ title: 'text', description: 'text' });

// ─────────────────────────────────────────────────────────────────────────────
// Static helpers
// ─────────────────────────────────────────────────────────────────────────────

recipeSchema.statics.CATEGORIES = CATEGORIES;
recipeSchema.statics.AUDIENCES = AUDIENCES;

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
