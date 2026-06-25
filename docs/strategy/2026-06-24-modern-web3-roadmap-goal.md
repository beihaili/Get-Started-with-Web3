# Modern Web3 Roadmap Goal

**Date:** 2026-06-24  
**Owner:** beihai + Codex  
**Status:** Active execution goal  
**Input:** Deep research report on the current value and gaps of `beihaili/Get-Started-with-Web3`

## Executive Direction

Get Started with Web3 should keep its primary identity as a **Chinese-first, bilingual, AI-native Web3 curriculum and knowledge layer**.

The project should not reposition itself as a production dApp starter kit. The practical builder layer should grow through a small number of high-value labs that make modern Web3 concepts runnable without diluting the content platform.

The roadmap therefore has one product thesis:

> Keep the main repo as a curriculum and AI-readable knowledge platform; add focused labs for wallet interoperability, SIWE, account abstraction, L2/cross-chain risk, and learning credentials.

## Assumptions

- The 1000-star operating goal remains active and this roadmap should strengthen, not replace, the existing growth plan.
- The site remains a static React/Vite app deployed through GitHub Pages unless a later hosted API decision is approved.
- Heavy wallet, payment, or account-abstraction dependencies should be added only for a specific lab with a clear verification path.
- Any SIWE or x402 work must be labeled honestly as demo, prototype, or metadata until a real backend/payment flow exists.
- Mainland China-facing copy must stay educational and avoid trading, token promotion, investment advice, or virtual-currency business solicitation.

## Success Criteria

By the end of this roadmap, the project should have:

- A clearer top-level positioning: curriculum + AI knowledge layer, with explicit boundaries.
- A documented modern Web3 gap analysis and a public implementation backlog.
- One runnable wallet interoperability lab.
- One SIWE learning identity demo that does not pretend to be production authentication.
- One account abstraction learning module covering ERC-4337 and EIP-7702 with a runnable or simulatable experiment.
- One L2/cross-chain risk or identity/credential lab tied back to course content.
- Updated AI artifacts, tests, docs, and public roadmap notes for every shipped capability.
- Continued contribution and distribution loops that support the 1000-star goal.

## Execution Log

| Date       | Roadmap package      | Status    | Evidence                                                                                                                                                                                                                                                                      |
| ---------- | -------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-06-24 | Roadmap alignment    | Completed | Strategy doc, public roadmap issue update, Phase 1 issue drafts, and GitHub labels.                                                                                                                                                                                           |
| 2026-06-24 | README boundary      | Completed | English and Chinese README boundary sections.                                                                                                                                                                                                                                 |
| 2026-06-24 | Gap analysis         | Completed | `docs/strategy/2026-06-24-modern-web3-gap-analysis.md`.                                                                                                                                                                                                                       |
| 2026-06-24 | Runtime baseline     | Completed | Node `>=20`, `npm run audit`, and audit baseline recorded in `docs/strategy/2026-06-24-runtime-baseline.md`.                                                                                                                                                                  |
| 2026-06-24 | Wallet lab design    | Completed | `docs/strategy/2026-06-24-wallet-lab-architecture.md`.                                                                                                                                                                                                                        |
| 2026-06-24 | Wallet lab MVP slice | Completed | Dependency-free EIP-6963 / EIP-1193 lab implemented under `src/features/wallet-lab/`; unit, integration, lint, test, build, GitHub CI, and desktop/mobile Playwright smoke passed. Known local-only Cloudflare analytics CORS noise remains unrelated to Wallet Lab behavior. |

## Non-Goals

- Do not build a full dApp starter kit.
- Do not compete directly with Scaffold-ETH, SpeedRunEthereum, WTF-Solidity, or Dapp-Learning on their strongest surfaces.
- Do not add trading, token launch, yield, or exchange onboarding flows.
- Do not claim paid AI/x402 features are live before they are actually deployed and verified.
- Do not move the whole project into a monorepo unless repeated labs prove the current structure is blocking maintainability.

## Roadmap

### Phase 0: Align The Map

**Timebox:** 1 week  
**Outcome:** The project has one clear implementation map and no hidden ambiguity about direction.

Work:

- Publish this roadmap as the internal strategy source of truth.
- Update the pinned public roadmap issue with the new direction: curriculum + AI knowledge layer + focused labs.
- Create or refresh GitHub labels for `wallet-lab`, `identity`, `account-abstraction`, `l2-cross-chain`, `ai-native`, and `good first issue`.
- Turn each Phase 1 task into small issues with definition of done.

