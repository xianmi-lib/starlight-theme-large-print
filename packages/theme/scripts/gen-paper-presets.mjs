#!/usr/bin/env node
/**
 * gen-paper-presets.mjs — 纸张色预设单一真值源：种子色 → WCAG 断言 → 生成双份产物。
 *
 * 背景（2026-10-19，4+1 重构；2026-10-20 裁至 3 档）：14 档裁为 3 档纸张
 *（白纸档 0.6.2 裁撤——与「浅色」行实质重复；夜黑曾作暗色主题别名色块，
 * 0.6.1 用户拍板撤销、恢复独立「深色」文字行，均不在本表——本表只管纸张档）。
 * 方法论=「种子色→派生+断言」（派生规则在 paper.css 通用块
 * 用 color-mix 表达，本脚本用 OKLab 混合复算断言）：
 *   - 正文 text vs bg          ≥ 7.0（WCAG AAA 正常字）
 *   - gray-2（text 80% 混合）vs bg ≥ 4.5（WCAG AA 正常字；链接/次文本档位）
 *   - gray-3（65%）打印参考值（装饰性弱化文本，不断言）
 * 断言不过 = 构建失败；手工微调只在断言不过处介入（调种子色后重跑）。
 *
 * 产物（--check 只校验不写盘，漂移即 exit 1）：
 *   ① components/appearance-presets.ts —— 整文件生成（index.ts 预绘制脚本与
 *      AppearanceSelect.astro 都 import 它，站点消费零改动）。
 *   ② styles/paper.css 的 <GENERATED:paper-presets> 标记块（每档一条变量规则）。
 *
 * 用法：node scripts/gen-paper-presets.mjs [--check]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PKG = join(dirname(fileURLToPath(import.meta.url)), '..');

/** 种子表：3 档纸张（全 light 绑定）。「浅色」行即白色、与纸档不重复；
 * 白纸档 0.6.2 裁撤（用户拍板：与浅色行实质重复）。「深色」行/暗色主题不入表。
 * 浅棕/护眼绿色值=微信读书网页版（0.6.3 用户拍板，色值无版权问题）；字色 #1C1C1D 同源。
 * id=bg hex 随值变（faf9de→f6f2e1、e4f2e1→d3efd1），存量读者走未知 id 回落 auto。 */
const SEEDS = [
	// 微信读书「黄」bg #F6F2E1
	{ id: 'f6f2e1', bg: '#F6F2E1', text: '#1C1C1D', mode: 'light', name: '浅棕' },
	// 微信读书「绿」bg #D3EFD1
	{ id: 'd3efd1', bg: '#D3EFD1', text: '#1C1C1D', mode: 'light', name: '护眼绿' },
	// 老站怀旧纸底色（定值），黑字 16.9:1
	{ id: 'e9e8cf', bg: '#E9E8CF', text: '#000000', mode: 'light', name: '怀旧纸' },
];

// ── 色彩数学 ──────────────────────────────────────────────────────
const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const unlin = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);
const luminance = (hex) => {
	const [r, g, b] = hexToRgb(hex).map(lin);
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
};

const srgbToOklab = (hex) => {
	const [r, g, b] = hexToRgb(hex).map(lin);
	const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
	const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
	const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
	return [
		0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
		1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
		0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
	];
};
const oklabToHex = ([L, A, B]) => {
	const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
	const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
	const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
	const ch = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186144 * m + 1.707614701 * s]
		.map((c) => Math.round(Math.min(1, Math.max(0, unlin(c))) * 255).toString(16).padStart(2, '0'));
	return `#${ch.join('')}`;
};
/** 复算 paper.css 通用块的 color-mix(in oklab, text P%, bg)。 */
const oklabMix = (textHex, p, bgHex) => {
	const t = srgbToOklab(textHex);
	const b = srgbToOklab(bgHex);
	return oklabToHex([0, 1, 2].map((i) => t[i] * p + b[i] * (1 - p)));
};

