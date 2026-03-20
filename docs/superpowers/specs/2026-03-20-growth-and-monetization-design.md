# Growth & Monetization Design Spec

**Date**: 2026-03-20
**Status**: Approved
**Author**: beihai + Claude

## Context

Get-Started-with-Web3 is a Chinese-language open-source Web3/Bitcoin educational platform with 6 modules, 37 lessons, 90 quiz questions, AI tutoring, badge system, PWA support, and SSG prerendering. It has ~8 contributors and zero monetization. The project owner invests 5-15 hours/week and has a small existing community (tens to hundreds of members).

## Goals

1. **Grow user base globally** — attract developers worldwide to learn on the platform
2. **Generate cash flow** — explore multiple low-friction revenue channels, scale what works
3. **Keep maintenance low** — all solutions must be sustainable at 5-15 hrs/week

## Strategy

**"Content-Led Growth + Multi-Channel Low-Friction Monetization"**

All content stays free and open. Maximize organic traffic via SEO + i18n. Layer multiple lightweight monetization channels that grow with traffic. No paywalls.

---

## Part 1: i18n Internationalization Framework

### Content Translation Strategy

- AI-translate all 37 lessons from `zh/` to `en/`, maintaining identical directory structure
- Store English content in `en/` directory at project root (note: `en/` already partially exists with ~3 files — audit existing translations, keep those that are accurate, overwrite or regenerate the rest)
- Prioritize first 2 modules (Web3 Quick Start + Bitcoin Cryptography) — highest traffic entry points
- Tag translated PRs with `translation-review` label for community proofreading

### Application-Layer i18n

- Integrate `react-i18next` for UI string localization
- **Routing architecture**: Language is a route parameter, not a separate route tree. The existing `createBrowserRouter` with `basename: '/Get-Started-with-Web3'` stays unchanged. Add a top-level `/:lang` parameter wrapping all routes:
  - `/:lang/learn/:moduleSlug/:lessonSlug` (e.g., `/en/learn/module-1/1-1`)
  - `/:lang/dashboard`, `/:lang/badges`, etc.
  - Root `/` redirects based on `navigator.language`: Chinese → `/zh/dashboard`, else → `/en/dashboard`
- **Locale resolution**: A `LanguageProvider` context reads `:lang` from the URL and passes it to `react-i18next` and `useContentStore`. No store state needed — URL is the single source of truth.
- **`useContentStore` extension**: `fetchLessonContent(lang, lessonPath)` loads from `public/content/{lang}/{lessonPath}/README.md`. The existing `zh/` fetch logic stays as-is, `en/` follows the same pattern.
- Language switcher component in the navigation bar — swaps `:lang` segment in current URL
- Auto-detect browser language on first visit only (root `/` redirect)

### Content Sync Pipeline Extension

- Extend `sync-content.mjs` to sync both `zh/` and `en/` directories into `public/content/`
- Add `i18n` field to `courseData.js` — each lesson maps to both Chinese and English paths

### Maintenance Cost Control

- One-time AI bulk translation, ongoing community PR proofreading only
- CI reminder when a Chinese lesson lacks an English counterpart
- No runtime translation API calls — all content is static markdown

---

## Part 2: SEO Deep Optimization

### Structured Data (Schema.org)

- Add `Course` + `Article` JSON-LD structured data to each lesson page
- Add `WebSite` + `Organization` structured data at platform level
- Add `Quiz` structured data to quiz sections for Google rich snippet eligibility

### Meta Tags & Open Graph

- Dynamic `<title>`, `<meta description>`, `og:title`, `og:description`, `og:image` per lesson
- Description sourced from lesson title + first 150 characters of content
- **OG image generation**: Use `satori` + `@resvg/resvg-js` at build time. A Node.js script reads `courseData.js`, generates one PNG per lesson (lesson name + module name + brand logo on a branded template). Images output to `dist/og/` during build. Each lesson's prerendered HTML references `/Get-Started-with-Web3/og/{moduleId}-{lessonId}.png`. New lessons auto-generate on next build.

