# Homepage Hero Loop Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage hero's static `pattern.svg` background texture with a hand-coded, full-color, seamlessly-looping (9s) inline SVG animation depicting an empty workspace becoming a built interface, gaining UX-flow connections, collaboration touches, and brand expansion, then settling and resetting.

**Architecture:** One inline SVG (`#hero-scene`, viewBox `0 0 560 480`) lives in a new `.hero-visual` column added to the homepage hero, built once as static markup (Task 1) and then animated in layers, one narrative phase per task (Tasks 2–6), using pure CSS `@keyframes` shared across a single 9s `infinite` timeline. A small vanilla-JS file handles only two non-CSS-expressible jobs: measuring SVG path lengths for the connector "draw-on" effect, and toggling a reduced-motion class.

**Tech Stack:** Static HTML/CSS/vanilla JS (ES5-style, IIFE pattern — matches `assets/js/main.js`). No build step, no animation library, no test framework. This repo has no automated test runner, so every task's "test" step is a concrete, copy-pasteable browser-console check plus a visual check via a local static server — not a unit test.

## Global Constraints

- No new external dependencies (no GSAP/Lottie/anime.js/etc.) — hand-coded SVG + CSS + vanilla JS only.
- Animate only `transform` and `opacity`, except the connector `<path>` elements, which animate `stroke-dashoffset`.
- `animation-duration: 9s; animation-iteration-count: infinite;` on every timeline-driven rule, with the shared percentage stops: `0% / 8.9% / 24.4% / 40% / 57.8% / 77.8% / 94.4% / 100%` (= 0 / 0.8s / 2.2s / 3.6s / 5.2s / 7.0s / 8.5s / 9.0s). Every one of these 9s rules must have its `100%` state exactly equal its `0%` state so the loop has no visible seam. (This does not apply to `idle-float` — that's a separate, short 4–6s `alternate`-direction animation that seams by reversing, not by endpoint equality.)
- `.hero-visual` is hidden below 861px (`@media (max-width: 860px)`), matching the breakpoint convention already used in `pages.css`/`components.css`. Below that width, `.hero-inner` reverts to a single centered column with a plain dark-gradient background (no texture, no illustration).
- Orange (`--color-primary` / `--color-primary-dark`) is reserved for accent-only elements (primary button, notification badge, accent-pulse targets, glow). Everything else uses existing neutral tokens (`--color-charcoal-light`, `--color-text-on-dark-muted`, white at low opacity).
- Do not modify `about.html`, `services.html`, `contact.html`, or the `.section-shapes-host` rule in `parallax.css` — those pages keep using `.page-hero.parallax-hero` with the existing static pattern texture untouched.
- New files: `assets/css/hero-animation.css`, `assets/js/hero-animation.js` — both linked/loaded only from `index.html`.
- `prefers-reduced-motion: reduce` must freeze the scene on its settled ("94.4%") composition with zero running animation.

---

## File Structure

- **Modify `index.html`** — hero section markup: new `.hero-visual` column with the inline `#hero-scene` SVG; new `<link>` for `hero-animation.css`; new `<script>` for `hero-animation.js`.
- **Create `assets/css/hero-animation.css`** — hero two-column layout, breakpoint, background gradient for the new hero, and every `@keyframes` rule plus element selectors.
- **Create `assets/js/hero-animation.js`** — `initPathDrawing()` (measure connector path lengths) and `initReducedMotion()` (toggle `.reduced-motion`).
- **Modify `assets/js/main.js`** — remove `initPatternEntrance()` and its call (dead code once the homepage hero no longer uses the `pattern-entrance`/`::before` texture system).
- **Modify `assets/css/parallax.css`** — remove the now-unreachable `.hero.parallax-hero.pattern-entrance::before` rule and `pattern-form-in` keyframes (the homepage hero drops the `parallax-hero` class entirely, so this rule can never match again).

## Coordinate & ID Reference (viewBox `0 0 560 480`, window center `280 200`)

This table is the single source of truth for every task below — use these exact IDs/coordinates, don't invent new ones.

| Element | id | Shape/position |
|---|---|---|
| Decorative dots | `#decor-dots` | circles at (60,60 r4) (500,55 r3) (45,400 r5) (515,410 r4) |
| Browser window | `#browser-window` | rect x120 y80 w320 h240 rx14 |
| Navbar | `#navbar` | rect x120 y80 w320 h32 rx14; dots (136,96 r3)(148,96 r3)(160,96 r3); search rect x185 y88 w110 h16 rx8; avatar circle cx414 cy96 r9 |
| Sidebar | `#sidebar` | rect x120 y112 w60 h208; icons (150,140 r5)(150,168 r5)(150,196 r5)(150,224 r5) |
| Card 1 | `#card-1` (+ `#icon-1`) | rect x196 y124 w104 h60 rx8; icon circle cx206 cy134 r7 |
| Card 2 | `#card-2` (+ `#icon-2`) | rect x316 y124 w108 h60 rx8; icon circle cx326 cy134 r7 |
| Buttons | `#btn-primary`, `#btn-secondary` | rects x196/x284 y196 w76 h24 rx6 |
| Chart card | `#chart-card` | rect x196 y236 w228 h76 rx8 |
| Bars | `#bar-1..4` | x214/244/274/304, w18, baseline y296, heights 24/40/30/48 |
| Flow lines | `#path-a`, `#path-b` | path-a `M414,96 C460,150 250,150 150,196`; path-b `M206,134 C260,170 260,200 300,240` |
| Flow nodes | `#node-1,2,3` | (420,110 r4) (280,150 r4) (150,210 r4) |
| Travel dot | `#travel-dot` | circle r5, animated cx/cy |
| Floating icon | `#float-icon` | circle cx500 cy150 r14 + 3 tick lines |
| Avatars | `#avatar-a`, `#avatar-b` | circle cx70 cy110 r16; circle cx490 cy340 r16 |
| Chat bubble | `#chat-bubble` | rect x44 y56 w68 h36 rx10 + tail path |
| Badge | `#badge` | circle cx430 cy72 r8 |
| Ghost card | `#ghost-card` | rect x212 y140 w104 h60 rx8 |
| Collab line | `#collab-line` | path `M70,110 C200,220 360,220 490,340` |
| Mobile device | `#mobile-device` | rect x26 y190 w42 h86 rx8 + rect x40 y258 w14 h4 rx2 |
| Marketing card | `#market-card` | rect x478 y150 w64 h46 rx8 + rect x486 y162 w30 h6 rx3 |
| Orbit icons | `#orbit-icons` (+ `#orbit-1,2,3`) | circles (220,40 r10)(280,26 r10)(340,40 r10), each with a small "+" cross |
| Ext lines | `#ext-line-1`, `#ext-line-2` | `M120,200 C90,210 70,220 47,233`; `M440,200 C470,190 490,180 510,173` |
| Glow | `#glow` | ellipse cx280 cy200 rx190 ry110, blurred |

---

### Task 1: Hero layout scaffold and static SVG scene

**Files:**
- Modify: `index.html:40-52` (hero section)
- Create: `assets/css/hero-animation.css`

**Interfaces:**
- Produces: `#hero-scene` SVG with all element IDs listed in the Coordinate Reference table above, present in the DOM as static (non-animated) shapes. All later tasks add CSS keyframes targeting these exact IDs/classes — no further markup restructuring.
- Produces: CSS classes `.hero-loop` (new hero background/layout host, replaces `parallax-hero` on the homepage hero only) and `.hero-visual` (right column).

- [ ] **Step 1: Write the verification script (run before any change)**

Serve the site and confirm today's baseline in the browser console at `http://localhost:8000`:

```js
document.querySelector('.hero.parallax-hero') !== null &&
document.querySelector('#hero-scene') === null
```
Run: open devtools console on the homepage, paste the snippet.
Expected: `true` (old class still present, new SVG doesn't exist yet).

- [ ] **Step 2: Replace the hero section markup in `index.html`**

Replace the existing hero section (`index.html:40-52`):

```html
    <section class="hero hero-loop">
      <div class="container hero-inner">
        <div class="hero-content reveal">
          <span class="eyebrow">Software Development &amp; Technology Outsourcing</span>
          <h1>Transform Ideas Into Scalable Digital Products</h1>
          <p class="hero-lead text-muted">Nexxabyte helps startups, SMEs, and enterprises build custom web apps, mobile apps, SaaS platforms, AI-powered solutions, and enterprise software — backed by an experienced team of designers, developers, and technology consultants.</p>
          <div class="hero-actions">
            <a href="contact.html" class="btn btn-primary">Get a Free Consultation</a>
            <a href="services.html" class="btn btn-outline">View Services</a>
          </div>
        </div>
        <div class="hero-visual" aria-hidden="true">
          <svg id="hero-scene" viewBox="0 0 560 480" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="glow-blur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="30" />
              </filter>
            </defs>

            <ellipse id="glow" cx="280" cy="200" rx="190" ry="110" fill="var(--color-primary)" filter="url(#glow-blur)" opacity="0" />

            <g id="decor-dots">
              <g class="float-inner float-a">
                <circle cx="60" cy="60" r="4" fill="var(--color-text-on-dark-muted)" />
                <circle cx="500" cy="55" r="3" fill="var(--color-text-on-dark-muted)" />
                <circle cx="45" cy="400" r="5" fill="var(--color-text-on-dark-muted)" />
                <circle cx="515" cy="410" r="4" fill="var(--color-text-on-dark-muted)" />
              </g>
            </g>

            <g id="expansion">
              <path id="ext-line-1" class="draw-path" d="M120,200 C90,210 70,220 47,233" fill="none" stroke="var(--color-text-on-dark-muted)" stroke-width="1.5" stroke-dasharray="4 4" />
              <path id="ext-line-2" class="draw-path" d="M440,200 C470,190 490,180 510,173" fill="none" stroke="var(--color-text-on-dark-muted)" stroke-width="1.5" stroke-dasharray="4 4" />

              <g id="mobile-device">
                <g class="float-inner float-b">
                  <rect x="26" y="190" width="42" height="86" rx="8" fill="none" stroke="var(--color-text-on-dark-muted)" stroke-width="2" />
                  <rect x="40" y="258" width="14" height="4" rx="2" fill="var(--color-text-on-dark-muted)" />
                </g>
              </g>

              <g id="market-card">
                <g class="float-inner float-c">
                  <rect x="478" y="150" width="64" height="46" rx="8" fill="var(--color-charcoal-light)" stroke="var(--color-text-on-dark-muted)" stroke-width="1" />
                  <rect x="486" y="162" width="30" height="6" rx="3" fill="var(--color-primary)" />
                </g>
              </g>

              <g id="orbit-icons">
                <g id="orbit-1"><circle cx="220" cy="40" r="10" fill="none" stroke="var(--color-text-on-dark-muted)" stroke-width="1.5" /><path d="M215,40 H225 M220,35 V45" stroke="var(--color-text-on-dark-muted)" stroke-width="1.5" /></g>
                <g id="orbit-2"><circle cx="280" cy="26" r="10" fill="none" stroke="var(--color-text-on-dark-muted)" stroke-width="1.5" /><path d="M275,26 H285 M280,21 V31" stroke="var(--color-text-on-dark-muted)" stroke-width="1.5" /></g>
                <g id="orbit-3"><circle cx="340" cy="40" r="10" fill="none" stroke="var(--color-text-on-dark-muted)" stroke-width="1.5" /><path d="M335,40 H345 M340,35 V45" stroke="var(--color-text-on-dark-muted)" stroke-width="1.5" /></g>
              </g>
            </g>

            <g id="collab">
              <path id="collab-line" class="draw-path" d="M70,110 C200,220 360,220 490,340" fill="none" stroke="var(--color-text-on-dark-muted)" stroke-width="1.5" stroke-dasharray="4 4" />

              <g id="avatar-a">
                <g class="float-inner float-a">
                  <circle cx="70" cy="110" r="16" fill="var(--color-charcoal-light)" stroke="var(--color-text-on-dark-muted)" stroke-width="1.5" />
                </g>
              </g>
              <g id="avatar-b">
                <g class="float-inner float-b">
                  <circle cx="490" cy="340" r="16" fill="var(--color-charcoal-light)" stroke="var(--color-text-on-dark-muted)" stroke-width="1.5" />
                </g>
              </g>

              <g id="chat-bubble">
                <rect x="44" y="56" width="68" height="36" rx="10" fill="var(--color-charcoal-light)" />
                <path d="M78,92 L70,100 L86,100 Z" fill="var(--color-charcoal-light)" />
              </g>

              <circle id="badge" cx="430" cy="72" r="8" fill="var(--color-primary)" />
              <rect id="ghost-card" x="212" y="140" width="104" height="60" rx="8" fill="#FFFFFF" opacity="0" />
            </g>

            <g id="flow-lines">
              <path id="path-a" class="draw-path" d="M414,96 C460,150 250,150 150,196" fill="none" stroke="var(--color-text-on-dark-muted)" stroke-width="1.5" stroke-dasharray="4 4" />
              <path id="path-b" class="draw-path" d="M206,134 C260,170 260,200 300,240" fill="none" stroke="var(--color-text-on-dark-muted)" stroke-width="1.5" stroke-dasharray="4 4" />
              <circle id="node-1" cx="420" cy="110" r="4" fill="var(--color-primary)" />
              <circle id="node-2" cx="280" cy="150" r="4" fill="var(--color-primary)" />
              <circle id="node-3" cx="150" cy="210" r="4" fill="var(--color-primary)" />
              <circle id="travel-dot" cx="414" cy="96" r="5" fill="var(--color-primary)" />
            </g>

            <g id="float-icon">
              <circle cx="500" cy="150" r="14" fill="none" stroke="var(--color-text-on-dark-muted)" stroke-width="1.5" />
              <path d="M500,136 V142 M500,158 V164 M486,150 H492 M508,150 H514" stroke="var(--color-text-on-dark-muted)" stroke-width="1.5" />
            </g>

            <g id="browser-window">
              <g class="float-inner float-c">
                <rect x="120" y="80" width="320" height="240" rx="14" fill="var(--color-charcoal-light)" stroke="var(--color-text-on-dark-muted)" stroke-width="1" />

                <g id="navbar">
                  <rect x="120" y="80" width="320" height="32" rx="14" fill="#2A2A30" />
                  <circle cx="136" cy="96" r="3" fill="var(--color-text-on-dark-muted)" />
                  <circle cx="148" cy="96" r="3" fill="var(--color-text-on-dark-muted)" />
                  <circle cx="160" cy="96" r="3" fill="var(--color-text-on-dark-muted)" />
                  <rect x="185" y="88" width="110" height="16" rx="8" fill="#1E1E23" />
                  <circle cx="414" cy="96" r="9" fill="var(--color-text-on-dark-muted)" />
                </g>

                <g id="sidebar">
                  <rect x="120" y="112" width="60" height="208" fill="#232328" />
                  <circle cx="150" cy="140" r="5" fill="var(--color-text-on-dark-muted)" />
                  <circle cx="150" cy="168" r="5" fill="var(--color-text-on-dark-muted)" />
                  <circle cx="150" cy="196" r="5" fill="var(--color-text-on-dark-muted)" />
                  <circle cx="150" cy="224" r="5" fill="var(--color-text-on-dark-muted)" />
                </g>

                <g id="card-1">
                  <rect x="196" y="124" width="104" height="60" rx="8" fill="#2A2A30" />
                  <circle id="icon-1" cx="206" cy="134" r="7" fill="var(--color-primary)" />
                </g>
                <g id="card-2">
                  <rect x="316" y="124" width="108" height="60" rx="8" fill="#2A2A30" />
                  <circle id="icon-2" cx="326" cy="134" r="7" fill="var(--color-text-on-dark-muted)" />
                </g>

                <rect id="btn-primary" x="196" y="196" width="76" height="24" rx="6" fill="var(--color-primary)" />
                <rect id="btn-secondary" x="284" y="196" width="76" height="24" rx="6" fill="none" stroke="var(--color-text-on-dark-muted)" stroke-width="1.5" />

                <g id="chart-card">
                  <rect x="196" y="236" width="228" height="76" rx="8" fill="#2A2A30" />
                  <rect id="bar-1" x="214" y="272" width="18" height="24" fill="var(--color-text-on-dark-muted)" />
                  <rect id="bar-2" x="244" y="256" width="18" height="40" fill="var(--color-text-on-dark-muted)" />
                  <rect id="bar-3" x="274" y="266" width="18" height="30" fill="var(--color-text-on-dark-muted)" />
                  <rect id="bar-4" x="304" y="248" width="18" height="48" fill="var(--color-primary)" />
                </g>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </section>
```

- [ ] **Step 3: Add the stylesheet link and script tag**

In `index.html:16` (after the existing `parallax.css` link), add:

```html
  <link rel="stylesheet" href="assets/css/hero-animation.css">
```

At `index.html:191` (before `</body>`, after `main.js`), add:

```html
  <script src="assets/js/hero-animation.js" defer></script>
```

- [ ] **Step 4: Create `assets/css/hero-animation.css` with layout only (no keyframes yet)**

```css
/* Homepage hero: two-column layout + static scene styling.
   Animation keyframes are added in later tasks. */

.hero-loop {
  padding: 64px 0 96px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, var(--color-black), var(--color-charcoal-light));
  color: #fff;
}

.hero-loop .hero-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 48px;
  max-width: none;
  text-align: left;
}

.hero-loop .hero-content {
  text-align: left;
}

.hero-loop .hero-lead {
  margin-left: 0;
  margin-right: 0;
}

.hero-loop .hero-actions {
  justify-content: flex-start;
}

.hero-loop p,
.hero-loop .text-muted {
  color: var(--color-text-on-dark-muted);
}

.hero-loop h1 {
  color: #fff;
}

.hero-visual {
  position: relative;
  width: 100%;
}

.hero-visual svg {
  width: 100%;
  height: auto;
  display: block;
}

@media (max-width: 860px) {
  .hero-loop .hero-inner {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-loop .hero-content {
    text-align: center;
  }

  .hero-loop .hero-lead {
    max-width: 480px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-loop .hero-actions {
    justify-content: center;
  }

  .hero-visual {
    display: none;
  }
}
```

- [ ] **Step 5: Verify — static render, layout, breakpoint**

Run: `python3 -m http.server 8000` from the repo root, open `http://localhost:8000`.

In the browser console:

```js
[
  document.querySelector('#hero-scene') !== null,
  document.querySelectorAll('#hero-scene [id]').length >= 30,
  getComputedStyle(document.querySelector('.hero-loop .hero-inner')).display
]
```
Expected: `[true, true, "grid"]`.

Resize the viewport (or devtools responsive mode) to 800px wide, then re-run:

```js
getComputedStyle(document.querySelector('.hero-visual')).display
```
Expected: `"none"`.

Visually confirm: at desktop width, a dark hero with the text on the left and a full static illustration (browser window with navbar/sidebar/cards/chart, decorative dots, avatars, mobile device, marketing card, orbit icons, glow ellipse at 0 opacity) on the right — nothing animates yet, which is expected at this step.

- [ ] **Step 6: Commit**

```bash
git add index.html assets/css/hero-animation.css
git commit -m "Add static hero illustration scene and two-column layout"
```

---

### Task 2: Canvas + interface construction animation

**Files:**
- Modify: `assets/css/hero-animation.css`

**Interfaces:**
- Consumes: element IDs from Task 1 (`#browser-window`, `#navbar`, `#sidebar`, `#card-1`, `#card-2`, `#icon-1`, `#icon-2`, `#btn-primary`, `#btn-secondary`, `#chart-card`, `#bar-1..4`, `#decor-dots`).
- Produces: `@keyframes decor-fade`, `window-in`, `navbar-in`, `sidebar-in`, `card-in`, `icon-pop`, `btn-in`, `chart-in`, `bar-grow`, `idle-float` (the last one generic/reused by every later task).

- [ ] **Step 1: Write the verification script**

```js
var win = document.querySelector('#browser-window');
getComputedStyle(win).opacity
```
Run before implementing. Expected: `"1"` (static, unanimated — this is the "fails" baseline: nothing changes over time yet, so there's no timeline to verify).

- [ ] **Step 2: Add keyframes and rules to `assets/css/hero-animation.css`**

```css
/* Shared idle float, used by every phase's settled elements */
@keyframes idle-float {
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(3px, -5px) rotate(1.5deg); }
  100% { transform: translate(-3px, 4px) rotate(-1.5deg); }
}

.float-inner {
  animation: idle-float 4s ease-in-out infinite alternate;
}

.float-a { animation-duration: 4s; animation-delay: 0s; }
.float-b { animation-duration: 5s; animation-delay: -1.2s; }
.float-c { animation-duration: 6s; animation-delay: -2.4s; }

/* Canvas phase */
@keyframes decor-fade {
  0%, 100% { opacity: 0; }
  8.9%, 94.4% { opacity: 1; }
}
#decor-dots { animation: decor-fade 9s infinite; }

@keyframes window-in {
  0%, 100% { opacity: 0; transform: scale(0.95); }
  8.9%, 94.4% { opacity: 1; transform: scale(1); }
}
#browser-window {
  transform-origin: center;
  animation: window-in 9s infinite;
}

/* Interface construction phase (8.9% -> 24.4%) */
@keyframes navbar-in {
  0%, 8.9%, 100% { opacity: 0; transform: translateY(-16px); }
  24.4%, 94.4% { opacity: 1; transform: translateY(0); }
}
#navbar { animation: navbar-in 9s infinite; }

@keyframes sidebar-in {
  0%, 8.9%, 100% { opacity: 0; transform: translateX(-16px); }
  24.4%, 94.4% { opacity: 1; transform: translateX(0); }
}
#sidebar { animation: sidebar-in 9s infinite; }

@keyframes card-in {
  0%, 8.9%, 100% { opacity: 0; transform: translateY(20px); }
  24.4%, 94.4% { opacity: 1; transform: translateY(0); }
}
#card-1 { animation: card-in 9s infinite; }
#card-2 { animation: card-in 9s infinite; animation-delay: -0.1s; }

@keyframes icon-pop {
  0%, 8.9%, 100% { opacity: 0; transform: scale(0.5); }
  20% { animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
  24.4%, 94.4% { opacity: 1; transform: scale(1); }
}
#icon-1 { transform-origin: 206px 134px; animation: icon-pop 9s infinite; animation-delay: -0.05s; }
#icon-2 { transform-origin: 326px 134px; animation: icon-pop 9s infinite; animation-delay: -0.15s; }

@keyframes btn-in {
  0%, 8.9%, 100% { opacity: 0; }
  24.4%, 94.4% { opacity: 1; }
}
#btn-primary { animation: btn-in 9s infinite; animation-delay: -0.2s; }
#btn-secondary { animation: btn-in 9s infinite; animation-delay: -0.28s; }

@keyframes chart-in {
  0%, 8.9%, 100% { opacity: 0; transform: translateY(20px); }
  24.4%, 94.4% { opacity: 1; transform: translateY(0); }
}
#chart-card { animation: chart-in 9s infinite; animation-delay: -0.3s; }

@keyframes bar-grow {
  0%, 8.9%, 100% { opacity: 0; transform: scaleY(0); }
  24.4%, 94.4% { opacity: 1; transform: scaleY(1); }
}
#bar-1 { transform-origin: 214px 296px; animation: bar-grow 9s infinite; animation-delay: -0.32s; }
#bar-2 { transform-origin: 244px 296px; animation: bar-grow 9s infinite; animation-delay: -0.36s; }
#bar-3 { transform-origin: 274px 296px; animation: bar-grow 9s infinite; animation-delay: -0.4s; }
#bar-4 { transform-origin: 304px 296px; animation: bar-grow 9s infinite; animation-delay: -0.44s; }
```

- [ ] **Step 3: Verify**

Reload the page. In the console, sample the shared timeline at the "settled" point by driving all animations directly (works because every rule above uses the same 9s duration):

```js
document.getAnimations()
  .filter(function (a) { return a.effect.target.closest('#hero-scene'); })
  .forEach(function (a) { a.currentTime = 3000; }); // 3s into the 9s loop -> mid interface-construction/UX-flow window

getComputedStyle(document.querySelector('#navbar')).opacity
```
Expected: `"1"` (navbar has finished sliding in by 2.2s and holds visible at 3s).

```js
document.getAnimations()
  .filter(function (a) { return a.effect.target.closest('#hero-scene'); })
  .forEach(function (a) { a.currentTime = 8900; }); // 8.9s -> just before loop reset completes
getComputedStyle(document.querySelector('#bar-4')).transform
```
Expected: a transform string close to `matrix(1, 0, 0, ~1, 0, 0)` (bars still near full scale just before reset snaps them back to 0 at 9s/0%).

Visually: watch the hero for one full 9s cycle — window fades/scales in, then navbar/sidebar/cards/buttons/chart appear with a light stagger, then everything fades back out and the cycle restarts smoothly.

- [ ] **Step 4: Commit**

```bash
git add assets/css/hero-animation.css
git commit -m "Animate hero canvas and interface-construction phases"
```

---

### Task 3: UX flow phase + path-length JS

**Files:**
- Modify: `assets/css/hero-animation.css`
- Create: `assets/js/hero-animation.js`

**Interfaces:**
- Consumes: `.draw-path` class (already present on `#path-a`, `#path-b`, `#collab-line`, `#ext-line-1`, `#ext-line-2` from Task 1); `#node-1,2,3`, `#travel-dot`, `#float-icon`.
- Produces: `initPathDrawing()` function (sets `--path-length` + `stroke-dasharray` on every `.draw-path`), called on `DOMContentLoaded`. `@keyframes draw-path`, `node-pop`, `travel-dot-move`, `icon-rotate`.

- [ ] **Step 1: Write the verification script**

```js
document.querySelector('#path-a').style.strokeDasharray
```
Run before implementing. Expected: `""` (empty — JS hasn't set it yet).

- [ ] **Step 2: Create `assets/js/hero-animation.js`**

```js
(function () {
  'use strict';

  function initPathDrawing() {
    var paths = document.querySelectorAll('#hero-scene .draw-path');
    for (var i = 0; i < paths.length; i++) {
      var length = paths[i].getTotalLength();
      paths[i].style.setProperty('--path-length', length);
      paths[i].style.strokeDasharray = length;
      paths[i].style.strokeDashoffset = length;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initPathDrawing();
  });
})();
```

- [ ] **Step 3: Add draw-path keyframes to `assets/css/hero-animation.css`**

```css
@keyframes draw-path {
  0%, 24.4%, 100% { stroke-dashoffset: var(--path-length); }
  40%, 94.4% { stroke-dashoffset: 0; }
}
.draw-path { animation: draw-path 9s infinite; }
#path-b { animation-delay: -0.15s; }

@keyframes node-pop {
  0%, 24.4%, 100% { opacity: 0; transform: scale(0.4); }
  40%, 94.4% { opacity: 1; transform: scale(1); }
}
#node-1 { transform-origin: 420px 110px; animation: node-pop 9s infinite; }
#node-2 { transform-origin: 280px 150px; animation: node-pop 9s infinite; animation-delay: -0.08s; }
#node-3 { transform-origin: 150px 210px; animation: node-pop 9s infinite; animation-delay: -0.16s; }

@keyframes travel-dot-move {
  0%, 24.4%, 100% { opacity: 0; transform: translate(0, 0); }
  27% { opacity: 1; }
  30% { transform: translate(-44px, 34px); }
  33% { transform: translate(-134px, 54px); }
  36% { transform: translate(-214px, 79px); }
  40%, 94.4% { opacity: 0; transform: translate(-264px, 100px); }
}
#travel-dot { animation: travel-dot-move 9s infinite; }

@keyframes icon-rotate {
  0%, 24.4%, 100% { opacity: 0; transform: rotate(0deg); }
  30%, 94.4% { opacity: 1; }
  32% { transform: rotate(-5deg); }
  36% { transform: rotate(5deg); }
  40% { transform: rotate(-3deg); }
}
#float-icon { transform-origin: 500px 150px; animation: icon-rotate 9s infinite; }
```

- [ ] **Step 4: Verify path drawing works**

Reload `http://localhost:8000`. In the console:

```js
[
  document.querySelector('#path-a').style.strokeDasharray !== '',
  getComputedStyle(document.querySelector('#path-a')).getPropertyValue('--path-length') !== ''
]
```
Expected: `[true, true]`.

Drive the timeline to the UX-flow window and check the draw effect completed:

```js
document.getAnimations()
  .filter(function (a) { return a.effect.target.closest('#hero-scene'); })
  .forEach(function (a) { a.currentTime = 3600; }); // 3.6s = 40%, end of UX-flow phase
getComputedStyle(document.querySelector('#path-a')).strokeDashoffset
```
Expected: `"0"` (fully drawn).

Visually: during the UX-flow window of the loop, the two dashed connector lines draw themselves, three small nodes pop in, a small orange dot travels from the navbar avatar down toward the sidebar, and the floating icon outside the window rotates gently.

- [ ] **Step 5: Commit**

```bash
git add assets/css/hero-animation.css assets/js/hero-animation.js index.html
git commit -m "Animate hero UX-flow phase; add path-length measurement JS"
```

---

### Task 4: Collaboration phase

**Files:**
- Modify: `assets/css/hero-animation.css`

**Interfaces:**
- Consumes: `#avatar-a`, `#avatar-b`, `#chat-bubble`, `#badge`, `#ghost-card`, `#collab-line` (from Task 1); `.draw-path`/`draw-path` keyframe (from Task 3, reused for `#collab-line`'s timing window via `animation-delay`).

- [ ] **Step 1: Write the verification script**

```js
getComputedStyle(document.querySelector('#avatar-a')).opacity
```
Expected before implementing: `"1"` (static, unanimated).

- [ ] **Step 2: Add keyframes to `assets/css/hero-animation.css`**

```css
#collab-line { animation-delay: -0.4s; } /* draws during 40%-57.8% window via draw-path keyframe */

@keyframes avatar-pop {
  0%, 40%, 100% { opacity: 0; transform: scale(0.5); }
  50% { animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
  57.8%, 94.4% { opacity: 1; transform: scale(1); }
}
#avatar-a { transform-origin: 70px 110px; animation: avatar-pop 9s infinite; }
#avatar-b { transform-origin: 490px 340px; animation: avatar-pop 9s infinite; animation-delay: -0.1s; }

@keyframes bubble-slide {
  0%, 42%, 100% { opacity: 0; transform: translateY(16px); }
  50%, 94.4% { opacity: 1; transform: translateY(0); }
}
#chat-bubble { animation: bubble-slide 9s infinite; }

@keyframes badge-pop {
  0%, 44%, 100% { opacity: 0; transform: scale(0); }
  52% { animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
  56%, 94.4% { opacity: 1; transform: scale(1); }
}
#badge { transform-origin: 430px 72px; animation: badge-pop 9s infinite; }

@keyframes ghost-fade {
  0%, 46%, 57.8%, 100% { opacity: 0; }
  52% { opacity: 0.35; }
}
#ghost-card { animation: ghost-fade 9s infinite; }
```

- [ ] **Step 3: Verify**

Reload the page. In the console:

```js
document.getAnimations()
  .filter(function (a) { return a.effect.target.closest('#hero-scene'); })
  .forEach(function (a) { a.currentTime = 5200; }); // 5.2s = 57.8%, end of collaboration phase
[
  getComputedStyle(document.querySelector('#avatar-a')).opacity,
  getComputedStyle(document.querySelector('#chat-bubble')).opacity,
  getComputedStyle(document.querySelector('#badge')).opacity
]
```
Expected: `["1", "1", "1"]`.

Visually: during the collaboration window, two avatar circles pop in near the window's corners, a chat bubble slides up near the top-left avatar, an orange notification badge pops in with a slight overshoot, and a faint duplicate of card-1 briefly appears and fades near it.

- [ ] **Step 4: Commit**

```bash
git add assets/css/hero-animation.css
git commit -m "Animate hero collaboration phase"
```

---

### Task 5: Brand expansion phase

**Files:**
- Modify: `assets/css/hero-animation.css`

**Interfaces:**
- Consumes: `#mobile-device`, `#market-card`, `#orbit-icons`, `#ext-line-1`, `#ext-line-2` (from Task 1); `draw-path` keyframe (from Task 3); `#btn-primary`, `#badge` (from Tasks 2/4, for the accent pulse).

- [ ] **Step 1: Write the verification script**

```js
getComputedStyle(document.querySelector('#mobile-device')).opacity
```
Expected before implementing: `"1"` (static, unanimated).

- [ ] **Step 2: Add keyframes to `assets/css/hero-animation.css`**

```css
#ext-line-1, #ext-line-2 { animation-delay: -0.578s; } /* draws during 57.8%-77.8% window */

@keyframes expand-out {
  0%, 57.8%, 100% { opacity: 0; transform: scale(0.3); }
  68% { animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
  77.8%, 94.4% { opacity: 1; transform: scale(1); }
}
#mobile-device {
  transform-box: view-box;
  transform-origin: 280px 200px;
  animation: expand-out 9s infinite;
}
#market-card {
  transform-box: view-box;
  transform-origin: 280px 200px;
  animation: expand-out 9s infinite;
  animation-delay: -0.1s;
}

@keyframes orbit-arc {
  0%, 57.8%, 100% { opacity: 0; transform: rotate(0deg); }
  70%, 94.4% { opacity: 1; }
  75% { transform: rotate(-4deg); }
  85% { transform: rotate(4deg); }
  94.4% { transform: rotate(-2deg); }
}
#orbit-icons {
  transform-box: view-box;
  transform-origin: 280px 200px;
  animation: orbit-arc 9s infinite;
}

@keyframes accent-pulse {
  0%, 60%, 78%, 100% { filter: brightness(1); }
  70% { filter: brightness(1.35); }
}
```

`#btn-primary`, `#badge`, and `#bar-4` already have a single-`animation` rule from Tasks 2/4. A CSS element can only have one `animation` property win per selector, so rather than adding a second declaration, find each of those three existing rules in `assets/css/hero-animation.css` and replace the whole rule (not just add to it) with the two-animation version below:

```css
#btn-primary { animation: btn-in 9s infinite, accent-pulse 9s infinite; animation-delay: -0.2s, 0s; }
#badge { transform-origin: 430px 72px; animation: badge-pop 9s infinite, accent-pulse 9s infinite; }
#bar-4 { transform-origin: 304px 296px; animation: bar-grow 9s infinite, accent-pulse 9s infinite; animation-delay: -0.44s, 0s; }
```

- [ ] **Step 3: Verify**

Reload. In the console:

```js
document.getAnimations()
  .filter(function (a) { return a.effect.target.closest('#hero-scene'); })
  .forEach(function (a) { a.currentTime = 7000; }); // 7.0s = 77.8%, end of expansion phase
[
  getComputedStyle(document.querySelector('#mobile-device')).opacity,
  getComputedStyle(document.querySelector('#market-card')).opacity,
  getComputedStyle(document.querySelector('#ext-line-1')).strokeDashoffset
]
```
Expected: `["1", "1", "0"]`.

Visually: during the expansion window, a small phone outline and a small marketing card scale outward from the center of the browser window to flank it, the three small orbit icons above the window rotate slightly, two new dashed lines connect the window to the new elements, and the orange button/badge briefly brighten.

- [ ] **Step 4: Commit**

```bash
git add assets/css/hero-animation.css
git commit -m "Animate hero brand-expansion phase"
```

---

### Task 6: Settled hero, glow, and loop-reset verification

**Files:**
- Modify: `assets/css/hero-animation.css`

**Interfaces:**
- Consumes: `#glow` (from Task 1); every element/keyframe from Tasks 1–5 (this task only adds the glow pulse and confirms the full-loop seam — the reset behavior is already encoded in every prior keyframe's `100%` stop matching its `0%` stop).

- [ ] **Step 1: Write the verification script**

```js
getComputedStyle(document.querySelector('#glow')).opacity
```
Expected before implementing: `"0"` (static attribute from Task 1 markup, never animated yet).

- [ ] **Step 2: Add the glow keyframe to `assets/css/hero-animation.css`**

```css
@keyframes glow-pulse {
  0%, 77.8%, 100% { opacity: 0; }
  85% { opacity: 0.35; }
  90% { opacity: 0.15; }
  94.4% { opacity: 0.3; }
}
#glow { animation: glow-pulse 9s infinite; }
```

- [ ] **Step 3: Verify the glow and the full-loop seam**

Reload. In the console:

```js
document.getAnimations()
  .filter(function (a) { return a.effect.target.closest('#hero-scene'); })
  .forEach(function (a) { a.currentTime = 8500; }); // 8.5s = 94.4%, settled hero
getComputedStyle(document.querySelector('#glow')).opacity
```
Expected: a non-zero value close to `"0.3"`.

Now check the seam — every element's computed style at `currentTime = 0` and `currentTime = 8999` (end of loop) should match its style at `currentTime = 1` (very start of next loop):

```js
function snapshot(t) {
  document.getAnimations()
    .filter(function (a) { return a.effect.target.closest('#hero-scene'); })
    .forEach(function (a) { a.currentTime = t; });
  return getComputedStyle(document.querySelector('#browser-window')).opacity +
    ',' + getComputedStyle(document.querySelector('#mobile-device')).opacity +
    ',' + getComputedStyle(document.querySelector('#glow')).opacity;
}
[snapshot(0), snapshot(8999)]
```
Expected: both entries equal (e.g. `["0,0,0", "0,0,0"]`, allowing for tiny floating-point differences on the middle value) — confirms no visible pop/jump when the loop restarts.

Visually: watch 2–3 full loops back to back at normal speed — confirm there's no flash, pop, or jump cut at the 9s mark, and that the soft glow behind the window pulses gently once everything has settled.

- [ ] **Step 4: Commit**

```bash
git add assets/css/hero-animation.css
git commit -m "Add hero settled-phase glow pulse; verify seamless loop"
```

---

### Task 7: Reduced-motion support

**Files:**
- Modify: `assets/js/hero-animation.js`
- Modify: `assets/css/hero-animation.css`

**Interfaces:**
- Produces: `initReducedMotion()`, called alongside `initPathDrawing()` on `DOMContentLoaded`. Toggles a `.reduced-motion` class on `.hero-visual`.

- [ ] **Step 1: Write the verification script**

In devtools, open the "Rendering" tab, set "Emulate CSS media feature prefers-reduced-motion" to `reduce`, then reload and run:

```js
document.querySelector('.hero-visual').classList.contains('reduced-motion')
```
Expected before implementing: `false` (feature doesn't exist yet).

- [ ] **Step 2: Add `initReducedMotion()` to `assets/js/hero-animation.js`**

```js
(function () {
  'use strict';

  function initPathDrawing() {
    var paths = document.querySelectorAll('#hero-scene .draw-path');
    for (var i = 0; i < paths.length; i++) {
      var length = paths[i].getTotalLength();
      paths[i].style.setProperty('--path-length', length);
      paths[i].style.strokeDasharray = length;
      paths[i].style.strokeDashoffset = length;
    }
  }

  function initReducedMotion() {
    var visual = document.querySelector('.hero-visual');
    if (!visual) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      visual.classList.add('reduced-motion');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initPathDrawing();
    initReducedMotion();
  });
})();
```

- [ ] **Step 3: Add the static settled-state override to `assets/css/hero-animation.css`**

```css
.hero-visual.reduced-motion #hero-scene * {
  animation: none !important;
}

.hero-visual.reduced-motion #decor-dots,
.hero-visual.reduced-motion #browser-window,
.hero-visual.reduced-motion #navbar,
.hero-visual.reduced-motion #sidebar,
.hero-visual.reduced-motion #card-1,
.hero-visual.reduced-motion #card-2,
.hero-visual.reduced-motion #icon-1,
.hero-visual.reduced-motion #icon-2,
.hero-visual.reduced-motion #btn-primary,
.hero-visual.reduced-motion #btn-secondary,
.hero-visual.reduced-motion #chart-card,
.hero-visual.reduced-motion #bar-1,
.hero-visual.reduced-motion #bar-2,
.hero-visual.reduced-motion #bar-3,
.hero-visual.reduced-motion #bar-4,
.hero-visual.reduced-motion #node-1,
.hero-visual.reduced-motion #node-2,
.hero-visual.reduced-motion #node-3,
.hero-visual.reduced-motion #float-icon,
.hero-visual.reduced-motion #avatar-a,
.hero-visual.reduced-motion #avatar-b,
.hero-visual.reduced-motion #chat-bubble,
.hero-visual.reduced-motion #badge,
.hero-visual.reduced-motion #mobile-device,
.hero-visual.reduced-motion #market-card,
.hero-visual.reduced-motion #orbit-icons {
  opacity: 1;
  transform: none;
}

.hero-visual.reduced-motion .draw-path {
  stroke-dashoffset: 0;
}

.hero-visual.reduced-motion #travel-dot,
.hero-visual.reduced-motion #ghost-card {
  opacity: 0;
}

.hero-visual.reduced-motion #glow {
  opacity: 0.3;
}
```

- [ ] **Step 4: Verify**

With `prefers-reduced-motion: reduce` still emulated, reload and run:

```js
[
  document.querySelector('.hero-visual').classList.contains('reduced-motion'),
  document.getAnimations().filter(function (a) { return a.effect.target.closest('#hero-scene') && a.playState === 'running'; }).length,
  getComputedStyle(document.querySelector('#browser-window')).opacity
]
```
Expected: `[true, 0, "1"]` (class applied, zero running animations, scene fully visible and settled).

Turn the emulation back to "No emulation" and reload — confirm the animation plays normally again.

- [ ] **Step 5: Commit**

```bash
git add assets/js/hero-animation.js assets/css/hero-animation.css
git commit -m "Freeze hero animation on settled frame for prefers-reduced-motion"
```

---

### Task 8: Remove dead pattern-entrance code and final verification

**Files:**
- Modify: `assets/js/main.js`
- Modify: `assets/css/parallax.css`

**Interfaces:**
- Removes: `initPatternEntrance()` (in `main.js`) and its call site; the `pattern-form-in` keyframes and `.hero.parallax-hero.pattern-entrance::before` rule (in `parallax.css`). Both are permanently unreachable now that the homepage hero uses `.hero-loop` instead of `.hero.parallax-hero`.

- [ ] **Step 1: Confirm the code is actually dead**

```bash
grep -n "parallax-hero" index.html about.html services.html contact.html
```
Expected: no match for `index.html` (it now uses `hero-loop`); matches only in `about.html`, `services.html`, `contact.html` (as `page-hero parallax-hero`, unaffected by this removal since those don't use the `pattern-entrance` class at all).

- [ ] **Step 2: Remove `initPatternEntrance()` from `assets/js/main.js`**

Delete this function (currently around `main.js:121-134`):

```js
  function initPatternEntrance() {
    var hero = document.querySelector('.hero.parallax-hero');
    if (!hero) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    hero.classList.add('pattern-entrance');
    hero.addEventListener('animationend', function handler() {
      hero.classList.remove('pattern-entrance');
      hero.removeEventListener('animationend', handler);
    });
  }
```

And remove its call from the `DOMContentLoaded` listener at the bottom of the file:

```js
  document.addEventListener('DOMContentLoaded', function () {
    initNavToggle();
    initScrollReveal();
    initContactForm();
    initParallax();
    initPatternEntrance();
  });
```

becomes:

```js
  document.addEventListener('DOMContentLoaded', function () {
    initNavToggle();
    initScrollReveal();
    initContactForm();
    initParallax();
  });
```

- [ ] **Step 3: Remove the dead rule from `assets/css/parallax.css`**

Delete this block (the comment plus the keyframes plus the rule that follows it):

```css
/* Homepage hero pattern entrance: fades and scales in on load, then hands
   off cleanly to the plain translateY parallax rule above (toggled via JS
   so the animation's end state never permanently overrides scroll-driven
   transform updates). */
@keyframes pattern-form-in {
  from {
    opacity: 0;
    transform: scale(0.85) translateY(var(--pattern-offset, 0));
  }
  to {
    opacity: 0.35;
    transform: scale(1) translateY(var(--pattern-offset, 0));
  }
}

.hero.parallax-hero.pattern-entrance::before {
  animation: pattern-form-in 900ms ease-out;
}
```

- [ ] **Step 4: Verify no regressions on the other pages**

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/about.html`, `/services.html`, `/contact.html` — confirm each still shows its dark hero with the pattern texture (unaffected — they never used `pattern-entrance`).

In the console on any of those three pages:

```js
document.querySelector('.page-hero.parallax-hero') !== null &&
getComputedStyle(document.querySelector('.page-hero.parallax-hero'), '::before').backgroundImage.indexOf('pattern.svg') !== -1
```
Expected: `true` (texture still present on the non-homepage heroes).

- [ ] **Step 5: Full end-to-end verification of the homepage**

Open `http://localhost:8000/index.html`. Confirm, watching for at least one full 9s loop:

1. Desktop width (>860px): two-column hero, illustration animates through all 7 phases and loops with no seam.
2. Resize to <860px: illustration disappears, hero becomes single-column centered, matches the pre-change mobile look.
3. `prefers-reduced-motion: reduce` emulation: scene is static and fully "settled" (per Task 7).
4. No errors in the console on load.

```js
window.getEventListeners ? 'devtools-only-check-skip' : (function () {
  var errors = [];
  window.addEventListener('error', function (e) { errors.push(e.message); });
  return errors;
})()
```
(Simplest reliable check: just confirm the console is clear of red errors after a fresh reload — the snippet above is optional and mainly useful if you want to assert programmatically mid-session.)

- [ ] **Step 6: Commit**

```bash
git add assets/js/main.js assets/css/parallax.css
git commit -m "Remove dead pattern-entrance code superseded by hero loop animation"
```
