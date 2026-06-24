# Runtime Baseline

**Date:** 2026-06-24  
**Owner:** beihai + Codex  
**Status:** Phase 1 baseline  
**Roadmap package:** Runtime baseline

## Decision

The project runtime baseline is **Node 20 or newer**, with GitHub Actions still pinned to Node 20.

This keeps the current CI stable while avoiding a premature Node 22 migration. Node 22-only dev-tool major updates remain deferred through `.github/dependabot.yml` until the project intentionally updates CI, contributor docs, and local expectations together.

## Current Evidence

- `.github/workflows/deploy.yml` uses `actions/setup-node` with `node-version: '20'`.
- `.github/workflows/lighthouse.yml` uses `actions/setup-node` with `node-version: '20'`.
- `.github/dependabot.yml` ignores Node 22-only major updates for `@commitlint/cli`, `@commitlint/config-conventional`, and `lint-staged`.
- `package.json` now declares:

```json
"engines": {
  "node": ">=20"
}
```

## Audit Script

`package.json` now exposes:

```bash
npm run audit
```

This maps to:

```bash
npm audit --audit-level=moderate
```

The script is intentionally not inserted into CI in this slice. Running audit in CI should be a separate quality-gate PR because it can fail on registry state unrelated to the Modern Web3 roadmap work.

## Coverage Decision

Coverage is documented but not enabled in this slice.

Reason:

- `vitest.config.js` currently has no coverage configuration.
- The repo does not currently include `@vitest/coverage-v8`.
- Adding coverage correctly requires a dependency update and a follow-up decision about thresholds.
- The roadmap requires CI to remain green on Node 20; a coverage gate should be added only after the provider and thresholds are reviewed.

Recommended follow-up:

1. Add `@vitest/coverage-v8` as a dev dependency.
2. Add `test:coverage` only after the dependency is present.
3. Start with reporting-only coverage before enforcing thresholds.
4. Add thresholds once the baseline is known and stable.

## Verification Scope

For this slice:

```bash
npm run lint
npm test
```

For a future CI quality-gate PR:

```bash
npm run audit
npm run test:coverage
```

Only add those commands to CI after their local behavior is verified on Node 20.