### URL & Sitemap

- **URL migration strategy**: Keep existing ID-based URL structure (`/:lang/learn/:moduleId/:lessonId`) rather than introducing semantic slugs. Rationale:
  - GitHub Pages does not support server-side redirects — migrating URLs risks breaking existing bookmarks and search index entries
  - Slug mapping layer adds complexity and a new source of bugs for minimal SEO benefit (search engines weight page content and meta tags far more than URL keywords)
  - IDs are already stable and unique; SEO value comes from `<title>`, `<meta description>`, and structured data — not URL slugs
  - This avoids the need for a redirect map, slug definitions in `courseData.js`, and prerender script restructuring
- Full URL example: `https://beihaili.github.io/Get-Started-with-Web3/en/learn/module-1/1-1`
- Auto-generate `sitemap.xml` at build time covering all lesson pages in both languages (read routes from `courseData.js`, generate for both `/en/` and `/zh/` prefixes)
- Add `robots.txt` ensuring search engines can crawl prerendered pages

### SSG Prerender Enhancement

- Extend existing `prerender.mjs` (Playwright-based) to cover all lesson pages in both languages
- Prerendered HTML includes full meta tags and structured data
- Add `<link rel="alternate" hreflang="zh">` / `hreflang="en">` cross-references

### Article Index Page

- New `/articles` (or `/blog`) page listing all lessons as article cards
- High-authority SEO landing page in itself
- Organized by module, each card shows title, excerpt, estimated reading time

### Maintenance

- Structured data and meta tags auto-generated from `courseData.js` — zero ongoing maintenance
- Sitemap generated at build time
- OG images use template — new lessons auto-adapt

---

## Part 3: Multi-Channel Low-Friction Monetization

### Tier 1: Donations (Lowest Friction, Immediate)

- **GitHub Sponsors** — enable on repo, add sponsor button to README
- **Buy Me a Coffee / Ko-fi** — one-time or monthly donations, embedded in Landing Page and at the bottom of each lesson
- **Crypto wallets** — ETH/BTC/USDT addresses displayed in README + footer + dedicated `/support` page
- Expected: $50-300/month (traffic-dependent)

### Tier 2: Sponsors (Medium Effort, High Return)

- **Sponsor display system** on Landing Page and README with tiered placement:
  - **Bronze**: README logo ($200/month)
  - **Silver**: README + Landing Page logo ($500/month)
  - **Gold**: Above + lesson page inline banner "Powered by" at top of content area ($1k/month) — note: no sidebar; ReaderPage is full-width, so this is a subtle inline banner above the markdown content
- **Sponsor kit page** showing monthly visits, GitHub stars, user geography for data-driven proposals
- Target sponsors: Web3 wallets (MetaMask, Phantom), exchanges, L2 projects, dev tools (Alchemy, Infura)
- Expected: 1-3 sponsors = $200-3k/month

### Tier 3: Affiliate Links (Passive Income)

- **Exchange signup links** — naturally embedded in relevant lessons (e.g., DeFi lessons recommend exchanges)
- **Hardware wallet referrals** — Ledger/Trezor links in security-related lessons
- **Dev tool referrals** — Alchemy, QuickNode developer referral programs
- All affiliate links marked `rel="sponsored"`, disclosed at page bottom ("Some links are affiliate links")
- Expected: $100-500/month (traffic and conversion dependent)

### Tier 4: NFT Completion Certificates (Crypto-Native)

- After completing a module, users can mint an NFT certificate
- Certificate contains: wallet address, module name, completion date, quiz score

