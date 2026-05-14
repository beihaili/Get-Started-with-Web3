# Contributor Growth System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public contribution system that converts GitHub visitors into first-time contributors and repeat community participants.

**Architecture:** Keep the first version as static repository assets: contribution guides, community docs, issue templates, and the PR template. This avoids runtime risk while improving discoverability, triage quality, and community trust.

**Tech Stack:** Markdown, GitHub issue forms, GitHub pull request template, Prettier.

---

### Task 1: Community Docs

**Files:**

- Create: `docs/community/contributor-ladder.md`
- Create: `docs/community/good-first-issues.md`

- [ ] **Step 1: Add the contributor ladder**

Create `docs/community/contributor-ladder.md` with roles for first-time contributors, repeat contributors, reviewers, module stewards, and sponsor/community partners. Include review rhythm, recognition rules, and quality expectations.

- [ ] **Step 2: Add seed issues**

Create `docs/community/good-first-issues.md` with copy-ready GitHub issue titles, labels, context, acceptance criteria, and verification commands for translation, glossary, quiz, SEO, AI-native, and community distribution work.

- [ ] **Step 3: Verify docs are actionable**

Run: `npx prettier --check docs/community/contributor-ladder.md docs/community/good-first-issues.md`

Expected: both files pass formatting.

### Task 2: Contribution Guides

**Files:**

- Modify: `CONTRIBUTING.md`
- Modify: `CONTRIBUTING.en.md`

- [ ] **Step 1: Add contribution tracks**

Update both guides with a short track selector covering content, translation, quiz/glossary, product bug, AI-native artifact, and growth contribution paths.

- [ ] **Step 2: Add validation matrix**

Update both guides with exact commands for content-only changes, course structure changes, UI/code changes, and AI-native changes.

- [ ] **Step 3: Link community docs**

Link the contributor ladder and good-first-issues catalog from both guides.

### Task 3: GitHub Templates

**Files:**

- Create: `.github/ISSUE_TEMPLATE/config.yml`
- Create: `.github/ISSUE_TEMPLATE/content_contribution.yml`
- Create: `.github/ISSUE_TEMPLATE/growth_distribution.yml`
- Modify: `.github/ISSUE_TEMPLATE/bug_report.yml`
- Modify: `.github/ISSUE_TEMPLATE/feature_request.yml`
- Modify: `.github/PULL_REQUEST_TEMPLATE.md`

- [ ] **Step 1: Add issue template config**

Add template chooser guidance and external links to the live site, contributor guide, and good-first-issues catalog.

- [ ] **Step 2: Add content contribution form**

Add a bilingual form that captures language, module, lesson, contribution type, reader outcome, source links, and validation commands.

- [ ] **Step 3: Add growth distribution form**

Add a bilingual form that captures target audience, distribution channel, proposed copy, expected action, and owner.

- [ ] **Step 4: Refresh existing forms**

Update bug and feature templates with bilingual names, clearer labels, and categories aligned to the current product.

- [ ] **Step 5: Refresh PR template**

Update the PR template with bilingual sections and validation checkboxes for tests, lint, build, AI artifacts, screenshots, and docs.

### Task 4: Agent Notes And Verification

**Files:**

- Modify: `AGENTS.md`

- [ ] **Step 1: Update agent notes**

Add the new community docs and template surfaces to `AGENTS.md` so future agents maintain them when growth operations change.

- [ ] **Step 2: Run verification**

Run:

```bash
npx prettier --check CONTRIBUTING.md CONTRIBUTING.en.md AGENTS.md docs/community/*.md docs/superpowers/specs/2026-05-14-contributor-growth-system-design.md docs/superpowers/plans/2026-05-14-contributor-growth-system.md .github/ISSUE_TEMPLATE/*.yml .github/PULL_REQUEST_TEMPLATE.md
git diff --check
git status --short
```

Expected: Prettier and diff whitespace checks pass; status shows only the intended docs/template changes.
