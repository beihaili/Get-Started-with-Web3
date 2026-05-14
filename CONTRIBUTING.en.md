> **README:** [English](README.md) | [中文](README.zh.md)
> **CONTRIBUTING:** [English](CONTRIBUTING.en.md) | [中文](CONTRIBUTING.md)

# Contributing Guide

Thank you for contributing to **Get Started with Web3**. The project is becoming an open-source, bilingual, AI-native Web3 learning platform. Contributions include code, lesson content, translation, proofreading, quizzes, glossary entries, community distribution, and sponsor research.

## Your First Contribution In 5 Minutes

1. Fork this repository.
2. Pick a task from the [Good First Issues Catalog](docs/community/good-first-issues.md), or browse open [`good first issue`](https://github.com/beihaili/Get-Started-with-Web3/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) tickets.
3. Clone your fork: `git clone https://github.com/YOUR_USERNAME/Get-Started-with-Web3.git`
4. Create a branch: `git checkout -b fix/your-change`
5. Make a small, focused change.
6. Run the matching verification command.
7. Push and open a Pull Request.

If you are unsure where to start, proofread an English lesson, check links, add glossary terms, add quiz questions, or improve a security warning. These are easy to review and directly improve the learner experience.

## Contribution Tracks

| Track            | Good work                                                     | Start here                                                    |
| ---------------- | ------------------------------------------------------------- | ------------------------------------------------------------- |
| Lesson content   | Fix stale facts, add sources, add examples, improve warnings  | Lesson README files under `zh/` and `en/`                     |
| Translation      | Translate, proofread, align terminology, improve English flow | `en/Web3QuickStart/`, `en/DeFiDeepDive/`                      |
| Quiz / Glossary  | Add questions, terms, module checks, beginner explanations    | `src/features/quiz/quizData.js`, `src/config/glossaryData.js` |
| Product quality  | Fix UI, accessibility, mobile, search, or AI Tutor behavior   | Components and tests under `src/`                             |
| AI-native layer  | Improve `llms.txt`, manifest, MCP, and citation quality       | `ai/`, `public/ai/`, `scripts/`                               |
| Growth/community | Submit to awesome lists, draft posts, research sponsors       | `docs/strategy/`, `docs/community/`                           |

For the long-term path, see the [Contributor Ladder](docs/community/contributor-ladder.md).

## Development Setup

```bash
git clone https://github.com/beihaili/Get-Started-with-Web3.git
cd Get-Started-with-Web3
npm install
npm run dev
```

Common commands:

```bash
npm test          # Vitest suite
npm run lint      # ESLint
npm run build     # production build, OG images, sitemap, prerender
npm run ai:verify # verify public AI entrypoints and x402 metadata
```

## Verification Matrix

| Change type                | Run at minimum                                                |
| -------------------------- | ------------------------------------------------------------- |
| Markdown-only docs         | `npx prettier --check <changed-files>`                        |
| New or moved lessons       | `npm run ai:index && npm run ai:publish && npm run ai:verify` |
| Glossary changes           | `npm test -- src/config/__tests__/glossaryData.test.js`       |
| Quiz or course config      | `npm test`                                                    |
| React/UI/script changes    | `npm test && npm run lint`                                    |
| SEO, sitemap, or prerender | `npm test && npm run build`                                   |
| AI-native or MCP layer     | `npm test && npm run ai:verify`                               |

If you cannot run a command, explain why in the PR and list what you did verify.

## Content Quality Bar

- Write for beginners. Do not assume the reader already understands wallets, gas, signatures, bridges, or DeFi risk.
- Cite credible sources for protocol mechanics, security behavior, chain operations, or market structure.
- Do not include investment advice, yield promises, token promotion, or undisclosed promotional copy.
- Keep Chinese and English terminology aligned. Note your choice in the PR when a term is ambiguous.
- Use relative paths and alt text when adding images or diagrams.

## Branches And Commits

Branch names:

- `feat/xxx`: new feature
- `fix/xxx`: bug fix
- `docs/xxx`: documentation improvement
- `content/xxx`: lesson content improvement

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>: <description>
```

Examples:

```text
docs: improve DeFi risk explanation
fix: correct SegWit image path
feat: add smart account glossary terms
```

## Pull Request Process

1. Keep the PR small and focused.
2. Mention the affected language, module, lesson, or page.
3. Check the validation commands you actually ran.
4. Add screenshots for UI changes and source links for content changes.
5. Respond to review feedback.
6. After merge, pick another starter issue if you want to continue.

## Maintainer Response

When maintainers are active, the target is to give starter PRs an initial response within 72 hours. Larger content or product changes may need more discussion; open an issue first when scope is unclear.

## Contact

- Twitter/X: [@bhbtc1337](https://twitter.com/bhbtc1337)
- GitHub Issues: [Submit an issue](https://github.com/beihaili/Get-Started-with-Web3/issues)
- WeChat group: Apply through the Google Form.