**Smart contract:**
- Simple ERC-721 contract (OpenZeppelin base) deployed on **Base** (lowest gas, strong ecosystem)
- Contract owner is the project wallet; deployment cost ~$1-5 on Base
- `mint(moduleId, score, completionDate)` function with a configurable `mintFee` (initially $5 equivalent in ETH)
- The mint fee is paid to the contract owner on top of gas (gas on Base is <$0.01, negligible)
- Contract is deployed once and managed via a simple admin function to update mint fee

**NFT metadata:**
- Stored on IPFS via **Pinata** free tier (1GB, sufficient for text metadata + small certificate images)
- Metadata JSON + certificate image (generated from template, similar to OG images) pinned at mint time
- `tokenURI` points to `ipfs://` hash — fully decentralized, no ongoing hosting cost
- Pinata free tier handles the volume; upgrade to $20/month only if >1000 mints/month

**Frontend wallet integration:**
- Use **wagmi v2** + **viem** + **ConnectKit** (or RainbowKit) for wallet connection
- These are added as dependencies only to the NFT minting page/component — lazy-loaded, no impact on main bundle
- Mint flow: Connect Wallet → Review Certificate Preview → Confirm Mint → Share on Twitter
- Wallet connection is scoped to NFT minting only — no site-wide auth system

**Certificates displayable on LinkedIn/Twitter — built-in viral distribution**
- Expected: $200-1k/month (at 50-100 mints/month)

### Tier 5: "Thank the Author" Button

- Bottom of each lesson: "Did this help? Buy the author a coffee" button
- Links to Buy Me a Coffee or direct Crypto transfer
- One component, zero maintenance

### Support Page (Optional, Low Priority)

- `/support` page displaying: current sponsors, donation goal progress bar, Crypto wallet addresses, affiliate partners
- Transparent fund usage breakdown (hosting, domain, content creation) to build donation trust

### Maintenance Summary

| Channel | Initial Dev | Ongoing Maintenance |
|---------|------------|-------------------|
| Donation links | 2-3 hours | None |
| Sponsor system | 4-6 hours | 1-2 hrs/month (outreach) |
| Affiliate links | 2-3 hours | Quarterly check |
| NFT certificates | 15-20 hours | Minimal (Pinata free tier monitoring, contract mint fee adjustments) |
| Thank-you button | 30 minutes | None |

---

## Part 4: Developer Experience & Growth Flywheel

### GitHub Repository Discoverability

- **README in English** — default README is English; link to `README.zh.md` for Chinese version
- **Topic tags** — `web3`, `bitcoin`, `blockchain`, `tutorial`, `education`, `learn-web3`, `cryptocurrency`, `chinese`, `english`
- **Awesome List submissions** — PR to `awesome-web3`, `awesome-bitcoin`, `awesome-blockchain`
- **GitHub Social Preview** — designed cover image (course highlights + features + multilingual)

### Contributor Onboarding

- **`good-first-issue` labels** — maintain 10-20 beginner-friendly issues at all times:
  - Translation proofreading (lowest barrier: fix errors in one English translation)
  - Add new quiz questions
  - Small UI improvements (dark mode, animation tweaks)
  - Documentation improvements
- **Quick-start guide in CONTRIBUTING.md** — "Complete your first contribution in 5 minutes" flowchart
- **Content template** — Markdown template for new lessons to lower the content contribution barrier

### Contributor Recognition & Incentives

- **Contributors page** (`/contributors`) — avatars, contribution count, badges
- **Contributor NFT badges** — tiered (first contribution, 10 contributions, translation contributor), same contract as completion certificates
- **README contributor wall** — automated via `all-contributors` bot
- **Monthly contributor spotlight** — highlighted on Twitter/community channels

### Growth Flywheel

```
User learns → Earns badge/certificate → Social share (Twitter/LinkedIn)
     |                                        |
     v                                        v
Discovers issues → Submits contribution    New users via shared links
     |                                        |
     v                                        v
Earns contributor NFT → Social share      Search engine indexes → More organic traffic
     |                                        |
     v                                        v
Becomes active contributor                Sponsors see traffic → Sponsorship revenue
```

