# Get Started with Web3 Execution Board

**Date:** 2026-05-14
**Owner:** beihai + Codex
**Goal:** Track the concrete work needed to reach 1000 stars, sustainable operations, and first meaningful revenue.

## Current Snapshot

| Area             | Status                | Next Action                                                                                            |
| ---------------- | --------------------- | ------------------------------------------------------------------------------------------------------ |
| Technical health | Healthy               | Ship analytics/domain-readiness safely, keep verification green, and plan Node 22 migration separately |
| GitHub growth    | Under-monetized       | Improve README conversion and launch distribution campaigns                                            |
| SEO              | Partially implemented | Fix language metadata and route coverage                                                               |
| English content  | Incomplete            | Close the remaining 12 missing translations or classify non-course docs                                |
| AI-native layer  | Strong MVP            | Productize story and prepare paid-tool landing                                                         |
| Monetization     | Passive only          | Create sponsor kit and sponsor outreach drafts                                                         |
| Community        | Converting            | Keep accepted contributor PRs moving into recognition and backlog refresh                              |
| Personal brand   | Underused             | Convert every shipment into public posts and distribution assets                                       |

## KPI Board

Update weekly.

| KPI                           | Baseline 2026-05-14 | Target 2026-06-14 | Target 2026-08-14 |
| ----------------------------- | ------------------: | ----------------: | ----------------: |
| GitHub stars                  |                 613 |               650 |               750 |
| Forks                         |                  55 |                65 |                90 |
| Total contributors            |                  11 |                15 |                20 |
| Open good first issues        |                 10+ |                15 |                20 |
| 14-day GitHub unique visitors |                  65 |               150 |               300 |
| Missing English translations  |                  17 |               0-5 |                 0 |
| Sponsor conversations         |           0 tracked |                 3 |                10 |
| Monthly revenue               |         Not tracked |              $50+ |             $200+ |

## Workstreams

### 1. Growth Conversion

**Outcome:** More visitors convert to stars, followers, contributors, and learners.

- [x] Rewrite README opening around "open-source, bilingual, AI-native Web3 curriculum".
- [x] Add stronger "Star this repo" CTA without sounding spammy.
- [x] Add a "Who this is for" section for beginners, builders, researchers, and AI agents.
- [x] Add badges or links for `llms.txt`, MCP, sponsor, and contributors.
- [ ] Expand GitHub topic recommendations for repo settings: `ai-native`, `mcp`, `llms-txt`, `web3-education`, `bitcoin-education`, `defi`, `layer2`, `dao`.
- [x] Update GitHub repo description and topics under autonomous approval policy.

### 2. SEO And Distribution

**Outcome:** More organic traffic and shareable entry pages.

- [x] Fix `html lang`, `og:locale`, Twitter metadata, and JSON-LD language for `/en` pages.
- [x] Ensure `/zh`, `/en`, `/glossary`, `/articles`, lesson pages, `llms.txt`, and AI artifact URLs are easy to discover.
- [x] Add `glossary` routes to `scripts/generate-sitemap.mjs` and `scripts/prerender.mjs` if still missing.
- [x] Add custom-domain-ready canonical, sitemap, robots, and AI artifact URL configuration without activating CNAME before DNS confirmation.
- [ ] Check public prerendered HTML after build.
- [x] Create `docs/strategy/awesome-list-submissions.md`.
- [x] Draft submissions to Web3, Bitcoin, blockchain, open-source education, and AI-agent resource lists.

### 3. Content Product

**Outcome:** The curriculum feels complete and current enough to recommend.

- [ ] Finish or classify the remaining 12 missing English translations.
- [ ] Prioritize English proofreading for the highest-intent pages: README, Web3 Quick Start, Bitcoin, DeFi, L2, AI-native entry.
- [x] Start Layer 2 English coverage with `en/L2CrossChain/01_WhyScaling/README.md`.
- [x] Add second Layer 2 English translation with `en/L2CrossChain/02_RollupPrinciples/README.md`.
- [x] Complete Layer 2 English coverage with `en/L2CrossChain/03_L2Ecosystem/README.md`, `en/L2CrossChain/04_CrossChainBridges/README.md`, and `en/L2CrossChain/05_L2PracticalGuide/README.md`.
- [x] Create a content calendar with one public content theme per week (`docs/strategy/2026-05-19-content-calendar.md`).
- [ ] Turn newly added content modules into changelog/release notes.
- [ ] Add "Last updated" or freshness signals where valuable.

### 4. AI-Native Productization

