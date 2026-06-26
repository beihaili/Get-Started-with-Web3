# SIWE Learning Identity Decision Note

**Date:** 2026-06-25
**Owner:** beihai + Codex
**Status:** Static demo shipped; hosted auth deferred
**Roadmap package:** Phase 3: SIWE And Learning Identity

## Decision

Ship the first SIWE slice as a static educational demo at `/labs/siwe`.

Do not describe it as production authentication. Do not create a real account system, session, credential, or certificate claim in the static GitHub Pages app.

Defer API-backed SIWE until there is an approved hosted backend decision.

## Why

The current production surface is a static React/Vite site on GitHub Pages. A static site can build a SIWE message and ask a wallet to sign it, but it cannot safely complete the relying-party side of Sign-In with Ethereum.

Production SIWE needs a trusted server for:

- Nonce issuance and storage.
- Signature verification.
- Replay protection.
- Session creation, rotation, and invalidation.
- ERC-1271 validation for contract wallets.
- Privacy-aware ENS or profile resolution.
- Audit logs that do not store raw signatures or unnecessary wallet data.

The static lab is therefore limited to message composition, signing, and local inspection of message fields.

## Demo Scope

The `/labs/siwe` demo may:

- Detect injected wallet providers through the same dependency-free EIP-6963 / EIP-1193 pattern used by Wallet Lab.
- Connect a wallet locally.
- Construct an ERC-4361-style plaintext SIWE message.
- Include domain, address, statement, URI, version, chain ID, nonce, issued-at, expiration, and resource fields.
- Request `personal_sign`.
- Display a shortened signature preview.
- Locally inspect message fields and signature shape.

The demo must not:

- Claim that the learner is logged in.
- Store or transmit a session.
- Treat a browser-generated nonce as production replay protection.
- Send raw wallet addresses, signatures, signed messages, or provider objects to analytics.
- Mint badges, certificates, NFTs, SBTs, or verifiable credentials.
- Add trading, token, exchange, payment, or financial-product flows.

## Future Hosted-Auth Options

If a later milestone approves hosted auth, choose one backend shape before implementation:

| Option                  | Fit                                                            | Tradeoff                                                     |
| ----------------------- | -------------------------------------------------------------- | ------------------------------------------------------------ |
| Minimal serverless API  | Good first production SIWE path for nonce + session            | Adds hosting, secrets, logs, and security maintenance        |
| Vercel / Cloudflare app | Good if the site moves beyond static GitHub Pages              | Requires deployment migration and operational ownership      |
| GitHub OAuth first      | Good for contributor identity and repo permissions             | Does not teach SIWE directly                                 |
| Manual sponsor workflow | Good for grants and sponsor reporting without learner accounts | Does not create learner-facing auth                          |
| Stay static             | Lowest risk                                                    | No real SIWE sessions, only educational message signing demo |

## Recommended Future Architecture

If production SIWE becomes necessary, the smallest acceptable architecture is:

1. `GET /api/siwe/nonce`
   - Server creates a random nonce.
   - Server stores nonce with short TTL and one-use status.
   - Response returns only the nonce and expiration.
2. Browser constructs SIWE message.
3. Wallet signs the message.
4. `POST /api/siwe/verify`
   - Server parses ERC-4361 fields.
   - Server checks domain, URI, chain ID, nonce, issued-at, expiration, and statement policy.
   - Server verifies EOA signatures through ERC-191.
   - Server verifies contract wallet signatures through ERC-1271 on the specified chain.
   - Server consumes nonce.
   - Server creates an HTTP-only session cookie or equivalent session token.
5. `POST /api/siwe/logout`
   - Server invalidates the session.

## Learning Identity Boundary

SIWE can become one input to learning identity, but it is not itself a credential system.

Future credential work still needs separate decisions for:

- Whether credentials are offchain, onchain, NFT, SBT-style, ERC-1155, or W3C Verifiable Credentials.
- Whether learners can rotate or unlink wallets.
- Whether credentials can be revoked.
- What personal data is stored.
- Whether public achievements expose wallet addresses.
- What happens if a wallet is compromised.

## Verification For Current Slice

The current static slice should be accepted only when:

- SIWE message construction helpers have unit tests.
- The SIWE page has component tests for disconnected, connected, signed, and rejected-wallet states.
- Routes are included in i18n namespace loading, sitemap, and prerender lists.
- The new lesson is indexed by course data, quiz data, and AI artifacts.
- `npm test`, `npm run lint`, `npm run ai:index && npm run ai:publish && npm run ai:verify`, and `npm run build` pass.

## Sources

- [ERC-4361: Sign-In with Ethereum](https://eips.ethereum.org/EIPS/eip-4361)
- [ERC-191: Signed Data Standard](https://eips.ethereum.org/EIPS/eip-191)
- [ERC-1271: Standard Signature Validation Method for Contracts](https://eips.ethereum.org/EIPS/eip-1271)
