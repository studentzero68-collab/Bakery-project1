import React, { useState } from 'react';
import styles from './RelationshipFilter.module.css';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'family', label: 'Family' },
  { id: 'friend', label: 'Friends' },
  { id: 'romantic', label: 'Romantic' },
];

/**
 * RelationshipFilter — the collapsible sidebar audience filter.
 * Preserves the original "For..." filter panel with Family/Friend/Romantic buttons.
 */
function RelationshipFilter({ activeAudience = 'all', onAudienceChange }) {
  const [open, setOpen] = useState(false);

  return (
    <aside
      className={`${styles.filter} ${open ? styles.open : ''}`}
      aria-label="Filter recipes by audience"
    >
      <button
        className={styles.toggle}
        type="button"
        aria-expanded={open}
        aria-controls="relationship-options"
        onClick={() => setOpen((p) => !p)}
      >
        <span>Filters</span>
        <span className={styles.chevron} aria-hidden="true">▾</span>
      </button>

      <div id="relationship-options" className={styles.options} hidden={!open}>
        <h3 className={styles.heading}>For…</h3>
        {FILTERS.map(({ id, label }) => (
          <button
            key={id}
            className={`${styles.btn} ${activeAudience === id ? styles.active : ''}`}
            onClick={() => onAudienceChange(id)}
            aria-pressed={activeAudience === id}
          >
            {label}
          </button>
        ))}
      </div>
    </aside>
  );
}

export default RelationshipFilter;
