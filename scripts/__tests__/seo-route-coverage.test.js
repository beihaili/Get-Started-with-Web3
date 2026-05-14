import { readFile } from 'fs/promises';
import path from 'path';
import { describe, expect, it } from 'vitest';

describe('SEO route coverage', () => {
  it('includes glossary pages in sitemap and prerender route lists', async () => {
    const sitemapScript = await readFile(
      path.join(process.cwd(), 'scripts/generate-sitemap.mjs'),
      'utf8'
    );
    const prerenderScript = await readFile(
      path.join(process.cwd(), 'scripts/prerender.mjs'),
      'utf8'
    );

    expect(sitemapScript).toContain("'/glossary'");
    expect(prerenderScript).toContain('`/${lang}/glossary`');
  });
});
