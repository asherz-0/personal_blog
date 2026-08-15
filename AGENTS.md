# Personal Archive Agent Guide

本文件适用于整个仓库。它记录的是后续编码代理在修改项目前应遵守的项目事实和工作约定；实现细节以当前源码为最终依据。

## 项目定位

Personal Archive 是一个纯静态个人博客：`posts/*.md` 是唯一内容源，Vite 在构建时校验并导入博文，React 负责档案首页和阅读视图，GitHub Actions 将 `dist/` 部署到 GitHub Pages。

开始修改前先按任务范围阅读：

- `README.md`：写作、本地开发和首次部署说明。
- `CONTEXT.md`：领域词汇。统一使用“博文（Post）”“档案（Archive）”“草稿（Draft）”“发布（Publish）”，避免其中列出的替代叫法。
- `design.md`：Frontier Optimism × Bento 视觉规范。涉及布局、样式或交互时必须遵守。

## 技术栈与环境

- Node.js `>=22`，包管理器为 npm；保留并更新 `package-lock.json`。
- React 19、TypeScript strict mode、Vite 6、Tailwind CSS 4。
- Markdown 由 `react-markdown` + `remark-gfm` 渲染，frontmatter 由 `yaml` 解析。
- 动效使用 `motion/react`，图标使用 `lucide-react`。
- 项目没有后端、数据库或运行时密钥，不要把仅构建期需要的配置变成客户端 secret。

首次安装依赖使用 `npm ci`（需要严格复现 lockfile）或本地开发时使用 `npm install`。

## 常用命令

```bash
npm run dev       # Vite 开发服务器：http://localhost:3000
npm run lint      # TypeScript 类型检查；当前没有 ESLint
npm test          # 运行 node:test 测试
npm run build     # 生成 dist/
npm run preview   # 本地预览生产构建
npm run check     # lint + test + build，提交前的完整检查
```

GitHub Pages 项目站点依赖非根路径。修改资源路径或 Vite 配置时，额外验证一次：

```bash
PAGES_BASE_PATH=/personal_blog npm run build
```

不要提交 `node_modules/`、`dist/`、日志或本地 `.env` 文件；这些都已被 `.gitignore` 排除。

## 运行时架构

当前生效的调用链很短：

1. `src/main.tsx` 挂载 React。
2. `src/App.tsx` 只渲染 `src/components/BentoLayout.tsx`。
3. `src/lib/posts.ts` 通过 eager `import.meta.glob('/posts/*.md', {query: '?raw'})` 导入所有 Markdown，并在模块加载时解析、去重、排除草稿和排序。
4. `src/lib/post-parser.ts` 负责 slug、frontmatter、日期、正文和阅读时长校验。
5. `src/lib/i18n.ts` 定义中英文界面词典，并通过 `localStorage` 保存页面组件语言；博文内容不自动翻译。
6. `BentoLayout.tsx` 同时实现首页、档案列表、阅读视图、语言切换和 `#/posts/<slug>` 哈希导航；项目没有 React Router。
7. `src/index.css` 定义 Tailwind v4 主题 token、排版、Markdown 正文样式和 reduced-motion 降级。

`Articles.tsx`、`Connect.tsx`、`Header.tsx`、`Hero.tsx`、`Invite.tsx`、`Observe.tsx` 当前均未被运行时入口导入，属于遗留/候选展示组件。不要误以为修改它们会改变线上页面；复用或删除前先重新检查引用。

内容管线是：

```text
posts/*.md
  -> parsePost 构建期校验
  -> 去除 draft: true
  -> 按 ISO date 从新到旧排序
  -> 首页档案与阅读视图
  -> Vite dist/
  -> GitHub Pages
```

## 博文约定

新增博文只需在 `posts/` 新建 Markdown，不要维护额外的文章数组或索引。文件使用小写 kebab-case；文件名就是稳定 slug，改名会改变公开链接。

```md
---
title: "博文标题"
date: "2026-08-16"
category: "SYSTEMS"
excerpt: "显示在档案列表中的简短摘要。"
draft: false
---

正文从这里开始。
```

必须满足：

