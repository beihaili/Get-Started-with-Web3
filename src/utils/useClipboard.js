import { useState, useCallback } from 'react';

/**
 * useClipboard 鈥?Copy text to the clipboard with fallback for older browsers.
 *
 * @returns {{
 *   copied: boolean,
 *   copy: (text: string) => Promise<void>
 * }}
 *
 * @example
 * const { copied, copy } = useClipboard();
 * await copy('\''hello world'\'');
 */
export const useClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text) => {
    try {
      if (navigator.clipboard?.writeText) {
        // Modern browsers (Chrome, Firefox, Safari, Edge)
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback: older browsers via execCommand
        const textarea = document.createElement('\''textarea'\'');
        textarea.value = text;
        textarea.style.position = '\''fixed'\'';
        textarea.style.left = '\''-9999px'\'';
        textarea.style.top = '\''-9999px'\'';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const success = document.execCommand('\''copy'\'');
        document.body.removeChild(textarea);
        if (!success) throw new Error('\''execCommand copy failed'\'');
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('\''[useClipboard] Copy failed:'\'', err);
      setCopied(false);
    }
  }, []);

  return { copied, copy };
};

export default useClipboard;