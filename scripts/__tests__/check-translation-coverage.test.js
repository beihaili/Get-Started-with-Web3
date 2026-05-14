import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { checkTranslationCoverage } from '../check-translation-coverage.mjs';

let tempDir;

afterEach(async () => {
  if (tempDir) {
    await rm(tempDir, { recursive: true, force: true });
    tempDir = undefined;
  }
});

describe('check-translation-coverage', () => {
  it('treats README.md and README.MD as lesson readmes', async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), 'web3-translation-coverage-'));
    const zhDir = path.join(tempDir, 'zh');
    const enDir = path.join(tempDir, 'en');

    await mkdir(path.join(zhDir, 'UppercaseReadme'), { recursive: true });
    await mkdir(path.join(enDir, 'UppercaseReadme'), { recursive: true });
    await mkdir(path.join(zhDir, 'MissingTranslation'), { recursive: true });

    await writeFile(path.join(zhDir, 'UppercaseReadme', 'README.MD'), '# 中文\n', 'utf8');
    await writeFile(path.join(enDir, 'UppercaseReadme', 'README.md'), '# English\n', 'utf8');
    await writeFile(path.join(zhDir, 'MissingTranslation', 'README.md'), '# 中文\n', 'utf8');

    const result = checkTranslationCoverage({ zhDir, enDir });

    expect(result.checked).toBe(2);
    expect(result.missing).toEqual(['MissingTranslation']);
  });
});
