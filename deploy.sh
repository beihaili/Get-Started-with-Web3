#!/bin/bash

# 确保脚本在出错时退出
set -e

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️  警告：您有未提交的更改。"
  echo "请先提交或暂存您的更改，再运行此脚本。"
  exit 1
fi

# 获取当前分支
CURRENT_BRANCH=$(git symbolic-ref --short HEAD)
echo "👉 当前分支：$CURRENT_BRANCH"

# 确保我们在main分支上
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "👉 切换到main分支..."
  git checkout main
fi

# 拉取最新的main分支代码
echo "👉 拉取最新代码..."
git pull origin main

# 检查honkit是否安装
if ! command -v honkit &> /dev/null; then
  echo "⚠️  错误：honkit命令未找到。"
  echo "请确保已安装honkit：npm install -g honkit"
  exit 1
fi

# 构建最新的站点
echo "👉 构建最新站点..."
honkit build

# 创建临时目录
echo "👉 创建临时目录..."
TEMP_DIR=$(mktemp -d)
cp -R _book/* "$TEMP_DIR/"

# 创建一个新的临时分支，基于当前main分支
echo "👆 创建临时分支..."
TEMP_BRANCH="temp-gh-pages-$(date +%s)"
git checkout -b $TEMP_BRANCH

# 清空当前目录（除了.git文件夹）
echo "👆 清理临时分支..."
git rm -rf .
git clean -fdx

# 复制构建内容
echo "👉 复制新构建的内容..."
cp -R "$TEMP_DIR"/* .

# 添加所有文件到Git
echo "👉 添加文件到Git..."
git add .

# 提交信息
COMMIT_MSG="Update GitHub Pages site $(date)"
echo "👉 提交更改：$COMMIT_MSG"
git commit -m "$COMMIT_MSG"

# 强制推送到GitHub
echo "👆 强制推送到gh-pages分支..."
git push -f origin $TEMP_BRANCH:gh-pages

# 清理临时目录
echo "👉 清理临时目录..."
rm -rf "$TEMP_DIR"

# 删除临时分支并切回原始分支
echo "👆 切回$CURRENT_BRANCH分支..."
git checkout "$CURRENT_BRANCH"
git branch -D $TEMP_BRANCH

echo "✅ 完成！GitHub Pages站点已更新。"
echo "🌐 网站将在几分钟后可在此访问："
echo "    https://beihaili.github.io/Get-Started-with-Web3/"