Verify:

- Strategy doc exists in `docs/strategy/`.
- Public roadmap issue links to the strategy direction.
- At least 5 scoped issues exist or are drafted for Phase 1.

### Phase 1: Positioning And Trust Baseline

**Timebox:** Weeks 1-4  
**Outcome:** Visitors understand what the project is, what it is not, and why it is credible.

Work:

- Refresh README opening around: open-source, bilingual, AI-native Web3 curriculum.
- Add a short project boundary section: not a production dApp starter, not investment advice, not virtual-currency business service.
- Add or update a modern Web3 gap analysis doc covering EIP-6963, SIWE, ERC-4337, EIP-7702, DID/VC, L2/cross-chain risk, and credential design.
- Synchronize README, CHANGELOG, course map, and AI artifacts if current module/lesson counts differ.
- Add explicit runtime expectations if still missing, starting with Node 20 compatibility.
- Add or strengthen quality scripts for audit and coverage only if they fit the current CI without forcing a Node 22 migration.

Verify:

- `npm test`
- `npm run lint`
- `npm run ai:index && npm run ai:publish && npm run ai:verify` if course metadata or AI artifacts changed
- `npm run build` if README-linked public routes, SEO, or generated assets changed

### Phase 2: Wallet Lab MVP

**Timebox:** Weeks 5-10  
**Outcome:** The project can demonstrate modern wallet interoperability without becoming a wallet framework.

Default implementation choice:

- Use `wagmi + viem + RainbowKit` for the first educational lab because this stack is common, transparent for learners, and aligns with many current EVM examples.
- Keep Reown AppKit as a later alternative, especially if a WalletConnect/Reown partnership or sponsor path becomes active.

Work:

- Add a `/labs/wallet` or equivalent route that is clearly labeled as a lab.
- Support connect, disconnect, account display, chain display, network switch, and message signing.
- Teach EIP-6963 conceptually even if the UI library abstracts most discovery details.
- Keep the lab isolated so the main learning pages do not pay the dependency or UX cost.
- Add one course or article that explains what learners just used.
- Add tests for route rendering, safe fallback states, and config helpers.

Verify:

- `npm test`
- `npm run lint`
- `npm run build`
- Browser smoke on desktop and mobile for the wallet lab route
- No private keys, raw wallet addresses, or signed messages are sent to analytics

### Phase 3: SIWE And Learning Identity

**Timebox:** Weeks 11-16  
**Outcome:** Learners understand Sign-In with Ethereum and identity boundaries.

Static-site constraint:

- A GitHub Pages-only app cannot provide production SIWE sessions because nonce issuance and session validation require a trusted server.
- The first version should therefore be a SIWE message/signature learning demo, not a real login system.

Work:

- Add a SIWE lesson that explains ERC-4361, nonce, domain, statement, expiration, and replay risk.
- Add a static lab where users can compose a SIWE message, sign it, and locally inspect or verify the result.
- Clearly label the demo as educational and not production authentication.
- Draft a future hosted-auth decision note for API-backed SIWE, but do not implement it unless approved.
- Connect the concept to learning identity and certificates without promising a real account system.

Verify:

- Unit tests for SIWE message construction helpers.
- Component tests for disconnected, connected, signed, and error states.
- `npm test`
- `npm run lint`
- `npm run build`

### Phase 4: Account Abstraction Practical Module

**Timebox:** Months 4-6  
**Outcome:** Account abstraction becomes a practical learning path, not just a glossary item.

Work:

- Add an account abstraction module or focused mini-track covering:
  - ERC-4337 mental model
  - UserOperation anatomy
  - Bundlers and paymasters
  - Smart accounts and recovery
  - EIP-7702 and delegated EOA behavior
  - Safety and sponsorship risks
- Build a first lab as a simulator or testnet-only guide, depending on dependency and RPC risk.
- Prefer a visual UserOperation builder/simulator before integrating a live bundler.
- Add glossary terms and AI index updates.
- Create good-first issues for diagrams, glossary proofreading, and English translation.

Verify:

- Course structure and `src/config/courseData.js` are updated.
- Badge data is updated if the module creates a new completion path.
- `npm run ai:index && npm run ai:publish && npm run ai:verify`
- Relevant Vitest tests for new helpers/components.
- `npm test`
- `npm run lint`
- `npm run build`

### Phase 5: L2, Cross-Chain, DID, And Credentials

**Timebox:** Months 7-9  
**Outcome:** The platform explains modern Web3 infrastructure through learner-safe experiments.

