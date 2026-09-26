---
title: Typography
description: The typographic choices of starlight-theme-large-print.
---

This page demonstrates the theme's typographic voice: a quiet serif for long-form reading.

## Reading comfort first

The theme sets body text at 17px with a 1.85 line height — a deliberate step up from Starlight's 16px / 1.75 defaults. Paragraphs breathe a little more, and headings stay in the same serif family as the body so the reading voice never breaks.

### Smaller heading

Even at deeper levels, headings remain quiet and literary rather than loud.

#### Fourth-level heading

Long-form content benefits from restraint. The quick brown fox jumps over the lazy dog. Sphinx of black quartz, judge my vow. Pack my box with five dozen liquor jugs.

## Lists and emphasis

- Serif body text at a comfortable reading size
- **Bold text** uses the matching serif bold weight
- *Italic text* falls back gracefully for CJK scripts
- `Inline code` keeps a monospace voice at a readable size

1. Numbered lists inherit the same rhythm
2. Line length stays within the comfortable zone on wide screens
3. Readers can enlarge everything with the header control

> Blockquotes keep the same serif voice. "The best interface is the one that lets the text speak for itself."

## Code

```ts
// Code blocks keep Starlight's Expressive Code rendering untouched.
export function greet(name: string): string {
  return `Hello, ${name}!`;
}
```
