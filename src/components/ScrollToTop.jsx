import { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * Back to top floating button.
 * Shows after user scrolls past one viewport; smooth-scrolls back to top on click.
 * Keyboard accessible, dark-mode aware.
 */
const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        setVisible(window.scrollY > window.innerHeight);
        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg transition-all
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2
                 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:text-white dark:shadow-cyan-900/30"
    >
      <ArrowUp className="w-5 h-5" aria-hidden="true" />
    </button>
  );
};

export default ScrollToTop;
