import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  describe, it, expect, vi,
} from 'vitest';
import AuthForm from '../AuthForm';

describe('AuthForm component', () => {
  it('should render login form correctly', () => {
    render(<AuthForm mode="login" onSubmit={() => {}} />);

    expect(screen.getByRole('heading')).toHaveTextContent('Masuk ke akun Anda');
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.queryByLabelText('Nama')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Login');
  });

  it('should render register form correctly', () => {
    render(<AuthForm mode="register" onSubmit={() => {}} />);

    expect(screen.getByRole('heading')).toHaveTextContent('Buat akun baru');
    expect(screen.getByLabelText('Nama')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Daftar');
  });

  it('should call onSubmit with correct data on login', async () => {
    const mockOnSubmit = vi.fn();
    render(<AuthForm mode="login" onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button');

    await userEvent.type(emailInput, 'test@test.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password123',
    });
  });

  it('should call onSubmit with correct data on register', async () => {
    const mockOnSubmit = vi.fn();
    render(<AuthForm mode="register" onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText('Nama');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button');

    await userEvent.type(nameInput, 'Test User');
    await userEvent.type(emailInput, 'test@test.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@test.com',
      password: 'password123',
    });
  });
});
