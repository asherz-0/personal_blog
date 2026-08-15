# Personal Archive

一个以 Markdown 为内容源、由 GitHub Actions 自动构建并发布到 GitHub Pages 的个人博客。现有的 Frontier Optimism × Bento 视觉语言被保留，博文来自 `posts/`，输入记录来自 `consumes/`。

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
tags:
  - 系统思考
  - 决策
draft: false
---

从这里开始写正文，支持表格、任务列表、代码块等 GitHub Flavored Markdown。
```

规则：

- `title`、`date`、`category`、`excerpt` 都是必填字符串。
- `tags` 是至少包含一个非空标签的 YAML 数组；标签用于首页筛选，可以同时属于多个标签。
- `date` 必须是有效的 `YYYY-MM-DD`；档案按这个日期从新到旧排列。
- `draft` 必须是布尔值。设为 `true` 时不会出现在公开站点。
- 文件名必须是小写 kebab-case；不改文件名就不会改变博文链接。
- 文中引用站点图片时，将图片放进 `public/images/`，写成 `![说明](/images/example.png)`。

提交并推送到 `main` 后，工作流会自动校验、构建和部署，不需要维护单独的文章列表。

## 记录一条输入

书、文章、视频、播客或资料放在 `consumes/`，同样使用 Markdown。文件名是稳定 slug，例如：

```text
consumes/feedback-systems.md
```

```md
---
title: "资料标题"
date: "2026-08-16"
source: "ESSAY / EXAMPLE.COM"
url: "https://example.com/source"
excerpt: "它具体改变了什么问题、判断或行动。"
tags:
  - 系统思考
  - 反馈
draft: false
---
```

- `title`、`date`、`source`、`excerpt`、`tags` 必填。
- `url` 可省略；填写时只接受 `http` 或 `https` 地址。
- `draft: true` 的输入条目不会公开。
- 正文可省略。首页会展示标题、来源、摘要和标签；有 `url` 时标题区域会链接到原始来源。

「我的输入」和「我的写作」各自生成标签筛选器。点击条目上的 `#标签` 或分区顶部的标签，可以只查看该分区中同标签的全部内容。

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

## 发布到 GitHub Pages

当前仓库是 `asherzj/asherzj.github.io`，对应的用户站点地址是：

```text
https://asherzj.github.io/
```

本地远端应指向：

```bash
git remote set-url origin https://github.com/asherzj/asherzj.github.io.git
```

仓库的 **Settings → Pages → Build and deployment → Source** 使用 **GitHub Actions**。之后，只要提交进入 `main`，`Deploy blog to GitHub Pages` 就会自动执行；也可以在 **Actions** 页面手动运行。

如果远端仓库尚未有本地 `main`，第一次推送使用：

```bash
git push -u origin main
```

工作流通过 GitHub Pages 返回的部署路径自动区分用户站点和项目站点，不需要手工修改 Vite 的 `base`。

## 博文留言

阅读页使用 giscus 连接仓库中的 GitHub Discussions。访客通过 GitHub 身份留言，评论公开保存在 `Comments` 分类中，站点本身不保存账户、令牌或评论数据。

每篇博文以 `post:<slug>` 作为稳定的 Discussion 映射键。重命名 `posts/` 中的文件会同时改变公开链接和评论映射；若确实需要改名，应一并迁移对应 Discussion 的标题。

## 内容管线

```text
posts/*.md + consumes/*.md
  → frontmatter、标签与文件名校验
  → 各自排除 draft: true
  → 按 date 倒序生成输入与博文集合
  → 按标签筛选各自集合
  → Vite 构建 dist/
  → GitHub Pages 部署
```

领域词汇定义见 [`CONTEXT.md`](./CONTEXT.md)，视觉规范见 [`design.md`](./design.md)。
