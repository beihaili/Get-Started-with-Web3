# Modern Web3 Phase 1 Issue Backlog

**Date:** 2026-06-24  
**Owner:** beihai + Codex  
**Status:** Draft GitHub issue backlog  
**Roadmap:** `docs/strategy/2026-06-24-modern-web3-roadmap-goal.md`

These issue drafts support Phase 0 and Phase 1 of the Modern Web3 roadmap. They are intentionally small enough to become separate GitHub issues or PRs.

## Issue 1: Clarify README Project Boundaries

**Title:** `[Docs] Clarify curriculum vs builder-lab project boundaries`

**Labels:** `documentation`, `growth`

**Problem:** The project is positioned as a bilingual, AI-native Web3 curriculum, but visitors can still confuse it with a production dApp starter kit or a monetized Web3 service.

**Smallest solution:**

- Add a short boundary section to `README.md`.
- Add the matching Chinese section to `README.zh.md`.
- State that labs are educational examples, not production dApp starter code.
- State that the project is not investment advice, token promotion, exchange onboarding, or a virtual-currency business service.

**Expected files:**

- `README.md`
- `README.zh.md`

**Definition of done:**

- Both README files include boundary language.
- The copy keeps the main positioning: curriculum + AI-readable knowledge layer.
- No new product claim says wallet, SIWE, x402, certificate, or paid-tool systems are live before verification.

## Issue 2: Publish Modern Web3 Gap Analysis

**Title:** `[Strategy] Document Modern Web3 gaps and first implementation slices`

**Labels:** `documentation`, `ai-native`, `wallet-lab`, `identity`, `account-abstraction`, `l2-cross-chain`

**Problem:** The roadmap names modern Web3 gaps, but contributors need a concise gap analysis with current repository evidence, source baseline, and small first slices.

**Smallest solution:**

- Add a strategy doc for the Modern Web3 gap analysis.
- Cover EIP-6963, SIWE / ERC-4361, ERC-4337, EIP-7702, DID/VC, L2/cross-chain risk, credential design, and AI-native product surfaces.
- Include current repository evidence from `package.json`, `src/features/`, existing glossary data, and existing lab templates.

**Expected files:**

- `docs/strategy/2026-06-24-modern-web3-gap-analysis.md`

**Definition of done:**

- The doc identifies current state, gap, first slice, and acceptance evidence for each topic.
- It uses primary sources for standards status.
- It does not prescribe heavy dependencies before a lab architecture note exists.

## Issue 3: Design Wallet Lab Before Dependencies

**Title:** `[Wallet Lab] Write architecture note for wallet interoperability MVP`

**Labels:** `documentation`, `wallet-lab`, `enhancement`

**Problem:** The project should teach modern wallet UX, but adding wallet libraries without a route shape and verification plan would increase dependency weight and review risk.

**Smallest solution:**

- Write an architecture note for a future `/labs/wallet` route.
- Compare `wagmi + viem + RainbowKit` and Reown AppKit for the first educational lab.
- Scope the MVP to connect, disconnect, account display, chain display, network switch, and message signing.
- Define analytics privacy rules for wallet addresses and signatures.

**Expected files:**

- `docs/strategy/2026-06-24-wallet-lab-architecture.md`

**Definition of done:**

- The route scope is clear before dependencies are installed.
- The stack recommendation is explicit.
- The doc lists tests and browser smoke checks required for the eventual implementation.

## Issue 4: Design Static SIWE Learning Demo

**Title:** `[Identity] Design SIWE learning demo for a static site`

**Labels:** `documentation`, `identity`, `enhancement`

**Problem:** Learners need to understand SIWE, but the current GitHub Pages deployment cannot honestly provide production login sessions without a backend.

**Smallest solution:**

- Write a design note for a SIWE learning demo.
- Explain ERC-4361 message fields, nonce, domain, expiration, replay risk, and session boundaries.
- Define the first version as message composition, wallet signing, and local inspection.
- Explicitly defer backend nonce/session validation to a future hosted-auth decision.

**Expected files:**

- `docs/strategy/2026-06-24-siwe-static-demo-design.md`

**Definition of done:**

- The design note states that production SIWE requires trusted backend nonce issuance and session validation.
- No copy claims a real account system exists.
- The note lists helper tests needed before implementation.

## Issue 5: Plan Account Abstraction Practical Module

**Title:** `[Account Abstraction] Plan ERC-4337 / EIP-7702 practical module`

**Labels:** `documentation`, `account-abstraction`, `content`, `enhancement`

**Problem:** The glossary and quiz data already mention ERC-4337 and EIP-7702, but the project needs a practical module that turns those concepts into a learner-safe experiment.

**Smallest solution:**

- Draft an account-abstraction module plan.
- Cover ERC-4337 mental model, UserOperation anatomy, EntryPoint, Bundler, Paymaster, smart accounts, EIP-7702 delegated EOA behavior, and sponsorship risks.
- Prefer a local UserOperation simulator before live bundler or paymaster integration.
- Identify course IDs, glossary deltas, quiz deltas, helper functions, and AI artifact updates.

**Expected files:**

- `docs/strategy/2026-06-24-account-abstraction-module-plan.md`

**Definition of done:**

- The plan defines at least two lessons and one lab slice.
- It explains why the first lab can run without RPC credentials.
- It lists required verification commands, including AI artifact regeneration after course-structure changes.

## Issue 6: Design L2 And Credential Risk Lab

**Title:** `[L2 / Identity] Design learner-safe L2, bridge, and credential risk lab`

**Labels:** `documentation`, `l2-cross-chain`, `identity`, `content`

**Problem:** The project has L2/cross-chain and certificate content, but it needs a learner-safe lab that explains risk models without asking users to bridge assets or treat certificates as financial NFTs.

**Smallest solution:**

- Write a design note for one simulated L2/cross-chain or credential-risk lab.
- Compare bridge trust assumptions, finality, message delays, and failure states.
- Compare ERC-721, ERC-1155, soulbound, offchain proof, DID/VC, and attestations as credential options.
- Avoid live bridge transactions and real asset movement.

**Expected files:**

- `docs/strategy/2026-06-24-l2-credential-risk-lab-design.md`

**Definition of done:**

- The lab scope is simulated or read-only.
- Certificate copy does not imply financial value or transfer-market utility.
- Fast-changing protocol topics include source dates or last-reviewed markers.
