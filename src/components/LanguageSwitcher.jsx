import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Globe } from 'lucide-react';

/**
 * Language toggle button.
 * Switches between zh and en by replacing the :lang segment in the URL.
 */
export default function LanguageSwitcher() {
  const { lang } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleLang = () => {
    const newLang = lang === 'zh' ? 'en' : 'zh';
    // Use regex to handle both /en/... and /en (no trailing path)
    const newPath = location.pathname.replace(new RegExp(`^/${lang}(?=/|$)`), `/${newLang}`);
    navigate(newPath);
  };

  return (
    <button
      onClick={toggleLang}
      aria-label={lang === 'zh' ? 'Switch to English' : '切换中文'}
      className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
      title={lang === 'zh' ? 'Switch to English' : '切换中文'}>
      <Globe className="h-4 w-4" />
      <span>{lang === 'zh' ? 'EN' : '\u4e2d\u6587'}</span>
    </button>
  );
}
