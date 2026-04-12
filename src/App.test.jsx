import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { APIProvider } from './context/APIContext';
import App from './App';

class MockIntersectionObserver {
  constructor(callback) { this.callback = callback; }
  observe() { this.callback([{ isIntersecting: true }]); }
  disconnect() {}
  unobserve() {}
}
vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
vi.mock('copy-to-clipboard', () => ({ default: vi.fn(() => true) }));

function renderApp(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <APIProvider>
          <App />
        </APIProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('App', () => {
  it('renders home page at /', () => {
    renderApp('/');
    expect(screen.getAllByText(/one api/i).length).toBeGreaterThan(0);
  });

  it('renders pricing page at /pricing', () => {
    renderApp('/pricing');
    expect(screen.getByText('Pricing')).toBeInTheDocument();
  });

  it('renders docs page at /docs', () => {
    renderApp('/docs');
    expect(screen.getByText('Documentation')).toBeInTheDocument();
  });
});
