import { shortenAddress } from '../wallet-lab/walletLabUtils';

export const AA_MODE_SMART_ACCOUNT = 'smart-account';
export const AA_MODE_EIP_7702 = 'eip-7702';

export const AA_ACTION_TRANSFER = 'transfer';
export const AA_ACTION_BATCH = 'batch';
export const AA_ACTION_SESSION_KEY = 'session-key';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const EIP_7702_FACTORY_FLAG = '0x7702000000000000000000000000000000000000';

export const AA_DEFAULT_FORM = {
  mode: AA_MODE_SMART_ACCOUNT,
  action: AA_ACTION_BATCH,
  sender: '0x1111111111111111111111111111111111111111',
  target: '0x2222222222222222222222222222222222222222',
  factory: '0x3333333333333333333333333333333333333333',
  paymaster: '0x4444444444444444444444444444444444444444',
  delegate: '0x5555555555555555555555555555555555555555',
  needsDeployment: true,
  usePaymaster: false,
  nonceKey: 0,
  nonceSequence: 7,
  valueEth: '0.01',
  sessionMinutes: 15,
  callGasLimit: 120000,
  verificationGasLimit: 160000,
  preVerificationGas: 52000,
  paymasterVerificationGasLimit: 90000,
  paymasterPostOpGasLimit: 45000,
  maxFeePerGasGwei: 30,
  maxPriorityFeePerGasGwei: 2,
};

const VALID_MODES = new Set([AA_MODE_SMART_ACCOUNT, AA_MODE_EIP_7702]);
const VALID_ACTIONS = new Set([AA_ACTION_TRANSFER, AA_ACTION_BATCH, AA_ACTION_SESSION_KEY]);
const WEI_PER_GWEI = 1_000_000_000n;
const WEI_PER_ETH = 1_000_000_000_000_000_000n;

export function isValidAddress(address) {
  return typeof address === 'string' && /^0x[a-fA-F0-9]{40}$/.test(address.trim());
}

export function normalizeAddress(address, fallback = ZERO_ADDRESS) {
  const trimmed = String(address || '').trim();
  return isValidAddress(trimmed) ? trimmed : fallback;
}

export function toBoundedInteger(
  value,
  { min = 0, max = Number.MAX_SAFE_INTEGER, fallback = 0 } = {}
) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.trunc(parsed)));
}

export function buildNonce({ key = 0, sequence = 0 } = {}) {
  const normalizedKey = BigInt(toBoundedInteger(key, { min: 0, max: 999999, fallback: 0 }));
  const normalizedSequence = BigInt(
    toBoundedInteger(sequence, { min: 0, max: 999999, fallback: 0 })
  );

  return (normalizedKey << 64n) + normalizedSequence;
}

export function encodePseudoCallData(parts = []) {
  const text = parts.map((part) => String(part)).join('|');
  const bytes = Array.from(text, (char) => char.charCodeAt(0) & 0xff);
  return `0x${bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('')}`;
}

function normalizeMode(mode) {
  return VALID_MODES.has(mode) ? mode : AA_MODE_SMART_ACCOUNT;
}

function normalizeAction(action) {
  return VALID_ACTIONS.has(action) ? action : AA_ACTION_BATCH;
}

function normalizeGas(form) {
  const maxFeePerGasGwei = toBoundedInteger(form.maxFeePerGasGwei, {
    min: 1,
    max: 500,
    fallback: AA_DEFAULT_FORM.maxFeePerGasGwei,
  });
  const maxPriorityFeePerGasGwei = toBoundedInteger(form.maxPriorityFeePerGasGwei, {
    min: 0,
    max: 100,
    fallback: AA_DEFAULT_FORM.maxPriorityFeePerGasGwei,
  });

  return {
    callGasLimit: toBoundedInteger(form.callGasLimit, {
      min: 21000,
      max: 2000000,
      fallback: AA_DEFAULT_FORM.callGasLimit,
    }),
    verificationGasLimit: toBoundedInteger(form.verificationGasLimit, {
      min: 50000,
      max: 2000000,
      fallback: AA_DEFAULT_FORM.verificationGasLimit,
    }),
    preVerificationGas: toBoundedInteger(form.preVerificationGas, {
      min: 21000,
      max: 500000,
      fallback: AA_DEFAULT_FORM.preVerificationGas,
    }),
    paymasterVerificationGasLimit: toBoundedInteger(form.paymasterVerificationGasLimit, {
      min: 0,
      max: 1000000,
      fallback: AA_DEFAULT_FORM.paymasterVerificationGasLimit,
    }),
    paymasterPostOpGasLimit: toBoundedInteger(form.paymasterPostOpGasLimit, {
      min: 0,
      max: 1000000,
      fallback: AA_DEFAULT_FORM.paymasterPostOpGasLimit,
    }),
    maxFeePerGasGwei,
    maxPriorityFeePerGasGwei,
  };
}

