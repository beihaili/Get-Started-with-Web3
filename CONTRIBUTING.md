# 贡献指南

感谢你对 **Get Started with Web3** 项目的关注！我们欢迎所有形式的贡献。

## 如何参与

### 报告问题

如果你发现了 Bug 或有改进建议，请在 [GitHub Issues](https://github.com/beihaili/Get-Started-with-Web3/issues) 中提交：

1. 搜索现有 Issue，避免重复提交
2. 使用对应的 Issue 模板（Bug 报告 / 功能请求）
3. 尽可能提供详细的复现步骤和截图

### 提交代码

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feat/your-feature`
3. 提交更改（遵循提交规范）
4. 推送到你的 Fork：`git push origin feat/your-feature`
5. 创建 Pull Request

### 改进文档

- 修正教程中的错误或过时信息
- 补充代码示例和说明
- 改善行文的清晰度和准确性

### 翻译

- 我们正在从中文翻译到英文（`en/` 目录）
- 欢迎翻译现有教程或校对已有翻译

## 开发环境搭建

```bash
# 克隆仓库
git clone https://github.com/beihaili/Get-Started-with-Web3.git
cd Get-Started-with-Web3

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行测试
npm test

# 运行 lint 检查
npm run lint
```

## 分支与提交规范

### 分支命名

- `feat/xxx` — 新功能
- `fix/xxx` — Bug 修复
- `docs/xxx` — 文档改进
- `refactor/xxx` — 代码重构

### 提交信息

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>: <description>

[optional body]
```

常用 type：
- `feat` — 新功能
- `fix` — Bug 修复
- `docs` — 文档变更
- `style` — 代码样式（不影响功能）
- `refactor` — 重构
- `test` — 测试
- `chore` — 构建/工具变更

示例：
```
feat: add quiz for Bitcoin Script lesson
fix: correct image path in SegWit tutorial
docs: update README with new learning path
```

## 代码风格

- 使用 ESLint + Prettier 保持代码一致性
- 提交前会自动运行 lint-staged 检查
- 手动格式化：`npm run format`

## PR 流程

1. 确保代码通过所有测试：`npm test`
2. 确保没有 lint 错误：`npm run lint`
3. 填写 PR 模板中的所有必要信息
4. 等待 Code Review
5. 根据反馈进行修改
6. 合并后删除功能分支

## 教程内容规范

编写或修改教程时：

- 使用 Markdown 格式
- 每课放在独立的编号目录中（如 `01_FirstWeb3Identity/`）
- 主文件命名为 `README.MD`
- 代码示例放在 `code_examples/` 子目录
- 图片使用相对路径引用
- 中文内容放在 `zh/` 目录，英文放在 `en/` 目录

## 联系我们

- Twitter: [@bhbtc1337](https://twitter.com/bhbtc1337)
- GitHub Issues: [提交问题](https://github.com/beihaili/Get-Started-with-Web3/issues)
- 微信群：通过 Google Form 申请加入

## 致谢

感谢每一位贡献者！你的参与让 Web3 教育变得更好。
