/**
 * Estimates reading time in minutes.
 * Chinese: 400 chars/min; English: 200 words/min.
 * Strips markdown syntax (code fences, links, images) before counting.
 * @param {string|null} text - the content string
 * @param {'zh'|'en'} lang - language, defaults to Chinese
 * @returns {number} estimated minutes; 0 for empty/null
 */
export function estimateReadingTime(text, lang = 'zh') {
  if (!text) return 0;

  if (lang === 'zh') {
    // Strip markdown before counting
    const cleaned = stripMarkdown(text);
    const chars = cleaned.replace(/\s/g, '').length;
    return Math.max(1, Math.ceil(chars / 400));
  }

  // English: count words, stripping markdown first
  const cleaned = stripMarkdown(text);
  const words = cleaned.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Removes markdown syntax so it doesn't inflate word/char counts.
 * Handles: code fences, inline code, links, images, headings, bold/italic.
 */
function stripMarkdown(text) {
  return text
    // Remove code fences (triple-backtick blocks) and their content
    .replace(/```[\s\S]*?```/g, ' ')
    // Remove inline code (single backticks) and its content
    .replace(/`[^`]*`/g, ' ')
    // Remove image markdown: ![alt](url) 鈥?keep alt text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Remove link markdown: [text](url) 鈥?keep link text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    // Remove heading markers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic markers
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    // Remove blockquote markers
    .replace(/^>\s+/gm, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // Collapse multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
}
