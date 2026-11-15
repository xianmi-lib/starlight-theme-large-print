# AGENTS.md — starlight-theme-large-print

开源 Starlight 主题（elder-friendly / 大字阅读），面向社区。源于显密文库项目（www.xianmi.co），但本仓库是**独立通用项目**，代码与文档不引用本站私货。

## 仓库结构

- `packages/theme/`：核心包 `starlight-theme-large-print`
  - `index.ts`：Starlight 插件（`config:setup` 注入 customCss + head style/script）
  - `styles/typography.css`：排版核心（字号/行高/段距/衬线栈/页标题），全部走 CSS 变量
  - `components/FontSizeControl.astro`：A−/A/A+ 字号按钮（五档 14–22px，localStorage，自定义元素 `<lp-font-size>`）
  - `components/FontSizeSelect.astro`：下拉变体（0.3.0 起，原生 `<select>`，档位名 labels 参数化）——与 FontSizeControl **共用同一 LP_KEY/data-lp-step 机制**，两组件脚本里的 LP_KEY/LP_STEPS/apply 是**有意双写**（组件各自内联打包，无法共享模块），改档位必须两处同步
  - `components/appearance-presets.ts`：纸张色预设表 `PAPER_PRESETS`（3 档，`{id,bg,text,mode,name}`）。**⚠️ 本文件由 `scripts/gen-paper-presets.mjs` 生成，勿手改**：种子色只改脚本 SEEDS 表，脚本跑 WCAG 断言（正文 AAA≥7 / gray-2 派生 AA≥4.5）后生成①本文件②`styles/paper.css` 的 GENERATED 标记块；`--check` 是漂移门禁。`index.ts` 预绘制脚本构建期 JSON 序列化本表、`AppearanceSelect.astro` 相对 import 同一文件（数据不双写）。
  - `components/AppearanceSelect.astro`：「外观」下拉（跟随系统 / 浅色 / 深色 三文字行 + 纸张色 3 档网格；0.6.1 用户拍板撤销 0.6.0 的「夜黑色块=dark 别名」（认知混乱），恢复深色文字行=0.5.2 语义，暖暗色主题本体不动；0.6.2 白纸档裁撤（与浅色行实质重复）；被砍档存量 storage 值判未知 id 即清并回落 auto），取代 Starlight ThemeSelect（**勿两个同时渲染**）。状态机：localStorage `lp-appearance`（auto=不存 | `light` | `dark` | `paper:<id>`）→ `<html>` 的 `data-theme` + `data-paper`，并镜像写 `starlight-theme`；面板机器同 TypographyDropdown（视口夹取 / Esc / define-once）；交互派发窗口事件 `CustomEvent('lp-appearance')`（站点埋点消费，主题不依赖 GA）。exports 开 `./components/AppearanceSelect.astro`
  - `styles/paper.css`：纸张色覆写（`<html data-paper>` → `--sl-color-*` 整页底/字色+accent 单色派生，派生灰阶 color-mix 不支持则整组降级），插件 customCss 注入（跟在 typography.css 后）；**末尾每档变量规则是 gen-paper-presets.mjs 生成的 GENERATED 标记块，勿手改**。exports 开 `./styles/paper.css`——customCss 走包 exports 解析，不开条目消费工程构建解析失败
  - `scripts/gen-paper-presets.mjs`：纸张色种子色→WCAG 断言→双份产物生成器（`--check`=漂移门禁）。改档位/色值只改它的 SEEDS
- `media/`：README 插图（PNG；README 以 GitHub raw **绝对 URL** 引用，npm 包页相对路径会 404）+ `LISTING-DRAFT.md`（官方 themes 收录与 awesome-starlight 提交调研稿，2026-10-10 复核落稿并做事实订正——官方双线已在、#4254 归因；对外动作记录见下「官方收录」条）。目录在仓库根、不在 `packages/` 下，**不入 npm 包面**
- `packages/font-noto-serif-sc/`、`packages/font-noto-serif-tc/`：字体扩展包（Google Fonts unicode-range 分包 woff2 + 生成的 `fonts.css` + `OFL.txt`）

