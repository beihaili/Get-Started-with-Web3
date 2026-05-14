# Contributor Ladder

> 中文说明：这份文档定义项目如何把一次性贡献者转化为长期协作者、模块维护者和社区传播节点。

Get Started with Web3 grows when learners become contributors. The ladder below makes that path explicit so a newcomer knows what to do next and maintainers know how to recognize progress.

## Principles

- Keep the curriculum free and beginner-friendly.
- Prefer small, reviewable pull requests over large rewrites.
- Cite credible sources when a lesson claims a protocol fact, security behavior, or market mechanism.
- Treat bilingual quality as product quality, not a secondary task.
- Turn useful discussions into reusable docs, issues, or lesson updates.

## Roles

| Role                      | How to qualify                                                                  | Typical work                                                                | Recognition                                             |
| ------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------- |
| First-time contributor    | Open one merged typo, translation, quiz, glossary, or small docs PR             | Fix unclear wording, broken links, minor translation gaps, small examples   | Thanks in PR, encouraged to pick another starter issue  |
| Repeat contributor        | Land three useful PRs in any track                                              | Improve a full lesson, add quiz coverage, update examples, review sources   | Mention in monthly update and eligible for issue triage |
| Reviewer                  | Give two helpful reviews or reproduce two issues                                | Review lesson clarity, test steps, screenshots, accessibility, AI artifacts | Added to reviewer rotation in public roadmap notes      |
| Module steward            | Maintain one topic area across multiple PRs                                     | Own freshness for a module, propose lesson sequence, curate sources         | Listed in community updates and module ownership notes  |
| Community or sponsor ally | Bring distribution, translations, workshops, sponsorship leads, or partnerships | Share the project, coordinate community review, route sponsor opportunities | Mentioned in growth reports when appropriate            |

## Contribution Tracks

| Track             | Good first task                                             | Strong contribution                                | Verification                               |
| ----------------- | ----------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------ |
| Content clarity   | Fix a confusing paragraph or outdated link                  | Rewrite a lesson section with sources and examples | Markdown preview, source links checked     |
| Translation       | Proofread one `en/` or `zh/` lesson                         | Translate a missing lesson and align terminology   | `npm run ai:index` when lesson set changes |
| Quiz and glossary | Add one quiz question or glossary term                      | Add a mini assessment for a full module            | Relevant Vitest or content checks          |
| Product quality   | Fix a UI bug, accessibility issue, or mobile layout problem | Improve a learning workflow with tests             | `npm test`, `npm run lint`, screenshots    |
| AI-native layer   | Improve `llms.txt`, manifest copy, or content citations     | Add a new read-only MCP capability with tests      | `npm run ai:verify`                        |
| Growth            | Submit to an awesome list or write a community post         | Run a distribution loop and report results         | Link to post, issue, PR, or metrics        |

## Review Rhythm

- Starter PRs should get an initial response within 72 hours when maintainers are active.
- Content PRs are reviewed for accuracy, beginner clarity, source quality, and bilingual consistency.
- Product PRs are reviewed for tests, accessibility, mobile behavior, and build impact.
- Growth PRs are reviewed for audience fit, credibility, and whether they strengthen the project brand.

## Recognition Loop

Every monthly growth report should include:

- New contributors and useful first PRs.
- Repeat contributors who moved up the ladder.
- Modules with active stewards or needed stewards.
- Best community posts, submissions, or partner leads.
- Star count, fork count, contributor count, and sponsor pipeline movement.

## Maintainer Checklist

- Label starter work with `good first issue` only when the issue has clear acceptance criteria.
- Add `help wanted` when outside review or domain expertise would materially help.
- Split large ideas into small issues before assigning them to first-time contributors.
- Convert repeated questions into docs, lesson FAQs, or issue template improvements.
- Do not promise sponsorship placement, token promotion, or financial endorsement in contributor threads.
