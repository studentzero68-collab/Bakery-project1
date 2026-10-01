/**
 * RelationshipFilter.test.jsx — tests for the audience sidebar filter.
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RelationshipFilter from '../components/RelationshipFilter';

describe('RelationshipFilter', () => {
  it('renders the Filters toggle button', () => {
    render(<RelationshipFilter activeAudience="all" onAudienceChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /filters/i })).toBeTruthy();
  });

  it('filter options are hidden by default', () => {
    render(<RelationshipFilter activeAudience="all" onAudienceChange={vi.fn()} />);
    // The options panel should start hidden
    expect(screen.queryByText('For…')).toBeNull();
  });

  it('shows filter options after clicking the toggle', () => {
    render(<RelationshipFilter activeAudience="all" onAudienceChange={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /filters/i }));
    expect(screen.getByText('For…')).toBeTruthy();
  });

  it('renders all audience buttons when open', () => {
    render(<RelationshipFilter activeAudience="all" onAudienceChange={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /filters/i }));
    expect(screen.getByRole('button', { name: /all/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /family/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /friends/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /romantic/i })).toBeTruthy();
  });

  it('calls onAudienceChange with the correct value when a button is clicked', () => {
    const mockChange = vi.fn();
    render(<RelationshipFilter activeAudience="all" onAudienceChange={mockChange} />);
    fireEvent.click(screen.getByRole('button', { name: /filters/i }));
    fireEvent.click(screen.getByRole('button', { name: /family/i }));
    expect(mockChange).toHaveBeenCalledWith('family');
  });

  it('calls onAudienceChange with "romantic" when the Romantic button is clicked', () => {
    const mockChange = vi.fn();
    render(<RelationshipFilter activeAudience="all" onAudienceChange={mockChange} />);
    fireEvent.click(screen.getByRole('button', { name: /filters/i }));
    fireEvent.click(screen.getByRole('button', { name: /romantic/i }));
    expect(mockChange).toHaveBeenCalledWith('romantic');
  });
});
