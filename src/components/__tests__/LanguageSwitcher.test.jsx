import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LanguageSwitcher from '../LanguageSwitcher';

// Mock react-router-dom
const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/zh/lesson/1' }),
  useParams: () => ({ lang: 'zh' }),
}));

describe('LanguageSwitcher', () => {
  let user;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  it('should render without crashing', () => {
    const { container } = render(<LanguageSwitcher />);
    expect(container).toBeTruthy();
  });

  it('should display EN when current lang is zh', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('should have aria-label Switch to English when lang is zh', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to English');
  });

  it('should navigate to en path when clicked (zh → en)', async () => {
    render(<LanguageSwitcher />);
    await user.click(screen.getByRole('button'));
    expect(mockNavigate).toHaveBeenCalledWith('/en/lesson/1');
  });

  it('should navigate to zh path when current is en', async () => {
    const enLocation = { pathname: '/en/lesson/1' };
    vi.doMock('react-router-dom', () => ({
      useNavigate: () => mockNavigate,
      useLocation: () => enLocation,
      useParams: () => ({ lang: 'en' }),
    }));
    const { LanguageSwitcher: LC } = require('../LanguageSwitcher');
    render(<LC />);
    await user.click(screen.getByRole('button'));
    expect(mockNavigate).toHaveBeenCalledWith('/zh/lesson/1');
  });

  it('should display 中文 when current lang is en', async () => {
    const enLocation = { pathname: '/en/lesson/1' };
    vi.doMock('react-router-dom', () => ({
      useNavigate: () => mockNavigate,
      useLocation: () => enLocation,
      useParams: () => ({ lang: 'en' }),
    }));
    const { LanguageSwitcher: LC } = require('../LanguageSwitcher');
    render(<LC />);
    expect(screen.getByText('中文')).toBeInTheDocument();
  });
});
