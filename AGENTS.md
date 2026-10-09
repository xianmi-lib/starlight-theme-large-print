# AGENTS.md — starlight-theme-large-print

开源 Starlight 主题（elder-friendly / 大字阅读），面向社区。源于显密文库项目（`../AGENTS.md` 有项目群全貌），但本仓库是**独立通用项目**，代码与文档不引用本站私货。

## 仓库结构

- `packages/theme/`：核心包 `starlight-theme-large-print`
  - `index.ts`：Starlight 插件（`config:setup` 注入 customCss + head style/script）
  - `styles/typography.css`：排版核心（字号/行高/段距/衬线栈/页标题），全部走 CSS 变量
  - `components/FontSizeControl.astro`：A−/A/A+ 字号按钮（五档 14–22px，localStorage，自定义元素 `<lp-font-size>`）
  - `components/FontSizeSelect.astro`：下拉变体（0.3.0 起，原生 `<select>`，档位名 labels 参数化）——与 FontSizeControl **共用同一 LP_KEY/data-lp-step 机制**，两组件脚本里的 LP_KEY/LP_STEPS/apply 是**有意双写**（组件各自内联打包，无法共享模块），改档位必须两处同步
  - `components/appearance-presets.ts`：纸张色预设表 `PAPER_PRESETS`（14 项，`{id,bg,text,mode,name}`，bg/text hex 照抄老站 set_color）。**数据单一源**（同步点①②）：`index.ts` 预绘制脚本构建期 JSON 序列化本表，`AppearanceSelect.astro` frontmatter 与客户端脚本相对 import 同一文件——改表只改这里；**同步点③**：`styles/paper.css` 是手工第二份数据（同套 14 组 id/bg/text 手写规则）——改 PAPER_PRESETS 必须同改 paper.css 的 14 条规则（id 选择器 + --lp-paper-bg/-text），否则色块预览与实际纸色静默漂移
  - `components/AppearanceSelect.astro`：「外观」下拉（跟随系统 / 浅色 / 深色 / 纸张色 14 色网格，面板共 17 项），取代 Starlight ThemeSelect（**勿两个同时渲染**）。状态机：localStorage `lp-appearance`（auto=不存 | `light` | `dark` | `paper:<id>`）→ `<html>` 的 `data-theme` + `data-paper`，并镜像写 `starlight-theme`；面板机器同 TypographyDropdown（视口夹取 / Esc / define-once）；交互派发窗口事件 `CustomEvent('lp-appearance')`（站点埋点消费，主题不依赖 GA）。exports 开 `./components/AppearanceSelect.astro`
  - `styles/paper.css`：纸张色覆写（`<html data-paper>` → `--sl-color-*` 整页底/字色，派生灰阶 color-mix 不支持则整组降级），插件 customCss 注入（跟在 typography.css 后）。exports 开 `./styles/paper.css`——customCss 走包 exports 解析，不开条目消费工程构建解析失败
- `media/`：README 插图（PNG；README 以 GitHub raw **绝对 URL** 引用，npm 包页相对路径会 404）+ `LISTING-DRAFT.md`（官方 themes 收录与 awesome-starlight 提交调研稿，2026-10-10 复核落稿并做事实订正——官方双线已在、#4254 归因；对外动作记录见下「官方收录」条）。目录在仓库根、不在 `packages/` 下，**不入 npm 包面**
- `packages/font-noto-serif-sc/`、`packages/font-noto-serif-tc/`：字体扩展包（Google Fonts unicode-range 分包 woff2 + 生成的 `fonts.css` + `OFL.txt`）

## 设计红线（勿违反）

- **零 `!important`、零组件重绘**：主题只做 CSS 变量与排版，升级 Starlight 不应需要改代码。组件级样式（边框/圆角/代码块）是别的主题（如 rapide）的地盘，不要越界。
- **不自动 override Starlight 组件**：`FontSizeControl` 只导出、让用户在自己的 Header override 里渲染——自动 override 会与其他主题撞车。
- 字号/行高等可调项通过插件 `head` 注入 `<style>` 设置变量；**不要在 typography.css 里重复声明这些变量**——dev 下 Vite 异步注入的样式排在 head 内联样式之后，同选择器会被覆盖（2026-09-26 实测坑，`--lp-serif-pack` 用 `var(--lp-serif-pack,)` 空回退解决）。

