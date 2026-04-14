import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Application-wide state store.
 * Manages Gemini API credentials and UI state (badges, confetti).
 *
 * @module useAppStore
 * @see {@link https://zustand.docs.pmnd.rs} for Zustand documentation
 */
export const useAppStore = create(
  persist(
    /**
     * @typedef {Object} AppState
     * @property {string} geminiApiKey - User's Gemini API key (stored encrypted in localStorage)
     * @property {boolean} apiKeySet - Whether a Gemini API key has been configured
     * @property {Object|null} pendingBadgeUnlock - Badge awaiting user acknowledgment (null if none pending)
     * @property {boolean} showConfetti - Whether to display the confetti animation overlay
     */
    (set) => ({
      /**
       * Gemini API key for AI-powered features.
       * @type {string}
       */
      geminiApiKey: '',
      /**
       * Whether a Gemini API key has been set.
       * @type {boolean}
       */
      apiKeySet: false,

      /**
       * Badge object awaiting user acknowledgment in the UI.
       * Set by the system when a badge is earned; cleared when the user dismisses the toast.
       * @type {Object|null}
       */
      pendingBadgeUnlock: null,
      /**
       * Whether the confetti animation is currently active.
       * @type {boolean}
       */
      showConfetti: false,

      /**
       * Sets the Gemini API key and updates the apiKeySet flag.
       * @param {string} key - The Gemini API key to store
       * @returns {void}
       */
      setGeminiApiKey: (key) =>
        set({
          geminiApiKey: key,
          apiKeySet: !!key,
        }),

      /**
       * Clears the stored Gemini API key and resets the apiKeySet flag.
       * @returns {void}
       */
      clearGeminiApiKey: () =>
        set({
          geminiApiKey: '',
          apiKeySet: false,
        }),

      /**
       * Sets the badge object to display in the unlock toast.
       * @param {Object|null} badge - The badge to show, or null to dismiss
       * @returns {void}
       */
      setPendingBadgeUnlock: (badge) =>
        set({
          pendingBadgeUnlock: badge,
        }),

      /**
       * Triggers the full-screen confetti animation.
       * Automatically clears itself after 4 seconds.
       * @returns {void}
       */
      triggerConfetti: () => {
        set({ showConfetti: true });
        setTimeout(() => set({ showConfetti: false }), 4000);
      },
    }),
    { name: 'web3-app-store' }
  )
);
