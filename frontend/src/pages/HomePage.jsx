import React from 'react';
import Hero from '../components/Hero';
import CategoryNavigation from '../components/CategoryNavigation';
import RecipeGrid from '../components/RecipeGrid';
import { useRecipes } from '../hooks/useRecipes';

/**
 * HomePage — the main landing page.
 * Shows the hero, sticky category nav, and the full recipe grid
 * grouped by category with audience filtering.
 */
function HomePage() {
  const { recipes, loading, error } = useRecipes();

  return (
    <>
      <Hero />
      <CategoryNavigation recipes={recipes} loading={loading} error={error} />
    </>
  );
}

export default HomePage;
