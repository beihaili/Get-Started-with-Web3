# Credential Architecture Tradeoff Note

**Date:** 2026-06-25
**Owner:** beihai + Codex
**Status:** Design note; no contract change

## Decision

Do not change the existing `contracts/CertificateNFT.sol` contract in Phase 5.

The current ERC-721 completion certificate remains a demo-sized contract option. It should not be described as the only credential architecture, a production account system, a financial NFT, or a live paid credential product.

Before any production credential work, choose the architecture based on privacy, revocation, portability, cost, and trust requirements.

## Why This Note Exists

The Modern Web3 roadmap asks the project to connect learning identity, certificates, DID/VC, and attestations without turning the repository into a production credential platform too early.

The safe path is:

1. Teach the tradeoffs.
2. Keep the existing contract isolated under `contracts/`.
3. Avoid coupling credentials to core navigation or progress storage until the product decision is explicit.
4. Do not request wallet signatures, payments, or minting from learners as part of this roadmap package.

## Options

| Option | Best fit | Benefits | Tradeoffs |
| --- | --- | --- | --- |
| ERC-721 certificate | Public collectible proof for a specific course/module | Simple mental model, broad wallet support, easy to display | Transferability may weaken identity meaning; public metadata can leak learning history; revocation is awkward |
| ERC-1155 certificate | Many credential types with shared contract logic | Efficient for multiple modules/cohorts; batch-friendly | Still public by default; metadata and revocation design remain hard |
| Soulbound / non-transferable token | Reputation-like credential tied to an address | Reduces resale/transfer ambiguity | Wallet loss, privacy, recovery, and consent become harder |
| Offchain signed proof | Lightweight completion proof without minting | Cheap, private by default, easy to revoke or rotate issuer keys | Less wallet-native; verifier tooling must trust issuer key and proof format |
| DID / Verifiable Credential | Portable credential for identity-aware workflows | Strong standards ecosystem; supports selective disclosure patterns | Requires issuer/verifier architecture, key management, revocation registry, and UX work |
| Attestation registry | Public or semi-public claims about completion | Flexible schema; can separate claim from token ownership | Registry choice, schema governance, privacy, and revocation need explicit design |

## Current Recommendation

For the next public learning milestone:

- Keep ERC-721 certificate minting as an optional, clearly labeled demo path.
- Prefer offchain signed proof or Verifiable Credential research before asking learners to mint anything.
- Use SIWE only as proof of wallet control for a bounded purpose and time window.
- Do not store raw wallet addresses, signatures, emails, or payment identifiers in analytics.
- If a credential becomes public, show the learner exactly what will be public before issuance.

## Open Questions

- Does the project want public proof, private proof, or both?
- Should credentials attach to a wallet address, a DID, an account, or an exportable local progress file?
- Who is the issuer: beihai, a GitHub Action, a hosted API, a DAO, or a sponsor-backed issuer?
- How are mistakes revoked or corrected?
- What happens when a learner loses access to the wallet used for the credential?
- Is the credential meant for learning motivation, portfolio signaling, sponsor reporting, or all three?

## Verification Boundary

No Foundry verification is required for this note because no contract code changed.

If a future contract update happens, it should include:

- Foundry tests for minting, metadata, transferability or non-transferability, fee behavior, and owner controls.
- Deployment and verification steps under `contracts/`.
- Updated frontend copy that clearly marks whether minting is live, demo, testnet-only, or future plan.
- Updated disclosure review if fees, wallets, payment, sponsor placement, or affiliate surfaces change.
