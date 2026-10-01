import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRecipe, updateRecipe } from '../services/api';
import styles from './RecipeForm.module.css';

const EMPTY_FORM = {
  title: '',
  category: 'dessert',
  description: '',
  joke: '',
  meaning: '',
  prepTime: '',
  cookTime: '',
  ingredients: '',   // newline-separated for textarea
  steps: '',         // newline-separated for textarea
  audiences: [],
  image: '',
  video: '',
};

const CATEGORIES = ['dessert', 'breakfast', 'lunch'];
const AUDIENCES = ['family', 'friend', 'romantic'];

/**
 * RecipeForm — create or edit a recipe.
 * Handles both /admin/recipes/new and /admin/recipes/:id/edit.
 *
 * Props:
 *   existingRecipe — populated recipe object for edit mode; null for create.
 */
function RecipeForm({ existingRecipe = null }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (existingRecipe) {
      setForm({
        title: existingRecipe.title ?? '',
        category: existingRecipe.category ?? 'dessert',
        description: existingRecipe.description ?? '',
        joke: existingRecipe.joke ?? '',
        meaning: existingRecipe.meaning ?? '',
        prepTime: existingRecipe.prepTime ?? '',
        cookTime: existingRecipe.cookTime ?? '',
        ingredients: (existingRecipe.ingredients ?? []).join('\n'),
        steps: (existingRecipe.steps ?? []).join('\n'),
        audiences: existingRecipe.audiences ?? [],
        image: existingRecipe.image ?? '',
        video: existingRecipe.video ?? '',
      });
    }
  }, [existingRecipe]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: '' }));
  }

  function toggleAudience(aud) {
    setForm((p) => ({
      ...p,
      audiences: p.audiences.includes(aud)
        ? p.audiences.filter((a) => a !== aud)
        : [...p.audiences, aud],
    }));
  }

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.category) e.category = 'Category is required';
    if (form.audiences.length === 0) e.audiences = 'Select at least one audience';
    if (!form.ingredients.trim()) e.ingredients = 'Add at least one ingredient';
    if (!form.steps.trim()) e.steps = 'Add at least one step';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      ...form,
      ingredients: form.ingredients.split('\n').map((s) => s.trim()).filter(Boolean),
      steps: form.steps.split('\n').map((s) => s.trim()).filter(Boolean),
    };

    setSubmitting(true);
    setServerError('');
    try {
      if (existingRecipe) {
        await updateRecipe(existingRecipe._id, payload);
      } else {
        await createRecipe(payload);
      }
      navigate('/admin');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      {serverError && (
        <div className={styles.serverError} role="alert">{serverError}</div>
      )}

      {/* Title */}
      <div className={styles.field}>
        <label htmlFor="title">Title *</label>
        <input id="title" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Chocolate Chip Cookies" />
        {errors.title && <p className={styles.fieldError}>{errors.title}</p>}
      </div>

      {/* Category */}
      <div className={styles.field}>
        <label htmlFor="category">Category *</label>
        <select id="category" name="category" value={form.category} onChange={handleChange}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c === 'dessert' ? 'Dessert' : c === 'breakfast' ? 'Breakfast' : 'Lunch Bake'}</option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className={styles.field}>
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={3} value={form.description} onChange={handleChange} placeholder="Brief description of the recipe" />
      </div>

      {/* Joke */}
      <div className={styles.field}>
        <label htmlFor="joke">Joke / Fun fact</label>
        <input id="joke" name="joke" value={form.joke} onChange={handleChange} placeholder="The witty one-liner" />
      </div>

      {/* Meaning */}
      <div className={styles.field}>
        <label htmlFor="meaning">Meaning / Symbolism</label>
        <textarea id="meaning" name="meaning" rows={2} value={form.meaning} onChange={handleChange} placeholder="What does this recipe say when you make it?" />
      </div>

      {/* Times */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="prepTime">Prep time</label>
          <input id="prepTime" name="prepTime" value={form.prepTime} onChange={handleChange} placeholder="e.g. 15 min" />
        </div>
        <div className={styles.field}>
          <label htmlFor="cookTime">Cook / Bake time</label>
          <input id="cookTime" name="cookTime" value={form.cookTime} onChange={handleChange} placeholder="e.g. 25 min" />
        </div>
      </div>

      {/* Audiences */}
      <div className={styles.field}>
        <label>Audience *</label>
        <div className={styles.audienceGroup}>
          {AUDIENCES.map((a) => (
            <button
              key={a}
              type="button"
              className={`${styles.audBtn} ${form.audiences.includes(a) ? styles.audActive : ''}`}
              onClick={() => toggleAudience(a)}
              aria-pressed={form.audiences.includes(a)}
            >
              {a.charAt(0).toUpperCase() + a.slice(1)}
            </button>
          ))}
        </div>
        {errors.audiences && <p className={styles.fieldError}>{errors.audiences}</p>}
      </div>

      {/* Ingredients */}
      <div className={styles.field}>
        <label htmlFor="ingredients">Ingredients * <span className={styles.hint}>(one per line)</span></label>
        <textarea id="ingredients" name="ingredients" rows={8} value={form.ingredients} onChange={handleChange} placeholder={"2¼ cups all-purpose flour\n1 tsp baking soda\n1 cup butter, softened"} />
        {errors.ingredients && <p className={styles.fieldError}>{errors.ingredients}</p>}
      </div>

      {/* Steps */}
      <div className={styles.field}>
        <label htmlFor="steps">Steps * <span className={styles.hint}>(one per line)</span></label>
        <textarea id="steps" name="steps" rows={10} value={form.steps} onChange={handleChange} placeholder={"Preheat oven to 375°F\nCream butter and sugar\nBake 9–11 minutes"} />
        {errors.steps && <p className={styles.fieldError}>{errors.steps}</p>}
      </div>

      {/* Image URL */}
      <div className={styles.field}>
        <label htmlFor="image">Image URL</label>
        <input id="image" name="image" type="url" value={form.image} onChange={handleChange} placeholder="https://…" />
      </div>

      {/* Video URL */}
      <div className={styles.field}>
        <label htmlFor="video">Video URL <span className={styles.hint}>(optional embed URL)</span></label>
        <input id="video" name="video" type="url" value={form.video} onChange={handleChange} placeholder="https://…" />
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button type="button" className="btn-secondary" onClick={() => navigate('/admin')}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : existingRecipe ? 'Save changes' : 'Create recipe'}
        </button>
      </div>
    </form>
  );
}

export default RecipeForm;
