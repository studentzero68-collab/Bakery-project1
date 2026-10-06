import React from 'react';
import { useParams, Link } from 'react-router-dom';
import RecipeDetails from '../components/RecipeDetails';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useRecipe } from '../hooks/useRecipes';
import styles from './RecipeDetailPage.module.css';

/**
 * RecipeDetailPage — /recipes/:id
 * Full-page view of a single recipe.
 */
function RecipeDetailPage() {
  const { id } = useParams();
  const { recipe, loading, error } = useRecipe(id);

  return (
    <div className={styles.page}>
      <Link to="/recipes" className={styles.back}>← Back to recipes</Link>
      {loading && <LoadingState message="Loading recipe..." />}
      {error && <ErrorState message={error} />}
      {recipe && <RecipeDetails recipe={recipe} />}
    </div>
  );
}

export default RecipeDetailPage;
