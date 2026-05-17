import { describe, expect, it } from 'vitest';
import { calculateGasFee, weiHexToGwei } from '../gasFee';

describe('gasFee', () => {
  it('calculates EIP-1559 effective gas price and total cost', () => {
    const result = calculateGasFee({
      gasLimit: 21000,
      baseFeeGwei: 20,
      priorityTipGwei: 1.5,
      maxFeeGwei: 30,
      ethUsd: 3000,
    });

    expect(result.requestedGasPriceGwei).toBe(21.5);
    expect(result.effectiveGasPriceGwei).toBe(21.5);
    expect(result.totalEth).toBeCloseTo(0.0004515, 10);
    expect(result.totalUsd).toBeCloseTo(1.3545, 4);
    expect(result.isCapped).toBe(false);
    expect(result.isUnderBaseFee).toBe(false);
  });

  it('caps the effective gas price when max fee is below base fee plus tip', () => {
    const result = calculateGasFee({
      gasLimit: 21000,
      baseFeeGwei: 20,
      priorityTipGwei: 2,
      maxFeeGwei: 21,
      ethUsd: 3000,
    });

    expect(result.requestedGasPriceGwei).toBe(22);
    expect(result.effectiveGasPriceGwei).toBe(21);
    expect(result.totalEth).toBeCloseTo(0.000441, 10);
    expect(result.isCapped).toBe(true);
    expect(result.isUnderBaseFee).toBe(false);
  });

  it('converts hex wei values to gwei', () => {
    expect(weiHexToGwei('0x6fc23ac00')).toBe(30);
  });
});
