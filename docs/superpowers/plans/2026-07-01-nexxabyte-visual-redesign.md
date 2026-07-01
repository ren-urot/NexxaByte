# Nexxabyte Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the existing 4-page Nexxabyte site a dark-gradient parallax hero on every page, a bumped-up typography scale, and subtle scroll-parallax background shapes throughout, per the approved design spec — a visual/motion redesign with zero content or structural changes.

**Architecture:** A new `assets/css/parallax.css` (loaded after `pages.css` on every page) defines a reusable `.parallax-hero` dark-gradient band, a `.section-shapes-host` light-section variant, and a small set of position/size utility classes. A new `initParallax()` function in `assets/js/main.js` drives all motion via one `requestAnimationFrame`-throttled scroll listener, computing each shape's offset from its host section's `getBoundingClientRect().top` (not raw `scrollY`) so the effect stays visually correct regardless of how far down the page a section sits. Three reusable inline SVG line-art shapes (network nodes, code brackets, geometric outline) are placed as direct children of each host `<section>`, before its `.container`, and reused with varying position/size/speed classes rather than authoring unique art per instance.

**Tech Stack:** Same as the existing site — plain HTML5/CSS3/vanilla ES5 JS, no build tooling, no frameworks, no dependencies.

## Global Constraints

- No framework, no build tooling, no npm dependencies — must keep working via `file://` or a static file server.
- No content, copy, or page-structure changes — only visual design (colors, typography scale, hero imagery) and a new parallax motion layer.
- Brand colors (`--color-primary: #FF4E00`, `--color-dark: #484848`) remain the accent colors; new dark-hero tokens are additive, not replacements.
- Every page's header/footer markup must stay byte-identical to the others except the active nav class (already true — this plan never touches header/footer markup).
- `prefers-reduced-motion: reduce` must fully disable parallax transforms — required, not optional.
- All parallax shapes: `aria-hidden="true"`, `pointer-events: none` (via base CSS), never focusable, never intercept clicks.
- JS stays plain scripts (no `type="module"`), consistent with existing `main.js`.
- `assets/css/parallax.css` is linked in every page's `<head>`, immediately after `assets/css/pages.css`.

---

## Shape Library Reference

Three reusable inline SVG shapes are used throughout this plan, always with `viewBox="0 0 200 200"` and `aria-hidden="true"`, varying only their outer `class`/`data-parallax-speed` attributes per instance. Reproduced here for reference — each task below shows the exact literal markup used in that task's edits.

**Network nodes:**
```html
<svg class="parallax-shape ..." data-parallax-speed="0.NN" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><line x1="30" y1="40" x2="100" y2="90"/><line x1="100" y1="90" x2="170" y2="50"/><line x1="100" y1="90" x2="120" y2="160"/><line x1="30" y1="40" x2="40" y2="150"/><circle cx="30" cy="40" r="6"/><circle cx="100" cy="90" r="8"/><circle cx="170" cy="50" r="6"/><circle cx="120" cy="160" r="6"/><circle cx="40" cy="150" r="5"/></g></svg>
```

**Code brackets:**
```html
<svg class="parallax-shape ..." data-parallax-speed="0.NN" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="70,40 20,100 70,160"/><polyline points="130,40 180,100 130,160"/></g></svg>
```

**Geometric outline:**
```html
<svg class="parallax-shape ..." data-parallax-speed="0.NN" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="40" y="40" width="90" height="90" transform="rotate(20 85 85)"/><polygon points="150,120 190,190 110,190"/></g></svg>
```

