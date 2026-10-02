# starlight-theme-large-print

An elder-friendly reading theme for [Astro Starlight](https://starlight.astro.build/): larger serif body text, a reader font-size control, warm dark mode, and optional self-hosted CJK serif webfonts — built for long-form reading sites with older audiences.

**[Live demo](https://starlight-theme-large-print.chenlong365.workers.dev/)** · Born from [显密文库 xianmi.co](https://www.xianmi.co/), a 120k-page Buddhist digital library serving mainly elderly readers of classical Chinese texts.

## Features

- **Large serif body text** — 17px / 2.0 line height by default (Starlight ships 16px / 1.75), with slightly looser paragraph rhythm. All values are plain CSS variables, no `!important`.
- **Reader font-size control** — an `A− A A+` component with five steps (14–22px), persisted to `localStorage` and re-applied before first paint (no flash). Line height scales with the chosen step — smaller sizes get looser leading (14px→2.15, 15.5px→2.05, 17px→2.0, 19px→1.9, 22px→1.8).
- **Warm dark mode** — shifts the dark background from blue-black to a paper-like warm brown.
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

The theme exports a `FontSizeControl` component but does **not** auto-inject it (auto-overriding a Starlight component would collide with other themes). Render it inside your own [component override](https://starlight.astro.build/guides/overriding-components/), e.g. in a custom `Header.astro` next to `<ThemeSelect />`:

```astro
---
import FontSizeControl from 'starlight-theme-large-print/components/FontSizeControl.astro';
---

<FontSizeControl />
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `font` | `'noto-serif-sc' \| 'noto-serif-tc' \| false` | `false` | CJK webfont pack to enable. The matching `starlight-theme-large-print-font-*` package must be installed; otherwise the theme warns and falls back to the system serif stack. |
| `baseFontSize` | `string` | `'17px'` | Base body font size. Readers can override it with the font-size control. |
| `lineHeight` | `number` | `2` | Body line height at the default font-size step (17px). With `FontSizeControl` in use, other steps scale automatically (14px→2.15 … 22px→1.8). |
| `warmDark` | `boolean` | `true` | Warm paper-tone dark mode background. |

## How it works

- Everything is driven by CSS custom properties (`--lp-base-size`, `--lp-line-height`, `--lp-user-size`, `--lp-serif-stack`) injected via Starlight's `head` and `customCss` — no JavaScript on the render path, no `!important`, no component restyling that could break on Starlight upgrades.
- The font-size control sets `--lp-user-size` and `data-lp-step` (0–4) on `<html>`; typography rules map each step to its line height via `--lp-line-height`. A tiny inline script re-applies both before first paint.
- Font packs register `Noto Serif SC`/`TC` via `@font-face` with `unicode-range`; the plugin prepends the enabled family to the serif stack so a locally installed same-named font of the *other* script can never shadow the webfont.

## Packages

| Package | Description |
| --- | --- |
| [`starlight-theme-large-print`](packages/theme) | Theme core: typography, warm dark mode, `FontSizeControl` component |
| [`starlight-theme-large-print-font-noto-serif-sc`](packages/font-noto-serif-sc) | Noto Serif SC webfont pack (Simplified Chinese, ~11.5 MB, 202 subsets) |
| [`starlight-theme-large-print-font-noto-serif-tc`](packages/font-noto-serif-tc) | Noto Serif TC webfont pack (Traditional Chinese, ~10.9 MB, 216 subsets) |

## Compatibility

- `@astrojs/starlight` >= 0.42
- Node >= 22.12

## License

MIT for the theme code. The Noto Serif font files in the font packs are licensed under the [SIL Open Font License 1.1](packages/font-noto-serif-sc/OFL.txt) (© Google / Adobe).
