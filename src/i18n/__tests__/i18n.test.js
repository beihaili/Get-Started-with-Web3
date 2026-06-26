import { describe, it, expect, vi } from 'vitest';
import { createInstance } from 'i18next';
import i18n from '../index';
import {
  EAGER_I18N_SECTIONS,
  I18N_SECTIONS,
  getEagerI18nResources,
  getRouteI18nSections,
  loadI18nSections,
} from '../namespaceLoaders';

function createTestI18n() {
  const instance = createInstance();
  instance.init({
    resources: getEagerI18nResources(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
  return instance;
}

describe('i18n', () => {
  it('should initialize with en and zh languages and only eager sections', () => {
    expect(i18n.options.resources).toHaveProperty('en');
    expect(i18n.options.resources).toHaveProperty('zh');

    const enSections = Object.keys(i18n.options.resources.en.translation);
    const zhSections = Object.keys(i18n.options.resources.zh.translation);
    expect(enSections.sort()).toEqual(EAGER_I18N_SECTIONS.toSorted());
    expect(zhSections.sort()).toEqual(EAGER_I18N_SECTIONS.toSorted());
    expect(enSections).not.toContain('landing');
  });

  it('should define matching lazy-loadable sections for every locale', async () => {
    const testI18n = createTestI18n();

    for (const section of I18N_SECTIONS) {
      await loadI18nSections(testI18n, [section], 'en');
      await loadI18nSections(testI18n, [section], 'zh');
    }

    const enKeys = Object.keys(testI18n.getResourceBundle('en', 'translation'));
    const zhKeys = Object.keys(testI18n.getResourceBundle('zh', 'translation'));
    expect(enKeys.sort()).toEqual(I18N_SECTIONS.toSorted());
    expect(zhKeys.sort()).toEqual(I18N_SECTIONS.toSorted());
  });

  it('should lazy-load a section while keeping existing dotted translation keys working', async () => {
    const testI18n = createTestI18n();

    expect(testI18n.t('landing.pageTitle', { lng: 'en' })).toBe('landing.pageTitle');

    await loadI18nSections(testI18n, ['landing'], 'en');
    await loadI18nSections(testI18n, ['landing'], 'zh');

    expect(testI18n.t('landing.pageTitle', { lng: 'en' })).toBe(
      'Get Started with Web3 - Open-source Web3 Learning Platform'
    );
    expect(testI18n.t('landing.pageTitle', { lng: 'zh' })).toBe(
      'Get Started with Web3 - 从入门到精通'
    );
  });

  it('should keep article index metadata aligned with the current lesson count', async () => {
    const testI18n = createTestI18n();

    await loadI18nSections(testI18n, ['articles'], 'en');
    await loadI18nSections(testI18n, ['articles'], 'zh');

    expect(testI18n.t('articles.pageDesc', { lng: 'en' })).toContain('60 lessons');
    expect(testI18n.t('articles.pageDesc', { lng: 'zh' })).toContain('60 讲');
  });

  it('should map routes to the sections needed before rendering', () => {
    expect(getRouteI18nSections('/en')).toEqual(['landing', 'support', 'donation', 'sponsor']);
    expect(getRouteI18nSections('/zh/dashboard')).toEqual(['dashboard']);
    expect(getRouteI18nSections('/en/learn/module-8/8-2')).toEqual([
      'reader',
      'markdown',
      'quiz',
      'ai',
      'thankAuthor',
      'share',
      'sponsor',
    ]);
    expect(getRouteI18nSections('/zh/support')).toEqual(['support', 'donation']);
    expect(getRouteI18nSections('/en/labs/wallet')).toEqual(['walletLab']);
    expect(getRouteI18nSections('/zh/labs/siwe')).toEqual(['siweLab']);
  });

  it('should warn instead of silently ignoring namespace load failures', async () => {
    const testI18n = createTestI18n();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await loadI18nSections(testI18n, ['missing-section'], 'en');

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('[i18n] Failed to load en/missing-section'),
      expect.any(Error)
    );
    warn.mockRestore();
  });
});