**Parallax mechanism note (deviation from spec's literal wording):** the design spec describes the offset as `window.scrollY * speed`. During planning this was refined to use the host section's `getBoundingClientRect().top * speed` instead — raw `scrollY` accumulates from the top of the page, so a shape far down the page would already be translated hundreds of pixels off-position (and likely clipped by `overflow: hidden`) before it ever scrolls into view. Using the host's viewport-relative `top` keeps every shape's offset bounded and meaningful exactly while its section is on screen, which is what "parallax motion" needs to look right. This refinement is intentional and should not be flagged as a spec deviation — it correctly implements the spec's *intent* (rAF-throttled, per-shape-speed, reduced-motion-aware parallax).

---

## Task 1: Design Tokens & Typography Scale

**Files:**
- Modify: `assets/css/variables.css`
- Modify: `assets/css/base.css`

**Interfaces:**
- Produces: `--color-charcoal-light`, `--color-text-on-dark-muted` — consumed by `assets/css/parallax.css` in Task 2.
- Produces: bumped `h1`/`h2` font-size and letter-spacing — applies site-wide immediately (no HTML changes needed, existing `h1`/`h2` elements on all 4 pages pick this up automatically).

- [ ] **Step 1: Add new tokens to `assets/css/variables.css`**

Find this block:
```css
  --color-text-on-dark: #F2F2F2;
  --color-border: #E6E6E6;
```

Replace with:
```css
  --color-text-on-dark: #F2F2F2;
  --color-text-on-dark-muted: #C7C7CC;
  --color-border: #E6E6E6;
  --color-charcoal-light: #34343A;
```

- [ ] **Step 2: Bump the heading scale in `assets/css/base.css`**

Find this block:
```css
h1 { font-size: clamp(2.2rem, 4vw + 1rem, 3.4rem); }
h2 { font-size: clamp(1.7rem, 2.4vw + 1rem, 2.4rem); }
```

Replace with:
```css
h1 { font-size: clamp(2.6rem, 5vw + 1rem, 4.2rem); letter-spacing: -0.02em; }
h2 { font-size: clamp(1.9rem, 2.8vw + 1rem, 2.8rem); letter-spacing: -0.02em; }
```

- [ ] **Step 3: Verify in browser**

Run: `python3 -m http.server 8000` from the project root, then visit `http://localhost:8000/index.html`, `/about.html`, `/services.html`, `/contact.html`.

Expected: every page's `h1`/`h2` headings are visibly larger and slightly tighter-tracked than before (compare the Home hero `<h1>` and each page's section `<h2>` headings). No layout breakage — hero/lead text still wraps sensibly, no horizontal scrollbar on any page at 1440px/768px/375px widths. No console errors.

- [ ] **Step 4: Commit**

```bash
git add assets/css/variables.css assets/css/base.css
git commit -m "Add dark-hero tokens and bump heading type scale"
```

---

## Task 2: Parallax Mechanism + Home Hero Redesign

**Files:**
- Create: `assets/css/parallax.css`
- Modify: `assets/js/main.js`
- Modify: `assets/css/pages.css` (`.hero` block)
- Modify: `index.html` (`<head>` link + hero section)
- Modify: `about.html`, `services.html`, `contact.html` (`<head>` link only — one line each)

**Interfaces:**
- Consumes: `--color-black`, `--color-charcoal-light`, `--color-text-on-dark-muted`, `--color-primary`, `--color-dark` (Task 1 + existing tokens).
- Produces: `.parallax-hero`, `.parallax-shape`, `.section-shapes-host`, `.shape-pos-*`, `.shape-sm`/`.shape-lg`, `.is-accent` CSS classes — consumed by Tasks 3–6 across all remaining pages/sections.
- Produces: `initParallax()` in `main.js`, called inside the existing `DOMContentLoaded` handler alongside `initNavToggle()`, `initScrollReveal()`, `initContactForm()` — no other task needs to call it directly, it self-activates on any `[data-parallax-speed]` element present in the DOM.

- [ ] **Step 1: Create `assets/css/parallax.css`**

```css
/* Parallax dark hero / band base */
.parallax-hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, var(--color-black), var(--color-charcoal-light));
  color: #fff;
}

.parallax-hero p,
.parallax-hero .text-muted {
  color: var(--color-text-on-dark-muted);
}

.parallax-hero h1,
.parallax-hero h2 {
  color: #fff;
}

.parallax-hero > .container {
  position: relative;
  z-index: 1;
}

/* Shared parallax shape base */
.parallax-shape {
  position: absolute;
  pointer-events: none;
  z-index: 0;
  width: 220px;
  height: 220px;
  will-change: transform;
}

/* Light-section subtle shape host */
.section-shapes-host {
  position: relative;
  overflow: hidden;
}

.section-shapes-host > .container {
  position: relative;
  z-index: 1;
}

.section-shapes-host .parallax-shape {
  color: var(--color-dark);
  opacity: 0.06;
}

/* Dark hero/band shapes are lighter and slightly more visible */
.parallax-hero .parallax-shape,
.section-dark .parallax-shape {
  color: #fff;
  opacity: 0.14;
}

/* Accent-colored shape variant (must stay last to win over the color rules above) */
.parallax-shape.is-accent {
  color: var(--color-primary);
}

/* Position utility classes */
.shape-pos-tr { top: -30px; right: -30px; }
.shape-pos-tl { top: -20px; left: -40px; }
.shape-pos-br { bottom: -50px; right: 8%; }
.shape-pos-bl { bottom: -30px; left: -30px; }
.shape-pos-mid-r { top: 30%; right: -60px; }

.shape-sm { width: 140px; height: 140px; }
.shape-lg { width: 280px; height: 280px; }

@media (max-width: 768px) {
  .parallax-shape { display: none; }
}
```

