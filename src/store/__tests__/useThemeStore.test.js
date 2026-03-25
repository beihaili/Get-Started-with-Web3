import { describe, it, expect, beforeEach } from 'vitest';
import { useThemeStore } from '../useThemeStore';
import { act } from '@testing-library/react';

describe('useThemeStore', () => {
  beforeEach(() => {
    useThemeStore.getState().setTheme('dark');
    localStorage.clear();
  });

  it('should default to dark theme', () => {
    expect(useThemeStore.getState().theme).toBe('dark');
  });

  it('should toggle theme', () => {
    act(() => useThemeStore.getState().toggleTheme());
    expect(useThemeStore.getState().theme).toBe('light');
    act(() => useThemeStore.getState().toggleTheme());
    expect(useThemeStore.getState().theme).toBe('dark');
  });

  it('should set theme directly', () => {
    act(() => useThemeStore.getState().setTheme('light'));
    expect(useThemeStore.getState().theme).toBe('light');
  });

  it('should expose isDark computed property', () => {
    expect(useThemeStore.getState().isDark()).toBe(true);
    act(() => useThemeStore.getState().setTheme('light'));
    expect(useThemeStore.getState().isDark()).toBe(false);
  });
});
