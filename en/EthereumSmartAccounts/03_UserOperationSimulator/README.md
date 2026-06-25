# UserOperation Simulator and Account Abstraction Practice

> Account abstraction becomes easier to understand once you can see the object that moves through the system. ERC-4337 does not send a normal Ethereum transaction from the user. It sends a `UserOperation` to a bundler, and the bundler submits it to `EntryPoint`.

Last reviewed: 2026-06-25

## Table of Contents

- [Why This Lab Exists](#why-this-lab-exists)
- [The ERC-4337 Mental Model](#the-erc-4337-mental-model)
- [UserOperation Anatomy](#useroperation-anatomy)
- [Bundlers, EntryPoint, and Paymasters](#bundlers-entrypoint-and-paymasters)
- [Smart Accounts and Recovery](#smart-accounts-and-recovery)
- [EIP-7702 Delegated EOAs](#eip-7702-delegated-eoas)
- [Safety and Sponsorship Risks](#safety-and-sponsorship-risks)
- [Hands-On Lab](#hands-on-lab)
- [Checklist](#checklist)
- [Further Reading](#further-reading)

## Why This Lab Exists

The previous smart-account lesson explains the concepts. This lesson makes them concrete.

The goal is not to connect to a live bundler or sponsor real gas. The goal is to answer:

- What fields appear in a modern `UserOperation`?
- Which actor validates the account?
- Where does a paymaster fit?
- How does a first-use smart-account deployment differ from an EIP-7702 delegated EOA?
- Why is "free gas" still a policy and security decision?

The simulator is local-only. It creates an educational draft with pseudo calldata and placeholder signatures, so learners cannot accidentally send it as a real operation.

## The ERC-4337 Mental Model

[ERC-4337](https://eips.ethereum.org/EIPS/eip-4337) defines account abstraction without changing Ethereum consensus rules. Instead of the user directly sending a normal transaction, the app prepares a `UserOperation`.

A simplified flow looks like this:

1. The user expresses intent: transfer, batch calls, install a permission, or recover an account.
2. The app builds a `UserOperation`.
3. The account signs according to its own validation rules.
4. A bundler simulates the operation before accepting it.
5. The bundler submits a bundle to `EntryPoint`.
6. `EntryPoint` validates, executes, refunds unused gas, and pays the bundler beneficiary.

The important shift is that validation logic moves from fixed EOA protocol rules into account code.

## UserOperation Anatomy

Modern ERC-4337 separates account deployment, calldata, gas limits, fees, paymaster fields, and signature fields. The exact packing differs between off-chain JSON-RPC and on-chain `PackedUserOperation`, but the learner-facing shape is:

| Field | Meaning |
| --- | --- |
| `sender` | The smart account or delegated EOA making the operation |
| `nonce` | Replay protection and ordering; ERC-4337 supports key + sequence patterns |
| `factory` / `factoryData` | Optional first-use smart-account deployment, or the EIP-7702 flag path |
| `callData` | The account-specific execution payload |
| `callGasLimit` | Gas reserved for the main execution call |
| `verificationGasLimit` | Gas reserved for account validation |
| `preVerificationGas` | Gas paid to compensate bundler overhead |
| `maxFeePerGas` / `maxPriorityFeePerGas` | Fee caps similar to EIP-1559 |
| `paymaster` and paymaster gas/data fields | Optional sponsorship or alternative fee policy |
| `signature` | Account-defined authorization data |

The signature is intentionally abstract. A smart account may use ECDSA, multisig, passkeys, a session key module, a guardian recovery flow, or another scheme.

## Bundlers, EntryPoint, and Paymasters

A bundler is not just a relay. It accepts unpaid computation risk during simulation, so it must protect itself from invalid or abusive operations.

The minimum mental model:

- **Bundler:** watches the UserOperation mempool, simulates operations, builds a transaction, and submits it.
- **EntryPoint:** the shared contract that calls account validation and execution.
- **Paymaster:** a contract or service that agrees to pay gas under a policy.
- **Factory:** deploys a new smart account when `sender` does not exist yet.

[ERC-7562](https://eips.ethereum.org/EIPS/eip-7562) exists because validation code can be abused. It describes validation scope rules to protect account-abstraction nodes from denial-of-service attacks through unpaid computation.

## Smart Accounts and Recovery

A smart account can make wallets feel closer to real products:

- Batch actions into one approval flow.
- Sponsor gas for onboarding.
- Use guardians or delay windows for recovery.
- Support session keys with limited time, contract, function, and value scope.
- Rotate signers without moving every asset to a new address.

But programmable accounts also expand the risk surface. A recovery module, session key module, or plugin system becomes part of the account's security boundary.

## EIP-7702 Delegated EOAs

[EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) lets an EOA set code delegation through an authorization flow. In practice, that means an existing address can gain smart-account-like behavior without moving assets to a new contract account.

The simulator models this as:

- A normal `UserOperation` draft.
- An `eip7702Auth` object outside the `UserOperation`.
- A delegate contract address that the user must trust.
- A clear warning that delegation needs revocation and phishing protection.

This is powerful because it improves migration. It is risky because an unsafe delegate can affect future account behavior.

## Safety and Sponsorship Risks

Account abstraction improves UX, but it does not remove security design.

| Feature | UX benefit | Risk question |
| --- | --- | --- |
| Paymaster | User may not need native gas | Who pays, under what quota, and what happens on abuse? |
| Session key | Fewer repeated signatures | Is the key limited by time, target, function, and amount? |
| Recovery module | Safer device loss recovery | Can guardians or delays be socially engineered? |
| EIP-7702 delegation | Existing EOA keeps address history | Is the delegate contract trusted and revocable? |
| Bundler dependency | Smoother submission path | What happens if one bundler censors or fails? |

Never describe sponsored gas as "free" without explaining who funds it and what policy gates it.

## Hands-On Lab

Open:

- English: `/en/labs/account-abstraction`
- Chinese: `/zh/labs/account-abstraction`

Try this sequence:

1. Start with the default ERC-4337 smart-account mode.
2. Compare the batch action, transfer action, and session-key action.
3. Toggle "deploy account on first use" and inspect `factory` / `factoryData`.
4. Toggle "use a paymaster" and inspect sponsorship fields and warnings.
5. Switch to EIP-7702 mode and inspect the `eip7702Auth` object.
6. Change the sender to an invalid address and observe the local check failure.

The simulator output is not a production payload. It uses pseudo calldata, placeholder signatures, and example addresses so learners can focus on structure before connecting to real infrastructure.

## Checklist

After this lesson, you should be able to explain:

- How a `UserOperation` differs from a normal Ethereum transaction.
- Why the bundler must simulate before accepting an operation.
- What `EntryPoint`, Factory, Paymaster, and Smart Account each do.
- Why paymaster sponsorship requires policy, budgets, and abuse controls.
- How EIP-7702 delegated EOA behavior differs from deploying a new smart account.
- Why account abstraction improves UX but expands the security boundary.

## Further Reading

- [ERC-4337: Account Abstraction Using Alt Mempool](https://eips.ethereum.org/EIPS/eip-4337)
- [EIP-7702: Set Code for EOAs](https://eips.ethereum.org/EIPS/eip-7702)
- [ERC-7562: Account Abstraction Validation Scope Rules](https://eips.ethereum.org/EIPS/eip-7562)
- [ERC-4337 documentation](https://docs.erc4337.io/core-standards/erc-4337.html)
