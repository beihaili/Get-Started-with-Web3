# Get Started with Web3 Execution Board

**Date:** 2026-05-14
**Owner:** beihai + Codex
**Goal:** Track the concrete work needed to reach 1000 stars, sustainable operations, and first meaningful revenue.

## Current Snapshot

| Area | Status | Next Action |
| --- | --- | --- |
| Technical health | Healthy | Keep `npm test`, `npm run lint`, `npm run ai:verify` green |
| GitHub growth | Under-monetized | Improve README conversion and launch distribution campaigns |
| SEO | Partially implemented | Fix language metadata and route coverage |
| English content | Incomplete | Close 17 missing translations or classify non-course docs |
| AI-native layer | Strong MVP | Productize story and prepare paid-tool landing |
| Monetization | Passive only | Create sponsor kit and sponsor outreach drafts |
| Community | Seeded | Turn issues into a contributor ladder |
| Personal brand | Underused | Convert every shipment into approved public posts |

## KPI Board

Update weekly.

| KPI | Baseline 2026-05-14 | Target 2026-06-14 | Target 2026-08-14 |
| --- | ---: | ---: | ---: |
| GitHub stars | 613 | 650 | 750 |
| Forks | 55 | 65 | 90 |
| Total contributors | 11 | 15 | 20 |
| Open good first issues | 10+ | 15 | 20 |
| 14-day GitHub unique visitors | 65 | 150 | 300 |
| Missing English translations | 17 | 0-5 | 0 |
| Sponsor conversations | 0 tracked | 3 | 10 |
| Monthly revenue | Not tracked | $50+ | $200+ |

## Workstreams

### 1. Growth Conversion

**Outcome:** More visitors convert to stars, followers, contributors, and learners.

- [ ] Rewrite README opening around "open-source, bilingual, AI-native Web3 curriculum".
- [ ] Add stronger "Star this repo" CTA without sounding spammy.
- [ ] Add a "Who this is for" section for beginners, builders, researchers, and AI agents.
- [ ] Add badges or links for `llms.txt`, MCP, sponsor, and contributors.
- [ ] Expand GitHub topic recommendations for repo settings: `ai-native`, `mcp`, `llms-txt`, `web3-education`, `bitcoin-education`, `defi`, `layer2`, `dao`.
- [ ] Draft GitHub repo description update for user approval.

### 2. SEO And Distribution

**Outcome:** More organic traffic and shareable entry pages.

- [ ] Fix `html lang`, `og:locale`, Twitter metadata, and JSON-LD language for `/en` pages.
- [ ] Ensure `/zh`, `/en`, `/glossary`, `/articles`, lesson pages, `llms.txt`, and AI artifact URLs are easy to discover.
- [ ] Add `glossary` routes to `scripts/generate-sitemap.mjs` and `scripts/prerender.mjs` if still missing.
- [ ] Check public prerendered HTML after build.
- [ ] Create `docs/strategy/awesome-list-submissions.md`.
- [ ] Draft submissions to Web3, Bitcoin, blockchain, open-source education, and AI-agent resource lists.

### 3. Content Product

**Outcome:** The curriculum feels complete and current enough to recommend.

- [ ] Finish or classify the 17 missing English translations.
- [ ] Prioritize English proofreading for the highest-intent pages: README, Web3 Quick Start, Bitcoin, DeFi, L2, AI-native entry.
- [ ] Create a content calendar with one public content theme per week.
- [ ] Turn newly added content modules into changelog/release notes.
- [ ] Add "Last updated" or freshness signals where valuable.

### 4. AI-Native Productization

**Outcome:** The project has a differentiated story and a path to paid tools.

- [ ] Add a README quick demo showing how an agent can use `npm run mcp:web3`.
- [ ] Add one copy-paste MCP client setup snippet if practical.
- [ ] Draft landing copy for `generate_personalized_web3_plan` and `audit_learning_answer`.
- [ ] Decide whether Phase 1 paid tool should be x402, Stripe, GitHub Sponsors gated, or manual payment.
- [ ] Keep local MCP free and clearly marked read-only.

### 5. Monetization

**Outcome:** First revenue is reachable without damaging trust.

- [ ] Create sponsor kit document with audience, placements, pricing, rules, and contact flow.
- [ ] Add sponsor analytics snapshot section; initially use GitHub traffic and public repo metrics.
- [ ] Draft 3 sponsor outreach templates: wallet, infrastructure, exchange/affiliate.
- [ ] Draft sponsor acceptance policy.
- [ ] Track sponsor leads in a simple Markdown table until volume justifies a CRM.
- [ ] Review donation and affiliate disclosures.

### 6. Contributor Community

**Outcome:** External contributors can help without heavy hand-holding.

- [ ] Create public roadmap issue draft.
- [ ] Improve issue templates with "expected files", "definition of done", and "good first issue candidate".
- [ ] Keep 10-20 good first issues active.
- [ ] Add contributor ladder to CONTRIBUTING docs.
- [ ] Draft monthly contributor spotlight template.
- [ ] Ensure contributor page has a reason to share.

### 7. Technical Stewardship

**Outcome:** Growth changes do not break the platform.

- [ ] Keep Dependabot PRs under control; evaluate Tailwind/ESLint major upgrades separately.
- [ ] Run `npm test`, `npm run lint`, and `npm run ai:verify` before claiming work is complete.
- [ ] Run `npm run build` before shipping SEO/prerender changes.
- [ ] Update `AGENTS.md` when architecture, commands, or operating docs change.
- [ ] Avoid adding heavy wallet or payment dependencies until a specific monetization experiment requires them.

## First 10 Tasks

1. Fix SEO language metadata for prerendered English pages.
2. Add missing `glossary` route coverage to sitemap and prerender.
3. Create sponsor kit.
4. Refresh README positioning.
5. Add AI-native quick demo to README.
6. Create awesome-list submission tracker.
7. Add contributor ladder to CONTRIBUTING.
8. Draft public roadmap issue.
9. Close or classify translation coverage warnings.
10. Draft first 4 public posts for user approval.

## Public Post Draft Queue

- [ ] "I turned my Web3 learning repo into an AI-readable curriculum with llms.txt + MCP."
- [ ] "A beginner-safe route from wallet creation to first DApp, DeFi, L2 and DAO."
- [ ] "How agents can search and cite a Web3 curriculum instead of hallucinating."
- [ ] "1000-star open-source roadmap: building Web3 education in public."

## Sponsor Lead Tracker

| Sponsor | Category | Fit | Status | Next Action |
| --- | --- | --- | --- | --- |
| Wallet projects | Wallet/security | Beginner onboarding and wallet safety lessons | Not contacted | Draft outreach |
| RPC/infrastructure providers | Devtool | Builder labs and Bitcoin RPC lessons | Not contacted | Draft outreach |
| L2 ecosystems | Chain/ecosystem | L2 and bridge lessons | Not contacted | Draft outreach |
| Security audit tools | Security | Web3 safety and smart contract security | Not contacted | Draft outreach |
| Exchanges | Exchange/affiliate | CEX onboarding and fiat on-ramp | Not contacted | Review trust policy first |

## Reporting Template

Daily report should include:

- Completed since last report.
- Current metric movement if available.
- Blockers or risks.
- Next 1-3 actions.
- External actions waiting for beihai approval.
