# Contributor Growth System Design

## Context

Get Started with Web3 now has a broader bilingual curriculum, AI-native entry points, and an explicit 1000-star growth target. The next bottleneck is turning GitHub visitors into contributors, repeat readers, and community advocates. The current contribution docs explain the mechanics of opening a PR, but they do not yet provide a clear contribution ladder, issue routing, or a public backlog that a newcomer can trust.

## Goals

- Help a first-time contributor find a useful task in five minutes.
- Separate content, product, bug, and growth suggestions at issue intake.
- Make maintainership expectations visible so contributors know what happens after they submit.
- Give beihai reusable public assets for community posts, weekly updates, and issue seeding.

## Non-Goals

- No changes to payment, sponsorship acceptance, or wallet addresses.
- No changes to GitHub repository permissions, branch protection, or release settings.
- No new runtime product behavior.

## Approach

Use documentation and GitHub templates as the first version of the contributor growth system. This is intentionally low risk: it improves public onboarding without requiring database changes, GitHub app automation, or external service dependencies.

The system has four surfaces:

1. `CONTRIBUTING.md` and `CONTRIBUTING.en.md` become the short operational guide.
2. `docs/community/contributor-ladder.md` explains contributor roles, review rhythm, recognition, and quality expectations.
3. `docs/community/good-first-issues.md` provides seed issue titles with acceptance criteria that can be copied into GitHub Issues.
4. `.github/ISSUE_TEMPLATE/*` and `.github/PULL_REQUEST_TEMPLATE.md` route incoming work into content, product, bug, and growth lanes.

## Contributor Flow

1. A visitor lands on the README and clicks the contribution link.
2. They choose a contribution track: typo/translation, lesson improvement, quiz/glossary, AI-native artifact, product bug, or growth distribution.
3. They open a matching issue or pick a seed issue from the good-first-issues catalog.
4. The PR template asks for the relevant validation commands and content checks.
5. Maintainers review against the visible ladder and recognition rules.

## Quality Bar

Content changes must name the affected language, module, lesson, and reader outcome. Product changes must include the related test or a reason tests are not applicable. AI-native changes must mention whether `npm run ai:index`, `npm run ai:publish`, or `npm run ai:verify` was run. Growth suggestions must include the target audience, distribution channel, and expected next action.

## Testing

This is a documentation/template change. Verification is:

- Markdown/YAML files format cleanly with Prettier where supported.
- Git status contains only the intended docs and GitHub template files.
- Existing project lint is not required for static docs, but may be run if code files are touched.

## Approval

beihai delegated routine project approval to Codex for growth work. This design is self-approved because it is reversible, does not alter funding or security settings, and directly supports the 1000-star operating goal.
