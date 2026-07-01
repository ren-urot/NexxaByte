# Nexxabyte Visual Redesign — Design Spec

Date: 2026-07-01

## Purpose

Give the existing 4-page Nexxabyte site (built per
[2026-07-01-nexxabyte-website-design.md](2026-07-01-nexxabyte-website-design.md))
a more modern, technology-forward visual identity with scroll parallax motion,
inspired by three reference designs the user shared (a dark-gradient/3D-icon
SaaS hero, a bold monochrome agency site, and a clean minimal SaaS product
site). This is a **visual and motion redesign only** — no content, copy, or
page-structure changes. All existing pages, sections, and text stay exactly
as they are; only their design system (colors, typography scale, hero
imagery) and a new scroll-parallax layer change.

## Scope

Applies to all 4 existing pages (`index.html`, `about.html`, `services.html`,
`contact.html`) in a single pass — the shared design system and header/footer
must stay visually consistent across pages, so a partial rollout would leave
pages mismatched.

## Palette Direction: Dark Hero, Light Body

- Every page's top hero band (`.hero` on Home, `.page-hero` on About/
  Services/Contact) becomes a dark gradient background.
- All content below the hero stays on the existing light backgrounds
  (`--color-bg` white / `--color-bg-alt` light-gray), unchanged.
- Home's existing dark mission/vision teaser band (`.section-dark`) stays
  dark, and also gets parallax shapes for motion continuity.
- Brand colors (`--color-primary: #FF4E00`, `--color-dark: #484848`) remain
  the accent colors throughout — this is a polish/motion pass, not a
  rebrand.

## New Design Tokens (`assets/css/variables.css`)

Add to the existing token set:

```css
--color-charcoal-light: #34343A;   /* dark-gradient end color */
--color-text-on-dark-muted: #C7C7CC; /* subheads/body text on dark bg */
```

`--color-hero-gradient`: not a token itself, but every dark hero/band uses:
`linear-gradient(135deg, var(--color-black), var(--color-charcoal-light))`

## Typography Scale (bumped up one notch)

In `assets/css/base.css`, replace the existing `h1`/`h2` rules:

```css
h1 { font-size: clamp(2.6rem, 5vw + 1rem, 4.2rem); letter-spacing: -0.02em; }
h2 { font-size: clamp(1.9rem, 2.8vw + 1rem, 2.8rem); letter-spacing: -0.02em; }
```

(`h3`/`h4` stay as-is — only the two largest heading levels get the bolder,
larger treatment appropriate for hero/section headlines.)

## Hero Visual: Abstract Tech Geometry

The Home page's current `.hero-blob` (CSS radial gradient) and `.hero-photo`
(picsum.photos placeholder image) are removed. In their place, and in the
new dark `.page-hero` bands on About/Services/Contact, a small reusable set
of **inline SVG line-art shapes** float behind the (non-parallaxed)
headline/text:

1. **Network nodes** — small circles connected by thin lines, suggesting
   connectivity/systems.
2. **Code brackets** — an angular `< >`-style bracket shape.
3. **Geometric outline** — a rotated square/triangle outline.

Each shape is stroke-only (`fill: none`, `stroke: currentColor`), rendered
at low opacity (0.10–0.18) in white or `--color-primary`, positioned
absolutely within its section, `pointer-events: none` so they never
intercept clicks, and `z-index` below the section's text content. The same
three shape markups are reused across sections (varying only position,
size, opacity, and parallax speed per instance) rather than authoring
unique art per section — keeps the implementation small and consistent.

## Parallax Mechanism

**New CSS file:** `assets/css/parallax.css` (loaded after `pages.css` in
every page's `<head>`) — contains `.parallax-hero` (gradient background,
`position: relative`, `overflow: hidden`), `.parallax-shape` (base
absolute-positioning/opacity/pointer-events rules), and per-instance
position/size utility classes.

**JS (`assets/js/main.js`):** a new `initParallax()` function, called
alongside the existing three `init*()` functions inside the shared
`DOMContentLoaded` handler:

- Selects all `[data-parallax-speed]` elements.
- If `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is
  true, does nothing further — shapes stay static at their base position
  (accessibility requirement, not optional).
- Otherwise, on `scroll` (throttled via `requestAnimationFrame`, one
  in-flight frame at a time), computes each shape's offset as
  `window.scrollY * parseFloat(el.dataset.parallaxSpeed)` and applies it via
  `el.style.transform = 'translateY(' + offset + 'px)'`.
- Speeds range 0.15–0.4 (higher = moves more per scrolled pixel) so
  different shapes drift at visibly different rates, creating depth.

This is a fully independent layer from the existing `initScrollReveal()`
(content fade-in-on-view) — parallax only ever touches decorative
background shapes, scroll-reveal only ever touches content opacity/
transform on entry. They don't target the same elements and can't conflict.

## Per-Page Treatment

**Home (`index.html`):**
- `.hero`: becomes `.parallax-hero`, dark gradient, 3 shapes (all three
  types), headline/subhead/CTAs unchanged in copy, text color switches to
  white/`--color-text-on-dark-muted`.
- `.services-preview`, `.why-choose-us`, `.cta-banner` (light sections):
  each gets **one** subtle low-opacity shape with parallax motion, on the
  existing light background (not dark).
- `.mission-vision-teaser` (`.section-dark`, already dark): gains 2 shapes
  for motion continuity; existing content/copy unchanged.

**About / Services / Contact (`.page-hero`):**
- Becomes `.parallax-hero` (compact height, single-column centered text,
  no two-column photo layout since these pages never had a hero photo), 2
  shapes each, same dark gradient and text-color treatment as Home's hero.
- Each page's other light sections get one subtle shape each, same pattern
  as Home's light sections.
- About's existing "Who We Are" photo (a different, mid-page image, not
  part of the hero band) is untouched — out of scope for this redesign.

## What Does Not Change

- All page copy, headings text, service descriptions, form fields, footer
  content — identical to the current build.
- Header/footer markup pattern (still byte-identical across all 4 pages
  except the active nav class).
- `initNavToggle()`, `initScrollReveal()`, `initContactForm()` — untouched.
- About's "Who We Are" photo, all card/grid layouts, the contact form,
  the services grid — untouched, only their *hero* and ambient background
  shapes change.

## Accessibility & Performance

- `prefers-reduced-motion: reduce` fully disables parallax transforms
  (shapes render static, no JS-driven motion) — required, not optional.
- Parallax shapes are `aria-hidden="true"` and `pointer-events: none` —
  purely decorative, never focusable or clickable, never announced by
  screen readers.
- Scroll handler uses `requestAnimationFrame` throttling (never runs more
  than once per animation frame) to avoid jank.
- Dark-hero text contrast: white headline on `--color-black`→
  `--color-charcoal-light` gradient, and `--color-text-on-dark-muted`
  (#C7C7CC) for subheads — both meet WCAG AA contrast against both ends of
  the gradient (verified during implementation).

## Out of Scope

- No new content sections (no stats counters, client-logo strips, or
  testimonials — those appeared in the reference designs but weren't part
  of the user's ask, which was explicitly visual redesign of the existing
  structure).
- No dark-mode toggle or persistent theme switching — the dark hero is a
  fixed design choice, not a user-selectable mode.
- No parallax library/dependency — hand-rolled vanilla JS only, consistent
  with the site's no-build-tooling constraint.
