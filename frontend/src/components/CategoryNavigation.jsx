import React, { useState } from 'react';
import RecipeGrid from './RecipeGrid';
import RelationshipFilter from './RelationshipFilter';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import styles from './CategoryNavigation.module.css';

const CATEGORIES = [
  { id: 'all', label: 'All Recipes' },
  { id: 'dessert', label: 'Desserts' },
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch Bakes' },
];

/**
 * CategoryNavigation — sticky tab bar + layout container for the recipe grid.
 * Preserves the original sticky category nav with audience sidebar filter.
 */
function CategoryNavigation({ recipes, loading, error }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeAudience, setActiveAudience] = useState('all');

  return (
    <>
      {/* Sticky category nav */}
      <nav className={styles.catNav} aria-label="Filter by category">
        {CATEGORIES.map(({ id, label }) => (
          <button
            key={id}
            className={`${styles.catBtn} ${activeCategory === id ? styles.active : ''}`}
            onClick={() => setActiveCategory(id)}
            aria-pressed={activeCategory === id}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Page layout: main content + sidebar filter */}
      <div className={styles.layout}>
        <div className={styles.main}>
          {loading && <LoadingState message="Loading recipes…" />}
          {error && <ErrorState message={error} />}
          {!loading && !error && (
            <RecipeGrid
              recipes={recipes}
              activeCategory={activeCategory}
              activeAudience={activeAudience}
            />
          )}
        </div>

        <RelationshipFilter
          activeAudience={activeAudience}
          onAudienceChange={setActiveAudience}
        />
      </div>
    </>
  );
}

export default CategoryNavigation;
