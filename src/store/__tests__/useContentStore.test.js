import { describe, it, expect, beforeEach } from 'vitest';
import { useContentStore } from '../useContentStore';

beforeEach(() => {
  useContentStore.setState({
    contentCache: {},
    pendingFetches: {},
    contentLoading: false,
    fetchError: null,
  });
});

describe('getCachedContent', () => {
  it('returns undefined for cache miss', () => {
    const result = useContentStore.getState().getCachedContent('some/path');
    expect(result).toBeUndefined();
  });

  it('returns cached entry for cache hit', () => {
    const entry = { content: '# Hello', timestamp: Date.now() };
    useContentStore.setState({
      contentCache: { 'some/path': entry },
    });

    const result = useContentStore.getState().getCachedContent('some/path');
    expect(result).toEqual(entry);
    expect(result.content).toBe('# Hello');
  });
});

describe('cleanOldCache', () => {
  it('removes entries older than 7 days', () => {
    const now = Date.now();
    const eightDaysAgo = now - 8 * 24 * 60 * 60 * 1000;
    const oneDayAgo = now - 1 * 24 * 60 * 60 * 1000;

    useContentStore.setState({
      contentCache: {
        'old/path': { content: 'old', timestamp: eightDaysAgo },
        'new/path': { content: 'new', timestamp: oneDayAgo },
      },
    });

    useContentStore.getState().cleanOldCache();

    const cache = useContentStore.getState().contentCache;
    expect(cache['old/path']).toBeUndefined();
    expect(cache['new/path']).toBeDefined();
  });

  it('keeps entries within 7 days', () => {
    const now = Date.now();
    useContentStore.setState({
      contentCache: {
        a: { content: 'a', timestamp: now },
        b: { content: 'b', timestamp: now - 6 * 24 * 60 * 60 * 1000 },
      },
    });

    useContentStore.getState().cleanOldCache();

    expect(useContentStore.getState().getCacheSize()).toBe(2);
  });
});

describe('getCacheSize', () => {
  it('returns 0 for empty cache', () => {
    expect(useContentStore.getState().getCacheSize()).toBe(0);
  });

  it('returns correct count', () => {
    const now = Date.now();
    useContentStore.setState({
      contentCache: {
        a: { content: 'a', timestamp: now },
        b: { content: 'b', timestamp: now },
        c: { content: 'c', timestamp: now },
      },
    });

    expect(useContentStore.getState().getCacheSize()).toBe(3);
  });
});

describe('removeCachedContent', () => {
  it('removes a specific cache entry', () => {
    const now = Date.now();
    useContentStore.setState({
      contentCache: {
        a: { content: 'a', timestamp: now },
        b: { content: 'b', timestamp: now },
      },
    });

    useContentStore.getState().removeCachedContent('a');

    expect(useContentStore.getState().getCachedContent('a')).toBeUndefined();
    expect(useContentStore.getState().getCachedContent('b')).toBeDefined();
  });
});

describe('clearCache', () => {
  it('clears all cached entries', () => {
    const now = Date.now();
    useContentStore.setState({
      contentCache: {
        a: { content: 'a', timestamp: now },
        b: { content: 'b', timestamp: now },
      },
    });

    useContentStore.getState().clearCache();
    expect(useContentStore.getState().getCacheSize()).toBe(0);
  });
});
