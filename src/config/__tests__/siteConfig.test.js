import { describe, expect, it } from 'vitest';
import { buildSiteUrl, joinBasePath, normalizeBasePath, normalizeSiteBaseUrl } from '../siteConfig';

describe('siteConfig', () => {
  it('normalizes custom site origins without trailing slashes', () => {
    expect(normalizeSiteBaseUrl('https://web3.bhbtc.xyz/')).toBe('https://web3.bhbtc.xyz');
    expect(normalizeSiteBaseUrl(' https://learn.bhbtc.xyz/// ')).toBe('https://learn.bhbtc.xyz');
  });

  it('builds canonical URLs from the configured site base', () => {
    expect(buildSiteUrl('/en/dashboard', 'https://web3.bhbtc.xyz/')).toBe(
      'https://web3.bhbtc.xyz/en/dashboard'
    );
    expect(
      buildSiteUrl('/en/learn/module-9/9-2?from=share#rollups', 'https://web3.bhbtc.xyz/')
    ).toBe('https://web3.bhbtc.xyz/en/learn/module-9/9-2?from=share#rollups');
  });

  it('keeps the repository base path explicit for GitHub Pages assets and analytics paths', () => {
    expect(normalizeBasePath('Get-Started-with-Web3')).toBe('/Get-Started-with-Web3/');
    expect(joinBasePath('/Get-Started-with-Web3/', '/en/glossary')).toBe(
      '/Get-Started-with-Web3/en/glossary'
    );
    expect(joinBasePath('/', '/en/glossary')).toBe('/en/glossary');
  });

  it('defaults production URLs and paths to the bhbtc.xyz custom domain', () => {
    expect(normalizeSiteBaseUrl()).toBe('https://bhbtc.xyz');
    expect(normalizeBasePath()).toBe('/');
    expect(buildSiteUrl('/ai/manifest.json')).toBe('https://bhbtc.xyz/ai/manifest.json');
  });
});