Work:

- Add an L2/cross-chain risk lab that compares finality, bridge trust assumptions, message passing, and failure modes.
- Add DID/VC content only where it connects to learning identity, certificates, or attestations.
- Reframe the current NFT certificate example as one design option among ERC-721, ERC-1155, soulbound, offchain proof, and verifiable credential approaches.
- Document the credential architecture tradeoff before changing contracts.
- If a contract update is needed, keep it in `contracts/` or `labs/` and avoid coupling it to core course navigation too early.

Verify:

- New content has source dates or last-reviewed markers for high-change protocol topics.
- AI artifacts are regenerated and verified.
- Any contract work has its own Foundry verification path.
- Frontend tests and build pass.

### Phase 6: AI-Native Stable Layer And Monetization Decision

**Timebox:** Months 10-12  
**Outcome:** The AI-native layer becomes a stable platform surface, and monetization remains trust-preserving.

Work:

- Review `llms.txt`, AI manifest, MCP server tools, and content index as public product surfaces.
- Version the AI-native artifact contract if external users start depending on it.
- Decide whether the first paid tool should use x402, Stripe, GitHub Sponsors gating, or manual sponsorship.
- Keep local MCP free and read-only.
- Publish a sponsor-safe impact report showing stars, traffic, contributors, indexed lessons, and shipped labs.
- Use shipped labs as campaign assets for public posts, releases, and sponsor outreach.

Verify:

- `npm run ai:index && npm run ai:publish && npm run ai:verify`
- MCP server remains read-only.
- Paid-tool copy does not describe non-live features as live.
- Sponsor placements and affiliate/payment surfaces remain disclosed.

## Work Package Order

Use this order for implementation. Each package should be one small PR unless the diff is purely documentation.

| Order | Package           | Primary Deliverable                       | Exit Criteria                         |
| ----- | ----------------- | ----------------------------------------- | ------------------------------------- |
| 1     | Roadmap alignment | Strategy doc + public roadmap update      | Direction visible and linked          |
| 2     | README boundary   | README positioning and non-goals          | First-time visitor understands scope  |
| 3     | Gap analysis      | `docs/strategy/*modern-web3-gap*`         | Gaps are documented with priorities   |
| 4     | Runtime baseline  | Node/version/audit/coverage decision      | CI remains green on Node 20           |
| 5     | Wallet lab design | Architecture note before dependencies     | Stack choice and route shape approved |
| 6     | Wallet lab MVP    | Runnable wallet lab                       | Connect/sign/switch smoke passes      |
| 7     | SIWE lesson       | SIWE content + static demo                | No false production-auth claim        |
| 8     | AA module         | ERC-4337/EIP-7702 content + lab           | AI index and tests pass               |
| 9     | L2/identity lab   | Risk or credential experiment             | Learner-safe experiment shipped       |
| 10    | AI-native v1      | Artifact contract + monetization decision | Public product surface is stable      |

## Pasteable `/goal` Prompt

