import { create } from 'zustand';

/**
 * 内容管理状态
 * 管理课程内容加载、缓存、当前学习状态等
 */
export const useContentStore = create((set, get) => ({
  // 当前选中的模块和课程
  activeModule: null,
  activeLesson: null,

  // 课程内容缓存 { lessonId: { content, images, metadata } }
  contentCache: {},

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

  // Actions - 内容加载
  fetchLessonContent: async (lessonPath) => {
    const { contentCache } = get();

    // 检查缓存
    if (contentCache[lessonPath]) {
      return contentCache[lessonPath].content;
    }

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

      // 缓存内容
      const cachedData = {
        content,
        timestamp: Date.now(),
      };

      set({
        contentCache: {
          ...get().contentCache,
          [lessonPath]: cachedData,
        },
        contentLoading: false,
      });

      return content;
    } catch (error) {
      set({
        fetchError: error.message,
        contentLoading: false,
      });
      throw error;
    }
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
