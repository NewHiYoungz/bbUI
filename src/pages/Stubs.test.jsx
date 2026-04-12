import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { TestProviders } from '../test/TestProviders';
import Pricing from './Pricing';
import Documentation from './Documentation';

describe('Pricing page', () => {
  it('renders heading', () => {
    render(
      <TestProviders>
        <Pricing />
      </TestProviders>
    );
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('Coming soon...')).toBeInTheDocument();
  });
});

describe('Documentation page', () => {
  it('renders heading', () => {
    render(
      <TestProviders>
        <Documentation />
      </TestProviders>
    );
    expect(screen.getByText('Documentation')).toBeInTheDocument();
    expect(screen.getByText('Coming soon...')).toBeInTheDocument();
  });
});
