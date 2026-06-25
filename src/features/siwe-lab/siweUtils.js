import {
  formatChainLabel,
  formatSignaturePreview,
  getWalletErrorKey,
  normalizeChainId,
  shortenAddress,
} from '../wallet-lab/walletLabUtils';

const NONCE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const DEFAULT_SIWE_STATEMENT =
  'Sign in to Get Started with Web3 as a learning demo. No production session is created.';

export function isValidEthereumAddress(address) {
  return typeof address === 'string' && /^0x[a-fA-F0-9]{40}$/.test(address.trim());
}

export function toDecimalChainId(chainId) {
  const normalizedChainId = normalizeChainId(chainId);

  if (!normalizedChainId) {
    return '';
  }

  return String(parseInt(normalizedChainId, 16));
}

export function sanitizeSiweStatement(statement) {
  return String(statement || DEFAULT_SIWE_STATEMENT)
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180);
}

export function createSiweNonce({ length = 12, randomValues } = {}) {
  const nonceLength = Math.max(8, Number.isInteger(length) ? length : 12);
  const values = new Uint8Array(nonceLength);

  if (randomValues) {
    randomValues(values);
  } else if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(values);
  } else {
    for (let index = 0; index < nonceLength; index += 1) {
      values[index] = Math.floor(Math.random() * 256);
    }
  }

  return Array.from(values, (value) => NONCE_ALPHABET[value % NONCE_ALPHABET.length]).join('');
}

export function createSiweTimestamps({ now = new Date(), ttlMinutes = 10 } = {}) {
  const issuedAt = new Date(now);
  const expirationTime = new Date(issuedAt.getTime() + ttlMinutes * 60 * 1000);

  return {
    issuedAt: issuedAt.toISOString(),
    expirationTime: expirationTime.toISOString(),
  };
}

export function normalizeSiweResources(resources) {
  const source = Array.isArray(resources)
    ? resources
    : String(resources || '')
        .split('\n')
        .map((resource) => resource.trim());

  return source
    .map((resource) => String(resource).trim())
    .filter(Boolean)
    .filter((resource) => /^[a-z][a-z0-9+.-]*:/i.test(resource));
}

export function buildSiweMessage({
  domain,
  address,
  statement = DEFAULT_SIWE_STATEMENT,
  uri,
  chainId,
  nonce,
  issuedAt,
  expirationTime,
  resources = [],
} = {}) {
  const cleanDomain = String(domain || '').trim();
  const cleanUri = String(uri || '').trim();
  const cleanNonce = String(nonce || '').trim();
  const cleanIssuedAt = String(issuedAt || '').trim();
  const decimalChainId = toDecimalChainId(chainId);

  if (!cleanDomain || /[\r\n]/.test(cleanDomain)) {
    throw new Error('SIWE domain is required.');
  }

  if (!isValidEthereumAddress(address)) {
    throw new Error('SIWE address must be a 20-byte Ethereum address.');
  }

  if (!cleanUri || /[\r\n]/.test(cleanUri)) {
    throw new Error('SIWE URI is required.');
  }

  if (!decimalChainId) {
    throw new Error('SIWE chain ID is required.');
  }

  if (!/^[a-zA-Z0-9]{8,}$/.test(cleanNonce)) {
    throw new Error('SIWE nonce must be at least 8 alphanumeric characters.');
  }

  if (!cleanIssuedAt) {
    throw new Error('SIWE issued-at timestamp is required.');
  }

  const lines = [
    `${cleanDomain} wants you to sign in with your Ethereum account:`,
    address.trim(),
    '',
    sanitizeSiweStatement(statement),
    '',
    `URI: ${cleanUri}`,
    'Version: 1',
    `Chain ID: ${decimalChainId}`,
    `Nonce: ${cleanNonce}`,
    `Issued At: ${cleanIssuedAt}`,
  ];

  if (expirationTime) {
    lines.push(`Expiration Time: ${expirationTime}`);
  }

  const normalizedResources = normalizeSiweResources(resources);
  if (normalizedResources.length > 0) {
    lines.push('Resources:');
    normalizedResources.forEach((resource) => lines.push(`- ${resource}`));
  }

  return lines.join('\n');
}

export function parseSiweMessage(message) {
  const lines = String(message || '').split('\n');
  const firstLineMatch = lines[0]?.match(/^(.+) wants you to sign in with your Ethereum account:$/);
  const fields = {};
  const resources = [];
  let collectingResources = false;

  for (const line of lines.slice(2)) {
    if (collectingResources) {
      if (line.startsWith('- ')) {
        resources.push(line.slice(2));
      }
      continue;
    }

    if (line === 'Resources:') {
      collectingResources = true;
      continue;
    }

    const fieldMatch = line.match(/^([^:]+):\s*(.*)$/);
    if (fieldMatch) {
      fields[fieldMatch[1]] = fieldMatch[2];
    }
  }

  return {
    domain: firstLineMatch?.[1] || '',
    address: lines[1] || '',
    statement: lines
      .slice(
        3,
        lines.findIndex((line) => line.startsWith('URI: '))
      )
      .join(' ')
      .trim(),
    uri: fields.URI || '',
    version: fields.Version || '',
    chainId: fields['Chain ID'] || '',
    nonce: fields.Nonce || '',
    issuedAt: fields['Issued At'] || '',
    expirationTime: fields['Expiration Time'] || '',
    resources,
  };
}

export function inspectSiweResult({
  message,
  signature,
  expectedAddress,
  expectedDomain,
  now = new Date(),
} = {}) {
  const parsed = parseSiweMessage(message);
  const normalizedExpectedAddress = String(expectedAddress || '').toLowerCase();
  const normalizedParsedAddress = String(parsed.address || '').toLowerCase();
  const normalizedSignature = String(signature || '').trim();
  const expirationTime = parsed.expirationTime ? new Date(parsed.expirationTime) : null;

  const checks = [
    {
      key: 'domain',
      ok: Boolean(expectedDomain && parsed.domain === expectedDomain),
    },
    {
      key: 'address',
      ok: Boolean(
        normalizedExpectedAddress && normalizedParsedAddress === normalizedExpectedAddress
      ),
    },
    {
      key: 'nonce',
      ok: /^[a-zA-Z0-9]{8,}$/.test(parsed.nonce),
    },
    {
      key: 'expiration',
      ok: Boolean(
        expirationTime && !Number.isNaN(expirationTime.valueOf()) && expirationTime > now
      ),
    },
    {
      key: 'signatureShape',
      ok: /^0x[a-fA-F0-9]{130}$/.test(normalizedSignature),
    },
  ];

  return {
    parsed,
    checks,
    passed: checks.every((check) => check.ok),
  };
}

export function formatSiweAccountPreview(address) {
  return shortenAddress(address);
}

export function formatSiweChainLabel(chainId) {
  return formatChainLabel(chainId);
}

export function formatSiweSignaturePreview(signature) {
  return formatSignaturePreview(signature);
}

export function getSiweErrorKey(error) {
  return getWalletErrorKey(error);
}
