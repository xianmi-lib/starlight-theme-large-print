---
title: Getting Started
description: Install and configure starlight-theme-large-print.
---

## Install

```bash
npm install starlight-theme-large-print
# optional: one CJK font pack
npm install starlight-theme-large-print-font-noto-serif-sc   # Simplified Chinese
npm install starlight-theme-large-print-font-noto-serif-tc   # Traditional Chinese
```

## Configure

Add the plugin to your Starlight `plugins` array in `astro.config.mjs`:

```js
import starlightThemeLargePrint from 'starlight-theme-large-print';

export default defineConfig({
  integrations: [
    starlight({
      plugins: [
        starlightThemeLargePrint({
          font: 'noto-serif-sc', // 'noto-serif-sc' | 'noto-serif-tc' | false
          // baseFontSize: '17px',
          // lineHeight: 1.85,
          // warmDark: true,
        }),
      ],
    }),
  ],
});
```

## Add the font-size control

The theme does not auto-inject the `A− A A+` control (auto-overriding a Starlight component would collide with other themes). Render it in your own `Header` override, next to `<ThemeSelect />`:

```astro
---
import FontSizeControl from 'starlight-theme-large-print/components/FontSizeControl.astro';
---

<FontSizeControl />
```

### Dropdown variant: `FontSizeSelect`

A dropdown (native `<select>`) variant showing the current step by name — same five steps, same persistence, so reader preferences carry over between the two. Step labels and the accessible name are props for localization:

```astro
---
import FontSizeSelect from 'starlight-theme-large-print/components/FontSizeSelect.astro';
---

<FontSizeSelect labels={['小', '稍小', '标准', '大', '特大']} ariaLabel="字号" />
```

Both components may coexist on one page (they stay in sync via `data-lp-step`), though sites will typically pick one.

## Options

| Option | Default | Description |
| --- | --- | --- |
| `font` | `false` | `'noto-serif-sc'` \| `'noto-serif-tc'` \| `false`. Requires the matching font package. |
| `baseFontSize` | `'17px'` | Base body font size; readers can override it with the font-size control. |
| `lineHeight` | `1.85` | Body line height. |
| `warmDark` | `true` | Warm paper-tone dark mode background. |
