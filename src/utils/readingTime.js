/**
 * 估算阅读时间（中文按 400 字/分钟，英文按 200 词/分钟）
 * @param {string|null} text - 文本内容
 * @param {'zh'|'en'} lang - 语言，默认中文
 * @returns {number} 预计阅读分钟数（非空文本至少返回 1）
 */
export function estimateReadingTime(text, lang = 'zh') {
  if (!text) return 0;

  if (lang === 'zh') {
    // 中文：去除空白后按字符数计算，400 字/分钟
    const chars = text.replace(/\s/g, '').length;
    return Math.max(1, Math.ceil(chars / 400));
  }

  // 英文：按空格分词，200 词/分钟
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
