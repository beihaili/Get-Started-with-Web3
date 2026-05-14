import { describe, it, expect } from 'vitest';
import i18n from '../index';

describe('i18n', () => {
  it('should initialize with en and zh languages', () => {
    expect(i18n.options.resources).toHaveProperty('en');
    expect(i18n.options.resources).toHaveProperty('zh');
  });

  it('should have matching top-level keys in en and zh', () => {
    const enKeys = Object.keys(i18n.options.resources.en.translation);
    const zhKeys = Object.keys(i18n.options.resources.zh.translation);
    expect(enKeys.sort()).toEqual(zhKeys.sort());
  });

  it('should localize the landing page title for social sharing', () => {
    expect(i18n.t('landing.pageTitle', { lng: 'en' })).toBe(
      'Get Started with Web3 - Open-source Web3 Learning Platform'
    );
    expect(i18n.t('landing.pageTitle', { lng: 'zh' })).toBe('Get Started with Web3 - 从入门到精通');
  });

  it('should keep article index metadata aligned with the current lesson count', () => {
    expect(i18n.t('articles.pageDesc', { lng: 'en' })).toContain('58 lessons');
    expect(i18n.t('articles.pageDesc', { lng: 'zh' })).toContain('58 讲');
  });
});
