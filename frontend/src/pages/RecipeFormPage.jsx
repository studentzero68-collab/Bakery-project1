import React from 'react';
import { useParams } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm';
import { useRecipe } from '../hooks/useRecipes';
import LoadingState from '../components/LoadingState';
import styles from './RecipeFormPage.module.css';

/**
 * RecipeFormPage — /admin/recipes/new and /admin/recipes/:id/edit
 * Wraps the RecipeForm component for both create and edit flows.
 */
function RecipeFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { recipe, loading } = isEdit ? useRecipe(id) : { recipe: null, loading: false };

  if (isEdit && loading) return <LoadingState message="Loading recipe…" />;

  return (
    <div className={styles.page}>
      <h1>{isEdit ? 'Edit Recipe' : 'New Recipe'}</h1>
      <p className={styles.subtitle}>
        {isEdit ? `Editing: ${recipe?.title ?? '…'}` : "Add a new recipe to Baker's Delight"}
      </p>
      <RecipeForm existingRecipe={recipe} />
    </div>
  );
}

export default RecipeFormPage;