## 已踩过的坑

- **行距档位梯度（0.2.0 起；0.4.0 改三档+行距偏好）**：控件在 `<html>` 上设 `data-lp-step`（0–4=14/15.5/17/19/22px（0.4.0 曾折衷三档 15/17/22，用户实测后 0.4.1 恢复五档）），typography.css 用 `html[data-lp-step=N]` 选择器按档设 `--lp-lh-base`（14px→2.1 / 15.5px→2.05 / 17px→2 / 19px→1.95 / 22px→1.9=0.2.x 梯度的 C 定稿值），`data-lp-spacing=0/2` 再乘 `--lp-lh-scale` 0.9/1.1（TypographyDropdown 行距档）；缩进开关 `data-typo-indent=1` → `text-indent: 2em`，最终 `line-height: calc(base×scale)`。该选择器优先级高于插件 head 注入的 `:root` 变量，不受 dev 异步 Vite 样式排序影响（避开了下方第 3 条的坑）。**插件默认档（17px）lineHeight 默认值就是 2**——首访无 JS/reset 归零都走注入值，与 `data-lp-step=1` 渲染一致；预绘制内联脚本恢复 localStorage 时必须连同 `data-lp-step`（以及 0.4.0 的 `data-lp-spacing`/`data-lp-hang`）一起恢复，否则非默认档读者首屏闪跳。非当档存值（含 0.4.0 三档折衷期的 15px 等）由预绘制脚本按最近档迁移。
- **悬挂开关（0.4.0）**：`data-lp-hang="1"` → `hanging-punctuation: first allow-end`；Safari 与 Chromium 139+ 支持，旧引擎忽略声明即不悬挂（无副作用降级）。
- **外观控件 storage 语义（AppearanceSelect）**：`lp-appearance` 单一真值源（auto=不存 / `light` / `dark` / `paper:<id>`），同时**镜像写 Starlight 的 `starlight-theme`**（auto→`''`、light/dark→同值、paper→绑定明暗态）。Starlight ThemeProvider 内联脚本执行顺序不可控，故 `index.ts` 预绘制脚本也**确定性写镜像**（每次加载多一次 localStorage 写，成本可忽略）——从根上消除顺序依赖，勿回退成「首帧只读」。无 `lp-appearance` 时沿用旧 `starlight-theme`（ThemeSelect 时代存量迁移）。
- **纸张色 id 与 bg 不总相等（`ffeeee-2`）**：浅红（第 7 档）与红字（第 10 档）同底 `#FFEEEE` 不同字色，id 不能都用 bg hex——红字档定 `ffeeee-2`。存储值/事件值是 `paper:<id>`（`paper:ffeeee` / `paper:ffeeee-2`）。主题组件本身不查正则（走 `presetOf` 精确查表）；正则是消费方 feature-tracking 侧的门槛示例：`/^paper:[a-f0-9][a-f0-9-]*$/`（`paper:xyz` / `paper:#ffeeee` / `paper:` 一律 null；兼容 `ffeeee-2` / `fffbec`）。
- **warmDark 优先级抬权（paper.css）**：warmDark 注入 `:root[data-theme='dark']`（0,2,0）与 `:root[data-paper]`（0,2,0）打平靠源顺序——dev Vite 异步样式顺序不可靠（见下方「可调项变量不双写」条）。故 paper.css 所有纸张规则都带 `[data-theme]` 属性抬到 (0,3,0)/(0,4,0)，确定压过 warmDark 与其余 `:root` 覆写。

