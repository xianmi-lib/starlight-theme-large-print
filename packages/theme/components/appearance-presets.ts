// ⚠️ 本文件由 scripts/gen-paper-presets.mjs 生成（种子色→WCAG 断言→双份产物），
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
	{ id: 'f6f2e1', bg: '#F6F2E1', text: '#1C1C1D', mode: 'light', name: '浅棕' },
	{ id: 'd3efd1', bg: '#D3EFD1', text: '#1C1C1D', mode: 'light', name: '护眼绿' },
	{ id: 'e9e8cf', bg: '#E9E8CF', text: '#000000', mode: 'light', name: '怀旧纸' },
];
