# Get Started with Web3 Daily Operations Report

**Date:** 2026-05-16
**Owner:** beihai + Codex
**Reporting window:** 2026-05-16 14:51 CST snapshot; GitHub timestamps are UTC unless noted.

## KPI Snapshot

| Metric       | Current | Previous / Baseline | Movement | Source                                                |
| ------------ | ------: | ------------------: | -------: | ----------------------------------------------------- |
| GitHub stars |     614 |                 614 |        0 | `gh repo view beihaili/Get-Started-with-Web3`         |
| Forks        |      55 |                  55 |        0 | `gh repo view beihaili/Get-Started-with-Web3`         |
| Watchers     |       3 |                   3 |        0 | `gh repo view beihaili/Get-Started-with-Web3`         |
| Open PRs     |       1 |                   3 |       -2 | `gh pr list --state open` after #147 opened           |
| Open issues  |       8 |                  12 |       -4 | `gh issue list --state open --limit 30`               |

## Completed

- Platform reliability: shipped [#141](https://github.com/beihaili/Get-Started-with-Web3/pull/141), adding PR build artifacts and an updatable Actions-run comment for reviewers. Closed [#40](https://github.com/beihaili/Get-Started-with-Web3/issues/40).
- Community contribution flow: merged external contributor PRs [#142](https://github.com/beihaili/Get-Started-with-Web3/pull/142), [#143](https://github.com/beihaili/Get-Started-with-Web3/pull/143), and [#144](https://github.com/beihaili/Get-Started-with-Web3/pull/144). Closed [#36](https://github.com/beihaili/Get-Started-with-Web3/issues/36), [#37](https://github.com/beihaili/Get-Started-with-Web3/issues/37), and [#38](https://github.com/beihaili/Get-Started-with-Web3/issues/38).
- Product quality: #144 added keyboard navigation for quiz answer options, including Arrow key movement, wrapping, Enter/Space selection, and focus rings.
- Test coverage: #142 added SponsorSection/SponsorBanner coverage; #143 added DonationSection coverage for donation links, affiliate links, and wallet addresses.
- Operations hygiene: shipped [#145](https://github.com/beihaili/Get-Started-with-Web3/pull/145) for the 2026-05-16 daily report and [#146](https://github.com/beihaili/Get-Started-with-Web3/pull/146) to record the TensorBlock follow-up.
- Backlog execution: opened draft [#147](https://github.com/beihaili/Get-Started-with-Web3/pull/147) for [#35](https://github.com/beihaili/Get-Started-with-Web3/issues/35), adding LanguageSwitcher active-state tests and a compact EN/中文 selector.
- Growth signal: stars stayed flat at 614 and forks are back at 55 in the latest snapshot.

## Deploy And Verification

| Surface                   | Status  | Evidence                                                                                      | Notes                                                                                 |
| ------------------------- | ------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Latest production deploy  | Success | [Run 25954994993](https://github.com/beihaili/Get-Started-with-Web3/actions/runs/25954994993) | `docs: record awesome MCP follow-up (#146)` completed on main                         |
| PR artifact workflow      | Success | [#141](https://github.com/beihaili/Get-Started-with-Web3/pull/141)                            | `pr-141-dist` artifact uploaded; marker comment updated to run `25923344253`          |
| Local review for #142     | Success | `npx vitest run src/components/__tests__/SponsorComponents.test.jsx`; `npx eslint ...`        | 4 tests passed; ESLint clean                                                          |
| Local review for #143     | Success | `npx vitest run src/components/__tests__/DonationSection.test.jsx`; `npx eslint ...`          | 3 tests passed; ESLint clean                                                          |
| Local review for #144     | Success | `npx vitest run src/features/quiz/__tests__/MultiQuiz.test.jsx`; `npm test`; `npx eslint ...` | Targeted quiz tests passed; full suite passed with 31 files and 186 tests             |
| Local review for #147     | Success | `npx vitest run src/components/__tests__/LanguageSwitcher.test.jsx`; `npm test`; `npm run lint`; `npm run build` | Full suite passed with 34 files and 197 tests; build prerendered 131/131 routes       |
| Production quiz smoke     | Success | Playwright against `/en/learn/module-8/8-2/?v=962ebab`                                        | Start Challenge, focus first answer, ArrowDown focus move, Space selection all worked |
| Language switcher smoke   | Success | Local preview browser check against `/en/dashboard` and mobile 390px `/en`                   | Active state and route-preserving language switch both worked                         |
| Production public entries | Success | Homepage, `/llms.txt`, and `/ai/manifest.json` returned HTTP 200 after #146 deploy            | Validated after run `25954994993`                                                     |

## External Distribution

| Target                            | Status                 | Evidence                                                               | Next action                                                                                          |
| --------------------------------- | ---------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| TensorBlock `awesome-mcp-servers` | Open, follow-up posted | [PR #544](https://github.com/TensorBlock/awesome-mcp-servers/pull/544) | Docs mirror entry was added in `4a57ae6`; concise re-review follow-up posted on 2026-05-16 06:20 UTC |
| Public post queue                 | Drafted                | `docs/strategy/2026-05-15-public-post-drafts.md`                       | Publish one low-risk post after the external PR is unblocked or next content PR lands                |

## Sponsor And Revenue

| Lead / Channel            | Status | Next action                                                                         | Risk notes                                                     |
| ------------------------- | ------ | ----------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Safe Ecosystem Foundation | Queued | Prepare grant-style impact memo for smart account and account abstraction education | Low trust risk; open-source and education aligned              |
| Reown / WalletConnect     | Queued | Personalize wallet UX and connection-safety outreach                                | Avoid implying wallet endorsement                              |
| QuickNode                 | Queued | Personalize infrastructure sponsor outreach around builder labs and RPC lessons     | Do not promise developer acquisition numbers yet               |
| Exchanges / affiliate     | Hold   | Requires explicit trust-policy review before contact                                | High trust risk; needs user confirmation before any acceptance |

## Blockers And Risks

- Stars stayed at 614; the 1000-star goal still needs external distribution and public-post execution, not only repository maintenance.
- External MCP-list PR #544 remains `CHANGES_REQUESTED/BLOCKED`; one follow-up has now been posted, so wait for reviewer response before any further comments.
- Open PR count is back to 1 because #147 is draft and waiting on GitHub checks; #35 remains open until that PR merges.
- Open issue backlog is down to 8, but English proofreading issues #13/#15/#16 remain a conversion-quality risk.
- Sponsor outreach has not been sent; the next message needs current metrics and a clear sponsor-kit link.

## Next Operating Block

1. Monitor [TensorBlock/awesome-mcp-servers#544](https://github.com/TensorBlock/awesome-mcp-servers/pull/544) for reviewer response after the 2026-05-16 follow-up.
2. Watch [#147](https://github.com/beihaili/Get-Started-with-Web3/pull/147) checks, then mark ready/merge if green to close #35.
3. Pick the next beginner-friendly issue from #84, #85, or #34, or review any new contributor PR within 24 hours.
4. Prepare the first low-risk sponsor outreach packet for Safe, Reown, or QuickNode.

## Evidence Links

- Repository: https://github.com/beihaili/Get-Started-with-Web3
- Production site: https://beihaili.github.io/Get-Started-with-Web3/
- Latest merged PR: https://github.com/beihaili/Get-Started-with-Web3/pull/146
- Active PR: https://github.com/beihaili/Get-Started-with-Web3/pull/147
- Latest main deploy: https://github.com/beihaili/Get-Started-with-Web3/actions/runs/25954994993
- External MCP-list PR: https://github.com/TensorBlock/awesome-mcp-servers/pull/544
