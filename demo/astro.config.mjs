// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeLargePrint from 'starlight-theme-large-print';

// https://astro.build/config
export default defineConfig({
	site: 'https://www.xianmi.co',
	base: '/starlight',
	integrations: [
		starlight({
			title: 'Large Print',
			description: 'Elder-friendly reading theme for Astro Starlight: large serif type, reader font-size control, warm dark mode, optional self-hosted CJK webfonts.',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/xianmi-lib/starlight-theme-large-print' },
			],
			components: {
				Header: './src/components/Header.astro',
			},
			sidebar: [
				{ label: 'Getting Started', slug: 'getting-started' },
				{ label: 'Typography', slug: 'typography' },
				{ label: '中文排版', slug: 'cjk' },
			],
			plugins: [starlightThemeLargePrint({ font: 'noto-serif-sc' })],
		}),
	],
});
