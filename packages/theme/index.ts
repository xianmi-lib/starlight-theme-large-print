import { createRequire } from 'node:module'

import type { StarlightPlugin } from '@astrojs/starlight/types'

import { PAPER_PRESETS } from './components/appearance-presets'

export interface LargePrintConfig {
	/**
	 * Self-hosted CJK serif font pack(s) to enable.
	 * Requires the matching optional package:
	 * - `'noto-serif-sc'` → `starlight-theme-large-print-font-noto-serif-sc`
	 * - `'noto-serif-tc'` → `starlight-theme-large-print-font-noto-serif-tc`
	 * - `false` → no web font, the serif system font stack is used.
	 *
	 * Map form (for i18n sites): keys are Starlight locale keys (`root`,
	 * `zh-cn`, `zh-tw`, …), values are packs. Each non-root locale gets its
	 * pack scoped via `:root:lang(<locale lang>)`; the `root` entry (if any)
	 * sets the site-wide default, exactly like the string form.
	 * @example font: 'noto-serif-sc'
	 * @example font: { 'zh-cn': 'noto-serif-sc', 'zh-tw': 'noto-serif-tc' }
	 * @default false
	 */
	font?: 'noto-serif-sc' | 'noto-serif-tc' | false | Record<string, 'noto-serif-sc' | 'noto-serif-tc'>
	/**
	 * Base body font size applied to page content.
	 * Readers can override it with the FontSizeControl component.
	 * @default '17px'
	 */
	baseFontSize?: string
	/**
	 * Body line height for page content at the default font-size step (17px).
	 * Reader controls scale line height with the font-size step (smaller size →
	 * looser leading): 14px→2.10 / 15.5px→2.05 / 17px→this value / 19px→1.95 /
	 * 22px→1.90, and a spacing preference (TypographyDropdown) multiplies that
	 * base by 0.9 / 1 / 1.1.
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
				customCss.push('starlight-theme-large-print/styles/paper.css')

				// Normalize the font option to a locale→pack map. The string form
				// is shorthand for `{ root: <pack> }` (site-wide, legacy behavior).
				const fontMap: Record<string, 'noto-serif-sc' | 'noto-serif-tc'> =
					typeof font === 'string' ? { root: font } : (font ?? {})

				// The font packs are dependencies of the *site*, so resolve from the
				// project root, not from this plugin's own location.
				const projectRequire = createRequire(`${process.cwd()}/`)
				const loadedPacks = new Set<string>()
				const familyRules: string[] = []
				for (const [locale, packName] of Object.entries(fontMap)) {
					const pack = FONT_PACKAGES[packName]
					if (!pack) {
						logger.warn(`Unknown font "${packName}" (locale "${locale}") — expected one of ${Object.keys(FONT_PACKAGES).join(', ')}. Skipped.`)
						continue
					}
					let resolved = false
					try {
						projectRequire.resolve(pack.css)
						resolved = true
					} catch {
						resolved = false
					}
					if (!resolved) {
						logger.warn(
							`Font "${packName}" requires the optional package "${pack.css.split('/')[0]}". ` +
								`Install it or remove it from \`font\`. Falling back to the system serif stack.`
						)
						continue
					}
					if (!loadedPacks.has(packName)) {
						customCss.push(pack.css)
						loadedPacks.add(packName)
					}
					// Prepend the pack's family to the serif stack (see typography.css).
					// The root entry applies site-wide; other locales are scoped by
					// the <html lang> attribute Starlight renders for each locale.
					if (locale === 'root') {
						familyRules.push(`:root{--lp-serif-pack:'${pack.family}',;}`)
					} else {
						const localeConfig = (config.locales as Record<string, { lang?: string }> | undefined)?.[locale]
						const lang = localeConfig?.lang ?? locale
						familyRules.push(`:root:lang(${lang}){--lp-serif-pack:'${pack.family}',;}`)
					}
				}

				const warmDarkCss = warmDark
					? ":root[data-theme='dark']{--sl-color-black:oklch(16% 0.012 60);--sl-color-gray-6:oklch(21% 0.014 60);--sl-color-gray-5:oklch(26% 0.015 60);}"
					: ''

				const packFamilyCss = familyRules.join('')

				updateConfig({
					customCss,
					head: [
						...(config.head ?? []),
						{
							tag: 'style',
							content: `:root{--lp-base-size:${baseFontSize};--lp-line-height:${lineHeight};}${warmDarkCss}${packFamilyCss}`,
						},
						{
							// 预绘制内联脚本：首屏内联必须静态，字号/行距/悬挂/缩进列表在此硬编码；
							// 末段解析外观（lp-appearance / 纸张色）——纸张色表 PAPER_PRESETS 构建期
							// JSON 序列化注入脚本头部，尾部镜像写 starlight-theme（确定性写镜像，
							// 消除与 Starlight ThemeProvider 内联脚本的执行顺序依赖）。
							// ⚠️ 档位列表与 FontSizeControl / FontSizeSelect / TypographyDropdown 的
							// LP_STEPS 必须同步修改（组件各自内联打包，有意多写，改档位时几处一起改）。
							// 非当档存值（含 0.4.0 三档折衷期的 15px 等）按最近档迁移。
							tag: 'script',
							content:
								`var P=${JSON.stringify(PAPER_PRESETS)};` +
								"try{var d=document.documentElement;var s=localStorage.getItem('lp-font-size');if(s){var L=['14px','15.5px','17px','19px','22px'],i=L.indexOf(s);if(i<0){var n=parseFloat(s),bd=1e9;for(var k=0;k<L.length;k++){var dd=Math.abs(parseFloat(L[k])-n);if(dd<bd){bd=dd;i=k}}}d.style.setProperty('--lp-user-size',L[i]);d.setAttribute('data-lp-step',String(i))}var sp=localStorage.getItem('lp-lh-spacing');if(sp==='0'||sp==='2'){d.setAttribute('data-lp-spacing',sp)}if(localStorage.getItem('lp-hang')==='1'){d.setAttribute('data-lp-hang','1')}if(localStorage.getItem('lp-indent')==='1'){d.setAttribute('data-typo-indent','1')}}catch(e){}" +
								"try{var ap=localStorage.getItem('lp-appearance');if(!ap){var st2=localStorage.getItem('starlight-theme');ap=(st2==='light'||st2==='dark')?st2:'auto'}var pmode='auto',pid=null;if(ap.indexOf('paper:')===0){var pz=ap.slice(6);for(var pi=0;pi<P.length;pi++){if(P[pi].id===pz){pid=P[pi].id;pmode=P[pi].mode;break}}if(!pid){pmode='auto'}}else if(ap==='light'||ap==='dark'){pmode=ap}var pres=pmode==='auto'?(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'):pmode;d.setAttribute('data-theme',pres);if(pid){d.setAttribute('data-paper',pid)}else{d.removeAttribute('data-paper')}try{localStorage.setItem('starlight-theme', pid?pres:(pmode==='auto'?'':pmode))}catch(e){}}catch(e){}",
						},
					],
				})
			},
		},
	}
}
