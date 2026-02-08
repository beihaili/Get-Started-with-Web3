import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 应用全局状态管理
 * 管理Gemini API配置、UI状态等
 */
export const useAppStore = create(
  persist(
    (set) => ({
      // Gemini API配置
      geminiApiKey: '',
      apiKeySet: false,

      // UI状态
      pendingBadgeUnlock: null,
      showConfetti: false,

      // Actions - API配置
      setGeminiApiKey: (key) =>
        set({
          geminiApiKey: key,
          apiKeySet: !!key,
        }),

      clearGeminiApiKey: () =>
        set({
          geminiApiKey: '',
          apiKeySet: false,
        }),

      // Actions - UI控制
      setPendingBadgeUnlock: (badge) =>
        set({
          pendingBadgeUnlock: badge,
        }),

      triggerConfetti: () => {
        set({ showConfetti: true });
        setTimeout(() => {
          set({ showConfetti: false });
        }, 5000);
      },
    }),
    {
      name: 'web3-app-store', // localStorage key
      partialize: (state) => ({
        geminiApiKey: state.geminiApiKey,
        apiKeySet: state.apiKeySet,
      }),
    }
  )
);
