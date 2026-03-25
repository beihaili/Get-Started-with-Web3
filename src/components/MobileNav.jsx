import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

/**
 * 移动端汉堡菜单导航
 * items: [{ label, to, icon? }] — 导航链接列表
 * extra: 额外的按钮组件（如搜索按钮）
 */
const MobileNav = ({ items = [], extra = null }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="sm:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400"
      >
        <Menu className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 sm:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 p-6">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute top-4 right-4 text-slate-500 dark:text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <nav className="mt-8 space-y-4">
              {items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}

              {extra && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">{extra}</div>
              )}

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;
