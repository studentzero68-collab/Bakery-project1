import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';

/**
 * Hero — preserves the exact look/feel of the original vanilla HTML hero.
 * Badge, heading with gold span, personality tags, gradient + diagonal pattern.
 */
function Hero() {
  return (
    <section className={styles.hero} aria-label="Baker's Delight hero">
      <div className={styles.bg} aria-hidden="true" />
      <div className={styles.pattern} aria-hidden="true" />

      <div className={styles.content}>
        <div className={`badge ${styles.badge}`}>Mukelani's Kitchen</div>

        <h1 className={styles.heading}>
          Baker's <span className={styles.gold}>Delight</span>
        </h1>

        <p className={styles.tagline}>
          A warm, open kitchen for every baker — whether you're here for comfort cookies,
          anime-worthy presentation, or the disciplined joy of getting every recipe right.
        </p>

        <div className={styles.tags} aria-label="Bakery personality tags">
          <span className={styles.tag}>Gamer-approved</span>
          <span className={styles.tag}>Anime-worthy</span>
          <span className={styles.tag}>Disciplined Baker</span>
          <span className={styles.tag}>Made with love</span>
        </div>

        <div className={styles.cta}>
          <Link to="/recipes" className="btn-primary">Browse Recipes</Link>
          <Link to="/recipes?category=dessert" className="btn-secondary">Desserts</Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
