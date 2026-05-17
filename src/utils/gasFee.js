export const DEFAULT_BASE_FEE_GWEI = 20;
export const DEFAULT_ETH_USD = 3000;
export const DEFAULT_RPC_URL = 'https://ethereum-rpc.publicnode.com';
export const ETH_PRICE_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';

const GWEI_PER_ETH = 1_000_000_000;
const WEI_PER_GWEI = 1_000_000_000;
const ETH_PRICE_CACHE_MS = 5 * 60 * 1000;

let cachedEthUsd = null;
let cachedEthUsdAt = 0;

const toFiniteNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

export const weiHexToGwei = (hexWei) => {
  if (!hexWei || typeof hexWei !== 'string') {
    throw new Error('Missing wei hex value');
  }

  return Number(BigInt(hexWei)) / WEI_PER_GWEI;
};

export const calculateGasFee = ({ gasLimit, baseFeeGwei, priorityTipGwei, maxFeeGwei, ethUsd }) => {
  const normalizedGasLimit = Math.max(0, toFiniteNumber(gasLimit));
  const normalizedBaseFee = Math.max(0, toFiniteNumber(baseFeeGwei));
  const normalizedPriorityTip = Math.max(0, toFiniteNumber(priorityTipGwei));
  const normalizedMaxFee = Math.max(0, toFiniteNumber(maxFeeGwei));
  const normalizedEthUsd = Math.max(0, toFiniteNumber(ethUsd));

  const requestedGasPriceGwei = normalizedBaseFee + normalizedPriorityTip;
  const effectiveGasPriceGwei = Math.min(normalizedMaxFee, requestedGasPriceGwei);
  const totalEth = (normalizedGasLimit * effectiveGasPriceGwei) / GWEI_PER_ETH;

  return {
    requestedGasPriceGwei,
    effectiveGasPriceGwei,
    totalEth,
    totalUsd: totalEth * normalizedEthUsd,
    isCapped: normalizedMaxFee < requestedGasPriceGwei,
    isUnderBaseFee: normalizedMaxFee < normalizedBaseFee,
  };
};

export const fetchBaseFeeGwei = async (fetchImpl = globalThis.fetch, rpcUrl = DEFAULT_RPC_URL) => {
  if (typeof fetchImpl !== 'function') {
    throw new Error('Fetch API is not available');
  }

  const response = await fetchImpl(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_feeHistory',
      params: ['0x1', 'latest', []],
    }),
  });

  if (!response.ok) {
    throw new Error(`RPC returned ${response.status}`);
  }

  const payload = await response.json();
  const baseFeeHex = payload?.result?.baseFeePerGas?.at(-1);
  if (!baseFeeHex) {
    throw new Error('RPC response did not include baseFeePerGas');
  }

  return weiHexToGwei(baseFeeHex);
};

export const fetchEthUsd = async (
  fetchImpl = globalThis.fetch,
  now = Date.now(),
  priceUrl = ETH_PRICE_URL
) => {
  if (cachedEthUsd && now - cachedEthUsdAt < ETH_PRICE_CACHE_MS) {
    return { value: cachedEthUsd, source: 'cache' };
  }

  if (typeof fetchImpl !== 'function') {
    return { value: cachedEthUsd || DEFAULT_ETH_USD, source: 'fallback' };
  }

  const response = await fetchImpl(priceUrl);

  if (response.status === 429) {
    return { value: cachedEthUsd || DEFAULT_ETH_USD, source: 'rate-limit' };
  }

  if (!response.ok) {
    return { value: cachedEthUsd || DEFAULT_ETH_USD, source: 'fallback' };
  }

  const payload = await response.json();
  const price = Number(payload?.ethereum?.usd);

  if (!Number.isFinite(price) || price <= 0) {
    return { value: cachedEthUsd || DEFAULT_ETH_USD, source: 'fallback' };
  }

  cachedEthUsd = price;
  cachedEthUsdAt = now;

  return { value: price, source: 'live' };
};

export const resetGasFeeCacheForTests = () => {
  cachedEthUsd = null;
  cachedEthUsdAt = 0;
};
