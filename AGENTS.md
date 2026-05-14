# Get Started with Web3 Agent Notes

默认用中文交流。错误信息可保留英文，分析和说明尽量用中文。

## 项目定位

这是一个 Web3 学习平台，包含 Markdown 教程内容、React SPA、AI Tutor、徽章系统、SEO 构建脚本、捐赠/赞助配置，以及面向 AI Agent 的只读内容接口。当前主课程由 `src/config/courseData.js` 驱动，覆盖 Web3 快速入门、比特币技术、以太坊与智能账户、Web3 Builder、DeFi、Layer 2/跨链、DAO 等模块。

## CEO 运营目标

项目当前运营目标是把 Get Started with Web3 做成具备持续增长、持续运营和收入能力的开源 Web3 学习平台。核心里程碑是达到 1000 GitHub stars，并让项目同时提升 beihai 的个人影响力。

运营文档：

- `docs/strategy/2026-05-14-ceo-operating-system.md`: CEO 操作系统，包含使命、北极星指标、增长闭环、变现模型、30/60/90 天路线图和外部动作审批边界。
- `docs/strategy/2026-05-14-execution-board.md`: 执行看板，包含 KPI、工作流、前 10 个任务、内容发布队列和赞助线索。

工作边界：

- 可直接修改仓库内的战略文档、roadmap、运营文案、issue 模板和增长相关代码。
- 发 Twitter/X、联系赞助商、修改 GitHub repo settings、合并 PR、推送 `main`、发布 release、变更收款地址或添加赞助商 logo 前必须先让 beihai 确认。

## 常用命令

```bash
npm run dev             # 本地开发
npm run build           # 生产构建
npm test                # 全量测试
npm run lint            # ESLint 检查
npm run ai:index        # 生成 AI-native 内容索引
npm run ai:publish      # 复制 AI artifacts 到 public/，供 GitHub Pages 发布
npm run ai:verify       # 验证公开 AI 入口、MCP 工具清单和 x402 元数据
npm run mcp:web3        # 启动本地 stdio MCP server
```

## AI-Native 内容层

- `ai/manifest.json`: 服务清单，包含仓库信息、artifact 路径、MCP 命令和未来 x402 工具元数据。
- `ai/content-index.json`: 双语课程和术语表索引，供 Agent 搜索、引用和组合上下文。
- `ai/llms.txt`: 面向 Agent/crawler 的文本入口。
- `public/llms.txt`: GitHub Pages 根路径公开入口，部署后为 `https://beihaili.github.io/Get-Started-with-Web3/llms.txt`。
- `public/ai/manifest.json`: 部署后为 `https://beihaili.github.io/Get-Started-with-Web3/ai/manifest.json`。
- `public/ai/content-index.json`: 部署后为 `https://beihaili.github.io/Get-Started-with-Web3/ai/content-index.json`。
- `scripts/generate-ai-index.mjs`: 生成上述 artifact。
- `scripts/publish-ai-artifacts.mjs`: 将根目录 `ai/` artifacts 复制到 `public/`。
- `scripts/verify-ai-entrypoints.mjs`: 检查 artifacts、公开 URL、MCP 工具清单、中英文覆盖和 x402 元数据。
- `scripts/check-translation-coverage.mjs`: 非阻塞检查 `zh/` 中缺失的英文翻译，支持 `README.md` 和 `README.MD` 两种文件名。
- `scripts/ai-content-core.mjs`: 搜索、读取课程、生成学习路径、组合上下文等纯函数。

修改课程结构、术语表或 Agent 工具元数据后，运行 `npm run ai:index && npm run ai:publish && npm run ai:verify`，并提交更新后的 `ai/` 与 `public/` artifacts。

## MCP Server

`scripts/web3-mcp-server.mjs` 使用官方 `@modelcontextprotocol/sdk` 暴露本地 stdio MCP server。该 server 是只读的，不应写文件、修改课程内容或执行链上操作。

当前工具：

- `search_web3_content`
- `read_web3_lesson`
- `get_learning_path`
- `lookup_web3_glossary`
- `compose_web3_context`
- `list_monetizable_tools`

当前资源：

- `web3://manifest`
- `web3://content-index`

当前 prompts：

- `web3_lesson_tutor`
- `web3_builder_plan`

## x402 预留

本地 MCP server 不执行 x402 支付验证或结算。未来付费能力只通过 `manifest.tools[].x402` 元数据预留，包括 `enabled`、`priceUsd`、`network` 和 `route`。

## 引用规范

Agent 使用 MCP 工具回答时，应优先引用工具返回的 `citation.file`、`citation.githubUrl` 和 `citation.siteUrl`。如果组合多段上下文，使用 `compose_web3_context` 的 `citations` 列表作为来源清单。不要把本地 MCP 的 x402 元数据描述成已经启用的收费能力。

## 修改注意

- 新增或移动课程时，先更新 `src/config/courseData.js`，必要时同步 `src/features/badges/badgeData.js` 和 `zh/README.md`，再运行 `npm run ai:index`。
- 新增术语时，更新 `src/config/glossaryData.js` 和对应测试，保持 `GLOSSARY_CATEGORIES` 与测试允许分类一致，再运行 `npm run ai:index`。
- MCP 工具必须保持只读，返回结果需包含可引用的 `citation.file` 或 URL。
- 修改代码后至少运行相关 Vitest；完成前运行 `npm test` 和 `npm run lint`。
