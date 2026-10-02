import { createRequire } from 'node:module'

import type { StarlightPlugin } from '@astrojs/starlight/types'

export interface LargePrintConfig {
	/**
	 * Self-hosted CJK serif font pack to enable.
	 * Requires the matching optional package:
	 * - `'noto-serif-sc'` → `starlight-theme-large-print-font-noto-serif-sc`
	 * - `'noto-serif-tc'` → `starlight-theme-large-print-font-noto-serif-tc`
	 * - `false` → no web font, the serif system font stack is used.
	 * @default false
	 */
	font?: 'noto-serif-sc' | 'noto-serif-tc' | false
	/**
	 * Base body font size applied to page content.
	 * Readers can override it with the FontSizeControl component.
	 * @default '17px'
	 */
	baseFontSize?: string
	/**
	 * Body line height for page content at the default font-size step (17px).
	 * When the FontSizeControl component is used, line height scales with the
	 * reader's font-size step (smaller size → looser leading):
	 * 14px→2.15 / 15.5px→2.05 / 17px→this value / 19px→1.90 / 22px→1.80.
	 * @default 2
	 */
	lineHeight?: number
	/**
	 * Shift the dark theme background towards a warm paper-like tone.
	 * @default true
	 */
	warmDark?: boolean
}

const FONT_PACKAGES: Record<string, { css: string; family: string }> = {
	'noto-serif-sc': { css: 'starlight-theme-large-print-font-noto-serif-sc/fonts.css', family: 'Noto Serif SC' },
	'noto-serif-tc': { css: 'starlight-theme-large-print-font-noto-serif-tc/fonts.css', family: 'Noto Serif TC' },
}

export default function starlightThemeLargePrint(userConfig: LargePrintConfig = {}): StarlightPlugin {
	const { font = false, baseFontSize = '17px', lineHeight = 2, warmDark = true } = userConfig

	return {
		name: 'starlight-theme-large-print',
		hooks: {
			'config:setup'({ config, logger, updateConfig }) {
				const customCss = [...(config.customCss ?? []), 'starlight-theme-large-print/styles/typography.css']

				if (font) {
					const pack = FONT_PACKAGES[font]!
					// The font pack is a dependency of the *site*, so resolve from the
					// project root, not from this plugin's own location.
					const projectRequire = createRequire(`${process.cwd()}/`)
					let resolved = false
					try {
						projectRequire.resolve(pack.css)
						resolved = true
					} catch {
						resolved = false
					}
					if (resolved) {
						customCss.push(pack.css)
					} else {
						logger.warn(
							`Font "${font}" requires the optional package "${pack.css.split('/')[0]}". ` +
								`Install it or set \`font: false\`. Falling back to the system serif stack.`
						)
					}
				}

				const warmDarkCss = warmDark
					? ":root[data-theme='dark']{--sl-color-black:oklch(16% 0.012 60);--sl-color-gray-6:oklch(21% 0.014 60);--sl-color-gray-5:oklch(26% 0.015 60);}"
					: ''

				// Prepend the enabled pack's family to the serif stack (see typography.css).
				const packFamilyCss = font ? `:root{--lp-serif-pack:'${FONT_PACKAGES[font]!.family}',;}` : ''

				updateConfig({
					customCss,
					head: [
						...(config.head ?? []),
						{
							tag: 'style',
							content: `:root{--lp-base-size:${baseFontSize};--lp-line-height:${lineHeight};}${warmDarkCss}${packFamilyCss}`,
						},
						{
							// 预绘制内联脚本：首屏内联必须静态，字号列表在此硬编码。
							// ⚠️ 此列表与 FontSizeControl.astro 的 LP_STEPS 必须同步修改（改档位时两处一起改）。
							tag: 'script',
							content:
								"try{var s=localStorage.getItem('lp-font-size');if(s){var i=['14px','15.5px','17px','19px','22px'].indexOf(s);if(i>-1){var d=document.documentElement;d.style.setProperty('--lp-user-size',s);d.setAttribute('data-lp-step',String(i))}}}catch(e){}",
						},
					],
				})
			},
		},
	}
}
