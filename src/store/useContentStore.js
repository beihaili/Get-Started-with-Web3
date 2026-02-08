import { create } from 'zustand';

/**
 * 内容管理状态
 * 管理课程内容加载、缓存、当前学习状态等
 */
const MAX_CACHE_ENTRIES = 50;

export const useContentStore = create((set, get) => ({
  // 当前选中的模块和课程
  activeModule: null,
  activeLesson: null,

  // 课程内容缓存 { lessonId: { content, images, metadata } }
  contentCache: {},

  // 正在进行的请求 { path: Promise }
  pendingFetches: {},

  // 加载状态
  contentLoading: false,
  fetchError: null,

  // 基础路径配置
  basePath: '/Get-Started-with-Web3/',

  // Actions - 导航
  setActiveModule: (moduleId) =>
    set({
      activeModule: moduleId,
    }),

  setActiveLesson: (moduleId, lessonId) =>
    set({
      activeModule: moduleId,
      activeLesson: lessonId,
    }),

  clearActiveLesson: () =>
    set({
      activeLesson: null,
    }),

  // Actions - 内容加载（带去重和缓存上限）
  fetchLessonContent: async (lessonPath) => {
    const { contentCache, pendingFetches } = get();

    // 检查缓存
    if (contentCache[lessonPath]) {
      return contentCache[lessonPath].content;
    }

    // 去重：如果同一路径已经在请求中，等待现有请求
    if (pendingFetches[lessonPath]) {
      return pendingFetches[lessonPath];
    }

    const fetchPromise = (async () => {
      set({ contentLoading: true, fetchError: null });

      try {
        // 尝试从本地public目录加载
        const localUrl = `${get().basePath}content/${lessonPath}/README.md`;
        let response = await fetch(localUrl);

        // 如果本地加载失败，尝试从GitHub Raw加载
        if (!response.ok) {
          const githubUrl = `https://raw.githubusercontent.com/beihaili/Get-Started-with-Web3/main/${lessonPath}/README.md`;
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

        currentCache[lessonPath] = { content, timestamp: Date.now() };

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
        delete pending[lessonPath];
        set({ pendingFetches: pending });
      }
    })();

    // 注册 pending
    set({
      pendingFetches: { ...get().pendingFetches, [lessonPath]: fetchPromise },
    });

    return fetchPromise;
  },

  // Actions - 缓存管理
  clearCache: () =>
    set({
      contentCache: {},
    }),

  getCachedContent: (lessonPath) => {
    const { contentCache } = get();
    return contentCache[lessonPath];
  },

  removeCachedContent: (lessonPath) => {
    const { contentCache } = get();
    const newCache = { ...contentCache };
    delete newCache[lessonPath];
    set({ contentCache: newCache });
  },

  // 获取缓存大小（条目数）
  getCacheSize: () => {
    const { contentCache } = get();
    return Object.keys(contentCache).length;
  },

  // 清理旧缓存（超过7天）
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
