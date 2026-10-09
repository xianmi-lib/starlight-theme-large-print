# Listing draft — Starlight official themes + awesome lists

Research date: 2026-10-10. **Draft only — nothing submitted.** All external PRs wait for maintainer review.

Sources checked live:
- [withastro/starlight `CONTRIBUTING.md` §Themes](https://github.com/withastro/starlight/blob/main/CONTRIBUTING.md#themes)
- [`docs/src/content/docs/resources/themes.mdx`](https://github.com/withastro/starlight/blob/main/docs/src/content/docs/resources/themes.mdx) (entry format: `ThemeGrid` `themes` array)
- `trueberryless-org/awesome-starlight` and `riderx/awesome-starlight` (the two live "awesome-starlight" lists)

---

## 1. withastro/starlight — official Themes page

Per `CONTRIBUTING.md` §Themes:

1. Set up a development environment per the CONTRIBUTING "Setting up a development environment" instructions.
2. Take light + dark screenshots **using the official demo project**:
   1. Open the [theme demo project on StackBlitz](https://stackblitz.com/edit/github-jj1kzx5x?file=astro.config.mjs).
   2. In its integrated terminal: `npm i starlight-theme-large-print`.
   3. Update `astro.config.mjs` to import the theme and add it to Starlight's `plugins` array.
   4. `npm run dev`, open the preview in a new tab, and use dev tools' responsive view at **1280×720** to capture light and dark modes.
3. Add both screenshots to `docs/src/assets/themes/` — PNG, exactly 1280×720, named `<theme-slug>-light.png` / `<theme-slug>-dark.png`:
   - `large-print-light.png`
   - `large-print-dark.png`
4. Append an entry **at the end** of the `themes` array in `docs/src/content/docs/resources/themes.mdx`:

   ```js
   {
     title: 'Large Print',
     description:
       'Elder-friendly reading theme: large serif type, a reader font-size control, warm dark mode, and optional self-hosted CJK webfonts.',
     href: 'https://www.xianmi.co/starlight/',
     previews: { light: 'large-print-light.png', dark: 'large-print-dark.png' },
   },
   ```

   Attribute rules from CONTRIBUTING: `title` = theme name; `description` = brief aesthetic / inspiration / key features; `href` = URL of the theme's website demonstrating the look; `previews` = object with the two screenshot filenames.
5. Open a pull request.

Naming note: `title: 'Large Print'` matches the demo site brand and the existing awesome-list entry; the npm package name stays `starlight-theme-large-print` (slug for filenames: `large-print`).

## 2. awesome-starlight lists

Two live lists found (no `astro-community/awesome-starlight` exists):

| List | Nature | Our status |
| --- | --- | --- |
| [`trueberryless-org/awesome-starlight`](https://github.com/trueberryless-org/awesome-starlight) (36★) | Themes/Plugins sections **auto-discovered weekly** (npm name/keywords containing `starlight`, or presence in official Starlight docs) | **Already listed** as "Large Print" → `https://starlight-theme-large-print.chenlong365.workers.dev/` (stale workers.dev URL) |
| [`riderx/awesome-starlight`](https://github.com/riderx/awesome-starlight) (24★) | Manual PR list, [sindresorhus/awesome guidelines](https://github.com/sindresorhus/awesome/blob/main/contributing.md) | Not listed — PR possible |

Implications:

- For `trueberryless-org/awesome-starlight`: **no PR needed** for the Themes section (auto). Levers are (a) landing the official `themes.mdx` entry and (b) keeping `starlight` in the npm package name/keywords. The stale workers.dev URL is worth watching after the official listing goes live — whether the auto-updater adopts the `themes.mdx` `href` is unverified.
- For `riderx/awesome-starlight`, proposed entry (append under `### List of themes`, style `- [Name](demo-url) - description.`):

  ```md
  - [Large Print](https://www.xianmi.co/starlight/) - Elder-friendly reading theme for Starlight: large serif type, a reader font-size control, warm dark mode, and optional self-hosted CJK webfonts.
  ```

  Note: `https://www.xianmi.co` is the live demo host (`/starlight/` route, Cloudflare Workers). If a neutral demo host is preferred before submitting, repoint `href` first — the same URL is what the official `themes.mdx` entry should use.

## 3. Screenshot gap (blocking for the official PR)

Required (CONTRIBUTING, exact): two PNGs, **exactly 1280×720**, light + dark modes, produced from the **StackBlitz theme demo project** installing the published npm package, named `large-print-light.png` / `large-print-dark.png`.

Currently available (repo `media/`, used as README illustrations):

| File | Size | Content | Usable for listing? |
| --- | --- | --- | --- |
| `media/appearance-panel-open.png` | 2560×1440 full-page | Appearance dropdown open (17 items) | No — wrong dimensions, full-page, feature-focused |
| `media/paper-color-reading.png` | 2560×1440 full-page | Deep-blue paper color reading state | No — wrong dimensions, paper mode not light/dark pair |

Still missing:

1. `large-print-light.png` — 1280×720 viewport (not full-page) capture of a representative docs content page (sidebar + article) in light mode.
2. `large-print-dark.png` — same page in the theme's warm dark mode.
3. Provenance per CONTRIBUTING: captured from the StackBlitz demo project with `npm i starlight-theme-large-print` (not from our local demo build).
4. Prereq: the package version to be listed must be on npm. `0.4.2` already satisfies this; if 0.5.0 (AppearanceSelect) is published first, install that.

Open choices for whoever captures the pair: which demo page shows the theme best (existing entries use a content page with sidebar and body prose), and whether the dark shot is plain warm dark or a dark paper color (CONTRIBUTING just says "dark modes" — plain warm dark is the safer reading).
