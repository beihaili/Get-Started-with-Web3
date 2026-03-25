import { describe, it, expect } from 'vitest';
import { estimateReadingTime } from '../readingTime';

describe('estimateReadingTime', () => {
  it('should return 0 for empty text', () => {
    expect(estimateReadingTime('')).toBe(0);
    expect(estimateReadingTime(null)).toBe(0);
  });

  it('should estimate Chinese text at ~400 chars/min', () => {
    const text = '中'.repeat(800);
    expect(estimateReadingTime(text, 'zh')).toBe(2);
  });

  it('should estimate English text at ~200 words/min', () => {
    const text = Array(400).fill('word').join(' ');
    expect(estimateReadingTime(text, 'en')).toBe(2);
  });

  it('should return at least 1 minute for non-empty text', () => {
    expect(estimateReadingTime('hello', 'en')).toBe(1);
    expect(estimateReadingTime('你好', 'zh')).toBe(1);
  });
});
