import { describe, expect, it } from 'vitest';
import {
  buildSiweMessage,
  createSiweNonce,
  createSiweTimestamps,
  inspectSiweResult,
  parseSiweMessage,
  sanitizeSiweStatement,
  toDecimalChainId,
} from '../siweUtils';

const ADDRESS = '0x1234567890abcdef1234567890abcdef12345678';
const SIGNATURE =
  '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

describe('siweUtils', () => {
  it('creates nonce and timestamp fields suitable for an educational SIWE message', () => {
    const nonce = createSiweNonce({
      length: 8,
      randomValues: (values) => values.fill(0),
    });
    const timestamps = createSiweTimestamps({
      now: new Date('2026-06-25T00:00:00.000Z'),
      ttlMinutes: 10,
    });

    expect(nonce).toBe('AAAAAAAA');
    expect(timestamps).toEqual({
      issuedAt: '2026-06-25T00:00:00.000Z',
      expirationTime: '2026-06-25T00:10:00.000Z',
    });
  });

  it('builds and parses an ERC-4361-style SIWE message with required fields', () => {
    const message = buildSiweMessage({
      domain: 'bhbtc.xyz',
      address: ADDRESS,
      statement: 'Learning identity demo',
      uri: 'https://bhbtc.xyz/labs/siwe',
      chainId: '0xaa36a7',
      nonce: 'AbCdEf12',
      issuedAt: '2026-06-25T00:00:00.000Z',
      expirationTime: '2026-06-25T00:10:00.000Z',
      resources: ['https://bhbtc.xyz/ai/manifest.json'],
    });

    expect(message).toContain('bhbtc.xyz wants you to sign in with your Ethereum account:');
    expect(message).toContain(`\n${ADDRESS}\n`);
    expect(message).toContain('Version: 1');
    expect(message).toContain('Chain ID: 11155111');
    expect(message).toContain('Nonce: AbCdEf12');
    expect(message).toContain('Resources:\n- https://bhbtc.xyz/ai/manifest.json');

    expect(parseSiweMessage(message)).toMatchObject({
      domain: 'bhbtc.xyz',
      address: ADDRESS,
      statement: 'Learning identity demo',
      uri: 'https://bhbtc.xyz/labs/siwe',
      version: '1',
      chainId: '11155111',
      nonce: 'AbCdEf12',
      resources: ['https://bhbtc.xyz/ai/manifest.json'],
    });
  });

  it('sanitizes statement line breaks and normalizes chain ids', () => {
    expect(sanitizeSiweStatement('Line one\nLine two')).toBe('Line one Line two');
    expect(toDecimalChainId('0x1')).toBe('1');
    expect(toDecimalChainId('11155111')).toBe('11155111');
  });

  it('locally inspects a signed SIWE result without claiming production authentication', () => {
    const message = buildSiweMessage({
      domain: 'bhbtc.xyz',
      address: ADDRESS,
      statement: 'Learning identity demo',
      uri: 'https://bhbtc.xyz/labs/siwe',
      chainId: 1,
      nonce: 'AbCdEf12',
      issuedAt: '2026-06-25T00:00:00.000Z',
      expirationTime: '2026-06-25T00:10:00.000Z',
    });

    const inspection = inspectSiweResult({
      message,
      signature: SIGNATURE,
      expectedAddress: ADDRESS,
      expectedDomain: 'bhbtc.xyz',
      now: new Date('2026-06-25T00:05:00.000Z'),
    });

    expect(inspection.passed).toBe(true);
    expect(inspection.checks.map((check) => check.key)).toEqual([
      'domain',
      'address',
      'nonce',
      'expiration',
      'signatureShape',
    ]);
  });

  it('fails local inspection when the signature shape or expected domain is wrong', () => {
    const message = buildSiweMessage({
      domain: 'bhbtc.xyz',
      address: ADDRESS,
      statement: 'Learning identity demo',
      uri: 'https://bhbtc.xyz/labs/siwe',
      chainId: 1,
      nonce: 'AbCdEf12',
      issuedAt: '2026-06-25T00:00:00.000Z',
      expirationTime: '2026-06-25T00:10:00.000Z',
    });

    const inspection = inspectSiweResult({
      message,
      signature: '0xabc',
      expectedAddress: ADDRESS,
      expectedDomain: 'evil.example',
      now: new Date('2026-06-25T00:05:00.000Z'),
    });

    expect(inspection.passed).toBe(false);
    expect(inspection.checks.find((check) => check.key === 'domain').ok).toBe(false);
    expect(inspection.checks.find((check) => check.key === 'signatureShape').ok).toBe(false);
  });
});
