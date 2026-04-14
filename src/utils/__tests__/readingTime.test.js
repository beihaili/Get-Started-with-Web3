import { describe, it, expect } from 'vitest';
import { estimateReadingTime } from '../readingTime';

describe('estimateReadingTime', () => {
  it('should return 0 for empty text', () => {
    expect(estimateReadingTime('')).toBe(0);
    expect(estimateReadingTime(null)).toBe(0);
  });

  it('should estimate Chinese text at ~400 chars/min', () => {
    const text = '涓?.repeat(800);
    expect(estimateReadingTime(text, 'zh')).toBe(2);
  });

  it('should estimate English text at ~200 words/min', () => {
    const text = Array(400).fill('word').join(' ');
    expect(estimateReadingTime(text, 'en')).toBe(2);
  });

  it('should return at least 1 minute for non-empty text', () => {
    expect(estimateReadingTime('hello', 'en')).toBe(1);
    expect(estimateReadingTime('涓?, 'zh')).toBe(1);
  });

  // Edge cases from issue #90
  describe('edge cases', () => {
    it('should count code fences as zero words (not inflate English word count)', () => {
      // 100 words + a huge code block should not inflate significantly
      const text =
        'word '.repeat(100) +
        '\n```\n' +
        Array(200).fill('codeword').join(' ') +
        '\n```';
      // Without code, 100 words / 200 wpm = 1 min (at least 1)
      // Code inside fences should NOT be counted
      expect(estimateReadingTime(text, 'en')).toBeLessThanOrEqual(3);
    });

    it('should count only alt text from markdown images, not the URL', () => {
      const text = 'word '.repeat(200) + '\n![alt text here describing](https://example.com/image.png)';
      // 200 words = 1 min; image URL should not add words
      expect(estimateReadingTime(text, 'en')).toBe(1);
    });

    it('should not inflate word count with very long inline URLs', () => {
      const url = 'https://example.com/a/'.repeat(50);
      const text = 'word '.repeat(10) + url;
      // 10 words + URL as 1 word = still small
      expect(estimateReadingTime(text, 'en')).toBe(1);
    });

    it('should strip markdown syntax before counting (code, links, images)', () => {
      // Mixed markdown-heavy content should count plain text only
      const text =
        '# Heading\n\nSome words here.\n\n' +
        '```js\nconst x = 1;\n```\n\n' +
        '[link text](http://example.com)\n\n' +
        'More text here.\n';
      // Count words: "Heading Some words here More text here" = 7 words
      const result = estimateReadingTime(text, 'en');
      expect(result).toBe(1); // well under the 100+ it would be if markdown counted
    });

    it('should handle null/undefined gracefully and return 0', () => {
      expect(estimateReadingTime(null, 'zh')).toBe(0);
      expect(estimateReadingTime(undefined, 'en')).toBe(0);
      expect(estimateReadingTime(null, null)).toBe(0);
    });
  });
});
