import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageProvider from '../LanguageProvider';
import '../index';

function createWrapper(initialEntry) {
  return function Wrapper({ children }) {
    return (
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/:lang/*" element={<LanguageProvider>{children}</LanguageProvider>} />
        </Routes>
      </MemoryRouter>
    );
  };
}

describe('LanguageProvider', () => {
  it('should set i18n language from URL param (en)', () => {
    const wrapper = createWrapper('/en/dashboard');
    const { result } = renderHook(() => useTranslation(), { wrapper });
    expect(result.current.i18n.language).toBe('en');
  });

  it('should set i18n language from URL param (zh)', () => {
    const wrapper = createWrapper('/zh/dashboard');
    const { result } = renderHook(() => useTranslation(), { wrapper });
    expect(result.current.i18n.language).toBe('zh');
  });

  it('should fallback to en for unsupported language', () => {
    const wrapper = createWrapper('/fr/dashboard');
    const { result } = renderHook(() => useTranslation(), { wrapper });
    expect(result.current.i18n.language).toBe('en');
  });
});
