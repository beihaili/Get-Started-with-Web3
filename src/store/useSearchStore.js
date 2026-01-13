import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 搜索状态管理
 * 管理搜索查询、结果、历史记录等
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
      openSearch: () =>
        set({
          isSearchOpen: true,
        }),

      closeSearch: () =>
        set({
          isSearchOpen: false,
          searchQuery: '',
          searchResults: [],
          selectedResultIndex: 0,
        }),

      toggleSearch: () =>
        set((state) => ({
          isSearchOpen: !state.isSearchOpen,
        })),

      // Actions - 搜索查询
      setSearchQuery: (query) =>
        set({
          searchQuery: query,
          selectedResultIndex: 0,
        }),

      setSearchResults: (results) =>
        set({
          searchResults: results,
          selectedResultIndex: 0,
        }),

      clearSearch: () =>
        set({
          searchQuery: '',
          searchResults: [],
          selectedResultIndex: 0,
        }),

      // Actions - 键盘导航
      selectNextResult: () => {
        const { selectedResultIndex, searchResults } = get();
        if (searchResults.length > 0) {
          set({
            selectedResultIndex: (selectedResultIndex + 1) % searchResults.length,
          });
        }
      },

      selectPreviousResult: () => {
        const { selectedResultIndex, searchResults } = get();
        if (searchResults.length > 0) {
          set({
            selectedResultIndex:
              selectedResultIndex === 0 ? searchResults.length - 1 : selectedResultIndex - 1,
          });
        }
      },

      setSelectedResultIndex: (index) =>
        set({
          selectedResultIndex: index,
        }),

      // Actions - 搜索历史
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

      clearHistory: () =>
        set({
          searchHistory: [],
        }),

      removeFromHistory: (query) => {
        const { searchHistory } = get();
        set({
          searchHistory: searchHistory.filter((q) => q !== query),
        });
      },

      // 获取当前选中的结果
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
