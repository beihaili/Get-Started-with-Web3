# Growth & Monetization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Get-Started-with-Web3 into a globally accessible, revenue-generating open-source Web3 education platform.

**Architecture:** Content-led growth via i18n (English + Chinese) and SEO optimization, with multi-channel low-friction monetization (donations, sponsors, affiliates, NFT certificates). All content remains free. Revenue scales with organic traffic.

**Tech Stack:** React 19 + react-i18next, satori + @resvg/resvg-js (OG images), wagmi v2 + viem + ConnectKit (NFT minting), Solidity/ERC-721 (certificates on Base), Cloudflare Web Analytics.

**Spec:** `docs/superpowers/specs/2026-03-20-growth-and-monetization-design.md`

---

## File Structure Overview

### New Files

```
src/
├── i18n/
│   ├── index.js                    # react-i18next initialization
│   ├── locales/
│   │   ├── en.json                 # English UI strings
│   │   └── zh.json                 # Chinese UI strings
│   └── LanguageProvider.jsx        # Context that reads :lang from URL
├── components/
│   ├── LanguageSwitcher.jsx        # Language toggle in navbar
│   ├── ThankAuthorButton.jsx       # "Buy the author a coffee" CTA
│   ├── SponsorBanner.jsx           # Inline sponsor banner for lessons
│   ├── SponsorSection.jsx          # Sponsor logos on Landing Page
│   ├── DonationSection.jsx         # Donation links section
│   └── SeoHead.jsx                 # Reusable structured data + meta tags
├── pages/
│   ├── SupportPage.jsx             # /support — donations, wallets, sponsors
│   ├── ArticlesPage.jsx            # /articles — SEO index of all lessons
│   └── ContributorsPage.jsx        # /contributors — contributor wall
├── features/
│   └── nft/
│       ├── MintCertificate.jsx     # NFT mint UI (lazy-loaded)
│       ├── CertificatePreview.jsx  # Certificate preview before mint
│       ├── walletConfig.js         # wagmi + ConnectKit config
│       └── contractAbi.js          # ERC-721 contract ABI
├── config/
│   └── sponsorData.js              # Sponsor tiers and affiliate links
scripts/
├── generate-og-images.mjs          # satori-based OG image generator
├── generate-sitemap.mjs            # Build-time sitemap.xml generator
├── translate-content.mjs           # AI bulk translation helper
en/                                 # English markdown content (37 lessons)
public/
├── robots.txt
└── content/en/                     # Synced English content
contracts/
└── CertificateNFT.sol              # ERC-721 completion certificate
```

### Modified Files

```
src/routes/index.jsx                # Add /:lang param, new pages
src/store/useContentStore.js        # Add lang param to fetchLessonContent
src/config/courseData.js             # Remove zh/ prefix from lesson paths
src/pages/LandingPage.jsx           # Add sponsor + donation sections
src/pages/ReaderPage.jsx            # Add SeoHead, ThankAuthor, SponsorBanner
src/pages/DashboardPage.jsx         # i18n strings, lang-aware links
src/pages/BadgeCollectionPage.jsx   # i18n strings
src/components/SearchDialog.jsx     # i18n strings
src/features/ai-tutor/AiTutor.jsx   # i18n strings
src/features/content/MarkdownRenderer.jsx  # i18n strings
src/components/ShareCard.jsx        # i18n strings
scripts/sync-content.mjs            # Sync en/ alongside zh/
scripts/prerender.mjs               # Prerender /:lang routes
vite.config.js                      # Code splitting for new deps
package.json                        # New dependencies
README.md                           # English version (rename current to README.zh.md)
```

---

## Phase 1: Quick Wins (Week 1-2, ~10 hours)

### Task 1: Add Donation Links and Crypto Wallet Addresses

**Files:**
- Create: `src/config/sponsorData.js`
- Create: `src/components/DonationSection.jsx`
- Create: `src/components/ThankAuthorButton.jsx`
- Modify: `src/pages/LandingPage.jsx:177-200` (add DonationSection before community section)
- Modify: `src/pages/ReaderPage.jsx:178-209` (add ThankAuthorButton after nav buttons)
- Test: `src/config/__tests__/sponsorData.test.js`

- [ ] **Step 1: Write test for sponsorData structure**

```js
// src/config/__tests__/sponsorData.test.js
import { DONATION_LINKS, CRYPTO_WALLETS } from '../sponsorData';

describe('sponsorData', () => {
  it('should have valid donation links', () => {
    expect(DONATION_LINKS).toBeDefined();
    DONATION_LINKS.forEach((link) => {
      expect(link).toHaveProperty('name');
      expect(link).toHaveProperty('url');
      expect(link.url).toMatch(/^https?:\/\//);
    });
  });

  it('should have valid crypto wallet addresses', () => {
    expect(CRYPTO_WALLETS).toBeDefined();
    CRYPTO_WALLETS.forEach((wallet) => {
      expect(wallet).toHaveProperty('chain');
      expect(wallet).toHaveProperty('address');
      expect(wallet.address.length).toBeGreaterThan(10);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/config/__tests__/sponsorData.test.js`
Expected: FAIL — module not found

- [ ] **Step 3: Create sponsorData config**

```js
// src/config/sponsorData.js

// Donation platform links
export const DONATION_LINKS = [
  {
    name: 'Buy Me a Coffee',
    url: 'https://buymeacoffee.com/beihai', // TODO: replace with actual URL
    icon: 'Coffee',
  },
  {
    name: 'GitHub Sponsors',
    url: 'https://github.com/sponsors/beihaili', // TODO: replace with actual URL
    icon: 'Heart',
  },
];

// Crypto wallet addresses for direct donations
export const CRYPTO_WALLETS = [
  { chain: 'ETH', address: '0x...', network: 'Ethereum / Base / Polygon' },
  { chain: 'BTC', address: 'bc1q...', network: 'Bitcoin' },
];

// Sponsor tiers — populated when sponsors sign up
export const SPONSORS = {
  gold: [],
  silver: [],
  bronze: [],
};

// Affiliate links — embedded in relevant lesson content
export const AFFILIATE_LINKS = [];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/config/__tests__/sponsorData.test.js`
Expected: PASS

- [ ] **Step 5: Create ThankAuthorButton component**

```jsx
// src/components/ThankAuthorButton.jsx
import { Heart } from 'lucide-react';
import { DONATION_LINKS } from '../config/sponsorData';

/**
 * "Thank the author" CTA shown at the bottom of each lesson.
 * Links to the first donation platform in sponsorData.
 */
export default function ThankAuthorButton() {
  const primaryLink = DONATION_LINKS[0];
  if (!primaryLink) return null;

  return (
    <div className="mt-8 mb-4 text-center">
      <a
        href={primaryLink.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500
          to-orange-400 px-6 py-3 text-sm font-medium text-white shadow-lg
          transition-all hover:scale-105 hover:shadow-xl"
      >
        <Heart className="h-4 w-4" />
        <span>Did this help? Buy the author a coffee</span>
      </a>
    </div>
  );
}
```

