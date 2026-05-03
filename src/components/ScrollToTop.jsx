import { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * 回到顶部按钮，滚动超过一屏后显示
 */
const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const frameRef = useRef(null);

  useEffect(() => {
    const updateVisibility = () => {
      frameRef.current = null;
      setVisible(window.scrollY > window.innerHeight);
    };
    const onScroll = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};

export default ScrollToTop;
