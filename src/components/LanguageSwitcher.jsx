import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Globe } from 'lucide-react';

/**
 * Compact language selector.
 * Switches between zh and en by replacing the :lang segment in the URL.
 */
export default function LanguageSwitcher() {
  const { lang } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const switchLang = (newLang) => {
    if (newLang === lang) return;
    // Use regex to handle both /en/... and /en (no trailing path)
    const newPath = location.pathname.replace(new RegExp(`^/${lang}(?=/|$)`), `/${newLang}`);
    navigate(newPath);
  };

  const languageOptions = [
    { code: 'en', label: 'EN', ariaLabel: 'English' },
    { code: 'zh', label: '\u4e2d\u6587', ariaLabel: '\u4e2d\u6587' },
  ];

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center gap-1 rounded-lg border border-slate-700/70 bg-slate-900/40 p-1 text-sm text-slate-400"
    >
      <Globe className="h-4 w-4" />
      {languageOptions.map((option) => {
        const isActive = lang === option.code;

        return (
          <button
            key={option.code}
            type="button"
            onClick={() => switchLang(option.code)}
            aria-label={option.ariaLabel}
            aria-pressed={isActive}
            className={`rounded-md px-2 py-0.5 transition-colors ${
              isActive
                ? 'bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-400/30'
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
