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
	 * Body line height for page content.
	 * @default 1.85
	 */
	lineHeight?: number
	/**
	 * Shift the dark theme background towards a warm paper-like tone.
	 * @default true
	 */
	warmDark?: boolean
}

const FONT_PACKAGES: Record<string, string> = {
	'noto-serif-sc': 'starlight-theme-large-print-font-noto-serif-sc/fonts.css',
	'noto-serif-tc': 'starlight-theme-large-print-font-noto-serif-tc/fonts.css',
}

export default function starlightThemeLargePrint(userConfig: LargePrintConfig = {}): StarlightPlugin {
	const { font = false, baseFontSize = '17px', lineHeight = 1.85, warmDark = true } = userConfig

	return {
		name: 'starlight-theme-large-print',
		hooks: {
			'config:setup'({ config, logger, updateConfig }) {
				const customCss = [...(config.customCss ?? []), 'starlight-theme-large-print/styles/typography.css']

				if (font) {
					const specifier = FONT_PACKAGES[font]!
					// The font pack is a dependency of the *site*, so resolve from the
					// project root, not from this plugin's own location.
					const projectRequire = createRequire(`${process.cwd()}/`)
					let resolved = false
					try {
						projectRequire.resolve(specifier)
						resolved = true
					} catch {
						resolved = false
					}
					if (resolved) {
						customCss.push(specifier)
					} else {
						logger.warn(
							`Font "${font}" requires the optional package "${specifier.split('/')[0]}". ` +
								`Install it or set \`font: false\`. Falling back to the system serif stack.`
						)
					}
				}

				const warmDarkCss = warmDark
					? ":root[data-theme='dark']{--sl-color-black:oklch(16% 0.012 60);--sl-color-gray-6:oklch(21% 0.014 60);--sl-color-gray-5:oklch(26% 0.015 60);}"
					: ''

				updateConfig({
					customCss,
					head: [
						...(config.head ?? []),
						{
							tag: 'style',
							content: `:root{--lp-base-size:${baseFontSize};--lp-line-height:${lineHeight};}${warmDarkCss}`,
						},
						{
							tag: 'script',
							content:
								"try{var s=localStorage.getItem('lp-font-size');if(s)document.documentElement.style.setProperty('--lp-user-size',s)}catch(e){}",
						},
					],
				})
			},
		},
	}
}
