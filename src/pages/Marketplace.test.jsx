import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { TestProviders } from '../test/TestProviders';
import Marketplace from './Marketplace';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

describe('Marketplace page', () => {
  it('renders heading and search input', () => {
    render(
      <TestProviders>
        <Marketplace />
      </TestProviders>
    );
    expect(screen.getByText('Explore AI Models')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search models/i)).toBeInTheDocument();
  });

  it('displays model cards by default', () => {
    render(
      <TestProviders>
        <Marketplace />
      </TestProviders>
    );
    expect(screen.getByText(/showing/i)).toBeInTheDocument();
  });

  it('filters by type tab', async () => {
    const user = userEvent.setup();
    render(
      <TestProviders>
        <Marketplace />
      </TestProviders>
    );

    const allCount = screen.getByText(/showing/i).textContent;
    await user.click(screen.getByRole('button', { name: /^Text$/i }));
    const textCount = screen.getByText(/showing/i).textContent;
    expect(textCount).not.toBe(allCount);
  });

  it('filters by search query', async () => {
    const user = userEvent.setup();
    render(
      <TestProviders>
        <Marketplace />
      </TestProviders>
    );

    await user.type(screen.getByPlaceholderText(/search models/i), 'GPT');
    const showing = screen.getByText(/showing/i).textContent;
    expect(showing).toMatch(/\d+/);
  });

  it('clears search with X button', async () => {
    const user = userEvent.setup();
    render(
      <TestProviders>
        <Marketplace />
      </TestProviders>
    );

    const input = screen.getByPlaceholderText(/search models/i);
    await user.type(input, 'GPT');
    const clearButton = input.parentElement.querySelector('button');
    await user.click(clearButton);
    expect(input.value).toBe('');
  });

  it('toggles between card and list view', async () => {
    const user = userEvent.setup();
    render(
      <TestProviders>
        <Marketplace />
      </TestProviders>
    );

    await user.click(screen.getByTitle('List view'));
    expect(screen.getByText('Model')).toBeInTheDocument();

    await user.click(screen.getByTitle('Card view'));
    expect(screen.queryByText('Model')).not.toBeInTheDocument();
  });

  it('opens and uses sort dropdown', async () => {
    const user = userEvent.setup();
    render(
      <TestProviders>
        <Marketplace />
      </TestProviders>
    );

    await user.click(screen.getByText(/sort:/i));
    await user.click(screen.getByText('Newest'));
  });

  it('shows clear all filters button when filters active', async () => {
    const user = userEvent.setup();
    render(
      <TestProviders>
        <Marketplace />
      </TestProviders>
    );

    await user.click(screen.getByRole('button', { name: /^Text$/i }));
    expect(screen.getByText('Clear all filters')).toBeInTheDocument();
  });

  it('shows empty state for no-match search', async () => {
    const user = userEvent.setup();
    render(
      <TestProviders>
        <Marketplace />
      </TestProviders>
    );

    await user.type(screen.getByPlaceholderText(/search models/i), 'xyznonexistent999');
    expect(screen.getByText('No models found')).toBeInTheDocument();
  });
});
