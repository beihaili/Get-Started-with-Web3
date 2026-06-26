# AI-Native V1 Stability And Monetization Decision

**Date:** 2026-06-26
**Owner:** beihai + Codex
**Status:** Phase 6 decision; no payment enabled

## Decision

Treat the AI-native layer as a stable public product surface starting with artifact contract `1.0.0`.

The free layer remains:

- `llms.txt`
- `ai/manifest.json`
- `ai/content-index.json`
- `public/llms.txt`
- `public/ai/manifest.json`
- `public/ai/content-index.json`
- local stdio MCP server resources `web3://manifest` and `web3://content-index`
- local MCP tools exposed by `npm run mcp:web3`

The local MCP server stays free and read-only. It does not enforce payment, write repository files, request wallet signatures, execute chain operations, or settle x402 payments.

The first monetization path should be manual sponsorship or GitHub Sponsors-supported access review, not live x402 or Stripe checkout. x402 remains manifest metadata for possible future hosted remote tools.

## Artifact Contract

`artifactContract.version` is now the stability contract for external agent consumers.

`schemaVersion` continues to identify the generated content schema date. It may change when generator shape changes. `artifactContract.version` changes only when the public AI-native contract changes.

Current contract:

- `version`: `1.0.0`
- `status`: `stable`
- `effectiveDate`: `2026-06-26`
- Additive fields may be introduced without changing the contract version.
- Removing or renaming top-level fields requires a major contract version change.
- Local MCP remains free, read-only, non-payment-enforcing, and non-chain-operating.
- Future paid tools are metadata only until a hosted runtime and payment flow are explicitly approved.

## Public Surface Audit

| Surface | Current state | Stability decision |
| --- | --- | --- |
| `llms.txt` | Human/agent-readable entrypoint with artifact links, MCP command, and tool list | Stable v1 surface |
| `ai/manifest.json` | Machine-readable service manifest, MCP config, tool catalog, x402 metadata | Stable v1 surface; now includes `artifactContract` |
| `ai/content-index.json` | Bilingual lesson and glossary index with citations | Stable v1 surface; now includes `artifactContract` |
| `public/llms.txt` | Published root entrypoint for `https://bhbtc.xyz/llms.txt` | Stable v1 surface |
| `public/ai/manifest.json` | Published manifest for agents and crawlers | Stable v1 surface |
| `public/ai/content-index.json` | Published content index for agents and crawlers | Stable v1 surface |
| `npm run mcp:web3` | Local stdio MCP server | Free and read-only |
| `list_monetizable_tools` | Local read-only metadata lookup | Advisory only; does not enforce payment |

## Current Impact Snapshot

Measured on 2026-06-26 Asia/Shanghai unless noted.

| Metric | Value | Source / caveat |
| --- | ---: | --- |
| GitHub stars | 614 | `gh repo view beihaili/Get-Started-with-Web3` |
| Forks | 56 | `gh repo view beihaili/Get-Started-with-Web3` |
| Watchers | 3 | `gh repo view beihaili/Get-Started-with-Web3` |
| Public contributors | 16 | GitHub contributors API; includes Dependabot |
| Modules | 11 | generated AI manifest |
| Indexed bilingual lesson entries | 124 | generated AI manifest |
| Glossary entries | 63 | generated AI manifest |
| Local MCP tools | 6 read-only tools | generated AI manifest |
| Future paid tool metadata entries | 2 | generated AI manifest; not live |
| GitHub 14-day repo views | 104 views / 29 unique visitors | GitHub traffic API for 2026-06-11 through 2026-06-24 UTC |
| GitHub 14-day clones | 510 clones / 159 unique cloners | GitHub traffic API for 2026-06-11 through 2026-06-24 UTC |
| Public site traffic | Not included | GA4 / Cloudflare analytics not reviewed in this local pass |

Shipped labs:

- Wallet interoperability lab: `/labs/wallet`
- SIWE learning identity demo: `/labs/siwe`
- Account abstraction UserOperation simulator: `/labs/account-abstraction`
- L2 bridge risk simulator: `/labs/l2-risk`

## Monetization Decision

Do not enable x402, Stripe, checkout, wallet payment, or hosted paid-tool access in this phase.

Recommended first path:

1. Keep the curriculum, public AI artifacts, and local MCP free.
2. Use the impact snapshot for sponsor/grant outreach and GitHub Sponsors positioning.
3. Collect qualified interest for the two future hosted tools:
   - `generate_personalized_web3_plan`
   - `audit_learning_answer`
4. Decide hosted runtime, privacy policy, abuse limits, refunds/support, and payment rail only after 5-10 qualified signals.

| Option | Decision | Reason |
| --- | --- | --- |
| x402 | Defer | Good long-term Web3-native fit, but current repo only has metadata and no hosted enforcement/runtime. |
| Stripe | Defer | Operationally familiar, but adds checkout, privacy, support, and refund obligations before demand is proven. |
| GitHub Sponsors gated access | Consider later | Trust-preserving and aligned with open-source support, but still needs access control and privacy design. |
| Manual sponsorship / grant | Preferred first path | Lowest trust risk; uses existing sponsor kit and does not require learners to pay or connect wallets. |

## Campaign Assets

Use these only after the PR lands or when explicitly posting a roadmap update.

Short English post:

> Get Started with Web3 now has a stable AI-native v1 surface: llms.txt, manifest, content index, and a free read-only MCP server. The curriculum also ships focused labs for wallet interoperability, SIWE, account abstraction, and L2 bridge risk. Paid-tool metadata remains future-only; the open learning layer stays free.

Short Chinese post:

> Get Started with Web3 已完成 AI-native v1 稳定层：llms.txt、manifest、content index 和本地只读 MCP server。课程也补齐了钱包互操作、SIWE、账户抽象和 L2 跨链桥风险实验。未来付费工具仍只是元数据，开放学习层保持免费。

Sponsor-safe one-liner:

> A bilingual, open-source Web3 curriculum with 124 indexed lesson entries, 63 glossary terms, a free read-only MCP server, and four learner-safe modern Web3 labs.

## Guardrails

- Do not describe future paid tools as live.
- Do not accept payment, enable x402 enforcement, or add wallet payment flows without explicit approval.
- Do not use sponsor copy to influence lesson conclusions, security warnings, or course order.
- Do not treat GitHub clone counts as unique learners.
- Do not claim public site traffic unless GA4 or Cloudflare data is separately reviewed.

## Verification

Required checks for this phase:

- `npm run ai:index`
- `npm run ai:publish`
- `npm run ai:verify`
- `npm run mcp:dogfood`
- relevant Vitest for AI artifact generation and MCP metadata
- `npm run lint`
- `npm test`
- `npm run build`
