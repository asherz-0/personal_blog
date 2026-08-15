---
title: "欢迎来到这座个人档案库"
date: "2026-08-16"
category: "META"
excerpt: "这是一篇示例博文，也是一份最短发布说明：写 Markdown，推送 main，剩下的交给构建系统。"
draft: false
---

这座档案库把写作当作最朴素的数据源：一篇博文就是一个 Markdown 文件。

## 从这里开始

复制这篇文件，在 `posts/` 中为新博文创建一个小写、短横线分隔的文件名，例如 `systems-and-feedback.md`。修改顶部的元数据，然后开始写作。

- `title` 是博文标题。
- `date` 使用 `YYYY-MM-DD`。
- `category` 是分类标签。
- `excerpt` 会显示在首页档案中。
- `draft: true` 会让博文留在仓库里，但不进入公开档案。

## 发布路径

当提交进入 `main`，GitHub Actions 会校验内容、构建静态站点并部署到 GitHub Pages。新博文会按日期自动出现在档案最上方，不需要手工维护文章列表。

> 写作是唯一需要手工完成的部分。

完整命令和首次部署步骤请查看仓库根目录的 `README.md`。
