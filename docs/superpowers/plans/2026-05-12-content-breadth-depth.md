# Web3 Content Breadth And Depth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 扩充仓库中文课程的内容广度和深度，并把新增内容接入学习平台与 AI-native 内容索引。

**Architecture:** 第一批只写中文课程，优先补齐以太坊智能账户、交易工具、安全、稳定币、L2 和 Bitcoin Core 31.0 相关内容。课程文件仍放在 `zh/` 下，导航由 `src/config/courseData.js` 驱动，AI artifacts 由 `scripts/generate-ai-index.mjs` 和 `scripts/publish-ai-artifacts.mjs` 生成。

**Tech Stack:** Markdown lessons, React course config, Vitest, Node.js AI artifact scripts, ESLint.

---

### Task 1: Baseline And Guardrails

**Files:**
- Read: `src/config/courseData.js`
- Read: `src/config/glossaryData.js`
- Read: `scripts/ai-content-core.mjs`
- Test: `src/config/__tests__/courseData.test.js`

- [ ] **Step 1: Run focused baseline tests**

```bash
npm test -- src/config/__tests__/courseData.test.js src/config/__tests__/glossaryData.test.js scripts/__tests__/generate-ai-index.test.js
```

Expected: PASS. If this fails before changes, record the failing test and fix only if it blocks this content work.

- [ ] **Step 2: Confirm content generation baseline**

```bash
npm run ai:index
npm run ai:publish
```

Expected: both commands complete and report generated AI artifacts.

### Task 2: Add Ethereum Smart Accounts Module

**Files:**
- Create: `zh/EthereumSmartAccounts/01_EthereumAfterPectra/README.md`
- Create: `zh/EthereumSmartAccounts/02_AccountAbstractionAndSmartWallets/README.md`
- Modify: `src/config/courseData.js`
- Modify: `src/features/badges/badgeData.js`
- Modify: `src/config/__tests__/courseData.test.js`
- Modify: `zh/README.md`

- [ ] **Step 1: Add the new module to course config test first**

Update `src/config/__tests__/courseData.test.js` so it expects 11 modules and verifies `module-11` has lesson paths under `EthereumSmartAccounts/`.

Run:

```bash
npm test -- src/config/__tests__/courseData.test.js
```

Expected: FAIL because `module-11` does not exist yet.

- [ ] **Step 2: Add course module configuration**

In `src/config/courseData.js`, import an appropriate icon from `lucide-react`, then append:

```js
{
  id: 'module-11',
  title: '以太坊与智能账户',
  icon: WalletCards,
  color: 'from-sky-400 to-blue-500',
  lessons: [
    {
      id: '11-1',
      title: 'Pectra 与 Fusaka 后的以太坊',
      path: 'EthereumSmartAccounts/01_EthereumAfterPectra',
      fallbackContent: FALLBACK,
    },
    {
      id: '11-2',
      title: '账户抽象与智能钱包',
      path: 'EthereumSmartAccounts/02_AccountAbstractionAndSmartWallets',
      fallbackContent: FALLBACK,
    },
  ],
}
```

Adjust the icon if `WalletCards` is unavailable in the installed `lucide-react` version by choosing an existing wallet/account icon exported by the package.

- [ ] **Step 3: Add module badge metadata**

In `src/features/badges/badgeData.js`, add a `module-11` badge with requirement `完成以太坊与智能账户的所有 2 个课程`.

- [ ] **Step 4: Write lesson 11-1**

Create `zh/EthereumSmartAccounts/01_EthereumAfterPectra/README.md` with these exact sections:

```markdown
# Pectra 与 Fusaka 后的以太坊

## 目录

- 为什么以太坊仍在升级
- 从 Dencun 到 Pectra 再到 Fusaka
- Pectra 改变了什么
- Fusaka 改变了什么
- 对普通用户的影响
- 对开发者的影响
- 对 L2 和 Rollup 的影响
- 学习检查清单
- 总结
- 延伸阅读
```

The lesson must explain EIP-7702, EIP-7251, blob target increase, PeerDAS, and why L2 fees depend on data availability.

- [ ] **Step 5: Write lesson 11-2**

Create `zh/EthereumSmartAccounts/02_AccountAbstractionAndSmartWallets/README.md` with these exact sections:

```markdown
# 账户抽象与智能钱包

## 目录

- 为什么普通钱包体验不好
- EOA、合约账户和智能账户
- ERC-4337 的工作流
- EIP-7702 带来的变化
- Paymaster、Bundler 和 Session Key
- Passkey 与社交恢复
- 智能账户的新风险
- 新手实践路线
- 学习检查清单
- 总结
- 延伸阅读
```

The lesson must explain UserOperation, EntryPoint, Bundler, Paymaster, Session Key, gas sponsorship, batch transactions, and EIP-7702 phishing risk.

- [ ] **Step 6: Update Chinese README**

Update `zh/README.md` so it no longer says only 27 lessons or 6 quick-start lessons. Add the new `以太坊与智能账户` module to the learning path.

