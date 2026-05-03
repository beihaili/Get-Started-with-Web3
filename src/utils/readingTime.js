const CJK_CHAR_RE = /[\u3400-\u9fff\uf900-\ufaff]/gu;
const ENGLISH_WORD_RE = /[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g;
const FENCED_CODE_RE = /```[\s\S]*?```|~~~[\s\S]*?~~~/g;
const IMAGE_RE = /!\[([^\]]*)\]\([^)]+\)/g;
const LINK_RE = /\[([^\]]+)\]\([^)]+\)/g;
const URL_RE = /\bhttps?:\/\/[^\s<>()]+/g;

/**
 * Removes markdown syntax that should not contribute to human reading time.
 *
 * Code fences and URLs are skipped because they can contain hundreds of tokens
 * that users usually scan rather than read. Image alt text is preserved because
 * it is the human-readable part of the image markdown.
 *
 * @param {string|null|undefined} text - Markdown or plain text content.
 * @returns {string} Human-readable text used for reading-time estimation.
 */
function normalizeReadableText(text) {
  if (typeof text !== 'string') return '';

  return text
    .replace(FENCED_CODE_RE, ' ')
    .replace(IMAGE_RE, ' $1 ')
    .replace(LINK_RE, ' $1 ')
    .replace(URL_RE, ' ')
    .replace(/`[^`\n]+`/g, ' ')
    .trim();
}

/**
 * 估算阅读时间（中文按 400 字/分钟，英文按 200 词/分钟）
 *
 * Mixed Chinese/English content is counted by script: CJK characters count as
 * Chinese reading units, and Latin words count as English reading units.
 *
 * @param {string|null|undefined} text - 文本内容
 * @param {'zh'|'en'} _lang - 保留兼容的语言参数，计数会按脚本自动区分
 * @returns {number} 预计阅读分钟数（有可读文本时至少返回 1）
 */
export function estimateReadingTime(text, _lang = 'zh') {
  const readableText = normalizeReadableText(text);
  if (!readableText) return 0;

  const cjkChars = readableText.match(CJK_CHAR_RE)?.length ?? 0;
  const textWithoutCjk = readableText.replace(CJK_CHAR_RE, ' ');
  const englishWords = textWithoutCjk.match(ENGLISH_WORD_RE)?.length ?? 0;
  const estimatedMinutes = cjkChars / 400 + englishWords / 200;

  return estimatedMinutes > 0 ? Math.max(1, Math.ceil(estimatedMinutes)) : 0;
}
