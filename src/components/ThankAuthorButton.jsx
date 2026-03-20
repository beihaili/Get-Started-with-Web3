import { Heart } from 'lucide-react';
import { DONATION_LINKS } from '../config/sponsorData';

/**
 * 感谢作者按钮
 * 显示在每节课底部，引导读者打赏/支持作者
 */
const ThankAuthorButton = () => {
  // 优先使用 Buy Me a Coffee 链接
  const primaryLink = DONATION_LINKS.find((l) => l.name === 'Buy Me a Coffee') || DONATION_LINKS[0];

  if (!primaryLink) return null;

  return (
    <div className="mt-8 pt-8 border-t border-slate-700 flex flex-col items-center gap-3">
      <p className="text-slate-400 text-sm">如果这节课对你有帮助，欢迎支持作者继续创作 ☕</p>
      <a
        href={primaryLink.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500
          hover:from-pink-400 hover:to-orange-400 text-white font-semibold rounded-full
          transition-all hover:scale-105 shadow-lg shadow-pink-500/20"
      >
        <Heart className="w-4 h-4" />
        感谢作者 · Buy Me a Coffee
      </a>
    </div>
  );
};

export default ThankAuthorButton;