- [ ] **Step 6: Create DonationSection component**

```jsx
// src/components/DonationSection.jsx
import { Heart, Wallet } from 'lucide-react';
import { DONATION_LINKS, CRYPTO_WALLETS } from '../config/sponsorData';

/**
 * Donation section for the Landing Page.
 * Shows donation platform links and crypto wallet addresses.
 */
export default function DonationSection() {
  return (
    <section className="mx-auto mb-16 max-w-4xl px-4">
      <h2 className="mb-6 text-center text-2xl font-bold text-white">
        Support This Project
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Donation platform links */}
        {DONATION_LINKS.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-slate-700
              bg-slate-800/50 p-4 transition-all hover:border-pink-500/50 hover:bg-slate-800"
          >
            <Heart className="h-5 w-5 text-pink-400" />
            <span className="text-slate-200">{link.name}</span>
          </a>
        ))}
        {/* Crypto wallets */}
        {CRYPTO_WALLETS.map((wallet) => (
          <div
            key={wallet.chain}
            className="flex items-center gap-3 rounded-xl border border-slate-700
              bg-slate-800/50 p-4"
          >
            <Wallet className="h-5 w-5 text-cyan-400" />
            <div>
              <p className="text-sm font-medium text-slate-200">{wallet.chain}</p>
              <p className="truncate text-xs text-slate-400" title={wallet.address}>
                {wallet.address}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Add DonationSection to LandingPage**

In `src/pages/LandingPage.jsx`, add import at top and insert `<DonationSection />` between the learning path section and the community section (around line 175).

- [ ] **Step 8: Add ThankAuthorButton to ReaderPage**

In `src/pages/ReaderPage.jsx`, add import at top and insert `<ThankAuthorButton />` after the previous/next lesson navigation buttons (around line 209).

- [ ] **Step 9: Run lint and tests**

Run: `npm run lint && npm test`
Expected: All pass

- [ ] **Step 10: Commit**

```bash
git add src/config/sponsorData.js src/config/__tests__/sponsorData.test.js \
  src/components/ThankAuthorButton.jsx src/components/DonationSection.jsx \
  src/pages/LandingPage.jsx src/pages/ReaderPage.jsx
git commit -m "feat: add donation links and thank-author button"
```

---

### Task 2: English README and GitHub Discoverability

**Files:**
- Rename: `README.md` → `README.zh.md`
- Create: `README.md` (English version)
- Modify: GitHub repo settings (topics)

- [ ] **Step 1: Rename current README to Chinese version**

```bash
git mv README.md README.zh.md
```

- [ ] **Step 2: Create English README.md**

Write a new `README.md` in English covering:
- Project title and description (Web3/Bitcoin educational platform)
- Key features (6 modules, 37 lessons, AI tutor, badge system, PWA)
- Quick start instructions (`npm install && npm run dev`)
- Link to live demo
- Screenshot or banner image
- "Support This Project" section with donation links and crypto wallet addresses
- Link to `README.zh.md` for Chinese version
- Link to `CONTRIBUTING.md`
- License

- [ ] **Step 3: Update CONTRIBUTING.md to reference English README**

Add a note at the top linking to both README versions.

- [ ] **Step 4: Add GitHub topics via CLI**

```bash
gh repo edit --add-topic web3,bitcoin,blockchain,tutorial,education,learn-web3,cryptocurrency,chinese,english,open-source
```

- [ ] **Step 5: Commit**

```bash
git add README.md README.zh.md CONTRIBUTING.md
git commit -m "docs: add English README and GitHub topic tags"
```

---

### Task 3: Analytics Integration

**Files:**
- Modify: `index.html` (add Cloudflare Web Analytics script)

- [ ] **Step 1: Sign up for Cloudflare Web Analytics** (free, no account needed for basic)

Get the beacon token from https://www.cloudflare.com/web-analytics/

- [ ] **Step 2: Add analytics script to index.html**

Add before `</body>`:
```html
<!-- Cloudflare Web Analytics -->
<script defer src='https://static.cloudflareinsights.com/beacon.min.js'
  data-cf-beacon='{"token": "YOUR_TOKEN"}'></script>
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add Cloudflare Web Analytics"
```

---

## Phase 2: i18n Framework (Week 3-7, ~35 hours)

### Task 4: Install i18n Dependencies and Create Base Config

**Files:**
- Create: `src/i18n/index.js`
- Create: `src/i18n/locales/en.json`
- Create: `src/i18n/locales/zh.json`
- Modify: `package.json` (add react-i18next, i18next, i18next-browser-languagedetector)

- [ ] **Step 1: Install dependencies**

```bash
npm install react-i18next i18next i18next-browser-languagedetector
```

- [ ] **Step 2: Write test for i18n initialization**

```js
// src/i18n/__tests__/i18n.test.js
import i18n from '../index';

