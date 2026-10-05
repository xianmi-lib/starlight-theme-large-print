// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeLargePrint from 'starlight-theme-large-print';

// https://astro.build/config
// Deploys run on Cloudflare Workers Builds (push to main, watch demo/ + packages/theme/).
export default defineConfig({
	site: 'https://www.xianmi.co',
	base: '/starlight',
	integrations: [
		starlight({
			title: 'Large Print',
			description: 'Elder-friendly reading theme for Astro Starlight: large serif type, reader font-size control, warm dark mode, optional self-hosted CJK webfonts.',
			// 英文为默认语言（不翻译）；中文繁/简各演示一页字体包效果。
			locales: {
				root: { label: 'English', lang: 'en' },
				'zh-cn': { label: '简体中文', lang: 'zh-CN' },
				'zh-tw': { label: '繁體中文', lang: 'zh-TW' },
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/xianmi-lib/starlight-theme-large-print' },
			],
			components: {
				Header: './src/components/Header.astro',
			},
			sidebar: [
				{ label: 'Getting Started', slug: 'getting-started', translations: { 'zh-CN': '快速上手', 'zh-TW': '快速上手' } },
				{ label: 'Typography', slug: 'typography', translations: { 'zh-CN': '排版风格', 'zh-TW': '排版風格' } },
				{ label: '中文排版', slug: 'cjk' },
			],
			plugins: [starlightThemeLargePrint({ font: { 'zh-cn': 'noto-serif-sc', 'zh-tw': 'noto-serif-tc' } })],
		}),
	],
});
