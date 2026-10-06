/**
 * helpers.test.js — unit tests for frontend utility functions.
 */
import { describe, it, expect } from 'vitest';
import {
  formatCategory,
  formatAudience,
  getCategoryDotClass,
  truncateText,
  isAdminUser,
} from '../utils/helpers';

describe('formatCategory', () => {
  it('formats dessert correctly', () => {
    expect(formatCategory('dessert')).toBe('Desserts');
  });

  it('formats breakfast correctly', () => {
    expect(formatCategory('breakfast')).toBe('Breakfast');
  });

  it('formats lunch correctly', () => {
    expect(formatCategory('lunch')).toBe('Lunch Bakes');
  });

  it('returns the raw value for unknown categories', () => {
    expect(formatCategory('unknown')).toBe('unknown');
  });
});

describe('formatAudience', () => {
  it('formats family', () => {
    expect(formatAudience('family')).toBe('Family');
  });

  it('formats friend', () => {
    expect(formatAudience('friend')).toBe('Friend');
  });

  it('formats romantic', () => {
    expect(formatAudience('romantic')).toBe('Romantic');
  });
});

describe('getCategoryDotClass', () => {
  it('returns dot-dessert for dessert', () => {
    expect(getCategoryDotClass('dessert')).toBe('dot-dessert');
  });

  it('returns dot-breakfast for breakfast', () => {
    expect(getCategoryDotClass('breakfast')).toBe('dot-breakfast');
  });

  it('falls back to dot-dessert for unknown categories', () => {
    expect(getCategoryDotClass('unknown')).toBe('dot-dessert');
  });
});

describe('truncateText', () => {
  it('returns text unchanged when under the limit', () => {
    expect(truncateText('Short text', 100)).toBe('Short text');
  });

  it('truncates long text with an ellipsis', () => {
    const long = 'A'.repeat(150);
    const result = truncateText(long, 100);
    expect(result.endsWith('…')).toBe(true);
    expect(result.length).toBeLessThanOrEqual(101);
  });

  it('handles null/undefined gracefully', () => {
    expect(truncateText(null)).toBe('');
    expect(truncateText(undefined)).toBe('');
  });
});

describe('isAdminUser', () => {
  it('returns true for admin users', () => {
    expect(isAdminUser({ name: 'Admin', role: 'admin' })).toBe(true);
  });

  it('returns false for regular users', () => {
    expect(isAdminUser({ name: 'User', role: 'user' })).toBe(false);
  });

  it('returns false for null', () => {
    expect(isAdminUser(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isAdminUser(undefined)).toBe(false);
  });
});
