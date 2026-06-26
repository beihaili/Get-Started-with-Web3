# Paid AI Tools Landing Copy Draft

**Date:** 2026-05-18
**Status:** Internal positioning draft; not a live paid product
**Owner:** beihai + Codex

## Positioning

Get Started with Web3 already exposes free, read-only AI-native learning surfaces: `llms.txt`, JSON artifacts, and a local MCP server. The next monetization experiment should keep that public-good layer free while testing lightweight hosted tools that save learners and educators time.

The first paid-tool story:

> Turn the open Web3 curriculum into cited, personalized learning help without asking beginners to trust generic Web3 advice.

## Boundary Copy

Use this copy anywhere these tools are mentioned before launch:

> The local MCP server remains free and read-only. It does not sign transactions, execute chain operations, enforce payment, or handle x402 settlement. Paid-tool metadata in the manifest describes possible future hosted tools and should not be presented as a live checkout flow.

Do not publish copy that implies:

- A paid API is already live.
- x402 settlement is already enforced.
- The project gives investment advice.
- A learner should connect a wallet or pay before the hosted tool is explicitly launched and reviewed.

## Tool 1: Personalized Web3 Plan

Manifest tool name: `generate_personalized_web3_plan`

Future route: `/mcp/tools/generate_personalized_web3_plan`

Current metadata price: `$0.25` on Base, not active.

### One-Line Copy

Generate a cited Web3 learning plan from your background, goals, risk tolerance, and weekly time budget.

### Short Landing Copy

Most Web3 learners do not need more random links. They need the right next lesson, a safe order of operations, and a way to avoid confusing wallet, chain, gas, bridge, and DeFi concepts too early. The personalized plan tool would turn the open Get Started with Web3 curriculum into a focused path with citations back to lessons, glossary entries, and public AI artifacts.

### Expected Inputs

- Current level: beginner, builder, researcher, or returning learner.
- Goal: wallet safety, first DApp, smart contracts, DeFi basics, L2/cross-chain, DAO, Bitcoin, or smart accounts.
- Language: Chinese or English.
- Weekly time budget.
- Constraints: avoid trading, focus on security, prepare for development, prepare for research, or review a specific topic.

### Expected Output

- A 7-day, 14-day, or 30-day plan.
- Lesson sequence with cited links.
- Key glossary terms to learn first.
- Hands-on checkpoints.
- Safety notes for wallet, signature, bridge, DeFi, or smart-account actions.
- Optional next contributor issue if the learner wants to help the project.

### CTA Drafts

- Primary: `Generate my cited Web3 learning plan`
- Secondary: `Browse the free curriculum first`
- Agent CTA: `Use the free MCP server locally`

## Tool 2: Learning Answer Audit

Manifest tool name: `audit_learning_answer`

Future route: `/mcp/tools/audit_learning_answer`

Current metadata price: `$0.10` on Base, not active.

### One-Line Copy

Check a Web3 learning answer against the curriculum and get cited corrections without generic AI guesses.

### Short Landing Copy

Web3 beginners often write answers that sound plausible but miss a safety detail: approvals are not transfers, bridges add trust assumptions, smart accounts change key management, and DeFi yields carry protocol and market risk. The answer audit tool would review a learner's answer against the repository's lessons and glossary, then return concise corrections with citations.

### Expected Inputs

- Prompt or lesson question.
- Learner answer.
- Language preference.
- Optional target module or topic.
- Optional strictness: beginner-friendly, technical, or exam-style.

### Expected Output

- Correct / partially correct / needs review.
- 3-5 cited corrections.
- Missing safety warnings.
- Misused terminology.
- Suggested next lesson or glossary entry.
- A short rewritten answer the learner can compare with their original.

### CTA Drafts

- Primary: `Audit my Web3 answer`
- Secondary: `Read the cited lesson`
- Educator CTA: `Use this for study group review`

## Landing Page Structure

### Hero

Headline:

> Cited Web3 learning help from an open curriculum

Subcopy:

> Generate personalized study paths and audit learning answers against Get Started with Web3. The free curriculum and local read-only MCP server stay open; hosted paid tools are a future experiment for learners who want faster guidance.

Primary CTA:

> Join the paid-tool waitlist

Secondary CTA:

> Use the free AI-native curriculum

### Trust Strip

- Open-source curriculum.
- Bilingual content.
- 124 indexed lesson entries.
- 63 glossary entries.
- Local MCP is free and read-only.
- No investment advice or wallet signing.

### Product Sections

1. `Personalized Web3 Plan`
   - For learners who know their goal but not the order.
   - Shows a sample 14-day plan with lesson citations.
2. `Learning Answer Audit`
   - For learners, study groups, and educators.
   - Shows a sample correction with links to lessons and glossary terms.
3. `Free Agent Layer`
   - Links to `llms.txt`, `ai/manifest.json`, `ai/content-index.json`, and MCP setup.
   - Makes it explicit that local use is free.

### FAQ

**Are these tools live today?**

Not yet. The manifest contains future-tool metadata so the project can design the product surface openly before activating hosted payment or access control.

**Will the free curriculum stay free?**

Yes. The core lessons, glossary, public AI artifacts, and local read-only MCP server should remain free.

**Does this give investment advice?**

No. The tools are for learning, citation, and safety review. They should not recommend tokens, trades, leverage, yield products, or timing.

**Will users need to connect a wallet?**

Not for the free local MCP. Any hosted paid-tool payment flow must be reviewed before launch and must not request seed phrases, private keys, or unsafe permissions.

**Why paid tools at all?**

Small paid utilities can fund maintenance, translation, and new lessons without putting ads or intrusive sponsor copy into the learning flow.

## Launch Readiness Checklist

- [ ] Decide payment path: x402, Stripe, GitHub Sponsors gated, or manual sponsor-supported access.
- [ ] Confirm hosted runtime and abuse limits.
- [ ] Add explicit privacy policy for submitted answers and learner goals.
- [ ] Add no-investment-advice and no-wallet-signing warnings.
- [ ] Add examples with real citations.
- [ ] Add daily report tracking for waitlist, usage, revenue, support requests, and refunds.
- [ ] Get explicit beihai confirmation before enabling any payment flow.

## Recommendation

Phase 1 should not enable payment immediately. The safer next step is to publish waitlist or interest-copy, collect 5-10 qualified user signals, and only then choose the payment mechanism. This keeps the project aligned with open education while preserving the option to test x402 or another hosted payment path later.

## 2026-06-26 Phase 6 Decision Update

The AI-native layer is now treated as a stable v1 public surface through `artifactContract.version = "1.0.0"` in the generated manifest and content index.

The current monetization decision is:

- Keep lessons, public AI artifacts, and local MCP free.
- Keep future paid tools as metadata only.
- Prefer manual sponsorship or GitHub Sponsors-supported access review before x402 or Stripe.
- Do not enable hosted paid-tool access, payment enforcement, checkout, or wallet payment without explicit approval and a privacy / abuse / refund plan.

See `docs/strategy/2026-06-26-ai-native-v1-stability-and-monetization.md`.
