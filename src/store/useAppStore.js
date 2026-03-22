import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * @module useAppStore
 * @description Global application state management.
 * Controls API configuration for Gemini and general UI states.
 */

/**
 * @typedef {Object} AppState
 * @property {string} geminiApiKey - User provided API key for Gemini.
 * @property {boolean} apiKeySet - Whether the API key has been configured.
 * @property {Object|null} pendingBadgeUnlock - Badge that has been earned but not yet acknowledged.
 * @property {boolean} showConfetti - Controls the visibility of celebration confetti.
 * @property {function(string): void} setGeminiApiKey - Set and persist the Gemini API key.
 * @property {function(): void} clearGeminiApiKey - Remove the Gemini API key.
 * @property {function(Object): void} setPendingBadgeUnlock - Queue a badge to be shown in the unlock modal.
 * @property {function(): void} triggerConfetti - Trigger celebration confetti for 5 seconds.
 */

/**
 * @type {import('zustand').UseBoundStore<import('zustand').StoreApi<AppState>>}
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
      /**
       * @param {string} key - The Gemini API key.
       */
      setGeminiApiKey: (key) =>
        set({
          geminiApiKey: key,
          apiKeySet: !!key,
        }),

      /**
       * Clears the stored Gemini API key.
       */
      clearGeminiApiKey: () =>
        set({
          geminiApiKey: '',
          apiKeySet: false,
        }),

      // Actions - UI控制
      /**
       * @param {Object} badge - The badge data for the pending unlock.
       */
      setPendingBadgeUnlock: (badge) =>
        set({
          pendingBadgeUnlock: badge,
        }),

      /**
       * Triggers celebration confetti on screen for a limited duration.
       */
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
