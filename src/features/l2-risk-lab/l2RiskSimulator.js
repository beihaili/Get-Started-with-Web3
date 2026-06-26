export const BRIDGE_NATIVE_OPTIMISTIC = 'native-optimistic';
export const BRIDGE_NATIVE_ZK = 'native-zk';
export const BRIDGE_EXTERNAL_VALIDATOR = 'external-validator';
export const BRIDGE_GENERAL_MESSAGE = 'general-message';
export const BRIDGE_LIQUIDITY_NETWORK = 'liquidity-network';

export const DIRECTION_DEPOSIT = 'deposit';
export const DIRECTION_WITHDRAW = 'withdraw';
export const DIRECTION_MESSAGE = 'message';

export const AMOUNT_SMALL = 'small';
export const AMOUNT_MEDIUM = 'medium';
export const AMOUNT_LARGE = 'large';

export const SEQUENCER_NORMAL = 'normal';
export const SEQUENCER_DEGRADED = 'degraded';
export const INTEGRATION_LINKOUT = 'linkout';
export const INTEGRATION_EMBEDDED = 'embedded';

export const DEFAULT_L2_RISK_FORM = {
  bridgeType: BRIDGE_NATIVE_OPTIMISTIC,
  direction: DIRECTION_WITHDRAW,
  amountBand: AMOUNT_SMALL,
  sequencerStatus: SEQUENCER_NORMAL,
  integrationStyle: INTEGRATION_LINKOUT,
};

const BRIDGE_PROFILES = {
  [BRIDGE_NATIVE_OPTIMISTIC]: {
    titleKey: 'bridgeNativeOptimisticTitle',
    descriptionKey: 'bridgeNativeOptimisticDesc',
    baseScore: 3,
    finalityKeys: ['finalityL1Confirm', 'finalityChallengeWindow', 'finalityExitExecution'],
    trustKeys: ['trustL1Contracts', 'trustFraudProofs', 'trustUpgradeKeys'],
    messageKeys: ['messageLockMint', 'messageCanonicalMessenger'],
    failureKeys: ['failureChallengeDelay', 'failureSequencerDowntime', 'failureUpgradeRisk'],
    checklistKeys: ['checkOfficialBridge', 'checkWithdrawalDelay', 'checkSmallTest'],
  },
  [BRIDGE_NATIVE_ZK]: {
    titleKey: 'bridgeNativeZkTitle',
    descriptionKey: 'bridgeNativeZkDesc',
    baseScore: 2,
    finalityKeys: ['finalityL1Confirm', 'finalityValidityProof', 'finalityExitExecution'],
    trustKeys: ['trustL1Contracts', 'trustValidityProofs', 'trustUpgradeKeys'],
    messageKeys: ['messageLockMint', 'messageProofVerified'],
    failureKeys: ['failureProverDelay', 'failureSequencerDowntime', 'failureUpgradeRisk'],
    checklistKeys: ['checkOfficialBridge', 'checkProofStatus', 'checkSmallTest'],
  },
  [BRIDGE_EXTERNAL_VALIDATOR]: {
    titleKey: 'bridgeExternalValidatorTitle',
    descriptionKey: 'bridgeExternalValidatorDesc',
    baseScore: 6,
    finalityKeys: ['finalitySourceConfirm', 'finalityValidatorAttest', 'finalityDestinationMint'],
    trustKeys: ['trustExternalSet', 'trustBridgeContracts', 'trustOperationalKeys'],
    messageKeys: ['messageLockMint', 'messageExternalAttestation'],
    failureKeys: ['failureValidatorCompromise', 'failureWrappedAsset', 'failureContractBug'],
    checklistKeys: ['checkValidatorSet', 'checkBridgeHistory', 'checkLimitAmount'],
  },
  [BRIDGE_GENERAL_MESSAGE]: {
    titleKey: 'bridgeGeneralMessageTitle',
    descriptionKey: 'bridgeGeneralMessageDesc',
    baseScore: 5,
    finalityKeys: [
      'finalitySourceConfirm',
      'finalityRelayerDelivery',
      'finalityDestinationExecute',
    ],
    trustKeys: ['trustOracleRelayer', 'trustAppConfig', 'trustBridgeContracts'],
    messageKeys: ['messageArbitraryData', 'messageAppExecution'],
    failureKeys: ['failureMisconfiguredPath', 'failureRelayerDelay', 'failureAppBug'],
    checklistKeys: ['checkMessageConfig', 'checkReplayProtection', 'checkFallbackPath'],
  },
  [BRIDGE_LIQUIDITY_NETWORK]: {
    titleKey: 'bridgeLiquidityTitle',
    descriptionKey: 'bridgeLiquidityDesc',
    baseScore: 4,
    finalityKeys: ['finalityLiquidityFill', 'finalitySettlementLater', 'finalityCanonicalBackstop'],
    trustKeys: ['trustLiquidityProvider', 'trustRouteSolvency', 'trustBridgeContracts'],
    messageKeys: ['messageAtomicSwap', 'messageNoArbitraryCall'],
    failureKeys: ['failureLiquidityShortage', 'failurePriceSlippage', 'failureRouteDispute'],
    checklistKeys: ['checkLiquidityDepth', 'checkCanonicalBackstop', 'checkSmallTest'],
  },
};

