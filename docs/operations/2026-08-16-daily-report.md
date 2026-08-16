# Get Started with Web3 Daily Operations Report

**Date:** 2026-08-16
**Owner:** beihai + Codex
**Reporting window:** Public REST API launch and external distribution, Asia/Shanghai.

## KPI Snapshot

| Metric | Current | Previous / Baseline | Movement | Source |
| --- | ---: | ---: | ---: | --- |
| GitHub stars | 612 | 614 on 2026-06-26 report | -2 | `gh repo view` |
| Forks | 58 | 56 on 2026-06-26 report | +2 | `gh repo view` |
| Watchers | 3 | 3 on 2026-06-26 report | 0 | `gh repo view` |
| Open PRs | 1 | 4 on 2026-06-26 report | -3 | `gh pr list` |
| Open issues | 14 | 14 on 2026-06-26 report | 0 | `gh issue list` |

## Completed

- Platform:
  - Merged PR #246 and released the public, read-only REST API as Vercel Functions.
  - Published API v1, OpenAPI 3.1 documentation, bilingual lesson access, glossary search, and role-based learning paths at `https://get-started-with-web3.vercel.app/api/v1`.
  - Confirmed the dedicated Vercel hostname as the production API base; `bhbtc.xyz` remains the website host and its `/api/v1` path is not an API endpoint.
- External distribution:
  - Forked `public-apis/public-apis`, added one alphabetized Blockchain entry, and opened upstream PR #6891.
  - Linked the API documentation rather than the product landing page and verified the link, HTTPS, no-auth, and CORS claims against production.
- AI-native:
  - Kept the existing static AI artifacts and read-only MCP server unchanged; the REST API exposes the same maintained content layer over HTTP.
- Monetization:
  - No payment, x402 enforcement, wallet action, or paid endpoint was enabled.

## Deploy And Verification

| Surface | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Production deploy | Passed | Vercel status on merge commit `635ec83497f7d9d46d5c4bfdc900ab6c7ea4a49f` | Deployment completed successfully |
| Pre-merge CI | Passed | PR #246 `build-and-deploy`, `lighthouse`, and Vercel checks | All recorded checks completed successfully |
| Public REST smoke | Passed | `https://get-started-with-web3.vercel.app/api/v1` | Root, search, nested lesson, and OpenAPI returned JSON; invalid input, 404, OPTIONS, and unsupported method behavior also verified |
| API transport | Passed | Production response headers | HTTPS enabled; CORS allows public reads; JSON responses expose cache policy |
| Upstream entry validation | Passed for the submitted row | `public-apis` format helper, duplicate-link checker, live-link checker, and 31 unit tests | New row produced zero new format errors and its documentation link returned HTTP 200 |

## External Distribution

| Target | Status | Evidence | Next action |
| --- | --- | --- | --- |
| public-apis Blockchain list | PR open | https://github.com/public-apis/public-apis/pull/6891 | Monitor checks and respond to maintainer feedback |

## Sponsor And Revenue

| Lead / Channel | Status | Next action | Risk notes |
| --- | --- | --- | --- |
| Public REST API | Free public v1 launched | Observe adoption before proposing hosted paid tools | No payment enforcement or chain operations are live |

## Blockers And Risks

- Upstream PR #6891 still requires `public-apis` maintainer review and merge.
- The upstream repository's current full-file format validator reports pre-existing baseline errors; the submitted row was checked separately and adds no new error.
- API clients must use `get-started-with-web3.vercel.app`; moving the API behind the `bhbtc.xyz` website domain would require a separate routing or domain migration decision.
- The API is read-only and public, so future write endpoints, authentication, rate-limit products, or payment enforcement require separate design and review.

## Next Operating Block

1. Monitor and address actionable feedback on public-apis PR #6891.
2. Announce the API listing after upstream acceptance and link directly to the API documentation.
3. Review production request/error signals before changing API scope or monetization.

## Evidence Links

- Release PR: https://github.com/beihaili/Get-Started-with-Web3/pull/246
- Production API: https://get-started-with-web3.vercel.app/api/v1
- OpenAPI document: https://get-started-with-web3.vercel.app/api/v1/openapi.json
- API documentation: https://github.com/beihaili/Get-Started-with-Web3/blob/main/docs/api.md
- public-apis submission: https://github.com/public-apis/public-apis/pull/6891
