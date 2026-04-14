import { describe, it, expect, vi, afterEach } from '\''vitest'\'';
import { render, screen, act } from '\''@testing-library/react'\'';
import { useClipboard } from '\''../useClipboard'\'';

// Test component that exposes the hook for testing
const TestComponent = ({ onMount }) => {
  const { copied, copy } = useClipboard();
  if (onMount) onMount({ copied, copy });
  return (
    <div>
      <span data-testid="copied-status">{copied ? '\''copied'\'' : '\''not-copied'\''}</span>
      <button onClick={() => copy('\''hello world'\'')} data-testid="copy-btn">
        Copy
      </button>
    </div>
  );
};

describe('\''useClipboard'\'', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('\''initial state'\'', () => {
    it('\''should start with copied=false'\'', () => {
      let hookState;
      render(<TestComponent onMount={(s) => (hookState = s)} />);
      expect(hookState.copied).toBe(false);
    });

    it('\''should render copy button'\'', () => {
      render(<TestComponent />);
      expect(screen.getByTestId('\''copy-btn'\'')).toBeInTheDocument();
    });
  });

  describe('\''copy function'\'', () => {
    it('\''should set copied=true when clipboard API succeeds'\'', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, '\''clipboard'\'', {
        value: { writeText },
        configurable: true,
      });

      let copyFn;
      render(<TestComponent onMount={(s) => (copyFn = s.copy)} />);

      await act(async () => {
        await copyFn('\''test text'\'');
      });

      expect(writeText).toHaveBeenCalledWith('\''test text'\'');
      expect(screen.getByTestId('\''copied-status'\'').textContent).toBe('\''copied'\'');
    });

    it('\''should call navigator.clipboard.writeText with correct text'\'', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, '\''clipboard'\'', {
        value: { writeText },
        configurable: true,
      });

      let copyFn;
      render(<TestComponent onMount={(s) => (copyFn = s.copy)} />);

      await act(async () => {
        await copyFn('\''hello world'\'');
      });

      expect(writeText).toHaveBeenCalledOnce();
      expect(writeText).toHaveBeenCalledWith('\''hello world'\'');
    });

    it('\''should reset copied to false after 2 seconds'\'', async () => {
      vi.useFakeTimers();

      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, '\''clipboard'\'', {
        value: { writeText },
        configurable: true,
      });

      let copyFn;
      render(<TestComponent onMount={(s) => (copyFn = s.copy)} />);

      await act(async () => {
        await copyFn('\''test'\'');
      });

      expect(screen.getByTestId('\''copied-status'\'').textContent).toBe('\''copied'\'');

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(screen.getByTestId('\''copied-status'\'').textContent).toBe('\''not-copied'\'');
    });

    it('\''should fall back to execCommand when clipboard API is unavailable'\'', async () => {
      Object.defineProperty(navigator, '\''clipboard'\'', {
        value: undefined,
        configurable: true,
      });

      const execCommand = vi.fn().mockReturnValue(true);
      const originalExecCommand = document.execCommand;
      document.execCommand = execCommand;

      let copyFn;
      render(<TestComponent onMount={(s) => (copyFn = s.copy)} />);

      await act(async () => {
        await copyFn('\''fallback text'\'');
      });

      expect(execCommand).toHaveBeenCalledWith('\''copy'\'');
      expect(screen.getByTestId('\''copied-status'\'').textContent).toBe('\''copied'\'');

      document.execCommand = originalExecCommand;
    });

    it('\''should handle clipboard API throwing an error gracefully'\'', async () => {
      const writeText = vi.fn().mockRejectedValue(new Error('\''Clipboard access denied'\''));
      Object.defineProperty(navigator, '\''clipboard'\'', {
        value: { writeText },
        configurable: true,
      });

      const consoleWarn = vi.spyOn(console, '\''warn'\'').mockImplementation(() => {});

      let copyFn;
      render(<TestComponent onMount={(s) => (copyFn = s.copy)} />);

      await act(async () => {
        await copyFn('\''will fail'\'');
      });

      expect(screen.getByTestId('\''copied-status'\'').textContent).toBe('\''not-copied'\'');
      expect(console.warn).toHaveBeenCalled();

      consoleWarn.mockRestore();
    });
  });
});