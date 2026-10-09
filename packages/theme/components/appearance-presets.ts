// packages/theme/components/appearance-presets.ts
// 纸张色预设（13/14 项）：bg/text hex 照抄老站 goodweb.net.cn set_color；
// mode = 该预设绑定的明/暗态。id = bg 小写 hex 无 '#'（data-paper 与存储值用）。
// ⚠️ 同步点：index.ts 预绘制脚本构建期 JSON 序列化本表；AppearanceSelect.astro
// frontmatter 与客户端脚本 import 本文件（相对导入随组件打包）。
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
	{ id: 'ffffff', bg: '#FFFFFF', text: '#666666', mode: 'light', name: '白' },
	{ id: 'fefbe9', bg: '#FEFBE9', text: '#836243', mode: 'light', name: '米黄' },
	{ id: 'f1faf8', bg: '#F1FAF8', text: '#55773f', mode: 'light', name: '淡青' },
	{ id: 'f9f4ff', bg: '#F9F4FF', text: '#335d97', mode: 'light', name: '淡紫' },
	{ id: 'fffbec', bg: '#FFFBEC', text: '#777777', mode: 'light', name: '米白' },
	{ id: 'f4f9ff', bg: '#F4F9FF', text: '#777777', mode: 'light', name: '淡蓝' },
	{ id: 'ffeeee', bg: '#FFEEEE', text: '#666666', mode: 'light', name: '浅红' },
	{ id: 'eeeeee', bg: '#EEEEEE', text: '#333333', mode: 'light', name: '浅灰' },
	{ id: 'f4ebe1', bg: '#F4EBE1', text: '#633000', mode: 'light', name: '浅褐' },
	// 第 10 项与第 7 项同底不同字色，保留为两档（派单定稿）
	{ id: 'ffeeee-2', bg: '#FFEEEE', text: '#CC3333', mode: 'light', name: '红字' },
	{ id: '1562a8', bg: '#1562A8', text: '#ffffff', mode: 'dark', name: '深蓝' },
	{ id: '006666', bg: '#006666', text: '#ffffff', mode: 'dark', name: '墨绿' },
	{ id: '333333', bg: '#333333', text: '#cccccc', mode: 'dark', name: '深灰' },
	{ id: '191919', bg: '#191919', text: '#CCCCCC', mode: 'dark', name: '近黑' },
];
