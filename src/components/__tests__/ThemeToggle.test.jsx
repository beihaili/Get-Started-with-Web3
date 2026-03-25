import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../ThemeToggle';
import { useThemeStore } from '../../store/useThemeStore';

describe('ThemeToggle', () => {
  beforeEach(() => {
    useThemeStore.getState().setTheme('dark');
  });

  it('should render a button with accessible label', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should toggle theme on click', () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button'));
    expect(useThemeStore.getState().theme).toBe('light');
  });
});
