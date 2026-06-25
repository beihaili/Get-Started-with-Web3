# Good First Issues Catalog

> 中文说明：这份清单用于快速创建公开 GitHub Issues。每条都包含建议标题、标签、背景、验收标准和验证方式。

Use this catalog to seed issues that a newcomer can complete without deep repository context. Copy one item into GitHub Issues, keep the acceptance criteria, and add links to the affected files.

## Labels

Use these labels consistently:

- `good first issue`: small, clear, and safe for a first PR.
- `help wanted`: useful for outside contributors, reviewers, or domain experts.
- `content`: lesson, translation, quiz, glossary, or source quality.
- `ai-native`: `llms.txt`, manifest, content index, MCP, or agent citation work.
- `growth`: distribution, community, SEO, sponsorship, or public positioning.

## Seed Issues

### 1. Proofread One English Web3 Quick Start Lesson

**Labels:** `good first issue`, `content`

**Context:** Some English lessons were translated from Chinese and can be made more natural for global beginners.

**Acceptance criteria:**

- Pick one file under `en/Web3QuickStart/`.
- Improve clarity without changing technical meaning.
- Keep headings and relative links working.
- Mention the file path in the PR description.

**Verification:** Markdown preview or local app review.

### 2. Add Source Links To One DeFi Lesson

**Labels:** `good first issue`, `content`

**Context:** DeFi lessons are more credible when major mechanism claims link to canonical docs or reputable explainers.

**Acceptance criteria:**

- Pick one file under `en/DeFiDeepDive/` or `zh/DeFiDeepDive/`.
- Add 3-5 source links for protocol mechanics, risk explanations, or definitions.
- Avoid promotional referral links in lesson body.
- Keep beginner language readable.

**Verification:** Check all links open.

### 3. Add Two Glossary Terms For Smart Accounts

**Labels:** `good first issue`, `content`

**Context:** The smart-account module introduces terms that should also be searchable from the glossary.

**Acceptance criteria:**

- Add two terms to `src/config/glossaryData.js`.
- Use an existing glossary category.
- Add or update tests in `src/config/__tests__/glossaryData.test.js` if category coverage changes.

**Verification:** `npm test -- src/config/__tests__/glossaryData.test.js`

### 4. Add Quiz Questions For A Builder Lab Lesson

**Labels:** `good first issue`, `content`

**Context:** Builder lessons should reinforce practical understanding with short checks.

**Acceptance criteria:**

- Add at least three questions to `src/features/quiz/quizData.js`.
- Questions should test applied understanding, not trivia.
- Include one question about a common beginner mistake.

**Verification:** `npm test`

### 5. Improve Mobile Readability On One Course Page

**Labels:** `good first issue`, `help wanted`

**Context:** Dense educational pages need to remain readable on small screens.

**Acceptance criteria:**

- Pick one course page or reusable component.
- Improve spacing, wrapping, or touch target size.
- Include before/after screenshots in the PR.
- Avoid broad redesigns.

**Verification:** `npm test`, `npm run lint`, screenshot at mobile width.

### 6. Add AI Citation Notes To One Lesson

**Labels:** `good first issue`, `ai-native`, `content`

**Context:** AI agents work better when lessons have clear source context and stable citations.

**Acceptance criteria:**

- Pick one lesson with protocol facts.
- Add a short "Further reading" or source section.
- Regenerate AI artifacts if lesson metadata or indexed content changes.

**Verification:** `npm run ai:index && npm run ai:publish && npm run ai:verify`

### 7. Check One Public AI Entrypoint

**Labels:** `good first issue`, `ai-native`

**Context:** Public agent entrypoints should stay accurate after content updates.

**Acceptance criteria:**

- Open the live `llms.txt`, AI manifest, and AI content index.
- Report stale copy, broken URLs, or confusing descriptions.
- Fix the issue if it is a small docs/artifact problem.

**Verification:** `npm run ai:verify`

### 8. Submit The Project To One Awesome List

**Labels:** `good first issue`, `growth`

