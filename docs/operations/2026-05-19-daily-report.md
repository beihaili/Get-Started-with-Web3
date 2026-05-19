# Get Started with Web3 Daily Operations Report

**Date:** 2026-05-19
**Owner:** beihai + Codex
**Reporting window:** 2026-05-19 15:27 CST snapshot; GitHub timestamps are UTC unless noted.

## KPI Snapshot

| Metric            | Current | Previous / Baseline | Movement | Source                                        |
| ----------------- | ------: | ------------------: | -------: | --------------------------------------------- |
| GitHub stars      |     614 |                 614 |        0 | `gh repo view beihaili/Get-Started-with-Web3` |
| Forks             |      58 |                  57 |       +1 | `gh repo view beihaili/Get-Started-with-Web3` |
| Watchers          |       3 |                   3 |        0 | `gh repo view beihaili/Get-Started-with-Web3` |
| Contributors      |      13 |                  13 |        0 | `gh api repos/.../contributors`               |
| Open PRs          |       3 |                   0 |       +3 | `gh pr list --state open`                     |
| Open issues       |      12 |                  12 |        0 | `gh issue list --state open --limit 200`      |
| Good first issues |      11 |                  11 |        0 | `gh issue list` label count                   |

## Completed

- Content product: published the second English Layer 2 / cross-chain lesson translation via [#184](https://github.com/beihaili/Get-Started-with-Web3/pull/184), covering Rollup fundamentals, Optimistic Rollups, ZK Rollups, data availability, Validium, and Volition.
- AI-native maintenance: regenerated `ai/` and `public/ai/` artifacts after the new English lesson and smart-account glossary merge; the AI-native index now contains 108 lesson entries, 57 glossary entries, and module `9-2` has English availability set to `true`.
- Translation operations: reduced local translation coverage warnings from 16 to 15; the remaining Layer 2 gaps are `03_L2Ecosystem`, `04_CrossChainBridges`, and `05_L2PracticalGuide`.
- Community backlog: updated [#175](https://github.com/beihaili/Get-Started-with-Web3/issues/175#issuecomment-4483580706) so contributors can see that lesson 9-2 is complete and only lessons 9-3 to 9-5 remain in that issue.
- Contributor loop: [#177](https://github.com/beihaili/Get-Started-with-Web3/pull/177) and [#178](https://github.com/beihaili/Get-Started-with-Web3/pull/178) merged, closing [#162](https://github.com/beihaili/Get-Started-with-Web3/issues/162) and [#158](https://github.com/beihaili/Get-Started-with-Web3/issues/158).
- Community backlog: opened replacement growth starter issues [#186](https://github.com/beihaili/Get-Started-with-Web3/issues/186) and [#187](https://github.com/beihaili/Get-Started-with-Web3/issues/187), keeping the open good-first issue queue at 11; new community PRs [#194](https://github.com/beihaili/Get-Started-with-Web3/pull/194), [#195](https://github.com/beihaili/Get-Started-with-Web3/pull/195), and [#196](https://github.com/beihaili/Get-Started-with-Web3/pull/196) are pending review.
- GitHub triage: Dependabot PRs [#179](https://github.com/beihaili/Get-Started-with-Web3/pull/179), [#180](https://github.com/beihaili/Get-Started-with-Web3/pull/180), [#182](https://github.com/beihaili/Get-Started-with-Web3/pull/182), and [#191](https://github.com/beihaili/Get-Started-with-Web3/pull/191) landed; Node 22-only PRs [#181](https://github.com/beihaili/Get-Started-with-Web3/pull/181), [#183](https://github.com/beihaili/Get-Started-with-Web3/pull/183), and [#192](https://github.com/beihaili/Get-Started-with-Web3/pull/192) were closed with migration notes.
- Dependency hygiene: `.github/dependabot.yml` now ignores Node 22-only major updates for `@commitlint/cli`, `@commitlint/config-conventional`, and `lint-staged` until the project intentionally migrates CI and local contributor docs from Node 20.
- CI tooling: `actions/upload-artifact` is moving to v7 together with the workflow regression test that verifies PR build artifact comments, superseding Dependabot PR [#190](https://github.com/beihaili/Get-Started-with-Web3/pull/190).
- Website observability/domain readiness: added centralized site URL/base-path config, SPA route-level GA `page_view` tracking, env-driven sitemap/robots/AI artifact URLs, and custom-domain-safe build knobs (`VITE_SITE_BASE_URL` / `SITE_BASE_URL`, `VITE_BASE_PATH`) without enabling CNAME or DNS changes yet.
- Community CI triage: identified that fork PRs [#194](https://github.com/beihaili/Get-Started-with-Web3/pull/194) and [#195](https://github.com/beihaili/Get-Started-with-Web3/pull/195) built successfully but failed when the workflow tried to write a PR artifact comment without token permission; prepared a workflow guard so fork PRs still upload artifacts without failing the build.

## Deploy And Verification

| Surface                  | Status  | Evidence                                                                                      | Notes                                                                                                         |
| ------------------------ | ------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Latest production deploy | Success | [Run 26072572474](https://github.com/beihaili/Get-Started-with-Web3/actions/runs/26072572474) | Latest main deploy completed successfully for head `94c1729`                                                  |
| Public lesson route      | Success | `curl -L .../en/learn/module-9/9-2`                                                           | HTTP 200 and prerendered HTML contains `Rollup Principles Explained`                                          |
| Translation coverage     | Success | `npm run translation:check`                                                                   | 15 missing-English warnings remain after adding lesson 9-2                                                    |
| AI index                 | Success | `npm run ai:index`, `npm run ai:publish`                                                      | 11 modules, 108 lesson entries, 57 glossary entries                                                           |
| AI entrypoints           | Success | `npm run ai:verify`                                                                           | Source/public artifacts, MCP tools, `llms.txt`, and x402 metadata pass                                        |
| Site analytics/domain    | Success | Targeted Vitest + local preview browser smoke                                                 | Custom-domain URL helpers, route-level pageview tracking, canonical updates, sitemap, and robots pass locally |
| Fork PR artifact comment | Local   | `npx vitest run scripts/__tests__/deploy-workflow.test.js`                                    | Regression test added for skipping PR comments on fork branches while keeping artifact uploads                |
| Test suite               | Success | `npm test`                                                                                    | 43 test files and 227 tests passed                                                                            |
| Lint                     | Success | `npm run lint`                                                                                | ESLint completed with zero reported errors                                                                    |
| Production build         | Success | `npm run build`                                                                               | Vite build plus 131/131 prerendered routes passed, including `/en/learn/module-9/9-2`                         |
| Formatting               | Success | `npx prettier --check ...`                                                                    | Changed Markdown files use Prettier style                                                                     |
| Whitespace               | Success | `git diff --check`                                                                            | No whitespace errors                                                                                          |

## External Distribution

| Target                       | Status  | Evidence                                                                                                                                                                                                   | Next action                                                                  |
| ---------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| GitHub contributor backlog   | Updated | [#175 update](https://github.com/beihaili/Get-Started-with-Web3/issues/175#issuecomment-4483580706)                                                                                                        | Remaining L2 translation work is now lessons 9-3 to 9-5                      |
| GitHub PR queue              | Review  | [#194](https://github.com/beihaili/Get-Started-with-Web3/pull/194), [#195](https://github.com/beihaili/Get-Started-with-Web3/pull/195), [#196](https://github.com/beihaili/Get-Started-with-Web3/pull/196) | Review #194/#195 checks; #196 is currently DIRTY and needs conflict handling |
| Twitter/X and Farcaster post | Ready   | `docs/strategy/2026-05-15-public-post-drafts.md`                                                                                                                                                           | Publish Draft 3 from beihai account                                          |
| learnblockchain.cn/community | Ready   | `docs/strategy/2026-05-15-public-post-drafts.md`                                                                                                                                                           | Publish Chinese community post when convenient                               |
| TensorBlock awesome MCP      | Waiting | [PR #544](https://github.com/TensorBlock/awesome-mcp-servers/pull/544)                                                                                                                                     | Avoid repeat pings until reviewer responds                                   |

## Sponsor And Revenue

| Lead / Channel            | Status       | Next action                                                                                                             | Risk notes                                        |
| ------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Safe Ecosystem Foundation | Memo drafted | Send grant-style memo through the appropriate Safe grants channel after channel/account confirmation                    | Low trust risk; education aligned                 |
| Reown / WalletConnect     | Memo drafted | Send wallet UX and onboarding memo through Reown Sales/Partnership or DevRel channel after channel/account confirmation | Avoid implying wallet endorsement                 |
| QuickNode                 | Queued       | Personalize infrastructure sponsor outreach around RPC and builder lessons                                              | Do not promise developer acquisition numbers yet  |
| Exchanges / affiliate     | Hold         | Requires explicit trust-policy review before contact                                                                    | High trust risk; user confirmation still required |

## Blockers And Risks

- Growth remains flat at 614 stars; the next growth move needs actual public distribution, not only internal content shipping.
- Community PR queue reopened with 3 external PRs; #194/#195 need rerun after the fork-PR workflow guard lands, and #196 overlaps the remaining Layer 2 translation work and is currently marked DIRTY.
- Dependabot queue is controlled, but Node 22 migration remains a technical stewardship item before accepting `@commitlint/cli` v21, `@commitlint/config-conventional` v21, or `lint-staged` v17.
- Layer 2 English coverage improves, but three lessons still remain after this branch; broader DAO and non-core docs still need translation or classification.
- Sponsor outreach remains drafted but unsent; actual external sending still needs a confirmed human channel or connector.
- `bhbtc.xyz` activation is prepared in code but not enabled; exact host, DNS provider setup, and GitHub Pages custom-domain readiness need confirmation before adding `public/CNAME` or changing Pages settings.
- Hosted payment, x402 enforcement, affiliate expansion, wallet flows, and payment-address changes still require explicit user confirmation.

## Next Operating Block

1. Finish PR/deploy for analytics/domain-readiness, then confirm production still serves GitHub Pages paths correctly.
2. Review community PRs #194, #195, and #196; handle #196 conflicts before deciding whether it closes #175.
3. Publish the ready X/Farcaster and Chinese community posts so the new content work feeds the 1000-star growth loop.

## Evidence Links

- Repository: https://github.com/beihaili/Get-Started-with-Web3
- Production site: https://beihaili.github.io/Get-Started-with-Web3/
- Latest recorded main deploy: https://github.com/beihaili/Get-Started-with-Web3/actions/runs/26072572474
- Remaining L2 translation starter issue: https://github.com/beihaili/Get-Started-with-Web3/issues/175
- Remaining L2 translation issue update: https://github.com/beihaili/Get-Started-with-Web3/issues/175#issuecomment-4483580706
- First L2 English translation PR: https://github.com/beihaili/Get-Started-with-Web3/pull/174
- Second L2 English translation PR: https://github.com/beihaili/Get-Started-with-Web3/pull/184
- Second L2 English translation: `en/L2CrossChain/02_RollupPrinciples/README.md`
- Quiz contributor PR: https://github.com/beihaili/Get-Started-with-Web3/pull/177
- Glossary contributor PR: https://github.com/beihaili/Get-Started-with-Web3/pull/178
- Dependabot eslint-config-prettier PR: https://github.com/beihaili/Get-Started-with-Web3/pull/182
- Dependabot Zustand PR: https://github.com/beihaili/Get-Started-with-Web3/pull/191
- Superseded upload-artifact PR: https://github.com/beihaili/Get-Started-with-Web3/pull/190
- Closed Node 22-only commitlint PR: https://github.com/beihaili/Get-Started-with-Web3/pull/181
- Closed Node 22-only lint-staged PR: https://github.com/beihaili/Get-Started-with-Web3/pull/183
- Closed Node 22-only commitlint config PR: https://github.com/beihaili/Get-Started-with-Web3/pull/192
- Replacement starter issue: https://github.com/beihaili/Get-Started-with-Web3/issues/186
- Replacement starter issue: https://github.com/beihaili/Get-Started-with-Web3/issues/187
- Open community PR: https://github.com/beihaili/Get-Started-with-Web3/pull/194
- Open community PR: https://github.com/beihaili/Get-Started-with-Web3/pull/195
- Open community PR: https://github.com/beihaili/Get-Started-with-Web3/pull/196
- Analytics/domain-readiness branch: `codex/site-analytics-domain-readiness`
- Site config: `src/config/siteConfig.js`
- Route analytics: `src/components/RouteAnalytics.jsx`
- AI manifest: `ai/manifest.json`
- AI content index: `ai/content-index.json`
