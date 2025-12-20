# 🌐 Multi-Language Guide | 多语言指南

This document explains how the multi-language system works and how to contribute translations.

本文档说明多语言系统的工作原理以及如何贡献翻译。

## 🏗️ Project Structure | 项目结构

```
/
├── index.html                 # Language selection homepage | 语言选择首页
├── _config.yml               # GitHub Pages configuration | GitHub Pages 配置
├── zh/                       # Chinese version | 中文版本
│   ├── README.md
│   ├── SUMMARY.md
│   ├── book.json
│   └── GetStartedWithBitcoin/
├── en/                       # English version | 英文版本
│   ├── README.md
│   ├── SUMMARY.md
│   ├── book.json
│   └── GetStartedWithBitcoin/
└── assets/                   # Shared resources | 共享资源
```

## 🌍 Supported Languages | 支持的语言

- 🇨🇳 **中文 (Chinese)**: `/zh/` —— Complete version | 完整版本。
- 🇺🇸 **English**: `/en/` —— Partial translation | 部分翻译。

## 🚀 How It Works | 工作原理

### 1. Language Detection | 语言检测

The homepage (`index.html`) includes smart language detection:
首页 (`index.html`) 包含智能语言检测：

- Detects browser language preference | 检测浏览器语言偏好。
- Remembers user's previous choice | 记住用户之前的选择。
- Provides manual language selection | 提供手动语言选择。

### 2. URL Structure | URL 结构

- **Homepage | 首页**: `https://yoursite.com/`
- **Chinese | 中文**: `https://yoursite.com/zh/`
- **English | 英文**: `https://yoursite.com/en/`

### 3. GitHub Pages Integration | GitHub Pages 集成

The site uses GitHub Pages with Jekyll for hosting:
网站使用 GitHub Pages 和 Jekyll 进行托管：

- Automatic deployment on push | 推送时自动部署。
- Custom domain support | 自定义域名支持。
- SSL certificate included | 包含 SSL 证书。

## 📝 Translation Guidelines | 翻译指南

### For Contributors | 贡献者指南

#### 1. Translation Priorities | 翻译优先级

**High Priority | 高优先级：**
- Main README files | 主要 README 文件。
- Chapter 1-3 (Foundation) | 第 1-3 章（基础）。
- Navigation and UI text | 导航和 UI 文本。

**Medium Priority | 中优先级：**
- Chapter 4-11 (Intermediate) | 第 4-11 章（中级）。
- Code comments | 代码注释。
- Error messages | 错误信息。

**Low Priority | 低优先级：**
- Advanced chapters | 高级章节。
- Technical specifications | 技术规范。

#### 2. Style Guide | 风格指南

**English Translation | 英文翻译：**
- Use simple, clear language | 使用简单、清晰的语言。
- Maintain technical accuracy | 保持技术准确性。
- Keep the conversational tone | 保持对话式语调。
- Preserve analogies and metaphors | 保留类比和比喻。

**Example Translation | 翻译示例：**
```
中文: 想象哈希函数就像一台"做香肠的机器"
English: Imagine a hash function like a "sausage-making machine"

中文: 比特币网络就像一个理想村庄
English: The Bitcoin network is like an ideal village
```

#### 3. File Organization | 文件组织

When translating a chapter | 翻译章节时：

1. Create corresponding directory structure | 创建相应的目录结构。
2. Copy code files without changes | 复制代码文件不做修改。
3. Translate README.md files | 翻译 README.md 文件。
4. Update navigation links | 更新导航链接。

### 4. Technical Considerations | 技术考虑

**Code Examples | 代码示例：**
- Keep code unchanged | 保持代码不变。
- Translate only comments | 仅翻译注释。
- Update print statements to English | 更新打印语句为英文。

**Links and References | 链接和引用：**
- Update internal links to match new structure | 更新内部链接以匹配新结构。
- Keep external links unchanged | 保持外部链接不变。
- Translate image alt text | 翻译图片 alt 文本。

