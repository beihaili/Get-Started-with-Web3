import { describe, expect, it } from 'vitest';
import {
  AA_ACTION_SESSION_KEY,
  AA_DEFAULT_FORM,
  AA_MODE_EIP_7702,
  EIP_7702_FACTORY_FLAG,
  ZERO_ADDRESS,
  buildNonce,
  buildUserOperationSimulation,
  encodePseudoCallData,
  estimateMaxCostWei,
  formatEthFromWei,
  isValidAddress,
} from '../userOperationSimulator';

describe('userOperationSimulator', () => {
  it('builds a default smart-account UserOperation draft', () => {
    const simulation = buildUserOperationSimulation();

    expect(simulation.mode).toBe('smart-account');
    expect(simulation.userOperation.sender).toBe(AA_DEFAULT_FORM.sender);
    expect(simulation.userOperation.factory).toBe(AA_DEFAULT_FORM.factory);
    expect(simulation.userOperation.paymaster).toBe(ZERO_ADDRESS);
    expect(simulation.userOperation.callData).toMatch(/^0x[0-9a-f]+$/);
    expect(simulation.steps).toEqual([
      'stepIntent',
      'stepBundlerSimulation',
      'stepEntryPointValidation',
      'stepFactoryDeployment',
      'stepExecution',
      'stepRefund',
    ]);
    expect(simulation.passed).toBe(true);
  });

  it('adds paymaster fields and warnings when sponsorship is enabled', () => {
    const simulation = buildUserOperationSimulation({ usePaymaster: true });

    expect(simulation.userOperation.paymaster).toBe(AA_DEFAULT_FORM.paymaster);
    expect(simulation.userOperation.paymasterData).toContain('0x');
    expect(simulation.steps).toContain('stepPaymasterValidation');
    expect(simulation.checks).toContainEqual({
      key: 'checkPaymasterPolicy',
      status: 'warning',
    });
  });

  it('models EIP-7702 as an authorization tuple outside the UserOperation', () => {
    const simulation = buildUserOperationSimulation({
      mode: AA_MODE_EIP_7702,
      needsDeployment: true,
    });

    expect(simulation.needsDeployment).toBe(false);
    expect(simulation.userOperation.factory).toBe(EIP_7702_FACTORY_FLAG);
    expect(simulation.eip7702Auth).toEqual({
      chainId: '11155111',
      address: AA_DEFAULT_FORM.delegate,
      nonce: String(AA_DEFAULT_FORM.nonceSequence),
      yParity: '0x0',
      r: '0x<authorization-r-placeholder>',
      s: '0x<authorization-s-placeholder>',
    });
    expect(simulation.steps).toContain('step7702Authorization');
    expect(simulation.steps).not.toContain('stepFactoryDeployment');
  });

  it('marks invalid addresses as failed checks without throwing', () => {
    const simulation = buildUserOperationSimulation({
      sender: '0xnot-an-address',
      usePaymaster: true,
      paymaster: 'bad-paymaster',
    });

    expect(simulation.passed).toBe(false);
    expect(simulation.checks).toContainEqual({ key: 'checkSender', status: 'fail' });
    expect(simulation.checks).toContainEqual({ key: 'checkPaymasterAddress', status: 'fail' });
  });

  it('warns when a session key lasts longer than the learning-safe window', () => {
    const simulation = buildUserOperationSimulation({
      action: AA_ACTION_SESSION_KEY,
      sessionMinutes: 180,
    });

    expect(simulation.callDataLabelKey).toBe('callDataSessionKey');
    expect(simulation.checks).toContainEqual({ key: 'checkSessionScope', status: 'warning' });
  });

  it('encodes nonce key and sequence into one uint256-like decimal string', () => {
    expect(buildNonce({ key: 2, sequence: 7 }).toString()).toBe('36893488147419103239');
  });

  it('formats educational gas estimates deterministically', () => {
    const gas = {
      callGasLimit: 100000,
      verificationGasLimit: 100000,
      preVerificationGas: 50000,
      paymasterVerificationGasLimit: 50000,
      paymasterPostOpGasLimit: 25000,
      maxFeePerGasGwei: 20,
    };

    const wei = estimateMaxCostWei({ gas, usePaymaster: true });

    expect(wei.toString()).toBe('6500000000000000');
    expect(formatEthFromWei(wei)).toBe('0.0065');
  });

  it('keeps address and pseudo calldata helpers strict enough for display use', () => {
    expect(isValidAddress(AA_DEFAULT_FORM.sender)).toBe(true);
    expect(isValidAddress('0x1234')).toBe(false);
    expect(encodePseudoCallData(['hello', 'world'])).toBe('0x68656c6c6f7c776f726c64');
  });
});
