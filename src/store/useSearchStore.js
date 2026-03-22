import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * @module useSearchStore
 * @description Search functionality and history management.
 * Tracks search state, results, and user search history.
 */

/**
 * @typedef {Object} SearchState
 * @property {boolean} isSearchOpen - Whether the search overlay is active.
 * @property {string} searchQuery - The current user-provided query.
 * @property {Object[]} searchResults - Search results from current query.
 * @property {string[]} searchHistory - Previously searched queries.
 * @property {number} selectedResultIndex - Current highlighted index for keyboard navigation.
 * @property {function(): void} openSearch - Open the search UI.
 * @property {function(): void} closeSearch - Close the search UI and reset query/results.
 * @property {function(): void} toggleSearch - Toggle search UI visibility.
 * @property {function(string): void} setSearchQuery - Update search query.
 * @property {function(Object[]): void} setSearchResults - Update search results.
 * @property {function(): void} clearSearch - Reset search query and results.
 * @property {function(): void} selectNextResult - Highlight the next search result.
 * @property {function(): void} selectPreviousResult - Highlight the previous search result.
 * @property {function(number): void} setSelectedResultIndex - Directly set the highlighted index.
 * @property {function(string): void} addToHistory - Add a query to the search history.
 * @property {function(): void} clearHistory - Clear all search history.
 * @property {function(string): void} removeFromHistory - Remove a specific item from history.
 * @property {function(): Object} getSelectedResult - Get currently highlighted search result.
 */

/**
 * @type {import('zustand').UseBoundStore<import('zustand').StoreApi<SearchState>>}
 */
export const useSearchStore = create(
  persist(
    (set, get) => ({
      // 搜索状态
      isSearchOpen: false,
      searchQuery: '',
      searchResults: [],

      // 搜索历史（最多保存5条）
      searchHistory: [],

      // 选中的结果索引（用于键盘导航）
      selectedResultIndex: 0,

      // Actions - 搜索UI控制
      /**
       * Opens the search overlay.
       */
      openSearch: () =>
        set({
          isSearchOpen: true,
        }),

      /**
       * Closes the search overlay and clears input state.
       */
      closeSearch: () =>
        set({
          isSearchOpen: false,
          searchQuery: '',
          searchResults: [],
          selectedResultIndex: 0,
        }),

      /**
       * Toggles search overlay visibility.
       */
      toggleSearch: () =>
        set((state) => ({
          isSearchOpen: !state.isSearchOpen,
        })),

      // Actions - 搜索查询
      /**
       * @param {string} query - The search query to set.
       */
      setSearchQuery: (query) =>
        set({
          searchQuery: query,
          selectedResultIndex: 0,
        }),

      /**
       * @param {Object[]} results - The search results list.
       */
      setSearchResults: (results) =>
        set({
          searchResults: results,
          selectedResultIndex: 0,
        }),

      /**
       * Resets search query and current results.
       */
      clearSearch: () =>
        set({
          searchQuery: '',
          searchResults: [],
          selectedResultIndex: 0,
        }),

      // Actions - 键盘导航
      /**
       * Highlighting next search result with circular wrap.
       */
      selectNextResult: () => {
        const { selectedResultIndex, searchResults } = get();
        if (searchResults.length > 0) {
          set({
            selectedResultIndex: (selectedResultIndex + 1) % searchResults.length,
          });
        }
      },

      /**
       * Highlighting previous search result with circular wrap.
       */
      selectPreviousResult: () => {
        const { selectedResultIndex, searchResults } = get();
        if (searchResults.length > 0) {
          set({
            selectedResultIndex:
              selectedResultIndex === 0 ? searchResults.length - 1 : selectedResultIndex - 1,
          });
        }
      },

      /**
       * @param {number} index - Index of the result to highlight.
       */
      setSelectedResultIndex: (index) =>
        set({
          selectedResultIndex: index,
        }),

      // Actions - 搜索历史
      /**
       * Adds a query to search history, ensuring deduplication and max capacity.
       * @param {string} query - Query to add.
       */
      addToHistory: (query) => {
        if (!query.trim()) return;

        const { searchHistory } = get();

        // 移除重复项
        const newHistory = [query, ...searchHistory.filter((q) => q !== query)];

        // 只保留最近5条
        set({
          searchHistory: newHistory.slice(0, 5),
        });
      },

      /**
       * Clears all items from search history.
       */
      clearHistory: () =>
        set({
          searchHistory: [],
        }),

      /**
       * @param {string} query - Query item to remove.
       */
      removeFromHistory: (query) => {
        const { searchHistory } = get();
        set({
          searchHistory: searchHistory.filter((q) => q !== query),
        });
      },

      // 获取当前选中的结果
      /**
       * @returns {Object} Currently highlighted search result.
       */
      getSelectedResult: () => {
        const { searchResults, selectedResultIndex } = get();
        return searchResults[selectedResultIndex];
      },
    }),
    {
      name: 'web3-search-store', // localStorage key
      partialize: (state) => ({
        searchHistory: state.searchHistory,
      }),
    }
  )
);
