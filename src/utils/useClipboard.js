import { useEffect, useRef, useState } from 'react';

/**
 * Copies text to the clipboard and tracks which value was most recently copied.
 *
 * Falls back to a hidden `<textarea>` + `execCommand('copy')` for older browsers
 * or insecure (non-HTTPS) contexts where the async Clipboard API is unavailable.
 *
 * @param {number} resetMs - How long (ms) to keep `copied` set before clearing.
 * @returns {{ copied: string|null, copy: (text: string) => Promise<void> }}
 */
export function useClipboard(resetMs = 2000) {
  const [copied, setCopied] = useState(null);
  const resetTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      // Keep the element off-screen so it doesn't flash during fallback copy.
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.setAttribute('readonly', '');
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(text);

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = setTimeout(() => {
      setCopied((current) => (current === text ? null : current));
      resetTimerRef.current = null;
    }, resetMs);
  };

  return { copied, copy };
}