Key principle: **every user action has a natural "share exit"**:
- Complete lesson → share achievement card (existing ShareCard component)
- Mint NFT → on-chain visible + Twitter share
- Contribute code → contributor wall + NFT badge
- Sponsor project → sponsor display page

### Analytics (Low Cost)

- **Cloudflare Web Analytics** (free, zero-setup, privacy-friendly) as primary — or **Plausible Cloud** ($9/month) if more detailed data needed
- Track key metrics: MAU, lesson completion rate, language distribution, traffic sources
- Data feeds sponsor proposals and optimization decisions
- Avoid self-hosting analytics (contradicts low-maintenance goal)

### Maintenance

| Item | Initial Investment | Ongoing Maintenance |
|------|-------------------|-------------------|
| README English + tags | 2-3 hours | None |
| Awesome List submissions | 2 hours | None |
| Good-first-issue maintenance | 1 hour | 30 min/week |
| Contributors page | 4-6 hours | None (automated) |
| Contributor NFT | Merged into certificate contract | None |
| Analytics integration | 1-2 hours | None |

---

## Total Estimated Effort

Phases are sequential (no overlap) to avoid context-switching at 5-15 hrs/week:

| Phase | Items | Hours |
|-------|-------|-------|
| Phase 1: Quick wins (week 1-2) | Donation links, thank-you button, README English, topic tags, analytics, Crypto wallet addresses | 8-12 |
| Phase 2: i18n framework (week 3-7) | `react-i18next` integration, `/:lang` routing, `LanguageProvider`, `useContentStore` extension, `sync-content.mjs` update, extract all UI strings | 30-40 |
| Phase 3: Content translation (week 8-10) | AI bulk translate 37 lessons, audit existing `en/` files, community review setup | 10-15 |
| Phase 4: SEO optimization (week 11-14) | Structured data, meta tags, OG image pipeline, sitemap, robots.txt, hreflang, prerender extension, article index page | 20-25 |
| Phase 5: Monetization features (week 15-19) | Sponsor display system, affiliate links, NFT contract (Solidity + deploy), wallet integration (wagmi), mint UI, IPFS metadata | 20-30 |
| Phase 6: Growth features (week 20-22) | Contributors page, contributor NFT, awesome list submissions, good-first-issues curation | 10-15 |
| **Total** | | **98-137 hours (~12-18 weeks at 8 hrs/week)** |

## Revenue Projections

**Phase 1 (month 1-3, ~1k MAU):**

| Channel | Monthly Estimate |
|---------|-----------------|
| Donations + Crypto tips | $20-100 |
| **Total** | **$20-100** |

**Phase 2 (month 4-6, ~2-3k MAU with English content indexed):**

| Channel | Monthly Estimate |
|---------|-----------------|
| Donations | $50-200 |
| Sponsors (0-1) | $0-500 |
| Affiliate links | $50-200 |
| **Total** | **$100-900** |

**Phase 3 (month 7-12, ~5k MAU target):**

| Channel | Monthly Low | Monthly High |
|---------|-----------|-------------|
| Donations | $50 | $300 |
| Sponsors (1-3) | $200 | $3,000 |
| Affiliate links | $100 | $500 |
| NFT certificates | $200 | $1,000 |
| **Total** | **$550** | **$4,800** |

Note: 5k MAU is aspirational and depends on content quality, SEO indexing speed, and community growth. Niche Web3 education in English is a competitive space — actual numbers may vary significantly.

## Non-Goals

- No paywall on any existing content
- No site-wide user authentication system (wallet connection is scoped to NFT minting page only, using wagmi + ConnectKit, lazy-loaded)
- No enterprise training features (too high maintenance for 5-15 hrs/week)
- No real-time AI translation (static pre-translated content only)
- No custom domain purchase at this stage (GitHub Pages is sufficient)
