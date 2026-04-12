import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => { store[key] = String(value); }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

function TestConsumer() {
  const { isLoggedIn, user, login, logout, generateNewAPIKey } = useAuth();

  return (
    <div>
      <span data-testid="logged-in">{String(isLoggedIn)}</span>
      <span data-testid="user-name">{user?.name ?? 'none'}</span>
      <span data-testid="api-key">{user?.apiKey ?? 'none'}</span>
      <button data-testid="login" onClick={login}>Login</button>
      <button data-testid="logout" onClick={logout}>Logout</button>
      <button data-testid="new-key" onClick={generateNewAPIKey}>New Key</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('starts logged out when no stored auth', () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    expect(screen.getByTestId('logged-in').textContent).toBe('false');
    expect(screen.getByTestId('user-name').textContent).toBe('none');
  });

  it('starts logged in when stored auth is true', () => {
    localStorageMock.getItem.mockReturnValue('true');
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    expect(screen.getByTestId('logged-in').textContent).toBe('true');
    expect(screen.getByTestId('user-name').textContent).not.toBe('none');
  });

  it('login sets user and persists to localStorage', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await user.click(screen.getByTestId('login'));
    expect(screen.getByTestId('logged-in').textContent).toBe('true');
    expect(screen.getByTestId('user-name').textContent).not.toBe('none');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('apimart_auth', 'true');
  });

  it('logout clears user and removes from localStorage', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await user.click(screen.getByTestId('login'));
    await user.click(screen.getByTestId('logout'));
    expect(screen.getByTestId('logged-in').textContent).toBe('false');
    expect(screen.getByTestId('user-name').textContent).toBe('none');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('apimart_auth');
  });

  it('generateNewAPIKey produces a new key', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await user.click(screen.getByTestId('login'));
    const originalKey = screen.getByTestId('api-key').textContent;
    await user.click(screen.getByTestId('new-key'));
    const newKey = screen.getByTestId('api-key').textContent;
    expect(newKey).not.toBe(originalKey);
    expect(newKey).toMatch(/^sk-apimart-/);
  });

  it('throws when useAuth is used outside provider', () => {
    function Orphan() {
      useAuth();
      return null;
    }
    expect(() => render(<Orphan />)).toThrow('useAuth must be used within AuthProvider');
  });
});
