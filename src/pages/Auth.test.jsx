import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { TestProviders } from '../test/TestProviders';
import Auth from './Auth';

describe('Auth page', () => {
  it('renders login form by default', () => {
    render(
      <TestProviders initialEntries={['/login']}>
        <Auth />
      </TestProviders>
    );
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText(/email or username/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('renders sign up form when mode=signup', () => {
    render(
      <TestProviders initialEntries={['/login?mode=signup']}>
        <Auth />
      </TestProviders>
    );
    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
  });

  it('shows validation error when submitting empty login', async () => {
    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();

    render(
      <TestProviders initialEntries={['/login']}>
        <Auth />
      </TestProviders>
    );

    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByText('Please fill in all fields.')).toBeInTheDocument();
  });

  it('shows validation error when signup passwords do not match', async () => {
    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();

    render(
      <TestProviders initialEntries={['/login?mode=signup']}>
        <Auth />
      </TestProviders>
    );

    await user.type(screen.getByLabelText(/full name/i), 'Test User');
    await user.type(screen.getByLabelText(/email address/i), 'test@test.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'differentpass');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
  });

  it('shows validation error when signup password is too short', async () => {
    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();

    render(
      <TestProviders initialEntries={['/login?mode=signup']}>
        <Auth />
      </TestProviders>
    );

    await user.type(screen.getByLabelText(/full name/i), 'Test User');
    await user.type(screen.getByLabelText(/email address/i), 'test@test.com');
    await user.type(screen.getByLabelText('Password'), 'short');
    await user.type(screen.getByLabelText(/confirm password/i), 'short');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(screen.getByText('Password must be at least 8 characters.')).toBeInTheDocument();
  });

  it('switches between login and signup modes', async () => {
    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();

    render(
      <TestProviders initialEntries={['/login']}>
        <Auth />
      </TestProviders>
    );

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /sign up/i }));
    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /sign in$/i }));
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  });

  it('toggles password visibility on login form', async () => {
    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();

    render(
      <TestProviders initialEntries={['/login']}>
        <Auth />
      </TestProviders>
    );

    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(screen.getByLabelText(/show password/i));
    expect(passwordInput).toHaveAttribute('type', 'text');
  });
});
