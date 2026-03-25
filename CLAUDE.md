# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Web3 and Bitcoin educational platform (primarily Chinese content) built with React + Zustand + React Router. Tutorials live as markdown in `zh/` and are synced into the React app for rendering. Features include badge/achievement system, AI tutor (Gemini), fuzzy search, PWA/offline support, and SSG prerendering. Live at https://beihaili.github.io/Get-Started-with-Web3/.

## Commands

```bash
npm run dev              # Start dev server (auto-syncs content first)
npm run build            # Production build (auto-syncs content first)
npm run lint             # ESLint with --max-warnings 0
npm run lint:fix         # ESLint auto-fix
npm run format           # Prettier format
npm run format:check     # Prettier check
npm test                 # Run all tests once (vitest run)
npm run test:watch       # Vitest in watch mode
npx vitest run src/store/__tests__/useUserStore.test.js  # Single test file
npx vitest run -t "test name pattern"                     # Single test by name
npm run sync-content     # Manually sync zh/ markdown into public/content/
npm run deploy           # Build + deploy to GitHub Pages
npm run organize:all     # Rename + format markdown files in zh/
```

## Architecture

### Content Pipeline

1. `scripts/sync-content.mjs` copies `zh/` subdirectories into `public/content/zh/` (runs automatically before dev/build via npm lifecycle hooks). Synced folders: `Web3QuickStart`, `GetStartedWithBitcoin`, `Web3Thoughts`, `其它学习资源整理/{DeFi,Etherum,Layer2,新兴公链生态,AI_Web3,实用工具}`
2. `useContentStore` fetches markdown at runtime: tries local `/Get-Started-with-Web3/content/{path}/README.md` first, falls back to GitHub raw URL
3. Content is cached in-memory (max 50 entries, 7-day TTL) with fetch de-duplication
4. `MarkdownRenderer` renders the fetched markdown with react-markdown + remark-gfm + rehype-raw

### Routing

React Router v6 with `createBrowserRouter`, basename `/Get-Started-with-Web3`. All pages are lazy-loaded:
- `/` → LandingPage
- `/dashboard` → DashboardPage
- `/learn/:moduleId/:lessonId` → ReaderPage
- `/badges` → BadgeCollectionPage

### State Management (Zustand)

Five stores, four persisted to localStorage:

| Store | localStorage key | Persisted state |
|-------|-----------------|-----------------|
| `useAppStore` | `web3-app-store` | `geminiApiKey`, `apiKeySet` |
| `useUserStore` | `web3-user-store` | `progress`, `earnedBadges`, `totalExperience`, `userTitle`, `studyStreak`, `lastStudyDate` |
| `useSearchStore` | `web3-search-store` | `searchHistory` |
| `useThemeStore` | `web3-theme-store` | `theme` (dark/light) |
| `useContentStore` | *(not persisted)* | In-memory content cache only |

### Critical ID Relationships

- **Course modules** defined in `src/config/courseData.js` — 6 modules (37 lessons): Web3 快速入门, 比特币密码学与数据层, 比特币网络与共识层, 比特币应用层, Web3 深度思考, Web3 生态与实用工具. Each module has `id` (e.g., `module-1`), `lessons` array with `path` pointing to `zh/` subdirectory
- **Badge keys** in `src/features/badges/badgeData.js` (`ACHIEVEMENT_BADGES`) must match module `id` values from courseData
- **Progress keys** in useUserStore use format `${moduleId}-${lessonId}` (e.g., `module-1-1-1`)

### AI Tutor

`src/utils/geminiApi.js` reads the Gemini API key directly from localStorage (`web3-app-store` Zustand persist format), not from env vars. Calls `gemini-2.5-flash-preview-09-2025`. Lesson context is sliced to first 1500 chars.

## Testing

- **Framework**: Vitest 4 with `happy-dom` environment and globals enabled (no imports needed for describe/it/expect)
- **Setup**: `src/test/setup.js` imports `@testing-library/jest-dom`
- **Test location**: `__tests__/` directories adjacent to source (e.g., `src/store/__tests__/`)
- **Current coverage**: Store logic tests and data structure validation; no component rendering tests yet

## Code Style

- **ESLint**: extends recommended + react + react-hooks + prettier. `no-console: warn` (allows warn/error), `no-unused-vars: warn` (ignores `_`-prefixed)
- **Prettier**: single quotes, semicolons, 100 char width, trailing commas (es5), LF line endings
- **Commit messages**: Conventional Commits enforced by commitlint. Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `revert`, `build`. Max header 100 chars, lowercase type, no trailing period

## Pre-commit Hooks (Husky + lint-staged)

- JS/JSX files: ESLint auto-fix → Prettier
- `zh/**/*.{md,MD}`: custom markdown formatter (`scripts/format-markdown.mjs`)
- Commit message validated by commitlint

## CI/CD

GitHub Actions (`.github/workflows/deploy.yml`): checkout → Node 20 → `npm ci` → Playwright Chromium install → `npm test` → `npm run build` (with env vars `VITE_GEMINI_API_KEY`, `VITE_GITHUB_USERNAME/REPO/BRANCH`) → deploy to gh-pages branch via `peaceiris/actions-gh-pages` (only on push to main). PRs get a preview link comment.

## Key Conventions

- Tutorial content is in Chinese (`zh/`); English (`en/`) is in development
- Tutorial directories use numbered prefixes: `01_`, `02_`, etc.
- Vite base path is `/Get-Started-with-Web3/` — all asset paths must account for this
- Tailwind uses default palette (slate, cyan, purple, green, orange); custom animations: `animate-text-shimmer`, `animate-bounce-slow`
- Module `color` field in courseData uses Tailwind gradient format `from-X to-Y`
- Build `postbuild` runs three steps in order: `generate-og-images.mjs` (satori OG PNGs → `dist/og/`), `generate-sitemap.mjs`, `prerender.mjs` (Playwright SSG)
- Smart contract source lives in `contracts/CertificateNFT.sol` (ERC-721, deploy with Foundry on Base)