## 设计红线（勿违反）

- **零 `!important`、零组件重绘**：主题只做 CSS 变量与排版，升级 Starlight 不应需要改代码。组件级样式（边框/圆角/代码块）是别的主题（如 rapide）的地盘，不要越界。
- **不自动 override Starlight 组件**：`FontSizeControl` 只导出、让用户在自己的 Header override 里渲染——自动 override 会与其他主题撞车。
- 字号/行高等可调项通过插件 `head` 注入 `<style>` 设置变量；**不要在 typography.css 里重复声明这些变量**——dev 下 Vite 异步注入的样式排在 head 内联样式之后，同选择器会被覆盖（2026-09-26 实测坑，`--lp-serif-pack` 用 `var(--lp-serif-pack,)` 空回退解决）。

## 已踩过的坑

- **行距档位梯度（0.2.0 起；0.4.0 改三档+行距偏好）**：控件在 `<html>` 上设 `data-lp-step`（0–4=14/15.5/17/19/22px（0.4.0 曾折衷三档 15/17/22，用户实测后 0.4.1 恢复五档）），typography.css 用 `html[data-lp-step=N]` 选择器按档设 `--lp-lh-base`（14px→2.1 / 15.5px→2.05 / 17px→2 / 19px→1.95 / 22px→1.9=0.2.x 梯度的 C 定稿值），`data-lp-spacing=0/1/2` 再乘 `--lp-lh-scale` 0.9/1/1.1（TypographyDropdown 行距档）；缩进开关 `data-typo-indent=1` → `text-indent: 2em`，最终 `line-height: calc(base×scale)`。该选择器优先级高于插件 head 注入的 `:root` 变量，不受 dev 异步 Vite 样式排序影响（避开了下方第 3 条的坑）。**插件默认档（17px）lineHeight 默认值就是 2**——首访无 JS/reset 归零都走注入值，与 `data-lp-step=2` 渲染一致；预绘制内联脚本恢复 localStorage 时必须连同 `data-lp-step`（以及 0.4.0 的 `data-lp-spacing`/`data-lp-hang`）一起恢复，否则非默认档读者首屏闪跳。非当档存值（含 0.4.0 三档折衷期的 15px 等）由预绘制脚本按最近档迁移。
- **悬挂开关（0.4.0）**：`data-lp-hang="1"` → `hanging-punctuation: first allow-end`；Safari 与 Chromium 139+ 支持，旧引擎忽略声明即不悬挂（无副作用降级）。
- **外观控件 storage 语义（AppearanceSelect）**：`lp-appearance` 单一真值源（auto=不存 / `light` / `dark` / `paper:<id>`），同时**镜像写 Starlight 的 `starlight-theme`**（auto→`''`、light/dark→同值、paper→绑定明暗态）。Starlight ThemeProvider 内联脚本执行顺序不可控，故 `index.ts` 预绘制脚本也**确定性写镜像**（每次加载多一次 localStorage 写，成本可忽略）——从根上消除顺序依赖，勿回退成「首帧只读」。无 `lp-appearance` 时沿用旧 `starlight-theme`（ThemeSelect 时代存量迁移）。
- **纸张色 id 与 bg 不总相等（历史实例 `ffeeee-2`，该档已随 2026-10-19 裁撤移除，教训保留）**：曾有两档同底 `#FFEEEE` 不同字色，id 不能都用 bg hex——红字档定 `ffeeee-2`。存储值/事件值是 `paper:<id>`。主题组件本身不查正则（走 `presetOf` 精确查表）；正则是消费方 feature-tracking 侧的门槛示例：`/^paper:[a-f0-9][a-f0-9-]*$/`（`paper:xyz` / `paper:#ffeeee` / `paper:` 一律 null；兼容带连字符后缀的 id）。
- **warmDark 优先级抬权（paper.css）**：warmDark 注入 `:root[data-theme='dark']`（0,2,0）与 `:root[data-paper]`（0,2,0）打平靠源顺序——dev Vite 异步样式顺序不可靠（见下方「可调项变量不双写」条）。故 paper.css 所有纸张规则都带 `[data-theme]` 属性抬到 (0,3,0)/(0,4,0)，确定压过 warmDark 与其余 `:root` 覆写。