## 🛠️ Development Setup | 开发设置

### Local Development | 本地开发

1. **Clone the repository | 克隆仓库：**
   ```bash
   git clone https://github.com/beihaili/Get-Started-with-Web3.git
   cd Get-Started-with-Web3
   ```

2. **Serve locally | 本地服务：**
   ```bash
   # For GitHub Pages
   bundle exec jekyll serve
   
   # Simple HTTP server
   python -m http.server 8000
   ```

3. **Test multi-language | 测试多语言：**
   - Visit `http://localhost:8000/`
   - Test language switching
   - Verify all links work

### Deployment | 部署

Use the provided script | 使用提供的脚本：
```bash
./deploy-multilingual.sh
```

Or deploy manually | 或手动部署：
```bash
git add .
git commit -m "Update translations"
git push origin main
```

## 🤝 Contributing Translations | 贡献翻译

### Getting Started | 开始贡献

1. **Fork the repository | Fork 仓库**
2. **Create a new branch | 创建新分支：**
   ```bash
   git checkout -b translate-chapter-X
   ```
3. **Translate content | 翻译内容**
4. **Test locally | 本地测试**
5. **Submit pull request | 提交拉取请求**

### Pull Request Guidelines | PR 指南

**Title Format | 标题格式：**
```
🌐 Translate Chapter X: [Title] to English
```

**Description Template | 描述模板：**
```markdown
## Translation Summary
- Chapter/Section: [Name]
- Language: Chinese → English
- Word Count: ~[number] words

## Changes
- [ ] Translated main content
- [ ] Updated code comments
- [ ] Fixed internal links
- [ ] Tested locally

## Notes
[Any special considerations or questions]
```

## 📊 Translation Progress | 翻译进度

### Current Status | 当前状态

| Chapter | Chinese | English | Status |
|---------|---------|---------|---------|
| Homepage | ✅ | ✅ | Complete |
| Chapter 01 | ✅ | ⏳ | In Progress |
| Chapter 02 | ✅ | ⏳ | Planned |
| Chapter 11 | ✅ | ✅ | Complete |
| ... | ✅ | ❌ | Not Started |

### Legend | 图例
- ✅ Complete | 完成
- ⏳ In Progress | 进行中
- ❌ Not Started | 未开始

## 🔧 Technical Details | 技术细节

### File Naming | 文件命名
- Keep original file names | 保持原始文件名。
- Use same directory structure | 使用相同目录结构。
- Maintain case sensitivity | 保持大小写敏感。

### Encoding | 编码
- All files must be UTF-8 | 所有文件必须为 UTF-8 。
- Use LF line endings | 使用 LF 行结束符。

### Images and Assets | 图片和资源
- Share images between languages | 在语言间共享图片。
- Use relative paths | 使用相对路径。
- Optimize for web | 为网络优化。

## 🐛 Troubleshooting | 故障排除

### Common Issues | 常见问题

**404 Errors:**
- Check file paths and names | 检查文件路径和名称。
- Verify GitHub Pages settings | 验证 GitHub Pages 设置。
- Wait for deployment (5-10 minutes) | 等待部署（ 5 - 10 分钟）。

**Broken Links:**
- Update internal links to match new structure | 更新内部链接以匹配新结构。
- Use relative paths | 使用相对路径。
- Test all navigation | 测试所有导航。

**Language Detection Issues:**
- Clear browser cache | 清除浏览器缓存。
- Test in incognito mode | 在隐身模式下测试。
- Check localStorage settings | 检查 localStorage 设置。

## 📞 Support | 支持

Need help with translations? | 需要翻译帮助？

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/beihaili/Get-Started-with-Web3/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/beihaili/Get-Started-with-Web3/discussions)
- 🐦 **Twitter**: [@bhbtc1337](https://twitter.com/bhbtc1337)
- 📝 **Community**: [Join Form](https://forms.gle/QMBwL6LwZyQew1tX8)

---

**Happy Translating! | 翻译愉快！** 🌍✨