**Context:** Curated list submissions help the project reach learners who do not follow the maintainer yet.

**Acceptance criteria:**

- Pick one target from `docs/strategy/2026-05-14-awesome-list-submissions.md`.
- Open a PR or issue on the target list when their rules allow it.
- Record the link and status back in a project issue or PR.

**Verification:** Link to the external submission.

### 9. Write A Short Community Post Draft

**Labels:** `good first issue`, `growth`

**Context:** Reusable post drafts make weekly distribution easier.

**Acceptance criteria:**

- Draft one 150-300 word post for Twitter/X, Farcaster, Reddit, or a Chinese Web3 community.
- Include one concrete learning outcome and one link to the live site.
- Avoid financial advice, token promotion, or trading claims.

**Verification:** Maintainer review.

### 10. Add A Lesson Screenshot Or Diagram

**Labels:** `good first issue`, `content`

**Context:** Some beginner concepts need visuals to reduce cognitive load.

**Acceptance criteria:**

- Pick a lesson where a visual would clarify a workflow.
- Add one image or diagram with alt text.
- Keep file size reasonable and use relative paths.

**Verification:** Local Markdown/app preview.

### 11. Audit One Lesson For Security Warnings

**Labels:** `good first issue`, `content`

**Context:** Beginner Web3 content must clearly mark risky actions.

**Acceptance criteria:**

- Pick one wallet, bridge, DeFi, or token lesson.
- Add or refine warnings for private keys, approvals, phishing, bridge risk, or smart contract risk.
- Keep tone practical and non-alarmist.

**Verification:** Maintainer review.

### 12. Improve The Sponsor Kit With One Comparable Project

**Labels:** `good first issue`, `growth`

**Context:** Sponsorship positioning improves when the project can compare itself with similar education/community assets.

**Acceptance criteria:**

- Add one comparable project, newsletter, course, or community reference to sponsor research notes.
- Include public metrics if available.
- Do not fabricate traffic, conversion, or audience data.

**Verification:** Link to the public source.

### 13. Add A UserOperation Flow Diagram

**Labels:** `good first issue`, `content`

**Context:** The account abstraction simulator explains the ERC-4337 flow in text, but a simple diagram can help first-time learners see where UserOperation, Bundler, EntryPoint, Paymaster, and Smart Account fit.

**Acceptance criteria:**

- Add one diagram to `en/EthereumSmartAccounts/03_UserOperationSimulator/README.md` or `zh/EthereumSmartAccounts/03_UserOperationSimulator/README.md`.
- Show at least User, App, Bundler, EntryPoint, Smart Account, and optional Paymaster.
- Include alt text or a Mermaid-compatible text source.
- Avoid implying that the simulator sends real transactions.

**Verification:** Markdown/app preview and `npm run ai:index && npm run ai:publish && npm run ai:verify`.

### 14. Proofread Account Abstraction Glossary Terms

**Labels:** `good first issue`, `content`

**Context:** New account abstraction glossary entries should stay concise, searchable, and beginner-friendly.

**Acceptance criteria:**

- Review `EntryPoint`, `Factory`, `ERC-7562`, `UserOperation`, `Bundler`, and `Paymaster` in `src/config/glossaryData.js`.
- Improve wording without changing technical meaning.
- Keep the category as `账户抽象`.
- Mention any terminology tradeoff in the PR description.

**Verification:** `npm test -- src/config/__tests__/glossaryData.test.js`.

### 15. Polish The English UserOperation Simulator Lesson

**Labels:** `good first issue`, `content`

**Context:** The English account abstraction lesson should be natural for global builders while preserving the Chinese-first source direction.

**Acceptance criteria:**

- Edit `en/EthereumSmartAccounts/03_UserOperationSimulator/README.md`.
- Keep all safety boundaries: simulator-only, no live bundler, placeholder signatures, no production sponsorship.
- Preserve the Further Reading links.
- Do not add investment, token, trading, or sponsor claims.

**Verification:** Markdown/app preview and `npm run ai:index && npm run ai:publish && npm run ai:verify`.
