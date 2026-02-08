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

      // Gas价格模拟（用于教学）
      gasPrice: 20,

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

      updateGasPrice: () => {
        // 模拟Gas价格波动 (15-30 gwei)
        const newPrice = Math.floor(Math.random() * 15) + 15;
        set({ gasPrice: newPrice });
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