// ── 断言 ──────────────────────────────────────────────────────────
let failed = 0;
const rows = [];
for (const s of SEEDS) {
	const cText = contrast(s.text, s.bg);
	const g2 = oklabMix(s.text, 0.8, s.bg);
	const cG2 = contrast(g2, s.bg);
	const g3 = oklabMix(s.text, 0.65, s.bg);
	const cG3 = contrast(g3, s.bg);
	const okText = cText >= 7;
	const okG2 = cG2 >= 4.5;
	if (!okText || !okG2) failed++;
	rows.push({ ...s, cText, g2, cG2, g3, cG3, okText, okG2 });
	console.log(
		`${s.name}（${s.id}）bg=${s.bg} text=${s.text}\n` +
			`  正文对比度   ${cText.toFixed(2)}:1  ${okText ? '✓ AAA' : '✗ 断言失败（≥7.0）'}\n` +
			`  gray-2(80%)  ${g2}  ${cG2.toFixed(2)}:1  ${okG2 ? '✓ AA' : '✗ 断言失败（≥4.5）'}\n` +
			`  gray-3(65%)  ${g3}  ${cG3.toFixed(2)}:1  （参考值，不断言）`
	);
}
if (failed) {
	console.error(`\n✗ ${failed} 档断言未过——微调种子色（加深字色）后重跑。`);
	process.exit(1);
}

// ── 产物生成 ──────────────────────────────────────────────────────
const presetsTs = `// ⚠️ 本文件由 scripts/gen-paper-presets.mjs 生成（种子色→WCAG 断言→双份产物），
// 勿手改——改种子色请改脚本 SEEDS 表后重跑（--check 为漂移门禁）。
// 纸张色预设（3 档；2026-10-20 白纸档裁撤——与「浅色」行重复，见 AppearanceSelect）。
// mode = 该预设绑定的明/暗态。id = bg 小写 hex 无 '#'（data-paper 与存储值用）。
export interface PaperPreset {
	/** 小写 hex，无 '#'。 */
	id: string;
	/** 底色，'#rrggbb'。 */
	bg: string;
	/** 字色，'#rrggbb'。 */
	text: string;
	/** 绑定明暗态（选纸张色后不跟随系统）。 */
	mode: 'light' | 'dark';
	/** 色名（tooltip/aria 缺省，简体）。 */
	name: string;
}

export const PAPER_PRESETS: readonly PaperPreset[] = [
${SEEDS.map((s) => `\t{ id: '${s.id}', bg: '${s.bg}', text: '${s.text}', mode: '${s.mode}', name: '${s.name}' },`).join('\n')}
];
`;

const paperBlock =
	`/* <GENERATED:paper-presets> 由 scripts/gen-paper-presets.mjs 生成，勿手改（改 SEEDS 重跑） */\n` +
	SEEDS.map((s) => `:root[data-paper='${s.id}'][data-theme] { --lp-paper-bg: ${s.bg}; --lp-paper-text: ${s.text}; }`).join('\n') +
	`\n/* </GENERATED:paper-presets> */`;

const PRESETS_PATH = join(PKG, 'components/appearance-presets.ts');
const PAPER_PATH = join(PKG, 'styles/paper.css');
const paperCss = readFileSync(PAPER_PATH, 'utf8');
const MARK = /\/\* <GENERATED:paper-presets>[\s\S]*?<\/GENERATED:paper-presets> \*\//;
if (!MARK.test(paperCss)) {
	console.error('✗ paper.css 缺 <GENERATED:paper-presets> 标记块');
	process.exit(1);
}
const nextPaperCss = paperCss.replace(MARK, paperBlock);

if (process.argv.includes('--check')) {
	const drift = [];
	if (readFileSync(PRESETS_PATH, 'utf8') !== presetsTs) drift.push('components/appearance-presets.ts');
	if (nextPaperCss !== paperCss) drift.push('styles/paper.css');
	if (drift.length) {
		console.error(`✗ 产物漂移：${drift.join('、')}——重跑 node scripts/gen-paper-presets.mjs`);
		process.exit(1);
	}
	console.log('✓ 断言全过，双份产物与 SEEDS 同步（appearance-presets.ts / paper.css）');
} else {
	writeFileSync(PRESETS_PATH, presetsTs);
	writeFileSync(PAPER_PATH, nextPaperCss);
	console.log('✓ 断言全过，已生成 components/appearance-presets.ts 与 styles/paper.css 标记块');
}
