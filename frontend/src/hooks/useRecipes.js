import { useState, useEffect, useCallback } from 'react';
import { getRecipes, getRecipeById } from '../services/api';

/**
 * useRecipes — fetches a list of recipes with optional filters.
 *
 * @param {object} filters  — { category, audience }
 * @returns { recipes, loading, error, refetch }
 */
export function useRecipes(filters = {}) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  const filtersKey = JSON.stringify(filters);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getRecipes(filters)
      .then((data) => {
        if (!cancelled) setRecipes(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return { recipes, loading, error, refetch };
}

/**
 * useRecipe — fetches a single recipe by ID.
 *
 * @param {string} id
 * @returns { recipe, loading, error }
 */
export function useRecipe(id) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    setError(null);

    getRecipeById(id)
      .then((data) => { if (!cancelled) setRecipe(data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [id]);

  return { recipe, loading, error };
}
