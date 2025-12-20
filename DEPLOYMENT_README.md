# 🚀 自动化部署系统

本项目已升级为使用 GitHub Actions 进行自动化部署的现代化 React Web3 学习平台。

## ✨ 新特性

### 🔐 安全的 API 密钥管理
- 使用 GitHub Secrets 安全存储 Gemini API Key 。
- 支持环境变量配置。
- 前端不再硬编码敏感信息。

### 🤖 自动化部署流程
- 推送到 main 分支自动部署。
- Pull Request 自动构建预览。
- 部署成功 / 失败通知。
- 无需手动运行部署命令。

### 🎯 优化的开发体验
- 本地开发使用 `.env.local` 。
- 生产环境使用 GitHub Secrets 。
- 热重载开发服务器。
- 统一的构建流程。

## 📦 快速开始

### 1. 本地开发设置

```bash
# 克隆仓库
git clone https://github.com/beihaili/GetStartedWithWeb3.git
cd GetStartedWithWeb3

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 并添加你的 Gemini API Key
# 启动开发服务器
npm run dev
```

### 2. 生产环境部署

1. **配置 GitHub Secrets**（必需）
   - 按照 [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md) 配置。
   
2. **推送代码自动部署**
   ```bash
   git add .
   git commit -m "feat: 添加新功能"
   git push origin main
   ```

## 🗂 项目结构

```
GetStartedWithWeb3/
├── .github/workflows/     # GitHub Actions 配置
│   └── deploy.yml        # 自动部署工作流
├── src/                  # React 源码
│   ├── App.jsx          # 主应用组件
│   ├── main.jsx         # React 入口
│   └── index.css        # 全局样式
├── zh/                   # 中文教程内容
├── en/                   # 英文教程内容
├── .env.example         # 环境变量模板
├── .env.local           # 本地环境变量（不提交）
├── vite.config.js       # Vite 构建配置
├── tailwind.config.js   # Tailwind CSS 配置
└── package.json         # 项目配置
```

## 🛠 可用命令

| 命令 | 功能 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览构建结果 |
| `npm run deploy` | 手动部署（不推荐） |

## 🔄 部署流程

### 自动部署（推荐）

1. **推送触发**：推送到 main 分支。
2. **环境准备**： GitHub Actions 设置 Node.js 环境。
3. **依赖安装**：自动安装项目依赖。
4. **应用构建**：使用 Secrets 中的环境变量构建。
5. **部署上线**：自动部署到 GitHub Pages 。

### 手动部署（备用）

```bash
npm run deploy
```

## 🌐 访问地址

- **生产环境**： https://beihaili.github.io/GetStartedWithWeb3/
- **开发环境**： http://localhost:5173/GetStartedWithWeb3/

## 📱 功能特性

### 🎨 用户界面
- 赛博朋克风格设计。
- 响应式布局。
- 深色主题。
- 霓虹效果和动画。

### 🔗 Web3 功能
- 钱包连接模拟。
- 链上进度存储。
- Web3 每日预言机。
- 哈希可视化工具。

### 🤖 AI 助手
- Gemini AI 智能问答。
- 自动生成测验。
- 个性化学习建议。
- 上下文相关帮助。

### 📚 内容管理
- 从 GitHub 动态加载教程。
- Markdown 渲染。
- 图片自动处理。
- 多语言支持。

## 🔧 环境变量说明

### 必需变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `VITE_GEMINI_API_KEY` | Gemini AI API 密钥 | `AIzaSyC...` |

### 可选变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `VITE_GITHUB_USERNAME` | `beihaili` | GitHub 用户名 |
| `VITE_GITHUB_REPO` | `GetStartedWithWeb3` | 仓库名 |
| `VITE_GITHUB_BRANCH` | `main` | 分支名 |

## 🔍 故障排除

### 构建失败

1. 检查 GitHub Secrets 是否正确配置。
2. 确认 API Key 格式正确。
3. 查看 GitHub Actions 日志。

### 本地开发问题

1. 确认 `.env.local` 文件存在。
2. 验证 API Key 有效性。
3. 清除浏览器缓存。

### 部署问题

1. 检查 GitHub Pages 设置。
2. 确认仓库 base 路径正确。
3. 验证工作流权限。

## 🚀 性能优化

- **代码分割**：按需加载组件。
- **图片优化**：自动压缩和懒加载。
- **缓存策略**：浏览器缓存和 CDN 。
- **构建优化**： Tree shaking 和压缩。

## 📈 监控指标

- **构建时间**：通常 < 2 分钟。
- **包大小**：主包 < 300KB 。
- **加载性能**：首屏 < 3 秒。
- **API 响应**：< 2 秒。

## 🤝 贡献指南

1. Fork 项目。
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)。
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)。
4. 推送分支 (`git push origin feature/AmazingFeature`)。
5. 创建 Pull Request 。

## 📄 许可证

本项目采用开源许可证。详情请查看 [LICENSE](LICENSE) 文件。

---

**🎯 目标**：打造最好的 Web3 学习平台，让每个人都能轻松入门区块链技术！