```text
/goal 按照 docs/strategy/2026-06-24-modern-web3-roadmap-goal.md 一路推进 Get Started with Web3 的 Modern Web3 路线图，直到路线图中的阶段性目标都被实现、验证、记录，或者被明确延期并说明理由。

总目标：
把 Get Started with Web3 打造成最清晰的中文优先、双语、AI-native Web3 课程与知识层；在不把主仓变成生产级 dApp starter 的前提下，逐步补齐现代 Web3 的高价值实验能力：钱包互操作、SIWE 学习身份、账户抽象、L2/跨链风险、DID/VC/学习证书，以及稳定的 AI-readable 内容接口。

每一轮开始前都要先做当前状态检查：
1. 阅读 docs/strategy/2026-06-24-modern-web3-roadmap-goal.md。
2. 检查 git status，确认已有改动，不要覆盖用户或其他 agent 的工作。
3. 对照 Work Package Order 找出尚未完成的最靠前任务。
4. 如果当前任务依赖外部账号、GitHub 设置、赞助发送、真实支付、生产认证或高风险合规动作，先把可本地推进的部分完成，再列出需要用户确认的动作。

执行原则：
1. 主仓定位保持为课程内容平台 + AI-readable 知识层。
2. 实验能力只围绕明确教学目标添加，避免把仓库扩张成完整 dApp 脚手架。
3. 每次只做一个可审查、可测试、可说明的小包。
4. 不添加交易、代币发行、收益、投机、交易所导流或未披露商业推广。
5. SIWE、x402、赞助、付费工具和链上证书相关内容必须诚实标注 demo、prototype、metadata、draft 或 future plan，不能把未上线能力写成已上线产品。
6. 涉及中国大陆用户的文案必须保持技术教育定位，不写投资建议、交易引流或虚拟货币业务服务。
7. 新增或移动课程、术语、AI 工具元数据、公开入口时，要同步更新 AI artifacts 并运行对应验证。

优先工作顺序：
1. Roadmap alignment：路线图文档、公开 roadmap issue、labels、Phase 1 issues。
2. README boundary：README 首屏定位、适合/不适合谁、合规和项目边界。
3. Gap analysis：现代 Web3 缺口文档，覆盖 EIP-6963、SIWE、ERC-4337、EIP-7702、DID/VC、L2/跨链风险、credential design。
4. Runtime baseline：Node 版本、audit、coverage、CI 基线；必须兼容当前 Node 20 策略，Node 22 迁移单独处理。
5. Wallet lab design：先写架构说明，再决定是否引入 wagmi + viem + RainbowKit 或 Reown AppKit。
6. Wallet lab MVP：独立 lab route，支持 connect、disconnect、account display、chain display、network switch、message signing，并补测试和浏览器 smoke。
7. SIWE learning identity：新增 SIWE 课程与静态签名/验证 demo，明确生产 SIWE 需要后端 nonce 和 session。
8. Account abstraction module：新增 ERC-4337 / EIP-7702 内容、UserOperation simulator 或 testnet-only lab、术语表、课程索引、必要测试。
9. L2 / identity / credential lab：新增一个学习者安全的 L2/跨链风险或证书设计实验，把 NFT certificate 重写为 credential 方案之一。
10. AI-native v1：把 llms.txt、AI manifest、content index、MCP server 当作稳定公开产品面审查；本地 MCP 保持 free 和 read-only；付费路径只在前面信任面成立后决策。

每个工作包的完成条件：
1. 代码或文档改动直接服务当前路线图任务，不做无关重构。
2. README、CHANGELOG、courseData、badgeData、glossary、AI artifacts、public artifacts、operations docs 只在需要时同步更新。
3. 至少运行相关 Vitest；完成代码改动前运行 npm test 和 npm run lint。
4. 如果改动课程结构、术语表、MCP 工具元数据或 AI 公开入口，运行 npm run ai:index && npm run ai:publish && npm run ai:verify。
5. 如果改动 SEO、public route、Vite base、analytics、Tailwind/CSS 入口或页面 UI，运行 npm run build；UI 改动还要做浏览器 smoke。
6. 如果暂时无法完成某个验收项，要在 docs/operations/ 或相关 strategy 文档中记录原因、风险和下一步。

每一轮结束前都要输出：
1. 本轮完成了哪个 work package 或其中哪一个 slice。
2. 改了哪些文件。
3. 运行了哪些验证命令，结果是什么。
4. 还有哪些路线图任务未完成，下一轮应该从哪里继续。
5. 如果有外部动作、GitHub issue/PR、赞助、支付、认证、合规风险，明确列出是否已执行、是否需要用户确认。

最终 Done 的标准：
1. Work Package Order 中 1-10 都已经完成，或有明确延期原因和替代计划。
2. 公开 roadmap issue 反映当前真实状态。
3. README、课程地图、AI artifacts、MCP/llms.txt surfaces、运营文档彼此一致。
4. 钱包 lab、SIWE demo、账户抽象模块、L2/identity/credential lab 至少各有一个可验证交付物。
5. npm test、npm run lint、npm run build、必要的 AI verify 全部通过，或失败项有清楚且可接受的记录。
6. 项目仍然诚实地保持课程平台和 AI 知识层定位，没有越界成未验证的金融、交易、生产认证或付费产品承诺。
```

## Weekly Execution Cadence

- Monday: pick one work package and define its exit criteria.
- Tuesday-Wednesday: implement the smallest useful slice.
- Thursday: run verification and prepare public-facing notes.
- Friday: merge or publish the update, then record it in `docs/operations/`.
- Weekend: update the public roadmap issue and queue one distribution post if the change is visible.

## First Four Concrete Tasks

1. Update the pinned 1000-star roadmap issue with the new product thesis.
2. Refresh README boundary language so visitors understand curriculum vs builder-lab scope.
3. Add `docs/strategy/2026-06-24-modern-web3-gap-analysis.md` with prioritized gaps and source dates.
4. Create a wallet lab architecture note before adding wallet dependencies.
