# Personal Archive

一个以 Markdown 为内容源、由 GitHub Actions 自动构建并发布到 GitHub Pages 的个人博客。现有的 Frontier Optimism × Bento 视觉语言被保留，首页和阅读页的数据已经全部来自 `posts/`。

## 写一篇新博文

在 `posts/` 新建一个 `.md` 文件。文件名会成为永久链接中的 slug，因此只使用小写字母、数字和短横线，例如：

```text
posts/systems-and-feedback.md
```

每篇博文必须从以下 frontmatter 开始：

```md
---
title: "系统与反馈"
date: "2026-08-16"
category: "SYSTEMS"
excerpt: "这段摘要会显示在首页。"
draft: false
---

从这里开始写正文，支持表格、任务列表、代码块等 GitHub Flavored Markdown。
```

规则：

- `title`、`date`、`category`、`excerpt` 都是必填字符串。
- `date` 必须是有效的 `YYYY-MM-DD`；档案按这个日期从新到旧排列。
- `draft` 必须是布尔值。设为 `true` 时不会出现在公开站点。
- 文件名必须是小写 kebab-case；不改文件名就不会改变博文链接。
- 文中引用站点图片时，将图片放进 `public/images/`，写成 `![说明](/images/example.png)`。

提交并推送到 `main` 后，工作流会自动校验、构建和部署，不需要维护单独的文章列表。

## 本地开发

需要 Node.js 22 或更高版本。

```bash
npm install
npm run dev
```

提交前运行完整检查：

```bash
npm run check
```

本地预览生产构建：

```bash
npm run build
npm run preview
```

## 首次发布到 `asherz-0.github.io`

GitHub 用户站点的仓库名必须与域名一致，因此目标远端必须是公开仓库 `asherz-0/asherz-0.github.io`。当前本地仓库尚未配置远端；完成一次 GitHub 登录后可以这样创建并推送：

```bash
gh auth login -h github.com
gh repo create asherz-0.github.io --public --source=. --remote=origin --push
```

如果你已经在网页上创建了仓库，则使用：

```bash
git remote add origin git@github.com:asherz-0/asherz-0.github.io.git
git push -u origin main
```

首次推送后，到仓库的 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。然后在 **Actions** 页面重新运行 `Deploy blog to GitHub Pages`，或从本地再次推送一个提交。

部署完成后站点地址是：

```text
https://asherz-0.github.io
```

工作流也兼容普通项目仓库：若仓库名不是 `asherz-0.github.io`，构建会自动使用 GitHub Pages 返回的子路径，地址将是 `https://asherz-0.github.io/<仓库名>/`。

## 内容管线

```text
posts/*.md
  → frontmatter 与文件名校验
  → 排除 draft: true
  → 按 date 倒序生成档案
  → Vite 构建 dist/
  → GitHub Pages 部署
```

领域词汇定义见 [`CONTEXT.md`](./CONTEXT.md)，视觉规范见 [`design.md`](./design.md)。
