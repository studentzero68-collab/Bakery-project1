import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

/**
 * Footer — preserves the original "Built by Mukelani N. Sindana" footer
 * and adds navigation links.
 */
function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.brandName}>Baker's Delight</span>
          <span className={styles.brandSub}>Mukelani's Kitchen</span>
        </div>

        <nav className={styles.links} aria-label="Footer navigation">
          <Link to="/">Home</Link>
          <Link to="/recipes">Recipes</Link>
          <Link to="/recipes?category=dessert">Desserts</Link>
          <Link to="/recipes?category=breakfast">Breakfast</Link>
          <Link to="/recipes?category=lunch">Lunch Bakes</Link>
        </nav>

        <p className={styles.credit}>
          Built by <span>Mukelani N. Sindana</span>
          {' · '}
          iHub Africa · Gauteng, South Africa
        </p>
      </div>
    </footer>
  );
}

export default Footer;
