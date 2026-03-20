import { describe, it, expect } from 'vitest';
import { DONATION_LINKS, CRYPTO_WALLETS } from '../sponsorData';

describe('sponsorData', () => {
  it('should have valid donation links', () => {
    expect(DONATION_LINKS).toBeDefined();
    DONATION_LINKS.forEach((link) => {
      expect(link).toHaveProperty('name');
      expect(link).toHaveProperty('url');
      expect(link.url).toMatch(/^https?:\/\//);
    });
  });

  it('should have valid crypto wallet addresses', () => {
    expect(CRYPTO_WALLETS).toBeDefined();
    CRYPTO_WALLETS.forEach((wallet) => {
      expect(wallet).toHaveProperty('chain');
      expect(wallet).toHaveProperty('address');
      expect(wallet.address.length).toBeGreaterThan(10);
    });
  });
});
