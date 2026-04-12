import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { TestProviders } from '../../test/TestProviders';
import Layout from './Layout';

describe('Layout', () => {
  it('renders header, main content, and footer', () => {
    render(
      <TestProviders>
        <Layout>
          <div data-testid="child">Hello</div>
        </Layout>
      </TestProviders>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders navigation links in header', () => {
    render(
      <TestProviders>
        <Layout><div /></Layout>
      </TestProviders>
    );
    expect(screen.getAllByText(/api market/i).length).toBeGreaterThan(0);
  });
});
