import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useClipboard } from '../useClipboard';

const originalClipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
const originalExecCommandDescriptor = Object.getOwnPropertyDescriptor(document, 'execCommand');

const mockClipboard = (writeText) => {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  });
};

describe('useClipboard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    if (originalClipboardDescriptor) {
      Object.defineProperty(navigator, 'clipboard', originalClipboardDescriptor);
    } else {
      delete navigator.clipboard;
    }
    if (originalExecCommandDescriptor) {
      Object.defineProperty(document, 'execCommand', originalExecCommandDescriptor);
    } else {
      delete document.execCommand;
    }
    document.body.innerHTML = '';
  });

  it('should copy with navigator.clipboard and clear copied after the reset delay', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);

    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copy('wallet address');
    });

    expect(writeText).toHaveBeenCalledWith('wallet address');
    expect(result.current.copied).toBe('wallet address');

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.copied).toBeNull();
  });

  it('should fall back to a hidden textarea when navigator.clipboard fails', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('Clipboard unavailable'));
    const execCommand = vi.fn().mockReturnValue(true);
    const appendChild = document.body.appendChild.bind(document.body);
    let appendedTextarea;

    mockClipboard(writeText);
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: execCommand,
    });
    vi.spyOn(document.body, 'appendChild').mockImplementation((node) => {
      appendedTextarea = node;
      return appendChild(node);
    });

    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copy('fallback text');
    });

    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(appendedTextarea).toBeInstanceOf(HTMLTextAreaElement);
    expect(appendedTextarea.value).toBe('fallback text');
    expect(appendedTextarea.style.position).toBe('fixed');
    expect(appendedTextarea.style.left).toBe('-9999px');
    expect(document.body.contains(appendedTextarea)).toBe(false);
    expect(result.current.copied).toBe('fallback text');
  });

  it('should keep the most recent copied value when copies happen before timeout', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);

    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copy('a');
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    await act(async () => {
      await result.current.copy('b');
    });

    expect(result.current.copied).toBe('b');

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.copied).toBe('b');

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.copied).toBeNull();
  });
});
