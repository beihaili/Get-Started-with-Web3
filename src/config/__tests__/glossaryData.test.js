import { describe, it, expect } from 'vitest';
import { GLOSSARY_DATA } from '../glossaryData';

describe('glossaryData', () => {
  it('should have at least 10 terms', () => {
    expect(GLOSSARY_DATA.length).toBeGreaterThanOrEqual(10);
  });

  it('each term should have required fields', () => {
    GLOSSARY_DATA.forEach((term) => {
      expect(term).toHaveProperty('term');
      expect(term).toHaveProperty('definition');
      expect(term).toHaveProperty('category');
      expect(typeof term.term).toBe('string');
      expect(typeof term.definition).toBe('string');
    });
  });

  it('categories should be from allowed set', () => {
    const allowed = ['基础概念', '密码学', '比特币', '以太坊', 'DeFi', '安全', '工具'];
    GLOSSARY_DATA.forEach((term) => {
      expect(allowed).toContain(term.category);
    });
  });
});