**Outcome:** The project has a differentiated story and a path to paid tools.

- [x] Add a README quick demo showing how an agent can use `npm run mcp:web3`.
- [x] Add one copy-paste MCP client setup snippet in README and AI artifacts.
- [x] Draft landing copy for `generate_personalized_web3_plan` and `audit_learning_answer`.
- [ ] Decide whether Phase 1 paid tool should be x402, Stripe, GitHub Sponsors gated, or manual payment.
- [ ] Keep local MCP free and clearly marked read-only.

### 5. Monetization

**Outcome:** First revenue is reachable without damaging trust.

- [x] Create sponsor kit document with audience, placements, pricing, rules, and contact flow.
- [x] Add sponsor analytics snapshot section; initially use GitHub traffic and public repo metrics.
- [x] Draft 3 sponsor outreach templates: wallet, infrastructure, exchange/affiliate.
- [x] Draft sponsor acceptance policy.
- [x] Track sponsor leads in a simple Markdown table until volume justifies a CRM: `docs/strategy/2026-05-15-sponsor-leads-tracker.md`.
- [x] Review donation and affiliate disclosures.

### 6. Contributor Community

**Outcome:** External contributors can help without heavy hand-holding.

- [x] Create public roadmap issue draft and pin it in GitHub: [#156](https://github.com/beihaili/Get-Started-with-Web3/issues/156).
- [x] Improve issue templates with "expected files", "definition of done", and "good first issue candidate".
- [x] Keep 10-20 good first issues active; 13 open as of 2026-05-20 after adding starter issues [#201](https://github.com/beihaili/Get-Started-with-Web3/issues/201), [#202](https://github.com/beihaili/Get-Started-with-Web3/issues/202), and [#203](https://github.com/beihaili/Get-Started-with-Web3/issues/203).
- [x] Add contributor ladder to CONTRIBUTING docs.
- [x] Draft monthly contributor spotlight template.
- [x] Publish first contributor spotlight and sync it to the pinned roadmap issue.
- [x] Ensure contributor page has a reason to share.

### 7. Technical Stewardship

**Outcome:** Growth changes do not break the platform.

- [x] Split i18n locale payload by route/feature namespace and validate main bundle shrinkage for [#93](https://github.com/beihaili/Get-Started-with-Web3/issues/93).
- [x] Improve mobile reader UX with a lesson drawer and swipe navigation for [#87](https://github.com/beihaili/Get-Started-with-Web3/issues/87).
- [x] Correct Tailwind CSS v4 entrypoint so production builds emit full theme utilities and class-based dark mode styles.
- [x] Add `sync-content` fallback coverage so English lessons do not ship broken local image references when the corresponding Chinese assets exist.
- [x] Prepare PR build artifact comments for [#40](https://github.com/beihaili/Get-Started-with-Web3/issues/40) so contributors can download reviewed builds from the Actions run.
- [x] Clear the 2026-05-19 Dependabot queue; merge Node-20-compatible updates, accept `actions/upload-artifact` v7 with a matching workflow test update, and close Node-22-only majors with notes.
- [x] Add SPA route-level GA pageview tracking and centralized site URL/base-path config for future `bhbtc.xyz` activation.
- [ ] Plan Node 22 migration before accepting `@commitlint/cli` v21, `@commitlint/config-conventional` v21, or `lint-staged` v17.
- [ ] Run `npm test`, `npm run lint`, and `npm run ai:verify` before claiming work is complete.
- [x] Expose translation coverage checks through `npm run translation:check`.
- [ ] Run `npm run build` before shipping SEO/prerender changes.
- [ ] Update `AGENTS.md` when architecture, commands, or operating docs change.
- [ ] Avoid adding heavy wallet or payment dependencies until a specific monetization experiment requires them.

## First 10 Tasks

1. Done: Fix SEO language metadata for prerendered English pages.
2. Done: Add missing `glossary` route coverage to sitemap and prerender.
3. Done: Create sponsor kit.
4. Done: Refresh README positioning.
5. Done: Add AI-native quick demo to README.
6. Done: Create awesome-list submission tracker.
7. Done: Add contributor ladder to CONTRIBUTING.
8. Done: Draft and pin public roadmap issue [#156](https://github.com/beihaili/Get-Started-with-Web3/issues/156).
9. Close or classify translation coverage warnings.
10. In progress: draft and publish first 4 low-risk public posts, with links recorded in daily reports.

## Public Post Draft Queue

- [x] Chinese Web3 community starter post: `docs/strategy/2026-05-15-public-post-drafts.md`
- [x] X/Farcaster AI-native curriculum thread: `docs/strategy/2026-05-15-public-post-drafts.md`
- [ ] "I turned my Web3 learning repo into an AI-readable curriculum with llms.txt + MCP."
- [ ] "A beginner-safe route from wallet creation to first DApp, DeFi, L2 and DAO."
- [ ] "How agents can search and cite a Web3 curriculum instead of hallucinating."
- [ ] "1000-star open-source roadmap: building Web3 education in public."

## Sponsor Lead Tracker

Detailed tracker: `docs/strategy/2026-05-15-sponsor-leads-tracker.md`.

| Sponsor                   | Category                       | Fit                                                        | Status      | Next Action                                          |
| ------------------------- | ------------------------------ | ---------------------------------------------------------- | ----------- | ---------------------------------------------------- |
| Safe Ecosystem Foundation | Smart accounts / grants        | Account abstraction, wallet recovery, security education   | Queued      | Prepare grant-style impact memo                      |
| Reown / WalletConnect     | Wallet UX / connectivity infra | Wallet connection safety and onboarding UX                 | Queued      | Personalize wallet sponsor outreach                  |
| QuickNode                 | RPC / infrastructure           | Builder labs, RPC lessons, developer onboarding            | Queued      | Personalize infrastructure sponsor outreach          |
| Blockaid or Blowfish      | Security tooling               | Scam, approval, signing, and transaction-warning education | Queued      | Pick one first security outreach                     |
| Ethereum Foundation ESP   | Public goods / grants          | AI-native open-source Ethereum learning resources          | Researching | Package public-goods impact memo                     |
| Exchanges                 | Exchange / affiliate           | CEX onboarding and fiat on-ramp                            | Hold        | Requires explicit trust-policy review before contact |

## Reporting Template

Daily reports live in `docs/operations/` and use `docs/operations/templates/daily-report-template.md`.

Daily report should include:

- Completed since last report.
- Current metric movement if available.
- Blockers or risks.
- Next 1-3 actions.
- External actions executed or queued, with any high-risk items called out.

## External Action Log

| Date       | Action                                                                                          | Result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-05-14 | Updated GitHub repo description, homepage, and topics for AI-native Web3 curriculum positioning | Completed via `gh repo edit`; topics now include `ai-native`, `mcp`, `llms-txt`, `web3-education`, `bitcoin-education`, `defi`, `layer2`, `dao`, `ethereum`, `learning-platform`                                                                                                                                                                                                                                                                                                                                                     |
| 2026-05-18 | Pinned public 1000-star roadmap issue and seeded contributor starter backlog                    | Created [#156](https://github.com/beihaili/Get-Started-with-Web3/issues/156) and six new good-first issues [#157](https://github.com/beihaili/Get-Started-with-Web3/issues/157)-[#162](https://github.com/beihaili/Get-Started-with-Web3/issues/162), bringing open good-first issues to 10                                                                                                                                                                                                                                          |
| 2026-05-18 | Accepted first starter proofreading PR and backfilled contributor queue                         | Merged external contributor PR [#167](https://github.com/beihaili/Get-Started-with-Web3/pull/167), closed [#159](https://github.com/beihaili/Get-Started-with-Web3/issues/159), and opened replacement good-first issue [#169](https://github.com/beihaili/Get-Started-with-Web3/issues/169)                                                                                                                                                                                                                                         |
| 2026-05-18 | Published first contributor spotlight artifact                                                  | Created `docs/community/spotlights/2026-05-first-contributor-spotlight.md` to recognize [#167](https://github.com/beihaili/Get-Started-with-Web3/pull/167) using public PR/issue evidence and no reward promises                                                                                                                                                                                                                                                                                                                     |
| 2026-05-18 | Updated pinned roadmap with first contributor spotlight loop                                    | Posted a public [#156 roadmap update](https://github.com/beihaili/Get-Started-with-Web3/issues/156#issuecomment-4474624411) linking accepted starter PR [#167](https://github.com/beihaili/Get-Started-with-Web3/pull/167), closed issue [#159](https://github.com/beihaili/Get-Started-with-Web3/issues/159), and replacement starter issue [#169](https://github.com/beihaili/Get-Started-with-Web3/issues/169)                                                                                                                    |
| 2026-05-18 | Published first Layer 2 English translation and backfilled translation backlog                  | Merged [#174](https://github.com/beihaili/Get-Started-with-Web3/pull/174) for `en/L2CrossChain/01_WhyScaling/README.md`, reduced missing English translation warnings from 17 to 16, and opened follow-up starter issue [#175](https://github.com/beihaili/Get-Started-with-Web3/issues/175) for the remaining module 9 lessons                                                                                                                                                                                                      |
| 2026-05-19 | Published second Layer 2 English translation                                                    | Merged [#184](https://github.com/beihaili/Get-Started-with-Web3/pull/184) for `en/L2CrossChain/02_RollupPrinciples/README.md`, regenerated AI artifacts to 108 lesson entries, reduced local translation coverage warnings from 16 to 15, confirmed main deploy [run 26069716949](https://github.com/beihaili/Get-Started-with-Web3/actions/runs/26069716949), and updated [#175](https://github.com/beihaili/Get-Started-with-Web3/issues/175#issuecomment-4483580706)                                                              |
| 2026-05-19 | Replenished starter backlog and synced glossary artifacts                                       | [#177](https://github.com/beihaili/Get-Started-with-Web3/pull/177) and [#178](https://github.com/beihaili/Get-Started-with-Web3/pull/178) landed, closing [#162](https://github.com/beihaili/Get-Started-with-Web3/issues/162) and [#158](https://github.com/beihaili/Get-Started-with-Web3/issues/158); opened growth starter issues [#186](https://github.com/beihaili/Get-Started-with-Web3/issues/186) and [#187](https://github.com/beihaili/Get-Started-with-Web3/issues/187); regenerated AI artifacts to 57 glossary entries |
| 2026-05-19 | Cleared Dependabot queue                                                                        | Merged Node-20-compatible [#182](https://github.com/beihaili/Get-Started-with-Web3/pull/182) after local `npm run lint` and `npm test`; closed Node-22-only [#181](https://github.com/beihaili/Get-Started-with-Web3/pull/181) and [#183](https://github.com/beihaili/Get-Started-with-Web3/pull/183); added Dependabot ignore rules for those major lines until a planned Node 22 migration                                                                                                                                         |
| 2026-05-19 | Completed second Dependabot follow-up                                                           | Merged Node-20-compatible [#191](https://github.com/beihaili/Get-Started-with-Web3/pull/191), closed Node-22-only [#192](https://github.com/beihaili/Get-Started-with-Web3/pull/192), and superseded failing [#190](https://github.com/beihaili/Get-Started-with-Web3/pull/190) by updating `actions/upload-artifact` and the matching workflow test together                                                                                                                                                                        |
| 2026-05-19 | Prepared website analytics and `bhbtc.xyz` readiness                                            | Added centralized site URL/base-path config, route-level GA pageview tracking, env-driven sitemap/robots/AI artifact URL generation, and documented that CNAME/DNS activation still needs confirmation before changing GitHub Pages custom domain settings                                                                                                                                                                                                                                                                           |
| 2026-05-19 | Fixed fork PR artifact-comment failures and merged growth calendar                              | Merged [#198](https://github.com/beihaili/Get-Started-with-Web3/pull/198) so fork PRs no longer fail when they cannot write preview comments; reran and merged [#194](https://github.com/beihaili/Get-Started-with-Web3/pull/194), adding `docs/strategy/2026-05-19-content-calendar.md`; closed [#195](https://github.com/beihaili/Get-Started-with-Web3/pull/195) as an empty duplicate after main already contained the glossary terms                                                                                            |
| 2026-05-19 | Published final Layer 2 English translation integration                                         | Merged [#199](https://github.com/beihaili/Get-Started-with-Web3/pull/199), extracting lessons 9-3 to 9-5 from dirty PR [#196](https://github.com/beihaili/Get-Started-with-Web3/pull/196) without taking already-merged quiz and lesson 9-2 changes; closed [#175](https://github.com/beihaili/Get-Started-with-Web3/issues/175), closed [#196](https://github.com/beihaili/Get-Started-with-Web3/pull/196) as superseded/integrated, regenerated AI artifacts to 111 lesson entries, and reduced translation warnings to 12         |
| 2026-05-20 | Replenished contributor starter queue                                                           | Created good-first issues [#201](https://github.com/beihaili/Get-Started-with-Web3/issues/201), [#202](https://github.com/beihaili/Get-Started-with-Web3/issues/202), and [#203](https://github.com/beihaili/Get-Started-with-Web3/issues/203), restoring the queue to 13 open starter tasks across mobile UX, sponsor research, and lesson visuals                                                                                                                                                                                  |
