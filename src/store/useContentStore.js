import { create } from 'zustand';

/**
 * @module useContentStore
 * @description Content management state store.
 * Handles loading, caching, and navigation of course content.
 */

/**
 * @typedef {Object} ContentCacheEntry
 * @property {string} content - The markdown content of the lesson.
 * @property {number} timestamp - The time when the content was cached.
 */

/**
 * @typedef {Object} ContentState
 * @property {string|null} activeModule - Currently selected module ID.
 * @property {string|null} activeLesson - Currently selected lesson ID.
 * @property {Object.<string, ContentCacheEntry>} contentCache - Cache of lesson content.
 * @property {Object.<string, Promise<string>>} pendingFetches - Currently active fetch requests.
 * @property {boolean} contentLoading - Loading state for content fetching.
 * @property {string|null} fetchError - Error message if content fetching fails.
 * @property {string} basePath - Base path configuration for the app.
 * @property {function(string): void} setActiveModule - Set the currently active module.
 * @property {function(string, string): void} setActiveLesson - Set the currently active lesson.
 * @property {function(): void} clearActiveLesson - Clear the currently active lesson.
 * @property {function(string, string): Promise<string>} fetchLessonContent - Fetch lesson content with caching and deduplication.
 * @property {function(): void} clearCache - Clear the entire content cache.
 * @property {function(string): ContentCacheEntry} getCachedContent - Get content from cache.
 * @property {function(string): void} removeCachedContent - Remove specific content from cache.
 * @property {function(): number} getCacheSize - Get the number of entries in the cache.
 * @property {function(): void} cleanOldCache - Remove cache entries older than 7 days.
 */

const MAX_CACHE_ENTRIES = 50;

/**
 * @type {import('zustand').UseBoundStore<import('zustand').StoreApi<ContentState>>}
 */
export const useContentStore = create((set, get) => ({
  // 当前选中的模块和课程
  activeModule: null,
  activeLesson: null,

  // 课程内容缓存 { cacheKey: { content, timestamp } }
  contentCache: {},

  // 正在进行的请求 { cacheKey: Promise }
  pendingFetches: {},

  // 加载状态
  contentLoading: false,
  fetchError: null,

  // 基础路径配置
  basePath: '/Get-Started-with-Web3/',

  // Actions - 导航
  /**
   * @param {string} moduleId - The module ID to set as active.
   */
  setActiveModule: (moduleId) =>
    set({
      activeModule: moduleId,
    }),

  /**
   * @param {string} moduleId - The module ID.
   * @param {string} lessonId - The lesson ID to set as active.
   */
  setActiveLesson: (moduleId, lessonId) =>
    set({
      activeModule: moduleId,
      activeLesson: lessonId,
    }),

  /**
   * Clears the currently active lesson.
   */
  clearActiveLesson: () =>
    set({
      activeLesson: null,
    }),

  // Actions - 内容加载（带去重和缓存上限）
  /**
   * Fetches lesson content with deduplication and cache management.
   * @param {string} lang - Language prefix (e.g., 'en', 'zh').
   * @param {string} lessonPath - Path to the lesson content.
   * @returns {Promise<string>} The fetched markdown content.
   */
  fetchLessonContent: async (lang, lessonPath) => {
    const cacheKey = `${lang}/${lessonPath}`;
    const { contentCache, pendingFetches } = get();

    // 检查缓存
    if (contentCache[cacheKey]) {
      return contentCache[cacheKey].content;
    }

    // 去重：如果同一路径已经在请求中，等待现有请求
    if (pendingFetches[cacheKey]) {
      return pendingFetches[cacheKey];
    }

    const fetchPromise = (async () => {
      set({ contentLoading: true, fetchError: null });

      try {
        // 尝试从本地public目录加载
        const localUrl = `${get().basePath}content/${lang}/${lessonPath}/README.md`;
        let response = await fetch(localUrl);

        // 如果本地加载失败，尝试从GitHub Raw加载
        if (!response.ok) {
          const githubUrl = `https://raw.githubusercontent.com/beihaili/Get-Started-with-Web3/main/${lang}/${lessonPath}/README.md`;
          response = await fetch(githubUrl);
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch content: ${response.status}`);
        }

        const content = await response.text();

        // 缓存内容（带上限淘汰）
        const currentCache = { ...get().contentCache };
        const keys = Object.keys(currentCache);
        if (keys.length >= MAX_CACHE_ENTRIES) {
          // 删除最旧的条目
          const oldest = keys.reduce((a, b) =>
            currentCache[a].timestamp < currentCache[b].timestamp ? a : b
          );
          delete currentCache[oldest];
        }

        currentCache[cacheKey] = { content, timestamp: Date.now() };

        set({
          contentCache: currentCache,
          contentLoading: false,
        });

        return content;
      } catch (error) {
        set({
          fetchError: error.message,
          contentLoading: false,
        });
        throw error;
      } finally {
        // 清理 pending
        const pending = { ...get().pendingFetches };
        delete pending[cacheKey];
        set({ pendingFetches: pending });
      }
    })();

    // 注册 pending
    set({
      pendingFetches: { ...get().pendingFetches, [cacheKey]: fetchPromise },
    });

    return fetchPromise;
  },

  // Actions - 缓存管理
  /**
   * Clears the entire content cache.
   */
  clearCache: () =>
    set({
      contentCache: {},
    }),

  /**
   * @param {string} lessonPath - Path to the lesson content.
   * @returns {ContentCacheEntry|undefined} The cached content entry.
   */
  getCachedContent: (lessonPath) => {
    const { contentCache } = get();
    return contentCache[lessonPath];
  },

  /**
   * @param {string} lessonPath - Path to the lesson content.
   */
  removeCachedContent: (lessonPath) => {
    const { contentCache } = get();
    const newCache = { ...contentCache };
    delete newCache[lessonPath];
    set({ contentCache: newCache });
  },

  /**
   * @returns {number} The number of items in the cache.
   */
  getCacheSize: () => {
    const { contentCache } = get();
    return Object.keys(contentCache).length;
  },

  /**
   * Cleans cache entries older than 7 days.
   */
  cleanOldCache: () => {
    const { contentCache } = get();
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    const newCache = Object.entries(contentCache).reduce((acc, [key, value]) => {
      if (now - value.timestamp < sevenDays) {
        acc[key] = value;
      }
      return acc;
    }, {});

    set({ contentCache: newCache });
  },
}));
