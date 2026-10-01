import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuth';
import styles from './Navbar.module.css';

/**
 * Navbar — persistent top navigation.
 * Shows brand, recipe link, and auth controls.
 * Highlights the active route.
 */
function Navbar() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        {/* Brand */}
        <Link to="/" className={styles.brand}>
          <span className={styles.brandMain}>Baker's Delight</span>
          <span className={styles.brandSub}>Mukelani's Kitchen</span>
        </Link>

        {/* Desktop nav */}
        <nav className={styles.nav} aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/recipes"
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            Recipes
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            >
              Admin
            </NavLink>
          )}
        </nav>

        {/* Auth controls */}
        <div className={styles.auth}>
          {user ? (
            <>
              <span className={styles.userGreeting}>Hi, {user.name}</span>
              <button className={`btn-secondary ${styles.authBtn}`} onClick={handleLogout}>
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login" className={`btn-primary ${styles.authBtn}`}>
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className={styles.hamburger}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((p) => !p)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className={styles.drawer}>
          <NavLink to="/" end onClick={() => setMenuOpen(false)} className={styles.drawerLink}>Home</NavLink>
          <NavLink to="/recipes" onClick={() => setMenuOpen(false)} className={styles.drawerLink}>Recipes</NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin" onClick={() => setMenuOpen(false)} className={styles.drawerLink}>Admin</NavLink>
          )}
          {user ? (
            <button className={styles.drawerLink} onClick={() => { handleLogout(); setMenuOpen(false); }}>
              Sign out
            </button>
          ) : (
            <NavLink to="/login" onClick={() => setMenuOpen(false)} className={styles.drawerLink}>Sign in</NavLink>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
