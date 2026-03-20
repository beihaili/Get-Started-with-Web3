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
});
