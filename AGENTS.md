# Get Started with Web3 Agent Notes

默认用中文交流。错误信息可保留英文，分析和说明尽量用中文。

## 项目定位

这是一个 Web3 学习平台，包含 Markdown 教程内容、React SPA、AI Tutor、徽章系统、SEO 构建脚本、捐赠/赞助配置，以及面向 AI Agent 的只读内容接口。当前主课程由 `src/config/courseData.js` 驱动，覆盖 Web3 快速入门、比特币技术、以太坊与智能账户、Web3 Builder、DeFi、Layer 2/跨链、DAO 等模块。

## CEO 运营目标

项目当前运营目标是把 Get Started with Web3 做成具备持续增长、持续运营和收入能力的开源 Web3 学习平台。核心里程碑是达到 1000 GitHub stars，并让项目同时提升 beihai 的个人影响力。

运营文档：

- `docs/strategy/2026-05-14-ceo-operating-system.md`: CEO 操作系统，包含使命、北极星指标、增长闭环、变现模型、30/60/90 天路线图和外部动作审批边界。
- `docs/strategy/2026-05-14-execution-board.md`: 执行看板，包含 KPI、工作流、前 10 个任务、内容发布队列和赞助线索。
- `docs/strategy/2026-05-14-sponsor-kit.md`: 赞助包草案，包含受众、价格、曝光权益、接受政策和月度汇报指标。
- `docs/strategy/2026-05-14-sponsor-outreach-drafts.md`: 赞助外联话术草案；常规外联可自主执行，高风险赞助对象仍需单独确认。
- `docs/strategy/2026-05-15-sponsor-leads-tracker.md`: 具名赞助/资助线索 tracker，记录公开来源、fit score、建议外联角度、渠道、状态和风险边界；发送外联后必须同步每日运营汇报。
- `docs/strategy/2026-05-14-awesome-list-submissions.md`: awesome-list 和社区分发追踪，包含定位文案、目标列表、PR 模板和中文社区帖草案。
- `docs/community/contributor-ladder.md`: 贡献者成长路径，定义 first-time contributor、repeat contributor、reviewer、module steward 和 community/sponsor ally。
- `docs/community/good-first-issues.md`: 可复制到 GitHub Issues 的 starter issue 清单，包含标签、背景、验收标准和验证方式。
- `docs/operations/`: 每日运营汇报目录；`README.md` 定义 cadence、数据源和风险边界，`templates/daily-report-template.md` 是每日汇报模板，按 `YYYY-MM-DD-daily-report.md` 记录实际进展、指标、部署、外部分发、赞助线索和下一步。

社区入口：

- `CONTRIBUTING.md` / `CONTRIBUTING.en.md`: 双语贡献指南，维护贡献路径、验证矩阵和内容质量标准。
- `.github/ISSUE_TEMPLATE/`: Bug、feature、content/translation、growth/community 分流模板。
- `.github/PULL_REQUEST_TEMPLATE.md`: PR 验证和内容安全检查清单。
- `.github/workflows/deploy.yml`: PR 构建会上传 `dist` artifact，并用固定 marker 更新同一条 PR 评论，方便评审者从 Actions run 下载构建产物；合并到 `main` 后才部署 GitHub Pages。

工作边界：

- 可直接修改仓库内的战略文档、roadmap、运营文案、issue 模板和增长相关代码。
- beihai 已授权 Codex 自主批准并执行常规外部动作，包括发起增长文案草稿、联系赞助商、修改 GitHub repo 描述/topics、推送工作分支、创建 PR 和发布项目运营材料；执行后在每日汇报中留痕。
- 高风险或不可逆动作仍需单独确认：修改收款地址、接受高风险金融/交易类赞助、删除仓库、私有化仓库、转移仓库所有权、泄露 secrets、绕过安全检查、直接推送 `main` 导致生产发布。

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
- `scripts/sync-content.mjs`: 将中英文课程内容复制到 `public/content/`，为英文课程补齐对应中文课程中存在但英文目录缺失的本地图片资产，并生成 `public/content/image-metadata.json`，供课程图片渲染时补充 `width` / `height`。
- `scripts/check-translation-coverage.mjs`: 非阻塞检查 `zh/` 中缺失的英文翻译，支持 `README.md` 和 `README.MD` 两种文件名。
- `scripts/ai-content-core.mjs`: 搜索、读取课程、生成学习路径、组合上下文等纯函数。

修改课程结构、术语表或 Agent 工具元数据后，运行 `npm run ai:index && npm run ai:publish && npm run ai:verify`，并提交更新后的 `ai/` 与 `public/` artifacts。