- [ ] **Step 7: Verify module tests**

```bash
npm test -- src/config/__tests__/courseData.test.js
```

Expected: PASS.

### Task 3: Refresh Beginner Transaction And Tools Lessons

**Files:**
- Modify: `zh/Web3QuickStart/02_FirstWeb3Transaction/README.MD`
- Modify: `zh/Web3QuickStart/04_UsefulWeb3Sites/README.MD`
- Modify: `zh/Web3QuickStart/06_Web3Security/README.MD`

- [ ] **Step 1: Expand lesson 1-2**

Add sections covering transaction lifecycle, nonce, gas fields, transaction failure, L2 transactions, testnet hygiene, transaction simulation, and address verification.

- [ ] **Step 2: Rewrite lesson 1-4 as a 2026 tool map**

Replace thin tool descriptions with categories for block explorers, market data, DeFi analytics, L2 data, wallet safety, contract security, dev tooling, and research sources.

- [ ] **Step 3: Update lesson 1-6 for modern wallet risk**

Add sections for Permit/Permit2, blind signing, malicious approval, EIP-7702 authorization phishing, hardware wallet limits, address poisoning, and wallet compartmentalization.

- [ ] **Step 4: Run markdown availability check through AI index**

```bash
npm run ai:index
```

Expected: the generated output includes the new and modified lessons without read errors.

### Task 4: Refresh DeFi, Stablecoin, L2, And Bitcoin Operational Content

**Files:**
- Modify: `zh/DeFiDeepDive/04_Stablecoins/README.md`
- Modify: `zh/L2CrossChain/03_L2Ecosystem/README.md`
- Modify: `zh/GetStartedWithBitcoin/17_BitcoinLowFeeBroadcast/README.MD`

- [ ] **Step 1: Update stablecoin lesson**

Add 2025-2026 stablecoin regulation, GENIUS Act, MiCA timing, USDS/Sky, USDe risk model, RWA backing, and stablecoin payment rails.

- [ ] **Step 2: Update L2 ecosystem lesson**

Add Pectra/Fusaka context, blob economics, PeerDAS, OP Superchain, Base growth, ZK rollup tradeoffs, validium/alt-DA trust assumptions, and L2 risk framework.

- [ ] **Step 3: Update Bitcoin low-fee broadcast lesson**

Add Bitcoin Core 31.0 cluster mempool, package relay, private broadcast, `fee_rate` RPC usage, `settxfee` removal, and 0.1 sat/vB fee estimator bucket.

- [ ] **Step 4: Verify AI indexing**

```bash
npm run ai:index
npm run ai:publish
```

Expected: generated artifacts update cleanly.

### Task 5: Expand Glossary And Metadata

**Files:**
- Modify: `src/config/glossaryData.js`
- Modify: `src/config/__tests__/glossaryData.test.js`
- Modify: `AGENTS.md` if project architecture or commands change

- [ ] **Step 1: Add glossary coverage test first**

Update `src/config/__tests__/glossaryData.test.js` to require at least 40 glossary entries and categories for `账户抽象`, `Layer 2`, `稳定币`, `安全`.

Run:

```bash
npm test -- src/config/__tests__/glossaryData.test.js
```

Expected: FAIL until new terms are added.

- [ ] **Step 2: Add glossary terms**

Add at least these terms: `账户抽象`, `ERC-4337`, `EIP-7702`, `UserOperation`, `Bundler`, `Paymaster`, `Session Key`, `Passkey`, `Blob`, `PeerDAS`, `数据可用性`, `排序器`, `Intent`, `RWA`, `USDS`, `USDe`, `Restaking`, `MEV`, `Permit2`, `私有交易`.

- [ ] **Step 3: Run glossary tests**

```bash
npm test -- src/config/__tests__/glossaryData.test.js
```

Expected: PASS.

### Task 6: Final Verification

**Files:**
- Generated: `ai/manifest.json`
- Generated: `ai/content-index.json`
- Generated: `ai/llms.txt`
- Generated: `public/ai/manifest.json`
- Generated: `public/ai/content-index.json`
- Generated: `public/llms.txt`

- [ ] **Step 1: Run relevant test suite**

```bash
npm test -- src/config/__tests__/courseData.test.js src/config/__tests__/glossaryData.test.js scripts/__tests__/generate-ai-index.test.js scripts/__tests__/ai-content-core.test.js
```

Expected: PASS.

- [ ] **Step 2: Run content artifact workflow**

```bash
npm run ai:index
npm run ai:publish
npm run ai:verify
```

Expected: PASS.

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Expected: PASS.

- [ ] **Step 4: Review changed files**

```bash
git diff --stat
git diff -- src/config/courseData.js src/config/glossaryData.js src/config/__tests__/courseData.test.js src/config/__tests__/glossaryData.test.js
```

Expected: changes are scoped to planned content, config, tests, README, glossary, and generated AI artifacts.