describe('i18n', () => {
  it('should initialize with en and zh languages', () => {
    expect(i18n.options.resources).toHaveProperty('en');
    expect(i18n.options.resources).toHaveProperty('zh');
  });

  it('should have matching keys in en and zh', () => {
    const enKeys = Object.keys(i18n.options.resources.en.translation);
    const zhKeys = Object.keys(i18n.options.resources.zh.translation);
    expect(enKeys.sort()).toEqual(zhKeys.sort());
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/i18n/__tests__/i18n.test.js`
Expected: FAIL

- [ ] **Step 4: Create i18n config and locale files**

```js
// src/i18n/index.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import zh from './locales/zh.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
  },
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
```

Create `src/i18n/locales/en.json` and `src/i18n/locales/zh.json` with all UI strings extracted from components. Key categories:

```json
{
  "nav": {
    "back": "Back",
    "dashboard": "Dashboard",
    "badges": "My Badges",
    "search": "Search courses...",
    "searchShortcut": "⌘K"
  },
  "landing": {
    "title": "Get Started with Web3",
    "subtitle": "The most systematic open-source Bitcoin & Web3 learning platform...",
    "startLearning": "Start Learning",
    "viewBadges": "View Badges",
    "viewOnGithub": "View on GitHub",
    "modules": "Modules",
    "lessons": "Lessons",
    "techLayers": "Tech Layers",
    "learningPath": "Learning Path",
    "joinCommunity": "Join Community",
    "supportProject": "Support This Project"
  },
  "reader": {
    "markComplete": "Mark Complete",
    "completed": "Completed",
    "prevLesson": "Previous",
    "nextLesson": "Next",
    "moduleComplete": "Module Complete!",
    "shareAchievement": "Share Achievement",
    "thankAuthor": "Did this help? Buy the author a coffee"
  },
  "dashboard": {
    "title": "Learning Dashboard",
    "totalXP": "Total XP",
    "currentTitle": "Current Title",
    "completedLessons": "Completed",
    "studyStreak": "Study Streak",
    "days": "days",
    "progress": "Progress",
    "startLesson": "Start",
    "continueLesson": "Continue"
  },
  "badges": {
    "title": "Badge Collection",
    "earned": "Earned",
    "locked": "Locked",
    "noBadges": "No badges earned yet. Start learning to earn your first badge!",
    "shareCollection": "Share Collection"
  },
  "ai": {
    "title": "AI Tutor",
    "placeholder": "Ask me anything about this lesson...",
    "thinking": "Thinking...",
    "apiKeyPrompt": "Enter your Gemini API key to use the AI tutor",
    "send": "Send"
  },
  "quiz": {
    "title": "Quiz",
    "checkAnswer": "Check Answer",
    "correct": "Correct!",
    "incorrect": "Try again",
    "nextQuestion": "Next Question",
    "score": "Score"
  },
  "common": {
    "loading": "Loading...",
    "error": "Something went wrong",
    "retry": "Retry",
    "copyCode": "Copy code"
  }
}
```

Chinese version (`zh.json`) mirrors the same keys with Chinese translations of all current hardcoded strings.

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/i18n/__tests__/i18n.test.js`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/i18n/ package.json package-lock.json
git commit -m "feat: add react-i18next with en/zh locale files"
```

---

### Task 5: Add /:lang Routing, LanguageProvider, and Refactor Paths (Atomic)

> **Note:** Route restructure + path refactoring + link updates MUST be done together
> to avoid a broken intermediate state. This is one atomic task.

**Files:**
- Create: `src/i18n/LanguageProvider.jsx`
- Create: `src/components/LanguageSwitcher.jsx`
- Modify: `src/routes/index.jsx` (wrap routes with /:lang param)
- Modify: `src/main.jsx` (import i18n)
- Modify: `src/config/courseData.js` (remove `zh/` prefix from all lesson paths)
- Modify: `src/store/useContentStore.js` (prepend lang to path at fetch time)
- Modify: `src/pages/ReaderPage.jsx` (pass lang to fetchLessonContent, update all internal links)
- Modify: `src/pages/DashboardPage.jsx` (lang-aware links)
- Modify: `src/pages/LandingPage.jsx` (lang-aware links)
- Modify: `src/pages/BadgeCollectionPage.jsx` (lang-aware links)
- Test: `src/i18n/__tests__/LanguageProvider.test.js`
- Test: `src/store/__tests__/useContentStore.test.js`

- [ ] **Step 1: Write test for LanguageProvider**

```js
// src/i18n/__tests__/LanguageProvider.test.js
import { renderHook } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageProvider from '../LanguageProvider';
import '../index'; // init i18n

function wrapper({ children }) {
  return (
    <MemoryRouter initialEntries={['/en/dashboard']}>
      <Routes>
        <Route path="/:lang/*" element={<LanguageProvider>{children}</LanguageProvider>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('LanguageProvider', () => {
  it('should set i18n language from URL param', () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });
    expect(result.current.i18n.language).toBe('en');
  });
});
```

- [ ] **Step 2: Write test for language-aware content fetching**

```js
// src/store/__tests__/useContentStore.test.js — add new test
import { vi } from 'vitest';

it('should fetch content with lang prefix in URL', async () => {
  const mockFetch = vi.fn().mockResolvedValue({
    ok: true,
    text: () => Promise.resolve('# Hello'),
  });
  vi.stubGlobal('fetch', mockFetch);

  const store = useContentStore.getState();
  await store.fetchLessonContent('en', 'Web3QuickStart/01_FirstWeb3Identity');

  // Verify the first fetch call used the correct lang-prefixed URL
  const calledUrl = mockFetch.mock.calls[0][0];
  expect(calledUrl).toContain('/content/en/Web3QuickStart/01_FirstWeb3Identity/README.md');

  vi.unstubAllGlobals();
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run src/i18n/__tests__/LanguageProvider.test.js src/store/__tests__/useContentStore.test.js`
Expected: FAIL

- [ ] **Step 4: Create LanguageProvider**

```jsx
// src/i18n/LanguageProvider.jsx
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SUPPORTED_LANGS = ['en', 'zh'];

/**
 * Reads :lang from URL and syncs it to i18next.
 * URL is the single source of truth for language.
 */
export default function LanguageProvider({ children }) {
  const { lang } = useParams();
  const { i18n } = useTranslation();

  useEffect(() => {
    const resolvedLang = SUPPORTED_LANGS.includes(lang) ? lang : 'en';
    if (i18n.language !== resolvedLang) {
      i18n.changeLanguage(resolvedLang);
    }
  }, [lang, i18n]);

  return children;
}
```

- [ ] **Step 5: Create LanguageSwitcher component**

```jsx
// src/components/LanguageSwitcher.jsx
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Globe } from 'lucide-react';

/**
 * Swaps the :lang segment in the current URL.
 * Handles edge case where path has no trailing segment after /:lang.
 */
export default function LanguageSwitcher() {
  const { lang } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleLang = () => {
    const newLang = lang === 'zh' ? 'en' : 'zh';
    // Replace first occurrence of /lang in the path
    const newPath = location.pathname.replace(new RegExp(`^/${lang}(?=/|$)`), `/${newLang}`);
    navigate(newPath);
  };

  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-slate-400
        transition-colors hover:bg-slate-800 hover:text-white"
      title={lang === 'zh' ? 'Switch to English' : '切换中文'}
    >
      <Globe className="h-4 w-4" />
      <span>{lang === 'zh' ? 'EN' : '中文'}</span>
    </button>
  );
}
```

- [ ] **Step 6: Restructure routes with /:lang param (keep LandingPage!)**

Modify `src/routes/index.jsx`:
- Import `LanguageProvider` and `Navigate`
- Root `/` redirects based on browser language:
  ```jsx
  { path: '/', element: <Navigate to={navigator.language.startsWith('zh') ? '/zh' : '/en'} replace /> }
  ```
- Wrap existing routes under `/:lang` with `LanguageProvider`:
  ```jsx
  {
    path: '/:lang',
    element: <LanguageProvider><RootLayout /></LanguageProvider>,
    children: [
      { index: true, element: <SuspenseWrapper><LandingPage /></SuspenseWrapper> },
      { path: 'dashboard', element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper> },
      { path: 'learn/:moduleId/:lessonId', element: <SuspenseWrapper><ReaderPage /></SuspenseWrapper> },
      { path: 'badges', element: <SuspenseWrapper><BadgeCollectionPage /></SuspenseWrapper> },
    ],
  }
  ```
- **IMPORTANT:** LandingPage is the `/:lang` index route (not removed!)
- Add backwards-compat redirects for old URLs: `/learn/*` → `/zh/learn/*`, `/dashboard` → `/zh/dashboard`, `/badges` → `/zh/badges`

- [ ] **Step 7: Import i18n in main.jsx**

Add `import './i18n';` at the top of `src/main.jsx`.

- [ ] **Step 8: Update courseData.js — remove `zh/` prefix from all lesson paths**

In `src/config/courseData.js`, update all `path` values:
- Before: `path: 'zh/Web3QuickStart/01_FirstWeb3Identity'`
- After: `path: 'Web3QuickStart/01_FirstWeb3Identity'`

Do this for all 37 lessons. The `zh/` prefix is now added at fetch time.

- [ ] **Step 9: Update useContentStore.js — add lang parameter**

Modify `fetchLessonContent` in `src/store/useContentStore.js`:
- Change signature: `fetchLessonContent: async (lessonPath)` → `fetchLessonContent: async (lang, lessonPath)`
- Update cache key: `const cacheKey = \`${lang}/${lessonPath}\`;`
- Update local URL: ``const localUrl = `${get().basePath}content/${lang}/${lessonPath}/README.md`;``
- Update GitHub fallback URL similarly

- [ ] **Step 10: Update ALL internal links in ALL pages**

In `src/pages/ReaderPage.jsx`:
- Get `lang` from `useParams()`
- `fetchLessonContent(lessonPath)` → `fetchLessonContent(lang, lessonPath)`
- Update canonical URL: include `/${lang}/`
- Update all `<Link to=...>`: `to="/dashboard"` → ``to={`/${lang}/dashboard`}``
- Update prev/next lesson links: include `/${lang}/`

In `src/pages/DashboardPage.jsx`:
- Get `lang` from `useParams()`
- Update lesson links: ``to={`/${lang}/learn/${module.id}/${lesson.id}`}``
- Update nav links (badges, etc.)

In `src/pages/LandingPage.jsx`:
- Get `lang` from `useParams()`
- Update "Start Learning" CTA: ``to={`/${lang}/dashboard`}``
- Update badge link, other internal links

In `src/pages/BadgeCollectionPage.jsx`:
- Get `lang` from `useParams()`
- Update back-to-dashboard link

- [ ] **Step 11: Run all tests**

Run: `npm run lint && npm test`
Expected: All pass. Fix any tests that reference old paths or lack `:lang` in routes.

- [ ] **Step 12: Commit**

```bash
git add src/i18n/ src/components/LanguageSwitcher.jsx src/routes/index.jsx \
  src/main.jsx src/config/courseData.js src/store/useContentStore.js \
  src/pages/ src/store/__tests__/ src/config/__tests__/
git commit -m "feat: add i18n routing with /:lang param and language-agnostic paths"
```

---

### Task 7: Extract Hardcoded Chinese Strings to i18n

**Files:**
- Modify: `src/pages/LandingPage.jsx`
- Modify: `src/pages/DashboardPage.jsx`
- Modify: `src/pages/ReaderPage.jsx`
- Modify: `src/pages/BadgeCollectionPage.jsx`
- Modify: `src/components/SearchDialog.jsx`
- Modify: `src/features/ai-tutor/AiTutor.jsx`
- Modify: `src/features/content/MarkdownRenderer.jsx`
- Modify: `src/components/ShareCard.jsx`
- Modify: `src/components/ErrorBoundary.jsx`
- Update: `src/i18n/locales/en.json` and `zh.json` as needed

- [ ] **Step 1: Replace hardcoded strings in all 4 pages**

For each page component, replace Chinese strings with `t('key')` calls:
```jsx
import { useTranslation } from 'react-i18next';
// ...
const { t } = useTranslation();
// Before: <h1>学习仪表板</h1>
// After:  <h1>{t('dashboard.title')}</h1>
```

Work through each file systematically. Key files and their Chinese strings:
- **LandingPage.jsx**: Title, subtitle, stats labels, section headers, button text
- **DashboardPage.jsx**: Dashboard header, XP label, streak label, module progress text
- **ReaderPage.jsx**: Complete button, navigation labels, module complete text
- **BadgeCollectionPage.jsx**: Badge titles, earned/locked labels, share text
- **SearchDialog.jsx**: Placeholder text, shortcut label
- **AiTutor.jsx**: Title, placeholder, thinking indicator, API key prompt
- **MarkdownRenderer.jsx**: Copy code aria-label
- **ShareCard.jsx**: Share text, achievement labels
- **ErrorBoundary.jsx**: Error messages

- [ ] **Step 2: Ensure en.json and zh.json cover all extracted strings**

Audit both locale files to confirm every `t()` key exists in both languages.

- [ ] **Step 3: Add LanguageSwitcher to navigation bars**

Add `<LanguageSwitcher />` to the nav in:
- `RootLayout` (global)
- Or each page's nav bar if they have independent navs

- [ ] **Step 4: Run lint and tests**

Run: `npm run lint && npm test`
Expected: All pass

- [ ] **Step 5: Commit**

```bash
git add src/pages/ src/components/ src/features/ src/i18n/locales/
git commit -m "feat: extract all UI strings to i18n locale files"
```

---

### Task 8: Extend Content Sync for English

**Files:**
- Modify: `scripts/sync-content.mjs` (sync `en/` alongside `zh/`)
- Test: manual verification with `npm run sync-content`

- [ ] **Step 1: Update sync-content.mjs**

In `scripts/sync-content.mjs`:
- Add `en/` as a second source with the same folder list
- Handle missing `en/` directories gracefully (not all content translated yet)
- Note: the script uses `projectRoot` (not `ROOT`) and `safeCopy` is async (needs `await`)

```js
// After existing zh/ sync logic, add:
const enSource = path.resolve(projectRoot, 'en');
const enTarget = path.resolve(projectRoot, 'public', 'content', 'en');

// Sync en/ folders (skip silently if source doesn't exist)
for (const folder of SOURCE_FOLDERS) {
  const src = path.join(enSource, folder);
  const dest = path.join(enTarget, folder);
  if (fs.existsSync(src)) {
    await safeCopy(src, dest);
  }
}
```

- [ ] **Step 2: Test manually**

Run: `npm run sync-content`
Expected: `public/content/en/` created with any existing English content

- [ ] **Step 3: Commit**

```bash
git add scripts/sync-content.mjs
git commit -m "feat: extend content sync to support en/ directory"
```

---

## Phase 3: Content Translation (Week 8-10, ~12 hours)

### Task 9: Clean Up Existing en/ Directory

**Files:**
- Delete: `en/book.json`, `en/SUMMARY.md`, `en/index.html`, `en/README.md`, `en/styles/` (GitBook artifacts)
- Keep: `en/GetStartedWithBitcoin/11_NetworkSecurity/README.md` (audit quality)

- [ ] **Step 1: Remove GitBook legacy files**

```bash
rm -f en/book.json en/SUMMARY.md en/index.html en/README.md
rm -rf en/styles/
```

- [ ] **Step 2: Audit existing translation**

Read `en/GetStartedWithBitcoin/11_NetworkSecurity/README.md` and assess translation quality. Keep if accurate, flag for regeneration if not.

- [ ] **Step 3: Commit**

```bash
git add -A en/
git commit -m "chore: clean GitBook artifacts from en/ directory"
```

---

### Task 10: AI Bulk Translation of Lessons

**Files:**
- Create: `scripts/translate-content.mjs`
- Create: `en/` subdirectories mirroring `zh/` structure (37 lessons)

- [ ] **Step 1: Create translation helper script**

```js
// scripts/translate-content.mjs
// Usage: node scripts/translate-content.mjs [--module module-1]
// Reads zh/ markdown files and outputs English translations to en/
// Uses Claude API (or manual copy for review)
//
// This script generates a translation task list and can optionally
// call an LLM API to translate. For budget control, it can also
// just create placeholder files listing what needs translation.
```

The script should:
- Walk `zh/` directories matching `SOURCE_FOLDERS`
- For each `README.md`, create the corresponding `en/` directory and file
- Output a summary: "Translated X files, Y words"

- [ ] **Step 2: Run translation for priority modules (Module 1 + 2)**

Translate the first 15 lessons (Module 1: 7, Module 2: 8) using the script or manually with AI assistance.

- [ ] **Step 3: Verify translated content renders correctly**

```bash
npm run sync-content && npm run dev
```

Navigate to `/en/learn/module-1/1-1` and verify:
- Content loads and renders
- Images display correctly
- Code blocks render
- Links work

- [ ] **Step 4: Commit translated content**

```bash
git add en/
git commit -m "feat: add English translations for modules 1-2"
```

- [ ] **Step 5: Translate remaining modules (3-6)**

Repeat for modules 3-6 (22 lessons).

- [ ] **Step 6: Commit**

```bash
git add en/
git commit -m "feat: add English translations for modules 3-6"
```

---

### Task 10b: CI Translation Coverage Check

**Files:**
- Create: `scripts/check-translation-coverage.mjs`
- Modify: `.github/workflows/deploy.yml` (add check step)

- [ ] **Step 1: Create translation coverage check script**

```js
// scripts/check-translation-coverage.mjs
// Compares zh/ and en/ directories, warns on missing English translations.
// Exits with 0 (warnings only, non-blocking) so CI doesn't fail.
import fs from 'fs';
import path from 'path';

const zhDir = path.resolve('zh');
const enDir = path.resolve('en');

// Walk zh/ for README.md files, check if en/ counterpart exists
// Output: "WARNING: Missing English translation for zh/Web3QuickStart/02_..."
```

- [ ] **Step 2: Add to CI workflow**

In `.github/workflows/deploy.yml`, add after `npm test`:
```yaml
- name: Check translation coverage
  run: node scripts/check-translation-coverage.mjs
```

- [ ] **Step 3: Commit**

```bash
git add scripts/check-translation-coverage.mjs .github/workflows/deploy.yml
git commit -m "feat: add CI check for missing English translations"
```

---

## Phase 4: SEO Optimization (Week 11-14, ~22 hours)

### Task 11: Create SeoHead Component with Structured Data

**Files:**
- Create: `src/components/SeoHead.jsx`
- Test: `src/components/__tests__/SeoHead.test.js`

- [ ] **Step 1: Write test for SeoHead**

```js
// src/components/__tests__/SeoHead.test.js
import { render, waitFor } from '@testing-library/react';
import SeoHead from '../SeoHead';

describe('SeoHead', () => {
  it('should render JSON-LD structured data', async () => {
    render(
      <SeoHead
        title="Test Lesson"
        description="Test description"
        url="https://example.com/lesson"
        type="article"
        moduleTitle="Test Module"
      />
    );
    // useEffect is async — wait for DOM mutation
    await waitFor(() => {
      const jsonLd = document.querySelector('script[type="application/ld+json"]');
      expect(jsonLd).toBeTruthy();
      const data = JSON.parse(jsonLd.textContent);
      expect(data['@type']).toBe('Article');
      expect(data.name).toBe('Test Lesson');
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/__tests__/SeoHead.test.js`

- [ ] **Step 3: Implement SeoHead**

```jsx
// src/components/SeoHead.jsx
import { useEffect } from 'react';

/**
 * Manages document <head> meta tags and JSON-LD structured data.
 * Replaces scattered Helmet-like logic across pages.
 */
export default function SeoHead({ title, description, url, type = 'article', ogImage, lang, alternateUrl, moduleTitle }) {
  useEffect(() => {
    document.title = title;

    const setMeta = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('og:title', title);
    setMeta('og:description', description);
    setMeta('og:url', url);
    if (ogImage) setMeta('og:image', ogImage);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Hreflang alternates
    if (alternateUrl && lang) {
      const altLang = lang === 'en' ? 'zh' : 'en';
      let hreflang = document.querySelector(`link[hreflang="${altLang}"]`);
      if (!hreflang) {
        hreflang = document.createElement('link');
        hreflang.setAttribute('rel', 'alternate');
        hreflang.setAttribute('hreflang', altLang);
        document.head.appendChild(hreflang);
      }
      hreflang.setAttribute('href', alternateUrl);
    }

    // JSON-LD structured data
    let jsonLd = document.querySelector('script[data-seo-head]');
    if (!jsonLd) {
      jsonLd = document.createElement('script');
      jsonLd.setAttribute('type', 'application/ld+json');
      jsonLd.setAttribute('data-seo-head', 'true');
      document.head.appendChild(jsonLd);
    }

    const structuredData = type === 'article'
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          name: title,
          description,
          url,
          ...(moduleTitle && {
            isPartOf: { '@type': 'Course', name: moduleTitle },
          }),
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: title,
          description,
          url,
        };

    jsonLd.textContent = JSON.stringify(structuredData);
  }, [title, description, url, type, ogImage, lang, alternateUrl, moduleTitle]);

  return null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/__tests__/SeoHead.test.js`

- [ ] **Step 5: Integrate SeoHead into ReaderPage**

Replace the existing manual meta tag logic in `ReaderPage.jsx` (lines 90-96) with `<SeoHead>`.

- [ ] **Step 6: Integrate SeoHead into other pages**

Add `<SeoHead>` to LandingPage, DashboardPage, BadgeCollectionPage, replacing their manual meta tag code.

- [ ] **Step 7: Add WebSite + Organization structured data to LandingPage**

In LandingPage's SeoHead usage, add platform-level structured data:
```js
// SeoHead should emit WebSite + Organization JSON-LD on landing page
const platformStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Get Started with Web3',
  url: 'https://beihaili.github.io/Get-Started-with-Web3/',
  publisher: {
    '@type': 'Organization',
    name: 'Get Started with Web3',
    url: 'https://github.com/beihaili/Get-Started-with-Web3',
  },
};
```

Extend SeoHead to accept an optional `platformData` prop for this, or inject it directly in LandingPage.

- [ ] **Step 8: Add Quiz structured data to MultiQuiz component**

In `src/features/quiz/MultiQuiz.jsx`, add a `<script type="application/ld+json">` with `Quiz` schema data when quiz is rendered. Extract question text and options from `quizData.js`.

- [ ] **Step 9: Run lint and tests**

Run: `npm run lint && npm test`

- [ ] **Step 10: Commit**

```bash
git add src/components/SeoHead.jsx src/components/__tests__/SeoHead.test.js \
  src/pages/ src/features/quiz/
git commit -m "feat: add SeoHead with structured data (Article, WebSite, Quiz)"
```

---

### Task 12: OG Image Generation Pipeline

**Files:**
- Create: `scripts/generate-og-images.mjs`
- Modify: `package.json` (add satori, @resvg/resvg-js)
- Modify: `package.json` scripts (add to build pipeline)

- [ ] **Step 1: Install dependencies**

```bash
npm install --save-dev satori @resvg/resvg-js
```

- [ ] **Step 2: Create OG image generator script**

```js
// scripts/generate-og-images.mjs
// Reads courseData.js, generates one PNG per lesson + per page
// Output: dist/og/{moduleId}-{lessonId}.png
// Template: branded gradient background, lesson title, module name, logo

import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';
```

The script should:
- Parse `courseData.js` to extract all module/lesson titles
- For each lesson, generate a 1200x630 PNG (standard OG image size)
- Template: dark gradient background (matching site theme), lesson title in white, module name in gray, "Get Started with Web3" branding
- Save to `dist/og/` directory
- Generate index OG image for landing page

- [ ] **Step 3: Add to build pipeline**

In `package.json`, update postbuild:
```json
"postbuild": "node scripts/generate-og-images.mjs && node scripts/prerender.mjs"
```

- [ ] **Step 4: Test build**

```bash
npm run build
ls dist/og/
```
Expected: PNG files for each lesson

- [ ] **Step 5: Update SeoHead to reference OG images**

In ReaderPage, pass `ogImage` prop to SeoHead:
```jsx
ogImage={`https://beihaili.github.io/Get-Started-with-Web3/og/${moduleId}-${lessonId}.png`}
```

- [ ] **Step 6: Commit**

```bash
git add scripts/generate-og-images.mjs package.json
git commit -m "feat: add satori-based OG image generation pipeline"
```

---

### Task 13: Sitemap and Robots.txt

**Files:**
- Create: `scripts/generate-sitemap.mjs`
- Create: `public/robots.txt`
- Modify: `package.json` scripts

- [ ] **Step 1: Create robots.txt**

```
# public/robots.txt
User-agent: *
Allow: /

Sitemap: https://beihaili.github.io/Get-Started-with-Web3/sitemap.xml
```

- [ ] **Step 2: Create sitemap generator script**

```js
// scripts/generate-sitemap.mjs
// Generates sitemap.xml at build time from courseData.js
// Covers all lesson pages in both /en/ and /zh/ prefixes
// Plus static pages: /, /dashboard, /badges, /articles, /support

import fs from 'fs';
import path from 'path';
```

The script reads `courseData.js`, generates URLs for:
- Each lesson in `/en/learn/...` and `/zh/learn/...`
- Static pages: `/en/dashboard`, `/zh/dashboard`, `/en/badges`, `/zh/badges`, etc.
- Output: `dist/sitemap.xml`

- [ ] **Step 3: Add to build pipeline**

```json
"postbuild": "node scripts/generate-og-images.mjs && node scripts/generate-sitemap.mjs && node scripts/prerender.mjs"
```

- [ ] **Step 4: Test build**

```bash
npm run build
cat dist/sitemap.xml
```
Expected: Valid XML sitemap with all lesson URLs

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-sitemap.mjs public/robots.txt package.json
git commit -m "feat: add build-time sitemap generation and robots.txt"
```

---

### Task 14: Update Prerender Script for i18n Routes

**Files:**
- Modify: `scripts/prerender.mjs` (generate routes for both /en/ and /zh/)

- [ ] **Step 1: Update getRoutes() in prerender.mjs**

Modify the route extraction logic (lines 20-47) to generate routes for both languages:

```js
// For each lesson route, generate both /en/learn/... and /zh/learn/...
const langs = ['en', 'zh'];
const routes = ['/'];
for (const lang of langs) {
  routes.push(`/${lang}/dashboard`, `/${lang}/badges`, `/${lang}/articles`, `/${lang}/support`);
  for (const { moduleId, lessonId } of lessons) {
    routes.push(`/${lang}/learn/${moduleId}/${lessonId}`);
  }
}
```

- [ ] **Step 2: Test prerender**

```bash
npm run build
ls dist/en/learn/
ls dist/zh/learn/
```
Expected: Prerendered HTML files for both languages

- [ ] **Step 3: Commit**

```bash
git add scripts/prerender.mjs
git commit -m "feat: extend prerender to cover i18n routes"
```

---

### Task 15: Articles Index Page

**Files:**
- Create: `src/pages/ArticlesPage.jsx`
- Modify: `src/routes/index.jsx` (add /articles route)

- [ ] **Step 1: Create ArticlesPage**

```jsx
// src/pages/ArticlesPage.jsx
// SEO landing page listing all lessons as article cards.
// Organized by module. Each card: title, excerpt, reading time estimate.
```

The page should:
- Import `courseModules` from courseData
- Display all 37 lessons as cards grouped by module
- Each card links to `/${lang}/learn/${moduleId}/${lessonId}`
- Include SeoHead with `WebPage` type
- Be a simple, content-heavy page optimized for search indexing

- [ ] **Step 2: Add route**

In `src/routes/index.jsx`, add under the `/:lang` children:
```jsx
{ path: 'articles', element: <SuspenseWrapper><ArticlesPage /></SuspenseWrapper> }
```

- [ ] **Step 3: Run lint and tests**

Run: `npm run lint && npm test`

- [ ] **Step 4: Commit**

```bash
git add src/pages/ArticlesPage.jsx src/routes/index.jsx
git commit -m "feat: add SEO-friendly articles index page"
```

---

## Phase 5: Monetization Features (Week 15-19, ~25 hours)

### Task 16: Sponsor Display System

**Files:**
- Create: `src/components/SponsorSection.jsx`
- Create: `src/components/SponsorBanner.jsx`
- Modify: `src/config/sponsorData.js` (add sponsor tier structure)
- Modify: `src/pages/LandingPage.jsx` (add SponsorSection)
- Modify: `src/pages/ReaderPage.jsx` (add SponsorBanner for gold sponsors)

- [ ] **Step 1: Create SponsorSection for Landing Page**

```jsx
// src/components/SponsorSection.jsx
// Displays sponsor logos in tiers (gold, silver, bronze) on Landing Page.
// Reads from sponsorData.js. Shows "Become a Sponsor" CTA if no sponsors.
```

- [ ] **Step 2: Create SponsorBanner for lesson pages**

```jsx
// src/components/SponsorBanner.jsx
// Subtle inline banner above lesson content for gold-tier sponsors.
// "Powered by [Sponsor]" with small logo.
// Only renders if gold sponsors exist in sponsorData.
```

- [ ] **Step 3: Integrate into pages**

- LandingPage: Add `<SponsorSection />` between learning path and community sections
- ReaderPage: Add `<SponsorBanner />` above MarkdownRenderer

- [ ] **Step 4: Run lint and tests**

Run: `npm run lint && npm test`

- [ ] **Step 5: Commit**

```bash
git add src/components/SponsorSection.jsx src/components/SponsorBanner.jsx \
  src/config/sponsorData.js src/pages/LandingPage.jsx src/pages/ReaderPage.jsx
git commit -m "feat: add sponsor display system with tiered placement"
```

---

### Task 17: Support Page

**Files:**
- Create: `src/pages/SupportPage.jsx`
- Modify: `src/routes/index.jsx` (add /support route)

- [ ] **Step 1: Create SupportPage**

```jsx
// src/pages/SupportPage.jsx
// Central page for all support/donation information.
// Sections: donation platforms, crypto wallets, current sponsors, affiliate partners.
// Optional: donation goal progress bar, transparent fund usage breakdown.
```

- [ ] **Step 2: Add route**

In `src/routes/index.jsx`, add under `/:lang` children:
```jsx
{ path: 'support', element: <SuspenseWrapper><SupportPage /></SuspenseWrapper> }
```

- [ ] **Step 3: Add link to Support page in Landing Page footer**

- [ ] **Step 4: Run lint and tests**

Run: `npm run lint && npm test`

- [ ] **Step 5: Commit**

```bash
git add src/pages/SupportPage.jsx src/routes/index.jsx src/pages/LandingPage.jsx
git commit -m "feat: add support page with donation and sponsor info"
```

---

### Task 18: NFT Certificate Smart Contract

**Files:**
- Create: `contracts/CertificateNFT.sol`
- Create: `contracts/README.md` (deployment instructions)

- [ ] **Step 1: Write the ERC-721 contract**

```solidity
// contracts/CertificateNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Web3 Education Completion Certificate
 * @notice ERC-721 NFT minted when a user completes a course module.
 * @dev Mint fee is configurable by the owner. Deployed on Base.
 */
contract CertificateNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    uint256 public mintFee;

    event CertificateMinted(address indexed to, uint256 tokenId, string moduleId);

    constructor(uint256 _mintFee)
        ERC721("Web3 Education Certificate", "W3CERT")
        Ownable(msg.sender)
    {
        mintFee = _mintFee;
    }

    function mint(string calldata tokenURI_, string calldata moduleId) external payable {
        require(msg.value >= mintFee, "Insufficient mint fee");
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI_);
        emit CertificateMinted(msg.sender, tokenId, moduleId);
    }

    function setMintFee(uint256 _mintFee) external onlyOwner {
        mintFee = _mintFee;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Required overrides
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
```

- [ ] **Step 2: Create deployment README**

```markdown
# contracts/README.md
## Deployment
1. Install Foundry: `curl -L https://foundry.paradigm.xyz | bash`
2. Compile: `forge build`
3. Deploy to Base: `forge create --rpc-url https://mainnet.base.org ...`
4. Verify on Basescan
5. Copy contract address to `src/features/nft/contractAbi.js`
```

- [ ] **Step 3: Commit**

```bash
git add contracts/
git commit -m "feat: add ERC-721 completion certificate contract"
```

> **Deferred:** Contributor NFT badges (spec Part 4) will reuse this same contract with a `mintContributorBadge` function added in a future iteration once the contributor community is established. The contract can be upgraded or a separate badge contract deployed later.

---

### Task 19: NFT Mint UI (Frontend)

**Files:**
- Create: `src/features/nft/walletConfig.js`
- Create: `src/features/nft/contractAbi.js`
- Create: `src/features/nft/CertificatePreview.jsx`
- Create: `src/features/nft/MintCertificate.jsx`
- Modify: `src/pages/ReaderPage.jsx` (add mint button on module completion)
- Modify: `package.json` (add wagmi, viem, connectkit)
- Modify: `vite.config.js` (code splitting for wallet deps)

- [ ] **Step 1: Install wallet dependencies**

```bash
npm install wagmi viem @tanstack/react-query connectkit
```

- [ ] **Step 2: Create wallet config**

```js
// src/features/nft/walletConfig.js
import { createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { getDefaultConfig } from 'connectkit';

export const config = createConfig(
  getDefaultConfig({
    chains: [base],
    transports: { [base.id]: http() },
    walletConnectProjectId: 'YOUR_PROJECT_ID', // TODO: replace
    appName: 'Get Started with Web3',
  })
);
```

- [ ] **Step 3: Create contract ABI**

```js
// src/features/nft/contractAbi.js
export const CONTRACT_ADDRESS = '0x...'; // TODO: after deployment
export const CONTRACT_ABI = [
  // mint function ABI
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'tokenURI_', type: 'string' },
      { name: 'moduleId', type: 'string' },
    ],
    outputs: [],
  },
  {
    name: 'mintFee',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
];
```

- [ ] **Step 4: Create CertificatePreview component**

```jsx
// src/features/nft/CertificatePreview.jsx
// Visual preview of the certificate before minting.
// Shows: module name, completion date, quiz score, wallet address.
```

- [ ] **Step 5: Create MintCertificate component**

```jsx
// src/features/nft/MintCertificate.jsx
// Full mint flow: Connect Wallet → Preview → Confirm → Mint → Share
// Lazy-loaded only when user clicks "Mint Certificate"
// Uses wagmi useWriteContract + ConnectKit modal
```

- [ ] **Step 6: Add code splitting for wallet deps**

In `vite.config.js`, `manualChunks` is a function — add a new `if` block inside it:
```js
// Inside the existing manualChunks(id) function:
if (id.includes('wagmi') || id.includes('viem') || id.includes('connectkit') || id.includes('@tanstack/react-query')) {
  return 'wallet';
}
```

- [ ] **Step 7: Add mint button to ReaderPage module completion banner**

In `src/pages/ReaderPage.jsx`, in the module completion section (around line 210-225), add a lazy-loaded `<MintCertificate>` button alongside the share button.

```jsx
const MintCertificate = lazy(() => import('../features/nft/MintCertificate'));
```

- [ ] **Step 8: Run lint and tests**

Run: `npm run lint && npm test`

- [ ] **Step 9: Commit**

```bash
git add src/features/nft/ vite.config.js package.json package-lock.json \
  src/pages/ReaderPage.jsx
git commit -m "feat: add NFT certificate mint UI with wagmi"
```

---

## Phase 6: Growth Features (Week 20-22, ~12 hours)

### Task 20: Contributors Page

**Files:**
- Create: `src/pages/ContributorsPage.jsx`
- Modify: `src/routes/index.jsx` (add /contributors route)

- [ ] **Step 1: Create ContributorsPage**

```jsx
// src/pages/ContributorsPage.jsx
// Fetches contributors from GitHub API (gh api repos/beihaili/Get-Started-with-Web3/contributors)
// Displays: avatar, name, contribution count, link to GitHub profile
// Cached in sessionStorage to avoid rate limiting
// Includes SeoHead
```

- [ ] **Step 2: Add route**

In `src/routes/index.jsx`, add under `/:lang` children:
```jsx
{ path: 'contributors', element: <SuspenseWrapper><ContributorsPage /></SuspenseWrapper> }
```

- [ ] **Step 3: Run lint and tests**

Run: `npm run lint && npm test`

- [ ] **Step 4: Commit**

```bash
git add src/pages/ContributorsPage.jsx src/routes/index.jsx
git commit -m "feat: add contributors page with GitHub API"
```

---

### Task 21: Content Template and CONTRIBUTING Quick-Start Guide

**Files:**
- Create: `zh/TEMPLATE.md` (Markdown template for new lessons)
- Modify: `CONTRIBUTING.md` (add "5 minutes to first contribution" guide)

- [ ] **Step 1: Create lesson template**

```markdown
<!-- zh/TEMPLATE.md -->
# [Lesson Title]

## Overview
[1-2 sentence summary of what this lesson covers]

## Prerequisites
- [What the reader should know before this lesson]

## Content
[Main lesson content with code examples, diagrams, etc.]

## Summary
[Key takeaways]

## Further Reading
- [Links to related resources]
```

- [ ] **Step 2: Add quick-start contribution guide to CONTRIBUTING.md**

Add a "Your First Contribution in 5 Minutes" section at the top with:
1. Fork the repo
2. Find a `good first issue`
3. Make your change
4. Submit a PR
Include a simple flowchart or numbered steps.

- [ ] **Step 3: Commit**

```bash
git add zh/TEMPLATE.md CONTRIBUTING.md
git commit -m "docs: add lesson template and quick-start contribution guide"
```

---

### Task 22: GitHub Social Preview Image

- [ ] **Step 1: Design and upload social preview**

Create a 1280x640 PNG image with:
- Project name: "Get Started with Web3"
- Tagline: "Open-source Web3 & Bitcoin Education"
- Feature highlights: "37 Lessons | AI Tutor | NFT Certificates"
- Bilingual indicator: "EN | 中文"

Upload via: GitHub repo → Settings → General → Social preview

- [ ] **Step 2: No commit needed** (GitHub settings only)

---

### Task 23: Good-First-Issue Curation and Awesome List Submissions

**Files:** None (GitHub/external tasks)

- [ ] **Step 1: Create 10-15 good-first-issue Issues on GitHub**

Categories:
- Translation proofreading (5 issues — one per untranslated module)
- Quiz question additions (3 issues)
- UI improvements (3 issues — dark mode toggle, animation polish, mobile nav)
- Documentation improvements (2 issues)

For each issue:
- Clear title and description
- Label: `good first issue`, `help wanted`
- Difficulty estimate
- Link to relevant files

```bash
gh issue create --title "Proofread English translation: Module 1 - Web3 Quick Start" \
  --label "good first issue,help wanted,translation" \
  --body "..."
```

- [ ] **Step 2: Submit to awesome lists**

```bash
# Fork and PR to relevant awesome lists:
# - awesome-web3
# - awesome-bitcoin
# - awesome-blockchain
# - awesome-educational-resources
```

- [ ] **Step 3: Set up all-contributors bot**

```bash
npx all-contributors-cli init
npx all-contributors-cli add beihaili code,content,doc
```

- [ ] **Step 4: Commit .all-contributorsrc**

```bash
git add .all-contributorsrc README.md
git commit -m "chore: set up all-contributors bot"
```

---

### Task 24: Final Integration Testing and Deploy

- [ ] **Step 1: Full build test**

```bash
npm run build
```
Expected: Build succeeds, dist/ contains all prerendered pages, OG images, sitemap

- [ ] **Step 2: Test all routes locally**

```bash
npm run dev
```

Test:
- `/` redirects to correct language
- `/en/dashboard` — English UI, all modules visible
- `/zh/dashboard` — Chinese UI, all modules visible
- `/en/learn/module-1/1-1` — English content loads
- `/zh/learn/module-1/1-1` — Chinese content loads
- Language switcher works on all pages
- `/en/articles` — all lessons listed
- `/en/support` — donation info displayed
- `/en/contributors` — contributor avatars load
- Thank-you button visible at bottom of lessons
- Module completion shows NFT mint option

- [ ] **Step 3: Run full test suite**

```bash
npm run lint && npm test
```

- [ ] **Step 4: Deploy**

```bash
npm run deploy
```

- [ ] **Step 5: Verify live site**

Check https://beihaili.github.io/Get-Started-with-Web3/ for:
- Language detection and redirect
- All routes working
- Analytics script loading
- robots.txt accessible
- sitemap.xml accessible
- OG images loading (test with https://opengraph.dev)

- [ ] **Step 6: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: integration fixes for v2 launch"
```