- [ ] **Step 2: Add `initParallax()` to `assets/js/main.js`**

Find:
```js
  document.addEventListener('DOMContentLoaded', function () {
    initNavToggle();
    initScrollReveal();
    initContactForm();
  });
})();
```

Replace with:
```js
  function initParallax() {
    var shapes = document.querySelectorAll('[data-parallax-speed]');
    if (!shapes.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    var ticking = false;

    function update() {
      for (var i = 0; i < shapes.length; i++) {
        var speed = parseFloat(shapes[i].getAttribute('data-parallax-speed')) || 0;
        var rect = shapes[i].parentElement.getBoundingClientRect();
        shapes[i].style.transform = 'translateY(' + (rect.top * speed) + 'px)';
      }
      ticking = false;
    }

    function requestUpdate() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    update();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNavToggle();
    initScrollReveal();
    initContactForm();
    initParallax();
  });
})();
```

- [ ] **Step 3: Update `.hero` rules in `assets/css/pages.css`**

Find this entire block (from the `/* Hero */` comment through the end of the `@media (max-width: 960px)` block that follows it):
```css
/* Hero */
.hero {
  padding: 64px 0 96px;
  overflow: hidden;
}

.hero-inner {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 56px;
  align-items: center;
}

.hero-lead {
  font-size: 1.1rem;
  max-width: 480px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  margin-top: 32px;
  flex-wrap: wrap;
}

.hero-media {
  position: relative;
}

.hero-blob {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, var(--color-primary), transparent 70%);
  opacity: 0.35;
  filter: blur(10px);
  z-index: 0;
}

.hero-photo {
  position: relative;
  z-index: 1;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  width: 100%;
  height: 420px;
  object-fit: cover;
}

@media (max-width: 960px) {
  .hero-inner { grid-template-columns: 1fr; }
  .hero-photo { height: 320px; }
}
```

Replace with (the two-column photo layout and its blob/photo rules are removed — the Home hero is now single-column text over the parallax shapes, matching the abstract-geometry direction from the spec):
```css
/* Hero */
.hero {
  padding: 64px 0 96px;
}

.hero-inner {
  max-width: 720px;
}

.hero-lead {
  font-size: 1.1rem;
  max-width: 480px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  margin-top: 32px;
  flex-wrap: wrap;
}
```

- [ ] **Step 4: Add the `parallax.css` link to all 4 pages' `<head>`**

In `index.html`, `about.html`, `services.html`, and `contact.html`, find (identical in all 4 files):
```html
  <link rel="stylesheet" href="assets/css/pages.css">
</head>
```

Replace with:
```html
  <link rel="stylesheet" href="assets/css/pages.css">
  <link rel="stylesheet" href="assets/css/parallax.css">
</head>
```

- [ ] **Step 5: Redesign the Home hero in `index.html`**

Find:
```html
    <section class="hero">
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
        <div class="hero-media reveal">
          <div class="hero-blob"></div>
          <img src="https://picsum.photos/id/1003/900/720" alt="Nexxabyte engineering team collaborating" class="hero-photo">
        </div>
      </div>
    </section>
```

Replace with:
```html
    <section class="hero parallax-hero">
      <svg class="parallax-shape shape-pos-tr shape-lg" data-parallax-speed="0.15" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><line x1="30" y1="40" x2="100" y2="90"/><line x1="100" y1="90" x2="170" y2="50"/><line x1="100" y1="90" x2="120" y2="160"/><line x1="30" y1="40" x2="40" y2="150"/><circle cx="30" cy="40" r="6"/><circle cx="100" cy="90" r="8"/><circle cx="170" cy="50" r="6"/><circle cx="120" cy="160" r="6"/><circle cx="40" cy="150" r="5"/></g></svg>
      <svg class="parallax-shape shape-pos-bl is-accent" data-parallax-speed="0.3" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="70,40 20,100 70,160"/><polyline points="130,40 180,100 130,160"/></g></svg>
      <svg class="parallax-shape shape-pos-mid-r shape-sm" data-parallax-speed="0.4" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="40" y="40" width="90" height="90" transform="rotate(20 85 85)"/><polygon points="150,120 190,190 110,190"/></g></svg>
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
      </div>
    </section>
```

