# Modern Web3 Gap Analysis

**Date:** 2026-06-24  
**Owner:** beihai + Codex  
**Status:** Phase 1 roadmap input  
**Related roadmap:** `docs/strategy/2026-06-24-modern-web3-roadmap-goal.md`

## Purpose

This document turns the Modern Web3 roadmap into concrete implementation gaps. It should guide the next small PRs without changing the project's core identity as a Chinese-first, bilingual, AI-native Web3 curriculum and knowledge layer.

## Current Repository Evidence

The project already has a strong content and AI-native base:

- `README.md` and `README.zh.md` position the project as an open-source bilingual Web3 learning platform.
- `package.json` includes React, Vite, routing, Markdown rendering, i18n, Zustand, MCP SDK, testing, SEO, and content-generation scripts.
- `src/features/` currently contains `ai-tutor`, `badges`, `content`, and `quiz`; it does not yet contain wallet, identity, account-abstraction lab, or chain-interaction feature modules.
- `package.json` does not currently include `wagmi`, `viem`, RainbowKit, Reown AppKit, WalletConnect, SIWE helpers, or account-abstraction SDKs.
- `src/config/glossaryData.js` already includes account-abstraction terms such as ERC-4337, EIP-7702, UserOperation, Bundler, Paymaster, Session Key, Smart Account, and Passkey.
- `docs/lab-templates/web3-lab-first-dapp-README.md` already sketches a wagmi + viem learning lab, but it is a template, not a runnable integrated route.

The gap is therefore not "no modern Web3 concepts." The gap is that modern concepts are not yet connected to runnable, learner-safe labs in the product.

## Source Baseline

Reviewed on 2026-06-24 using primary or standards sources:

