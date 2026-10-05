# AGENTS.md — starlight-theme-large-print

开源 Starlight 主题（elder-friendly / 大字阅读），面向社区。源于显密文库项目（`../AGENTS.md` 有项目群全貌），但本仓库是**独立通用项目**，代码与文档不引用本站私货。

## 仓库结构

- `packages/theme/`：核心包 `starlight-theme-large-print`
  - `index.ts`：Starlight 插件（`config:setup` 注入 customCss + head style/script）
  - `styles/typography.css`：排版核心（字号/行高/段距/衬线栈/页标题），全部走 CSS 变量
  - `components/FontSizeControl.astro`：A−/A/A+ 字号按钮（五档 14–22px，localStorage，自定义元素 `<lp-font-size>`）
  - `components/FontSizeSelect.astro`：下拉变体（0.3.0 起，原生 `<select>`，档位名 labels 参数化）——与 FontSizeControl **共用同一 LP_KEY/data-lp-step 机制**，两组件脚本里的 LP_KEY/LP_STEPS/apply 是**有意双写**（组件各自内联打包，无法共享模块），改档位必须两处同步
- `packages/font-noto-serif-sc/`、`packages/font-noto-serif-tc/`：字体扩展包（Google Fonts unicode-range 分包 woff2 + 生成的 `fonts.css` + `OFL.txt`）

## 设计红线（勿违反）

- **零 `!important`、零组件重绘**：主题只做 CSS 变量与排版，升级 Starlight 不应需要改代码。组件级样式（边框/圆角/代码块）是别的主题（如 rapide）的地盘，不要越界。
- **不自动 override Starlight 组件**：`FontSizeControl` 只导出、让用户在自己的 Header override 里渲染——自动 override 会与其他主题撞车。
- 字号/行高等可调项通过插件 `head` 注入 `<style>` 设置变量；**不要在 typography.css 里重复声明这些变量**——dev 下 Vite 异步注入的样式排在 head 内联样式之后，同选择器会被覆盖（2026-09-26 实测坑，`--lp-serif-pack` 用 `var(--lp-serif-pack,)` 空回退解决）。

## 已踩过的坑

- **行距档位梯度（0.2.0 起）**：FontSizeControl 在 `<html>` 上设 `data-lp-step`（0–4），typography.css 用 `html[data-lp-step=N]` 选择器按档设 `--lp-line-height`（14px→2.15 / 15.5px→2.05 / 17px→2 / 19px→1.9 / 22px→1.8）。该选择器优先级高于插件 head 注入的 `:root` 变量，不受 dev 异步 Vite 样式排序影响（避开了下方第 3 条的坑）。**插件默认档（17px）lineHeight 默认值就是 2**——首访无 JS/reset 归零都走注入值，与 `data-lp-step=2` 渲染一致；预绘制内联脚本恢复 localStorage 时必须连同 `data-lp-step` 一起恢复，否则非默认档读者首屏行距闪跳。

- **本地同名字体遮蔽 webfont**：字体栈里族名顺序敏感——若 SC 排在 TC 前，装有本地 Noto Serif SC 的机器上繁体页会用本地 SC 渲染而 TC webfont 永不加载。插件用 `--lp-serif-pack` 注入把启用的族名置顶，typography.css 的 fallback 栈里**不要**写 Noto 族名。
- **插件解析字体包路径**：字体包是*站点*的依赖，必须 `createRequire(process.cwd())` 从项目根解析，不能用 `import.meta.resolve`（从主题包位置向上找不到）。
- **file: 依赖的 dev 调试**：本站群通过 `file:../starlight-theme-large-print/...` 引用，消费工程需在 `vite.server.fs.allow` 放行主题所在父目录（仅 dev 需要）。
- **fonttools 环境**（重新生成字体子集时用）：WSL Python 是 PEP 668 托管环境，无 pip/ensurepip；用 `python3 -m venv --without-pip /tmp/fontvenv && /tmp/fontvenv/bin/python get-pip.py && /tmp/fontvenv/bin/pip install fonttools brotli`。

## 升级跟踪

Starlight 升级时 diff 消费工程 `node_modules/@astrojs/starlight/dist/style/` 的 `props.css`（变量名）与 `markdown.css`（`.sl-markdown-content` 选择器写法）——主题的扩展点都在这两个文件里。GitHub main 仅作超前参考，以钉住版本的本地产物为准。

## demo 部署（CF Workers Builds 自动构建，2026-10-05 起生效）

- **唯一部署通道**：push 到 `main` 且触及 `demo/` 或 `packages/theme/`（watch paths）即触发 CF 云端构建+部署。**本地 `npm run deploy` 已退役，禁止本地/CF 双轨部署**（产物 scoped-style hash 随环境不同，双轨会造成资产频繁翻滚）。
- 配置：root directory=`demo`、build command=`npm run build`、deploy command=`npx wrangler deploy`、branch=`main`、previews 关。路由（`www.xianmi.co/starlight*` 等）在 `demo/wrangler.jsonc`，云端 deploy 只更新资产不动路由。
- 凭证：build token 由 dashboard Builds 向导自动铸（名 `starlight-theme-large-print build token`，UUID `1d0f8a41-7fba-49bc-b7c7-a04730501da5`，底层 CF token ID `ba8246f319c3c3a9653c8c869510412b`；**token 值不落任何文件**）。轮换：dashboard 重铸或 CLI `cf builds tokens create` 登记后 `cf builds workers update <tag> --production-settings-build-token-uuid` + `cf builds triggers update <trigger-uuid> --build-token-uuid` 换绑（trigger UUID `15e523a5-9567-4382-aff5-076500bb03e5`）。
- 手动重触（免 push）：`cf builds create` 当前会 12002（CLI 缺陷），用 deploy hook 代替——`cf builds deploy-hooks trigger e87c9f7e-babd-48bb-bc30-45f826ecd4b0`（名 `manual-retrigger`，branch=main）。
- 构建环境实证（2026-10-05）：node 24.18 / npm 10.9.2，`npm clean-install` 走 lockfile；npm allow-scripts 会拦 esbuild/workerd 的 postinstall 但 optionalDependencies 平台二进制可用，不影响构建；构建全程约 26 秒（含部署）。
- 旧坑备查：曾用 `goodweb build token`（d7c99bf6）时构建卡在 initializing 阶段 `unable to verify Worker` → terminated——即 token 无效时构建连 build command 都到不了，排障先看 build token 绑定。

## 发布流程（待首次执行）

1. 三包 `npm publish --access public`（theme / font-noto-serif-sc / font-noto-serif-tc；字体包内容稳定，几乎不用发新版）。
2. 官方收录：按 [withastro/starlight CONTRIBUTING#themes](https://github.com/withastro/starlight/blob/main/CONTRIBUTING.md#themes)：StackBlitz demo 装包截图（1280×720 明暗两张）→ PR 加 `themes.mdx` 条目。**前提是包已上 npm**。
