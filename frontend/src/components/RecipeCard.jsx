import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './RecipeCard.module.css';

const CATEGORY_IMAGE_CLASSES = {
  dessert: styles.imgDessert,
  breakfast: styles.imgBreakfast,
  lunch: styles.imgLunch,
};

const AUDIENCE_LABELS = {
  family: 'Family',
  friend: 'Friend',
  romantic: 'Romantic',
};

/**
 * RecipeCard — individual recipe card component.
 * Preserves the original: joke, meta, meaning, relationship tags,
 * expand/collapse button, ingredients, steps, and video placeholder.
 */
function RecipeCard({ recipe }) {
  const [expanded, setExpanded] = useState(false);

  const {
    _id,
    title,
    category,
    joke,
    prepTime,
    cookTime,
    meaning,
    audiences = [],
    image,
    ingredients = [],
    steps = [],
    video,
  } = recipe;

  const imgClass = CATEGORY_IMAGE_CLASSES[category] ?? styles.imgDessert;

  function handleImageError(e) {
    e.target.style.display = 'none';
    e.target.nextElementSibling?.removeAttribute('style');
  }

  return (
    <article className={styles.card} data-testid="recipe-card">
      {/* Card image */}
      <div className={`${styles.cardImg} ${imgClass}`}>
        {image ? (
          <>
            <img
              src={image}
              alt={title}
              className={styles.recipeImage}
              onError={handleImageError}
              loading="lazy"
            />
            <div className={styles.imgPlaceholder} style={{ display: 'none' }}>
              <span className={styles.placeholderIcon} aria-hidden="true" />
              <span className={styles.placeholderLabel}>{title}</span>
            </div>
          </>
        ) : (
          <div className={styles.imgPlaceholder}>
            <span className={styles.placeholderIcon} aria-hidden="true" />
            <span className={styles.placeholderLabel}>{title}</span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>
          <Link to={`/recipes/${_id}`} className={styles.titleLink}>
            {title}
          </Link>
        </h3>

        {joke && (
          <blockquote className={styles.cardJoke}>{joke}</blockquote>
        )}

        <div className={styles.cardMeta}>
          {prepTime && <span>{prepTime} prep</span>}
          {cookTime && <span>{cookTime} {category === 'breakfast' ? 'cook' : 'bake'}</span>}
        </div>

        {meaning && <p className={styles.cardMeaning}>{meaning}</p>}

        {audiences.length > 0 && (
          <div className={styles.relationTags}>
            {audiences.map((aud) => (
              <span
                key={aud}
                className={`${styles.relTag} ${
                  aud === 'family' ? 'rel-family' :
                  aud === 'romantic' ? 'rel-lover' : 'rel-friend'
                }`}
              >
                {AUDIENCE_LABELS[aud] ?? aud}
              </span>
            ))}
          </div>
        )}

        {/* Expand/collapse */}
        <button
          className={styles.expandBtn}
          onClick={() => setExpanded((p) => !p)}
          aria-expanded={expanded}
        >
          {expanded ? 'Hide Recipe' : 'Show Recipe'}
        </button>

        {/* Expandable details */}
        {expanded && (
          <div className={styles.cardDetails}>
            {ingredients.length > 0 && (
              <>
                <p className={styles.detailLabel}>Ingredients</p>
                <ul className={styles.ingredientList}>
                  {ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </>
            )}

            {steps.length > 0 && (
              <>
                <p className={styles.detailLabel}>Steps</p>

                {/* Video placeholder or actual video */}
                {video ? (
                  <div className={styles.videoWrapper}>
                    <iframe
                      src={video}
                      title={`How to make ${title}`}
                      allowFullScreen
                      className={styles.videoFrame}
                    />
                  </div>
                ) : (
                  <div className={styles.videoPlaceholder} aria-label="Recipe video placeholder">
                    <div className={styles.videoInner}>
                      <span className={styles.playIcon} aria-hidden="true" />
                      <span>Watch how it's made</span>
                      <span className={styles.videoNote}>Video can be added in the admin panel</span>
                    </div>
                  </div>
                )}

                <ol className={styles.stepsList}>
                  {steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default RecipeCard;
