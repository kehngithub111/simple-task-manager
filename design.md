# Design — supabase-practice Notes App

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## Genre
modern-minimal

## Macrostructure family
- Marketing pages (`/`, `/login`): H2 Split diptych — title + lede left, proof/form card right. Left-biased, never centred-everything.
- App pages (`/dashboard`, `/dashboard/tasks`): Workbench — bordered top bar + hairline tabular rows. Function carries the page.
- Content pages: n/a.

## Theme — Cobalt
- `--color-paper`   oklch(98.5% 0.004 250)
- `--color-paper-2` oklch(96.2% 0.006 250)
- `--color-rule`    oklch(90.5% 0.008 250)
- `--color-rule-2`  oklch(86% 0.010 250)
- `--color-muted`   oklch(55% 0.015 255)
- `--color-ink-2`   oklch(34% 0.018 257)
- `--color-ink`     oklch(24% 0.02 258)
- `--color-accent`  oklch(58% 0.20 256)
- `--color-accent-ink` oklch(98.5% 0.004 250)
- `--color-graphite` oklch(22% 0.016 260)
- `--color-focus`   oklch(58% 0.20 256)
- `--color-danger`  oklch(55% 0.18 25)

## Typography
- Display: Space Grotesk, weight 500/600, style normal, tracking -0.025em
- Body:    Inter, weight 400/500
- Mono:    JetBrains Mono, weight 400/500
- Display tracking: -0.025em
- Type scale anchor: --text-display = clamp(2.75rem, 5vw + 1rem, 4.5rem)

## Spacing
4-point named scale. Values in `globals.css`. Pages must use named tokens, never raw values.

## Motion
- Easings: cubic-bezier(0.16, 1, 0.3, 1) named `--ease-out`
- Reveal pattern: fade + 8px rise, once, 420ms max, stagger ≤ 60ms
- Reduced-motion fallback: opacity-only, ≤ 150 ms.

## Microinteractions stance
- Silent success, toasts only for failures
- Hover: cobalt underline-grow on links, 1px border-colour shift on surfaces
- Focus rings appear instantly, cobalt, never animated
- No `transition-all`, no hover lift, no bounce

## CTA voice
- Primary CTA: solid cobalt fill, 6px radius, verb-first copy ("Sign in", "Save changes", "Add task")
- Secondary CTA: hairline bordered, 6px radius, transparent
- No pills, no gradients, labels never wrap to two lines

## Per-page allowances
- Marketing pages MAY use Tier-A CSS art (code card only). No photos, no Lottie.
- App pages MUST NOT use enrichment — function carries the page.
- Content pages: typography only.

## What pages MUST share
- The wordmark `tasks/` in JetBrains Mono.
- The accent colour and its placement (≤ 5% per viewport).
- Space Grotesk + Inter + JetBrains Mono.
- CTA voice (6px radius, verb-first).
- Section heading rhythm (mono kicker + display heading, stacked single column).

## What pages MAY differ on
- Hero archetype within family (code card on `/`, form card on `/login`).
- App page density (home overview vs tasks table).

## Exports

### tokens.css (mirrored in globals.css @theme)
```css
:root {
  --color-paper:      oklch(98.5% 0.004 250);
  --color-paper-2:    oklch(96.2% 0.006 250);
  --color-ink:        oklch(24% 0.02 258);
  --color-ink-2:      oklch(34% 0.018 257);
  --color-rule:       oklch(90.5% 0.008 250);
  --color-accent:     oklch(58% 0.20 256);
  --color-accent-ink: oklch(98.5% 0.004 250);
  --color-focus:      oklch(58% 0.20 256);
  --font-display: "Space Grotesk", sans-serif;
  --font-body:    "Inter", sans-serif;
  --font-mono:    "JetBrains Mono", monospace;
  --space-3xs: 0.25rem;  --space-2xs: 0.5rem;  --space-xs: 0.75rem;
  --space-sm:  1rem;     --space-md:  1.5rem;  --space-lg: 2rem;
  --space-xl:  3rem;     --space-2xl: 4.5rem;  --space-3xl: 7rem;
  --text-xs: 0.75rem;  --text-sm: 0.875rem; --text-md: 1.125rem;
  --text-lg: 1.375rem; --text-xl: 1.75rem;  --text-2xl: 2.25rem;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-short: 220ms;
  --radius-card: 10px; --radius-pill: 6px; --radius-input: 6px;
}
```
