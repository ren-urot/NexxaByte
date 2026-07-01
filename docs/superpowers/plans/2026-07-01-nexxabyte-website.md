# Nexxabyte Company Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 4-page static marketing website (Home, About, Services, Contact) for Nexxabyte using plain HTML/CSS/JS, branded with the company's logo colors, with a Formspree-backed contact form.

**Architecture:** Static HTML files share a CSS design-token system (`variables.css` → `base.css` → `components.css` → `pages.css`) and a single `main.js` for nav toggle, scroll-reveal, and form validation. No build step, no templating — header/footer markup is duplicated identically across the 4 HTML files.

**Tech Stack:** HTML5, CSS3 (custom properties, Grid/Flexbox), vanilla JS (ES5-compatible, no modules so `file://` works), Google Fonts (Inter, Space Grotesk), Formspree for form submission, picsum.photos for placeholder photography.

## Global Constraints

- No framework, no build tooling, no npm dependencies — must work by opening `.html` files directly or via a static file server.
- Brand colors from spec: `--color-primary: #FF4E00` (orange), `--color-dark: #484848` (charcoal).
- No fabricated content (testimonials, case studies, team bios) — only content present in the spec/source copy, plus the 12 service descriptions and 5 process steps explicitly authored in this plan.
- Contact email placeholder: `inquiry@nexxabyte.com`.
- Formspree form action uses placeholder `YOUR_FORMSPREE_ID` — documented in README as a post-build step for the user.
- JS must be plain scripts (no `type="module"`) so pages work when opened via `file://` without a server.
- Every HTML page must include identical header and footer markup (only the active nav link class differs).

---

## Task 1: Design Tokens & Base Styles

**Files:**
- Create: `assets/css/variables.css`
- Create: `assets/css/base.css`
- Create: `index.html` (minimal shell, just enough to verify tokens load — full content added in Task 4)

**Interfaces:**
- Produces: CSS custom properties consumed by all later CSS files — `--color-primary`, `--color-primary-dark`, `--color-dark`, `--color-black`, `--color-bg`, `--color-bg-alt`, `--color-bg-dark`, `--color-text`, `--color-text-muted`, `--color-text-on-dark`, `--color-border`, `--font-heading`, `--font-body`, `--container-width`, `--radius-sm`, `--radius-md`, `--radius-lg`, `--shadow-sm`, `--shadow-md`, `--transition`.
- Produces: base utility classes consumed by later tasks — `.container`, `.section`, `.section-alt`, `.section-dark`, `.eyebrow`, `.section-head`, `.section-head.center`, `.text-muted`, `.reveal` / `.reveal.is-visible`.

- [ ] **Step 1: Create `assets/css/variables.css`**

```css
:root {
  /* Brand colors */
  --color-primary: #FF4E00;
  --color-primary-dark: #D94300;
  --color-dark: #484848;
  --color-black: #1A1A1A;
  --color-bg: #FFFFFF;
  --color-bg-alt: #F6F6F7;
  --color-bg-dark: #1A1A1A;
  --color-text: #2B2B2B;
  --color-text-muted: #6B6B6B;
  --color-text-on-dark: #F2F2F2;
  --color-border: #E6E6E6;

  /* Typography */
  --font-heading: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;

  /* Layout */
  --container-width: 1180px;
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 24px;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 12px 28px rgba(0, 0, 0, 0.10);
  --transition: 200ms ease;
}
```

- [ ] **Step 2: Create `assets/css/base.css`**

```css
*, *::before, *::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: var(--font-body);
  color: var(--color-text);
  background: var(--color-bg);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 {
  font-family: var(--font-heading);
  font-weight: 700;
  line-height: 1.15;
  margin: 0 0 0.5em;
  color: var(--color-black);
}

h1 { font-size: clamp(2.2rem, 4vw + 1rem, 3.4rem); }
h2 { font-size: clamp(1.7rem, 2.4vw + 1rem, 2.4rem); }
h3 { font-size: 1.25rem; }
h4 { font-size: 1rem; }

p { margin: 0 0 1em; }

a {
  color: inherit;
  text-decoration: none;
}

ul { list-style: none; margin: 0; padding: 0; }

img { max-width: 100%; display: block; }

button { font-family: inherit; }

.container {
  width: 100%;
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 24px;
}

.section {
  padding: 96px 0;
}

@media (max-width: 768px) {
  .section { padding: 64px 0; }
}

.section-alt {
  background: var(--color-bg-alt);
}

.section-dark {
  background: var(--color-black);
  color: var(--color-text-on-dark);
}

.section-dark h2, .section-dark h3 {
  color: #fff;
}

.eyebrow {
  display: inline-block;
  font-family: var(--font-heading);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-primary);
  margin-bottom: 12px;
}

.section-head {
  max-width: 640px;
  margin: 0 0 48px;
}

.section-head.center {
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.text-muted {
  color: var(--color-text-muted);
}

.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 600ms ease, transform 600ms ease;
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 3: Create a minimal `index.html` shell to verify tokens load**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nexxabyte — Software Development &amp; Technology Outsourcing</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/variables.css">
  <link rel="stylesheet" href="assets/css/base.css">
</head>
<body>
  <div class="container">
    <h1>Nexxabyte</h1>
    <p class="text-muted">Token check.</p>
  </div>
</body>
</html>
```

- [ ] **Step 4: Verify in browser**

Run: `open index.html` (macOS) — or `python3 -m http.server 8000` from the project root, then visit `http://localhost:8000`.

Expected: Page shows "Nexxabyte" in a bold geometric heading font (Space Grotesk), body text in Inter, centered in a max-width container. No console errors.

- [ ] **Step 5: Commit**

```bash
git add assets/css/variables.css assets/css/base.css index.html
git commit -m "Add design tokens and base styles"
```

---

## Task 2: Logo Asset

**Files:**
- Create: `assets/images/logo.svg`

**Interfaces:**
- Produces: `assets/images/logo.svg` — a self-contained SVG (viewBox `0 0 188.2 44.1`) consumed by the header and footer markup in Tasks 3, 6, 7, 8 via `<img src="assets/images/logo.svg" alt="Nexxabyte" class="logo-mark">`, and as the favicon.

The source file (`Nex 2 logo copy.svg`) has three groups: two hidden behind `display:none` (unused design iterations) and one visible group (`Layer_1_copy_2`) containing the actual lockmark — the word "Nexxabyte" rendered as outline paths plus a small accent mark, in two brand colors. It also contains one off-canvas `<text>` element (translated to x=-328, outside the 188.2-wide viewBox) that never renders — that element is dropped.

