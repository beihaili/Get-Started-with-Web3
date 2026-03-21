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

function findReadmes(dir, base = '') {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(base, entry.name);
    if (entry.isDirectory()) {
      results.push(...findReadmes(path.join(dir, entry.name), rel));
    } else if (entry.name === 'README.md') {
      results.push(base);
    }
  }
  return results;
}

const zhPaths = findReadmes(zhDir);
let missing = 0;

for (const p of zhPaths) {
  const enPath = path.join(enDir, p, 'README.md');
  if (!fs.existsSync(enPath)) {
    console.warn(`WARNING: Missing English translation for zh/${p}/README.md`);
    missing++;
  }
}

if (missing > 0) {
  console.warn(`\n${missing} lesson(s) missing English translations.`);
} else {
  console.log('All Chinese lessons have English translations.');
}
