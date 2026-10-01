import React from 'react';
import styles from './ErrorState.module.css';

/**
 * ErrorState — displays an error message with a retry option.
 * Used when API requests fail.
 */
function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className={styles.wrapper} role="alert">
      <div className={styles.icon} aria-hidden="true">!</div>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button className={`btn-secondary ${styles.retry}`} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorState;
