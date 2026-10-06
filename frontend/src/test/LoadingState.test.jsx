/**
 * LoadingState.test.jsx — unit tests for loading and error state components.
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

describe('LoadingState', () => {
  it('renders the default loading message', () => {
    render(<LoadingState />);
    expect(screen.getByText('Loading…')).toBeTruthy();
  });

  it('renders a custom message', () => {
    render(<LoadingState message="Loading recipes…" />);
    expect(screen.getByText('Loading recipes…')).toBeTruthy();
  });

  it('has correct ARIA role for screen readers', () => {
    render(<LoadingState />);
    expect(screen.getByRole('status')).toBeTruthy();
  });
});

describe('ErrorState', () => {
  it('renders the error message', () => {
    render(<ErrorState message="Failed to load recipes" />);
    expect(screen.getByText('Failed to load recipes')).toBeTruthy();
  });

  it('renders a default message when none provided', () => {
    render(<ErrorState />);
    expect(screen.getByText('Something went wrong.')).toBeTruthy();
  });

  it('renders a retry button when onRetry is provided', () => {
    const mockRetry = vi.fn();
    render(<ErrorState message="Error" onRetry={mockRetry} />);
    const btn = screen.getByRole('button', { name: /try again/i });
    expect(btn).toBeTruthy();
  });

  it('calls onRetry when the retry button is clicked', () => {
    const mockRetry = vi.fn();
    render(<ErrorState message="Error" onRetry={mockRetry} />);
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('does not render retry button when onRetry is not provided', () => {
    render(<ErrorState message="Error" />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('has ARIA alert role', () => {
    render(<ErrorState message="Error" />);
    expect(screen.getByRole('alert')).toBeTruthy();
  });
});
