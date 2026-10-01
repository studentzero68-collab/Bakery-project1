/**
 * Hero.test.jsx — tests for the Hero landing section.
 */
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Hero from '../components/Hero';

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe('Hero', () => {
  it("renders the Baker's Delight heading", () => {
    renderWithRouter(<Hero />);
    expect(screen.getByText("Baker's")).toBeTruthy();
    expect(screen.getByText('Delight')).toBeTruthy();
  });

  it("renders the Mukelani's Kitchen badge", () => {
    renderWithRouter(<Hero />);
    expect(screen.getByText("Mukelani's Kitchen")).toBeTruthy();
  });

  it('renders personality tags', () => {
    renderWithRouter(<Hero />);
    expect(screen.getByText('Gamer-approved')).toBeTruthy();
    expect(screen.getByText('Anime-worthy')).toBeTruthy();
    expect(screen.getByText('Disciplined Baker')).toBeTruthy();
    expect(screen.getByText('Made with love')).toBeTruthy();
  });

  it('renders the Browse Recipes CTA link', () => {
    renderWithRouter(<Hero />);
    const links = screen.getAllByRole('link');
    const browseLink = links.find((l) => l.textContent.includes('Browse Recipes'));
    expect(browseLink).toBeTruthy();
  });

  it('has a section landmark for accessibility', () => {
    renderWithRouter(<Hero />);
    // The hero is wrapped in a <section> element
    const section = document.querySelector('section');
    expect(section).toBeTruthy();
  });
});