export function buildActionCallData({ action, target, valueEth, sessionMinutes } = {}) {
  const normalizedAction = normalizeAction(action);
  const normalizedTarget = normalizeAddress(target);

  if (normalizedAction === AA_ACTION_TRANSFER) {
    return {
      callData: encodePseudoCallData([
        'execute',
        'transfer-native-token',
        normalizedTarget,
        valueEth,
      ]),
      labelKey: 'callDataTransfer',
    };
  }

  if (normalizedAction === AA_ACTION_SESSION_KEY) {
    return {
      callData: encodePseudoCallData([
        'execute',
        'install-session-key',
        normalizedTarget,
        `${sessionMinutes}-minutes`,
      ]),
      labelKey: 'callDataSessionKey',
    };
  }

  return {
    callData: encodePseudoCallData([
      'execute-batch',
      'transfer-native-token',
      normalizedTarget,
      valueEth,
      'approve-limited-spend',
      normalizedTarget,
    ]),
    labelKey: 'callDataBatch',
  };
}

function toWeiStringFromGwei(gwei) {
  return (BigInt(gwei) * WEI_PER_GWEI).toString();
}

export function estimateMaxCostWei({ gas, usePaymaster }) {
  const totalGas =
    BigInt(gas.callGasLimit) +
    BigInt(gas.verificationGasLimit) +
    BigInt(gas.preVerificationGas) +
    (usePaymaster
      ? BigInt(gas.paymasterVerificationGasLimit) + BigInt(gas.paymasterPostOpGasLimit)
      : 0n);

  return totalGas * BigInt(gas.maxFeePerGasGwei) * WEI_PER_GWEI;
}

export function formatEthFromWei(wei) {
  const value = typeof wei === 'bigint' ? wei : BigInt(String(wei || 0));
  const whole = value / WEI_PER_ETH;
  const fraction = (value % WEI_PER_ETH).toString().padStart(18, '0').slice(0, 6);
  const trimmedFraction = fraction.replace(/0+$/, '') || '0';

  return `${whole.toString()}.${trimmedFraction}`;
}

export function buildSimulationSteps({ mode, usePaymaster, needsDeployment }) {
  const steps = ['stepIntent', 'stepBundlerSimulation', 'stepEntryPointValidation'];

  if (mode === AA_MODE_EIP_7702) {
    steps.splice(1, 0, 'step7702Authorization');
  }

  if (needsDeployment) {
    steps.push('stepFactoryDeployment');
  }

  if (usePaymaster) {
    steps.push('stepPaymasterValidation');
  }

  steps.push('stepExecution', 'stepRefund');
  return steps;
}

export function inspectUserOperationDraft({
  mode,
  action,
  usePaymaster,
  needsDeployment,
  form,
  gas,
}) {
  const checks = [
    {
      key: 'checkSender',
      status: isValidAddress(form.sender) ? 'pass' : 'fail',
    },
    {
      key: 'checkTarget',
      status: isValidAddress(form.target) ? 'pass' : 'fail',
    },
    {
      key: 'checkGasFees',
      status: gas.maxFeePerGasGwei >= gas.maxPriorityFeePerGasGwei ? 'pass' : 'fail',
    },
    {
      key: 'checkGasLimits',
      status: gas.callGasLimit >= 50000 && gas.verificationGasLimit >= 80000 ? 'pass' : 'warning',
    },
    {
      key: 'checkSignaturePlaceholder',
      status: 'warning',
    },
  ];

  if (needsDeployment) {
    checks.push({
      key: 'checkFactory',
      status: isValidAddress(form.factory) ? 'pass' : 'fail',
    });
  }

  if (usePaymaster) {
    checks.push(
      {
        key: 'checkPaymasterAddress',
        status: isValidAddress(form.paymaster) ? 'pass' : 'fail',
      },
      {
        key: 'checkPaymasterPolicy',
        status: 'warning',
      }
    );
  }

  if (mode === AA_MODE_EIP_7702) {
    checks.push(
      {
        key: 'checkDelegate',
        status: isValidAddress(form.delegate) ? 'pass' : 'fail',
      },
      {
        key: 'check7702Revocation',
        status: 'warning',
      }
    );
  }

  if (action === AA_ACTION_SESSION_KEY) {
    checks.push({
      key: 'checkSessionScope',
      status:
        toBoundedInteger(form.sessionMinutes, { min: 1, max: 1440, fallback: 0 }) <= 60
          ? 'pass'
          : 'warning',
    });
  }

  return {
    checks,
    passed: checks.every((check) => check.status !== 'fail'),
  };
}

