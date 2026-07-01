# Nexxabyte Diamond-Pattern Background — Design Spec

Date: 2026-07-01

## Purpose

Replace the current floating-shape parallax system (3 hand-drawn SVGs —
network-nodes, code-brackets, geometric-outline — scattered as individual
`data-parallax-speed` elements across all 4 pages, per
[2026-07-01-nexxabyte-visual-redesign-design.md](2026-07-01-nexxabyte-visual-redesign-design.md))
with a single tileable diamond-grid pattern texture (user-supplied SVG),
used as a repeating background layer on every dark hero and light section
that currently hosts a shape. The pattern still moves on scroll, preserving
the "parallax throughout the site" feel, but as a drifting tiled texture
rather than individually-animated discrete shapes.

## Scope

Applies to all 4 pages (`index.html`, `about.html`, `services.html`,
`contact.html`) in a single pass, since the shape system being replaced
spans all of them uniformly.

## Asset

**Source:** the user-supplied `abstract_connections_banner_design_2203
[Converted] copy.svg` — a 120×60 viewBox diagonal diamond-grid pattern,
grey diamonds (`#a7a9ac`) at varying opacity (0.2–1) plus lighter
corner/edge shapes (`#e6e7e8`), on an opaque white background rect.

**Processing:** save to `assets/images/pattern-diamonds.svg` with the
opaque background rect (`<rect class="st204" width="120" height="60"/>`)
removed, making the tile transparent everywhere except the grey diamond
shapes themselves. No other edits — all `.stN` classes, opacity values,
and path data stay exactly as supplied. A single transparent-background
file works for both dark and light hosts (verified: mid-grey `#a7a9ac`
reads clearly against both `--color-black`/`--color-charcoal-light` and
white/`--color-bg-alt`), so no separate light/dark variant is needed.

## Removal

- The 3 shape SVG "families" (network-nodes, code-brackets,
  geometric-outline) and every inline `<svg class="parallax-shape" ...>`
  instance across all 4 HTML pages (25 instances total, added across
  Tasks 2–6 of the prior redesign).
- CSS: `.parallax-shape` (base), `.shape-pos-tr/tl/br/bl/mid-r`,
  `.shape-sm`/`.shape-lg`, `.is-accent`, and the `@media (max-width: 768px)
  { .parallax-shape { display: none; } }` rule — all now unused. (No image
  files to delete: the prior shapes were inline SVG markup, not files.)

## What Stays

- `.parallax-hero` (dark gradient band) and `.section-shapes-host` (light
  section wrapper) — both keep their existing structural role (one dark
  hero per page, one light-section wrapper per non-hero section) and their
  existing `position: relative; overflow: hidden;` + `.container` z-index
  rules.
- The dark gradient background (`--color-black` → `--color-charcoal-light`)
  on `.parallax-hero`.
- All typography, tokens, and page content from the prior redesign.

## New CSS: Pattern Layer

Both `.parallax-hero` and `.section-shapes-host` gain a `::before`
pseudo-element:

- `content: ''`, `position: absolute`, `inset: 0`, `pointer-events: none`,
  `z-index: 0` (behind `.container`, which keeps its existing `z-index: 1`).
- `background-image: url(../images/pattern-diamonds.svg)`,
  `background-repeat: repeat`, `background-size: 180px 90px` (scaling the
  120×60 source tile up 1.5× for visibility at typical section heights).
- `transform: translateY(var(--pattern-offset, 0))` — the custom property
  the new JS drives (see below); defaults to `0` so the pattern renders
  correctly even before JS runs or if JS is disabled.
- Opacity differs by host: `.parallax-hero::before { opacity: 0.35; }`
  (visible texture on dark bands), `.section-shapes-host::before {
  opacity: 0.08; }` (subtle on light sections — same "felt more than seen"
  intent as the prior shape system's 0.06 light-section opacity).

## New JS: `initParallax()` Rewrite

Replaces the shape-based version entirely (same function name, same
call site in `DOMContentLoaded`, same external contract — no other code
changes):

- Selects all `.parallax-hero, .section-shapes-host` elements (instead of
  `[data-parallax-speed]` shape elements).
- Same `prefers-reduced-motion: reduce` guard — returns early, leaving
  `--pattern-offset` unset (`::before` renders static via its CSS default).
- Same rAF-throttled `scroll`/`resize` listener pattern.
- For each host element, on each frame: read `getBoundingClientRect().top`,
  multiply by a fixed slow factor (`0.1` — slower than any of the prior
  shape speeds, since a moving background texture should read as subtle
  drift, not a distinct scrolling object), and set
  `element.style.setProperty('--pattern-offset', offset + 'px')`.
- No more `data-parallax-speed` attribute or per-shape speed variation —
  one uniform, slow drift rate for every pattern instance site-wide.

## Accessibility & Performance

- Pattern `::before` layers are `pointer-events: none` and purely
  decorative (no `aria-hidden` needed since pseudo-elements are already
  invisible to assistive tech).
- `prefers-reduced-motion: reduce` fully disables the drift (spec
  requirement carried over from the prior redesign, non-negotiable).
- No mobile-hide media query this time — unlike the discrete shapes (which
  could look cluttered on narrow screens), a single tiled texture at low
  opacity is lightweight and unobtrusive at any viewport width, so it stays
  visible on mobile.
- One shared SVG asset (loaded once, cached by the browser for every tile
  repeat and every section) — cheaper than the prior system's 25 inline
  SVG elements duplicated across the DOM.

## Out of Scope

- No separate dark/light pattern asset variants (one file suffices, per
  the Asset section above).
- No changes to hero gradient, typography, tokens, or page content/copy.
- No per-section speed variation for the pattern drift (uniform rate
  everywhere, unlike the prior shapes' varied 0.15–0.4 speeds).
