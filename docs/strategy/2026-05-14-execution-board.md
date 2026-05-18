# Get Started with Web3 Execution Board

**Date:** 2026-05-14
**Owner:** beihai + Codex
**Goal:** Track the concrete work needed to reach 1000 stars, sustainable operations, and first meaningful revenue.

## Current Snapshot

| Area             | Status                | Next Action                                                      |
| ---------------- | --------------------- | ---------------------------------------------------------------- |
| Technical health | Healthy               | Keep `npm test`, `npm run lint`, `npm run ai:verify` green       |
| GitHub growth    | Under-monetized       | Improve README conversion and launch distribution campaigns      |
| SEO              | Partially implemented | Fix language metadata and route coverage                         |
| English content  | Incomplete            | Close 17 missing translations or classify non-course docs        |
| AI-native layer  | Strong MVP            | Productize story and prepare paid-tool landing                   |
| Monetization     | Passive only          | Create sponsor kit and sponsor outreach drafts                   |
| Community        | Seeded                | Keep the pinned roadmap and 10+ starter issues current           |
| Personal brand   | Underused             | Convert every shipment into public posts and distribution assets |

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
- [ ] Check public prerendered HTML after build.
- [x] Create `docs/strategy/awesome-list-submissions.md`.
- [x] Draft submissions to Web3, Bitcoin, blockchain, open-source education, and AI-agent resource lists.

### 3. Content Product

**Outcome:** The curriculum feels complete and current enough to recommend.

- [ ] Finish or classify the 17 missing English translations.
- [ ] Prioritize English proofreading for the highest-intent pages: README, Web3 Quick Start, Bitcoin, DeFi, L2, AI-native entry.
- [ ] Create a content calendar with one public content theme per week.
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
- [ ] Review donation and affiliate disclosures.

### 6. Contributor Community

**Outcome:** External contributors can help without heavy hand-holding.

- [x] Create public roadmap issue draft and pin it in GitHub: [#156](https://github.com/beihaili/Get-Started-with-Web3/issues/156).
- [x] Improve issue templates with "expected files", "definition of done", and "good first issue candidate".
- [x] Keep 10-20 good first issues active; 10 open as of 2026-05-18.
- [x] Add contributor ladder to CONTRIBUTING docs.
- [ ] Draft monthly contributor spotlight template.
- [ ] Ensure contributor page has a reason to share.

### 7. Technical Stewardship

**Outcome:** Growth changes do not break the platform.

- [x] Split i18n locale payload by route/feature namespace and validate main bundle shrinkage for [#93](https://github.com/beihaili/Get-Started-with-Web3/issues/93).
- [x] Improve mobile reader UX with a lesson drawer and swipe navigation for [#87](https://github.com/beihaili/Get-Started-with-Web3/issues/87).
- [x] Correct Tailwind CSS v4 entrypoint so production builds emit full theme utilities and class-based dark mode styles.
- [x] Add `sync-content` fallback coverage so English lessons do not ship broken local image references when the corresponding Chinese assets exist.
- [x] Prepare PR build artifact comments for [#40](https://github.com/beihaili/Get-Started-with-Web3/issues/40) so contributors can download reviewed builds from the Actions run.
- [ ] Keep Dependabot PRs under control; evaluate Tailwind/ESLint major upgrades separately.
- [ ] Run `npm test`, `npm run lint`, and `npm run ai:verify` before claiming work is complete.
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

| Date       | Action                                                                                          | Result                                                                                                                                                                                                                                                                                      |
| ---------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-05-14 | Updated GitHub repo description, homepage, and topics for AI-native Web3 curriculum positioning | Completed via `gh repo edit`; topics now include `ai-native`, `mcp`, `llms-txt`, `web3-education`, `bitcoin-education`, `defi`, `layer2`, `dao`, `ethereum`, `learning-platform`                                                                                                            |
| 2026-05-18 | Pinned public 1000-star roadmap issue and seeded contributor starter backlog                    | Created [#156](https://github.com/beihaili/Get-Started-with-Web3/issues/156) and six new good-first issues [#157](https://github.com/beihaili/Get-Started-with-Web3/issues/157)-[#162](https://github.com/beihaili/Get-Started-with-Web3/issues/162), bringing open good-first issues to 10 |
