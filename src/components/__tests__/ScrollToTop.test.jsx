import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ScrollToTop from '../ScrollToTop';

describe('ScrollToTop', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.scrollTo = vi.fn();
    window.scrollY = 0;
    window.innerHeight = 800;
  });

  it('should not render when scrollY <= innerHeight', () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    window.dispatchEvent(new Event('scroll'));
    const { container } = render(<ScrollToTop />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render button when scrollY > innerHeight', () => {
    Object.defineProperty(window, 'scrollY', { value: 1000, writable: true });
    window.dispatchEvent(new Event('scroll'));
    render(<ScrollToTop />);
    const btn = screen.getByRole('button', { name: /back to top/i });
    expect(btn).toBeInTheDocument();
  });

  it('should call window.scrollTo with top:0 and smooth behavior on click', () => {
    Object.defineProperty(window, 'scrollY', { value: 1000, writable: true });
    window.dispatchEvent(new Event('scroll'));
    render(<ScrollToTop />);
    fireEvent.click(screen.getByRole('button'));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('should have proper aria-label for accessibility', () => {
    Object.defineProperty(window, 'scrollY', { value: 1000, writable: true });
    window.dispatchEvent(new Event('scroll'));
    render(<ScrollToTop />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Back to top');
  });

  it('should hide button again when scrolled back up', () => {
    Object.defineProperty(window, 'scrollY', { value: 1000, writable: true });
    window.dispatchEvent(new Event('scroll'));
    const { container } = render(<ScrollToTop />);
    expect(container.querySelector('button')).toBeInTheDocument();

    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    window.dispatchEvent(new Event('scroll'));
    expect(container).toBeEmptyDOMElement();
  });
});
