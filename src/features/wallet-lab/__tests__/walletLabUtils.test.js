import { describe, expect, it } from 'vitest';
import {
  buildWalletLabMessage,
  formatChainLabel,
  formatSignaturePreview,
  normalizeChainId,
  shortenAddress,
} from '../walletLabUtils';

describe('walletLabUtils', () => {
  it('normalizes hex and decimal chain ids', () => {
    expect(normalizeChainId('0x01')).toBe('0x1');
    expect(normalizeChainId('11155111')).toBe('0xaa36a7');
    expect(normalizeChainId(1)).toBe('0x1');
  });

  it('labels allowlisted chains and unknown networks', () => {
    expect(formatChainLabel('0x1')).toBe('Ethereum Mainnet (1)');
    expect(formatChainLabel('0xaa36a7')).toBe('Sepolia Testnet (11155111)');
    expect(formatChainLabel('0x2105')).toBe('Unknown chain (0x2105)');
  });

  it('shortens wallet addresses and signatures for local display', () => {
    expect(shortenAddress('0x1234567890abcdef1234567890abcdef12345678')).toBe('0x1234...5678');
    expect(formatSignaturePreview('0xabcdefabcdefabcdefabcdefabcdefabcdef')).toBe(
      '0xabcdefabcd...cdefabcdef'
    );
  });

  it('builds an educational signing message without payment or login claims', () => {
    const message = buildWalletLabMessage({
      domain: 'example.test',
      issuedAt: '2026-06-24T00:00:00.000Z',
    });

    expect(message).toContain('Get Started with Web3 Wallet Lab');
    expect(message).toContain('Domain: example.test');
    expect(message).toContain('No transaction, payment, or login session is created.');
  });
});
