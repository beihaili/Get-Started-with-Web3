import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import LanguageSwitcher from '../LanguageSwitcher';

const routerState = vi.hoisted(() => ({
  lang: 'en',
  pathname: '/en',
  navigate: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useParams: () => ({ lang: routerState.lang }),
  useLocation: () => ({ pathname: routerState.pathname }),
  useNavigate: () => routerState.navigate,
}));

const renderLanguageSwitcher = ({ lang = 'en', pathname = '/en' } = {}) => {
  routerState.lang = lang;
  routerState.pathname = pathname;
  routerState.navigate.mockClear();

  return render(<LanguageSwitcher />);
};

describe('LanguageSwitcher', () => {
  it('renders both language options and marks the current language active', () => {
    renderLanguageSwitcher({ lang: 'en', pathname: '/en/dashboard' });

    expect(screen.getByRole('group', { name: 'Language' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '中文' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('navigates from English routes to the matching Chinese route', () => {
    renderLanguageSwitcher({ lang: 'en', pathname: '/en/learn/module-1/1-2' });

    fireEvent.click(screen.getByRole('button', { name: '中文' }));

    expect(routerState.navigate).toHaveBeenCalledWith('/zh/learn/module-1/1-2');
  });

  it('navigates from Chinese routes to the matching English route', () => {
    renderLanguageSwitcher({ lang: 'zh', pathname: '/zh/glossary' });

    fireEvent.click(screen.getByRole('button', { name: 'English' }));

    expect(routerState.navigate).toHaveBeenCalledWith('/en/glossary');
  });

  it('updates root language routes without adding a trailing path', () => {
    renderLanguageSwitcher({ lang: 'zh', pathname: '/zh' });

    fireEvent.click(screen.getByRole('button', { name: 'English' }));

    expect(routerState.navigate).toHaveBeenCalledWith('/en');
  });
});
