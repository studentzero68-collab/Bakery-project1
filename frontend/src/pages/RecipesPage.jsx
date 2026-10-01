import React, { useState } from 'react';
import RecipeGrid from '../components/RecipeGrid';
import RelationshipFilter from '../components/RelationshipFilter';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useRecipes } from '../hooks/useRecipes';
import styles from './RecipesPage.module.css';

/**
 * RecipesPage — /recipes
 * Shows a filterable grid of all recipes with the relationship filter sidebar.
 */
function RecipesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeAudience, setActiveAudience] = useState('all');

  const { recipes, loading, error } = useRecipes({
    category: activeCategory !== 'all' ? activeCategory : undefined,
    audience: activeAudience !== 'all' ? activeAudience : undefined,
  });

  return (
    <div className={styles.page}>
      <div className={styles.catNav}>
        {['all', 'dessert', 'breakfast', 'lunch'].map((cat) => (
          <button
            key={cat}
            className={`${styles.catBtn} ${activeCategory === cat ? styles.active : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === 'all' ? 'All Recipes' : cat === 'dessert' ? 'Desserts' : cat === 'breakfast' ? 'Breakfast' : 'Lunch Bakes'}
          </button>
        ))}
      </div>

      <div className={styles.layout}>
        <RelationshipFilter
          activeAudience={activeAudience}
          onAudienceChange={setActiveAudience}
        />
        <div className={styles.content}>
          {loading && <LoadingState message="Loading recipes..." />}
          {error && <ErrorState message={error} />}
          {!loading && !error && (
            <RecipeGrid recipes={recipes} activeCategory={activeCategory} activeAudience={activeAudience} flat />
          )}
        </div>
      </div>
    </div>
  );
}

export default RecipesPage;
