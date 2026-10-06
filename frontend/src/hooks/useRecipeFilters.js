/**
 * useRecipeFilters — reads and sets recipe filter state from URL search params.
 *
 * This allows category and audience filters to be bookmarkable and shareable.
 * e.g. /recipes?category=dessert&audience=romantic
 *
 * @returns {{
 *   category: string,
 *   audience: string,
 *   setCategory: (cat: string) => void,
 *   setAudience: (aud: string) => void,
 * }}
 */
import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export function useRecipeFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') ?? 'all';
  const audience = searchParams.get('audience') ?? 'all';

  const setCategory = useCallback(
    (cat) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (cat === 'all') {
          next.delete('category');
        } else {
          next.set('category', cat);
        }
        return next;
      });
    },
    [setSearchParams]
  );

  const setAudience = useCallback(
    (aud) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (aud === 'all') {
          next.delete('audience');
        } else {
          next.set('audience', aud);
        }
        return next;
      });
    },
    [setSearchParams]
  );

  return { category, audience, setCategory, setAudience };
}
