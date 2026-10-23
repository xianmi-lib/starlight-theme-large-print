# Changelog

All notable changes to this project are documented here. Versions are published in lockstep across the three packages (`starlight-theme-large-print`, `-font-noto-serif-sc`, `-font-noto-serif-tc`); the font packages are content-stable and re-published for version alignment only.

## 0.6.4 (2026-10-21)

- Fix: reader font-size bootstrap no longer breaks on a dirty/invalid stored value — three-stage fallback (exact tier match → nearest-tier migration → default tier).
- Chore: `AppearanceSelect` dead code removed.

## 0.6.3 (2026-10-20)

- Paper colors: warm and relaxed-green presets now use WeChat Read's exact values (bg `#F6F2E1` / `#D3EFD1`, text `#1C1C1D`; WCAG AAA contrast 15.17 / 13.82). Preset ids renamed (`faf9de`→`f6f2e1`, `e4f2e1`→`d3efd1`); readers holding an unknown id fall back to `auto`.

## 0.6.2 (2026-10-20)

- White paper preset removed (duplicated the plain "light" row); paper grid 4→3; legacy `paper:ffffff` falls back to `auto`.

## 0.6.1 (2026-10-20)

- Appearance panel redesign: conventional follow-system / light / dark text rows (dark row returns to the theme's warm dark mode); paper-color grid only.

## 0.6.0 (2026-10-19)

- Paper colors 14→4, all AAA-asserted; seed→WCAG assertion generation pipeline (`scripts/gen-paper-presets.mjs`).

## 0.5.2 (2026-10-17)

- Paper presets now derive a full accent family (accent / text-accent / bg-accent / text-invert, color-mix for high/low) instead of letting Starlight's default blue punch through.

## 0.5.1 (2026-10-10)

- npm metadata completion: `homepage`, `repository` (with `directory`), `bugs`; minimal READMEs for the two font packages.

## 0.5.0 (2026-10-10)

- `AppearanceSelect` dropdown: appearance + 14 paper colors, `lp-appearance` + `starlight-theme` mirror, pre-paint without flash; `paper.css` paper-color overrides; README revision.

## 0.4.2 (2026-10-07)

- Control dividers, mobile squeeze fix, typography trigger UI fixes; font-size threshold icon at 22rem.

## 0.4.1 (2026-10-07)

- Font size back to five tiers; first-line indent added as a fourth control.

## 0.4.0 (2026-10-07)

- `TypographyDropdown`: three font-size controls (tier compromise).

## 0.2.0 / 0.3.0 (2026-09, repo-internal)

- Line-height gradient, `FontSizeSelect` — never published to npm.

## 0.1.0 (2026-09-26)

- Initial release: larger serif body text, reader font-size control, warm dark mode, optional self-hosted CJK serif fonts.
