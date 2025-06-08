#!/bin/bash

# 更新GitHub Pages脚本
# 使用方法: bash deploy-gh-pages.sh [提交信息]

# 如果没有提供提交信息，使用默认信息
COMMIT_MSG=${1:-"Update GitHub Pages content"}

# 确保我们在主分支上
git checkout main

# 确保本地代码是最新的
echo "正在拉取最新代码..."
git pull origin main

# 如果你的项目需要构建（例如使用Jekyll, GitBook等）
# 取消下面的注释并根据需要修改
# echo "正在构建项目..."
# [构建命令，例如 jekyll build 或 gitbook build]

# 将所有更改添加到暂存区
echo "正在暂存更改..."
git add .

# 提交更改
echo "正在提交更改: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

# 推送到GitHub
echo "正在推送到GitHub..."
git push origin main

# 如果你使用的是gh-pages分支而不是main分支来托管GitHub Pages
# 取消下面的注释并根据需要修改
# echo "正在更新gh-pages分支..."
# git checkout gh-pages
# git merge main
# git push origin gh-pages
# git checkout main

echo "GitHub Pages已更新!"
