# Get Started with Web3 Daily Operations Report

**Date:** 2026-05-21
**Owner:** beihai + Codex
**Reporting window:** Asia/Shanghai, captured after 2026-05-21 10:15 local time.

## KPI Snapshot

| Metric | Current | Previous / Baseline | Movement | Source |
| --- | ---: | ---: | ---: | --- |
| GitHub stars | 614 | 614 | 0 | `gh repo view beihaili/Get-Started-with-Web3` |
| Forks | 58 | 58 | 0 | `gh repo view beihaili/Get-Started-with-Web3` |
| Watchers | 3 | 3 | 0 | `gh repo view beihaili/Get-Started-with-Web3` |
| Open PRs | 0 | 1 | -1 | `gh pr list --state open` |
| Open issues | 14 | 14 | 0 | `gh issue list --state open` |
| Open good-first issues | 13 | 13 | 0 | `gh issue list --state open --json labels` |

## Completed

- Content: DAO Governance English translation PR [#210](https://github.com/beihaili/Get-Started-with-Web3/pull/210) was merged; latest AI index now reports 116 lesson entries and 57 glossary entries.
- Platform: prepared `bhbtc.xyz` activation in code by switching default site URL/base path to `https://bhbtc.xyz` and `/`, adding `public/CNAME`, updating PWA/404/service-worker paths, and configuring CI deploys with `VITE_SITE_BASE_URL`, `SITE_BASE_URL`, `VITE_BASE_PATH=/`, and `cname: bhbtc.xyz`.
- AI-native: regenerated and published `ai/` and `public/ai/` artifacts so `llms.txt`, manifest, content index, and lesson citations point to `https://bhbtc.xyz`.
- Community / distribution: recorded X `@bhbtc1337` as the approved public-update account and added a custom-domain / AI-native X draft to `docs/strategy/2026-05-15-public-post-drafts.md`.
- Monetization: Safe and Reown outreach are approved; tracker and impact memo now use current metrics, `https://bhbtc.xyz`, and Safe's official `grants@safefoundation.org` channel.
- Operations: updated `AGENTS.md`, execution board, sponsor tracker, sponsor impact memo, lab templates, and this daily report with the new domain and operating constraints.

## Deploy And Verification

| Surface | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Latest production deploy | Success | [Run 26199425161](https://github.com/beihaili/Get-Started-with-Web3/actions/runs/26199425161) | Main deploy for DAO Governance English translation completed before domain-switch branch |
| Tests | Pass | `npm test` | 46 files / 241 tests passed |
| Lint | Pass | `npm run lint` | ESLint completed with 0 errors |
| AI entrypoints | Pass | `npm run ai:verify` | Source/public artifacts, MCP tools, bilingual coverage, and x402 metadata passed |
| Production build | Pass | `npm run build` | 131 prerender routes succeeded; `dist/CNAME`, sitemap, robots, and AI manifest point to `bhbtc.xyz` |
| Local smoke | Partial pass | Playwright against `http://127.0.0.1:4173/` | Root and account-abstraction lesson rendered with `bhbtc.xyz` canonical; only local Cloudflare analytics CORS errors appeared |

## External Distribution

| Target | Status | Evidence | Next action |
| --- | --- | --- | --- |
| X `@bhbtc1337` | Approved, draft ready | `docs/strategy/2026-05-15-public-post-drafts.md` | Needs authenticated X session to publish |
| GitHub repo homepage | Queued | Current repo homepage still `https://beihaili.github.io/Get-Started-with-Web3/` | Update after the domain-switch PR is merged and GitHub Pages is serving root-path assets |
| `bhbtc.xyz` DNS | Blocked externally | `curl -I https://bhbtc.xyz/` currently returns `server: Vercel` | Point DNS to GitHub Pages before final cutover |

## Sponsor And Revenue

| Lead / Channel | Status | Next action | Risk notes |
| --- | --- | --- | --- |
| Safe Ecosystem Foundation / `grants@safefoundation.org` | Approved, not sent | Send grant-style proposal from a confirmed sender email | Keep ask educational and open-source; no placement, exclusivity, token, or affiliate promises |
| Reown / WalletConnect contact page | Approved, not sent | Submit partnership/sales inquiry from authenticated browser or sender email | Keep framing around wallet UX education; no wallet endorsement |
| QuickNode | Queued | Personalize after Safe/Reown first send | Infrastructure fit is strong, but do not promise developer acquisition numbers |

## Blockers And Risks

- `bhbtc.xyz` currently responds from Vercel, so adding GitHub Pages `CNAME` alone will not move traffic; DNS must be changed to GitHub Pages records.
- Sponsor outreach cannot be truthfully marked as sent from the current environment because no sender email / authenticated contact-form session is available.
- X post cannot be marked as published until an authenticated `@bhbtc1337` session is available.
- GitHub repo homepage should stay on the old URL until the domain-switch branch is merged and the GitHub Pages deploy has root-path assets.

## Next Operating Block

1. Commit and open the `bhbtc.xyz` domain-switch PR; merge after CI passes.
2. After deploy, set GitHub Pages custom domain/homepage and verify HTTPS/canonical/sitemap/AI entrypoints on production.
3. Publish the X custom-domain update and send Safe/Reown outreach once authenticated external channels are available.

## Evidence Links

- Repository: https://github.com/beihaili/Get-Started-with-Web3
- Current production site before cutover: https://beihaili.github.io/Get-Started-with-Web3/
- Target custom domain: https://bhbtc.xyz/
- Latest main deploy: https://github.com/beihaili/Get-Started-with-Web3/actions/runs/26199425161
- Safe grants page: https://safefoundation.org/grants
- Reown contact page: https://reown.com/contact
