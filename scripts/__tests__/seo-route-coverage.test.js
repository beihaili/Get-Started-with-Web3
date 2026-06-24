/* global process */

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

  it('includes wallet lab pages in sitemap and prerender route lists', async () => {
    const sitemapScript = await readFile(
      path.join(process.cwd(), 'scripts/generate-sitemap.mjs'),
      'utf8'
    );
    const prerenderScript = await readFile(
      path.join(process.cwd(), 'scripts/prerender.mjs'),
      'utf8'
    );

    expect(sitemapScript).toContain("'/labs/wallet'");
    expect(prerenderScript).toContain('`/${lang}/labs/wallet`');
  });

  it('keeps robots.txt sitemap URLs aligned with the configured public site base', async () => {
    const sitemapScript = await readFile(
      path.join(process.cwd(), 'scripts/generate-sitemap.mjs'),
      'utf8'
    );

    expect(sitemapScript).toContain("join(DIST_DIR, 'robots.txt')");
    expect(sitemapScript).toContain("buildSiteUrl('/sitemap.xml', baseUrl)");
  });

  it('keeps prerender URLs aligned with the configured Vite base path', async () => {
    const prerenderScript = await readFile(
      path.join(process.cwd(), 'scripts/prerender.mjs'),
      'utf8'
    );

    expect(prerenderScript).toContain('normalizeBasePath(process.env.VITE_BASE_PATH)');
    expect(prerenderScript).toContain('BASE_PATH && url.startsWith(BASE_PATH)');
  });
});
