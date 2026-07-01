# Nexxabyte Hex-Grid Pattern Fix — Design Spec

Date: 2026-07-01

## Purpose

Fix the diamond-pattern background introduced in
[2026-07-01-nexxabyte-diamond-pattern-design.md](2026-07-01-nexxabyte-diamond-pattern-design.md).
That design assumed the user-supplied `pattern-diamonds.svg` was a seamlessly
tileable unit. It isn't: it's a decorative "banner" graphic with dense
diamond clusters on two edges and a large empty gap in the middle. Tiling it
at 180×90px produces a busy, patchy micro-texture, not the clean, evenly
spaced hexagon-grid line pattern the user actually wants (per a new
reference image: thin light-gray hexagon/triangle outline grid, sparse dot
accents at scattered vertices, uniform density edge-to-edge, no repeat
seams).

## Root Cause

Confirmed visually two ways:
1. A QuickLook-rendered thumbnail of `pattern-diamonds.svg` shows two dense
   clusters near the left/right thirds of its 120×60 viewBox with a mostly
   empty band between them — not a uniform, edge-to-edge grid.
2. A headless-Chrome screenshot of the live homepage hero shows the tiled
   180×90px repeats of that asset rendering as a busy, noisy micro-pattern,
   visually nothing like the reference image's spacious, evenly distributed
   grid.

## Scope

Applies to all 4 pages (`index.html`, `about.html`, `services.html`,
`contact.html`), on every `.parallax-hero` and `.section-shapes-host`
element — same footprint as the pattern it replaces.

## Asset: New Hex-Grid SVG

Replace `assets/images/pattern-diamonds.svg` with a newly authored
`assets/images/pattern-hexgrid.svg`:

- **viewBox:** `0 0 1600 900` (16:9-ish — wide enough that `background-size:
  cover` reads well on both short/wide hero sections and taller/narrower
  card sections without visible stretching).
- **Content:** a flat-top hexagon tessellation, stroke-only (`fill: none`),
  covering the full viewBox edge-to-edge with uniform density — no dense
  clusters, no gaps. Hexagon radius ~100px (roughly 8 columns across the
  1600px width), matching the reference's spacious, uncluttered feel
  (visually much larger/sparser than the old 180×90px tile).
- **Stroke:** light gray/white (`#e6e7e8` or `#ffffff`), `stroke-width: 1`,
  `stroke-opacity: 0.25` baked into the asset — the existing CSS opacity
  tiers (below) then scale this baseline up/down per host type, same
  mechanism as before.
- **Dot accents:** small circles (`r` ≈ 2.5–3.5px) at roughly 15–20% of
  hexagon vertices, chosen pseudo-randomly for a "network node" feel
  matching the reference, same stroke color, `fill-opacity` ≈ 0.4 (slightly
  more visible than the grid lines, as an accent).
- **Background:** transparent (no background rect) — same single-asset
  approach for both dark and light hosts, differing only by CSS `opacity`.
- **Generation method:** hand-authored/scripted (e.g. a small generation
  script computing hexagon vertex coordinates), not manually drawn point by
  point — this keeps the grid mathematically even. Final sizing/density is
  visually tuned during implementation against the reference image using a
  headless-Chrome screenshot (`--headless --screenshot`), which this session
  has confirmed works reliably in this sandbox (unlike the Playwright MCP
  screenshot tools, which hang).

`assets/images/pattern-diamonds.svg` is deleted — nothing else references it
after this change (confirmed via repo-wide grep).

## CSS Changes: `assets/css/parallax.css`

Two changes to the existing `::before` rule block:

**1. Stop tiling — use `cover` instead of `repeat`:**

```css
.parallax-hero::before,
.section-shapes-host::before {
  background-image: url('../images/pattern-hexgrid.svg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
```

**2. Add vertical overdraw margin, so scroll-driven drift never exposes
empty space at a section's top/bottom edge:**

```css
.parallax-hero::before,
.section-shapes-host::before {
  position: absolute;
  top: -60px;
  bottom: -60px;
  left: 0;
  right: 0;
  /* replaces the old `inset: 0` */
}
```

Horizontal edges stay flush (`left: 0; right: 0`) since drift is
vertical-only. The opacity tiers are unchanged from the current (already
fixed) state:

```css
.parallax-hero::before,
.section-dark.section-shapes-host::before {
  opacity: 0.35;
}
.section-shapes-host::before {
  opacity: 0.08;
}
```

## JS Changes: `assets/js/main.js` — `initParallax()`

Clamp the computed offset so it never exceeds the new 60px overdraw margin
(50px clamp leaves a 10px safety buffer):

```js
function update() {
  for (var i = 0; i < hosts.length; i++) {
    var rect = hosts[i].getBoundingClientRect();
    var offset = rect.top * 0.1;
    offset = Math.max(-50, Math.min(50, offset));
    hosts[i].style.setProperty('--pattern-offset', offset + 'px');
  }
  ticking = false;
}
```

Everything else about `initParallax()` — the `prefers-reduced-motion`
guard, rAF throttle, `{ passive: true }` scroll listener, resize listener —
is unchanged.

## What Stays the Same

- `.parallax-hero` / `.section-shapes-host` structural roles, dark gradient
  background, typography, tokens, page content.
- The `--pattern-offset` CSS custom property mechanism and its `0` default
  (pattern still renders correctly, statically, with JS disabled).
- `prefers-reduced-motion: reduce` fully disables drift (non-negotiable,
  carried over unchanged).
- One shared SVG asset for both dark and light hosts, differing only by
  CSS `opacity` — the single-asset approach itself wasn't the bug; the
  *tiling* of a non-tileable source asset was.

## Accessibility & Performance

- No change to the accessibility posture: `::before` remains invisible to
  assistive tech, `pointer-events: none`, purely decorative.
- Slightly lighter than before: one `cover`-sized image paint per host
  instead of a tiled repeat — no meaningful performance difference at this
  scale either way.

## Out of Scope

- No change to opacity values, parallax speed multiplier (still `0.1`), or
  which elements host the pattern.
- No per-section unique artwork — one shared graphic via `background-size:
  cover`, same as the tiling approach's one-shared-tile intent, just without
  the repeat.
