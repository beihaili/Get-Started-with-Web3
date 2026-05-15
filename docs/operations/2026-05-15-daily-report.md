# Get Started with Web3 Daily Operations Report

**Date:** 2026-05-15
**Owner:** beihai + Codex
**Reporting window:** 2026-05-15 operating block; GitHub timestamps below are UTC unless noted.

## KPI Snapshot

| Metric | Current | Previous / Baseline | Movement | Source |
| --- | ---: | ---: | ---: | --- |
| GitHub stars | 614 | 614 short-term baseline | 0 | `gh repo view beihaili/Get-Started-with-Web3` |
| Forks | 55 | 55 | 0 | `gh repo view beihaili/Get-Started-with-Web3` |
| Watchers | 3 | 3 | 0 | `gh repo view beihaili/Get-Started-with-Web3` |
| Open internal PRs | 0 | 0 | 0 | `gh pr list --state open` after #135 merge |
| Open issues | 12 | 14 before #87/#93 closures | -2 | `gh issue list --state open --limit 30` |

## Completed

- Learner mobile UX: shipped [#139](https://github.com/beihaili/Get-Started-with-Web3/pull/139), adding the mobile reader drawer and swipe navigation for [#87](https://github.com/beihaili/Get-Started-with-Web3/issues/87), including a shared `useSwipe` hook that preserves vertical scroll and code-block horizontal scroll.
- Platform styling: corrected the Tailwind CSS v4 entrypoint so production builds generate theme utilities for colors, spacing, typography, and class-based dark mode; this surfaced during the #87 mobile visual smoke.
- Content reliability: prepared a `sync-content` fallback so English lessons that reuse Chinese local images publish those referenced images instead of producing production 404s; this fixes the high-intent first-transaction lesson image gap found during production smoke.
- Platform performance: prepared i18n namespace lazy loading for [#93](https://github.com/beihaili/Get-Started-with-Web3/issues/93), splitting UI locale payloads by route/feature while preserving existing `t('section.key')` calls. Local Vite main entry dropped from 107.59 kB / gzip 36.50 kB to 96.65 kB / gzip 32.04 kB.
- Content: merged [#135](https://github.com/beihaili/Get-Started-with-Web3/pull/135), adding English-localized DeFi DEX quiz copy and stronger AMM, slippage, and impermanent-loss coverage. Closed [#89](https://github.com/beihaili/Get-Started-with-Web3/issues/89).
- Platform performance: merged [#134](https://github.com/beihaili/Get-Started-with-Web3/pull/134), adding lesson-image lazy loading and generated image dimensions. Closed [#92](https://github.com/beihaili/Get-Started-with-Web3/issues/92).
- Content depth: merged [#133](https://github.com/beihaili/Get-Started-with-Web3/pull/133), expanding the Web3 glossary.
- Learner retention: merged [#131](https://github.com/beihaili/Get-Started-with-Web3/pull/131) and [#132](https://github.com/beihaili/Get-Started-with-Web3/pull/132), adding progress export/import flows.
- Trust and safety: merged [#130](https://github.com/beihaili/Get-Started-with-Web3/pull/130), adding wallet safety warnings.
- Source credibility: merged [#129](https://github.com/beihaili/Get-Started-with-Web3/pull/129), adding DeFi core concept source links.
- Distribution assets: merged [#128](https://github.com/beihaili/Get-Started-with-Web3/pull/128), drafting public community distribution posts.
- Monetization operations: added `docs/strategy/2026-05-15-sponsor-leads-tracker.md` with named low-risk leads, public evidence, outreach order, risk notes, and a pre-outreach checklist.

## Deploy And Verification

| Surface | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Latest production deploy | Success | [Run 25919683746](https://github.com/beihaili/Get-Started-with-Web3/actions/runs/25919683746) | `feat: improve mobile reader navigation (#139)` completed on main |
| PR checks for latest shipment | Success | [#139](https://github.com/beihaili/Get-Started-with-Web3/pull/139) | Deploy and Lighthouse checks passed before merge |
| Local tests for #135 | Success | `npm test`: 28 files, 176 tests | Ran before PR and again after commit |
| Local lint for #135 | Success | `npm run lint` | No ESLint output |
| Local build for #135 | Success | `npm run build` | Prerendered 131/131 routes |
| Local validation for #93 branch | Success | `npm test`, `npm run lint`, `npm run build` | 178 tests passed; ESLint clean; build generated 59 OG images and prerendered 131/131 routes |
| Browser smoke for #93 branch | Success | Playwright against local preview | `/en`, `/en/dashboard`, `/en/learn/module-8/8-2`, `/zh`, `/zh/glossary`, search modal, and language switch rendered without i18n key leaks or namespace load errors |
| Local validation for #87 branch | Success | `npx vitest run src/hooks/__tests__/useSwipe.test.jsx src/pages/__tests__/ReaderPage.mobile.test.jsx`, `npm test`, `npm run lint`, `npm run build` | 5 targeted tests passed; 30 files and 183 tests passed; ESLint clean; build generated complete Tailwind CSS and prerendered 131/131 routes |
| Browser smoke for #87 branch | Success | Playwright mobile viewport against local preview | Lesson drawer opens under 768px, traps focus, closes on Escape, swipes left/right navigate lessons, and code-block horizontal swipes do not navigate |
| Local validation for image fallback branch | Success | `npx vitest run scripts/__tests__/sync-content.test.js`, `npm test`, `npm run lint`, `npm run ai:verify`, `npm run build` | Targeted sync-content tests pass; 30 files and 184 tests passed; ESLint clean; AI artifacts verified; build prerendered 131/131 routes |
| AI entrypoints | Success | `npm run ai:verify` | Source/public artifacts, MCP tools, `llms.txt`, and x402 metadata verified |
| Production smoke | Success | `https://beihaili.github.io/Get-Started-with-Web3/en/learn/module-8/8-2/` and `/en/learn/module-1/1-2/` | Mobile reader drawer/swipe works on production; first-transaction missing-image gap reproduced as local branch target and fixed locally |
| Local browser smoke for image fallback branch | Success | Local preview on `/en/learn/module-1/1-2` | 13 referenced first-transaction images returned HTTP 200 image responses after `sync-content` fallback |

## External Distribution

| Target | Status | Evidence | Next action |
| --- | --- | --- | --- |
| TensorBlock `awesome-mcp-servers` | Open, waiting re-review | [PR #544](https://github.com/TensorBlock/awesome-mcp-servers/pull/544) | Reviewer requested matching docs entry; update was posted on 2026-05-15 01:02:45 UTC. Monitor for review response before further nudging. |
| Public post queue | Drafted, not yet published | `docs/strategy/2026-05-15-public-post-drafts.md` | Publish one low-risk post after external PR is no longer blocked or after next content improvement lands. |

## Sponsor And Revenue

| Lead / Channel | Status | Next action | Risk notes |
| --- | --- | --- | --- |
| Safe Ecosystem Foundation | Queued lead | Prepare grant-style impact memo for smart account and account abstraction education | Low trust risk; keep outputs educational and open-source |
| Reown / WalletConnect | Queued lead | Personalize wallet UX and connection-safety outreach | Avoid implying endorsement of any specific wallet |
| QuickNode | Queued lead | Personalize infrastructure sponsor outreach around builder labs and RPC lessons | Do not promise developer acquisition numbers yet |
| Blockaid / Blowfish | Queued security leads | Pick one first security outreach to avoid overlapping asks | Keep security claims factual and tool-neutral |
| Ethereum Foundation ESP | Researching | Package public-goods impact memo after more usage metrics | Grant path, not commercial sponsor |
| L2 ecosystems | Researching | Match sponsorship ask to L2/bridge learning modules | Avoid chain-promotion claims that weaken educational neutrality |
| Exchanges / affiliate | Policy review needed | Review donation and affiliate disclosures before outreach | High trust risk; require explicit confirmation before accepting sensitive sponsorship |

## Blockers And Risks

- Stars did not move yet: current count remains 614, so distribution and public-post execution remain the main growth bottleneck.
- External PR #544 is still `CHANGES_REQUESTED/BLOCKED` even though the requested update was posted. This needs monitoring, not repeated comments yet.
- Translation/proofreading issues remain open for modules 2, 4, and 5-6; English content quality is still a conversion risk for global learners.
- English first-transaction lesson images are locally fixed through `sync-content`, but the image fallback branch still needs PR review, CI, merge, and production smoke before the production 404 risk is closed.
- Sponsor lead tracker now has named leads, but no outreach has been sent yet. First messages still need a current metrics refresh and exact channel selection.

## Next Operating Block

1. Open, review, and ship the image fallback PR, then smoke `/en/learn/module-1/1-2/` on production for missing image responses.
2. Monitor [TensorBlock/awesome-mcp-servers#544](https://github.com/TensorBlock/awesome-mcp-servers/pull/544); if no reviewer response after a reasonable window, leave one concise follow-up.
3. Prepare first sponsor outreach packet for Safe, Reown, or QuickNode; send only after metrics and sponsor-kit link are refreshed.

## Evidence Links

- Main repository: https://github.com/beihaili/Get-Started-with-Web3
- Latest production site: https://beihaili.github.io/Get-Started-with-Web3/
- Latest merged PR: https://github.com/beihaili/Get-Started-with-Web3/pull/139
- Latest main deploy: https://github.com/beihaili/Get-Started-with-Web3/actions/runs/25919683746
- External MCP list PR: https://github.com/TensorBlock/awesome-mcp-servers/pull/544