- [ ] **Step 6: Verify in browser**

Run: `python3 -m http.server 8000`, visit `http://localhost:8000/index.html`.

Expected: the hero is now a dark gradient band (near-black to charcoal) with white headline text and three faint floating line-art shapes (a network-node cluster top-right, orange brackets bottom-left, a small geometric outline mid-right). Scroll slowly down past the hero — the three shapes should visibly drift at different rates relative to the page content (the geometric outline, speed 0.4, moves noticeably more than the network shape, speed 0.15). In DevTools, toggle "Emulate CSS prefers-reduced-motion: reduce" and reload — shapes should stay static (no `transform` applied, or `transform: none`) while scrolling. Resize below 768px — shapes should disappear entirely (`display: none`), hero still readable. Confirm `about.html`, `services.html`, `contact.html` still load with no visual change yet (they now link `parallax.css` but have no `.parallax-hero`/`.parallax-shape` elements until later tasks) and no console errors. Confirm the mobile hamburger menu, scroll-reveal fade-ins elsewhere on the page, and the contact form on `contact.html` still work.

- [ ] **Step 7: Commit**

```bash
git add assets/css/parallax.css assets/js/main.js assets/css/pages.css index.html about.html services.html contact.html
git commit -m "Add parallax mechanism and redesign Home hero"
```

---

## Task 3: Home Page — Remaining Section Shapes

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `.section-shapes-host`, `.parallax-shape`, `.shape-pos-*`, `.shape-sm`, `.is-accent` (Task 2). No CSS or JS changes in this task.

- [ ] **Step 1: Add a shape to `#services-preview`**

Find:
```html
    <section class="section" id="services-preview">
      <div class="container">
```

Replace with:
```html
    <section class="section section-shapes-host" id="services-preview">
      <svg class="parallax-shape shape-pos-tr shape-sm" data-parallax-speed="0.2" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="40" y="40" width="90" height="90" transform="rotate(20 85 85)"/><polygon points="150,120 190,190 110,190"/></g></svg>
      <div class="container">
```

- [ ] **Step 2: Add a shape to `#why-choose-us`**

Find:
```html
    <section class="section section-alt" id="why-choose-us">
      <div class="container">
```

Replace with:
```html
    <section class="section section-alt section-shapes-host" id="why-choose-us">
      <svg class="parallax-shape shape-pos-bl shape-sm" data-parallax-speed="0.18" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><line x1="30" y1="40" x2="100" y2="90"/><line x1="100" y1="90" x2="170" y2="50"/><line x1="100" y1="90" x2="120" y2="160"/><line x1="30" y1="40" x2="40" y2="150"/><circle cx="30" cy="40" r="6"/><circle cx="100" cy="90" r="8"/><circle cx="170" cy="50" r="6"/><circle cx="120" cy="160" r="6"/><circle cx="40" cy="150" r="5"/></g></svg>
      <div class="container">
```

- [ ] **Step 3: Add two shapes to `#mission-vision-teaser`**

Find:
```html
    <section class="section section-dark" id="mission-vision-teaser">
      <div class="container mission-teaser reveal">
```

Replace with:
```html
    <section class="section section-dark section-shapes-host" id="mission-vision-teaser">
      <svg class="parallax-shape shape-pos-tr is-accent" data-parallax-speed="0.25" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="70,40 20,100 70,160"/><polyline points="130,40 180,100 130,160"/></g></svg>
      <svg class="parallax-shape shape-pos-bl shape-sm" data-parallax-speed="0.35" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="40" y="40" width="90" height="90" transform="rotate(20 85 85)"/><polygon points="150,120 190,190 110,190"/></g></svg>
      <div class="container mission-teaser reveal">
```

- [ ] **Step 4: Add a shape to the final CTA banner**

Find:
```html
    <section class="section">
      <div class="container cta-banner-inner reveal">
        <h2>Ready to Build Something Great?</h2>
```

