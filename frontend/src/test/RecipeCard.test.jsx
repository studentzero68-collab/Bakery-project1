/**
 * RecipeCard.test.jsx — unit tests for the RecipeCard component.
 */
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';

// Helper to wrap with router context (RecipeCard uses <Link>)
function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

const mockRecipe = {
  _id: '65f5a1b2c3d4e5f6a7b8c9d1',
  title: 'Chocolate Chip Cookies',
  category: 'dessert',
  joke: 'These cookies hit harder than a final boss.',
  prepTime: '15 min',
  cookTime: '12 min',
  meaning: 'Comfort and care. The classic way of saying "I was thinking about you."',
  audiences: ['family', 'friend', 'romantic'],
  image: '',
  ingredients: ['2¼ cups flour', '1 cup butter', '2 cups chocolate chips'],
  steps: ['Preheat oven', 'Mix ingredients', 'Bake 10 minutes'],
  video: '',
};

describe('RecipeCard', () => {
  it('renders the recipe title', () => {
    renderWithRouter(<RecipeCard recipe={mockRecipe} />);
    // When no image, title appears in h3 link AND in placeholder label
    const titles = screen.getAllByText('Chocolate Chip Cookies');
    expect(titles.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the joke', () => {
    renderWithRouter(<RecipeCard recipe={mockRecipe} />);
    expect(screen.getByText(/harder than a final boss/)).toBeTruthy();
  });

  it('renders prep and cook times', () => {
    renderWithRouter(<RecipeCard recipe={mockRecipe} />);
    expect(screen.getByText(/15 min prep/)).toBeTruthy();
    expect(screen.getByText(/12 min/)).toBeTruthy();
  });

  it('renders the meaning', () => {
    renderWithRouter(<RecipeCard recipe={mockRecipe} />);
    expect(screen.getByText(/Comfort and care/)).toBeTruthy();
  });

  it('shows "Show Recipe" button initially', () => {
    renderWithRouter(<RecipeCard recipe={mockRecipe} />);
    expect(screen.getByRole('button', { name: /show recipe/i })).toBeTruthy();
  });

  it('toggles to show ingredients when "Show Recipe" is clicked', () => {
    renderWithRouter(<RecipeCard recipe={mockRecipe} />);
    const btn = screen.getByRole('button', { name: /show recipe/i });
    fireEvent.click(btn);
    expect(screen.getByText('2¼ cups flour')).toBeTruthy();
    expect(screen.getByRole('button', { name: /hide recipe/i })).toBeTruthy();
  });

  it('toggles back to hidden when "Hide Recipe" is clicked', () => {
    renderWithRouter(<RecipeCard recipe={mockRecipe} />);
    const btn = screen.getByRole('button', { name: /show recipe/i });
    fireEvent.click(btn);
    fireEvent.click(screen.getByRole('button', { name: /hide recipe/i }));
    expect(screen.queryByText('2¼ cups flour')).toBeNull();
  });

  it('shows the image placeholder when no image URL is provided', () => {
    renderWithRouter(<RecipeCard recipe={{ ...mockRecipe, image: '' }} />);
    // When no image URL, a placeholder label with the recipe title should appear
    const placeholders = screen.getAllByText('Chocolate Chip Cookies');
    // There will be at least 2: the h3 title link and the placeholder label
    expect(placeholders.length).toBeGreaterThanOrEqual(2);
  });

  it('renders audience tags', () => {
    renderWithRouter(<RecipeCard recipe={mockRecipe} />);
    expect(screen.getByText('Family')).toBeTruthy();
    expect(screen.getByText('Friend')).toBeTruthy();
    expect(screen.getByText('Romantic')).toBeTruthy();
  });

  it('links to the recipe detail page', () => {
    renderWithRouter(<RecipeCard recipe={mockRecipe} />);
    const links = screen.getAllByRole('link');
    const detailLink = links.find((l) => l.href.includes(mockRecipe._id));
    expect(detailLink).toBeTruthy();
  });
});
