import { readFile } from 'fs/promises';
import path from 'path';
import { describe, expect, it } from 'vitest';

describe('index.html SEO shell', () => {
  it('does not ship route-specific Course JSON-LD in the SPA shell', async () => {
    const html = await readFile(path.join(process.cwd(), 'index.html'), 'utf8');

    expect(html).not.toContain('"@type": "Course"');
    expect(html).not.toContain('"inLanguage": "zh-CN"');
  });
});