- [ ] **Step 1: Create `assets/images/logo.svg`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 188.2 44.1">
<style type="text/css">
	.st3{fill:#FF4E00;}
	.st4{fill:#484848;}
</style>
<g>
	<path class="st3" d="M4.6,6.3h5.7l13.1,17.2V6.3h6.1v28h-5.2L10.7,16.5v17.8H4.6V6.3z"/>
	<path class="st3" d="M31.3,23.7L31.3,23.7c0-6.2,4.4-11.2,10.6-11.2c7.2,0,10.4,5.6,10.4,11.6c0,0.5,0,1-0.1,1.6H37.4
		c0.6,2.8,2.5,4.2,5.2,4.2c2,0,3.5-0.6,5.2-2.2l3.5,3.1c-2,2.5-4.9,4-8.8,4C36.1,34.8,31.3,30.3,31.3,23.7z M46.4,21.9
		c-0.4-2.7-2-4.6-4.5-4.6c-2.5,0-4.2,1.8-4.6,4.6H46.4z"/>
	<path class="st4" d="M100.9,23.6L100.9,23.6c0,6.2-4.4,11.2-10.6,11.2c-7.2,0-10.4-5.6-10.4-11.6c0-0.5,0-1,0.1-1.6h14.9
		c-0.6-2.8-2.5-4.2-5.2-4.2c-2,0-3.5,0.6-5.2,2.2L81,16.5c2-2.5,4.9-4,8.8-4C96.2,12.5,100.9,17.1,100.9,23.6z M85.8,25.4
		c0.4,2.7,2,4.6,4.5,4.6c2.5,0,4.2-1.8,4.6-4.6H85.8z"/>
	<path class="st4" d="M127.5,39.3l2-4.4c0.8,0.5,1.8,0.8,2.6,0.8c1,0,1.6-0.3,2.1-1.4l-8.4-21.5h6.4l4.9,14.6l4.7-14.6h6.3
		l-8.2,22c-1.6,4.4-3.4,6-7,6C130.7,40.8,129.1,40.3,127.5,39.3z"/>
	<path class="st4" d="M151.6,28.2V18.1h-2.6v-5.2h2.6V7.4h6.1v5.5h5v5.2h-5v9.2c0,1.4,0.6,2.1,2,2.1c1.1,0,2.1-0.3,3-0.8v4.9
		c-1.3,0.8-2.8,1.2-4.8,1.2C154.1,34.7,151.6,33.2,151.6,28.2z"/>
	<path class="st4" d="M163.4,23.7L163.4,23.7c0-6.2,4.4-11.2,10.6-11.2c7.2,0,10.4,5.6,10.4,11.6c0,0.5,0,1-0.1,1.6h-14.9
		c0.6,2.8,2.5,4.2,5.2,4.2c2,0,3.5-0.6,5.2-2.2l3.5,3.1c-2,2.5-4.9,4-8.8,4C168.1,34.8,163.4,30.3,163.4,23.7z M178.5,21.9
		c-0.4-2.7-2-4.6-4.5-4.6c-2.5,0-4.2,1.8-4.6,4.6H178.5z"/>
	<path class="st4" d="M121.3,19.7c2-1.1,3.7-2.9,3.7-6v-0.1c0-1.9-0.6-3.5-1.9-4.8c-1.6-1.6-4.1-2.5-7.3-2.5h-10.3
		c-1.5,0-2.8,1.2-2.8,2.8v25.3h13.3c6.3,0,10.5-2.6,10.5-7.7v-0.1C126.6,22.8,124.6,20.9,121.3,19.7z M108.7,11.7h6.1
		c2.6,0,4,1,4,2.9v0.1c0,2.1-1.7,3-4.4,3h-5.7V11.7z M120.4,25.9c0,2.1-1.6,3-4.4,3h-7.3v-6.2h7.1C119,22.7,120.4,23.9,120.4,25.9
		L120.4,25.9z"/>
	<path class="st3" d="M57.2,34.3L64.5,23l-6.9-10.2h-6.5l7.2,10.6l-7.5,10.9H57.2z"/>
	<path class="st4" d="M75.5,21.9l6.3-9h-6.4l-3,4.5L75.5,21.9z"/>
	<path class="st3" d="M67,34.3L74.3,23l-6.9-10.2h-6.5l7.2,10.6l-7.5,10.9H67z"/>
	<path class="st4" d="M75.4,24.4l-3.1,4.8l3.3,5.1h6.5L75.4,24.4z"/>
</g>
</svg>
```

- [ ] **Step 2: Verify in browser**

Add `<img src="assets/images/logo.svg" alt="Nexxabyte" style="width:200px">` temporarily to `index.html`, then run `open index.html`.

Expected: The Nexxabyte wordmark renders in orange and charcoal, no broken-image icon. Remove the temporary `<img>` line afterward (logo is wired into the real header in Task 3).

- [ ] **Step 3: Commit**

```bash
git add assets/images/logo.svg
git commit -m "Add Nexxabyte logo asset"
```

---

## Task 3: Header, Footer & Shared Components

**Files:**
- Create: `assets/css/components.css`
- Create: `assets/js/main.js` (nav-toggle portion only — scroll-reveal and form validation added in Tasks 5 and 8)
- Modify: `index.html` (replace shell body with header + placeholder + footer)

**Interfaces:**
- Consumes: tokens from Task 1 (`--color-*`, `--font-*`, `--radius-*`, `--shadow-*`, `--transition`, `.container`).
- Consumes: `assets/images/logo.svg` from Task 2.
- Produces: `.site-header`, `.header-inner`, `.logo-mark`, `.main-nav` (+ `.is-open`), `.nav-toggle` (+ `.is-active`), `.btn` / `.btn-primary` / `.btn-outline` / `.btn-on-dark` / `.btn-sm`, `.card`, `.card-icon`, `.grid` / `.grid-2` / `.grid-3`, `.site-footer`, `.footer-inner`, `.footer-brand`, `.footer-col`, `.footer-bottom`, `.form-group`, `.form-control`, `.form-error`, `.form-status` — all consumed by Tasks 4, 6, 7, 8.
- Produces: `initNavToggle()` wiring in `main.js`, gated behind `DOMContentLoaded`, consumed (via the `<script>` tag) by every page's footer in Tasks 4, 6, 7, 8.

- [ ] **Step 1: Create `assets/css/components.css`**

```css
/* Header */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-border);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 76px;
  gap: 24px;
}

.logo-mark {
  height: 28px;
  width: auto;
}

.main-nav ul {
  display: flex;
  gap: 32px;
}

