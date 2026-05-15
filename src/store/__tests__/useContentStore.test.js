import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useContentStore } from '../useContentStore';

beforeEach(() => {
  useContentStore.setState({
    contentCache: {},
    pendingFetches: {},
    contentLoading: false,
    fetchError: null,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('fetchLessonContent', () => {
  it('falls back to GitHub raw content when the local markdown request returns SPA HTML', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response('<!doctype html><html><head></head><body>SPA fallback</body></html>', {
          status: 200,
          headers: { 'Content-Type': 'text/html' },
        })
      )
      .mockResolvedValueOnce(
        new Response('Not Found', {
          status: 404,
          headers: { 'Content-Type': 'text/plain' },
        })
      )
      .mockResolvedValueOnce(
        new Response('# Lesson Markdown', {
          status: 200,
          headers: { 'Content-Type': 'text/plain' },
        })
      );

    const content = await useContentStore
      .getState()
      .fetchLessonContent('zh', 'GetStartedWithBitcoin/03_BitcoinTx');

    expect(content).toBe('# Lesson Markdown');
    expect(fetch).toHaveBeenNthCalledWith(
      3,
      'https://raw.githubusercontent.com/beihaili/Get-Started-with-Web3/main/zh/GetStartedWithBitcoin/03_BitcoinTx/README.md'
    );
  });

  it('tries uppercase README.MD before falling back to GitHub raw content', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response('<!doctype html><html><head></head><body>SPA fallback</body></html>', {
          status: 200,
          headers: { 'Content-Type': 'text/html' },
        })
      )
      .mockResolvedValueOnce(
        new Response('# Local Uppercase Markdown', {
          status: 200,
          headers: { 'Content-Type': 'text/plain' },
        })
      );

    const content = await useContentStore
      .getState()
      .fetchLessonContent('zh', 'GetStartedWithBitcoin/03_BitcoinTx');

    expect(content).toBe('# Local Uppercase Markdown');
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      '/Get-Started-with-Web3/content/zh/GetStartedWithBitcoin/03_BitcoinTx/README.MD'
    );
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
