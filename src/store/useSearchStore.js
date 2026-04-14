import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Search state management store.
 * Manages the search dialog UI, query state, results, and search history.
 *
 * @module useSearchStore
 */
export const useSearchStore = create(
  persist(
    /**
     * @typedef {Object} SearchState
     * @property {boolean} isSearchOpen - Whether the search dialog is currently open
     * @property {string} searchQuery - The current search query string
     * @property {Array} searchResults - Array of matching lesson/module results
     * @property {Array} searchHistory - Array of recent search queries (max 5)
     * @property {number} selectedResultIndex - Keyboard-selected result index in the results list
     */
    (set, get) => ({
      /**
       * Whether the search dialog is currently displayed.
       * @type {boolean}
       */
      isSearchOpen: false,
      /**
       * Current search query string.
       * @type {string}
       */
      searchQuery: '',
      /**
       * Search results matching the current query.
       * @type {Array}
       */
      searchResults: [],

      /**
       * Recent search history (capped at 5 entries).
       * Persisted across sessions via localStorage.
       * @type {string[]}
       */
      searchHistory: [],

      /**
       * Index of the currently keyboard-selected result.
       * Used for Arrow Up/Down navigation within the results list.
       * @type {number}
       */
      selectedResultIndex: 0,

      /**
       * Opens the search dialog and focuses the input.
       * @returns {void}
       */
      openSearch: () =>
        set({
          isSearchOpen: true,
        }),

      /**
       * Closes the search dialog and resets query, results, and selection.
       * @returns {void}
       */
      closeSearch: () =>
        set({
          isSearchOpen: false,
          searchQuery: '',
          searchResults: [],
          selectedResultIndex: 0,
        }),

      /**
       * Toggles the search dialog open/closed state.
       * @returns {void}
       */
      toggleSearch: () =>
        set((state) => ({
          isSearchOpen: !state.isSearchOpen,
        })),

      /**
       * Updates the search query and clears the previous results.
       * Call performSearch() after this to populate searchResults.
       * @param {string} query - The new search query
       * @returns {void}
       */
      setSearchQuery: (query) =>
        set({
          searchQuery: query,
          searchResults: [],
          selectedResultIndex: 0,
        }),

      /**
       * Sets the search results array and resets the selection index.
       * @param {Array} results - Array of matching result objects
       * @returns {void}
       */
      setSearchResults: (results) =>
        set({
          searchResults: results,
          selectedResultIndex: 0,
        }),

      /**
       * Adds the current query to search history.
       * Deduplicates and caps history at 5 entries.
       * @returns {void}
       */
      addToHistory: () => {
        const { searchQuery, searchHistory } = get();
        if (!searchQuery.trim()) return;
        const next = [searchQuery, ...searchHistory.filter((q) => q !== searchQuery)].slice(0, 5);
        set({ searchHistory: next });
      },

      /**
       * Clears all search history.
       * @returns {void}
       */
      clearHistory: () => set({ searchHistory: [] }),

      /**
       * Moves the selected result index up or down.
       * Wraps around at the boundaries.
       * @param {number} direction - +1 to move down, -1 to move up
       * @returns {void}
       */
      moveSelection: (direction) =>
        set((state) => {
          const max = state.searchResults.length - 1;
          const next = state.selectedResultIndex + direction;
          return { selectedResultIndex: next < 0 ? max : next > max ? 0 : next };
        }),
    }),
    { name: 'web3-search-store', partialize: (s) => ({ searchHistory: s.searchHistory }) }
  )
);
