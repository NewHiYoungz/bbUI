import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { TestProviders } from '../test/TestProviders';
import Home from './Home';

// Mock IntersectionObserver for useInView hook
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe(element) {
    // Immediately trigger as visible
    this.callback([{ isIntersecting: true }]);
  }
  disconnect() {}
  unobserve() {}
}

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

// Mock copy-to-clipboard
vi.mock('copy-to-clipboard', () => ({ default: vi.fn(() => true) }));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

describe('Home page', () => {
  it('renders hero heading', () => {
    render(
      <TestProviders>
        <Home />
      </TestProviders>
    );
    const headings = screen.getAllByText(/one api/i);
    expect(headings.length).toBeGreaterThan(0);
  });

  it('renders feature sections', () => {
    render(
      <TestProviders>
        <Home />
      </TestProviders>
    );
    const matches = screen.getAllByText(/500\+/i);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('renders model tabs', () => {
    render(
      <TestProviders>
        <Home />
      </TestProviders>
    );
    const chatButtons = screen.getAllByRole('button').filter(b => b.textContent.includes('Chat API'));
    expect(chatButtons.length).toBeGreaterThan(0);
  });

  it('renders CTA section', () => {
    render(
      <TestProviders>
        <Home />
      </TestProviders>
    );
    const links = screen.getAllByText(/get api key/i);
    expect(links.length).toBeGreaterThan(0);
  });
});
