import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { Search, X } from 'lucide-react';
import { useSearchStore } from '../store/useSearchStore';
import { COURSE_DATA } from '../config/courseData';

const SearchDialog = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const { isSearchOpen, searchQuery, closeSearch, setSearchQuery, addToHistory } = useSearchStore();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Build Fuse.js index once
  const fuse = useMemo(() => {
    const items = COURSE_DATA.flatMap((module) =>
      module.lessons.map((lesson) => ({
        moduleId: module.id,
        moduleTitle: module.title,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
      }))
    );
    return new Fuse(items, {
      keys: ['lessonTitle'],
      threshold: 0.4,
      includeMatches: true,
    });
  }, []);

  // Fuzzy search results
  const flatResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return fuse.search(searchQuery).map((result) => result.item);
  }, [searchQuery, fuse]);

  // Group results by module
  const grouped = useMemo(
    () =>
      flatResults.reduce((acc, item) => {
        if (!acc[item.moduleTitle]) acc[item.moduleTitle] = [];
        acc[item.moduleTitle].push(item);
        return acc;
      }, {}),
    [flatResults]
  );

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [flatResults]);

  const handleSelect = useCallback(
    (item) => {
      addToHistory(searchQuery);
      closeSearch();
      navigate(`/learn/${item.moduleId}/${item.lessonId}`);
    },
    [searchQuery, addToHistory, closeSearch, navigate]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        closeSearch();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (flatResults.length > 0 ? (prev + 1) % flatResults.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          flatResults.length > 0 ? (prev === 0 ? flatResults.length - 1 : prev - 1) : 0
        );
      } else if (e.key === 'Enter' && flatResults.length > 0) {
        e.preventDefault();
        handleSelect(flatResults[selectedIndex]);
      }
    },
    [closeSearch, flatResults, selectedIndex, handleSelect]
  );

  // Auto-focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  let globalIndex = 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[15vh]"
      onClick={closeSearch}
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="搜索课程"
        className="relative w-full max-w-lg mx-4 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="搜索课程..."
            aria-label="搜索课程"
            className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-base"
          />
          <button
            onClick={closeSearch}
            aria-label="关闭搜索"
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto" role="listbox">
          {searchQuery.trim() && flatResults.length === 0 && (
            <div className="px-4 py-8 text-center text-slate-500">没有找到匹配的课程</div>
          )}

          {Object.entries(grouped).map(([moduleTitle, items]) => (
            <div key={moduleTitle}>
              <div className="px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider bg-slate-800/50">
                {moduleTitle}
              </div>
              {items.map((item) => {
                const idx = globalIndex++;
                return (
                  <button
                    key={item.lessonId}
                    role="option"
                    aria-selected={idx === selectedIndex}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full px-4 py-3 text-left transition-colors ${
                      idx === selectedIndex
                        ? 'bg-cyan-500/10 text-cyan-400'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {item.lessonTitle}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-slate-700 flex gap-4 text-xs text-slate-500">
          <span>↑↓ 导航</span>
          <span>↵ 选择</span>
          <span>Esc 关闭</span>
        </div>
      </div>
    </div>
  );
};

export default SearchDialog;
