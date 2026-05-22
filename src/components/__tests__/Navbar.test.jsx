import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  describe, it, expect, vi,
} from 'vitest';
import Navbar from '../Navbar';
import { renderWithProviders } from '../../utils/test-utils';

describe('Navbar component', () => {
  it('should render login and register links when not authenticated', () => {
    renderWithProviders(<Navbar />, {
      preloadedState: {
        auth: { token: null, currentUser: null },
      },
    });

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('should render user name and logout button when authenticated', () => {
    renderWithProviders(<Navbar />, {
      preloadedState: {
        auth: {
          token: 'fake-token',
          currentUser: { name: 'John Doe' },
        },
      },
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  it('should dispatch logout action when logout button is clicked', async () => {
    const { store } = renderWithProviders(<Navbar />, {
      preloadedState: {
        auth: {
          token: 'fake-token',
          currentUser: { name: 'John Doe' },
        },
      },
    });

    const logoutButton = screen.getByText('Logout');
    await userEvent.click(logoutButton);

    const state = store.getState();
    expect(state.auth.token).toBeNull();
  });
});