- **本地同名字体遮蔽 webfont**：字体栈里族名顺序敏感——若 SC 排在 TC 前，装有本地 Noto Serif SC 的机器上繁体页会用本地 SC 渲染而 TC webfont 永不加载。插件用 `--lp-serif-pack` 注入把启用的族名置顶，typography.css 的 fallback 栈里**不要**写 Noto 族名。
- **插件解析字体包路径**：字体包是*站点*的依赖，必须 `createRequire(process.cwd())` 从项目根解析，不能用 `import.meta.resolve`（从主题包位置向上找不到）。
- **file: 依赖的 dev 调试**：本站群通过 `file:../starlight-theme-large-print/...` 引用，消费工程需在 `vite.server.fs.allow` 放行主题所在父目录（仅 dev 需要）。
- **fonttools 环境**（重新生成字体子集时用）：WSL Python 是 PEP 668 托管环境，无 pip/ensurepip；用 `python3 -m venv --without-pip /tmp/fontvenv && /tmp/fontvenv/bin/python get-pip.py && /tmp/fontvenv/bin/pip install fonttools brotli`。

## 升级跟踪

Starlight 升级时 diff 消费工程 `node_modules/@astrojs/starlight/dist/style/` 的 `props.css`（变量名）与 `markdown.css`（`.sl-markdown-content` 选择器写法）——主题的扩展点都在这两个文件里。GitHub main 仅作超前参考，以钉住版本的本地产物为准。

## demo、验证与发布

- 公开 demo 为 `https://www.xianmi.co/starlight/`。改 demo 后运行其标准 build 与现有浏览器/WCAG 检查；公开教程和 README 只描述可复用的安装与配置方式。
- 三包（theme / font-noto-serif-sc / font-noto-serif-tc）同批对齐版本；对外版本史=`packages/theme/CHANGELOG.md`，不在本文件重复版本流水账。
- **README 双份同步**：仓根 `README.md` 与 `packages/theme/README.md` 同步维护；插图一律 raw.githubusercontent 绝对 URL。版本 bump 后同步各 package/package-lock 与 demo 依赖规格，registry 形态应与真实用户安装一致。
- 官方收录见 [Starlight themes](https://starlight.astro.build/resources/themes/) 与 [Starlight plugins](https://starlight.astro.build/resources/plugins/)；已收录条目勿重复提交。awesome-list 调研只保留公开条目与公开 demo URL。

## Backlog（下版候选，未立项）

- ~~纸张色逐档手工 accent 配色~~（2026-10-19 随 4+1 重构关闭）：0.5.2 的单色派生保留为定稿方案（accent=纸色字色零撞色；4+1 重构引入种子色→WCAG 断言生成管线，逐档手工配色需求被「断言兜底+手工微调仅断言不过处」取代）。

- **README 插图重拍**：`media/appearance-panel-open.png` 仍是 14 档网格旧图、`media/paper-color-reading.png` 仍是已砍深蓝档（0.6.2 起面板=跟随系统/浅色/深色+3 纸张网格；图注已改通用表述过渡）。下次更新 demo 后重拍两张替换（README 用 raw 绝对 URL，同名覆盖即可）。

- **宋/楷双字体候选**（2026-10-19 用户拍板记录，不立项）：正文宋体+偈颂/引文楷体的双字体排版是中文书刻传统形态。候选路径=系统字体栈先行验证（各平台楷体族名实测：KaiTi/STKaiti/楷体 等覆盖差异），验证充分前不引入新 webfont 包。

- **组件内置简繁 i18n 默认 labels（按页 `<html lang>` 自适应）**：TypographyDropdown/AppearanceSelect 现缺省简体，繁体消费方须逐站传正体 labels。现有简体与繁体两个消费实例证明了默认 labels 的复用价值；下版主题可内置 zh-Hans/zh-Hant 两套缺省按页 lang 自动选，消费方零 props。
