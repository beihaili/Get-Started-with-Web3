> **README:** [English](README.md) | [中文](README.zh.md)
> **CONTRIBUTING:** [English](CONTRIBUTING.en.md) | [中文](CONTRIBUTING.md)

# 贡献指南

感谢你参与 **Get Started with Web3**。这个项目的目标是做成开源、双语、AI-native 的 Web3 学习平台。贡献不只包括写代码，也包括翻译、校对、课程资料、测验、术语表、社区传播和赞助线索。

## 5 分钟完成第一次贡献

1. Fork 本仓库。
2. 从 [Good First Issues Catalog](docs/community/good-first-issues.md) 选一个任务，或查看 GitHub 上的 [`good first issue`](https://github.com/beihaili/Get-Started-with-Web3/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)。
3. 克隆你的 fork：`git clone https://github.com/YOUR_USERNAME/Get-Started-with-Web3.git`
4. 创建分支：`git checkout -b fix/your-change`
5. 提交小而清晰的修改。
6. 本地运行对应验证命令。
7. Push 并打开 Pull Request。

不知道从哪里开始时，优先做英文校对、链接检查、术语补充、测验题或安全提示改进。这些任务最容易 review，也最能直接提升学习体验。

## 贡献路径

| 路径            | 适合做什么                                    | 推荐起点                                                      |
| --------------- | --------------------------------------------- | ------------------------------------------------------------- |
| 课程内容        | 修正过时信息、补来源、增加示例、改安全提示    | `zh/`、`en/` 下的 lesson README                               |
| 翻译与校对      | 中英文互译、术语统一、改善英文表达            | `en/Web3QuickStart/`、`en/DeFiDeepDive/`                      |
| Quiz / Glossary | 添加测验题、术语解释、模块练习                | `src/features/quiz/quizData.js`、`src/config/glossaryData.js` |
| 产品体验        | 修 UI、可访问性、移动端、搜索、AI Tutor 体验  | `src/` 下对应组件和测试                                       |
| AI-native       | 改进 `llms.txt`、AI manifest、MCP 和引用质量  | `ai/`、`public/ai/`、`scripts/`                               |
| 增长与社区      | awesome-list 投稿、社区帖、赞助研究、案例传播 | `docs/strategy/`、`docs/community/`                           |

更多长期协作方式见 [Contributor Ladder](docs/community/contributor-ladder.md)。

## 开发环境

```bash
git clone https://github.com/beihaili/Get-Started-with-Web3.git
cd Get-Started-with-Web3
npm install
npm run dev
```

常用命令：

```bash
npm test          # 全量 Vitest
npm run lint      # ESLint
npm run build     # 生产构建、OG、sitemap、prerender
npm run ai:verify # 验证公开 AI entrypoints 和 x402 元数据
```

## 验证矩阵

| 修改类型                  | 至少运行                                                      |
| ------------------------- | ------------------------------------------------------------- |
| 只改 Markdown 文档        | `npx prettier --check <changed-files>`                        |
| 新增或移动课程            | `npm run ai:index && npm run ai:publish && npm run ai:verify` |
| 修改术语表                | `npm test -- src/config/__tests__/glossaryData.test.js`       |
| 修改 quiz 或课程配置      | `npm test`                                                    |
| 修改 React/UI/脚本        | `npm test && npm run lint`                                    |
| 修改 SEO、sitemap、预渲染 | `npm test && npm run build`                                   |
| 修改 AI-native/MCP 层     | `npm test && npm run ai:verify`                               |

如果你无法运行某个命令，请在 PR 中说明原因和你已经完成的检查。

## 内容质量要求

- 面向初学者解释，不假设读者已经懂钱包、Gas、签名、桥或 DeFi 风险。
- 涉及协议机制、安全风险、链上操作或市场结构时，尽量引用可信来源。
- 不写投资建议、收益承诺、代币喊单或无披露的推广内容。
- 中英文术语保持一致；不确定时在 PR 中说明你的选择。
- 新增图片或图表时使用相对路径，并提供 alt text。

## 分支与提交规范

分支命名：

- `feat/xxx`：新功能
- `fix/xxx`：Bug 修复
- `docs/xxx`：文档改进
- `content/xxx`：课程内容改进

提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

```text
<type>: <description>
```

示例：

```text
docs: improve DeFi risk explanation
fix: correct SegWit image path
feat: add smart account glossary terms
```

## PR 流程

1. 保持 PR 小而聚焦。
2. 在 PR 描述里写清楚影响的语言、模块、lesson 或页面。
3. 勾选实际运行过的验证命令。
4. UI 修改提供截图；内容修改提供来源或说明。
5. 根据 review 反馈修改。
6. 合并后可继续挑选下一条 starter issue。

## 维护者响应

Starter PR 在维护者活跃时目标是 72 小时内给出初次响应。大型内容或产品改动可能需要更多上下文，请先开 issue 讨论范围。

## 联系

- Twitter/X: [@bhbtc1337](https://twitter.com/bhbtc1337)
- GitHub Issues: [提交问题](https://github.com/beihaili/Get-Started-with-Web3/issues)
- WeChat group: 通过 Google Form 申请加入
