# Nexxabyte Diamond-Pattern Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current 25-instance floating-shape parallax system (3 hand-drawn SVGs scattered across all 4 pages) with a single tileable diamond-grid pattern texture, applied as a scroll-drifting `::before` background layer on every `.parallax-hero` and `.section-shapes-host` element.

**Architecture:** `assets/css/parallax.css` is rewritten so `.parallax-hero`/`.section-shapes-host` gain a shared `::before` pseudo-element carrying a tiled `background-image` (the new `assets/images/pattern-diamonds.svg` asset, already committed), differing only in opacity. `initParallax()` in `assets/js/main.js` is rewritten to target these host elements directly (instead of individual shape elements), driving a `--pattern-offset` CSS custom property that the `::before`'s `transform: translateY()` consumes — same rAF-throttled, viewport-relative, `prefers-reduced-motion`-respecting mechanism as before, just applied once per host instead of once per shape. All 4 HTML pages then have their inline `<svg class="parallax-shape">` markup removed (25 instances total), while keeping the `.parallax-hero`/`.section-shapes-host` classes on their host `<section>` elements unchanged.

**Tech Stack:** Same as the existing site — plain HTML5/CSS3/vanilla ES5 JS, no build tooling, no frameworks, no dependencies.

## Global Constraints

- No framework, no build tooling, no npm dependencies.
- No content, copy, or page-structure changes — visual/motion layer only.
- `prefers-reduced-motion: reduce` must fully disable the pattern drift.
- The pattern stays visible on mobile (no `display: none` media query this time — unlike the discrete shapes, a single low-opacity tiled texture doesn't clutter narrow viewports).
- `assets/images/pattern-diamonds.svg` (already committed) is the only new asset — one file, shared by both dark-hero and light-section contexts via opacity, not separate color variants.
- Header/footer markup must stay byte-identical across all 4 pages (this plan never touches header/footer).
- `.parallax-hero` and `.section-shapes-host` class assignments on `<section>` elements are unchanged by this plan — only the shape markup nested inside them is removed.

---

## Task 1: Rewrite `parallax.css` — Pattern Layer

**Files:**
- Modify: `assets/css/parallax.css` (full-file rewrite)

**Interfaces:**
- Consumes: `assets/images/pattern-diamonds.svg` (already committed).
- Produces: `.parallax-hero::before` / `.section-shapes-host::before` pattern layer, driven by the `--pattern-offset` custom property — consumed by Task 2's rewritten `initParallax()`.
- Removes: `.parallax-shape`, `.shape-pos-tr/tl/br/bl/mid-r`, `.shape-sm`/`.shape-lg`, `.is-accent`, and the `@media (max-width: 768px) { .parallax-shape { display: none; } }` rule — all now unused (their consuming markup is removed in Tasks 3–6).

- [ ] **Step 1: Replace the full contents of `assets/css/parallax.css`**

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

/* Light-section subtle pattern host */
.section-shapes-host {
  position: relative;
  overflow: hidden;
}

.section-shapes-host > .container {
  position: relative;
  z-index: 1;
}

/* Tiled diamond-pattern background layer, shared by dark heroes and light sections */
.parallax-hero::before,
.section-shapes-host::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: url('../images/pattern-diamonds.svg');
  background-repeat: repeat;
  background-size: 180px 90px;
  transform: translateY(var(--pattern-offset, 0));
}

.parallax-hero::before {
  opacity: 0.35;
}

.section-shapes-host::before {
  opacity: 0.08;
}
```

- [ ] **Step 2: Verify in browser**

Run: `python3 -m http.server 8000` from the project root, then visit `http://localhost:8000/index.html`.

Expected: the page loads without console errors even though the HTML still contains the old `<svg class="parallax-shape">` elements at this point (Tasks 3–6 remove them) — those elements will simply render as invisible/unstyled inline SVGs since their CSS classes no longer exist, which is expected and harmless at this intermediate stage. Open DevTools, inspect the hero `<section>`, and confirm its computed `::before` pseudo-element has `background-image: url(".../pattern-diamonds.svg")` and `opacity: 0.35`. No `--pattern-offset` value yet (Task 2 adds the JS that sets it) — the `::before` should still render at its default (untransformed) position since the CSS `var(--pattern-offset, 0)` fallback applies.

- [ ] **Step 3: Commit**

```bash
git add assets/css/parallax.css
git commit -m "Replace shape parallax CSS with tiled pattern layer"
```

---

## Task 2: Rewrite `initParallax()` — Pattern-Offset JS

