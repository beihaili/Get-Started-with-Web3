import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ScrollToTop from '../ScrollToTop';

const originalScrollYDescriptor = Object.getOwnPropertyDescriptor(window, 'scrollY');
const originalInnerHeightDescriptor = Object.getOwnPropertyDescriptor(window, 'innerHeight');
const originalScrollToDescriptor = Object.getOwnPropertyDescriptor(window, 'scrollTo');

const setViewportScroll = ({ scrollY, innerHeight = 800 }) => {
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    value: scrollY,
  });
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    value: innerHeight,
  });
};

describe('ScrollToTop', () => {
  let rafCallback;

  beforeEach(() => {
    rafCallback = null;
    setViewportScroll({ scrollY: 0 });
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      rafCallback = callback;
      return 1;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (originalScrollYDescriptor) {
      Object.defineProperty(window, 'scrollY', originalScrollYDescriptor);
    } else {
      delete window.scrollY;
    }
    if (originalInnerHeightDescriptor) {
      Object.defineProperty(window, 'innerHeight', originalInnerHeightDescriptor);
    } else {
      delete window.innerHeight;
    }
    if (originalScrollToDescriptor) {
      Object.defineProperty(window, 'scrollTo', originalScrollToDescriptor);
    } else {
      delete window.scrollTo;
    }
  });

  it('should only appear after the user scrolls past one viewport', () => {
    render(<ScrollToTop />);

    expect(screen.queryByRole('button', { name: /scroll to top/i })).not.toBeInTheDocument();

    act(() => {
      setViewportScroll({ scrollY: 500, innerHeight: 800 });
      window.dispatchEvent(new Event('scroll'));
      rafCallback?.();
    });

    expect(screen.queryByRole('button', { name: /scroll to top/i })).not.toBeInTheDocument();

    act(() => {
      setViewportScroll({ scrollY: 801, innerHeight: 800 });
      window.dispatchEvent(new Event('scroll'));
      rafCallback?.();
    });

    expect(screen.getByRole('button', { name: /scroll to top/i })).toBeInTheDocument();
  });

  it('should scroll smoothly to the top when clicked', () => {
    const scrollTo = vi.fn();
    Object.defineProperty(window, 'scrollTo', {
      configurable: true,
      value: scrollTo,
    });

    render(<ScrollToTop />);

    act(() => {
      setViewportScroll({ scrollY: 900, innerHeight: 800 });
      window.dispatchEvent(new Event('scroll'));
      rafCallback?.();
    });
    fireEvent.click(screen.getByRole('button', { name: /scroll to top/i }));

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
