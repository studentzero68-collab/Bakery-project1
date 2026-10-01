import React from 'react';
import styles from './LoadingState.module.css';

/**
 * LoadingState — reusable loading indicator.
 * Used while API requests are in flight.
 */
function LoadingState({ message = 'Loading…' }) {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true" />
      <p className={styles.message}>{message}</p>
    </div>
  );
}

export default LoadingState;
