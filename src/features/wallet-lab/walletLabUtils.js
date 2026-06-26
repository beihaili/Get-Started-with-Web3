export const ALLOWED_WALLET_LAB_CHAINS = [
  {
    chainId: '0x1',
    decimalId: 1,
    name: 'Ethereum Mainnet',
    context: 'Read-only learning context',
  },
  {
    chainId: '0xaa36a7',
    decimalId: 11155111,
    name: 'Sepolia Testnet',
    context: 'Testnet learning context',
  },
];

export function normalizeChainId(chainId) {
  if (typeof chainId === 'number' && Number.isInteger(chainId) && chainId >= 0) {
    return `0x${chainId.toString(16)}`;
  }

  if (typeof chainId !== 'string') {
    return '';
  }

  const trimmed = chainId.trim().toLowerCase();

  if (/^0x[0-9a-f]+$/.test(trimmed)) {
    return `0x${parseInt(trimmed, 16).toString(16)}`;
  }

  if (/^\d+$/.test(trimmed)) {
    return `0x${Number(trimmed).toString(16)}`;
  }

  return '';
}

export function getAllowedChain(chainId) {
  const normalizedChainId = normalizeChainId(chainId);
  return ALLOWED_WALLET_LAB_CHAINS.find((chain) => chain.chainId === normalizedChainId) || null;
}

export function formatChainLabel(chainId) {
  const chain = getAllowedChain(chainId);

  if (chain) {
    return `${chain.name} (${chain.decimalId})`;
  }

  const normalizedChainId = normalizeChainId(chainId);
  return normalizedChainId ? `Unknown chain (${normalizedChainId})` : 'Not connected';
}

export function shortenAddress(address) {
  if (typeof address !== 'string') {
    return '';
  }

  const trimmed = address.trim();

  if (!/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
    return trimmed;
  }

  return `${trimmed.slice(0, 6)}...${trimmed.slice(-4)}`;
}

export function formatSignaturePreview(signature) {
  if (typeof signature !== 'string') {
    return '';
  }

  const trimmed = signature.trim();

  if (trimmed.length <= 24) {
    return trimmed;
  }

  return `${trimmed.slice(0, 12)}...${trimmed.slice(-10)}`;
}

export function buildWalletLabMessage({ domain = 'bhbtc.xyz', issuedAt } = {}) {
  const timestamp = issuedAt || new Date().toISOString();

  return [
    'Get Started with Web3 Wallet Lab',
    `Domain: ${domain}`,
    'Purpose: Learn wallet message signing. No transaction, payment, or login session is created.',
    `Issued At: ${timestamp}`,
  ].join('\n');
}

export function getWalletErrorKey(error) {
  if (!error) {
    return 'errorGeneric';
  }

  if (error.code === 4001) {
    return 'errorRejected';
  }

  if (error.code === 4100) {
    return 'errorUnauthorized';
  }

  if (error.code === 4902) {
    return 'errorChainNotAdded';
  }

  if (error.code === -32002) {
    return 'errorRequestPending';
  }

  return 'errorGeneric';
}
