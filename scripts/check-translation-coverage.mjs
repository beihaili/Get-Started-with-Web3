#!/usr/bin/env node
// scripts/check-translation-coverage.mjs
// Compares zh/ and en/ directories for missing English translations.
// Non-blocking: always exits 0 (warnings only).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const zhDir = path.join(root, 'zh');
const enDir = path.join(root, 'en');

export function findReadmes(dir, base = '') {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(base, entry.name);
    if (entry.isDirectory()) {
      results.push(...findReadmes(path.join(dir, entry.name), rel));
    } else if (/^README\.md$/i.test(entry.name)) {
      results.push(base);
    }
  }
  return results;
}

function hasReadme(dir) {
  return fs.existsSync(path.join(dir, 'README.md')) || fs.existsSync(path.join(dir, 'README.MD'));
}

export function checkTranslationCoverage(options = {}) {
  const sourceDir = options.zhDir || zhDir;
  const targetDir = options.enDir || enDir;
  const zhPaths = findReadmes(sourceDir).sort();
  const missing = [];

  for (const p of zhPaths) {
    if (!hasReadme(path.join(targetDir, p))) {
      missing.push(p);
    }
  }

  return {
    checked: zhPaths.length,
    missing,
  };
}

export function reportTranslationCoverage(result) {
  for (const p of result.missing) {
    const displayPath = p ? `zh/${p}/README.md` : 'zh/README.md';
    console.warn(`WARNING: Missing English translation for ${displayPath}`);
  }

  if (result.missing.length > 0) {
    console.warn(`\n${result.missing.length} lesson(s) missing English translations.`);
  } else {
    console.log('All Chinese lessons have English translations.');
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  reportTranslationCoverage(checkTranslationCoverage());
}
