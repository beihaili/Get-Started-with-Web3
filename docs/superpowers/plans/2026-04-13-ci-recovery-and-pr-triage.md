# CI Recovery & Dependabot PR Triage — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close out the CI cascade triggered by the 2026-04-13 Dependabot PR avalanche — verify the latest fix lands green on main, rebase and merge safe Dependabot PRs, triage the major-bump PRs individually, and follow up on the open contributor PR and translation issue.

**Architecture:** No feature code changes. Remaining work is GitHub-side triggering, CI verification, and individual evaluation of major-version bump PRs. Any migration work surfaced (e.g. ESLint flat config) gets split into its own dedicated PR.

**Tech Stack:** GitHub Actions, Dependabot, `gh` CLI, Vite 4, npm 11.

---

## Context Summary (as of 2026-04-13 14:26 UTC)

### What happened today

A routine "check PRs and issues" turned into a layered CI rescue:

1. **Opened state:** 3 PRs (#56 external, #67/#68 Dependabot mega-bundles) + 10 issues. Two Dependabot PRs were stale since 2026-04-06 with failed CI.
2. **Triage actions taken:**
   - Posted a proper rebase request on PR #56 (and then a correction with the full review recap that had been missed from 2026-04-01).
   - Closed #67/#68 (both bundled 8+ major bumps together, unreviewable).
   - Pinged issue #16 (isogay translation) with a 2026-04-20 deadline.
   - Rewrote `.github/dependabot.yml` to group only minor/patch updates and open individual PRs per major bump.
3. **Unintended consequence:** Dependabot immediately regenerated the PR queue per the new rules, producing 6 new PRs (#69–#74) all at once.
4. **Deeper CI diagnosis:** All 6 PRs failed CI — but the failures were **pre-existing historical bugs**, not regressions. Two independent bugs dating to ≥ 2026-03-27:
   - `npm ci` rejected Dependabot-generated lockfiles due to transient drift.
   - Lighthouse CI 404'd on every PR because `lighthouserc.json` pointed at `/Get-Started-with-Web3/zh/` but `staticDistDir: ./dist` serves from dist root (Vite's `base` only rewrites hrefs).
5. **Fixes merged to main:**
   - `fa8ce32` — drop husky v9 deprecated shebang lines.
   - `02a1318` — PR CI uses `npm install --no-audit --no-fund` to tolerate Dependabot lockfile drift; main/dispatch still uses strict `npm ci`. Lighthouse URL fixed to `/index.html`.
   - `70f2848` — add `terser` as explicit devDependency (the next domino: `vite.config.js` uses `minify: 'terser'` but terser was only a transitive optional peer, dropped by `npm install`).
6. **In flight:** `70f2848` CI currently `in_progress` on main (run id `24348770339`).

### Current open state

| # | What | Status |
|---|------|--------|
| main | Deploy CI for `70f2848` (terser fix) | 🟡 In progress |
| #56 | locchung copy-clipboard | Awaiting contributor; complete review re-posted 2026-04-13 |
| #69 | `actions/github-script` 8→9 | Build was green pre-fixes; needs rebase + final CI |
| #70 | dev-deps-minor group (6 pkgs) | Rebased once, hit terser bug; needs re-rebase |
| #71 | prod-deps-minor group (3 pkgs) | Stale failure; needs rebase |
| #72 | `@vitejs/plugin-react` 4→6 | Major; needs rebase + eval |
| #73 | `@commitlint/cli` 18→20 | Major; needs rebase + eval |
| #74 | `eslint` 8→10 | Major; **likely requires flat-config migration** |
| Issue #16 | isogay translation | Deadline 2026-04-20 |

### Historical debt discovered (not blocking)

- Dependabot's lockfile drift is worked around via `npm install` on PR CI. A more proper fix would be configuring dependabot to regenerate lockfiles cleanly, or adding a post-Dependabot action that runs `npm install && git commit`. Current workaround is functional — defer.
- Lighthouse tests only `/index.html` (SPA entry). It doesn't exercise `/zh/`, `/en/` routes. Could expand once baseline is stable.

---

## Task 0: Confirm main CI green after terser fix

**Files:** None (verification only).

- [ ] **Step 1: Check main's most recent Deploy run**

Run:
```bash
gh run list --workflow="Deploy Web3 Learning Platform" --branch main --limit 1 --json databaseId,conclusion,status,headSha
```

Expected: `headSha: 70f2848...`, `status: completed`, `conclusion: success`.

- [ ] **Step 2: If not yet complete, poll**

Wait and re-run Step 1. CI typically takes ~3–5 minutes.

- [ ] **Step 3: If FAILURE, diagnose before proceeding**

Run: `gh run view <databaseId> --log-failed 2>&1 | tail -50`

If `terser` error is gone but a new error appears, that's yet another historical bug surfacing. Diagnose root cause before any Dependabot rebase. **Do not propagate the failure to 6 PRs by triggering rebases prematurely.**

---

## Task 1: Smoke-test via single PR rebase

Only proceed after Task 0 is green.

**Files:** None.

- [ ] **Step 1: Trigger rebase on PR #70**

PR #70 is the dev-dependencies-minor group — minimal real code impact, maximum signal that the CI pipeline works end-to-end.

Run: `gh pr comment 70 --body "@dependabot rebase"`

- [ ] **Step 2: Watch for Dependabot's new force-push**

Wait ~1–2 min, then run: `gh pr view 70 --json headRefOid,updatedAt`

The `headRefOid` should change from the current value once Dependabot has rebased.

- [ ] **Step 3: Wait for the new CI run to complete**

Run: `gh pr view 70 --json statusCheckRollup`

Both checks should eventually show `conclusion: SUCCESS`.

- [ ] **Step 4: If still failure, stop and diagnose**

Don't batch-trigger the other 5 PRs until #70 is actually green.

---

## Task 2: Batch-rebase remaining Dependabot PRs

Only after #70 is green.

**Files:** None.

- [ ] **Step 1: Trigger rebase on all five**

Run in one batch:
```bash
gh pr comment 69 --body "@dependabot rebase"
gh pr comment 71 --body "@dependabot rebase"
gh pr comment 72 --body "@dependabot rebase"
gh pr comment 73 --body "@dependabot rebase"
gh pr comment 74 --body "@dependabot rebase"
```

- [ ] **Step 2: Wait for all new CI runs to complete**

Give Dependabot + CI ~10 minutes. Then:
```bash
gh pr list --author app/dependabot --json number,title,mergeable,statusCheckRollup
```

---

## Task 3: Merge safe PRs (minor groups + github-actions bump)

**Files:** None.

- [ ] **Step 1: Merge PR #70 (dev-dependencies-minor, 6 packages)**

Verify: `gh pr view 70 --json mergeable,statusCheckRollup` shows `MERGEABLE` and all green.
Run: `gh pr merge 70 --squash --delete-branch`

- [ ] **Step 2: Merge PR #71 (production-dependencies-minor, 3 packages)**

Same verification.
Run: `gh pr merge 71 --squash --delete-branch`

- [ ] **Step 3: Merge PR #69 (actions/github-script v9)**

Breaking-change compatibility already verified in earlier analysis (we don't `require('@actions/github')` or redeclare `getOctokit`).
Run: `gh pr merge 69 --squash --delete-branch`

---

## Task 4: Triage major-bump PRs individually

Read release notes, check config compatibility, merge/defer/close per PR.

### Task 4a: PR #73 — `@commitlint/cli` 18 → 20

**Files to check:**
- `commitlint.config.*` or `.commitlintrc*`
- `.husky/commit-msg`

- [ ] **Step 1: Read release notes**

Run: `gh pr view 73 --json body --jq .body | head -200`

Focus on breaking changes across v19 and v20.

- [ ] **Step 2: Check our config**

Run: `find . -maxdepth 2 \( -name "commitlint.config*" -o -name ".commitlintrc*" \) -not -path "./node_modules/*"`

Read each match. Ensure rule names and preset package versions still match v20.

- [ ] **Step 3: Merge or flag**

If clean: `gh pr merge 73 --squash --delete-branch` (after CI green).
If migration needed: post a PR comment listing the changes required, leave open.

### Task 4b: PR #72 — `@vitejs/plugin-react` 4 → 6

**Files to check:**
- `vite.config.js:6` — currently `plugins: [react()]`

- [ ] **Step 1: Read release notes**

Run: `gh pr view 72 --json body --jq .body | head -200`

Check v5 + v6 breaking changes. The main risks are JSX runtime behavior and any Babel plugin changes.

- [ ] **Step 2: Verify our usage is default**

Grep `vite.config.js` for custom options passed to `react()`. If it's bare `react()`, merge is likely safe.

- [ ] **Step 3: Merge or flag**

If safe: `gh pr merge 72 --squash --delete-branch` (after CI green).

### Task 4c: PR #74 — `eslint` 8 → 10

**⚠️ WARNING:** ESLint v9 made flat config (`eslint.config.js`) the default. If the project still uses `.eslintrc.*`, this is a migration job, not a merge.

- [ ] **Step 1: Check our ESLint config style**

Run: `find . -maxdepth 2 \( -name ".eslintrc*" -o -name "eslint.config.*" \) -not -path "./node_modules/*"`

- [ ] **Step 2: If legacy `.eslintrc*`, defer the major bump**

Don't merge. Options:
1. **Defer:** `gh pr comment 74 --body "@dependabot ignore this major version"` and close. Open a dedicated tracking issue: "Migrate ESLint config to flat format (v9+)".
2. **Migrate inline:** Write flat config in a new PR, merge that first, then rebase #74 on top. Larger scope — only do this if you want to dedicate an hour to it now.

- [ ] **Step 3: If already flat config, run CI and merge**

`gh pr merge 74 --squash --delete-branch` after CI green.

---

## Task 5: Follow up on PR #56 (external contributor)

**Files:** None — waiting on contributor response.

- [ ] **Step 1: No action until locchung responds to 2026-04-13 comment**

If contributor responds with rebase + review items (i18n, textarea positioning): review again.
If 7 days pass (by 2026-04-20) with no response: post a final ping.
If 14 days pass (by 2026-04-27) with no response: close PR politely and reopen issue #30 for another contributor.

---

## Task 6: Issue #16 (translation) deadline check

**Files:** None.

- [ ] **Step 1: Check isogay's response on 2026-04-20**

Run: `gh issue view 16 --json comments --jq '.comments[-1]'`

If isogay responded with a PR or meaningful update: continue helping with fork sync.
If silent:
```bash
# Remove "Being worked on by @isogay" from issue body
gh issue view 16 --json body --jq .body  # inspect current body
gh issue edit 16 --body "<body without that line>"
gh issue comment 16 --body "Unassigning after no response past the 2026-04-20 deadline. Issue is open for other contributors."
```

---

## Review & Execution

**Plan review:** For this tactical triage plan (well-understood follow-up queue, not greenfield design) the formal `plan-document-reviewer` subagent loop is skipped. If the scope expands (e.g. ESLint flat-config migration becomes its own sub-plan), that sub-plan should go through normal review.

**Execution recommendation:** Inline in the current session using `superpowers:executing-plans`. Tasks are serialized by CI wait times; no parallelism benefit from subagent dispatch.
