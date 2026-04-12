import { describe, it, expect } from 'vitest';
import {
  mockUser,
  getUsageByDateRange,
  getRecentCalls,
  getModelUsageBreakdown,
  getErrorBreakdown,
} from './mockUser';

describe('mockUser', () => {
  it('has required user fields', () => {
    expect(mockUser).toHaveProperty('id');
    expect(mockUser).toHaveProperty('email');
    expect(mockUser).toHaveProperty('name');
    expect(mockUser).toHaveProperty('apiKey');
    expect(mockUser).toHaveProperty('plan');
  });

  it('has usage data with history', () => {
    expect(mockUser.usage).toBeDefined();
    expect(mockUser.usage.currentMonth).toBeDefined();
    expect(Array.isArray(mockUser.usage.history)).toBe(true);
    expect(mockUser.usage.history.length).toBe(90);
  });

  it('has recent calls', () => {
    expect(Array.isArray(mockUser.recentCalls)).toBe(true);
    expect(mockUser.recentCalls.length).toBe(200);
  });

  it('each call has required fields', () => {
    const call = mockUser.recentCalls[0];
    expect(call).toHaveProperty('id');
    expect(call).toHaveProperty('timestamp');
    expect(call).toHaveProperty('model');
    expect(call).toHaveProperty('type');
    expect(call).toHaveProperty('status');
    expect(call).toHaveProperty('latency');
    expect(call).toHaveProperty('endpoint');
  });

  it('text calls have cache, reasoning, and request fields', () => {
    const textCall = mockUser.recentCalls.find(c => c.type === 'text' && c.status === 200);
    expect(textCall).toBeDefined();
    expect(typeof textCall.cacheReadTokens).toBe('number');
    expect(typeof textCall.cacheWriteTokens).toBe('number');
    expect(typeof textCall.reasoningTokens).toBe('number');
    expect(typeof textCall.streaming).toBe('boolean');
    expect(typeof textCall.temperature).toBe('number');
    expect(textCall.temperature).toBeGreaterThanOrEqual(0);
    expect(textCall.temperature).toBeLessThanOrEqual(1);
    expect([1024, 2048, 4096, 8192]).toContain(textCall.maxTokens);
    expect(textCall.costBreakdown).toBeDefined();
    expect(typeof textCall.costBreakdown.input).toBe('number');
    expect(typeof textCall.costBreakdown.output).toBe('number');
  });

  it('image calls have quality and seed fields', () => {
    const imgCall = mockUser.recentCalls.find(c => c.type === 'image');
    expect(imgCall).toBeDefined();
    expect(['standard', 'hd']).toContain(imgCall.quality);
    expect(imgCall.seed === null || typeof imgCall.seed === 'number').toBe(true);
  });

  it('video calls have fps, mode, and hasAudio fields', () => {
    const vidCall = mockUser.recentCalls.find(c => c.type === 'video');
    expect(vidCall).toBeDefined();
    expect([24, 30]).toContain(vidCall.fps);
    expect(['text-to-video', 'image-to-video']).toContain(vidCall.mode);
    expect(typeof vidCall.hasAudio).toBe('boolean');
  });

  it('audio calls have format, timestamps, and segments fields', () => {
    const audioCall = mockUser.recentCalls.find(c => c.type === 'audio');
    expect(audioCall).toBeDefined();
    expect(['json', 'text', 'srt', 'verbose_json']).toContain(audioCall.format);
    expect(typeof audioCall.timestamps).toBe('boolean');
    expect(typeof audioCall.segments).toBe('number');
    expect(audioCall.segments).toBeGreaterThan(0);
  });
});

describe('getUsageByDateRange', () => {
  it('returns the last N days of usage', () => {
    const result = getUsageByDateRange(7);
    expect(result).toHaveLength(7);
  });

  it('defaults to 30 days', () => {
    const result = getUsageByDateRange();
    expect(result).toHaveLength(30);
  });

  it('each entry has date, calls, tokens, cost', () => {
    const result = getUsageByDateRange(1);
    const entry = result[0];
    expect(entry).toHaveProperty('date');
    expect(entry).toHaveProperty('calls');
    expect(entry).toHaveProperty('tokens');
    expect(entry).toHaveProperty('cost');
  });

  it('returns full history for large range', () => {
    const result = getUsageByDateRange(90);
    expect(result).toHaveLength(90);
  });

  it('returns full history for range 0 (slice(-0) returns all)', () => {
    const result = getUsageByDateRange(0);
    expect(result).toHaveLength(90);
  });
});

describe('getRecentCalls', () => {
  it('defaults to 200 calls', () => {
    const result = getRecentCalls();
    expect(result).toHaveLength(200);
  });

  it('respects limit parameter', () => {
    const result = getRecentCalls(5);
    expect(result).toHaveLength(5);
  });

  it('returns empty for limit 0', () => {
    expect(getRecentCalls(0)).toHaveLength(0);
  });
});

describe('getModelUsageBreakdown', () => {
  it('returns an array of model breakdowns', () => {
    const result = getModelUsageBreakdown();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('each breakdown has required fields', () => {
    const result = getModelUsageBreakdown();
    for (const entry of result) {
      expect(entry).toHaveProperty('model');
      expect(entry).toHaveProperty('type');
      expect(entry).toHaveProperty('calls');
      expect(entry).toHaveProperty('cost');
      expect(entry).toHaveProperty('avgLatency');
    }
  });

  it('is sorted by calls descending', () => {
    const result = getModelUsageBreakdown();
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].calls).toBeGreaterThanOrEqual(result[i].calls);
    }
  });

  it('cost is a finite number', () => {
    const result = getModelUsageBreakdown();
    for (const entry of result) {
      expect(Number.isFinite(entry.cost)).toBe(true);
    }
  });

  it('avgLatency is a finite integer', () => {
    const result = getModelUsageBreakdown();
    for (const entry of result) {
      expect(Number.isFinite(entry.avgLatency)).toBe(true);
      expect(Number.isInteger(entry.avgLatency)).toBe(true);
    }
  });
});

describe('getErrorBreakdown', () => {
  it('returns an array', () => {
    const result = getErrorBreakdown();
    expect(Array.isArray(result)).toBe(true);
  });

  it('each entry has status, count, percentage', () => {
    const result = getErrorBreakdown();
    for (const entry of result) {
      expect(entry).toHaveProperty('status');
      expect(entry).toHaveProperty('count');
      expect(entry).toHaveProperty('percentage');
      expect(entry).toHaveProperty('lastOccurred');
    }
  });

  it('percentages sum to approximately 100', () => {
    const result = getErrorBreakdown();
    if (result.length > 0) {
      const total = result.reduce((sum, e) => sum + e.percentage, 0);
      expect(total).toBeCloseTo(100, 0);
    }
  });

  it('is sorted by count descending', () => {
    const result = getErrorBreakdown();
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].count).toBeGreaterThanOrEqual(result[i].count);
    }
  });

  it('only contains non-200 statuses', () => {
    const result = getErrorBreakdown();
    for (const entry of result) {
      expect(entry.status).not.toBe(200);
    }
  });
});
