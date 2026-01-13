import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 应用全局状态管理
 * 管理视图状态、UI配置、Gemini API等应用级别的状态
 */
export const useAppStore = create(
  persist(
    (set) => ({
      // Gemini API配置
      geminiApiKey: '',
      apiKeySet: false,

      // UI状态
      showApiSettings: false,
      showBadgeCollection: false,
      pendingBadgeUnlock: null,
      showConfetti: false,

      // 动画和效果
      particlesEnabled: true,
      soundEnabled: true,

      // Gas价格模拟（用于教学）
      gasPrice: 20,

      // Star提示状态
      starPromptDismissed: false,

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
      toggleApiSettings: () =>
        set((state) => ({
          showApiSettings: !state.showApiSettings,
        })),

      setShowApiSettings: (show) =>
        set({
          showApiSettings: show,
        }),

      toggleBadgeCollection: () =>
        set((state) => ({
          showBadgeCollection: !state.showBadgeCollection,
        })),

      setShowBadgeCollection: (show) =>
        set({
          showBadgeCollection: show,
        }),

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

      // Actions - 偏好设置
      toggleParticles: () =>
        set((state) => ({
          particlesEnabled: !state.particlesEnabled,
        })),

      toggleSound: () =>
        set((state) => ({
          soundEnabled: !state.soundEnabled,
        })),

      updateGasPrice: () => {
        // 模拟Gas价格波动 (15-30 gwei)
        const newPrice = Math.floor(Math.random() * 15) + 15;
        set({ gasPrice: newPrice });
      },

      // Actions - Star提示
      dismissStarPrompt: () =>
        set({
          starPromptDismissed: true,
        }),

      // 重置所有UI状态
      resetUIState: () =>
        set({
          showApiSettings: false,
          showBadgeCollection: false,
          pendingBadgeUnlock: null,
          showConfetti: false,
        }),
    }),
    {
      name: 'web3-app-store', // localStorage key
      partialize: (state) => ({
        geminiApiKey: state.geminiApiKey,
        apiKeySet: state.apiKeySet,
        particlesEnabled: state.particlesEnabled,
        soundEnabled: state.soundEnabled,
        starPromptDismissed: state.starPromptDismissed,
      }),
    }
  )
);