Replace with:
```html
    <section class="section section-shapes-host">
      <svg class="parallax-shape shape-pos-tr shape-sm" data-parallax-speed="0.2" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><line x1="30" y1="40" x2="100" y2="90"/><line x1="100" y1="90" x2="170" y2="50"/><line x1="100" y1="90" x2="120" y2="160"/><line x1="30" y1="40" x2="40" y2="150"/><circle cx="30" cy="40" r="6"/><circle cx="100" cy="90" r="8"/><circle cx="170" cy="50" r="6"/><circle cx="120" cy="160" r="6"/><circle cx="40" cy="150" r="5"/></g></svg>
      <div class="container cta-banner-inner reveal">
        <h2>Ready to Build Something Great?</h2>
```

- [ ] **Step 5: Verify in browser**

Run: `python3 -m http.server 8000`, visit `http://localhost:8000/index.html`, scroll through the entire page slowly.

Expected: every section below the hero now shows one (or, for the dark mission band, two) faint background shape(s) that drift slightly as you scroll — subtle on the light sections (low opacity, dark-grey), more visible in the dark mission band (white/orange, matching the hero's treatment). No shape overlaps or obscures any text or button. No horizontal scrollbar introduced (`overflow: hidden` on each host section should clip any shape that extends past its bounds). Existing scroll-reveal fade-ins on cards/feature items still fire normally — parallax shapes and scroll-reveal content don't interfere with each other. No console errors.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "Add parallax shapes to Home page sections"
```

---

## Task 4: About Page — Hero & Section Shapes

**Files:**
- Modify: `about.html`

**Interfaces:**
- Consumes: `.parallax-hero`, `.section-shapes-host`, `.parallax-shape`, `.shape-pos-*`, `.shape-sm`, `.is-accent` (Task 2).

- [ ] **Step 1: Redesign the page-hero band**

Find:
```html
    <section class="section page-hero">
      <div class="container">
        <span class="eyebrow">About Nexxabyte</span>
```

Replace with:
```html
    <section class="section page-hero parallax-hero">
      <svg class="parallax-shape shape-pos-tr shape-sm" data-parallax-speed="0.2" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><line x1="30" y1="40" x2="100" y2="90"/><line x1="100" y1="90" x2="170" y2="50"/><line x1="100" y1="90" x2="120" y2="160"/><line x1="30" y1="40" x2="40" y2="150"/><circle cx="30" cy="40" r="6"/><circle cx="100" cy="90" r="8"/><circle cx="170" cy="50" r="6"/><circle cx="120" cy="160" r="6"/><circle cx="40" cy="150" r="5"/></g></svg>
      <svg class="parallax-shape shape-pos-bl shape-sm is-accent" data-parallax-speed="0.3" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="70,40 20,100 70,160"/><polyline points="130,40 180,100 130,160"/></g></svg>
      <div class="container">
        <span class="eyebrow">About Nexxabyte</span>
```

- [ ] **Step 2: Add a shape to the "Who We Are" section**

Find:
```html
    <section class="section">
      <div class="container about-intro">
```

Replace with:
```html
    <section class="section section-shapes-host">
      <svg class="parallax-shape shape-pos-br shape-sm" data-parallax-speed="0.18" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="40" y="40" width="90" height="90" transform="rotate(20 85 85)"/><polygon points="150,120 190,190 110,190"/></g></svg>
      <div class="container about-intro">
```

- [ ] **Step 3: Add a shape to the mission/vision cards section**

Find:
```html
    <section class="section section-alt">
      <div class="container">
        <div class="grid grid-2">
```

Replace with:
```html
    <section class="section section-alt section-shapes-host">
      <svg class="parallax-shape shape-pos-tl shape-sm" data-parallax-speed="0.22" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><line x1="30" y1="40" x2="100" y2="90"/><line x1="100" y1="90" x2="170" y2="50"/><line x1="100" y1="90" x2="120" y2="160"/><line x1="30" y1="40" x2="40" y2="150"/><circle cx="30" cy="40" r="6"/><circle cx="100" cy="90" r="8"/><circle cx="170" cy="50" r="6"/><circle cx="120" cy="160" r="6"/><circle cx="40" cy="150" r="5"/></g></svg>
      <div class="container">
        <div class="grid grid-2">
```

- [ ] **Step 4: Add a shape to the "Why Choose Nexxabyte?" section**

Find:
```html
    <section class="section">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow">Why Nexxabyte</span>
```

Replace with:
```html
    <section class="section section-shapes-host">
      <svg class="parallax-shape shape-pos-br shape-sm is-accent" data-parallax-speed="0.2" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="70,40 20,100 70,160"/><polyline points="130,40 180,100 130,160"/></g></svg>
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow">Why Nexxabyte</span>
```

- [ ] **Step 5: Add a shape to `#how-we-work`**

Find:
```html
    <section class="section section-alt" id="how-we-work">
      <div class="container">
```

Replace with:
```html
    <section class="section section-alt section-shapes-host" id="how-we-work">
      <svg class="parallax-shape shape-pos-tr shape-sm" data-parallax-speed="0.25" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="40" y="40" width="90" height="90" transform="rotate(20 85 85)"/><polygon points="150,120 190,190 110,190"/></g></svg>
      <div class="container">
```

- [ ] **Step 6: Add a shape to the CTA banner**

Find:
```html
    <section class="section">
      <div class="container cta-banner-inner reveal">
        <h2>Let's Build Your Next Product Together</h2>
```

Replace with:
```html
    <section class="section section-shapes-host">
      <svg class="parallax-shape shape-pos-bl shape-sm" data-parallax-speed="0.2" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><line x1="30" y1="40" x2="100" y2="90"/><line x1="100" y1="90" x2="170" y2="50"/><line x1="100" y1="90" x2="120" y2="160"/><line x1="30" y1="40" x2="40" y2="150"/><circle cx="30" cy="40" r="6"/><circle cx="100" cy="90" r="8"/><circle cx="170" cy="50" r="6"/><circle cx="120" cy="160" r="6"/><circle cx="40" cy="150" r="5"/></g></svg>
      <div class="container cta-banner-inner reveal">
        <h2>Let's Build Your Next Product Together</h2>
```

- [ ] **Step 7: Verify in browser**

Run: `python3 -m http.server 8000`, visit `http://localhost:8000/about.html`, scroll through the entire page.

Expected: the page-hero band is now dark with white text and two drifting shapes (matching Home's hero treatment). Every section below it shows one subtle drifting shape. The "Who We Are" photo, mission/vision cards, why-choose-us grid, 5-step process, and CTA all render exactly as before content-wise — only the background shapes and hero styling changed. Nav highlighting still shows "About" active. No console errors, no horizontal scroll at 375px/768px/1440px.

- [ ] **Step 8: Commit**

```bash
git add about.html
git commit -m "Add parallax hero and section shapes to About page"
```

---

## Task 5: Services Page — Hero & Section Shapes

**Files:**
- Modify: `services.html`

**Interfaces:**
- Consumes: `.parallax-hero`, `.section-shapes-host`, `.parallax-shape`, `.shape-pos-*`, `.shape-sm`, `.is-accent` (Task 2).

- [ ] **Step 1: Redesign the page-hero band**

Find:
```html
    <section class="section page-hero">
      <div class="container">
        <span class="eyebrow">Our Services</span>
```

Replace with:
```html
    <section class="section page-hero parallax-hero">
      <svg class="parallax-shape shape-pos-tr shape-sm is-accent" data-parallax-speed="0.25" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="70,40 20,100 70,160"/><polyline points="130,40 180,100 130,160"/></g></svg>
      <svg class="parallax-shape shape-pos-bl shape-sm" data-parallax-speed="0.35" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="40" y="40" width="90" height="90" transform="rotate(20 85 85)"/><polygon points="150,120 190,190 110,190"/></g></svg>
      <div class="container">
        <span class="eyebrow">Our Services</span>
```

- [ ] **Step 2: Add a shape to the Development section**

Find:
```html
    <section class="section">
      <div class="container">
        <h2 class="group-title reveal">Development</h2>
```

Replace with:
```html
    <section class="section section-shapes-host">
      <svg class="parallax-shape shape-pos-tr shape-sm" data-parallax-speed="0.18" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><line x1="30" y1="40" x2="100" y2="90"/><line x1="100" y1="90" x2="170" y2="50"/><line x1="100" y1="90" x2="120" y2="160"/><line x1="30" y1="40" x2="40" y2="150"/><circle cx="30" cy="40" r="6"/><circle cx="100" cy="90" r="8"/><circle cx="170" cy="50" r="6"/><circle cx="120" cy="160" r="6"/><circle cx="40" cy="150" r="5"/></g></svg>
      <div class="container">
        <h2 class="group-title reveal">Development</h2>
```

- [ ] **Step 3: Add a shape to the Design & Quality section**

Find:
```html
    <section class="section section-alt">
      <div class="container">
        <h2 class="group-title reveal">Design &amp; Quality</h2>
```

Replace with:
```html
    <section class="section section-alt section-shapes-host">
      <svg class="parallax-shape shape-pos-bl shape-sm" data-parallax-speed="0.22" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="40" y="40" width="90" height="90" transform="rotate(20 85 85)"/><polygon points="150,120 190,190 110,190"/></g></svg>
      <div class="container">
        <h2 class="group-title reveal">Design &amp; Quality</h2>
```

- [ ] **Step 4: Add a shape to the Operations section**

Find:
```html
    <section class="section">
      <div class="container">
        <h2 class="group-title reveal">Operations</h2>
```

Replace with:
```html
    <section class="section section-shapes-host">
      <svg class="parallax-shape shape-pos-tr shape-sm is-accent" data-parallax-speed="0.2" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="70,40 20,100 70,160"/><polyline points="130,40 180,100 130,160"/></g></svg>
      <div class="container">
        <h2 class="group-title reveal">Operations</h2>
```

- [ ] **Step 5: Add a shape to the Team & Consulting section**

Find:
```html
    <section class="section section-alt">
      <div class="container">
        <h2 class="group-title reveal">Team &amp; Consulting</h2>
```

Replace with:
```html
    <section class="section section-alt section-shapes-host">
      <svg class="parallax-shape shape-pos-br shape-sm" data-parallax-speed="0.25" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><line x1="30" y1="40" x2="100" y2="90"/><line x1="100" y1="90" x2="170" y2="50"/><line x1="100" y1="90" x2="120" y2="160"/><line x1="30" y1="40" x2="40" y2="150"/><circle cx="30" cy="40" r="6"/><circle cx="100" cy="90" r="8"/><circle cx="170" cy="50" r="6"/><circle cx="120" cy="160" r="6"/><circle cx="40" cy="150" r="5"/></g></svg>
      <div class="container">
        <h2 class="group-title reveal">Team &amp; Consulting</h2>
```

- [ ] **Step 6: Add a shape to the CTA banner**

Find:
```html
    <section class="section">
      <div class="container cta-banner-inner reveal">
        <h2>Not Sure Where to Start?</h2>
```

Replace with:
```html
    <section class="section section-shapes-host">
      <svg class="parallax-shape shape-pos-tl shape-sm" data-parallax-speed="0.2" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="40" y="40" width="90" height="90" transform="rotate(20 85 85)"/><polygon points="150,120 190,190 110,190"/></g></svg>
      <div class="container cta-banner-inner reveal">
        <h2>Not Sure Where to Start?</h2>
```

- [ ] **Step 7: Verify in browser**

Run: `python3 -m http.server 8000`, visit `http://localhost:8000/services.html`, scroll through the entire page.

Expected: dark parallax hero at top with two drifting shapes; each of the four service-group sections (Development / Design & Quality / Operations / Team & Consulting) shows one subtle drifting shape; all 12 service cards still render with correct icons/titles/descriptions, unchanged. CTA banner has its shape too. Nav highlighting shows "Services" active. No console errors, no horizontal scroll at any width.

- [ ] **Step 8: Commit**

```bash
git add services.html
git commit -m "Add parallax hero and section shapes to Services page"
```

---

## Task 6: Contact Page — Hero & Section Shape

**Files:**
- Modify: `contact.html`

**Interfaces:**
- Consumes: `.parallax-hero`, `.section-shapes-host`, `.parallax-shape`, `.shape-pos-*`, `.shape-sm`, `.is-accent` (Task 2).

- [ ] **Step 1: Redesign the page-hero band**

Find:
```html
    <section class="section page-hero">
      <div class="container">
        <span class="eyebrow">Contact Us</span>
```

Replace with:
```html
    <section class="section page-hero parallax-hero">
      <svg class="parallax-shape shape-pos-tr shape-sm" data-parallax-speed="0.2" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><line x1="30" y1="40" x2="100" y2="90"/><line x1="100" y1="90" x2="170" y2="50"/><line x1="100" y1="90" x2="120" y2="160"/><line x1="30" y1="40" x2="40" y2="150"/><circle cx="30" cy="40" r="6"/><circle cx="100" cy="90" r="8"/><circle cx="170" cy="50" r="6"/><circle cx="120" cy="160" r="6"/><circle cx="40" cy="150" r="5"/></g></svg>
      <svg class="parallax-shape shape-pos-bl shape-sm is-accent" data-parallax-speed="0.3" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="40" y="40" width="90" height="90" transform="rotate(20 85 85)"/><polygon points="150,120 190,190 110,190"/></g></svg>
      <div class="container">
        <span class="eyebrow">Contact Us</span>
```

- [ ] **Step 2: Add a shape to the contact-form section**

Find:
```html
    <section class="section">
      <div class="container contact-grid">
```

Replace with:
```html
    <section class="section section-shapes-host">
      <svg class="parallax-shape shape-pos-tr shape-sm" data-parallax-speed="0.18" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="70,40 20,100 70,160"/><polyline points="130,40 180,100 130,160"/></g></svg>
      <div class="container contact-grid">
```

- [ ] **Step 3: Verify in browser**

Run: `python3 -m http.server 8000`, visit `http://localhost:8000/contact.html`.

Expected: dark parallax hero at top with two drifting shapes; the form section has one subtle drifting shape behind the form/contact-info card layout, not overlapping or obscuring any form field. Nav highlighting shows "Contact" active. Submit the form empty — validation errors still appear correctly (form behavior unaffected by the new shape). No console errors.

- [ ] **Step 4: Commit**

```bash
git add contact.html
git commit -m "Add parallax hero and section shape to Contact page"
```

---

## Task 7: Cross-Page QA Pass

**Files:**
- Modify: any of the above, only if QA finds a genuine issue (no new files expected)

**Interfaces:**
- None — this is a verification-only task, same pattern as the original site build's final QA task.

- [ ] **Step 1: Serve the site locally**

```bash
python3 -m http.server 8000
```

- [ ] **Step 2: Verify parallax motion consistency across all 4 pages**

Visit `index.html`, `about.html`, `services.html`, `contact.html`. On each, scroll slowly from top to bottom. Confirm: every dark hero band shows its shapes drifting at visibly different rates from each other and from the page content; every light section's single shape is subtle (barely visible, not distracting) and also drifts; no shape ever overlaps clickable text/buttons or becomes more prominent than the foreground content; no section shows a shape "snapping" or jumping abruptly.

- [ ] **Step 3: Verify `prefers-reduced-motion` and mobile behavior**

In browser DevTools, enable "Emulate CSS prefers-reduced-motion: reduce", reload each of the 4 pages, and scroll — shapes must stay completely static (no transform). Then disable that emulation and instead resize the viewport below 768px on each page — all `.parallax-shape` elements must disappear (`display: none`), with hero/section text still fully readable and correctly laid out (single-column, no overflow).

- [ ] **Step 4: Verify existing functionality is unaffected**

On each page: mobile hamburger nav still opens/closes and toggles `aria-expanded`; nav active-state highlighting is still correct per page; existing `.reveal` scroll-fade-ins on cards/feature-items/process-steps still fire correctly; on `contact.html`, submitting the form empty still shows the three field errors and the "Please fix the highlighted fields." status message, and a valid submission still passes validation.

- [ ] **Step 5: Verify console cleanliness and no layout regressions**

Open DevTools Console on each of the 4 pages, scroll through fully, resize through 375px/768px/1440px. Expected: zero JavaScript errors or warnings (the placeholder Formspree 404 on contact-form submit is expected/documented, not a bug). No horizontal scrollbar at any width on any page.

- [ ] **Step 6: Verify dark-hero text contrast**

On each page's hero/page-hero band, visually confirm the white `h1`/`h2` and the `--color-text-on-dark-muted` (#C7C7CC) body/eyebrow text are clearly legible against the dark gradient background at both the darker (`--color-black`) and lighter (`--color-charcoal-light`) ends of the gradient.

- [ ] **Step 7: Fix any issues found, then commit**

If QA finds issues, fix them in the relevant file(s), then:

```bash
git add -A
git commit -m "Fix cross-page QA issues from visual redesign pass"
```

If no issues are found, skip the commit (nothing to commit).
