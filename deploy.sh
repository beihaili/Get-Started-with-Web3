#!/bin/bash

# 确保在main分支
git checkout main

# 构建最新的站点
echo "Building latest HonKit site..."
honkit build

# 创建一个临时目录保存_book内容
echo "Creating temporary directory..."
mkdir -p /tmp/gitbook-temp
cp -R _book/* /tmp/gitbook-temp/

# 切换到gh-pages分支
echo "Switching to gh-pages branch..."
git checkout gh-pages

# 保留.git目录，但清空其他内容
echo "Cleaning gh-pages branch..."
find . -maxdepth 1 ! -name '.git' ! -name '.' ! -name '..' -exec rm -rf {} \;

# 复制构建内容到gh-pages分支
echo "Copying built content to gh-pages..."
cp -R /tmp/gitbook-temp/* .

# 添加所有文件到Git
echo "Adding files to git..."
git add .

# 提交更改
echo "Committing changes..."
git commit -m "Update GitHub Pages site $(date)"

# 推送到远程仓库
echo "Pushing to GitHub..."
git push origin gh-pages

# 切回main分支
echo "Switching back to main branch..."
git checkout main

# 清理临时目录
echo "Cleaning up..."
rm -rf /tmp/gitbook-temp

echo "Done! GitHub Pages site updated."