- **本地同名字体遮蔽 webfont**：字体栈里族名顺序敏感——若 SC 排在 TC 前，装有本地 Noto Serif SC 的机器上繁体页会用本地 SC 渲染而 TC webfont 永不加载。插件用 `--lp-serif-pack` 注入把启用的族名置顶，typography.css 的 fallback 栈里**不要**写 Noto 族名。
- **插件解析字体包路径**：字体包是*站点*的依赖，必须 `createRequire(process.cwd())` 从项目根解析，不能用 `import.meta.resolve`（从主题包位置向上找不到）。
- **file: 依赖的 dev 调试**：本站群通过 `file:../starlight-theme-large-print/...` 引用，消费工程需在 `vite.server.fs.allow` 放行主题所在父目录（仅 dev 需要）。
- **fonttools 环境**（重新生成字体子集时用）：WSL Python 是 PEP 668 托管环境，无 pip/ensurepip；用 `python3 -m venv --without-pip /tmp/fontvenv && /tmp/fontvenv/bin/python get-pip.py && /tmp/fontvenv/bin/pip install fonttools brotli`。

## 升级跟踪

Starlight 升级时 diff 消费工程 `node_modules/@astrojs/starlight/dist/style/` 的 `props.css`（变量名）与 `markdown.css`（`.sl-markdown-content` 选择器写法）——主题的扩展点都在这两个文件里。GitHub main 仅作超前参考，以钉住版本的本地产物为准。

## demo 部署（CF Workers Builds 自动构建，2026-10-05 起生效）

- **唯一部署通道**：push 到 `main` 且触及 `demo/` 或 `packages/theme/`（watch paths）即触发 CF 云端构建+部署。**本地 `npm run deploy` 已退役，禁止本地/CF 双轨部署**（产物 scoped-style hash 随环境不同，双轨会造成资产频繁翻滚）。
- 配置：root directory=`demo`、build command=`npm run build`、deploy command=`npx wrangler deploy`、branch=`main`、previews 关。路由（`www.xianmi.co/starlight*` 等）在 `demo/wrangler.jsonc`，云端 deploy 只更新资产不动路由。
- 凭证：build token 由 dashboard Builds 向导自动铸（名 `starlight-theme-large-print build token`，UUID `1d0f8a41-7fba-49bc-b7c7-a04730501da5`，底层 CF token ID `ba8246f319c3c3a9653c8c869510412b`；**token 值不落任何文件**）。轮换：dashboard 重铸或 CLI `cf builds tokens create` 登记后 `cf builds triggers update aab6fdd8-764d-43fb-a655-6dd3faf7c465 --build-token-uuid <新>` 换绑。
- **只保留一条构建配置**（2026-10-05 事故）：CLI 建的一套（external_script_id=worker 名 tag）与 dashboard 向导建的一套（external_script_id=`bb3287e0d7014e43a0b4fb9a9823bf2a`）曾并存，push 会双重构建且 dashboard 那条 path_includes=`['*']` 绕过 watch paths。现已收敛为 dashboard 那条（trigger `aab6fdd8-764d-43fb-a655-6dd3faf7c465`，watch paths 已改回 `['demo/*','packages/theme/*']`），CLI 那条 trigger 已删。改动 Builds 配置后用 `cf builds triggers list --external-script-id <两个 ID 各查一次>` 核实仍只有一条。
- 手动重触（免 push）：`cf builds create` 当前会 12002（CLI 缺陷），用 deploy hook 代替——`cf builds deploy-hooks trigger e87c9f7e-babd-48bb-bc30-45f826ecd4b0`（名 `manual-retrigger`，branch=main）。
- 构建环境实证（2026-10-05）：node 24.18 / npm 10.9.2，`npm clean-install` 走 lockfile；npm allow-scripts 会拦 esbuild/workerd 的 postinstall 但 optionalDependencies 平台二进制可用，不影响构建；构建全程约 26 秒（含部署）。
- 旧坑备查：曾用 `goodweb build token`（d7c99bf6）时构建卡在 initializing 阶段 `unable to verify Worker` → terminated——即 token 无效时构建连 build command 都到不了，排障先看 build token 绑定。

## 发布流程（已执行记录）

