# Donation And Affiliate Disclosure Review

**Date:** 2026-05-18
**Status:** Reviewed and implemented
**Owner:** beihai + Codex

## Scope

This review covers the project's current support, donation, sponsor, and affiliate surfaces:

- `README.md` and `README.zh.md`
- `/support`
- landing-page donation section
- sponsor kit and sponsor lead tracker
- `src/config/sponsorData.js`

## Current Support Links

| Type               | Current state                                                                | Disclosure requirement                                                         |
| ------------------ | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Donation platform  | Buy Me a Coffee, GitHub Sponsors                                             | Explain that support funds maintenance and does not buy lesson influence       |
| Crypto tips        | ETH/EVM and BTC addresses                                                    | Explain that users should verify address, network, and asset before sending    |
| Affiliate link     | Binance referral link with 20% fee rebate                                    | Clearly mark as affiliate/sponsored, possible commission, no investment advice |
| Sponsor placements | No active sponsors in config; sponsor kit exists for future sponsor pipeline | Disclose paid placements and reject unsafe sponsor influence                   |

## Implemented Disclosure Rules

- Donation and sponsor support helps fund maintenance, translation, new lessons, and AI-native tooling.
- Donations, sponsors, and affiliate links do not influence lesson conclusions, security warnings, or curriculum order.
- Affiliate links may generate commission or referral benefits and must be disclosed near the link.
- Exchange or on-ramp links are not recommendations to trade, invest, use leverage, or hold any asset.
- Crypto tips are irreversible user actions; users must verify address, network, and asset before sending.
- Any new affiliate, sponsor, payment, wallet, or x402 flow that changes trust boundaries still requires explicit beihai confirmation.

## Surfaces Updated

- `/support`: added a trust and disclosure section plus inline donation, crypto, affiliate, and sponsor notes.
- Landing donation section: added a concise disclosure note before support links.
- README / README.zh: added the disclosure review artifact next to the sponsor kit.
- Execution board and daily report: marked donation and affiliate disclosure review complete.
- AGENTS: added the disclosure review doc to operating notes for future agents.

## Remaining Constraints

- The Binance referral link remains present, so exchange disclosure must stay visible wherever that link appears.
- No sponsor is currently active in `SPONSORS`; future sponsor placements must be reviewed before publishing.
- This review does not approve new payment rails, x402 enforcement, hosted paid tools, or wallet-connect flows.