## 国际化与命名空间

- UI 文案按页面/功能拆分在 `src/i18n/locales/{en,zh}/{section}.json`。保留 `t('section.key')` 调用方式，不要改成多 namespace 的 `t` 调用。
- `common` 和 `nav` 由 `src/i18n/index.js` eager load；路由级文案由 `src/i18n/namespaceLoaders.js` 和 `src/i18n/useI18nSections.js` 按需加载，搜索弹窗在打开时加载 `search` section。
- 新增页面或新的懒加载 UI 区块时，同步补齐中英文 section 文件，并更新 `getRouteI18nSections()` 的路由映射；namespace 加载失败必须保留 `console.warn` 级别告警。
- 修改 i18n 结构后优先跑 `npx vitest run src/i18n/__tests__/i18n.test.js`，完成前仍需跑 `npm test`、`npm run lint` 和 `npm run build`。

## 样式构建

- 本项目使用 Tailwind CSS v4。`src/index.css` 必须使用 `@import 'tailwindcss';`，并通过 `@config '../tailwind.config.js';` 显式加载现有配置；不要改回 v3 的 `@tailwind base/components/utilities` 指令，否则生产 CSS 会缺失颜色、间距和字体等主题 utility。
- 暗色模式由 `html.dark` 驱动，`src/index.css` 中的 `@custom-variant dark (&:where(.dark, .dark *));` 需要保留，避免 `dark:*` 变体退回到系统媒体查询。
- 修改 Tailwind / CSS 入口后，除 `npm run build` 外，还要用浏览器截图确认至少一个核心页面的按钮、背景、间距和暗色模式真实生效。

## 学习进度导入/导出

- `src/components/ProgressExport.jsx`: Dashboard 概览区的学习进度 JSON 导出按钮，所有文案走 `dashboard.*` i18n key。
- `src/components/ProgressImport.jsx`: Dashboard 概览区的学习进度 JSON 导入按钮，负责文件选择、错误提示，以及本地已有进度时的替换/合并/取消对话框。
- `src/utils/progressExport.js`: 导出 schema 与浏览器下载逻辑，当前 payload 为 `{ version, exportedAt, data }`，`data` 只包含 `useUserStore` 中的非敏感学习进度字段。
- `src/utils/mergeProgress.js`: 导入 schema 校验、进度归一化和纯合并逻辑；合并规则需保持可测试，避免在 UI 组件里写业务合并逻辑。

## Reader 移动端体验

- `src/pages/ReaderPage.jsx`: 移动端课程阅读页包含课程列表 drawer、上/下一课按钮和左右滑动切课。桌面布局应保持稳定，不要把移动 drawer 变成桌面默认侧栏。
- `src/hooks/useSwipe.js`: 共享水平滑动检测 hook；默认阈值为 80px，纵向位移大于横向时忽略，并忽略从 `pre` / `code` / `[data-swipe-ignore]` 内开始的手势，避免破坏代码块横向滚动。
- 修改 Reader 移动端交互后，优先跑 `npx vitest run src/hooks/__tests__/useSwipe.test.jsx src/pages/__tests__/ReaderPage.mobile.test.jsx`，并用移动视口做一次浏览器 smoke。

## 测验题库

- `src/features/quiz/quizData.js`: 每个 lesson id 对应 5 道选择题；顶层 `question`、`options`、`explanation` 是中文默认内容。
- `src/features/quiz/MultiQuiz.jsx`: 渲染时会按当前 i18n 语言读取可选 `translations.<lang>` 字段；缺失时回退到顶层中文内容。新增英文题面时优先补 `translations.en.question`、`translations.en.options` 和 `translations.en.explanation`，不要改变 `lessonId` / `onPass` 接口。
- `src/features/quiz/__tests__/quizData.test.js`: 维护题库结构、题数、重复题和重点课程本地化断言。新增 quiz 数据结构约定时先补测试。

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
- 英文课程 README 可以复用对应中文课程目录下的本地图片；`npm run sync-content` 会按 README 中的本地图片引用补齐缺失英文发布资产。若英文课程需要不同图片，直接放到 `en/` 对应目录，脚本不会覆盖已有英文图片。
- 新增术语时，更新 `src/config/glossaryData.js` 和对应测试，保持 `GLOSSARY_CATEGORIES` 与测试允许分类一致，再运行 `npm run ai:index`。
- MCP 工具必须保持只读，返回结果需包含可引用的 `citation.file` 或 URL。
- 修改代码后至少运行相关 Vitest；完成前运行 `npm test` 和 `npm run lint`。
