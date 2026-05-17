# Get Started with Web3 Daily Operations Report

**Date:** 2026-05-17
**Owner:** beihai + Codex
**Reporting window:** 2026-05-17 16:13 CST snapshot; GitHub timestamps are UTC unless noted.

## KPI Snapshot

| Metric       | Current | Previous / Baseline | Movement | Source                                        |
| ------------ | ------: | ------------------: | -------: | --------------------------------------------- |
| GitHub stars |     614 |                 614 |        0 | `gh repo view beihaili/Get-Started-with-Web3` |
| Forks        |      55 |                  55 |        0 | `gh repo view beihaili/Get-Started-with-Web3` |
| Watchers     |       3 |                   3 |        0 | `gh repo view beihaili/Get-Started-with-Web3` |
| Open PRs     |       0 |                   1 |       -1 | `gh pr list --state open`                     |
| Open issues  |       6 |                   8 |       -2 | `gh issue list --state open --limit 200`      |

## Completed

- Product learning loop: shipped [#148](https://github.com/beihaili/Get-Started-with-Web3/pull/148), adding an interactive SHA-256 Merkle tree builder to the English and Chinese Bitcoin Cryptography lesson. Closed [#84](https://github.com/beihaili/Get-Started-with-Web3/issues/84).
- Platform reliability: shipped [#149](https://github.com/beihaili/Get-Started-with-Web3/pull/149), publishing canonical `README.md` aliases for source lessons that use `README.MD`, fixing case-sensitive GitHub Pages runtime content fetches.
- AI-native content layer: refreshed `ai/` and `public/ai/` artifacts in #148 so the Merkle lesson heading appears in the content index.
- QA coverage: added Merkle tree pure-function tests, component tests, MarkdownRenderer custom-element coverage, and sync-content README casing coverage.
- Operations hygiene: recorded the production smoke finding from #148 and the #149 follow-up fix path for future agents in `AGENTS.md`.

## Deploy And Verification

| Surface                  | Status  | Evidence                                                                                      | Notes                                                                    |
| ------------------------ | ------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Latest production deploy | Success | [Run 25985404115](https://github.com/beihaili/Get-Started-with-Web3/actions/runs/25985404115) | `fix: publish lowercase readme aliases` completed on main                |
| PR #148 checks           | Success | [#148](https://github.com/beihaili/Get-Started-with-Web3/pull/148)                            | `build-and-deploy` and `lighthouse` passed before merge                  |
| PR #149 checks           | Success | [#149](https://github.com/beihaili/Get-Started-with-Web3/pull/149)                            | Linux build validated the sync-content casing fix                        |
| Tests                    | Success | `npm test`                                                                                    | 36 files, 205 tests passed after #149 changes                            |
| Lint                     | Success | `npm run lint`                                                                                | ESLint clean                                                             |
| Build                    | Success | `npm run build`                                                                               | Vite build passed; prerendered 131/131 routes                            |
| AI entrypoints           | Success | `npm run ai:verify`                                                                           | Manifest, content index, `llms.txt`, MCP metadata and x402 metadata pass |
| Translation coverage     | Warning | `node scripts/check-translation-coverage.mjs`                                                 | Exit 0; 17 existing missing-English warnings remain                      |
| Production smoke         | Success | `https://beihaili.github.io/Get-Started-with-Web3/en/learn/module-2/2-1` and `/zh/.../2-1`    | Merkle component rendered; first-party bad responses: 0                  |
| Content URL smoke        | Success | `/content/zh/GetStartedWithBitcoin/01_Cryptography/README.md?v=66a9844`                       | HTTP 200; uppercase `README.MD` also returns 200                         |

## External Distribution

| Target                            | Status               | Evidence                                                               | Next action                                                                                                |
| --------------------------------- | -------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| TensorBlock `awesome-mcp-servers` | Waiting for reviewer | [PR #544](https://github.com/TensorBlock/awesome-mcp-servers/pull/544) | Avoid repeat pings until reviewer responds to the 2026-05-16 follow-up                                     |
| GitHub product backlog            | Advanced             | [#84](https://github.com/beihaili/Get-Started-with-Web3/issues/84)     | Next beginner-facing feature candidate: [#85](https://github.com/beihaili/Get-Started-with-Web3/issues/85) |
| Public post queue                 | Not sent today       | `docs/strategy/2026-05-15-public-post-drafts.md`                       | Publish after the next feature or external-list unblock gives a stronger proof point                       |

## Sponsor And Revenue

| Lead / Channel            | Status | Next action                                                                         | Risk notes                                        |
| ------------------------- | ------ | ----------------------------------------------------------------------------------- | ------------------------------------------------- |
| Safe Ecosystem Foundation | Queued | Prepare grant-style impact memo for smart account and account abstraction education | Low trust risk; education aligned                 |
| Reown / WalletConnect     | Queued | Personalize wallet UX and connection-safety outreach                                | Avoid implying wallet endorsement                 |
| QuickNode                 | Queued | Personalize infrastructure sponsor outreach around builder labs and RPC lessons     | Do not promise developer acquisition numbers yet  |
| Exchanges / affiliate     | Hold   | Requires explicit trust-policy review before contact                                | High trust risk; user confirmation still required |

## Blockers And Risks

- Growth is flat: stars remain 614 against the 1000-star milestone, so the project still needs distribution and public proof, not only repo maintenance.
- Open issues are down to 6, but proofreading issues [#13](https://github.com/beihaili/Get-Started-with-Web3/issues/13), [#15](https://github.com/beihaili/Get-Started-with-Web3/issues/15), and [#16](https://github.com/beihaili/Get-Started-with-Web3/issues/16) still affect English conversion quality.
- Translation coverage still reports 17 missing-English warnings; non-blocking today, but it is visible operational debt.
- Sponsor outreach has not been sent; use current metrics and a concise proof point from #148 before contacting aligned leads.

## Next Operating Block

1. Start [#85](https://github.com/beihaili/Get-Started-with-Web3/issues/85): add a GasFeeCalculator with EIP-1559 breakdown, tests, bilingual lesson embed, and production smoke.
2. Publish one low-risk public post using the new Merkle interactive as a concrete product update.
3. Prepare a sponsor/grant outreach memo for Safe or Reown using the 614-star baseline and the interactive-learning roadmap.
4. Continue monitoring [TensorBlock/awesome-mcp-servers#544](https://github.com/TensorBlock/awesome-mcp-servers/pull/544) without over-pinging.

## Evidence Links

- Repository: https://github.com/beihaili/Get-Started-with-Web3
- Production site: https://beihaili.github.io/Get-Started-with-Web3/
- Merkle feature PR: https://github.com/beihaili/Get-Started-with-Web3/pull/148
- README alias fix PR: https://github.com/beihaili/Get-Started-with-Web3/pull/149
- Closed issue #84: https://github.com/beihaili/Get-Started-with-Web3/issues/84
- Latest main deploy: https://github.com/beihaili/Get-Started-with-Web3/actions/runs/25985404115
