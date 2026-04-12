import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { APIProvider, useAPI } from './APIContext';
import { mockAPIs } from '../data/mockAPIs';

function TestConsumer() {
  const {
    apis,
    filteredAPIs,
    searchQuery,
    setSearchQuery,
    setSortBy,
    setCategoryFilter,
    setProviderFilter,
    clearFilters,
    getAPIById,
  } = useAPI();

  return (
    <div>
      <span data-testid="api-count">{apis.length}</span>
      <span data-testid="filtered-count">{filteredAPIs.length}</span>
      <span data-testid="search-query">{searchQuery}</span>
      <button data-testid="search-gpt" onClick={() => setSearchQuery('GPT')}>Search GPT</button>
      <button data-testid="search-empty" onClick={() => setSearchQuery('xyznonexistent123')}>Search Empty</button>
      <button data-testid="sort-newest" onClick={() => setSortBy('newest')}>Sort Newest</button>
      <button data-testid="sort-price-low" onClick={() => setSortBy('price-low')}>Sort Price Low</button>
      <button data-testid="sort-price-high" onClick={() => setSortBy('price-high')}>Sort Price High</button>
      <button data-testid="filter-category" onClick={() => setCategoryFilter(['Chat'])}>Filter Chat</button>
      <button data-testid="filter-provider" onClick={() => setProviderFilter(['OpenAI'])}>Filter OpenAI</button>
      <button data-testid="clear" onClick={clearFilters}>Clear</button>
      <span data-testid="lookup">{getAPIById(mockAPIs[0].id)?.name ?? 'none'}</span>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <APIProvider>
      <TestConsumer />
    </APIProvider>
  );
}

describe('APIContext', () => {
  it('provides all mock APIs', () => {
    renderWithProvider();
    expect(screen.getByTestId('api-count').textContent).toBe(String(mockAPIs.length));
  });

  it('initially shows all APIs as filtered', () => {
    renderWithProvider();
    expect(screen.getByTestId('filtered-count').textContent).toBe(String(mockAPIs.length));
  });

  it('filters by search query', async () => {
    const user = userEvent.setup();
    renderWithProvider();
    await user.click(screen.getByTestId('search-gpt'));
    const count = Number(screen.getByTestId('filtered-count').textContent);
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(mockAPIs.length);
  });

  it('returns empty when search has no match', async () => {
    const user = userEvent.setup();
    renderWithProvider();
    await user.click(screen.getByTestId('search-empty'));
    expect(screen.getByTestId('filtered-count').textContent).toBe('0');
  });

  it('filters by category', async () => {
    const user = userEvent.setup();
    renderWithProvider();
    await user.click(screen.getByTestId('filter-category'));
    const count = Number(screen.getByTestId('filtered-count').textContent);
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(mockAPIs.length);
  });

  it('filters by provider', async () => {
    const user = userEvent.setup();
    renderWithProvider();
    await user.click(screen.getByTestId('filter-provider'));
    const count = Number(screen.getByTestId('filtered-count').textContent);
    expect(count).toBeGreaterThan(0);
  });

  it('clears filters', async () => {
    const user = userEvent.setup();
    renderWithProvider();
    await user.click(screen.getByTestId('search-gpt'));
    expect(Number(screen.getByTestId('filtered-count').textContent)).toBeLessThan(mockAPIs.length);
    await user.click(screen.getByTestId('clear'));
    expect(screen.getByTestId('filtered-count').textContent).toBe(String(mockAPIs.length));
    expect(screen.getByTestId('search-query').textContent).toBe('');
  });

  it('sorts by newest', async () => {
    const user = userEvent.setup();
    renderWithProvider();
    await user.click(screen.getByTestId('sort-newest'));
    expect(screen.getByTestId('filtered-count').textContent).toBe(String(mockAPIs.length));
  });

  it('sorts by price low', async () => {
    const user = userEvent.setup();
    renderWithProvider();
    await user.click(screen.getByTestId('sort-price-low'));
    expect(screen.getByTestId('filtered-count').textContent).toBe(String(mockAPIs.length));
  });

  it('sorts by price high', async () => {
    const user = userEvent.setup();
    renderWithProvider();
    await user.click(screen.getByTestId('sort-price-high'));
    expect(screen.getByTestId('filtered-count').textContent).toBe(String(mockAPIs.length));
  });

  it('looks up API by id', () => {
    renderWithProvider();
    expect(screen.getByTestId('lookup').textContent).toBe(mockAPIs[0].name);
  });

  it('throws when useAPI is used outside provider', () => {
    function Orphan() {
      useAPI();
      return null;
    }
    expect(() => render(<Orphan />)).toThrow('useAPI must be used within APIProvider');
  });
});