| Topic                                  | Source status                                                                      | Why it matters for this roadmap                                                                               |
| -------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| EIP-6963                               | [Final interface EIP](https://eips.ethereum.org/EIPS/eip-6963), created 2023-05-01 | Multi injected wallet discovery is now a baseline wallet UX topic.                                            |
| ERC-4361 / SIWE                        | [Final ERC](https://eips.ethereum.org/EIPS/eip-4361), created 2021-10-11           | SIWE is the right standard anchor for wallet-based learning identity demos.                                   |
| ERC-4337                               | [Final ERC](https://eips.ethereum.org/EIPS/eip-4337), created 2021-09-29           | UserOperation, EntryPoint, Bundler, and Paymaster should move from glossary concepts into a practical module. |
| EIP-7702                               | [Final core EIP](https://eips.ethereum.org/EIPS/eip-7702), created 2024-05-07      | Delegated EOA behavior changes wallet UX and security education after Pectra-era Ethereum.                    |
| DID Core                               | [W3C Recommendation](https://www.w3.org/TR/did-core/), 2022-07-19                  | DID content should be used only where it helps explain learning identity, attestations, or certificates.      |
| Verifiable Credentials Data Model v2.0 | [W3C Recommendation](https://www.w3.org/TR/vc-data-model-2.0/), 2025-05-15         | VC content can inform certificate design without forcing an on-chain credential implementation.               |

## Priority Gaps

### 1. Wallet Interoperability

**Current state:** The course map teaches wallet basics and DApp interaction, and a lab template mentions wagmi + viem. The app itself does not yet include a wallet lab route or wallet dependencies.

**Gap:** Learners cannot open the site and experience a modern wallet connection flow, multi-wallet discovery, network display, network switch, or message signing.

**Recommended first slice:**

- Add a wallet lab architecture note before dependencies are installed.
- Decide whether the first implementation uses `wagmi + viem + RainbowKit` or Reown AppKit.
- Scope the first runnable route to connect, disconnect, account display, chain display, network switch, and message signing.
- Keep analytics away from raw wallet addresses and signatures.

**Acceptance evidence:**

- Architecture note exists.
- Stack decision is documented.
- Future route path and test plan are clear before dependencies are added.

### 2. SIWE And Learning Identity

**Current state:** The site has AI Tutor, badges, progress, and certificates as learning concepts, but no SIWE module or wallet-based identity demo.

**Gap:** The project cannot yet teach the difference between "signing a message," "signing in," "creating a session," and "building production authentication."

**Recommended first slice:**

- Add a SIWE design note that states the static-site constraint.
- Build the first SIWE version as a message composition and signature inspection demo, not a production login.
- If a hosted backend is needed later, write a separate decision note.

**Acceptance evidence:**

- Lesson or design doc names ERC-4361.
- Demo copy clearly says production SIWE requires backend nonce issuance and session validation.
- No README, UI, or AI metadata claims a live account system exists.

### 3. Account Abstraction

**Current state:** The glossary and quiz data already mention ERC-4337, EIP-7702, UserOperation, Bundler, and Paymaster. This is a good foundation.

**Gap:** Learners cannot yet manipulate a UserOperation shape, compare ERC-4337 and EIP-7702 flows, or understand paymaster and sponsorship risk through an experiment.

**Recommended first slice:**

- Add an account-abstraction module plan before adding SDKs.
- Prefer a local UserOperation simulator first.
- Treat live bundler/paymaster integration as a later testnet-only step.

**Acceptance evidence:**

- Module plan lists course IDs, glossary deltas, quiz deltas, and lab helper functions.
- Simulator can be tested locally without RPC credentials.
- AI artifacts are regenerated once course structure changes.

### 4. L2 And Cross-Chain Risk

**Current state:** The project has an L2/cross-chain course module and completed English coverage for that module in prior operations.

**Gap:** The course is still mostly explanatory. Learners do not yet have a lab that compares finality assumptions, bridge trust models, message delays, or failure states.

**Recommended first slice:**

- Add a risk-lab design doc with one comparison table and one small interactive model.
- Avoid live bridge transactions.
- Use static or simulated data first.

**Acceptance evidence:**

- Lab scope avoids real asset movement.
- Source dates or last-reviewed markers are included for fast-changing L2 topics.
- The lab can be verified without paid APIs.

### 5. DID, VC, And Learning Credentials

**Current state:** The project has certificate and badge concepts, plus a Base ERC-721 certificate contract, but no credential architecture comparison.

**Gap:** The current certificate path can look like "NFT certificate is the answer" instead of one option among ERC-721, ERC-1155, soulbound, offchain proof, DID/VC, and attestations.

**Recommended first slice:**

- Write a credential architecture note before changing contracts.
- Compare on-chain certificate NFTs, offchain proofs, attestations, DID/VC, and hybrid approaches.
- Keep DID/VC scoped to learning identity and credentials.

**Acceptance evidence:**

- Credential comparison exists before contract changes.
- No credential copy implies financial value or transfer-market utility.
- Any future contract work has a separate verification path.

### 6. AI-Native Product Surface

**Current state:** The project already exposes `llms.txt`, AI manifest, content index, and a local read-only MCP server.

**Gap:** These surfaces are real, but they are not yet treated as a versioned public product contract. Paid x402-related fields remain metadata, not live payment enforcement.

**Recommended first slice:**

- Audit the public AI artifacts as stable surfaces.
- Document which fields are stable, experimental, or future metadata.
- Keep local MCP free and read-only.

**Acceptance evidence:**

- AI surface contract or compatibility note exists.
- `npm run ai:verify` passes after artifact changes.
- No local MCP tool writes files, signs transactions, or performs payment settlement.

## First Implementation Backlog

1. Add README project-boundary language in English and Chinese.
2. Draft the public roadmap issue update that points to the Modern Web3 roadmap.
3. Add a wallet lab architecture note before dependencies.
4. Add a SIWE static-site constraint note.
5. Add an account-abstraction module plan centered on a UserOperation simulator.

## Deferral Rules

Defer, rather than half-build, any item that requires:

- A production backend for authentication or payment.
- Mainnet transactions or real user funds.
- Sponsor copy approval.
- A Node 22 migration.
- A heavy SDK whose purpose is not tied to a specific lab acceptance test.