.main-nav a {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-dark);
  padding: 4px 0;
}

.main-nav a.active,
.main-nav a:hover {
  color: var(--color-primary);
}

.header-cta {
  margin-left: auto;
}

.nav-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
}

.nav-toggle span {
  display: block;
  height: 2px;
  width: 100%;
  background: var(--color-black);
  transition: transform var(--transition), opacity var(--transition);
}

@media (max-width: 860px) {
  .header-inner .header-cta { display: none; }

  .nav-toggle { display: flex; }

  .main-nav {
    position: fixed;
    top: 76px;
    left: 0;
    right: 0;
    background: #fff;
    border-bottom: 1px solid var(--color-border);
    max-height: 0;
    overflow: hidden;
    transition: max-height var(--transition);
  }

  .main-nav.is-open {
    max-height: 320px;
  }

  .main-nav ul {
    flex-direction: column;
    gap: 0;
    padding: 8px 24px 24px;
  }

  .main-nav li {
    border-bottom: 1px solid var(--color-border);
  }

  .main-nav a {
    display: block;
    padding: 14px 0;
  }

  .nav-toggle.is-active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .nav-toggle.is-active span:nth-child(2) { opacity: 0; }
  .nav-toggle.is-active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 0.95rem;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform var(--transition), background var(--transition), border-color var(--transition), color var(--transition);
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-primary {
  background: var(--color-primary);
  color: #fff;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
}

.btn-outline {
  background: transparent;
  border-color: var(--color-dark);
  color: var(--color-dark);
}

.btn-outline:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.btn-on-dark {
  border-color: #fff;
  color: #fff;
}

.btn-on-dark:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.btn-sm {
  padding: 10px 20px;
  font-size: 0.85rem;
}

/* Cards */
.card {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 32px;
  transition: transform var(--transition), box-shadow var(--transition);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  background: rgba(255, 78, 0, 0.1);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.card-icon svg {
  width: 24px;
  height: 24px;
}

.grid {
  display: grid;
  gap: 28px;
}

.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }

@media (max-width: 860px) {
  .grid-2, .grid-3 { grid-template-columns: 1fr; }
}

/* Footer */
.site-footer {
  background: var(--color-black);
  color: var(--color-text-on-dark);
}

.footer-inner {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 40px;
  padding: 64px 0 40px;
}

.footer-brand p {
  color: #A8A8A8;
  max-width: 280px;
  margin-top: 16px;
}

.footer-col h4 {
  color: #fff;
  margin-bottom: 16px;
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.footer-col li {
  margin-bottom: 10px;
}

.footer-col a {
  color: #A8A8A8;
  transition: color var(--transition);
}

.footer-col a:hover {
  color: var(--color-primary);
}

.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.1);
  padding: 20px 0;
}

.footer-bottom p {
  margin: 0;
  font-size: 0.85rem;
  color: #8A8A8A;
}

@media (max-width: 768px) {
  .footer-inner {
    grid-template-columns: 1fr;
  }
}

/* Forms */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 0.9rem;
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-size: 1rem;
  background: #fff;
  transition: border-color var(--transition);
}

.form-control:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-error {
  color: var(--color-primary);
  font-size: 0.85rem;
  margin-top: 4px;
  display: none;
}

.form-group.has-error .form-control {
  border-color: var(--color-primary);
}

.form-group.has-error .form-error {
  display: block;
}

.form-status {
  margin-top: 16px;
  font-weight: 600;
}

