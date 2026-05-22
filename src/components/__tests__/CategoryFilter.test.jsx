import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  describe, it, expect, vi,
} from 'vitest';
import CategoryFilter from '../CategoryFilter';

describe('CategoryFilter component', () => {
  it('should render all categories with # prefix', () => {
    const categories = ['react', 'redux', 'vitest'];
    render(<CategoryFilter categories={categories} selected="react" onSelect={() => {}} />);

    categories.forEach((category) => {
      expect(screen.getByText(`#${category}`)).toBeInTheDocument();
    });
  });

  it('should call onSelect when a category is clicked', async () => {
    const categories = ['react', 'redux'];
    const mockOnSelect = vi.fn();
    render(<CategoryFilter categories={categories} selected="react" onSelect={mockOnSelect} />);

    const reduxButton = screen.getByText('#redux');
    await userEvent.click(reduxButton);

    expect(mockOnSelect).toHaveBeenCalledWith('redux');
  });

  it('should highlight selected category', () => {
    const categories = ['react', 'redux'];
    render(<CategoryFilter categories={categories} selected="redux" onSelect={() => {}} />);

    const reduxButton = screen.getByText('#redux');
    expect(reduxButton.className).toContain('active');

    const reactButton = screen.getByText('#react');
    expect(reactButton.className).not.toContain('active');
  });
});
