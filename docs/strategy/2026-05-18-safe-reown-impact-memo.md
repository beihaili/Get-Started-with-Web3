# Safe / Reown Impact Memo

**Date:** 2026-05-18
**Owner:** beihai + Codex
**Status:** Approved for outreach on 2026-05-21. No message has been confirmed as sent until an authenticated channel and sender email are available.

## Purpose

Use the new interactive learning release as a credible proof point for the first low-risk sponsor or grant conversations.

Primary targets:

1. **Safe Ecosystem Foundation**: grant-style ask for open-source smart-account education.
2. **Reown / WalletConnect**: partnership or sponsor conversation around wallet UX, connection safety, and beginner-safe onboarding.

This memo is intentionally conservative. It asks for support for open-source education and community growth, not paid product endorsement, token promotion, affiliate conversion, or lesson influence.

## Current Proof Points

| Evidence             | Current state                                                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Repository           | https://github.com/beihaili/Get-Started-with-Web3                                                                             |
| Public site          | https://bhbtc.xyz/                                                                                                            |
| GitHub stars         | 614 as of 2026-05-21                                                                                                          |
| Forks                | 58                                                                                                                            |
| Contributors         | 12 from GitHub contributors API                                                                                               |
| Indexed lessons      | 116                                                                                                                           |
| Glossary entries     | 57                                                                                                                            |
| GitHub 14-day views  | 147 views / 72 unique visitors                                                                                                |
| GitHub 14-day clones | 4569 clones / 551 unique cloners                                                                                              |
| AI-native surfaces   | `llms.txt`, AI manifest, content index, local read-only MCP server                                                            |
| Recent product proof | [Interactive Learning Update](https://github.com/beihaili/Get-Started-with-Web3/releases/tag/interactive-learning-2026-05-18) |

Recent shipped learning components:

- [Merkle Tree Builder](https://bhbtc.xyz/en/learn/module-2/2-1): lets learners type transaction-like values, inspect SHA-256 leaves, duplicate odd nodes, and follow the Merkle root construction.
- [EIP-1559 Gas Fee Calculator](https://bhbtc.xyz/en/learn/module-11/11-2): lets learners change gas limit, priority tip, and max fee cap, then refresh live base-fee and ETH/USD estimates.

## Why Safe Fits

Official source checked on 2026-05-18 and rechecked on 2026-05-21: https://safefoundation.org/grants

Fit:

- Safe funds work that strengthens smart-account utility, security, adoption, developer tooling, research, and ecosystem growth.
- The grants page explicitly includes educational content, documentation, community growth, and adoption campaigns.
- The page says unsolicited grant proposals are accepted on a rolling basis and asks for a clear project description, scope, milestones, budget breakdown, team background, and expected impact.
- The page lists the proposal channel as `grants@safefoundation.org`.
- Get Started with Web3 already contains smart-account and account-abstraction lessons, including a new EIP-1559 gas-fee interactive embedded in the smart-account module.

Recommended ask:

- A small education grant for a 4-6 week open-source package:
  - improve the smart-account/account-abstraction module;
  - add one more interactive learner exercise around recovery, session keys, paymasters, or user operations;
  - expand bilingual glossary entries around Safe, account abstraction, ERC-4337, paymasters, bundlers, and smart-account security;
  - publish an AI-native context pack so agents can cite the module reliably.

Suggested framing:

> We are not asking Safe to sponsor a product endorsement. We are asking whether Safe wants to support neutral, open-source beginner education that helps more learners understand smart accounts, account recovery, gas abstraction, and wallet safety.

## Why Reown Fits

Official sources checked on 2026-05-18:

- https://reown.com/about-reown
- https://reown.com/contact
- https://docs.reown.com/

Fit:

- Reown presents itself as infrastructure and developer tools for onchain apps, powered by WalletConnect.
- Reown’s public pages emphasize secure, user-friendly infrastructure, wallet connections, payments, authentication, analytics, and onchain app development.
- The contact page exposes Sales and Partnership plus DevRel entry points.
- The docs position AppKit as an open-source SDK for wallet connections, logins, transactions, smart accounts, multiwallet linking, and built-in security.
- Get Started with Web3 already teaches first wallet identity, first transactions, DApp interaction, smart accounts, and wallet safety; these are natural Reown/WalletConnect education surfaces.

Recommended ask:

- A sponsor or educational collaboration conversation around wallet UX and connection safety:
  - maintain neutral wallet-connection lessons;
  - add clearer beginner guidance around wallet connection prompts, domain checks, signing, and transaction review;
  - keep sponsor disclosure separate from lesson conclusions;
  - use the AI-native index so AI tutors and agents can cite wallet safety lessons accurately.

Suggested framing:

> We are not asking Reown to buy a hidden placement. We are asking whether Reown wants to support open-source, disclosed education that helps first-time Web3 users understand wallet connection UX and safer onchain app onboarding.

## Draft Safe Grant Message

Subject:

```text
Open-source smart-account education grant proposal
```

Message:

```text
Hi Safe Ecosystem Foundation team,

I maintain Get Started with Web3, an open-source bilingual Web3 learning platform with 614 GitHub stars, 116 indexed lessons, 57 glossary entries, and AI-native entrypoints including llms.txt, a content index, and a local read-only MCP server.

I am preparing a small education grant proposal around smart accounts and beginner-safe account abstraction. The project already includes a smart-account module, and we recently shipped an interactive EIP-1559 Gas Fee Calculator inside the Account Abstraction lesson:

https://bhbtc.xyz/en/learn/module-11/11-2

The proposed grant would fund a focused 4-6 week open-source package:

- improve the bilingual smart-account/account-abstraction module;
- add one more interactive learning exercise around recovery, session keys, paymasters, user operations, or wallet safety;
- expand glossary and AI-native context for Safe/account-abstraction concepts;
- publish all outputs openly so learners and AI tutors can cite the material.

This would be neutral education, not a product endorsement or paid trading campaign. Sponsor or grant support would be disclosed, and lesson conclusions would remain independent.

Would this fit Safe’s spontaneous grant process? If so, I can send a scoped proposal with milestones, budget, team background, and expected impact.

Project: https://github.com/beihaili/Get-Started-with-Web3
Recent release: https://github.com/beihaili/Get-Started-with-Web3/releases/tag/interactive-learning-2026-05-18

Best,
beihai
```

## Draft Reown Partnership Message

Subject:

```text
Support open-source wallet UX and onboarding education
```

Message:

```text
Hi Reown team,

I maintain Get Started with Web3, an open-source bilingual Web3 learning platform with 614 GitHub stars, 116 indexed lessons, 57 glossary entries, and AI-native entrypoints for tutors and agents.

The curriculum teaches first wallet identity, first transactions, DApp interaction, wallet safety, smart accounts, DeFi, L2, DAO, and builder content. We recently shipped two interactive lessons, including an EIP-1559 Gas Fee Calculator inside the account-abstraction module:

https://github.com/beihaili/Get-Started-with-Web3/releases/tag/interactive-learning-2026-05-18

Reown / WalletConnect seems like a strong fit for a disclosed education collaboration around wallet UX and connection safety. A first collaboration could support:

- clearer beginner lessons around wallet connection prompts, domain checks, signing, and transaction review;
- AI-native context packs so tutors and agents cite wallet safety guidance accurately;
- a neutral, open-source onboarding resource for learners moving from first wallet use to first onchain app interaction.

This would not be a hidden placement or token promotion. Sponsor support would be disclosed, and the educational content would remain independent.

Would a short sponsor or education-partnership conversation make sense?

Project: https://github.com/beihaili/Get-Started-with-Web3
Site: https://bhbtc.xyz/

Best,
beihai
```

## Send Checklist

Before sending either message:

- [x] Confirm the public social account for project updates: X `@bhbtc1337`.
- [x] Confirm Safe proposal channel from the official grants page: `grants@safefoundation.org`.
- [ ] Confirm or discover a sender email for grant/contact forms that require email identity.
- [ ] Replace the greeting if a named contact is available.
- [ ] Decide whether the first ask is a grant, sponsor slot, or educational collaboration.
- [ ] For Safe, prepare a separate milestone and budget table if the Foundation asks for the full proposal.
- [ ] For Reown, choose Sales and Partnership or DevRel based on the desired ask.
- [ ] Record the sent date, channel, message link, and replies in `docs/operations/2026-05-18-daily-report.md`.
- [ ] Stop and ask beihai before discussing payment details, sponsor placement acceptance, exclusivity, affiliate tracking, or any high-risk financial-product category.
