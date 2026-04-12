import { describe, it, expect } from 'vitest';
import { mockAPIs, getAPIById, getAPIsByType, searchAPIs } from './mockAPIs';

describe('mockAPIs', () => {
  it('exports a non-empty array of APIs', () => {
    expect(Array.isArray(mockAPIs)).toBe(true);
    expect(mockAPIs.length).toBeGreaterThan(0);
  });

  it('each API has required fields', () => {
    for (const api of mockAPIs) {
      expect(api).toHaveProperty('id');
      expect(api).toHaveProperty('name');
      expect(api).toHaveProperty('provider');
      expect(api).toHaveProperty('category');
      expect(api).toHaveProperty('type');
      expect(api).toHaveProperty('description');
      expect(api).toHaveProperty('pricing');
      expect(Array.isArray(api.category)).toBe(true);
    }
  });

  it('each API type is one of the known types', () => {
    const validTypes = ['text', 'image', 'video', 'audio'];
    for (const api of mockAPIs) {
      expect(validTypes).toContain(api.type);
    }
  });
});

describe('getAPIById', () => {
  it('returns the correct API for a known id', () => {
    const first = mockAPIs[0];
    const result = getAPIById(first.id);
    expect(result).toBe(first);
  });

  it('returns undefined for an unknown id', () => {
    expect(getAPIById('nonexistent-id-xyz')).toBeUndefined();
  });

  it('returns undefined for empty string', () => {
    expect(getAPIById('')).toBeUndefined();
  });

  it('returns undefined for null', () => {
    expect(getAPIById(null)).toBeUndefined();
  });
});

describe('getAPIsByType', () => {
  it('returns only APIs matching the given type', () => {
    const textAPIs = getAPIsByType('text');
    expect(textAPIs.length).toBeGreaterThan(0);
    for (const api of textAPIs) {
      expect(api.type).toBe('text');
    }
  });

  it('returns empty array for unknown type', () => {
    expect(getAPIsByType('nonexistent')).toEqual([]);
  });

  it('filters correctly for each known type', () => {
    for (const type of ['text', 'image', 'video', 'audio']) {
      const results = getAPIsByType(type);
      for (const api of results) {
        expect(api.type).toBe(type);
      }
    }
  });
});

describe('searchAPIs', () => {
  it('finds APIs by name (case-insensitive)', () => {
    const first = mockAPIs[0];
    const query = first.name.substring(0, 3).toLowerCase();
    const results = searchAPIs(query);
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(api => api.id === first.id)).toBe(true);
  });

  it('finds APIs by provider', () => {
    const provider = mockAPIs[0].provider;
    const results = searchAPIs(provider);
    expect(results.length).toBeGreaterThan(0);
    for (const api of results) {
      const matchesProvider = api.provider.toLowerCase().includes(provider.toLowerCase());
      const matchesName = api.name.toLowerCase().includes(provider.toLowerCase());
      const matchesDesc = api.description.toLowerCase().includes(provider.toLowerCase());
      expect(matchesProvider || matchesName || matchesDesc).toBe(true);
    }
  });

  it('returns empty array when no match', () => {
    expect(searchAPIs('xyznonexistent123')).toEqual([]);
  });

  it('is case-insensitive', () => {
    const first = mockAPIs[0];
    const upper = searchAPIs(first.name.toUpperCase());
    const lower = searchAPIs(first.name.toLowerCase());
    expect(upper).toEqual(lower);
  });

  it('searches description field', () => {
    const api = mockAPIs[0];
    const word = api.description.split(' ').find(w => w.length > 5);
    if (word) {
      const results = searchAPIs(word);
      expect(results.length).toBeGreaterThan(0);
    }
  });
});
