# L2 and Bridge Risk Simulator

> A bridge is not just a transfer button. It is a bundle of finality assumptions, contracts, validators, relayers, liquidity providers, message formats, and failure paths. This lab helps you compare those assumptions before moving real value.

Last reviewed: 2026-06-25

## Table of Contents

- [Why Bridge Risk Needs A Simulator](#why-bridge-risk-needs-a-simulator)
- [The Four Questions](#the-four-questions)
- [Bridge Route Types](#bridge-route-types)
- [Finality Is Not The Same As UI Confirmation](#finality-is-not-the-same-as-ui-confirmation)
- [Message Passing And Failure Modes](#message-passing-and-failure-modes)
- [Hands-On Lab](#hands-on-lab)
- [Credential Boundary](#credential-boundary)
- [Checklist](#checklist)
- [Further Reading](#further-reading)

## Why Bridge Risk Needs A Simulator

Many learners compare bridges by speed and fee. That is useful, but incomplete.

A cross-chain route also has hidden questions:

- Which chain or contract is the trust anchor?
- Who can verify the source-chain event?
- How long does the route need before it is final?
- What happens if the sequencer, relayer, verifier, liquidity provider, or bridge contract fails?
- Is the app linking to a route, embedding a route, or interpreting cross-chain messages itself?

The `/labs/l2-risk` simulator turns these questions into a small risk model. It does not connect a wallet, submit bridge transactions, rank bridges, or recommend moving assets.

## The Four Questions

Before using any bridge or cross-chain message route, ask:

1. **Finality:** When is the source event really safe to act on?
2. **Trust:** Which contracts, validators, committees, provers, relayers, or governance keys must behave correctly?
3. **Message:** Is this an asset transfer, a wrapped asset, a liquidity fill, or arbitrary app calldata?
4. **Failure:** Who can retry, refund, challenge, pause, or rescue the route if something breaks?

The safest user flow is often boring: read the docs, test with a small amount, understand withdrawal delay, and prefer canonical paths for meaningful value.

## Bridge Route Types

[ethereum.org's bridge documentation](https://ethereum.org/en/developers/docs/bridges/) describes several bridge categories, including native bridges, externally verified bridges, message passing, and liquidity networks. The simulator uses a similar educational breakdown.

| Route type | Typical benefit | Main risk lens |
| --- | --- | --- |
| Native optimistic rollup bridge | Strong L1 anchoring | Challenge window, watcher availability, upgrade keys |
| Native ZK rollup bridge | Validity-proof based exits | Prover liveness, verifier bugs, upgrade keys |
| External validator bridge | Fast and flexible multi-chain support | Validator compromise, wrapped asset accounting |
| General message passing | App-specific cross-chain actions | Endpoint configuration, replay protection, relayer delay |
| Liquidity network / fast bridge | Fast user fills | Liquidity depth, solver settlement, canonical backstop |

This is not a ranking. A route can be appropriate for one use case and dangerous for another.

## Finality Is Not The Same As UI Confirmation

A bridge UI may show "submitted" or "received" before the full security model has finished.

Examples:

- An optimistic rollup withdrawal may appear in the UI, but still need a challenge window.
- A ZK rollup withdrawal may wait for proof generation and verification.
- A fast bridge may fill the user quickly, while the liquidity provider settles later.
- A general message may be valid on the source chain, but still need relayer delivery and destination execution.

Finality is a security state, not just a progress bar.

## Message Passing And Failure Modes

Cross-chain risk is broader than asset bridging.

When an app sends messages across chains, a bug can appear at several layers:

- Wrong chain ID or endpoint address.
- Missing replay protection.
- Destination app accepts a message from an untrusted sender.
- Relayer or executor stops delivering messages.
- Governance upgrades change message verification.
- Sequencer downtime delays inclusion or proof generation.

This is why embedded bridge flows make the app part of the risk surface. If the app chooses the route for users, the app should also explain failure states.

## Hands-On Lab

Open:

- English: `/en/labs/l2-risk`
- Chinese: `/zh/labs/l2-risk`

Try this sequence:

1. Start with the native optimistic rollup withdrawal scenario.
2. Switch to a native ZK rollup bridge and compare finality steps.
3. Switch to an external validator bridge and change amount to "large."
4. Toggle sequencer degraded and observe the liveness warning.
5. Switch app integration from linkout to embedded and observe how the app becomes part of the risk surface.
6. Read the checklist before imagining a real route.

The risk score is a teaching aid. It is not a live security rating.

## Credential Boundary

Phase 5 also asks the project to connect learning identity and credentials without overclaiming.

This repository already has an ERC-721 certificate contract under `contracts/`. That contract is one possible design option, not the only credential architecture.

Learning credentials can be represented in several ways:

- ERC-721 certificate.
- ERC-1155 multi-certificate.
- Non-transferable or soulbound token.
- Offchain signed proof.
- DID / Verifiable Credential.
- Attestation registry.

Each choice has different privacy, revocation, cost, portability, and trust tradeoffs. The credential architecture decision is documented separately before any contract change.

## Checklist

After this lesson, you should be able to explain:

- Why bridge risk is not only about fee and speed.
- How finality differs across optimistic, ZK, external-validator, messaging, and liquidity routes.
- Why sequencer downtime can become a user-facing risk.
- Why arbitrary message passing needs app-level replay and endpoint checks.
- Why learning credentials should not be reduced to "NFT certificate by default."

## Further Reading

- [ethereum.org: Bridges](https://ethereum.org/en/developers/docs/bridges/)
- [ethereum.org: Layer 2](https://ethereum.org/en/layer-2/)
- [L2BEAT Risk Framework](https://l2beat.com/scaling/risk)
- [W3C DID Core](https://www.w3.org/TR/did-core/)
- [W3C Verifiable Credentials Data Model 2.0](https://www.w3.org/TR/vc-data-model-2.0/)
- [Credential architecture tradeoff note](https://github.com/beihaili/Get-Started-with-Web3/blob/main/docs/strategy/2026-06-25-credential-architecture-tradeoff.md)
