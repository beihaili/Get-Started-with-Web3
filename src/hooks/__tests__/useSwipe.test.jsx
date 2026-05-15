import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useSwipe } from '../useSwipe';

function SwipeSurface({ onSwipeLeft = vi.fn(), onSwipeRight = vi.fn() }) {
  const handlers = useSwipe({ onSwipeLeft, onSwipeRight, threshold: 80 });

  return (
    <div data-testid="surface" {...handlers}>
      <pre data-testid="code-block">const x = 1;</pre>
    </div>
  );
}

describe('useSwipe', () => {
  it('calls onSwipeLeft for horizontal left swipes longer than the threshold', () => {
    const onSwipeLeft = vi.fn();
    const { getByTestId } = render(<SwipeSurface onSwipeLeft={onSwipeLeft} />);
    const surface = getByTestId('surface');

    fireEvent.touchStart(surface, { touches: [{ clientX: 220, clientY: 120 }] });
    fireEvent.touchMove(surface, { touches: [{ clientX: 100, clientY: 130 }] });
    fireEvent.touchEnd(surface);

    expect(onSwipeLeft).toHaveBeenCalledTimes(1);
  });

  it('keeps vertical scrolling and code block horizontal scrolling in control', () => {
    const onSwipeLeft = vi.fn();
    const onSwipeRight = vi.fn();
    const { getByTestId } = render(
      <SwipeSurface onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight} />
    );
    const surface = getByTestId('surface');
    const codeBlock = getByTestId('code-block');

    fireEvent.touchStart(surface, { touches: [{ clientX: 220, clientY: 120 }] });
    fireEvent.touchMove(surface, { touches: [{ clientX: 120, clientY: 260 }] });
    fireEvent.touchEnd(surface);

    fireEvent.touchStart(codeBlock, { touches: [{ clientX: 220, clientY: 120 }] });
    fireEvent.touchMove(codeBlock, { touches: [{ clientX: 80, clientY: 125 }] });
    fireEvent.touchEnd(codeBlock);

    expect(onSwipeLeft).not.toHaveBeenCalled();
    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  it('uses the last touchmove point when touchend reports stale coordinates', () => {
    const onSwipeLeft = vi.fn();
    const { getByTestId } = render(<SwipeSurface onSwipeLeft={onSwipeLeft} />);
    const surface = getByTestId('surface');

    fireEvent.touchStart(surface, { touches: [{ clientX: 220, clientY: 120 }] });
    fireEvent.touchMove(surface, { touches: [{ clientX: 80, clientY: 120 }] });
    fireEvent.touchEnd(surface, { changedTouches: [{ clientX: 210, clientY: 120 }] });

    expect(onSwipeLeft).toHaveBeenCalledTimes(1);
  });
});
