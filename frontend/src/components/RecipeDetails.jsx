import React from 'react';
import styles from './RecipeDetails.module.css';

const AUDIENCE_LABELS = { family: 'Family', friend: 'Friend', romantic: 'Romantic' };

/**
 * RecipeDetails — full recipe view displayed on /recipes/:id.
 * Shows all recipe fields in a clean single-column layout.
 */
function RecipeDetails({ recipe }) {
  const {
    title,
    category,
    description,
    joke,
    prepTime,
    cookTime,
    meaning,
    audiences = [],
    image,
    ingredients = [],
    steps = [],
    video,
    createdAt,
  } = recipe;

  return (
    <article className={styles.article}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.categoryBadge} data-category={category}>
          {category}
        </div>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </header>

      {/* Image */}
      {image && (
        <div className={styles.imageWrapper}>
          <img src={image} alt={title} className={styles.image} />
        </div>
      )}

      {/* Joke */}
      {joke && (
        <blockquote className={styles.joke}>{joke}</blockquote>
      )}

      {/* Meta row */}
      <div className={styles.metaRow}>
        {prepTime && (
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Prep</span>
            <span className={styles.metaValue}>{prepTime}</span>
          </div>
        )}
        {cookTime && (
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>{category === 'breakfast' ? 'Cook' : 'Bake'}</span>
            <span className={styles.metaValue}>{cookTime}</span>
          </div>
        )}
        {audiences.length > 0 && (
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>For</span>
            <div className={styles.audienceTags}>
              {audiences.map((a) => (
                <span
                  key={a}
                  className={`${styles.audTag} ${
                    a === 'family' ? 'rel-family' : a === 'romantic' ? 'rel-lover' : 'rel-friend'
                  }`}
                >
                  {AUDIENCE_LABELS[a] ?? a}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Meaning */}
      {meaning && (
        <div className={styles.meaningBlock}>
          <p className={styles.meaningLabel}>What it means when you make it</p>
          <p className={styles.meaningText}>{meaning}</p>
        </div>
      )}

      {/* Ingredients */}
      {ingredients.length > 0 && (
        <section className={styles.section} aria-label="Ingredients">
          <h2 className={styles.sectionHeading}>Ingredients</h2>
          <ul className={styles.ingredientList}>
            {ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Video */}
      {video && (
        <div className={styles.videoWrapper}>
          <iframe
            src={video}
            title={`How to make ${title}`}
            allowFullScreen
            className={styles.videoFrame}
          />
        </div>
      )}

      {/* Steps */}
      {steps.length > 0 && (
        <section className={styles.section} aria-label="Instructions">
          <h2 className={styles.sectionHeading}>Instructions</h2>
          <ol className={styles.stepsList}>
            {steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      {/* Footer */}
      {createdAt && (
        <p className={styles.createdAt}>
          Added {new Date(createdAt).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      )}
    </article>
  );
}

export default RecipeDetails;