const VALID_BRIDGE_TYPES = new Set(Object.keys(BRIDGE_PROFILES));
const VALID_DIRECTIONS = new Set([DIRECTION_DEPOSIT, DIRECTION_WITHDRAW, DIRECTION_MESSAGE]);
const VALID_AMOUNT_BANDS = new Set([AMOUNT_SMALL, AMOUNT_MEDIUM, AMOUNT_LARGE]);
const VALID_SEQUENCER_STATUS = new Set([SEQUENCER_NORMAL, SEQUENCER_DEGRADED]);
const VALID_INTEGRATION_STYLES = new Set([INTEGRATION_LINKOUT, INTEGRATION_EMBEDDED]);

function normalizeChoice(value, validValues, fallback) {
  return validValues.has(value) ? value : fallback;
}

function amountModifier(amountBand) {
  if (amountBand === AMOUNT_LARGE) return 2;
  if (amountBand === AMOUNT_MEDIUM) return 1;
  return 0;
}

function directionModifier({ bridgeType, direction }) {
  if (direction === DIRECTION_MESSAGE && bridgeType !== BRIDGE_GENERAL_MESSAGE) {
    return 1;
  }

  if (direction === DIRECTION_WITHDRAW && bridgeType === BRIDGE_NATIVE_OPTIMISTIC) {
    return 1;
  }

  return 0;
}

export function getRiskLevel(score) {
  if (score >= 8) return 'critical';
  if (score >= 6) return 'high';
  if (score >= 4) return 'medium';
  return 'low';
}

export function buildRiskModifiers({
  bridgeType,
  direction,
  amountBand,
  sequencerStatus,
  integrationStyle,
}) {
  const modifiers = [
    {
      key: 'modifierAmount',
      points: amountModifier(amountBand),
    },
    {
      key: 'modifierDirection',
      points: directionModifier({ bridgeType, direction }),
    },
    {
      key: 'modifierSequencer',
      points: sequencerStatus === SEQUENCER_DEGRADED ? 2 : 0,
    },
    {
      key: 'modifierIntegration',
      points: integrationStyle === INTEGRATION_EMBEDDED ? 1 : 0,
    },
  ];

  return modifiers.filter((modifier) => modifier.points > 0);
}

export function buildBridgeComparison() {
  return Object.entries(BRIDGE_PROFILES).map(([bridgeType, profile]) => {
    const level = getRiskLevel(profile.baseScore);
    return {
      bridgeType,
      titleKey: profile.titleKey,
      descriptionKey: profile.descriptionKey,
      baseScore: profile.baseScore,
      level,
      primaryTrustKey: profile.trustKeys[0],
      primaryFailureKey: profile.failureKeys[0],
    };
  });
}

export function buildL2RiskSimulation(input = {}) {
  const form = { ...DEFAULT_L2_RISK_FORM, ...input };
  const bridgeType = normalizeChoice(
    form.bridgeType,
    VALID_BRIDGE_TYPES,
    DEFAULT_L2_RISK_FORM.bridgeType
  );
  const direction = normalizeChoice(
    form.direction,
    VALID_DIRECTIONS,
    DEFAULT_L2_RISK_FORM.direction
  );
  const amountBand = normalizeChoice(
    form.amountBand,
    VALID_AMOUNT_BANDS,
    DEFAULT_L2_RISK_FORM.amountBand
  );
  const sequencerStatus = normalizeChoice(
    form.sequencerStatus,
    VALID_SEQUENCER_STATUS,
    DEFAULT_L2_RISK_FORM.sequencerStatus
  );
  const integrationStyle = normalizeChoice(
    form.integrationStyle,
    VALID_INTEGRATION_STYLES,
    DEFAULT_L2_RISK_FORM.integrationStyle
  );
  const profile = BRIDGE_PROFILES[bridgeType];
  const modifiers = buildRiskModifiers({
    bridgeType,
    direction,
    amountBand,
    sequencerStatus,
    integrationStyle,
  });
  const score = profile.baseScore + modifiers.reduce((sum, modifier) => sum + modifier.points, 0);
  const level = getRiskLevel(score);

  const failureKeys = [...profile.failureKeys];
  if (sequencerStatus === SEQUENCER_DEGRADED) {
    failureKeys.unshift('failureSequencerCurrentlyDegraded');
  }
  if (integrationStyle === INTEGRATION_EMBEDDED) {
    failureKeys.push('failureIntegrationDependency');
  }

  return {
    bridgeType,
    direction,
    amountBand,
    sequencerStatus,
    integrationStyle,
    titleKey: profile.titleKey,
    descriptionKey: profile.descriptionKey,
    score,
    level,
    modifiers,
    finalityKeys: profile.finalityKeys,
    trustKeys: profile.trustKeys,
    messageKeys: profile.messageKeys,
    failureKeys,
    checklistKeys: profile.checklistKeys,
    comparison: buildBridgeComparison(),
  };
}