**Files:**
- Modify: `assets/js/main.js`

**Interfaces:**
- Consumes: `.parallax-hero`, `.section-shapes-host` (existing classes, present in all 4 pages' HTML), `--pattern-offset` custom property (Task 1).
- Produces: rewritten `initParallax()` — same function name and call site inside `DOMContentLoaded`, so no other code changes; `initNavToggle`, `initScrollReveal`, `initContactForm` remain untouched.

- [ ] **Step 1: Replace `initParallax()` in `assets/js/main.js`**

Find:
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
```

Replace with:
```js
  function initParallax() {
    var hosts = document.querySelectorAll('.parallax-hero, .section-shapes-host');
    if (!hosts.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    var ticking = false;

    function update() {
      for (var i = 0; i < hosts.length; i++) {
        var rect = hosts[i].getBoundingClientRect();
        hosts[i].style.setProperty('--pattern-offset', (rect.top * 0.1) + 'px');
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
```

- [ ] **Step 2: Verify in browser**

Run: `python3 -m http.server 8000`, visit `http://localhost:8000/index.html`, scroll slowly.

Expected: in DevTools, inspect the hero `<section>` element and confirm it now has an inline `style="--pattern-offset: ...px;"` attribute that updates as you scroll. The tiled pattern behind the hero text should visibly drift slower than the page content (offset multiplier `0.1` is intentionally slow — subtle drift, not a distinct moving object). Toggle "Emulate CSS prefers-reduced-motion: reduce" in DevTools and reload — the `--pattern-offset` inline style should no longer appear/update on scroll. Confirm `initNavToggle`, `initScrollReveal`, and (on `contact.html`) `initContactForm` still work — mobile hamburger menu opens/closes, cards fade in on scroll, contact form validates on submit.

- [ ] **Step 3: Commit**

```bash
git add assets/js/main.js
git commit -m "Rewrite initParallax to drive pattern background offset"
```

---

## Task 3: Remove Shape Markup — Home Page

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `.parallax-hero`/`.section-shapes-host` CSS from Task 1 (now automatically shows the tiled pattern once the old `<svg>` shape elements are removed — no HTML changes needed to the host `<section>` tags themselves, only the nested shape markup).

- [ ] **Step 1: Remove the 3 shapes from the hero section**

Find:
```html
    <section class="hero parallax-hero">
      <svg class="parallax-shape shape-pos-tr shape-lg" data-parallax-speed="0.15" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><line x1="30" y1="40" x2="100" y2="90"/><line x1="100" y1="90" x2="170" y2="50"/><line x1="100" y1="90" x2="120" y2="160"/><line x1="30" y1="40" x2="40" y2="150"/><circle cx="30" cy="40" r="6"/><circle cx="100" cy="90" r="8"/><circle cx="170" cy="50" r="6"/><circle cx="120" cy="160" r="6"/><circle cx="40" cy="150" r="5"/></g></svg>
      <svg class="parallax-shape shape-pos-bl is-accent" data-parallax-speed="0.3" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="70,40 20,100 70,160"/><polyline points="130,40 180,100 130,160"/></g></svg>
      <svg class="parallax-shape shape-pos-mid-r shape-sm" data-parallax-speed="0.4" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="40" y="40" width="90" height="90" transform="rotate(20 85 85)"/><polygon points="150,120 190,190 110,190"/></g></svg>
      <div class="container hero-inner">
```

Replace with:
```html
    <section class="hero parallax-hero">
      <div class="container hero-inner">
```

- [ ] **Step 2: Remove the shape from `#services-preview`**

Find:
```html
    <section class="section section-shapes-host" id="services-preview">
      <svg class="parallax-shape shape-pos-tr shape-sm" data-parallax-speed="0.2" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="40" y="40" width="90" height="90" transform="rotate(20 85 85)"/><polygon points="150,120 190,190 110,190"/></g></svg>
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow">What We Do</span>
```

Replace with:
```html
    <section class="section section-shapes-host" id="services-preview">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow">What We Do</span>
```

- [ ] **Step 3: Remove the shape from `#why-choose-us`**

Find:
```html
    <section class="section section-alt section-shapes-host" id="why-choose-us">
      <svg class="parallax-shape shape-pos-bl shape-sm" data-parallax-speed="0.18" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><line x1="30" y1="40" x2="100" y2="90"/><line x1="100" y1="90" x2="170" y2="50"/><line x1="100" y1="90" x2="120" y2="160"/><line x1="30" y1="40" x2="40" y2="150"/><circle cx="30" cy="40" r="6"/><circle cx="100" cy="90" r="8"/><circle cx="170" cy="50" r="6"/><circle cx="120" cy="160" r="6"/><circle cx="40" cy="150" r="5"/></g></svg>
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow">Why Nexxabyte</span>
```

Replace with:
```html
    <section class="section section-alt section-shapes-host" id="why-choose-us">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow">Why Nexxabyte</span>
```

- [ ] **Step 4: Remove the 2 shapes from `#mission-vision-teaser`**

Find:
```html
    <section class="section section-dark section-shapes-host" id="mission-vision-teaser">
      <svg class="parallax-shape shape-pos-tr is-accent" data-parallax-speed="0.25" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="70,40 20,100 70,160"/><polyline points="130,40 180,100 130,160"/></g></svg>
      <svg class="parallax-shape shape-pos-bl shape-sm" data-parallax-speed="0.35" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="40" y="40" width="90" height="90" transform="rotate(20 85 85)"/><polygon points="150,120 190,190 110,190"/></g></svg>
      <div class="container mission-teaser reveal">
```

Replace with:
```html
    <section class="section section-dark section-shapes-host" id="mission-vision-teaser">
      <div class="container mission-teaser reveal">
```

- [ ] **Step 5: Remove the shape from the final CTA banner**

Find:
```html
    <section class="section section-shapes-host">
      <svg class="parallax-shape shape-pos-tr shape-sm" data-parallax-speed="0.2" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><line x1="30" y1="40" x2="100" y2="90"/><line x1="100" y1="90" x2="170" y2="50"/><line x1="100" y1="90" x2="120" y2="160"/><line x1="30" y1="40" x2="40" y2="150"/><circle cx="30" cy="40" r="6"/><circle cx="100" cy="90" r="8"/><circle cx="170" cy="50" r="6"/><circle cx="120" cy="160" r="6"/><circle cx="40" cy="150" r="5"/></g></svg>
      <div class="container cta-banner-inner reveal">
        <h2>Ready to Build Something Great?</h2>
```

Replace with:
```html
    <section class="section section-shapes-host">
      <div class="container cta-banner-inner reveal">
        <h2>Ready to Build Something Great?</h2>
```

- [ ] **Step 6: Verify in browser**

Run: `python3 -m http.server 8000`, visit `http://localhost:8000/index.html`, scroll through the entire page.

Expected: every section that previously had a floating line-art shape now shows the tiled diamond pattern instead — subtle and slow-drifting on light sections, more visible on the dark hero and dark mission band. No leftover `<svg class="parallax-shape">` elements anywhere in the page (`grep -c "parallax-shape" index.html` should return `0`). Nav, scroll-reveal, and all buttons/links still work. No console errors, no horizontal scrollbar.

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "Replace Home page shapes with diamond pattern background"
```

---

## Task 4: Remove Shape Markup — About Page

**Files:**
- Modify: `about.html`

**Interfaces:**
- Consumes: same `.parallax-hero`/`.section-shapes-host` CSS from Task 1.

- [ ] **Step 1: Remove the 2 shapes from the page-hero**

Find:
```html
    <section class="section page-hero parallax-hero">
      <svg class="parallax-shape shape-pos-tr shape-sm" data-parallax-speed="0.2" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><line x1="30" y1="40" x2="100" y2="90"/><line x1="100" y1="90" x2="170" y2="50"/><line x1="100" y1="90" x2="120" y2="160"/><line x1="30" y1="40" x2="40" y2="150"/><circle cx="30" cy="40" r="6"/><circle cx="100" cy="90" r="8"/><circle cx="170" cy="50" r="6"/><circle cx="120" cy="160" r="6"/><circle cx="40" cy="150" r="5"/></g></svg>
      <svg class="parallax-shape shape-pos-bl shape-sm is-accent" data-parallax-speed="0.3" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="70,40 20,100 70,160"/><polyline points="130,40 180,100 130,160"/></g></svg>
      <div class="container">
        <span class="eyebrow">About Nexxabyte</span>
```

Replace with:
```html
    <section class="section page-hero parallax-hero">
      <div class="container">
        <span class="eyebrow">About Nexxabyte</span>
```

- [ ] **Step 2: Remove the shape from the "Who We Are" section**

Find:
```html
    <section class="section section-shapes-host">
      <svg class="parallax-shape shape-pos-br shape-sm" data-parallax-speed="0.18" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="40" y="40" width="90" height="90" transform="rotate(20 85 85)"/><polygon points="150,120 190,190 110,190"/></g></svg>
      <div class="container about-intro">
```

Replace with:
```html
    <section class="section section-shapes-host">
      <div class="container about-intro">
```

- [ ] **Step 3: Remove the shape from the mission/vision cards section**

Find:
```html
    <section class="section section-alt section-shapes-host">
      <svg class="parallax-shape shape-pos-tl shape-sm" data-parallax-speed="0.22" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><line x1="30" y1="40" x2="100" y2="90"/><line x1="100" y1="90" x2="170" y2="50"/><line x1="100" y1="90" x2="120" y2="160"/><line x1="30" y1="40" x2="40" y2="150"/><circle cx="30" cy="40" r="6"/><circle cx="100" cy="90" r="8"/><circle cx="170" cy="50" r="6"/><circle cx="120" cy="160" r="6"/><circle cx="40" cy="150" r="5"/></g></svg>
      <div class="container">
        <div class="grid grid-2">
```

Replace with:
```html
    <section class="section section-alt section-shapes-host">
      <div class="container">
        <div class="grid grid-2">
```

- [ ] **Step 4: Remove the shape from the "Why Choose Nexxabyte?" section**

Find:
```html
    <section class="section section-shapes-host">
      <svg class="parallax-shape shape-pos-br shape-sm is-accent" data-parallax-speed="0.2" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="70,40 20,100 70,160"/><polyline points="130,40 180,100 130,160"/></g></svg>
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow">Why Nexxabyte</span>
```

Replace with:
```html
    <section class="section section-shapes-host">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow">Why Nexxabyte</span>
```

- [ ] **Step 5: Remove the shape from `#how-we-work`**

Find:
```html
    <section class="section section-alt section-shapes-host" id="how-we-work">
      <svg class="parallax-shape shape-pos-tr shape-sm" data-parallax-speed="0.25" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="40" y="40" width="90" height="90" transform="rotate(20 85 85)"/><polygon points="150,120 190,190 110,190"/></g></svg>
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow">Our Process</span>
```

Replace with:
```html
    <section class="section section-alt section-shapes-host" id="how-we-work">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow">Our Process</span>
```

- [ ] **Step 6: Remove the shape from the CTA banner**

Find:
```html
    <section class="section section-shapes-host">
      <svg class="parallax-shape shape-pos-bl shape-sm" data-parallax-speed="0.2" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><line x1="30" y1="40" x2="100" y2="90"/><line x1="100" y1="90" x2="170" y2="50"/><line x1="100" y1="90" x2="120" y2="160"/><line x1="30" y1="40" x2="40" y2="150"/><circle cx="30" cy="40" r="6"/><circle cx="100" cy="90" r="8"/><circle cx="170" cy="50" r="6"/><circle cx="120" cy="160" r="6"/><circle cx="40" cy="150" r="5"/></g></svg>
      <div class="container cta-banner-inner reveal">
        <h2>Let's Build Your Next Product Together</h2>
```

Replace with:
```html
    <section class="section section-shapes-host">
      <div class="container cta-banner-inner reveal">
        <h2>Let's Build Your Next Product Together</h2>
```

- [ ] **Step 7: Verify in browser**

Run: `python3 -m http.server 8000`, visit `http://localhost:8000/about.html`, scroll through.

Expected: every section shows the tiled diamond pattern in place of the old shapes. `grep -c "parallax-shape" about.html` returns `0`. "About" nav highlighted, all content (photo, mission/vision cards, why-choose-us grid, process steps) unchanged. No console errors.

- [ ] **Step 8: Commit**

```bash
git add about.html
git commit -m "Replace About page shapes with diamond pattern background"
```

---

## Task 5: Remove Shape Markup — Services Page

**Files:**
- Modify: `services.html`

**Interfaces:**
- Consumes: same `.parallax-hero`/`.section-shapes-host` CSS from Task 1.

- [ ] **Step 1: Remove the 2 shapes from the page-hero**

Find:
```html
    <section class="section page-hero parallax-hero">
      <svg class="parallax-shape shape-pos-tr shape-sm is-accent" data-parallax-speed="0.25" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="70,40 20,100 70,160"/><polyline points="130,40 180,100 130,160"/></g></svg>
      <svg class="parallax-shape shape-pos-bl shape-sm" data-parallax-speed="0.35" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="40" y="40" width="90" height="90" transform="rotate(20 85 85)"/><polygon points="150,120 190,190 110,190"/></g></svg>
      <div class="container">
        <span class="eyebrow">Our Services</span>
```

Replace with:
```html
    <section class="section page-hero parallax-hero">
      <div class="container">
        <span class="eyebrow">Our Services</span>
```

- [ ] **Step 2: Remove the shape from the Development section**

Find:
```html
    <section class="section section-shapes-host">
      <svg class="parallax-shape shape-pos-tr shape-sm" data-parallax-speed="0.18" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><line x1="30" y1="40" x2="100" y2="90"/><line x1="100" y1="90" x2="170" y2="50"/><line x1="100" y1="90" x2="120" y2="160"/><line x1="30" y1="40" x2="40" y2="150"/><circle cx="30" cy="40" r="6"/><circle cx="100" cy="90" r="8"/><circle cx="170" cy="50" r="6"/><circle cx="120" cy="160" r="6"/><circle cx="40" cy="150" r="5"/></g></svg>
      <div class="container">
        <h2 class="group-title reveal">Development</h2>
```

Replace with:
```html
    <section class="section section-shapes-host">
      <div class="container">
        <h2 class="group-title reveal">Development</h2>
```

- [ ] **Step 3: Remove the shape from the Design & Quality section**

Find:
```html
    <section class="section section-alt section-shapes-host">
      <svg class="parallax-shape shape-pos-bl shape-sm" data-parallax-speed="0.22" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="40" y="40" width="90" height="90" transform="rotate(20 85 85)"/><polygon points="150,120 190,190 110,190"/></g></svg>
      <div class="container">
        <h2 class="group-title reveal">Design &amp; Quality</h2>
```

Replace with:
```html
    <section class="section section-alt section-shapes-host">
      <div class="container">
        <h2 class="group-title reveal">Design &amp; Quality</h2>
```

- [ ] **Step 4: Remove the shape from the Operations section**

Find:
```html
    <section class="section section-shapes-host">
      <svg class="parallax-shape shape-pos-tr shape-sm is-accent" data-parallax-speed="0.2" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="70,40 20,100 70,160"/><polyline points="130,40 180,100 130,160"/></g></svg>
      <div class="container">
        <h2 class="group-title reveal">Operations</h2>
```

Replace with:
```html
    <section class="section section-shapes-host">
      <div class="container">
        <h2 class="group-title reveal">Operations</h2>
```

- [ ] **Step 5: Remove the shape from the Team & Consulting section**

Find:
```html
    <section class="section section-alt section-shapes-host">
      <svg class="parallax-shape shape-pos-br shape-sm" data-parallax-speed="0.25" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><line x1="30" y1="40" x2="100" y2="90"/><line x1="100" y1="90" x2="170" y2="50"/><line x1="100" y1="90" x2="120" y2="160"/><line x1="30" y1="40" x2="40" y2="150"/><circle cx="30" cy="40" r="6"/><circle cx="100" cy="90" r="8"/><circle cx="170" cy="50" r="6"/><circle cx="120" cy="160" r="6"/><circle cx="40" cy="150" r="5"/></g></svg>
      <div class="container">
        <h2 class="group-title reveal">Team &amp; Consulting</h2>
```

Replace with:
```html
    <section class="section section-alt section-shapes-host">
      <div class="container">
        <h2 class="group-title reveal">Team &amp; Consulting</h2>
```

- [ ] **Step 6: Remove the shape from the CTA banner**

Find:
```html
    <section class="section section-shapes-host">
      <svg class="parallax-shape shape-pos-tl shape-sm" data-parallax-speed="0.2" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="40" y="40" width="90" height="90" transform="rotate(20 85 85)"/><polygon points="150,120 190,190 110,190"/></g></svg>
      <div class="container cta-banner-inner reveal">
        <h2>Not Sure Where to Start?</h2>
```

Replace with:
```html
    <section class="section section-shapes-host">
      <div class="container cta-banner-inner reveal">
        <h2>Not Sure Where to Start?</h2>
```

- [ ] **Step 7: Verify in browser**

Run: `python3 -m http.server 8000`, visit `http://localhost:8000/services.html`, scroll through.

Expected: tiled diamond pattern in every section that previously had a shape. `grep -c "parallax-shape" services.html` returns `0`. "Services" nav highlighted, all 12 service cards unchanged. No console errors.

- [ ] **Step 8: Commit**

```bash
git add services.html
git commit -m "Replace Services page shapes with diamond pattern background"
```

---

## Task 6: Remove Shape Markup — Contact Page

**Files:**
- Modify: `contact.html`

**Interfaces:**
- Consumes: same `.parallax-hero`/`.section-shapes-host` CSS from Task 1.

- [ ] **Step 1: Remove the 2 shapes from the page-hero**

Find:
```html
    <section class="section page-hero parallax-hero">
      <svg class="parallax-shape shape-pos-tr shape-sm" data-parallax-speed="0.2" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><line x1="30" y1="40" x2="100" y2="90"/><line x1="100" y1="90" x2="170" y2="50"/><line x1="100" y1="90" x2="120" y2="160"/><line x1="30" y1="40" x2="40" y2="150"/><circle cx="30" cy="40" r="6"/><circle cx="100" cy="90" r="8"/><circle cx="170" cy="50" r="6"/><circle cx="120" cy="160" r="6"/><circle cx="40" cy="150" r="5"/></g></svg>
      <svg class="parallax-shape shape-pos-bl shape-sm is-accent" data-parallax-speed="0.3" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="40" y="40" width="90" height="90" transform="rotate(20 85 85)"/><polygon points="150,120 190,190 110,190"/></g></svg>
      <div class="container">
        <span class="eyebrow">Contact Us</span>
```

Replace with:
```html
    <section class="section page-hero parallax-hero">
      <div class="container">
        <span class="eyebrow">Contact Us</span>
```

- [ ] **Step 2: Remove the shape from the contact-form section**

Find:
```html
    <section class="section section-shapes-host">
      <svg class="parallax-shape shape-pos-tr shape-sm" data-parallax-speed="0.18" viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="70,40 20,100 70,160"/><polyline points="130,40 180,100 130,160"/></g></svg>
      <div class="container contact-grid">
```

Replace with:
```html
    <section class="section section-shapes-host">
      <div class="container contact-grid">
```

- [ ] **Step 3: Verify in browser**

Run: `python3 -m http.server 8000`, visit `http://localhost:8000/contact.html`.

Expected: tiled diamond pattern in the hero and behind the form section. `grep -c "parallax-shape" contact.html` returns `0`. "Contact" nav highlighted. Submit the form empty — validation errors still appear correctly. No console errors.

- [ ] **Step 4: Commit**

```bash
git add contact.html
git commit -m "Replace Contact page shapes with diamond pattern background"
```

---

## Task 7: Cross-Page QA Pass

**Files:**
- Modify: any of the above, only if QA finds a genuine issue (no new files expected)

**Interfaces:**
- None — verification-only task, same pattern as prior QA tasks in this project.

- [ ] **Step 1: Serve the site locally**

```bash
python3 -m http.server 8000
```

- [ ] **Step 2: Verify no leftover shape references anywhere**

```bash
grep -rn "parallax-shape\|shape-pos-\|shape-sm\|shape-lg\|is-accent\|data-parallax-speed" *.html assets/css/parallax.css
```

Expected: zero matches across all 4 HTML files and `parallax.css` — full, clean removal.

- [ ] **Step 3: Verify pattern rendering and motion on all 4 pages**

Visit `index.html`, `about.html`, `services.html`, `contact.html`. On each: confirm the diamond pattern tiles visibly behind the dark hero (more prominent) and behind every other section (subtle), confirm the pattern drifts slowly as you scroll (inspect the host element's inline `--pattern-offset` style updating), confirm no pattern tile ever obscures text or buttons.

- [ ] **Step 4: Verify `prefers-reduced-motion` and existing functionality**

In DevTools, enable "Emulate CSS prefers-reduced-motion: reduce", reload each page, scroll — `--pattern-offset` must never be set (pattern stays static). Then disable that emulation and confirm on each page: mobile hamburger nav opens/closes correctly, `.reveal` scroll-fade-ins on cards/feature-items/process-steps still fire, and on `contact.html`, empty-submit validation and valid-submit behavior are unchanged from before this redesign.

- [ ] **Step 5: Verify console cleanliness and no layout regressions**

Open DevTools Console on each of the 4 pages, scroll through fully, resize through 375px/768px/1440px. Expected: zero JavaScript errors or warnings (the placeholder Formspree 404 on contact-form submit is expected/documented, not a bug). No horizontal scrollbar at any width on any page. Confirm the pattern is visible (not accidentally invisible or overly loud) at 375px width too, since there's no longer a mobile-hide rule for it.

- [ ] **Step 6: Fix any issues found, then commit**

If QA finds issues, fix them in the relevant file(s), then:

```bash
git add -A
git commit -m "Fix cross-page QA issues from diamond-pattern redesign"
```

If no issues are found, skip the commit (nothing to commit).