- `title`、`date`、`category`、`excerpt` 是非空字符串。
- `date` 是真实存在的 `YYYY-MM-DD` 日期；这个值同时决定排序。
- `draft` 若存在必须是 YAML 布尔值，不能写成字符串。解析器允许省略并默认 `false`，但新博文应显式填写以表达发布意图。
- 正文不能为空；支持 GitHub Flavored Markdown。
- `category` 会由解析器统一转成大写。
- 同一 slug 不得重复；解析或导入错误会直接使测试/构建失败。
- 站点图片放在 `public/images/`，Markdown 使用 `![说明](/images/file.png)`。阅读视图会通过 `import.meta.env.BASE_URL` 修正图片在 GitHub Pages 子路径下的地址。

草稿留在仓库中但不会出现在 `posts` 导出的公开集合里，因此 `getPostBySlug` 也不会返回草稿。阅读时长是解析器基于中日韩字符和英文 token、按每分钟 300 个单位估算的展示值。

## 代码与设计约定

- 保持 TypeScript strict；避免 `any`、非必要断言和重复的 `Post` 形状，公共内容类型从 `src/lib/posts.ts` / `post-parser.ts` 导入。
- 保持 ESM 和现有直接相对导入风格。仓库没有自动格式化器，编辑时遵循相邻文件的写法，不要顺手格式化无关代码。
- 内容校验集中在 `parsePost`。新增或改变规则时，让错误消息包含 `sourcePath`，并在 `tests/post-parser.test.ts` 增加成功路径和失败路径测试。
- 保持静态构建和单一内容源；没有明确需求时不要引入 CMS、服务端运行时、客户端数据请求或手工博文清单。
- 保持现有哈希链接 `#/posts/<encoded-slug>` 可直接打开、前进/后退可同步、关闭阅读页会清除 hash。更换路由方案属于架构变更，需要同步考虑 GitHub Pages 的刷新回退。
- 根路径资源必须考虑 `import.meta.env.BASE_URL` / `PAGES_BASE_PATH`，不能只在 `/` 下工作。
- UI 继续使用 `src/index.css` 中的主题 token 和 Tailwind utility；优先复用 `paper`、`mist`、`ink`、`orbit-blue`、`line-dark` 等语义色，不散落近似硬编码色值。
- 视觉保持 Bento 边界、1px 实线、暖纸色、大留白和克制的 Orbit Blue 状态色。不要增加内部卡片阴影、紫蓝渐变、弹跳动效或无意义视差。
- 保持首页 60/40 主视觉结构和阅读正文约 `65ch` 的可读宽度，任何布局改动都检查窄屏与桌面宽度。
- 交互元素使用语义化元素，保留键盘 focus-visible 状态、合理的 `aria-*`、图片替代文本和 `prefers-reduced-motion` 行为。
- 站点标题和描述目前同时存在于 `index.html` 与 `BentoLayout.tsx`；修改品牌文案或 SEO 文案时同步两处。

## 按改动类型验证

- 只改文档：至少运行 `git diff --check` 并核对命令、路径和链接。
- 新增或修改博文：运行 `npm test` 和 `npm run build`；确认草稿不会公开、日期排序正确、Markdown 可渲染。
- 修改解析器或内容模型：先补 `tests/post-parser.test.ts`，再运行 `npm run check`。
- 修改 UI、导航或样式：运行 `npm run check`，并手动检查首页与阅读视图、直接 hash 打开、返回档案、移动端和桌面端。
- 修改部署、Vite base 或资源处理：运行普通构建和带 `PAGES_BASE_PATH=/personal_blog` 的构建，并对照 `.github/workflows/deploy-pages.yml`。

## 完成标准

交付前：

1. 只修改任务需要的文件，保留工作区中不属于本次任务的改动。
2. 运行 `git diff --check`。
3. 除纯文档改动外，运行 `npm run check`；若无法运行，明确说明未验证项和原因。
4. 不手工编辑或提交 `dist/`。部署工作流只在提交进入 `main` 或手动触发时发布。

当前生产构建会报告 JavaScript chunk 超过 500 kB 的非阻塞警告。不要把已有警告误报为失败；如果改动显著扩大 bundle，再考虑按真实边界做代码分割。