- **npm 发布**：三包 `npm publish --access public`（theme / font-noto-serif-sc / font-noto-serif-tc 同批对齐版本；字体包内容稳定，仅随主题批次对齐重发）。
  - **README 双份同步（publish 硬前置）**：仓根 `README.md`（GitHub 展示）与 `packages/theme/README.md`（npm 包面，随 tarball 发布）同步维护，改一处必改另一处；插图一律 raw.githubusercontent 绝对 URL（两面同用）。
  - **0.1.0**（2026-09-26 前后）：三包首发。
  - **0.2.0 / 0.3.0**：仅仓内迭代（行距梯度、FontSizeSelect），**从未发 npm**——npm 上没有中间版本属正常，勿据版本号推断发布史。
  - **0.4.0**（2026-10-07）：TypographyDropdown 三控件（字号三档折衷）+ 三包同批发。
  - **0.4.1**（2026-10-07）：实测反馈修正——字号恢复五档 + 首行缩进第四控件；三包同批补发（registry 与 main 对齐）。
  - **0.4.2**（2026-10-07）：控件间分割线 + 首行缩进控件注释禁用 + 移动端挤压修复 + 排版触发器 UI 修正（桌面字号对齐 Select、图标化阈值 22rem）四批入库；三包同批补发，registry 与 main 对齐。
  - **0.5.0**（2026-10-10 实发）：AppearanceSelect「外观」下拉（17 项：跟随系统/浅色/深色 + 纸张色 14 档，`lp-appearance` + `starlight-theme` 镜像 + 预绘制零闪烁）+ paper.css 纸张色覆写 + README 修订（特性/插图/行距数值勘误、Packages/License 链接改 GitHub 绝对 URL）+ 收录调研稿；三包同批对齐，registry `latest=0.5.0`（字体包大包走处理管道，`npm view` CLI 有缓存滞后，以 `registry.npmjs.org/<pkg>` JSON 的 versions/dist-tags 为准）。**npm 包页外链 rel 实证（2026-10-10，webbridge 真浏览器）**：README 里 xianmi.co 链接带 `rel="nofollow"`；raw.githubusercontent 插图链接 `rel="noopener noreferrer nofollow"`；github.com（Packages 表/OFL）链接无 rel 属性=可跟进。
  - **0.5.1**（2026-10-10 实发）：npm 元数据补全（用户指出双包页不对称）——三包 package.json 补 `homepage=https://www.xianmi.co/starlight/` + `repository`（含 `directory` 各包目录）+ `bugs`，font 两包补最小 README（原28字符空页）。**侧栏 rel 补充实证**：npm 侧栏 Homepage 与 Repository 链接均为 `noopener noreferrer nofollow`——xianmi.co 从 npm 无 follow 权重出口，收益=包页展示与直接点击；可跟进的只有 README 正文内 github.com 链接与侧栏 issues/pulls 计数链。
  - 凭证纪律：token 在用户侧 `~/.npmrc`（`//registry.npmjs.org/:_authToken=`，bypass-2FA granular token），token 值不落任何文件；2FA 未 bypass 时 publish 会 EOTP 要求浏览器授权。
  - npm 新发布走处理管道，`npm publish` 成功后 `npm view` 约 1–2 分钟才转绿，勿立刻误判失败。
- **官方收录（已执行，2026-10-10 复核）**：双线均已在 withastro/starlight 官方仓（[themes 页](https://starlight.astro.build/resources/themes/) / [plugins 页](https://starlight.astro.build/resources/plugins/)）：①主题 `resources/themes.mdx` 条目（title/description/href=`https://www.xianmi.co/starlight/`）+ `docs/src/assets/themes/large-print-light.png`/`large-print-dark.png` 两张截图已在（用户亲手提交并 merge，截图存量即合规、无需重拍）；②插件 `resources/plugins.mdx` 的 `starlight-ai-actions` 条目在（[PR #4254](https://github.com/withastro/starlight/pull/4254) **preview worker 用 gh 提交**、已 Merged——勿再重复提官方 PR）。awesome 列表：`riderx/awesome-starlight` [PR #5](https://github.com/riderx/awesome-starlight/pull/5)（Large Print + starlight-ai-actions 同 PR）2026-10-10 提交待审；`trueberryless-org/awesome-starlight` 自动收录已有（URL 为过期 workers.dev，watch 其是否随官方条目更新）。
