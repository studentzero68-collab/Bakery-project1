import React from 'react';
import RecipeGrid from '../components/RecipeGrid';
import RelationshipFilter from '../components/RelationshipFilter';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useRecipes } from '../hooks/useRecipes';
import { useRecipeFilters } from '../hooks/useRecipeFilters';
import styles from './RecipesPage.module.css';

/**
 * RecipesPage — /recipes
 * Shows a filterable grid of all recipes.
 * Filter state is reflected in the URL so links are shareable.
 */
function RecipesPage() {
  const { category, audience, setCategory, setAudience } = useRecipeFilters();

  const { recipes, loading, error, refetch } = useRecipes({
    category: category !== 'all' ? category : undefined,
    audience: audience !== 'all' ? audience : undefined,
  });

  return (
    <div className={styles.page}>
      {/* Sticky category nav */}
      <nav className={styles.catNav} aria-label="Filter by category">
        {[
          { id: 'all', label: 'All Recipes' },
          { id: 'dessert', label: 'Desserts' },
          { id: 'breakfast', label: 'Breakfast' },
          { id: 'lunch', label: 'Lunch Bakes' },
        ].map(({ id, label }) => (
          <button
            key={id}
            className={`${styles.catBtn} ${category === id ? styles.active : ''}`}
            onClick={() => setCategory(id)}
            aria-pressed={category === id}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Layout: content + sidebar */}
      <div className={styles.layout}>
        <RelationshipFilter
          activeAudience={audience}
          onAudienceChange={setAudience}
        />
        <div className={styles.content}>
          {loading && <LoadingState message="Loading recipes…" />}
          {error && <ErrorState message={error} onRetry={refetch} />}
          {!loading && !error && (
            <RecipeGrid
              recipes={recipes}
              activeCategory={category}
              activeAudience={audience}
              flat
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default RecipesPage;
