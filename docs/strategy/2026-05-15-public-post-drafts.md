# Public Post Drafts

**Date:** 2026-05-15
**Owner:** beihai + Codex
**Status:** Ready for publishing; GitHub release published on 2026-05-18

## Publishing Rules

- Do not make financial advice, trading claims, token recommendations, or sponsored claims.
- Always include one concrete learner outcome and one canonical project link.
- Record any published link, channel, date, and visible engagement metric in this file.
- Reuse drafts across channels only after adapting length, tone, and community norms.

## Draft 1: Chinese Web3 Community

**Target channel:** Chinese Web3 learning communities, learnblockchain.cn community, WeChat groups, Telegram groups.
**Audience:** Chinese-speaking beginners and builders who want a structured, safer Web3 learning path.
**Concrete learner outcome:** A newcomer can complete a first learning path from wallet identity to first DApp, then understand the basics of Bitcoin, Ethereum, DeFi, Layer 2, DAO, and smart accounts without relying on fragmented links.
**Status:** Drafted, not published.

```markdown
我在持续维护一个开源 Web3 学习项目：Get Started with Web3。

它已经从早期教程仓库升级成一个双语、AI-native 的 Web3 学习平台，适合想系统入门的新人和准备动手做项目的 builder。

你可以按路线完成一个具体目标：从创建第一个 Web3 身份、体验第一笔交易和第一个 DApp 开始，再继续学习 Bitcoin、Ethereum、DeFi、Layer 2、DAO、智能账户和 Builder 实战。项目也提供搜索、测验、徽章、AI Tutor、术语表、llms.txt、内容索引和本地只读 MCP server，方便人和 AI agent 都能引用课程内容。

在线学习：https://beihaili.github.io/Get-Started-with-Web3/

如果你正在学 Web3，欢迎 star、提 issue、校对翻译或补充安全提示。项目会继续公开迭代，不做交易建议，也不推广任何 token。
```

## Draft 2: X / Farcaster Thread

**Target channel:** Twitter/X and Farcaster.
**Audience:** English-speaking Web3 learners, builders, and AI-agent developers.
**Concrete learner outcome:** A learner or agent can follow a cited path through 58 lessons and retrieve curriculum context through `llms.txt` or the read-only MCP server.
**Status:** Backup draft, not published.

```markdown
1/ I am turning Get Started with Web3 into an open-source, bilingual, AI-native Web3 curriculum.

It now covers wallets, first transactions, Bitcoin, Ethereum, DeFi, Layer 2, DAO, smart accounts, builder labs, security basics, and glossary entries.

2/ The concrete learner outcome:

Start from creating your first Web3 identity and using your first DApp, then follow a structured path toward understanding Bitcoin, Ethereum, DeFi, L2s, DAOs, and account abstraction.

3/ The AI-native layer is part of the product:

- llms.txt
- AI manifest
- content index
- local read-only MCP server
- citation-ready context packs

This helps AI tutors and coding agents search and cite the curriculum instead of guessing.

4/ Live site:
https://beihaili.github.io/Get-Started-with-Web3/

Repo:
https://github.com/beihaili/Get-Started-with-Web3

Open to contributors for translations, source links, safety notes, examples, and beginner-friendly issue fixes.
```

## Draft 3: Interactive Learning Update

**Target channel:** Twitter/X, Farcaster, GitHub social preview, Chinese Web3 communities.
**Audience:** Web3 learners, educators, open-source builders, and AI-agent developers.
**Concrete learner outcome:** A learner can manipulate two core Web3 concepts directly: Bitcoin Merkle roots and EIP-1559 gas-fee estimation.
**Status:** GitHub Release published; social/community posts ready.
**Canonical release:** https://github.com/beihaili/Get-Started-with-Web3/releases/tag/interactive-learning-2026-05-18

### X / Farcaster Thread

```markdown
1/ New Get Started with Web3 update:

The curriculum now has two hands-on interactive lessons:

- Bitcoin Merkle Tree Builder
- EIP-1559 Gas Fee Calculator

Instead of only reading about the concepts, learners can manipulate them directly.

2/ Merkle Tree Builder:

Type transaction-like values, hash leaves with SHA-256, duplicate odd nodes, combine pairs, and inspect the Merkle root step by step.

Lesson:
https://beihaili.github.io/Get-Started-with-Web3/en/learn/module-2/2-1

3/ Gas Fee Calculator:

Change gas limit, priority tip, and max fee cap to see how EIP-1559 turns them into an effective gas price and total ETH/USD estimate.

Lesson:
https://beihaili.github.io/Get-Started-with-Web3/en/learn/module-11/11-2

4/ Both are bilingual, tested, and available in the open-source repo.

The broader goal is to turn a Web3 notes repo into a safer, AI-native learning platform: lessons, quizzes, badges, llms.txt, content index, and a read-only MCP server.

Release:
https://github.com/beihaili/Get-Started-with-Web3/releases/tag/interactive-learning-2026-05-18
```

### Chinese Community Post

```markdown
Get Started with Web3 今天更新了两个互动学习组件：

1. Bitcoin Merkle Tree Builder：输入交易内容，逐层计算 SHA-256 hash，观察奇数节点复制、父节点组合和 Merkle Root 生成过程。
2. EIP-1559 Gas Fee Calculator：修改 Gas 上限、优先小费和最大费用上限，直接看到有效 Gas 价格、ETH 成本和美元估算。

这两个组件都已经嵌入中英文课程，并有测试覆盖。目标是让 Web3 学习从“读概念”继续往“能动手理解概念”推进。

在线学习：
https://beihaili.github.io/Get-Started-with-Web3/zh

Release：
https://github.com/beihaili/Get-Started-with-Web3/releases/tag/interactive-learning-2026-05-18

项目不会提供交易建议，也不推广任何 token。如果你正在系统学习 Web3，欢迎 star、提 issue、校对翻译或补充代码示例。
```

### Short Single-Post Version

```markdown
Get Started with Web3 now has two interactive lessons:

- Bitcoin Merkle Tree Builder
- EIP-1559 Gas Fee Calculator

The direction is simple: make Web3 concepts learnable by manipulating them, not only reading about them.

Release: https://github.com/beihaili/Get-Started-with-Web3/releases/tag/interactive-learning-2026-05-18
Site: https://beihaili.github.io/Get-Started-with-Web3/
```

## Publication Log

| Date       | Channel        | Link                                                                                           | Status    | Visible Metrics          | Notes                                                                   |
| ---------- | -------------- | ---------------------------------------------------------------------------------------------- | --------- | ------------------------ | ----------------------------------------------------------------------- |
| 2026-05-18 | GitHub Release | https://github.com/beihaili/Get-Started-with-Web3/releases/tag/interactive-learning-2026-05-18 | Published | 614 stars at publication | Product update for Merkle Tree Builder and EIP-1559 Gas Fee Calculator. |
