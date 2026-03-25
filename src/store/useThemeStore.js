import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 主题状态管理
 * 持久化到 localStorage，支持 dark/light 切换
 */
export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'dark',

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),

      setTheme: (theme) => set({ theme }),

      isDark: () => get().theme === 'dark',
    }),
    {
      name: 'web3-theme-store',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
