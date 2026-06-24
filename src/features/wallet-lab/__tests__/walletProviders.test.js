import { describe, expect, it, vi } from 'vitest';
import { discoverWalletProviders, normalizeProviderAnnouncement } from '../walletProviders';

describe('walletProviders', () => {
  it('normalizes EIP-6963 provider announcements', () => {
    const provider = { request: vi.fn() };

    expect(
      normalizeProviderAnnouncement({
        info: { name: 'Example Wallet', rdns: 'com.example.wallet' },
        provider,
      })
    ).toMatchObject({
      id: 'com.example.wallet',
      info: { name: 'Example Wallet', rdns: 'com.example.wallet' },
      provider,
      source: 'eip6963',
    });
  });

  it('discovers wallets announced through EIP-6963 events', async () => {
    const target = new EventTarget();
    const provider = { request: vi.fn() };

    target.addEventListener('eip6963:requestProvider', () => {
      target.dispatchEvent(
        new CustomEvent('eip6963:announceProvider', {
          detail: {
            info: { name: 'Example Wallet', rdns: 'com.example.wallet' },
            provider,
          },
        })
      );
    });

    await expect(discoverWalletProviders({ target, timeoutMs: 0 })).resolves.toMatchObject([
      {
        id: 'com.example.wallet',
        info: { name: 'Example Wallet' },
        provider,
      },
    ]);
  });
});
