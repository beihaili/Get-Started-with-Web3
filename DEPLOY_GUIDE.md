# Honkit + GitHub Pages 自动化部署经验总结

## 1. 目录与内容准备
- 新建或修改章节时，务必在 `SUMMARY.md` 中添加对应的目录项，否则网页侧栏不会显示新章节。
- 每个章节的内容建议放在对应的 `README.MD` 文件中，便于 GitBook/Honkit 自动识别。

## 2. 内容提交到主分支
- 所有内容（如 `README.MD`、`SUMMARY.md` 等）修改后，**先用 git 提交并推送到 main 分支**：
  ```bash
  git add .
  git commit -m "更新内容"
  git push
  ```

## 3. 构建静态站点
- 确保已全局安装 honkit（如未安装，先执行：`npm install -g honkit`）。
- 在项目根目录下运行：
  ```bash
  honkit build
  ```
  这会生成 `_book` 目录，里面是静态网页内容。

## 4. 部署到 GitHub Pages
- 运行部署脚本（如 `deploy.sh`），它会自动将 `_book` 目录内容推送到 `gh-pages` 分支：
  ```bash
  bash deploy.sh
  ```
  > 注意：如果脚本提示有未提交的更改，需先提交（见第2步）。

## 5. 检查 GitHub Pages 设置
- 在 GitHub 仓库的 `Settings > Pages`，确认：
  - 发布分支为 `gh-pages`
  - 发布目录为 `/（root）`

## 6. 等待生效
- 部署后，通常几分钟内网页会自动更新。访问地址一般为：
  ```
  https://<你的GitHub用户名>.github.io/<仓库名>/
  ```
  如：`https://beihaili.github.io/Get-Started-with-Web3/`

## 7. 常见问题与排查
- **新章节不显示**：多半是 `SUMMARY.md` 没加，或没重新 build/deploy。
- **网页内容没变**：可能是没 push 到 main，或没重新 build/deploy，或浏览器缓存未刷新。
- **脚本报错有未提交更改**：先 `git add . && git commit -m "xxx" && git push`。

---

## 一键部署流程（推荐AI操作顺序）
1. 检查/编辑 `SUMMARY.md`，确保目录完整。
2. `git add . && git commit -m "更新SUMMARY和内容" && git push`
3. `honkit build`
4. `bash deploy.sh`
5. 等待几分钟，刷新网页查看效果。

---

下次需要自动化部署，只需让AI严格按上述流程操作即可，遇到问题也可直接参考"常见问题与排查"部分。 