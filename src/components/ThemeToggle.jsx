import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

/**
 * 暗色/亮色模式切换按钮
 */
const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 dark:hover:bg-slate-800/50 transition-colors"
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

export default ThemeToggle;
