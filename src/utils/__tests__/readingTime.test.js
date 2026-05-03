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

  it('should return 0 for blank markdown', () => {
    // Blank input has no readable content, so it should behave like an empty string.
    expect(estimateReadingTime('   \n\t  ', 'zh')).toBe(0);
    expect(estimateReadingTime('   \n\t  ', 'en')).toBe(0);
  });

  it('should ignore fenced code blocks when estimating markdown reading time', () => {
    const code = Array(800).fill('const value = expensiveComputation();').join('\n');
    const markdown = ['Short intro paragraph.', '```js', code, '```'].join('\n');

    expect(estimateReadingTime(markdown, 'en')).toBe(1);
  });

  it('should count Chinese characters and English words separately in mixed content', () => {
    const chinese = '中'.repeat(400);
    const english = Array(200).fill('word').join(' ');

    expect(estimateReadingTime(`${chinese}\n\n${english}`, 'zh')).toBe(2);
  });

  it('should count markdown image alt text without counting the image URL', () => {
    const longUrl = `https://example.com/${'path/'.repeat(300)}diagram.png`;
    const markdown = `![区块链流程图](${longUrl})`;

    expect(estimateReadingTime(markdown, 'zh')).toBe(1);
  });

  it('should ignore very long inline URLs', () => {
    const longUrl = `https://example.com/${'very-long-segment/'.repeat(300)}`;
    const markdown = `参考资料：${longUrl}`;

    expect(estimateReadingTime(markdown, 'zh')).toBe(1);
  });
});
