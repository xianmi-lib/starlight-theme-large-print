# starlight-theme-large-print

An elder-friendly reading theme for [Astro Starlight](https://starlight.astro.build/): larger serif body text, a reader font-size control, warm dark mode, and optional self-hosted CJK serif webfonts — built for long-form reading sites with older audiences.

**[Live demo](https://www.xianmi.co/starlight/)** · Born from [显密文库 xianmi.co](https://www.xianmi.co/), a 120k-page Buddhist digital library serving mainly elderly readers of classical Chinese texts.

## Features

- **Large serif body text** — 17px / 2.0 line height by default (Starlight ships 16px / 1.75), with slightly looser paragraph rhythm. All values are plain CSS variables, no `!important`.
- **Reader font-size control** — an `A− A A+` component with five steps (14–22px), persisted to `localStorage` and re-applied before first paint (no flash). Line height scales with the chosen step — smaller sizes get looser leading (14px→2.10, 15.5px→2.05, 17px→`lineHeight` (2.0 by default), 19px→1.95, 22px→1.90).
- **Warm dark mode** — shifts the dark background from blue-black to a paper-like warm brown.
- **Appearance & paper-color control** — an "Appearance" dropdown that replaces Starlight's theme picker with 17 choices: follow system / light / dark, plus 14 paper colors (warm reading backgrounds, each bound to a light or dark mode). Persisted to `localStorage` and re-applied before first paint (no flash).
- **Optional self-hosted CJK webfonts** — Noto Serif SC / TC packs built from Google Fonts' `unicode-range` woff2 subsets, served from your own site. Visitors only download the handful of subsets their page actually uses (typically < 200 KB). Works where Google Fonts is blocked.
- **Plays well with other themes** — typography-only by design; tested alongside [`starlight-theme-rapide`](https://github.com/HiDeoo/starlight-theme-rapide).

## Installation

```bash
npm install starlight-theme-large-print
# optional: a CJK font pack (pick one, or none for the system serif stack)
npm install starlight-theme-large-print-font-noto-serif-sc   # Simplified Chinese
npm install starlight-theme-large-print-font-noto-serif-tc   # Traditional Chinese
```

## Usage

Add the plugin to your Starlight `plugins` array in `astro.config.mjs`:

```js
import starlight from '@astrojs/starlight';
import starlightThemeLargePrint from 'starlight-theme-large-print';

export default defineConfig({
  integrations: [
    starlight({
      title: 'My Docs',
      plugins: [
        starlightThemeLargePrint({
          font: 'noto-serif-sc', // 'noto-serif-sc' | 'noto-serif-tc' | false
        }),
      ],
    }),
  ],
});
```

### Font-size control

The theme exports a `FontSizeControl` component but does **not** auto-inject it (auto-overriding a Starlight component would collide with other themes). Render it inside your own [component override](https://starlight.astro.build/guides/overriding-components/), e.g. in a custom `Header.astro` next to `<ThemeSelect />` (or next to `AppearanceSelect` below):

```astro
---
import FontSizeControl from 'starlight-theme-large-print/components/FontSizeControl.astro';
---

<FontSizeControl />
```

A dropdown variant, `FontSizeSelect`, is also available (0.3.0+). Same five steps and the same persistence mechanism, so reader preferences carry over between the two; step labels are props for localization:

```astro
---
import FontSizeSelect from 'starlight-theme-large-print/components/FontSizeSelect.astro';
---

<FontSizeSelect labels={['小', '稍小', '标准', '大', '特大']} ariaLabel="字号" />
```

### Appearance & paper-color control

`AppearanceSelect` (0.5.0+) is a dropdown that **replaces** Starlight's `<ThemeSelect />` — do not render both (it mirrors its state to Starlight's `starlight-theme` key, so the two never fight over the theme). It offers 17 choices — follow system / light / dark, plus 14 paper colors, each bound to a light or dark mode — persisted to `localStorage` and re-applied before first paint. Like the font-size control, it is exported but not auto-injected; render it in your Header override:

```astro
---
import AppearanceSelect from 'starlight-theme-large-print/components/AppearanceSelect.astro';
---

<AppearanceSelect />
```

All UI strings are `labels` props for localization — `trigger`, `followSystem`, `light`, `dark`, `paperGroup`, and `paperNames` (14 color names in preset order). Defaults are Simplified Chinese:

```astro
<AppearanceSelect labels={{ trigger: '外觀', followSystem: '跟隨系統', light: '淺色', dark: '深色', paperGroup: '紙張色' }} />
```

*The Appearance dropdown: follow system / light / dark, plus 14 paper colors.*

![Appearance dropdown open: follow system, light, dark, and a grid of 14 paper colors](https://raw.githubusercontent.com/xianmi-lib/starlight-theme-large-print/main/media/appearance-panel-open.png)

*A paper color in use — deep blue, with its bound dark mode.*

![Reading page on a deep-blue paper color](https://raw.githubusercontent.com/xianmi-lib/starlight-theme-large-print/main/media/paper-color-reading.png)

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `font` | `'noto-serif-sc' \| 'noto-serif-tc' \| false` | `false` | CJK webfont pack to enable. The matching `starlight-theme-large-print-font-*` package must be installed; otherwise the theme warns and falls back to the system serif stack. |
| `baseFontSize` | `string` | `'17px'` | Base body font size. Readers can override it with the font-size control. |
| `lineHeight` | `number` | `2` | Body line height at the default font-size step (17px). With `FontSizeControl` in use, other steps scale automatically (14px→2.10 … 22px→1.90). |
| `warmDark` | `boolean` | `true` | Warm paper-tone dark mode background. |

## How it works

- Everything is driven by CSS custom properties (`--lp-base-size`, `--lp-line-height`, `--lp-user-size`, `--lp-serif-stack`) injected via Starlight's `head` and `customCss` — no JavaScript on the render path, no `!important`, no component restyling that could break on Starlight upgrades.
- The font-size control sets `--lp-user-size` and `data-lp-step` (0–4) on `<html>`; typography rules map each step to its line height via `--lp-line-height`. A tiny inline script re-applies both before first paint.
- `AppearanceSelect` keeps its single source of truth in `localStorage` (`lp-appearance`) and reflects it to `<html>` as `data-theme` + `data-paper`, mirrored to Starlight's `starlight-theme` key. The same pre-paint inline script restores it; paper colors override Starlight's `--sl-color-*` palette variables (derived greys via `color-mix`, with a graceful fallback).
- Font packs register `Noto Serif SC`/`TC` via `@font-face` with `unicode-range`; the plugin prepends the enabled family to the serif stack so a locally installed same-named font of the *other* script can never shadow the webfont.

## Packages

| Package | Description |
| --- | --- |
| [`starlight-theme-large-print`](packages/theme) | Theme core: typography, warm dark mode, font-size and appearance components |
| [`starlight-theme-large-print-font-noto-serif-sc`](packages/font-noto-serif-sc) | Noto Serif SC webfont pack (Simplified Chinese, ~11.5 MB, 202 subsets) |
| [`starlight-theme-large-print-font-noto-serif-tc`](packages/font-noto-serif-tc) | Noto Serif TC webfont pack (Traditional Chinese, ~10.9 MB, 216 subsets) |

## Compatibility

- `@astrojs/starlight` >= 0.42
- Node >= 22.12

## License

MIT for the theme code. The Noto Serif font files in the font packs are licensed under the [SIL Open Font License 1.1](packages/font-noto-serif-sc/OFL.txt) (© Google / Adobe).
