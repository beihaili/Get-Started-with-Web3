import { describe, expect, it } from 'vitest';
import {
  AMOUNT_LARGE,
  BRIDGE_EXTERNAL_VALIDATOR,
  BRIDGE_GENERAL_MESSAGE,
  BRIDGE_NATIVE_OPTIMISTIC,
  DIRECTION_MESSAGE,
  INTEGRATION_EMBEDDED,
  SEQUENCER_DEGRADED,
  buildBridgeComparison,
  buildL2RiskSimulation,
  getRiskLevel,
} from '../l2RiskSimulator';

describe('l2RiskSimulator', () => {
  it('builds a default optimistic withdrawal risk profile', () => {
    const simulation = buildL2RiskSimulation();

    expect(simulation.bridgeType).toBe(BRIDGE_NATIVE_OPTIMISTIC);
    expect(simulation.level).toBe('medium');
    expect(simulation.score).toBe(4);
    expect(simulation.finalityKeys).toContain('finalityChallengeWindow');
    expect(simulation.trustKeys).toContain('trustFraudProofs');
    expect(simulation.checklistKeys).toContain('checkWithdrawalDelay');
  });

  it('scores external validator bridges as high risk for large embedded transfers', () => {
    const simulation = buildL2RiskSimulation({
      bridgeType: BRIDGE_EXTERNAL_VALIDATOR,
      amountBand: AMOUNT_LARGE,
      integrationStyle: INTEGRATION_EMBEDDED,
    });

    expect(simulation.level).toBe('critical');
    expect(simulation.score).toBe(9);
    expect(simulation.trustKeys).toContain('trustExternalSet');
    expect(simulation.failureKeys).toContain('failureValidatorCompromise');
    expect(simulation.failureKeys).toContain('failureIntegrationDependency');
  });

  it('adds degraded sequencer risk when the route depends on L2 liveness', () => {
    const simulation = buildL2RiskSimulation({
      sequencerStatus: SEQUENCER_DEGRADED,
    });

    expect(simulation.score).toBe(6);
    expect(simulation.level).toBe('high');
    expect(simulation.modifiers).toContainEqual({ key: 'modifierSequencer', points: 2 });
    expect(simulation.failureKeys[0]).toBe('failureSequencerCurrentlyDegraded');
  });

  it('keeps generalized messaging routes focused on arbitrary data and app execution', () => {
    const simulation = buildL2RiskSimulation({
      bridgeType: BRIDGE_GENERAL_MESSAGE,
      direction: DIRECTION_MESSAGE,
    });

    expect(simulation.messageKeys).toEqual(['messageArbitraryData', 'messageAppExecution']);
    expect(simulation.trustKeys).toContain('trustAppConfig');
    expect(simulation.modifiers.some((modifier) => modifier.key === 'modifierDirection')).toBe(
      false
    );
  });

  it('falls back to safe defaults for unknown input values', () => {
    const simulation = buildL2RiskSimulation({
      bridgeType: 'unknown',
      direction: 'weird',
      amountBand: 'giant',
      sequencerStatus: 'offline',
      integrationStyle: 'magic',
    });

    expect(simulation.bridgeType).toBe(BRIDGE_NATIVE_OPTIMISTIC);
    expect(simulation.direction).toBe('withdraw');
    expect(simulation.amountBand).toBe('small');
    expect(simulation.sequencerStatus).toBe('normal');
    expect(simulation.integrationStyle).toBe('linkout');
  });

  it('builds a comparison table for every supported bridge profile', () => {
    const comparison = buildBridgeComparison();

    expect(comparison).toHaveLength(5);
    expect(comparison.map((item) => item.bridgeType)).toContain(BRIDGE_EXTERNAL_VALIDATOR);
    expect(
      comparison.every((item) => ['low', 'medium', 'high', 'critical'].includes(item.level))
    ).toBe(true);
  });

  it('maps numeric scores to risk levels', () => {
    expect(getRiskLevel(2)).toBe('low');
    expect(getRiskLevel(4)).toBe('medium');
    expect(getRiskLevel(6)).toBe('high');
    expect(getRiskLevel(8)).toBe('critical');
  });
});
