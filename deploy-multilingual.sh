#!/bin/bash

# Multi-language GitHub Pages deployment script
# 多语言GitHub Pages部署脚本

echo "🌐 Starting multi-language deployment..."

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run from project root."
    exit 1
fi

# Check if both language versions exist
if [ ! -d "zh" ] || [ ! -d "en" ]; then
    echo "❌ Error: Language directories (zh, en) not found."
    exit 1
fi

# Create .nojekyll file to disable Jekyll processing
echo "📝 Creating .nojekyll file..."
touch .nojekyll

# Add all changes
echo "📦 Adding changes to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "🌐 Add multi-language support with English translation

- Add language selection homepage (index.html)
- Create zh/ directory for Chinese version
- Create en/ directory for English version  
- Add GitHub Pages configuration (_config.yml)
- Translate Chapter 11: Network Security to English
- Add deployment scripts for multi-language support

Features:
✅ Language selection on homepage
✅ Chinese/English version switching
✅ Responsive design
✅ Language preference memory
✅ GitHub Pages ready"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

echo "✅ Multi-language deployment completed!"
echo ""
echo "📖 Your site will be available at:"
echo "   🌍 Homepage: https://beihaili.github.io/Get-Started-with-Web3/"
echo "   🇨🇳 Chinese: https://beihaili.github.io/Get-Started-with-Web3/zh/"
echo "   🇺🇸 English: https://beihaili.github.io/Get-Started-with-Web3/en/"
echo ""
echo "⏱️  GitHub Pages typically takes 1-10 minutes to update."
echo "💡 If you see 404 errors, wait a few minutes and refresh."