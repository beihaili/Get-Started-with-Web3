# 🔐 GitHub Secrets 配置指南

为了安全地使用 Gemini AI 功能并启用自动部署，你需要在 GitHub 仓库中配置以下 Secrets 。

## 🚀 快速设置步骤

### 1. 获取 Gemini API Key

1. 访问 [Google AI Studio](https://aistudio.google.com/app/apikey)。
2. 登录你的 Google 账户。
3. 点击 「Create API Key」 创建新的 API 密钥。
4. 复制生成的 API Key（格式类似： `AIzaSyC...` ）。

### 2. 配置 GitHub Secrets

1. 访问你的 GitHub 仓库页面。
2. 点击 「Settings」 标签。
3. 在左侧菜单中选择 「Secrets and variables」 → 「Actions」。
4. 点击 「New repository secret」 添加以下密钥：

#### 必需的 Secrets ：

| Secret Name | 值 | 说明 |
|-------------|-----|-----|
| `GEMINI_API_KEY` | 你的 Gemini API Key | 用于 AI 功能，格式： AIzaSyC... |

#### 可选的 Secrets （有默认值）：

| Secret Name | 默认值 | 说明 |
|-------------|--------|-----|
| `GITHUB_USERNAME` | `beihaili` | GitHub 用户名 |
| `GITHUB_REPO` | `GetStartedWithWeb3` | 仓库名 |
| `GITHUB_BRANCH` | `main` | 分支名 |

## 📱 配置截图指南

### 添加 Secret 的步骤：

1. **导航到 Secrets 页面**
   ```
   你的仓库 → Settings → Secrets and variables → Actions
   ```

2. **点击 「New repository secret」**

3. **添加 GEMINI_API_KEY**
   - Name: `GEMINI_API_KEY`
   - Secret: 粘贴你的 Gemini API Key
   - 点击 「Add secret」

## 🔄 自动部署流程

配置完成后， GitHub Actions 将会：

1. **自动触发**：每次推送到 `main` 分支时。
2. **安全构建**：使用配置的 Secrets 构建应用。
3. **自动部署**：将构建结果部署到 GitHub Pages 。
4. **通知结果**：在 Actions 页面显示部署状态。

## 🏠 本地开发设置

对于本地开发，你需要：

1. 复制 `.env.example` 文件为 `.env.local` ：
   ```bash
   cp .env.example .env.local
   ```

2. 在 `.env.local` 中填入你的 API Key ：
   ```bash
   VITE_GEMINI_API_KEY=你的_API_Key_在这里
   ```

3. 启动开发服务器：
   ```bash
   npm run dev
   ```

## ⚠️ 安全注意事项

- ✅ **DO**: 将 API Keys 添加到 GitHub Secrets 。
- ✅ **DO**: 使用 `.env.local` 进行本地开发。
- ❌ **DON'T**: 将 API Keys 提交到代码仓库。
- ❌ **DON'T**: 在前端代码中硬编码敏感信息。
- ❌ **DON'T**: 分享或公开你的 API Keys 。

## 🔍 验证配置

配置完成后，你可以：

1. **检查 Actions 状态**：访问仓库的 Actions 页面。
2. **查看部署日志**：点击任意 workflow 查看详细日志。
3. **测试网站功能**：访问部署的网站测试 AI 功能。

## ❓ 常见问题

### Q: API Key 无效怎么办？
A: 确保 API Key 格式正确，并且在 Google AI Studio 中已启用。

### Q: 部署失败怎么办？
A: 检查 GitHub Actions 日志，通常是 Secrets 配置不正确。

### Q: 本地开发时 AI 功能不工作？
A: 确保 `.env.local` 文件存在并包含正确的 API Key。

### Q: 如何更新 API Key？
A: 在 GitHub Secrets 页面找到对应的 Secret ，点击编辑即可更新。

## 🎯 下一步

配置完成后，你就可以：
- 🚀 推送代码自动部署。
- 🤖 使用 AI 助教功能。  
- 🧠 体验智能测验系统。
- 📊 查看学习进度统计。

---

**提示**：首次配置可能需要几分钟生效。如有问题，请检查 GitHub Actions 日志或提 Issue 。
