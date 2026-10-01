import React from 'react';
import RecipeCard from './RecipeCard';
import CategorySection from './CategorySection';
import styles from './RecipeGrid.module.css';

const CATEGORY_META = {
  dessert: {
    label: 'Desserts',
    dotClass: 'dot-dessert',
    subtitle: 'Sweet wins only — like getting the final hit in a boss battle.',
  },
  breakfast: {
    label: 'Breakfast',
    dotClass: 'dot-breakfast',
    subtitle: 'Start your day like a main character — intentional and fuelled up.',
  },
  lunch: {
    label: 'Lunch Bakes',
    dotClass: 'dot-lunch',
    subtitle: 'Savoury power-ups. Mid-game meal that keeps you going.',
  },
};

/**
 * RecipeGrid — renders recipes grouped into CategorySection blocks,
 * or as a flat filterable list when `flat` prop is true.
 *
 * Props:
 *   recipes        — array of recipe objects
 *   activeCategory — 'all' | 'dessert' | 'breakfast' | 'lunch'
 *   activeAudience — 'all' | 'family' | 'friend' | 'romantic'
 *   flat           — renders a flat grid without category grouping
 */
function RecipeGrid({ recipes = [], activeCategory, activeAudience, flat = false }) {
  // Apply audience filter
  const filtered = recipes.filter((r) => {
    if (!activeAudience || activeAudience === 'all') return true;
    return r.audiences?.includes(activeAudience);
  });

  if (filtered.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No recipes found for the selected filters.</p>
        <p className={styles.emptyHint}>Try changing the category or audience filter.</p>
      </div>
    );
  }

  // Flat grid (used in RecipesPage)
  if (flat) {
    return (
      <div className={styles.grid}>
        {filtered.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    );
  }

  // Grouped by category (used in HomePage)
  const categories = activeCategory === 'all'
    ? ['dessert', 'breakfast', 'lunch']
    : [activeCategory];

  return (
    <div className={styles.sections}>
      {categories.map((cat) => {
        const catRecipes = filtered.filter((r) => r.category === cat);
        const meta = CATEGORY_META[cat];
        if (!meta) return null;
        if (catRecipes.length === 0 && activeCategory !== 'all') return null;

        return (
          <CategorySection
            key={cat}
            label={meta.label}
            subtitle={meta.subtitle}
            dotClass={meta.dotClass}
            recipes={catRecipes}
          />
        );
      })}
    </div>
  );
}

export default RecipeGrid;
