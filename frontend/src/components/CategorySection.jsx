import React from 'react';
import RecipeCard from './RecipeCard';
import styles from './CategorySection.module.css';

/**
 * CategorySection — a single category block with header and recipe grid.
 * Mirrors the original `.category-section-block` layout exactly.
 */
function CategorySection({ label, subtitle, dotClass, recipes = [] }) {
  return (
    <section className={styles.section} aria-label={`${label} recipes`}>
      <div className={styles.header}>
        <div className={`${styles.dot} ${dotClass}`} aria-hidden="true" />
        <div>
          <h2 className={styles.heading}>{label}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>

      {recipes.length === 0 ? (
        <p className={styles.empty}>No recipes in this category yet.</p>
      ) : (
        <div className={styles.grid}>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}
    </section>
  );
}

export default CategorySection;
