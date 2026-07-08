# Homepage Hero: Brand Storytelling Loop Animation

## Overview

Replace the current static `pattern.svg` texture behind the homepage hero with a
full-color, hand-coded SVG animation that tells a short looping story: an empty
workspace becomes a built interface, gains user-flow connections, gets
collaboration touches, expands into a brand ecosystem, settles into a finished
composition, then resets seamlessly. Total loop length ~9s.

This replaces the hero's role as "abstract background texture" with a legible,
prominent illustration, so the hero layout, color usage, and CSS files change
along with it.

## Layout & responsive behavior

- `.hero-inner` becomes a two-column grid on viewports ≥ 861px: text block on
  the left (`text-align: left`), new `.hero-visual` container on the right
  holding the inline SVG. Roughly equal columns, ~48px gap, vertically centered.
- The `.parallax-hero::before` pattern-texture rule (in `parallax.css`) is
  removed from `.hero` — the new SVG *is* the hero's visual layer. The rule
  stays intact for `.section-shapes-host` (used elsewhere on the page) and any
  other `.parallax-hero` usage outside the homepage hero.
- Below 860px (existing breakpoint convention used in `pages.css` /
  `components.css`): `.hero-visual` is `display: none`, `.hero-inner` reverts
  to today's single-column centered layout, and the hero background is a
  plain dark gradient with no texture layer. No mobile-specific fallback
  animation or static image — kept simple deliberately.
- `prefers-reduced-motion: reduce`: a `.reduced-motion` class (set by JS, see
  below) pauses all keyframe animations and applies the Scene 6 (settled)
  end-state as static inline styles, so reduced-motion users see a finished,
  motionless composition rather than a frozen mid-transition frame.

## Visual composition & timeline

Single persistent SVG scene (not literally 7 swapped DOM scenes). Every
element's own keyframes span a full 9s loop; percentage stops below map to
the original scene timing (0 / 0.8 / 2.2 / 3.6 / 5.2 / 7.0 / 8.5 / 9.0s):

| % | time | phase |
|---|------|-------|
| 0% | 0s | loop start |
| 8.9% | 0.8s | canvas in |
| 24.4% | 2.2s | UI built |
| 40% | 3.6s | UX flow drawn |
| 57.8% | 5.2s | collaboration |
| 77.8% | 7.0s | brand expansion |
| 94.4% | 8.5s | settled hero |
| 100% | 9.0s | reset (= 0% state) |

**Canvas (0–8.9%)** — central browser-window card scales 95%→100% and fades
in; a handful of small decorative dots fade in and begin continuous idle
float.

**Interface construction (8.9–24.4%)** — inside the window: navbar slides
down from the top edge, sidebar slides in from the left, 2–3 content cards
fade + translateY(20px→0) up with 80–120ms stagger, small icon circles pop in
with slight back-out overshoot, two buttons fade in, a mini bar chart's 3–4
bars grow upward (scaleY 0→1).

**UX flow (24.4–40%)** — 2–3 thin dashed connector `<path>`s draw themselves
via `stroke-dashoffset`; 3 small circular nodes appear sequentially along
them; one small dot travels along a path; one floating icon outside the
window rotates gently ±5°; one interior card nudges (small translateY pulse)
to suggest interactivity.

**Collaboration (40–57.8%)** — two avatar circles fade + scale in near the
window's corners; a chat bubble slides up near one avatar; a notification
badge scales in with back-out easing; one interior card ghost-duplicates
(a semi-transparent offset copy fades in beside it) to suggest a shared
component; a thin line connects the two avatars.

**Brand expansion (57.8–77.8%)** — a small mobile-device outline and a
secondary "marketing asset" card translate outward from the window to
flanking positions; 2–3 small brand/analytics icons orbit slightly around the
composition (arc via transform-origin offset + rotation); connector lines
extend out to the newly placed elements; the orange accent brightens
(opacity/saturation pulse on accent-colored elements). The central browser
window itself stands in for "desktop screen" — no separate duplicate desktop
element.

**Settled hero (77.8–94.4%)** — composition holds its expanded form.
Continuous idle float (±5px / ±2°, alternate, 3–5s, randomized per-element
delay) is layered via nested `<g>`: outer group carries the timeline
transform/opacity, inner group carries the idle float, so the two don't
stomp on the same `transform` animation. A soft blurred glow (filtered
ellipse) pulses behind the window; 2–3 tiny particles drift subtly.

**Loop reset (94.4–100%)** — expansion-phase and collaboration-phase
elements fade out, interior cards collapse, the window scales down and
fades, decorations disappear — landing exactly on the 0% state so the loop
has no visible seam.

## Technical implementation

- **Markup:** one inline SVG (viewBox ~560×480) inside `.hero-visual` in
  `index.html`, grouped by element with nested `<g>`s as described above.
- **Animation:** pure CSS `@keyframes`, `animation-duration: 9s`,
  `animation-iteration-count: infinite`, per-element percentage stops
  matching the table above. Restricted to `transform` + `opacity` except the
  connector paths, which animate `stroke-dashoffset`.
- **JS — new `assets/js/hero-animation.js`** (deferred, loaded only from
  `index.html`), two responsibilities only:
  1. On load, call `getTotalLength()` on each connector `<path>` and set its
     `stroke-dasharray` / initial `stroke-dashoffset` — avoids hand-computing
     bezier lengths for the draw-on animation.
  2. Check `window.matchMedia('(prefers-reduced-motion: reduce)')` and toggle
     the `.reduced-motion` class described above.
  No JS drives the loop itself — CSS handles that natively, consistent with
  the rest of the site's animation work (see `parallax.css`).
- **CSS:** new `assets/css/hero-animation.css`, linked only from
  `index.html`, holding the SVG's layout and all keyframes — follows the
  existing per-concern file split (`variables.css`, `base.css`,
  `components.css`, `pages.css`, `parallax.css`).
- **Color:** dark gradient background retained (`--color-black` /
  `--color-charcoal-light`). Browser chrome, cards, and connector lines use
  existing neutral tokens (`--color-charcoal-light`,
  `--color-text-on-dark-muted`, white at low opacity). `--color-primary` /
  `--color-primary-dark` (orange) reserved for accent moments only: active
  buttons inside the mock UI, the notification badge, the expansion-phase
  brighten pulse, and the settled-phase glow — so orange reads as the
  highlight rather than being spread evenly across the scene.

## Out of scope

- No new external animation library (GSAP/Lottie/etc.) — hand-coded SVG/CSS
  per the chosen approach.
- No mobile-specific version of the animation — hidden below 860px.
- No literal duplicate "desktop screen" element separate from the main
  browser-window card.
- No changes to `about.html`, `services.html`, `contact.html`, or the
  `.section-shapes-host` pattern usage elsewhere on the page.

## Testing / verification

Static site, no build step — verify by serving locally (e.g.
`python3 -m http.server`) and checking in a real browser:

- Full loop plays smoothly at 60fps across the 9s cycle, no visible seam at
  the loop point.
- Two-column layout renders correctly ≥ 861px; single-column/no-illustration
  layout renders correctly ≤ 860px (check at the breakpoint edge).
- `prefers-reduced-motion: reduce` (via devtools emulation) freezes the scene
  on the settled composition with no animation playing.
- No console errors from `hero-animation.js` (path length measurement runs
  after the SVG is in the DOM).