.form-status.success { color: #1A8A4A; }
.form-status.error { color: var(--color-primary); }
```

- [ ] **Step 2: Create `assets/js/main.js` with nav-toggle logic**

```js
(function () {
  'use strict';

  function initNavToggle() {
    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('main-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    var links = nav.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNavToggle();
  });
})();
```

- [ ] **Step 3: Replace `index.html` with header + placeholder content + footer**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nexxabyte — Software Development &amp; Technology Outsourcing</title>
  <meta name="description" content="Nexxabyte builds custom web apps, mobile apps, SaaS platforms, AI-powered solutions, and enterprise software for startups, SMEs, and enterprises.">
  <link rel="icon" type="image/svg+xml" href="assets/images/logo.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/variables.css">
  <link rel="stylesheet" href="assets/css/base.css">
  <link rel="stylesheet" href="assets/css/components.css">
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a href="index.html" class="logo" aria-label="Nexxabyte home">
        <img src="assets/images/logo.svg" alt="Nexxabyte" class="logo-mark">
      </a>
      <nav class="main-nav" id="main-nav">
        <ul>
          <li><a href="index.html" class="active">Home</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </nav>
      <a href="contact.html" class="btn btn-primary btn-sm header-cta">Get a Quote</a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="main-nav">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <main>
    <div class="container section">
      <h1>Home page content goes here (Task 4)</h1>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <img src="assets/images/logo.svg" alt="Nexxabyte" class="logo-mark">
        <p>Software development and technology outsourcing for startups, SMEs, and enterprises.</p>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="about.html">About</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Get in Touch</h4>
        <ul>
          <li><a href="mailto:inquiry@nexxabyte.com">inquiry@nexxabyte.com</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <p>&copy; 2026 Nexxabyte. All rights reserved.</p>
      </div>
    </div>
  </footer>
  <script src="assets/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: Verify in browser**

Run: `open index.html`, then resize the window below 860px width (or use browser dev tools device toolbar).

Expected: Sticky header with logo, nav links, and "Get a Quote" button at desktop width. Below 860px, nav links and CTA hide and a hamburger button appears; clicking it slides down the nav menu and animates the icon into an X; clicking a nav link closes the menu. Footer shows three columns (brand/Company/Get in Touch) with a copyright bar below. No console errors.

- [ ] **Step 5: Commit**

```bash
git add assets/css/components.css assets/js/main.js index.html
git commit -m "Add shared header, footer, and component styles"
```

---

## Task 4: Home Page Content

**Files:**
- Create: `assets/css/pages.css` (hero, services-preview, why-grid, mission-teaser, cta-banner sections only — more sections added in Tasks 6 and 7)
- Modify: `index.html` (replace placeholder `<main>` with full home page content)

**Interfaces:**
- Consumes: tokens (Task 1), `.card` / `.card-icon` / `.grid-3` / `.btn-*` (Task 3).
- Produces: `.hero`, `.hero-inner`, `.hero-content`, `.hero-lead`, `.hero-actions`, `.hero-media`, `.hero-blob`, `.hero-photo`, `.service-card` (alias of `.card`), `.services-preview-cta`, `.feature-item`, `.feature-check`, `.mission-teaser`, `.cta-banner-inner`, `.page-hero`, `.lead-wide` — `.page-hero` and `.lead-wide` are also consumed by Tasks 6, 7, 8.

- [ ] **Step 1: Create `assets/css/pages.css`**

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

/* Services preview */
.services-preview-cta {
  text-align: center;
  margin-top: 40px;
}

/* Why choose us */
.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 8px 0;
}

.feature-check {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 78, 0, 0.12);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-check svg {
  width: 16px;
  height: 16px;
}

.feature-item p {
  margin: 0;
  font-weight: 600;
}

/* Mission teaser band */
.mission-teaser {
  max-width: 720px;
  text-align: center;
  margin: 0 auto;
}

.mission-teaser p {
  font-size: 1.1rem;
  color: #D8D8D8;
  margin-bottom: 28px;
}

/* CTA banner */
.cta-banner-inner {
  text-align: center;
  max-width: 640px;
  margin: 0 auto;
}

.cta-banner-inner .btn {
  margin-top: 12px;
}

/* Page hero (About/Services/Contact) */
.page-hero {
  padding: 64px 0 32px;
}

.lead-wide {
  max-width: 640px;
  font-size: 1.1rem;
}
```

- [ ] **Step 2: Add `pages.css` link to `index.html`'s `<head>`, after `components.css`**

```html
  <link rel="stylesheet" href="assets/css/components.css">
  <link rel="stylesheet" href="assets/css/pages.css">
```

- [ ] **Step 3: Replace the placeholder `<main>` block in `index.html`**

```html
  <main>
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

    <section class="section" id="services-preview">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow">What We Do</span>
          <h2>End-to-End Software Solutions</h2>
          <p class="text-muted">From product strategy to long-term maintenance, we cover every stage of your software journey.</p>
        </div>
        <div class="grid grid-3">
          <div class="card service-card reveal">
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4 3 12l5 8M16 4l5 8-5 8"/></svg>
            </div>
            <h3>Custom Software Development</h3>
            <p class="text-muted">Tailored software built around your exact workflows and business goals.</p>
          </div>
          <div class="card service-card reveal">
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18"/></svg>
            </div>
            <h3>Web Application Development</h3>
            <p class="text-muted">Fast, responsive, and scalable web apps built with modern frameworks.</p>
          </div>
          <div class="card service-card reveal">
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>
            </div>
            <h3>Mobile App Development</h3>
            <p class="text-muted">Native and cross-platform apps for seamless iOS &amp; Android experiences.</p>
          </div>
          <div class="card service-card reveal">
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18a4 4 0 1 1 .9-7.9A5 5 0 0 1 17 9a4 4 0 0 1 1 7.9"/></svg>
            </div>
            <h3>SaaS Product Development</h3>
            <p class="text-muted">End-to-end SaaS platforms designed for scalability and recurring growth.</p>
          </div>
          <div class="card service-card reveal">
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3"/></svg>
            </div>
            <h3>AI &amp; Automation Solutions</h3>
            <p class="text-muted">AI-powered features and workflow automation that reduce manual effort.</p>
          </div>
          <div class="card service-card reveal">
            <div class="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="6" rx="1.5"/><rect x="4" y="14" width="16" height="6" rx="1.5"/></svg>
            </div>
            <h3>Cloud &amp; DevOps Services</h3>
            <p class="text-muted">Cloud architecture and CI/CD pipelines for reliable, scalable deployments.</p>
          </div>
        </div>
        <div class="services-preview-cta">
          <a href="services.html" class="btn btn-outline">View All Services</a>
        </div>
      </div>
    </section>

    <section class="section section-alt" id="why-choose-us">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow">Why Nexxabyte</span>
          <h2>Why Choose Nexxabyte?</h2>
        </div>
        <div class="grid grid-3">
          <div class="feature-item reveal">
            <div class="feature-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></div>
            <p>Experienced software engineers and product specialists</p>
          </div>
          <div class="feature-item reveal">
            <div class="feature-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></div>
            <p>Agile development methodology with transparent communication</p>
          </div>
          <div class="feature-item reveal">
            <div class="feature-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></div>
            <p>Scalable teams that grow with your business</p>
          </div>
          <div class="feature-item reveal">
            <div class="feature-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></div>
            <p>High-quality, secure, and maintainable software</p>
          </div>
          <div class="feature-item reveal">
            <div class="feature-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></div>
            <p>Cost-effective outsourcing solutions</p>
          </div>
          <div class="feature-item reveal">
            <div class="feature-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></div>
            <p>Long-term technical partnership and ongoing support</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-dark" id="mission-vision-teaser">
      <div class="container mission-teaser reveal">
        <span class="eyebrow">Our Mission</span>
        <h2>Empowering Businesses Through Software</h2>
        <p>To empower businesses worldwide by delivering innovative, reliable, and scalable software solutions that drive growth, improve efficiency, and create lasting value.</p>
        <a href="about.html" class="btn btn-on-dark">Learn More About Us</a>
      </div>
    </section>

    <section class="section">
      <div class="container cta-banner-inner reveal">
        <h2>Ready to Build Something Great?</h2>
        <p class="text-muted">Tell us about your project and let's turn your idea into a scalable digital product.</p>
        <a href="contact.html" class="btn btn-primary">Get a Free Consultation</a>
      </div>
    </section>
  </main>
```

- [ ] **Step 4: Verify in browser**

Run: `open index.html`.

Expected: Hero with headline, two CTA buttons, and a placeholder photo with an orange glow behind it. Below it, 6 service preview cards in a 3-column grid. Then a light-gray "Why Choose Nexxabyte" section with 6 checkmarked items in 3 columns. Then a dark mission band with white CTA button. Then a final CTA section before the footer. All sections currently invisible/faded (no scroll-reveal JS yet — added in Task 5) — confirm in Task 5 instead. For now, confirm structure and styling look correct even without animation (elements may appear with `opacity: 0` since `.reveal` has no `.is-visible` yet — that's expected and fixed in the next task).

- [ ] **Step 5: Commit**

```bash
git add assets/css/pages.css index.html
git commit -m "Add home page content"
```

---

## Task 5: Scroll-Reveal Interaction

**Files:**
- Modify: `assets/js/main.js` (add scroll-reveal logic)

**Interfaces:**
- Consumes: `.reveal` / `.reveal.is-visible` CSS classes (Task 1), present on elements across all 4 pages.
- Produces: `initScrollReveal()`, called alongside `initNavToggle()` inside the existing `DOMContentLoaded` handler.

- [ ] **Step 1: Add `initScrollReveal` to `assets/js/main.js`**

Insert the new function after `initNavToggle` and call it in the `DOMContentLoaded` handler:

```js
(function () {
  'use strict';

  function initNavToggle() {
    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('main-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    var links = nav.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    }
  }

  function initScrollReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < items.length; i++) {
        items[i].classList.add('is-visible');
      }
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    for (var j = 0; j < items.length; j++) {
      observer.observe(items[j]);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNavToggle();
    initScrollReveal();
  });
})();
```

- [ ] **Step 2: Verify in browser**

Run: `open index.html`, then scroll down the page slowly.

Expected: The hero content fades/slides into view immediately on load (it's within the initial viewport). Each subsequent section (services preview cards, why-choose-us items, mission band, CTA banner) fades up into view as it's scrolled into the viewport, instead of being permanently invisible. Open the browser console — no errors.

- [ ] **Step 3: Commit**

```bash
git add assets/js/main.js
git commit -m "Add scroll-reveal interaction"
```

---

## Task 6: About Page

**Files:**
- Create: `about.html`
- Modify: `assets/css/pages.css` (append about-page sections)

**Interfaces:**
- Consumes: header/footer markup pattern (Task 3), `.page-hero` / `.lead-wide` (Task 4), `.feature-item` / `.feature-check` (Task 4), `main.js` (Tasks 3, 5).
- Produces: `.about-intro`, `.about-media`, `.rounded-photo`, `.mv-grid`, `.mv-card`, `.process-steps`, `.step-number` — not consumed elsewhere, scoped to this page.

- [ ] **Step 1: Append about-page styles to `assets/css/pages.css`**

```css
/* About intro */
.about-intro {
  display: grid;
  grid-template-columns: 1fr 0.9fr;
  gap: 56px;
  align-items: center;
}

.rounded-photo {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  width: 100%;
  height: 380px;
  object-fit: cover;
}

@media (max-width: 960px) {
  .about-intro { grid-template-columns: 1fr; }
}

/* Mission / vision cards */
.mv-card p {
  font-size: 1.05rem;
  margin-top: 8px;
}

/* Process steps */
.process-steps {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
}

.process-steps li {
  list-style: none;
}

.step-number {
  display: block;
  font-family: var(--font-heading);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 12px;
}

@media (max-width: 960px) {
  .process-steps { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
  .process-steps { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2: Create `about.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About Nexxabyte — Our Mission, Vision &amp; Process</title>
  <meta name="description" content="Nexxabyte is a software development and technology outsourcing company helping startups, SMEs, and enterprises transform ideas into scalable digital products.">
  <link rel="icon" type="image/svg+xml" href="assets/images/logo.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/variables.css">
  <link rel="stylesheet" href="assets/css/base.css">
  <link rel="stylesheet" href="assets/css/components.css">
  <link rel="stylesheet" href="assets/css/pages.css">
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a href="index.html" class="logo" aria-label="Nexxabyte home">
        <img src="assets/images/logo.svg" alt="Nexxabyte" class="logo-mark">
      </a>
      <nav class="main-nav" id="main-nav">
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html" class="active">About</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </nav>
      <a href="contact.html" class="btn btn-primary btn-sm header-cta">Get a Quote</a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="main-nav">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <main>
    <section class="section page-hero">
      <div class="container">
        <span class="eyebrow">About Nexxabyte</span>
        <h1>Engineering Partners for Ambitious Software</h1>
        <p class="text-muted lead-wide">Nexxabyte is a software development and technology outsourcing company that helps startups, SMEs, and enterprises transform ideas into scalable digital products.</p>
      </div>
    </section>

    <section class="section">
      <div class="container about-intro">
        <div class="reveal">
          <h2>Who We Are</h2>
          <p>We specialize in building custom web applications, mobile apps, SaaS platforms, AI-powered solutions, and enterprise software tailored to our clients' business goals. Our experienced team of designers, developers, and technology consultants delivers end-to-end software solutions — from product strategy and UI/UX design to development, cloud deployment, and long-term maintenance.</p>
          <p>Whether clients need a dedicated development team or a trusted technology partner, Nexxabyte provides the expertise and flexibility to accelerate digital transformation.</p>
        </div>
        <div class="reveal">
          <img src="https://picsum.photos/id/1011/700/560" alt="Nexxabyte team at work" class="rounded-photo">
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <div class="grid grid-2">
          <div class="card mv-card reveal">
            <span class="eyebrow">Our Mission</span>
            <p>To empower businesses worldwide by delivering innovative, reliable, and scalable software solutions that drive growth, improve efficiency, and create lasting value.</p>
          </div>
          <div class="card mv-card reveal">
            <span class="eyebrow">Our Vision</span>
            <p>To become a globally trusted software development and outsourcing company recognized for engineering excellence, innovation, and exceptional client success.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow">Why Nexxabyte</span>
          <h2>Why Choose Nexxabyte?</h2>
        </div>
        <div class="grid grid-3">
          <div class="feature-item reveal">
            <div class="feature-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></div>
            <p>Experienced software engineers and product specialists</p>
          </div>
          <div class="feature-item reveal">
            <div class="feature-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></div>
            <p>Agile development methodology with transparent communication</p>
          </div>
          <div class="feature-item reveal">
            <div class="feature-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></div>
            <p>Scalable teams that grow with your business</p>
          </div>
          <div class="feature-item reveal">
            <div class="feature-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></div>
            <p>High-quality, secure, and maintainable software</p>
          </div>
          <div class="feature-item reveal">
            <div class="feature-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></div>
            <p>Cost-effective outsourcing solutions</p>
          </div>
          <div class="feature-item reveal">
            <div class="feature-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></div>
            <p>Long-term technical partnership and ongoing support</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-alt" id="how-we-work">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow">Our Process</span>
          <h2>How We Work</h2>
          <p class="text-muted">An agile, transparent process from first conversation to long-term support.</p>
        </div>
        <ol class="process-steps">
          <li class="reveal"><span class="step-number">01</span><h3>Discover &amp; Strategize</h3><p class="text-muted">We learn your business goals and define a clear product strategy.</p></li>
          <li class="reveal"><span class="step-number">02</span><h3>Design</h3><p class="text-muted">Our UI/UX designers turn strategy into intuitive, user-centered interfaces.</p></li>
          <li class="reveal"><span class="step-number">03</span><h3>Develop</h3><p class="text-muted">Our engineers build using agile methodology with transparent, ongoing communication.</p></li>
          <li class="reveal"><span class="step-number">04</span><h3>Deploy &amp; Scale</h3><p class="text-muted">We handle cloud deployment and DevOps so your product scales reliably.</p></li>
          <li class="reveal"><span class="step-number">05</span><h3>Maintain &amp; Support</h3><p class="text-muted">We provide long-term maintenance and support as a lasting technology partner.</p></li>
        </ol>
      </div>
    </section>

    <section class="section">
      <div class="container cta-banner-inner reveal">
        <h2>Let's Build Your Next Product Together</h2>
        <a href="contact.html" class="btn btn-primary">Get in Touch</a>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <img src="assets/images/logo.svg" alt="Nexxabyte" class="logo-mark">
        <p>Software development and technology outsourcing for startups, SMEs, and enterprises.</p>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="about.html">About</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Get in Touch</h4>
        <ul>
          <li><a href="mailto:inquiry@nexxabyte.com">inquiry@nexxabyte.com</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <p>&copy; 2026 Nexxabyte. All rights reserved.</p>
      </div>
    </div>
  </footer>
  <script src="assets/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 3: Verify in browser**

Run: `open about.html`.

Expected: "About" nav link is highlighted orange. Page shows intro hero, a two-column "Who We Are" section with photo, two mission/vision cards side by side, the same 6-item why-choose-us grid as Home, a 5-step "How We Work" process row, and a CTA banner. All `.reveal` elements fade in as scrolled into view (confirms `main.js` works identically here without modification). Nav links route correctly to Home/Services/Contact.

- [ ] **Step 4: Commit**

```bash
git add assets/css/pages.css about.html
git commit -m "Add About page"
```

---

## Task 7: Services Page

**Files:**
- Create: `services.html`
- Modify: `assets/css/pages.css` (append `.group-title`)

**Interfaces:**
- Consumes: header/footer markup pattern (Task 3), `.page-hero` / `.lead-wide` (Task 4), `.card` / `.card-icon` / `.grid-3` (Task 3).
- Produces: `.group-title` — scoped to this page.

- [ ] **Step 1: Append to `assets/css/pages.css`**

```css
/* Services page groups */
.group-title {
  margin-bottom: 32px;
}
```

- [ ] **Step 2: Create `services.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Services — Nexxabyte Software Development &amp; Outsourcing</title>
  <meta name="description" content="Custom software, web, mobile, SaaS, AI, UI/UX, cloud/DevOps, QA, maintenance, dedicated teams, staff augmentation, and technology consulting services from Nexxabyte.">
  <link rel="icon" type="image/svg+xml" href="assets/images/logo.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/variables.css">
  <link rel="stylesheet" href="assets/css/base.css">
  <link rel="stylesheet" href="assets/css/components.css">
  <link rel="stylesheet" href="assets/css/pages.css">
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a href="index.html" class="logo" aria-label="Nexxabyte home">
        <img src="assets/images/logo.svg" alt="Nexxabyte" class="logo-mark">
      </a>
      <nav class="main-nav" id="main-nav">
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="services.html" class="active">Services</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </nav>
      <a href="contact.html" class="btn btn-primary btn-sm header-cta">Get a Quote</a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="main-nav">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <main>
    <section class="section page-hero">
      <div class="container">
        <span class="eyebrow">Our Services</span>
        <h1>Full-Stack Software &amp; Outsourcing Services</h1>
        <p class="text-muted lead-wide">Everything you need to design, build, ship, and scale a digital product — under one roof or as an extension of your team.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2 class="group-title reveal">Development</h2>
        <div class="grid grid-3">
          <div class="card reveal">
            <div class="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4 3 12l5 8M16 4l5 8-5 8"/></svg></div>
            <h3>Custom Software Development</h3>
            <p class="text-muted">Tailored software built around your exact workflows and business goals, from internal tools to customer-facing platforms.</p>
          </div>
          <div class="card reveal">
            <div class="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18"/></svg></div>
            <h3>Web Application Development</h3>
            <p class="text-muted">Fast, responsive, and scalable web applications built with modern frameworks and best practices.</p>
          </div>
          <div class="card reveal">
            <div class="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg></div>
            <h3>Mobile App Development (iOS &amp; Android)</h3>
            <p class="text-muted">Native and cross-platform mobile apps that deliver seamless experiences across devices.</p>
          </div>
          <div class="card reveal">
            <div class="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18a4 4 0 1 1 .9-7.9A5 5 0 0 1 17 9a4 4 0 0 1 1 7.9"/></svg></div>
            <h3>SaaS Product Development</h3>
            <p class="text-muted">End-to-end SaaS platforms designed for multi-tenancy, scalability, and recurring growth.</p>
          </div>
          <div class="card reveal">
            <div class="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3"/></svg></div>
            <h3>AI &amp; Automation Solutions</h3>
            <p class="text-muted">AI-powered features and workflow automation that reduce manual effort and unlock new capabilities.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <h2 class="group-title reveal">Design &amp; Quality</h2>
        <div class="grid grid-3">
          <div class="card reveal">
            <div class="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="8.5" cy="10" r="1" fill="currentColor"/><circle cx="12" cy="8" r="1" fill="currentColor"/><circle cx="15.5" cy="10" r="1" fill="currentColor"/><path d="M7 14a5 5 0 0 0 5 5c1.4 0 1.6-1.2.7-1.8-1-.7-.3-2.2 1-2.2h1.3A3 3 0 0 0 18 12"/></svg></div>
            <h3>UI/UX Design</h3>
            <p class="text-muted">User-centered interface and experience design that turns complex products into intuitive journeys.</p>
          </div>
          <div class="card reveal">
            <div class="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/><path d="M9 12l2 2 4-4"/></svg></div>
            <h3>Quality Assurance &amp; Testing</h3>
            <p class="text-muted">Rigorous manual and automated testing to ship secure, stable, bug-free software.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2 class="group-title reveal">Operations</h2>
        <div class="grid grid-3">
          <div class="card reveal">
            <div class="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="6" rx="1.5"/><rect x="4" y="14" width="16" height="6" rx="1.5"/><circle cx="8" cy="6" r="0.6" fill="currentColor"/><circle cx="8" cy="17" r="0.6" fill="currentColor"/></svg></div>
            <h3>Cloud &amp; DevOps Services</h3>
            <p class="text-muted">Cloud architecture, CI/CD pipelines, and infrastructure automation for reliable, scalable deployments.</p>
          </div>
          <div class="card reveal">
            <div class="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4l-3-3z"/></svg></div>
            <h3>Software Maintenance &amp; Support</h3>
            <p class="text-muted">Ongoing monitoring, updates, and support to keep your software running smoothly long after launch.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <h2 class="group-title reveal">Team &amp; Consulting</h2>
        <div class="grid grid-3">
          <div class="card reveal">
            <div class="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.4"/><path d="M15 20c0-2.6 1.8-4.7 4-5.4"/></svg></div>
            <h3>Dedicated Development Teams</h3>
            <p class="text-muted">Hand-picked, full-time engineering teams embedded with your business as a seamless extension of your in-house staff.</p>
          </div>
          <div class="card reveal">
            <div class="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="9" r="3.5"/><path d="M3 20c0-3.9 3.1-7 7-7s7 3.1 7 7"/><path d="M18 8v4M16 10h4"/></svg></div>
            <h3>IT Staff Augmentation</h3>
            <p class="text-muted">Flexible access to skilled developers and specialists to scale your existing team up or down on demand.</p>
          </div>
          <div class="card reveal">
            <div class="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.2 1 2.1h5c0-.9.4-1.7 1-2.1A6 6 0 0 0 12 3z"/></svg></div>
            <h3>Technology Consulting</h3>
            <p class="text-muted">Strategic guidance on architecture, tech stack, and product roadmap from experienced technology consultants.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container cta-banner-inner reveal">
        <h2>Not Sure Where to Start?</h2>
        <p class="text-muted">Tell us about your goals and we'll recommend the right service mix for your project.</p>
        <a href="contact.html" class="btn btn-primary">Talk to Our Team</a>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <img src="assets/images/logo.svg" alt="Nexxabyte" class="logo-mark">
        <p>Software development and technology outsourcing for startups, SMEs, and enterprises.</p>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="about.html">About</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Get in Touch</h4>
        <ul>
          <li><a href="mailto:inquiry@nexxabyte.com">inquiry@nexxabyte.com</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <p>&copy; 2026 Nexxabyte. All rights reserved.</p>
      </div>
    </div>
  </footer>
  <script src="assets/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 3: Verify in browser**

Run: `open services.html`.

Expected: "Services" nav link highlighted orange. All 12 services render as icon cards across four labeled groups (Development / Design & Quality / Operations / Team & Consulting), alternating white/light-gray section backgrounds. Each card shows a distinct icon, title, and description. CTA banner and footer at the bottom.

- [ ] **Step 4: Commit**

```bash
git add assets/css/pages.css services.html
git commit -m "Add Services page"
```

---

## Task 8: Contact Page with Form Validation

**Files:**
- Create: `contact.html`
- Modify: `assets/css/pages.css` (append `.contact-grid` and related)
- Modify: `assets/js/main.js` (add `initContactForm`)

**Interfaces:**
- Consumes: header/footer markup pattern (Task 3), `.page-hero` / `.lead-wide` (Task 4), `.form-group` / `.form-control` / `.form-error` / `.form-status` (Task 3).
- Produces: `.contact-grid`, `.contact-form`, `.contact-info` — scoped to this page. Produces `initContactForm()`, called from the existing `DOMContentLoaded` handler.

- [ ] **Step 1: Append to `assets/css/pages.css`**

```css
/* Contact page */
.contact-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 40px;
  align-items: start;
}

.contact-form textarea {
  resize: vertical;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (max-width: 860px) {
  .contact-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2: Add `initContactForm` to `assets/js/main.js`**

Insert after `initScrollReveal` and call it in the `DOMContentLoaded` handler:

```js
(function () {
  'use strict';

  function initNavToggle() {
    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('main-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    var links = nav.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    }
  }

  function initScrollReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < items.length; i++) {
        items[i].classList.add('is-visible');
      }
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    for (var j = 0; j < items.length; j++) {
      observer.observe(items[j]);
    }
  }

  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var status = document.getElementById('form-status');
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(group, hasError) {
      group.classList.toggle('has-error', hasError);
    }

    form.addEventListener('submit', function (event) {
      var valid = true;
      var requiredFields = form.querySelectorAll('[required]');

      for (var i = 0; i < requiredFields.length; i++) {
        var field = requiredFields[i];
        var group = field.closest('.form-group');
        var fieldValid = field.value.trim().length > 0;

        if (field.type === 'email' && fieldValid) {
          fieldValid = emailPattern.test(field.value.trim());
        }

        setError(group, !fieldValid);
        if (!fieldValid) valid = false;
      }

      if (!valid) {
        event.preventDefault();
        status.textContent = 'Please fix the highlighted fields.';
        status.className = 'form-status error';
      } else {
        status.textContent = 'Sending...';
        status.className = 'form-status';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNavToggle();
    initScrollReveal();
    initContactForm();
  });
})();
```

- [ ] **Step 3: Create `contact.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Nexxabyte — Start Your Project</title>
  <meta name="description" content="Get in touch with Nexxabyte to discuss your software development or technology outsourcing project.">
  <link rel="icon" type="image/svg+xml" href="assets/images/logo.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/variables.css">
  <link rel="stylesheet" href="assets/css/base.css">
  <link rel="stylesheet" href="assets/css/components.css">
  <link rel="stylesheet" href="assets/css/pages.css">
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a href="index.html" class="logo" aria-label="Nexxabyte home">
        <img src="assets/images/logo.svg" alt="Nexxabyte" class="logo-mark">
      </a>
      <nav class="main-nav" id="main-nav">
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="contact.html" class="active">Contact</a></li>
        </ul>
      </nav>
      <a href="contact.html" class="btn btn-primary btn-sm header-cta">Get a Quote</a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="main-nav">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <main>
    <section class="section page-hero">
      <div class="container">
        <span class="eyebrow">Contact Us</span>
        <h1>Let's Start Your Project</h1>
        <p class="text-muted lead-wide">Tell us about your idea and a member of our team will get back to you shortly.</p>
      </div>
    </section>

    <section class="section">
      <div class="container contact-grid">
        <form class="card contact-form reveal" id="contact-form" action="https://formspree.io/f/YOUR_FORMSPREE_ID" method="POST" novalidate>
          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" name="name" class="form-control" required>
            <span class="form-error">Please enter your name.</span>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" class="form-control" required>
            <span class="form-error">Please enter a valid email address.</span>
          </div>
          <div class="form-group">
            <label for="company">Company</label>
            <input type="text" id="company" name="company" class="form-control">
          </div>
          <div class="form-group">
            <label for="service">Service Interested In</label>
            <select id="service" name="service" class="form-control">
              <option value="">Select a service</option>
              <option>Custom Software Development</option>
              <option>Web Application Development</option>
              <option>Mobile App Development (iOS &amp; Android)</option>
              <option>SaaS Product Development</option>
              <option>AI &amp; Automation Solutions</option>
              <option>UI/UX Design</option>
              <option>Cloud &amp; DevOps Services</option>
              <option>Quality Assurance &amp; Testing</option>
              <option>Software Maintenance &amp; Support</option>
              <option>Dedicated Development Teams</option>
              <option>IT Staff Augmentation</option>
              <option>Technology Consulting</option>
              <option>Other / Not Sure</option>
            </select>
          </div>
          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="5" class="form-control" required></textarea>
            <span class="form-error">Please tell us a bit about your project.</span>
          </div>
          <button type="submit" class="btn btn-primary">Send Message</button>
          <p class="form-status" id="form-status" role="status"></p>
        </form>

        <div class="contact-info reveal">
          <div class="card">
            <h3>Email Us</h3>
            <p><a href="mailto:inquiry@nexxabyte.com">inquiry@nexxabyte.com</a></p>
          </div>
          <div class="card">
            <h3>What Happens Next?</h3>
            <p class="text-muted">We'll review your message and respond within 1-2 business days to schedule a free consultation.</p>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <img src="assets/images/logo.svg" alt="Nexxabyte" class="logo-mark">
        <p>Software development and technology outsourcing for startups, SMEs, and enterprises.</p>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="about.html">About</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Get in Touch</h4>
        <ul>
          <li><a href="mailto:inquiry@nexxabyte.com">inquiry@nexxabyte.com</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <p>&copy; 2026 Nexxabyte. All rights reserved.</p>
      </div>
    </div>
  </footer>
  <script src="assets/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: Verify in browser**

Run: `open contact.html`.

Expected: Two-column layout — form on the left, contact info cards on the right (stacks to one column under 860px). Click "Send Message" with all fields empty: Name, Email, and Message fields show orange error borders and the inline error text appears under each; status line reads "Please fix the highlighted fields." in orange. Fill in Name, a malformed email (e.g. `test`), and a Message, submit again: email field still shows its error. Fill in a valid email and resubmit: validation passes, status briefly reads "Sending..." (the browser will then attempt to POST to the placeholder Formspree URL and fail/404, which is expected until the user supplies a real form ID in Task 9's README step).

- [ ] **Step 5: Commit**

```bash
git add assets/css/pages.css assets/js/main.js contact.html
git commit -m "Add Contact page with form validation"
```

---

## Task 9: README with Setup Instructions

**Files:**
- Create: `README.md`

**Interfaces:**
- None (documentation only).

- [ ] **Step 1: Create `README.md`**

```markdown
# Nexxabyte Website

Static marketing website for Nexxabyte — Software Development & Technology Outsourcing.

## Running locally

No build step required. Either:

- Open `index.html` directly in a browser, or
- Serve the folder with a local static server (recommended, avoids any
  browser file:// quirks):

  ```bash
  python3 -m http.server 8000
  ```

  Then visit `http://localhost:8000`.

## Project structure

```
index.html, about.html, services.html, contact.html   Pages
assets/css/variables.css                               Brand colors, type scale, spacing tokens
assets/css/base.css                                     Reset, typography, layout primitives
assets/css/components.css                                Header, footer, buttons, cards, forms
assets/css/pages.css                                      Page-specific section styles
assets/js/main.js                                          Mobile nav toggle, scroll-reveal, form validation
assets/images/logo.svg                                      Nexxabyte logo
```

## Before going live — required setup

1. **Contact form (Formspree):**
   - Create a free account at formspree.io and create a new form.
   - In `contact.html`, find the `<form>` tag and replace
     `YOUR_FORMSPREE_ID` in `action="https://formspree.io/f/YOUR_FORMSPREE_ID"`
     with your real Formspree form ID.
   - Submit a test message from the live site to confirm delivery.

2. **Contact email:** The placeholder email `inquiry@nexxabyte.com` appears
   in `contact.html`'s info card and in every page's footer. Replace it with
   your real company email (find-and-replace across all 4 HTML files).

3. **Social links:** Commented-out social link placeholders are not yet
   present in the footer. Add a `<ul class="social-links">` with real
   LinkedIn/social URLs in the footer's "Get in Touch" column on all 4 pages
   when available.

4. **Photography:** Hero (`index.html`) and About (`about.html`) currently
   use placeholder photos from picsum.photos. Replace the `src` attributes
   on `.hero-photo` and `.rounded-photo` with real company photography when
   available, and update the `alt` text accordingly.

## Deployment

This is a static site — deploy by pointing any static host (Vercel,
Netlify, GitHub Pages, S3 + CloudFront, etc.) at this folder. No build
command is needed.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "Add README with setup and deployment instructions"
```

---

## Task 10: Cross-Page QA Pass

**Files:**
- Modify: any of the above, if QA finds issues (no new files expected)

**Interfaces:**
- None — this is a verification-only task.

- [ ] **Step 1: Serve the site locally**

```bash
python3 -m http.server 8000
```

- [ ] **Step 2: Verify navigation and active states**

Visit `http://localhost:8000/index.html`, `/about.html`, `/services.html`, `/contact.html`. On each page, confirm: the corresponding nav link is highlighted orange (`active` class on the right `<a>`), all four nav links navigate correctly, the logo links back to Home, and the footer is identical across all 4 pages.

- [ ] **Step 3: Verify responsive behavior at 375px, 768px, 1440px widths**

Using browser dev tools' device toolbar, check each page at these three widths: no horizontal scrollbar, hamburger menu appears and functions below 860px, grids collapse to single/double column as designed (`.grid-3` → 1 column under 860px, `.process-steps` → 2 columns under 960px → 1 column under 600px, `.hero-inner` / `.about-intro` / `.contact-grid` → 1 column under 860–960px).

- [ ] **Step 4: Verify console is clean**

Open browser dev tools Console on each of the 4 pages. Expected: no JavaScript errors. (404s for the placeholder Formspree action on form submit are expected and acceptable — documented in README.)

- [ ] **Step 5: Verify all internal links**

Click every nav link, every footer link, every CTA button (`Get a Free Consultation`, `View Services`, `Learn More About Us`, `View All Services`, `Talk to Our Team`, `Get in Touch`, `Get a Quote`) on all 4 pages. Expected: every link resolves to the correct page, no `404` or broken anchors.

- [ ] **Step 6: Fix any issues found, then commit**

If QA finds issues, fix them in the relevant file(s), then:

```bash
git add -A
git commit -m "Fix cross-page QA issues"
```

If no issues are found, skip the commit (nothing to commit).