export function buildUserOperationSimulation(input = {}) {
  const form = { ...AA_DEFAULT_FORM, ...input };
  const mode = normalizeMode(form.mode);
  const action = normalizeAction(form.action);
  const gas = normalizeGas(form);
  const usePaymaster = Boolean(form.usePaymaster);
  const needsDeployment = mode === AA_MODE_SMART_ACCOUNT && Boolean(form.needsDeployment);
  const sender = normalizeAddress(form.sender, form.sender);
  const target = normalizeAddress(form.target, form.target);
  const factory = needsDeployment ? normalizeAddress(form.factory, form.factory) : ZERO_ADDRESS;
  const paymaster = usePaymaster ? normalizeAddress(form.paymaster, form.paymaster) : ZERO_ADDRESS;
  const delegate = normalizeAddress(form.delegate, form.delegate);
  const nonce = buildNonce({ key: form.nonceKey, sequence: form.nonceSequence }).toString();
  const { callData, labelKey } = buildActionCallData({
    action,
    target,
    valueEth: form.valueEth,
    sessionMinutes: form.sessionMinutes,
  });

  const userOperation = {
    sender,
    nonce,
    factory: mode === AA_MODE_EIP_7702 ? EIP_7702_FACTORY_FLAG : factory,
    factoryData:
      mode === AA_MODE_EIP_7702
        ? encodePseudoCallData(['eip7702-delegate', delegate])
        : needsDeployment
          ? encodePseudoCallData(['create-smart-account', sender])
          : '0x',
    callData,
    callGasLimit: String(gas.callGasLimit),
    verificationGasLimit: String(gas.verificationGasLimit),
    preVerificationGas: String(gas.preVerificationGas),
    maxFeePerGas: toWeiStringFromGwei(gas.maxFeePerGasGwei),
    maxPriorityFeePerGas: toWeiStringFromGwei(gas.maxPriorityFeePerGasGwei),
    paymaster,
    paymasterVerificationGasLimit: usePaymaster ? String(gas.paymasterVerificationGasLimit) : '0',
    paymasterPostOpGasLimit: usePaymaster ? String(gas.paymasterPostOpGasLimit) : '0',
    paymasterData: usePaymaster ? encodePseudoCallData(['demo-policy', 'one-learning-op']) : '0x',
    signature: '0x<account-defined-signature-placeholder>',
  };

  const eip7702Auth =
    mode === AA_MODE_EIP_7702
      ? {
          chainId: '11155111',
          address: delegate,
          nonce: String(toBoundedInteger(form.nonceSequence, { min: 0, fallback: 0 })),
          yParity: '0x0',
          r: '0x<authorization-r-placeholder>',
          s: '0x<authorization-s-placeholder>',
        }
      : null;

  const inspection = inspectUserOperationDraft({
    mode,
    action,
    usePaymaster,
    needsDeployment,
    form,
    gas,
  });
  const maxCostWei = estimateMaxCostWei({ gas, usePaymaster });

  return {
    mode,
    action,
    gas,
    usePaymaster,
    needsDeployment,
    userOperation,
    eip7702Auth,
    callDataLabelKey: labelKey,
    steps: buildSimulationSteps({ mode, usePaymaster, needsDeployment }),
    checks: inspection.checks,
    passed: inspection.passed,
    maxCostWei: maxCostWei.toString(),
    maxCostEth: formatEthFromWei(maxCostWei),
  };
}

export function formatAddressPreview(address) {
  return shortenAddress(address);
}
