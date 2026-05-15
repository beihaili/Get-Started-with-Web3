import { useCallback, useRef } from 'react';

const DEFAULT_IGNORE_SELECTOR = 'pre, code, [data-swipe-ignore]';

function getTouchPoint(event) {
  return event.touches?.[0] || event.changedTouches?.[0] || null;
}

function shouldIgnoreSwipe(target, ignoreSelector) {
  return Boolean(target?.closest?.(ignoreSelector));
}

/**
 * Detects deliberate horizontal touch swipes while preserving vertical scroll
 * and code-block horizontal scrolling.
 */
export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  threshold = 80,
  ignoreSelector = DEFAULT_IGNORE_SELECTOR,
} = {}) {
  const gestureRef = useRef(null);

  const onTouchStart = useCallback(
    (event) => {
      const touch = getTouchPoint(event);
      if (!touch || shouldIgnoreSwipe(event.target, ignoreSelector)) {
        gestureRef.current = null;
        return;
      }

      gestureRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        endX: touch.clientX,
        endY: touch.clientY,
        moved: false,
      };
    },
    [ignoreSelector]
  );

  const onTouchMove = useCallback((event) => {
    const touch = getTouchPoint(event);
    if (!touch || !gestureRef.current) {
      return;
    }

    gestureRef.current.endX = touch.clientX;
    gestureRef.current.endY = touch.clientY;
    gestureRef.current.moved = true;
  }, []);

  const onTouchEnd = useCallback(
    (event) => {
      if (!gestureRef.current) {
        return;
      }

      const touch = getTouchPoint(event);
      if (touch && !gestureRef.current.moved) {
        gestureRef.current.endX = touch.clientX;
        gestureRef.current.endY = touch.clientY;
      }

      const { startX, startY, endX, endY } = gestureRef.current;
      gestureRef.current = null;

      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX < threshold || absY > absX) {
        return;
      }

      if (deltaX < 0) {
        onSwipeLeft?.();
      } else {
        onSwipeRight?.();
      }
    },
    [onSwipeLeft, onSwipeRight, threshold]
  );

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}
